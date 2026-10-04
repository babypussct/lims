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
  serverTimestamp
} from 'firebase/firestore';
import { AuthService } from '../../../core/services/auth.service';
import { ActivityEventService } from '../../../core/services/activity-event.service';
import { CalculatorService } from '../../../core/services/calculator.service';
import { FirebaseService } from '../../../core/services/firebase.service';
import { StateService } from '../../../core/services/state.service';
import { Request } from '../../../core/models/request.model';
import { AnalysisResultDraft } from '../../../core/models/analysis-result.model';
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
import { resolveConfigKey } from '../config/sop-configs';
import { getCanonicalId } from '../shared/compound-id-resolver';
import { validateCalculatedItems } from '../../batch/smart-batch.utils';
import {
  buildReassignmentInputs,
  buildReassignmentTargetMetadata,
  calculateInventoryDelta,
  calculatedItemsToRequestItems,
  getSopReassignmentBlockReason,
  getSopReassignmentOptions,
  getSopReassignmentSourceSignature,
  getSopReassignmentTargetBlockReason,
  SopReassignmentOption,
  partitionSopReassignment,
  retainSopSplitResults,
  splitSopStatsForDay,
  transferSopStatsForDay
} from './sop-reassignment.utils';

export interface SopReassignmentPreview {
  request: Request;
  movingRequest: Request;
  remainingRequest: Request | null;
  remainingCalculatedItems: CalculatedItem[];
  sourceSop: Sop;
  targetSop: Sop;
  configKey: string;
  formInputs: Record<string, any>;
  calculatedItems: CalculatedItem[];
  inventoryDelta: Record<string, number>;
  changedInventoryCount: number;
}

export interface SopReassignmentResult {
  sourceRequest: Request;
  targetRequest: Request;
  sourceDraft: AnalysisResultDraft | null;
  isPartial: boolean;
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

  async getOptions(request: Request, selectedSamples?: readonly string[]): Promise<SopReassignmentOption[]> {
    return getSopReassignmentOptions(partitionSopReassignment(request, selectedSamples).moving, this.state.sops());
  }

  async preview(requestId: string, targetSopId: string, selectedSamples?: readonly string[]): Promise<SopReassignmentPreview> {
    this.assertPermission();
    const requestDoc = await getDoc(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId));
    if (!requestDoc.exists()) throw new Error('Không tìm thấy mẻ cần chuyển SOP.');
    return this.preparePreview({ id: requestId, ...requestDoc.data() } as Request, targetSopId, true, selectedSamples);
  }

  async reassign(
    requestId: string,
    expectedSourceSopId: string,
    targetSopId: string,
    note = '',
    selectedSamples?: readonly string[],
    expectedSourceSignature?: string
  ): Promise<SopReassignmentResult> {
    this.assertPermission();

    const requestDoc = await getDoc(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId));
    if (!requestDoc.exists()) throw new Error('Không tìm thấy mẻ cần chuyển SOP.');
    const sourceRequest = { id: requestId, ...requestDoc.data() } as Request;
    if (sourceRequest.sopId !== expectedSourceSopId) {
      throw new Error('Mẻ đã thay đổi SOP kể từ khi mở hộp thoại. Vui lòng tải lại và thử lại.');
    }
    const sourceSignature = getSopReassignmentSourceSignature(sourceRequest);
    if (expectedSourceSignature && sourceSignature !== expectedSourceSignature) {
      throw new Error('Thông số hoặc danh sách mẫu đã thay đổi. Vui lòng mở lại hộp thoại chuyển SOP.');
    }

    const preview = await this.preparePreview(sourceRequest, targetSopId, true, selectedSamples);
    const isPartial = !!preview.remainingRequest;
    const targetMetadata = buildReassignmentTargetMetadata(preview.movingRequest, preview.targetSop, preview.sourceSop);
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
    const remainingItems = calculatedItemsToRequestItems(preview.remainingCalculatedItems, this.state.inventoryMap());
    const inventoryDelta = calculateInventoryDelta(sourceRequest.items || [], [...newItems, ...remainingItems]);
    const requestRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId);
    const detailRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'results_details', requestId);
    const printJobRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'print_jobs'));
    const targetRef = isPartial ? doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests')) : requestRef;
    const sourcePrintRef = isPartial ? doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'print_jobs')) : printJobRef;
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
      ...preview.movingRequest,
      id: targetRef.id,
      currentPrintJobId: printJobRef.id,
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
      resultStatusReason: isPartial ? 'sop_split_created' : 'sop_reassigned',
      analysisResult: undefined,
      analysisResultSummary: undefined,
      lockedBy: undefined,
      lockedByName: undefined,
      lockedAt: undefined,
      lastActiveAt: undefined
    };
    if (isPartial) {
      updatedProjection.sopSplitSourceRequestId = requestId;
      delete updatedProjection.lastSopSplitRequestId;
      updatedProjection.user = actor?.displayName || actor?.email || actor?.uid || 'Unknown';
      updatedProjection.createdByUid = actor?.uid;
    }
    const remainingProjection: Request | null = preview.remainingRequest ? {
      ...preview.remainingRequest, items: remainingItems, currentPrintJobId: sourcePrintRef.id,
      lastSopSplitRequestId: targetRef.id, resultStatusReason: 'sop_split_source'
    } : null;
    let retainedDraft: AnalysisResultDraft | null = null;
    const committedStocks: Record<string, number> = {};

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
      if (isPartial) {
        const legacy = fresh.analysisResult;
        const summary = fresh.analysisResultSummary;
        const detail = detailSnap.exists() ? detailSnap.data() : null;
        const result = { ...legacy, ...summary, ...detail };
        if (result['pdfUrl'] || result['pdfViewUrl'] || result['docsUrl'] || result['publishedBackup']
          || result['pdfHistory']?.length || Object.keys(result['reports'] || {}).length) {
          throw new Error('Mẻ đã có báo cáo được phát hành, không thể tách chuyển SOP.');
        }
        if (legacy || detail) {
          retainedDraft = retainSopSplitResults({
            ...result, id: requestId, requestId, sopId: fresh.sopId, sopName: fresh.sopName,
            status: 'draft', page1Data: result['page1Data'] || {}, resultData: result['resultData'] || {},
            updatedAt: new Date().toISOString(), updatedBy: actor?.displayName || actor?.email || 'Unknown'
          } as AnalysisResultDraft, preview.movingRequest.sampleList || []);
        }
      }

      inventorySnaps.forEach((snap, index) => {
        const itemId = inventoryIds[index];
        if (!snap.exists()) throw new Error(`Vật tư "${itemId}" không còn tồn tại trong kho.`);
        const nextStock = Number(snap.data()['stock'] || 0) + inventoryDelta[itemId];
        if (!Number.isFinite(nextStock) || nextStock < -0.000001) {
          throw new Error(`Kho không đủ "${snap.data()['name'] || itemId}" sau khi chuyển SOP.`);
        }
        committedStocks[itemId] = nextStock;
      });

      inventoryRefs.forEach((ref, index) => transaction.update(ref, {
        stock: increment(inventoryDelta[inventoryIds[index]]),
        lastSopReassignmentRequestId: requestId,
        lastUpdated: serverTimestamp()
      }));

      if (remainingProjection) {
        remainingProjection.status = fresh.status;
        remainingProjection.analysisResultSummary = fresh.analysisResultSummary;
        remainingProjection.lockedBy = fresh.lockedBy;
        remainingProjection.lockedByName = fresh.lockedByName;
        remainingProjection.lockedAt = fresh.lockedAt;
        remainingProjection.lastActiveAt = fresh.lastActiveAt;
        // Keep the original SOP, QC and untouched result rows on the source batch.
        const remainingMetadata = buildReassignmentTargetMetadata(remainingProjection, preview.sourceSop, preview.sourceSop);
        remainingProjection.targetScopeSnapshots = sanitizeForFirebase(buildTargetScopeSnapshots({
          sampleTargetMap: remainingMetadata.sampleTargetMap, fallbackTargetIds: remainingMetadata.targetIds,
          sopId: preview.sourceSop.id, sopVersion: sourceRequest.sopVersion || preview.sourceSop.version || 1,
          sopTargetSnapshot: sourceRequest.targetNames || {}, availableGroups: targetGroups,
          explicitGroupId: remainingProjection.inputs?.['explicitGroupId']
        }));
        if (fresh.analysisResult) remainingProjection.analysisResult = retainSopSplitResults(fresh.analysisResult, preview.movingRequest.sampleList || []);
        transaction.update(requestRef, sanitizeForFirebase({
          sampleList: remainingProjection.sampleList, sampleTargetMap: remainingProjection.sampleTargetMap,
          sampleDescriptionMap: remainingProjection.sampleDescriptionMap, targetIds: remainingProjection.targetIds,
          targetScopeSnapshots: remainingProjection.targetScopeSnapshots, inputs: remainingProjection.inputs,
          items: remainingItems, currentPrintJobId: sourcePrintRef.id, lastSopSplitRequestId: targetRef.id,
          resultStatusReason: 'sop_split_source', lastUpdated: serverTimestamp(),
          ...(fresh.analysisResult ? { analysisResult: remainingProjection.analysisResult } : {})
        }));
        transaction.set(targetRef, {
          ...sanitizeForFirebase(updatedProjection), timestamp: serverTimestamp(), approvedAt: serverTimestamp(), lastUpdated: serverTimestamp()
        });
        if (retainedDraft) transaction.set(detailRef, sanitizeForFirebase(retainedDraft));
      } else transaction.update(requestRef, sanitizeForFirebase({
        sopId: preview.targetSop.id,
        currentPrintJobId: printJobRef.id,
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

      if (!isPartial && detailSnap.exists()) transaction.delete(detailRef);

      const sampleCount = sourceRequest.sampleList?.length || Number(sourceRequest.inputs?.n_sample || 1);
      const qcCount = Number(sourceRequest.inputs?.n_qc || 0);
      if (statsSnap.exists()) {
        const transferredStats = isPartial ? splitSopStatsForDay(
          statsSnap.data(), statsKeys.dayKey, sourceRequest.sopName || sourceRequest.sopId,
          preview.targetSop.name || preview.targetSop.id, preview.movingRequest.sampleList?.length || 0,
          Number(newInputs['n_qc'] || 0)
        ) : transferSopStatsForDay(
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

      const dailyProjections = remainingProjection ? [remainingProjection, updatedProjection] : [updatedProjection];
      const dailyEntries = Object.fromEntries(dailyProjections.flatMap(projection => {
        const entry = buildDailyChecklistEntry(projection);
        return entry ? [[projection.id, sanitizeForFirebase(entry)]] : [];
      }));
      if (Object.keys(dailyEntries).length && dailyRef && updatedProjection.analysisDate) {
        if (dailySnap?.exists()) {
          const entryUpdates: any[] = Object.entries(dailyEntries).flatMap(([id, entry]) => [new FieldPath('entries', id), entry]);
          transaction.update(dailyRef,
            'schemaVersion', DAILY_CHECKLIST_SCHEMA_VERSION,
            'analysisDate', updatedProjection.analysisDate,
            'updatedAt', serverTimestamp(),
            'lastSopReassignmentRequestId', requestId,
            ...entryUpdates
          );
        } else {
          transaction.set(dailyRef, sanitizeForFirebase({
            schemaVersion: DAILY_CHECKLIST_SCHEMA_VERSION,
            analysisDate: updatedProjection.analysisDate,
            updatedAt: serverTimestamp(),
            lastSopReassignmentRequestId: requestId,
            entries: dailyEntries
          }));
        }
      }

      const printData: PrintData = {
        traceLogId: activityRef.id,
        sop: preview.targetSop,
        inputs: newInputs,
        margin: Number(newInputs['safetyMargin'] ?? 0),
        items: preview.calculatedItems,
        analysisDate: sourceRequest.analysisDate,
        requestId: targetRef.id
      };
      transaction.set(printJobRef, {
        ...sanitizeForFirebase(printData),
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        createdBy: actor?.displayName || actor?.email || actor?.uid || 'Unknown',
        createdByUid: actor?.uid || ''
      });
      if (remainingProjection) transaction.set(sourcePrintRef, {
        ...sanitizeForFirebase({ ...printData, requestId, sop: preview.sourceSop, inputs: remainingProjection.inputs,
          margin: Number(remainingProjection.inputs?.['safetyMargin'] ?? remainingProjection.margin ?? -1), items: preview.remainingCalculatedItems }),
        createdAt: serverTimestamp(), lastUpdated: serverTimestamp(),
        createdBy: actor?.displayName || actor?.email || actor?.uid || 'Unknown', createdByUid: actor?.uid || ''
      });

      const activity = this.activityEvents.build({
        eventId: activityRef.id,
        action: 'REASSIGN_SOP',
        details: isPartial
          ? `Tách ${preview.movingRequest.sampleList?.length} mẫu từ mẻ ${requestId} sang mẻ ${targetRef.id}: ${sourceRequest.sopName} → ${preview.targetSop.name}`
          : `Chuyển SOP cho mẻ ${requestId}: ${sourceRequest.sopName} → ${preview.targetSop.name}`,
        targetType: 'REQUEST',
        targetId: targetRef.id,
        targetName: preview.targetSop.name,
        requestId: targetRef.id,
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
          isPartial, sourceRequestId: requestId, targetRequestId: targetRef.id,
          movedSamples: preview.movingRequest.sampleList,
          movedSampleCount: preview.movingRequest.sampleList?.length || 0,
          reasonCode: 'CUSTOMER_REQUIRED_SOP',
          note: note.trim() || undefined,
          analysisDate: sourceRequest.analysisDate
        },
        legacyFields: {
          inventoryDeltas: inventoryDelta,
          previousPrintJobId: sourceRequest.currentPrintJobId || null,
          sopBasicInfo: { name: preview.targetSop.name, category: preview.targetSop.category, ref: preview.targetSop.ref }
        }
      });
      this.activityEvents.setInTransaction(transaction, activityRef, activity);
    });

    const currentInventory = this.state.inventoryMap();
    const localInventoryUpdates = inventoryIds.flatMap(id => {
      const item = currentInventory[id];
      return item ? [{ ...item, stock: committedStocks[id] }] : [];
    });
    if (localInventoryUpdates.length) this.state.publishInventoryChanges(localInventoryUpdates);
    this.state.publishRequestChanges(remainingProjection ? [remainingProjection, updatedProjection] : [updatedProjection]);
    return { sourceRequest: remainingProjection || updatedProjection, targetRequest: updatedProjection, sourceDraft: retainedDraft, isPartial };
  }

  private async preparePreview(
    request: Request,
    targetSopId: string,
    checkHistory: boolean,
    selectedSamples?: readonly string[]
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
    if (!targetSop) throw new Error('SOP đích không tồn tại hoặc đã ngừng sử dụng.');
    const { moving, remaining } = partitionSopReassignment(request, selectedSamples);
    const targetBlockReason = getSopReassignmentTargetBlockReason(moving, targetSop, sourceSop);
    if (targetBlockReason) throw new Error(targetBlockReason);
    const configKey = resolveConfigKey(targetSop.id, targetSop.name, targetSop)!;

    const formInputs = buildReassignmentInputs(moving, targetSop, sourceSop);
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
    const remainingCalculatedItems = remaining ? this.calculator.calculateSopNeeds(
      sourceSop, remaining.inputs, Number(remaining.inputs?.['safetyMargin'] ?? remaining.margin ?? -1),
      this.state.inventoryMap(), recipeMap, this.state.safetyConfig()
    ) : [];
    const remainingIssues = validateCalculatedItems(remainingCalculatedItems, Number(remaining?.inputs?.['safetyMargin'] ?? remaining?.margin ?? -1));
    if (remainingIssues.length) throw new Error(remainingIssues[0].message);
    const remainingItems = calculatedItemsToRequestItems(remainingCalculatedItems, this.state.inventoryMap());
    const inventoryDelta = calculateInventoryDelta(request.items || [], [...newItems, ...remainingItems]);
    for (const [id, delta] of Object.entries(inventoryDelta)) {
      const item = this.state.inventoryMap()[id];
      if (!item) throw new Error(`Vật tư “${id}” không còn trong danh mục kho.`);
      if (!Number.isFinite(delta) || Number(item.stock || 0) + delta < -0.000001) {
        throw new Error(`Kho không đủ “${item.name || id}” sau khi chuyển SOP.`);
      }
    }

    return {
      request,
      movingRequest: moving,
      remainingRequest: remaining,
      remainingCalculatedItems,
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
