const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

function parseNpmPackageManager(value) {
  const match = String(value || '').trim().match(/^npm@(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/);
  return match ? match[1] : null;
}

function parseNodeEngine(value) {
  const match = String(value || '').trim().match(/^(\d+)(?:\.(\d+))?\.x$/);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: match[2] === undefined ? null : Number(match[2])
  };
}

function parseNodeVersion(value) {
  const match = String(value || '').trim().replace(/^v/, '').match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3])
  };
}

function parseNvmrcMajor(value) {
  const match = String(value || '').trim().replace(/^v/, '').match(/^(\d+)(?:\.x|\.\d+(?:\.\d+)?)?$/);
  return match ? Number(match[1]) : null;
}

function evaluateRuntimePolicy({ packageManager, nodeEngine, nvmrc, actualNode, actualNpm }) {
  const errors = [];
  const expectedNpm = parseNpmPackageManager(packageManager);
  const expectedNode = parseNodeEngine(nodeEngine);
  const nodeVersion = parseNodeVersion(actualNode);
  const nvmrcMajor = parseNvmrcMajor(nvmrc);

  if (!expectedNpm) {
    errors.push('package.json.packageManager phải có dạng npm@x.y.z để pin chính xác npm.');
  } else if (String(actualNpm || '').trim() !== expectedNpm) {
    errors.push(`npm hiện tại là ${String(actualNpm || '').trim() || 'không xác định'}, cần ${expectedNpm}. Hãy cài đúng packageManager trước khi release.`);
  }

  if (!expectedNode) {
    errors.push('package.json.engines.node phải có dạng <major>.x hoặc <major>.<minor>.x.');
  } else {
    if (!nodeVersion) {
      errors.push(`Không đọc được Node runtime hiện tại: ${String(actualNode || '').trim() || 'trống'}.`);
    } else if (
      nodeVersion.major !== expectedNode.major
      || (expectedNode.minor !== null && nodeVersion.minor !== expectedNode.minor)
    ) {
      errors.push(`Node hiện tại là ${String(actualNode).trim()}, không khớp engines.node=${nodeEngine}. Hãy dùng runtime của repository trước khi release.`);
    }

    if (nvmrcMajor === null) {
      errors.push('.nvmrc phải khai báo một Node major hợp lệ.');
    } else if (nvmrcMajor !== expectedNode.major) {
      errors.push(`.nvmrc đang dùng Node ${nvmrcMajor} nhưng package.json.engines.node yêu cầu ${nodeEngine}.`);
    }
  }

  return errors;
}

function collectRuntimePolicy(root = path.join(__dirname, '..')) {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const nvmrc = fs.readFileSync(path.join(root, '.nvmrc'), 'utf8').trim();
  const actualNpm = execFileSync('npm', ['--version'], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim();

  return {
    packageManager: pkg.packageManager,
    nodeEngine: pkg.engines?.node,
    nvmrc,
    actualNode: process.versions.node,
    actualNpm
  };
}

function run() {
  let policy;
  try {
    policy = collectRuntimePolicy();
  } catch (error) {
    console.error(`[Runtime Gate] ❌ Không đọc được chính sách runtime: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const errors = evaluateRuntimePolicy(policy);
  if (errors.length) {
    console.error('[Runtime Gate] ❌ Runtime phát hành không đạt:');
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `[Runtime Gate] ✅ Node ${policy.actualNode} khớp ${policy.nodeEngine}; npm ${policy.actualNpm} khớp ${policy.packageManager}.`
  );
}

if (require.main === module) run();

module.exports = {
  parseNpmPackageManager,
  parseNodeEngine,
  parseNodeVersion,
  parseNvmrcMajor,
  evaluateRuntimePolicy,
  collectRuntimePolicy
};
