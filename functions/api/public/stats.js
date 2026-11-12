export async function onRequest() {
  const res = await fetch('https://app.xelo.media/api/public/stats')
  const data = await res.json()
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
