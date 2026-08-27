import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256 } from './backup-crypto.js';
import type { DriveBackupClient } from './backup-drive.js';

export interface AppsScriptLiveSnapshot {
  scriptId: string;
  capturedAt: string;
  project: Record<string, unknown>;
  content: Record<string, unknown>;
  deployments: Array<Record<string, unknown>>;
}

export interface AppsScriptSourceSnapshot {
  root: string;
  files: Array<{ path: string; bytes: number; sha256: string; content: string }>;
  templateIds: string[];
  deployment: {
    scriptId?: string;
    deploymentId?: string;
    webAppUrl?: string;
    configuredByEnvironment: boolean;
  };
}

function findGasRoot(): string {
  const candidates = [
    resolve(process.cwd(), 'gas'),
    resolve(dirname(fileURLToPath(import.meta.url)), '../../gas'),
    resolve(dirname(fileURLToPath(import.meta.url)), '../../../gas'),
  ];
  for (const candidate of candidates) {
    try {
      if (statSync(candidate).isDirectory()) return candidate;
    } catch {
      // Try the next bundle layout.
    }
  }
  throw new Error('Không tìm thấy thư mục gas/ trong deployment bundle. Không thể chứng minh backup Apps Script đầy đủ.');
}

function claspScriptId(root: string): string | undefined {
  const claspPath = join(dirname(root), '.clasp.json');
  if (!existsSync(claspPath) || !statSync(claspPath).isFile()) return undefined;
  try {
    const parsed = JSON.parse(readFileSync(claspPath, 'utf8')) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return undefined;
    const scriptId = (parsed as Record<string, unknown>)['scriptId'];
    return typeof scriptId === 'string' && /^[A-Za-z0-9_-]+$/.test(scriptId.trim()) ? scriptId.trim() : undefined;
  } catch {
    return undefined;
  }
}

export function configuredAppsScriptId(): string | undefined {
  const environmentId = process.env['LIMS_APPS_SCRIPT_ID']?.trim();
  if (environmentId && /^[A-Za-z0-9_-]+$/.test(environmentId)) return environmentId;
  try {
    return claspScriptId(findGasRoot());
  } catch {
    return undefined;
  }
}

export function readAppsScriptSourceSnapshot(): AppsScriptSourceSnapshot {
  const root = findGasRoot();
  const names = readdirSync(root)
    .filter(name => name.endsWith('.gs') || name === 'appsscript.json')
    .sort();
  if (!names.includes('appsscript.json') || names.filter(name => name.endsWith('.gs')).length === 0) {
    throw new Error('Apps Script bundle thiếu appsscript.json hoặc mã nguồn .gs.');
  }
  const files = names.map(name => {
    const content = readFileSync(join(root, name), 'utf8');
    const bytes = Buffer.byteLength(content, 'utf8');
    return { path: `gas/${name}`, bytes, sha256: sha256(Buffer.from(content, 'utf8')), content };
  });
  // .clasp.json is deployment identity/configuration rather than executable
  // source. Include it when present so a Drive backup contains the exact
  // script project identity without putting any OAuth credential in the
  // snapshot. Vercel includes this root file explicitly for the backup API.
  const workspaceRoot = dirname(root);
  const claspPath = join(workspaceRoot, '.clasp.json');
  if (existsSync(claspPath) && statSync(claspPath).isFile()) {
    const content = readFileSync(claspPath, 'utf8');
    files.push({ path: '.clasp.json', bytes: Buffer.byteLength(content, 'utf8'), sha256: sha256(Buffer.from(content, 'utf8')), content });
  }
  const templateIds = [...new Set(files
    .filter(file => file.path.endsWith('.gs'))
    .flatMap(file => {
      const templateBlock = file.content.match(/TEMPLATES\s*:\s*\{([\s\S]*?)\n\s*\},/m)?.[1] || '';
      return [...templateBlock.matchAll(/:\s*['"]([A-Za-z0-9_-]{20,})['"]/g)].map(match => match[1]);
    }))];
  return {
    root,
    files,
    templateIds,
    deployment: {
      scriptId: configuredAppsScriptId(),
      deploymentId: process.env['LIMS_APPS_SCRIPT_DEPLOYMENT_ID']?.trim() || undefined,
      webAppUrl: process.env['LIMS_APPS_SCRIPT_WEB_APP_URL']?.trim() || undefined,
      configuredByEnvironment: Boolean(
        process.env['LIMS_APPS_SCRIPT_ID']?.trim() ||
        process.env['LIMS_APPS_SCRIPT_DEPLOYMENT_ID']?.trim() ||
        process.env['LIMS_APPS_SCRIPT_WEB_APP_URL']?.trim(),
      ),
    },
  };
}

/**
 * Capture the live Apps Script project in addition to the checked-in `gas/`
 * bundle. The response is intentionally kept as raw API JSON so deployment
 * metadata and source-file fields are not silently discarded during backup.
 */
export async function readAppsScriptLiveSnapshot(
  client: DriveBackupClient,
  scriptId: string,
): Promise<AppsScriptLiveSnapshot> {
  const normalizedId = scriptId.trim();
  if (!/^[A-Za-z0-9_-]+$/.test(normalizedId)) throw new Error('Apps Script scriptId không hợp lệ.');
  const [project, content, deployments] = await Promise.all([
    client.getAppsScriptProject(normalizedId),
    client.getAppsScriptProjectContent(normalizedId),
    client.listAppsScriptDeployments(normalizedId),
  ]);
  return {
    scriptId: normalizedId,
    capturedAt: new Date().toISOString(),
    project,
    content,
    deployments,
  };
}
