import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getValidGoogleSession } from '../../_lib/google-oauth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  res.setHeader('Cache-Control', 'no-store');
  try {
    const session = await getValidGoogleSession(req, res);
    return res.status(200).json({ authenticated: !!session });
  } catch (error) {
    console.error('[OAuth] Status check failed:', error);
    return res.status(200).json({ authenticated: false });
  }
}
