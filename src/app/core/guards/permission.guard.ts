
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router) as Router;
  const toast = inject(ToastService);

  const requiredPermission = route.data['permission'] as string;
  const requiredRole = route.data['role'] as string;

  const user = auth.currentUser();

  // 1. Check Login — redirect về '/' để AppComponent hiển thị màn hình đăng nhập
  if (!user) {
    // Lưu route ý định vào sessionStorage để OAuth redirect có thể restore sau khi đăng nhập
    const intendedHash = '#/' + state.url.replace(/^\//, '');
    sessionStorage.setItem('__lims_intended_route', intendedHash);
    router.navigate(['/']);
    return false;
  }

  // 2. Check Admin Override
  if (user.role === 'manager') return true;

  // 3. Check Role Requirement
  if (requiredRole && user.role !== requiredRole) {
    toast.show('Bạn không có quyền truy cập trang này.', 'error');
    router.navigate(['/403'], { queryParams: { required: 'role:' + requiredRole, from: state.url } });
    return false;
  }

  // 4. Check Specific Permission
  if (requiredPermission && !auth.hasPermission(requiredPermission)) {
    const permName = auth.getPermissionName(requiredPermission) || requiredPermission;
    toast.show(`Cần quyền "${permName}" · Liên hệ quản trị viên để được cấp`, 'error');
    router.navigate(['/403'], { queryParams: { required: requiredPermission, from: state.url } });
    return false;
  }

  return true;
};
