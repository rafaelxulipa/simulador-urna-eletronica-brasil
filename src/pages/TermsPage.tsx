export function TermsPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Termos de Uso</h1>
      <p className="text-sm text-urna-text-secondary">Última atualização: 31 de agosto de 2026.</p>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">1. O que é o Treine Seu Voto</h2>
        <p>
          Treine Seu Voto é um <strong>simulador educativo e independente</strong> da urna eletrônica brasileira.
          Ele foi criado para ajudar pessoas — especialmente idosos, pessoas com pouca familiaridade com
          tecnologia e quem nunca votou — a praticar o processo de votação antes do dia da eleição.
        </p>
        <p>
          Este site <strong>não é mantido, endossado ou afiliado</strong> ao Tribunal Superior Eleitoral (TSE),
          à Justiça Eleitoral ou a qualquer órgão público.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">2. Uso permitido</h2>
        <p>
          Você pode usar este simulador livremente para treinar e ensinar outras pessoas a votar. Ele não deve
          ser usado para qualquer finalidade que sugira ser um sistema oficial de votação, apuração ou
          identificação de eleitores.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">3. Neutralidade política</h2>
        <p>
          O simulador é estritamente neutro. Não recomendamos, favorecemos, comparamos ou avaliamos nenhuma
          candidata ou candidato. A ordem dos candidatos segue apenas os dados oficiais (número de urna), nunca
          uma preferência.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">4. Nenhum voto real é registrado</h2>
        <p>
          As escolhas feitas durante a simulação são apenas para treino, não saem do seu navegador e não têm
          nenhum efeito em uma eleição real.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">5. Origem dos dados</h2>
        <p>
          Os dados de candidatas e candidatos são obtidos de fontes públicas oficiais do TSE (Portal de Dados
          Abertos, licença CC-BY) quando disponíveis, e podem sofrer atualizações ou conter imprecisões. Veja{' '}
          <a href="/fontes" className="underline">
            nossas fontes
          </a>
          .
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">6. Isenção de responsabilidade</h2>
        <p>
          Este é um projeto educativo, oferecido "como está", sem garantias. Fazemos o possível para manter as
          informações corretas e atualizadas, mas não garantimos exatidão total, nem nos responsabilizamos por
          decisões tomadas com base neste simulador.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">7. Privacidade</h2>
        <p>
          Veja nossa{' '}
          <a href="/privacidade" className="underline">
            Política de Privacidade
          </a>{' '}
          para saber o que (pouco) é armazenado ao usar este simulador.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">8. Alterações</h2>
        <p>
          Estes termos podem ser atualizados conforme o projeto evolui. A data da última atualização fica sempre
          no topo desta página.
        </p>
      </section>
    </div>
  )
}
