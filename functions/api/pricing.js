export async function onRequest() {
  const res = await fetch('https://admin.xelo.media/api/public/pricing')
  const data = await res.json()
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
