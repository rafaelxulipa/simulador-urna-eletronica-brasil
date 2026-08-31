import { parse } from 'csv-parse/sync'
import { OFFICE_LABEL_TO_CODE, REQUIRED_COLUMNS } from './tseColumns'

export interface NormalizedCandidate {
  id: string
  ballotNumber: string
  ballotName: string
  fullName: string
  party: string
  partyNumber: string
  federation: string | null
  office: string
  state: string
  status: string
}

function decode(buffer: Buffer): string {
  // TSE historically used ISO-8859-1; recent cycles migrated some datasets to UTF-8.
  // Sniff for the UTF-8 BOM/valid-sequence and fall back to Latin-1 otherwise.
  const utf8 = buffer.toString('utf-8')
  if (!utf8.includes('�')) return utf8
  return buffer.toString('latin1')
}

export function parseCandidatesCsv(buffer: Buffer): NormalizedCandidate[] {
  const text = decode(buffer)
  const records: Record<string, string>[] = parse(text, {
    columns: true,
    delimiter: ';',
    skip_empty_lines: true,
    trim: true,
  })

  if (records.length === 0) return []

  const header = Object.keys(records[0])
  const missing = REQUIRED_COLUMNS.filter((col: string) => !header.includes(col))
  if (missing.length > 0) {
    throw new Error(
      `CSV do TSE não tem as colunas esperadas (schema pode ter mudado para 2026): ${missing.join(', ')}. ` +
        'Atualize scripts/sync-tse/tseColumns.ts após revisar o header real — ver docs/data-sources.md.',
    )
  }

  const out: NormalizedCandidate[] = []
  for (const row of records) {
    const officeCode = OFFICE_LABEL_TO_CODE[row.DS_CARGO?.toUpperCase()]
    if (!officeCode) continue // running mates, suplentes etc. — not separately numbered on the urna

    // DS_SITUACAO_CANDIDATURA is "#NE" (not yet adjudicated) for every row as of the
    // 2026-08-31 sync — the TSE hasn't published deferral decisions at this point in the
    // cycle. We can't filter on it yet without excluding every candidate; the raw value is
    // kept on the record so a future re-sync (closer to the election) can add a real filter
    // once DEFERIDO/INDEFERIDO values start appearing. See docs/data-sources.md.

    out.push({
      id: row.SQ_CANDIDATO,
      ballotNumber: row.NR_CANDIDATO,
      ballotName: row.NM_URNA_CANDIDATO,
      fullName: row.NM_CANDIDATO,
      party: row.NM_PARTIDO,
      partyNumber: row.NR_PARTIDO,
      // TSE uses the literal string "#NULO" as its own null marker in this field.
      federation: row.SG_FEDERACAO && row.SG_FEDERACAO !== '#NULO' ? row.SG_FEDERACAO : null,
      office: officeCode,
      state: row.SG_UF?.toUpperCase(),
      status: row.DS_SITUACAO_CANDIDATURA,
    })
  }
  return out
}
