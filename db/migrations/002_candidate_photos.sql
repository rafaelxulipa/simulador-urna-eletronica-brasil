-- Candidate photos, TSE dados abertos (CC-BY license — see docs/data-sources.md).
-- Kept in a separate table from `candidates` so a full candidate re-sync (which
-- DELETEs and reinserts `candidates`) doesn't force a photo re-download too.
CREATE TABLE IF NOT EXISTS candidate_photos (
  candidate_id TEXT PRIMARY KEY REFERENCES candidates (id) ON DELETE CASCADE,
  content_type TEXT NOT NULL DEFAULT 'image/jpeg',
  photo BYTEA NOT NULL
);
