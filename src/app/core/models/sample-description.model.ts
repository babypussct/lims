export interface SampleDescriptionMaster {
  id: string;
  name: string;
  aliases?: string[];
  description?: string;
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
  updatedBy?: string;
}

/** Immutable label captured when a physical batch is created. */
export interface SampleDescriptionSnapshot {
  masterId?: string;
  nameSnapshot: string;
}

/** Maps the display sample code to its optional description snapshot. */
export type SampleDescriptionMap = Record<string, SampleDescriptionSnapshot>;
