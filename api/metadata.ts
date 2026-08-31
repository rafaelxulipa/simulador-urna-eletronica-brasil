import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getPool } from './_db.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método não permitido' })
    return
  }

  try {
    const pool = getPool()
    const result = await pool.query(
      'SELECT source, is_official, synced_at, candidate_count, notes FROM sync_metadata ORDER BY synced_at DESC LIMIT 1',
    )
    if (result.rows.length === 0) {
      res.status(200).json({
        source: 'Nenhuma sincronização registrada',
        isOfficialData: false,
        syncedAt: new Date(0).toISOString(),
        candidateCount: 0,
        notes: 'Execute scripts/sync-tse para popular o banco com dados oficiais do TSE.',
      })
      return
    }
    const row = result.rows[0]
    res.setHeader('Cache-Control', 'public, max-age=300')
    res.status(200).json({
      source: row.source,
      isOfficialData: row.is_official,
      syncedAt: row.synced_at,
      candidateCount: row.candidate_count,
      notes: row.notes ?? undefined,
    })
  } catch (err) {
    console.error('GET /api/metadata failed:', err)
    res.status(500).json({ error: 'Erro ao consultar metadados' })
  }
}
