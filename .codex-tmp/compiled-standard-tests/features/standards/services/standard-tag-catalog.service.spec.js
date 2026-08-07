"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const vlat_1_1669_487_20251015_chemical_method_tags_1 = require("./vlat-1-1669-487-20251015-chemical-method-tags");
const vlat_1_1669_20251015_chemical_method_names_1 = require("./vlat-1-1669-20251015-chemical-method-names");
const standard_tag_utils_1 = require("./standard-tag.utils");
(0, node_test_1.default)('VLAT catalog contains only the reviewed 119 chemical methods', () => {
    strict_1.default.equal(vlat_1_1669_487_20251015_chemical_method_tags_1.VLAT_11669_CHEMICAL_METHOD_TAGS.length, 119);
    strict_1.default.equal(Object.keys(vlat_1_1669_20251015_chemical_method_names_1.VLAT_11669_METHOD_NAMES).length, 119);
    const counts = new Map();
    const keys = new Set();
    for (const item of vlat_1_1669_487_20251015_chemical_method_tags_1.VLAT_11669_CHEMICAL_METHOD_TAGS) {
        strict_1.default.match(item.methodCode || '', /^NAFI6\/H-\d+\.\d+$/);
        strict_1.default.equal(item.origin, 'ACCREDITATION_SCOPE');
        strict_1.default.equal(item.templateKind, 'TEST_METHOD');
        strict_1.default.equal(item.name, item.methodCode);
        strict_1.default.equal(item.code, item.methodCode);
        strict_1.default.match(item.methodName || '', /^X(?:á|á|a)c\s+đ/i);
        strict_1.default.equal(item.sourceDecision, '487/QĐ-AOSC');
        strict_1.default.equal(item.sourceLabCode, 'VLAT-1.1669');
        strict_1.default.equal(item.sourceSha256, vlat_1_1669_487_20251015_chemical_method_tags_1.VLAT_11669_SOURCE.sourceSha256);
        strict_1.default.equal(item.locked, true);
        strict_1.default.ok(item.deviceCodes);
        strict_1.default.ok(item.deviceCodes.length <= 5);
        const key = (0, standard_tag_utils_1.buildTagKey)('CUSTOM', item.id);
        strict_1.default.equal(keys.has(key), false);
        keys.add(key);
        const series = (0, standard_tag_utils_1.deriveMethodSeries)(item.methodCode);
        counts.set(series, (counts.get(series) || 0) + 1);
    }
    strict_1.default.deepEqual(Object.fromEntries(counts), {
        'H-1': 15,
        'H-2': 4,
        'H-3': 1,
        'H-5': 5,
        'H-6': 11,
        'H-7': 16,
        'H-8': 47,
        'H-9': 17,
        'H-13': 3,
    });
});
(0, node_test_1.default)('VLAT catalog maps the reviewed method groups used by the technique facet', () => {
    const byCode = new Map(vlat_1_1669_487_20251015_chemical_method_tags_1.VLAT_11669_CHEMICAL_METHOD_TAGS.map(item => [item.methodCode, item]));
    const deviceCounts = new Map();
    for (const item of vlat_1_1669_487_20251015_chemical_method_tags_1.VLAT_11669_CHEMICAL_METHOD_TAGS) {
        for (const device of new Set(item.deviceCodes || [])) {
            deviceCounts.set(device, (deviceCounts.get(device) || 0) + 1);
        }
    }
    strict_1.default.deepEqual(Object.fromEntries(deviceCounts), {
        UVVIS: 3,
        IC: 2,
        ELISA: 1,
        AASFLAME: 1,
        ICPMS: 10,
        HPLC: 9,
        HPLCPDA: 3,
        HPLCUVVIS: 2,
        HPLCDAD: 1,
        HPLCFLD: 1,
        LCMSMS: 47,
        GCMS: 4,
        GCMSMS: 11,
        GCHRMS: 1,
        GC: 1,
        GCECD: 1,
    });
    strict_1.default.deepEqual(byCode.get('NAFI6/H-8.2')?.deviceCodes, ['LCMSMS']);
    strict_1.default.deepEqual(byCode.get('NAFI6/H-8.21')?.deviceCodes, ['LCMSMS']);
    strict_1.default.deepEqual(byCode.get('NAFI6/H-8.41')?.deviceCodes, ['LCMSMS']);
    strict_1.default.deepEqual(byCode.get('NAFI6/H-9.2')?.deviceCodes, ['GCMSMS']);
    strict_1.default.deepEqual(byCode.get('NAFI6/H-9.5')?.deviceCodes, ['GCMS', 'GCMSMS']);
    strict_1.default.deepEqual(byCode.get('NAFI6/H-9.21')?.deviceCodes, ['GCMSMS']);
    strict_1.default.deepEqual(byCode.get('NAFI6/H-9.22')?.deviceCodes, ['GCECD']);
    strict_1.default.deepEqual(byCode.get('NAFI6/H-9.10')?.deviceCodes, ['GCHRMS']);
    strict_1.default.deepEqual(byCode.get('NAFI6/H-7.22')?.deviceCodes, ['HPLCDAD']);
    strict_1.default.deepEqual(byCode.get('NAFI6/H-7.17')?.deviceCodes, ['HPLCPDA']);
    strict_1.default.deepEqual(byCode.get('NAFI6/H-7.24')?.deviceCodes, ['HPLCPDA']);
    strict_1.default.equal(byCode.has('NAFI6/H-8.15'), false);
    strict_1.default.equal(byCode.has('NAFI6/H-8.31'), false);
});
