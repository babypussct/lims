import type { DutyScheduleEntry, DutyStaff } from './duty-schedule.model';
import { isDutyDateKey } from './duty-schedule.utils';

export const DUTY_TSV_HEADER = 'date\tassignees\tstartTime\tnote';
export interface DutyImportRow {
  line: number;
  date: string;
  names: string[];
  staffIds: string[];
  unresolvedAssignees: string[];
  startTime: string;
  note: string;
  errors: string[];
  warnings: string[];
}
export interface DutyImportPlanRow extends DutyImportRow {
  previous: DutyScheduleEntry | null;
  replace: boolean;
}
const nameKey = (value: string) => value.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi');

export function compareDutyImportRuns(
  primary: readonly DutyImportRow[],
  verification: readonly DutyImportRow[],
): string[] {
  const mismatches: string[] = [];
  const primaryByDate = new Map(primary.map(row => [row.date, row]));
  const verificationByDate = new Map(verification.map(row => [row.date, row]));
  const dates = [...new Set([...primaryByDate.keys(), ...verificationByDate.keys()])].sort();

  for (const date of dates) {
    const first = primaryByDate.get(date);
    const second = verificationByDate.get(date);
    if (!first) {
      mismatches.push(`${date}: chỉ xuất hiện trong TSV xác minh lần 2.`);
      continue;
    }
    if (!second) {
      mismatches.push(`${date}: thiếu trong TSV xác minh lần 2.`);
      continue;
    }
    if (JSON.stringify(first.names) !== JSON.stringify(second.names)
      || JSON.stringify(first.staffIds) !== JSON.stringify(second.staffIds)
      || JSON.stringify(first.unresolvedAssignees) !== JSON.stringify(second.unresolvedAssignees)) {
      mismatches.push(`${date}: danh sách hoặc thứ tự người trực khác giữa hai lần.`);
    }
    if (first.startTime !== second.startTime) {
      mismatches.push(`${date}: giờ bắt đầu khác (${first.startTime} ↔ ${second.startTime}).`);
    }
    if (first.note !== second.note) {
      mismatches.push(`${date}: ghi chú khác giữa hai lần.`);
    }
  }

  return mismatches;
}

export function parseDutyTsv(text: string, month: string, staff: readonly DutyStaff[]): { rows: DutyImportRow[]; errors: string[] } {
  const errors: string[] = [];
  const rows: DutyImportRow[] = [];
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) errors.push('Tháng nhập không hợp lệ.');
  if (text.length > 100_000) return { rows, errors: ['Nội dung vượt quá 100.000 ký tự. Chỉ nhập một tháng mỗi lần.'] };
  const normalized = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim().replace(/^```(?:tsv|text)?\n/i, '').replace(/\n```$/, '').replace(/^tsv\s*\n+/i, '');
  const lines = normalized.split('\n');
  if (lines[0]?.trim() !== DUTY_TSV_HEADER) return { rows, errors: ['Dòng đầu phải là: date, assignees, startTime, note — ngăn cách bằng ký tự Tab. Hãy sao chép lại đúng khối TSV Gemini trả về.'] };
  const seen = new Map<string, DutyImportRow>();
  lines.slice(1).forEach((line, index) => {
    if (!line.trim()) return;
    const fields = line.split('\t');
    // A blank final note is commonly trimmed by clipboard applications.
    const [date = '', people = '', startTime = '', note = ''] = fields.map(value => value.trim());
    const row: DutyImportRow = {
      line: index + 2,
      date,
      names: people.split('|').map(value => value.trim()),
      staffIds: [],
      unresolvedAssignees: [],
      startTime,
      note,
      errors: [],
      warnings: [],
    };
    if (fields.length < 3 || fields.length > 4) row.errors.push('Cần 4 cột ngăn cách bằng Tab; cột ghi chú cuối có thể trống.');
    if (!isDutyDateKey(date)) row.errors.push('Ngày không hợp lệ; dùng YYYY-MM-DD.');
    else if (date.slice(0, 7) !== month) row.errors.push(`Ngày nằm ngoài tháng ${month}.`);
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)) row.errors.push('Giờ không hợp lệ; dùng HH:mm.');
    if (note.length > 1000) row.errors.push('Ghi chú vượt quá 1.000 ký tự.');
    if (row.names.length > 50) row.errors.push('Một ca không được quá 50 người.');
    row.names.forEach(name => {
      if (/\?|CHƯA RÕ/i.test(name)) {
        row.unresolvedAssignees.push(name || '?');
        return;
      }
      const matches = staff.filter(person => nameKey(person.displayName) === nameKey(name));
      if (!name || matches.length !== 1) row.errors.push(!name ? 'Thiếu tên người trực.' : `${name}: ${matches.length ? 'trùng tên trong danh mục, cần phân biệt tên trước' : 'không khớp danh mục nhân sự'}.`);
      else if (!matches[0].active) row.errors.push(`${name}: nhân sự đã ngừng xếp lịch.`);
      else { row.staffIds.push(matches[0].id); }
    });
    if (row.unresolvedAssignees.length > 0) {
      row.warnings.push(`${row.unresolvedAssignees.length} vị trí chưa xác định; ca sẽ được nhập với trạng thái Cần xác minh.`);
    } else if (/CHƯA RÕ/i.test(note)) {
      row.warnings.push('Ghi chú cho biết thông tin ca chưa rõ; ca sẽ được nhập với trạng thái Cần xác minh.');
    }
    if (row.staffIds.length + row.unresolvedAssignees.length === 0) row.errors.push('Ca trực chưa có người hoặc vị trí cần xác minh.');
    if (new Set(row.staffIds).size !== row.staffIds.length) row.errors.push('Một người xuất hiện nhiều lần trong cùng ca.');
    const previous = seen.get(date);
    if (previous) { row.errors.push('Ngày bị lặp trong nội dung nhập.'); previous.errors.push('Ngày bị lặp trong nội dung nhập.'); }
    seen.set(date, row);
    rows.push(row);
  });
  if (!rows.length) errors.push('Chưa có dòng lịch trực.');
  if (rows.length > 31) errors.push('Chỉ nhập tối đa 31 ngày của một tháng.');
  return { rows, errors };
}

/** Compare the reviewed record, including its revision, before any writes. */
export function dutyImportRevision(value: DutyScheduleEntry | null): string {
  if (!value) return 'missing';
  return JSON.stringify([
    value.date,
    value.staffIds,
    value.unresolvedAssignees || [],
    value.needsVerification === true,
    value.sourceAssignees || '',
    value.startTime,
    value.status,
    value.note || '',
    value.source || '',
    value.updatedAt ?? null,
  ]);
}

export function buildDutyGeminiPrompt(month: string, staff: readonly DutyStaff[]): string {
  return `LIMS — quy ước chép lịch trực phiên bản 1.
Hãy đọc ảnh lịch trực đính kèm cho tháng ${month}. Nếu tiêu đề ảnh khác tháng này, dừng và báo sai tháng; không tự đổi năm/tháng.
Chỉ chép các ngày có phân công thực tế; không tự bổ sung ngày trống, cuối tuần hay ngày lễ. Giữ nguyên thứ tự người trong ảnh (người đầu là chủ trì), không tự suy đoán nhân sự hoặc lặp lịch từ ngày khác.
Trả về một khối mã tsv duy nhất, dùng ký tự Tab thật giữa đúng 4 cột, dòng đầu chính xác:
${DUTY_TSV_HEADER}
date: YYYY-MM-DD. assignees: các tên cách nhau bằng " | ". startTime: HH:mm, dùng 18:00 nếu ảnh không ghi giờ. note: ghi chú trong ảnh hoặc để trống; không chứa Tab hoặc xuống dòng.
Tên nhân sự đang dùng trên LIMS:
${staff.filter(person => person.active).map(person => person.displayName).join(' | ')}
Giữ dấu tiếng Việt và phần trong ngoặc. Huynh và Huỳnh là hai danh tính khác nhau; Đạt (O) và Đạt (N) cũng khác nhau. Không gộp hoặc đoán từ tên gần giống; chú ý Dĩ, Bến, Thành. Nếu ô ảnh ghi cả Đạt (O) và Đạt (N), liệt kê cả hai.
Nếu tên, ngày hoặc ô nào không đọc chắc chắn, ghi ? tại thông tin đó và CHƯA RÕ trong note để người dùng kiểm tra. Không bỏ qua dòng chưa rõ. Không thay thông tin không rõ bằng một tên có trong danh mục.
Không dùng bảng Markdown, dấu phẩy thay Tab, số thứ tự, dấu ngoặc kép bao cột hoặc dòng tổng cộng trong khối TSV.
Sau khối TSV, báo tổng số ngày, tổng lượt phân công và danh sách ô cần đối chiếu. Người dùng sẽ chỉ dán nội dung khối TSV vào LIMS và đối chiếu lại ảnh trước khi xác nhận.`;
}

/**
 * Verification deliberately uses a different prompt and a brand-new Gemini
 * conversation. The second run must derive its answer from the source image,
 * never from the first TSV or the chat context that produced it.
 */
export function buildDutyGeminiVerificationPrompt(month: string, staff: readonly DutyStaff[]): string {
  return `LIMS — lượt nhận diện độc lập để kiểm tra chéo lịch trực.
Đây là một lượt đọc ảnh MỚI. Hãy phân tích ảnh lịch trực đính kèm cho tháng ${month} từ đầu như thể đây là lần đầu tiên bạn nhìn thấy ảnh này.
KHÔNG sử dụng, tái tạo, suy luận hoặc cố khớp với bất kỳ TSV/kết quả nhận diện nào đã tạo trước đó. Chỉ căn cứ vào những gì nhìn thấy trực tiếp trong ảnh đang đính kèm ở cuộc trò chuyện này.
Nếu tiêu đề ảnh khác tháng ${month}, dừng và báo sai tháng; không tự đổi năm/tháng.
Đọc từng ngày và từng ô độc lập từ ảnh gốc. Chỉ chép các ngày có phân công thực tế; không tự bổ sung ngày trống, cuối tuần hay ngày lễ. Giữ nguyên thứ tự người trong ảnh (người đầu là chủ trì), không lặp lịch từ ngày khác.
Trả về một khối mã tsv duy nhất, dùng ký tự Tab thật giữa đúng 4 cột, dòng đầu chính xác:
${DUTY_TSV_HEADER}
date: YYYY-MM-DD. assignees: các tên cách nhau bằng " | ". startTime: HH:mm, dùng 18:00 nếu ảnh không ghi giờ. note: ghi chú trong ảnh hoặc để trống; không chứa Tab hoặc xuống dòng.
Danh mục tên trên LIMS chỉ dùng để đối chiếu chính tả sau khi bạn đã đọc được chữ từ ảnh, KHÔNG được dùng để đoán một ô mờ:
${staff.filter(person => person.active).map(person => person.displayName).join(' | ')}
Giữ dấu tiếng Việt và phần trong ngoặc. Huynh và Huỳnh là hai danh tính khác nhau; Đạt (O) và Đạt (N) cũng khác nhau. Không gộp hoặc đoán từ tên gần giống; chú ý Dĩ, Bến, Thành. Nếu ô ảnh ghi cả Đạt (O) và Đạt (N), liệt kê cả hai.
Nếu tên, ngày hoặc ô nào không đọc chắc chắn, ghi ? tại thông tin đó và CHƯA RÕ trong note. Không bỏ qua dòng chưa rõ và không thay thông tin chưa chắc bằng tên có vẻ hợp lý trong danh mục.
Không dùng bảng Markdown, dấu phẩy thay Tab, số thứ tự, dấu ngoặc kép bao cột hoặc dòng tổng cộng trong khối TSV.
Sau khối TSV, báo tổng số ngày, tổng lượt phân công và danh sách ô bạn không chắc chắn. Không nhận xét TSV của lần khác và không cố làm cho kết quả khớp với một đáp án trước đó.`;
}
