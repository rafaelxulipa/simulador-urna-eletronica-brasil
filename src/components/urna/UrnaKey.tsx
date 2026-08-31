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
}

const VARIANT_CLASSES: Record<UrnaKeyVariant, string> = {
  number: 'bg-urna-key text-urna-key-text hover:bg-urna-key-light',
  blank: 'bg-urna-blank text-urna-blank-text hover:brightness-95',
  correct: 'bg-urna-correct text-urna-correct-text hover:brightness-110',
  confirm: 'bg-urna-confirm text-urna-confirm-text hover:brightness-110',
}

/** A single physical key of the urna keyboard — mouse, touch, and keyboard all trigger onPress. */
export function UrnaKey({ label, variant, disabled, onPress, ariaLabel, className = '' }: UrnaKeyProps) {
  const [pressed, setPressed] = useState(false)

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
        min-h-16 min-w-16 rounded-xl px-2 font-bold
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
