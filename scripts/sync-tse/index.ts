import AdmZip from 'adm-zip'
import { Pool } from 'pg'
import { parseCandidatesCsv } from './parseCandidatesCsv'
import type { NormalizedCandidate } from './parseCandidatesCsv'
import { syncPhotos } from './syncPhotos'
import { BRAZILIAN_STATES } from '../../src/data/states'

// Documented in docs/data-sources.md — following the TSE's stable
// consulta_cand_AAAA.zip naming pattern used since at least 2018.
const TSE_ZIP_URL = 'https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_2026.zip'

async function downloadZip(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(
      `Falha ao baixar ${url}: HTTP ${res.status}. Se for 403, este ambiente pode estar bloqueado pelo ` +
        'WAF do TSE (visto durante a pesquisa, ver docs/data-sources.md) — tente de outra rede.',
    )
  }
  return Buffer.from(await res.arrayBuffer())
}

// Per-UF files (consulta_cand_2026_PE.csv, ...) plus the national consulta_cand_2026_BR.csv
// (presidential candidacies, filed with SG_UF="BR" — see docs/data-sources.md). Deliberately
// excludes the consolidated consulta_cand_2026_BRASIL.csv, which is the union of all of the
// above and would double-count every candidate if processed alongside them.
const CANDIDATE_FILE_PATTERN = /^consulta_cand_2026_[A-Z]{2}\.csv$/i

function extractCandidates(zipBuffer: Buffer): NormalizedCandidate[] {
  const zip = new AdmZip(zipBuffer)
  const csvEntries = zip.getEntries().filter((e) => CANDIDATE_FILE_PATTERN.test(e.entryName))
  if (csvEntries.length === 0) {
    throw new Error('Nenhum CSV de candidatos por UF encontrado dentro do ZIP baixado do TSE.')
  }

  const seen = new Set<string>()
  const all: NormalizedCandidate[] = []
  for (const entry of csvEntries) {
    for (const candidate of parseCandidatesCsv(entry.getData())) {
      const key = `${candidate.state}:${candidate.office}:${candidate.ballotNumber}`
      if (seen.has(key)) continue // consolidated + per-UF files can overlap
      seen.add(key)
      all.push(candidate)
    }
  }
  return all
}

const BATCH_SIZE = 1000
const COLUMNS_PER_ROW = 11

function buildBatchInsert(batch: NormalizedCandidate[]): { sql: string; params: unknown[] } {
  const params: unknown[] = []
  const rowPlaceholders = batch.map((c, i) => {
    const base = i * COLUMNS_PER_ROW
    // photo_url is set unconditionally to /api/photo?id=<id> — syncPhotos() only
    // populates candidate_photos for candidates that actually have a photo, and
    // the frontend's CandidateAvatar already falls back to initials on a 404.
    params.push(
      c.id,
      c.ballotNumber,
      c.ballotName,
      c.fullName,
      c.party,
      c.partyNumber,
      c.federation,
      c.office,
      c.state,
      c.status,
      `/api/photo?id=${c.id}`,
    )
    const placeholders = Array.from({ length: COLUMNS_PER_ROW }, (_, j) => `$${base + j + 1}`)
    return `(${placeholders.join(',')})`
  })

  const sql = `
    INSERT INTO candidates
      (id, ballot_number, ballot_name, full_name, party, party_number, federation, office, state, status, photo_url)
    VALUES ${rowPlaceholders.join(',')}
    ON CONFLICT (state, office, ballot_number) DO UPDATE SET
      ballot_name = EXCLUDED.ballot_name,
      full_name = EXCLUDED.full_name,
      party = EXCLUDED.party,
      party_number = EXCLUDED.party_number,
      federation = EXCLUDED.federation,
      status = EXCLUDED.status,
      photo_url = EXCLUDED.photo_url`
  return { sql, params }
}

async function upsertCandidates(pool: Pool, candidates: NormalizedCandidate[]) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('DELETE FROM candidates')
    for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
      const batch = candidates.slice(i, i + BATCH_SIZE)
      const { sql, params } = buildBatchInsert(batch)
      await client.query(sql, params)
      console.log(`  ... ${Math.min(i + BATCH_SIZE, candidates.length)}/${candidates.length}`)
    }
    await client.query(
      `INSERT INTO sync_metadata (source, is_official, synced_at, candidate_count, notes)
       VALUES ($1, true, now(), $2, $3)`,
      [TSE_ZIP_URL, candidates.length, 'Sincronizado via scripts/sync-tse'],
    )
    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL não configurada. Defina em .env.local (ver .env.example).')
    process.exitCode = 1
    return
  }

  console.log(`Baixando ${TSE_ZIP_URL} ...`)
  const zipBuffer = await downloadZip(TSE_ZIP_URL)

  console.log('Extraindo e normalizando candidatos...')
  const candidates = extractCandidates(zipBuffer)

  if (candidates.length === 0) {
    // Never overwrite good data with an empty/broken pull.
    console.error('Nenhum candidato elegível encontrado no arquivo baixado — abortando sem tocar no banco.')
    process.exitCode = 1
    return
  }

  console.log(`${candidates.length} candidaturas elegíveis encontradas. Gravando no banco...`)
  const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  try {
    await upsertCandidates(pool, candidates)
    console.log('Sincronização de candidatos concluída com sucesso.')

    if (process.argv.includes('--skip-photos')) {
      console.log('--skip-photos: pulando sincronização de fotos.')
      return
    }
    console.log('Sincronizando fotos (melhor esforço, CC-BY — ver docs/data-sources.md)...')
    const validCandidateIds = new Set(candidates.map((c) => c.id))
    const ufs = [...BRAZILIAN_STATES.map((s) => s.code), 'BR']
    const totalPhotos = await syncPhotos(pool, ufs, validCandidateIds)
    console.log(`Fotos sincronizadas: ${totalPhotos}.`)
  } finally {
    await pool.end()
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exitCode = 1
})
