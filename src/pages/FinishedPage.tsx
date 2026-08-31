import { Navigate, useNavigate } from 'react-router-dom'
import { useSessionStore } from '@/stores/sessionStore'

export function FinishedPage() {
  const navigate = useNavigate()
  const finishedVotes = useSessionStore((s) => s.finishedVotes)
  const reset = useSessionStore((s) => s.reset)
  const setMode = useSessionStore((s) => s.setMode)
  const mode = useSessionStore((s) => s.mode)
  const selectedState = useSessionStore((s) => s.selectedState)

  if (!finishedVotes) return <Navigate to="/" replace />

  function trainAgain() {
    if (mode) setMode(mode)
    navigate('/votar')
  }

  function backToStart() {
    reset()
    navigate('/')
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-6 px-4 py-10 text-center">
      <h1 className="text-3xl font-bold">Simulação concluída!</h1>
      <p className="text-lg text-urna-text-secondary">
        Você terminou o treinamento. Agora você já conhece o processo de votação na urna eletrônica.
      </p>

      <ul className="flex w-full flex-col gap-2 text-left">
        {finishedVotes.map((vote) => (
          <li key={vote.office.code} className="flex items-center gap-2 rounded-lg bg-brand-surface px-4 py-2">
            <span className="text-urna-confirm" aria-hidden="true">
              ✓
            </span>
            <span>{vote.office.label}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={trainAgain}
          className="min-h-14 rounded-xl bg-brand-accent px-6 py-3 text-lg font-semibold text-white hover:brightness-110"
        >
          Treinar novamente
        </button>
        <button
          type="button"
          onClick={backToStart}
          className="min-h-14 rounded-xl border border-urna-text-secondary/40 px-6 py-3 text-lg font-semibold hover:bg-white/10"
        >
          Voltar ao início
        </button>
      </div>

      {selectedState && <p className="text-xs text-urna-text-secondary">Treino realizado para: {selectedState}</p>}
    </div>
  )
}
