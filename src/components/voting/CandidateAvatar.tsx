import { useState } from 'react'
import type { Candidate } from '@/domain/election/types'

function initials(name: string): string {
  const parts = name
    .replace(/\([^)]*\)/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Photo when available; a stable initials fallback otherwise — image failures never break layout. */
export function CandidateAvatar({ candidate }: { candidate: Candidate }) {
  const [imageFailed, setImageFailed] = useState(false)
  const showPhoto = candidate.photoUrl && !imageFailed

  if (showPhoto) {
    return (
      <img
        src={candidate.photoUrl}
        alt={`Foto de ${candidate.ballotName}`}
        className="h-20 w-20 shrink-0 rounded-lg object-cover"
        onError={() => setImageFailed(true)}
      />
    )
  }

  return (
    <div
      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-urna-case-shadow text-2xl font-bold text-urna-glass-text"
      role="img"
      aria-label={`Sem foto disponível para ${candidate.ballotName}`}
    >
      {initials(candidate.ballotName)}
    </div>
  )
}
