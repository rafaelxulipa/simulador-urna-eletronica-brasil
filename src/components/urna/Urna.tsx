import { useEffect, useRef } from 'react'
import type { CandidateProvider } from '@/domain/election/types'
import type { ConfirmedVote } from '@/domain/voting/types'
import { canConfirm, canCorrect } from '@/domain/voting/votingEngine'
import { useVotingSession } from '@/hooks/useVotingSession'
import { UrnaDisplay } from './UrnaDisplay'
import { UrnaKeyboard } from './UrnaKeyboard'
import { UrnaPhysicalShell } from './UrnaPhysicalShell'

export interface UrnaProps {
  provider: CandidateProvider
  selectedState: string
  instruction?: string
  onFinished: (votes: ConfirmedVote[]) => void
  layout?: 'portrait' | 'landscape'
}

/** Wires the voting engine + keyboard + screen together. No voting logic lives here. */
export function Urna({ provider, selectedState, instruction, onFinished, layout }: UrnaProps) {
  const { state, pressDigit, pressCorrige, pressBranco, pressConfirma } = useVotingSession(provider, selectedState)
  const finishedRef = useRef(false)

  useEffect(() => {
    if (state.status === 'FINISHED' && !finishedRef.current) {
      finishedRef.current = true
      onFinished(state.confirmedVotes)
    }
  }, [state.status, state.confirmedVotes, onFinished])

  const digitsDisabled = state.status !== 'ENTER_NUMBER' || state.enteredDigits.length >= state.office.digits
  const brancoDisabled = state.status !== 'ENTER_NUMBER'
  // Fullscreen mobile-landscape has little vertical room to spare (see UrnaKey/UrnaDisplay compact props).
  const compact = layout === 'landscape'

  return (
    <UrnaPhysicalShell
      layout={layout}
      screen={<UrnaDisplay state={state} instruction={instruction} compact={compact} />}
      keyboard={
        <UrnaKeyboard
          onDigit={pressDigit}
          onBranco={pressBranco}
          onCorrige={pressCorrige}
          onConfirma={pressConfirma}
          digitsDisabled={digitsDisabled}
          brancoDisabled={brancoDisabled}
          corrigeDisabled={!canCorrect(state)}
          confirmDisabled={!canConfirm(state)}
          compact={compact}
        />
      }
    />
  )
}
