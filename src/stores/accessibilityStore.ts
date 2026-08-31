import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FontScale = 'sm' | 'md' | 'lg'

interface AccessibilityState {
  fontScale: FontScale
  highContrast: boolean
  setFontScale: (scale: FontScale) => void
  increaseFontScale: () => void
  decreaseFontScale: () => void
  toggleHighContrast: () => void
}

const SCALE_ORDER: FontScale[] = ['sm', 'md', 'lg']

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set, get) => ({
      fontScale: 'md',
      highContrast: false,
      setFontScale: (scale) => set({ fontScale: scale }),
      increaseFontScale: () => {
        const index = SCALE_ORDER.indexOf(get().fontScale)
        set({ fontScale: SCALE_ORDER[Math.min(index + 1, SCALE_ORDER.length - 1)] })
      },
      decreaseFontScale: () => {
        const index = SCALE_ORDER.indexOf(get().fontScale)
        set({ fontScale: SCALE_ORDER[Math.max(index - 1, 0)] })
      },
      toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
    }),
    { name: 'treine-seu-voto:accessibility' },
  ),
)
