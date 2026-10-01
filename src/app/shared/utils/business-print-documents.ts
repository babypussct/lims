import { Request } from '../../core/models/request.model';
import { Sop } from '../../core/models/sop.model';
import { TimelineItem } from '../components/ui/timeline/timeline.model';
import { A4Document } from './a4-document';
import { getAssignedTargetsForSample } from '../../features/results/shared/compound-id-resolver';
import { timestampToDate } from './timestamp';

const blank = '________________';
function document(title: string, subtitle: string, notice: string): A4Document {
  return { title, subtitle, notice, preparedAt: new Date().toLocaleString('vi-VN'), brand: 'LIMS · HỒ SƠ', fileName: 'LIMS_Ho_so.pdf', sections: [] };
}

/** Print available SOP configuration; do not invent procedure steps or approval. */
export function buildSopConfigDocument(sop: Sop): A4Document {
  const doc = document('SOP Quick Guide · Thông số và vật tư', `${sop.ref || sop.id} · ${sop.name} · ${sop.version != null ? 'v' + sop.version : 'Chưa ghi phiên bản'}`, 'Bản tham khảo cấu hình SOP trong LIMS. Các bước thao tác phải đối chiếu SOP đã ban hành tại đơn vị.');
  doc.sections.push({ title: 'Phạm vi áp dụng', columns: ['Thông tin', 'Giá trị'], rows: [
    { cells: ['Nhóm phương pháp', sop.category] }, { cells: ['Nền mẫu', sop.matrixTags?.join(', ') || 'Chưa khai báo'] },
    { cells: ['Thiết bị cấu hình', sop.allowedDevices?.join(', ') || sop.device || 'Chưa khai báo'] },
    { cells: ['Trạng thái cấu hình', sop.isArchived ? 'Đã lưu trữ; kiểm tra phiên bản đang áp dụng' : 'Cấu hình hiện tại; đối chiếu hồ sơ ban hành'] },
  ] });
  if (sop.inputs.length) doc.sections.push({ title: 'Thông số đầu vào', columns: ['Thông số', 'Giá trị mặc định / đơn vị'], rows: sop.inputs.map(input => ({ cells: [input.label, `${String(input.default)} ${input.unitLabel || ''}`] })) });
  if (Object.keys(sop.variables).length) doc.sections.push({ title: 'Công thức cấu hình', columns: ['Biến', 'Biểu thức'], rows: Object.entries(sop.variables).map(([name, value]) => ({ cells: [name, value] })) });
  if (sop.consumables.length) doc.sections.push({ title: 'Vật tư và quy tắc định lượng', columns: ['Vật tư', 'Công thức / đơn vị', 'Điều kiện / thành phần'], rows: sop.consumables.map(item => ({ cells: [item._displayName || item.name, `${item.formula} ${item.unit}`, [item.condition || '', ...(item.ingredients || []).map(part => `${part._displayName || part.name}: ${part.amount} ${part.unit}`)].filter(Boolean).join('\n') || '—'] })) });
  if (sop.targets?.length) doc.sections.push({ title: 'Chỉ tiêu cấu hình', columns: ['Tên / mã', 'Đơn vị / LOD / LOQ'], rows: sop.targets.map(target => ({ cells: [`${target.name}\n${target.id}`, `${target.unit || '—'} / ${target.lod || '—'} / ${target.loq || '—'}`] })) });
  return doc;
}

export function buildSampleHandoverDocument(request: Request): A4Document {
  const samples = request.sampleList || [];
  if (!samples.length) throw new Error('Yêu cầu chưa có danh sách mẫu để lập phiếu bàn giao.');
  const doc = document('Phiếu bàn giao mẫu', `${request.id} · ${request.sopName} · ${request.sopVersion != null ? 'v' + request.sopVersion : 'Chưa ghi phiên bản'}`, 'Danh sách từ yêu cầu LIMS. Ghi thời điểm, số lượng, tình trạng và xác nhận khi bàn giao thực tế; phiếu này chưa xác nhận đã tiếp nhận mẫu.');
  doc.sections.push({ title: 'Thông tin bàn giao', columns: ['Thông tin', 'Khai báo / ghi tay'], rows: [
    { cells: ['Mã yêu cầu / trạng thái trong LIMS', `${request.id} / ${request.status}`] },
    { cells: ['Người lập yêu cầu / ngày phân tích dự kiến', `${request.user || 'Chưa có thông tin'} / ${request.analysisDate || 'Chưa khai báo'}`] },
    { cells: ['Bên giao / bên nhận', `${blank} / ${blank}`] }, { cells: ['Thời điểm bàn giao / địa điểm', `${blank} / ${blank}`] },
  ] });
  doc.sections.push({ title: 'Danh sách mẫu', columns: ['Mã mẫu', 'Mô tả trong yêu cầu', 'Chỉ tiêu phân công', 'Số lượng / tình trạng thực nhận'], rows: samples.map(sample => {
    const targets = getAssignedTargetsForSample(sample, request.sampleTargetMap || {}) || request.targetIds || [];
    const description = Object.entries(request.sampleDescriptionMap || {}).find(([id]) => id.trim().toLocaleLowerCase() === sample.trim().toLocaleLowerCase())?.[1];
    return { key: sample, cells: [sample, description?.nameSnapshot || 'Chưa có mô tả', targets.map(id => request.targetNames?.[id] || id).join('\n') || 'Chưa phân công', blank] };
  }) }, { title: 'Xác nhận bàn giao thực tế', columns: ['Bên giao', 'Bên nhận'], rows: [{ cells: [`Họ tên: ${blank}\nNgày/ký: ${blank}`, `Họ tên: ${blank}\nNgày/ký: ${blank}`] }] });
  return doc;
}

/** Accept only fields already prepared for the authorized on-screen viewer. */
export function buildTraceDocument(code: string, summary: {label: string; value: string}[], timeline: TimelineItem[], notes: string[], hasMore: boolean): A4Document {
  const doc = document('Hồ sơ truy xuất', code, hasMore ? 'Đây là phần lịch sử đã tải. Còn dữ liệu chưa tải; đối chiếu hồ sơ đầy đủ trước khi dùng cho đánh giá.' : 'Nội dung từ phạm vi tra cứu hiện tại. Mắt xích chưa có dữ liệu cần được đối chiếu trong hồ sơ nguồn.');
  if (summary.length) doc.sections.push({ title: 'Thông tin hồ sơ', columns: ['Thông tin', 'Giá trị'], rows: summary.map(row => ({ cells: [row.label, row.value] })) });
  if (timeline.length) doc.sections.push({ title: 'Chuỗi ghi nhận đã tải', columns: ['Thời điểm / người', 'Hoạt động', 'Thông tin đối chiếu'], rows: timeline.map(item => ({ key: item.id, cells: [`${timestampToDate(item.timestamp)?.toLocaleString('vi-VN') || 'Chưa có thời điểm'}\n${item.actorName || 'Chưa có người ghi nhận'}`, `${item.title}${item.description ? '\n' + item.description : ''}`, (item.metadata || []).map(row => `${row.label}: ${row.value}`).join('\n') || 'Chưa có thông tin bổ sung'] })) });
  doc.sections.push({ title: 'Phạm vi và điểm cần đối chiếu', columns: ['Nội dung'], rows: [...notes, 'Chỉ in dữ liệu đã được đọc theo quyền hiện tại; kiểm tra hồ sơ nguồn để xác nhận thiết bị, hóa chất, kết quả và người duyệt còn thiếu.'].map(note => ({ cells: [note] })) });
  return doc;
}
