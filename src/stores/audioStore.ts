import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AudioState {
  soundEnabled: boolean
  voiceEnabled: boolean
  volume: number // 0..1
  toggleSound: () => void
  toggleVoice: () => void
  setVolume: (volume: number) => void
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      voiceEnabled: true,
      volume: 0.6,
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleVoice: () => set((s) => ({ voiceEnabled: !s.voiceEnabled })),
      setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)) }),
    }),
    { name: 'treine-seu-voto:audio' },
  ),
)
