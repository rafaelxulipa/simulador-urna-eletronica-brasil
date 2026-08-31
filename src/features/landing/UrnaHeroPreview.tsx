import { createInitialVotingState } from '@/domain/voting/votingEngine'
import { UrnaDisplay } from '@/components/urna/UrnaDisplay'
import { UrnaKeyboard } from '@/components/urna/UrnaKeyboard'
import { UrnaPhysicalShell } from '@/components/urna/UrnaPhysicalShell'

const heroState = createInitialVotingState(Date.now())

/** A decorative, non-interactive urna built from the real components — not a photo. */
export function UrnaHeroPreview() {
  return (
    <div aria-hidden="true">
      <UrnaPhysicalShell
        screen={<UrnaDisplay state={heroState} />}
        keyboard={
          <UrnaKeyboard
            onDigit={() => {}}
            onBranco={() => {}}
            onCorrige={() => {}}
            onConfirma={() => {}}
            digitsDisabled
            brancoDisabled
            corrigeDisabled
            confirmDisabled
          />
        }
      />
    </div>
  )
}
