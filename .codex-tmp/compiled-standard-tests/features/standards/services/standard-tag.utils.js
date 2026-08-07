"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STANDARD_DEVICE_OPTIONS = exports.MAX_BULK_WRITES = exports.MAX_STANDARD_TAGS = exports.MAX_RETURN_TAGS = void 0;
exports.buildTagKey = buildTagKey;
exports.parseTagKeyStrict = parseTagKeyStrict;
exports.normalizeTagKey = normalizeTagKey;
exports.normalizeTagKeysStrict = normalizeTagKeysStrict;
exports.sanitizeLegacyTagKeys = sanitizeLegacyTagKeys;
exports.assertTagLimit = assertTagLimit;
exports.mergeUniqueTagKeys = mergeUniqueTagKeys;
exports.resolveReturnTagMerge = resolveReturnTagMerge;
exports.applyTagMode = applyTagMode;
exports.summarizeStockByUnit = summarizeStockByUnit;
exports.formatStockSummary = formatStockSummary;
exports.normalizeNafi6ChemicalMethodCode = normalizeNafi6ChemicalMethodCode;
exports.compareChemicalMethodCodes = compareChemicalMethodCodes;
exports.formatMethodOptionLabel = formatMethodOptionLabel;
exports.formatMethodOptionLabelCompact = formatMethodOptionLabelCompact;
exports.buildAccreditationMethodTagId = buildAccreditationMethodTagId;
exports.deriveMethodSeries = deriveMethodSeries;
exports.deriveDeviceCodesFromTagKeys = deriveDeviceCodesFromTagKeys;
exports.normalizeDeviceAlias = normalizeDeviceAlias;
exports.MAX_RETURN_TAGS = 10;
exports.MAX_STANDARD_TAGS = 100;
exports.MAX_BULK_WRITES = 400;
const VALID_PREFIXES = ['sop', 'target-group', 'custom'];
const DEVICE_CODES = [
    'GC', 'GCECD', 'GCMS', 'GCMSMS', 'GCHRMS', 'LCMSMS', 'ICPMS', 'HPLC',
    'HPLCUVVIS', 'HPLCFLD', 'HPLCDAD', 'HPLCPDA', 'IC', 'UVVIS', 'AASFLAME', 'ELISA'
];
function prefixForSource(source) {
    switch (source) {
        case 'SOP': return 'sop';
        case 'TARGET_GROUP': return 'target-group';
        case 'CUSTOM': return 'custom';
    }
}
function sourceForPrefix(prefix) {
    switch (prefix.toLowerCase()) {
        case 'sop': return 'SOP';
        case 'target-group': return 'TARGET_GROUP';
        case 'custom': return 'CUSTOM';
        default: return null;
    }
}
function assertSafeTagId(id, contextLabel = 'tag') {
    const value = id.trim();
    if (!value)
        throw new Error(`${contextLabel} không được để trống.`);
    if (value.length > 200)
        throw new Error(`${contextLabel} vượt quá 200 ký tự.`);
    if (/[\/\u0000-\u001f\u007f]/.test(value)) {
        throw new Error(`${contextLabel} chứa ký tự không hợp lệ.`);
    }
    return value;
}
/** Builds a stable key while preserving the source ID's original case. */
function buildTagKey(source, sourceId) {
    return `${prefixForSource(source)}:${assertSafeTagId(sourceId, 'ID nhãn')}`;
}
function parseTagKeyStrict(key) {
    if (typeof key !== 'string')
        throw new Error('Nhãn phải là chuỗi key canonical.');
    const trimmed = key.trim();
    const separator = trimmed.indexOf(':');
    if (separator <= 0)
        throw new Error(`Key nhãn không hợp lệ: ${key}`);
    const prefix = trimmed.slice(0, separator).toLowerCase();
    if (!VALID_PREFIXES.includes(prefix)) {
        throw new Error(`Prefix nhãn không được phép: ${prefix}`);
    }
    const source = sourceForPrefix(prefix);
    if (!source)
        throw new Error(`Prefix nhãn không được phép: ${prefix}`);
    const id = assertSafeTagId(trimmed.slice(separator + 1), 'ID nhãn');
    return { source, id, key: `${prefix}:${id}` };
}
/** Singular convenience API used by callers that normalize one key at a time. */
function normalizeTagKey(key) {
    return parseTagKeyStrict(key).key;
}
function normalizeTagKeysStrict(keys, contextLabel = 'Nhãn') {
    if (!Array.isArray(keys))
        throw new Error(`${contextLabel} phải là một mảng.`);
    const result = [];
    const seen = new Set();
    for (const value of keys) {
        const normalized = normalizeTagKey(value);
        if (!seen.has(normalized)) {
            seen.add(normalized);
            result.push(normalized);
        }
    }
    return result;
}
/** Legacy reader: drops malformed entries but never changes a valid key's case. */
function sanitizeLegacyTagKeys(keys) {
    if (!Array.isArray(keys))
        return [];
    const result = [];
    const seen = new Set();
    for (const value of keys) {
        try {
            const parsed = parseTagKeyStrict(value);
            if (!seen.has(parsed.key)) {
                seen.add(parsed.key);
                result.push(parsed.key);
            }
        }
        catch {
            // Deliberately tolerant for legacy reads. Writes use strict validation.
        }
    }
    return result;
}
function assertTagLimit(tags, max, contextLabel) {
    if (tags.length > max) {
        throw new Error(`${contextLabel} tối đa ${max} nhãn (đã nhận ${tags.length}). Không tự động cắt nhãn.`);
    }
}
function mergeUniqueTagKeys(existing, incoming) {
    return normalizeTagKeysStrict([...existing, ...incoming], 'Nhãn');
}
function resolveReturnTagMerge(existingStandardTags, finalReturnTags) {
    const existing = sanitizeLegacyTagKeys(existingStandardTags);
    if (finalReturnTags === undefined || finalReturnTags === null) {
        return { standardTags: existing, status: 'NOT_REQUESTED' };
    }
    const finalTags = normalizeTagKeysStrict(finalReturnTags, 'Nhãn xác nhận hoàn trả');
    assertTagLimit(finalTags, exports.MAX_RETURN_TAGS, 'Nhãn xác nhận hoàn trả');
    if (finalTags.length === 0)
        return { standardTags: existing, status: 'NOT_REQUESTED' };
    const merged = mergeUniqueTagKeys(existing, finalTags);
    if (merged.length > exports.MAX_STANDARD_TAGS) {
        return {
            standardTags: existing,
            status: 'SKIPPED_LIMIT',
            warning: `Không gộp nhãn hoàn trả vì chất chuẩn đã vượt giới hạn ${exports.MAX_STANDARD_TAGS} nhãn.`,
        };
    }
    return { standardTags: merged, status: 'MERGED' };
}
function applyTagMode(currentTags, selectedTags, mode) {
    const current = sanitizeLegacyTagKeys(currentTags);
    const selected = normalizeTagKeysStrict(selectedTags, 'Nhãn được chọn');
    switch (mode) {
        case 'ADD': {
            const result = mergeUniqueTagKeys(current, selected);
            assertTagLimit(result, exports.MAX_STANDARD_TAGS, 'Nhãn chất chuẩn');
            return result;
        }
        case 'REMOVE':
            return current.filter(key => !selected.includes(key));
        case 'REPLACE':
            assertTagLimit(selected, exports.MAX_STANDARD_TAGS, 'Nhãn chất chuẩn');
            return selected;
    }
}
function normalizeUnit(unit) {
    const raw = String(unit ?? '').trim().toLowerCase().replace(/[μµ]/g, 'u');
    if (!raw)
        return 'unknown';
    if (raw === 'ul' || raw === 'microliter' || raw === 'microlitre')
        return 'ul';
    return raw;
}
const UNIT_ORDER = ['kg', 'g', 'mg', 'ug', 'ng', 'l', 'ml', 'ul', 'tube', 'kit', 'unknown'];
function summarizeStockByUnit(standards) {
    const totals = new Map();
    for (const standard of standards) {
        const amount = Number(standard.current_amount);
        if (!Number.isFinite(amount) || amount <= 0)
            continue;
        const unit = normalizeUnit(standard.unit);
        totals.set(unit, (totals.get(unit) || 0) + amount);
    }
    const byUnit = [...totals.entries()]
        .map(([unit, totalAmount]) => ({ unit, totalAmount }))
        .sort((a, b) => {
        const ai = UNIT_ORDER.indexOf(a.unit);
        const bi = UNIT_ORDER.indexOf(b.unit);
        return (ai < 0 ? UNIT_ORDER.length : ai) - (bi < 0 ? UNIT_ORDER.length : bi)
            || a.unit.localeCompare(b.unit);
    });
    return { totalContainers: standards.length, byUnit };
}
function formatStockSummary(summary) {
    const numberFormat = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 6 });
    const parts = summary.byUnit.map(item => `${numberFormat.format(item.totalAmount)} ${item.unit}`);
    return parts.length ? `${parts.join(' · ')} · ${summary.totalContainers} lọ` : `0 · ${summary.totalContainers} lọ`;
}
function normalizeNafi6ChemicalMethodCode(value) {
    const normalized = String(value ?? '').trim().replace(/\s+/g, '');
    const match = /^NAFI6\/H-(\d+)\.(\d+)$/i.exec(normalized);
    if (!match)
        throw new Error(`Mã phương pháp hóa học không hợp lệ: ${value}`);
    return `NAFI6/H-${match[1]}.${match[2]}`;
}
/** Natural numeric ordering: H-1.2, H-1.6, H-1.10 (not lexical 1.10 before 1.2). */
function compareChemicalMethodCodes(left, right) {
    const a = String(left ?? '').trim();
    const b = String(right ?? '').trim();
    const aMatch = /^NAFI6\/H-(\d+)\.(\d+)$/i.exec(a);
    const bMatch = /^NAFI6\/H-(\d+)\.(\d+)$/i.exec(b);
    if (aMatch && bMatch) {
        return Number(aMatch[1]) - Number(bMatch[1])
            || Number(aMatch[2]) - Number(bMatch[2])
            || a.localeCompare(b);
    }
    if (aMatch)
        return -1;
    if (bMatch)
        return 1;
    return a.localeCompare(b, 'vi', { sensitivity: 'base', numeric: true });
}
const COMPACT_DEVICE_LABELS = {
    GCMS: 'GC-MS',
    GCMSMS: 'GC-MS/MS',
    GCHRMS: 'GC-HRMS',
    LCMSMS: 'LC-MS/MS',
    ICPMS: 'ICP-MS',
};
function resolveMethodOptionCode(option) {
    return option.methodCode?.trim() || ('label' in option ? option.label : option.name);
}
function extractMethodTechnique(methodName) {
    const text = methodName?.trim();
    if (!text)
        return '';
    const marker = 'phương pháp';
    const markerIndex = text.toLocaleLowerCase('vi').lastIndexOf(marker);
    if (markerIndex < 0)
        return '';
    const technique = text
        .slice(markerIndex + marker.length)
        .trim()
        .replace(/^[\s:;,.–—-]+/, '')
        .replace(/\s*-\s*/g, '-')
        .replace(/\s+/g, ' ');
    return technique.length <= 80 ? technique : '';
}
function formatMethodOptionLabel(option) {
    const code = resolveMethodOptionCode(option);
    return option.methodName ? `${code} — ${option.methodName}` : code;
}
/** Compact label for constrained controls such as filters and selected chips. */
function formatMethodOptionLabelCompact(option) {
    const code = resolveMethodOptionCode(option);
    const deviceLabels = [...new Set(option.deviceCodes || [])]
        .map(deviceCode => COMPACT_DEVICE_LABELS[deviceCode]
        || exports.STANDARD_DEVICE_OPTIONS.find(item => item.code === deviceCode)?.label
        || deviceCode);
    const technique = deviceLabels.join(', ') || extractMethodTechnique(option.methodName);
    return technique ? `${code} · ${technique}` : code;
}
function buildAccreditationMethodTagId(methodCode) {
    const normalized = normalizeNafi6ChemicalMethodCode(methodCode).toLowerCase();
    return `method-${normalized.replace('/', '-').replace(/[^a-z0-9.-]+/g, '-')}`;
}
function deriveMethodSeries(methodCode) {
    const normalized = normalizeNafi6ChemicalMethodCode(methodCode);
    return normalized.slice('NAFI6/'.length).split('.')[0];
}
function deriveDeviceCodesFromTagKeys(tagKeys, catalog) {
    const keys = sanitizeLegacyTagKeys(tagKeys);
    const byId = new Map(catalog.map(item => [buildTagKey('CUSTOM', item.id), item]));
    const result = new Set();
    for (const key of keys) {
        const item = byId.get(key);
        for (const code of item?.deviceCodes || []) {
            if (DEVICE_CODES.includes(code))
                result.add(code);
        }
    }
    return [...result].sort((a, b) => a.localeCompare(b));
}
exports.STANDARD_DEVICE_OPTIONS = [
    ['GC', 'GC', ['gc'], '#64748b'],
    ['GCECD', 'GC-ECD', ['gc-ecd', 'gcecd'], '#0f766e'],
    ['GCMS', 'GCMS', ['gc-ms', 'gcms'], '#2563eb'],
    ['GCMSMS', 'GCMSMS', ['gc-ms-ms', 'gcmsms'], '#7c3aed'],
    ['GCHRMS', 'GCHRMS', ['gc-hrms', 'gchrms'], '#9333ea'],
    ['LCMSMS', 'LCMSMS', ['lc-ms-ms', 'lcmsms'], '#db2777'],
    ['ICPMS', 'ICPMS', ['icp-ms', 'icpms'], '#ea580c'],
    ['HPLC', 'HPLC', ['hplc'], '#0891b2'],
    ['HPLCUVVIS', 'HPLC-UV/VIS', ['hplc-uv-vis'], '#0284c7'],
    ['HPLCFLD', 'HPLC-FLD', ['hplc-fld'], '#16a34a'],
    ['HPLCDAD', 'HPLC-DAD', ['hplc-dad'], '#65a30d'],
    ['HPLCPDA', 'HPLC-PDA', ['hplc-pda'], '#ca8a04'],
    ['IC', 'IC', ['ion chromatography'], '#c2410c'],
    ['UVVIS', 'UV/VIS', ['uv-vis', 'uvvis'], '#dc2626'],
    ['AASFLAME', 'AAS FLAME', ['aas-flame'], '#475569'],
    ['ELISA', 'ELISA', ['elisa'], '#be123c'],
].map(([code, label, aliases, color], index) => ({
    key: `device:${String(code).toLowerCase()}`,
    code: code,
    label: String(label),
    aliases: aliases,
    color: String(color),
    sortOrder: index,
}));
function normalizeDeviceAlias(value) {
    const normalized = String(value ?? '').trim().toLowerCase().replace(/[\s_./-]+/g, '');
    if (!normalized)
        return null;
    const option = exports.STANDARD_DEVICE_OPTIONS.find(item => {
        const candidates = [item.code, item.label, ...item.aliases]
            .map(candidate => candidate.toLowerCase().replace(/[\s_./-]+/g, ''));
        return candidates.includes(normalized);
    });
    return option?.code || null;
}
