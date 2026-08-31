import { useState } from 'react'

/**
 * Shown only on phone-sized portrait viewports. Never hard-blocks — some
 * users have a mounted/fixed device and can't rotate it, so there's always
 * a "continue anyway" escape hatch (accessibility requirement, not optional).
 */
export function RotateDeviceHint() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div
      role="dialog"
      aria-label="Sugestão para girar o celular"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-brand-bg px-6 text-center"
    >
      <div className="text-6xl motion-safe:animate-spin" style={{ animationDuration: '2.5s' }} aria-hidden="true">
        📱
      </div>
      <p className="max-w-xs text-xl font-bold text-urna-text">Gire seu celular</p>
      <p className="max-w-xs text-urna-text-secondary">
        Deixe a tela na posição horizontal para ver a urna em tamanho maior, como na urna de verdade.
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="min-h-11 rounded-lg border border-urna-text-secondary/40 px-4 text-sm font-semibold text-urna-text hover:bg-white/10"
      >
        Continuar assim mesmo
      </button>
    </div>
  )
}
