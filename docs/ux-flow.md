# Fluxo de UX

```
/                 LandingPage        — hero, urna decorativa, CTA
/como-funciona    HowItWorksPage     — 6 passos, linguagem simples
/estado           StateSelectPage    — grid de UFs + busca
/modo             ModeSelectPage     — Aprender | Simulação | Ver como funciona
/votar            VotingPage         — <Urna /> real, por cargo
/concluido        FinishedPage       — checklist de cargos concluídos
/fontes           SourcesPage        — metadados, disclaimer, fontes oficiais
```

Guarda de rota simples: `/modo` exige estado selecionado; `/votar` exige
estado + modo; `/concluido` exige que a sessão tenha `finishedVotes` — cada
página redireciona para o passo anterior via `<Navigate />` se faltar
pré-requisito (ver `src/stores/sessionStore.ts`).

## Dentro de `/votar` — por cargo

```
ENTER_NUMBER  → dígitos digitados, até o tamanho do número da cédula
     │
     ├── número incompleto → permanece em ENTER_NUMBER
     ├── BRANCO pressionado → BLANK (trava CONFIRMA por ~1s)
     └── número completo → lookup assíncrono no CandidateProvider
              │
              ├── encontrado → SHOW_CANDIDATE (trava CONFIRMA por ~1s, mensagem "Confira seu voto")
              └── não encontrado → INVALID ("NÚMERO NÃO ENCONTRADO")

CORRIGE (qualquer status não-FINISHED) → volta para ENTER_NUMBER, limpa dígitos/candidato

CONFIRMA (apenas SHOW_CANDIDATE ou BLANK, com trava liberada)
     → registra o voto → avança para o próximo cargo (ENTER_NUMBER)
        ou, se era o último cargo, → FINISHED
```

Ver `src/domain/voting/votingEngine.ts` para a máquina de estados completa e
`docs/urna-visual-reference.md` para a fonte da trava de ~1s.

## Modos

- **Aprender**: mesma máquina de estados, texto de instrução mais explicativo
  em `ENTER_NUMBER` (ver `MODE_INSTRUCTIONS` em `src/pages/VotingPage.tsx`).
- **Simulação**: instrução padrão, sem texto extra.
- **Ver como funciona**: mesma interação real da urna (não há script
  automático de demonstração no MVP — ver limitação abaixo), com aviso de
  que é um modo de demonstração.

### Limitação conhecida

O modo "Ver como funciona" descrito no PRD como demonstração 100%
automática (sem digitar nada) não foi implementado como replay automático
no MVP — construir uma máquina de auto-play robusta (sem quebrar o estado
real da votação) é uma extensão não trivial do voting engine. A versão atual
reaproveita a interação real, rotulada como demonstração. Ver
PROMPT-INICIAL.md #32 para o requisito original; ficou registrado aqui como
trabalho futuro, não como comportamento inventado silenciosamente.
