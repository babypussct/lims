
import { Routes } from '@angular/router';
import { permissionGuard } from './core/guards/permission.guard';
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
    data: { permission: PERMISSIONS.SOP_VIEW }
  },
  {
    path: 'prep',
    loadComponent: () => import('./features/preparation/smart-prep.component').then(m => m.SmartPrepComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.INVENTORY_VIEW }
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
    path: 'recipes',
    loadComponent: () => import('./features/recipes/recipe-manager.component').then(m => m.RecipeManagerComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.RECIPE_VIEW }
  },
  {
    path: 'target-groups',
    loadComponent: () => import('./features/targets/target-group-manager.component').then(m => m.TargetGroupManagerComponent),
    canActivate: [permissionGuard], // Config areas usually need higher permissons, keeping loose for now or strictly Edit
    data: { permission: PERMISSIONS.SOP_EDIT } 
  },
  {
    path: 'master-targets', 
    loadComponent: () => import('./features/targets/master-target-manager.component').then(m => m.MasterTargetManagerComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.SOP_EDIT }
  },
  {
    path: 'requests',
    loadComponent: () => import('./features/requests/request-list.component').then(m => m.RequestListComponent),
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
    path: 'printing',
    loadComponent: () => import('./features/requests/print-queue.component').then(m => m.PrintQueueComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.SOP_VIEW }
  },
  {
    path: 'labels',
    loadComponent: () => import('./features/labels/label-print.component').then(m => m.LabelPrintComponent)
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
    path: '**',
    redirectTo: 'dashboard'
  }
];
