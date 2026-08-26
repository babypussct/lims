import assert from 'node:assert/strict';
import test from 'node:test';
import { buildGeneratePdfRequestId, GeneratePdfRequestIdInput } from './report-request-id';

function baseInput(): GeneratePdfRequestIdInput {
  return {
    batchRequestId: 'batch-001',
    version: 1,
    prefix: 'A',
    includedSamples: ['A02', 'A01'],
    sopId: 'nhom-cuc',
    metadata: {
      batchCode: 'BATCH-001',
      ngayNguoiPhanTich: '26/08/2026',
      targetInfo: { b: 'Beta', a: 'Alpha' },
    },
    samples: [
      { maSoMau: 'A01', etofenprox: '1.20' },
      { maSoMau: 'A02', etofenprox: 'ND' },
    ],
  };
}

test('keeps the same request ID for an identical payload regardless of object key order', () => {
  const first = baseInput();
  const second = baseInput();
  second.metadata = {
    targetInfo: { a: 'Alpha', b: 'Beta' },
    ngayNguoiPhanTich: '26/08/2026',
    batchCode: 'BATCH-001',
  };

  assert.equal(buildGeneratePdfRequestId(first), buildGeneratePdfRequestId(second));
});

test('changes the request ID when a result value changes under the same report scope and version', () => {
  const changed = baseInput();
  changed.samples = [
    { maSoMau: 'A01', etofenprox: '9.99' },
    { maSoMau: 'A02', etofenprox: 'ND' },
  ];

  assert.notEqual(buildGeneratePdfRequestId(baseInput()), buildGeneratePdfRequestId(changed));
});

test('changes the request ID when metadata or SOP changes', () => {
  const changedMetadata = baseInput();
  changedMetadata.metadata = {
    ...(changedMetadata.metadata as Record<string, unknown>),
    batchCode: 'BATCH-002',
  };
  const changedSop = { ...baseInput(), sopId: 'nhom-i' };

  assert.notEqual(buildGeneratePdfRequestId(baseInput()), buildGeneratePdfRequestId(changedMetadata));
  assert.notEqual(buildGeneratePdfRequestId(baseInput()), buildGeneratePdfRequestId(changedSop));
});

test('keeps the key within GAS requestId limits for normal batch IDs', () => {
  const requestId = buildGeneratePdfRequestId(baseInput());

  assert.match(requestId, /^pdf:v2:batch-001:v1:[0-9a-f]{16}:[0-9a-f]{16}$/);
  assert.ok(requestId.length <= 200);
});
