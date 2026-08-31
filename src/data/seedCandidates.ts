import type { BallotOfficeCode, Candidate } from '@/domain/election/types'
import { electionSequence } from '@/domain/election/electionSequence'

/**
 * FICTIONAL demo data — never real 2026 candidates. Real TSE candidate data
 * could not be downloaded from this environment (WAF blocked, see
 * docs/data-sources.md), so the simulator ships with clearly-labeled
 * example candidates until scripts/sync-tse can run from an unblocked
 * environment and populate the database behind the API-backed provider.
 */
const EXAMPLE_PEOPLE = [
  { name: 'Ana Exemplo', party: 'Partido Modelo', partyNumber: '90' },
  { name: 'Bruno Exemplo', party: 'Partido Ensaio', partyNumber: '91' },
  { name: 'Carla Exemplo', party: 'Partido Prática', partyNumber: '92' },
] as const

function buildBallotNumber(partyNumber: string, digits: number): string {
  return partyNumber.padEnd(digits, '0').slice(0, digits)
}

const BALLOT_OFFICES: BallotOfficeCode[] = Array.from(
  new Set(electionSequence.map((office) => office.ballotOfficeCode)),
)

function digitsForOffice(office: BallotOfficeCode): number {
  const match = electionSequence.find((o) => o.ballotOfficeCode === office)
  if (!match) throw new Error(`Cargo desconhecido: ${office}`)
  return match.digits
}

export function generateSeedCandidates(state: string): Candidate[] {
  return BALLOT_OFFICES.flatMap((office) =>
    EXAMPLE_PEOPLE.map((person, index) => {
      const digits = digitsForOffice(office)
      return {
        id: `seed-${state}-${office}-${index}`,
        ballotNumber: buildBallotNumber(person.partyNumber, digits),
        ballotName: `${person.name} (exemplo)`,
        fullName: `${person.name} da Silva (candidatura de exemplo)`,
        party: person.party,
        partyNumber: person.partyNumber,
        office,
        state,
        status: 'Dado de exemplo — não é uma candidatura real',
      } satisfies Candidate
    }),
  )
}
