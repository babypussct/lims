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

function auditFullscreenOverlays(sources) {
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
    const allowed = overlayBaseline[file] || 0;
    if (count > allowed) violations.push({ file, count, allowed });
  }

  const staleBaseline = [];
  for (const [file, allowed] of Object.entries(overlayBaseline)) {
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

function main() {
  const sources = listProductionSources(appRoot);
  const colorViolations = auditColorUtilities(sources);
  const faTimesViolations = auditFaTimes(sources);
  const overlayAudit = auditFullscreenOverlays(sources);
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

  if (failures.length > 0) {
    console.error(failures.join('\n\n'));
    process.exitCode = 1;
    return;
  }

  const legacyOverlayCount = [...overlayAudit.counts.values()].reduce((sum, count) => sum + count, 0);
  console.log(
    `UI guardrails passed: ${sources.length} production source files scanned; ` +
    `0 invalid Tailwind color shades; 0 fa-times; ${legacyOverlayCount} legacy fullscreen overlays remain within baseline.`
  );
}

main();
