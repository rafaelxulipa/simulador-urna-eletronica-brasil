-- Simple aggregate visit counter — a single number, no per-user tracking,
-- no IP/cookie logging, no personal data. See docs/architecture.md.
CREATE TABLE IF NOT EXISTS site_stats (
  key TEXT PRIMARY KEY,
  value BIGINT NOT NULL DEFAULT 0
);

INSERT INTO site_stats (key, value) VALUES ('visits', 0) ON CONFLICT (key) DO NOTHING;
