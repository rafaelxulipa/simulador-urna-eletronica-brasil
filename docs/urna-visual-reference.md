# Referência Visual — Urna Eletrônica (Eleições 2026)

Documento de pesquisa que embasa a implementação visual do componente `Urna` do simulador "Treine Seu Voto". Todas as consultas abaixo foram feitas em **31/08/2026**, priorizando fontes oficiais do TSE e da Justiça Eleitoral.

---

### Modelos físicos em uso em 2026

- Fonte: TSE — Comunicação
- URL: https://www.tse.jus.br/comunicacao/noticias/2026/Agosto/veja-os-modelos-de-urna-que-serao-utilizados-nas-eleicoes-gerais-2026
- Data da consulta: 2026-08-31
- Informação encontrada: quatro modelos estarão em operação nas Eleições 2026 — **UE2022** (217.145 unidades), **UE2020** (222.323), **UE2015** (95.065) e **UE2013** (29.377). UE2022 e UE2020 juntos representam 77% do total. UE2022 (fabricada em 2023) é tecnicamente quase idêntica à UE2020 (fabricada em 2021), com pequenas diferenças de gabinete. A nova geração (UE2020/UE2022) trouxe teclado sensível ao toque e maior capacidade de processamento (18x a UE2015). O TSE desmentiu boatos de um novo modelo (UE2028) para 2026 — esse só entra em operação em 2028.
- Decisão tomada: usar a **UE2020/UE2022** como referência visual principal do componente `UrnaPhysicalShell`, por serem os modelos mais recentes e mais representativos (77% do parque em 2026). Não modelar UE2028 (inexistente em 2026).
- Impacto no produto: gabinete de referência é o formato "moderno" (UE2020/2022) — mais compacto e anguloso que os modelos antigos (UE2013/2015). Arquitetura do componente deve permitir trocar de referência futuramente (ver seção "Modelos alternativos" abaixo).

---

### Nova interface 2026 — visão geral

- Fonte: TSE — Comunicação
- URL: https://www.tse.jus.br/comunicacao/noticias/2026/Agosto/urna-eletronica-ganha-nova-interface-para-tornar-votacao-mais-acessivel-e-intuitiva
- Data da consulta: 2026-08-31
- Informação encontrada: a Justiça Eleitoral redesenhou as telas da urna para 2026 com foco em acessibilidade, com base em dificuldades identificadas em eleições anteriores. Mudanças: nova tipografia (Atkinson Hyperlegible), barra de progresso fixa no topo da tela, telas redesenhadas, ampliação da interpretação em Libras (agora cobrindo também voto em branco, voto nulo e voto de legenda — antes limitada à identificação do cargo). Público beneficiado citado explicitamente: pessoas com deficiência visual, eleitores idosos, pessoas com pouca familiaridade com tecnologia digital — exatamente o público-alvo do simulador. Estudantes da USP contribuíram com propostas de acessibilidade que informaram parte dessas mudanças.
- Decisão tomada: adotar integralmente essas quatro mudanças como base da interface do simulador (tipografia, barra de progresso, telas redesenhadas, cobertura de Libras mais ampla — Libras fica documentada para versão futura, ver `docs/accessibility.md`).
- Impacto no produto: confirma que o público-alvo do TSE para o redesign 2026 é o mesmo público-alvo do PRD deste projeto — reforça a escolha de priorizar legibilidade e simplicidade acima de qualquer estética.

---

### Tipografia — Atkinson Hyperlegible

- Fonte: Poder360 (citando TSE)
- URL: https://www.poder360.com.br/poder-eleicoes-2026/urna-eletronica-para-2026-tera-nova-fonte-e-mais-acessibilidade/
- Data da consulta: 2026-08-31
- Informação encontrada: confirmado oficialmente — a urna eletrônica 2026 usa a fonte **Atkinson Hyperlegible**, desenvolvida pelo Braille Institute especificamente para acessibilidade de pessoas com baixa visão. O funcionário público entrevistado (Silvio Trindade) relatou que a fonte tornou "os caracteres mais definidos". TSE atribui a escolha ao contraste, espaçamento e definição dos caracteres.
- Decisão tomada: usar **Atkinson Hyperlegible** (open source, SIL Open Font License) como fonte principal de toda a aplicação, não só da tela da urna — conforme item 54 do PROMPT-INICIAL.md. Fonte será carregada via `@fontsource/atkinson-hyperlegible` ou self-hosted (nunca CDN de terceiros não confiável).
- Impacto no produto: elimina qualquer dúvida sobre a tipografia — não é necessário avaliar alternativas.

---

### Barra de progresso

- Fonte: Poder360 (citando Rodrigo Coimbra, TSE) + TSE Comunicação
- URL: https://www.poder360.com.br/poder-eleicoes-2026/urna-eletronica-tera-barra-de-progresso-nas-eleicoes-de-2026/
- Data da consulta: 2026-08-31
- Informação encontrada: barra de progresso fixa **na parte superior da tela**, funciona como "guia visual durante a votação", mostrando quais cargos já foram votados e quais faltam. As fontes não descrevem o desenho exato (pontos, linhas, números) nem uma frase padrão tipo "Etapa X de Y" — esse detalhe visual específico não é público.
- Decisão tomada: implementar uma barra de progresso fixa no topo do `UrnaDisplay` com 6 marcadores (um por cargo), indicando estado concluído/atual/pendente por **forma + texto**, não só cor (ex.: ✓ para concluído, ● preenchido para atual, ○ vazio para pendente), acompanhada de texto textual "Etapa X de 6 — [Cargo]" para leitores de tela, já que a redação exata oficial não está disponível publicamente. É uma reconstrução própria, não uma cópia pixel-a-pixel.
- Impacto no produto: como o desenho exato não é documentado publicamente, o componente `ProgressIndicator` é uma interpretação própria fiel ao comportamento descrito, não uma réplica certificada.

---

### Layout do teclado numérico

- Fonte: Justiça Eleitoral (via busca — página oficial retornou 403 ao fetch direto, conteúdo consolidado a partir de snippets indexados) + conhecimento histórico consistente desde a UE96
- URL: https://www.justicaeleitoral.jus.br/urna-eletronica/detalhes-tecnicos-da-urna.html
- Data da consulta: 2026-08-31
- Informação encontrada: teclado numérico com disposição **igual à de um telefone** (3 colunas x 4 linhas: 1-2-3 / 4-5-6 / 7-8-9 / tecla especial-0-tecla especial), escolhida deliberadamente pela familiaridade da população. Teclas numéricas em preto, com Braille em relevo (a tecla 5 tem marcação tátil de referência para localizar as demais, seguindo o padrão de teclados telefônicos). Há confirmação sonora (clique) a cada tecla pressionada. Três teclas maiores e coloridas para as funções especiais: **BRANCO** (branca), **CORRIGE** (laranja), **CONFIRMA** (verde) — dispostas abaixo/ao lado do teclado numérico. Esse padrão de disposição telefone-símile é consistente desde a primeira urna (UE96, 1996) até os modelos atuais.
- Decisão tomada: `UrnaKeyboard` replica o grid 3x4 do teclado telefônico (1-2-3/4-5-6/7-8-9/CORRIGE-0-CONFIRMA, com BRANCO como tecla adicional destacada, seguindo o posicionamento descrito). Cores: teclas numéricas em preto/cinza escuro com texto branco; BRANCO em branco/cinza claro com texto escuro; CORRIGE em laranja com texto branco; CONFIRMA em verde com texto branco. Estados (default/hover/focus/pressed/disabled) implementados via CSS com relevo e sombra.
- Impacto no produto: a paleta de cores das teclas especiais (branco/laranja/verde) segue diretamente a documentação oficial — não é uma escolha arbitrária de design.

---

### Correção a partir de fotos reais da UE2022 (atualização em 2026-08-31)

- Fonte: duas fotos reais fornecidas pelo usuário — (1) peça de campanha do TRE-PA para as Eleições 2026 mostrando a urna renderizada, (2) fotografia do gabinete físico de uma UE2022 real, tela exibindo "FIM / VOTOU", com o rótulo do modelo visível.
- Data da consulta: 2026-08-31
- Informação encontrada: duas suposições anteriores (baseadas em busca indexada, sem foto direta) estavam incorretas:
  1. **Cor do gabinete e da tela**: o gabinete é plástico **branco/cinza claro** (não escuro), e a tela mostra **fundo cinza claro com texto preto** (não azul com texto branco) — alto contraste, condizente com o foco de acessibilidade do redesenho 2026.
  2. **Layout do teclado**: BRANCO/CORRIGE/CONFIRMA formam uma **coluna vertical à direita** do teclado numérico (BRANCO no topo, CORRIGE no meio, CONFIRMA embaixo), alinhada às linhas 1-2-3/4-5-6/7-8-9 — e **não** uma linha inferior misturada com os números. O "0" fica sozinho, isolado abaixo do grid numérico.
  A paleta de cores das teclas especiais (branco/laranja/verde) e o formato geral do grid numérico (telefone, 3 colunas) já estavam corretos e foram confirmados pelas fotos.
- Decisão tomada: `src/index.css` ganhou tokens dedicados (`--color-urna-case`, `--color-urna-glass*`) para a cor real do gabinete/tela, separados dos tokens de tema escuro usados no restante do app (header, botões, landing page). `UrnaKeyboard.tsx` foi reestruturado: grid 3x3 de números + "0" isolado abaixo, com BRANCO/CORRIGE/CONFIRMA em coluna à parte.
- Impacto no produto: fidelidade visual do componente `Urna` corrigida para bater com o dispositivo real, não mais uma interpretação de segunda mão — a foto real é uma fonte mais forte que resultados de busca indexados.

---

### Layout da tela de conferência de voto (segunda rodada de fotos, 2026-08-31)

- Fonte: duas fotos adicionais fornecidas pelo usuário — (1) foto real da tela de confirmação de um pleito anterior (2018/2022, urna com marca "JUSTIÇA ELEITORAL" no gabinete, exibindo "SEU VOTO PARA / PRESIDENTE / Número: 17 / Nome: [candidato] / Partido: [partido]" com instrução "Aperta a tecla / VERDE: para CONFIRMAR / LARANJA: para CORRIGIR"), (2) render/gráfico de TV (Globo) do tipo "CONFIRA SEU VOTO" para Deputado Federal, mostrando `Número: X X X X`, `Nome:`, `Partido:`, uma linha divisória e o texto "CONFIRA SEU VOTO", com ícone de silhueta no canto superior direito.
- Data da consulta: 2026-08-31
- Informação encontrada: a tela real de conferência de candidato **não** é o layout centralizado em coluna única que o simulador tinha (foto grande no topo, número/nome/partido empilhados abaixo). O layout real é: bloco de texto alinhado à esquerda (`Número:`, `Nome:`, `Partido:`) com a foto/silhueta do candidato à direita, uma linha divisória, e a mensagem **"CONFIRA SEU VOTO"** como título abaixo da divisória — seguida de instrução explícita nomeando a cor de cada tecla ("VERDE: para CONFIRMAR", "LARANJA: para CORRIGIR"), reforçando a ação sem depender só da cor. As duas fotos, de gerações de urna diferentes (pré- e pós-redesenho), concordam nessa estrutura geral.
- Decisão tomada: `UrnaDisplay.tsx` (estado `SHOW_CANDIDATE`) foi reestruturado para o layout real: linhas `Número:`/`Nome:`/`Partido:` à esquerda, `CandidateAvatar` à direita, `<hr>`, título "CONFIRA SEU VOTO", e instrução nomeando as cores ("CONFIRMA (verde)" / "CORRIGE (laranja)"). O mesmo padrão de nomear a cor na instrução foi replicado nos estados BLANK e INVALID para consistência.
- Impacto no produto: a tela de revisão do candidato deixa de ser uma composição própria genérica e passa a refletir a estrutura real de informação da urna (rótulos de campo + divisória + instrução nomeada por cor).

---

### Trava de conferência do voto ("Confira seu voto")

- Fonte: NSC Total (reportagem sobre o mecanismo de trava de segurança)
- URL: https://www.nsctotal.com.br/politica/urna-eletronica-confira-seu-voto-eleicoes-2026
- Data da consulta: 2026-08-31
- Informação encontrada: ao digitar um número válido, a urna exibe a mensagem **"Confira seu voto"** no rodapé da tela por aproximadamente 1 segundo, período durante o qual a tecla CONFIRMA fica bloqueada (trava técnica — se pressionada durante o intervalo, o comando é simplesmente ignorado, sem cancelar a seleção). O eleitor deve conferir quatro informações antes de confirmar: (1) cargo em disputa, (2) número e nome digitados, (3) fotografia oficial do candidato, (4) partido e legenda/vice quando aplicável. Depois do bloqueio de 1s, a tecla CONFIRMA é liberada.
- Decisão tomada: reproduzir esse comportamento no `VotingEngine` — estado `CHECK_VOTE` bloqueia a tecla CONFIRMA (`disabled`) por ~1 segundo após exibir o candidato, com mensagem "Confira seu voto" visível, e só então transita para `WAIT_CONFIRM` (tecla habilitada). Não inventar timers maiores nem menores — usar exatamente o valor documentado (~1s).
- Impacto no produto: implementa fielmente a "trava" oficial mencionada no item 44 do PROMPT-INICIAL.md ("Não inventar timers. Pesquisar o comportamento real de 2026") — este é o comportamento real, com fonte.

---

### Ordem oficial dos cargos e vagas de Senador

- Fonte: Estado de Minas (Em.com.br), citando TSE
- URL: https://www.em.com.br/nacional/2026/08/7481954-eleicoes-2026-saiba-a-ordem-exata-de-votacao-na-urna-eletronica.html
- Data da consulta: 2026-08-31
- Informação encontrada: ordem oficial confirmada para 2026, do primeiro ao último cargo votado:
  1. Deputado Federal (4 dígitos)
  2. Deputado Estadual/Distrital (5 dígitos)
  3. Senador — 1ª vaga (3 dígitos)
  4. Senador — 2ª vaga (3 dígitos)
  5. Governador (2 dígitos)
  6. Presidente (2 dígitos)

  A lógica de design prioriza cargos legislativos primeiro (com mais dígitos), avançando para cargos executivos, terminando na Presidência. Confirma explicitamente que existem **duas vagas de Senador**, votadas como etapas distintas.
- Decisão tomada: usar exatamente essa sequência e quantidade de dígitos em `electionSequence` (config central, item 34 do PROMPT-INICIAL.md). `SENATOR_FIRST` e `SENATOR_SECOND` são etapas separadas, cada uma pedindo 3 dígitos.
- Impacto no produto: resolve de forma definitiva a dúvida levantada no item 33 do PROMPT-INICIAL.md — a ordem e a quantidade de dígitos por cargo agora têm fonte oficial confirmada e podem ser codificadas com confiança.

---

### Ampliação da Libras

- Fonte: TSE — Comunicação (mesma matéria da interface 2026)
- URL: https://www.tse.jus.br/comunicacao/noticias/2026/Agosto/urna-eletronica-ganha-nova-interface-para-tornar-votacao-mais-acessivel-e-intuitiva
- Data da consulta: 2026-08-31
- Informação encontrada: em 2026, a interpretação em Libras foi ampliada para cobrir também voto em branco, voto nulo e voto de legenda (antes cobria só a identificação do cargo). Não há detalhe técnico público sobre o formato do vídeo/avatar usado.
- Decisão tomada: **não implementar** um intérprete de Libras completo no MVP (não há recurso oficial reaproveitável e implementação própria de vídeo/avatar está fora do escopo atual). Documentar a arquitetura para permitir inclusão futura (ver item 57 do PROMPT-INICIAL.md e `docs/accessibility.md`).
- Impacto no produto: evita a armadilha de "inventar" uma implementação de Libras sem lastro oficial — fica registrado como limitação conhecida do MVP.

---

## Limitações desta pesquisa

- As páginas oficiais `tse.jus.br` e `justicaeleitoral.jus.br` bloquearam acesso direto (HTTP 403) às páginas de detalhes técnicos e ao manual completo da urna durante esta pesquisa; os dados técnicos de teclado/gabinete foram reconstruídos a partir de resultados de busca indexados (snippets) e do conhecimento consistente e documentado sobre o padrão da urna desde 1996, não de leitura direta da página. Recomenda-se nova tentativa de acesso direto (ou consulta ao PDF público "Tudo o que você sempre quis saber sobre a urna eletrônica brasileira", disponível no Wikisource) antes de finalizar dimensões exatas do gabinete.
- Não foi encontrada uma imagem/diagrama oficial com o desenho exato da barra de progresso (formato de marcadores, uso de números). A implementação do `ProgressIndicator` é uma interpretação própria fiel ao comportamento descrito, não uma cópia certificada.
- Não há confirmação pública do texto exato exibido para "número não encontrado" ou "voto em branco confirmado" — o microcopy desses estados no simulador é uma redação própria, alinhada ao tom institucional observado, e não uma transcrição oficial.

## Modelos alternativos (para arquitetura futura)

A UE2013 e a UE2015 (juntas ~23% do parque 2026) têm gabinete mais antigo. Se o produto evoluir para múltiplas referências visuais, o componente `UrnaPhysicalShell` deve aceitar uma prop de "geração" (`ue2020` como padrão) para permitir variações futuras sem reescrever o restante da árvore de componentes.
