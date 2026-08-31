import { Link } from 'react-router-dom'

const STEPS = [
  'Escolha seu estado',
  'Escolha como quer treinar',
  'Digite o número',
  'Confira seu voto',
  'Corrija ou confirme',
  'Continue até finalizar',
]

export function HowItWorksPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-6 px-4 py-10 text-center">
      <h1 className="text-3xl font-bold">Como funciona</h1>
      <ol className="flex w-full flex-col gap-3 text-left">
        {STEPS.map((step, i) => (
          <li key={step} className="flex items-center gap-3 rounded-lg bg-brand-surface px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-accent font-bold text-white">
              {i + 1}
            </span>
            <span className="text-lg">{step}</span>
          </li>
        ))}
      </ol>
      <Link
        to="/estado"
        className="flex min-h-14 items-center rounded-xl bg-brand-accent px-6 py-3 text-lg font-semibold text-white no-underline hover:brightness-110"
      >
        Começar simulação
      </Link>
    </div>
  )
}
