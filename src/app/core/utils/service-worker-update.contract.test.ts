import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { Generator, type Config, type Filesystem } from '@angular/service-worker/config';
import { ReloadSafetyService } from '../services/reload-safety.service';

const root = new URL('../../../../', import.meta.url);
const ngswConfig = JSON.parse(
  readFileSync(new URL('ngsw-config.json', root), 'utf8')
) as Config;

function createBuildFilesystem(): Filesystem {
  const files = new Map<string, string>([
    ['/index.html', '<html><body>LIMS</body></html>'],
    ['/favicon.ico', 'ico'],
    ['/manifest.webmanifest', '{}'],
    ['/main-TEST.js', 'console.log("main")'],
    ['/styles-TEST.css', 'body{}']
  ]);

  return {
    async list() {
      return [...files.keys()];
    },
    async read(file: string) {
      const value = files.get(file);
      if (value === undefined) throw new Error(`Missing fixture: ${file}`);
      return value;
    },
    async hash(file: string) {
      if (!files.has(file)) throw new Error(`Missing fixture: ${file}`);
      return `hash:${file}`;
    },
    async write() {
      // Generator output is returned directly in this test.
    }
  };
}

test('generated Angular service-worker manifest versions index.html with the app shell', async () => {
  const manifest = await new Generator(createBuildFilesystem(), '/').process(ngswConfig) as {
    hashTable: Record<string, string>;
    assetGroups: Array<{ name: string; urls: string[] }>;
  };

  assert.equal(manifest.hashTable['/index.html'], 'hash:/index.html');
  const appShell = manifest.assetGroups.find(group => group.name === 'app-shell');
  assert.ok(appShell, 'app-shell asset group must exist');
  assert.ok(appShell.urls.includes('/index.html'), 'app-shell must prefetch index.html');
});

test('VERSION_READY contract still exposes the modal and activates the pending version before reload', () => {
  const source = readFileSync(new URL('src/app/app.component.ts', root), 'utf8');
  const versionReadyStart = source.indexOf("e.type === 'VERSION_READY'");
  const installFailureStart = source.indexOf("e.type === 'VERSION_INSTALLATION_FAILED'");

  assert.ok(versionReadyStart >= 0, 'VERSION_READY listener must exist');
  assert.ok(installFailureStart > versionReadyStart, 'VERSION_READY block must be bounded');

  const versionReadyBlock = source.slice(versionReadyStart, installFailureStart);
  assert.match(versionReadyBlock, /this\.hasNewVersion\.set\(true\)/);
  assert.match(versionReadyBlock, /this\.startUpdateCountdown\(\)/);
  assert.match(source, /await this\.swUpdate\.activateUpdate\(\)/);
  assert.match(source, /window\.location\.reload\(\)/);
});

test('update countdown runs continuously through 10 seconds without an interaction pause gate', () => {
  const source = readFileSync(new URL('src/app/app.component.ts', root), 'utf8');

  assert.doesNotMatch(source, /isCountdownPaused/);
  assert.doesNotMatch(source, /current\s*===\s*10/);
  assert.doesNotMatch(source, /_setupInteractionHandler/);
});

test('reload safety registry stays blocked until every feature is safe', () => {
  const safety = new ReloadSafetyService();

  assert.equal(safety.isSafe(), true);

  safety.setBlocker('result-entry', true, 'saving');
  safety.setBlocker('other-form', true, 'dirty');
  assert.equal(safety.isSafe(), false);
  assert.deepEqual(safety.reasons().sort(), ['dirty', 'saving']);

  safety.clearBlocker('result-entry');
  assert.equal(safety.isSafe(), false);

  safety.clearBlocker('other-form');
  assert.equal(safety.isSafe(), true);
});

test('update apply path waits for reload safety instead of forcing another timed delay', () => {
  const source = readFileSync(new URL('src/app/app.component.ts', root), 'utf8');

  assert.match(source, /if \(!this\.reloadSafety\.isSafe\(\)\)/);
  assert.match(source, /this\.isUpdateWaitingForSafety\.set\(true\)/);
  assert.match(source, /applyPendingUpdateWhenSafe/);
  assert.doesNotMatch(source, /setTimeout\([^)]*requestUpdateApply/);
});
