import { useCallback, useEffect, useReducer, useRef } from 'react'
import type { CandidateProvider } from '@/domain/election/types'
import { applyVotingEvent, canConfirm, canCorrect, createInitialVotingState, isReadyForLookup } from '@/domain/voting/votingEngine'
import type { VotingEngineState, VotingEvent } from '@/domain/voting/types'
import { audioService } from '@/services/audio/audioService'
import { voiceScript } from '@/services/audio/voiceScript'

function reducer(state: VotingEngineState, event: VotingEvent): VotingEngineState {
  return applyVotingEvent(state, event)
}

export function useVotingSession(provider: CandidateProvider, selectedState: string) {
  const [state, dispatch] = useReducer(reducer, undefined, () => createInitialVotingState(Date.now()))
  const lookupTokenRef = useRef(0)
  const prevConfirmedCountRef = useRef(0)
  const prevStatusRef = useRef(state.status)

  // Run the async candidate lookup once digit entry reaches the office's ballot length.
  useEffect(() => {
    if (!isReadyForLookup(state)) return
    const token = ++lookupTokenRef.current
    const { office, enteredDigits } = state
    provider
      .findByNumber(selectedState, office.ballotOfficeCode, enteredDigits)
      .then((candidate) => {
        if (token !== lookupTokenRef.current) return // a newer lookup superseded this one
        dispatch({ type: 'CANDIDATE_RESOLVED', candidate, now: Date.now() })
      })
      .catch(() => {
        if (token !== lookupTokenRef.current) return
        dispatch({ type: 'CANDIDATE_RESOLVED', candidate: null, now: Date.now() })
      })
  }, [state, provider, selectedState])

  // Tick the CONFIRMA unlock timer while it's locked.
  useEffect(() => {
    if (!state.confirmLocked) return
    const id = window.setInterval(() => dispatch({ type: 'TICK', now: Date.now() }), 80)
    return () => window.clearInterval(id)
  }, [state.confirmLocked])

  // Audio feedback for the two "vote just landed" moments: confirmation and finish.
  useEffect(() => {
    if (state.confirmedVotes.length > prevConfirmedCountRef.current) {
      const lastVote = state.confirmedVotes[state.confirmedVotes.length - 1]
      audioService.play('CONFIRM')
      audioService.speak(
        lastVote.kind === 'BLANK'
          ? voiceScript.blankConfirmed()
          : lastVote.kind === 'NULL'
            ? voiceScript.nullConfirmed()
            : voiceScript.confirmed(),
      )

      if (state.status === 'FINISHED') {
        window.setTimeout(() => {
          audioService.play('FINISH')
          audioService.speak(voiceScript.finished())
        }, 500)
      } else {
        window.setTimeout(() => {
          audioService.play('NEXT_OFFICE')
          audioService.speak(voiceScript.office(state.office))
        }, 500)
      }
    }
    prevConfirmedCountRef.current = state.confirmedVotes.length
  }, [state.confirmedVotes, state.status, state.office])

  useEffect(() => {
    if (state.status === 'INVALID' && prevStatusRef.current !== 'INVALID') {
      audioService.play('ERROR')
      audioService.speak(voiceScript.invalidNumber())
    }
    if (state.status === 'SHOW_CANDIDATE' && state.candidate && prevStatusRef.current !== 'SHOW_CANDIDATE') {
      audioService.speak(voiceScript.candidateFound(state.candidate))
    }
    if (state.status === 'BLANK' && prevStatusRef.current !== 'BLANK') {
      audioService.play('BLANK')
      audioService.speak(voiceScript.blank())
    }
    prevStatusRef.current = state.status
  }, [state.status, state.candidate])

  const pressDigit = useCallback((digit: string) => {
    audioService.play('KEY_PRESS')
    dispatch({ type: 'DIGIT', digit, now: Date.now() })
  }, [])

  const pressCorrige = useCallback(() => {
    if (!canCorrect(state)) return
    audioService.play('CORRECT')
    audioService.speak(voiceScript.corrected())
    dispatch({ type: 'CORRIGE', now: Date.now() })
  }, [state])

  const pressBranco = useCallback(() => {
    dispatch({ type: 'BRANCO', now: Date.now() })
  }, [])

  const pressConfirma = useCallback(() => {
    if (!canConfirm(state)) return
    dispatch({ type: 'CONFIRMA', now: Date.now() })
  }, [state])

  return { state, pressDigit, pressCorrige, pressBranco, pressConfirma }
}
