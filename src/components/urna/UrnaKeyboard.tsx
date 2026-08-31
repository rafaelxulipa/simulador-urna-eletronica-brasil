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

  return (
    <div className="flex justify-center gap-2 sm:gap-3" role="group" aria-label="Teclado da urna">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {NUMBER_ROWS.flat().map((digit) => (
          <UrnaKey
            key={digit}
            label={digit}
            variant="number"
            ariaLabel={`Tecla ${digit}`}
            disabled={digitsDisabled}
            onPress={() => onDigit(digit)}
            className="text-base sm:text-xl"
          />
        ))}
        <span aria-hidden="true" />
        <UrnaKey
          label="0"
          variant="number"
          ariaLabel="Tecla 0"
          disabled={digitsDisabled}
          onPress={() => onDigit('0')}
          className="text-base sm:text-xl"
        />
        <span aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-2 sm:gap-3">
        <UrnaKey
          label="BRANCO"
          variant="blank"
          ariaLabel="Branco"
          disabled={brancoDisabled}
          onPress={onBranco}
          className="min-w-16 whitespace-nowrap px-1.5 text-[10px] sm:min-w-24 sm:px-3 sm:text-sm"
        />
        <UrnaKey
          label="CORRIGE"
          variant="correct"
          ariaLabel="Corrige"
          disabled={corrigeDisabled}
          onPress={onCorrige}
          className="min-w-16 whitespace-nowrap px-1.5 text-[10px] sm:min-w-24 sm:px-3 sm:text-sm"
        />
        <UrnaKey
          label="CONFIRMA"
          variant="confirm"
          ariaLabel="Confirma"
          disabled={confirmDisabled}
          onPress={onConfirma}
          className="min-w-16 whitespace-nowrap px-1.5 text-[10px] sm:min-w-24 sm:px-3 sm:text-sm"
        />
      </div>
    </div>
  )
}
