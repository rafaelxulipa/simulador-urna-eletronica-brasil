export function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div
      role="note"
      className={`mx-auto max-w-2xl rounded-lg border border-urna-text-secondary/30 bg-brand-surface text-center text-urna-text-secondary ${
        compact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'
      }`}
    >
      <p>
        Este é um <strong>simulador educativo independente</strong>. Não é uma aplicação oficial do Tribunal
        Superior Eleitoral (TSE) nem da Justiça Eleitoral.
      </p>
      {!compact && (
        <p className="mt-1">
          Os dados de candidatas e candidatos são obtidos de fontes públicas oficiais quando disponíveis e podem
          sofrer atualizações. Veja{' '}
          <a href="/fontes" className="underline">
            nossas fontes
          </a>
          .
        </p>
      )}
    </div>
  )
}
