# Arquitetura

## Visão geral

Projeto único, monorepo simples, um único deployment na Vercel:

```
React + TypeScript + Vite  (src/)
        │
        ├── Frontend (SPA, React Router)
        │
        └── /api/*  →  Vercel Serverless Functions (api/)
                              │
                              ▼
                        PostgreSQL externo (Neon)
```

O frontend nunca acessa o TSE diretamente (ver `docs/data-sources.md` — o
acesso ao TSE é bloqueado por WAF a partir de vários ambientes e não deve ser
uma dependência de runtime do usuário final).

## Camadas (`src/`)

```
domain/       — regras puras, sem React/DOM/fetch (voting engine, election config)
services/     — integrações (CandidateProvider: seed vs. api, AudioService)
stores/       — estado global real (Zustand): accessibility, audio, session
hooks/        — orquestração React ↔ domain (useVotingSession)
components/   — UI (urna/, voting/, audio/, accessibility/, common/)
features/     — composições de página específicas (landing hero, etc.)
pages/        — uma página por rota
data/         — dados estáticos reais (lista de UFs) e seed fictício
```

Regra central (PROMPT-INICIAL.md #76): a lógica de votação
(`src/domain/voting/votingEngine.ts`) é um redutor puro — recebe estado +
evento, devolve novo estado. Não importa React, não faz fetch, não toca
`localStorage`. É testado em `tests/unit/votingEngine.test.ts` sem DOM. Toda
orquestração assíncrona (buscar candidato, temporizador de desbloqueio do
CONFIRMA) vive em `src/hooks/useVotingSession.ts`, a única ponte entre o
domínio e o React.

## Dados de candidatos

`CandidateProvider` (`src/domain/election/types.ts`) é a única interface que
o resto da aplicação conhece. Duas implementações:

- `SeedCandidateProvider` — dados fictícios, gerados localmente, usados por
  padrão até o banco real estar sincronizado (ver `docs/data-sources.md`).
- `ApiCandidateProvider` — consome `/api/states`, `/api/candidates`,
  `/api/metadata`.

Troca controlada por `VITE_CANDIDATE_SOURCE` (`seed` por padrão, `api` para
produção com banco sincronizado). Ver `src/services/candidateProvider/`.

## Backend (`api/`)

Vercel Serverless Functions em TypeScript, sem framework HTTP adicional.
Cada função valida entrada, consulta o Postgres via `pg`, nunca expõe
`DATABASE_URL` nem colunas sensíveis (CPF, título eleitoral — ver
`docs/data-sources.md`).

## Banco de dados

PostgreSQL externo (Neon ou equivalente), nunca hospedado na Vercel. Schema
em `db/migrations/`. Populado por `pnpm sync:tse` (`scripts/sync-tse/`), que
baixa o ZIP oficial do TSE, normaliza e faz upsert transacional — nunca
substitui dados válidos por um dataset inválido (PROMPT-INICIAL.md #62).

## Por que não Fastify / backend separado

O MVP não tem necessidade técnica concreta que justifique um servidor HTTP
separado — Vercel Functions cobre validação, cache e acesso ao Postgres sem
processo adicional para operar. Reavaliar apenas se surgir uma necessidade
real (ex.: WebSocket, job de longa duração).
