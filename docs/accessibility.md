# Acessibilidade — Pesquisa e Decisões

Pesquisa sobre acessibilidade oficial da urna/Justiça Eleitoral e diretrizes WCAG 2.2 AA aplicadas ao simulador **Treine Seu Voto**.

---

### Tipografia oficial 2026 — Atkinson Hyperlegible

- Fonte: TSE — "Urna eletrônica ganha nova interface para tornar votação mais acessível e intuitiva" (resultado de busca; fetch direto bloqueado com HTTP 403)
- URL: https://www.tse.jus.br/comunicacao/noticias/2026/Agosto/urna-eletronica-ganha-nova-interface-para-tornar-votacao-mais-acessivel-e-intuitiva
- Data da consulta: 2026-08-31
- Informação encontrada: A Justiça Eleitoral adotou a fonte **Atkinson Hyperlegible**, desenvolvida pelo Braille Institute (organização especializada em acessibilidade para pessoas com deficiência visual), na nova interface da urna para as Eleições 2026.
- Decisão tomada: Confirma a diretriz do PROMPT-INICIAL.md (seção 54) — usar Atkinson Hyperlegible como fonte principal do simulador.
- Impacto no produto: Fonte carregada via Google Fonts (`Atkinson Hyperlegible` está disponível lá desde 2021) ou self-hosted a partir do release oficial no GitHub.

---

### Licença da fonte Atkinson Hyperlegible

- Fonte: GitHub — googlefonts/atkinson-hyperlegible; Braille Institute — brailleinstitute.org/freefont
- URL: https://github.com/googlefonts/atkinson-hyperlegible ; https://www.brailleinstitute.org/freefont/
- Data da consulta: 2026-08-31
- Informação encontrada: A fonte é distribuída sob **SIL Open Font License (OFL)**, gratuita para uso comercial e não comercial, mantida pelo Braille Institute em parceria com Applied Design Works, disponível também via Google Fonts desde 2021.
- Decisão tomada: **Uso liberado.** Importar via `@fontsource/atkinson-hyperlegible` (self-hosted, sem dependência de runtime externo) ou `<link>` do Google Fonts. Preferir self-host para funcionar offline no PWA.
- Impacto no produto: Sem restrição de licenciamento; incluir atribuição no README/`/fontes` por boa prática, ainda que a OFL não exija.

---

### Programa de Acessibilidade da Justiça Eleitoral

- Fonte: buscas TSE — "Acessibilidade na Democracia"; "Justiça Eleitoral: acesso ao voto é direito de todas as pessoas"
- URL: https://www.justicaeleitoral.jus.br/acessibilidade-e-inclusao-na-democracia/
- Data da consulta: 2026-08-31
- Informação encontrada: O Programa de Acessibilidade da Justiça Eleitoral foi instituído pela Resolução TSE nº 23.381 (junho/2012) e desde então estrutura uma política de garantia de acessibilidade em locais de votação para pessoas com deficiência. O site do TSE segue diretrizes eMAG (Modelo de Acessibilidade em Governo Eletrônico) — leitor de tela, tradução em Libras, contraste de cores, atalhos de navegação.
- Decisão tomada: Usar eMAG e WCAG 2.2 AA como referências combinadas — eMAG é a norma brasileira de acessibilidade digital para serviços públicos e é compatível com WCAG.
- Impacto no produto: `docs/accessibility.md` (este arquivo) documenta o mapeamento de critérios; implementação segue WCAG 2.2 AA como meta técnica principal (conforme já definido no PRD).

---

### Recurso de Libras na urna e no site do TSE

- Fonte: buscas TSE/TRE-SC — "Dia Internacional das Línguas de Sinais: Justiça Eleitoral facilita acesso de deficientes auditivos ao voto"
- URL: https://www.tse.jus.br/comunicacao/noticias/2025/Setembro/dia-internacional-das-linguas-de-sinais-justica-eleitoral-facilita-acesso-de-deficientes-auditivos-ao-voto
- Data da consulta: 2026-08-31
- Informação encontrada: Os modelos mais recentes de urna (a partir de 2022) contam com um **intérprete de Libras em vídeo na própria tela**, que aparece em diferentes momentos da votação para eleitores surdos ou com baixa audição. O site do TSE também integra tradução em Libras (provavelmente via VLibras, ferramenta padrão do governo federal, embora a busca não tenha confirmado explicitamente o nome "VLibras" nas páginas do TSE).
- Decisão tomada: **Não implementar vídeo de intérprete humano no MVP** — exigiria produção de vídeo original (não pode copiar o vídeo oficial do TSE) e está fora do escopo/tempo do MVP. Preparar a arquitetura para permitir adicionar Libras futuramente.
- Impacto no produto: `VotingInstruction`/`UrnaDisplay` recebem o texto de cada etapa como prop de string централizada (não hardcoded em JSX espalhado), o que permite acoplar futuramente um player de vídeo Libras ou o widget VLibras (https://www.vlibras.gov.br/, ferramenta gratuita do governo federal para tradução automática de conteúdo web em Libras) sincronizado ao mesmo texto. Registrado como item de V2 no PRD (seção 52).

---

### WCAG 2.2 AA — critérios prioritários para este produto

- Fonte: conhecimento técnico WCAG 2.2 (W3C) aplicado ao fluxo específico do simulador (teclado numérico + revisão de candidato + confirmação)
- URL: https://www.w3.org/TR/WCAG22/
- Data da consulta: 2026-08-31
- Informação encontrada / decisões e impacto, por critério:
  - **1.4.3 Contrast (Minimum)** e **1.4.11 Non-text Contrast** — texto e teclas da urna devem manter contraste ≥ 4.5:1 (texto) e ≥ 3:1 (componentes de UI/bordas de tecla); validado com axe-core.
  - **1.4.4 Resize Text** / **1.4.12 Text Spacing** — controle A-/A/A+ não pode quebrar layout da urna; usar `rem` e grid fluido.
  - **2.1.1 Keyboard** — toda a votação (dígitos, CORRIGE, CONFIRMA, BRANCO) operável via teclado físico (`0-9`, `Backspace`→CORRIGE, `Enter`→CONFIRMA), sem armadilhas de foco.
  - **2.4.7 Focus Visible** / **2.4.11 Focus Not Obscured (WCAG 2.2)** — foco sempre visível e não coberto pela barra de progresso fixa ou pela urna.
  - **2.5.8 Target Size (Minimum, WCAG 2.2)** — alvos de toque das teclas ≥ 24×24px CSS (o projeto mira bem mais que o mínimo, dado o público idoso — teclas grandes por design, ver PRD seção 93).
  - **3.2.4 Consistent Identification** — CORRIGE/CONFIRMA/BRANCO com o mesmo rótulo, cor e posição em todas as telas.
  - **4.1.3 Status Messages** — mudanças de estado (número não encontrado, voto confirmado, avanço de cargo) anunciadas via `aria-live="polite"` (ou `assertive` para erros) sem exigir foco explícito, sincronizado com o `AudioService`.
  - **1.4.13 Content on Hover or Focus** — nenhum tooltip/popover deve aparecer só no hover, já que o público-alvo usa muito toque.
- Decisão tomada: Esses critérios formam o checklist de aceitação de acessibilidade do MVP, testado com axe-core (automatizado) + revisão manual de teclado/leitor de tela (manual, ver seção 91 e 94 do PROMPT-INICIAL.md).
- Impacto no produto: Implementado principalmente em `UrnaKeyboard`, `UrnaKey`, `ProgressIndicator`, `CandidateView` e num hook `useAnnounce()`/`aria-live` region global.

---

### `prefers-reduced-motion`

- Fonte: padrão CSS Media Queries Level 5 (W3C) — não específico do TSE
- URL: https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion
- Data da consulta: 2026-08-31
- Informação encontrada: Media feature padrão para detectar preferência do usuário por menos animação.
- Decisão tomada: Respeitar `prefers-reduced-motion: reduce` removendo animações de "tecla afundando" e transições de tela, mantendo apenas mudanças de estado instantâneas.
- Impacto no produto: Tokens de animação centralizados no design system (`urna-*` tokens, seção 77 do PROMPT-INICIAL.md) com variante reduzida.
