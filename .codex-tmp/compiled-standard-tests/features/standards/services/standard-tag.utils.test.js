"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const standard_tag_utils_1 = require("./standard-tag.utils");
const vlat_1_1669_487_20251015_chemical_method_tags_1 = require("./vlat-1-1669-487-20251015-chemical-method-tags");
(0, node_test_1.default)('canonical tag parser preserves source ID casing', () => {
    strict_1.default.equal((0, standard_tag_utils_1.parseTagKeyStrict)('SOP:SOP-9.16').key, 'sop:SOP-9.16');
    strict_1.default.equal((0, standard_tag_utils_1.normalizeTagKey)('SOP:SOP-9.16'), 'sop:SOP-9.16');
    strict_1.default.equal((0, standard_tag_utils_1.buildTagKey)('SOP', 'SOP-9.16'), 'sop:SOP-9.16');
    strict_1.default.equal((0, standard_tag_utils_1.parseTagKeyStrict)('target-group:Group_A').id, 'Group_A');
    strict_1.default.throws(() => (0, standard_tag_utils_1.parseTagKeyStrict)('device:gcms'));
});
(0, node_test_1.default)('strict normalization deduplicates canonical keys without lowercasing suffixes', () => {
    strict_1.default.deepEqual((0, standard_tag_utils_1.normalizeTagKeysStrict)(['SOP:SOP-9.16', 'sop:SOP-9.16', 'custom:ABC']), [
        'sop:SOP-9.16', 'custom:ABC'
    ]);
    strict_1.default.deepEqual((0, standard_tag_utils_1.normalizeTagKeysStrict)([]), []);
    strict_1.default.throws(() => (0, standard_tag_utils_1.normalizeTagKeysStrict)(['not-a-key']));
});
(0, node_test_1.default)('one return report can retain multiple method labels', () => {
    const first = (0, standard_tag_utils_1.buildTagKey)('CUSTOM', vlat_1_1669_487_20251015_chemical_method_tags_1.VLAT_11669_CHEMICAL_METHOD_TAGS[0].id);
    const second = (0, standard_tag_utils_1.buildTagKey)('CUSTOM', vlat_1_1669_487_20251015_chemical_method_tags_1.VLAT_11669_CHEMICAL_METHOD_TAGS[1].id);
    strict_1.default.deepEqual((0, standard_tag_utils_1.normalizeTagKeysStrict)([first, second]), [first, second]);
    const merged = (0, standard_tag_utils_1.resolveReturnTagMerge)([], [first, second]);
    strict_1.default.equal(merged.status, 'MERGED');
    strict_1.default.deepEqual(merged.standardTags, [first, second]);
});
(0, node_test_1.default)('chemical method codes use natural numeric ordering', () => {
    const values = ['NAFI6/H-1.11', 'NAFI6/H-1.2', 'NAFI6/H-1.10', 'NAFI6/H-1.3', 'NAFI6/H-10.1'];
    values.sort(standard_tag_utils_1.compareChemicalMethodCodes);
    strict_1.default.deepEqual(values, ['NAFI6/H-1.2', 'NAFI6/H-1.3', 'NAFI6/H-1.10', 'NAFI6/H-1.11', 'NAFI6/H-10.1']);
});
(0, node_test_1.default)('catalog labels show the method code and Vietnamese test name together', () => {
    const option = vlat_1_1669_487_20251015_chemical_method_tags_1.VLAT_11669_CHEMICAL_METHOD_TAGS.find(item => item.methodCode === 'NAFI6/H-8.41');
    strict_1.default.match((0, standard_tag_utils_1.formatMethodOptionLabel)(option), /^NAFI6\/H-8\.41 — Xác định /);
});
(0, node_test_1.default)('compact method labels keep long method names out of filters and chips', () => {
    const option = vlat_1_1669_487_20251015_chemical_method_tags_1.VLAT_11669_CHEMICAL_METHOD_TAGS.find(item => item.methodCode === 'NAFI6/H-9.4');
    const fullLabel = (0, standard_tag_utils_1.formatMethodOptionLabel)(option);
    const compactLabel = (0, standard_tag_utils_1.formatMethodOptionLabelCompact)(option);
    strict_1.default.match(fullLabel, /Aldrin/);
    strict_1.default.equal(compactLabel, 'NAFI6/H-9.4 · GC-MS/MS');
    strict_1.default.ok(compactLabel.length < fullLabel.length);
});
(0, node_test_1.default)('tag limit reports overflow instead of silently dropping tags', () => {
    strict_1.default.throws(() => (0, standard_tag_utils_1.assertTagLimit)(new Array(11).fill('custom:x'), 10, 'return'), /tối đa 10/);
});
(0, node_test_1.default)('return merge keeps standard tags on overflow and records warning', () => {
    const existing = Array.from({ length: 100 }, (_, i) => `custom:t${i}`);
    const result = (0, standard_tag_utils_1.resolveReturnTagMerge)(existing, ['custom:new']);
    strict_1.default.equal(result.status, 'SKIPPED_LIMIT');
    strict_1.default.deepEqual(result.standardTags, existing);
    strict_1.default.match(result.warning || '', /vượt giới hạn/);
});
(0, node_test_1.default)('bulk ADD/REMOVE/REPLACE semantics are deterministic', () => {
    strict_1.default.deepEqual((0, standard_tag_utils_1.applyTagMode)(['custom:a'], ['custom:b'], 'ADD'), ['custom:a', 'custom:b']);
    strict_1.default.deepEqual((0, standard_tag_utils_1.applyTagMode)(['custom:a', 'custom:b'], ['custom:a'], 'REMOVE'), ['custom:b']);
    strict_1.default.deepEqual((0, standard_tag_utils_1.applyTagMode)(['custom:a'], [], 'REPLACE'), []);
});
(0, node_test_1.default)('stock summary never mixes units and reports container count', () => {
    const summary = (0, standard_tag_utils_1.summarizeStockByUnit)([
        { current_amount: 1250, unit: 'mg' },
        { current_amount: 340, unit: 'ml' },
        { current_amount: 3, unit: 'tube' },
        { current_amount: 5, unit: 'µl' },
    ]);
    strict_1.default.equal(summary.totalContainers, 4);
    strict_1.default.deepEqual(summary.byUnit.map(item => item.unit), ['mg', 'ml', 'ul', 'tube']);
    strict_1.default.match((0, standard_tag_utils_1.formatStockSummary)(summary), /1\.250 mg/);
});
(0, node_test_1.default)('chemical manifest contains exactly the reviewed chemical method set', () => {
    strict_1.default.equal(vlat_1_1669_487_20251015_chemical_method_tags_1.VLAT_11669_CHEMICAL_METHOD_CODES.length, 119);
    strict_1.default.equal(new Set(vlat_1_1669_487_20251015_chemical_method_tags_1.VLAT_11669_CHEMICAL_METHOD_CODES).size, 119);
    strict_1.default.equal(vlat_1_1669_487_20251015_chemical_method_tags_1.VLAT_11669_CHEMICAL_METHOD_TAGS.length, 119);
    strict_1.default.equal(vlat_1_1669_487_20251015_chemical_method_tags_1.VLAT_11669_CHEMICAL_METHOD_TAGS.find(item => item.methodCode === 'NAFI6/H-8.41')?.id, 'vlat-1-1669-487-20251015-method-nafi6-h-8.41');
    strict_1.default.deepEqual(vlat_1_1669_487_20251015_chemical_method_tags_1.VLAT_11669_CHEMICAL_METHOD_TAGS.find(item => item.methodCode === 'NAFI6/H-8.41')?.deviceCodes, ['LCMSMS']);
    strict_1.default.deepEqual(vlat_1_1669_487_20251015_chemical_method_tags_1.VLAT_11669_CHEMICAL_METHOD_TAGS.find(item => item.methodCode === 'NAFI6/H-9.10')?.deviceCodes, ['GCHRMS']);
    strict_1.default.equal((0, standard_tag_utils_1.normalizeNafi6ChemicalMethodCode)(' nafi6 / h-9.21 '), 'NAFI6/H-9.21');
    strict_1.default.equal((0, standard_tag_utils_1.buildAccreditationMethodTagId)('NAFI6/H-9.21'), 'method-nafi6-h-9.21');
    strict_1.default.equal(vlat_1_1669_487_20251015_chemical_method_tags_1.VLAT_11669_CHEMICAL_METHOD_TAGS.some(item => item.methodCode?.includes('BIO')), false);
    strict_1.default.match(vlat_1_1669_487_20251015_chemical_method_tags_1.VLAT_11669_CHEMICAL_METHOD_TAGS.find(item => item.methodCode === 'NAFI6/H-8.41')?.methodName || '', /^X/);
});
(0, node_test_1.default)('device aliases resolve to the specific read-only secondary label', () => {
    strict_1.default.equal((0, standard_tag_utils_1.normalizeDeviceAlias)('GC-MS/MS'), 'GCMSMS');
    strict_1.default.equal((0, standard_tag_utils_1.normalizeDeviceAlias)('GC-MS'), 'GCMS');
    strict_1.default.equal((0, standard_tag_utils_1.normalizeDeviceAlias)('LC-MS/MS'), 'LCMSMS');
    strict_1.default.equal((0, standard_tag_utils_1.normalizeDeviceAlias)('GC-HRMS'), 'GCHRMS');
    strict_1.default.equal((0, standard_tag_utils_1.normalizeDeviceAlias)('free text device'), null);
});
