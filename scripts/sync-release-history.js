const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { normalizeVersion, mergeReleaseHistory } = require('./release-pipeline');

const root = path.join(__dirname, '..');
const packagePath = path.join(root, 'package.json');
const notesPath = path.join(root, 'release-notes.json');
const legacyPath = path.join(__dirname, 'legacy-releases.json');
const recoveredPath = path.join(__dirname, 'recovered-releases.json');
const outputPath = path.join(root, 'public', 'release-history.json');

function readJsonArray(filePath) {
  if (!fs.existsSync(filePath)) return [];
  try {
    const value = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function readHeadHistory() {
  try {
    const raw = execFileSync('git', ['show', 'HEAD:public/release-history.json'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    });
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function readGitHistories(limit = 50) {
  let refs = [];
  try {
    refs = execFileSync('git', ['rev-list', '--all', '--', 'public/release-history.json'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).split(/\r?\n/).filter(Boolean).slice(0, limit);
  } catch {
    return [];
  }

  const histories = [];
  for (const ref of refs) {
    try {
      const raw = execFileSync('git', ['show', `${ref}:public/release-history.json`], {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore']
      });
      const value = JSON.parse(raw);
      if (Array.isArray(value)) histories.push(value);
    } catch {
      // Một revision có thể không chứa file hoặc dữ liệu cũ không còn parse được.
    }
  }
  return histories;
}

const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const notes = JSON.parse(fs.readFileSync(notesPath, 'utf8'));
const existing = readJsonArray(outputPath);
const headHistory = readHeadHistory();
const gitHistories = readGitHistories();
const legacy = readJsonArray(legacyPath);
const recovered = readJsonArray(recoveredPath);
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

const releases = mergeReleaseHistory(currentRelease, existing, headHistory, ...gitHistories, legacy, recovered);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(releases, null, 2) + '\n');
console.log(`[Release History] Đã ghi ${releases.length} release vào public/release-history.json.`);
