const { spawnSync } = require('node:child_process');
const { resolve } = require('node:path');

const ROOT = resolve(__dirname, '..');
const PROJECT_ID = 'demo-lims-notification';
const TEST_COMMAND = 'npx tsx --test scripts/notification-workflow.emulator.test.ts scripts/activity-http.emulator.test.ts';
const FIREBASE_CLI_VERSION = '14.27.0';
const FIREBASE_CLI = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const result = spawnSync(
  FIREBASE_CLI,
  [
    '--yes',
    '--package',
    `firebase-tools@${FIREBASE_CLI_VERSION}`,
    'firebase',
    '--project',
    PROJECT_ID,
    'emulators:exec',
    '--only',
    'auth,firestore',
    TEST_COMMAND
  ],
  {
    cwd: ROOT,
    stdio: 'inherit',
    windowsHide: true,
    env: {
      ...process.env,
      METADATA_SERVER_DETECTION: 'none'
    }
  }
);

if (result.error) throw result.error;
process.exitCode = typeof result.status === 'number' ? result.status : 1;
