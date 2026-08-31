import { useAudioStore } from '@/stores/audioStore'

export type AudioEventType = 'KEY_PRESS' | 'ERROR' | 'CORRECT' | 'CONFIRM' | 'BLANK' | 'NEXT_OFFICE' | 'FINISH'

interface Tone {
  frequency: number
  durationMs: number
  type?: OscillatorType
  delayMs?: number
}

/** A rapid series of short pulses — used for CONFIRM's trill (see note below). */
function trill(count: number, totalMs: number, startFreq: number, endFreq: number, pulseMs: number): Tone[] {
  const spacing = totalMs / count
  return Array.from({ length: count }, (_, i) => ({
    frequency: startFreq + ((endFreq - startFreq) * i) / Math.max(1, count - 1),
    durationMs: pulseMs,
    type: 'square' as OscillatorType,
    delayMs: i * spacing,
  }))
}

/**
 * Every sound here is original (synthesized oscillator tones), never a
 * reused TSE audio asset — see docs/audio.md for why. KEY_PRESS and CONFIRM's
 * timing/register (~20ms clicks around 2.3kHz; a ~700ms high-register event)
 * are tuned from an acoustic analysis (duration + zero-crossing frequency
 * estimate only) of a user-supplied reference clip — no audio content from
 * that file was extracted, copied, or embedded, only the numbers above.
 * Silently no-ops if Web Audio / Speech Synthesis are unavailable or
 * blocked, per the autoplay fail-safe rule.
 */
const EVENT_TONES: Record<AudioEventType, Tone[]> = {
  KEY_PRESS: [{ frequency: 2300, durationMs: 20, type: 'square' }],
  ERROR: [
    { frequency: 220, durationMs: 140, type: 'sawtooth' },
    { frequency: 165, durationMs: 180, type: 'sawtooth', delayMs: 150 },
  ],
  CORRECT: [{ frequency: 480, durationMs: 90, type: 'triangle' }],
  CONFIRM: trill(8, 700, 2100, 2500, 35),
  BLANK: [{ frequency: 340, durationMs: 110, type: 'sine' }],
  NEXT_OFFICE: [{ frequency: 392, durationMs: 70, type: 'sine' }],
  FINISH: [
    { frequency: 523, durationMs: 100, type: 'sine' },
    { frequency: 659, durationMs: 100, type: 'sine', delayMs: 110 },
    { frequency: 784, durationMs: 220, type: 'sine', delayMs: 220 },
  ],
}

class AudioService {
  private ctx: AudioContext | null = null
  private initialized = false

  /** Must be called from within a user-gesture event handler (click/keydown). */
  init() {
    if (this.initialized) return
    this.initialized = true
    try {
      const Ctx = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (Ctx) this.ctx = new Ctx()
    } catch {
      this.ctx = null
    }
  }

  play(event: AudioEventType) {
    const { soundEnabled, volume } = useAudioStore.getState()
    if (!soundEnabled || !this.ctx) return
    try {
      if (this.ctx.state === 'suspended') void this.ctx.resume()
      for (const tone of EVENT_TONES[event]) {
        this.playTone(tone, volume)
      }
    } catch {
      // Fail silently — audio must never break the voting flow.
    }
  }

  private playTone({ frequency, durationMs, type = 'sine', delayMs = 0 }: Tone, volume: number) {
    if (!this.ctx) return
    const ctx = this.ctx
    const startAt = ctx.currentTime + delayMs / 1000
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, startAt)
    gain.gain.setValueAtTime(0, startAt)
    gain.gain.linearRampToValueAtTime(volume * 0.3, startAt + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + durationMs / 1000)
    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.start(startAt)
    oscillator.stop(startAt + durationMs / 1000 + 0.02)
  }

  /**
   * Original PT-BR narration, never labeled as "the official urna voice" —
   * see docs/audio.md. `force` bypasses the ambient voice toggle — for a
   * dedicated "listen" button, the click itself is the opt-in.
   */
  speak(text: string, options?: { force?: boolean }) {
    const { voiceEnabled, volume } = useAudioStore.getState()
    if (!voiceEnabled && !options?.force) return
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'pt-BR'
      utterance.volume = volume
      utterance.rate = 0.95
      window.speechSynthesis.speak(utterance)
    } catch {
      // Fail silently.
    }
  }

  stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }
}

export const audioService = new AudioService()
