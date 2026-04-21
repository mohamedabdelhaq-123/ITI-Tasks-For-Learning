const API_URL = '/chat'

const styleMap = (creativity) => {
  if (creativity < 0.35) return '[Be strict] '
  if (creativity > 0.7)  return '[Be creative] '
  return ''  // balanced — no instruction needed
}

export async function sendMessage(message, creativity = 0.7) {
  const styledMessage = styleMap(creativity) + message

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: styledMessage }),  // no creativity field sent
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Server error: ${res.status}`)
  }

  const data = await res.json()
  return data.response
}