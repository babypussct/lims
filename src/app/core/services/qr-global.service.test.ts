import '@angular/compiler';
import assert from 'node:assert/strict';
import test from 'node:test';
import { signal } from '@angular/core';
import { QrGlobalService } from './qr-global.service';

function harness() {
  const service = Object.create(QrGlobalService.prototype) as QrGlobalService;
  const routes: any[] = [];
  Object.assign(service, { isScanning: signal(true), scannedGs1Data: signal(null),
    router: { navigate: (...args: any[]) => routes.push(args) }, toast: { show: () => {} } });
  return { service, routes };
}

test('printed traceability links always open Traceability and retain case, including Firestore snapshot IDs', () => {
  for (const raw of ['https://lab.test/#/traceability/aBcDeFgHiJkLmNoPqRsT',
    'https://lab.test/traceability/aBcDeFgHiJkLmNoPqRsT', '/#/traceability/aBcDeFgHiJkLmNoPqRsT']) {
    const { service, routes } = harness(); service.handleResult(raw);
    assert.deepEqual(routes, [[['/traceability', 'aBcDeFgHiJkLmNoPqRsT']]]);
    assert.equal(service.isScanning(), false);
  }
});

test('a historical worksheet audit code from a URL routes locally without following the supplied host', () => {
  const { service, routes } = harness(); service.handleResult('https://external.test/#/traceability/TRC-2026-aB');
  assert.deepEqual(routes, [[['/traceability', 'TRC-2026-aB']]]);
});

test('raw batch IDs keep the existing results route and authentication QR keeps its original payload', () => {
  const { service, routes } = harness(); service.handleResult('aBcDeFgHiJkLmNoPqRsT');
  assert.deepEqual(routes[0], [['/results-view', 'aBcDeFgHiJkLmNoPqRsT']]);
  service.handleResult('LIMS_QR|Session|Nonce');
  assert.deepEqual(routes[1], [['/mobile-login'], { queryParams: { qr: 'LIMS_QR|Session|Nonce' } }]);
});
