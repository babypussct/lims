import { A4Document, A4DocumentSection } from '../../shared/utils/a4-document';
import { ConcentrationDraft, ConcentrationSnapshot, PipetteSuggestion, PrepCalculationResult, PrepDraft, PrepOutput, QuantityDraft, QuantityResult } from './prep-domain.types';

const blank = '________________';
const labels = {
  target: 'Phiếu pha chế dung dịch', concentration: 'Phiếu xác định nồng độ dung dịch',
  series: 'Phiếu pha dãy chuẩn và QC', spike: 'Phiếu thêm chuẩn vào mẫu', result_conversion: 'Phiếu quy đổi kết quả mẫu',
};
const objectLabels = { standard: 'Chuẩn', blank: 'Mẫu trắng', qc: 'QC', sample: 'Mẫu' };
const sourceLabels = { solid: 'Chất rắn', solution: 'Dung dịch nguồn', concentrate: 'Hóa chất đậm đặc' };
const stepLabels = { extract: 'Chiết', aliquot: 'Lấy phần dịch', transfer_all: 'Chuyển toàn bộ', dilution: 'Pha loãng', concentration: 'Cô đặc', reconstitution: 'Hoàn nguyên', split: 'Chia phần', recovery: 'Hiệu suất thu hồi' };
const strategyLabels = { direct: 'Pha trực tiếp', multi_intermediate: 'Nhiều chuẩn trung gian', serial_dilution: 'Pha nối tiếp', multi_component: 'Hỗn hợp nhiều thành phần' };

function number(value: number | null | undefined): string {
  if (value == null) return blank;
  if (value !== 0 && Math.abs(value) < 1e-8) return value.toExponential(8);
  return value.toLocaleString('vi-VN', { maximumFractionDigits: 8 });
}
function quantity(value: QuantityDraft | null | undefined): string { return value?.value != null ? `${number(value.value)} ${value.unit}` : blank; }
function resultQuantity(value: QuantityResult | null): string { return value ? `${number(value.displayValue)} ${value.displayUnit}` : blank; }
function volume(value: number | null): string { return value == null ? blank : `${number(value)} mL`; }
function concentration(value: ConcentrationDraft | null | undefined): string {
  if (!value || value.value == null) return blank;
  const basis = value.basis === 'mass_per_mass' ? 'khối lượng/khối lượng'
    : value.basis === 'mass_per_volume' ? 'khối lượng/thể tích' : value.basis === 'volume_per_volume' ? 'thể tích/thể tích'
    : value.basis === 'molar' ? 'mol/thể tích' : 'phần khối lượng';
  return `${number(value.value)} ${value.unit} (${basis})`;
}
function massConcentration(value: number | null): string { return value == null ? blank : `${number(value * 1000)} mg/L`; }
function snapshot(value: ConcentrationSnapshot | null, preferredUnit: string): string {
  if (!value) return blank;
  const alternative = value.alternatives.find(item => item.unit === preferredUnit || item.unit.startsWith(preferredUnit + ' ('));
  return alternative ? `${number(alternative.value)} ${alternative.unit}` : massConcentration(value.massPerVolumeGPerL);
}
function pipette(value: PipetteSuggestion | null): string { return value ? `Pipet tham khảo: ${value.id}, dải ${number(value.minUl)}–${number(value.maxUl)} µL` : ''; }
// Remove floating-point tails from generated instructions; calculation values stay intact.
function readable(text: string): string {
  return text.replace(/-?\d+\.\d{9,}(?:e[+-]?\d+)?/gi, token => String(Number(Number(token).toPrecision(12))));
}

/** Adapt a valid calculation without recalculating or inventing execution data. */
export function buildPrepPrintDocument(
  draft: PrepDraft,
  calculation: PrepCalculationResult<PrepOutput>,
  metadata: readonly (readonly string[])[],
  preparedAt = new Date(),
  preferredUnit = 'mg/L',
): A4Document {
  if (calculation.status !== 'valid' || !calculation.output || calculation.output.kind !== draft.mode) {
    throw new Error('Nhập đủ và kiểm tra số liệu trước khi xuất phiếu.');
  }
  const output = calculation.output;
  const sections: A4DocumentSection[] = [];
  const add = (title: string, columns: string[], rows: string[][], keys?: string[]) => {
    if (rows.length) sections.push({ title, columns, rows: rows.map((cells, index) => ({ cells, key: keys?.[index] })) });
  };
  const inputs: string[][] = [];
  const input = (label: string, value: string) => inputs.push([label, value]);
  let subtitle = '';

  if ((draft.mode === 'target' || draft.mode === 'concentration') && (output.kind === 'target' || output.kind === 'concentration')) {
    subtitle = output.name || 'Dung dịch chưa có tên';
    input('Nguồn pha', sourceLabels[draft.sourceType]);
    input('Thể tích định mức khai báo', quantity(draft.finalVolume));
    if (draft.sourceConcentration) input('Nồng độ nguồn', concentration(draft.sourceConcentration));
    if (draft.targetConcentration) input('Nồng độ cần pha / đối chiếu', concentration(draft.targetConcentration));
    if (draft.sourceType === 'solid') {
      input('Độ tinh khiết / hàm lượng', `${number(draft.substance.potencyPercent)} %`);
      input('Hệ số quy đổi dạng chất', number(draft.substance.conversionFactor));
    }
    if (draft.substance.molecularWeight != null) input('Khối lượng mol', `${number(draft.substance.molecularWeight)} g/mol`);
    if (draft.substance.densityGPerMl != null) input('Khối lượng riêng khai báo', `${number(draft.substance.densityGPerMl)} g/mL`);
    if (draft.sourceConcentration?.densityGPerMl != null) input('Khối lượng riêng nguồn', `${number(draft.sourceConcentration.densityGPerMl)} g/mL`);
    if (draft.targetConcentration?.densityGPerMl != null) input('Khối lượng riêng dung dịch đích', `${number(draft.targetConcentration.densityGPerMl)} g/mL`);
    add('Lượng pha và ghi nhận thực hiện', ['Thông số', 'Yêu cầu / dự tính', 'Lượng thực tế đã nhập / ghi tay'], [
      ['Cân / hút nguồn', output.kind === 'target' ? resultQuantity(output.plannedQuantity) : '—', resultQuantity(output.actualQuantity)],
      ['Định mức', volume(output.finalVolumeMl), blank],
      ['Nồng độ từ lượng đã nhập', output.kind === 'target' ? snapshot(output.plannedConcentration, preferredUnit) : '—', snapshot(output.actualConcentration, preferredUnit)],
    ]);
    add('Hướng dẫn thao tác', ['Nội dung'], [[readable(output.operation)], ...[pipette(output.pipette), output.flask ? `Bình định mức tham khảo: ${volume(output.flask.volumeMl)}${output.flask.exact ? '' : ' (đối chiếu cảnh báo)'}` : '', output.balanceDisplayMg != null ? `Lượng cân hiển thị tham khảo: ${number(output.balanceDisplayMg)} mg` : ''].filter(Boolean).map(text => [text])]);
  }
  if (draft.mode === 'spike' && output.kind === 'spike') {
    subtitle = `${output.sampleName || 'Mẫu chưa có tên'} · ${output.standardName || 'Chuẩn chưa có tên'}`;
    input('Tên chuẩn', draft.standardName || blank);
    input('Nồng độ dung dịch chuẩn', concentration(draft.standard));
    input('Lượng mẫu', quantity(draft.sampleQuantity));
    input('Mức thêm / nồng độ yêu cầu', concentration(draft.target));
    if (draft.initialConcentration) input('Nồng độ ban đầu', concentration(draft.initialConcentration));
    input('Nền mẫu', { solid: 'Rắn', liquid: 'Lỏng', extract: 'Dịch chiết', vial: 'Vial cuối' }[draft.matrix]);
    input('Vị trí thêm', { sample_initial: 'Mẫu ban đầu', extract: 'Dịch chiết', after_cleanup: 'Sau làm sạch', final_vial: 'Vial cuối' }[draft.location]);
    input('Cách tính', draft.semantic === 'added_on_initial' ? 'Mức thêm trên mẫu ban đầu' : 'Nồng độ tổng trên thể tích cuối');
    add('Thêm chuẩn và ghi nhận thực hiện', ['Thao tác', 'Dự tính', 'Thực tế / ký nháy'], [
      ['Hút dung dịch chuẩn', volume(output.spikeVolumeMl), blank], ['Lượng chất thêm', `${number(output.addedMassG * 1000)} mg`, blank],
    ]);
    add('Hướng dẫn thao tác', ['Nội dung'], [[readable(output.operation)], ...[pipette(output.pipette)].filter(Boolean).map(text => [text])]);
  }
  if (draft.mode === 'series' && output.kind === 'series') {
    subtitle = `${strategyLabels[draft.strategy]} · ${output.pointRows.length} điểm · ${output.componentRows.length} thành phần`;
    const names = new Map([...draft.sources.map(row => [row.id, row.name] as const), ...draft.points.map(row => [row.id, row.label] as const)]);
    const source = (id: string | null | undefined) => id ? names.get(id)?.trim() || 'Nguồn chưa có tên' : 'Dung dịch có sẵn';
    input('Chiến lược', strategyLabels[draft.strategy]);
    input('Phần dư chuẩn bị', `${number(draft.residualPercent)} %`);
    if (draft.strategy === 'multi_component') input('Thể tích hỗn hợp', quantity(draft.finalVolume));
    add('Dung dịch nguồn và chuẩn trung gian', ['Tên / nguồn', 'Nồng độ khai báo', 'Hút dự tính / định mức', 'Đã hút / nồng độ từ lượng nhập'], output.intermediateRows.map(row => [
      `${row.name}\n${source(row.sourceId)}`, concentration(draft.sources.find(item => item.id === row.id)?.concentration),
      row.sourceId ? `${volume(row.sourceVolumeMl)} / ${volume(row.preparedVolumeMl)}` : 'Dung dịch có sẵn',
      row.sourceId ? `${volume(row.actualSourceVolumeMl)}\n${massConcentration(row.actualConcentrationGPerL)}` : '—',
    ]), output.intermediateRows.map(row => `source:${row.id}`));
    add('Các điểm chuẩn, mẫu trắng, QC và mẫu', ['Điểm / nguồn', 'Nồng độ / định mức', 'Hút dự tính', 'Đã hút / nồng độ từ lượng nhập'], output.pointRows.map(row => [
      `${row.label} · ${objectLabels[row.objectType]}\n${source(row.sourceId)}`,
      `${concentration(draft.points.find(item => item.id === row.id)?.targetConcentration)}\n${volume(row.finalVolumeMl)}`,
      `${volume(row.sourceVolumeMl)}\nDung môi dự tính: ${volume(row.solventVolumeMl)}\nPhần thêm: ${volume(row.additionsVolumeMl)}`,
      `${volume(row.actualSourceVolumeMl)}\n${massConcentration(row.actualConcentrationGPerL)} (theo nguồn khai báo)`,
    ]), output.pointRows.map(row => `point:${row.id}`));
    add('Thành phần hỗn hợp', ['Thành phần / nguồn', 'Nồng độ yêu cầu', 'Hút dự tính', 'Thực tế / ký nháy'], output.componentRows.map(row => [
      `${row.name}\n${source(row.sourceId)}`, concentration(draft.components.find(item => item.id === row.id)?.targetConcentration), volume(row.volumeMl), blank,
    ]), output.componentRows.map(row => `component:${row.id}`));
    add('Nội chuẩn, chuẩn đồng hành và phần thêm', ['Đối tượng / chất', 'Hút dự tính', 'Thực tế / ký nháy'], output.additionRows.map(row => [
      `${row.pointLabel}\n${row.name}\n${readable(row.operation)}`, volume(row.volumeMl), blank,
    ]), output.additionRows.map((row, index) => `addition:${row.id}:${index}`));
    add('Quy tắc áp dụng phần thêm', ['Chất / nguồn', 'Liều / phạm vi áp dụng'], draft.additions.map(row => [
      `${row.name}\n${row.sourceId ? source(row.sourceId) : 'Nguồn khai báo riêng'}\n${concentration(row.source)}`,
      `${row.fixedVolume ? quantity(row.fixedVolume) : concentration(row.targetLevel)}\nÁp dụng: ${row.applicationScope.map(type => objectLabels[type]).join(', ') || 'Không có'}\nNgoại lệ: ${row.exceptions?.map(type => objectLabels[type]).join(', ') || 'Không có'}\n${row.includeInFinalVolume === true ? 'Trong thể tích cuối' : 'Ngoài thể tích cuối'}`,
    ]));
    add('Tổng lượng nguồn cần chuẩn bị', ['Dung dịch', 'Nhu cầu', 'Phần dư', 'Tổng cần chuẩn bị'], output.sourceDemand.map(row => [row.name, volume(row.requiredVolumeMl), `${number(row.residualPercent)} %`, volume(row.requiredWithResidualMl)]));
    add('Trình tự thao tác', ['Nội dung'], [...new Set([
      ...output.intermediateRows.filter(row => row.sourceId).map(row => row.operation),
      ...output.pointRows.map(row => row.operation), ...output.instructions,
    ])].map(text => [readable(text)]));
  }
  if (draft.mode === 'result_conversion' && output.kind === 'result_conversion') {
    subtitle = output.sampleName || 'Mẫu chưa có tên';
    input('Lượng mẫu ban đầu', quantity(draft.sampleAmount));
    input('Nồng độ trên máy', concentration(draft.instrument));
    input('Đơn vị kết quả mẫu', draft.resultUnit);
    add('Kết quả quy đổi', ['Thông số', 'Giá trị'], [
      ['Kết quả về mẫu ban đầu', `${number(output.resultValue)} ${output.resultUnit}`],
      ['Thể tích cuối', volume(output.finalVolumeMl)], ['Tỷ lệ chất còn lại sau xử lý', number(output.overallRetentionFraction)],
      ['Hệ số quy đổi', number(output.conversionFactor)], ['Hướng dẫn', output.operation],
    ]);
    add('Chuỗi xử lý và truy vết', ['Công đoạn', 'Số liệu khai báo', 'Giữ lại / tích lũy', 'Hệ số nồng độ'], output.stages.map(row => {
      const step = draft.steps.find(item => item.id === row.id);
      return [`${row.label}\n${stepLabels[row.type]}`, step?.volume ? quantity(step.volume) : step?.fraction != null ? `Phần giữ: ${number(step.fraction)}` : step?.recoveryPercent != null ? `Thu hồi: ${number(step.recoveryPercent)} %` : 'Chuyển toàn bộ', `${number(row.retentionFraction)} / ${number(row.cumulativeFraction)}`, number(row.concentrationFactor)];
    }), output.stages.map(row => `stage:${row.id}`));
  }

  const bodySections = sections.splice(0);
  add('Hồ sơ pha chế / phương pháp', ['Thông tin', 'Nội dung khai báo / ghi tay'], metadata.map(([label, value]) => [label, value?.trim() || blank]));
  add('Số liệu dùng để tính', ['Thông số', 'Giá trị khai báo'], inputs);
  sections.push(...bodySections);
  add('Công thức và phép thế số', ['Phép tính', 'Công thức / thế số', 'Kết quả'], calculation.trace.map(step => [step.label, `${step.expression}${step.substitution ? '\nThế số: ' + readable(step.substitution) : ''}`, step.value == null ? '—' : `${number(step.value)} ${step.unit || ''}`]));
  add('Cảnh báo và hướng dẫn kiểm tra', ['Mức', 'Nội dung'], calculation.issues.map(issue => [issue.severity === 'warning' ? 'Cảnh báo' : issue.severity === 'error' ? 'Lỗi' : 'Thông tin', `${issue.message}${issue.suggestedAction ? '\n' + issue.suggestedAction : ''}`]));
  add('Xác nhận thực hiện theo SOP', ['Người thực hiện', 'Người kiểm tra'], [[`Họ tên: ${blank}\nNgày: ${blank}\nChữ ký: ${blank}`, `Họ tên: ${blank}\nNgày: ${blank}\nChữ ký: ${blank}`]]);
  return {
    title: labels[draft.mode], subtitle, preparedAt: preparedAt.toLocaleString('vi-VN'),
    notice: 'Phiếu hỗ trợ tính toán. Ghi nhận lượng thực tế, kiểm tra và lưu hồ sơ theo SOP của phòng thí nghiệm.',
    sections,
  };
}
