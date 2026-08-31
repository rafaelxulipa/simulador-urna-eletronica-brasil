# PRD — Treine seu Voto

## 1. Visão do produto

### Nome provisório

**Treine seu Voto**

### Subtítulo

> Simulador educativo da urna eletrônica brasileira.

### Proposta

Criar uma aplicação web educativa, acessível e extremamente simples de usar, desenvolvida em React, que permita às pessoas praticarem o processo de votação da urna eletrônica brasileira antes de uma eleição.

O produto deve ser especialmente pensado para:

* pessoas idosas;
* pessoas com pouca familiaridade com tecnologia;
* pessoas que nunca votaram;
* pessoas que têm receio de apertar a tecla errada;
* pessoas que desejam treinar o processo de votação;
* familiares, professores e instituições que desejem ensinar o processo eleitoral.

O produto deve simular o processo de votação de maneira visual, interativa, sonora e acessível.

---

# 2. Objetivo principal

O objetivo não é ensinar em quem votar.

O objetivo é ensinar:

> **como votar.**

O usuário deve terminar a experiência sabendo:

1. qual número deve digitar;
2. como usar o teclado;
3. como identificar o candidato;
4. como conferir o voto;
5. como corrigir uma votação;
6. como votar em branco;
7. como confirmar;
8. como avançar para o próximo cargo;
9. como identificar que a votação terminou.

---

# 3. Princípios do produto

O produto deve seguir estes princípios:

### 3.1 Simplicidade

A pessoa deve conseguir utilizar o sistema sem qualquer treinamento prévio.

### 3.2 Acessibilidade

A interface deve ser confortável para pessoas idosas e pessoas com baixa visão.

### 3.3 Fidelidade funcional

O fluxo deve reproduzir corretamente o processo da urna, sem inventar comportamentos.

### 3.4 Neutralidade

A aplicação não pode recomendar, favorecer ou avaliar candidatos.

### 3.5 Transparência

Deixar absolutamente claro que:

> Esta é uma aplicação educativa independente e não é o sistema oficial do TSE.

### 3.6 Privacidade

Nenhuma informação pessoal do usuário deve ser necessária para realizar a simulação.

Não solicitar:

* CPF;
* título de eleitor;
* nome;
* endereço;
* zona eleitoral;
* seção eleitoral.

---

# 4. Público-alvo

## Primário

Pessoas idosas que desejam aprender ou praticar a votação.

## Secundário

* familiares ensinando pais e avós;
* professores;
* escolas;
* projetos sociais;
* instituições para terceira idade;
* organizações de inclusão digital;
* eleitores que nunca utilizaram uma urna.

---

# 5. Experiência principal

A aplicação deve ter uma experiência extremamente direta.

Fluxo:

```text
Landing Page
    ↓
Escolher estado
    ↓
Escolher modo
    ↓
Introdução
    ↓
Presidente
    ↓
Governador
    ↓
Senador
    ↓
Deputado Federal
    ↓
Deputado Estadual/Distrital
    ↓
Finalização
    ↓
Resumo da experiência
```

A ordem e os cargos devem ser validados com os dados/regras oficiais das Eleições 2026 antes de serem considerados definitivos.

O sistema deve permitir configurar a ordem dos cargos por meio de configuração, e não deixar isso hardcoded espalhado pelo código.

---

# 6. Landing Page

A página inicial deve ser visualmente impactante.

## Requisito

A primeira tela deve ocupar praticamente:

```text
100vw × 100vh
```

Deve apresentar uma representação visual grande e elegante de uma urna eletrônica brasileira.

A urna deve ser o elemento principal da página.

### Conteúdo

```text
TREINE SEU VOTO

Aprenda a usar a urna eletrônica
com calma e segurança.

[ COMEÇAR SIMULAÇÃO ]
```

Também deve existir uma pequena informação:

> Simulador educativo independente. Não é uma aplicação oficial do TSE.

### Botão secundário

```text
COMO FUNCIONA?
```

Esse botão abre uma explicação extremamente simples.

---

# 7. Visual da urna

A aplicação não deve simplesmente colocar uma foto da urna como background.

Criar uma representação digital da urna utilizando HTML/CSS/SVG e componentes React.

A composição deve possuir:

* gabinete;
* tela;
* teclado numérico;
* tecla CORRIGE;
* tecla CONFIRMA;
* tecla BRANCO;
* elementos visuais realistas;
* estados de pressionamento;
* animações discretas;
* feedback visual.

A implementação deve ser responsiva.

Desktop:

```text
urna grande centralizada
```

Tablet:

```text
urna ocupando grande parte da tela
```

Mobile:

```text
urna adaptada verticalmente
```

---

# 8. Interface da urna

A interface deve ser inspirada na experiência real da urna brasileira, mas não deve alegar ser uma cópia oficial.

Considerar as mudanças anunciadas para as Eleições 2026, incluindo:

* maior legibilidade;
* tipografia acessível;
* telas renovadas;
* barra de progresso;
* melhor organização visual.

A fonte principal deve priorizar legibilidade.

Pesquisar e validar a tipografia oficial utilizada na interface de 2026 antes de implementar.

---

# 9. Dados dos candidatos

O sistema deve utilizar dados oficiais dos candidatos das Eleições 2026 sempre que esses dados estiverem disponíveis publicamente pelo TSE.

Não criar candidatos fictícios como comportamento padrão.

A arquitetura deve separar:

```text
CandidateDataProvider
```

da interface.

Exemplo:

```typescript
interface Candidate {
  id: string
  name: string
  ballotName: string
  number: string
  party: string
  partyName?: string
  office: Office
  state: string
  photoUrl?: string
  status?: string
}
```

A estrutura real deve ser adaptada aos campos efetivamente fornecidos pelo TSE.

---

# 10. Fonte dos dados

O sistema deve utilizar fontes oficiais do TSE/Dados Abertos sempre que possível.

O desenvolvimento deve começar com uma investigação dos recursos disponíveis para as Eleições 2026.

O sistema deve:

1. identificar os datasets oficiais;
2. identificar os formatos disponíveis;
3. identificar atualização;
4. identificar fotos;
5. identificar candidatos por UF;
6. identificar cargos;
7. identificar números;
8. identificar partidos;
9. verificar situação da candidatura;
10. documentar a fonte.

Nunca depender de scraping frágil de páginas HTML se existir uma fonte estruturada oficial.

---

# 11. Arquitetura de dados

Não fazer o navegador baixar arquivos gigantes diretamente do TSE.

Arquitetura recomendada:

```text
TSE
 ↓
Data ingestion
 ↓
Validation
 ↓
Normalization
 ↓
Database / generated dataset
 ↓
API
 ↓
React
```

O frontend deve consumir uma API própria.

---

# 12. Backend

Preferência:

```text
Node.js
TypeScript
Fastify
PostgreSQL
```

O backend deve possuir endpoints similares a:

```text
GET /api/health

GET /api/elections

GET /api/elections/:year/states

GET /api/elections/:year/candidates

GET /api/elections/:year/candidates?state=PE

GET /api/elections/:year/candidates?state=PE&office=PRESIDENT

GET /api/elections/:year/metadata
```

Os endpoints devem ser adaptados conforme a estrutura real dos dados.

---

# 13. Atualização dos candidatos

Criar um mecanismo de sincronização.

Exemplo:

```text
scripts/
  sync-tse/
```

O processo deve:

1. baixar dados oficiais;
2. validar;
3. normalizar;
4. detectar alterações;
5. atualizar o banco;
6. registrar timestamp;
7. registrar fonte;
8. produzir relatório.

Não apagar silenciosamente dados anteriores.

---

# 14. Estado da simulação

Utilizar uma máquina de estados clara.

Exemplo:

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
  | 'FINISHED'
```

Não espalhar lógica da votação por dezenas de componentes.

Criar um domínio centralizado:

```text
voting-engine/
```

---

# 15. Teclado

O teclado deve funcionar:

### Mouse

Clique.

### Touch

Toque.

### Teclado físico

Permitir:

```text
0-9
Enter
Backspace
Escape
```

Mapeamento:

```text
Enter → CONFIRMA
Backspace → CORRIGE
```

Os atalhos devem ser documentados e não podem interferir com acessibilidade.

---

# 16. Teclas

As teclas principais devem ter comportamento visual.

## Branco

Tecla branca.

## Corrige

Tecla laranja/amarela conforme referência visual validada.

## Confirma

Tecla verde.

Não utilizar cores apenas como indicador.

Cada tecla deve possuir:

* texto;
* aria-label;
* estado visual;
* feedback sonoro;
* estado disabled quando necessário.

---

# 17. Comportamento de confirmação

Depois que o número for digitado:

1. exibir candidato;
2. mostrar foto quando disponível;
3. mostrar nome;
4. mostrar número;
5. mostrar partido;
6. apresentar estado de conferência;
7. impedir confirmação durante o período obrigatório;
8. liberar confirmação;
9. permitir CORRIGE.

O comportamento real deve ser validado contra documentação oficial atualizada.

Importante:

Não implementar a falsa mensagem:

> "Confirma o seu voto"

A experiência deve respeitar o comportamento informado oficialmente pelo TSE.

---

# 18. Correção

Ao pressionar:

```text
CORRIGE
```

o sistema deve:

1. limpar a seleção;
2. retornar ao estado de digitação;
3. permitir nova entrada.

Mostrar feedback:

> Vamos tentar novamente.

Opcionalmente oferecer áudio:

> "Voto corrigido. Digite novamente."

---

# 19. Voto em branco

Ao pressionar:

```text
BRANCO
```

mostrar:

> VOTO EM BRANCO

E exigir confirmação.

Nunca pré-selecionar essa opção.

---

# 20. Número inválido

Se o número não existir:

Mostrar claramente:

```text
NÚMERO NÃO ENCONTRADO

Confira os números digitados.

[ CORRIGE ]
```

Feedback sonoro de erro.

Nunca apresentar uma mensagem agressiva ou alarmante.

---

# 21. Candidato identificado

Quando o número for válido:

```text
NOME DO CANDIDATO

12345

PARTIDO

[ FOTO ]
```

O layout deve privilegiar:

1. nome;
2. número;
3. cargo;
4. foto;
5. partido.

---

# 22. Barra de progresso

Utilizar a nova abordagem de progressão da urna de 2026.

Exemplo:

```text
● ━━━━━ ○ ━━━━━ ○ ━━━━━ ○ ━━━━━ ○
```

Ou equivalente visual acessível.

Além da representação visual, fornecer texto:

> Etapa 1 de 5 — Presidente

Nunca depender exclusivamente da cor.

---

# 23. Áudio

O áudio é requisito de primeira classe.

Criar um sistema:

```text
AudioService
```

ou:

```text
useAudioFeedback()
```

## Eventos

Criar sons para:

### Tecla numérica

Som curto.

### Tecla CORRIGE

Som diferente.

### Tecla CONFIRMA

Som de confirmação.

### Tecla BRANCO

Som específico.

### Número inválido

Som de erro.

### Candidato identificado

Som curto de sucesso.

### Avanço de cargo

Som de transição.

### Finalização

Som de conclusão.

---

# 24. Voz

Além dos efeitos sonoros, o sistema deve considerar orientação por voz.

Criar suporte para:

```text
SpeechSynthesis API
```

quando disponível.

Exemplos:

> "Presidente."

> "Digite o número da candidata ou do candidato."

> "Confira seu voto."

> "Voto confirmado."

> "Número não encontrado."

> "Votação encerrada."

A voz deve ser opcional.

---

# 25. Controle de áudio

No topo ou em área acessível:

```text
🔊 Som: ligado
```

Possibilidades:

```text
Som
Voz
Volume
```

O usuário deve conseguir desativar som e voz separadamente.

Preferência deve ser salva localmente.

---

# 26. Não copiar áudio oficial sem autorização

Antes de incluir qualquer arquivo de áudio oficial do TSE:

1. verificar licença;
2. verificar direitos;
3. verificar possibilidade de redistribuição;
4. documentar a fonte.

Se não houver autorização clara:

**não copiar os arquivos oficiais.**

Criar sons originais com finalidade educativa.

A aplicação nunca deve dizer:

> "Este é o som oficial da urna."

Se não for comprovadamente o arquivo oficial autorizado.

---

# 27. Acessibilidade

A aplicação deve seguir WCAG 2.2 AA como objetivo.

Implementar:

* alto contraste;
* foco visível;
* navegação por teclado;
* `aria-label`;
* `aria-live`;
* suporte a leitores de tela;
* tamanho de fonte ajustável;
* espaçamento adequado;
* alvos de toque grandes;
* redução de movimento;
* suporte a `prefers-reduced-motion`.

---

# 28. Modo acessível

Criar configuração:

```text
Modo de acessibilidade
```

Opções:

```text
Fonte maior
Contraste alto
Áudio
Instruções por voz
Animações reduzidas
```

---

# 29. Modo Aprender

Criar dois modos.

## MODO APRENDER

A interface ajuda a pessoa.

Exemplo:

```text
Agora vamos votar para PRESIDENTE.

Digite o número da candidata
ou do candidato.

Não se preocupe.
Você pode corrigir se errar.
```

Durante o processo, pequenas explicações aparecem.

---

# 30. Modo Simulação

## MODO SIMULAÇÃO

Sem explicações extras.

A pessoa deve tentar realizar o processo sozinha.

Ao final:

```text
SIMULAÇÃO CONCLUÍDA
```

---

# 31. Modo demonstração

Criar opcionalmente:

```text
VER COMO FUNCIONA
```

Esse modo demonstra a sequência sem exigir interação completa.

Útil para professores e familiares.

---

# 32. Resultado final

Depois da simulação:

```text
SIMULAÇÃO CONCLUÍDA!

Você terminou o treinamento.

✓ Presidente
✓ Governador
✓ Senador
✓ Deputado Federal
✓ Deputado Estadual/Distrital

Você pode treinar novamente quando quiser.

[ TREINAR NOVAMENTE ]

[ VOLTAR AO INÍCIO ]
```

Não mostrar "nota política".

---

# 33. Métricas

Não coletar dados pessoais.

Opcionalmente, localmente:

```text
tempo da simulação
quantidade de correções
quantidade de erros
quantidade de votos em branco
```

Essas métricas podem ser utilizadas para feedback educativo.

Exemplo:

> Você corrigiu 2 vezes. Isso é normal — na urna real você também pode corrigir antes de confirmar.

---

# 34. Privacidade

Por padrão:

* sem login;
* sem cadastro;
* sem cookies desnecessários;
* sem coleta de nome;
* sem CPF;
* sem título eleitoral;
* sem rastreamento invasivo.

Se analytics for futuramente implementado, deve ser opcional e documentado.

---

# 35. Neutralidade política

A aplicação deve ser estritamente neutra.

Não:

* recomendar candidato;
* ordenar candidatos por preferência;
* destacar candidatos;
* usar cores de partidos para favorecer alguém;
* incluir slogans;
* exibir propaganda;
* mostrar pesquisas;
* mostrar intenção de voto;
* comparar candidatos;
* mostrar avaliação política.

A ordem deve ser determinada pelos dados oficiais ou pela própria lógica da urna.

---

# 36. Identidade visual

Direção:

```text
Institucional
Educativa
Confiável
Brasileira
Acessível
Moderna
Minimalista
```

Evitar:

* estética gamer;
* excesso de gradientes;
* glassmorphism;
* neon;
* excesso de animação;
* visual infantilizado;
* excesso de ícones.

---

# 37. Responsividade

Breakpoints:

```text
Mobile
Tablet
Desktop
Large Desktop
```

A urna deve continuar sendo utilizável em:

```text
320px+
```

---

# 38. Performance

Objetivos:

* carregamento inicial rápido;
* lazy loading;
* imagens otimizadas;
* sons carregados sob demanda;
* candidatos carregados conforme UF/cargo;
* evitar bundle gigante.

---

# 39. Offline

O sistema deve considerar suporte PWA.

Objetivo:

Depois que os dados necessários forem carregados, permitir que a simulação continue funcionando mesmo com conexão instável.

Não é necessário garantir sincronização offline dos candidatos em tempo real.

---

# 40. PWA

Implementar:

```text
manifest
service worker
offline fallback
install prompt
```

Nome:

> Treine seu Voto

---

# 41. SEO

Criar landing page indexável.

Title:

> Treine seu Voto — Simulador Educativo da Urna Eletrônica

Description:

> Aprenda e pratique como votar na urna eletrônica brasileira com um simulador educativo, acessível e gratuito.

Adicionar:

* Open Graph;
* Twitter/X metadata;
* favicon;
* structured data quando apropriado.

---

# 42. Segurança

Implementar:

* validação de API;
* sanitização;
* rate limiting;
* CORS;
* headers de segurança;
* Content Security Policy quando possível;
* nenhuma execução de conteúdo vindo de candidatos;
* URLs de imagem validadas.

---

# 43. Disclaimer

A aplicação deve mostrar de forma clara:

> **Este é um simulador educativo independente. Não é uma aplicação oficial do Tribunal Superior Eleitoral (TSE) nem da Justiça Eleitoral.**

Também incluir:

> Os dados de candidatas e candidatos são obtidos de fontes públicas oficiais quando disponíveis e podem sofrer atualização.

---

# 44. Fontes oficiais

Criar página:

```text
/fontes
```

Mostrar:

* fonte dos dados;
* data da última sincronização;
* links para fontes oficiais;
* informações sobre o TSE;
* informações sobre o caráter independente da aplicação.

---

# 45. Arquitetura frontend

Preferência:

```text
React
TypeScript
Vite
Tailwind CSS
Zustand
React Router
```

Componentes:

```text
components/
  urna/
    Urna
    UrnaScreen
    NumericKeyboard
    ConfirmButton
    CorrectButton
    BlankButton
    ProgressIndicator

  voting/
    VotingFlow
    OfficeHeader
    CandidateDisplay
    InvalidCandidate
    VoteReview
    VoteConfirmed

  audio/
    AudioControls

  accessibility/
    AccessibilityPanel
```

---

# 46. Estado

Zustand.

Slices:

```text
simulationSlice
candidateSlice
audioSlice
accessibilitySlice
settingsSlice
```

Não criar um store gigantesco sem organização.

---

# 47. Testes

Obrigatório.

## Unit

Testar:

* validação de número;
* candidato encontrado;
* candidato inexistente;
* branco;
* correção;
* confirmação;
* mudança de cargo;
* finalização.

## Integration

Testar fluxo completo.

## E2E

Playwright.

Fluxo:

```text
abrir
→ começar
→ escolher estado
→ digitar candidato
→ conferir
→ confirmar
→ avançar
→ finalizar
```

---

# 48. Testes de acessibilidade

Utilizar:

```text
axe-core
```

ou equivalente.

Garantir:

* contraste;
* labels;
* foco;
* teclado;
* landmarks;
* leitores de tela.

---

# 49. Critérios de aceitação

O MVP será considerado concluído quando:

* [ ] Landing page fullscreen implementada.
* [ ] Urna digital responsiva implementada.
* [ ] Fluxo de votação implementado.
* [ ] Dados oficiais integrados.
* [ ] Seleção de estado implementada.
* [ ] Candidatos por cargo implementados.
* [ ] Teclado funcionando.
* [ ] CORRIGE funcionando.
* [ ] BRANCO funcionando.
* [ ] CONFIRMA funcionando.
* [ ] Número inválido funcionando.
* [ ] Barra de progresso implementada.
* [ ] Feedback visual implementado.
* [ ] Feedback sonoro implementado.
* [ ] Voz opcional implementada.
* [ ] Modo Aprender implementado.
* [ ] Modo Simulação implementado.
* [ ] Acessibilidade implementada.
* [ ] PWA implementado.
* [ ] Testes unitários implementados.
* [ ] Testes E2E implementados.
* [ ] Disclaimer implementado.
* [ ] Página de fontes implementada.
* [ ] README completo.
* [ ] `.env.example`.
* [ ] Docker para desenvolvimento.
* [ ] Build de produção funcionando.
* [ ] Lint funcionando.
* [ ] TypeScript sem erros.

---

# 50. Definição de pronto

O projeto não deve ser considerado pronto apenas porque "abre no navegador".

Definition of Done:

```text
Código
✓ TypeScript
✓ lint
✓ build

UX
✓ desktop
✓ tablet
✓ mobile

Acessibilidade
✓ keyboard
✓ screen reader
✓ contrast
✓ focus

Dados
✓ fonte oficial documentada
✓ sincronização funcionando

Simulação
✓ fluxo completo

Áudio
✓ feedback
✓ voz opcional

Testes
✓ unit
✓ integration
✓ E2E

Deploy
✓ produção
✓ PWA
```

---

# 51. Fora do escopo do MVP

Não implementar inicialmente:

* login;
* perfil;
* rede social;
* comentários;
* propaganda;
* pesquisas eleitorais;
* notícias políticas;
* comparação de candidatos;
* recomendação de candidatos;
* votação real;
* integração com título eleitoral;
* armazenamento de votos reais.

---

# 52. Futuras versões

Possíveis versões:

### V2

* Libras;
* tutoriais em vídeo;
* modo para professores;
* modo "ensine seus pais";
* impressão de certificado de treinamento.

### V3

* instalação em computadores de instituições;
* modo kiosk;
* pacote offline;
* suporte para escolas;
* múltiplos idiomas.

---

# 53. Métrica principal

A métrica mais importante não deve ser quantidade de usuários.

É:

> **Percentual de usuários que conseguem completar uma simulação sem assistência.**

Métricas secundárias:

* tempo médio;
* número de correções;
* número de erros;
* abandono;
* uso do modo aprender;
* uso do áudio.
