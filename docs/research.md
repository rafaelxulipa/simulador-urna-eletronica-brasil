# Pesquisa — Eleições 2026 e comportamento da urna eletrônica

> Registro de pesquisa factual usada para embasar decisões de produto. Sempre que
> houver conflito entre fonte oficial (TSE/TRE) e imprensa, a fonte oficial prevalece.

### Ordem dos cargos e quantidade de dígitos

- Fonte: Tribunal Superior Eleitoral (TSE) — matéria "Eleições 2026: conheça a ordem de votação na urna eletrônica"
- URL: https://www.tse.jus.br/comunicacao/noticias/2026/Marco/eleicoes-2026-conheca-a-ordem-de-votacao-na-urna-eletronica
- Data da consulta: 2026-08-31 (confirmado via resultados de busca; fetch direto ao TSE retornou HTTP 403, conteúdo confirmado de forma cruzada com TRE-SP, TRE-RJ, TRE-SC e cobertura de imprensa — Band, O Imparcial, Estado de Minas — que citam a mesma matéria do TSE)
- Informação encontrada: nas Eleições Gerais de 2026 a urna apresenta 6 etapas de votação, nesta ordem:
  1. Deputado Federal — 4 dígitos
  2. Deputado Estadual ou Distrital — 5 dígitos
  3. Senador — 1ª vaga — 3 dígitos
  4. Senador — 2ª vaga — 3 dígitos
  5. Governador — 2 dígitos
  6. Presidente da República — 2 dígitos
  A urna segue a ordem rigorosamente; não é possível pular etapas, só avança após confirmar o voto do cargo atual.
- Decisão tomada: `electionSequence` (ver `docs/architecture.md`) implementa exatamente essa sequência de 6 etapas, com Senador 1ª e 2ª vaga como duas etapas independentes (não uma etapa única "Senador"), e `numDigits` por cargo conforme acima.
- Impacto no produto: define a config central da voting engine (`FEDERAL_DEPUTY: 4`, `STATE_DEPUTY: 5`, `SENATOR_FIRST: 3`, `SENATOR_SECOND: 3`, `GOVERNOR: 2`, `PRESIDENT: 2`).

### Voto em branco

- Fonte: ndmais.com.br, "Qual a ordem de votação na urna eletrônica? Veja a sequência completa" (cobertura de imprensa, corroborando comportamento histórico e conhecido da urna, sem contradizer nenhuma fonte oficial)
- URL: https://ndmais.com.br/politica/ordem-de-votacao/
- Data da consulta: 2026-08-31
- Informação encontrada: "É possível votar em branco, ao pressionar a tecla BRANCO." O texto não detalha explicitamente se CONFIRMA é obrigatório em seguida.
- Decisão tomada: seguindo o comportamento histórico e consistente da urna eletrônica (mantido em todos os ciclos eleitorais, sem indicação de mudança para 2026): ao pressionar BRANCO, a tela exibe "BRANCO" no lugar do número/candidato, e o voto só é efetivado ao pressionar CONFIRMA em seguida — igual ao fluxo de um número válido. CORRIGE cancela o branco e retorna à digitação.
- Impacto no produto: `VotingState` inclui `BLANK` como estado intermediário que ainda exige `WAIT_CONFIRM` → `CONFIRMED`, nunca confirma automaticamente.

### Exibição do candidato após número válido

- Fonte: ndmais.com.br (mesma matéria acima)
- URL: https://ndmais.com.br/politica/ordem-de-votacao/
- Data da consulta: 2026-08-31
- Informação encontrada: "Ao digitar na urna eletrônica o número de um candidato, a tela do equipamento deve mostrar seu número, foto, nome e partido."
- Decisão tomada: `UrnaDisplay` no estado `SHOW_CANDIDATE`/`CHECK_VOTE` exibe, nesta ordem de hierarquia visual: número digitado, foto (com fallback caso ausente), nome, partido/sigla. Não há cronômetro artificial nem espera obrigatória documentada nas fontes consultadas — CONFIRMA fica habilitada assim que a conferência é exibida, coerente com o comportamento histórico da urna (o eleitor decide quando confirmar ou corrigir).
- Impacto no produto: `WAIT_CONFIRM` no `VotingState` não implementa nenhum timer bloqueante; a tecla CONFIRMA já nasce `enabled` nesse estado. **Limitação**: nenhuma fonte oficial consultada documenta explicitamente timing de habilitação da tecla; esta é a inferência mais conservadora compatível com o comportamento conhecido da urna e deve ser revista se uma fonte oficial específica de 2026 for encontrada posteriormente.

### Número não encontrado / candidato inválido

- Fonte: nenhuma fonte oficial ou de imprensa consultada detalhou a mensagem literal exibida em 2026 para número inválido.
- Data da consulta: 2026-08-31
- Informação encontrada: comportamento não documentado explicitamente nas fontes disponíveis nesta pesquisa.
- Decisão tomada: manter a mensagem historicamente usada pela urna eletrônica, mantida entre ciclos eleitorais: "NÚMERO NÃO EXISTE — DIGITE NOVAMENTE". Adaptação educativa no produto: "NÚMERO NÃO ENCONTRADO — Confira os números digitados." com tecla CORRIGE em destaque, conforme PRD.
- Impacto no produto: `VotingState.INVALID` — mensagem definida em `src/domain/voting/messages.ts`, com nota de que é uma adaptação educativa e não uma citação oficial literal da tela do TSE.

### Acesso direto ao domínio tse.jus.br

- Fonte: tentativa de acesso direto
- URL: https://www.tse.jus.br/comunicacao/noticias/2026/Marco/eleicoes-2026-conheca-a-ordem-de-votacao-na-urna-eletronica ; https://www.tre-sp.jus.br/... ; https://www.tre-rj.jus.br/...
- Data da consulta: 2026-08-31
- Informação encontrada: os domínios oficiais `tse.jus.br` e `tre-*.jus.br` bloqueiam fetch automatizado direto (HTTP 403). O conteúdo foi confirmado por meio de busca (snippets) e por veículos de imprensa que citam e reproduzem a mesma matéria oficial.
- Decisão tomada: registrar a limitação; qualquer atualização futura desta pesquisa deve tentar acesso direto ao TSE (ex.: via navegador) para citar o texto oficial literal.
- Impacto no produto: nenhum imediato; apenas nota de proveniência para `docs/data-sources.md`.

## Limitações gerais desta pesquisa

- Não foi possível ler o texto oficial completo do TSE diretamente (bloqueio de acesso automatizado); as informações foram corroboradas por múltiplas fontes de imprensa que citam a mesma matéria oficial, incluindo TREs estaduais.
- O timing exato de habilitação da tecla CONFIRMA e a mensagem literal de "número inválido" não foram encontrados documentados explicitamente para o ciclo 2026 nas fontes consultadas nesta pesquisa; as decisões acima seguem o comportamento historicamente estável da urna eletrônica brasileira.
- Pesquisa around dados de candidaturas, sons oficiais, Libras e tipografia 2026 (Atkinson Hyperlegible) está documentada separadamente em `docs/data-sources.md`, `docs/audio.md`, `docs/accessibility.md` e `docs/urna-visual-reference.md`.
