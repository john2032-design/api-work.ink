// api/redirect.js
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  try {
    if (req.method === 'HEAD') {
      res.status(200).end();
      return;
    }
    if (req.method !== 'GET') {
      res.status(405).send('Method Not Allowed');
      return;
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    const rawTo = Array.isArray(req.query.to) ? req.query.to[0] : req.query.to;
    if (!rawTo) {
      res.status(400).send('Missing "to" parameter. Usage: /redirect?to=https://example.com');
      return;
    }
    let decodedTo = rawTo;
    if (/%[0-9A-Fa-f]{2}/.test(rawTo)) {
      try {
        decodedTo = decodeURIComponent(rawTo);
      } catch (e) {
        decodedTo = rawTo;
      }
    }
    let result = decodedTo;
    if (/^https?:\/\/ads\.luarmor\.net\//i.test(decodedTo)) {
      result = 'https://api-luarmor-net-vortixworld.vercel.app/redirect?to=' + encodeURIComponent(decodedTo);
    }
    try {
      new URL(result);
    } catch (e) {
      res.status(400).send('Invalid "to" URL');
      return;
    }
    if (!/^https?:\/\/ads\.luarmor\.net\//i.test(decodedTo)) {
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Referrer-Policy', 'no-referrer');
      res.status(302).setHeader('Location', result).end();
      return;
    }
    const targetB64 = Buffer.from(result, 'utf8').toString('base64url');
    const candidates = [
      path.resolve(process.cwd(), 'api', 'pages', 'redirectDelay.html'),
      path.resolve(process.cwd(), 'pages', 'redirectDelay.html'),
      path.resolve(__dirname, 'pages', 'redirectDelay.html')
    ];
    let html = null;
    for (const p of candidates) {
      try {
        if (fs.existsSync(p)) {
          html = fs.readFileSync(p, 'utf8');
          break;
        }
      } catch (e) {}
    }
    if (!html) {
      res.status(500).send('redirectDelay.html template not found (looked in ' + candidates.join(', ') + ')');
      return;
    }
    html = html.replace(/%TARGET_B64%/g, targetB64);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.status(200).end(html);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Internal Server Error');
  }
}