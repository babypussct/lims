
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
    path: 'batch-print',
    loadComponent: () => import('./features/requests/print-preview.component').then(m => m.BatchPrintComponent)
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
    path: '**',
    redirectTo: 'dashboard'
  }
];
