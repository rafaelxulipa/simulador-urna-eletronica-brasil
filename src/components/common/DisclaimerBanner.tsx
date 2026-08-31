import { audioService } from '@/services/audio/audioService'

const DISCLAIMER_TEXT =
  'Atenção. Este é um simulador educativo independente, feito para treinar. ' +
  'Não é o site oficial do Tribunal Superior Eleitoral, nem da Justiça Eleitoral. ' +
  'Aqui você só está praticando — nenhum voto de verdade é registrado.'

export interface DisclaimerBannerProps {
  compact?: boolean
  /** Shows a "🔊 Ouvir" button that reads the disclaimer aloud — for anyone who can't read it. */
  listenable?: boolean
}

export function DisclaimerBanner({ compact = false, listenable = false }: DisclaimerBannerProps) {
  return (
    <div
      role="note"
      className={`mx-auto max-w-2xl rounded-lg border-2 border-urna-correct/60 bg-brand-surface text-center text-urna-text ${
        compact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-base'
      }`}
    >
      <p className={compact ? '' : 'text-lg font-bold'}>
        <span aria-hidden="true" className="motion-safe:animate-pulse">
          ⚠️{' '}
        </span>
        Este é um <strong>simulador não oficial</strong>, feito só para treinar.
        <span aria-hidden="true" className="motion-safe:animate-pulse">
          {' '}⚠️
        </span>
      </p>
      <p className={compact ? '' : 'mt-1'}>
        Não é o site do Tribunal Superior Eleitoral (TSE) nem da Justiça Eleitoral. Nenhum voto de verdade é
        registrado aqui.
      </p>
      {!compact && (
        <p className="mt-1 text-sm text-urna-text-secondary">
          Os dados de candidatas e candidatos são obtidos de fontes públicas oficiais quando disponíveis e podem
          sofrer atualizações. Veja{' '}
          <a href="/fontes" className="underline">
            nossas fontes
          </a>
          .
        </p>
      )}
      {listenable && (
        <button
          type="button"
          onClick={() => {
            audioService.init()
            audioService.speak(DISCLAIMER_TEXT, { force: true })
          }}
          className="mt-3 min-h-11 rounded-lg border border-urna-text-secondary/40 px-4 text-sm font-semibold hover:bg-white/10"
        >
          🔊 Ouvir este aviso
        </button>
      )}
    </div>
  )
}
