import { useCallback, useMemo } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Urna } from '@/components/urna/Urna'
import { RotateDeviceHint } from '@/components/common/RotateDeviceHint'
import { MOBILE_LANDSCAPE_QUERY, MOBILE_PORTRAIT_QUERY, useMediaQuery } from '@/hooks/useMediaQuery'
import { getCandidateProvider } from '@/services/candidateProvider'
import { useSessionStore } from '@/stores/sessionStore'
import type { ConfirmedVote } from '@/domain/voting/types'

const MODE_INSTRUCTIONS: Record<string, string> = {
  LEARN: 'Digite o número da candidata ou do candidato. Se errar, não se preocupe — você pode corrigir.',
  DEMO: 'Modo demonstração: experimente cada tecla para ver como ela funciona.',
}

export function VotingPage() {
  const navigate = useNavigate()
  const selectedState = useSessionStore((s) => s.selectedState)
  const mode = useSessionStore((s) => s.mode)
  const setFinishedVotes = useSessionStore((s) => s.setFinishedVotes)
  const reset = useSessionStore((s) => s.reset)
  const provider = useMemo(() => getCandidateProvider(), [])
  const isMobilePortrait = useMediaQuery(MOBILE_PORTRAIT_QUERY)
  const isMobileLandscape = useMediaQuery(MOBILE_LANDSCAPE_QUERY)

  const handleFinished = useCallback(
    (votes: ConfirmedVote[]) => {
      setFinishedVotes(votes)
      navigate('/concluido')
    },
    [navigate, setFinishedVotes],
  )

  if (!selectedState || !mode) return <Navigate to="/estado" replace />

  const instruction = mode in MODE_INSTRUCTIONS ? MODE_INSTRUCTIONS[mode] : undefined

  if (isMobileLandscape) {
    return (
      <div className="fixed inset-0 z-40 flex flex-col bg-brand-bg">
        {/* Own strip instead of floating over the urna — at this height the keyboard's
            top-right key (BRANCO) sits right under an absolutely-positioned corner button. */}
        <div className="flex shrink-0 justify-end p-1">
          <button
            type="button"
            onClick={() => {
              reset()
              navigate('/')
            }}
            aria-label="Sair e voltar ao início"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-surface text-lg text-urna-text hover:bg-white/10"
          >
            ✕
          </button>
        </div>
        <div className="min-h-0 flex-1">
          <Urna
            provider={provider}
            selectedState={selectedState}
            instruction={instruction}
            onFinished={handleFinished}
            layout="landscape"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-8">
      {isMobilePortrait && <RotateDeviceHint />}
      <Urna provider={provider} selectedState={selectedState} instruction={instruction} onFinished={handleFinished} />
    </div>
  )
}
