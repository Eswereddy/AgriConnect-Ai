<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>AgriConnect AI - Login Preview</title>
<style>
:root{box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);
--bg1:#ecfdf5;--bg2:#fff;--bg3:#f0fdfa;--card:#fff;--line:#e2e8f0;--ink:#1e293b;--mut:#64748b;--field:#f8fafc;--g:#059669;--g2:#047857;--quote:#047857}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg1:#052e22;--bg2:#0b1220;--bg3:#042f2e;--card:#111827;--line:#263244;--ink:#f1f5f9;--mut:#94a3b8;--field:#0f172a;--quote:#6ee7b7}}
:root[data-theme="dark"]{--bg1:#052e22;--bg2:#0b1220;--bg3:#042f2e;--card:#111827;--line:#263244;--ink:#f1f5f9;--mut:#94a3b8;--field:#0f172a;--quote:#6ee7b7}
html{scroll-padding-top:env(safe-area-inset-top,0px)}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:linear-gradient(135deg,var(--bg1),var(--bg2),var(--bg3));color:var(--ink)}
.wrap{width:100%;max-width:420px}
.head{display:flex;flex-direction:column;align-items:center;margin-bottom:22px}
.logo{padding:14px;border-radius:18px;background:linear-gradient(135deg,#10b981,#0d9488);color:#fff;box-shadow:0 8px 20px rgba(16,185,129,.3);margin-bottom:12px;font-size:28px;line-height:1}
h1{margin:0;font-size:20px;font-weight:900}
.sub{margin:4px 0 0;font-size:12px;color:var(--mut);font-weight:500}
.card{background:var(--card);border:1px solid var(--line);border-radius:24px;padding:24px;box-shadow:0 1px 2px rgba(0,0,0,.05)}
.tabs{display:flex;background:var(--field);border:1px solid var(--line);border-radius:16px;padding:4px;margin-bottom:22px}
.tab{flex:1;padding:8px;border:0;border-radius:12px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.03em;background:transparent;color:var(--mut);cursor:pointer}
.tab.on{background:var(--g);color:#fff}
label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--mut);margin:0 0 6px}
.f{margin-bottom:16px}
input,select{width:100%;padding:10px 12px;background:var(--field);border:1px solid var(--line);border-radius:12px;font-size:14px;color:var(--ink)}
input:focus,select:focus{outline:2px solid #a7f3d0;border-color:#34d399}
.btn{width:100%;padding:12px;border:0;border-radius:12px;background:var(--g);color:#fff;font-size:14px;font-weight:800;cursor:pointer}
.btn:hover{background:var(--g2)}
.quote{text-align:center;font-size:14px;font-weight:600;color:var(--quote);line-height:1.6;margin:20px 0 0}
.note{text-align:center;font-size:11px;color:var(--mut);margin-top:14px}
.reg{display:none}
.is-reg .reg{display:block}
</style>
</head>
<body>
<div class="wrap" id="app">
  <div class="head">
    <div class="logo">🌱</div>
    <h1>AgriConnect AI</h1>
    <p class="sub">Sign in to your workspace</p>
  </div>
  <div class="card">
    <div class="tabs">
      <button class="tab on" id="t-login" type="button">Sign In</button>
      <button class="tab" id="t-reg" type="button">Create Account</button>
    </div>
    <div class="f reg"><label>Full Name</label><input placeholder="Aditi Sharma"></div>
    <div class="f"><label>Email</label><input type="email" placeholder="you@example.com"></div>
    <div class="f"><label>Password</label><input type="password" placeholder="At least 8 characters"></div>
    <div class="f reg"><label>I am a...</label><select><option>Farmer</option><option>Buyer</option><option>Agriculture Expert</option></select></div>
    <button class="btn" id="go" type="button">Sign In</button>
  </div>
  <p class="quote">🌱 Together we grow — farmers, buyers &amp; experts, one connected field. 🤝🌾</p>
 
</div>
<script>
var app=document.getElementById('app'),go=document.getElementById('go'),a=document.getElementById('t-login'),b=document.getElementById('t-reg');
function set(r){app.classList.toggle('is-reg',r);a.classList.toggle('on',!r);b.classList.toggle('on',r);go.textContent=r?'Create Account':'Sign In';}
a.onclick=function(){set(false)};b.onclick=function(){set(true)};
</script>
</body>
</html>
