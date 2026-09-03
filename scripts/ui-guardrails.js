const fs = require('node:fs');
const path = require('node:path');
const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('../tailwind.config.js');
const overlayBaseline = require('./ui-overlay-baseline.json');

const repoRoot = path.resolve(__dirname, '..');
const appRoot = path.join(repoRoot, 'src', 'app');
const modalShellRoot = path.join(appRoot, 'shared', 'components', 'ui', 'modal-shell');

const colorUtilityPattern = /(?<![A-Za-z0-9_-])((?:(?:[A-Za-z0-9_-]+|\[[^\]\s]+\]):)*(?:bg|text|border(?:-[trblxy])?|ring(?:-offset)?|outline|divide|from|via|to|placeholder|decoration|caret|accent|fill|stroke|shadow)-([a-z][a-z0-9-]*)-(\d{2,3})(?:\/(?:\d{1,3}|\[[^\]]+\]))?)/g;
const faTimesPattern = /\bfa-times\b/g;
const fullscreenOverlayPattern = /(?:\bfixed\b[^\r\n]{0,240}\binset-0\b|\binset-0\b[^\r\n]{0,240}\bfixed\b)/g;

function toRepoPath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join('/');
}

function isProductionSource(filePath) {
  if (!/\.(?:ts|html)$/.test(filePath)) return false;
  const fileName = path.basename(filePath);
  return !/\.(?:test|spec)\.ts$/.test(fileName) && !/\.contract\.test\.ts$/.test(fileName);
}

function listProductionSources(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listProductionSources(fullPath));
    } else if (isProductionSource(fullPath)) {
      files.push(fullPath);
    }
  }
  return files.sort();
}

function lineNumberAt(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function auditColorUtilities(sources) {
  const resolvedTheme = resolveConfig(tailwindConfig).theme || {};
  const colors = resolvedTheme.colors || {};
  const violations = [];

  for (const filePath of sources) {
    const text = fs.readFileSync(filePath, 'utf8');
    colorUtilityPattern.lastIndex = 0;
    let match;
    while ((match = colorUtilityPattern.exec(text)) !== null) {
      const utility = match[1];
      const paletteName = match[2];
      const shade = match[3];
      const palette = colors[paletteName];
      if (!palette || typeof palette !== 'object' || !Object.prototype.hasOwnProperty.call(palette, shade)) {
        violations.push({
          file: toRepoPath(filePath),
          line: lineNumberAt(text, match.index),
          utility,
          paletteName,
          shade
        });
      }
    }
  }

  return violations;
}

function auditFaTimes(sources) {
  const violations = [];
  for (const filePath of sources) {
    const text = fs.readFileSync(filePath, 'utf8');
    faTimesPattern.lastIndex = 0;
    let match;
    while ((match = faTimesPattern.exec(text)) !== null) {
      violations.push({
        file: toRepoPath(filePath),
        line: lineNumberAt(text, match.index)
      });
    }
  }
  return violations;
}

function filterBaselineForSourceRoot(baseline, resolvedSourceRoot) {
  const filtered = {};
  const relativePrefix = toRepoPath(resolvedSourceRoot);
  for (const [file, allowed] of Object.entries(baseline)) {
    if (file === relativePrefix || file.startsWith(relativePrefix + '/')) {
      filtered[file] = allowed;
    }
  }
  return filtered;
}

function auditFullscreenOverlays(sources, baseline = overlayBaseline) {
  const counts = new Map();

  for (const filePath of sources) {
    if (filePath.startsWith(modalShellRoot + path.sep)) continue;
    const text = fs.readFileSync(filePath, 'utf8');
    fullscreenOverlayPattern.lastIndex = 0;
    const count = [...text.matchAll(fullscreenOverlayPattern)].length;
    if (count > 0) counts.set(toRepoPath(filePath), count);
  }

  const violations = [];
  for (const [file, count] of counts) {
    const allowed = baseline[file] || 0;
    if (count > allowed) violations.push({ file, count, allowed });
  }

  const staleBaseline = [];
  for (const [file, allowed] of Object.entries(baseline)) {
    const count = counts.get(file) || 0;
    if (count < allowed) staleBaseline.push({ file, count, allowed });
  }

  return { counts, violations, staleBaseline };
}

function formatFailure(title, rows) {
  const lines = [`${title}:`];
  for (const row of rows) lines.push(`  - ${row}`);
  return lines.join('\n');
}

function parseOpeningTags(text, tagName) {
  const tags = [];
  const startRegex = new RegExp(`<${tagName}\\b`, 'g');
  let startMatch;
  while ((startMatch = startRegex.exec(text)) !== null) {
    const startIndex = startMatch.index;
    let i = startIndex + startMatch[0].length;
    let inQuote = null;
    while (i < text.length) {
      const char = text[i];
      if (inQuote) {
        if (char === inQuote) {
          inQuote = null;
        }
      } else if (char === '"' || char === "'") {
        inQuote = char;
      } else if (char === '>') {
        break;
      }
      i++;
    }
    const tag = text.slice(startIndex, i + 1);
    tags.push({ tag, index: startIndex });
  }
  return tags;
}

function parseClassReferences(tagString) {
  const references = [];

  const staticClassMatch = tagString.match(/\bclass\s*=\s*("([^"]*)"|'([^']*)')/);
  if (staticClassMatch) {
    const raw = staticClassMatch[2] ?? staticClassMatch[3] ?? '';
    if (raw.includes('{{')) {
      references.push({ kind: 'opaque', attribute: 'class', expression: raw });
    } else {
      const tokens = raw.trim().split(/\s+/).filter(Boolean);
      for (const t of tokens) {
        references.push({ kind: 'token', value: t });
      }
    }
  }

  const dynamicClassMatch = tagString.match(/\[class\]\s*=\s*("([^"]*)"|'([^']*)')/);
  if (dynamicClassMatch) {
    const raw = (dynamicClassMatch[2] ?? dynamicClassMatch[3] ?? '').trim();
    const stringLiteralMatch = raw.match(/^'([^']*)'$/) || raw.match(/^"([^"]*)"$/);
    if (stringLiteralMatch) {
      const inner = stringLiteralMatch[1].trim();
      const tokens = inner.split(/\s+/).filter(Boolean);
      for (const t of tokens) {
        references.push({ kind: 'token', value: t });
      }
    } else {
      references.push({ kind: 'opaque', attribute: '[class]', expression: raw });
    }
  }

  const classTokenRegex = /\[class\.([a-zA-Z0-9_\-\/:]+)\]\s*=\s*("([^"]*)"|'([^']*)')/g;
  let ctMatch;
  while ((ctMatch = classTokenRegex.exec(tagString)) !== null) {
    const token = ctMatch[1];
    references.push({ kind: 'token', value: token });
  }

  const ngClassMatch = tagString.match(/\[ngClass\]\s*=\s*("([^"]*)"|'([^']*)')/);
  if (ngClassMatch) {
    const raw = (ngClassMatch[2] ?? ngClassMatch[3] ?? '').trim();

    const strLit = raw.match(/^'([^']*)'$/) || raw.match(/^"([^"]*)"$/);
    if (strLit) {
      const tokens = strLit[1].trim().split(/\s+/).filter(Boolean);
      for (const t of tokens) {
        references.push({ kind: 'token', value: t });
      }
    }
    else if (raw.startsWith('[') && raw.endsWith(']')) {
      const inner = raw.slice(1, -1).trim();
      const items = inner.split(',').map((s) => s.trim()).filter(Boolean);
      let allStringLiterals = true;
      const parsedTokens = [];
      for (const item of items) {
        const itemMatch = item.match(/^'([^']*)'$/) || item.match(/^"([^"]*)"$/);
        if (itemMatch) {
          parsedTokens.push(...itemMatch[1].trim().split(/\s+/).filter(Boolean));
        } else {
          allStringLiterals = false;
          break;
        }
      }
      if (allStringLiterals) {
        for (const t of parsedTokens) {
          references.push({ kind: 'token', value: t });
        }
      } else {
        references.push({ kind: 'opaque', attribute: '[ngClass]', expression: raw });
      }
    }
    else if (raw.startsWith('{') && raw.endsWith('}')) {
      const inner = raw.slice(1, -1).trim();
      if (inner.includes('...')) {
        references.push({ kind: 'opaque', attribute: '[ngClass]', expression: raw });
      } else if (/\[[^\]]+\]\s*:/.test(inner)) {
        references.push({ kind: 'opaque', attribute: '[ngClass]', expression: raw });
      } else {
        const keyRegex = /(?:'([^']*)'|"([^"]*)"|([a-zA-Z0-9_\-\/]+))\s*:/g;
        let kMatch;
        let foundKeys = 0;
        while ((kMatch = keyRegex.exec(inner)) !== null) {
          foundKeys++;
          const key = (kMatch[1] ?? kMatch[2] ?? kMatch[3] ?? '').trim();
          const tokens = key.split(/\s+/).filter(Boolean);
          for (const t of tokens) {
            references.push({ kind: 'token', value: t });
          }
        }
        if (foundKeys === 0 && inner.length > 0) {
          references.push({ kind: 'opaque', attribute: '[ngClass]', expression: raw });
        }
      }
    }
    else {
      references.push({ kind: 'opaque', attribute: '[ngClass]', expression: raw });
    }
  }

  // 5. Angular [attr.class]="expr"
  const attrClassMatch = tagString.match(/\[attr\.class\]\s*=\s*("([^"]*)"|'([^']*)')/);
  if (attrClassMatch) {
    const raw = (attrClassMatch[2] ?? attrClassMatch[3] ?? '').trim();
    references.push({ kind: 'opaque', attribute: '[attr.class]', expression: raw });
  }

  // 6. Angular [className]="expr"
  const classNameMatch = tagString.match(/\[className\]\s*=\s*("([^"]*)"|'([^']*)')/);
  if (classNameMatch) {
    const raw = (classNameMatch[2] ?? classNameMatch[3] ?? '').trim();
    references.push({ kind: 'opaque', attribute: '[className]', expression: raw });
  }

  return references;
}

function parseClassTokens(tagString) {
  const refs = parseClassReferences(tagString);
  return refs.filter((r) => r.kind === 'token').map((r) => r.value);
}

function normalizeToken(token) {
  let bracketDepth = 0;
  let lastTopLevelColon = -1;

  for (let i = 0; i < token.length; i++) {
    const char = token[i];
    if (char === '[') bracketDepth++;
    else if (char === ']') bracketDepth = Math.max(0, bracketDepth - 1);
    else if (char === ':' && bracketDepth === 0) {
      lastTopLevelColon = i;
    }
  }

  let base = token.slice(lastTopLevelColon + 1);
  if (base.startsWith('!')) base = base.slice(1);
  return base;
}

const PAGE_HEADER_ALLOWLIST = new Set([
  'block', 'inline-block', 'shrink-0', 'w-full', 'relative', 'z-10', 'z-20',
  'mt-4', 'md:mt-6', 'mb-2', 'mb-4', 'mb-5', 'mb-6', 'mb-8', 'mx-auto',
  'border-0', 'border-transparent', 'shadow-none', 'ring-0', 'bg-transparent', 'rounded-none'
]);

const PAGE_HEADER_DENYLIST_REGEX = /^(?:border(?:-[a-z0-9\/-]+|-(?:\[[^\]]+\]))?|shadow(?:-[a-z0-9\/-]+|-(?:\[[^\]]+\]))?|ring(?:-[a-z0-9\/-]+|-(?:\[[^\]]+\]))?|bg-(?!transparent)(?:[a-z0-9\/-]+|\[[^\]]+\])|rounded(?:-[a-z0-9\/-]+|-(?:\[[^\]]+\]))?|overflow-hidden)$/;

function auditPageHeaderPurity(sources) {
  const violations = [];

  for (const filePath of sources) {
    const text = fs.readFileSync(filePath, 'utf8');
    const tags = parseOpeningTags(text, 'app-page-header');

    for (const { tag, index } of tags) {
      const variantMatch = tag.match(/\bvariant=["']([^"']+)["']/);
      if (variantMatch) {
        const v = variantMatch[1];
        if (v === 'workspace' || v === 'detail' || v === 'section') {
          continue;
        }
      }

      const references = parseClassReferences(tag);
      for (const ref of references) {
        if (ref.kind === 'opaque') {
          violations.push({
            file: toRepoPath(filePath),
            line: lineNumberAt(text, index),
            token: `${ref.attribute}="${ref.expression}"`,
            reason: 'opaque-class-binding',
            tag: tag.slice(0, 100)
          });
          continue;
        }

        const token = ref.value;
        if (PAGE_HEADER_ALLOWLIST.has(token)) continue;
        const base = normalizeToken(token);
        if (PAGE_HEADER_ALLOWLIST.has(base)) continue;

        if (PAGE_HEADER_DENYLIST_REGEX.test(base)) {
          violations.push({
            file: toRepoPath(filePath),
            line: lineNumberAt(text, index),
            token,
            reason: 'denied-class-token',
            tag: tag.slice(0, 100)
          });
        }
      }
    }
  }

  return violations;
}

function runAudits(sources, options = {}) {
  const baseline = options.overlayBaseline ?? overlayBaseline;
  const colorViolations = auditColorUtilities(sources);
  const faTimesViolations = auditFaTimes(sources);
  const overlayAudit = auditFullscreenOverlays(sources, baseline);
  const pageHeaderViolations = auditPageHeaderPurity(sources);
  const failures = [];

  if (colorViolations.length > 0) {
    failures.push(formatFailure(
      'Tailwind color utilities reference undefined palette/shade combinations',
      colorViolations.map((item) => `${item.file}:${item.line} ${item.utility} (${item.paletteName}.${item.shade} is undefined)`)
    ));
  }

  if (faTimesViolations.length > 0) {
    failures.push(formatFailure(
      'Deprecated Font Awesome close icon alias found',
      faTimesViolations.map((item) => `${item.file}:${item.line} fa-times`)
    ));
  }

  if (overlayAudit.violations.length > 0) {
    failures.push(formatFailure(
      'New ad-hoc fullscreen overlay detected outside app-modal-shell',
      overlayAudit.violations.map((item) => `${item.file} has ${item.count}; legacy baseline allows ${item.allowed}`)
    ));
  }

  if (overlayAudit.staleBaseline.length > 0) {
    failures.push(formatFailure(
      'Legacy fullscreen overlay baseline is stale',
      overlayAudit.staleBaseline.map((item) => `${item.file} has ${item.count}; baseline still allows ${item.allowed}`)
    ));
  }

  if (pageHeaderViolations.length > 0) {
    failures.push(formatFailure(
      'app-page-header must not have borders, cards, shadows, or background decoration on page variant',
      pageHeaderViolations.map((item) => `${item.file}:${item.line} prohibited class/binding '${item.token}' (${item.reason})`)
    ));
  }

  return {
    failures,
    colorViolations,
    faTimesViolations,
    overlayAudit,
    pageHeaderViolations
  };
}

function getCliSourceRoot() {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source-root' && i + 1 < args.length) {
      return path.resolve(args[i + 1]);
    }
  }
  return null;
}

function main(options = {}) {
  const sourceRoot = options.sourceRoot ?? getCliSourceRoot() ?? appRoot;
  const resolvedSourceRoot = path.resolve(sourceRoot);
  const resolvedRepoRoot = path.resolve(repoRoot);
  const isOutsideRepository =
    resolvedSourceRoot !== resolvedRepoRoot &&
    !resolvedSourceRoot.startsWith(`${resolvedRepoRoot}${path.sep}`);

  const effectiveBaseline = options.overlayBaseline ?? (isOutsideRepository
    ? {}
    : (resolvedSourceRoot === path.resolve(appRoot)
      ? overlayBaseline
      : filterBaselineForSourceRoot(overlayBaseline, resolvedSourceRoot)));

  const sources = options.sources ?? listProductionSources(resolvedSourceRoot);
  const result = runAudits(sources, { overlayBaseline: effectiveBaseline });

  if (result.failures.length > 0) {
    console.error(result.failures.join('\n\n'));
    if (options.exitOnFinish !== false) {
      process.exitCode = 1;
    }
    return result;
  }

  const legacyOverlayCount = [...result.overlayAudit.counts.values()].reduce((sum, count) => sum + count, 0);
  console.log(
    `UI guardrails passed: ${sources.length} production source files scanned; ` +
    `0 invalid Tailwind color shades; 0 fa-times; 0 page-header decorations; ${legacyOverlayCount} legacy fullscreen overlays remain within baseline.`
  );
  return result;
}

if (require.main === module) {
  main();
}

module.exports = {
  appRoot,
  auditColorUtilities,
  auditFaTimes,
  auditFullscreenOverlays,
  auditPageHeaderPurity,
  filterBaselineForSourceRoot,
  listProductionSources,
  main,
  normalizeToken,
  parseClassReferences,
  parseClassTokens,
  parseOpeningTags,
  runAudits,
  toRepoPath
};
