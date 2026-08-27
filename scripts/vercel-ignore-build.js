const { execFileSync } = require('node:child_process');
const {
  isProductionRelevantPath,
  listChangedFiles
} = require('./release-discipline');

function resolveBase() {
  const candidates = [process.env.VERCEL_GIT_PREVIOUS_SHA, 'HEAD^'].filter(Boolean);
  for (const candidate of candidates) {
    try {
      execFileSync('git', ['rev-parse', '--verify', candidate], { stdio: 'ignore' });
      return candidate;
    } catch {
      // Thử ref tiếp theo; nếu không có ref an toàn thì build fail-open.
    }
  }
  return '';
}

function shouldIgnoreBuild(changedFiles) {
  return changedFiles.filter(isProductionRelevantPath).length === 0;
}

function run() {
  const base = resolveBase();
  if (!base) {
    console.log('[Vercel Ignore] Không có base ref tin cậy; tiếp tục build để an toàn.');
    process.exitCode = 1;
    return;
  }

  const changedFiles = listChangedFiles(base, 'HEAD');
  const relevantFiles = changedFiles.filter(isProductionRelevantPath);
  if (shouldIgnoreBuild(changedFiles)) {
    console.log('[Vercel Ignore] Chỉ có docs/CI/test; bỏ qua deployment.');
    process.exitCode = 0;
    return;
  }

  console.log(`[Vercel Ignore] Tiếp tục build vì có thay đổi production: ${relevantFiles.join(', ')}`);
  process.exitCode = 1;
}

if (require.main === module) run();

module.exports = {
  resolveBase,
  shouldIgnoreBuild
};
