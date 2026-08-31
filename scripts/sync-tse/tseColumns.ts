/**
 * Column names verified against the real 2026 `consulta_cand_2026.zip`
 * header (fetched and inspected directly — see docs/data-sources.md,
 * section "Verificação real do schema 2026"). parseCandidatesCsv() fails
 * loudly if any of these are missing, rather than silently mis-mapping
 * columns on a future schema change.
 */
export const REQUIRED_COLUMNS = [
  'SQ_CANDIDATO',
  'SG_UF',
  'DS_CARGO',
  'NR_CANDIDATO',
  'NM_CANDIDATO',
  'NM_URNA_CANDIDATO',
  'SG_PARTIDO',
  'NM_PARTIDO',
  'NR_PARTIDO',
  'SG_FEDERACAO',
  'DS_SITUACAO_CANDIDATURA',
] as const

/** DS_CARGO values as published by the TSE, mapped to our BallotOfficeCode. Running-mate rows (vice/suplente) are intentionally absent — they aren't separately numbered on the urna. */
export const OFFICE_LABEL_TO_CODE: Record<string, string> = {
  'DEPUTADO FEDERAL': 'FEDERAL_DEPUTY',
  'DEPUTADO ESTADUAL': 'STATE_DEPUTY',
  'DEPUTADO DISTRITAL': 'STATE_DEPUTY',
  SENADOR: 'SENATOR',
  GOVERNADOR: 'GOVERNOR',
  PRESIDENTE: 'PRESIDENT',
}
