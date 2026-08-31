import { BRAZILIAN_STATES } from '../src/data/states'

const VALID_STATE_CODES = new Set(BRAZILIAN_STATES.map((s) => s.code))
const VALID_OFFICE_CODES = new Set(['FEDERAL_DEPUTY', 'STATE_DEPUTY', 'SENATOR', 'GOVERNOR', 'PRESIDENT'])

export function isValidStateCode(value: unknown): value is string {
  return typeof value === 'string' && VALID_STATE_CODES.has(value.toUpperCase())
}

export function isValidOfficeCode(value: unknown): value is string {
  return typeof value === 'string' && VALID_OFFICE_CODES.has(value.toUpperCase())
}

/** Ballot numbers are digits only, 2 to 5 characters (see src/domain/election/electionSequence.ts). */
export function isValidBallotNumberFragment(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9]{1,5}$/.test(value)
}
