import type { ReactNode } from 'react'

export interface UrnaPhysicalShellProps {
  screen: ReactNode
  keyboard: ReactNode
  /** 'landscape' fills a mobile-landscape viewport (screen + keyboard side by side). Default 'portrait'. */
  layout?: 'portrait' | 'landscape'
}

/**
 * The cabinet: gives the digital urna its physical presence (body, screen
 * bezel, keyboard deck, depth via shadows). White/light-gray plastic and
 * proportions modeled on real UE2022 reference photos, not the earlier
 * dark/blue guess — see docs/urna-visual-reference.md. No voting logic here.
 */
export function UrnaPhysicalShell({ screen, keyboard, layout = 'portrait' }: UrnaPhysicalShellProps) {
  if (layout === 'landscape') {
    return (
      <div className="flex h-full w-full items-stretch gap-3 bg-urna-case p-3">
        <div className="flex flex-1 rounded-md border-2 border-urna-glass-bezel bg-urna-glass-bezel p-1">
          <div className="flex flex-1 flex-col overflow-hidden rounded-sm bg-urna-glass">{screen}</div>
        </div>
        <div className="flex items-center rounded-xl bg-urna-case-shadow/40 p-3">{keyboard}</div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl bg-urna-case p-2 shadow-2xl ring-1 ring-black/10 sm:p-4">
        <div className="rounded-md border-2 border-urna-glass-bezel bg-urna-glass-bezel p-1">
          {/* min-h keeps the screen's real-device presence even on short states (digit entry);
              no fixed aspect-ratio, so taller states (candidate review) never get clipped. flex-col
              + a flex-1 child (see UrnaDisplay) makes the screen's own background fill any leftover
              space instead of exposing the bezel underneath it. */}
          <div className="flex min-h-[22rem] flex-col overflow-hidden rounded-sm bg-urna-glass">{screen}</div>
        </div>

        <div className="mt-2 rounded-xl bg-urna-case-shadow/40 p-2 sm:mt-4 sm:p-4">{keyboard}</div>
      </div>

      <div className="mx-auto h-3 w-2/3 rounded-b-xl bg-urna-case-shadow" aria-hidden="true" />
    </div>
  )
}
