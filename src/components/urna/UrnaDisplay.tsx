import type { VotingEngineState } from '@/domain/voting/types'
import { CandidateAvatar } from '../voting/CandidateAvatar'
import { ProgressIndicator } from './ProgressIndicator'

export interface UrnaDisplayProps {
  state: VotingEngineState
  instruction?: string
}

function DigitSlots({ digits, length }: { digits: string; length: number }) {
  return (
    <div className="flex justify-center gap-2" aria-hidden="true">
      {Array.from({ length }).map((_, i) => (
        <span
          key={i}
          className="flex h-12 w-9 items-center justify-center rounded border-2 border-urna-glass-text-secondary text-2xl font-bold text-urna-glass-text sm:h-14 sm:w-11"
        >
          {digits[i] ?? ''}
        </span>
      ))}
    </div>
  )
}

/**
 * The urna screen — display-only, receives the current voting engine state
 * and renders it. All voting logic lives in src/domain/voting, never here.
 * Light gray background with near-black text, matching real UE2022 photos.
 * The candidate-review layout (Número/Nome/Partido rows + photo, divider,
 * "CONFIRA SEU VOTO") follows real device screenshots, not a guess — see
 * docs/urna-visual-reference.md.
 */
export function UrnaDisplay({ state, instruction }: UrnaDisplayProps) {
  const { office, enteredDigits, status, candidate, confirmLocked, sequenceIndex } = state

  return (
    <div className="flex flex-1 flex-col gap-4 bg-urna-glass p-4 text-urna-glass-text sm:p-6">
      <ProgressIndicator currentIndex={sequenceIndex} />

      <p className="text-center text-sm font-semibold uppercase tracking-wide text-urna-glass-text-secondary">
        {office.label}
      </p>

      <div aria-live="polite" className="flex flex-1 flex-col justify-center gap-4">
        {status === 'ENTER_NUMBER' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-lg">{instruction ?? 'Digite o número da candidata ou do candidato.'}</p>
            <DigitSlots digits={enteredDigits} length={office.digits} />
          </div>
        )}

        {status === 'SHOW_CANDIDATE' && candidate && (
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1 text-left">
                <p>
                  Número: <span className="text-xl font-bold">{candidate.ballotNumber}</span>
                </p>
                <p>
                  Nome: <span className="font-semibold">{candidate.ballotName}</span>
                </p>
                <p className="text-urna-glass-text-secondary">Partido: {candidate.party}</p>
              </div>
              <CandidateAvatar candidate={candidate} />
            </div>
            <hr className="border-urna-glass-text-secondary/40" />
            <p className="text-center text-xl font-bold">CONFIRA SEU VOTO</p>
            <p className="text-center text-sm">
              {confirmLocked
                ? 'Aguarde um instante...'
                : 'Aperte CONFIRMA (verde) para votar, ou CORRIGE (laranja) para digitar de novo.'}
            </p>
          </div>
        )}

        {status === 'INVALID' && (
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-2xl font-bold text-urna-correct">NÚMERO NÃO ENCONTRADO</p>
            <p>Confira os números digitados.</p>
            <p className="text-urna-glass-text-secondary">Aperte CORRIGE (laranja) para tentar novamente.</p>
          </div>
        )}

        {status === 'BLANK' && (
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-2xl font-bold">VOTO EM BRANCO</p>
            <p className="text-sm">
              {confirmLocked
                ? 'Aguarde um instante...'
                : 'Aperte CONFIRMA (verde) para confirmar, ou CORRIGE (laranja) para digitar um número.'}
            </p>
          </div>
        )}

        {status === 'FINISHED' && <p className="text-center text-2xl font-bold">Votação concluída.</p>}
      </div>
    </div>
  )
}
