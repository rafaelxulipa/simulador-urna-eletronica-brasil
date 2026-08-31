# MASTER PROMPT — TREINE SEU VOTO

## Simulador Educativo da Urna Eletrônica Brasileira — Eleições 2026

Você é o principal **Software Engineer, Product Designer, UX Designer, UI Designer, Accessibility Engineer, QA Engineer e Technical Lead** responsável por construir este projeto.

Você deve agir como responsável técnico pelo produto inteiro, tomando decisões técnicas razoáveis sem pedir confirmação para cada pequena etapa.

O objetivo não é produzir apenas um mockup.

O objetivo é entregar uma **aplicação web funcional, acessível, responsiva, educativa, performática e tecnicamente profissional**, preparada para produção e deploy na Vercel.

---

# 1. REPOSITÓRIO OFICIAL

Este projeto já possui um repositório GitHub oficial:

```text
https://github.com/rafaelxulipa/simulador-urna-eletronica-brasil
```

Repositório:

```text
rafaelxulipa/simulador-urna-eletronica-brasil
```

Nome do projeto:

```text
simulador-urna-eletronica-brasil
```

Este é o **único repositório oficial do projeto**.

## NÃO

- criar outro repositório;
- criar fork;
- criar projeto paralelo;
- alterar o nome do repositório;
- mover o projeto;
- criar outro backend separado;
- criar outro frontend separado;
- trabalhar em um diretório paralelo.

Todo o desenvolvimento deve acontecer neste repositório.

---

# 2. ARQUITETURA PRINCIPAL — UM ÚNICO PROJETO

## DECISÃO ARQUITETURAL OBRIGATÓRIA

Frontend e backend devem fazer parte do **mesmo projeto, mesmo repositório e mesmo deployment na Vercel**.

Não criar dois projetos independentes.

Não criar um servidor backend separado para o MVP.

A arquitetura preferencial é:

```text
React + TypeScript + Vite
        │
        ├── Frontend
        │
        └── /api/*
              │
              ▼
       Vercel Serverless Functions
              │
              ▼
       PostgreSQL externo
```

Exemplo:

```text
https://dominio.com/
```

Frontend.

```text
https://dominio.com/api/states
https://dominio.com/api/candidates
https://dominio.com/api/offices
https://dominio.com/api/metadata
```

Backend/API.

Tudo deve ser publicado através de **um único projeto Vercel**.

---

# 3. BACKEND — VERCEL SERVERLESS

Não utilizar Fastify ou outro servidor HTTP separado no MVP, salvo se existir uma necessidade técnica concreta e documentada.

Preferir:

- Vercel Functions;
- API Routes/Functions;
- TypeScript;
- validação de entrada;
- PostgreSQL externo.

O backend deve ser stateless.

Não depender de filesystem local para persistência.

---

# 4. BANCO DE DADOS

O PostgreSQL deve ser externo à Vercel.

A arquitetura deve permitir utilização de provedores PostgreSQL compatíveis com ambientes serverless, como:

- Neon;
- Supabase;
- ou outro PostgreSQL gerenciado compatível.

Não criar PostgreSQL dentro da Vercel.

Não depender de banco local em produção.

A conexão deve utilizar variáveis de ambiente.

Exemplo:

```env
DATABASE_URL=
```

Nunca commitar credenciais.

---

# 5. PRIMEIRA AÇÃO

Antes de criar qualquer código:

```bash
pwd
git status
git remote -v
ls -la
```

Confirmar que o diretório corresponde ao projeto:

```text
rafaelxulipa/simulador-urna-eletronica-brasil
```

Se o Git ainda não estiver configurado:

```bash
git init
git remote add origin https://github.com/rafaelxulipa/simulador-urna-eletronica-brasil.git
```

Se o remote já existir:

NÃO criar outro.

---

# 6. REGRA FUNDAMENTAL — PESQUISA ANTES DO CÓDIGO

Não começar imediatamente criando componentes.

Primeiro realizar pesquisa completa.

A aplicação precisa representar corretamente a experiência de votação das **Eleições 2026**.

Priorizar fontes oficiais:

- Tribunal Superior Eleitoral — TSE;
- Justiça Eleitoral;
- Dados Abertos do TSE;
- documentação oficial das Eleições 2026;
- resoluções eleitorais;
- publicações oficiais sobre a urna eletrônica 2026;
- documentação oficial de acessibilidade;
- documentação oficial sobre dados de candidaturas.

---

# 7. PESQUISA OBRIGATÓRIA

Pesquisar e documentar:

## Eleições

- cargos;
- ordem da votação;
- quantidade de vagas;
- regras de votação;
- números;
- partidos;
- federações;
- situação das candidaturas;
- estados;
- Distrito Federal.

## Dados

- datasets oficiais;
- APIs oficiais, se existirem;
- formatos;
- campos;
- identificadores;
- fotografias;
- URLs;
- periodicidade;
- atualização;
- licenciamento;
- limitações.

## Urna 2026

Pesquisar:

- interface;
- telas;
- tipografia;
- Atkinson Hyperlegible;
- barra de progresso;
- layout;
- mensagens;
- teclado;
- botões;
- gabinete;
- modelos físicos;
- comportamento das teclas;
- acessibilidade;
- áudio;
- recursos de voz;
- Libras.

---

# 8. FONTES OFICIAIS TÊM PRIORIDADE

Quando houver conflito entre:

1. uma referência encontrada em blog;
2. uma referência antiga;
3. uma implementação de terceiros;
4. uma publicação oficial do TSE;

priorizar a fonte oficial do TSE.

Não assumir que interfaces antigas continuam válidas para 2026.

---

# 9. DOCUMENTAÇÃO DA PESQUISA

Criar:

```text
docs/research.md
docs/data-sources.md
docs/urna-visual-reference.md
docs/audio.md
docs/accessibility.md
docs/architecture.md
docs/ux-flow.md
```

Registrar:

```text
Fonte
URL
Data da consulta
Informação encontrada
Decisão tomada
Impacto no produto
```

---

# 10. OBJETIVO DO PRODUTO

Construir:

# TREINE SEU VOTO

Subtítulo:

```text
Aprenda a usar a urna eletrônica com tranquilidade.
```

É um simulador educativo independente da urna eletrônica brasileira.

Público principal:

- pessoas idosas;
- pessoas com pouca familiaridade com tecnologia;
- pessoas que nunca utilizaram uma urna;
- pessoas que têm medo de errar;
- familiares ensinando pais e avós;
- escolas;
- instituições;
- projetos de inclusão digital.

Objetivo:

> ENSINAR COMO VOTAR.

Não ensinar:

> EM QUEM VOTAR.

---

# 11. IDENTIDADE E NEUTRALIDADE

O produto deve ser politicamente neutro.

Nunca:

- recomendar candidato;
- destacar candidato;
- favorecer candidato;
- ordenar candidatos por preferência;
- comparar candidatos;
- mostrar pesquisas;
- mostrar intenção de voto;
- fazer análise política;
- avaliar candidatos;
- inserir propaganda;
- inserir conteúdo partidário.

Todos os candidatos devem ser apresentados de maneira equivalente.

---

# 12. STATUS DO PRODUTO

Este projeto NÃO é:

- TSE;
- TRE;
- Justiça Eleitoral;
- sistema oficial de votação;
- sistema de apuração;
- sistema de votação online;
- aplicativo oficial.

É:

> um simulador educativo independente.

---

# 13. DISCLAIMER

Exibir claramente:

```text
Este é um simulador educativo independente.
Não é uma aplicação oficial do Tribunal Superior Eleitoral (TSE)
nem da Justiça Eleitoral.
```

Também:

```text
Os dados de candidatas e candidatos são obtidos de fontes
públicas oficiais quando disponíveis e podem sofrer atualizações.
```

Nunca criar aparência de que o projeto é mantido pelo TSE.

---

# 14. PRINCÍPIO VISUAL CENTRAL

A aplicação deve ser imediatamente reconhecível como uma representação digital da **urna eletrônica brasileira**.

Não criar simplesmente:

```text
página web azul
+
formulário
+
teclado virtual
```

O usuário deve perceber:

> "Estou diante de uma representação digital de uma urna eletrônica brasileira."

E ao começar:

> "Estou treinando como vou operar a urna."

A fidelidade visual da urna é parte central do produto.

---

# 15. INTERFACE DE 2026

A interface deve ser baseada especificamente na experiência das **Eleições 2026**.

Pesquisar e considerar:

- redesign das telas;
- nova tipografia;
- Atkinson Hyperlegible;
- barra de progresso fixa;
- melhoria de legibilidade;
- hierarquia visual;
- acessibilidade;
- mensagens;
- organização dos elementos.

Não utilizar uma interface antiga como referência principal.

---

# 16. URNA FÍSICA — REQUISITO CRÍTICO

A aplicação deve reproduzir visualmente, de maneira educativa e independente, a composição física de uma urna eletrônica brasileira.

Incluir:

- gabinete;
- tela;
- moldura;
- teclado;
- teclas numéricas;
- BRANCO;
- CORRIGE;
- CONFIRMA;
- posição relativa dos elementos;
- proporções;
- espaçamento;
- profundidade;
- relevo;
- estados pressionados;
- perspectiva.

Não utilizar apenas uma fotografia da urna como background.

A urna deve ser construída com código próprio.

Preferir:

- React;
- CSS;
- SVG quando necessário.

---

# 17. PESQUISA DO MODELO FÍSICO

Antes de construir a urna:

1. pesquisar os modelos utilizados em 2026;
2. consultar referências oficiais;
3. analisar fotografias frontais;
4. analisar fotografias em perspectiva;
5. analisar o teclado;
6. analisar a tela;
7. analisar proporções;
8. analisar botões;
9. analisar cores;
10. analisar dimensões relativas;
11. identificar diferenças entre modelos;
12. escolher uma referência principal;
13. documentar a escolha.

Não assumir que existe apenas um modelo físico.

A arquitetura deve permitir representar outros modelos futuramente.

---

# 18. URNA — ARQUITETURA VISUAL

Criar:

```text
Urna
 ├── UrnaPhysicalShell
 ├── UrnaDisplay
 └── UrnaKeyboard
```

Componentes:

```text
UrnaPhysicalShell
UrnaDisplay
UrnaKeyboard
UrnaKey
```

A tela deve ser independente do gabinete.

---

# 19. URNA PHYSICAL SHELL

Criar:

```text
UrnaPhysicalShell
```

Responsável por:

- gabinete;
- moldura;
- suporte;
- perspectiva;
- profundidade;
- acabamento;
- área do teclado.

Não colocar lógica de votação dentro dele.

---

# 20. URNA DISPLAY

Criar:

```text
UrnaDisplay
```

Responsável exclusivamente pela interface visual da votação.

Exemplo:

```typescript
interface UrnaDisplayProps {
  office: Office
  candidate?: Candidate
  enteredNumber: string
  state: VotingState
}
```

Não controlar a lógica de votação dentro do componente visual.

---

# 21. URNA KEYBOARD

Criar:

```text
UrnaKeyboard
```

Componente reutilizável:

```text
UrnaKey
```

Exemplo:

```typescript
interface UrnaKeyProps {
  label: string
  variant: 'number' | 'blank' | 'correct' | 'confirm'
  disabled?: boolean
  onPress: () => void
}
```

---

# 22. TECLADO NUMÉRICO

Reproduzir visualmente a disposição da urna.

Não utilizar um teclado de calculadora genérico.

Considerar:

- tamanho;
- proporção;
- espaçamento;
- tipografia;
- relevo;
- profundidade;
- bordas;
- estado pressed.

Suportar:

- mouse;
- touch;
- teclado físico.

---

# 23. TECLAS ESPECIAIS

Implementar:

```text
BRANCO
CORRIGE
CONFIRMA
```

Cada tecla deve possuir:

```text
default
hover
focus
pressed
disabled
```

O estado visual deve parecer uma tecla física.

---

# 24. INTERAÇÃO FÍSICA

Ao pressionar:

```text
normal
→ pressed
→ release
```

A tecla deve parecer afundar levemente.

A animação deve ser curta e discreta.

---

# 25. PROFUNDIDADE FÍSICA

A urna não deve parecer uma página web plana.

Utilizar CSS para criar:

- relevo;
- bordas;
- sombra;
- profundidade;
- perspectiva;
- pressed state.

Não exagerar em 3D.

---

# 26. DESKTOP

No desktop, a urna deve ocupar uma parte significativa da viewport.

Não deixar uma pequena urna perdida no centro.

A composição deve transmitir:

```text
equipamento físico
+
tela
+
teclado
```

---

# 27. MOBILE

No mobile, não simplesmente reduzir a urna desktop.

Criar uma composição adaptada para toque.

A tela deve permanecer legível.

As teclas devem continuar grandes.

Os botões especiais devem permanecer claramente identificáveis.

---

# 28. ESCALA RESPONSIVA

Testar:

```text
320x720
375x812
768x1024
1024x768
1440x900
1920x1080
```

Usar escala fluida.

Evitar dimensões rígidas que quebrem o layout.

---

# 29. LANDING PAGE

A primeira tela deve ocupar aproximadamente:

```text
100vw
100vh
```

A urna deve ser o principal elemento visual.

Pode conter:

```text
TREINE SEU VOTO

Aprenda a usar a urna eletrônica
com tranquilidade.

[ COMEÇAR SIMULAÇÃO ]

[ COMO FUNCIONA ]

Simulador educativo independente.
```

Não criar uma landing page SaaS.

Não colocar excesso de texto.

---

# 30. COMO FUNCIONA

Criar uma área simples:

```text
1. Escolha seu estado
2. Escolha como quer treinar
3. Digite o número
4. Confira seu voto
5. Corrija ou confirme
6. Continue até finalizar
```

Linguagem simples.

---

# 31. SELEÇÃO DO ESTADO

Antes da simulação:

```text
Onde você vai votar?
```

Criar seleção visual simples.

Preferir:

- grid;
- botões grandes;
- busca opcional.

Evitar dropdown pequeno.

---

# 32. MODOS

Implementar:

## MODO APRENDER

Explica cada etapa.

Exemplo:

```text
Agora vamos treinar.

Digite o número da candidata
ou do candidato.

Se você errar, não se preocupe.
Você poderá corrigir.
```

## MODO SIMULAÇÃO

Sem instruções adicionais.

## MODO DEMONSTRAÇÃO

Opcional.

Permite acompanhar uma demonstração guiada.

---

# 33. FLUXO OFICIAL DA VOTAÇÃO 2026

A ordem deve ficar centralizada em configuração.

Para 2026, validar nas fontes oficiais e utilizar:

```text
1. Deputado Federal
2. Deputado Estadual ou Distrital
3. Senador — 1ª vaga
4. Senador — 2ª vaga
5. Governador
6. Presidente da República
```

IMPORTANTE:

Em 2026 existem duas vagas para Senador.

Portanto:

```text
Senador — 1ª vaga
Senador — 2ª vaga
```

são etapas diferentes.

Não criar apenas uma etapa chamada "Senador".

Antes de finalizar, validar novamente nas fontes oficiais.

---

# 34. CONFIGURAÇÃO DOS CARGOS

Não espalhar a ordem dos cargos pelos componentes.

Criar uma configuração central:

```typescript
const electionSequence = [
  'FEDERAL_DEPUTY',
  'STATE_DEPUTY',
  'SENATOR_FIRST',
  'SENATOR_SECOND',
  'GOVERNOR',
  'PRESIDENT',
]
```

Permitir futuras eleições sem reescrever a aplicação.

---

# 35. VOTING ENGINE

Criar domínio independente do React.

A lógica deve poder ser testada sem DOM.

Estados possíveis:

```typescript
type VotingState =
  | 'INTRO'
  | 'ENTER_NUMBER'
  | 'SHOW_CANDIDATE'
  | 'CHECK_VOTE'
  | 'WAIT_CONFIRM'
  | 'CONFIRMED'
  | 'BLANK'
  | 'CORRECT'
  | 'INVALID'
  | 'FINISHED'
```

---

# 36. ESTADO DA VOTAÇÃO

Controlar:

- cargo atual;
- número digitado;
- candidato;
- voto branco;
- voto confirmado;
- correção;
- erro;
- progresso;
- etapa atual;
- finalização.

A interface apenas apresenta o estado.

---

# 37. DIGITAÇÃO

Quando o usuário digitar:

```text
1
2
3
4
```

mostrar o número de maneira semelhante à experiência da urna.

Não transformar a entrada em um input HTML moderno convencional.

A representação deve fazer parte da tela da urna.

---

# 38. CANDIDATO

Quando o número for válido:

```text
CARGO

NÚMERO

NOME

PARTIDO

FOTO
```

Quando houver informação oficialmente relevante adicional:

pesquisar antes de incluir.

Priorizar legibilidade.

---

# 39. FOTOGRAFIA

As fotografias devem vir de fonte oficial ou dataset permitido.

Não hardcode imagens manualmente.

Documentar:

- origem;
- URL;
- licença;
- data;
- tratamento;
- fallback.

---

# 40. NÚMERO INVÁLIDO

Mostrar mensagem clara.

Exemplo:

```text
NÚMERO NÃO ENCONTRADO

Confira os números digitados.

[ CORRIGE ]
```

Usar:

```text
aria-live
```

Adicionar feedback sonoro.

---

# 41. CORRIGE

Ao pressionar:

```text
CORRIGE
```

deve:

- limpar o número;
- remover candidato;
- retornar à entrada;
- permanecer no mesmo cargo;
- produzir feedback visual;
- produzir feedback sonoro.

No modo educativo, pode exibir:

```text
Vamos tentar novamente.
```

---

# 42. BRANCO

Ao pressionar:

```text
BRANCO
```

mostrar a experiência correspondente à votação em branco.

Exigir confirmação conforme comportamento oficial pesquisado.

Não assumir comportamento não documentado.

---

# 43. CONFIRMA

A tecla:

```text
CONFIRMA
```

deve respeitar os estados reais da votação.

Quando não disponível:

```text
disabled
```

Quando disponível:

```text
enabled
```

O usuário deve entender claramente quando pode confirmar.

---

# 44. CONFERÊNCIA

Depois de um número válido:

1. apresentar candidato;
2. apresentar informações;
3. apresentar conferência;
4. respeitar comportamento oficial;
5. liberar confirmação quando apropriado;
6. permitir correção;
7. confirmar;
8. avançar.

Não inventar timers.

Pesquisar o comportamento real de 2026.

---

# 45. BARRA DE PROGRESSO

A barra de progresso é parte importante da interface de 2026.

Deve permanecer visualmente na região superior da tela.

Mostrar:

- onde o usuário está;
- etapas concluídas;
- etapas restantes.

Não depender apenas de cor.

---

# 46. ÁUDIO — PRIORIDADE ALTA

O áudio faz parte fundamental da experiência.

Criar:

```text
AudioService
```

Não espalhar chamadas de áudio diretamente pelos componentes.

---

# 47. EVENTOS DE ÁUDIO

Suportar:

```text
KEY_PRESS
CORRECT
ERROR
CONFIRM
BLANK
NEXT_OFFICE
FINISH
```

---

# 48. SONS

Criar feedback sonoro para:

```text
tecla numérica
→ click curto

número inválido
→ erro

CORRIGE
→ som de correção

CONFIRMA
→ som de confirmação

BRANCO
→ som apropriado

finalização
→ som de conclusão
```

Os sons devem ser:

- discretos;
- claros;
- curtos;
- não cansativos;
- adequados para idosos.

---

# 49. SONS DA URNA REAL

Pesquisar se os sons oficiais utilizados pelo TSE podem ser reutilizados.

Se houver licença/autorização clara:

documentar.

Se não houver:

NÃO copiar.

Criar sons próprios inspirados apenas na função sonora.

Nunca afirmar:

```text
som oficial da urna
```

sem autorização.

---

# 50. VOZ

Implementar orientação por voz opcional.

Utilizar:

```text
SpeechSynthesis API
```

quando disponível.

Exemplos:

```text
Presidente.

Digite o número da candidata ou do candidato.

Confira seu voto.

Voto confirmado.

Número não encontrado.

Voto em branco.

Votação concluída.
```

O texto deve ser validado contra a experiência oficial.

---

# 51. CONTROLES DE ÁUDIO

Criar controles:

```text
Som
Voz
Volume
```

Permitir ligar/desligar independentemente.

Persistir preferências em:

```text
localStorage
```

---

# 52. AUTOPLAY

Respeitar políticas dos navegadores.

Não depender de autoplay para iniciar áudio.

O primeiro som/voz deve ocorrer após interação quando necessário.

A aplicação nunca deve travar porque o áudio foi bloqueado.

---

# 53. ACESSIBILIDADE

Meta:

```text
WCAG 2.2 AA
```

Implementar:

- navegação por teclado;
- focus visible;
- aria-label;
- aria-live;
- screen reader;
- alto contraste;
- fonte grande;
- touch targets;
- reduced motion;
- semântica HTML;
- ordem correta de foco;
- mensagens claras.

---

# 54. FONTE

Utilizar **Atkinson Hyperlegible** conforme disponibilidade e licença.

Não substituir arbitrariamente por outra fonte.

Criar controle:

```text
A-
A
A+
```

Pelo menos três níveis.

O aumento não pode quebrar a urna.

---

# 55. ALTO CONTRASTE

Criar:

```text
Alto contraste
```

Validar com axe-core.

Não utilizar somente cor para comunicar:

- erro;
- sucesso;
- progresso;
- estado;
- confirmação.

---

# 56. REDUCED MOTION

Respeitar:

```css
prefers-reduced-motion
```

Quando ativo:

- reduzir animações;
- remover transformações excessivas;
- manter apenas transições essenciais.

---

# 57. LIBRAS

Pesquisar recursos oficiais de Libras relacionados à urna 2026.

Não inventar implementação de Libras.

Se a implementação completa não estiver no MVP:

preparar arquitetura para futura inclusão.

Documentar.

---

# 58. PRIVACIDADE

Não solicitar:

- login;
- conta;
- CPF;
- título eleitoral;
- nome;
- endereço;
- zona;
- seção;
- qualquer dado pessoal desnecessário.

A aplicação deve poder ser usada sem dados pessoais.

---

# 59. DADOS OFICIAIS

Não hardcode candidatos.

Não inventar API.

Não inventar endpoints.

Não depender de scraping quando houver dataset oficial estruturado.

---

# 60. CANDIDATE PROVIDER

Criar abstração:

```typescript
interface CandidateProvider {
  getStates(): Promise<State[]>
  getCandidates(filters: CandidateFilters): Promise<Candidate[]>
}
```

O restante da aplicação não deve depender diretamente da implementação específica da fonte.

---

# 61. PIPELINE DE DADOS

Implementar:

```text
TSE
 ↓
Download
 ↓
Validation
 ↓
Normalization
 ↓
PostgreSQL
 ↓
Vercel API
 ↓
React
```

---

# 62. SINCRONIZAÇÃO

Criar sincronizador.

Exemplo:

```bash
pnpm sync:tse
```

O processo deve:

1. baixar dados;
2. validar;
3. normalizar;
4. verificar inconsistências;
5. atualizar banco;
6. registrar data;
7. registrar fonte;
8. gerar relatório.

Nunca substituir dados válidos por dataset inválido.

Preferir atualização transacional/atômica.

---

# 63. FALLBACK

Se a fonte oficial estiver temporariamente indisponível:

usar o último dataset válido.

Mostrar:

```text
Dados atualizados em DD/MM/YYYY.
```

Nunca fingir que os dados estão atuais.

---

# 64. METADADOS

Guardar:

- fonte;
- data de coleta;
- data de atualização;
- versão do dataset;
- quantidade de candidatos;
- erros;
- warnings.

---

# 65. API

Criar, quando necessário:

```text
GET /api/states
GET /api/offices
GET /api/candidates
GET /api/metadata
```

Os endpoints finais podem ser ajustados conforme a implementação.

Não criar endpoints desnecessários.

---

# 66. API — PRINCÍPIOS

As funções API devem:

- validar entrada;
- retornar HTTP status apropriado;
- ter respostas tipadas;
- tratar erros;
- evitar vazamento de informações;
- utilizar cache quando apropriado;
- não depender de estado local da função;
- não expor credenciais;
- não expor diretamente o banco.

---

# 67. FILTROS

Carregar candidatos conforme necessário.

Exemplo:

```text
estado
+
cargo
+
situação
```

Não carregar todos os candidatos do Brasil no primeiro carregamento.

---

# 68. CACHE

Utilizar cache onde fizer sentido:

- estados;
- cargos;
- candidatos;
- metadata.

Respeitar a necessidade de atualização dos dados.

Nunca servir dados indefinidamente sem documentar a política de cache.

---

# 69. PERFORMANCE

Priorizar:

- lazy loading;
- cache;
- imagens otimizadas;
- carregamento sob demanda;
- code splitting;
- compressão;
- bundle pequeno;
- JavaScript mínimo necessário.

---

# 70. IMAGENS

Otimizar fotografias.

Usar:

- dimensões adequadas;
- lazy loading quando apropriado;
- fallback;
- alt text apropriado.

Não permitir que imagem quebrada destrua o layout.

---

# 71. STACK FRONTEND

Utilizar:

```text
React
TypeScript
Vite
Tailwind CSS
Zustand
React Router
Framer Motion
```

TypeScript strict.

---

# 72. STACK BACKEND

Utilizar:

```text
Vercel Serverless Functions
TypeScript
PostgreSQL
```

Não adicionar framework HTTP separado sem necessidade.

---

# 73. TESTES

Utilizar:

```text
Vitest
React Testing Library
Playwright
axe-core
```

---

# 74. TOOLING

Utilizar:

```text
ESLint
Prettier
Docker opcional para desenvolvimento local
```

Docker não deve ser obrigatório para o deployment da Vercel.

---

# 75. ESTRUTURA DO PROJETO

Preferir estrutura simples:

```text
simulador-urna-eletronica-brasil/
│
├── src/
│   ├── components/
│   ├── features/
│   ├── pages/
│   ├── domain/
│   ├── services/
│   ├── stores/
│   ├── hooks/
│   ├── styles/
│   └── ...
│
├── api/
│   ├── states.ts
│   ├── offices.ts
│   ├── candidates.ts
│   └── metadata.ts
│
├── scripts/
│   └── sync-tse/
│
├── public/
│
├── docs/
│
├── tests/
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json
└── README.md
```

Adaptar a estrutura quando necessário.

Não criar complexidade artificial.

---

# 76. SEPARAÇÃO DE RESPONSABILIDADES

Separar conceitualmente:

```text
UI
↓
Application
↓
Domain
↓
Infrastructure
```

A lógica de votação não deve depender diretamente de:

- React;
- DOM;
- API;
- PostgreSQL;
- áudio.

---

# 77. DESIGN SYSTEM

Criar tokens centralizados:

```text
urna-body
urna-screen
urna-key
urna-key-label
urna-confirm
urna-correct
urna-blank
urna-progress
urna-text
urna-secondary-text
```

Não espalhar valores pelo código.

---

# 78. COMPONENTES REUTILIZÁVEIS

Criar componentes quando houver repetição real.

Exemplos:

```text
Button
Modal
FocusTrap
AccessibleText
FontSizeControl
ContrastControl
AudioControl
ProgressIndicator
Urna
UrnaPhysicalShell
UrnaDisplay
UrnaKeyboard
UrnaKey
CandidateView
VotingInstruction
```

Não criar abstrações sem necessidade.

---

# 79. ESTADO GLOBAL

Utilizar Zustand apenas para estado realmente global.

Possíveis slices:

```text
voting
accessibility
audio
preferences
```

Não criar uma store gigante.

---

# 80. PERSISTÊNCIA

Persistir somente preferências:

```text
font size
high contrast
audio enabled
voice enabled
volume
reduced motion preference
```

Não persistir dados pessoais.

---

# 81. PWA

Implementar:

- manifest;
- service worker;
- offline fallback;
- installability;
- ícones.

---

# 82. OFFLINE

O modo offline deve utilizar dados previamente sincronizados.

Não prometer dados atualizados quando estiver offline.

Mostrar data do dataset.

---

# 83. DEPLOY VERCEL

O projeto deve ser preparado para:

```text
GitHub
 ↓
Vercel
 ↓
Build
 ↓
Frontend + API
```

Um único deployment.

Configurar corretamente:

- build;
- output;
- funções API;
- variáveis de ambiente;
- PostgreSQL;
- cache;
- headers;
- rotas.

---

# 84. VARIÁVEIS DE AMBIENTE

Criar:

```text
.env.example
```

Nunca commitar `.env`.

Exemplo:

```env
DATABASE_URL=
TSE_DATA_SOURCE_URL=
```

Somente adicionar variáveis realmente necessárias.

---

# 85. VERCEL CONFIG

Criar `vercel.json` somente quando necessário.

Não adicionar configurações redundantes.

Garantir que:

```text
/api/*
```

seja corretamente tratado pelas Serverless Functions.

---

# 86. SEGURANÇA

Implementar:

- CORS apropriado;
- security headers;
- rate limiting quando necessário;
- input validation;
- sanitização;
- CSP quando apropriado;
- tratamento seguro de erros.

Nunca executar conteúdo arbitrário vindo de dados externos.

---

# 87. VALIDAÇÃO

Validar:

- números;
- cargos;
- IDs;
- filtros;
- parâmetros;
- dados externos.

Nunca confiar cegamente em fontes externas.

---

# 88. TESTES UNITÁRIOS

Testar:

- voting engine;
- número válido;
- número inválido;
- candidato;
- branco;
- corrige;
- confirma;
- progressão;
- finalização;
- áudio;
- preferências.

---

# 89. TESTES DE INTEGRAÇÃO

Testar:

```text
seleção do estado
→ carregamento de candidatos
→ votação
→ correção
→ confirmação
→ próximo cargo
→ finalização
```

---

# 90. TESTES E2E

Com Playwright:

```text
landing
→ começar
→ estado
→ modo
→ candidato
→ conferência
→ confirmar
→ próximo cargo
→ final
```

Testar também:

```text
número inválido
correção
voto branco
teclado físico
touch
acessibilidade
áudio
```

---

# 91. TESTES DE ACESSIBILIDADE

Executar axe-core.

Corrigir todas as violações críticas e sérias.

Testar:

- contraste;
- foco;
- labels;
- live regions;
- teclado;
- screen reader.

---

# 92. TESTE DE TECLADO

Garantir:

```text
Tab
Shift + Tab
Enter
Space
0–9
```

funcionem coerentemente.

Não impedir uso do teclado físico.

---

# 93. TESTE DE TOUCH

As teclas devem possuir tamanho confortável para pessoas idosas.

Evitar:

- botões pequenos;
- áreas ambíguas;
- elementos próximos demais.

---

# 94. REVISÃO COM FOCO EM IDOSOS

Simular uma pessoa de 70+ anos:

- pouca familiaridade tecnológica;
- dificuldade de leitura;
- medo de errar;
- nunca utilizou urna.

Perguntar:

> Ela sabe o que fazer?

> Ela sabe onde clicar?

> Ela entende o número digitado?

> Ela percebe quando errou?

> Ela sabe usar CORRIGE?

> Ela sabe quando pode CONFIRMAR?

> Ela consegue utilizar BRANCO?

> Ela sabe em qual etapa está?

> Ela consegue ouvir as instruções?

> Ela consegue aumentar a fonte?

> Ela consegue ativar alto contraste?

> Ela consegue completar a simulação sem ajuda?

Se não:

simplificar.

---

# 95. MICROCOPY

A linguagem deve ser:

- brasileira;
- clara;
- curta;
- acolhedora;
- não infantilizada;
- sem linguagem técnica.

Evitar frases longas.

---

# 96. FEEDBACK

Toda ação importante deve produzir pelo menos:

```text
feedback visual
ou
feedback sonoro
ou
voz
```

Preferencialmente mais de um.

Nunca depender exclusivamente de cor.

---

# 97. FINAL DA SIMULAÇÃO

Após completar todas as etapas:

```text
SIMULAÇÃO CONCLUÍDA

Você terminou o treinamento.

Agora você já conhece o processo
de votação na urna eletrônica.

[ TREINAR NOVAMENTE ]

[ VOLTAR AO INÍCIO ]
```

Não mostrar resultado eleitoral.

Não transformar a simulação em eleição real.

---

# 98. DADOS DA SIMULAÇÃO

A aplicação não deve enviar a escolha do usuário para terceiros.

Não criar banco de votos.

Não armazenar votos no servidor.

A simulação deve permanecer local do ponto de vista das escolhas do usuário.

---

# 99. ANALYTICS

Para o MVP:

**não implementar analytics invasivo.**

Se futuramente for necessário:

- anonimizado;
- opcional;
- documentado;
- sem registrar votos;
- sem dados pessoais.

---

# 100. FONTES

Criar área:

```text
/fontes
```

Mostrar:

- fontes oficiais;
- data de atualização;
- metodologia;
- disclaimer;
- origem dos candidatos;
- informações sobre o projeto.

---

# 101. DIREITOS AUTORAIS

Não copiar automaticamente:

- fotografias;
- logos;
- SVGs oficiais;
- assets proprietários;
- imagens protegidas;
- sons oficiais.

A referência visual pode orientar uma implementação própria.

Antes de redistribuir qualquer asset:

verificar licença.

---

# 102. REFERÊNCIAS VISUAIS

Criar:

```text
docs/references/
```

Documentar:

```text
URL
Fonte
Modelo
Data
Observações
```

Não necessariamente commitar imagens protegidas.

---

# 103. README

O README deve conter:

- visão;
- objetivo;
- público;
- screenshots quando disponíveis;
- stack;
- arquitetura;
- instalação;
- desenvolvimento;
- testes;
- sincronização TSE;
- build;
- deploy Vercel;
- variáveis de ambiente;
- PostgreSQL;
- PWA;
- acessibilidade;
- fontes;
- disclaimer;
- licença.

---

# 104. GIT

Fazer commits pequenos e semânticos.

Exemplos:

```text
chore: initialize project
docs: document electoral research
docs: document urna visual reference
feat: add design system
feat: create urna physical shell
feat: create urna display
feat: implement urna keyboard
feat: implement voting engine
feat: integrate candidate data
feat: add audio feedback
feat: add voice guidance
feat: add accessibility controls
feat: add pwa support
feat: add vercel api
feat: add tse synchronization
test: add voting flow e2e
docs: document deployment
```

---

# 105. CHECKPOINTS

Após cada grande fase:

1. executar testes;
2. executar lint;
3. executar typecheck;
4. verificar build;
5. revisar visualmente;
6. corrigir problemas;
7. fazer commit.

---

# 106. FASES DE IMPLEMENTAÇÃO

## FASE 1 — RESEARCH

Pesquisar:

- TSE;
- interface 2026;
- modelos físicos;
- ordem dos cargos;
- candidatos;
- dados;
- áudio;
- acessibilidade.

Criar documentação.

---

## FASE 2 — FOUNDATION

Criar:

- React;
- TypeScript;
- Vite;
- Tailwind;
- estrutura;
- lint;
- prettier;
- testes.

---

## FASE 3 — DESIGN SYSTEM

Criar:

- tokens;
- tipografia;
- componentes;
- acessibilidade;
- estados.

---

## FASE 4 — URNA VISUAL

Construir:

```text
UrnaPhysicalShell
UrnaDisplay
UrnaKeyboard
UrnaKey
```

Priorizar fidelidade visual.

---

## FASE 5 — LANDING

Criar:

- primeira tela;
- CTA;
- explicação;
- disclaimer.

---

## FASE 6 — ESTADO + MODO

Criar:

- seleção de estado;
- Modo Aprender;
- Modo Simulação;
- Modo Demonstração.

---

## FASE 7 — VOTING ENGINE

Implementar:

- cargos;
- ordem;
- número;
- candidato;
- branco;
- corrige;
- confirma;
- progresso;
- finalização.

---

## FASE 8 — DADOS

Implementar:

```text
TSE
→ validation
→ normalization
→ PostgreSQL
→ Vercel API
→ React
```

---

## FASE 9 — ÁUDIO

Implementar:

- AudioService;
- efeitos;
- volume;
- voz;
- preferências;
- fallback.

---

## FASE 10 — ACESSIBILIDADE

Implementar:

- WCAG;
- fonte;
- contraste;
- teclado;
- screen reader;
- reduced motion;
- áudio;
- voz.

---

## FASE 11 — PWA

Implementar:

- manifest;
- service worker;
- offline;
- installability.

---

## FASE 12 — DEPLOY

Configurar:

- Vercel;
- API;
- PostgreSQL;
- variáveis;
- build;
- domínio;
- headers.

---

## FASE 13 — TESTES

Implementar:

- unit;
- integration;
- E2E;
- accessibility.

---

## FASE 14 — PERFORMANCE

Revisar:

- bundle;
- imagens;
- API;
- cache;
- carregamento;
- responsividade.

---

## FASE 15 — POLISH

Revisar:

- visual;
- animações;
- áudio;
- UX;
- acessibilidade;
- textos;
- erros.

---

## FASE 16 — DOCUMENTAÇÃO

Finalizar:

- README;
- research;
- arquitetura;
- fontes;
- áudio;
- acessibilidade;
- referências;
- deploy.

---

# 107. COMANDOS FINAIS

Antes de considerar o projeto pronto:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

Todos devem passar.

Se algum comando não existir devido à arquitetura escolhida:

utilizar o equivalente e documentá-lo.

---

# 108. CHECKLIST FINAL — PRODUTO

```text
✓ React
✓ TypeScript
✓ Vite
✓ Tailwind CSS
✓ Frontend + backend no mesmo projeto
✓ API via Vercel Serverless Functions
✓ PostgreSQL externo
✓ Deploy único na Vercel
✓ Urna física interativa
✓ Tela baseada na interface 2026
✓ Teclado visual
✓ BRANCO
✓ CORRIGE
✓ CONFIRMA
✓ Estados pressionados
✓ Perspectiva
✓ Profundidade física
✓ Responsividade
✓ Dados oficiais
✓ Candidatos 2026
✓ API
✓ Sincronização
✓ Cache
✓ Fallback
✓ Modo Aprender
✓ Modo Simulação
✓ Modo Demonstração
✓ Voting Engine
✓ Barra de progresso
✓ Áudio
✓ Voz
✓ Controle de volume
✓ Alto contraste
✓ Fonte ajustável
✓ Keyboard navigation
✓ Screen reader
✓ Reduced motion
✓ PWA
✓ Testes unitários
✓ Testes de integração
✓ Playwright
✓ axe-core
✓ README
✓ Documentação
✓ Disclaimer
✓ Neutralidade política
✓ Privacidade
```

---

# 109. CHECKLIST FINAL — FIDELIDADE VISUAL

```text
✓ Gabinete baseado em referência real
✓ Tela posicionada corretamente
✓ Proporção visual coerente
✓ Teclado visualmente coerente
✓ Teclas numéricas posicionadas corretamente
✓ BRANCO em posição coerente
✓ CORRIGE em posição coerente
✓ CONFIRMA em posição coerente
✓ Tamanho relativo das teclas
✓ Espaçamento das teclas
✓ Profundidade das teclas
✓ Pressed state
✓ Moldura da tela
✓ Hierarquia da interface
✓ Tipografia 2026
✓ Barra de progresso
✓ Layout da tela
✓ Fluxo da votação
```

Objetivo:

### Nível 1 — Reconhecimento

O usuário reconhece imediatamente uma urna brasileira.

### Nível 2 — Composição

Tela, gabinete, teclado e botões possuem posição relativa coerente.

### Nível 3 — Detalhes

Proporções, tipografia, espaçamento, cores, sombras e estados possuem alta fidelidade visual.

---

# 110. CHECKLIST FINAL — UX PARA IDOSOS

```text
✓ textos grandes
✓ botões grandes
✓ linguagem simples
✓ alto contraste
✓ feedback visual
✓ feedback sonoro
✓ orientação por voz
✓ foco visível
✓ mensagens claras
✓ correção simples
✓ confirmação clara
✓ progresso visível
✓ sem menus complexos
✓ sem dados pessoais
✓ sem publicidade
✓ sem distrações
```

---

# 111. REGRAS DE DECISÃO

Quando houver dúvida:

## Comportamento da urna

Pesquisar fonte oficial.

## Interface 2026

Priorizar referência oficial de 2026.

## Candidatos

Utilizar fonte oficial.

## Sons

Verificar licença antes de copiar.

## Imagens

Verificar licença antes de redistribuir.

## UX

Priorizar simplicidade e acessibilidade.

## Arquitetura

Preferir a solução mais simples que preserve qualidade e seja adequada à Vercel.

---

# 112. NÃO INVENTAR

Nunca inventar:

- candidatos;
- números;
- partidos;
- cargos;
- ordem;
- comportamento da urna;
- mensagens oficiais;
- sons oficiais;
- APIs;
- endpoints;
- dados.

Quando uma informação não estiver disponível:

documentar a limitação.

---

# 113. NÃO PARAR EM MOCKUP

Não entregar apenas:

```text
landing page
+
mockup da urna
```

O resultado precisa possuir um fluxo funcional.

O usuário deve conseguir:

```text
abrir
→ iniciar
→ escolher estado
→ escolher modo
→ votar
→ corrigir
→ votar em branco
→ confirmar
→ avançar
→ concluir
```

---

# 114. QUALIDADE DO CÓDIGO

O código deve ser:

- legível;
- modular;
- tipado;
- testável;
- documentado quando necessário;
- sem duplicação desnecessária;
- sem hacks frágeis;
- sem valores mágicos espalhados.

Evitar overengineering.

---

# 115. QUALIDADE VISUAL

Antes de finalizar:

abrir a aplicação no navegador.

Não confiar somente em testes automatizados.

Verificar:

- desktop;
- notebook;
- tablet;
- celular.

Observar especialmente:

- proporções da urna;
- tamanho da tela;
- posição do teclado;
- tamanho das teclas;
- textos;
- barra de progresso;
- fotografia;
- estados de erro;
- estados de confirmação.

---

# 116. REVISÃO FINAL

Faça uma revisão como:

### Engenheiro

A arquitetura está correta?

### Designer

A urna realmente parece uma urna?

### Especialista em acessibilidade

Uma pessoa idosa consegue utilizar?

### QA

É possível quebrar o fluxo?

### Pesquisador

As informações de 2026 estão corretas?

### DevOps

O projeto pode ser publicado na Vercel como uma única aplicação?

### Usuário

Eu saberia o que fazer sem ninguém me explicar?

Corrija todos os problemas encontrados.

---

# 117. REGRA FINAL

Não peça confirmação para cada decisão pequena.

Tome decisões técnicas razoáveis.

Pesquise quando houver dúvida factual.

Documente decisões importantes.

Faça o projeto evoluir incrementalmente.

Não entregue um protótipo superficial.

Construa uma aplicação realmente utilizável.

---

# 118. RESULTADO ESPERADO

Ao final, o repositório:

```text
rafaelxulipa/simulador-urna-eletronica-brasil
```

deve conter uma aplicação open source profissional capaz de oferecer uma experiência educativa da urna eletrônica brasileira das Eleições 2026.

A experiência deve combinar:

```text
Fidelidade visual
+
Fidelidade funcional
+
Acessibilidade
+
Áudio
+
Voz
+
Dados oficiais
+
Privacidade
+
Neutralidade
+
Performance
+
Qualidade técnica
+
Deploy simples na Vercel
```

A prioridade máxima é:

> permitir que uma pessoa idosa pratique a votação com segurança e confiança antes de utilizar uma urna real.

---

# 119. COMECE AGORA

Primeiro:

```bash
pwd
git status
git remote -v
ls -la
```

Depois:

1. confirmar o repositório;
2. pesquisar as fontes oficiais;
3. documentar a pesquisa;
4. documentar a referência visual da urna 2026;
5. definir a arquitetura;
6. verificar a melhor estratégia de dados TSE;
7. apresentar um breve plano de execução;
8. começar a implementação;
9. testar continuamente;
10. corrigir problemas;
11. preparar o deploy na Vercel;
12. finalizar o produto funcional.

## IMPORTANTE

Não pare após criar o plano.

Depois da pesquisa inicial e do plano, **comece efetivamente a implementar o projeto**.

Quando encontrar uma informação factual necessária sobre Eleições 2026, não adivinhe.

Pesquise.

Quando encontrar uma decisão técnica, escolha a solução mais simples, sustentável e adequada à arquitetura de projeto único + Vercel.

Quando terminar uma fase, teste antes de avançar.

# CONSTRUA O PRODUTO COMPLETO.