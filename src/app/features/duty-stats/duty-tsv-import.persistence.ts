import { doc, runTransaction, serverTimestamp, type Firestore } from 'firebase/firestore';
import type { DutyScheduleEntry, DutyStaff } from './duty-schedule.model';
import { dutyImportRevision, parseDutyTsv, type DutyImportPlanRow } from './duty-tsv-import';

/** The same transaction is used by the UI and the emulator integration tests. */
export async function persistDutyMonthImport(db: Firestore, appId: string, uid: string, staff: readonly DutyStaff[], text: string, month: string, reviewed: readonly DutyImportPlanRow[]) {
  const parsed = parseDutyTsv(text, month, staff);
  if (!uid || parsed.errors.length || parsed.rows.some(row => row.errors.length) || parsed.rows.length !== reviewed.length) {
    throw new Error('Nội dung hoặc danh mục đã thay đổi. Hãy xem trước lại.');
  }
  const rows = parsed.rows.map((row, index) => {
    const review = reviewed[index];
    if (row.date !== review.date || JSON.stringify(row.staffIds) !== JSON.stringify(review.staffIds)
      || row.startTime !== review.startTime || row.note !== review.note) throw new Error('Bản xem trước không còn khớp. Hãy xem trước lại.');
    return { ...row, previous: review.previous, replace: review.replace };
  });
  const selected = rows.filter(row => !row.previous || row.replace);
  if (!selected.length) throw new Error('Không có ngày nào được chọn để nhập.');
  const refs = selected.map(row => doc(db, `artifacts/${appId}/duty_schedules`, row.date));
  const staffIds = [...new Set(selected.flatMap(row => row.staffIds))];
  return runTransaction(db, async transaction => {
    const snapshots = await Promise.all(refs.map(ref => transaction.get(ref)));
    const people = await Promise.all(staffIds.map(id => transaction.get(doc(db, `artifacts/${appId}/duty_staff`, id))));
    for (const person of people) {
      const expected = staff.find(item => item.id === person.id);
      if (!person.exists() || !person.data()['active'] || person.data()['displayName'] !== expected?.displayName) {
        throw new Error('Danh mục nhân sự vừa thay đổi. Hãy xem trước lại.');
      }
    }
    snapshots.forEach((snapshot, index) => {
      const current = snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as DutyScheduleEntry : null;
      if (dutyImportRevision(current) !== dutyImportRevision(selected[index].previous)) {
        throw new Error(`Ca ngày ${selected[index].date} vừa thay đổi. Chưa nhập ngày nào; hãy xem trước lại.`);
      }
    });
    selected.forEach((row, index) => {
      const payload = { date: row.date, staffIds: row.staffIds, startTime: row.startTime, note: row.note,
        status: 'planned', source: 'import', updatedAt: serverTimestamp(), updatedByUid: uid };
      if (snapshots[index].exists()) transaction.update(refs[index], payload);
      else transaction.set(refs[index], { ...payload, createdAt: serverTimestamp(), createdByUid: uid });
    });
    return { created: selected.filter(row => !row.previous).length, replaced: selected.filter(row => row.previous).length, kept: rows.length - selected.length };
  });
}
