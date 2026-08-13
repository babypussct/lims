import assert from 'node:assert/strict';
import test from 'node:test';
import { SampleGroupWizardGroup } from '../../core/models/sample-group.model';
import {
  canonicalTargetIds,
  createSampleGroupWizardGroup,
  normalizeWizardSampleCodes,
  normalizeWizardSamples,
  parseWizardSampleEntries,
  sampleGroupCompletionIssues,
  subsetSampleGroupWizardGroups
} from './sample-group.utils';

function completeGroup(overrides: Partial<SampleGroupWizardGroup> = {}): SampleGroupWizardGroup {
  return {
    id: 'group-1',
    name: 'Nhóm mẫu 1',
    rawSamples: 'M01\nM02',
    matrixType: 'food',
    sampleDescriptionMap: {
      M01: { nameSnapshot: 'Cá tra' },
      M02: { nameSnapshot: 'Cá basa' }
    },
    selectedTargets: new Set(['chlorpyrifos', 'fipronil']),
    ...overrides
  };
}

test('wizard normalizes newline, comma and semicolon sample entry without losing first display form', () => {
  assert.deepEqual(
    normalizeWizardSampleCodes(' M01\nM02, M01;M03 '),
    ['M01', 'M02', 'M03']
  );
});

test('wizard accepts tab-separated code and description in the existing sample field', () => {
  assert.deepEqual(
    parseWizardSampleEntries('0311\tCá tra\n0411\tCá tra'),
    [
      { code: '0311', description: 'Cá tra' },
      { code: '0411', description: 'Cá tra' }
    ]
  );
});

test('wizard preserves punctuation inside a TAB-separated description', () => {
  assert.deepEqual(
    parseWizardSampleEntries('0311\tCá tra, phi lê; đông lạnh'),
    [{ code: '0311', description: 'Cá tra, phi lê; đông lạnh' }]
  );
});

test('wizard keeps both sample codes when descriptions are equivalent', () => {
  assert.deepEqual(
    normalizeWizardSamples(
      ['0311', '0411'],
      {
        '0311': { nameSnapshot: 'Cá tra' },
        '0411': { nameSnapshot: ' cá TRA ' }
      }
    ),
    {
      sampleCodes: ['0311', '0411'],
      sampleDescriptions: {
        '0311': { nameSnapshot: 'Cá tra' },
        '0411': { nameSnapshot: 'cá TRA' }
      }
    }
  );
});

test('wizard group stores both codes and the same description in existing group fields', () => {
  const group = createSampleGroupWizardGroup({
    id: 'group-1',
    name: 'Nhóm mẫu 1',
    rawSamples: '0311\tCá tra\n0411\tCá tra',
    selectedTargets: ['fipronil']
  });

  assert.equal(group.rawSamples, '0311\n0411');
  assert.deepEqual(group.sampleDescriptionMap, {
    '0311': { nameSnapshot: 'Cá tra' },
    '0411': { nameSnapshot: 'Cá tra' }
  });
  assert.deepEqual(Array.from(group.selectedTargets), ['fipronil']);
});

test('wizard preserves existing target-group provenance without adding a persistence contract', () => {
  const group = createSampleGroupWizardGroup({
    id: 'group-1',
    name: 'Nhóm mẫu 1',
    rawSamples: '0311\tCá tra',
    selectedTargets: ['fipronil'],
    sourceGroupId: 'target-group-fipronil',
    sourceGroupModified: false
  });

  assert.equal(group.sourceGroupId, 'target-group-fipronil');
  assert.equal(group.sourceGroupModified, false);
});

test('wizard canonicalizes target identities before persistence', () => {
  assert.deepEqual(canonicalTargetIds(['Acephate', 'acephate', 'legacy-target']), [
    'acephate',
    'legacy_target'
  ]);
});

test('wizard requires a description for every existing sample code before completion', () => {
  const issues = sampleGroupCompletionIssues(completeGroup({
    sampleDescriptionMap: { M01: { nameSnapshot: 'Cá tra' } }
  }));

  assert.equal(issues.some(issue => issue.includes('mô tả')), true);
});

test('wizard group subset keeps only source samples that are actually in the physical batch', () => {
  const details = [
    completeGroup(),
    completeGroup({ id: 'group-2', name: 'Nhóm mẫu 2', rawSamples: 'M03', sampleDescriptionMap: { M03: { nameSnapshot: 'Tôm' } } })
  ];
  const selected = subsetSampleGroupWizardGroups(details, ['group-1'], ['M02']);

  assert.deepEqual(selected.map(group => group.id), ['group-1']);
  assert.equal(selected[0].rawSamples, 'M02');
  assert.deepEqual(Object.keys(selected[0].sampleDescriptionMap), ['M02']);
});
