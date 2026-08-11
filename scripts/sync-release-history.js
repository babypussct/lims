const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const packagePath = path.join(root, 'package.json');
const notesPath = path.join(root, 'release-notes.json');
const legacyPath = path.join(__dirname, 'legacy-releases.json');
const outputPath = path.join(root, 'public', 'release-history.json');

function normalizeVersion(version) {
  const value = String(version || '').trim();
  if (!value) throw new Error('Release thiếu version.');
  return value.startsWith('v') ? value : `v${value}`;
}

function releaseOrder(version) {
  const match = normalizeVersion(version).match(/^v(\d{2})\.(\d{2})\.(\d{2})-b(\d+)$/);
  if (!match) return 0;
  return Number(match[1]) * 1_000_000_000
    + Number(match[2]) * 10_000_000
    + Number(match[3]) * 100_000
    + Number(match[4]);
}

function normalizeItems(value) {
  return Array.isArray(value)
    ? value.filter(item => typeof item === 'string' && item.trim()).map(item => item.trim())
    : [];
}

function normalizeRelease(item) {
  const version = normalizeVersion(item.version);
  return {
    version,
    date: String(item.date || '').trim(),
    title: String(item.title || 'Cập nhật hệ thống').trim(),
    ...(normalizeItems(item.highlights).length ? { highlights: normalizeItems(item.highlights) } : {}),
    ...(normalizeItems(item.features).length ? { features: normalizeItems(item.features) } : {}),
    ...(normalizeItems(item.improvements).length ? { improvements: normalizeItems(item.improvements) } : {}),
    ...(normalizeItems(item.fixes).length ? { fixes: normalizeItems(item.fixes) } : {}),
    releaseOrder: releaseOrder(version)
  };
}

const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const notes = JSON.parse(fs.readFileSync(notesPath, 'utf8'));
const legacy = JSON.parse(fs.readFileSync(legacyPath, 'utf8'));
const currentVersion = normalizeVersion(pkg.version);
const currentRelease = {
  version: currentVersion,
  date: new Intl.DateTimeFormat('vi-VN').format(new Date()),
  title: notes.title,
  highlights: notes.highlights || [],
  features: notes.features || [],
  improvements: notes.improvements || [],
  fixes: notes.fixes || []
};

const unique = new Map();
for (const item of [currentRelease, ...legacy]) {
  const release = normalizeRelease(item);
  if (!unique.has(release.version)) unique.set(release.version, release);
}

const releases = [...unique.values()].sort((a, b) => b.releaseOrder - a.releaseOrder);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(releases, null, 2) + '\n');
console.log(`[Release History] Đã ghi ${releases.length} release vào public/release-history.json.`);
