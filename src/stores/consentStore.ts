import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ConsentState {
  accepted: boolean
  accept: () => void
}

/** Persisted locally only (localStorage) — never sent anywhere, see /privacidade. */
export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      accepted: false,
      accept: () => set({ accepted: true }),
    }),
    { name: 'treine-seu-voto:consent' },
  ),
)
