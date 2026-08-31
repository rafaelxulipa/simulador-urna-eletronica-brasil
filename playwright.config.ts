import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  webServer: {
    // E2E must stay deterministic and DB-independent — force the fictional seed
    // dataset regardless of .env.local's VITE_CANDIDATE_SOURCE (also, `vite preview`
    // doesn't run devApiPlugin's dev-only /api/* middleware, so "api" mode would
    // just 404 here anyway). process.env wins over .env.local in Vite's precedence.
    command: 'VITE_CANDIDATE_SOURCE=seed pnpm build && pnpm preview --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
