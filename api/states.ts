import type { VercelRequest, VercelResponse } from '@vercel/node'
import { BRAZILIAN_STATES } from '../src/data/states.js'

// The state list is a fixed, official constant — no DB round-trip needed.
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método não permitido' })
    return
  }
  res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
  res.status(200).json(BRAZILIAN_STATES)
}
