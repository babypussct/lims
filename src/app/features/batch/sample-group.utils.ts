import { Sop, SopTarget } from '../../core/models/sop.model';
import { SampleDescriptionMap } from '../../core/models/sample-description.model';
import { SampleGroupWizardGroup } from '../../core/models/sample-group.model';
import { getSampleDescriptionSnapshot } from '../../shared/utils/sample-description.utils';
import { getCanonicalId, normalizeSampleCode } from '../results/shared/compound-id-resolver';
import { getForcedSopAssignmentIssue } from './smart-batch.utils';

export const ANY_MATRIX_SELECTION = '__any__';
export const ANY_MATRIX_LABEL = 'Bất kỳ (không lọc SOP)';

export interface SampleGroupWizardSource {
  id: string;
  name: string;
  rawSamples: string;
  matrixType?: string;
  sampleDescriptionMap?: SampleDescriptionMap;
  selectedTargets: Iterable<string>;
  forcedSopId?: string;
  sourceGroupId?: string;
  sourceGroupModified?: boolean;
}

export interface WizardSampleEntry {
  code: string;
  description?: string;
}

export interface OptimizedWizardSamples {
  sampleCodes: string[];
  sampleDescriptions: SampleDescriptionMap;
}

export function parseWizardSampleEntries(value: unknown): WizardSampleEntry[] {
  const raw = Array.isArray(value) ? value.join('\n') : String(value || '');
  const unique = new Map<string, WizardSampleEntry>();
  const lines = raw
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .flatMap(line => {
      // TAB marks the boundary between the code and its free-form
      // description. Do not split commas/semicolons on such a line.
      if (/\t+/.test(line)) return [line];
      const parts = line.split(/[;,]/).map(part => part.trim()).filter(Boolean);
      const isCodeList = parts.length > 1 && parts.every(part => /^[^\s,;]+$/u.test(part));
      return isCodeList ? parts : [line];
    });

  lines.forEach(line => {
      const [rawCode, ...rawDescription] = line.split(/\t+/);
      const code = rawCode.trim();
      const key = code.toLocaleLowerCase('vi');
      if (!code || unique.has(key)) return;
      const description = rawDescription.join(' ').trim();
      unique.set(key, description ? { code, description } : { code });
    });
  return Array.from(unique.values());
}

export function normalizeWizardSampleCodes(value: unknown): string[] {
  return parseWizardSampleEntries(value).map(entry => entry.code);
}

/** Keep distinct sample codes and copy each code's own description snapshot. */
export function normalizeWizardSamples(
  sampleCodes: string[],
  sampleDescriptions: SampleDescriptionMap
): OptimizedWizardSamples {
  const seenCodes = new Set<string>();
  const normalizedCodes: string[] = [];
  const normalizedDescriptions: SampleDescriptionMap = {};

  sampleCodes.forEach(sampleCode => {
    const code = String(sampleCode || '').trim();
    const codeKey = normalizeSampleCode(code);
    if (!codeKey || seenCodes.has(codeKey)) return;
    seenCodes.add(codeKey);
    normalizedCodes.push(code);
    const snapshot = getSampleDescriptionSnapshot(sampleDescriptions, code);
    if (snapshot) normalizedDescriptions[code] = { ...snapshot };
  });

  return { sampleCodes: normalizedCodes, sampleDescriptions: normalizedDescriptions };
}

export function canonicalTargetIds(targetIds: Iterable<string>): string[] {
  return Array.from(new Set(Array.from(targetIds)
    .map(targetId => getCanonicalId(String(targetId || '')))
    .filter(Boolean)))
    .sort((a, b) => a.localeCompare(b));
}

export function createSampleGroupWizardGroup(source: SampleGroupWizardSource): SampleGroupWizardGroup {
  const entries = parseWizardSampleEntries(source.rawSamples);
  const sampleCodes = entries.map(entry => entry.code);
  const sampleDescriptions: SampleDescriptionMap = {};

  entries.forEach(entry => {
    const snapshot = entry.description
      ? { nameSnapshot: entry.description }
      : getSampleDescriptionSnapshot(source.sampleDescriptionMap, entry.code);
    if (snapshot?.nameSnapshot?.trim()) sampleDescriptions[entry.code] = { ...snapshot };
  });

  const normalized = normalizeWizardSamples(sampleCodes, sampleDescriptions);
  return {
    id: source.id,
    name: source.name,
    rawSamples: normalized.sampleCodes.join('\n'),
    matrixType: source.matrixType,
    sampleDescriptionMap: normalized.sampleDescriptions,
    selectedTargets: new Set(canonicalTargetIds(source.selectedTargets)),
    forcedSopId: source.forcedSopId,
    sourceGroupId: source.sourceGroupId,
    sourceGroupModified: source.sourceGroupModified
  };
}

export function sampleGroupCompletionIssues(
  group: SampleGroupWizardGroup,
  options: { singleMode?: boolean; step?: number; forcedSop?: Sop } = {}
): string[] {
  const issues: string[] = [];
  const sampleCodes = parseWizardSampleEntries(group.rawSamples).map(entry => entry.code);
  const step = options.step ?? 5;

  if (step >= 1) {
    if (sampleCodes.length === 0) issues.push('Cần nhập ít nhất một mã số mẫu.');
    if (options.singleMode && sampleCodes.length !== 1) {
      issues.push('Chế độ một mẫu chỉ cho phép đúng một mã số mẫu.');
    }
  }

  if (step >= 3) {
    const missingDescriptions = sampleCodes.filter(sample =>
      !getSampleDescriptionSnapshot(group.sampleDescriptionMap, sample)?.nameSnapshot?.trim()
    );
    if (missingDescriptions.length > 0) {
      issues.push(`Còn ${missingDescriptions.length} mẫu chưa có mô tả.`);
    }
  }

  if (step >= 4 && group.selectedTargets.size === 0) {
    issues.push('Cần chọn ít nhất một chỉ tiêu kiểm nghiệm.');
  }

  if (step >= 5 && group.forcedSopId) {
    const sopIssue = getForcedSopAssignmentIssue(options.forcedSop, group.selectedTargets, group.matrixType);
    if (sopIssue) issues.push(sopIssue);
  }
  return issues;
}

export function subsetSampleGroupWizardGroups(
  groups: SampleGroupWizardGroup[],
  groupIds: Iterable<string>,
  samples: Iterable<string>
): SampleGroupWizardGroup[] {
  const ids = new Set(Array.from(groupIds));
  const sampleSet = new Set(Array.from(samples));
  return groups
    .filter(group => ids.has(group.id) || parseWizardSampleEntries(group.rawSamples).some(sample => sampleSet.has(sample.code)))
    .map(group => ({
      ...group,
      rawSamples: parseWizardSampleEntries(group.rawSamples)
        .map(sample => sample.code)
        .filter(sample => sampleSet.has(sample))
        .join('\n'),
      sampleDescriptionMap: Object.fromEntries(
        Object.entries(group.sampleDescriptionMap).filter(([sample]) => sampleSet.has(sample))
      ),
      selectedTargets: new Set(group.selectedTargets)
    }))
    .filter(group => group.rawSamples.trim().length > 0);
}

export function cloneSampleGroupWizardGroups(groups: SampleGroupWizardGroup[]): SampleGroupWizardGroup[] {
  return groups.map(group => ({
    ...group,
    sampleDescriptionMap: Object.fromEntries(
      Object.entries(group.sampleDescriptionMap).map(([sample, description]) => [sample, { ...description }])
    ),
    selectedTargets: new Set(group.selectedTargets)
  }));
}

export function isTargetSelected(target: SopTarget, selectedTargetIds: Iterable<string>): boolean {
  const selected = new Set(canonicalTargetIds(selectedTargetIds));
  return selected.has(getCanonicalId(target.name || target.id));
}
