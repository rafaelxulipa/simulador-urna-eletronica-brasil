import { useEffect } from 'react'
import { UrnaKey } from './UrnaKey'

export interface UrnaKeyboardProps {
  onDigit: (digit: string) => void
  onBranco: () => void
  onCorrige: () => void
  onConfirma: () => void
  digitsDisabled: boolean
  brancoDisabled: boolean
  corrigeDisabled: boolean
  confirmDisabled: boolean
  /** Fullscreen mobile-landscape: fixed small keys instead of the sm: escalation. */
  compact?: boolean
}

const NUMBER_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
]

/**
 * Phone-style 3x3 numeric grid with 0 alone in the row below, and
 * BRANCO/CORRIGE/CONFIRMA as a vertical column to the right — matching real
 * UE2022 reference photos (not merged into the numeric grid's bottom row,
 * as an earlier version had it). See docs/urna-visual-reference.md.
 * Supports mouse, touch, and physical keyboard (0-9, Backspace, Enter).
 */
export function UrnaKeyboard({
  onDigit,
  onBranco,
  onCorrige,
  onConfirma,
  digitsDisabled,
  brancoDisabled,
  corrigeDisabled,
  confirmDisabled,
  compact = false,
}: UrnaKeyboardProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (/^[0-9]$/.test(e.key) && !digitsDisabled) {
        onDigit(e.key)
      } else if (e.key === 'Backspace' && !corrigeDisabled) {
        e.preventDefault()
        onCorrige()
      } else if (e.key === 'Enter' && !confirmDisabled) {
        onConfirma()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [digitsDisabled, corrigeDisabled, confirmDisabled, onDigit, onCorrige, onConfirma])

  const numberTextClass = compact ? 'text-sm' : 'text-base sm:text-xl'
  const sideKeyClass = compact
    ? 'min-w-12 whitespace-nowrap px-1 text-[9px]'
    : 'min-w-16 whitespace-nowrap px-1.5 text-[10px] sm:min-w-24 sm:px-3 sm:text-sm'
  const gapClass = compact ? 'gap-1' : 'gap-2 sm:gap-3'

  return (
    <div className={`flex justify-center ${gapClass}`} role="group" aria-label="Teclado da urna">
      <div className={`grid grid-cols-3 ${gapClass}`}>
        {NUMBER_ROWS.flat().map((digit) => (
          <UrnaKey
            key={digit}
            label={digit}
            variant="number"
            ariaLabel={`Tecla ${digit}`}
            disabled={digitsDisabled}
            onPress={() => onDigit(digit)}
            className={numberTextClass}
            compact={compact}
          />
        ))}
        <span aria-hidden="true" />
        <UrnaKey
          label="0"
          variant="number"
          ariaLabel="Tecla 0"
          disabled={digitsDisabled}
          onPress={() => onDigit('0')}
          className={numberTextClass}
          compact={compact}
        />
        <span aria-hidden="true" />
      </div>
      <div className={`flex flex-col ${gapClass}`}>
        <UrnaKey
          label="BRANCO"
          variant="blank"
          ariaLabel="Branco"
          disabled={brancoDisabled}
          onPress={onBranco}
          className={sideKeyClass}
          compact={compact}
        />
        <UrnaKey
          label="CORRIGE"
          variant="correct"
          ariaLabel="Corrige"
          disabled={corrigeDisabled}
          onPress={onCorrige}
          className={sideKeyClass}
          compact={compact}
        />
        <UrnaKey
          label="CONFIRMA"
          variant="confirm"
          ariaLabel="Confirma"
          disabled={confirmDisabled}
          onPress={onConfirma}
          className={sideKeyClass}
          compact={compact}
        />
      </div>
    </div>
  )
}
