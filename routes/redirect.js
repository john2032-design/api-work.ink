const express = require('express');
const router = express.Router();

router.get('/luarmor', (req, res) => {
  const redirectMap = req.app.locals.redirectMap;

  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

    if (!id) {
      return res.status(400).send('Missing "id" parameter. Usage: /luarmor?id=xxx');
    }

    const storedTo = redirectMap.get(id);

    if (!storedTo) {
      const expiredHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Link Expired | VortixWorld</title>
<style>
:root{--bg-dark:#050505;--bg-panel:rgba(20,20,35,.6);--danger:#ef4444;--text-main:#fff;--text-muted:#94a3b8;--font:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
body{background-color:var(--bg-dark);background-image:radial-gradient(at 0% 0%,rgba(59,130,246,.15) 0,transparent 50%),radial-gradient(at 100% 100%,rgba(139,92,246,.15) 0,transparent 50%);color:var(--text-main);font-family:var(--font);min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;padding:20px}
.glass-panel{background:var(--bg-panel);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:clamp(24px,5vw,48px);width:100%;max-width:480px;display:flex;flex-direction:column;align-items:center;text-align:center;box-shadow:0 25px 50px -12px rgba(0,0,0,.5);animation:slideUp .6s cubic-bezier(.16,1,.3,1)}
.logo{font-size:clamp(20px,4vw,24px);font-weight:800;letter-spacing:-.5px;margin-bottom:32px;background:linear-gradient(to right,#fff,#94a3b8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;opacity:.9}
.status-icon{width:80px;height:80px;margin-bottom:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(239,68,68,.1)}
.timer-display{font-size:42px;font-weight:800;line-height:1;letter-spacing:-1px;margin-bottom:16px;color:var(--danger)}
.status-text{font-size:14px;text-transform:uppercase;letter-spacing:2px;color:var(--text-muted);font-weight:600;margin-bottom:32px}
.info-box{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);color:#ccc;padding:12px 16px;border-radius:12px;font-size:13px;line-height:1.5;width:100%}
.footer{position:fixed;bottom:24px;font-size:12px;color:rgba(255,255,255,.2);letter-spacing:1px}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
</style>
</head>
<body>
<div class="glass-panel">
  <div class="logo">VortixWorld Luarmor</div>
  <div class="status-icon">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </div>
  <div class="timer-display">EXPIRED</div>
  <div class="status-text">This link is no longer active</div>
  <div class="info-box">Please generate a new link to continue.</div>
</div>
<div class="footer">VortixWorld &bull; Luarmor 2026</div>
</body>
</html>`;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      return res.status(410).send(expiredHtml);
    }

    var result = storedTo;
    try {
      new URL(result);
    } catch {
      return res.status(400).send('Invalid URL');
    }

    if (/^https?:\/\/ads\.luarmor\.net\//i.test(result)) {
      result = 'https://api-luarmor-vw.onrender.com/luarmor?verify=' + encodeURIComponent(result);
    }

    if (!/^https?:\/\/ads\.luarmor\.net\//i.test(storedTo)) {
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Referrer-Policy', 'no-referrer');
      res.setHeader('Permissions-Policy', 'interest-cohort=()');
      res.status(302).setHeader('Location', result).end();
      return;
    }

    var html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="referrer" content="no-referrer">
<title>Secure Redirect | VortixWorld</title>
<style>
:root{--bg-dark:#050505;--bg-panel:rgba(20,20,35,.6);--primary:#3b82f6;--primary-glow:rgba(59,130,246,.5);--accent:#8b5cf6;--text-main:#fff;--text-muted:#94a3b8;--font:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
body{background-color:var(--bg-dark);background-image:radial-gradient(at 0% 0%,rgba(59,130,246,.15) 0,transparent 50%),radial-gradient(at 100% 100%,rgba(139,92,246,.15) 0,transparent 50%);color:var(--text-main);font-family:var(--font);min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;padding:20px}
.glass-panel{background:var(--bg-panel);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:clamp(24px,5vw,48px);width:100%;max-width:480px;display:flex;flex-direction:column;align-items:center;text-align:center;box-shadow:0 25px 50px -12px rgba(0,0,0,.5);animation:slideUp .6s cubic-bezier(.16,1,.3,1)}
.logo{font-size:clamp(20px,4vw,24px);font-weight:800;letter-spacing:-.5px;margin-bottom:32px;background:linear-gradient(to right,#fff,#94a3b8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;opacity:.9}
.status-icon{width:80px;height:80px;margin-bottom:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(59,130,246,.1);position:relative}
.status-icon::after{content:'';position:absolute;inset:-4px;border-radius:50%;background:linear-gradient(45deg,var(--primary),var(--accent));z-index:-1;opacity:.5;filter:blur(10px)}
.timer-display{font-size:clamp(64px,15vw,96px);font-weight:800;line-height:1;font-variant-numeric:tabular-nums;letter-spacing:-2px;margin-bottom:8px;text-shadow:0 0 40px var(--primary-glow)}
.status-text{font-size:14px;text-transform:uppercase;letter-spacing:2px;color:var(--text-muted);font-weight:600;margin-bottom:32px}
.info-box{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);color:#93c5fd;padding:12px 16px;border-radius:12px;font-size:13px;line-height:1.5;width:100%}
.footer{position:fixed;bottom:24px;font-size:12px;color:rgba(255,255,255,.2);letter-spacing:1px}
.spinner{animation:rotate 2s linear infinite;width:40px;height:40px}
.path{stroke:#fff;stroke-linecap:round;animation:dash 1.5s ease-in-out infinite}
@keyframes rotate{100%{transform:rotate(360deg)}}
@keyframes dash{0%{stroke-dasharray:1,150;stroke-dashoffset:0}50%{stroke-dasharray:90,150;stroke-dashoffset:-35}100%{stroke-dasharray:90,150;stroke-dashoffset:-124}}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
</style>
</head>
<body>
<div class="glass-panel">
  <div class="logo">VortixWorld Luarmor</div>
  <div class="status-icon">
    <svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle></svg>
  </div>
  <div id="countdown" class="timer-display">25</div>
  <div class="status-text">Seconds until redirect</div>
  <div class="info-box">&#128274; Secure redirect in progress. Please wait for the timer to complete.</div>
</div>
<div class="footer">VortixWorld &bull; Luarmor 2026</div>
<script id="target-data" type="application/json" data-b64="%TARGET_B64%"></script>
<script>
(function(){
  function decodeB64(str){
    try{
      return decodeURIComponent(atob(str).split('').map(function(c){
        return '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    }catch(e){return null;}
  }
  var dataEl=document.getElementById('target-data');
  var b64=dataEl?dataEl.dataset.b64:'';
  var TARGET_URL=decodeB64(b64);
  var timeLeft=25;
  var countdownEl=document.getElementById('countdown');
  var timer=setInterval(function(){
    timeLeft--;
    countdownEl.textContent=timeLeft>0?timeLeft:0;
    if(timeLeft<=5){
      countdownEl.style.color='#ef4444';
      countdownEl.style.textShadow='0 0 40px rgba(239,68,68,.6)';
    }
    if(timeLeft<=0){
      clearInterval(timer);
      if(TARGET_URL){
        try{window.location.replace(TARGET_URL);}
        catch(e){window.location.href=TARGET_URL;}
      }else{
        countdownEl.textContent='ERR';
      }
    }
  },1000);
})();
</script>
</body>
</html>`;

    var targetB64 = Buffer.from(result).toString('base64');
    html = html.replace(/%TARGET_B64%/g, targetB64);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Permissions-Policy', 'interest-cohort=()');
    res.status(200).send(html);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;