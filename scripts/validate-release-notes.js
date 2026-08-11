const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const ngsw = JSON.parse(fs.readFileSync(path.join(root, 'ngsw-config.json'), 'utf8'));
const releaseNotesPath = path.join(root, 'release-notes.json');
const statePath = path.join(root, 'src/app/core/services/state.service.ts');
const metadataPath = path.join(root, 'metadata.json');
const releaseHistoryPath = path.join(root, 'public/release-history.json');
const changelogPath = path.join(root, 'CHANGELOG.md');
const expectedVersion = `v${pkg.version}`;
const appData = ngsw.appData || {};
const errors = [];

let releaseNotes;
try {
  releaseNotes = JSON.parse(fs.readFileSync(releaseNotesPath, 'utf8'));
} catch (error) {
  errors.push(`release-notes.json không tồn tại hoặc không phải JSON hợp lệ: ${error.message}`);
}

if (!releaseNotes || typeof releaseNotes.title !== 'string' || !releaseNotes.title.trim()) {
  errors.push('release-notes.json phải có title hợp lệ, không trống.');
}

if (appData.version !== expectedVersion) {
  errors.push(`appData.version phải là ${expectedVersion}, hiện là ${appData.version || 'trống'}.`);
}

const stateContent = fs.existsSync(statePath) ? fs.readFileSync(statePath, 'utf8') : '';
const stateVersionMatch = stateContent.match(/systemVersion\s*=\s*signal<string>\('([^']+)'\);/);
if (!stateVersionMatch || stateVersionMatch[1] !== expectedVersion) {
  errors.push(`state.service.ts systemVersion phải là ${expectedVersion}, hiện là ${stateVersionMatch?.[1] || 'trống'}.`);
}

let metadata;
try {
  metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
} catch (error) {
  errors.push(`metadata.json không tồn tại hoặc không phải JSON hợp lệ: ${error.message}`);
}
if (metadata?.name !== `LIMS Cloud ${expectedVersion}`) {
  errors.push(`metadata.json name phải là "LIMS Cloud ${expectedVersion}", hiện là ${metadata?.name || 'trống'}.`);
}

let releaseHistory;
try {
  releaseHistory = JSON.parse(fs.readFileSync(releaseHistoryPath, 'utf8'));
} catch (error) {
  errors.push(`public/release-history.json không tồn tại hoặc không phải JSON hợp lệ: ${error.message}`);
}
if (!Array.isArray(releaseHistory) || !releaseHistory.some(item => item?.version === expectedVersion)) {
  errors.push(`public/release-history.json phải có release ${expectedVersion}.`);
}

const changelogContent = fs.existsSync(changelogPath) ? fs.readFileSync(changelogPath, 'utf8') : '';
if (!changelogContent.includes(`## Phiên bản hiện tại: ${expectedVersion}`)) {
  errors.push(`CHANGELOG.md phải có tiêu đề phiên bản hiện tại ${expectedVersion}.`);
}

if (errors.length > 0) {
  console.error('[Release Notes] Không thể build release:');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`[Release Notes] ✅ release-notes.json, UI và metadata đã đồng bộ ${expectedVersion}.`);
