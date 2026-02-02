
export interface AuthSession {
  id: string; // Document ID
  status: 'waiting' | 'scanned' | 'approved' | 'rejected';
  encryptedCreds?: string; // "email|encrypted_password"
  deviceInfo?: string; // e.g. "iPhone 13 - Chrome"
  timestamp: any;
}
