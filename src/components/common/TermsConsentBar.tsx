import { Link } from 'react-router-dom'
import { useConsentStore } from '@/stores/consentStore'

/**
 * Fixed bottom cookie-banner-style consent gate that blocks the simulator
 * until accepted. Once accepted, this renders nothing — the permanent
 * "this is a simulation" reminder lives in the header instead (see
 * AppShell.tsx), not as a second fixed bar (that overlapped the footer).
 */
export function TermsConsentBar() {
  const accepted = useConsentStore((s) => s.accepted)
  const accept = useConsentStore((s) => s.accept)

  if (accepted) return null

  return (
    <div
      role="dialog"
      aria-label="Aceite dos termos"
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-urna-correct/60 bg-brand-surface px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
        <p className="flex-1 text-sm text-urna-text">
          <span aria-hidden="true" className="motion-safe:animate-pulse">
            ⚠️{' '}
          </span>
          Este é um <strong>simulador não oficial</strong>, feito só para treinar — não tem vínculo com o TSE. Para
          usar, você precisa ler e aceitar nossos{' '}
          <Link to="/termos" className="underline">
            Termos de Uso
          </Link>{' '}
          e nossa{' '}
          <Link to="/privacidade" className="underline">
            Política de Privacidade
          </Link>
          .{' '}
          <span aria-hidden="true" className="motion-safe:animate-pulse">
            {' '}⚠️
          </span>
        </p>
        <button
          type="button"
          onClick={accept}
          className="min-h-12 shrink-0 rounded-xl bg-urna-confirm px-6 text-base font-bold text-urna-confirm-text hover:brightness-110"
        >
          Li e aceito
        </button>
      </div>
    </div>
  )
}
