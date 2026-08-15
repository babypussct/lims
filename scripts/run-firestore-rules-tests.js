const { execFileSync, spawnSync } = require('node:child_process');
const { resolve } = require('node:path');

const ROOT = resolve(__dirname, '..');
const PROJECT_ID = 'demo-lims-smart-batch-rules';
const FIRESTORE_PORT = 8080;
const TEST_COMMAND = 'npx tsx --test src/app/core/services/smart-batch-firestore-rules.emulator.test.ts';
const FIREBASE_CLI = require.resolve('firebase-tools/lib/bin/firebase.js');

function listWindowsPortListeners() {
  if (process.platform !== 'win32') return [];

  const script = `
$rows = @(
  Get-NetTCPConnection -LocalPort ${FIRESTORE_PORT} -State Listen -ErrorAction SilentlyContinue | ForEach-Object {
    $process = Get-CimInstance Win32_Process -Filter "ProcessId=$($_.OwningProcess)" -ErrorAction SilentlyContinue
    if ($process) {
      [PSCustomObject]@{
        pid = [int]$process.ProcessId
        name = [string]$process.Name
        commandLine = [string]$process.CommandLine
      }
    }
  }
)
$rows | ConvertTo-Json -Compress
`;

  const output = execFileSync(
    'powershell.exe',
    ['-NoProfile', '-NonInteractive', '-Command', script],
    { cwd: ROOT, encoding: 'utf8', windowsHide: true }
  ).trim();

  if (!output) return [];
  const parsed = JSON.parse(output);
  return Array.isArray(parsed) ? parsed : [parsed];
}

function isHarnessFirestoreEmulator(processInfo) {
  const commandLine = String(processInfo.commandLine || '').toLowerCase();
  return commandLine.includes('cloud-firestore-emulator') &&
    commandLine.includes(`--port ${FIRESTORE_PORT}`) &&
    commandLine.includes(`--project_id ${PROJECT_ID}`);
}

function terminateWindowsProcess(pid) {
  const result = spawnSync('taskkill.exe', ['/PID', String(pid), '/T', '/F'], {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true
  });

  if (result.status !== 0) {
    const detail = String(result.stderr || result.stdout || '').trim();
    throw new Error(`Failed to terminate Firestore emulator PID ${pid}${detail ? `: ${detail}` : ''}`);
  }
}

function cleanupHarnessFirestoreEmulators(stage) {
  if (process.platform !== 'win32') return;

  const listeners = listWindowsPortListeners();
  const matching = listeners.filter(isHarnessFirestoreEmulator);

  for (const processInfo of matching) {
    console.warn(`[firestore-test-harness] Cleaning ${stage} emulator PID ${processInfo.pid} on port ${FIRESTORE_PORT}.`);
    terminateWindowsProcess(processInfo.pid);
  }

  const remainingHarnessProcesses = listWindowsPortListeners().filter(isHarnessFirestoreEmulator);
  if (remainingHarnessProcesses.length > 0) {
    const pids = remainingHarnessProcesses.map(processInfo => processInfo.pid).join(', ');
    throw new Error(`Firestore emulator cleanup did not release port ${FIRESTORE_PORT}; remaining PID(s): ${pids}`);
  }
}

function ensureFirestorePortAvailable() {
  if (process.platform !== 'win32') return;

  const listeners = listWindowsPortListeners();
  if (listeners.length === 0) return;

  const details = listeners
    .map(processInfo => `${processInfo.pid} (${processInfo.name || 'unknown'})`)
    .join(', ');
  throw new Error(
    `Port ${FIRESTORE_PORT} is occupied by a process that is not the ${PROJECT_ID} test emulator: ${details}`
  );
}

let exitCode = 1;

try {
  cleanupHarnessFirestoreEmulators('stale');
  ensureFirestorePortAvailable();

  const result = spawnSync(
    process.execPath,
    [
      FIREBASE_CLI,
      '--project',
      PROJECT_ID,
      'emulators:exec',
      '--only',
      'firestore',
      TEST_COMMAND
    ],
    {
      cwd: ROOT,
      stdio: 'inherit',
      windowsHide: true
    }
  );

  if (result.error) throw result.error;
  exitCode = typeof result.status === 'number' ? result.status : 1;
} catch (error) {
  console.error('[firestore-test-harness]', error instanceof Error ? error.message : error);
  exitCode = 1;
} finally {
  try {
    cleanupHarnessFirestoreEmulators('post-run');
  } catch (cleanupError) {
    console.error(
      '[firestore-test-harness]',
      cleanupError instanceof Error ? cleanupError.message : cleanupError
    );
    exitCode = 1;
  }
}

process.exitCode = exitCode;
