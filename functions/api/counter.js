const MAX_FREE = 20;   // first 20 get free access
const MAX_TOTAL = 50;  // total beta programme size shown
const NOTIFY_EMAIL = 'douglasheu@gmail.com';

const CORS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

async function sendNotification(email, seat, isFree) {
  try {
    await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: NOTIFY_EMAIL, name: 'Douglas' }] }],
        from: { email: 'noreply@brokers.xelo.media', name: 'Xelo Beta' },
        subject: isFree
          ? `🎉 Free beta signup — seat ${seat} of ${MAX_FREE}`
          : `💰 Paid beta signup — seat ${seat} of ${MAX_TOTAL}`,
        content: [{
          type: 'text/plain',
          value: `New beta signup!\n\nEmail: ${email}\nSeat: ${seat}\nType: ${isFree ? 'FREE (3 months Professional)' : 'PAID'}\n\nView all signups in Cloudflare KV dashboard.`
        }]
      })
    });
  } catch (_) {}
}

export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS });
  }

  const count = parseInt(await env.XELO_BETA.get('count') || '0');

  if (request.method === 'GET') {
    return new Response(JSON.stringify({
      count,
      maxTotal: MAX_TOTAL,
      maxFree: MAX_FREE,
      freeSpotsLeft: Math.max(0, MAX_FREE - count),
      isFreeAvailable: count < MAX_FREE,
      isFull: count >= MAX_TOTAL
    }), { headers: CORS });
  }

  if (request.method === 'POST') {
    if (count >= MAX_TOTAL) {
      return new Response(JSON.stringify({ full: true }), { status: 409, headers: CORS });
    }
    const next = count + 1;
    const isFree = next <= MAX_FREE;
    await env.XELO_BETA.put('count', String(next));

    const body = await request.json().catch(() => ({}));
    const email = body.email || 'unknown';
    await env.XELO_BETA.put(
      `signup:${String(next).padStart(3, '0')}`,
      JSON.stringify({ email, seat: next, free: isFree, ts: new Date().toISOString() })
    );

    await sendNotification(email, next, isFree);

    return new Response(JSON.stringify({
      count: next,
      maxTotal: MAX_TOTAL,
      maxFree: MAX_FREE,
      freeSpotsLeft: Math.max(0, MAX_FREE - next),
      isFreeAvailable: next < MAX_FREE,
      isFull: next >= MAX_TOTAL
    }), { headers: CORS });
  }

  return new Response('Method not allowed', { status: 405 });
}
