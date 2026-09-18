const { readdirSync, readFileSync, statSync } = require('node:fs');
const { join, sep } = require('node:path');

const ROOTS = ['src', 'api', 'scripts'];
const TEST_FILE_RE = /\.(?:test|spec)\.(?:ts|js)$/;
const TEST_REF_RE = /(?:src|api|scripts)\/[A-Za-z0-9_./*?-]+\.(?:test|spec)\.(?:ts|js)/g;

function walk(dir, output = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path, output);
    else if (TEST_FILE_RE.test(name)) output.push(path.split(sep).join('/'));
  }
  return output;
}

function globPatternToRegExp(pattern) {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  const regex = escaped.replace(/\*\*/g, '::DOUBLE_STAR::').replace(/\*/g, '[^/]*').replace(/::DOUBLE_STAR::/g, '.*');
  return new RegExp(`^${regex}$`);
}

function collectRunnerText() {
  let text = readFileSync('package.json', 'utf8');
  for (const path of walkScriptSources('scripts')) text += `\n${readFileSync(path, 'utf8')}`;
  return text;
}

function walkScriptSources(dir, output = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) walkScriptSources(path, output);
    else if (/\.(?:js|cjs|mjs|ts)$/.test(name)) output.push(path);
  }
  return output;
}

const testFiles = ROOTS.flatMap(root => walk(root));
const runnerText = collectRunnerText();
const references = [...new Set(runnerText.match(TEST_REF_RE) || [])];
const matchers = references.map(globPatternToRegExp);
const uncovered = testFiles.filter(file => !matchers.some(matcher => matcher.test(file)));

if (uncovered.length > 0) {
  console.error('Test files not covered by any package/runner command:');
  for (const file of uncovered) console.error(` - ${file}`);
  process.exit(1);
}

console.log(`Test coverage audit passed: ${testFiles.length} test files are referenced by release runners.`);
