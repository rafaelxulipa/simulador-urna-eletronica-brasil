import { Navigate, useNavigate } from 'react-router-dom'
import { useSessionStore } from '@/stores/sessionStore'
import type { TrainingMode } from '@/stores/sessionStore'

const MODES: { mode: TrainingMode; title: string; description: string }[] = [
  {
    mode: 'LEARN',
    title: 'Modo Aprender',
    description: 'A interface explica cada etapa enquanto você vota.',
  },
  {
    mode: 'SIMULATE',
    title: 'Modo Simulação',
    description: 'Sem explicações extras — treine como se fosse o dia da votação.',
  },
  {
    mode: 'DEMO',
    title: 'Ver como funciona',
    description: 'Acompanhe uma demonstração guiada, sem precisar digitar nada.',
  },
]

export function ModeSelectPage() {
  const navigate = useNavigate()
  const selectedState = useSessionStore((s) => s.selectedState)
  const setMode = useSessionStore((s) => s.setMode)

  if (!selectedState) return <Navigate to="/estado" replace />

  function choose(mode: TrainingMode) {
    setMode(mode)
    navigate('/votar')
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-6 px-4 py-10">
      <h1 className="text-center text-3xl font-bold">Como você quer treinar?</h1>
      <div className="flex w-full flex-col gap-4">
        {MODES.map((m) => (
          <button
            key={m.mode}
            type="button"
            onClick={() => choose(m.mode)}
            className="rounded-xl bg-brand-surface p-5 text-left hover:bg-urna-body-light focus-visible:outline focus-visible:outline-4 focus-visible:outline-brand-accent"
          >
            <p className="text-xl font-bold">{m.title}</p>
            <p className="mt-1 text-urna-text-secondary">{m.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
