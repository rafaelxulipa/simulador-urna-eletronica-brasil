import { create } from 'zustand'
import type { ConfirmedVote } from '@/domain/voting/types'

export type TrainingMode = 'LEARN' | 'SIMULATE' | 'DEMO'

interface SessionState {
  selectedState: string | null
  mode: TrainingMode | null
  finishedVotes: ConfirmedVote[] | null
  setState: (state: string) => void
  setMode: (mode: TrainingMode) => void
  setFinishedVotes: (votes: ConfirmedVote[]) => void
  reset: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  selectedState: null,
  mode: null,
  finishedVotes: null,
  setState: (state) => set({ selectedState: state }),
  setMode: (mode) => set({ mode }),
  setFinishedVotes: (votes) => set({ finishedVotes: votes }),
  reset: () => set({ selectedState: null, mode: null, finishedVotes: null }),
}))
