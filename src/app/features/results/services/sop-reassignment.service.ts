import { Injectable, inject } from '@angular/core';
import {
  collection,
  deleteField,
  doc,
  FieldPath,
  getDoc,
  getDocs,
  increment,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { AuthService } from '../../../core/services/auth.service';
import { ActivityEventService } from '../../../core/services/activity-event.service';
import { CalculatorService } from '../../../core/services/calculator.service';
import { FirebaseService } from '../../../core/services/firebase.service';
import { StateService } from '../../../core/services/state.service';
import { Request } from '../../../core/models/request.model';
import { CalculatedItem, Sop } from '../../../core/models/sop.model';
import { PrintData } from '../../../core/models/log.model';
import { sanitizeForFirebase } from '../../../shared/utils/utils';
import { timestampToDate } from '../../../shared/utils/timestamp';
import {
  DAILY_CHECKLIST_SCHEMA_VERSION,
  buildDailyChecklistEntry
} from '../../../core/utils/daily-checklist-projection';
import { buildTargetScopeSnapshots } from '../../targets/target-scope-classifier';
import { TargetService } from '../../targets/target.service';
import { RecipeService } from '../../recipes/recipe.service';
import { ANGULAR_SOP_CONFIG, resolveConfigKey } from '../config/sop-configs';
import { getCanonicalId } from '../shared/compound-id-resolver';
import { validateCalculatedItems } from '../../batch/smart-batch.utils';
import {
  buildReassignmentInputs,
  buildReassignmentTargetMetadata,
  calculateInventoryDelta,
  calculatedItemsToRequestItems,
  getMissingTargetIds,
  getSopReassignmentBlockReason,
  getSopReassignmentSourceSignature,
  transferSopStatsForDay
} from './sop-reassignment.utils';

export interface SopReassignmentPreview {
  request: Request;
  sourceSop: Sop;
  targetSop: Sop;
  configKey: string;
  formInputs: Record<string, any>;
  calculatedItems: CalculatedItem[];
  inventoryDelta: Record<string, number>;
  changedInventoryCount: number;
}

@Injectable({ providedIn: 'root' })
export class SopReassignmentService {
  private readonly fb = inject(FirebaseService);
  private readonly auth = inject(AuthService);
  private readonly state = inject(StateService);
  private readonly calculator = inject(CalculatorService);
  private readonly recipes = inject(RecipeService);
  private readonly targetService = inject(TargetService);
  private readonly activityEvents = inject(ActivityEventService);

  async getCandidates(request: Request): Promise<Sop[]> {
    const blockReason = getSopReassignmentBlockReason(request);
    if (blockReason) return [];
    return this.state.sops().filter(sop => {
      if (sop.id === request.sopId || sop.isArchived) return false;
      const configKey = resolveConfigKey(sop.id, sop.name, sop);
      if (!configKey || !ANGULAR_SOP_CONFIG[configKey]) return false;
      return getMissingTargetIds(request, sop).length === 0;
    });
  }

  async preview(requestId: string, targetSopId: string): Promise<SopReassignmentPreview> {
    this.assertPermission();
    const requestDoc = await getDoc(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId));
    if (!requestDoc.exists()) throw new Error('Không tìm thấy mẻ cần chuyển SOP.');
    return this.preparePreview({ id: requestId, ...requestDoc.data() } as Request, targetSopId, true);
  }

  async reassign(
    requestId: string,
    expectedSourceSopId: string,
    targetSopId: string,
    note = ''
  ): Promise<Request> {
    this.assertPermission();

    const requestDoc = await getDoc(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId));
    if (!requestDoc.exists()) throw new Error('Không tìm thấy mẻ cần chuyển SOP.');
    const sourceRequest = { id: requestId, ...requestDoc.data() } as Request;
    if (sourceRequest.sopId !== expectedSourceSopId) {
      throw new Error('Mẻ đã thay đổi SOP kể từ khi mở hộp thoại. Vui lòng tải lại và thử lại.');
    }
    const sourceSignature = getSopReassignmentSourceSignature(sourceRequest);

    const preview = await this.preparePreview(sourceRequest, targetSopId, true);
    const targetMetadata = buildReassignmentTargetMetadata(sourceRequest, preview.targetSop);
    const targetNames = Object.fromEntries((preview.targetSop.targets || []).map(target => [
      getCanonicalId(target.name || target.id), target.name
    ]));
    const targetGroups = await this.targetService.getAllGroups().catch(() => []);
    const targetScopeSnapshots = sanitizeForFirebase(buildTargetScopeSnapshots({
      sampleTargetMap: targetMetadata.sampleTargetMap,
      fallbackTargetIds: targetMetadata.targetIds,
      sopId: preview.targetSop.id,
      sopVersion: preview.targetSop.version || 1,
      sopTargetSnapshot: targetNames,
      availableGroups: targetGroups,
      explicitGroupId: preview.formInputs['explicitGroupId']
    }));
    const newItems = calculatedItemsToRequestItems(preview.calculatedItems, this.state.inventoryMap());
    const inventoryDelta = calculateInventoryDelta(sourceRequest.items || [], newItems);
    const previousPrintableLogs = (await getDocs(query(
      collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'),
      where('requestId', '==', requestId),
      where('printable', '==', true)
    ))).docs;

    const requestRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId);
    const detailRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'results_details', requestId);
    const printJobRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'print_jobs'));
    const activityRef = this.activityEvents.createRef();
    const statsKeys = this.statsKeys(sourceRequest);
    const statsRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'monthly_stats', statsKeys.monthKey);
    const dailyRef = sourceRequest.analysisDate
      ? doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'daily_checklists', sourceRequest.analysisDate)
      : null;
    const inventoryIds = Object.keys(inventoryDelta);
    const inventoryRefs = inventoryIds.map(id => doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id));
    const actor = this.auth.currentUser();
    const newInputs = sanitizeForFirebase(preview.formInputs);
    const updatedProjection: Request = {
      ...sourceRequest,
      sopId: preview.targetSop.id,
      sopName: preview.targetSop.name,
      sopVersion: preview.targetSop.version || 1,
      sopRef: preview.targetSop.ref || '',
      status: 'approved',
      items: newItems,
      inputs: newInputs,
      margin: Number(newInputs['safetyMargin'] ?? sourceRequest.margin ?? -1),
      targetIds: targetMetadata.targetIds,
      sampleTargetMap: targetMetadata.sampleTargetMap,
      targetNames,
      targetScopeSnapshots,
      resultStatusReason: 'sop_reassigned',
      analysisResult: undefined,
      analysisResultSummary: undefined,
      lockedBy: undefined,
      lockedByName: undefined,
      lockedAt: undefined,
      lastActiveAt: undefined
    };

    await runTransaction(this.fb.db, async transaction => {
      const freshSnap = await transaction.get(requestRef);
      if (!freshSnap.exists()) throw new Error('Mẻ không còn tồn tại.');
      const fresh = { id: requestId, ...freshSnap.data() } as Request;
      if (fresh.sopId !== expectedSourceSopId) {
        throw new Error('Mẻ đã thay đổi SOP bởi một thao tác khác. Không có dữ liệu nào được cập nhật.');
      }
      const freshBlock = getSopReassignmentBlockReason(fresh);
      if (freshBlock) throw new Error(freshBlock);
      this.assertLockAvailable(fresh);

      // The preview is calculated from the same immutable business inputs
      // that were shown in the confirmation modal. Refuse to continue if a
      // concurrent edit changed the request while the modal was open.
      if (getSopReassignmentSourceSignature(fresh) !== sourceSignature) {
        throw new Error('Mẻ đã thay đổi kể từ khi mở hộp thoại. Không có dữ liệu nào được cập nhật.');
      }

      const detailSnap = await transaction.get(detailRef);
      const inventorySnaps = await Promise.all(inventoryRefs.map(ref => transaction.get(ref)));
      const statsSnap = await transaction.get(statsRef);
      const dailySnap = dailyRef ? await transaction.get(dailyRef) : null;

      inventorySnaps.forEach((snap, index) => {
        const itemId = inventoryIds[index];
        if (!snap.exists()) throw new Error(`Vật tư "${itemId}" không còn tồn tại trong kho.`);
        const nextStock = Number(snap.data()['stock'] || 0) + inventoryDelta[itemId];
        if (!Number.isFinite(nextStock) || nextStock < -0.000001) {
          throw new Error(`Kho không đủ "${snap.data()['name'] || itemId}" sau khi chuyển SOP.`);
        }
      });

      inventoryRefs.forEach((ref, index) => transaction.update(ref, {
        stock: increment(inventoryDelta[inventoryIds[index]]),
        lastSopReassignmentRequestId: requestId,
        lastUpdated: serverTimestamp()
      }));

      transaction.update(requestRef, sanitizeForFirebase({
        sopId: preview.targetSop.id,
        sopName: preview.targetSop.name,
        sopVersion: preview.targetSop.version || 1,
        sopRef: preview.targetSop.ref || '',
        items: newItems,
        inputs: newInputs,
        margin: Number(newInputs['safetyMargin'] ?? sourceRequest.margin ?? -1),
        analysisDate: sourceRequest.analysisDate,
        sampleList: sourceRequest.sampleList || newInputs['sampleList'] || [],
        sampleDescriptionMap: sourceRequest.sampleDescriptionMap || newInputs['sampleDescriptionMap'],
        targetIds: targetMetadata.targetIds,
        sampleTargetMap: targetMetadata.sampleTargetMap,
        targetNames,
        targetScopeSnapshots,
        status: 'approved',
        resultStatusReason: 'sop_reassigned',
        analysisResult: deleteField(),
        analysisResultSummary: deleteField(),
        lockedBy: deleteField(),
        lockedByName: deleteField(),
        lockedAt: deleteField(),
        lastActiveAt: deleteField(),
        lastUpdated: serverTimestamp()
      }));

      if (detailSnap.exists()) transaction.delete(detailRef);

      const sampleCount = sourceRequest.sampleList?.length || Number(sourceRequest.inputs?.n_sample || 1);
      const qcCount = Number(sourceRequest.inputs?.n_qc || 0);
      if (statsSnap.exists()) {
        const transferredStats = transferSopStatsForDay(
          statsSnap.data(),
          statsKeys.dayKey,
          sourceRequest.sopName || sourceRequest.sopId,
          preview.targetSop.name || preview.targetSop.id,
          sampleCount,
          1,
          qcCount
        );
        transaction.set(statsRef, transferredStats);
      }

      const dailyEntry = buildDailyChecklistEntry(updatedProjection);
      if (dailyEntry && dailyRef && updatedProjection.analysisDate) {
        if (dailySnap?.exists()) {
          transaction.update(
            dailyRef,
            new FieldPath('entries', requestId), sanitizeForFirebase(dailyEntry),
            'schemaVersion', DAILY_CHECKLIST_SCHEMA_VERSION,
            'analysisDate', updatedProjection.analysisDate,
            'updatedAt', serverTimestamp(),
            'lastSopReassignmentRequestId', requestId
          );
        } else {
          transaction.set(dailyRef, sanitizeForFirebase({
            schemaVersion: DAILY_CHECKLIST_SCHEMA_VERSION,
            analysisDate: updatedProjection.analysisDate,
            updatedAt: serverTimestamp(),
            lastSopReassignmentRequestId: requestId,
            entries: { [requestId]: dailyEntry }
          }));
        }
      }

      previousPrintableLogs.forEach(logDoc => transaction.update(logDoc.ref, {
        printable: false,
        supersededBy: activityRef.id,
        lastUpdated: serverTimestamp()
      }));

      const printData: PrintData = {
        sop: preview.targetSop,
        inputs: newInputs,
        margin: Number(newInputs['safetyMargin'] ?? 0),
        items: preview.calculatedItems,
        analysisDate: sourceRequest.analysisDate,
        requestId
      };
      transaction.set(printJobRef, {
        ...sanitizeForFirebase(printData),
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        createdBy: actor?.displayName || actor?.email || actor?.uid || 'Unknown',
        createdByUid: actor?.uid || ''
      });

      const activity = this.activityEvents.build({
        eventId: activityRef.id,
        action: 'REASSIGN_SOP',
        details: `Chuyển SOP cho mẻ ${requestId}: ${sourceRequest.sopName} → ${preview.targetSop.name}`,
        targetType: 'REQUEST',
        targetId: requestId,
        targetName: preview.targetSop.name,
        requestId,
        printable: true,
        printJobId: printJobRef.id,
        publicTraceable: true,
        metadata: {
          fromSopId: sourceRequest.sopId,
          fromSopName: sourceRequest.sopName,
          fromSopVersion: sourceRequest.sopVersion,
          toSopId: preview.targetSop.id,
          toSopName: preview.targetSop.name,
          toSopVersion: preview.targetSop.version || 1,
          previousResultStatus: sourceRequest.status,
          resultDataCleared: true,
          reasonCode: 'CUSTOMER_REQUIRED_SOP',
          note: note.trim() || undefined,
          analysisDate: sourceRequest.analysisDate
        },
        legacyFields: {
          inventoryDeltas: inventoryDelta,
          supersedesLogIds: previousPrintableLogs.map(item => item.id),
          sopBasicInfo: { name: preview.targetSop.name, category: preview.targetSop.category, ref: preview.targetSop.ref }
        }
      });
      this.activityEvents.setInTransaction(transaction, activityRef, activity);
    });

    const currentInventory = this.state.inventoryMap();
    const localInventoryUpdates = inventoryIds.flatMap(id => {
      const item = currentInventory[id];
      return item ? [{ ...item, stock: Number(item.stock || 0) + inventoryDelta[id] }] : [];
    });
    if (localInventoryUpdates.length) this.state.publishInventoryChanges(localInventoryUpdates);
    this.state.publishRequestChanges([updatedProjection]);
    return updatedProjection;
  }

  private async preparePreview(
    request: Request,
    targetSopId: string,
    checkHistory: boolean
  ): Promise<SopReassignmentPreview> {
    const blockReason = getSopReassignmentBlockReason(request);
    if (blockReason) throw new Error(blockReason);
    this.assertLockAvailable(request);
    if (checkHistory) {
      const history = await getDocs(query(
        collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', request.id, 'history'),
        limit(1)
      ));
      if (!history.empty) throw new Error('Mẻ đã có lịch sử báo cáo. Chuyển SOP trực tiếp đã bị khóa để bảo toàn truy vết.');
    }

    const sourceSop = this.state.sops().find(sop => sop.id === request.sopId);
    const targetSop = this.state.sops().find(sop => sop.id === targetSopId);
    if (!sourceSop) throw new Error('Không tìm thấy SOP hiện tại trong danh mục đang hoạt động.');
    if (!targetSop || targetSop.isArchived) throw new Error('SOP đích không tồn tại hoặc đã ngừng sử dụng.');
    if (targetSop.id === request.sopId) throw new Error('SOP đích phải khác SOP hiện tại.');
    const configKey = resolveConfigKey(targetSop.id, targetSop.name, targetSop);
    if (!configKey || !ANGULAR_SOP_CONFIG[configKey]) throw new Error('SOP đích chưa có biểu mẫu nhập kết quả tương ứng.');
    const missingTargets = getMissingTargetIds(request, targetSop);
    if (missingTargets.length) throw new Error(`SOP đích chưa phủ đủ ${missingTargets.length} chỉ tiêu của mẻ.`);

    const formInputs = buildReassignmentInputs(request, targetSop);
    const recipeList = await this.recipes.getAllRecipes();
    const recipeMap = Object.fromEntries(recipeList.map(recipe => [recipe.id, recipe]));
    const calculatedItems = this.calculator.calculateSopNeeds(
      targetSop,
      formInputs,
      Number(formInputs['safetyMargin'] ?? -1),
      this.state.inventoryMap(),
      recipeMap,
      this.state.safetyConfig()
    );
    const validationIssues = validateCalculatedItems(calculatedItems, Number(formInputs['safetyMargin'] ?? -1));
    if (validationIssues.length) throw new Error(validationIssues[0].message);
    const newItems = calculatedItemsToRequestItems(calculatedItems, this.state.inventoryMap());
    const inventoryDelta = calculateInventoryDelta(request.items || [], newItems);

    return {
      request,
      sourceSop,
      targetSop,
      configKey,
      formInputs,
      calculatedItems,
      inventoryDelta,
      changedInventoryCount: Object.keys(inventoryDelta).length
    };
  }

  private assertPermission(): void {
    if (!this.auth.canApprove()) throw new Error('Bạn không có quyền chuyển SOP cho mẻ đã duyệt.');
  }

  private assertLockAvailable(request: Request): void {
    const currentUser = this.auth.currentUser();
    if (!request.lockedBy || !currentUser || request.lockedBy.toLowerCase() === currentUser.email.toLowerCase()) return;
    const lastActive = timestampToDate(request.lastActiveAt);
    if (lastActive && Date.now() - lastActive.getTime() > 3 * 60 * 1000) return;
    throw new Error(`Mẻ đang được ${request.lockedByName || 'người dùng khác'} chỉnh sửa. Không thể chuyển SOP lúc này.`);
  }

  private statsKeys(request: Request): { monthKey: string; dayKey: string } {
    const dayKey = request.analysisDate || (() => {
      const date = timestampToDate(request.approvedAt || request.timestamp) || new Date();
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    })();
    return { monthKey: dayKey.slice(0, 7), dayKey };
  }

}
