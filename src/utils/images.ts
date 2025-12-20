import { projectId, publicAnonKey } from './supabase/info'

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-f3a661bc`

export async function uploadImageFile(file: File) {
  const reader = new FileReader()
  const base64 = await new Promise<string>((resolve, reject) => {
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.onload = () => {
      const result = reader.result as string
      // strip data:*/*;base64,
      const idx = result.indexOf('base64,')
      resolve(result.slice(idx + 7))
    }
    reader.readAsDataURL(file)
  })

  const res = await fetch(`${API_BASE}/images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${publicAnonKey}`
    },
    body: JSON.stringify({ filename: file.name, contentBase64: base64 })
  })

  return res.json()
}

export default uploadImageFile
