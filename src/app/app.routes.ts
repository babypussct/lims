
import { Routes } from '@angular/router';

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
    path: 'calculator',
    loadComponent: () => import('./features/sop/calculator/calculator.component').then(m => m.CalculatorComponent)
  },
  {
    path: 'smart-batch', // New Route
    loadComponent: () => import('./features/batch/smart-batch.component').then(m => m.SmartBatchComponent)
  },
  {
    path: 'prep',
    loadComponent: () => import('./features/preparation/smart-prep.component').then(m => m.SmartPrepComponent)
  },
  {
    path: 'inventory',
    loadComponent: () => import('./features/inventory/inventory.component').then(m => m.InventoryComponent)
  },
  {
    path: 'standards',
    loadComponent: () => import('./features/standards/standards.component').then(m => m.StandardsComponent)
  },
  {
    path: 'recipes',
    loadComponent: () => import('./features/recipes/recipe-manager.component').then(m => m.RecipeManagerComponent)
  },
  {
    path: 'target-groups',
    loadComponent: () => import('./features/targets/target-group-manager.component').then(m => m.TargetGroupManagerComponent)
  },
  {
    path: 'master-targets', 
    loadComponent: () => import('./features/targets/master-target-manager.component').then(m => m.MasterTargetManagerComponent)
  },
  {
    path: 'requests',
    loadComponent: () => import('./features/requests/request-list.component').then(m => m.RequestListComponent)
  },
  {
    path: 'stats',
    loadComponent: () => import('./features/dashboard/statistics.component').then(m => m.StatisticsComponent)
  },
  {
    path: 'printing',
    loadComponent: () => import('./features/requests/print-queue.component').then(m => m.PrintQueueComponent)
  },
  {
    path: 'labels',
    loadComponent: () => import('./features/labels/label-print.component').then(m => m.LabelPrintComponent)
  },
  {
    path: 'editor',
    loadComponent: () => import('./features/sop/editor/sop-editor.component').then(m => m.SopEditorComponent)
  },
  {
    path: 'config',
    loadComponent: () => import('./features/config/config.component').then(m => m.ConfigComponent)
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
