
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

export interface SafetyConfig {
  defaultMargin: number;
  rules: { [category: string]: number }; // e.g., "reagent": 10, "standard": 2
}
