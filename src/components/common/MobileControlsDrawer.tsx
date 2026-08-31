import { useEffect, useId, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AccessibilityControls } from '../accessibility/AccessibilityControls'
import { AudioControls } from '../audio/AudioControls'

export interface MobileControlsDrawerProps {
  open: boolean
  onClose: () => void
  visits: number | null
}

/**
 * Mobile-only slide-down panel bundling accessibility/audio controls and the
 * footer links. Keeps that chrome out of the header/footer on small screens
 * so the urna gets the screen instead of being pushed down by it.
 */
export function MobileControlsDrawer({ open, onClose, visits }: MobileControlsDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    panelRef.current?.querySelector<HTMLElement>('button, a')?.focus()
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Fechar menu" onClick={onClose} className="absolute inset-0 bg-black/50" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-x-0 top-0 max-h-[85vh] overflow-y-auto rounded-b-2xl bg-brand-surface p-4 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id={titleId} className="text-base font-bold text-urna-text">
            Ajustes e informações
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-urna-text-secondary/40 text-lg text-urna-text hover:bg-white/10"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <AccessibilityControls />
          <AudioControls />
          <div className="flex flex-col gap-3 border-t border-urna-text-secondary/20 pt-4 text-sm text-urna-text-secondary">
            <Link to="/fontes" className="underline" onClick={onClose}>
              Fontes
            </Link>
            <Link to="/termos" className="underline" onClick={onClose}>
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="underline" onClick={onClose}>
              Política de Privacidade
            </Link>
            {visits !== null && (
              <span aria-live="polite">
                {visits.toLocaleString('pt-BR')} {visits === 1 ? 'visita' : 'visitas'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
