import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BRAZILIAN_STATES } from '@/data/states'
import { useSessionStore } from '@/stores/sessionStore'

export function StateSelectPage() {
  const navigate = useNavigate()
  const setState = useSessionStore((s) => s.setState)
  const [query, setQuery] = useState('')

  const filtered = BRAZILIAN_STATES.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) || s.code.toLowerCase().includes(query.toLowerCase()),
  )

  function choose(code: string) {
    setState(code)
    navigate('/modo')
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-6 px-4 py-10">
      <h1 className="text-center text-3xl font-bold">Onde você vai votar?</h1>

      <label className="w-full max-w-sm">
        <span className="sr-only">Buscar estado</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar estado..."
          className="min-h-12 w-full rounded-lg border border-urna-text-secondary/40 bg-brand-surface px-4 text-lg text-urna-text placeholder:text-urna-text-secondary"
        />
      </label>

      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {filtered.map((state) => (
          <button
            key={state.code}
            type="button"
            onClick={() => choose(state.code)}
            className="flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl bg-brand-surface p-3 text-center hover:bg-urna-body-light focus-visible:outline focus-visible:outline-4 focus-visible:outline-brand-accent"
          >
            <span className="text-2xl font-extrabold">{state.code}</span>
            <span className="text-xs text-urna-text-secondary">{state.name}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-urna-text-secondary">Nenhum estado encontrado.</p>
        )}
      </div>
    </div>
  )
}
