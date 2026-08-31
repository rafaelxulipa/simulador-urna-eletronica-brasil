import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getPool } from './_db'
import { isValidBallotNumberFragment, isValidOfficeCode, isValidStateCode } from './_validation'

interface CandidateRow {
  id: string
  ballot_number: string
  ballot_name: string
  full_name: string | null
  party: string
  party_number: string | null
  federation: string | null
  office: string
  state: string
  photo_url: string | null
  status: string | null
}

function toCandidate(row: CandidateRow) {
  return {
    id: row.id,
    ballotNumber: row.ballot_number,
    ballotName: row.ballot_name,
    fullName: row.full_name ?? undefined,
    party: row.party,
    partyNumber: row.party_number ?? undefined,
    federation: row.federation ?? undefined,
    office: row.office,
    state: row.state,
    photoUrl: row.photo_url ?? undefined,
    status: row.status ?? undefined,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método não permitido' })
    return
  }

  const { state, office, number } = req.query

  if (!isValidStateCode(state) || !isValidOfficeCode(office)) {
    res.status(400).json({ error: 'Parâmetros "state" e "office" inválidos ou ausentes' })
    return
  }
  if (number !== undefined && !isValidBallotNumberFragment(number)) {
    res.status(400).json({ error: 'Parâmetro "number" inválido' })
    return
  }

  try {
    const pool = getPool()
    const officeUpper = office.toUpperCase()
    // Presidential candidacies are filed nationally by the TSE (SG_UF="BR"), not per-state —
    // every voter sees the same ballot regardless of which UF they selected. See docs/data-sources.md.
    const effectiveState = officeUpper === 'PRESIDENT' ? 'BR' : state.toUpperCase()
    const params: string[] = [effectiveState, officeUpper]
    let query =
      'SELECT id, ballot_number, ballot_name, full_name, party, party_number, federation, office, state, photo_url, status FROM candidates WHERE state = $1 AND office = $2'
    if (number !== undefined) {
      params.push(number as string)
      query += ' AND ballot_number = $3'
    }
    query += ' ORDER BY ballot_number'

    const result = await pool.query<CandidateRow>(query, params)
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600')
    res.status(200).json(result.rows.map(toCandidate))
  } catch (err) {
    console.error('GET /api/candidates failed:', err)
    res.status(500).json({ error: 'Erro ao consultar candidatos' })
  }
}
