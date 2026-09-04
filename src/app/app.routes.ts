
import { Routes } from '@angular/router';
import { permissionGuard } from './core/guards/permission.guard';
import { canDeactivateResultEntry } from './core/guards/pending-changes.guard';
import { PERMISSIONS } from './core/services/auth.service';
import { environment } from '../environments/environment';

const developmentOnlyRoutes: Routes = environment.production ? [] : [
  {
    path: '__ui-primitives',
    loadComponent: () => import('./shared/components/ui/ui-primitives-demo.component').then(m => m.UiPrimitivesDemoComponent)
  },
  {
    path: '__excel-demo',
    loadComponent: () => import('./features/documents/excel-document-demo.component').then(m => m.ExcelDocumentDemoComponent)
  }
];

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
    loadComponent: () => import('./features/preparation/smart-prep.component').then(m => m.SmartPrepComponent)
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
    path: 'daily-checklist',
    loadComponent: () => import('./features/checklist/daily-checklist.component').then(m => m.DailyChecklistComponent),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.SOP_VIEW }
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
    redirectTo: 'settings/data/master/target-groups',
    pathMatch: 'full'
  },
  {
    path: 'master-targets',
    redirectTo: 'settings/data/master/analytes',
    pathMatch: 'full'
  },
  {
    path: 'matrix-types',
    redirectTo: 'settings/data/master/matrices',
    pathMatch: 'full'
  },
  {
    path: 'master-devices',
    redirectTo: 'settings/data/master/devices',
    pathMatch: 'full'
  },
  {
    path: 'sample-description-master',
    redirectTo: 'settings/data/master/sample-descriptions',
    pathMatch: 'full'
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
    path: 'duty-stats',
    loadComponent: () => import('./features/duty-stats/duty-stats.component').then(m => m.DutyStatsComponent),
    canActivate: [permissionGuard]
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
    path: 'settings',
    loadComponent: () => import('./features/settings/settings-shell.component').then(m => m.SettingsShellComponent),
    canActivate: [permissionGuard],
    children: [
      { path: '', redirectTo: 'account/profile', pathMatch: 'full' },
      { path: 'account', redirectTo: 'account/profile', pathMatch: 'full' },
      {
        path: 'account/profile',
        loadComponent: () => import('./features/settings/pages/account-profile-settings.component').then(m => m.AccountProfileSettingsComponent)
      },
      {
        path: 'account/security',
        loadComponent: () => import('./features/settings/pages/account-security-settings.component').then(m => m.AccountSecuritySettingsComponent)
      },
      {
        path: 'account/notifications',
        loadComponent: () => import('./features/settings/pages/account-notifications-settings.component').then(m => m.AccountNotificationsSettingsComponent)
      },
      {
        path: 'account/privacy',
        loadComponent: () => import('./features/settings/pages/account-privacy-settings.component').then(m => m.AccountPrivacySettingsComponent)
      },
      {
        path: 'manager',
        loadComponent: () => import('./features/settings/pages/manager-settings.component').then(m => m.ManagerSettingsComponent),
        canActivate: [permissionGuard],
        data: { permissionsAny: [PERMISSIONS.SYSTEM_MANAGE, PERMISSIONS.MASTER_DATA_MANAGE, PERMISSIONS.USER_MANAGE, PERMISSIONS.BACKUP_CREATE, PERMISSIONS.BACKUP_VERIFY, PERMISSIONS.BACKUP_RESTORE, PERMISSIONS.POLICY_MANAGE] }
      },
      {
        path: 'system',
        loadComponent: () => import('./features/settings/pages/system-settings.component').then(m => m.SystemSettingsComponent),
        canActivate: [permissionGuard],
        data: { permission: PERMISSIONS.SYSTEM_MANAGE }
      },
      { path: 'data', redirectTo: 'data/master', pathMatch: 'full' },
      { path: 'data/master', redirectTo: 'data/master/analytes', pathMatch: 'full' },
      {
        path: 'data/master/analytes',
        loadComponent: () => import('./features/targets/master-target-manager.component').then(m => m.MasterTargetManagerComponent),
        canActivate: [permissionGuard],
        data: { permission: PERMISSIONS.MASTER_DATA_MANAGE }
      },
      {
        path: 'data/master/target-groups',
        loadComponent: () => import('./features/targets/target-group-manager.component').then(m => m.TargetGroupManagerComponent),
        canActivate: [permissionGuard],
        data: { permission: PERMISSIONS.MASTER_DATA_MANAGE }
      },
      {
        path: 'data/master/matrices',
        loadComponent: () => import('./features/config/matrix-type-manager.component').then(m => m.MatrixTypeManagerComponent),
        canActivate: [permissionGuard],
        data: { permission: PERMISSIONS.MASTER_DATA_MANAGE }
      },
      {
        path: 'data/master/sample-descriptions',
        loadComponent: () => import('./features/config/sample-description-master.component').then(m => m.SampleDescriptionMasterComponent),
        canActivate: [permissionGuard],
        data: { permission: PERMISSIONS.MASTER_DATA_MANAGE }
      },
      {
        path: 'data/master/devices',
        loadComponent: () => import('./features/config/master-device-manager.component').then(m => m.MasterDeviceManagerComponent),
        canActivate: [permissionGuard],
        data: { permission: PERMISSIONS.MASTER_DATA_MANAGE }
      },
      {
        path: 'data/master/categories',
        loadComponent: () => import('./features/settings/pages/master-data-settings.component').then(m => m.MasterDataSettingsComponent),
        canActivate: [permissionGuard],
        data: { permission: PERMISSIONS.MASTER_DATA_MANAGE }
      },
      {
        path: 'data/backups',
        loadComponent: () => import('./features/settings/pages/backup-settings.component').then(m => m.BackupSettingsComponent),
        canActivate: [permissionGuard],
        data: { permissionsAny: [PERMISSIONS.BACKUP_CREATE, PERMISSIONS.BACKUP_VERIFY, PERMISSIONS.BACKUP_RESTORE] }
      },
      { path: 'data/lifecycle', redirectTo: 'data/backups', pathMatch: 'full' },
      { path: 'access', redirectTo: 'access/users', pathMatch: 'full' },
      {
        path: 'access/users',
        loadComponent: () => import('./features/settings/pages/access-users-settings.component').then(m => m.AccessUsersSettingsComponent),
        canActivate: [permissionGuard],
        data: { permission: PERMISSIONS.USER_MANAGE }
      },
      {
        path: 'access/roles',
        loadComponent: () => import('./features/settings/pages/access-roles-settings.component').then(m => m.AccessRolesSettingsComponent),
        canActivate: [permissionGuard],
        data: { permission: PERMISSIONS.USER_MANAGE }
      },
      {
        path: 'policies/consumption',
        loadComponent: () => import('./features/settings/pages/consumption-settings.component').then(m => m.ConsumptionSettingsComponent),
        canActivate: [permissionGuard],
        data: { permission: PERMISSIONS.POLICY_MANAGE }
      }
    ]
  },
  {
    path: 'config',
    redirectTo: 'settings/account/profile',
    pathMatch: 'full'
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
    path: 'privacy-policy',
    loadComponent: () => import('./features/public/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
  },
  {
    path: 'terms-of-service',
    loadComponent: () => import('./features/public/terms-of-service.component').then(m => m.TermsOfServiceComponent)
  },
  {
    path: 'changelog',
    loadComponent: () => import('./features/public/changelog.component').then(m => m.ChangelogComponent)
  },
  ...developmentOnlyRoutes,
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
