import { describe, expect, it } from 'vitest'
import { SeedCandidateProvider } from '@/services/candidateProvider/seedCandidateProvider'
import { electionSequence } from '@/domain/election/electionSequence'

describe('SeedCandidateProvider', () => {
  const provider = new SeedCandidateProvider()

  it('returns all 27 states', async () => {
    const states = await provider.getStates()
    expect(states).toHaveLength(27)
    expect(states.find((s) => s.code === 'DF')).toBeTruthy()
  })

  it('returns candidates with ballot numbers matching the office digit length', async () => {
    for (const office of electionSequence) {
      const candidates = await provider.getCandidates({ state: 'PE', office: office.ballotOfficeCode })
      expect(candidates.length).toBeGreaterThan(0)
      for (const candidate of candidates) {
        expect(candidate.ballotNumber).toHaveLength(office.digits)
      }
    }
  })

  it('findByNumber resolves an existing candidate and returns null otherwise', async () => {
    const [first] = await provider.getCandidates({ state: 'SP', office: 'PRESIDENT' })
    const found = await provider.findByNumber('SP', 'PRESIDENT', first.ballotNumber)
    expect(found?.id).toBe(first.id)

    const missing = await provider.findByNumber('SP', 'PRESIDENT', '00')
    expect(missing).toBeNull()
  })

  it('flags metadata as non-official', async () => {
    const metadata = await provider.getMetadata()
    expect(metadata.isOfficialData).toBe(false)
  })
})
