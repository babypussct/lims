import type { A4HtmlSource } from './a4-html-pagination';

export interface A4DocumentRow {
  cells: string[];
  key?: string;
}

export interface A4DocumentSection {
  title: string;
  columns: string[];
  rows: A4DocumentRow[];
}

/** A document snapshot independent of SOP jobs or persisted business records. */
export interface A4Document {
  title: string;
  subtitle: string;
  preparedAt: string;
  notice: string;
  sections: A4DocumentSection[];
  orientation?: 'portrait' | 'landscape';
  fileName?: string;
  brand?: string;
  html?: A4HtmlSource;
}
