const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const ngsw = JSON.parse(fs.readFileSync(path.join(root, 'ngsw-config.json'), 'utf8'));
const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
const expectedVersion = `v${pkg.version}`;
const appData = ngsw.appData || {};
const errors = [];

if (appData.version !== expectedVersion) {
  errors.push(`appData.version phải là ${expectedVersion}, hiện là ${appData.version || 'trống'}.`);
}
if (appData.notesVersion !== expectedVersion) {
  errors.push(`appData.notesVersion phải là ${expectedVersion}; nội dung UI đang thuộc phiên bản cũ.`);
}
if (typeof appData.title !== 'string' || !appData.title.trim()) {
  errors.push('appData.title không được để trống.');
}
if (!Array.isArray(appData.features) || appData.features.length === 0
  || appData.features.some(feature => typeof feature !== 'string' || !feature.trim())) {
  errors.push('appData.features phải có ít nhất một nội dung nâng cấp hợp lệ.');
}
if (!changelog.includes(`## [${expectedVersion}]`)) {
  errors.push(`CHANGELOG.md chưa có mục ## [${expectedVersion}].`);
}

if (errors.length > 0) {
  console.error('[Release Notes] Không thể build release:');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`[Release Notes] ✅ UI và CHANGELOG đã đồng bộ ${expectedVersion}.`);
