import { electionSequence } from '@/domain/election/electionSequence'

export interface ProgressIndicatorProps {
  currentIndex: number
  /** Fullscreen mobile-landscape: smaller dots, labels dropped to save vertical space. */
  compact?: boolean
}

/**
 * Fixed top-of-screen progress bar. The 2026 urna redesign confirms a fixed
 * progress indicator exists (docs/urna-visual-reference.md) but not its
 * exact visual design, so this is an original interpretation that never
 * relies on color alone (check mark / filled dot / outline dot + text).
 */
export function ProgressIndicator({ currentIndex, compact = false }: ProgressIndicatorProps) {
  const total = electionSequence.length
  const office = electionSequence[currentIndex]

  return (
    <div className="w-full">
      {/* items-start (not items-center): a step whose label wraps to two lines must not
          push its circle out of line with the others — see user report, circle 2 was
          visibly offset because "Dep. Estadual" wraps while shorter labels don't. */}
      <ol className="flex items-start justify-between gap-1" aria-hidden="true">
        {electionSequence.map((step, index) => {
          const state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'pending'
          return (
            <li key={step.code} className="flex flex-1 flex-col items-center gap-1">
              <span
                className={`flex items-center justify-center rounded-full font-bold ${compact ? 'h-5 w-5 text-[10px]' : 'h-6 w-6 text-xs'} ${
                  state === 'done'
                    ? 'bg-urna-confirm text-urna-confirm-text'
                    : state === 'current'
                      ? 'bg-urna-glass-text text-urna-glass'
                      : 'border-2 border-urna-glass-text-secondary text-urna-glass-text-secondary'
                }`}
              >
                {state === 'done' ? '✓' : index + 1}
              </span>
              {!compact && (
                <span className="hidden text-center text-[10px] leading-tight text-urna-glass-text-secondary sm:block">
                  {step.shortLabel}
                </span>
              )}
            </li>
          )
        })}
      </ol>
      <p className="sr-only" aria-live="polite">
        Etapa {currentIndex + 1} de {total} — {office.label}
      </p>
    </div>
  )
}
