import '@angular/compiler';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const componentPath = resolve(
  process.cwd(),
  'src/app/shared/components/confirmation-modal/confirmation-modal.component.ts',
);
const source = readFileSync(componentPath, 'utf8');

test('confirmation modal uses centralized z-layer-confirmation utility class and token architecture', () => {
  assert.match(source, /z-layer-confirmation/);
  assert.doesNotMatch(source, /z-\[99\]/);

  const stylesCss = readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf8');
  assert.match(stylesCss, /--z-confirmation:\s*1000/);
  assert.match(stylesCss, /\.z-layer-confirmation\s*\{\s*z-index:\s*var\(--z-confirmation\);\s*\}/);
  assert.match(stylesCss, /--z-toast:\s*210/);
  assert.match(stylesCss, /\.z-layer-toast\s*\{\s*z-index:\s*var\(--z-toast\);\s*\}/);
  assert.match(stylesCss, /--z-system-lock:\s*9999/);
  assert.match(stylesCss, /\.z-layer-system-lock\s*\{\s*z-index:\s*var\(--z-system-lock\);\s*\}/);
});

test('confirmation modal enforces accessibility, dynamic title and decorative icon contract', () => {
  assert.match(source, /appModalA11y/);
  assert.match(source, /modalLabelledBy="confirmation-modal-title"/);
  assert.match(source, /modalDescribedBy="confirmation-modal-message"/);
  assert.match(source, /\(modalEscape\)="confirmationService\.onCancel\(\)"/);
  assert.match(source, /id="confirmation-modal-title"/);
  assert.match(source, /id="confirmation-modal-message"/);
  assert.match(source, /confirmationService\.state\(\)\.title/);
  assert.match(source, /aria-hidden="true"/);
});

test('confirmation modal supports dark mode and responsive scrollable container', () => {
  assert.match(source, /dark:bg-slate-900/);
  assert.match(source, /dark:border-slate-800/);
  assert.match(source, /dark:text-slate-100/);
  assert.match(source, /dark:text-slate-300/);
  assert.match(source, /max-w-lg/);
  assert.match(source, /overflow-y-auto/);
});

test('shared overlays across the application enforce centralized z-layer-* utility classes', () => {
  const root = process.cwd();
  const toastSource = readFileSync(resolve(root, 'src/app/shared/components/toast-host/toast-host.component.ts'), 'utf8');
  assert.match(toastSource, /z-layer-toast/);

  const progressSource = readFileSync(resolve(root, 'src/app/shared/components/progress-overlay/progress-overlay.component.ts'), 'utf8');
  assert.match(progressSource, /z-layer-system-lock/);

  const scannerSource = readFileSync(resolve(root, 'src/app/shared/components/global-scanner/global-scanner.component.ts'), 'utf8');
  assert.match(scannerSource, /z-layer-scanner-preview/);

  const printSource = readFileSync(resolve(root, 'src/app/shared/components/print-preview-modal/print-preview-modal.component.ts'), 'utf8');
  assert.match(printSource, /z-layer-scanner-preview/);

  const modalShellSource = readFileSync(resolve(root, 'src/app/shared/components/ui/modal-shell/modal-shell.component.ts'), 'utf8');
  assert.match(modalShellSource, /z-layer-modal/);

  const appSource = readFileSync(resolve(root, 'src/app/app.component.ts'), 'utf8');
  assert.match(appSource, /z-layer-system-lock/);
});
