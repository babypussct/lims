
export interface HealthCheckItem {
  collection: string;
  path: string;
  status: 'Online' | 'Error' | 'Checking';
  actionUrl?: string; 
  errorMessage?: string;
}

export interface PrintConfig {
  footerText?: string; // Nội dung cam kết/ghi chú cuối trang
  showSignature: boolean;
}