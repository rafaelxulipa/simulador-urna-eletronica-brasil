import { useAccessibilityStore } from '@/stores/accessibilityStore'

/** Font-size (A-/A/A+) and high-contrast controls — persisted to localStorage. */
export function AccessibilityControls() {
  const fontScale = useAccessibilityStore((s) => s.fontScale)
  const highContrast = useAccessibilityStore((s) => s.highContrast)
  const decreaseFontScale = useAccessibilityStore((s) => s.decreaseFontScale)
  const increaseFontScale = useAccessibilityStore((s) => s.increaseFontScale)
  const toggleHighContrast = useAccessibilityStore((s) => s.toggleHighContrast)

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Ajustes de acessibilidade">
      <div className="flex items-center overflow-hidden rounded-lg border border-urna-text-secondary/40">
        <button
          type="button"
          onClick={decreaseFontScale}
          disabled={fontScale === 'sm'}
          aria-label="Diminuir tamanho da fonte"
          className="min-h-11 min-w-11 px-3 text-sm font-bold hover:bg-white/10 disabled:opacity-40"
        >
          A-
        </button>
        <button
          type="button"
          disabled
          aria-hidden="true"
          className="min-h-11 min-w-11 border-x border-urna-text-secondary/40 px-3 text-base font-bold"
        >
          A
        </button>
        <button
          type="button"
          onClick={increaseFontScale}
          disabled={fontScale === 'lg'}
          aria-label="Aumentar tamanho da fonte"
          className="min-h-11 min-w-11 px-3 text-lg font-bold hover:bg-white/10 disabled:opacity-40"
        >
          A+
        </button>
      </div>
      <button
        type="button"
        onClick={toggleHighContrast}
        aria-pressed={highContrast}
        className="min-h-11 rounded-lg border border-urna-text-secondary/40 px-3 text-sm font-semibold hover:bg-white/10"
      >
        {highContrast ? 'Contraste alto: ligado' : 'Contraste alto'}
      </button>
    </div>
  )
}
