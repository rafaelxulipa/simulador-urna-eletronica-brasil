import { BRAZILIAN_STATES } from '@/data/states'
import { generateSeedCandidates } from '@/data/seedCandidates'
import type { CandidateFilters, CandidateProvider } from '@/domain/election/types'
import type { DatasetMetadata } from '@/domain/election/metadata'

/** In-memory provider serving fictional example candidates. See docs/data-sources.md. */
export class SeedCandidateProvider implements CandidateProvider {
  async getStates() {
    return BRAZILIAN_STATES
  }

  async getCandidates(filters: CandidateFilters) {
    return generateSeedCandidates(filters.state).filter((c) => c.office === filters.office)
  }

  async findByNumber(state: string, office: CandidateFilters['office'], ballotNumber: string) {
    const candidates = generateSeedCandidates(state)
    return candidates.find((c) => c.office === office && c.ballotNumber === ballotNumber) ?? null
  }

  async getMetadata(): Promise<DatasetMetadata> {
    return {
      source: 'Dados de exemplo (não oficiais) — gerados localmente',
      isOfficialData: false,
      syncedAt: new Date(0).toISOString(),
      candidateCount: BRAZILIAN_STATES.length * generateSeedCandidates('XX').length,
      notes:
        'Candidatos fictícios para demonstração. Os dados reais do TSE não puderam ser baixados ' +
        'deste ambiente (bloqueio de rede) — ver docs/data-sources.md. Configure VITE_CANDIDATE_SOURCE=api ' +
        'com um banco sincronizado via scripts/sync-tse para usar dados oficiais.',
    }
  }
}
