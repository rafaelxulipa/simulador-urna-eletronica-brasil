import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AccessibilityControls } from '../accessibility/AccessibilityControls'
import { AudioControls } from '../audio/AudioControls'
import { useSessionStore } from '@/stores/sessionStore'

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const reset = useSessionStore((s) => s.reset)
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
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-urna-text-secondary/20 px-4 py-3">
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
      </header>
      <main id="main-content" className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}
