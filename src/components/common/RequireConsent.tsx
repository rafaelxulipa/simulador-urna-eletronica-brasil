import { Navigate, Outlet } from 'react-router-dom'
import { useConsentStore } from '@/stores/consentStore'

/** Blocks the simulator's protected routes until the terms have been accepted. */
export function RequireConsent() {
  const accepted = useConsentStore((s) => s.accepted)
  if (!accepted) return <Navigate to="/" replace />
  return <Outlet />
}
