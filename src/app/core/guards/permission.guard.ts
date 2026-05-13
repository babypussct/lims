
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
    router.navigate(['/']);
    return false;
  }

  // 2. Check Admin Override
  if (user.role === 'manager') return true;

  // 3. Check Role Requirement
  if (requiredRole && user.role !== requiredRole) {
    toast.show('Bạn không có quyền truy cập trang này.', 'error');
    router.navigate(['/403']);
    return false;
  }

  // 4. Check Specific Permission
  if (requiredPermission && !auth.hasPermission(requiredPermission)) {
    toast.show(`Yêu cầu quyền: ${requiredPermission}`, 'error');
    router.navigate(['/403']);
    return false;
  }

  return true;
};
