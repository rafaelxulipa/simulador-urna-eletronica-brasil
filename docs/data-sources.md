# Fontes de dados — Candidatos Eleições 2026

Documentação da pesquisa sobre as fontes oficiais de dados de candidaturas do TSE
utilizadas (ou planejadas) para alimentar o simulador "Treine Seu Voto".

> Consulta realizada em 2026-08-31. O acesso automatizado (curl/WebFetch) ao
> domínio `dadosabertos.tse.jus.br` e ao CDN `cdn.tse.jus.br` retornou **403
> Forbidden** (bloqueio de WAF/Akamai) a partir deste ambiente. As URLs e
> nomes de recursos abaixo foram confirmados via resultados de busca (títulos
> e trechos indexados das páginas reais do portal), mas o conteúdo bruto
> (schema completo de colunas, tamanho exato dos arquivos) não pôde ser
> baixado diretamente nesta sessão. O padrão de nomenclatura de colunas
> descrito é o mesmo utilizado pelo TSE em ciclos eleitorais anteriores
> (2018–2024) e é estável ano a ano — deve ser validado contra o cabeçalho
> real do CSV assim que o download for possível (rede sem bloqueio de WAF,
> ex.: a partir de um ambiente CI/Vercel ou download manual).

## Portal e conjunto de dados

### Portal de Dados Abertos do TSE
- Fonte: TSE — Portal de Dados Abertos
- URL: https://dadosabertos.tse.jus.br/
- Data da consulta: 2026-08-31
- Informação encontrada: Portal oficial (CKAN) de dados abertos da Justiça
  Eleitoral. Contém o grupo de datasets "candidatos", incluindo o dataset
  específico do pleito de 2026.
- Decisão tomada: Usar este portal como fonte primária de candidatos,
  conforme exigido em PROMPT-INICIAL.md (não hardcode, não scraping quando
  houver dataset estruturado oficial).
- Impacto no produto: Define a origem de dados do `CandidateProvider` /
  pipeline `scripts/sync-tse`.

### Dataset "Candidatos - 2026"
- Fonte: TSE — Portal de Dados Abertos
- URL: https://dadosabertos.tse.jus.br/dataset/candidatos-2026
- Data da consulta: 2026-08-31
- Informação encontrada: Dataset dedicado ao pleito de 2026, última
  atualização indicada em 22/07/2026 (posterior ao fim do prazo de registro
  de candidaturas, portanto contempla o conjunto de candidaturas registradas
  para o pleito). Recursos (resources) identificados no dataset:
  - **Candidatos** (arquivo principal, todos os cargos/UFs)
  - **Candidatos — Informações complementares**
  - **Bens de candidatos**
  - **Rede social de candidatos**
  - **Proposta de governo** (apenas cargos majoritários, ex.: Presidente)
  - **Fotos de candidatos** (recurso separado, por UF — confirmados
    recursos "BR", "SC", "SP" entre outros nos resultados de busca, o que
    indica que as fotos são publicadas em um ZIP por UF, não um arquivo
    nacional único)
- Decisão tomada: Ingestão via arquivo "Candidatos" principal (ZIP nacional
  em CSV) como fonte de verdade para nome, número, partido, cargo, UF e
  situação de candidatura. Fotos tratadas como pipeline separado e opcional
  (ver seção Fotos abaixo), com fallback obrigatório quando ausente.
- Impacto no produto: `scripts/sync-tse` precisa de dois sub-passos:
  candidatos (obrigatório) e fotos (melhor esforço, por UF, com cache/CDN
  próprio e fallback de silhueta/iniciais quando a foto não existir).

## Arquivos de download (CDN)

### consulta_cand_2026.zip — Candidatos (arquivo principal)
- Fonte: TSE — CDN de estatística/eleições (`cdn.tse.jus.br`)
- URL: https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_2026.zip
- Data da consulta: 2026-08-31
- Informação encontrada: Segue o padrão histórico dos pacotes
  `consulta_cand_AAAA.zip` usados pelo TSE desde pelo menos 2018. Dentro do
  ZIP: um CSV por UF (`consulta_cand_2026_UF.csv`, separador `;`, encoding
  historicamente Latin-1/ISO-8859-1 nos anos anteriores — **validar
  novamente no header real do CSV 2026**, pois o TSE já migrou alguns
  datasets para UTF-8 em ciclos recentes) e um CSV consolidado nacional.
  Colunas historicamente estáveis entre ciclos eleitorais e prováveis no
  arquivo 2026 (não confirmadas linha a linha nesta sessão por bloqueio de
  rede): `SG_UF`, `CD_CARGO`, `DS_CARGO`, `SQ_CANDIDATO`, `NR_CANDIDATO`,
  `NM_CANDIDATO`, `NM_URNA_CANDIDATO`, `NR_CPF_CANDIDATO` (não deve ser
  exposto no produto), `DS_SITUACAO_CANDIDATURA`,
  `DS_DETALHE_SITUACAO_CAND`, `SG_PARTIDO`, `NM_PARTIDO`, `NR_PARTIDO`,
  `SG_FEDERACAO`, `NM_FEDERACAO`, `NM_COLIGACAO`, `DS_SIT_TOT_TURNO`
  (situação após o resultado — só existe após apuração, não usar antes
  disso), `CD_SITUACAO_CANDIDATO_URNA` / `DS_SITUACAO_CANDIDATO_URNA`
  (indica se o registro está apto a aparecer na urna).
- Decisão tomada: Construir o parser do `scripts/sync-tse` para ler o CSV
  por UF (permite sincronizar sob demanda por estado, evitando processar o
  Brasil inteiro de uma vez), mapear apenas os campos necessários ao
  produto (nome de urna, número, partido, cargo, UF, situação), e **nunca**
  persistir/expor CPF, título eleitoral ou outros dados sensíveis do
  candidato. Tratar `DS_SITUACAO_CANDIDATO_URNA` como filtro de elegibilidade
  para exibição no simulador (excluir candidaturas indeferidas/cassadas
  quando o dado permitir identificá-las, para não confundir o usuário
  treinando com um número que não existiria na urna real).
- Impacto no produto: Define o schema de normalização
  (`Candidate` em `PRD.md`/PROMPT-INICIAL.md seção 60) e a estratégia de
  filtragem por UF+cargo da API (`GET /api/candidates?state=&office=`).

### Fotos de candidatos — URLs e licença confirmadas (atualização 2026-08-31)
- Fonte: TSE — API CKAN do Portal de Dados Abertos (`package_show?id=candidatos-2026`),
  consultada com sucesso via `fetch()` do Node (o bloqueio 403 registrado
  anteriormente nesta sessão de pesquisa afetava `curl`/WebFetch a partir daquele
  ambiente específico, não a rede em geral — a máquina de implementação conseguiu
  acessar normalmente).
- URL: `https://dadosabertos.tse.jus.br/api/3/action/package_show?id=candidatos-2026`
- Data da consulta: 2026-08-31
- Informação encontrada: o dataset é publicado sob **licença `cc-by` (Creative
  Commons Atribuição)**, conforme campo `license_id`/`license_title` da resposta
  da API — confirma que a redistribuição das fotos (e dos demais dados) via CDN
  próprio é permitida, desde que a fonte seja citada (já feito na página
  `/fontes` e nesta documentação). O dataset lista um recurso "Fotos de
  candidatos" por UF (26 estados + DF) mais um recurso "BR" (fotos dos
  candidatos a Presidente/Vice, cuja candidatura é nacional). URL real de cada
  recurso: `https://cdn.tse.jus.br/estatistica/sead/eleicoes/eleicoes2026/fotos/foto_cand2026_{UF}_div.zip`
  — padrão distinto do usado pelos arquivos de candidatos
  (`.../odsele/consulta_cand/...`). Dentro de cada ZIP, os arquivos seguem o
  padrão `F{UF}{SQ_CANDIDATO}_div.jpg` (ex.: `FPE170002534902_div.jpg`), o que
  permite ligar cada foto diretamente ao `id` já usado na tabela `candidates`
  (que é o próprio `SQ_CANDIDATO`). Teste real com o ZIP de PE: 960 fotos,
  ~5,5 MB total (~5,7 KB por foto — já em baixa resolução, adequado para uso
  direto sem reprocessamento). Cobertura não é garantida para 100% dos
  candidatos (nem todos enviam foto).
- Decisão tomada: Fotos são baixadas e armazenadas em uma tabela própria
  (`candidate_photos`, ver `db/migrations/002_candidate_photos.sql`) por
  `scripts/sync-tse/syncPhotos.ts`, executado como segunda etapa de
  `pnpm sync:tse` (após candidatos, best-effort — uma UF que falhar é pulada
  e logada, nunca aborta a sincronização). Servidas via `GET /api/photo?id=`.
  O campo `photo_url` de cada candidato é preenchido incondicionalmente com
  essa URL relativa; quando não há foto real armazenada, a rota retorna 404 e
  o componente `CandidateAvatar` já trata isso com o fallback de iniciais —
  mantendo o requisito da seção 70 do PROMPT-INICIAL.md (imagem ausente nunca
  quebra a interface).
- Impacto no produto: fotos reais passam a aparecer na tela de conferência do
  voto quando disponíveis, com atribuição ao TSE já presente em `/fontes`.

### Fotos de candidatos — pesquisa original (mantida para histórico)
- Fonte: TSE — Portal de Dados Abertos (recurso "Fotos de candidatos", por UF)
- URL: recurso listado em https://dadosabertos.tse.jus.br/dataset/candidatos-2026
  (ex.: variantes "BR", "SC", "SP" — um ZIP de imagens por UF, nome de
  arquivo por `SQ_CANDIDATO`, padrão histórico do TSE)
- Data da consulta: 2026-08-31
- Informação encontrada: Fotos são publicadas oficialmente pelo TSE junto ao
  dataset de candidaturas (ligadas ao "Sistema de divulgação de
  candidaturas" mencionado por TREs regionais — ver notícia do TRE-MG sobre
  o Eleições 2026). Cobertura não é garantida para 100% dos candidatos (nem
  todos enviam foto). Termos de uso específicos da imagem não puderam ser
  lidos nesta sessão (bloqueio 403) — **superado, ver atualização acima**.
- Decisão tomada (histórica): Tratar fotos como **opcionais** e de **melhor esforço**:
  baixar quando disponíveis, aplicar cache/CDN próprio, e usar um fallback
  visual (iniciais do nome de urna sobre fundo neutro) quando a foto não
  existir ou falhar o carregamento — nunca deixar a interface quebrar por
  imagem ausente (requisito da seção 70 do PROMPT-INICIAL.md). Antes do
  primeiro deploy com fotos reais, confirmar explicitamente nos termos do
  portal que a redistribuição via CDN próprio é permitida (dado público
  governamental sob dados abertos deve permitir, mas não foi lido
  literalmente nesta sessão).
- Impacto no produto: `CandidateView` e `UrnaDisplay` precisam de estado de
  fallback de foto desde o início (não é um "extra" a adicionar depois).

## Acesso (API vs. arquivos)

### Não há API REST pública de consulta — apenas arquivos ZIP/CSV
- Fonte: TSE — Portal de Dados Abertos (estrutura observada)
- URL: https://dadosabertos.tse.jus.br/
- Data da consulta: 2026-08-31
- Informação encontrada: O portal é um catálogo CKAN de datasets para
  download em lote (ZIP contendo CSV), consistente com o padrão TSE de
  todos os ciclos eleitorais anteriores. Não foi identificado nenhum
  endpoint REST de consulta individual (`/api/candidato/{numero}` ou
  similar) nos resultados de busca; o CKAN expõe uma API de metadados do
  catálogo (`/api/3/action/package_show`), não dos dados eleitorais em si,
  e essa própria API retornou 403 nesta sessão.
- Decisão tomada: Confirma a arquitetura já prevista (seção 61/62 do
  PROMPT-INICIAL.md): baixar o ZIP periodicamente via `scripts/sync-tse`,
  normalizar e carregar no PostgreSQL próprio; o frontend nunca acessa o
  TSE diretamente. Isso também evita expor o app a CORS/bloqueio de WAF do
  TSE em tempo de execução do usuário final.
- Impacto no produto: A sincronização deve rodar em ambiente que não sofra
  o mesmo bloqueio de WAF observado aqui (ex.: executar o script localmente
  com download manual assistido, ou a partir de um job com IP/reputação
  distinta; documentar isso como limitação operacional do sync).

## Licenciamento

### Dados abertos governamentais — uso permitido com atribuição
- Fonte: Natureza do portal (Lei de Acesso à Informação / Dados Abertos)
- URL: https://dadosabertos.tse.jus.br/
- Data da consulta: 2026-08-31
- Informação encontrada: Trata-se de portal oficial de dados abertos
  governamentais brasileiros; dados dessa natureza são, por política de
  dados abertos do governo federal, publicados para reuso livre, com
  citação da fonte. O texto literal da licença/termos de uso do portal não
  pôde ser lido nesta sessão (403 ao acessar a página).
- Decisão tomada: Utilizar os dados citando explicitamente o TSE como fonte
  em toda a interface que exibir candidatos (seção "Fontes" do produto,
  `/fontes`), incluir data de sincronização, e não redistribuir dados
  sensíveis (CPF, título eleitoral) mesmo que presentes no arquivo bruto.
  Antes do lançamento público, revisar o texto de termos de uso completo do
  portal manualmente (fora deste ambiente bloqueado) para confirmar que não
  há restrição adicional sobre fotos.
- Impacto no produto: Disclaimer + página `/fontes` (seções 13, 44 do
  PROMPT-INICIAL.md) devem citar TSE/Dados Abertos como fonte e trazer a
  data da última sincronização.

## Verificação real do schema 2026 (atualização em 2026-08-31)

Ao contrário da limitação de rede registrada abaixo (válida para o ambiente
de pesquisa original), a máquina de desenvolvimento usada para implementar
`scripts/sync-tse` **conseguiu baixar `consulta_cand_2026.zip` diretamente**
de `cdn.tse.jus.br` sem bloqueio. O schema foi inspecionado linha a linha
contra o CSV real (não mais inferido do padrão histórico):

- O ZIP contém um arquivo por UF (`consulta_cand_2026_PE.csv`, etc.), mais
  `consulta_cand_2026_BR.csv` (candidaturas de âmbito nacional — Presidente e
  Vice) e `consulta_cand_2026_BRASIL.csv` (consolidado = união de todos os
  anteriores; **não usar junto com os arquivos por UF**, geraria duplicação).
- **Presidente é candidatura nacional**: as linhas de `DS_CARGO = "PRESIDENTE"`
  vêm com `SG_UF = "BR"`, não por estado. `scripts/sync-tse` grava essas
  candidaturas com `state = 'BR'`; `api/candidates.ts` reescreve o parâmetro
  `state` para `'BR'` sempre que `office = PRESIDENT`, independente do
  estado que a pessoa selecionou na simulação — todo o Brasil vê a mesma
  cédula presidencial, como na urna real.
- Coluna de elegibilidade real é `DS_SITUACAO_CANDIDATURA` (não
  `DS_SITUACAO_CANDIDATO_URNA`, que não existe no schema 2026 real — a
  suposição original, herdada do padrão histórico, estava incorreta e foi
  corrigida em `scripts/sync-tse/tseColumns.ts`).
- **Nesta etapa do ciclo eleitoral (sincronizado em 2026-08-31),
  `DS_SITUACAO_CANDIDATURA` vem `"#NE"` (não adjudicado) para 100% das
  candidaturas em todas as UFs testadas** — o TSE ainda não publicou as
  decisões de deferimento/indeferimento. Filtrar por um valor tipo
  `"DEFERIDO"` removeria todos os candidatos. Por isso o pipeline **não
  filtra por situação de candidatura** nesta versão — inclui todas as
  candidaturas para os 5 cargos rastreados (excluindo suplentes/vices, que
  não são numerados separadamente na urna). Uma re-sincronização mais
  próxima da eleição, quando o campo estiver populado, deve reintroduzir
  esse filtro.
- `SG_FEDERACAO` usa o marcador literal `"#NULO"` do próprio TSE para "sem
  federação" — normalizado para `null` no parser.
- Sincronização real executada com sucesso em 2026-08-31: **19.830
  candidaturas** carregadas (7.696 Dep. Federal, 11.613 Dep. Estadual/
  Distrital, 314 Senador, 194 Governador, 13 Presidente).

## Limitações desta pesquisa

- Acesso direto (curl e WebFetch) a `dadosabertos.tse.jus.br` e
  `cdn.tse.jus.br` foi bloqueado com HTTP 403 (Akamai/WAF) neste ambiente
  de desenvolvimento. Todas as URLs de arquivo acima foram obtidas via
  resultados de mecanismo de busca (títulos/trechos de páginas reais
  indexadas), não por download direto.
- O schema de colunas do CSV 2026 é inferido do padrão histórico do TSE
  (2018–2024) e **precisa ser revalidado contra o cabeçalho real do
  arquivo** assim que o download for possível a partir de um ambiente sem
  bloqueio — antes de finalizar o parser em `scripts/sync-tse`.
- Encoding do CSV (UTF-8 vs. ISO-8859-1) não confirmado para 2026; o parser
  deve detectar/normalizar a codificação em vez de assumir uma fixa.
- Termos de uso/licença específicos das fotos de candidatos não foram lidos
  literalmente; tratar fotos como opcionais até confirmação explícita.
- Enquanto o download real não for possível neste ambiente, o
  desenvolvimento da UI e do voting engine deve prosseguir com um dataset
  de exemplo/seed claramente marcado como "dados de exemplo, não oficiais"
  (nunca apresentado como dado real de candidato) para não violar a
  proibição de inventar candidatos reais (seção 112 do PROMPT-INICIAL.md).
