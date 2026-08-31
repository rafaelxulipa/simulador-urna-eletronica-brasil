import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AccessibilityControls } from '../accessibility/AccessibilityControls'
import { VLibrasWidget } from '../accessibility/VLibrasWidget'
import { AudioControls } from '../audio/AudioControls'
import { TermsConsentBar } from './TermsConsentBar'
import { useSessionStore } from '@/stores/sessionStore'
import { useConsentStore } from '@/stores/consentStore'

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const reset = useSessionStore((s) => s.reset)
  const accepted = useConsentStore((s) => s.accepted)
  const isLanding = location.pathname === '/'

  function goHome() {
    reset()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-brand-accent focus:px-3 focus:py-2 focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <header className="border-b border-urna-text-secondary/20">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            {!isLanding && (
              <button
                type="button"
                onClick={goHome}
                className="min-h-11 rounded-lg border border-urna-text-secondary/40 px-3 text-sm font-semibold text-urna-text hover:bg-white/10"
              >
                ← Voltar ao início
              </button>
            )}
            <Link to="/" className="text-lg font-bold text-urna-text no-underline">
              Treine Seu Voto
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <AccessibilityControls />
            <AudioControls />
          </div>
        </div>
        {/* Permanent reminder on every page, not just once on landing — see docs/ux-flow.md. */}
        <p className="bg-urna-correct/15 px-4 py-1.5 text-center text-xs font-semibold text-urna-correct">
          <span aria-hidden="true" className="motion-safe:animate-pulse">
            ⚠️{' '}
          </span>
          Simulação não oficial — não é o site do TSE. Nenhum voto de verdade é registrado aqui.
          <span aria-hidden="true" className="motion-safe:animate-pulse">
            {' '}⚠️
          </span>
        </p>
      </header>
      <main id="main-content" className={`flex flex-1 flex-col ${accepted ? '' : 'pb-32 sm:pb-24'}`}>
        <Outlet />
      </main>
      <footer className="flex flex-wrap justify-center gap-4 border-t border-urna-text-secondary/20 px-4 py-4 text-sm text-urna-text-secondary">
        <Link to="/fontes" className="underline">
          Fontes
        </Link>
        <Link to="/termos" className="underline">
          Termos de Uso
        </Link>
        <Link to="/privacidade" className="underline">
          Política de Privacidade
        </Link>
      </footer>
      <TermsConsentBar />
      <VLibrasWidget />
    </div>
  )
}
