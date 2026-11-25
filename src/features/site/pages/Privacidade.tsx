import { ArrowUpRight, ShieldCheck } from "../../../components/DooIcons";
import type { RouteLocale } from "../../../config/routeRegistry";

type PrivacidadeProps = {
  onNavigate: (path: string) => void;
  locale?: RouteLocale;
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

const privacyCopy = {
  en: {
    badge: "Transparency and personal data",
    title: "TAG08 Privacy Notice",
    intro: "This is a provisional translation of the Portuguese source. It summarizes practices observable in the site's current journeys, but does not specify retention periods, provide a complete list of operators and transfers, or replace a full legal and operational review of the policy. These details still require validation by the person responsible at TAG08 before this page is cleared for indexing.",
    sections: [
      { title: "Information submitted by visitors", body: "The site's forms may receive contact details and professional information. The Contact form asks for name, company, phone/WhatsApp, email, service or need, business stage and, when provided, a message. The Talent Pool form asks for identification and contact details, areas of interest and professional information the person chooses to submit, such as experience, availability, projects, portfolio or resume. Optional and conditional fields vary by journey." },
      { title: "Purpose and recording of requests", body: "Contact information is used to understand and respond to the request received. Talent Pool information is used to assess the profile for possible opportunities, without promising a position or contract. In the enabled journeys of this version, structured records are sent to Google Sheets. ClickUp does not receive these submissions. The application confirms a submission only after persistence is confirmed; integration errors must not be interpreted as confirmation of receipt." },
      { title: "Cookie and measurement preferences", body: "The site stores consent preferences in the browser. Optional performance and marketing categories start disabled and may be changed by the visitor. The implementation conditions Google Tag Manager loading on the recorded optional preferences and releases certain embedded content only after the applicable authorization. Do not include personal data in messages, campaign parameters or measurement events." },
      { title: "Requests about personal data", body: "To ask a question or request assistance concerning information submitted to TAG08, write to contato@tag08.com.br. Provide enough information for the team to locate the request, but do not send passwords, documents or sensitive data by email without specific guidance. Contacting this channel does not automatically confirm the requester's identity or completion of a request; the team may ask for additional information through an appropriate method." }
    ],
    footer: "Complete retention rules and sharing details must be confirmed before the policy can be considered final.",
    cta: "Contact TAG08"
  },
  es: {
    badge: "Transparencia y datos personales",
    title: "Aviso de privacidad de TAG08",
    intro: "Esta es una traducci\u00f3n provisional del texto original en portugu\u00e9s. Resume las pr\u00e1cticas observables en los recorridos actuales del sitio, pero no especifica plazos de conservaci\u00f3n, no presenta una lista completa de operadores y transferencias, ni sustituye la revisi\u00f3n jur\u00eddica y operativa de la pol\u00edtica integral. Estos detalles a\u00fan requieren validaci\u00f3n de la persona responsable de TAG08 antes de habilitar esta p\u00e1gina para indexaci\u00f3n.",
    sections: [
      { title: "Informaci\u00f3n enviada por el visitante", body: "Los formularios del sitio pueden recibir datos de contacto e informaci\u00f3n profesional. El formulario de Contacto solicita nombre, empresa, tel\u00e9fono/WhatsApp, correo electr\u00f3nico, servicio o necesidad, etapa del negocio y, si se completa, un mensaje. El formulario del Banco de Talentos solicita datos de identificaci\u00f3n y contacto, \u00e1reas de inter\u00e9s e informaci\u00f3n profesional que la persona decide enviar, como experiencia, disponibilidad, proyectos, portafolio o curr\u00edculum. Los campos opcionales y condicionales var\u00edan seg\u00fan el recorrido." },
      { title: "Finalidad y registro de las solicitudes", body: "La informaci\u00f3n de Contacto se utiliza para comprender y responder a la solicitud recibida. La informaci\u00f3n del Banco de Talentos se utiliza para evaluar el perfil presentado ante posibles oportunidades, sin promesa de vacante ni contrataci\u00f3n. En los recorridos habilitados de esta versi\u00f3n, los registros estructurados se env\u00edan a Google Sheets. ClickUp no recibe estas solicitudes. La aplicaci\u00f3n solo confirma el env\u00edo despu\u00e9s de confirmar la persistencia; los errores de integraci\u00f3n no deben interpretarse como confirmaci\u00f3n de recepci\u00f3n." },
      { title: "Preferencias de cookies y medici\u00f3n", body: "El sitio conserva las preferencias de consentimiento en el navegador. Las categor\u00edas opcionales de rendimiento y marketing comienzan desactivadas y el visitante puede modificarlas. La implementaci\u00f3n condiciona la carga de Google Tag Manager a las preferencias opcionales registradas y libera determinados contenidos incrustados solo despu\u00e9s de la autorizaci\u00f3n aplicable. No incluyas datos personales en mensajes, par\u00e1metros de campa\u00f1a ni eventos de medici\u00f3n." },
      { title: "Solicitudes sobre datos personales", body: "Para hacer una pregunta o solicitar atenci\u00f3n relacionada con la informaci\u00f3n enviada a TAG08, escribe a contato@tag08.com.br. Incluye lo necesario para que el equipo localice la solicitud, pero no env\u00edes contrase\u00f1as, documentos ni datos sensibles por correo electr\u00f3nico sin instrucciones espec\u00edficas. El canal de contacto no confirma autom\u00e1ticamente la identidad de quien solicita ni la finalizaci\u00f3n de una solicitud; el equipo podr\u00e1 pedir informaci\u00f3n adicional por un medio adecuado." }
    ],
    footer: "Las reglas completas de conservaci\u00f3n y los detalles de intercambio deben confirmarse antes de considerar final esta pol\u00edtica.",
    cta: "Hablar con TAG08"
  }
} satisfies Record<Exclude<RouteLocale, "pt">, { badge: string; title: string; intro: string; sections: Array<{ title: string; body: string }>; footer: string; cta: string }>;

export default function Privacidade({ onNavigate, locale = "pt" }: PrivacidadeProps) {
  const copy = locale === "pt" ? null : privacyCopy[locale];
  const displayedSections = copy?.sections ?? sections;
  return (
    <div className="min-h-[70vh] bg-charcoal-950 px-5 pb-24 pt-28 text-white sm:px-8 sm:pt-36">
      <article className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-3 text-brand-secondary">
          <ShieldCheck aria-hidden="true" className="h-6 w-6" />
          <span className="text-xs font-bold uppercase tracking-[0.18em]">{copy ? copy.badge : <>Transparência e dados pessoais</>}</span>
        </div>
        <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">{copy ? copy.title : <>Aviso de Privacidade da TAG08</>}</h1>
        <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-300">{copy ? copy.intro : <>
          Este aviso resume práticas observáveis nas jornadas atuais do site. Ele não informa prazos específicos de retenção, lista completa de operadores e transferências, nem substitui a revisão jurídica e operacional da política integral. Esses detalhes ainda precisam de validação pelo responsável da TAG08 antes de liberar esta página para indexação.
        </>}</p>
        {copy && <p className="mt-3 text-sm text-zinc-400">{locale === "en" ? "Original source:" : "Texto original:"} <a href="/pt/privacidade" lang="pt-BR" className="underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">{locale === "en" ? "Portuguese privacy notice" : "Aviso de privacidad en portugués"}</a></p>}

        <div className="mt-12 space-y-8">
          {displayedSections.map((section, index) => (
            <section key={section.title} className="border-t border-white/10 pt-6">
              <h2 className="font-display text-xl font-semibold sm:text-2xl">{index + 1}. {section.title}</h2>
              <p className="mt-3 max-w-3xl leading-7 text-zinc-300">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-zinc-400">{copy ? copy.footer : <>As regras completas de retenção e os detalhes de compartilhamento precisam ser confirmados antes de a política ser considerada final.</>}</p>
          <button
            type="button"
            onClick={() => onNavigate("/contato")}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-brand-secondary px-5 font-semibold text-black transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
          >
            {copy ? copy.cta : <>Falar com a TAG08</>} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </article>
    </div>
  );
}
