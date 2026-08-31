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

/**
 * Photo when available; a stable initials fallback otherwise — image failures
 * never break layout. h-28 w-20 matches the TSE photo's fixed 161×225 aspect
 * ratio (confirmed across sampled candidates), so no crop is forced by the
 * frame shape itself. Submitted photos vary a lot in how close/far the
 * subject is framed though, so a moderate scale(1.3) zoom (anchored to the
 * top, via origin-top) crops in from the sides/bottom to pull faces closer
 * and keep sizing consistent across candidates, without cutting foreheads
 * the way a naive full-image zoom would. The scale needs its own overflow-
 * hidden wrapper — a transform doesn't affect layout, so without a clipping
 * parent the zoomed image would visually spill past its rounded corners.
 * Grayscale keeps the simulator visually distinct from a real ballot/campaign
 * context — reinforces neutrality and that this is a training exercise, not
 * the real thing.
 */
export function CandidateAvatar({ candidate }: { candidate: Candidate }) {
  const [imageFailed, setImageFailed] = useState(false)
  const showPhoto = candidate.photoUrl && !imageFailed

  if (showPhoto) {
    return (
      <div className="h-28 w-20 shrink-0 overflow-hidden rounded-lg">
        <img
          src={candidate.photoUrl}
          alt={`Foto de ${candidate.ballotName}`}
          className="h-full w-full origin-top scale-125 object-cover object-top grayscale"
          onError={() => setImageFailed(true)}
        />
      </div>
    )
  }

  return (
    <div
      className="flex h-28 w-20 shrink-0 items-center justify-center rounded-lg bg-urna-case-shadow text-2xl font-bold text-urna-glass-text"
      role="img"
      aria-label={`Sem foto disponível para ${candidate.ballotName}`}
    >
      {initials(candidate.ballotName)}
    </div>
  )
}
