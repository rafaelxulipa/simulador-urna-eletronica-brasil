import { useEffect } from 'react'
import { useAccessibilityStore } from '@/stores/accessibilityStore'

/** Mirrors the accessibility store onto <html> data-* attributes that src/index.css keys off of. */
export function useApplyAccessibilityPreferences() {
  const fontScale = useAccessibilityStore((s) => s.fontScale)
  const highContrast = useAccessibilityStore((s) => s.highContrast)

  useEffect(() => {
    document.documentElement.setAttribute('data-font-scale', fontScale)
  }, [fontScale])

  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', highContrast ? 'high' : 'normal')
  }, [highContrast])
}
