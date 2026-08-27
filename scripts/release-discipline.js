const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.join(__dirname, '..');

const RELEASE_METADATA_PATHS = new Set([
  'CHANGELOG.md',
  'metadata.json',
  'ngsw-config.json',
  'package-lock.json',
  'package.json',
  'public/release-history.json',
  'release-notes.json'
]);

function git(args, { allowFailure = false } = {}) {
  try {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    }).trim();
  } catch (error) {
    if (allowFailure) return '';
    const stderr = String(error?.stderr || '').trim();
    throw new Error(stderr || `git ${args.join(' ')} thất bại.`);
  }
}

function isTestPath(file) {
  return /(^|\/)(test|tests|__tests__)(\/|$)/.test(file)
    || /\.(test|spec)\.[cm]?[jt]sx?$/.test(file);
}

function isProductionRelevantPath(file) {
  const value = String(file || '').replace(/\\/g, '/');
  if (!value || isTestPath(value)) return false;
  if (RELEASE_METADATA_PATHS.has(value)) return true;
  if (/^(src|api|gas|public)\//.test(value)) return true;
  if (/^(angular\.json|capacitor\.config\.ts|firebase\.json|firestore\.(rules|indexes\.json)|index\.(html|tsx)|netlify\.toml|tailwind\.config\.js|tsconfig(\.[^.]+)?\.json|vercel\.json)$/.test(value)) return true;
  if (/^scripts\//.test(value) && !/^scripts\/(release-|sync-version|validate-release-notes|verify-runtime|vercel-ignore-build)/.test(value)) return true;
  return false;
}

function listChangedFiles(baseRef, headRef = 'HEAD') {
  const output = git(['diff', '--name-only', `${baseRef}..${headRef}`]);
  return output ? output.split(/\r?\n/).filter(Boolean) : [];
}

function readPackageVersion(ref) {
  const content = git(['show', `${ref}:package.json`]);
  return JSON.parse(content).version;
}

function fileChanged(baseRef, headRef, file) {
  return listChangedFiles(baseRef, headRef).includes(file);
}

function evaluateReleaseDiscipline({ changedFiles, baseVersion, headVersion, releaseNotesChanged }) {
  const relevantFiles = changedFiles.filter(isProductionRelevantPath);
  if (relevantFiles.length === 0) {
    return { relevantFiles, errors: [] };
  }

  const errors = [];
  if (baseVersion === headVersion) {
    errors.push(`Có thay đổi production nhưng version vẫn là ${headVersion}. Hãy cập nhật release-notes.json và chạy npm run release:prepare.`);
  }
  if (!releaseNotesChanged) {
    errors.push('Có thay đổi production nhưng release-notes.json không đổi trong phạm vi phát hành.');
  }
  return { relevantFiles, errors };
}

function resolveBaseRef(argv = process.argv.slice(2), env = process.env) {
  const inline = argv.find(arg => arg.startsWith('--base='));
  if (inline) return inline.slice('--base='.length);
  const index = argv.indexOf('--base');
  if (index >= 0 && argv[index + 1]) return argv[index + 1];
  if (env.RELEASE_BASE_REF) return env.RELEASE_BASE_REF;
  return '@{u}';
}

function run() {
  const baseRef = resolveBaseRef();
  const headRef = process.env.RELEASE_HEAD_REF || 'HEAD';
  const resolvedBase = git(['rev-parse', '--verify', baseRef], { allowFailure: true });
  if (!resolvedBase) {
    console.error(`[Release Discipline] Không xác minh được base ref ${baseRef}.`);
    process.exitCode = 1;
    return;
  }

  const changedFiles = listChangedFiles(resolvedBase, headRef);
  const result = evaluateReleaseDiscipline({
    changedFiles,
    baseVersion: readPackageVersion(resolvedBase),
    headVersion: readPackageVersion(headRef),
    releaseNotesChanged: fileChanged(resolvedBase, headRef, 'release-notes.json')
  });

  if (result.errors.length) {
    console.error(`[Release Discipline] ❌ phạm vi ${resolvedBase.slice(0, 12)}..${headRef} bị chặn:`);
    result.errors.forEach(error => console.error(`- ${error}`));
    console.error(`- File production: ${result.relevantFiles.join(', ')}`);
    process.exitCode = 1;
    return;
  }

  const summary = result.relevantFiles.length
    ? `${result.relevantFiles.length} file production có release metadata hợp lệ`
    : 'không có thay đổi production cần tăng version';
  console.log(`[Release Discipline] ✅ ${summary}.`);
}

if (require.main === module) run();

module.exports = {
  RELEASE_METADATA_PATHS,
  evaluateReleaseDiscipline,
  isProductionRelevantPath,
  isTestPath,
  listChangedFiles,
  resolveBaseRef
};
