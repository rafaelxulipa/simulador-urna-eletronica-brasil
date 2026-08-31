import { useEffect, useState } from 'react'

const COUNTED_KEY = 'treine-seu-voto:visit-counted'

/**
 * Counts unique-ish visitors per browser, not per page load: a localStorage
 * flag makes sure this browser only ever increments the total once — no IP
 * address or any server-side per-visitor record is kept, keeping the
 * counter consistent with the "no personal data" promise in /privacidade.
 * Fails silently: a visit counter must never break the app.
 */
export function useVisitCounter(): number | null {
  const [visits, setVisits] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    let alreadyCounted = false
    try {
      alreadyCounted = window.localStorage.getItem(COUNTED_KEY) === '1'
    } catch {
      // localStorage unavailable (private mode, blocked) — just don't count, still show the total.
    }

    const request = alreadyCounted
      ? fetch('/api/visits')
      : fetch('/api/visits', { method: 'POST' }).then((res) => {
          if (res.ok) {
            try {
              window.localStorage.setItem(COUNTED_KEY, '1')
            } catch {
              // Ignore — worst case this browser gets counted again next time.
            }
          }
          return res
        })

    request
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { visits?: number } | null) => {
        if (!cancelled && data && typeof data.visits === 'number') setVisits(data.visits)
      })
      .catch(() => {
        // Ignore — see note above.
      })

    return () => {
      cancelled = true
    }
  }, [])

  return visits
}
