-- Initial schema for the "Treine Seu Voto" candidate database.
-- Never stores CPF, título eleitoral, or other sensitive personal data
-- from the raw TSE files — see docs/data-sources.md.

CREATE TABLE IF NOT EXISTS candidates (
  id TEXT PRIMARY KEY,
  ballot_number TEXT NOT NULL,
  ballot_name TEXT NOT NULL,
  full_name TEXT,
  party TEXT NOT NULL,
  party_number TEXT,
  federation TEXT,
  office TEXT NOT NULL,
  state CHAR(2) NOT NULL,
  photo_url TEXT,
  status TEXT,
  UNIQUE (state, office, ballot_number)
);

CREATE INDEX IF NOT EXISTS idx_candidates_state_office ON candidates (state, office);

-- One row per successful sync run. scripts/sync-tse inserts a new row
-- transactionally alongside the candidate upserts — never partial.
CREATE TABLE IF NOT EXISTS sync_metadata (
  id SERIAL PRIMARY KEY,
  source TEXT NOT NULL,
  is_official BOOLEAN NOT NULL DEFAULT true,
  synced_at TIMESTAMPTZ NOT NULL,
  candidate_count INTEGER NOT NULL,
  notes TEXT
);
