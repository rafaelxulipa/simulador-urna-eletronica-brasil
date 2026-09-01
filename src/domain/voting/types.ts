import type { Candidate, OfficeConfig } from '../election/types'

export type VotingStatus =
  | 'ENTER_NUMBER'
  | 'SHOW_CANDIDATE'
  | 'INVALID'
  | 'BLANK'
  | 'FINISHED'

export interface ConfirmedVote {
  office: OfficeConfig
  kind: 'CANDIDATE' | 'BLANK' | 'NULL'
  candidate?: Candidate
}

export interface VotingEngineState {
  sequenceIndex: number
  office: OfficeConfig
  enteredDigits: string
  status: VotingStatus
  candidate: Candidate | null
  /** true while CONFIRMA must stay disabled after a candidate/blank is shown */
  confirmLocked: boolean
  /** epoch ms when confirmLocked should flip to false; null when not locked */
  confirmUnlocksAt: number | null
  confirmedVotes: ConfirmedVote[]
}

export type VotingEvent =
  | { type: 'DIGIT'; digit: string; now: number }
  | { type: 'CORRIGE'; now: number }
  | { type: 'BRANCO'; now: number }
  | { type: 'CONFIRMA'; now: number }
  | { type: 'CANDIDATE_RESOLVED'; candidate: Candidate | null; now: number }
  | { type: 'TICK'; now: number }
