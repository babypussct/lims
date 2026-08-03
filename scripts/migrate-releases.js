const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');
const {
  applicationDefault,
  cert,
  getApps,
  initializeApp
} = require('firebase-admin/app');
const { FieldValue, getFirestore } = require('firebase-admin/firestore');

const root = path.join(__dirname, '..');
const defaultSourcePath = path.join(__dirname, 'legacy-releases.json');
const explicitSourcePath = process.argv.find(argument => argument.startsWith('--source='))?.split('=').slice(1).join('=')
  || process.env.RELEASE_SOURCE
  || null;
const dryRun = process.argv.includes('--dry-run');

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

function parseLegacyTypeScript(source) {
  const start = source.indexOf('export const CHANGELOG_DATA');
  if (start < 0) return null;
  const end = source.indexOf('// ─── DÙNG CHO MODAL', start);
  const snippet = source.slice(start, end < 0 ? source.length : end)
    .replace('export const CHANGELOG_DATA', 'const CHANGELOG_DATA')
    .replace(/:\s*ChangelogItem\[\]/, '');
  const context = {};
  vm.runInNewContext(`${snippet}; result = CHANGELOG_DATA;`, context);
  return context.result;
}

function readLegacySource(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  if (filePath.endsWith('.ts')) {
    const releases = parseLegacyTypeScript(source);
    if (!releases) throw new Error(`Không tìm thấy CHANGELOG_DATA trong ${filePath}.`);
    return releases;
  }
  const releases = JSON.parse(source);
  if (!Array.isArray(releases)) throw new Error('Dữ liệu migration phải là một mảng release.');
  return releases;
}

function readReleases() {
  let releases;
  let sourceLabel;

  if (explicitSourcePath) {
    const resolvedPath = path.isAbsolute(explicitSourcePath)
      ? explicitSourcePath
      : path.join(root, explicitSourcePath);
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Không tìm thấy dữ liệu migration: ${resolvedPath}`);
    }
    releases = readLegacySource(resolvedPath);
    sourceLabel = resolvedPath;
  } else if (fs.existsSync(defaultSourcePath)) {
    releases = readLegacySource(defaultSourcePath);
    sourceLabel = defaultSourcePath;
  } else {
    // The migration is normally run before the hardcoded array is removed.
    // When this final refactor is already checked out, recover that array from
    // the previous Git revision and add the current release-notes.json entry.
    const legacyPath = 'src/app/core/services/changelog.service.ts';
    for (const ref of ['HEAD', 'HEAD^', 'HEAD~2']) {
      try {
        const source = execFileSync('git', ['show', `${ref}:${legacyPath}`], {
          cwd: root,
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore']
        });
        const legacyReleases = parseLegacyTypeScript(source);
        if (legacyReleases) {
          releases = legacyReleases;
          sourceLabel = `${ref}:${legacyPath}`;
          break;
        }
      } catch (_) {
        // Try the next revision; the source may not exist in shallow history.
      }
    }

    if (!releases) {
      throw new Error('Không tìm thấy dữ liệu CHANGELOG_DATA cũ. Dùng --source=<file.json|file.ts> để chỉ rõ nguồn.');
    }

    const notesPath = path.join(root, 'release-notes.json');
    const packagePath = path.join(root, 'package.json');
    const notes = JSON.parse(fs.readFileSync(notesPath, 'utf8'));
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    releases = [{
      version: `v${pkg.version}`,
      date: new Intl.DateTimeFormat('vi-VN').format(new Date()),
      title: notes.title,
      highlights: notes.highlights || [],
      features: notes.features || [],
      improvements: notes.improvements || [],
      fixes: notes.fixes || []
    }, ...releases];
  }

  const normalized = releases.map(item => {
    const version = normalizeVersion(item.version);
    return {
      version,
      date: String(item.date || '').trim(),
      title: String(item.title || '').trim(),
      highlights: Array.isArray(item.highlights) ? item.highlights : [],
      features: Array.isArray(item.features) ? item.features : [],
      improvements: Array.isArray(item.improvements) ? item.improvements : [],
      fixes: Array.isArray(item.fixes) ? item.fixes : [],
      releaseOrder: releaseOrder(version)
    };
  });

  const unique = new Map(normalized.map(release => [release.version, release]));
  return { sourceLabel, releases: [...unique.values()] };
}

function initializeAdmin() {
  if (getApps().length > 0) return getApps()[0];

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    return initializeApp({ credential: cert(serviceAccount) });
  }

  return initializeApp({ credential: applicationDefault() });
}

async function main() {
  const { sourceLabel, releases } = readReleases();
  console.log(`[Release Migration] Đã đọc ${releases.length} release từ ${sourceLabel}`);

  if (dryRun) {
    console.log('[Release Migration] Dry run — không ghi Firestore.');
    return;
  }

  initializeAdmin();
  const db = getFirestore();
  const collection = db.collection('releases');
  const batchSize = 400;

  for (let index = 0; index < releases.length; index += batchSize) {
    const batch = db.batch();
    const chunk = releases.slice(index, index + batchSize);
    chunk.forEach(release => {
      const ref = collection.doc(release.version);
      batch.set(ref, {
        ...release,
        migratedAt: FieldValue.serverTimestamp()
      }, { merge: true });
    });
    await batch.commit();
    console.log(`[Release Migration] Đã ghi ${Math.min(index + batchSize, releases.length)}/${releases.length}`);
  }

  console.log('[Release Migration] ✅ Hoàn tất. Có thể chạy lại an toàn vì thao tác là idempotent.');
}

main().catch(error => {
  console.error(`[Release Migration] ❌ ${error.message}`);
  process.exitCode = 1;
});
