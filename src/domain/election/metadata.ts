export interface DatasetMetadata {
  source: string
  isOfficialData: boolean
  syncedAt: string
  candidateCount: number
  notes?: string
}
