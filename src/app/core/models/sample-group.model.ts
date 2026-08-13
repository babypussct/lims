import { SampleDescriptionMap } from './sample-description.model';

/**
 * Local Step 2 draft. It deliberately mirrors the existing SmartBatch group
 * fields; it is not a Firestore/request model and is never persisted as a new
 * sample-group document.
 */
export interface SampleGroupWizardGroup {
  id: string;
  name: string;
  rawSamples: string;
  matrixType?: string;
  sampleDescriptionMap: SampleDescriptionMap;
  selectedTargets: Set<string>;
  forcedSopId?: string;
  sourceGroupId?: string;
  sourceGroupModified?: boolean;
}
