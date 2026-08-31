import type { DatasetMetadata } from './metadata'

export type OfficeCode =
  | 'FEDERAL_DEPUTY'
  | 'STATE_DEPUTY'
  | 'SENATOR_FIRST'
  | 'SENATOR_SECOND'
  | 'GOVERNOR'
  | 'PRESIDENT'

/**
 * The candidate pool for both Senator steps is the same ballot (Senador),
 * so lookups for SENATOR_FIRST/SENATOR_SECOND must query candidates under
 * this shared code rather than the step-specific one.
 */
export type BallotOfficeCode = 'FEDERAL_DEPUTY' | 'STATE_DEPUTY' | 'SENATOR' | 'GOVERNOR' | 'PRESIDENT'

export interface OfficeConfig {
  code: OfficeCode
  ballotOfficeCode: BallotOfficeCode
  digits: number
  label: string
  shortLabel: string
}

export interface StateInfo {
  code: string
  name: string
}

export interface Candidate {
  id: string
  ballotNumber: string
  ballotName: string
  fullName?: string
  party: string
  partyNumber?: string
  federation?: string
  office: BallotOfficeCode
  state: string
  photoUrl?: string
  status?: string
}

export interface CandidateFilters {
  state: string
  office: BallotOfficeCode
}

export interface CandidateProvider {
  getStates(): Promise<StateInfo[]>
  getCandidates(filters: CandidateFilters): Promise<Candidate[]>
  findByNumber(state: string, office: BallotOfficeCode, ballotNumber: string): Promise<Candidate | null>
  getMetadata(): Promise<DatasetMetadata>
}
