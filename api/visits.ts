import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getPool } from './_db.js'

/**
 * A single aggregate counter — POST increments and returns the new total,
 * GET just reads it. No IP address, cookie, or any per-visitor identifier
 * is stored — just one number. See docs/architecture.md.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' })
    return
  }

  try {
    const pool = getPool()

    if (req.method === 'POST') {
      const result = await pool.query<{ value: string }>(
        `INSERT INTO site_stats (key, value) VALUES ('visits', 1)
         ON CONFLICT (key) DO UPDATE SET value = site_stats.value + 1
         RETURNING value`,
      )
      res.setHeader('Cache-Control', 'no-store')
      res.status(200).json({ visits: Number(result.rows[0].value) })
      return
    }

    const result = await pool.query<{ value: string }>(`SELECT value FROM site_stats WHERE key = 'visits'`)
    res.setHeader('Cache-Control', 'public, max-age=30')
    res.status(200).json({ visits: result.rows.length ? Number(result.rows[0].value) : 0 })
  } catch (err) {
    console.error('GET/POST /api/visits failed:', err)
    res.status(500).json({ error: 'Erro ao consultar visitas' })
  }
}
