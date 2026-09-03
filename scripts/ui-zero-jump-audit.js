const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');

function loadCredentials() {
  const envPath = '/Users/otada/.codex/secrets/lims-admin.env';
  if (!fs.existsSync(envPath)) {
    throw new Error(`Credentials file not found at ${envPath}`);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  let username = '';
  let password = '';
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const sep = trimmed.indexOf('=');
    if (sep === -1) continue;
    const key = trimmed.slice(0, sep).trim();
    let val = trimmed.slice(sep + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key === 'LIMS_ADMIN_USERNAME') username = val;
    else if (key === 'LIMS_ADMIN_PASSWORD') password = val;
  }
  if (!username || !password) {
    throw new Error('LIMS_ADMIN_USERNAME or LIMS_ADMIN_PASSWORD missing in credentials file');
  }
  return { username, password };
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function formatLocalDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    };

    this.ws.onclose = () => {
      for (const [id, { reject }] of this.pending) {
        reject(new Error(`CDP WebSocket closed unexpectedly while awaiting message ${id}`));
      }
      this.pending.clear();
    };

    this.ws.onerror = (err) => {
      for (const [id, { reject }] of this.pending) {
        reject(new Error(`CDP WebSocket error while awaiting message ${id}`));
      }
      this.pending.clear();
    };
  }

  waitOpen() {
    return new Promise((resolve, reject) => {
      if (this.ws.readyState === WebSocket.OPEN) return resolve();
      const onOpen = () => {
        this.ws.removeEventListener('error', onError);
        resolve();
      };
      const onError = (e) => {
        this.ws.removeEventListener('open', onOpen);
        reject(e);
      };
      this.ws.addEventListener('open', onOpen, { once: true });
      this.ws.addEventListener('error', onError, { once: true });
    });
  }

  close() {
    try {
      this.ws.close();
    } catch (e) {}
  }

  send(method, params = {}, timeoutMs = 25000) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP timeout (${timeoutMs}ms) awaiting method: ${method}`));
      }, timeoutMs);

      this.pending.set(id, {
        resolve: (val) => {
          clearTimeout(timer);
          resolve(val);
        },
        reject: (err) => {
          clearTimeout(timer);
          reject(err);
        }
      });

      try {
        this.ws.send(JSON.stringify({ id, method, params }));
      } catch (err) {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(err);
      }
    });
  }

  async eval(expression, timeoutMs = 25000) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    }, timeoutMs);

    if (res.exceptionDetails) {
      throw new Error(`Runtime.evaluate exception: ${JSON.stringify(res.exceptionDetails.text || res.exceptionDetails)}`);
    }
    return res.result.value;
  }
}

async function setDesktopViewport(client) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sleep(250);
  const vp = await client.eval(`
    (() => ({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      clientWidth: document.documentElement.clientWidth,
      clientHeight: document.documentElement.clientHeight,
    }))()
  `);
  if (vp.innerWidth !== 1440 || vp.innerHeight !== 900) {
    throw new Error(`[VIEWPORT FAILED] Expected 1440x900 desktop viewport, but got ${vp.innerWidth}x${vp.innerHeight}`);
  }
  return vp;
}

const ROUTE_FIXTURES = [
  // Family 1: Full-Width Authenticated
  { path: '/inventory', family: 'fullwidth', expectedHash: '#/inventory', expectedTitle: 'Quản lý kho hóa chất', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '.app-content-scroll', expectedAppShell: true },
  { path: '/standards', family: 'fullwidth', expectedHash: '#/standards', expectedTitle: 'Quản lý chất chuẩn đối chiếu', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '.app-content-scroll', expectedAppShell: true },
  { path: '/standard-requests', family: 'fullwidth', expectedHash: '#/standard-requests', expectedTitle: 'Quản lý yêu cầu chất chuẩn', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '.app-content-scroll', expectedAppShell: true },
  { path: '/standard-usage', family: 'fullwidth', expectedHash: '#/standard-usage', expectedTitle: 'Nhật ký dùng chuẩn', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '.app-content-scroll', expectedAppShell: true },
  { path: '/results', family: 'fullwidth', expectedHash: '#/results', expectedTitle: 'Tra cứu và quản lý kết quả mẻ chạy', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '.app-content-scroll', expectedAppShell: true },
  { path: '/requests', family: 'fullwidth', expectedHash: '#/requests', expectedTitle: 'Quản lý yêu cầu', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '.app-content-scroll', expectedAppShell: true },
  { path: '/documents', family: 'fullwidth', expectedHash: '#/documents', expectedTitle: 'Phiếu giao nhận mẫu', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '.app-content-scroll', expectedAppShell: true },
  { path: '/daily-checklist', family: 'fullwidth', expectedHash: '#/daily-checklist', expectedTitle: 'Bảng theo dõi mẫu ngày', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '.app-content-scroll', expectedAppShell: true },
  { path: '/recipes', family: 'fullwidth', expectedHash: '#/recipes', expectedTitle: 'Thư viện công thức', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '.app-content-scroll', expectedAppShell: true },
  { path: '/target-groups', family: 'fullwidth', expectedHash: '#/target-groups', expectedTitle: 'Quản lý nhóm chỉ tiêu', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '.app-content-scroll', expectedAppShell: true },
  { path: '/master-targets', family: 'fullwidth', expectedHash: '#/master-targets', expectedTitle: 'Thư viện chỉ tiêu gốc', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '.app-content-scroll', expectedAppShell: true },
  { path: '/stats', family: 'fullwidth', expectedHash: '#/stats', expectedTitle: 'Báo cáo quản trị', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '.app-content-scroll', expectedAppShell: true },
  { path: '/calculator', family: 'fullwidth', expectedHash: '#/calculator', expectedTitle: 'Thư viện quy trình và công thức', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '.app-content-scroll', expectedAppShell: true },

  // Family 2: Constrained 7xl Authenticated
  { path: '/matrix-types', family: 'constrained', expectedHash: '#/matrix-types', expectedTitle: 'Quản lý nền mẫu phân tích', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '.app-content-scroll', expectedAppShell: true },
  { path: '/master-devices', family: 'constrained', expectedHash: '#/master-devices', expectedTitle: 'Quản lý thiết bị phân tích', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '.app-content-scroll', expectedAppShell: true },
  { path: '/sample-description-master', family: 'constrained', expectedHash: '#/sample-description-master', expectedTitle: 'Danh mục mô tả mẫu', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '.app-content-scroll', expectedAppShell: true },

  // Family 3: Public Standalone (Signed-out canvas)
  { path: '/privacy-policy', family: 'public', expectedHash: '#/privacy-policy', expectedTitle: 'Chính sách bảo mật và quyền riêng tư', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '[data-public-scroll-owner]', isPublic: true, expectedAppShell: false },
  { path: '/terms-of-service', family: 'public', expectedHash: '#/terms-of-service', expectedTitle: 'Điều khoản dịch vụ', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '[data-public-scroll-owner]', isPublic: true, expectedAppShell: false },
  { path: '/changelog', family: 'public', expectedHash: '#/changelog', expectedTitle: 'Nhật ký cập nhật', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: '[data-public-scroll-owner]', isPublic: true, expectedAppShell: false },

  // Standalone Topology
  { path: '/traceability', family: 'standalone', expectedHash: '#/traceability', expectedTitle: 'Truy xuất nguồn gốc', requiredHooks: ['icon', 'title', 'subtitle'], scrollOwner: 'window', expectedAppShell: false }
];

const MOBILE_DASHBOARD_FIXTURE = {
  path: '/dashboard',
  family: 'mobile-dashboard',
  expectedHash: '#/dashboard',
  expectedTitlePattern: /^Xin chào, .+!$/,
  expectedSubtitle: 'Hệ thống quản lý thông tin phòng thí nghiệm (LIMS) đã sẵn sàng.',
  requiredHooks: ['title', 'subtitle'],
  forbiddenHooks: ['icon'],
  scrollOwner: '.app-content-scroll',
  expectedAppShell: true
};

async function preflightCheck(baseUrl) {
  try {
    const res = await fetch(baseUrl, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    const html = await res.text();
    if (!html.includes('<app-root')) {
      throw new Error(`Reachable but does not contain <app-root> marker.`);
    }
  } catch (err) {
    console.error(`\n[PREFLIGHT ERROR] App server is not reachable at ${baseUrl}.`);
    console.error(`Please ensure 'npm start' is running in another terminal.\nReason: ${err.message}\n`);
    process.exit(1);
  }
}

async function run() {
  const baseUrl = process.env.UI_AUDIT_BASE_URL || 'http://127.0.0.1:4200';
  await preflightCheck(baseUrl);

  const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lims-zero-jump-'));
  const cdpPort = await getFreePort();
  const chromeBin = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

  if (!fs.existsSync(chromeBin)) {
    throw new Error(`Chrome binary not found at ${chromeBin}. Set CHROME_BIN environment variable.`);
  }

  console.log(`[ZeroJump Audit] Launching Chrome on port ${cdpPort} with isolated profile: ${tempProfileDir}`);
  const chromeProc = spawn(chromeBin, [
    '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${tempProfileDir}`,
    '--window-size=1440,900',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ], { stdio: 'ignore' });

  const cleanup = () => {
    try { chromeProc.kill('SIGKILL'); } catch (e) {}
    try { fs.rmSync(tempProfileDir, { recursive: true, force: true }); } catch (e) {}
  };

  process.on('SIGINT', () => { cleanup(); process.exit(1); });
  process.on('SIGTERM', () => { cleanup(); process.exit(1); });

  let client = null;
  const auditReportData = {
    timestamp: new Date().toISOString(),
    states: {}
  };

  try {
    let wsUrl = null;
    for (let i = 0; i < 25; i++) {
      await sleep(400);
      try {
        const res = await fetch(`http://127.0.0.1:${cdpPort}/json/list`);
        const list = await res.json();
        const page = list.find((item) => item.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          wsUrl = page.webSocketDebuggerUrl;
          break;
        }
      } catch (e) {}
    }

    if (!wsUrl) throw new Error(`Failed to find Page target on Chrome DevTools port ${cdpPort}`);

    client = new CdpClient(wsUrl);
    await client.waitOpen();
    await client.send('Page.enable');
    await client.send('Runtime.enable');

    // 14-Step Stabilization & Measurement Helper
    async function measureRoute(fixture) {
      // Step 1: SPA Hash Navigation
      await client.eval(`window.location.hash = '${fixture.path}';`);

      // Step 2 & 3: Wait for expected hash & assert no redirect
      let navigated = false;
      for (let w = 0; w < 30; w++) {
        await sleep(150);
        const hash = await client.eval('window.location.hash');
        if (hash === fixture.expectedHash) {
          navigated = true;
          break;
        }
        if (hash === '#/403' || (hash === '#/dashboard' && fixture.path !== '/dashboard')) {
          throw new Error(`[ROUTE REDIRECT] Navigation to ${fixture.path} redirected to ${hash}`);
        }
      }
      if (!navigated) {
        const curHash = await client.eval('window.location.hash');
        throw new Error(`[HASH TIMEOUT] Expected ${fixture.expectedHash} but got ${curHash}`);
      }

      // Step 4: Route Identity Assertion (wait for Angular lazy component swap)
      let identityOk = false;
      let lastTitle = '';
      let lastSubtitle = '';
      for (let i = 0; i < 35; i++) {
        const identity = await client.eval(`
          (() => {
            const titleEl = document.querySelector('[data-page-header-title]');
            const subEl = document.querySelector('[data-page-header-subtitle]');
            return {
              title: titleEl ? titleEl.textContent.trim() : '',
              subtitle: subEl ? subEl.textContent.trim() : '',
            };
          })()
        `);
        lastTitle = identity.title;
        lastSubtitle = identity.subtitle;

        let titleMatches = false;
        if (fixture.expectedTitle !== undefined) {
          titleMatches = (identity.title === fixture.expectedTitle);
        } else if (fixture.expectedTitlePattern !== undefined) {
          titleMatches = fixture.expectedTitlePattern.test(identity.title);
        }

        let subtitleMatches = true;
        if (fixture.expectedSubtitle !== undefined) {
          subtitleMatches = (identity.subtitle === fixture.expectedSubtitle);
        }

        if (titleMatches && subtitleMatches) {
          identityOk = true;
          break;
        }
        await sleep(120);
      }

      if (!identityOk) {
        if (fixture.expectedTitle !== undefined && lastTitle !== fixture.expectedTitle) {
          throw new Error(`[TITLE MISMATCH] ${fixture.path}: expected '${fixture.expectedTitle}' but got '${lastTitle}'`);
        } else if (fixture.expectedTitlePattern !== undefined && !fixture.expectedTitlePattern.test(lastTitle)) {
          throw new Error(`[TITLE PATTERN MISMATCH] ${fixture.path}: '${lastTitle}' does not match ${fixture.expectedTitlePattern}`);
        } else if (fixture.expectedSubtitle !== undefined && lastSubtitle !== fixture.expectedSubtitle) {
          throw new Error(`[SUBTITLE MISMATCH] ${fixture.path}: expected '${fixture.expectedSubtitle}' but got '${lastSubtitle}'`);
        }
      }

      // Step 4b: Topology Assertion (Fail-closed)
      if (fixture.expectedAppShell !== undefined) {
        const hasAppShell = await client.eval(`document.querySelector('app-shell') !== null`);
        if (hasAppShell !== fixture.expectedAppShell) {
          throw new Error(`[TOPOLOGY FAILED] ${fixture.path}: expected app-shell=${fixture.expectedAppShell}, but actual is ${hasAppShell}`);
        }
      }

      // Step 5: Reset scroll
      const scrollResult = await client.eval(`
        (() => {
          window.scrollTo(0, 0);
          const winOk = window.scrollY === 0;
          const ownerSelector = ${JSON.stringify(fixture.scrollOwner)};
          let ownerOk = true;
          if (ownerSelector && ownerSelector !== 'window') {
            const el = document.querySelector(ownerSelector);
            if (!el) return { winOk, ownerFound: false };
            el.scrollTop = 0;
            ownerOk = el.scrollTop === 0;
          }
          return { winOk, ownerFound: true, ownerOk };
        })()
      `);
      if (!scrollResult.ownerFound) {
        throw new Error(`[SCROLL OWNER MISSING] ${fixture.path}: scroll owner '${fixture.scrollOwner}' not found`);
      }
      if (!scrollResult.winOk || !scrollResult.ownerOk) {
        throw new Error(`[SCROLL RESET FAILED] ${fixture.path}: could not reset scroll to 0`);
      }

      // Step 6: Wait skeleton/loading disappear
      for (let s = 0; s < 25; s++) {
        const loading = await client.eval(`
          !!document.querySelector('.route-progress, .route-loading-layer, .cl-skeleton-grid')
        `);
        if (!loading) break;
        await sleep(150);
      }

      // Step 7: Wait fonts ready
      await client.eval(`(async () => { if (document.fonts) await document.fonts.ready; })()`);

      // Step 8: Wait CSS transitions (duration-200 / duration-300) and layout quiescence
      await sleep(300);
      await client.eval(`
        new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
      `);

      for (let q = 0; q < 25; q++) {
        const motionDiff = await client.eval(`
          (async () => {
            const h = document.querySelector('app-page-header');
            if (!h) return 999;
            const r1 = h.getBoundingClientRect();
            await new Promise(r => setTimeout(r, 100));
            const r2 = h.getBoundingClientRect();
            return Math.abs(r1.top - r2.top) + Math.abs(r1.left - r2.left) + Math.abs(r1.height - r2.height);
          })()
        `);
        if (motionDiff <= 0.1) break;
        await sleep(60);
      }

      // Step 9: Verify required hooks uniqueness & visibility
      const hookCheck = await client.eval(`
        (() => {
          const req = ${JSON.stringify(fixture.requiredHooks || [])};
          const forb = ${JSON.stringify(fixture.forbiddenHooks || [])};
          const errors = [];

          for (const h of req) {
            const els = Array.from(document.querySelectorAll('[data-page-header-' + h + ']')).filter(el => {
              const r = el.getBoundingClientRect();
              return r.width > 0 && r.height > 0;
            });
            if (els.length !== 1) {
              errors.push('Hook [' + h + '] visible count expected 1 but got ' + els.length);
            }
          }

          for (const h of forb) {
            const els = Array.from(document.querySelectorAll('[data-page-header-' + h + ']')).filter(el => {
              const r = el.getBoundingClientRect();
              return r.width > 0 && r.height > 0;
            });
            if (els.length > 0) {
              errors.push('Forbidden hook [' + h + '] found visible (' + els.length + ')');
            }
          }

          return errors;
        })()
      `);
      if (hookCheck.length > 0) {
        throw new Error(`[HOOK ASSERTION FAILED] ${fixture.path}: ${hookCheck.join(', ')}`);
      }

      // Steps 10-13: Measure 1, wait 150ms, Measure 2, assert convergence
      const measurement = await client.eval(`
        (async () => {
          function serialize(r) {
            if (!r) return null;
            return {
              left: Number(r.left.toFixed(2)),
              top: Number(r.top.toFixed(2)),
              width: Number(r.width.toFixed(2)),
              height: Number(r.height.toFixed(2)),
            };
          }

          function getCoords() {
            const icon = document.querySelector('[data-page-header-icon]');
            const title = document.querySelector('[data-page-header-title]');
            const subtitle = document.querySelector('[data-page-header-subtitle]');
            const host = document.querySelector('app-page-header');
            return {
              icon: serialize(icon ? icon.getBoundingClientRect() : null),
              title: serialize(title ? title.getBoundingClientRect() : null),
              subtitle: serialize(subtitle ? subtitle.getBoundingClientRect() : null),
              host: serialize(host ? host.getBoundingClientRect() : null),
              scrollSpill: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
            };
          }

          const m1 = getCoords();
          await new Promise(r => setTimeout(r, 150));
          const m2 = getCoords();

          const nonConverged = [];
          const req = ${JSON.stringify(fixture.requiredHooks || [])};
          const dims = ['left', 'top', 'width', 'height'];

          for (const h of req) {
            if (m1[h] && m2[h]) {
              for (const d of dims) {
                const diff = Math.abs(m1[h][d] - m2[h][d]);
                if (diff > 0.5) {
                  nonConverged.push(h + '.' + d + ' diff=' + diff.toFixed(2) + 'px');
                }
              }
            }
          }

          return { m1, m2, nonConverged };
        })()
      `);

      if (measurement.nonConverged.length > 0) {
        throw new Error(`[CONVERGENCE FAILED] ${fixture.path}: ${measurement.nonConverged.join(', ')}`);
      }

      // Step 14: Overflow check
      if (measurement.m2.scrollSpill) {
        throw new Error(`[HORIZONTAL OVERFLOW] ${fixture.path} caused document scroll overflow`);
      }

      return measurement.m2;
    }

    // =========================================================================
    // STATE 1: PUBLIC SIGNED-OUT CANVAS
    // =========================================================================
    console.log('\n================ STATE 1: PUBLIC SIGNED-OUT CANVAS ================');
    const vp1 = await setDesktopViewport(client);
    console.log(`  [Viewport] Confirmed desktop viewport: ${vp1.innerWidth}x${vp1.innerHeight} (1440x900)`);

    await client.send('Page.navigate', { url: `${baseUrl}/#/privacy-policy` });
    await sleep(2500);

    const publicFixtures = ROUTE_FIXTURES.filter((f) => f.isPublic);
    const publicResults = [];

    for (const fixture of publicFixtures) {
      // Assert Signed-Out Topology
      const topo = await client.eval(`
        (() => ({
          hasAppShell: !!document.querySelector('app-shell'),
          hasNavPanel: !!document.querySelector('app-navigation-panel'),
          hasHeader: !!document.querySelector('app-page-header'),
          hasPublicWrapper: !!document.querySelector('[data-public-scroll-owner]')
        }))()
      `);
      if (topo.hasAppShell || topo.hasNavPanel || !topo.hasHeader || !topo.hasPublicWrapper) {
        throw new Error(`[PUBLIC TOPOLOGY FAILED] ${fixture.path}: expected signed-out canvas outside app-shell`);
      }

      const res = await measureRoute(fixture);
      publicResults.push({ fixture, res });
      console.log(`  [Public] ${fixture.path.padEnd(22)} | Icon: (${res.icon.left.toFixed(1)}, ${res.icon.top.toFixed(1)}) | Title: (${res.title.left.toFixed(1)}, ${res.title.top.toFixed(1)}) | Zero Jump: OK`);
    }

    // Assert Family 3 Zero Jump
    for (const hook of ['icon', 'title', 'subtitle']) {
      const lefts = publicResults.map((r) => r.res[hook].left);
      const tops = publicResults.map((r) => r.res[hook].top);
      const deltaX = Math.max(...lefts) - Math.min(...lefts);
      const deltaY = Math.max(...tops) - Math.min(...tops);
      if (deltaX > 1.0 || deltaY > 1.0) {
        throw new Error(`[ZERO JUMP FAILED] Family 3 (${hook}): ΔX=${deltaX.toFixed(2)}px, ΔY=${deltaY.toFixed(2)}px > 1.0px`);
      }
    }
    console.log('  └─> Family 3 Public Zero Jump: PASS (Δ <= 1.0px on all hooks)');
    auditReportData.states.state1_public = {
      viewport: { width: vp1.innerWidth, height: vp1.innerHeight },
      routes: publicResults.map(r => ({ path: r.fixture.path, coords: r.res }))
    };

    // =========================================================================
    // AUTHENTICATION PHASE
    // =========================================================================
    console.log('\n[Authentication] Authenticating via Admin credentials...');
    await client.send('Page.navigate', { url: `${baseUrl}/#/dashboard` });
    await sleep(2500);

    const creds = loadCredentials();
    await client.eval(`
      (async () => {
        const tabs = Array.from(document.querySelectorAll('app-login button'));
        const accountTab = tabs.find(b => b.textContent.includes('Tài Khoản'));
        if (accountTab) accountTab.click();
        await new Promise(r => setTimeout(r, 400));

        const uInput = document.querySelector('input[name="email"], input[type="text"], input[type="email"]');
        const pInput = document.querySelector('input[name="password"], input[type="password"]');

        if (uInput && pInput) {
          uInput.value = ${JSON.stringify(creds.username)};
          uInput.dispatchEvent(new Event('input', { bubbles: true }));
          uInput.dispatchEvent(new Event('change', { bubbles: true }));

          pInput.value = ${JSON.stringify(creds.password)};
          pInput.dispatchEvent(new Event('input', { bubbles: true }));
          pInput.dispatchEvent(new Event('change', { bubbles: true }));

          await new Promise(r => setTimeout(r, 200));

          const submitBtn = Array.from(document.querySelectorAll('app-login button')).find(b => b.textContent.includes('Đăng nhập'));
          if (submitBtn) submitBtn.click();
        }
      })()
    `);

    let inAppShell = false;
    for (let w = 0; w < 30; w++) {
      await sleep(800);
      inAppShell = await client.eval(`!!document.querySelector('app-shell')`);
      if (inAppShell) break;
    }
    if (!inAppShell) throw new Error('[AUTH FAILED] Could not enter app-shell after admin login');
    console.log('  └─> Authentication successful! User is in app-shell.');

    // Helper: Set Sidebar State via Visible UI Controls (Strict Criteria >=255px / <=57px)
    async function setSidebarState(targetState) { // 'expanded' | 'collapsed'
      const expected = targetState === 'expanded'
        ? (w) => w >= 255
        : (w) => w <= 57;

      let curWidth = null;
      for (let i = 0; i < 25; i++) {
        curWidth = await client.eval(`
          (() => {
            const panel = document.querySelector('[data-navigation-panel]');
            return panel ? panel.getBoundingClientRect().width : null;
          })()
        `);
        if (curWidth !== null && expected(curWidth)) {
          return curWidth;
        }
        await sleep(150);
      }

      if (curWidth !== null && expected(curWidth)) {
        return curWidth;
      }

      const labelToClick = targetState === 'expanded' ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng';
      const clicked = await client.eval(`
        (() => {
          const btns = Array.from(document.querySelectorAll('button[aria-label="${labelToClick}"]')).filter(b => {
            const r = b.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          });
          if (btns.length > 0) {
            btns[0].click();
            return true;
          }
          return false;
        })()
      `);
      if (!clicked) throw new Error(`[SIDEBAR TOGGLE MISSING] Button with aria-label "${labelToClick}" not visible`);

      let finalWidth = null;
      for (let w = 0; w < 30; w++) {
        await sleep(100);
        finalWidth = await client.eval(`
          (() => {
            const panel = document.querySelector('[data-navigation-panel]');
            return panel ? panel.getBoundingClientRect().width : null;
          })()
        `);
        if (finalWidth !== null && expected(finalWidth)) {
          break;
        }
      }

      if (finalWidth === null || !expected(finalWidth)) {
        throw new Error(`[SIDEBAR STATE FAILED] Expected ${targetState} (${targetState === 'expanded' ? '>=255px' : '<=57px'}), but final panel width was ${finalWidth}px`);
      }

      return finalWidth;
    }

    // =========================================================================
    // STATE 2: AUTHENTICATED EXPANDED DESKTOP (1440x900)
    // =========================================================================
    console.log('\n================ STATE 2: AUTHENTICATED EXPANDED DESKTOP ================');
    const vp2 = await setDesktopViewport(client);
    console.log(`  [Viewport] Confirmed desktop viewport: ${vp2.innerWidth}x${vp2.innerHeight} (1440x900)`);
    const expandedWidth = await setSidebarState('expanded');
    console.log(`  [Sidebar] Confirmed expanded width: ${expandedWidth}px (>= 255px)`);

    const authFixtures = ROUTE_FIXTURES.filter((f) => !f.isPublic);
    const state2Results = new Map();

    for (const fixture of authFixtures) {
      const res = await measureRoute(fixture);
      if (!state2Results.has(fixture.family)) state2Results.set(fixture.family, []);
      state2Results.get(fixture.family).push({ fixture, res });

      console.log(`  [${fixture.family.padEnd(11)}] ${fixture.path.padEnd(28)} | Icon: (${res.icon.left.toFixed(1)}, ${res.icon.top.toFixed(1)}) | Title: (${res.title.left.toFixed(1)}, ${res.title.top.toFixed(1)}) | Subtitle: (${res.subtitle.left.toFixed(1)}, ${res.subtitle.top.toFixed(1)})`);
    }

    // Family Zero Jump Assertions
    for (const fam of ['fullwidth', 'constrained']) {
      const items = state2Results.get(fam);
      for (const hook of ['icon', 'title', 'subtitle']) {
        const lefts = items.map((r) => r.res[hook].left);
        const tops = items.map((r) => r.res[hook].top);
        const deltaX = Math.max(...lefts) - Math.min(...lefts);
        const deltaY = Math.max(...tops) - Math.min(...tops);
        if (deltaX > 1.0 || deltaY > 1.0) {
          throw new Error(`[ZERO JUMP FAILED] State 2 Family ${fam} (${hook}): ΔX=${deltaX.toFixed(2)}px, ΔY=${deltaY.toFixed(2)}px > 1.0px`);
        }
      }
      console.log(`  └─> Family ${fam} Zero Jump: PASS (Δ <= 1.0px on all hooks)`);
    }

    auditReportData.states.state2_expanded = {
      viewport: { width: vp2.innerWidth, height: vp2.innerHeight },
      sidebarWidth: expandedWidth,
      routes: authFixtures.map(f => {
        const item = [...state2Results.values()].flat().find(r => r.fixture.path === f.path);
        return { path: f.path, family: f.family, coords: item ? item.res : null };
      })
    };

    // =========================================================================
    // STATE 3: AUTHENTICATED COLLAPSED DESKTOP (1440x900)
    // =========================================================================
    console.log('\n================ STATE 3: AUTHENTICATED COLLAPSED DESKTOP ================');
    const vp3 = await setDesktopViewport(client);
    console.log(`  [Viewport] Confirmed desktop viewport: ${vp3.innerWidth}x${vp3.innerHeight} (1440x900)`);
    // Return to app-shell route if previous route was standalone
    await client.eval(`window.location.hash = '/inventory';`);
    await sleep(600);
    const collapsedWidth = await setSidebarState('collapsed');
    console.log(`  [Sidebar] Confirmed collapsed width: ${collapsedWidth}px (<= 57px)`);

    const state3Results = new Map();
    for (const fixture of authFixtures) {
      const res = await measureRoute(fixture);
      if (!state3Results.has(fixture.family)) state3Results.set(fixture.family, []);
      state3Results.get(fixture.family).push({ fixture, res });
      console.log(`  [${fixture.family.padEnd(11)}] ${fixture.path.padEnd(28)} | Icon: (${res.icon.left.toFixed(1)}, ${res.icon.top.toFixed(1)}) | Title: (${res.title.left.toFixed(1)}, ${res.title.top.toFixed(1)}) | Subtitle: (${res.subtitle.left.toFixed(1)}, ${res.subtitle.top.toFixed(1)})`);
    }

    for (const fam of ['fullwidth', 'constrained']) {
      const items = state3Results.get(fam);
      for (const hook of ['icon', 'title', 'subtitle']) {
        const lefts = items.map((r) => r.res[hook].left);
        const tops = items.map((r) => r.res[hook].top);
        const deltaX = Math.max(...lefts) - Math.min(...lefts);
        const deltaY = Math.max(...tops) - Math.min(...tops);
        if (deltaX > 1.0 || deltaY > 1.0) {
          throw new Error(`[ZERO JUMP FAILED] State 3 Family ${fam} (${hook}): ΔX=${deltaX.toFixed(2)}px, ΔY=${deltaY.toFixed(2)}px > 1.0px`);
        }
      }
      console.log(`  └─> Family ${fam} Zero Jump: PASS (Δ <= 1.0px on all hooks)`);
    }

    auditReportData.states.state3_collapsed = {
      viewport: { width: vp3.innerWidth, height: vp3.innerHeight },
      sidebarWidth: collapsedWidth,
      routes: authFixtures.map(f => {
        const item = [...state3Results.values()].flat().find(r => r.fixture.path === f.path);
        return { path: f.path, family: f.family, coords: item ? item.res : null };
      })
    };

    // =========================================================================
    // STATE 4: MOBILE VIEWPORT (390x844)
    // =========================================================================
    console.log('\n================ STATE 4: MOBILE VIEWPORT (390x844) ================');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true,
    });
    await sleep(1000);

    const state4Results = new Map();
    for (const fixture of authFixtures) {
      const res = await measureRoute(fixture);
      if (!state4Results.has(fixture.family)) state4Results.set(fixture.family, []);
      state4Results.get(fixture.family).push({ fixture, res });
      console.log(`  [Mobile] ${fixture.path.padEnd(28)} | Icon: (${res.icon.left.toFixed(1)}, ${res.icon.top.toFixed(1)}) | Title: (${res.title.left.toFixed(1)}, ${res.title.top.toFixed(1)}) | Subtitle: (${res.subtitle.left.toFixed(1)}, ${res.subtitle.top.toFixed(1)})`);
    }

    // Measure Mobile Dashboard fixture
    const dashRes = await measureRoute(MOBILE_DASHBOARD_FIXTURE);
    console.log(`  [Mobile] ${MOBILE_DASHBOARD_FIXTURE.path.padEnd(28)} | Title: (${dashRes.title.left.toFixed(1)}, ${dashRes.title.top.toFixed(1)}) | Subtitle: (${dashRes.subtitle.left.toFixed(1)}, ${dashRes.subtitle.top.toFixed(1)}) | Forbidden Icon: PASS`);

    for (const fam of ['fullwidth', 'constrained']) {
      const items = state4Results.get(fam);
      for (const hook of ['icon', 'title', 'subtitle']) {
        const lefts = items.map((r) => r.res[hook].left);
        const tops = items.map((r) => r.res[hook].top);
        const deltaX = Math.max(...lefts) - Math.min(...lefts);
        const deltaY = Math.max(...tops) - Math.min(...tops);
        if (deltaX > 1.0 || deltaY > 1.0) {
          throw new Error(`[ZERO JUMP FAILED] State 4 Family ${fam} (${hook}): ΔX=${deltaX.toFixed(2)}px, ΔY=${deltaY.toFixed(2)}px > 1.0px`);
        }
      }
      console.log(`  └─> Family ${fam} Mobile Zero Jump: PASS (Δ <= 1.0px on all hooks)`);
    }

    // Responsive Segmented Control assertions
    await client.eval(`window.location.hash = '/documents';`);
    let docNavigated = false;
    for (let w = 0; w < 30; w++) {
      await sleep(100);
      const h = await client.eval('window.location.hash');
      const t = await client.eval(`document.querySelector('[data-page-header-title]')?.textContent.trim() ?? ''`);
      if (h === '#/documents' && t === 'Phiếu giao nhận mẫu') {
        docNavigated = true;
        break;
      }
    }
    if (!docNavigated) throw new Error('[NAV FAILED] Could not navigate to /documents on mobile');

    const docSegmentedHidden = await client.eval(`
      (() => {
        const el = document.querySelector('[aria-label="Chế độ hiển thị"]');
        if (!el) return false;
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.display === 'none' || rect.width === 0;
      })()
    `);
    if (!docSegmentedHidden) {
      throw new Error('[RESPONSIVE ASSERTION FAILED] Documents view toggle is visible on mobile (should be hidden under sm)');
    }
    console.log('  └─> Documents Segmented Control: HIDDEN under sm breakpoint (PASS)');

    // Touch Target height >= 39.5px on BOTH /results and /requests with route identity check & stable item count
    const touchTargetResults = {};
    for (const routeFixture of [
      { path: '/results', expectedTitle: 'Tra cứu và quản lý kết quả mẻ chạy', expectedCount: 4 },
      { path: '/requests', expectedTitle: 'Quản lý yêu cầu', expectedCount: 3 }
    ]) {
      await client.eval(`window.location.hash = '${routeFixture.path}';`);
      let routeNavigated = false;
      for (let w = 0; w < 30; w++) {
        await sleep(100);
        const h = await client.eval('window.location.hash');
        const t = await client.eval(`document.querySelector('[data-page-header-title]')?.textContent.trim() ?? ''`);
        if (h === `#${routeFixture.path}` && t === routeFixture.expectedTitle) {
          routeNavigated = true;
          break;
        }
      }
      if (!routeNavigated) {
        throw new Error(`[NAV FAILED] Could not navigate to ${routeFixture.path} with title '${routeFixture.expectedTitle}'`);
      }
      await sleep(400);

      const touchResult = await client.eval(`
        (() => {
          const container = document.querySelector('.soft-ui-segmented');
          if (!container) return { ok: false, count: 0, minH: 0, reason: 'no-container' };

          const items = Array.from(container.querySelectorAll('.soft-ui-segmented__item')).filter(el => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          });
          if (items.length === 0) return { ok: false, count: 0, minH: 0, reason: 'no-items' };
          const heights = items.map(el => el.getBoundingClientRect().height);
          const minH = Math.min(...heights);
          return { ok: minH >= 39.5, count: items.length, minH };
        })()
      `);

      if (!touchResult.ok || touchResult.count !== routeFixture.expectedCount) {
        throw new Error(`[TOUCH TARGET FAILED] ${routeFixture.path}: expected ${routeFixture.expectedCount} items with minHeight>=39.5px, got count=${touchResult.count}, minHeight=${touchResult.minH}px (reason: ${touchResult.reason || 'none'})`);
      }

      touchTargetResults[routeFixture.path] = {
        count: touchResult.count,
        minHeight: Number(touchResult.minH.toFixed(2)),
      };
      console.log(`  └─> ${routeFixture.path} Segmented Touch Target: ${touchResult.count} items, minHeight=${touchResult.minH.toFixed(1)}px >= 40px (PASS)`);
    }

    auditReportData.states.state4_mobile = {
      viewport: { width: 390, height: 844 },
      routes: authFixtures.map(f => {
        const item = [...state4Results.values()].flat().find(r => r.fixture.path === f.path);
        return { path: f.path, family: f.family, coords: item ? item.res : null };
      }),
      dashboard: dashRes,
      documentsSegmentedHidden: docSegmentedHidden,
      touchTargets: touchTargetResults
    };

    // =========================================================================
    // STATE 5: DARK MODE MATRIX
    // =========================================================================
    console.log('\n================ STATE 5: DARK MODE MATRIX ================');
    // Restore Desktop Viewport to 1440x900
    const vp5 = await setDesktopViewport(client);
    console.log(`  [Viewport] Confirmed desktop viewport: ${vp5.innerWidth}x${vp5.innerHeight} (1440x900)`);
    await client.eval(`window.location.hash = '/inventory';`);
    await sleep(800);
    await setSidebarState('collapsed');

    // Collect fresh Light baseline on 1440x900 collapsed
    const lightBaseline = new Map();
    for (const fixture of authFixtures) {
      const res = await measureRoute(fixture);
      lightBaseline.set(fixture.path, res);
    }

    // Return to app-shell route to access header controls
    await client.eval(`window.location.hash = '/inventory';`);
    await sleep(600);

    // Toggle Dark mode via visible UI control
    const toggleDark = await client.eval(`
      (() => {
        const btns = Array.from(document.querySelectorAll('button[aria-label*="giao diện tối"], button[aria-label*="giao diện sáng"]')).filter(b => {
          const r = b.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        });
        if (btns.length > 0) {
          btns[0].click();
          return true;
        }
        return false;
      })()
    `);
    if (!toggleDark) throw new Error('[DARK TOGGLE MISSING] No visible theme toggle button found');

    let darkReady = false;
    for (let attempt = 0; attempt < 30; attempt++) {
      await sleep(100);
      const state = await client.eval(`
        (() => {
          const toggles = Array.from(document.querySelectorAll('button[aria-label*="giao diện tối"], button[aria-label*="giao diện sáng"]'));
          const visibleToggle = toggles.find(button => {
            const rect = button.getBoundingClientRect();
            const style = window.getComputedStyle(button);
            return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
          });
          return {
            dark: document.documentElement.classList.contains('dark'),
            switching: document.documentElement.classList.contains('theme-switching'),
            disabled: visibleToggle ? visibleToggle.disabled : null,
            ariaPressed: visibleToggle ? visibleToggle.getAttribute('aria-pressed') : null,
          };
        })()
      `);

      darkReady = state.dark === true &&
                  state.switching === false &&
                  state.disabled === false &&
                  state.ariaPressed === 'true';
      if (darkReady) break;
    }

    if (!darkReady) {
      throw new Error('[DARK MODE FAILED] Theme did not converge to dark mode within timeout (expected html.dark, no theme-switching, toggle enabled, aria-pressed="true")');
    }

    // Measure Dark mode & compare with Light baseline
    const darkDeltas = [];
    for (const fixture of authFixtures) {
      const darkRes = await measureRoute(fixture);
      const lightRes = lightBaseline.get(fixture.path);

      const routeDelta = { path: fixture.path, hooks: {} };
      for (const hook of fixture.requiredHooks) {
        const diffX = Math.abs(darkRes[hook].left - lightRes[hook].left);
        const diffY = Math.abs(darkRes[hook].top - lightRes[hook].top);
        if (diffX > 1.0 || diffY > 1.0) {
          throw new Error(`[DARK DELTA FAILED] ${fixture.path} (${hook}): Dark vs Light ΔX=${diffX.toFixed(2)}px, ΔY=${diffY.toFixed(2)}px > 1.0px`);
        }
        routeDelta.hooks[hook] = { diffX: Number(diffX.toFixed(2)), diffY: Number(diffY.toFixed(2)) };
      }
      darkDeltas.push(routeDelta);
      console.log(`  [Dark] ${fixture.path.padEnd(28)} | Δ vs Light <= 1.0px (PASS)`);
    }

    // Return to app-shell to toggle back to Light mode
    await client.eval(`window.location.hash = '/inventory';`);
    await sleep(600);

    // Toggle back to Light mode
    await client.eval(`
      (() => {
        const btns = Array.from(document.querySelectorAll('button[aria-label*="giao diện tối"], button[aria-label*="giao diện sáng"]')).filter(b => {
          const r = b.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        });
        if (btns.length > 0) btns[0].click();
      })()
    `);

    let lightReady = false;
    for (let attempt = 0; attempt < 30; attempt++) {
      await sleep(100);
      const state = await client.eval(`
        (() => {
          const toggles = Array.from(document.querySelectorAll('button[aria-label*="giao diện tối"], button[aria-label*="giao diện sáng"]'));
          const visibleToggle = toggles.find(button => {
            const rect = button.getBoundingClientRect();
            const style = window.getComputedStyle(button);
            return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
          });
          return {
            dark: document.documentElement.classList.contains('dark'),
            switching: document.documentElement.classList.contains('theme-switching'),
            disabled: visibleToggle ? visibleToggle.disabled : null,
            ariaPressed: visibleToggle ? visibleToggle.getAttribute('aria-pressed') : null,
          };
        })()
      `);

      lightReady = state.dark === false &&
                   state.switching === false &&
                   state.disabled === false &&
                   state.ariaPressed === 'false';
      if (lightReady) break;
    }

    if (!lightReady) {
      throw new Error('[LIGHT MODE CLEANUP FAILED] Theme did not converge back to light mode (expected no html.dark, no theme-switching, toggle enabled, aria-pressed="false")');
    }

    auditReportData.states.state5_dark = {
      viewport: { width: vp5.innerWidth, height: vp5.innerHeight },
      routes: darkDeltas
    };

    // =========================================================================
    // STATE 6: DAILY CHECKLIST PRINT PREVIEW VERIFICATION
    // =========================================================================
    console.log('\n================ STATE 6: DAILY CHECKLIST PRINT VERIFICATION ================');
    const vp6 = await setDesktopViewport(client);
    console.log(`  [Viewport] Confirmed desktop viewport: ${vp6.innerWidth}x${vp6.innerHeight} (1440x900)`);
    await client.eval(`window.location.hash = '/daily-checklist';`);
    await sleep(2000);

    // Validate UI_AUDIT_CHECKLIST_DATE format if provided
    const candidateDates = [];
    if (process.env.UI_AUDIT_CHECKLIST_DATE) {
      const envDate = process.env.UI_AUDIT_CHECKLIST_DATE.trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(envDate)) {
        throw new Error(`UI_AUDIT_CHECKLIST_DATE must be in YYYY-MM-DD format, got: '${envDate}'`);
      }
      candidateDates.push(envDate);
    }

    // Build candidates using local calendar
    const today = new Date();
    for (let d = 0; d <= 7; d++) {
      const cand = new Date(today);
      cand.setDate(today.getDate() - d);
      const iso = formatLocalDate(cand);
      if (!candidateDates.includes(iso)) candidateDates.push(iso);
    }

    let selectedPrintDate = null;
    for (const candidateDate of candidateDates) {
      const status = await client.eval(`
        (async () => {
          const dateInput = document.querySelector('input[type="date"], input[aria-label="Chọn ngày theo dõi"]');
          if (!dateInput) return { ok: false, reason: 'no-input' };

          dateInput.value = '${candidateDate}';
          dateInput.dispatchEvent(new Event('input', { bubbles: true }));
          dateInput.dispatchEvent(new Event('change', { bubbles: true }));

          // 1. Wait until input reflects candidateDate
          let inputReflected = false;
          for (let i = 0; i < 20; i++) {
            if (dateInput.value === '${candidateDate}') {
              inputReflected = true;
              break;
            }
            await new Promise(r => setTimeout(r, 50));
          }
          if (!inputReflected) return { ok: false, reason: 'input-value-not-reflected' };

          // 2. Wait until [data-daily-checklist-loading] and spinner disappear
          await new Promise(r => setTimeout(r, 200));
          for (let i = 0; i < 30; i++) {
            const loading = document.querySelector('[data-daily-checklist-loading], .fa-circle-notch.fa-spin');
            if (!loading) break;
            await new Promise(r => setTimeout(r, 150));
          }
          await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

          // 3. Fail immediately on data error
          const errorEl = document.querySelector('[data-daily-checklist-error]');
          if (errorEl) {
            return { ok: false, hasError: true, errorText: errorEl.textContent.trim() };
          }

          const batchCount = document.querySelectorAll('[data-daily-batch-card], .cl-batch-card').length;
          const printBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('In bảng') || b.getAttribute('aria-label') === 'In bảng đang xem');

          return {
            ok: true,
            hasError: false,
            batchCount,
            canPrint: !!printBtn && !printBtn.disabled
          };
        })()
      `);

      if (status.hasError) {
        throw new Error(`[CHECKLIST LOAD FAILED] ${candidateDate}: data error visible: ${status.errorText}`);
      }

      if (status.ok && status.batchCount > 0 && status.canPrint) {
        selectedPrintDate = candidateDate;
        console.log(`  └─> Found printable batches for date: ${candidateDate} (${status.batchCount} batches)`);
        break;
      }
    }

    if (!selectedPrintDate) {
      throw new Error(`Daily Checklist print prerequisite failed: no printable batch was found for dates ${candidateDates.join(', ')}. Set UI_AUDIT_CHECKLIST_DATE to a known seeded date.`);
    }

    // Stub window.print to track invocation
    await client.eval(`
      window.__printCallCount = 0;
      window.print = () => { window.__printCallCount++; };
    `);

    // Click "In bảng" to open print settings modal
    const openedModal = await client.eval(`
      (() => {
        const printBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('In bảng') || b.getAttribute('aria-label') === 'In bảng đang xem');
        if (!printBtn) return false;
        printBtn.click();
        return true;
      })()
    `);
    if (!openedModal) throw new Error('[PRINT MODAL FAILED] Could not click In bảng button');
    await sleep(400);

    // Click "Xác Nhận In" in modal
    const confirmedPrint = await client.eval(`
      (() => {
        const confirmBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Xác Nhận In'));
        if (!confirmBtn) return false;
        confirmBtn.click();
        return true;
      })()
    `);
    if (!confirmedPrint) throw new Error('[PRINT CONFIRM FAILED] Could not click Xác Nhận In button');
    await sleep(600);

    // Emulate media print
    await client.send('Emulation.setEmulatedMedia', { media: 'print' });
    await sleep(400);

    const printVerification = await client.eval(`
      (() => {
        const bodyPrinting = document.body.classList.contains('daily-checklist-printing');
        const container = document.querySelector('#print-container .cl-page-shell');
        const screenOnly = document.querySelector('#print-container .cl-screen-only');
        const printOnly = document.querySelector('#print-container .cl-print-only');
        const orientStyle = document.querySelector('#print-orientation-style');
        const callCount = window.__printCallCount;

        const screenDisplay = screenOnly ? window.getComputedStyle(screenOnly).display : null;
        const printDisplay = printOnly ? window.getComputedStyle(printOnly).display : null;

        const docScrollW = document.documentElement.scrollWidth;
        const docClientW = document.documentElement.clientWidth;
        const printScrollW = container ? container.scrollWidth : 0;
        const printClientW = container ? container.clientWidth : 0;

        const documentFits = docScrollW <= docClientW + 1;
        const printRootFits = container ? (printScrollW <= printClientW + 1) : false;

        return {
          bodyPrinting,
          hasClonedShell: !!container,
          screenHidden: screenDisplay === 'none',
          printVisible: printDisplay !== 'none',
          hasOrientStyle: !!orientStyle,
          callCount,
          documentFits,
          printRootFits,
          docScrollW,
          docClientW,
          printScrollW,
          printClientW
        };
      })()
    `);

    if (!printVerification.bodyPrinting || !printVerification.hasClonedShell || !printVerification.screenHidden || !printVerification.printVisible || !printVerification.hasOrientStyle || printVerification.callCount !== 1) {
      throw new Error(`[PRINT ASSERTION FAILED] Print state invalid: ${JSON.stringify(printVerification)}`);
    }

    if (!printVerification.documentFits || !printVerification.printRootFits) {
      throw new Error(`[PRINT OVERFLOW FAILED] Horizontal overflow detected: docScrollW=${printVerification.docScrollW} vs docClientW=${printVerification.docClientW}, printScrollW=${printVerification.printScrollW} vs printClientW=${printVerification.printClientW}`);
    }

    console.log(`  └─> Print pipeline active: body class, cloned shell, screen-only hidden, print-only visible, orient style, window.print called (PASS)`);
    console.log(`  └─> Print overflow check: doc (${printVerification.docScrollW}px <= ${printVerification.docClientW}px), printRoot (${printVerification.printScrollW}px <= ${printVerification.printClientW}px) (PASS)`);

    // Dispatch afterprint and assert cleanup
    await client.eval(`window.dispatchEvent(new Event('afterprint'));`);
    await sleep(400);

    const cleanupVerification = await client.eval(`
      (() => ({
        bodyNotPrinting: !document.body.classList.contains('daily-checklist-printing'),
        containerEmpty: (document.querySelector('#print-container')?.children.length || 0) === 0,
        noOrientStyle: !document.querySelector('#print-orientation-style')
      }))()
    `);

    if (!cleanupVerification.bodyNotPrinting || !cleanupVerification.containerEmpty || !cleanupVerification.noOrientStyle) {
      throw new Error(`[PRINT CLEANUP FAILED] Afterprint cleanup invalid: ${JSON.stringify(cleanupVerification)}`);
    }
    console.log('  └─> Afterprint cleanup: body class removed, container cleared, orientation style removed (PASS)');

    auditReportData.states.state6_print = {
      viewport: { width: vp6.innerWidth, height: vp6.innerHeight },
      selectedPrintDate,
      callCount: printVerification.callCount,
      overflow: {
        docScrollWidth: printVerification.docScrollW,
        docClientWidth: printVerification.docClientW,
        printScrollWidth: printVerification.printScrollW,
        printClientWidth: printVerification.printClientW
      }
    };

    // Save structured audit report to artifacts directory
    const artifactsDir = path.resolve('artifacts');
    if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });
    const reportPath = path.join(artifactsDir, 'ui-zero-jump-audit.json');
    fs.writeFileSync(reportPath, JSON.stringify(auditReportData, null, 2), 'utf8');
    console.log(`\n[Artifacts] Structured audit report saved to ${reportPath}`);

    console.log('\n========================================================================');
    console.log('🎉 ALL 6 ZERO JUMP & ACCEPTANCE MATRIX STATES PASSED WITH ZERO REGRESSION!');
    console.log('========================================================================\n');

  } catch (err) {
    console.error('\n❌ ZERO JUMP AUDIT FAILED:');
    console.error(err.message || err);
    process.exitCode = 1;
  } finally {
    if (client) client.close();
    cleanup();
  }
}

run();
