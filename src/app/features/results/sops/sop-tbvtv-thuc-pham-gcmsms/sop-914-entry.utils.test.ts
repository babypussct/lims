import assert from 'node:assert/strict';
import test from 'node:test';
import {
  deriveSop914DetectionFlags,
  getSop914DefaultVial,
  getSop914TemplateMetadata,
  migrateSop914QcKeys
} from './sop-914-entry.utils';

test('SOP 9.14 migrates legacy UI QC keys to backend/GAS keys', () => {
  const page1Data: Record<string, any> = {
    qcNhanDangMauNhiem: true,
    qcNhanDangSpike: false,
    qcThuHoiIS: true
  };

  migrateSop914QcKeys(page1Data);

  assert.equal(page1Data['qcNhanDang'], true);
  assert.equal(page1Data['qcThemChuan'], false);
  assert.equal(page1Data['qcThuHoi'], true);
});

test('SOP 9.14 detection flags follow edited compact-form results', () => {
  const isAssigned = () => true;

  const allNd = deriveSop914DetectionFlags(
    ['A001'],
    { A001: { selected: true, kqFip: 'ND' } },
    ['kqFip'],
    true,
    isAssigned
  );
  assert.equal(allNd.checkTatCaND, true);
  assert.equal(allNd.checkCoMauPhatHien, false);

  const detected = deriveSop914DetectionFlags(
    ['A001'],
    { A001: { selected: true, kqFip: '0.25' } },
    ['kqFip'],
    true,
    isAssigned
  );
  assert.equal(detected.checkTatCaND, false);
  assert.equal(detected.checkCoMauPhatHien, true);

  const cleared = deriveSop914DetectionFlags(
    ['A001'],
    { A001: { selected: true, kqFip: '' } },
    ['kqFip'],
    true,
    isAssigned
  );
  assert.equal(cleared.checkTatCaND, false);
  assert.equal(cleared.checkCoMauPhatHien, false);
});

test('SOP 9.14 default sample vials start at 1.10 and roll racks correctly', () => {
  assert.equal(getSop914DefaultVial(0), '1.10');
  assert.equal(getSop914DefaultVial(1), '1.11');
  assert.equal(getSop914DefaultVial(44), '1.54');
  assert.equal(getSop914DefaultVial(45), '2.1');
});

test('SOP 9.14 template metadata uses central full/compact IDs in the correct direction', () => {
  const full = getSop914TemplateMetadata('formDayDu');
  const compact = getSop914TemplateMetadata('formRutGon');

  assert.ok(full.templateDocId.startsWith('1a-'));
  assert.ok(compact.templateDocId.startsWith('1b-'));
  assert.match(full.templateDocUrl, new RegExp(full.templateDocId));
  assert.match(compact.templateDocUrl, new RegExp(compact.templateDocId));
});
