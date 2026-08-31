import type { CandidateFilters, CandidateProvider } from '@/domain/election/types'
import type { DatasetMetadata } from '@/domain/election/metadata'

/** Talks to our own /api/* Vercel functions — never the TSE directly (see docs/architecture.md). */
export class ApiCandidateProvider implements CandidateProvider {
  async getStates() {
    const res = await fetch('/api/states')
    if (!res.ok) throw new Error(`Falha ao carregar estados: ${res.status}`)
    return res.json()
  }

  async getCandidates(filters: CandidateFilters) {
    const params = new URLSearchParams({ state: filters.state, office: filters.office })
    const res = await fetch(`/api/candidates?${params.toString()}`)
    if (!res.ok) throw new Error(`Falha ao carregar candidatos: ${res.status}`)
    return res.json()
  }

  async findByNumber(state: string, office: CandidateFilters['office'], ballotNumber: string) {
    const params = new URLSearchParams({ state, office, number: ballotNumber })
    const res = await fetch(`/api/candidates?${params.toString()}`)
    if (!res.ok) throw new Error(`Falha ao consultar número: ${res.status}`)
    const candidates = await res.json()
    return candidates[0] ?? null
  }

  async getMetadata(): Promise<DatasetMetadata> {
    const res = await fetch('/api/metadata')
    if (!res.ok) throw new Error(`Falha ao carregar metadata: ${res.status}`)
    return res.json()
  }
}
