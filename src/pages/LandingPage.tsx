import { Link } from 'react-router-dom'
import { DisclaimerBanner } from '@/components/common/DisclaimerBanner'
import { UrnaHeroPreview } from '@/features/landing/UrnaHeroPreview'

export function LandingPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-8 px-4 py-10 text-center">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-4xl font-extrabold text-urna-text sm:text-5xl">Treine Seu Voto</h1>
        <p className="max-w-md text-lg text-urna-text-secondary">
          Aprenda a usar a urna eletrônica com tranquilidade.
        </p>
      </div>

      <UrnaHeroPreview />

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link
          to="/estado"
          className="flex min-h-14 items-center rounded-xl bg-brand-accent px-6 py-3 text-lg font-semibold text-white no-underline hover:brightness-110"
        >
          Começar simulação
        </Link>
        <Link
          to="/como-funciona"
          className="flex min-h-14 items-center rounded-xl border border-urna-text-secondary/40 px-6 py-3 text-lg font-semibold text-urna-text no-underline hover:bg-white/10"
        >
          Como funciona?
        </Link>
      </div>

      <DisclaimerBanner compact />
    </div>
  )
}
