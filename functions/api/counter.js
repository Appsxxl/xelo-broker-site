const MAX = 20;
const CORS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
const NOTIFY_EMAIL = 'douglasheu@gmail.com';

async function sendNotification(email, seat, left) {
  try {
    await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: NOTIFY_EMAIL, name: 'Douglas' }] }],
        from: { email: 'noreply@brokers.xelo.media', name: 'Xelo Beta' },
        subject: `🎉 New beta signup — seat ${seat} of ${MAX}`,
        content: [{
          type: 'text/plain',
          value: `New beta request!\n\nEmail: ${email}\nSeat: ${seat} of ${MAX}\nRemaining: ${left}\n\nLog in to Cloudflare KV to view all signups.`
        }]
      })
    });
  } catch (_) {
    // notification failure is non-critical
  }
}

export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS });
  }

  const count = parseInt(await env.XELO_BETA.get('count') || '0');

  if (request.method === 'GET') {
    return new Response(JSON.stringify({ count, max: MAX, left: MAX - count }), { headers: CORS });
  }

  if (request.method === 'POST') {
    if (count >= MAX) {
      return new Response(JSON.stringify({ full: true, count, max: MAX }), { status: 409, headers: CORS });
    }
    const next = count + 1;
    const left = MAX - next;
    await env.XELO_BETA.put('count', String(next));

    const body = await request.json().catch(() => ({}));
    const email = body.email || 'unknown';
    await env.XELO_BETA.put(`signup:${String(next).padStart(3,'0')}`, JSON.stringify({ email, seat: next, ts: new Date().toISOString() }));

    await sendNotification(email, next, left);

    return new Response(JSON.stringify({ count: next, max: MAX, left }), { headers: CORS });
  }

  return new Response('Method not allowed', { status: 405 });
}
