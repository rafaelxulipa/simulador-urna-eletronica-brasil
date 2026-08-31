import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-brand-accent text-white hover:brightness-110',
  secondary: 'bg-brand-surface text-urna-text border border-urna-text-secondary/40 hover:bg-urna-body-light',
  ghost: 'bg-transparent text-urna-text hover:bg-white/10',
}

/** Large, high-contrast touch target by default — this product is built for elderly, first-time users. */
export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`
        min-h-14 rounded-xl px-6 py-3 text-lg font-semibold
        transition-colors
        focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-brand-accent
        disabled:cursor-not-allowed disabled:opacity-50
        ${VARIANT_CLASSES[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
