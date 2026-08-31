export function PrivacyPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Política de Privacidade</h1>
      <p className="text-sm text-urna-text-secondary">Última atualização: 31 de agosto de 2026.</p>

      <section className="flex flex-col gap-2 rounded-lg bg-brand-surface p-4">
        <h2 className="text-xl font-bold">Resumo simples</h2>
        <p>
          Este simulador <strong>não pede login, não pede CPF ou título de eleitor, e não envia nada para
          nenhum servidor sobre suas escolhas</strong>. Tudo o que é salvo fica apenas no seu próprio celular
          ou computador.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">1. Não coletamos dados pessoais</h2>
        <p>
          Não solicitamos nome, CPF, RG, título de eleitor, endereço, zona ou seção eleitoral. Você pode usar o
          simulador inteiro sem informar nada sobre você.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">2. O que fica salvo no seu aparelho</h2>
        <p>
          Usamos o armazenamento local do seu navegador (<code>localStorage</code>) apenas para lembrar suas
          preferências entre visitas:
        </p>
        <ul className="list-inside list-disc">
          <li>tamanho da fonte (A-/A/A+) e alto contraste;</li>
          <li>som, voz e volume ligados/desligados;</li>
          <li>se você já aceitou estes termos;</li>
          <li>se este navegador já foi contado no contador de visitas (item 4).</li>
        </ul>
        <p>
          Nada disso sai do seu navegador. Não temos acesso a essas informações, e você pode apagá-las a
          qualquer momento limpando os dados do site nas configurações do seu navegador.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">3. Suas escolhas na simulação não são registradas</h2>
        <p>
          O estado (UF), o modo escolhido e os números digitados durante o treino existem apenas temporariamente
          na memória da página, enquanto você navega. Eles não são salvos, não são enviados a nenhum servidor e
          desaparecem quando você fecha ou recarrega a página.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">4. Contador de visitas</h2>
        <p>
          Mostramos, no rodapé, um número total de visitas ao site. Esse número é apenas uma contagem agregada —
          não guardamos endereço IP, nem qualquer identificador ligado a você. Para evitar contar a mesma pessoa
          várias vezes a cada recarga da página, marcamos no seu navegador (item 2 acima) que ele já foi contado;
          essa marcação não sai do seu aparelho.
        </p>
        <p>
          Fora isso, não usamos cookies de rastreamento, não usamos ferramentas de analytics invasivas e não
          exibimos anúncios.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">5. Dados de candidatas e candidatos</h2>
        <p>
          As informações de candidaturas exibidas (nome, número, partido, foto) vêm do Portal de Dados Abertos
          do TSE, sob licença CC-BY, e são dados públicos — não são informações sobre você. Veja{' '}
          <a href="/fontes" className="underline">
            nossas fontes
          </a>
          .
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">6. Alterações</h2>
        <p>Esta política pode ser atualizada conforme o projeto evolui. A data no topo desta página é sempre a mais recente.</p>
      </section>
    </div>
  )
}
