export interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  modifiedTime?: string;
  size?: string;
  thumbnailLink?: string;
}

export type DocumentPreviewKind =
  | 'pdf'
  | 'excel'
  | 'image'
  | 'video'
  | 'audio'
  | 'text'
  | 'drive';

export interface ExcelViewerRow {
  __rowNumber: number;
  [key: string]: string | number;
}
