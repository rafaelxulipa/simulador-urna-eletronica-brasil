import { useState } from 'react'
import type { ReactNode } from 'react'

export type UrnaKeyVariant = 'number' | 'blank' | 'correct' | 'confirm'

export interface UrnaKeyProps {
  label: ReactNode
  variant: UrnaKeyVariant
  disabled?: boolean
  onPress: () => void
  ariaLabel: string
  className?: string
  /** Fullscreen mobile-landscape has little vertical room to spare — a fixed small
      size instead of the sm: breakpoint escalation, which assumes width is what's tight. */
  compact?: boolean
}

const VARIANT_CLASSES: Record<UrnaKeyVariant, string> = {
  number: 'bg-urna-key text-urna-key-text hover:bg-urna-key-light',
  blank: 'bg-urna-blank text-urna-blank-text hover:brightness-95',
  correct: 'bg-urna-correct text-urna-correct-text hover:brightness-110',
  confirm: 'bg-urna-confirm text-urna-confirm-text hover:brightness-110',
}

/** A single physical key of the urna keyboard — mouse, touch, and keyboard all trigger onPress. */
export function UrnaKey({ label, variant, disabled, onPress, ariaLabel, className = '', compact = false }: UrnaKeyProps) {
  const [pressed, setPressed] = useState(false)
  const sizeClasses = compact
    ? 'min-h-12 min-w-12 rounded-lg px-1'
    : 'min-h-11 min-w-11 rounded-lg px-1 sm:min-h-16 sm:min-w-16 sm:rounded-xl sm:px-2'

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onPress}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className={`
        ${sizeClasses} font-bold
        transition-transform duration-75 ease-out
        shadow-key active:shadow-key-pressed
        disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none
        focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-brand-accent
        ${pressed && !disabled ? 'translate-y-[3px] shadow-key-pressed' : ''}
        ${VARIANT_CLASSES[variant]}
        ${className}
      `}
    >
      {label}
    </button>
  )
}
