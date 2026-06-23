
import { Routes } from '@angular/router';
import { permissionGuard } from './core/guards/permission.guard';
import { canDeactivateResultEntry } from './core/guards/pending-changes.guard';
import { PERMISSIONS } from './core/services/auth.service';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'mobile-login',
    loadComponent: () => import('./features/auth/mobile-qr-login.component').then(m => m.MobileQrLoginComponent),
    // No specific permission needed, just logged in
  },
  {
    path: 'calculator',
    loadComponent: () => import('./features/sop/calculator/calculator.component').then(m => m.CalculatorComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.SOP_VIEW }
  },
  {
    path: 'smart-batch',
    loadComponent: () => import('./features/batch/smart-batch.component').then(m => m.SmartBatchComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.BATCH_RUN } // Chạy mẻ = thao tác tiêu hao kho, không chỉ là xem
  },
  {
    path: 'prep',
    loadComponent: () => import('./features/preparation/smart-prep.component').then(m => m.SmartPrepComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.BATCH_RUN } // Pha chế = tiêu hao kho thực tế
  },
  {
    path: 'inventory',
    loadComponent: () => import('./features/inventory/inventory.component').then(m => m.InventoryComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.INVENTORY_VIEW }
  },
  {
    path: 'standards',
    loadComponent: () => import('./features/standards/standards.component').then(m => m.StandardsComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.STANDARD_VIEW }
  },
  {
    path: 'standards/:id',
    loadComponent: () => import('./features/standards/standard-detail.component').then(m => m.StandardDetailComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.STANDARD_VIEW }
  },
  {
    path: 'standard-requests',
    loadComponent: () => import('./features/standards/requests/standard-requests.component').then(m => m.StandardRequestsComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.STANDARD_VIEW }
  },
  {
    path: 'standard-usage',
    loadComponent: () => import('./features/standards/usage/standard-usage.component').then(m => m.StandardUsageComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.STANDARD_LOG_VIEW }
  },
  {
    path: 'recipes',
    loadComponent: () => import('./features/recipes/recipe-manager.component').then(m => m.RecipeManagerComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.RECIPE_VIEW }
  },
  {
    path: 'target-groups',
    loadComponent: () => import('./features/targets/target-group-manager.component').then(m => m.TargetGroupManagerComponent),
    canActivate: [permissionGuard],
    data: { role: 'manager' } // Cấu hình hệ thống — chỉ manager
  },
  {
    path: 'master-targets', 
    loadComponent: () => import('./features/targets/master-target-manager.component').then(m => m.MasterTargetManagerComponent),
    canActivate: [permissionGuard],
    data: { role: 'manager' } // Cấu hình hệ thống — chỉ manager
  },
  {
    path: 'matrix-types',
    loadComponent: () => import('./features/config/matrix-type-manager.component').then(m => m.MatrixTypeManagerComponent),
    canActivate: [permissionGuard],
    data: { role: 'manager' }
  },
  {
    path: 'requests',
    loadComponent: () => import('./features/requests/request-list.component').then(m => m.RequestListComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.SOP_VIEW }
  },
  {
    path: 'results',
    loadComponent: () => import('./features/results/result-list.component').then(m => m.ResultListComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.SOP_VIEW }
  },
  {
    path: 'results/:id',
    loadComponent: () => import('./features/results/result-entry.component').then(m => m.ResultEntryComponent),
    canActivate: [permissionGuard],
    canDeactivate: [canDeactivateResultEntry],
    data: { permission: PERMISSIONS.SOP_VIEW }
  },
  {
    path: 'results-view',
    redirectTo: 'results',
    pathMatch: 'full'
  },
  {
    path: 'results-view/:id',
    loadComponent: () => import('./features/results-view/batch-detail-view.component').then(m => m.BatchDetailViewComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.SOP_VIEW }
  },
  {
    path: 'stats',
    loadComponent: () => import('./features/dashboard/statistics.component').then(m => m.StatisticsComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.REPORT_VIEW }
  },
  {
    path: 'documents',
    loadComponent: () => import('./features/documents/documents.component').then(m => m.DocumentsComponent)
  },
  {
    path: 'printing',
    loadComponent: () => import('./features/requests/print-queue.component').then(m => m.PrintQueueComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.SOP_VIEW }
  },
  {
    path: 'labels',
    loadComponent: () => import('./features/labels/label-print.component').then(m => m.LabelPrintComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.INVENTORY_VIEW } // In nhãn = cần quyền xem kho
  },
  {
    path: 'editor',
    loadComponent: () => import('./features/sop/editor/sop-editor.component').then(m => m.SopEditorComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.SOP_EDIT }
  },
  {
    path: 'config',
    loadComponent: () => import('./features/config/config.component').then(m => m.ConfigComponent)
    // Config page handles its own inner-security, allows users to see their profile
  },
  {
    path: 'traceability',
    loadComponent: () => import('./features/traceability/traceability.component').then(m => m.TraceabilityComponent)
  },
  {
    path: 'traceability/:id',
    loadComponent: () => import('./features/traceability/traceability.component').then(m => m.TraceabilityComponent)
  },
  {
    path: '403',
    loadComponent: () => import('./features/auth/forbidden.component').then(m => m.ForbiddenComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
