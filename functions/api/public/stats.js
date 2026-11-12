export async function onRequest() {
  const res = await fetch('https://app.xelo.media/api/public/stats', {
    headers: { 'User-Agent': 'xelo-broker-site/1.0' },
  })
  const data = await res.json()
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
