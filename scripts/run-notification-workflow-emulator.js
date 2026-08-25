const { spawnSync } = require('node:child_process');
const { resolve } = require('node:path');

const ROOT = resolve(__dirname, '..');
const PROJECT_ID = 'demo-lims-notification';
const TEST_COMMAND = 'npx tsx --test scripts/notification-workflow.emulator.test.ts';
const FIREBASE_CLI = require.resolve('firebase-tools/lib/bin/firebase.js');

const result = spawnSync(
  process.execPath,
  [
    FIREBASE_CLI,
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
    windowsHide: true
  }
);

if (result.error) throw result.error;
process.exitCode = typeof result.status === 'number' ? result.status : 1;
