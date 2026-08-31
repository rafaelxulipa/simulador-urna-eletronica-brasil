import type { VotingEngineState } from '@/domain/voting/types'
import { CandidateAvatar } from '../voting/CandidateAvatar'
import { ProgressIndicator } from './ProgressIndicator'

export interface UrnaDisplayProps {
  state: VotingEngineState
  instruction?: string
  /** Fullscreen mobile-landscape has little vertical room — tighter paddings/text/slots. */
  compact?: boolean
}

function DigitSlots({ digits, length, compact }: { digits: string; length: number; compact: boolean }) {
  return (
    <div className={`flex justify-center ${compact ? 'gap-1' : 'gap-2'}`} aria-hidden="true">
      {Array.from({ length }).map((_, i) => (
        <span
          key={i}
          className={`flex items-center justify-center rounded border-2 border-urna-glass-text-secondary font-bold text-urna-glass-text ${
            compact ? 'h-7 w-6 text-base' : 'h-12 w-9 text-2xl sm:h-14 sm:w-11'
          }`}
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
export function UrnaDisplay({ state, instruction, compact = false }: UrnaDisplayProps) {
  const { office, enteredDigits, status, candidate, confirmLocked, sequenceIndex } = state
  const gapClass = compact ? 'gap-1.5' : 'gap-4'
  const headlineClass = compact ? 'text-base' : 'text-2xl'

  return (
    <div className={`flex flex-1 flex-col ${gapClass} bg-urna-glass text-urna-glass-text ${compact ? 'p-2' : 'p-4 sm:p-6'}`}>
      <ProgressIndicator currentIndex={sequenceIndex} compact={compact} />

      <p
        className={`text-center font-semibold uppercase tracking-wide text-urna-glass-text-secondary ${compact ? 'text-[10px]' : 'text-sm'}`}
      >
        {office.label}
      </p>

      <div aria-live="polite" className={`flex flex-1 flex-col justify-center ${gapClass}`}>
        {status === 'ENTER_NUMBER' && (
          <div className={`flex flex-col items-center ${gapClass} text-center`}>
            <p className={compact ? 'text-xs' : 'text-lg'}>
              {instruction ?? 'Digite o número da candidata ou do candidato.'}
            </p>
            <DigitSlots digits={enteredDigits} length={office.digits} compact={compact} />
          </div>
        )}

        {status === 'SHOW_CANDIDATE' && candidate && (
          <div className={`flex flex-col ${compact ? 'gap-1.5' : 'gap-3'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1 text-left">
                <p>
                  Número: <span className={`font-bold ${compact ? 'text-sm' : 'text-xl'}`}>{candidate.ballotNumber}</span>
                </p>
                <p>
                  Nome: <span className="font-semibold">{candidate.ballotName}</span>
                </p>
                <p className="text-urna-glass-text-secondary">Partido: {candidate.party}</p>
              </div>
              <CandidateAvatar candidate={candidate} compact={compact} />
            </div>
            <hr className="border-urna-glass-text-secondary/40" />
            <p className={`text-center font-bold ${compact ? 'text-sm' : 'text-xl'}`}>CONFIRA SEU VOTO</p>
            <p className="text-center text-sm">
              {confirmLocked
                ? 'Aguarde um instante...'
                : 'Aperte CONFIRMA (verde) para votar, ou CORRIGE (laranja) para digitar de novo.'}
            </p>
          </div>
        )}

        {status === 'INVALID' && (
          <div className={`flex flex-col items-center ${compact ? 'gap-1.5' : 'gap-3'} text-center`}>
            <p className={`font-bold text-urna-correct ${headlineClass}`}>NÚMERO NÃO ENCONTRADO</p>
            <p>Confira os números digitados.</p>
            <p className="text-urna-glass-text-secondary">Aperte CORRIGE (laranja) para tentar novamente.</p>
          </div>
        )}

        {status === 'BLANK' && (
          <div className={`flex flex-col items-center ${compact ? 'gap-1.5' : 'gap-3'} text-center`}>
            <p className={`font-bold ${headlineClass}`}>VOTO EM BRANCO</p>
            <p className="text-sm">
              {confirmLocked
                ? 'Aguarde um instante...'
                : 'Aperte CONFIRMA (verde) para confirmar, ou CORRIGE (laranja) para digitar um número.'}
            </p>
          </div>
        )}

        {status === 'FINISHED' && <p className={`text-center font-bold ${headlineClass}`}>Votação concluída.</p>}
      </div>
    </div>
  )
}
