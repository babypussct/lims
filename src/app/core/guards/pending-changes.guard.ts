import { CanDeactivateFn } from '@angular/router';
import { ResultEntryComponent } from '../../features/results/result-entry.component';

/**
2:  * Guard ngăn người dùng vô tình thoát trang khi có thay đổi chưa được lưu
3:  */
export const canDeactivateResultEntry: CanDeactivateFn<ResultEntryComponent> = (component) => {
  if (component && component.autoSaveStatus && component.autoSaveStatus() === 'modified') {
    return confirm('Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời khỏi trang này không?');
  }
  return true;
};
