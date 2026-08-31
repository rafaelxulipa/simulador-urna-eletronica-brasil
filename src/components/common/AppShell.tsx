import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AccessibilityControls } from '../accessibility/AccessibilityControls'
import { VLibrasWidget } from '../accessibility/VLibrasWidget'
import { AudioControls } from '../audio/AudioControls'
import { MobileControlsDrawer } from './MobileControlsDrawer'
import { TermsConsentBar } from './TermsConsentBar'
import { useSessionStore } from '@/stores/sessionStore'
import { useConsentStore } from '@/stores/consentStore'
import { useVisitCounter } from '@/hooks/useVisitCounter'
import { MOBILE_ANY_ORIENTATION_QUERY, useMediaQuery } from '@/hooks/useMediaQuery'

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const reset = useSessionStore((s) => s.reset)
  const accepted = useConsentStore((s) => s.accepted)
  const visits = useVisitCounter()
  const isLanding = location.pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)
  // Width-only Tailwind breakpoints can't tell a landscape phone from a tablet
  // (it's short, not narrow) — this drives the compact/drawer header in both orientations.
  const isMobile = useMediaQuery(MOBILE_ANY_ORIENTATION_QUERY)

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
        <div className={`flex items-center justify-between gap-2 px-4 py-3 ${isMobile ? '' : 'flex-wrap gap-3'}`}>
          <div className={`flex min-w-0 items-center gap-2 ${isMobile ? '' : 'gap-3'}`}>
            {!isLanding && (
              <button
                type="button"
                onClick={goHome}
                aria-label="Voltar ao início"
                className={`min-h-11 shrink-0 rounded-lg border border-urna-text-secondary/40 text-sm font-semibold text-urna-text hover:bg-white/10 ${isMobile ? 'px-2.5' : 'px-3'}`}
              >
                <span aria-hidden="true">←</span> <span className={isMobile ? 'hidden' : ''}>Voltar ao início</span>
              </button>
            )}
            <Link to="/" className="truncate text-lg font-bold text-urna-text no-underline">
              Treine Seu Voto
            </Link>
          </div>
          {!isMobile && (
            <div className="flex flex-wrap items-center gap-3">
              <AccessibilityControls />
              <AudioControls />
            </div>
          )}
          {isMobile && (
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu de ajustes e informações"
              className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-urna-text-secondary/40 text-lg text-urna-text hover:bg-white/10"
            >
              ☰
            </button>
          )}
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
      {!isMobile && (
        <footer className="flex flex-wrap items-center justify-center gap-4 border-t border-urna-text-secondary/20 px-4 py-4 text-sm text-urna-text-secondary">
          <Link to="/fontes" className="underline">
            Fontes
          </Link>
          <Link to="/termos" className="underline">
            Termos de Uso
          </Link>
          <Link to="/privacidade" className="underline">
            Política de Privacidade
          </Link>
          {visits !== null && (
            <span aria-live="polite">
              {visits.toLocaleString('pt-BR')} {visits === 1 ? 'visita' : 'visitas'}
            </span>
          )}
        </footer>
      )}
      <MobileControlsDrawer open={menuOpen} onClose={() => setMenuOpen(false)} visits={visits} />
      <TermsConsentBar />
      <VLibrasWidget />
    </div>
  )
}
