import { useEffect, useState } from 'react'
import { DisclaimerBanner } from '@/components/common/DisclaimerBanner'
import { getCandidateProvider } from '@/services/candidateProvider'
import type { DatasetMetadata } from '@/domain/election/metadata'

export function SourcesPage() {
  const [metadata, setMetadata] = useState<DatasetMetadata | null>(null)

  useEffect(() => {
    getCandidateProvider().getMetadata().then(setMetadata).catch(() => setMetadata(null))
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Fontes e metodologia</h1>

      <DisclaimerBanner />

      <section className="flex flex-col gap-2 rounded-lg bg-brand-surface p-4">
        <h2 className="text-xl font-bold">Dados dos candidatos</h2>
        {metadata ? (
          <>
            <p>
              <strong>Fonte:</strong> {metadata.source}
            </p>
            <p>
              <strong>Dado oficial:</strong> {metadata.isOfficialData ? 'Sim' : 'Não — dado de exemplo'}
            </p>
            <p>
              <strong>Sincronizado em:</strong>{' '}
              {metadata.isOfficialData ? new Date(metadata.syncedAt).toLocaleDateString('pt-BR') : 'Não aplicável (dados de exemplo, nunca sincronizados com o TSE)'}
            </p>
            {metadata.notes && <p className="text-sm text-urna-text-secondary">{metadata.notes}</p>}
          </>
        ) : (
          <p className="text-urna-text-secondary">Carregando metadados...</p>
        )}
      </section>

      <section className="flex flex-col gap-2 rounded-lg bg-brand-surface p-4">
        <h2 className="text-xl font-bold">Fontes oficiais consultadas</h2>
        <ul className="list-inside list-disc text-urna-text-secondary">
          <li>Tribunal Superior Eleitoral (TSE) — tse.jus.br</li>
          <li>Portal de Dados Abertos do TSE — dadosabertos.tse.jus.br</li>
          <li>Justiça Eleitoral — justicaeleitoral.jus.br</li>
        </ul>
        <p className="text-sm text-urna-text-secondary">
          O detalhamento completo da pesquisa, com URLs, datas de consulta e decisões tomadas, está documentado no
          repositório do projeto em <code>docs/research.md</code>, <code>docs/data-sources.md</code>,{' '}
          <code>docs/urna-visual-reference.md</code>, <code>docs/audio.md</code> e <code>docs/accessibility.md</code>.
        </p>
      </section>

      <section className="flex flex-col gap-2 rounded-lg bg-brand-surface p-4">
        <h2 className="text-xl font-bold">Sobre o projeto</h2>
        <p className="text-urna-text-secondary">
          Treine Seu Voto é um projeto de código aberto, sem fins lucrativos, sem coleta de dados pessoais e
          politicamente neutro. Não recomenda, favorece ou avalia nenhum candidato.
        </p>
      </section>
    </div>
  )
}
