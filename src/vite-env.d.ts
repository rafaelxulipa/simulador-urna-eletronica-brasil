/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CANDIDATE_SOURCE?: 'seed' | 'api'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
