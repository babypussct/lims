import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { computed, signal, untracked } from '@angular/core';

const componentPath = resolve(
  process.cwd(),
  'src/app/features/standards/components/standards-internal-id-sync-modal.component.ts',
);
const source = readFileSync(componentPath, 'utf8');
const constructorEffect = source.slice(source.indexOf('constructor()'), source.indexOf('async scan():'));

test('auto-scan keeps busy signals out of the open-state effect dependencies', () => {
  assert.match(source, /signal, untracked \} from '@angular\/core';/);
  assert.match(
    constructorEffect,
    /const open = this\.isOpen\(\);[\s\S]*?if \(open\) \{[\s\S]*?untracked\(\(\) => \{\s*void this\.scan\(\);\s*\}\);/,
  );
  assert.doesNotMatch(
    constructorEffect,
    /if \(this\.isOpen\(\)\) \{\s*void this\.scan\(\);/,
  );
});

test('untracked prevents a busy-signal change from scheduling another scan', () => {
  const open = signal(true);
  const isScanning = signal(false);
  let scanCalls = 0;
  const autoScan = computed(() => {
    if (!open()) return scanCalls;
    untracked(() => {
      isScanning();
      scanCalls += 1;
    });
    return scanCalls;
  });

  assert.equal(autoScan(), 1);
  isScanning.set(true);
  assert.equal(autoScan(), 1);
  open.set(false);
  assert.equal(autoScan(), 1);
  open.set(true);
  assert.equal(autoScan(), 2);
});
