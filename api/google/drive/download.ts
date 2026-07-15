import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getValidGoogleSession } from '../../_lib/google-oauth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  const fileId = typeof req.query['fileId'] === 'string' ? req.query['fileId'] : '';
  if (!/^[a-zA-Z0-9_-]+$/.test(fileId)) return res.status(400).json({ error: 'Invalid fileId' });

  // 1. Thử tải bằng Access Token của người dùng nếu có session hợp lệ
  try {
    const session = await getValidGoogleSession(req, res);
    if (session?.accessToken) {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      if (response.ok) {
        return sendFileResponse(response, res);
      }
      console.warn(`[Drive proxy] Download với user session thất bại (status: ${response.status}). Thử tiếp bằng API Key/Public...`);
    }
  } catch (err) {
    console.warn('[Drive proxy] Lỗi khi tải bằng user session:', err);
  }

  // 2. Thử tải bằng API Key của hệ thống nếu được cấu hình
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media&key=${apiKey}`);
      if (response.ok) {
        return sendFileResponse(response, res);
      }
      console.warn(`[Drive proxy] Download với API Key thất bại (status: ${response.status}). Thử public URL...`);
    } catch (err) {
      console.warn('[Drive proxy] Lỗi khi tải bằng API Key:', err);
    }
  }

  // 3. Fallback: Tải qua link download public của Google Drive (hoạt động với mọi file đã chia sẻ công khai)
  try {
    const response = await fetch(`https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`);
    if (response.ok) {
      return sendFileResponse(response, res);
    }
    const body = await response.text();
    console.error('[Drive proxy] Tải file công khai thất bại:', response.status, body.slice(0, 500));
    return res.status(response.status).json({ error: 'drive_download_failed' });
  } catch (error) {
    console.error('[Drive proxy] Lỗi hệ thống khi tải file public:', error);
    return res.status(500).json({ error: 'drive_proxy_failed' });
  }
}

async function sendFileResponse(response: any, res: VercelResponse) {
  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'private, no-store');
  const data = Buffer.from(await response.arrayBuffer());
  return res.status(200).send(data);
}
