import { electionSequence, officeAt } from '../election/electionSequence'
import { CONFIRM_LOCK_MS } from './constants'
import type { VotingEngineState, VotingEvent } from './types'

export function createInitialVotingState(_now: number): VotingEngineState {
  const office = officeAt(0)
  if (!office) {
    throw new Error('electionSequence está vazia')
  }
  return {
    sequenceIndex: 0,
    office,
    enteredDigits: '',
    status: 'ENTER_NUMBER',
    candidate: null,
    confirmLocked: false,
    confirmUnlocksAt: null,
    confirmedVotes: [],
  }
}

/** Digits currently entered have reached the office's ballot length and a lookup should run. */
export function isReadyForLookup(state: VotingEngineState): boolean {
  return state.status === 'ENTER_NUMBER' && state.enteredDigits.length === state.office.digits
}

export function canConfirm(state: VotingEngineState): boolean {
  return (state.status === 'SHOW_CANDIDATE' || state.status === 'BLANK') && !state.confirmLocked
}

export function canCorrect(state: VotingEngineState): boolean {
  return state.status !== 'FINISHED'
}

function withUnlockTimer(state: VotingEngineState, now: number): VotingEngineState {
  return { ...state, confirmLocked: true, confirmUnlocksAt: now + CONFIRM_LOCK_MS }
}

function advanceToNextOffice(state: VotingEngineState): VotingEngineState {
  const nextIndex = state.sequenceIndex + 1
  const nextOffice = officeAt(nextIndex)
  if (!nextOffice) {
    return {
      ...state,
      status: 'FINISHED',
      enteredDigits: '',
      candidate: null,
      confirmLocked: false,
      confirmUnlocksAt: null,
    }
  }
  return {
    ...state,
    sequenceIndex: nextIndex,
    office: nextOffice,
    status: 'ENTER_NUMBER',
    enteredDigits: '',
    candidate: null,
    confirmLocked: false,
    confirmUnlocksAt: null,
  }
}

export function applyVotingEvent(state: VotingEngineState, event: VotingEvent): VotingEngineState {
  switch (event.type) {
    case 'DIGIT': {
      if (state.status !== 'ENTER_NUMBER') return state
      if (state.enteredDigits.length >= state.office.digits) return state
      if (!/^[0-9]$/.test(event.digit)) return state
      return { ...state, enteredDigits: state.enteredDigits + event.digit }
    }

    case 'CORRIGE': {
      if (!canCorrect(state)) return state
      return {
        ...state,
        status: 'ENTER_NUMBER',
        enteredDigits: '',
        candidate: null,
        confirmLocked: false,
        confirmUnlocksAt: null,
      }
    }

    case 'BRANCO': {
      if (state.status !== 'ENTER_NUMBER') return state
      return withUnlockTimer({ ...state, status: 'BLANK', enteredDigits: '', candidate: null }, event.now)
    }

    case 'CANDIDATE_RESOLVED': {
      if (!isReadyForLookup(state)) return state
      if (!event.candidate) {
        return { ...state, status: 'INVALID', candidate: null }
      }
      return withUnlockTimer({ ...state, status: 'SHOW_CANDIDATE', candidate: event.candidate }, event.now)
    }

    case 'TICK': {
      if (state.confirmUnlocksAt !== null && event.now >= state.confirmUnlocksAt) {
        return { ...state, confirmLocked: false }
      }
      return state
    }

    case 'CONFIRMA': {
      if (!canConfirm(state)) return state
      const vote =
        state.status === 'BLANK'
          ? { office: state.office, kind: 'BLANK' as const }
          : { office: state.office, kind: 'CANDIDATE' as const, candidate: state.candidate ?? undefined }
      const confirmed = { ...state, confirmedVotes: [...state.confirmedVotes, vote] }
      return advanceToNextOffice(confirmed)
    }

    default:
      return state
  }
}

export { electionSequence, officeAt }
