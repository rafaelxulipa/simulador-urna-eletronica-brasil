import AdmZip from 'adm-zip'
import type { Pool } from 'pg'

// Confirmed via the TSE CKAN API (package_show for "candidatos-2026") — one
// ZIP per UF plus "BR" for national (presidential) candidacies. Not derived
// from the historical consulta_cand naming pattern (photos use a different
// path/scheme). See docs/data-sources.md.
const PHOTO_ZIP_URL = (uf: string) =>
  `https://cdn.tse.jus.br/estatistica/sead/eleicoes/eleicoes2026/fotos/foto_cand2026_${uf}_div.zip`

// Filenames look like "FPE170002534902_div.jpg" — F + UF + SQ_CANDIDATO + "_div.jpg".
const PHOTO_FILENAME_PATTERN = /^F[A-Z]{2}(\d+)_div\.jpg$/i

const PHOTO_BATCH_SIZE = 50

interface PhotoRow {
  candidateId: string
  bytes: Buffer
}

async function downloadPhotoZip(uf: string): Promise<Buffer | null> {
  try {
    const res = await fetch(PHOTO_ZIP_URL(uf))
    if (!res.ok) return null
    return Buffer.from(await res.arrayBuffer())
  } catch {
    return null
  }
}

function extractPhotos(zipBuffer: Buffer, validCandidateIds: Set<string>): PhotoRow[] {
  const zip = new AdmZip(zipBuffer)
  const rows: PhotoRow[] = []
  for (const entry of zip.getEntries()) {
    const match = PHOTO_FILENAME_PATTERN.exec(entry.entryName)
    if (!match) continue
    const candidateId = match[1]
    if (!validCandidateIds.has(candidateId)) continue // photo for a candidate we didn't ingest (filtered office, etc.)
    rows.push({ candidateId, bytes: entry.getData() })
  }
  return rows
}

async function upsertPhotos(pool: Pool, rows: PhotoRow[]) {
  for (let i = 0; i < rows.length; i += PHOTO_BATCH_SIZE) {
    const batch = rows.slice(i, i + PHOTO_BATCH_SIZE)
    const params: unknown[] = []
    const placeholders = batch.map((row, j) => {
      const base = j * 2
      params.push(row.candidateId, row.bytes)
      return `($${base + 1}, $${base + 2}, 'image/jpeg')`
    })
    await pool.query(
      `INSERT INTO candidate_photos (candidate_id, photo, content_type)
       VALUES ${placeholders.join(',')}
       ON CONFLICT (candidate_id) DO UPDATE SET photo = EXCLUDED.photo, content_type = EXCLUDED.content_type`,
      params,
    )
  }
}

/**
 * Downloads and stores candidate photos for every UF (+ "BR" for president).
 * Best-effort: a missing/failed UF zip is skipped and logged, never aborts
 * the whole run — photos are optional (see src/components/voting/CandidateAvatar.tsx
 * initials fallback), unlike the candidate data itself.
 */
export async function syncPhotos(pool: Pool, ufs: string[], validCandidateIds: Set<string>) {
  let totalStored = 0
  for (const uf of ufs) {
    const zipBuffer = await downloadPhotoZip(uf)
    if (!zipBuffer) {
      console.warn(`  fotos ${uf}: indisponível, pulando`)
      continue
    }
    const rows = extractPhotos(zipBuffer, validCandidateIds)
    if (rows.length === 0) continue
    await upsertPhotos(pool, rows)
    totalStored += rows.length
    console.log(`  fotos ${uf}: ${rows.length} armazenadas`)
  }
  return totalStored
}
