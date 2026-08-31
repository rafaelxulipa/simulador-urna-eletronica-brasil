import type { OfficeConfig } from './types'

/**
 * Official order and ballot-number digit counts for the 2026 general
 * elections, per docs/research.md. Senator has two separate sequential
 * steps (2 seats up in this cycle) sharing the same "SENATOR" candidate
 * pool — see BallotOfficeCode in ./types.
 */
export const electionSequence: OfficeConfig[] = [
  {
    code: 'FEDERAL_DEPUTY',
    ballotOfficeCode: 'FEDERAL_DEPUTY',
    digits: 4,
    label: 'Deputado Federal',
    shortLabel: 'Dep. Federal',
  },
  {
    code: 'STATE_DEPUTY',
    ballotOfficeCode: 'STATE_DEPUTY',
    digits: 5,
    label: 'Deputado Estadual ou Distrital',
    shortLabel: 'Dep. Estadual',
  },
  {
    code: 'SENATOR_FIRST',
    ballotOfficeCode: 'SENATOR',
    digits: 3,
    label: 'Senador — 1ª vaga',
    shortLabel: 'Senador (1)',
  },
  {
    code: 'SENATOR_SECOND',
    ballotOfficeCode: 'SENATOR',
    digits: 3,
    label: 'Senador — 2ª vaga',
    shortLabel: 'Senador (2)',
  },
  {
    code: 'GOVERNOR',
    ballotOfficeCode: 'GOVERNOR',
    digits: 2,
    label: 'Governador',
    shortLabel: 'Governador',
  },
  {
    code: 'PRESIDENT',
    ballotOfficeCode: 'PRESIDENT',
    digits: 2,
    label: 'Presidente da República',
    shortLabel: 'Presidente',
  },
]

export function officeAt(index: number): OfficeConfig | undefined {
  return electionSequence[index]
}

export function totalOffices(): number {
  return electionSequence.length
}
