const SEED = 9;
const MAX_FREE = 20;
const MAX_TOTAL = 50;

export async function onRequest({ request, env }) {
  // Auth check
  const pass = env.ADMIN_PASSWORD || 'xelo2026admin';
  const auth = request.headers.get('Authorization') || '';

  if (!auth.startsWith('Basic ')) return unauth();
  try {
    const [, provided] = atob(auth.slice(6)).split(':');
    if (provided !== pass) return unauth();
  } catch (_) { return unauth(); }

  // KV not yet bound — show setup instructions instead of crashing
  if (!env.XELO_BETA) {
    return new Response(setupPage(), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  try {
    if (request.method === 'POST') {
      const form = await request.formData().catch(() => null);
      if (form && form.get('action') === 'set_count') {
        const val = parseInt(form.get('value') || '-1');
        if (!isNaN(val) && val >= 0 && val <= MAX_TOTAL) {
          await env.XELO_BETA.put('count', String(val));
        }
      }
      if (form && form.get('action') === 'delete_diamond') {
        const key = form.get('key');
        if (key && key.startsWith('diamond:')) {
          await env.XELO_BETA.delete(key);
        }
      }
      if (form && form.get('action') === 'delete_signup') {
        const key = form.get('key');
        if (key && key.startsWith('signup:')) {
          await env.XELO_BETA.delete(key);
        }
      }
      return new Response(null, { status: 303, headers: { Location: '/admin' } });
    }

    const count = parseInt(await env.XELO_BETA.get('count') || '0');
    const displayCount = count + SEED;
    const freeUsed = Math.min(count, MAX_FREE);
    const paidUsed = Math.max(0, count - MAX_FREE);
    const remaining = MAX_TOTAL - displayCount;

    const list = await env.XELO_BETA.list({ prefix: 'signup:' });
    const signups = [];
    for (const key of list.keys) {
      try {
        const val = await env.XELO_BETA.get(key.name);
        signups.push(JSON.parse(val));
      } catch (_) {}
    }
    signups.sort((a, b) => a.seat - b.seat);

    const dlist = await env.XELO_BETA.list({ prefix: 'diamond:' });
    const diamond = [];
    for (const key of dlist.keys) {
      try {
        const val = await env.XELO_BETA.get(key.name);
        diamond.push(JSON.parse(val));
      } catch (_) {}
    }
    diamond.sort((a, b) => a.seat - b.seat);

    const rows = signups.length === 0
      ? '<tr><td colspan="5" class="empty">No signups yet</td></tr>'
      : signups.map(s => `
        <tr>
          <td>${s.seat}</td>
          <td>${s.email || '—'}</td>
          <td>${s.free ? '<span class="tag-free">FREE</span>' : '<span class="tag-paid">PAID</span>'}</td>
          <td>${s.ts ? new Date(s.ts).toLocaleString('nl-NL') : '—'}</td>
          <td><form method="POST" action="/admin" style="margin:0" onsubmit="return confirm('Delete ${s.email}?')"><input type="hidden" name="action" value="delete_signup"><input type="hidden" name="key" value="signup:${String(s.seat).padStart(3,'0')}"><button type="submit" style="background:rgba(226,75,74,.15);border:1px solid rgba(226,75,74,.3);color:#E24B4A;padding:3px 10px;border-radius:5px;cursor:pointer;font-size:11px">✕ Delete</button></form></td>
        </tr>`).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Xelo Admin — Beta</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0C1B2E;color:#fff;font-family:'DM Sans',Arial,sans-serif;font-size:14px;line-height:1.6;min-height:100vh}
nav{background:#0A1520;border-bottom:1px solid rgba(255,255,255,.08);padding:14px 32px;display:flex;align-items:center;justify-content:space-between}
.logo{color:#C9A84C;font-weight:700;font-size:20px;letter-spacing:.04em}
.badge{background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.3);color:#C9A84C;font-size:11px;padding:4px 12px;border-radius:20px;letter-spacing:.1em;text-transform:uppercase}
.wrap{max-width:920px;margin:0 auto;padding:36px 24px}
.section-title{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:12px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:36px}
@media(max-width:600px){.stats{grid-template-columns:repeat(2,1fr)}}
.stat{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:18px}
.stat-num{font-size:30px;font-weight:700;color:#C9A84C;line-height:1}
.stat-num.green{color:#4ADE80}
.stat-num.red{color:#E24B4A}
.stat-lbl{font-size:11px;color:rgba(255,255,255,.4);margin-top:4px}
.card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:20px;margin-bottom:20px}
h2{font-size:15px;font-weight:700;margin-bottom:14px;color:#fff}
table{width:100%;border-collapse:collapse}
th{text-align:left;font-size:11px;color:rgba(255,255,255,.35);letter-spacing:.08em;text-transform:uppercase;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.08)}
td{padding:11px 12px;border-bottom:1px solid rgba(255,255,255,.05);font-size:13px;color:rgba(255,255,255,.75)}
tr:hover td{background:rgba(255,255,255,.02)}
.tag-free{background:rgba(74,222,128,.12);color:#4ADE80;border:1px solid rgba(74,222,128,.25);font-size:10px;font-weight:700;padding:2px 9px;border-radius:20px;letter-spacing:.06em}
.tag-paid{background:rgba(201,168,76,.12);color:#C9A84C;border:1px solid rgba(201,168,76,.25);font-size:10px;font-weight:700;padding:2px 9px;border-radius:20px;letter-spacing:.06em}
.empty{text-align:center;padding:40px 0;color:rgba(255,255,255,.25);font-size:13px}
.form-row{display:flex;align-items:center;gap:10px;margin-top:10px}
.form-row input{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:6px;padding:9px 12px;color:#fff;font-size:14px;width:90px;outline:none}
.form-row input:focus{border-color:#C9A84C}
.form-row button{background:#C9A84C;color:#0C1B2E;border:none;padding:9px 20px;border-radius:6px;font-weight:700;cursor:pointer;font-size:13px}
.form-row button:hover{opacity:.9}
.hint{font-size:12px;color:rgba(255,255,255,.35);margin-top:8px}
.progress-bar{height:6px;background:rgba(255,255,255,.08);border-radius:3px;margin-top:14px;overflow:hidden;margin-bottom:32px}
.progress-fill{height:100%;background:linear-gradient(90deg,#C9A84C,#E8C56A);border-radius:3px}
</style>
</head>
<body>
<nav>
  <span class="logo">xelo</span>
  <span class="badge">Beta Admin</span>
</nav>
<div class="wrap">
  <div class="section-title">Overview</div>
  <div class="stats">
    <div class="stat"><div class="stat-num">${displayCount}</div><div class="stat-lbl">Shown publicly<br>(real + seed ${SEED})</div></div>
    <div class="stat"><div class="stat-num">${count}</div><div class="stat-lbl">Real signups in KV</div></div>
    <div class="stat"><div class="stat-num green">${freeUsed}</div><div class="stat-lbl">Free seats used<br>(of ${MAX_FREE})</div></div>
    <div class="stat"><div class="stat-num ${remaining <= 5 ? 'red' : ''}">${Math.max(0, remaining)}</div><div class="stat-lbl">Remaining to show<br>(of ${MAX_TOTAL})</div></div>
  </div>
  <div class="progress-bar">
    <div class="progress-fill" style="width:${Math.round((displayCount/MAX_TOTAL)*100)}%"></div>
  </div>
  <div class="card">
    <h2>Signups (${signups.length} real)</h2>
    <table>
      <tr><th>#</th><th>Email</th><th>Type</th><th>Signed up</th><th></th></tr>
      ${rows}
    </table>
  </div>
  <div class="card">
    <h2>◆ Diamond waitlist (${diamond.length})</h2>
    <table>
      <tr><th>#</th><th>Email</th><th>Joined</th><th></th></tr>
      ${diamond.length === 0
        ? '<tr><td colspan="4" class="empty">No waitlist entries yet</td></tr>'
        : diamond.map(d => `<tr><td>${d.seat}</td><td>${d.email||'—'}</td><td>${d.ts ? new Date(d.ts).toLocaleString('nl-NL') : '—'}</td><td><form method="POST" action="/admin" style="margin:0" onsubmit="return confirm('Delete ${d.email}?')"><input type="hidden" name="action" value="delete_diamond"><input type="hidden" name="key" value="diamond:${String(d.seat).padStart(3,'0')}"><button type="submit" style="background:rgba(226,75,74,.15);border:1px solid rgba(226,75,74,.3);color:#E24B4A;padding:3px 10px;border-radius:5px;cursor:pointer;font-size:11px">✕ Delete</button></form></td></tr>`).join('')}
    </table>
  </div>

  <div class="card">
    <h2>Adjust real count</h2>
    <p class="hint">Set the KV counter directly — removes test signups or corrects errors. Display = value + seed (${SEED}). Paid so far: ${paidUsed}.</p>
    <form method="POST" action="/admin">
      <input type="hidden" name="action" value="set_count">
      <div class="form-row">
        <input type="number" name="value" value="${count}" min="0" max="${MAX_TOTAL}" required>
        <button type="submit">Update</button>
      </div>
    </form>
    <p class="hint" style="margin-top:12px">To change SEED or MAX_FREE, edit <code>functions/api/counter.js</code> and deploy.</p>
  </div>
</div>
</body>
</html>`;

    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });

  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500, headers: { 'Content-Type': 'text/plain' } });
  }
}

function unauth() {
  return new Response('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Xelo Admin"', 'Content-Type': 'text/plain' }
  });
}

function setupPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Xelo Admin — Setup needed</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0C1B2E;color:#fff;font-family:'DM Sans',Arial,sans-serif;min-height:100vh;display:flex;flex-direction:column}
nav{background:#0A1520;border-bottom:1px solid rgba(255,255,255,.08);padding:14px 32px;display:flex;align-items:center;justify-content:space-between}
.logo{color:#C9A84C;font-weight:700;font-size:20px}
.badge{background:rgba(226,75,74,.12);border:1px solid rgba(226,75,74,.3);color:#E24B4A;font-size:11px;padding:4px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:.1em}
.wrap{max-width:640px;margin:0 auto;padding:60px 24px}
h1{font-size:22px;font-weight:700;margin-bottom:12px}
p{color:rgba(255,255,255,.6);line-height:1.7;margin-bottom:20px}
.step{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:18px 20px;margin-bottom:12px;counter-increment:steps}
.step-num{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(201,168,76,.7);margin-bottom:6px}
.step code{background:rgba(255,255,255,.08);border-radius:4px;padding:2px 6px;font-size:13px;font-family:monospace}
</style>
</head>
<body>
<nav><span class="logo">xelo</span><span class="badge">KV not connected</span></nav>
<div class="wrap">
  <h1>One-time setup needed</h1>
  <p>The admin panel is working but the KV database isn't connected yet. Follow these steps in your Cloudflare dashboard — takes about 2 minutes.</p>

  <div class="step">
    <div class="step-num">Step 1</div>
    Go to <strong>Cloudflare dashboard → Workers &amp; Pages → KV</strong> and click <strong>Create namespace</strong>. Name it <code>XELO_BETA</code> and save.
  </div>

  <div class="step">
    <div class="step-num">Step 2</div>
    Go to <strong>Pages → xelo-broker-site → Settings → Functions → KV namespace bindings</strong>. Click <strong>Add binding</strong>, set variable name to <code>XELO_BETA</code> and select the namespace you just created.
  </div>

  <div class="step">
    <div class="step-num">Step 3</div>
    Trigger a new deploy (push any small change, or use <strong>Pages → Deployments → Retry deployment</strong>).
  </div>

  <div class="step">
    <div class="step-num">Step 4 (optional but recommended)</div>
    Go to <strong>Settings → Environment variables</strong> and add <code>ADMIN_PASSWORD</code> with a strong password of your choice. Without this, the default password <code>xelo2026admin</code> is used.
  </div>

  <p style="margin-top:28px;font-size:13px">After setup, refresh this page and the full dashboard will appear.</p>
</div>
</body>
</html>`;
}
