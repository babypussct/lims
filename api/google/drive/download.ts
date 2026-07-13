import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getValidGoogleSession } from '../../_lib/google-oauth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  const fileId = typeof req.query['fileId'] === 'string' ? req.query['fileId'] : '';
  if (!/^[a-zA-Z0-9_-]+$/.test(fileId)) return res.status(400).json({ error: 'Invalid fileId' });

  try {
    const session = await getValidGoogleSession(req, res);
    if (!session) return res.status(401).json({ error: 'oauth_required' });
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`, {
      headers: { Authorization: `Bearer ${session.accessToken}` }
    });
    if (!response.ok) {
      const body = await response.text();
      console.error('[Drive proxy] Download failed:', response.status, body.slice(0, 500));
      return res.status(response.status).json({ error: 'drive_download_failed' });
    }
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'private, no-store');
    const data = Buffer.from(await response.arrayBuffer());
    return res.status(200).send(data);
  } catch (error) {
    console.error('[Drive proxy] Unexpected error:', error);
    return res.status(500).json({ error: 'drive_proxy_failed' });
  }
}
