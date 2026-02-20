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
    const rawTo = Array.isArray(req.query.to) && typeof req.query.to[0] === 'string' ? req.query.to[0] : (typeof req.query.to === 'string' ? req.query.to : null);
    if (!rawTo) {
      res.status(400).send('Missing or invalid "to" parameter. Usage: /redirect?to=https://example.com');
      return;
    }
    if (typeof rawTo !== 'string') {
      res.status(400).send('Invalid "to" parameter type');
      return;
    }
    console.log('Redirect request:', { url: rawTo, userAgent: req.headers['user-agent'], ip: req.headers['x-forwarded-for'] });
    let decodedTo = rawTo;
    if (/%[0-9A-Fa-f]{2}/.test(rawTo)) {
      try {
        decodedTo = decodeURIComponent(rawTo);
      } catch (e) {
        decodedTo = rawTo;
      }
    } else {
      decodedTo = rawTo;
    }
    let result = decodedTo;
    const luarmorRegex = /^https?:\/\/ads\.luarmor\.net\//i;
    if (luarmorRegex.test(decodedTo)) {
      result = 'https://api-luarmor-net-vortixworld.vercel.app/redirect?to=' + encodeURIComponent(decodedTo);
    }
    const parsed = new URL(result);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      res.status(400).send('Unsupported protocol');
      return;
    }
    if (result.includes(req.headers.host)) {
      res.status(400).send('Redirect loop detected');
      return;
    }
    if (!result.startsWith('https://')) {
      result = result.replace('http://', 'https://');
    }
    if (!luarmorRegex.test(decodedTo)) {
      const headers = {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
      };
      Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
      res.status(302).setHeader('Location', result).end();
      return;
    }
    const targetB64 = Buffer.from(result).toString('base64url');
    const candidates = [
      path.resolve(process.cwd(), 'pages', 'redirectDelay.html'),
      path.resolve(process.cwd(), 'api', 'pages', 'redirectDelay.html'),
      path.resolve(__dirname, 'pages', 'redirectDelay.html'),
      path.resolve(process.cwd(), 'public', 'redirectDelay.html'),
      path.resolve(process.cwd(), 'src', 'pages', 'redirectDelay.html')
    ];
    let html = null;
    for (const p of candidates) {
      console.log(`Trying path: ${p}`);
      try {
        await fs.access(p);
        html = await fs.readFile(p, 'utf8');
        break;
      } catch (e) {}
    }
    if (!html) {
      console.error('Template not found');
      res.status(500).send('redirectDelay.html template not found (looked in ' + candidates.join(', ') + ')');
      return;
    }
    html = html.replace(/%TARGET_B64%/g, targetB64);
    const headers = {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self';",
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    };
    Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.status(200).end(html);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Internal Server Error');
  }
}