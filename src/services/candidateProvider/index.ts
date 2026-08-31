import type { CandidateProvider } from '@/domain/election/types'
import { SeedCandidateProvider } from './seedCandidateProvider'
import { ApiCandidateProvider } from './apiCandidateProvider'

let cached: CandidateProvider | null = null

/**
 * Defaults to the seed (fictional) provider until a real database is
 * synced — set VITE_CANDIDATE_SOURCE=api once scripts/sync-tse has
 * populated Postgres with official TSE data. See docs/data-sources.md.
 */
export function getCandidateProvider(): CandidateProvider {
  if (cached) return cached
  cached = import.meta.env.VITE_CANDIDATE_SOURCE === 'api' ? new ApiCandidateProvider() : new SeedCandidateProvider()
  return cached
}

export type { CandidateProvider }
