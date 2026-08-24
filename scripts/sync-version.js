const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { RELEASE_SECTIONS, selectReleaseVersion } = require('./release-pipeline');

const packagePath = path.join(__dirname, '../package.json');
const packageLockPath = path.join(__dirname, '../package-lock.json');
const ngswPath = path.join(__dirname, '../ngsw-config.json');
const statePath = path.join(__dirname, '../src/app/core/services/state.service.ts');
const metadataPath = path.join(__dirname, '../metadata.json');
const releaseNotesPath = path.join(__dirname, '../release-notes.json');
const releaseHistoryPath = path.join(__dirname, '../public/release-history.json');

function readReleaseNotes() {
  if (!fs.existsSync(releaseNotesPath)) {
    throw new Error('Không tìm thấy release-notes.json. Hãy tạo nội dung release trước khi đồng bộ phiên bản.');
  }

  let notes;
  try {
    notes = JSON.parse(fs.readFileSync(releaseNotesPath, 'utf8'));
  } catch (error) {
    throw new Error(`release-notes.json không phải JSON hợp lệ: ${error.message}`);
  }

  if (!notes || typeof notes !== 'object' || typeof notes.title !== 'string' || !notes.title.trim()) {
    throw new Error('release-notes.json phải có trường title không trống.');
  }

  for (const section of RELEASE_SECTIONS) {
    if (!Array.isArray(notes[section])) {
      throw new Error(`release-notes.json.${section} là mục bắt buộc và phải là một mảng (có thể để []).`);
    }
  }

  return notes;
}

const releaseNotes = readReleaseNotes();
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
let existingHistory = [];
if (fs.existsSync(releaseHistoryPath)) {
  try {
    existingHistory = JSON.parse(fs.readFileSync(releaseHistoryPath, 'utf8'));
  } catch {
    existingHistory = [];
  }
}

let headVersion = null;
try {
  const headPackage = JSON.parse(execFileSync('git', ['show', 'HEAD:package.json'], {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore']
  }));
  headVersion = headPackage.version || null;
} catch {
  // Repo không có Git/HEAD vẫn có thể dùng lịch sử đã sinh để chống bump lặp.
}

const force = process.argv.includes('--force') || process.env.RELEASE_FORCE_BUMP === '1';
const selection = selectReleaseVersion({
  currentVersion: pkg.version,
  headVersion,
  releaseNotes,
  existingHistory,
  now: new Date(),
  force
});
const newVersion = selection.version;

pkg.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
console.log(selection.bumped
  ? `[Auto-Version] 🚀 Đã phát sinh phiên bản: v${newVersion}`
  : `[Auto-Version] ♻️ Giữ nguyên phiên bản v${newVersion}: ${selection.reason}.`);

if (fs.existsSync(packageLockPath)) {
  const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
  packageLock.version = newVersion;
  if (packageLock.packages && packageLock.packages['']) {
    packageLock.packages[''].version = newVersion;
  }
  fs.writeFileSync(packageLockPath, JSON.stringify(packageLock, null, 2) + '\n');
  console.log('✅ Đã đồng bộ package-lock.json');
}

// 4. Đồng bộ vào ngsw-config.json (Cho popup cập nhật + nội dung release)
if (fs.existsSync(ngswPath)) {
  const ngswConfig = JSON.parse(fs.readFileSync(ngswPath, 'utf8'));
  const features = RELEASE_SECTIONS
    .flatMap(section => releaseNotes[section] || [])
    .filter(feature => typeof feature === 'string' && feature.trim())
    .map(feature => feature.trim())
    .slice(0, 5);

  ngswConfig.appData = {
    ...(ngswConfig.appData || {}),
    version: `v${newVersion}`,
    title: releaseNotes.title.trim(),
    features
  };
  delete ngswConfig.appData.notesVersion;

  fs.writeFileSync(ngswPath, JSON.stringify(ngswConfig, null, 2) + '\n');
  console.log('✅ Đã đồng bộ ngsw-config.json');
  console.log(`✅ Đã nhúng nội dung release vào appData (${features.length} mục)`);
}

// 5. Đồng bộ vào state.service.ts (Cho Login & Header)
if (fs.existsSync(statePath)) {
  let stateContent = fs.readFileSync(statePath, 'utf8');
  const stateRegex = /systemVersion\s*=\s*signal<string>\('[^']+'\);/g;
  stateContent = stateContent.replace(stateRegex, `systemVersion = signal<string>('v${newVersion}');`);
  fs.writeFileSync(statePath, stateContent);
  console.log('✅ Đã đồng bộ state.service.ts');
}

// 6. Đồng bộ vào metadata.json
if (fs.existsSync(metadataPath)) {
  let metadataContent = fs.readFileSync(metadataPath, 'utf8');
  const metaRegex = /"name":\s*"LIMS Cloud [^"]+"/g;
  metadataContent = metadataContent.replace(metaRegex, `"name": "LIMS Cloud v${newVersion}"`);
  fs.writeFileSync(metadataPath, metadataContent);
  console.log('✅ Đã đồng bộ metadata.json');
}

console.log('🎉 Hoàn tất tự động đánh số phiên bản!');
