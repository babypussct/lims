const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const ngsw = JSON.parse(fs.readFileSync(path.join(root, 'ngsw-config.json'), 'utf8'));
const releaseNotesPath = path.join(root, 'release-notes.json');
const statePath = path.join(root, 'src/app/core/services/state.service.ts');
const metadataPath = path.join(root, 'metadata.json');
const releaseHistoryPath = path.join(root, 'public/release-history.json');
const changelogPath = path.join(root, 'CHANGELOG.md');
const packageLockPath = path.join(root, 'package-lock.json');
const expectedVersion = `v${pkg.version}`;
const appData = ngsw.appData || {};
const errors = [];
const releaseSections = ['highlights', 'features', 'improvements', 'fixes'];

function normalizeItems(value) {
  return Array.isArray(value)
    ? value.filter(item => typeof item === 'string' && item.trim()).map(item => item.trim())
    : [];
}

function normalizeReleaseContent(value) {
  return {
    title: String(value?.title || '').trim(),
    highlights: normalizeItems(value?.highlights),
    features: normalizeItems(value?.features),
    improvements: normalizeItems(value?.improvements),
    fixes: normalizeItems(value?.fixes)
  };
}

function buildChangelogBlock(release) {
  const sections = [
    ['highlights', '🚀 Điểm Nổi Bật Bản Này'],
    ['features', '✨ Tính Năng Mới'],
    ['improvements', '⚡ Cải Tiến & Tối Ưu'],
    ['fixes', '🐛 Sửa Lỗi Hệ Thống']
  ];
  let block = `### ${release.version}\n\n`;
  for (const [key, label] of sections) {
    block += `#### ${label}\n\n`;
    const items = normalizeItems(release[key]);
    block += items.length
      ? `${items.map(item => `- ${item}`).join('\n')}\n`
      : '- Không có thay đổi trong nhóm này.\n';
    block += '\n';
  }
  return block;
}

let releaseNotes;
try {
  releaseNotes = JSON.parse(fs.readFileSync(releaseNotesPath, 'utf8'));
} catch (error) {
  errors.push(`release-notes.json không tồn tại hoặc không phải JSON hợp lệ: ${error.message}`);
}

if (!releaseNotes || typeof releaseNotes.title !== 'string' || !releaseNotes.title.trim()) {
  errors.push('release-notes.json phải có title hợp lệ, không trống.');
}

for (const section of releaseSections) {
  if (!Array.isArray(releaseNotes?.[section])) {
    errors.push(`release-notes.json.${section} là mục bắt buộc và phải là một mảng (có thể để []).`);
  }
}

if (appData.version !== expectedVersion) {
  errors.push(`appData.version phải là ${expectedVersion}, hiện là ${appData.version || 'trống'}.`);
}
if (releaseNotes && appData.title !== releaseNotes.title.trim()) {
  errors.push('ngsw-config.json appData.title chưa đồng bộ với release-notes.json.');
}
if (releaseNotes) {
  const expectedFeatures = releaseSections
    .flatMap(section => normalizeItems(releaseNotes[section]))
    .slice(0, 5);
  if (JSON.stringify(appData.features || []) !== JSON.stringify(expectedFeatures)) {
    errors.push('ngsw-config.json appData.features chưa đồng bộ với release-notes.json.');
  }
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

if (fs.existsSync(packageLockPath)) {
  try {
    const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
    if (packageLock.version !== pkg.version || packageLock.packages?.['']?.version !== pkg.version) {
      errors.push(`package-lock.json phải đồng bộ version ${pkg.version}.`);
    }
  } catch (error) {
    errors.push(`package-lock.json không phải JSON hợp lệ: ${error.message}`);
  }
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
if (Array.isArray(releaseHistory)) {
  const currentVersions = new Set(releaseHistory.map(item => item?.version).filter(Boolean));
  const currentRelease = releaseHistory.find(item => item?.version === expectedVersion);
  if (currentRelease && releaseNotes) {
    if (JSON.stringify(normalizeReleaseContent(currentRelease)) !== JSON.stringify(normalizeReleaseContent(releaseNotes))) {
      errors.push(`public/release-history.json: nội dung ${expectedVersion} chưa đồng bộ với release-notes.json; hãy chạy npm run release:prepare.`);
    }
  }
  for (const item of releaseHistory) {
    for (const section of releaseSections) {
      if (!Array.isArray(item?.[section])) {
        errors.push(`public/release-history.json: ${item?.version || 'release không rõ'} thiếu mảng ${section}.`);
      }
    }
  }

  try {
    const headHistory = JSON.parse(execFileSync('git', ['show', 'HEAD:public/release-history.json'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }));
    if (Array.isArray(headHistory)) {
      for (const item of headHistory) {
        if (item?.version && !currentVersions.has(item.version)) {
          errors.push(`public/release-history.json đã làm mất release lịch sử ${item.version} có trong HEAD.`);
        }
      }
    }
  } catch {
    // Khi không có Git/HEAD, các kiểm tra cấu trúc còn lại vẫn hoạt động.
  }
}

const changelogContent = fs.existsSync(changelogPath) ? fs.readFileSync(changelogPath, 'utf8') : '';
if (!changelogContent.includes(`## Phiên bản hiện tại: ${expectedVersion}`)) {
  errors.push(`CHANGELOG.md phải có tiêu đề phiên bản hiện tại ${expectedVersion}.`);
}
if (Array.isArray(releaseHistory) && changelogContent) {
  const requiredHeadings = [
    '#### 🚀 Điểm Nổi Bật Bản Này',
    '#### ✨ Tính Năng Mới',
    '#### ⚡ Cải Tiến & Tối Ưu',
    '#### 🐛 Sửa Lỗi Hệ Thống'
  ];
  const releaseHeadings = changelogContent.match(/^### v\d{2}\.\d{2}\.\d{2}-b\d+$/gm) || [];
  if (releaseHeadings.length !== releaseHistory.length) {
    errors.push(`CHANGELOG.md phải có đúng ${releaseHistory.length} phiên bản, hiện có ${releaseHeadings.length}.`);
  }
  const currentRelease = releaseHistory.find(item => item?.version === expectedVersion);
  if (currentRelease) {
    const expectedCurrentBlock = buildChangelogBlock(currentRelease);
    const currentStart = changelogContent.indexOf(`### ${expectedVersion}\n`);
    const currentNext = currentStart < 0
      ? -1
      : changelogContent.indexOf('\n### ', currentStart + expectedVersion.length + 5);
    const currentBlock = currentStart < 0
      ? ''
      : changelogContent.slice(currentStart, currentNext < 0 ? changelogContent.length : currentNext);
    if (currentBlock.trimEnd() !== expectedCurrentBlock.trimEnd()) {
      errors.push(`CHANGELOG.md: nội dung ${expectedVersion} chưa đồng bộ với public/release-history.json; hãy chạy npm run release:prepare.`);
    }
  }
  for (const item of releaseHistory) {
    const startMarker = `### ${item.version}\n`;
    const start = changelogContent.indexOf(startMarker);
    const next = start < 0 ? -1 : changelogContent.indexOf('\n### ', start + startMarker.length);
    const block = start < 0
      ? ''
      : changelogContent.slice(start, next < 0 ? changelogContent.length : next);
    for (const heading of requiredHeadings) {
      if (!block.includes(heading)) {
        errors.push(`CHANGELOG.md: ${item.version} thiếu mục ${heading.replace(/^####\s+/, '')}.`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error('[Release Notes] Không thể build release:');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`[Release Notes] ✅ release-notes.json, UI và metadata đã đồng bộ ${expectedVersion}.`);
