import type { Candidate, OfficeConfig } from '@/domain/election/types'

/**
 * Original PT-BR narration, written for this project — replicates the
 * *function* of the official urna's audio guidance, never its literal
 * wording or synthesized voice. See docs/audio.md.
 */
export const voiceScript = {
  office: (office: OfficeConfig) => `${office.label}. Digite o número da candidata ou do candidato.`,
  candidateFound: (candidate: Candidate) =>
    `${candidate.ballotNumber}. ${candidate.ballotName}. ${candidate.party}.`,
  invalidNumber: () => 'Número não encontrado. Confira os números digitados.',
  blank: () => 'Voto em branco.',
  confirmed: () => 'Voto confirmado.',
  blankConfirmed: () => 'Voto em branco confirmado.',
  nullConfirmed: () => 'Voto nulo confirmado.',
  corrected: () => 'Vamos tentar novamente.',
  finished: () => 'Votação concluída.',
}
