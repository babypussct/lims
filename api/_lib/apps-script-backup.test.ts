import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { readAppsScriptLiveSnapshot, readAppsScriptSourceSnapshot } from './apps-script-backup.js';

describe('Apps Script backup snapshot', () => {
  it('includes the deployment manifest, every checked-in .gs source file, and optional local deployment identity', () => {
    const snapshot = readAppsScriptSourceSnapshot();
    assert.equal(snapshot.files.some(file => file.path === 'gas/appsscript.json'), true);
    assert.equal(snapshot.files.some(file => file.path === 'gas/LIMS_ReportGenerator.gs'), true);
    assert.equal(snapshot.files.some(file => file.path === 'gas/SOP_Configs.gs'), true);
    assert.equal(snapshot.files.some(file => file.path === '.clasp.json'), existsSync(resolve(process.cwd(), '.clasp.json')));
    if (snapshot.deployment.scriptId) assert.match(snapshot.deployment.scriptId, /^[A-Za-z0-9_-]+$/);
    assert.equal(snapshot.templateIds.length >= 16, true);
    assert.equal(snapshot.templateIds.every(id => /^[A-Za-z0-9_-]+$/.test(id)), true);
    assert.equal(snapshot.files.every(file => file.bytes > 0 && /^[a-f0-9]{64}$/.test(file.sha256) && file.content.length > 0), true);
  });

  it('keeps live Apps Script project content and deployments in the backup payload', async () => {
    const calls: string[] = [];
    const client = {
      getAppsScriptProject: async (scriptId: string) => {
        calls.push(`project:${scriptId}`);
        return { scriptId, title: 'LIMS' };
      },
      getAppsScriptProjectContent: async (scriptId: string) => {
        calls.push(`content:${scriptId}`);
        return { files: [{ name: 'Code', source: 'function test() {}' }] };
      },
      listAppsScriptDeployments: async (scriptId: string) => {
        calls.push(`deployments:${scriptId}`);
        return [{ deploymentId: 'dep-1', updateTime: '2026-08-28T00:00:00Z' }];
      },
    } as any;
    const snapshot = await readAppsScriptLiveSnapshot(client, 'script-123');
    assert.equal(snapshot.scriptId, 'script-123');
    assert.equal((snapshot.content['files'] as unknown[]).length, 1);
    assert.equal(snapshot.deployments.length, 1);
    assert.deepEqual(calls.sort(), ['content:script-123', 'deployments:script-123', 'project:script-123']);
  });

  it('rejects an unsafe live script id before making an API request', async () => {
    await assert.rejects(
      () => readAppsScriptLiveSnapshot({} as any, '../not-safe'),
      /scriptId không hợp lệ/,
    );
  });
});
