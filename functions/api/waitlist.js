const CORS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  if (!env.XELO_BETA) {
    return new Response(JSON.stringify({ ok: false, error: 'KV not configured' }), { headers: CORS });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const email = (body.email || '').trim();
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid email' }), { status: 400, headers: CORS });
    }

    const count = parseInt(await env.XELO_BETA.get('diamond_count') || '0') + 1;
    await env.XELO_BETA.put('diamond_count', String(count));
    await env.XELO_BETA.put(
      `diamond:${String(count).padStart(3, '0')}`,
      JSON.stringify({ email, seat: count, ts: new Date().toISOString() })
    );

    return new Response(JSON.stringify({ ok: true }), { headers: CORS });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: CORS });
  }
}
