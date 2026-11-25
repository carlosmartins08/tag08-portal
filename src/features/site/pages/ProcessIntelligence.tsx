import { useState } from "react";
import ResilientImage from "../../../components/ResilientImage";
import { AlertCircle, ArrowUpRight, ArrowRight, BarChart, Workflow, FileText, Server, Layers, Cpu, CheckCircle, MessageSquare } from "../../../components/DooIcons";
import { motion } from "motion/react";
import { buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl } from "../../../config/siteNetwork";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import TrackedOutboundLink from "../../../components/TrackedOutboundLink";
import { calculateProcessIntelligenceWaste } from "../../../lib/simulators/processIntelligence";
import { useSimulatorTracking } from "../../../lib/useSimulatorTracking";
import type { RouteLocale } from "../../../config/routeRegistry";

const copy = (locale: RouteLocale, pt: string, en: string, es: string) =>
    locale === "pt" ? pt : locale === "en" ? en : es;

const FAQ_COPY = {
    en: [
        { title: "ROUTINE AUDIT", question: "How is the initial operational audit conducted?", answer: "We conduct focused confidential interviews and observe day-to-day work with the people responsible for each area, identifying duplication, wasted effort, and internal communication gaps." },
        { title: "WIKI DELIVERABLES", question: "What is delivered at the end of the project?", answer: "We deliver a customized, integrated corporate wiki, usually organized in Notion or the company's central workspace, with interactive organizational charts and written practical playbooks." },
        { title: "TEAM INVOLVEMENT", question: "Will my team take part in the redesign?", answer: "Yes. We hold short, focused meetings with key team members to make sure redesigned workflows reflect operational reality and support future team onboarding." },
        { title: "LEADERSHIP TIME", question: "How much time will our company need to contribute?", answer: "The project is designed to reduce the time required from business partners. It requires brief onboarding meetings and short weekly reviews of playbook progress." }
    ],
    es: [
        { title: "AUDITORÍA DE RUTINA", question: "¿Cómo se realiza la auditoría operativa inicial?", answer: "Realizamos entrevistas confidenciales y enfocadas, además de observar el trabajo cotidiano junto a las personas responsables de cada área. Así identificamos duplicidades, esfuerzo desperdiciado y brechas de comunicación interna." },
        { title: "ENTREGA DE WIKIS", question: "¿Qué se entrega al final del proyecto?", answer: "Entregamos una wiki corporativa personalizada e integrada, normalmente organizada en Notion o en el espacio central de la empresa, con organigramas interactivos y playbooks prácticos por escrito." },
        { title: "PARTICIPACIÓN DEL EQUIPO", question: "¿Mi equipo participará en el rediseño?", answer: "Sí. Realizamos reuniones breves y enfocadas con personas clave para que los flujos rediseñados reflejen la realidad operativa y apoyen la incorporación de futuros integrantes." },
        { title: "TIEMPO DE LIDERAZGO", question: "¿Cuánto tiempo tendrá que dedicar nuestra empresa?", answer: "El proyecto busca reducir el tiempo requerido de los socios. Requiere reuniones breves de incorporación y revisiones semanales cortas del avance de los playbooks." }
    ]
} satisfies Record<Exclude<RouteLocale, "pt">, Array<{ title: string; question: string; answer: string }>>;

interface ProcessProps {
    onNavigate: (page: string) => void;
    locale?: RouteLocale;
}
export default function ProcessIntelligence({ onNavigate, locale = "pt" }: ProcessProps) {
    const [activeFaq, setActiveFaq] = useState(0);
    const [collaborators, setCollaborators] = useState(5);
    const [hoursPerDay, setHoursPerDay] = useState(2.5);
    const [monthlySalary, setMonthlySalary] = useState(4500);
    const trackSimulator = useSimulatorTracking("process_intelligence_waste", 1, "/servicos/process-intelligence");
    const waste = calculateProcessIntelligenceWaste({ collaborators, hoursPerDay, monthlySalary });
    const numberLocale = locale === "pt" ? "pt-BR" : locale === "en" ? "en-US" : "es-ES";
    const processIntelligenceBrazilUrl = buildBrazilWhatsAppUrl(copy(
        locale,
        `Hello TAG08! I used the Process Intelligence simulator with ${collaborators} collaborators, ${hoursPerDay.toLocaleString("en-US")} hours per person/day and an average monthly salary of BRL ${monthlySalary.toLocaleString("en-US")}. The estimate was ${waste.annualWasteHours.toLocaleString("en-US")} wasted hours per year, BRL ${waste.annualWasteCost.toLocaleString("en-US")} in annual cost and ${waste.recoverableHours.toLocaleString("en-US")} recoverable hours. I would like to discuss the next step.`,
        `Hello TAG08! I used the Process Intelligence simulator with ${collaborators} team members, ${hoursPerDay.toLocaleString(numberLocale)} hours per person/day, and an average monthly salary of BRL ${monthlySalary.toLocaleString(numberLocale)}. The estimate was ${waste.annualWasteHours.toLocaleString(numberLocale)} hours lost per year, BRL ${waste.annualWasteCost.toLocaleString(numberLocale)} in annual cost, and ${waste.recoverableHours.toLocaleString(numberLocale)} recoverable hours. I would like to discuss the next step.`,
        `Hola TAG08. Usé el simulador de Process Intelligence con ${collaborators} personas, ${hoursPerDay.toLocaleString(numberLocale)} horas por persona al día y un salario mensual promedio de BRL ${monthlySalary.toLocaleString(numberLocale)}. La estimación fue de ${waste.annualWasteHours.toLocaleString(numberLocale)} horas perdidas al año, BRL ${waste.annualWasteCost.toLocaleString(numberLocale)} de costo anual y ${waste.recoverableHours.toLocaleString(numberLocale)} horas recuperables. Me gustaría conversar sobre el siguiente paso.`
    ));
    const processIntelligenceInternationalUrl = buildInternationalWhatsAppUrl(copy(
        locale,
        `Olá TAG08! Usei o simulador de Process Intelligence com ${collaborators} colaboradores, ${hoursPerDay.toLocaleString(numberLocale)} horas por pessoa/dia e salário médio de R$ ${monthlySalary.toLocaleString(numberLocale)}. A estimativa foi de ${waste.annualWasteHours.toLocaleString(numberLocale)} horas desperdiçadas por ano, R$ ${waste.annualWasteCost.toLocaleString(numberLocale)} em custo anual e ${waste.recoverableHours.toLocaleString(numberLocale)} horas recuperáveis. Quero conversar sobre o próximo passo.`,
        `Hello TAG08! I used the Process Intelligence simulator with ${collaborators} collaborators, ${hoursPerDay.toLocaleString(numberLocale)} hours per person/day and an average monthly salary of BRL ${monthlySalary.toLocaleString(numberLocale)}. The estimate was ${waste.annualWasteHours.toLocaleString(numberLocale)} wasted hours per year, BRL ${waste.annualWasteCost.toLocaleString(numberLocale)} in annual cost and ${waste.recoverableHours.toLocaleString(numberLocale)} recoverable hours. I would like to discuss the next step.`,
        `Hola TAG08. Usé el simulador de Process Intelligence con ${collaborators} colaboradores, ${hoursPerDay.toLocaleString(numberLocale)} horas por persona al día y un salario mensual promedio de BRL ${monthlySalary.toLocaleString(numberLocale)}. La estimación fue de ${waste.annualWasteHours.toLocaleString(numberLocale)} horas desperdiciadas al año, BRL ${waste.annualWasteCost.toLocaleString(numberLocale)} de costo anual y ${waste.recoverableHours.toLocaleString(numberLocale)} horas recuperables. Me gustaría conversar sobre el siguiente paso.`
    ));
    const handleLinkClick = (page: string) => {
        onNavigate(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    return (<div className="bg-charcoal-950 text-white min-h-screen pb-20 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-[8%] left-[-15%] w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none"/>
      <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] bg-brand/[0.02] rounded-full blur-[150px] pointer-events-none"/>

      {/* Subtle floating 3D element in the background of user focus */}
      <Subtle3DCanvas intensity={1.3} className="absolute right-[-8%] top-[5%] w-[480px] h-[480px] opacity-[0.35] mix-blend-screen hidden lg:block"/>

      {/* SECTION 1 - HERO: THE EDITORIAL SYSTEM (Synchronized Style) */}
      <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          {/* 1. Header Typography block (Ref Style: Expert guidance / tailored solution) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 lg:items-center text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta self-start">
                {copy(locale, "DIVISÃO DE PROCESSOS E ESTRUTURAS // TAG08", "PROCESS AND STRUCTURE DIVISION // TAG08", "DIVISIÓN DE PROCESOS Y ESTRUCTURAS // TAG08")}
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter font-display">
                Process Intelligence <br />
                <span className="text-brand">{copy(locale, "para transformar caos operacional em clareza para crescer.", "to turn operational chaos into clarity for growth.", "para transformar el caos operativo en claridad para crecer.")}</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-sm leading-relaxed font-sans font-medium">
                {copy(locale, "Sua empresa atende bem, mas sofre com fricção ou desorganização interna? Mapeamos, diagnosticamos e estruturamos todos os seus departamentos em wikis organizadas e fluxos táticos claros para que seu negócio ganhe autonomia de crescimento contínuo.", "Does your business serve customers well but struggle with friction or internal disorganization? We map, diagnose, and structure departments in organized wikis and clear workflows to support more autonomous, continuous growth.", "¿Tu empresa atiende bien, pero tiene fricciones o desorganización interna? Mapeamos, diagnosticamos y estructuramos tus áreas en wikis organizadas y flujos claros para apoyar un crecimiento continuo con mayor autonomía.")}
              </p>
            </div>
          </div>

          {/* 2. Panoramic Wide Banner Image with capsule neon overlay trigger wrapped in 3D perspective tilt container */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <ResilientImage fallbackLabel={copy(locale, "Mapeamento de processos TAG08", "TAG08 process mapping", "Mapeo de procesos TAG08")} src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1600" alt={copy(locale, "Mapeamento de Processos TAG08", "TAG08 Process Mapping", "Mapeo de procesos TAG08")} sizes="100vw" preload className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-[1.01] transition-all duration-1000 ease-out" referrerPolicy="no-referrer"/>
              {/* Elegant overlay masks */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"/>
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none"/>

              {/* Glowing neon action button floating inside face banner mimicking "Free Trial" anchor */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{ transform: "translateZ(45px)" }}>
                <button onClick={() => handleLinkClick("/contato")} className="group bg-brand-secondary text-black font-sans font-black text-xs sm:text-xs uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] hover:scale-105 duration-300 transition-all border border-brand-secondary hover:bg-brand-dark flex items-center gap-2 cursor-pointer z-20">
                  <span>{copy(locale, "RESERVAR AUDITORIA", "BOOK AN AUDIT", "RESERVAR UNA AUDITORÍA")}</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]"/>
                </button>
              </div>

              {/* Absolute indicator tags on corners */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="tag08-meta text-xs text-brand-secondary tracking-widest block uppercase font-bold">TAG08 DIAGNOSTIC CONSOLE</span>
                  <h4 className="font-display font-black text-white text-xs sm:text-sm tracking-tight leading-none">{copy(locale, "Mapeamento Técnico de Fluxo de Produção", "Technical Production Workflow Mapping", "Mapeo técnico del flujo de producción")}</h4>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-xs text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"/>
                  <span>PROC_INTELLIGENCE // ENGAGED</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* 3. High status core statistics row matching screenshot layout */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">{copy(locale, "4 Semanas", "4 Weeks", "4 semanas")}</span>
              <span className="block text-zinc-500 tag08-meta text-xs uppercase tracking-widest leading-normal">{copy(locale, "Mapeamento de Diagnóstico", "Diagnostic Mapping", "Mapeo del diagnóstico")}<br />{copy(locale, "e Entrega dos Playbooks", "and Playbook Delivery", "y entrega de playbooks")}</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">-50%</span>
              <span className="block text-zinc-500 tag08-meta text-xs uppercase tracking-widest leading-normal">{copy(locale, "Redução em Atividades e", "Reduction in Activities and", "Reducción de actividades y")}<br />{copy(locale, "Reuniões Caóticas Secundárias", "Secondary Chaotic Meetings", "Reuniones caóticas secundarias")}</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Wiki</span>
              <span className="block text-zinc-500 tag08-meta text-xs uppercase tracking-widest leading-normal">{copy(locale, "Centralização das Senhas,", "Centralized Passwords,", "Centralización de contraseñas,")}<br />{copy(locale, "Materiais e Diretrizes de Equipe", "Materials, and Team Guidelines", "materiales y directrices del equipo")}</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">3x</span>
              <span className="block text-zinc-500 tag08-meta text-xs uppercase tracking-widest leading-normal">{copy(locale, "Mais Rapidez de Treinamento", "Faster Training", "Capacitación más rápida")}<br />{copy(locale, "para Novos Integrantes", "for New Team Members", "para nuevos integrantes")}</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2 - PAIN DIAGNOSTIC: THE INVISBLE CHAOS CHECKLIST */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-zinc-950 text-left relative overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-brand/[0.015] rounded-full blur-[140px] pointer-events-none"/>
        
        <div className="max-w-7xl mx-auto space-y-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              {copy(locale, "PATOLOGIAS OPERACIONAIS // DIAGNÓSTICO", "OPERATIONAL ISSUES // DIAGNOSIS", "PROBLEMAS OPERATIVOS // DIAGNÓSTICO")}
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-white leading-tight">
                {copy(locale, 'Sinais invisaveis de "Caos Organizado" na sua empresa', 'Invisible signs of "organized chaos" in your business', 'Señales invisibles de "caos organizado" en tu empresa')}
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                {copy(locale, "Muitas lideranças acreditam que a empresa está funcionando bem apenas porque faturam, ignorando a enorme queima de margem invisível gerada pelo improviso tático:", "Some leaders assume the business is running well because it is generating revenue, overlooking the margin loss that can result from tactical improvisation:", "Algunos líderes creen que la empresa funciona bien porque factura e ignoran la pérdida de margen que puede generar la improvisación táctica:")}
              </p>
            </div>

            <div className="lg:col-span-1"/>

            <div className="lg:col-span-6 space-y-4">
              {(locale === "pt" ? [
            { title: "Buscas e Rastreamento Lentos", desc: "Sua equipe perde mais de 20 minutos todos os dias para localizar um arquivo simples, contrato, senha ou instrução básica." },
            { title: "Onboarding Demorado e Doloroso", desc: "Treinar um novo contratado exige longas reuniões manuais guiadas pelos gestores, queimando tempo de liderança sênior." },
            { title: "Dependência Severa de Pessoas-Chave", desc: "Se um funcionário central sênior adoece ou pede demissão, uma parte inteira da sua operação simplesmente colapsa ou para." },
            { title: "Refação Constantemente Ativa", desc: "A mesma tarefa precisa ser refeita múltiplas vezes porque os critérios de qualidade e padrões nunca foram formalizados." }
        ] : locale === "en" ? [
            { title: "Slow Search and Retrieval", desc: "Your team spends more than 20 minutes every day locating a simple file, contract, password, or basic instruction." },
            { title: "Slow and Difficult Onboarding", desc: "Training a new hire requires lengthy manual meetings led by managers, taking time from senior leadership." },
            { title: "Heavy Dependence on Key People", desc: "If a key senior employee becomes ill or leaves, an entire part of the operation may collapse or stop." },
            { title: "Repeated Rework", desc: "The same task must be done multiple times because quality criteria and standards were never formalized." }
        ] : [
            { title: "Búsqueda y localización lentas", desc: "Tu equipo pierde más de 20 minutos al día buscando un archivo, contrato, contraseña o instrucción básica." },
            { title: "Incorporación lenta y difícil", desc: "Capacitar a una nueva persona requiere reuniones manuales largas dirigidas por los responsables, consumiendo tiempo de la dirección sénior." },
            { title: "Alta dependencia de personas clave", desc: "Si una persona sénior clave se enferma o deja la empresa, una parte entera de la operación puede colapsar o detenerse." },
            { title: "Repetición constante del trabajo", desc: "La misma tarea debe repetirse porque nunca se formalizaron los criterios de calidad ni los estándares." }
        ]).map((item, idx) => (<div key={idx} className="p-4 rounded-xl bg-charcoal-900 border border-white/[0.04] space-y-1">
                  <h4 className="text-white text-xs sm:text-sm font-display font-medium tracking-tight flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary"/> {item.title}
                  </h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{item.desc}</p>
                </div>))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - DELIVERABLES (The "What" with Clean Features Grid) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-2 max-w-2xl">
              <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-bold">{copy(locale, "ATIVOS TANGÍVEIS ENTREGUES DE IMEDIATO", "TANGIBLE ASSETS DELIVERED", "ACTIVOS TANGIBLES ENTREGADOS")}</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">{copy(locale, "O QUE ENTREGAMOS NA NOSSA ASSESSORIA", "WHAT OUR ENGAGEMENT DELIVERS", "QUÉ ENTREGAMOS EN NUESTRO SERVICIO")}</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              {copy(locale, "Não fazemos relatórios teóricos de 300 páginas que ninguém lê. Entregamos ativos de processos prontos para rodar na rotina prática do seu negócio.", "We do not deliver theoretical 300-page reports that go unread. We deliver process assets designed for use in your business's daily operations.", "No entregamos informes teóricos de 300 páginas que nadie lee. Entregamos activos de procesos preparados para usarse en la operación diaria de tu negocio.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <BarChart className="w-5 h-5 text-brand"/>
              </div>
              <div className="space-y-1">
                      <h4 className="text-white font-display font-black text-sm">{copy(locale, "Diagnóstico Amplo", "Broad Diagnosis", "Diagnóstico integral")}</h4>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {copy(locale, "Auditoria de ferramentas, entrevistas em detalhes com os colaboradores atuais, mensuração estruturada dos pontos cegos e desperdício de retrabalho corporativo por falta de precedência.", "An audit of tools, detailed interviews with current team members, and a structured assessment of blind spots and rework associated with missing process dependencies.", "Auditoría de herramientas, entrevistas detalladas con el equipo actual y evaluación estructurada de puntos ciegos y retrabajo asociado a la falta de precedencias.")}
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Workflow className="w-5 h-5 text-brand"/>
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm">{copy(locale, "Mapeamento de Fluxos", "Workflow Mapping", "Mapeo de flujos")}</h4>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Organização dos organogramas de setores de forma visual no Miro ou Figma. Deixamos transparente o exato fluxo de cada tarefa no comita de decisaes de rotina.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <FileText className="w-5 h-5 text-brand"/>
              </div>
              <div className="space-y-1">
                      <h4 className="text-white font-display font-black text-sm">{copy(locale, "Playbooks Práticos", "Practical Playbooks", "Playbooks prácticos")}</h4>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {copy(locale, "Manuais operacionais escritos por departamento (Onboarding, Comercial, Entrega, Suporte) em linguagem extremamente compreensível para treinamento ágil.", "Departmental operating manuals (onboarding, sales, delivery, and support) written in clear language for practical training.", "Manuales operativos por área (incorporación, ventas, entrega y soporte), escritos en un lenguaje claro para facilitar la capacitación.")}
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Server className="w-5 h-5 text-brand"/>
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm">{copy(locale, "Base No Notion", "Notion Workspace", "Espacio de trabajo en Notion")}</h4>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {copy(locale, "Construção de uma wiki corporativa integrada unificando senhas seguras, manuais em vídeo, contatos críticos e links recorrentes para a equipe consultar rápido sem perguntar em e-mails.", "Creation of an integrated company wiki bringing together secure passwords, video manuals, key contacts, and recurring links for the team to consult without searching through email.", "Creación de una wiki corporativa integrada con contraseñas seguras, manuales en video, contactos clave y enlaces frecuentes para que el equipo consulte la información sin buscarla en el correo.")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - METHODOLOGY FASES (How we build the intelligence) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04] bg-charcoal-900/10 text-left">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-bold">{copy(locale, "INTEGRIDADE DE CONSTRUÇÃO DE ATIVOS", "STRUCTURED ASSET DEVELOPMENT", "DESARROLLO ESTRUCTURADO DE ACTIVOS")}</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">{copy(locale, "COMO DESENHAMOS SEUS PROCESSOS", "HOW WE DESIGN YOUR PROCESSES", "CÓMO DISEÑAMOS TUS PROCESOS")}</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              {copy(locale, "Nossa intervenção técnica é estruturada em blocos seguros, sem causar paralisações operacionais no seu faturamento diário.", "Our technical work is structured in controlled stages to avoid interrupting day-to-day operations and revenue activities.", "Nuestro trabajo técnico se organiza en etapas controladas para evitar interrupciones en la operación diaria y en las actividades de facturación.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-4">
                    <span className="font-sans text-brand text-xs font-black">{copy(locale, "FASE A // DIAGNÓSTICO PROFUNDO", "PHASE A // IN-DEPTH DIAGNOSIS", "FASE A // DIAGNÓSTICO EN PROFUNDIDAD")}</span>
              <h4 className="text-white font-display font-black text-base leading-none">{copy(locale, "Mergulho no Cotidiano", "A Look into Daily Operations", "Análisis de la operación diaria")}</h4>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                {copy(locale, "Analise direta do ecossistema de produtividade, gargalos técnicos e vazamento produtivo por parte da equipe atual através de entrevistas e alocação de tempo real de tarefas.", "A direct review of the productivity environment, technical bottlenecks, and lost team capacity through interviews and observation of time spent on tasks.", "Análisis directo del entorno de productividad, los obstáculos técnicos y la capacidad perdida del equipo mediante entrevistas y observación del tiempo dedicado a las tareas.")}
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-4">
              <span className="font-sans text-brand text-xs font-black">{copy(locale, "FASE B // REDESENHO DE FLUXOS", "PHASE B // WORKFLOW REDESIGN", "FASE B // REDISEÑO DE FLUJOS")}</span>
              <h4 className="text-white font-display font-black text-base leading-none">{copy(locale, "A Engenharia do Workflow", "Workflow Design", "Diseño del flujo de trabajo")}</h4>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                {copy(locale, "Organizamos organogramas e precedências visuais claras, extinguindo redundâncias ou esperas longas de validação que paralisam o cronograma de entrega B2B das suas divisões.", "We organize reporting structures and clear workflow dependencies, addressing duplication and lengthy approval waits that delay B2B delivery across departments.", "Organizamos estructuras y dependencias claras de los flujos, abordando duplicidades y largas esperas de aprobación que retrasan la entrega B2B entre áreas.")}
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-4">
              <span className="font-sans text-brand text-xs font-black">{copy(locale, "FASE C // ENTREGA E CENTRALIZAÇÃO", "PHASE C // DELIVERY AND CENTRALIZATION", "FASE C // ENTREGA Y CENTRALIZACIÓN")}</span>
              <h4 className="text-white font-display font-black text-base leading-none">{copy(locale, "Os Playbooks e Wikis Ativos", "Playbooks and Active Wikis", "Playbooks y wikis activos")}</h4>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                {copy(locale, "Montagem e refinamento no Notion ou wiki própria, contendo senhas organizadas, canais, contatos e playbooks escritos em linguagem acessível e legível.", "Setup and refinement in Notion or a company wiki, with organized passwords, channels, contacts, and playbooks written in accessible, readable language.", "Configuración y mejora en Notion o en una wiki propia, con contraseñas organizadas, canales, contactos y playbooks redactados en un lenguaje accesible y claro.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE INNOVATION: CALCULADORA DE GARGALOS E ROI DE EFICIÊNCIA */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-950 text-left relative overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-brand-secondary/[0.01] rounded-full blur-[140px] pointer-events-none"/>
        
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                  {copy(locale, "DIAGNÓSTICO FINANCEIRO // CALCULADORA DE DESPERDÍCIO", "FINANCIAL DIAGNOSIS // WASTE CALCULATOR", "DIAGNÓSTICO FINANCIERO // CALCULADORA DE DESPERDICIO")}
            </span>
            <h2 className="font-display font-medium text-3xl text-white tracking-tight">
              {copy(locale, "Calculadora de Desperdício Operacional e ROI de Processos", "Operational Waste and Process ROI Calculator", "Calculadora de desperdicio operativo y retorno de procesos")}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
              {copy(locale, "Trabalho manual repetitivo drena o foco da sua equipe de vendas e operações. Estime abaixo o tempo perdido com preenchimento manual de planilhas, alertas de CRM ausentes e repetição de dados, e descubra o custo financeiro invisível anual que sua holding ou operação está absorvendo de forma passiva.", "Repetitive manual work takes focus away from sales and operations. Estimate time spent on manual spreadsheets, missing CRM alerts, and duplicated data to see the annual cost estimated by this calculator.", "El trabajo manual repetitivo desvía la atención de ventas y operaciones. Estima el tiempo dedicado a hojas de cálculo manuales, alertas de CRM ausentes y datos repetidos para ver el costo anual estimado por esta calculadora.")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Controles de Entrada */}
            <div className="lg:col-span-5 bg-charcoal-900/60 border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-6">
                <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest font-bold block pb-3 border-b border-white/[0.05]">
                  {copy(locale, "Mapeamento da sua Operação:", "Mapping Your Operation:", "Mapeo de tu operación:")}
                </span>

                {/* Slider 1: Colaboradores */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="process-intelligence-collaborators" className="text-xs tag08-meta text-zinc-300 font-bold uppercase tracking-wider">
                      {copy(locale, "Colaboradores Afetados:", "Team Members Affected:", "Personas del equipo afectadas:")}
                    </label>
                    <span className="text-sm font-sans text-brand-secondary font-black bg-brand-secondary/10 px-2.5 py-0.5 rounded-lg border border-brand-secondary/20">
                      <span>{collaborators}</span> {copy(locale, "pessoas", "people", "personas")}
                    </span>
                  </div>
                  <input type="range" id="process-intelligence-collaborators" min="1" max="40" step="1" value={collaborators} onChange={(event) => { trackSimulator("input_changed"); setCollaborators(Number(event.target.value)); }} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-secondary"/>
                  <div className="flex items-center justify-between text-xs font-sans text-zinc-500">
                    <span>{copy(locale, "1 pessoa", "1 person", "1 persona")}</span>
                    <span>{copy(locale, "20 pessoas", "20 people", "20 personas")}</span>
                    <span>{copy(locale, "40 pessoas+", "40+ people", "40 personas+")}</span>
                  </div>
                </div>

                {/* Slider 2: Horas Gastas */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="process-intelligence-hours-per-day" className="text-xs tag08-meta text-zinc-300 font-bold uppercase tracking-wider">
                      {copy(locale, "Tempo perdido por pessoa/dia:", "Time lost per person/day:", "Tiempo perdido por persona/día:")}
                    </label>
                    <span className="text-sm font-sans text-white font-semibold">
                      <span>{hoursPerDay.toFixed(1)}</span> {copy(locale, "horas", "hours", "horas")}
                    </span>
                  </div>
                  <input type="range" id="process-intelligence-hours-per-day" min="0.5" max="8.0" step="0.5" value={hoursPerDay} onChange={(event) => { trackSimulator("input_changed"); setHoursPerDay(Number(event.target.value)); }} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"/>
                  <div className="flex items-center justify-between text-xs font-sans text-zinc-500">
                    <span>{copy(locale, "30 min (Tolerável)", "30 min (Tolerable)", "30 min (Tolerable)")}</span>
                    <span>{copy(locale, "4 horas (Grave)", "4 hours (Severe)", "4 horas (Grave)")}</span>
                    <span>{copy(locale, "8 horas (Totalmente manual)", "8 hours (Fully manual)", "8 horas (Totalmente manual)")}</span>
                  </div>
                </div>

                {/* Slider 3: Salario Madio */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="process-intelligence-monthly-salary" className="text-xs tag08-meta text-zinc-300 font-bold uppercase tracking-wider">
                      {copy(locale, "Salário Médio Mensal (R$):", "Average Monthly Salary (BRL):", "Salario mensual promedio (BRL):")}
                    </label>
                    <span className="text-sm font-sans text-white font-semibold">
                      R$ <span>{monthlySalary.toLocaleString("pt-BR")}</span>
                    </span>
                  </div>
                  <input type="range" id="process-intelligence-monthly-salary" min="2000" max="15000" step="500" value={monthlySalary} onChange={(event) => { trackSimulator("input_changed"); setMonthlySalary(Number(event.target.value)); }} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"/>
                  <div className="flex items-center justify-between text-xs font-sans text-zinc-500">
                    <span>R$ 2.000</span>
                    <span>R$ 8.500</span>
                    <span>R$ 15.000+</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-2">
                <div className="flex items-center gap-2 text-brand">
                  <AlertCircle className="w-4 h-4 shrink-0"/>
                  <span className="text-xs tag08-meta font-black uppercase tracking-wider">{copy(locale, "O gargalo do trabalho invisível", "The Hidden Work Bottleneck", "El cuello de botella del trabajo invisible")}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {copy(locale, "Quando um funcionário gasta 2 horas copiando dados de um site para o CRM, gerando PDFs manuais ou formatando propostas sem padrão, a empresa reduz sua capacidade de atuação comercial por falta de foco.", "When an employee spends 2 hours copying data from a website into a CRM, creating PDFs manually, or formatting proposals without a standard, the company has less capacity for commercial work.", "Cuando una persona dedica 2 horas a copiar datos de un sitio web al CRM, crear PDF manualmente o dar formato a propuestas sin un estándar, la empresa reduce su capacidad comercial.")}
                </p>
              </div>
            </div>

            {/* Painel de Resultados */}
            <div className="lg:col-span-7 bg-[#09090b] border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-2xl pointer-events-none"/>

              <div className="space-y-6 w-full">
                <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest font-bold block">
                  {copy(locale, "Perda Produtiva e ROI Operacional Projetado:", "Projected Productivity Loss and Operational ROI:", "Pérdida de productividad y retorno operativo proyectado:")}
                </span>

                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="font-sans text-xs text-zinc-500 uppercase font-black block">{copy(locale, "Horas Desperdiçadas / Ano", "Hours Wasted / Year", "Horas desperdiciadas / año")}</span>
                    <p className="text-3xl font-display font-black text-white">{waste.annualWasteHours.toLocaleString("pt-BR")}h</p>
                    <span className="text-xs text-zinc-400 block leading-tight font-sans">
                      {copy(locale, "Período total do time gasto em tarefas robóticas.", "Total team time spent on repetitive tasks.", "Tiempo total del equipo dedicado a tareas repetitivas.")}
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-brand-secondary/[0.02] border border-brand-secondary/10 space-y-1">
                    <span className="font-sans text-xs text-brand-secondary/80 uppercase font-black block">{copy(locale, "Custo do Desperdício / Ano", "Cost of Waste / Year", "Costo del desperdicio / año")}</span>
                    <p className="text-2xl sm:text-3xl font-display font-black text-brand-secondary">R$ {waste.annualWasteCost.toLocaleString("pt-BR")}</p>
                    <span className="text-xs text-zinc-400 block leading-tight font-sans">
                      {copy(locale, "Dinheiro direto perdido pagando tempo improdutivo.", "Money spent on unproductive time.", "Dinero gastado en tiempo improductivo.")}
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 space-y-1">
                    <span className="font-sans text-xs text-emerald-500/80 uppercase font-black block">{copy(locale, "Horas Recuperaveis (Anual)", "Recoverable Hours (Annual)", "Horas recuperables (anuales)")}</span>
                    <p className="text-3xl font-display font-black text-emerald-500">{waste.recoverableHours.toLocaleString("pt-BR")}h</p>
                    <span className="text-xs text-zinc-400 block leading-tight font-sans">
                      {copy(locale, "Tempo recuperado para direcionar a atividades de alta receita.", "Time recovered for activities that generate revenue.", "Tiempo recuperado para dedicarlo a actividades que generan ingresos.")}
                    </span>
                  </div>
                </div>

                {/* Where is this time going? (Progress breakdown) */}
                <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5 space-y-4 text-xs">
                  <span className="font-sans text-xs text-zinc-500 uppercase font-bold block">{copy(locale, "Gargalos Classicos de Perda Operacional", "Common Sources of Operational Waste", "Fuentes habituales de desperdicio operativo")}</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-zinc-400">
                    <div className="space-y-1 bg-white/[0.01] p-3 rounded-xl border border-white/[0.02]">
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-white font-bold">{copy(locale, "1. Atualização Manual de CRM", "1. Manual CRM Updates", "1. Actualización manual del CRM")}</span>
                        <span>{copy(locale, "35% do desperdício", "35% of waste", "35% del desperdicio")}</span>
                      </div>
                      <p className="text-xs leading-tight text-zinc-500">{copy(locale, "Equipe digitando e colando nomes de leads e telefones de planilhas.", "Team members entering and copying lead names and phone numbers from spreadsheets.", "El equipo introduce y copia nombres y teléfonos de prospectos desde hojas de cálculo.")}</p>
                    </div>

                    <div className="space-y-1 bg-white/[0.01] p-3 rounded-xl border border-white/[0.02]">
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-white font-bold">{copy(locale, "2. Criação de PDFs e Contratos", "2. Creating PDFs and Contracts", "2. Creación de PDF y contratos")}</span>
                        <span>{copy(locale, "25% do desperdício", "25% of waste", "25% del desperdicio")}</span>
                      </div>
                      <p className="text-xs leading-tight text-zinc-500">{copy(locale, "Escrever contratos copiando dados antigos no Word um por um.", "Writing contracts by copying old data into Word one document at a time.", "Redactar contratos copiando datos anteriores en Word, uno por uno.")}</p>
                    </div>

                    <div className="space-y-1 bg-white/[0.01] p-3 rounded-xl border border-white/[0.02]">
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-white font-bold">{copy(locale, "3. Avisos & Follow-ups Soltos", "3. Disconnected Reminders and Follow-ups", "3. Avisos y seguimientos desconectados")}</span>
                        <span>{copy(locale, "20% do desperdício", "20% of waste", "20% del desperdicio")}</span>
                      </div>
                      <p className="text-xs leading-tight text-zinc-500">{copy(locale, "Esquecer de cobrar propostas por falta de lembretes integrados e automáticos.", "Forgetting to follow up on proposals because integrated automatic reminders are missing.", "Olvidar el seguimiento de propuestas por falta de recordatorios automáticos integrados.")}</p>
                    </div>

                    <div className="space-y-1 bg-white/[0.01] p-3 rounded-xl border border-white/[0.02]">
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-white font-bold">{copy(locale, "4. Transferência de Arquivos", "4. File Transfers", "4. Transferencia de archivos")}</span>
                        <span>{copy(locale, "20% do desperdício", "20% of waste", "20% del desperdicio")}</span>
                      </div>
                      <p className="text-xs leading-tight text-zinc-500">{copy(locale, "Mover propostas do Drive para o e-mail ou WhatsApp manualmente.", "Manually moving proposals from Drive to email or WhatsApp.", "Mover propuestas manualmente de Drive al correo electrónico o WhatsApp.")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 mt-6">
                <span className="font-sans text-xs text-zinc-600">{copy(locale, "MÉTRICAS BASEADAS EM DIAGNÓSTICOS DE EMPRESAS B2B REALIZADOS // 2026", "METRICS BASED ON B2B COMPANY DIAGNOSTICS // 2026", "MÉTRICAS BASADAS EN DIAGNÓSTICOS REALIZADOS A EMPRESAS B2B // 2026")}</span>
                <button onClick={() => onNavigate("/contato")} className="text-xs font-sans text-brand font-black uppercase hover:underline flex items-center gap-1.5 cursor-pointer focus:outline-none">
                  {copy(locale, "Mapear Meus Gargalos", "Map My Bottlenecks", "Identificar mis obstáculos")} <ArrowRight className="w-3.5 h-3.5"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - TRUST CORE BAR */}
      <section className="px-4 sm:px-6 md:px-8 py-10 border-b border-white/[0.04] bg-charcoal-900/40 text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-3xl">
                      <h4 className="text-white font-display font-black text-sm tracking-tight">{copy(locale, "AUTONOMIA OPERACIONAL E GOVERNANÇA DE VERDADE", "OPERATIONAL AUTONOMY AND PRACTICAL GOVERNANCE", "AUTONOMÍA OPERATIVA Y GOBERNANZA REAL")}</h4>
            <p className="text-zinc-400 text-xs font-sans font-medium leading-relaxed">
              O objetivo final a fazer com que sua empresa ganhe autonomia real, permitindo que a equipe execute as entregas sob o mesmo nível rigoroso de qualidade sem que os fundadores precisem ficar vigiando ou ditando cada passo das tarefas.
            </p>
          </div>
          <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest border border-brand-secondary/20 bg-brand-secondary/5 px-3.5 py-2 rounded-xl shrink-0 font-black">
            PROCESS INTELLIGENCE // TAG08
          </span>
        </div>
      </section>

      {/* OPERATIONS / PROCESSES CLIENTS LOGO SOCIAL PROOF */}
      <ServiceInsightsBridge servicePath="/servicos/process-intelligence" locale={locale} onNavigate={onNavigate}/>

      {/* SECTION - WORK SYSTEM (WhatsApp Neon Callout inspired by screenshot) */}
      <section className="py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none"/>

          {/* Left Column: Portrait */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[520px]">
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden"/>
            <ResilientImage fallbackLabel="Especialista em processos TAG08" sizes="(max-width: 1024px) 100vw, 42vw" src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800" alt="TAG08 Process Specialist" className="object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[15%] transition-all duration-500 hover:scale-105" referrerPolicy="no-referrer"/>
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between items-start">
                <span className="tag08-meta text-xs text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  {copy(locale, "OPERATIONAL CORE", "OPERATIONAL CORE", "NÚCLEO OPERATIVO")}
                </span>
                <span className="font-sans text-xs text-white/40 tracking-wider">
                  TAG08.v3
                </span>
              </div>
              <div className="space-y-1.5 opacity-30 select-none">
                <div className="font-display font-extrabold text-[1.8rem] text-white/40 tracking-widest leading-none uppercase select-none">
                  processes_intel
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                  governanaa_atamica_
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-sans text-xs text-white/40 tracking-wider">
                  LATENCY: 12MS
                </span>
                <span className="tag08-meta text-xs text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  {copy(locale, "SÊNIOR SECURITY", "SENIOR SECURITY", "SEGURIDAD SÉNIOR")}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 text-left h-full relative z-10 lg:pl-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-black font-semibold">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-brand animate-ping"/>
                </div>
                <span className="tag08-meta text-xs tracking-widest uppercase font-bold text-black/90">
                  {copy(locale, "CONFIRA NOSSO SISTEMA DE TRABALHO", "SEE HOW WE WORK", "CONOCE NUESTRO MÉTODO DE TRABAJO")}
                </span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black leading-[0.9] tracking-tighter font-display">
                {copy(locale, "DESENHAMOS FLUXOS", "WE DESIGN WORKFLOWS", "DISEÑAMOS FLUJOS")} <br />
                {copy(locale, "E PROTOCOLOS SÉRIOS!", "AND RELIABLE PROTOCOLS!", "¡Y PROTOCOLOS SÓLIDOS!")}
              </h2>
              <p className="text-black/85 text-xs sm:text-xs max-w-lg leading-relaxed font-sans font-extrabold uppercase">
                {copy(locale, "ACABE COM A DESORGANIZAÇÃO DE INFORMAÇÕES E EQUIPE. DOCUMENTAMOS PLAYBOOKS CIRÚRGICOS, REDESENHAMOS WORKFLOWS NO NOTION E LIBERAMOS SUA EMPRESA DA DEPENDÊNCIA DE PESSOAS-CHAVE.", "ORGANIZE TEAM INFORMATION. WE DOCUMENT PLAYBOOKS, REDESIGN WORKFLOWS IN NOTION, AND HELP REDUCE DEPENDENCE ON KEY PEOPLE.", "ORGANIZA LA INFORMACIÓN DEL EQUIPO. DOCUMENTAMOS PLAYBOOKS, REDISEÑAMOS FLUJOS EN NOTION Y AYUDAMOS A REDUCIR LA DEPENDENCIA DE PERSONAS CLAVE.")}
              </p>
            </div>

            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 max-w-md relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none"/>
              <div className="flex gap-4 items-start select-none">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black shrink-0 shadow-lg shadow-brand/10 hover:scale-105 transition-transform duration-200">
                  <Workflow className="w-5 h-5 stroke-[2.5] text-black"/>
                </div>
                <div className="space-y-0.5">
                  <span className="tag08-meta text-xs text-brand uppercase tracking-wider font-extrabold block">
                    {copy(locale, "GOVERNANÇA PLENA", "OPERATIONAL GOVERNANCE", "GOBERNANZA OPERATIVA")}
                  </span>
                  <p className="text-white text-xs leading-snug font-sans font-semibold">
                    {copy(locale, "Unifique diretrizes operacionais de faturamento, atendimento e onboarding de novos colaboradores em playbooks funcionais legaveis.", "Unify operating guidelines for billing, service, and onboarding new team members in readable, practical playbooks.", "Unifica las directrices operativas de facturación, atención e incorporación de nuevos integrantes en playbooks funcionales y legibles.")}
                  </p>
                </div>
              </div>

              {/* DUAL CLIENT CONNECTION CHANNELS (BR & INT) */}
              <div className="space-y-3">
                <TrackedOutboundLink label="Solicitar diagnóstico de Process Intelligence" surface="process-intelligence-contact-card-br" href={processIntelligenceBrazilUrl} onClick={() => trackSimulator("cta_clicked")} target="_blank" rel="noreferrer" className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-black transition-all duration-200">
                        <span className="text-xs font-sans font-black tracking-tight text-brand group-hover:text-black">BR</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="tag08-meta text-xs text-zinc-500 uppercase font-black tracking-wider leading-none">
                          {copy(locale, "PROPRIETÁRIO DIRETO (WhatsApp)", "DIRECT OWNER (WhatsApp)", "CONTACTO DIRECTO CON EL PROPIETARIO (WhatsApp)")}
                        </span>
                        <span className="text-white text-xs font-sans font-bold tracking-wider group-hover:text-brand transition-colors mt-0.5">
                          +55 83 9.9886-8882
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-brand tag08-meta font-bold uppercase tracking-wider bg-brand/10 py-1 px-2.5 rounded-lg group-hover:bg-brand group-hover:text-black transition-all">
                      {copy(locale, "CONECTAR", "CONNECT", "CONTACTAR")}
                    </span>
                  </div>
                </TrackedOutboundLink>

                <TrackedOutboundLink label="Request Process Intelligence consulting" surface="process-intelligence-contact-card-int" href={processIntelligenceInternationalUrl} target="_blank" rel="noreferrer" className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary shrink-0 group-hover:bg-brand-secondary group-hover:text-black transition-all duration-200">
                        <span className="text-xs font-sans font-black tracking-tight text-brand-secondary group-hover:text-black">INT</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="tag08-meta text-xs text-zinc-500 uppercase font-black tracking-wider leading-none">
                          {copy(locale, "CONTATO INTERNACIONAL DIRETO (WhatsApp)", "INTERNATIONAL DIRECT (WhatsApp)", "CONTACTO INTERNACIONAL DIRECTO (WhatsApp)")}
                        </span>
                        <span className="text-white text-xs font-sans font-bold tracking-wider group-hover:text-brand-secondary transition-colors mt-0.5">
                          +56 9 9793 7611
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-brand-secondary tag08-meta font-bold uppercase tracking-wider bg-brand-secondary/10 py-1 px-2.5 rounded-lg group-hover:bg-brand-secondary group-hover:text-black transition-all">
                      {copy(locale, "CONECTAR", "CONNECT", "CONTACTAR")}
                    </span>
                  </div>
                </TrackedOutboundLink>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"/>
                  <span className="tag08-meta text-xs text-white/50 uppercase tracking-widest font-extrabold">
                    AGÊNCIA TAG08
                  </span>
                </div>
                <span className="font-sans text-xs text-brand font-bold bg-brand/10 border border-brand/20 px-2 rounded">
                  {copy(locale, "OPERAÇÃO ATIVA 100% online", "ACTIVE OPERATIONS, 100% ONLINE", "OPERACIÓN ACTIVA 100% EN LÍNEA")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOVO BLOCO: CAOS ORGANIZADO, aREAS ESTRUTURADAS, INSUMOS, O QUE FICA, CTA PARA PROCESS ACTIVATION */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-zinc-950 text-left">
        <div className="max-w-7xl mx-auto space-y-24">
          


          {/* areas Estruturadas pelo Projeto */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-10 border-t border-white/[0.04]">
            <div className="lg:col-span-5 space-y-4">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                {copy(locale, "ESCOPO DE MAPEAMENTO", "MAPPING SCOPE", "ALCANCE DEL MAPEO")}
              </span>
              <h3 className="font-display font-medium text-2xl text-white">
                {copy(locale, "Os pilares operacionais que auditamos e desenhamos", "The operational areas we audit and design", "Las áreas operativas que auditamos y diseñamos")}
              </h3>
                <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                {copy(locale, "Não fazemos modelagens teóricas abstratas. Desenhamos fluxos táticos funcionais em todas as frentes cruciais do seu modelo corporativo:", "We do not create abstract theoretical models. We design practical workflows across the critical areas of your business:", "No creamos modelos teóricos abstractos. Diseñamos flujos funcionales en las áreas clave de tu empresa:")}
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(locale === "pt" ? [
            { title: "Funil Comercial & Vendas B2B", desc: "Passo a passo exato do lead recebido, qualificação interna, roteiros de demonstração e transição de fechamento." },
            { title: "Onboarding de Novos Clientes", desc: "Disparo automático de boas-vindas, coleta segura de briefings e configuração de canais contratuais." },
            { title: "Execução & Entrega Técnica", desc: "Cadeia de produção, limites de escopo e fluxos internos de controle de qualidade para evitar perdas de margem." },
            { title: "Administrativo & Financeiro", desc: "Rotinas semanais de faturamento corporativo, cobranças automáticas de inadimplência e conciliações." }
        ] : locale === "en" ? [
            { title: "Sales Funnel and B2B Sales", desc: "The steps from receiving a lead through internal qualification, demonstration scripts, and the transition to closing." },
            { title: "New Client Onboarding", desc: "Automated welcome messages, secure brief collection, and setup of contractual channels." },
            { title: "Technical Delivery", desc: "Production sequence, scope limits, and internal quality-control workflows to help prevent margin loss." },
            { title: "Administration and Finance", desc: "Weekly billing routines, automated overdue-payment follow-ups, and reconciliations." }
        ] : [
            { title: "Embudo comercial y ventas B2B", desc: "Pasos desde la recepción del prospecto hasta su calificación interna, guiones de demostración y transición al cierre." },
            { title: "Incorporación de nuevos clientes", desc: "Mensajes de bienvenida automatizados, recopilación segura de información inicial y configuración de canales contractuales." },
            { title: "Ejecución y entrega técnica", desc: "Cadena de producción, límites de alcance y flujos internos de control de calidad para ayudar a evitar pérdidas de margen." },
            { title: "Administración y finanzas", desc: "Rutinas semanales de facturación, seguimiento automatizado de pagos atrasados y conciliaciones." }
        ]).map((area, aIdx) => (<div key={aIdx} className="p-5 rounded-2xl bg-charcoal-900 border border-white/[0.04] space-y-1.5">
                  <h4 className="text-white font-display font-bold tracking-tight text-xs sm:text-sm text-brand">{area.title}</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{area.desc}</p>
                </div>))}
            </div>
          </div>

          {/* O que precisamos de você (Insumo do Cliente) */}
          <div className="space-y-8 pt-10 border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                {copy(locale, "ALIANÇA DE TRABALHO // REQUISITOS DE CONTA", "WORKING PARTNERSHIP // CLIENT INPUT", "COLABORACIÓN // APORTES DEL CLIENTE")}
              </span>
              <h3 className="font-display font-medium text-2xl text-white">
                {copy(locale, "O insumo necessário de sua marca no projeto de Inteligência", "What your business needs to contribute to the project", "Lo que tu empresa debe aportar al proyecto")}
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed max-w-2xl">
                {copy(locale, "Nossa entrega metodológica é sênior, mas depende de entrevistas estratégicas básicas com sua liderança para catalogar os processos existentes:", "Our methodology is led by experienced professionals and depends on strategic interviews with your leadership to document existing processes:", "Nuestro trabajo metodológico es liderado por profesionales sénior y requiere entrevistas estratégicas con tu liderazgo para documentar los procesos existentes:")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(locale === "pt" ? [
            { step: "A", title: "Entrevistas Gravadas de 40 min", desc: "Conversamos individualmente com cada gestor para colher as rotinas reais executadas nos bastidores." },
            { step: "B", title: "Acesso a Manuais Existentes", desc: "Analisamos blocos de anotações antigos, mensagens ou diretrizes informais soltas para consolidação estrita." },
            { step: "C", title: "Gravações Piloto de Tela (Loom)", desc: "Seus operadores gravam tarefas complexas em vídeo curto para podermos estruturar o passo a passo com precisão." }
        ] : locale === "en" ? [
            { step: "A", title: "Recorded 40-Minute Interviews", desc: "We speak individually with each manager to understand the routines carried out behind the scenes." },
            { step: "B", title: "Access to Existing Manuals", desc: "We review old notes, messages, and informal guidelines for consolidation." },
            { step: "C", title: "Pilot Screen Recordings (Loom)", desc: "Your team records complex tasks in short videos so we can document each step accurately." }
        ] : [
            { step: "A", title: "Entrevistas grabadas de 40 minutos", desc: "Conversamos individualmente con cada responsable para conocer las rutinas que se realizan en el día a día." },
            { step: "B", title: "Acceso a manuales existentes", desc: "Revisamos notas antiguas, mensajes y directrices informales para consolidarlos." },
            { step: "C", title: "Grabaciones piloto de pantalla (Loom)", desc: "Tu equipo graba tareas complejas en videos breves para que podamos documentar cada paso con precisión." }
        ]).map((ins, idx) => (<div key={idx} className="p-6 rounded-2xl bg-[#0c0c0e] border border-white/[0.04] space-y-3 relative overflow-hidden">
                  <div className="absolute top-2 right-4 font-sans font-black text-white/5 text-4xl">{ins.step}</div>
                  <h4 className="text-white font-display font-bold text-xs sm:text-sm tracking-tight leading-tight">{ins.title}</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{ins.desc}</p>
                </div>))}
            </div>
          </div>

          {/* O que resta depois do projeto de Processos */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-10 border-t border-white/[0.04]">
            <div className="lg:col-span-5 space-y-4">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                {copy(locale, "PATRIMÔNIO INTELECTUAL // LEGADO REAL", "INTELLECTUAL ASSETS // LASTING VALUE", "ACTIVOS INTELECTUALES // VALOR DURADERO")}
              </span>
              <h3 className="font-display font-medium text-2xl text-white">
                {copy(locale, "O que de fato fica na sua empresa após nossa modelagem?", "What remains in your company after the process design?", "¿Qué permanece en tu empresa después del diseño de procesos?")}
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                {copy(locale, "Nós não entregamos relatórios frios de consultoria tradicional que viram poeira digital em pastas do Google Drive. Entregamos ativos de processos reais:", "We do not deliver traditional consulting reports that sit unused in Google Drive folders. We deliver practical process assets:", "No entregamos informes de consultoría tradicional que quedan olvidados en carpetas de Google Drive. Entregamos activos de procesos prácticos:")}
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {(locale === "pt" ? [
            { title: "Wikis Centrais de Processos", desc: "Seu portal de processos unificado e limpo em plataformas como Notion ou similar, ordenado por departamentos." },
            { title: "Tutoriais Rápidos em Vídeo", desc: "Vídeos curtos e explicativos anexados a cada tarefa do sistema, para que novos contratados executem as atividades sem dúvidas." },
            { title: "Diagramação de Fluxos Visuais", desc: "Mapas mentais geométricos que descrevem visualmente quem faz o quê e qual é o gatilho de cada decisão." },
            { title: "Checklists Operacionais de Rotina", desc: "Listagem diaria para guiar os operadores, deixando as obrigações absolutamente claras no inacio de cada manha." }
        ] : locale === "en" ? [
            { title: "Central Process Wikis", desc: "A clean, unified process portal in Notion or a similar platform, organized by department." },
            { title: "Short Video Tutorials", desc: "Short explanatory videos attached to each system task, so new hires can perform activities with fewer questions." },
            { title: "Visual Workflow Diagrams", desc: "Visual maps showing who does what and what triggers each decision." },
            { title: "Daily Operating Checklists", desc: "Listagem diaria para guiar os operadores, deixando as obrigações absolutamente claras no inacio de cada manha." }
        ] : [
            { title: "Wikis centrales de procesos", desc: "Un portal de procesos unificado y ordenado en Notion o una plataforma similar, organizado por áreas." },
            { title: "Tutoriales breves en video", desc: "Videos breves y explicativos adjuntos a cada tarea del sistema para que las nuevas personas puedan realizarla sin dudas." },
            { title: "Diagramas visuales de flujos", desc: "Mapas visuales que describen quién hace qué y cuál es el desencadenante de cada decisión." },
            { title: "Listas de verificación operativas", desc: "Listagem diaria para guiar os operadores, deixando as obrigações absolutamente claras no inacio de cada manha." }
        ]).map((item, idx) => (<div key={idx} className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.03] space-y-1">
                  <h4 className="text-white font-display font-bold tracking-tight text-xs sm:text-sm">{item.title}</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{item.desc}</p>
                </div>))}
            </div>
          </div>

          {/* CTA conectando ao Process Activation */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            <div className="space-y-1.5">
              <h3 className="font-display font-semibold text-lg text-white">{copy(locale, "Próximo Passo: Implantar com Maestria", "Next Step: Guided Implementation", "Siguiente paso: implementación guiada")}</h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans max-w-xl leading-relaxed">
                {copy(locale, "Se os processos forem mapeados, mas sua equipe não os seguir, o caos continuará. Conheça nossa divisão complementar de ativação e auditoria para garantir a adoção.", "Mapping processes is not enough if the team does not follow them. Learn about our complementary activation and audit service, designed to support adoption.", "Mapear los procesos no basta si el equipo no los sigue. Conoce nuestro servicio complementario de activación y auditoría, diseñado para apoyar su adopción.")}
              </p>
            </div>
            <button onClick={() => {
            onNavigate("/servicos/process-activation");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }} className="px-6 py-4 bg-brand-secondary hover:bg-brand-dark text-black text-xs tag08-meta font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shrink-0">
              {copy(locale, "Conhecer Process Activation", "Explore Process Activation", "Conocer Process Activation")}
            </button>
          </div>

        </div>
      </section>

      {/* SECTION - FAQ */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[160px] pointer-events-none"/>

        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[40px] bg-charcoal-950 border border-white/[0.04] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none"/>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
                  {copy(locale, "FAQ // ENCONTRE RESPOSTAS", "FAQ // FIND ANSWERS", "PREGUNTAS FRECUENTES // ENCUENTRA RESPUESTAS")}
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter">
                  {copy(locale, "DaVIDAS &", "QUESTIONS &", "PREGUNTAS E")} <br />
                  {copy(locale, "INTELIGÊNCIA", "INTELLIGENCE", "INTELIGENCIA")}
                </h2>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-sans max-w-sm">
                  {copy(locale, "Esclareça as principais dúvidas sobre nossa auditoria e mapeamento de inteligência estrutural para sua equipe tática.", "Find answers to common questions about our audit and structural intelligence mapping for your team.", "Resuelve tus principales dudas sobre nuestra auditoría y el mapeo de inteligencia estructural para tu equipo.")}
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {([
            { id: 0, title: "AUDITORIA DE ROTINA" },
            { id: 1, title: "ENTREGA DE WIKIS" },
            { id: 2, title: "ENVOLVIMENTO DO TIME" },
            { id: 3, title: "ESFORÇO DOS FUNDADORES" }
        ]).map((item) => (<button key={item.id} onClick={() => setActiveFaq(item.id)} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group cursor-pointer ${activeFaq === item.id
                ? "bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)]"
                : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"}`}>
                    <span className="tag08-meta text-xs font-black uppercase tracking-wider flex items-center gap-3">
                      <span className={activeFaq === item.id ? "text-black" : "text-brand"}>
                        {String(item.id + 1).padStart(2, '0')}.
                      </span>
                      {locale === "pt" ? item.title : FAQ_COPY[locale][item.id].title}
                    </span>
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${activeFaq === item.id ? "text-black rotate-[-45deg] stroke-[2.5]" : "text-zinc-500"}`}/>
                  </button>))}
              </div>
            </div>

            <div className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-white/[0.04] bg-[#0c0c0e]">
              <ResilientImage fallbackLabel="Process Intelligence // TAG08" sizes="(max-width: 1024px) 100vw, 34vw" src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800" alt="TAG08 Process Intelligence" className="object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"/>
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2"/>
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse"/>
                </svg>
              </div>
              <div className="absolute top-6 left-6 z-10 pointer-events-none tag08-meta text-xs text-white/20 uppercase tracking-widest leading-none">
                SYS // PROCESS_INTEL
              </div>

              <div className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left">
                <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black block">
                  {locale === "pt" ? ([
            "AUDITORIA DE ROTINA",
            "ENTREGA DE WIKIS",
            "ENVOLVIMENTO DO TIME",
            "ESFORÇO DOS FUNDADORES"
        ])[activeFaq] : FAQ_COPY[locale][activeFaq].title}
                </span>
                
                <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {locale === "pt" ? ([
            "Como a feita a auditoria operacional inicial?",
            "O que a entregue no final do projeto?",
            "Minha equipe participara do redesenho?",
            "Qual o tempo de esforço exigido de nossa empresa?"
        ])[activeFaq] : FAQ_COPY[locale][activeFaq].question}
                </h4>
                
                <p className="text-zinc-300 text-xs sm:text-xs leading-relaxed font-sans font-medium">
                  {locale === "pt" ? ([
            "Realizamos um mergulho assistido por meio de entrevistas sigilosas focadas e inspeções cotidianas junto aos responsáveis de setores da sua empresa, identificando redundâncias, vazamento de energia e ruídos internos de comunicação.",
            "Entregamos uma Wiki Corporativa personalizada e organizada de forma integrada (geralmente estruturada no Notion ou central da empresa) contendo todos os organogramas interativos de faturamento e manuais práticos de playbooks escritos.",
            "Sim. Conduzimos reuniões curtas direcionadas com os colaboradores-chave para garantir que os workflows redesenhados condigam plenamente com a realidade operacional, assegurando máxima eficácia de onboarding da equipe futura.",
            "Muito enxuto. O projeto é projetado para desonerar a agenda dos sócios. Exigimos apenas breves reuniões cirúrgicas de onboarding e validações rápidas semanais de progresso dos playbooks."
        ])[activeFaq] : FAQ_COPY[locale][activeFaq].answer}
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest block font-bold">{copy(locale, "PROPOSTA DE VALOR", "VALUE PROPOSITION", "PROPUESTA DE VALOR")}</span>
                <h4 className="text-white font-semibold text-sm leading-snug">{copy(locale, "Como agimos de forma organizada?", "How do we bring structure to the work?", "¿Cómo organizamos el trabajo?")}</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    {copy(locale, "Eliminamos redundâncias de tarefas e ruídos diários internos. Blindamos suas decisões comerciais.", "We eliminate task duplication and daily internal communication noise. We protect your commercial decisions.", "Eliminamos duplicidades de tareas y el ruido interno diario. Protegemos tus decisiones comerciales.")}
                  </p>
                </div>
                <button onClick={() => handleLinkClick("/servicos")} className="group flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5">
                  <span>{copy(locale, "Ver Serviços", "View Services", "Ver servicios")}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"/>
                </button>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-black/60 uppercase tracking-widest block font-extrabold">{copy(locale, "FALE COM O DIRETOR", "TALK TO THE DIRECTOR", "HABLA CON EL DIRECTOR")}</span>
                  <h4 className="text-black font-black text-sm leading-tight tracking-tight">{copy(locale, "Quer desenhar uma estratégia sob medida?", "Would you like to design a tailored strategy?", "¿Quieres diseñar una estrategia a medida?")}</h4>
                  <p className="text-black/85 text-xs font-semibold leading-relaxed font-sans">
                    {copy(locale, "Fale diretamente com os tomadores de decisão da TAG08 via WhatsApp para avaliar a viabilidade de alocação de equipe.", "Speak directly with TAG08 decision-makers on WhatsApp to assess the feasibility of assigning a team.", "Habla directamente con quienes toman decisiones en TAG08 por WhatsApp para evaluar la viabilidad de asignar un equipo.")}
                  </p>
                </div>
                <TrackedOutboundLink label="Conversar agora" surface="process-intelligence-final-cta" href={buildBrazilWhatsAppUrl("Olá,%20gostaria%20de%20consultar%20viabilidade%20estratégica%20especializada%2520para%20minha%20marca!")} target="_blank" rel="noreferrer" className="group flex items-center justify-between text-xs font-sans font-black text-black select-none border-t border-black/10 pt-3 hover:translate-x-0.5 transition-all">
                  <span>{copy(locale, "Conversar Agora", "Talk Now", "Conversar ahora")}</span>
                  <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]"/>
                </TrackedOutboundLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 - ACTION TRIGGER FOOTER */}
      <section className="px-4 sm:px-6 md:px-8 py-20 text-center space-y-6 max-w-4xl mx-auto">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-none tracking-tighter">
          {copy(locale, "CONSTRUA UMA ESTRUTURA AUTÔNOMA", "BUILD AN AUTONOMOUS STRUCTURE", "CONSTRUYE UNA ESTRUCTURA AUTÓNOMA")} <br />
          <span className="text-brand">{copy(locale, "QUE OPERA CUMPRINDO PROTOCOLOS SÁBIOS.", "THAT OPERATES WITH CLEAR PROTOCOLS.", "QUE OPERA CON PROTOCOLOS CLAROS.")}</span>
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                {copy(locale, "Chega de viver escravizado por dezenas de mensagens caóticas no WhatsApp da equipe. Fale conosco agora e agende sua auditoria diagnóstica operacional.", "Stop being overwhelmed by dozens of chaotic WhatsApp messages from your team. Talk to us and schedule your operational diagnostic audit.", "Deja de sentirte abrumado por decenas de mensajes caóticos del equipo en WhatsApp. Habla con nosotros y agenda tu auditoría diagnóstica operativa.")}
        </p>
        <div className="pt-4">
          <button onClick={() => handleLinkClick("/contato")} className="group bg-brand text-black font-sans font-black text-xs uppercase tracking-widest py-4 px-8 rounded-full shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.22)] hover:bg-brand-dark duration-300 transition-all cursor-pointer flex items-center gap-2 mx-auto">
            <span>{copy(locale, "ESTRUTURAR MINHA ROTINA OPERACIONAL", "STRUCTURE MY OPERATIONS", "ESTRUCTURAR MI OPERACIÓN")}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]"/>
          </button>
        </div>
      </section>
    </div>);
}
