import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useSessionStore } from '@/stores/sessionStore'
import type { ConfirmedVote } from '@/domain/voting/types'

type SheetMode = 'FILLED' | 'BLANK'

const VOTE_KIND_LABEL: Record<'BLANK' | 'NULL', string> = {
  BLANK: 'Voto em branco',
  NULL: 'Voto nulo',
}

function DigitBoxes({ digits, value }: { digits: number; value?: string }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: digits }).map((_, i) => (
        <div
          key={i}
          className="flex h-7 w-6 items-center justify-center rounded border-2 border-black/25 bg-black/[0.03] font-mono text-sm font-bold text-black"
        >
          {value?.[i] ?? ''}
        </div>
      ))}
    </div>
  )
}

function OfficeRow({ vote, mode }: { vote: ConfirmedVote; mode: SheetMode }) {
  return (
    <div className="border-b border-black/10 py-2 last:border-0">
      <p className="text-[9px] font-bold uppercase tracking-wide text-black/70">{vote.office.label}</p>
      <div className="mt-1 flex flex-wrap items-center gap-1.5">
        {mode === 'BLANK' || vote.kind === 'CANDIDATE' ? (
          <DigitBoxes digits={vote.office.digits} value={mode === 'FILLED' ? vote.candidate?.ballotNumber : undefined} />
        ) : (
          <span className="rounded bg-black/[0.06] px-2 py-1 text-[10px] font-bold uppercase text-black/70">
            {VOTE_KIND_LABEL[vote.kind]}
          </span>
        )}
        {mode === 'FILLED' && vote.kind === 'CANDIDATE' && vote.candidate && (
          <span className="text-[9px] text-black/60">
            {vote.candidate.ballotName} — {vote.candidate.party}
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * Printable A4 "colinha" (cheat sheet). Visual language (dark card, orange
 * ribbon header, per-digit boxes, sideways warning strip) is inspired by
 * the TSE's own pre-election cheat sheet, redrawn with our own palette/icon
 * rather than reusing their artwork or seal — see
 * https://www.tse.jus.br/comunicacao/noticias/2026/Agosto/colinha-eleitoral-ajuda-a-lembrar-os-numeros-de-candidatos-nas-eleicoes-2026
 * Offered filled-in (from this session's votes) or blank, for the voter to
 * write in their own numbers ahead of the real election.
 */
export function CheatSheetPage() {
  const finishedVotes = useSessionStore((s) => s.finishedVotes)
  const selectedState = useSessionStore((s) => s.selectedState)
  const [mode, setMode] = useState<SheetMode | null>(null)

  if (!finishedVotes) return <Navigate to="/" replace />

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-4 text-center print:hidden">
        <h1 className="text-3xl font-bold">Colinha para a urna</h1>
        <p className="text-urna-text-secondary">
          Imprima em uma folha A4 e leve com você no dia da votação para conferir os números — no mesmo estilo da
          colinha oficial do TSE.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setMode('FILLED')}
            className={`min-h-14 rounded-xl px-6 py-3 text-lg font-semibold ${
              mode === 'FILLED'
                ? 'bg-brand-accent text-white hover:brightness-110'
                : 'border border-urna-text-secondary/40 hover:bg-white/10'
            }`}
          >
            Preenchida com meus votos
          </button>
          <button
            type="button"
            onClick={() => setMode('BLANK')}
            className={`min-h-14 rounded-xl px-6 py-3 text-lg font-semibold ${
              mode === 'BLANK'
                ? 'bg-brand-accent text-white hover:brightness-110'
                : 'border border-urna-text-secondary/40 hover:bg-white/10'
            }`}
          >
            Em branco, para preencher à mão
          </button>
        </div>

        {mode && (
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="min-h-14 rounded-xl bg-brand-accent px-6 py-3 text-lg font-semibold text-white hover:brightness-110"
            >
              🖨️ Imprimir
            </button>
            <Link
              to="/concluido"
              className="flex min-h-14 items-center rounded-xl border border-urna-text-secondary/40 px-6 py-3 text-lg font-semibold hover:bg-white/10"
            >
              Voltar
            </Link>
          </div>
        )}
      </div>

      {mode && (
        // A6 (105 × 148.5mm) — exactly a quarter of A4, same size as the TSE's own card.
        <div className="print-area relative mx-auto h-[148.5mm] w-[105mm]">
          <span
            aria-hidden="true"
            className="absolute -left-1.5 -top-1.5 -translate-x-1/2 -translate-y-1/2 rotate-[-45deg] text-lg leading-none"
          >
            ✂️
          </span>

          {/* Cut line — trim along this dashed border to get a pocket-sized card. */}
          <div className="h-full rounded-[26px] border-2 border-dashed border-gray-400 p-2.5">
            <div className="flex h-full flex-col rounded-2xl bg-urna-screen p-4 text-white">
              <div className="mb-3 flex items-center gap-2">
                <svg viewBox="0 0 40 40" className="h-7 w-7 shrink-0 text-urna-correct" aria-hidden="true">
                  <rect x="4" y="3" width="24" height="32" rx="3" fill="white" fillOpacity="0.12" />
                  <line x1="9" y1="12" x2="23" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="9" y1="18" x2="23" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="9" y1="24" x2="18" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path
                    d="M23 27 L34 16 L38 20 L27 31 L22 32 Z"
                    fill="currentColor"
                    stroke="#1c1e24"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="-skew-x-6 rounded bg-urna-correct px-2.5 py-1">
                  <span className="inline-block skew-x-6 text-sm font-black uppercase leading-none tracking-tight text-urna-correct-text">
                    Colinha para votar
                  </span>
                </div>
              </div>

              <p className="mb-3 text-[9px] font-semibold uppercase tracking-wide text-white/60">
                Eleições 2026{selectedState ? ` · ${selectedState}` : ''} ·{' '}
                {mode === 'FILLED' ? 'meus votos' : 'em branco'}
              </p>

              <div className="flex flex-1 gap-1.5 overflow-hidden">
                <div className="flex w-4 shrink-0 items-center justify-center py-1">
                  <span className="[writing-mode:vertical-rl] rotate-180 whitespace-nowrap text-[7px] font-bold uppercase tracking-widest text-white/50">
                    Não é permitido usar celular na cabine de votação
                  </span>
                </div>

                <div className="flex-1 overflow-hidden rounded-xl bg-white p-3 text-black">
                  {finishedVotes.map((vote) => (
                    <OfficeRow key={vote.office.code} vote={vote} mode={mode} />
                  ))}
                </div>
              </div>

              <div className="mt-3 flex shrink-0 items-center justify-between border-t border-white/15 pt-2">
                <span className="text-xs font-bold">Treine Seu Voto</span>
                <span className="text-[8px] text-white/50">Simulação não oficial — não é o site do TSE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
