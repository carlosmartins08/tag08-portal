import { ArrowUpRight, ShieldCheck } from "lucide-react";

type PrivacidadeProps = {
  onNavigate: (path: string) => void;
};

const sections = [
  {
    title: "Informações enviadas pelo visitante",
    body: "Os formulários do site podem receber dados de contato e informações profissionais. O formulário de Contato solicita nome, empresa, telefone/WhatsApp, e-mail, serviço ou necessidade, estágio do negócio e, quando preenchido, uma mensagem. O Banco de Talentos solicita dados de identificação e contato, áreas de interesse e informações profissionais que a própria pessoa decide enviar, como experiência, disponibilidade, projetos, portfólio ou currículo. Campos opcionais e condicionais variam conforme a jornada."
  },
  {
    title: "Finalidade e registro das solicitações",
    body: "As informações de Contato são usadas para compreender e responder à solicitação recebida. As informações do Banco de Talentos são usadas para avaliar o perfil apresentado para possíveis oportunidades, sem promessa de vaga ou contratação. Nas jornadas habilitadas desta versão, os registros estruturados são enviados ao Google Sheets. ClickUp não recebe essas submissões. O envio só é confirmado pela aplicação depois que a persistência é confirmada; erros de integração não devem ser interpretados como confirmação de recebimento."
  },
  {
    title: "Preferências de cookies e mensuração",
    body: "O site mantém preferências de consentimento no navegador. As categorias opcionais de desempenho e marketing começam desativadas e podem ser alteradas pelo visitante. A implementação condiciona o carregamento do Google Tag Manager às preferências opcionais registradas e libera determinados conteúdos incorporados somente após a autorização aplicável. Não inclua dados pessoais em mensagens, parâmetros de campanha ou eventos de mensuração."
  },
  {
    title: "Solicitações sobre dados pessoais",
    body: "Para fazer uma pergunta ou solicitar atendimento relacionado às informações enviadas à TAG08, escreva para contato@tag08.com.br. Informe o suficiente para que a equipe localize a solicitação, mas não envie senhas, documentos ou dados sensíveis por e-mail sem orientação específica. O canal de contato não confirma automaticamente a identidade do solicitante nem a conclusão de um pedido; a equipe poderá solicitar informações adicionais por meio adequado."
  }
];

export default function Privacidade({ onNavigate }: PrivacidadeProps) {
  return (
    <main className="min-h-[70vh] bg-charcoal-950 px-5 pb-24 pt-28 text-white sm:px-8 sm:pt-36">
      <article className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-3 text-brand-secondary">
          <ShieldCheck aria-hidden="true" className="h-6 w-6" />
          <span className="text-xs font-bold uppercase tracking-[0.18em]">Transparência e dados pessoais</span>
        </div>
        <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">Aviso de Privacidade da TAG08</h1>
        <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-300">
          Este aviso resume práticas observáveis nas jornadas atuais do site. Ele não informa prazos específicos de retenção, lista completa de operadores e transferências, nem substitui a revisão jurídica e operacional da política integral. Esses detalhes ainda precisam de validação pelo responsável da TAG08 antes de liberar esta página para indexação.
        </p>

        <div className="mt-12 space-y-8">
          {sections.map((section, index) => (
            <section key={section.title} className="border-t border-white/10 pt-6">
              <h2 className="font-display text-xl font-semibold sm:text-2xl">{index + 1}. {section.title}</h2>
              <p className="mt-3 max-w-3xl leading-7 text-zinc-300">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-zinc-400">As regras completas de retenção e os detalhes de compartilhamento precisam ser confirmados antes de a política ser considerada final.</p>
          <button
            type="button"
            onClick={() => onNavigate("/contato")}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-brand-secondary px-5 font-semibold text-black transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
          >
            Falar com a TAG08 <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </article>
    </main>
  );
}
