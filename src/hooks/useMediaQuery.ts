import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false))

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = () => setMatches(mql.matches)
    handler()
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

// Phone-sized viewport, portrait — show the "rotate your phone" hint.
export const MOBILE_PORTRAIT_QUERY = '(max-width: 768px) and (orientation: portrait)'
// Phone-sized viewport, landscape (short height rules out tablets/desktops in landscape) — full-screen urna layout.
export const MOBILE_LANDSCAPE_QUERY = '(max-height: 560px) and (orientation: landscape)'
// Phone-sized viewport in either orientation — a phone rotated to landscape is still a phone (short,
// not narrow), so this can't be a single Tailwind width breakpoint. Drives the compact/drawer header.
export const MOBILE_ANY_ORIENTATION_QUERY = `${MOBILE_PORTRAIT_QUERY}, ${MOBILE_LANDSCAPE_QUERY}`
