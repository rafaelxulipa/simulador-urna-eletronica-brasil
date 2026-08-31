import { describe, expect, it } from 'vitest'
import { electionSequence } from '@/domain/election/electionSequence'
import type { Candidate } from '@/domain/election/types'
import {
  applyVotingEvent,
  canConfirm,
  createInitialVotingState,
  isReadyForLookup,
} from '@/domain/voting/votingEngine'
import { CONFIRM_LOCK_MS } from '@/domain/voting/constants'
import type { VotingEngineState } from '@/domain/voting/types'

const NOW = 1_000_000

const candidate: Candidate = {
  id: 'c1',
  ballotNumber: '1234',
  ballotName: 'Fulana da Silva',
  party: 'PXX',
  office: 'FEDERAL_DEPUTY',
  state: 'PE',
}

function typeDigits(state: VotingEngineState, digits: string, now = NOW): VotingEngineState {
  return digits
    .split('')
    .reduce((acc, digit) => applyVotingEvent(acc, { type: 'DIGIT', digit, now }), state)
}

describe('voting engine', () => {
  it('starts on the first office in ENTER_NUMBER', () => {
    const state = createInitialVotingState(NOW)
    expect(state.office.code).toBe('FEDERAL_DEPUTY')
    expect(state.status).toBe('ENTER_NUMBER')
    expect(state.enteredDigits).toBe('')
  })

  it('accumulates digits up to the office digit length and no further', () => {
    let state = createInitialVotingState(NOW)
    state = typeDigits(state, '12345')
    expect(state.enteredDigits).toBe('1234')
    expect(isReadyForLookup(state)).toBe(true)
  })

  it('resolves a valid candidate and locks confirm for CONFIRM_LOCK_MS', () => {
    let state = createInitialVotingState(NOW)
    state = typeDigits(state, '1234')
    state = applyVotingEvent(state, { type: 'CANDIDATE_RESOLVED', candidate, now: NOW })
    expect(state.status).toBe('SHOW_CANDIDATE')
    expect(state.confirmLocked).toBe(true)
    expect(canConfirm(state)).toBe(false)

    state = applyVotingEvent(state, { type: 'TICK', now: NOW + CONFIRM_LOCK_MS - 1 })
    expect(canConfirm(state)).toBe(false)

    state = applyVotingEvent(state, { type: 'TICK', now: NOW + CONFIRM_LOCK_MS })
    expect(canConfirm(state)).toBe(true)
  })

  it('shows INVALID when no candidate is found for the number', () => {
    let state = createInitialVotingState(NOW)
    state = typeDigits(state, '9999')
    state = applyVotingEvent(state, { type: 'CANDIDATE_RESOLVED', candidate: null, now: NOW })
    expect(state.status).toBe('INVALID')
    expect(canConfirm(state)).toBe(false)
  })

  it('CORRIGE returns to ENTER_NUMBER and clears state from any non-finished status', () => {
    let state = createInitialVotingState(NOW)
    state = typeDigits(state, '1234')
    state = applyVotingEvent(state, { type: 'CANDIDATE_RESOLVED', candidate, now: NOW })
    state = applyVotingEvent(state, { type: 'CORRIGE', now: NOW })
    expect(state.status).toBe('ENTER_NUMBER')
    expect(state.enteredDigits).toBe('')
    expect(state.candidate).toBeNull()
  })

  it('BRANCO moves straight to BLANK with confirm locked, requiring an explicit CONFIRMA', () => {
    let state = createInitialVotingState(NOW)
    state = applyVotingEvent(state, { type: 'BRANCO', now: NOW })
    expect(state.status).toBe('BLANK')
    expect(canConfirm(state)).toBe(false)
    state = applyVotingEvent(state, { type: 'TICK', now: NOW + CONFIRM_LOCK_MS })
    expect(canConfirm(state)).toBe(true)
  })

  it('CONFIRMA on a valid candidate records the vote and advances to the next office', () => {
    let state = createInitialVotingState(NOW)
    state = typeDigits(state, '1234')
    state = applyVotingEvent(state, { type: 'CANDIDATE_RESOLVED', candidate, now: NOW })
    state = applyVotingEvent(state, { type: 'TICK', now: NOW + CONFIRM_LOCK_MS })
    state = applyVotingEvent(state, { type: 'CONFIRMA', now: NOW + CONFIRM_LOCK_MS })

    expect(state.confirmedVotes).toHaveLength(1)
    expect(state.confirmedVotes[0].kind).toBe('CANDIDATE')
    expect(state.confirmedVotes[0].candidate?.id).toBe('c1')
    expect(state.sequenceIndex).toBe(1)
    expect(state.office.code).toBe('STATE_DEPUTY')
    expect(state.status).toBe('ENTER_NUMBER')
  })

  it('CONFIRMA is a no-op while still entering digits or locked', () => {
    let state = createInitialVotingState(NOW)
    const beforeAnyInput = applyVotingEvent(state, { type: 'CONFIRMA', now: NOW })
    expect(beforeAnyInput).toBe(state)

    state = typeDigits(state, '1234')
    state = applyVotingEvent(state, { type: 'CANDIDATE_RESOLVED', candidate, now: NOW })
    const stillLocked = applyVotingEvent(state, { type: 'CONFIRMA', now: NOW })
    expect(stillLocked).toBe(state)
  })

  it('walks through the full election sequence and finishes', () => {
    let state = createInitialVotingState(NOW)
    for (let i = 0; i < electionSequence.length; i++) {
      state = applyVotingEvent(state, { type: 'BRANCO', now: NOW })
      state = applyVotingEvent(state, { type: 'TICK', now: NOW + CONFIRM_LOCK_MS })
      state = applyVotingEvent(state, { type: 'CONFIRMA', now: NOW + CONFIRM_LOCK_MS })
    }
    expect(state.status).toBe('FINISHED')
    expect(state.confirmedVotes).toHaveLength(electionSequence.length)
    expect(state.confirmedVotes.every((v) => v.kind === 'BLANK')).toBe(true)
  })

  it('rejects non-digit DIGIT events and digits beyond the office length', () => {
    let state = createInitialVotingState(NOW)
    const rejected = applyVotingEvent(state, { type: 'DIGIT', digit: 'a', now: NOW })
    expect(rejected).toBe(state)

    state = typeDigits(state, '1234')
    const overflow = applyVotingEvent(state, { type: 'DIGIT', digit: '9', now: NOW })
    expect(overflow).toBe(state)
  })
})
