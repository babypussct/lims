import '@angular/compiler';
import assert from 'node:assert/strict';
import test from 'node:test';
import { Injector, runInInjectionContext, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { FirestoreReadMonitor } from '../../core/services/firestore-read-monitor.service';
import { ToastService } from '../../core/services/toast.service';
import { PrintService } from '../../core/services/print.service';
import { ActivityEventService } from '../../core/services/activity-event.service';
import { ResultService } from './services/result.service';
import { ResultListComponent } from './result-list.component';

function fixture() {
  const rows = signal<any[]>([
    { id: 'approval', approvedAt: new Date(2026, 9, 2, 23, 59), analysisDate: '2026-09-30', status: 'draft' },
    { id: 'analysis', approvedAt: new Date(2026, 8, 30), analysisDate: '2026-10-02', status: 'completed' },
    { id: 'legacy', timestamp: { _seconds: new Date(2026, 9, 2).getTime() / 1000 }, status: 'approved' },
    { id: 'undated', status: 'approved' },
  ]);
  const injector = Injector.create({ providers: [
    { provide: StateService, useValue: { approvedRequests: rows } },
    ...[Router, ResultService, FirebaseService, FirestoreReadMonitor, ToastService, PrintService, ActivityEventService]
      .map(provide => ({ provide, useValue: {} })),
  ] });
  const component = runInInjectionContext(injector, () => new ResultListComponent());
  // Scrolling is a browser concern; date filtering and paging stay real here.
  (component as any).scrollResultsToTop = () => {};
  return component;
}

test('results start without a date filter and include old and undated batches', () => {
  const component = fixture();
  assert.equal(component.startDate(), '');
  assert.equal(component.endDate(), '');
  assert.equal(component.hasActiveFilters(), false);
  assert.equal(component.activeFiltersCount(), 0);
  assert.equal(component.displayedRuns().length, 4);
});

test('approval range filters rows and status counts by approval date, including the end day and legacy timestamps', () => {
  const component = fixture();
  component.currentPage.set(3);
  component.onDateRangeChange({ start: '2026-10-02', end: '2026-10-02', label: 'Tùy chỉnh' });
  assert.deepEqual(component.displayedRuns().map(row => row.id), ['approval', 'legacy']);
  assert.equal(component.filteredCount('all'), 2);
  assert.equal(component.filteredCount('draft'), 1);
  assert.equal(component.filteredCount('completed'), 0);
  assert.equal(component.currentPage(), 1);
  assert.equal(component.activeFiltersCount(), 1);
});

test('one-sided ranges work and clearing filters returns all batches', () => {
  const component = fixture();
  component.onDateRangeChange({ start: '', end: '2026-09-30', label: 'Tùy chỉnh' });
  assert.deepEqual(component.displayedRuns().map(row => row.id), ['analysis']);
  component.onDateRangeChange({ start: '2026-10-02', end: '', label: 'Tùy chỉnh' });
  assert.deepEqual(component.displayedRuns().map(row => row.id), ['approval', 'legacy']);
  component.resetAllFilters();
  assert.equal(component.displayedRuns().length, 4);
  assert.equal(component.hasActiveFilters(), false);
});

test('initializing or reopening the same range does not reset the current page', () => {
  const component = fixture();
  component.currentPage.set(3);
  component.onDateRangeChange({ start: '', end: '', label: 'Tất cả thời gian' });
  assert.equal(component.currentPage(), 3);
});

test('restoring an all-time or one-sided range preserves empty dates and clears legacy automatic ranges', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
  try {
    for (const range of [{ startDate: '', endDate: '' }, { startDate: '', endDate: '2026-09-30' },
      { startDate: '2026-10-02', endDate: '2026-10-02' }]) {
      Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: {
        getItem: (key: string) => key === 'lims_results_list_state' ? JSON.stringify({ ...range, dateFilterBasis: 'approvedAt' }) : null,
      } });
      const component = fixture();
      component.startDate.set('2026-10-02'); component.endDate.set('2026-10-02');
      component.restoreState();
      assert.equal(component.startDate(), range.startDate);
      assert.equal(component.endDate(), range.endDate);
    }
    Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: {
      getItem: (key: string) => key === 'lims_results_list_state'
        ? JSON.stringify({ startDate: '2026-10-02', endDate: '2026-10-02' }) : null,
    } });
    const component = fixture();
    component.restoreState();
    assert.equal(component.startDate(), '');
    assert.equal(component.endDate(), '');
  } finally {
    if (original) Object.defineProperty(globalThis, 'sessionStorage', original);
    else Reflect.deleteProperty(globalThis, 'sessionStorage');
  }
});
