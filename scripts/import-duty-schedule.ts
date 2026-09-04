import { createHash } from 'node:crypto';
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore, type DocumentData, type WriteBatch } from 'firebase-admin/firestore';
import { DUTY_SCHEDULE_DATA } from '../src/app/features/duty-stats/duty-schedule.data';

const args = new Set(process.argv.slice(2));
const apply = args.has('--apply');
const appId = readArgument('--app-id=') || process.env['LIMS_APP_ID'] || 'lims-cloud-fixed';
const actorUid = 'migration:duty-schedule';
const maxBatchWrites = 400;

interface ExistingStaff {
  id: string;
  displayName: string;
  data: DocumentData;
}

interface PlannedStaff {
  id: string;
  displayName: string;
}

interface PlannedSchedule {
  date: string;
  staffIds: string[];
}

function readArgument(prefix: string): string | undefined {
  return process.argv.find(argument => argument.startsWith(prefix))?.slice(prefix.length).trim() || undefined;
}

function initializeAdmin(): void {
  if (getApps().length > 0) return;
  const serviceAccountJson = process.env['FIREBASE_SERVICE_ACCOUNT'];
  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    initializeApp({ credential: cert(serviceAccount) });
    return;
  }
  initializeApp({ credential: applicationDefault() });
}

function canonicalStaffName(value: string): string {
  return value
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('vi-VN');
}

function generatedStaffId(displayName: string): string {
  const digest = createHash('sha256')
    .update(canonicalStaffName(displayName), 'utf8')
    .digest('hex')
    .slice(0, 16);
  return `duty_${digest}`;
}

function assertImportSourceIsResolved(): void {
  const unresolved = DUTY_SCHEDULE_DATA.unresolvedFragments;
  if (unresolved.length === 0) return;
  const preview = unresolved.slice(0, 20).join(' · ');
  throw new Error(
    `Còn ${unresolved.length} mảnh OCR chưa xác định (${preview}). ` +
    'Hãy rà tên trước khi nhập để tránh tạo sai nhân sự.',
  );
}

async function loadExistingStaff(): Promise<ExistingStaff[]> {
  const db = getFirestore();
  const snapshot = await db.collection(`artifacts/${appId}/duty_staff`).get();
  return snapshot.docs.map(document => ({
    id: document.id,
    displayName: String(document.data()['displayName'] || '').trim(),
    data: document.data(),
  }));
}

function buildStaffLookup(existing: ExistingStaff[]): Map<string, ExistingStaff> {
  const lookup = new Map<string, ExistingStaff>();
  for (const person of existing) {
    const key = canonicalStaffName(person.displayName);
    if (!key) continue;
    const duplicate = lookup.get(key);
    if (duplicate && duplicate.id !== person.id) {
      throw new Error(
        `Có nhiều nhân sự cùng tên chuẩn hóa "${person.displayName}" (${duplicate.id}, ${person.id}). ` +
        'Hãy phân biệt tên/mã trước khi nhập lịch.',
      );
    }
    lookup.set(key, person);
  }
  return lookup;
}

async function planImport(): Promise<{
  newStaff: PlannedStaff[];
  schedules: PlannedSchedule[];
  skippedScheduleDates: string[];
  staffIdByName: Map<string, string>;
}> {
  const db = getFirestore();
  const existingStaff = await loadExistingStaff();
  const existingByName = buildStaffLookup(existingStaff);
  const staffIdByName = new Map<string, string>();
  const newStaffByKey = new Map<string, PlannedStaff>();

  for (const shift of DUTY_SCHEDULE_DATA.shifts) {
    for (const displayName of shift.people) {
      const key = canonicalStaffName(displayName);
      if (staffIdByName.has(key)) continue;
      const existing = existingByName.get(key);
      if (existing) {
        staffIdByName.set(key, existing.id);
        continue;
      }
      const planned = { id: generatedStaffId(displayName), displayName };
      const generatedCollision = [...newStaffByKey.values()].find(item =>
        item.id === planned.id && canonicalStaffName(item.displayName) !== key,
      );
      if (generatedCollision) {
        throw new Error(`Xung đột ID sinh tự động giữa ${generatedCollision.displayName} và ${displayName}.`);
      }
      newStaffByKey.set(key, planned);
      staffIdByName.set(key, planned.id);
    }
  }

  const scheduleDates = DUTY_SCHEDULE_DATA.shifts.map(shift => shift.date);
  const existingScheduleDates = new Set<string>();
  for (let offset = 0; offset < scheduleDates.length; offset += 30) {
    const chunk = scheduleDates.slice(offset, offset + 30);
    const snapshots = await Promise.all(chunk.map(date =>
      db.doc(`artifacts/${appId}/duty_schedules/${date}`).get(),
    ));
    snapshots.forEach(snapshot => {
      if (snapshot.exists) existingScheduleDates.add(snapshot.id);
    });
  }

  const schedules: PlannedSchedule[] = [];
  const skippedScheduleDates: string[] = [];
  for (const shift of DUTY_SCHEDULE_DATA.shifts) {
    if (existingScheduleDates.has(shift.date)) {
      skippedScheduleDates.push(shift.date);
      continue;
    }
    const staffIds = shift.people.map(name => {
      const staffId = staffIdByName.get(canonicalStaffName(name));
      if (!staffId) throw new Error(`Không phân giải được nhân sự ${name} cho ngày ${shift.date}.`);
      return staffId;
    });
    schedules.push({ date: shift.date, staffIds: [...new Set(staffIds)] });
  }

  return {
    newStaff: [...newStaffByKey.values()].sort((a, b) => a.displayName.localeCompare(b.displayName, 'vi')),
    schedules,
    skippedScheduleDates,
    staffIdByName,
  };
}

async function commitImport(newStaff: PlannedStaff[], schedules: PlannedSchedule[]): Promise<void> {
  const db = getFirestore();
  const writes: Array<(batch: WriteBatch) => void> = [];

  for (const person of newStaff) {
    writes.push(batch => {
      batch.create(db.doc(`artifacts/${appId}/duty_staff/${person.id}`), {
        displayName: person.displayName,
        employeeCode: '',
        linkedUserUid: null,
        active: true,
        note: '',
        createdAt: FieldValue.serverTimestamp(),
        createdByUid: actorUid,
        updatedAt: FieldValue.serverTimestamp(),
        updatedByUid: actorUid,
      });
    });
  }

  for (const schedule of schedules) {
    writes.push(batch => {
      batch.create(db.doc(`artifacts/${appId}/duty_schedules/${schedule.date}`), {
        date: schedule.date,
        staffIds: schedule.staffIds,
        startTime: '18:00',
        status: 'planned',
        note: '',
        source: 'import',
        createdAt: FieldValue.serverTimestamp(),
        createdByUid: actorUid,
        updatedAt: FieldValue.serverTimestamp(),
        updatedByUid: actorUid,
      });
    });
  }

  for (let offset = 0; offset < writes.length; offset += maxBatchWrites) {
    const batch = db.batch();
    const chunk = writes.slice(offset, offset + maxBatchWrites);
    chunk.forEach(addWrite => addWrite(batch));
    await batch.commit();
    console.log(`[Duty import] Đã ghi ${Math.min(offset + chunk.length, writes.length)}/${writes.length} bản ghi.`);
  }
}

async function main(): Promise<void> {
  assertImportSourceIsResolved();
  initializeAdmin();
  const db = getFirestore();
  db.settings({ ignoreUndefinedProperties: true });

  const plan = await planImport();
  const importedPeople = new Set(
    DUTY_SCHEDULE_DATA.shifts.flatMap(shift => shift.people.map(canonicalStaffName)),
  );

  console.log(`[Duty import] App: ${appId}`);
  console.log(`[Duty import] Nguồn: ${DUTY_SCHEDULE_DATA.sourceFiles.length} file, ${DUTY_SCHEDULE_DATA.shifts.length} ca.`);
  console.log(`[Duty import] Nhân sự trong nguồn: ${importedPeople.size}; tạo mới: ${plan.newStaff.length}.`);
  console.log(`[Duty import] Ca mới: ${plan.schedules.length}; ca đã tồn tại và giữ nguyên: ${plan.skippedScheduleDates.length}.`);
  if (plan.newStaff.length > 0) {
    console.log(`[Duty import] Nhân sự sẽ tạo: ${plan.newStaff.map(item => item.displayName).join(' · ')}`);
  }

  if (!apply) {
    console.log('[Duty import] DRY RUN mặc định: chưa ghi Firestore. Thêm --apply sau khi đã rà kết quả.');
    return;
  }

  if (plan.newStaff.length === 0 && plan.schedules.length === 0) {
    console.log('[Duty import] Không có dữ liệu mới cần ghi.');
    return;
  }

  await commitImport(plan.newStaff, plan.schedules);
  console.log('[Duty import] Hoàn tất. Các ca đã tồn tại và liên kết tài khoản hiện có không bị ghi đè.');
}

main().catch(error => {
  console.error(`[Duty import] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
