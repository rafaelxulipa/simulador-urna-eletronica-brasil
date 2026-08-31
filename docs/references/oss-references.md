# Referências open source — estudo de arquitetura

> Estudo realizado exclusivamente para inspiração arquitetural. Nenhum código, asset,
> imagem, som ou identidade visual destes projetos foi copiado. A implementação de
> "Treine Seu Voto" é original e usa como fonte de verdade para comportamento/aparência
> de 2026 os dados oficiais do TSE (ver `docs/research.md`, `docs/data-sources.md`,
> `docs/urna-visual-reference.md`).

Data da consulta: 2026-08-31 (via GitHub API/raw, sem `gh` CLI disponível no ambiente).

---

## 1. JohnPetros/urna-eletronica

- Fonte: https://github.com/JohnPetros/urna-eletronica
- Stack: React + Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion +
  Radix UI + Lottie (animações de sucesso/erro) + JSON Server (API fake de candidatos).
- Máquina de estado de votação: `useReducer` (`UrnReducer`) com um `UrnContext` global.
  Estado (`UrnState`) contém `activeRoleTitle`, `pressedNumbers`, `choosenCandidate`,
  `canPressKey`, `isWhiteVote`, `votedCandidates`, `isEnd`. Cargos vivem num array
  `ROLES_TITLES` e a transição de cargo é `findIndex` + `+1`, com fim de sequência
  marcando `isEnd: true`.
- Regras de negócio implementadas no reducer (não na UI):
  - CONFIRMA só age se `!canPressKey` (ou seja, exige os dígitos completos e
    candidato resolvido); caso contrário abre modal de erro e devolve foco à tecla.
  - BRANCO só é aceito se o campo estiver vazio (`pressedNumbers.length === 0` e sem
    `choosenCandidate`); senão abre modal orientando a usar CORRIGE primeiro.
  - CORRIGE remove o último dígito se `canPressKey`, ou reseta o cargo inteiro se não
    (ou seja, comportamento contextual: apagar 1 dígito vs. cancelar tudo).
  - Foco é devolvido programaticamente ao botão que abriu um modal de erro
    (acessibilidade de teclado).
- Teclado (`Keyboard.tsx`): grid CSS `grid-cols-[repeat(3,minmax(40px,140px))]` para as
  teclas 1–9, tecla "0" centralizada abaixo (`col-start-2`), e uma linha separada com
  3 colunas para BRANCO / CORRIGE / CONFIRMA — confirma o layout físico real (numérico
  3×3 + 0 + linha de ações).
- Dados de candidatos: consumidos de uma API fake separada (JSON Server), não
  hardcoded no componente — mesmo princípio do `CandidateProvider` do nosso PRD.
- Acessibilidade: projeto inteiro construído com foco em ARIA APG da W3C — navegação
  por tab, `Home`/`End` em listas de tabs, `aria-live` para atualização de conteúdo,
  devolução de foco ao fechar modal, `role="alert"` em mensagens de erro.
- Observação importante: o README cita que o projeto foi **inspirado no simulador
  oficial do TSE**: `https://www.tse.jus.br/hotsites/simulador-de-votacao/` — vale a
  pena os outros documentos de pesquisa (`docs/urna-visual-reference.md`,
  `docs/research.md`) verificarem se esse hotsite oficial ainda está no ar em 2026,
  pois seria a fonte primária ideal.
- Anti-padrão a evitar: autenticação simples via `localStorage` (checagem de idade) —
  não é aplicável ao nosso produto, que não deve pedir nenhum dado do usuário.

## 2. rmatos10/urna-eletronica

- Fonte: https://github.com/rmatos10/urna-eletronica
- Descrição: "Urna eletrônica com design do modelo UE2020", feito para treinar
  React + Next.js + Styled Components, com candidatos reais da eleição municipal 2024
  de Lages/SC (fora do nosso escopo de 2026, mas o modelo físico referenciado — UE2020
  — é um dado útil a cruzar com `docs/urna-visual-reference.md`).
- Stack: React + Next.js + Styled Components + `file-loader` para áudio `.mp3`.
- Modelagem de dados simples via classes TS (`Etapa`, `Candidato`, `Foto`) em vez de
  interfaces/tipos puros — cada etapa (`Etapa`) tem `titulo`, `numeros` (qtd. de
  dígitos) e a lista de `candidatos`. Ideia útil: quantidade de dígitos por cargo é uma
  propriedade explícita da etapa, não inferida em runtime.
  ainda: `router.tsx` usa `react-router-dom` com uma única rota `/` e toda a navegação
  do fluxo de votação é controlada por estado interno da página `Home`, não por rotas —
  ou seja, o fluxo de votação inteiro roda como uma "app" de estados dentro de uma
  única página, sem trocar de URL a cada cargo.
- Assets: imagens reais dos candidatos de Lages/SC e ícones Braille para BRANCO/
  CORRIGE/CONFIRMA e dígitos 0–9 (`assets/imagens/braille/`) — evidência de que o
  produto oficial/replicado inclui indicação em braile nas teclas físicas, relevante
  para `docs/accessibility.md`.
- Som: dois arquivos (`digito-urna.mp3`, `confirma-urna.mp3`) tocados via um
  componente `Audio` dedicado — confirma o padrão de "serviço de áudio" único em vez
  de tocar som disperso em cada componente.
- Anti-padrão a evitar: dados de candidatos, fotos e nomes de pessoas reais
  hardcoded diretamente no código-fonte (`model/dados.ts` e pasta `public/candidatos`).
  Isso é o oposto do que o PRD pede (`CandidateProvider` alimentado por dados oficiais
  via API própria) e não deve ser reproduzido.

## 3. leofn/tse-candidatos-2026

- Fonte: https://github.com/leofn/tse-candidatos-2026
- Descrição: coleta automatizada (GitHub Actions diário) dos CSVs oficiais do TSE
  para a eleição de 2026, replicando a estrutura exata do Portal de Dados Abertos do
  TSE (`dadosabertos.tse.jus.br/dataset/candidatos-2026`), com um dicionário de dados
  (`docs/dicionario.md`) e scripts Python de coleta/normalização.
- **Este repositório foi o achado mais valioso**: não é um simulador, é um espelho dos
  dados reais do TSE, e forneceu evidência direta (arquivos CSV `consulta_cand_2026_*`,
  `consulta_vagas_2026_*`, `bem_candidato_2026_*`) sobre a estrutura exata que nosso
  pipeline `scripts/sync-tse` precisa reproduzir:
  - Encoding Latin-1 (ISO-8859-1), delimitador `;`, campos entre aspas duplas — igual
    ao formato oficial do TSE.
  - Campos confirmados em `consulta_cand`: `SQ_CANDIDATO` (chave), `NR_CANDIDATO`
    (número de urna), `NM_URNA_CANDIDATO` (nome de urna — o que deve aparecer na
    tela), `SG_PARTIDO`, `NM_PARTIDO`, `DS_CARGO`, `SG_UF`, `DS_SITUACAO_CANDIDATURA`.
  - **Confirmação factual cruzada com os dados reais**: quantidade de dígitos por
    cargo em 2026 — Presidente e Governador = 2 dígitos, Senador = 3 dígitos,
    Deputado Federal = 4 dígitos, Deputado Estadual/Distrital = 5 dígitos.
  - **Confirmação sobre o Senado em 2026**: o arquivo `consulta_vagas_2026_*.csv`
    mostra `QT_VAGA = 2` para o cargo "Senador" em todos os estados, mas o TSE trata
    Senador como **um único `CD_CARGO` com uma lista única de candidatos por UF** —
    não existem dois cargos distintos "Senador 1ª vaga" / "Senador 2ª vaga" nos dados.
    Isso significa que a UI deve modelar duas *etapas de votação* consecutivas para
    Senador (1ª escolha, 2ª escolha), ambas usando a mesma lista de candidatos do
    estado, e não dois `CandidateProvider` filtrados por vaga diferente. Repassar essa
    descoberta para a decisão de `docs/research.md` sobre o comportamento oficial de
    confirmação da 2ª escolha de senador (se a urna real impede repetir o mesmo
    candidato ou não) — não encontrei essa confirmação comportamental aqui, apenas a
    estrutura de dados.
  - O manifesto mais recente (`dados/_manifesto.json`) mostra **HTTP 403 Forbidden**
    em todas as tentativas de nova coleta — ou seja, o endpoint de dados abertos do
    TSE está atualmente bloqueando coleta automatizada (rate limiting/bot protection),
    mas os CSVs já coletados anteriormente (extração de 28/07/2026, ~1.387
    candidatos) permanecem no repositório e são dados reais e verificáveis.
  - Licença dos dados: Creative Commons Atribuição (TSE/AGEL); licença do código do
    repositório: MIT.
- Implicação prática para nosso pipeline: se o portal `dadosabertos.tse.jus.br`
  também recusar requisições automatizadas ao vivo a partir do nosso ambiente, uma
  fonte alternativa/fallback documentada é replicar o mesmo formato de CSV a partir de
  um snapshot já coletado (por exemplo, os próprios arquivos deste repositório, citando
  a fonte e a data), sempre deixando claro no produto a data de atualização do dataset
  (conforme PROMPT-INICIAL.md, seção 63 — fallback nunca deve fingir dados atuais).

---

## Decisões adotadas para "Treine Seu Voto"

1. **State machine explícita via reducer**, independente do React na camada de
   domínio (`domain/voting-engine`), inspirada no padrão reducer do `useUrn` do
   JohnPetros — mas implementada como função pura testável (`reduce(state, event)`),
   sem depender de `useReducer`/Context diretamente, para bater com o requisito do
   PROMPT-INICIAL.md (seção 76) de a lógica de votação não depender de React.
2. **BRANCO só habilitado com campo vazio; CONFIRMA só habilitado com candidato
   resolvido ou branco pendente; CORRIGE contextual** (apaga 1 dígito durante
   digitação, cancela seleção após candidato resolvido) — mesmo princípio de guarda de
   estado observado no JohnPetros, adaptado aos estados do nosso `VotingState`.
3. **Teclado com grid 3×3 + "0" centralizado abaixo + linha de ações
   BRANCO/CORRIGE/CONFIRMA**, confirmado como padrão em ambos os simuladores e
   consistente com a disposição física real da urna.
4. **Senador modelado como duas etapas de voto (`SENATOR_FIRST`, `SENATOR_SECOND`) que
   compartilham a mesma lista de candidatos por UF**, em vez de dois cargos com dados
   diferentes — decisão baseada na estrutura real de dados do TSE (`QT_VAGA=2` sob um
   único `CD_CARGO=5`), não em suposição.
5. **`scripts/sync-tse` deve replicar o formato exato dos CSVs oficiais** (Latin-1,
   `;`-delimited, campos `SQ_CANDIDATO`/`NR_CANDIDATO`/`NM_URNA_CANDIDATO`/`SG_PARTIDO`/
   `DS_CARGO`/`SG_UF`/`DS_SITUACAO_CANDIDATURA`), com um fallback documentado (dataset
   snapshot com data de coleta exibida ao usuário) caso o portal oficial bloqueie
   requisições automatizadas em produção, já que isso foi observado acontecendo com o
   coletor do `leofn/tse-candidatos-2026`.
6. **Não hardcodar candidatos reais no código-fonte** (anti-padrão do rmatos10) — todo
   dado de candidato passa pelo pipeline TSE → validação → normalização → banco → API.
