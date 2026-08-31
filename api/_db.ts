import { Pool } from 'pg'

let pool: Pool | null = null

/** Lazily creates a single pooled connection per function instance. Never logs DATABASE_URL. */
export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL não configurada')
    }
    pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  }
  return pool
}
