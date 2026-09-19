import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../../../../', import.meta.url);

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, root), 'utf8');
}

test('web app manifest matches the hash-routed installed PWA contract', () => {
  const manifest = JSON.parse(read('public/manifest.webmanifest')) as {
    id?: string;
    lang?: string;
    display?: string;
    scope?: string;
    start_url?: string;
    theme_color?: string;
    background_color?: string;
    shortcuts?: { url?: string }[];
    icons?: { sizes?: string; purpose?: string }[];
  };

  assert.equal(manifest.id, '/');
  assert.equal(manifest.lang, 'vi');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.scope, '/');
  assert.equal(manifest.start_url, '/#/');
  assert.equal(manifest.theme_color, '#f8f9fa');
  assert.equal(manifest.background_color, '#f8f9fa');
  assert.ok(manifest.shortcuts?.length, 'installed app should expose shortcuts');
  for (const shortcut of manifest.shortcuts || []) {
    assert.match(shortcut.url || '', /^\/#\//, 'manifest shortcuts must launch through HashLocationStrategy');
  }
  assert.ok(manifest.icons?.some(icon => icon.sizes === '192x192' && /\bany\b/.test(icon.purpose || '')));
  assert.ok(manifest.icons?.some(icon => icon.sizes === '512x512' && /\bmaskable\b/.test(icon.purpose || '')));
});

test('document metadata and manifest use a consistent light PWA theme color', () => {
  const index = read('src/index.html');
  const manifest = JSON.parse(read('public/manifest.webmanifest')) as { theme_color?: string };
  const themeMatch = index.match(/<meta name="theme-color" content="([^"]+)">/);

  assert.ok(themeMatch, 'index.html must declare theme-color');
  assert.equal(themeMatch[1], manifest.theme_color);
  assert.match(index, /viewport-fit=cover/);
  assert.match(index, /apple-mobile-web-app-capable" content="yes"/);
});

test('install UI detects standalone mode and handles the native install lifecycle', () => {
  const source = read('src/app/shared/components/pwa-install-prompt.component.ts');

  assert.match(source, /display-mode: standalone/);
  assert.match(source, /navigator as any\)\.standalone === true/);
  assert.match(source, /window:beforeinstallprompt/);
  assert.match(source, /e\.preventDefault\(\)/);
  assert.match(source, /window:appinstalled/);
  assert.match(source, /this\.isStandalone\.set\(true\)/);
});

test('push notification cold launches convert internal routes to PWA hash URLs', () => {
  const worker = read('public/firebase-messaging-sw.js');
  const api = read('api/notifications.ts');

  assert.match(worker, /function pwaLaunchUrl\(actionUrl\)/);
  assert.match(worker, /clients\.openWindow\(pwaLaunchUrl\(actionUrl\)\)/);
  assert.match(api, /fcmOptions:\s*\{\s*link:\s*pwaLaunchUrl\(input\.actionUrl\)\s*\}/);
});

test('offline policy intentionally caches the application shell but not mutable backend data', () => {
  const config = JSON.parse(read('ngsw-config.json')) as {
    assetGroups?: { name?: string; installMode?: string }[];
    dataGroups?: unknown[];
  };
  const appShell = config.assetGroups?.find(group => group.name === 'app-shell');
  const featureChunks = config.assetGroups?.find(group => group.name === 'feature-chunks');

  assert.equal(appShell?.installMode, 'prefetch');
  assert.equal(featureChunks?.installMode, 'lazy');
  assert.ok(!config.dataGroups || config.dataGroups.length === 0,
    'transactional LIMS backend data must remain online-first instead of being silently cached');
});
