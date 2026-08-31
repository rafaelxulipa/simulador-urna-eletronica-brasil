import { useAudioStore } from '@/stores/audioStore'
import { audioService } from '@/services/audio/audioService'

/** Sound/voice/volume controls. The first tap here also unlocks audio (browser autoplay policy). */
export function AudioControls() {
  const soundEnabled = useAudioStore((s) => s.soundEnabled)
  const voiceEnabled = useAudioStore((s) => s.voiceEnabled)
  const volume = useAudioStore((s) => s.volume)
  const toggleSound = useAudioStore((s) => s.toggleSound)
  const toggleVoice = useAudioStore((s) => s.toggleVoice)
  const setVolume = useAudioStore((s) => s.setVolume)

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Ajustes de som e voz">
      <button
        type="button"
        onClick={() => {
          audioService.init()
          toggleSound()
        }}
        aria-pressed={soundEnabled}
        className="min-h-11 rounded-lg border border-urna-text-secondary/40 px-3 text-sm font-semibold hover:bg-white/10"
      >
        {soundEnabled ? '🔊 Som: ligado' : '🔇 Som: desligado'}
      </button>
      <button
        type="button"
        onClick={() => {
          audioService.init()
          if (voiceEnabled) audioService.stopSpeaking()
          toggleVoice()
        }}
        aria-pressed={voiceEnabled}
        className="min-h-11 rounded-lg border border-urna-text-secondary/40 px-3 text-sm font-semibold hover:bg-white/10"
      >
        {voiceEnabled ? '🗣️ Voz: ligada' : '🔈 Voz: desligada'}
      </button>
      <label className="flex items-center gap-2 text-sm">
        Volume
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Volume"
          className="accent-brand-accent"
        />
      </label>
    </div>
  )
}
