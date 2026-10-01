import { InventoryItem, StockHistoryItem } from '../../core/models/inventory.model';
import { A4Document } from '../../shared/utils/a4-document';
import { timestampToDate } from '../../shared/utils/timestamp';

const blank = '________________';
const num = (value: number) => value.toLocaleString('vi-VN', { maximumFractionDigits: 8 });
const signature = { title: 'Xác nhận kiểm tra', columns: ['Người lập', 'Người kiểm tra'], rows: [{ cells: [`Họ tên: ${blank}\nNgày/ký: ${blank}`, `Họ tên: ${blank}\nNgày/ký: ${blank}`] }] };
const create = (title: string, subtitle: string): A4Document => ({ title, subtitle, preparedAt: new Date().toLocaleString('vi-VN'), notice: 'Đối chiếu và ghi nhận theo quy trình quản lý kho của đơn vị.', brand: 'LIMS · QUẢN LÝ KHO', fileName: 'LIMS_Kho.pdf', sections: [] });

export function buildStockCardDocument(item: InventoryItem, history: StockHistoryItem[]): A4Document {
  if (!history.length) throw new Error('Chưa có lịch sử để đối soát thẻ kho.');
  const rows = [...history].sort((a, b) => (timestampToDate(a.timestamp)?.getTime() || 0) - (timestampToDate(b.timestamp)?.getTime() || 0));
  let previous = rows[0].stockAfter - rows[0].amountChange;
  const opening = previous;
  for (const row of rows) {
    if (!timestampToDate(row.timestamp) || ![row.stockAfter, row.amountChange].every(Number.isFinite) || Math.abs(previous + row.amountChange - row.stockAfter) > 1e-6) throw new Error('Lịch sử kho chưa đối soát được liên tục. Kiểm tra các mốc nhập/xuất trước khi in.');
    previous = row.stockAfter;
  }
  if (!Number.isFinite(item.stock) || Math.abs(previous - item.stock) > 1e-6) throw new Error('Tồn hiện tại chưa khớp lịch sử. Tải lại dữ liệu và đối soát trước khi in.');
  const doc = create('Thẻ kho', `${item.name} · ${item.id} · ${item.unit}`);
  doc.sections.push({ title: 'Phạm vi và đối soát', columns: ['Thông tin', 'Giá trị'], rows: [
    { cells: ['Số lô / vị trí', `${item.lotNumber || blank} / ${item.location || blank}`] },
    { cells: ['Phạm vi lịch sử', `${timestampToDate(rows[0].timestamp)!.toLocaleString('vi-VN')} → ${timestampToDate(rows.at(-1)!.timestamp)!.toLocaleString('vi-VN')} · ${rows.length} mốc`] },
    { cells: ['Tồn trước mốc đầu / tồn sau mốc cuối', `${num(opening)} / ${num(previous)} ${item.unit}`] },
  ] });
  const actions = { IMPORT: 'Nhập', EXPORT: 'Xuất', ADJUST: 'Điều chỉnh', SOP_DEDUCT: 'Dùng SOP', SOP_RETURN: 'Hoàn SOP', CREATE: 'Khởi tạo' };
  doc.sections.push({ title: 'Nhập, xuất và tồn', columns: ['Thời điểm', 'Nghiệp vụ / diễn giải', 'Biến động', 'Tồn sau', 'Người ghi nhận'], rows: rows.map(row => ({ key: row.id, cells: [timestampToDate(row.timestamp)!.toLocaleString('vi-VN'), `${actions[row.actionType] || row.actionType}\n${row.reference || ''}`, `${row.amountChange > 0 ? '+' : ''}${num(row.amountChange)}`, num(row.stockAfter), row.user || 'Chưa có thông tin'] })) }, signature);
  return doc;
}

export function buildInventoryCountDocument(items: InventoryItem[], scope: string): A4Document {
  if (!items.length || items.some(item => !Number.isFinite(item.stock))) throw new Error('Danh sách kiểm kê chưa có đủ dữ liệu tồn kho hợp lệ.');
  const doc = create('Phiếu kiểm kê kho', `${items.length} vật tư · ${scope}`);
  doc.orientation = 'landscape';
  doc.notice = 'Phạm vi là danh sách đang lọc trên màn hình. Ghi số lượng thực tế và chênh lệch sau kiểm kê; phiếu chưa có xác nhận.';
  doc.sections.push({ title: 'Danh sách kiểm kê', columns: ['Mã / tên vật tư', 'Lô / vị trí', 'Đơn vị', 'Tồn hệ thống', 'Tồn thực tế', 'Chênh lệch / ghi chú'], rows: items.map(item => ({ key: item.id, cells: [`${item.id}\n${item.name}`, `${item.lotNumber || blank}\n${item.location || blank}`, item.unit, num(item.stock), blank, blank] })) }, signature);
  return doc;
}
