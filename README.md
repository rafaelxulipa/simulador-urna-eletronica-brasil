# Treine Seu Voto

Simulador educativo independente da urna eletrônica brasileira — Eleições 2026.

> **Este é um simulador educativo independente.** Não é uma aplicação oficial
> do Tribunal Superior Eleitoral (TSE) nem da Justiça Eleitoral.

## Visão

Ensinar **como votar** — não em quem votar. Voltado para pessoas idosas,
pessoas com pouca familiaridade com tecnologia e quem nunca usou uma urna.
Politicamente neutro: não recomenda, favorece ou avalia candidatos. Não
coleta dados pessoais.

## Público

Pessoas idosas, familiares ensinando pais e avós, escolas, projetos de
inclusão digital.

## Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Zustand, React Router
- **Backend**: Vercel Serverless Functions (`api/`), TypeScript, `pg`
- **Banco**: PostgreSQL externo (Neon), nunca hospedado na Vercel
- **Testes**: Vitest + Testing Library (unit/integration), Playwright (E2E), axe-core (acessibilidade)
- **PWA**: `vite-plugin-pwa` (manifest, service worker, offline)

Frontend e backend vivem no mesmo projeto e são publicados em um único
deployment na Vercel. Detalhes em [`docs/architecture.md`](docs/architecture.md).

## Estrutura

```
src/domain/       lógica pura (voting engine, config eleitoral) — sem React/DOM
src/services/     CandidateProvider (seed vs. api), AudioService
src/stores/       estado global (Zustand): acessibilidade, áudio, sessão
src/hooks/        ponte entre domínio e React
src/components/   UI (urna/, voting/, audio/, accessibility/, common/)
src/pages/        uma página por rota
api/               Vercel Functions (/api/states, /api/candidates, /api/metadata)
scripts/sync-tse/ pipeline de sincronização com o TSE
db/migrations/    schema SQL
docs/             pesquisa e decisões documentadas
e2e/              testes Playwright
tests/unit/       testes Vitest
```

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

Por padrão a aplicação roda com um `CandidateProvider` de **dados de exemplo
fictícios** (não candidatos reais) — ver
[`docs/data-sources.md`](docs/data-sources.md) para o porquê. Para usar dados
reais do TSE, configure o banco (abaixo) e defina `VITE_CANDIDATE_SOURCE=api`.

## Variáveis de ambiente

Copie `.env.example` para `.env.local`:

```env
DATABASE_URL=          # string de conexão PostgreSQL (Neon, Supabase, etc.)
# VITE_CANDIDATE_SOURCE=api
```

Nunca commitar `.env.local` (já está no `.gitignore`).

## Banco de dados e sincronização com o TSE

1. Crie um Postgres (ex.: [Neon](https://neon.tech)) e coloque a connection string em `DATABASE_URL`.
2. Aplique a migração:
   ```bash
   psql "$DATABASE_URL" -f db/migrations/001_init.sql
   ```
3. Sincronize os candidatos oficiais:
   ```bash
   pnpm sync:tse
   ```
   Baixa o ZIP oficial (`consulta_cand_2026.zip`), normaliza e grava no banco
   de forma transacional (nunca substitui dados válidos por um dataset vazio
   ou inválido). Ver [`docs/data-sources.md`](docs/data-sources.md) para o
   schema, limitações conhecidas (ex.: status de candidatura ainda não
   adjudicado pelo TSE nesta fase do ciclo) e o tratamento especial de
   candidatos à Presidência (registro nacional, não por UF).

## Testes

```bash
pnpm test          # unit/integration (Vitest)
pnpm test:e2e       # E2E (Playwright — primeira vez: pnpm exec playwright install chromium)
pnpm lint
pnpm typecheck
pnpm build
```

## Deploy (Vercel)

Um único projeto Vercel publica o frontend estático e as funções `/api/*`.
Configure `DATABASE_URL` nas variáveis de ambiente do projeto Vercel. Ver
[`vercel.json`](vercel.json) e [`docs/architecture.md`](docs/architecture.md).

## Acessibilidade

Meta WCAG 2.2 AA: navegação por teclado completa (incl. Backspace→CORRIGE,
Enter→CONFIRMA), `aria-live` para mudanças de estado, alto contraste, fonte
ajustável (A-/A/A+, Atkinson Hyperlegible — licença SIL Open Font), suporte a
`prefers-reduced-motion`, alvos de toque grandes. Detalhes e critérios WCAG
específicos em [`docs/accessibility.md`](docs/accessibility.md).

## Áudio e voz

Efeitos sonoros originais (Web Audio API) e narração por voz
(`SpeechSynthesis`, vozes do navegador) — nunca o áudio oficial da urna
(sem licença de reuso conhecida). Ver [`docs/audio.md`](docs/audio.md).

## Fontes e pesquisa

Toda decisão factual sobre a urna 2026, ordem dos cargos, dados do TSE e
comportamento de votação está documentada com fonte, data e decisão em:

- [`docs/research.md`](docs/research.md) — regras eleitorais 2026
- [`docs/data-sources.md`](docs/data-sources.md) — dados do TSE, schema real verificado
- [`docs/urna-visual-reference.md`](docs/urna-visual-reference.md) — referência visual
- [`docs/audio.md`](docs/audio.md) · [`docs/accessibility.md`](docs/accessibility.md)
- [`docs/architecture.md`](docs/architecture.md) · [`docs/ux-flow.md`](docs/ux-flow.md)

## Licença

Código aberto. Não é afiliado, endossado ou mantido pelo TSE ou pela Justiça
Eleitoral.
