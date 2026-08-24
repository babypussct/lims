const RELEASE_SECTIONS = ['highlights', 'features', 'improvements', 'fixes'];

function normalizeVersion(version) {
  const value = String(version || '').trim();
  if (!value) throw new Error('Release thiếu version.');
  return value.startsWith('v') ? value : `v${value}`;
}

function normalizeItems(value) {
  return Array.isArray(value)
    ? value.filter(item => typeof item === 'string' && item.trim()).map(item => item.trim())
    : [];
}

function releaseOrder(version) {
  const match = normalizeVersion(version).match(/^v(\d{2})\.(\d{2})\.(\d{2})-b(\d+)$/);
  if (!match) return 0;
  return Number(match[1]) * 1_000_000_000
    + Number(match[2]) * 10_000_000
    + Number(match[3]) * 100_000
    + Number(match[4]);
}

function normalizeRelease(item) {
  const version = normalizeVersion(item?.version);
  return {
    version,
    date: String(item?.date || '').trim(),
    title: String(item?.title || 'Cập nhật hệ thống').trim() || 'Cập nhật hệ thống',
    highlights: normalizeItems(item?.highlights),
    features: normalizeItems(item?.features),
    improvements: normalizeItems(item?.improvements),
    fixes: normalizeItems(item?.fixes),
    releaseOrder: releaseOrder(version)
  };
}

function normalizeReleaseContent(item) {
  return {
    title: String(item?.title || 'Cập nhật hệ thống').trim() || 'Cập nhật hệ thống',
    highlights: normalizeItems(item?.highlights),
    features: normalizeItems(item?.features),
    improvements: normalizeItems(item?.improvements),
    fixes: normalizeItems(item?.fixes)
  };
}

function releaseContentMatches(release, notes) {
  return JSON.stringify(normalizeReleaseContent(release)) === JSON.stringify(normalizeReleaseContent(notes));
}

function buildVersionForDate(currentVersion, now = new Date()) {
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const todayPrefix = `${yy}.${mm}.${dd}`;
  const current = normalizeVersion(currentVersion).slice(1);
  let buildNum = 1;

  if (current.startsWith(todayPrefix)) {
    const match = current.match(/-b(\d+)$/);
    if (match) buildNum = Number(match[1]) + 1;
  }

  return `${todayPrefix}-b${String(buildNum).padStart(2, '0')}`;
}

function selectReleaseVersion({ currentVersion, headVersion, releaseNotes, existingHistory, now, force = false }) {
  const normalizedCurrent = normalizeVersion(currentVersion);
  const history = Array.isArray(existingHistory) ? existingHistory : [];

  if (!force) {
    const currentHistory = history.find(item => {
      try {
        return normalizeVersion(item?.version) === normalizedCurrent;
      } catch {
        return false;
      }
    });

    if (currentHistory && releaseContentMatches(currentHistory, releaseNotes)) {
      return {
        version: normalizedCurrent.slice(1),
        bumped: false,
        reason: 'release-notes đã được đồng bộ cho version hiện tại'
      };
    }

    if (headVersion) {
      try {
        if (normalizeVersion(headVersion) !== normalizedCurrent) {
          return {
            version: normalizedCurrent.slice(1),
            bumped: false,
            reason: 'version hiện tại đã khác HEAD, coi như release đang được chuẩn bị dở'
          };
        }
      } catch {
        // Không dùng được HEAD làm guard thì tiếp tục theo cơ chế tăng version thông thường.
      }
    }
  }

  return {
    version: buildVersionForDate(currentVersion, now),
    bumped: true,
    reason: force ? 'force bump' : 'phát hiện release-notes mới'
  };
}

function mergeHistoricalRelease(existing, incoming) {
  const left = normalizeRelease(existing);
  const right = normalizeRelease(incoming);
  return {
    ...left,
    date: left.date || right.date,
    title: left.title && left.title !== 'Cập nhật hệ thống' ? left.title : right.title,
    highlights: left.highlights.length ? left.highlights : right.highlights,
    features: left.features.length ? left.features : right.features,
    improvements: left.improvements.length ? left.improvements : right.improvements,
    fixes: left.fixes.length ? left.fixes : right.fixes,
    releaseOrder: left.releaseOrder || right.releaseOrder
  };
}

function mergeReleaseHistory(currentRelease, ...historySources) {
  const current = normalizeRelease(currentRelease);
  const unique = new Map([[current.version, current]]);

  for (const source of historySources) {
    if (!Array.isArray(source)) continue;
    for (const item of source) {
      let release;
      try {
        release = normalizeRelease(item);
      } catch {
        continue;
      }

      // release-notes.json là nguồn chuẩn cho version hiện tại.
      if (release.version === current.version) continue;

      const existing = unique.get(release.version);
      unique.set(release.version, existing ? mergeHistoricalRelease(existing, release) : release);
    }
  }

  return [...unique.values()].sort((a, b) => b.releaseOrder - a.releaseOrder);
}

module.exports = {
  RELEASE_SECTIONS,
  normalizeVersion,
  normalizeItems,
  normalizeRelease,
  normalizeReleaseContent,
  releaseOrder,
  releaseContentMatches,
  buildVersionForDate,
  selectReleaseVersion,
  mergeHistoricalRelease,
  mergeReleaseHistory
};
