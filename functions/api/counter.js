const MAX = 20;
const CORS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

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
    await env.XELO_BETA.put('count', String(next));

    const body = await request.json().catch(() => ({}));
    if (body.email) {
      await env.XELO_BETA.put(`email:${next}:${Date.now()}`, body.email);
    }

    return new Response(JSON.stringify({ count: next, max: MAX, left: MAX - next }), { headers: CORS });
  }

  return new Response('Method not allowed', { status: 405 });
}
