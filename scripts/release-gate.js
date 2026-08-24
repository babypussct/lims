const { execFileSync } = require('node:child_process');

function git(args, { allowFailure = false } = {}) {
  try {
    return execFileSync('git', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    }).trim();
  } catch (error) {
    if (allowFailure) return '';
    const stderr = String(error?.stderr || '').trim();
    throw new Error(stderr || `git ${args.join(' ')} thất bại.`);
  }
}

function parseAheadBehind(value) {
  const [aheadRaw = '0', behindRaw = '0'] = String(value || '').trim().split(/\s+/);
  return {
    ahead: Number(aheadRaw) || 0,
    behind: Number(behindRaw) || 0
  };
}

function splitUpstream(upstream) {
  const value = String(upstream || '').trim();
  const separator = value.indexOf('/');
  if (separator <= 0 || separator === value.length - 1) return null;
  return {
    remote: value.slice(0, separator),
    branch: value.slice(separator + 1)
  };
}

function evaluateReleaseGate(mode, state, options = {}) {
  if (!['prepush', 'predeploy'].includes(mode)) {
    throw new Error(`Release gate không hỗ trợ mode "${mode}".`);
  }

  const deployBranch = options.deployBranch || 'main';
  const errors = [];

  if (!state.branch || state.branch === 'HEAD') {
    errors.push('HEAD đang ở trạng thái detached; hãy checkout một branch trước khi phát hành.');
  }
  if (state.conflicts?.length) {
    errors.push(`Repo còn file conflict chưa xử lý: ${state.conflicts.join(', ')}.`);
  }
  if (state.dirty?.length) {
    errors.push('Working tree chưa sạch; commit hoặc xử lý toàn bộ thay đổi trước khi push/deploy.');
  }
  if (!state.upstream) {
    errors.push('Branch hiện tại chưa có upstream; cần thiết lập upstream trước khi push/deploy.');
  }

  if (mode === 'prepush') {
    if (state.remoteHead && state.upstreamHead && state.remoteHead !== state.upstreamHead) {
      errors.push('Remote đã thay đổi so với tracking ref local; hãy fetch/rebase rồi chạy lại gate trước khi push.');
    }
    if (state.behind > 0) {
      errors.push(`Branch local đang chậm hơn upstream ${state.behind} commit; cần đồng bộ remote trước khi push.`);
    }
  }

  if (mode === 'predeploy') {
    if (state.branch && state.branch !== 'HEAD' && state.branch !== deployBranch) {
      errors.push(`Chỉ được deploy production từ branch ${deployBranch}; hiện đang ở ${state.branch}.`);
    }
    if (state.ahead !== 0 || state.behind !== 0) {
      errors.push(`HEAD chưa đồng bộ upstream (ahead ${state.ahead}, behind ${state.behind}); phải push/fetch xong trước deploy.`);
    }
    if (!state.remoteHead) {
      errors.push('Không xác minh được HEAD của remote; dừng deploy để tránh phát hành từ trạng thái không truy vết được.');
    } else if (state.remoteHead !== state.head) {
      errors.push('HEAD local chưa trùng commit đang có trên remote; phải push đúng commit trước deploy.');
    }
  }

  return errors;
}

function collectReleaseState() {
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  const head = git(['rev-parse', 'HEAD']);
  const upstream = git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'], { allowFailure: true });
  const upstreamParts = splitUpstream(upstream);
  const upstreamHead = upstream ? git(['rev-parse', '@{u}'], { allowFailure: true }) : '';
  const divergence = upstream
    ? parseAheadBehind(git(['rev-list', '--left-right', '--count', 'HEAD...@{u}'], { allowFailure: true }))
    : { ahead: 0, behind: 0 };
  const status = git(['status', '--porcelain=v1'], { allowFailure: true });
  const conflicts = git(['diff', '--name-only', '--diff-filter=U'], { allowFailure: true });

  let remoteHead = '';
  if (upstreamParts) {
    const remoteResult = git(
      ['ls-remote', '--exit-code', upstreamParts.remote, `refs/heads/${upstreamParts.branch}`],
      { allowFailure: true }
    );
    remoteHead = remoteResult.split(/\s+/)[0] || '';
  }

  return {
    branch,
    head,
    upstream,
    upstreamHead,
    remoteHead,
    ahead: divergence.ahead,
    behind: divergence.behind,
    dirty: status ? status.split(/\r?\n/).filter(Boolean) : [],
    conflicts: conflicts ? conflicts.split(/\r?\n/).filter(Boolean) : []
  };
}

function run() {
  const mode = process.argv[2] || 'predeploy';
  const state = collectReleaseState();
  const errors = evaluateReleaseGate(mode, state, {
    deployBranch: process.env.RELEASE_DEPLOY_BRANCH || 'main'
  });

  if (errors.length) {
    console.error(`[Release Gate] ❌ ${mode} bị chặn:`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  const remoteStatus = state.remoteHead ? state.remoteHead.slice(0, 12) : 'không bắt buộc';
  console.log(
    `[Release Gate] ✅ ${mode} đạt: ${state.branch} @ ${state.head.slice(0, 12)}, remote ${remoteStatus}.`
  );
}

if (require.main === module) run();

module.exports = {
  parseAheadBehind,
  splitUpstream,
  evaluateReleaseGate,
  collectReleaseState
};
