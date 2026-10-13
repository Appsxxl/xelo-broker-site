export async function onRequest() {
  try {
    const res = await fetch('https://app.xelo.media/api/public/market-cards')
    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, cards: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
