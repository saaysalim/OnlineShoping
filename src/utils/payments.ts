import { projectId, publicAnonKey } from './supabase/info'

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-f3a661bc`

export async function createCheckoutSession(params: {
  items: Array<{ name: string; amount: number; quantity: number; image?: string }>
  customerEmail?: string
  successUrl?: string
  cancelUrl?: string
}) {
  const res = await fetch(`${API_BASE}/payments/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${publicAnonKey}`
    },
    body: JSON.stringify(params)
  })
  return res.json()
}

export async function getCheckoutSession(sessionId: string) {
  const res = await fetch(`${API_BASE}/payments/session/${encodeURIComponent(sessionId)}`, {
    headers: {
      Authorization: `Bearer ${publicAnonKey}`
    }
  })
  return res.json()
}
