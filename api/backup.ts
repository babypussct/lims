import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  backupCreateHandler,
  backupInspectHandler,
  backupListHandler,
  backupRestoreHandler,
  backupStatusHandler,
  backupVerifyHandler,
  type BackupHttpHandler,
} from './_lib/backup-http.js';

const OPERATIONS: Record<string, BackupHttpHandler> = {
  create: backupCreateHandler,
  inspect: backupInspectHandler,
  list: backupListHandler,
  restore: backupRestoreHandler,
  status: backupStatusHandler,
  verify: backupVerifyHandler,
};

function requestedOperation(req: VercelRequest): string {
  const queryOperation = req.query['operation'];
  if (typeof queryOperation === 'string') return queryOperation.trim().toLowerCase();
  const path = String(req.url || '').split('?')[0];
  const match = path.match(/\/api\/backup\/([a-z-]+)\/?$/i);
  return match?.[1]?.toLowerCase() || '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const operation = requestedOperation(req);
  const target = OPERATIONS[operation];
  if (!target) {
    res.setHeader('Allow', 'GET,POST,OPTIONS');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(404).json({ error: 'Backup operation không hợp lệ.' });
  }
  return target(req, res);
}
