# Áudio — Pesquisa e Decisões

Pesquisa sobre o recurso de áudio/voz da urna eletrônica oficial (TSE) e decisões para o `AudioService` do simulador **Treine Seu Voto**.

---

### Recurso oficial de áudio da urna (fones de ouvido)

- Fonte: Tribunal Superior Eleitoral — "Conheça os recursos da urna eletrônica para pessoas com deficiência"
- URL: https://www.tse.jus.br/comunicacao/noticias/2024/Junho/conheca-os-recursos-da-urna-eletronica-para-pessoas-com-deficiencia
- Data da consulta: 2026-08-31 (via cache de busca; fetch direto retornou HTTP 403 — TSE bloqueia fetch automatizado)
- Informação encontrada: Todas as urnas possuem recurso de áudio para eleitores com deficiência visual. Ao se identificar na seção, a pessoa comunica a deficiência aos mesários, que habilitam o recurso e entregam um fone de ouvido para uso dentro da cabine. O áudio informa o cargo em votação, os números digitados e o nome da candidatura escolhida.
- Decisão tomada: O simulador deve oferecer um equivalente **opcional e sempre disponível** (sem precisar solicitar a um mesário), ativável por um controle de voz na interface — já que aqui não há mesário real.
- Impacto no produto: `AudioService`/`useAudioFeedback()` deve anunciar cargo, número digitado e nome do candidato via `SpeechSynthesis`, replicando a função (não o áudio) do recurso oficial.

---

### Voz sintetizada oficial "Letícia" (RHVoice)

- Fonte: TechTudo — "Letícia: veja curiosidades e como testar a 'Alexa das urnas eletrônicas'"; TRE-RJ — "Novo recurso de áudio da urna eletrônica facilita a votação de deficientes visuais"
- URL: https://www.techtudo.com.br/noticias/2024/10/leticia-veja-curiosidades-e-como-testar-a-alexa-das-urnas-eletronicas-edinfoeletro.ghtml ; https://www.tre-rj.jus.br/comunicacao/noticias/2024/Agosto/novo-recurso-de-audio-da-urna-eletronica-facilita-a-votacao-de-deficientes-visuais
- Data da consulta: 2026-08-31
- Informação encontrada: A partir das Eleições Municipais de 2024, a urna usa a voz sintética "Letícia", criada a partir de +30h de gravação da atriz/cantora Sara Bentes (pessoa com deficiência visual), processada com o RHVoice (software livre de conversão texto-para-fala, criado por programadores cegos). A voz anuncia: instruções para começar a votação, o cargo em votação, os números digitados e o nome da candidatura escolhida.
- Decisão tomada: **Não copiar nem redistribuir a voz "Letícia"** — é um asset de voz específico do TSE, sem indicação de licença aberta para reuso por terceiros. O simulador usará a `SpeechSynthesis` API nativa do navegador (vozes do sistema operacional/navegador do usuário), com textos originais em português que cobrem a mesma função informativa (cargo, números digitados, nome do candidato, confirmação).
- Impacto no produto: Nunca rotular a voz do simulador como "a voz oficial da urna" ou "Letícia". Usar linguagem como "narração por voz (recurso do seu navegador)".

---

### Script de voz — textos originais para o simulador

- Fonte: síntese das informações acima (função replicada, texto próprio)
- URL: n/a (conteúdo autoral)
- Data da consulta: 2026-08-31
- Informação encontrada: A urna real anuncia, nesta ordem funcional: (1) cargo atual, (2) instrução para digitar o número, (3) números conforme digitados, (4) nome/número/partido do candidato encontrado ou mensagem de número não encontrado, (5) confirmação do voto.
- Decisão tomada: Adotar textos próprios equivalentes, ex.: "Deputado Federal.", "Digite o número da candidata ou do candidato.", "Número não encontrado. Confira os números digitados.", "[Nome], [número], [partido].", "Voto confirmado.", "Voto em branco confirmado.", "Votação concluída." — todos escritos para este projeto, sem transcrição literal de gravações oficiais.
- Impacto no produto: Esses textos alimentam tanto o `SpeechSynthesis` quanto o texto visível na tela (mesmo conteúdo, canais visual e sonoro sincronizados) — ver `docs/ux-flow.md`.

---

### Efeitos sonoros (cliques, erro, confirmação)

- Fonte: PROMPT-INICIAL.md (diretriz do projeto) + ausência de licença aberta localizada para os sons de clique/erro/confirmação oficiais da urna
- URL: n/a
- Data da consulta: 2026-08-31
- Informação encontrada: Não foi localizada nenhuma publicação do TSE disponibilizando os arquivos de áudio (bipes, cliques de tecla, som de confirmação) sob licença de reuso público.
- Decisão tomada: Criar efeitos sonoros **originais**, curtos e discretos (sintetizados via Web Audio API ou arquivos `.mp3`/`.ogg` autorais), inspirados apenas na função (clique numérico, erro, correção, confirmação, branco, avanço de cargo, finalização) — nunca chamados de "som oficial da urna".
- Impacto no produto: `AudioService` centraliza os eventos `KEY_PRESS`, `ERROR`, `CORRECT`, `CONFIRM`, `BLANK`, `NEXT_OFFICE`, `FINISH`; cada um mapeado a um som próprio, gerado via Web Audio API (osciladores simples) para evitar dependência de arquivos binários grandes e problemas de licenciamento.

---

### Ajuste de timing/registro a partir de análise acústica (2026-08-31)

- Fonte: arquivo de áudio fornecido pelo usuário (baixado por ele, não por esta sessão — ver limitação abaixo), analisado apenas por características acústicas (duração e frequência aproximada via contagem de cruzamentos de zero), nunca reproduzido, recortado ou incorporado ao produto.
- Data da consulta: 2026-08-31
- Informação encontrada: o clique de tecla mede ~20ms a ~2300Hz (bem mais curto e agudo que a estimativa original de 45ms/720Hz); um evento mais longo (~700ms, mesmo registro ~2250Hz) aparece após sequências de dígitos, plausivelmente o som de confirmação/candidato encontrado.
- Decisão tomada: usar apenas esses dois números (duração, frequência aproximada) para reafinar `KEY_PRESS` (20ms, 2300Hz) e `CONFIRM` (trinado de 8 pulsos ascendentes de 2100–2500Hz ao longo de 700ms, não uma cópia do padrão exato do arquivo) em `audioService.ts`. Nenhum áudio do arquivo foi extraído, recortado ou embutido.
- Impacto no produto: sons mais fiéis ao *ritmo* percebido da urna real, sem redistribuir conteúdo protegido.
- **Limitação**: o usuário afirmou, sem fonte verificável apresentada até o momento, que o arquivo original é de "disponibilidade pública". Essa afirmação não foi confirmada por esta sessão (pedimos a fonte/link) — a decisão de não incorporar o áudio literal permanece até que uma licença explícita seja verificada.

---

### Autoplay e políticas de navegador

- Fonte: conhecimento geral de padrões web (MDN / Chrome Autoplay Policy) — não específico do TSE
- URL: n/a
- Data da consulta: 2026-08-31
- Informação encontrada: Navegadores modernos bloqueiam autoplay de áudio/voz sem interação prévia do usuário.
- Decisão tomada: O primeiro som/voz só é disparado após um gesto do usuário (ex.: clique em "Começar simulação"). Preferências de som/voz/volume ficam em `localStorage` e a aplicação nunca trava caso o áudio seja bloqueado (fail-safe silencioso).
- Impacto no produto: `AudioService.init()` é chamado dentro do primeiro handler de clique da jornada, não no mount da aplicação.
