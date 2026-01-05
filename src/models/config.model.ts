export interface HealthCheckItem {
  collection: string;
  path: string;
  status: 'Online' | 'Error' | 'Checking';
  actionUrl?: string; 
  errorMessage?: string;
}