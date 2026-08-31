import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getPool } from './_db.js'

/** Candidate id is always a numeric SQ_CANDIDATO string (see scripts/sync-tse). */
function isValidCandidateId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9]{1,20}$/.test(value)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método não permitido' })
    return
  }

  const { id } = req.query
  if (!isValidCandidateId(id)) {
    res.status(400).json({ error: 'Parâmetro "id" inválido' })
    return
  }

  try {
    const pool = getPool()
    const result = await pool.query<{ photo: Buffer; content_type: string }>(
      'SELECT photo, content_type FROM candidate_photos WHERE candidate_id = $1',
      [id],
    )
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Foto não encontrada' })
      return
    }
    const { photo, content_type: contentType } = result.rows[0]
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
    res.status(200).send(photo)
  } catch (err) {
    console.error('GET /api/photo failed:', err)
    res.status(500).json({ error: 'Erro ao consultar foto' })
  }
}
