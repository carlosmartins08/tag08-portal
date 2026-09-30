import { useRef, useState } from "react";
import ResilientImage from "../../../components/ResilientImage";
import { Sparkles, ArrowUpRight, Shield, ArrowRight, Layers, Percent, TrendingUp, HelpCircle } from "lucide-react";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import TrackedOutboundLink from "../../../components/TrackedOutboundLink";
import { buildBrazilWhatsAppUrl } from "../../../config/siteNetwork";
import { trackSimulatorEvent } from "../../../lib/analytics";
import { calculateAffiliateCommission } from "../../../lib/simulators/affiliateCommission";

interface ProgramaAfiliadosProps {
  onNavigate: (page: string) => void;
}

export default function ProgramaAfiliados({ onNavigate }: ProgramaAfiliadosProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const trackedSimulatorActions = useRef(new Set<string>());
  
  // Commission simulator parameters
  const [numBranding, setNumBranding] = useState<number>(1);
  const [numWebsites, setNumWebsites] = useState<number>(1);
  const [numRedesSociais, setNumRedesSociais] = useState<number>(1);

  const { brandingCommission, websitesCommission, socialMediaCommission: redesSociaisCommission, totalOneTime, totalRecurring } = calculateAffiliateCommission({
    brandingProjects: numBranding,
    websiteProjects: numWebsites,
    socialMediaContracts: numRedesSociais
  });

  const trackAffiliateSimulator = (action: "input_changed" | "cta_clicked") => {
    const base = {
      simulator_id: "affiliate_commission",
      simulator_version: 1,
      page_path: "/programa-afiliados"
    };

    if (!trackedSimulatorActions.current.has("started")) {
      trackSimulatorEvent({ ...base, action: "started" });
      trackedSimulatorActions.current.add("started");
    }

    if (!trackedSimulatorActions.current.has(action)) {
      trackSimulatorEvent({ ...base, action });
      trackedSimulatorActions.current.add(action);
    }

    if (action === "input_changed" && !trackedSimulatorActions.current.has("result_viewed")) {
      trackSimulatorEvent({ ...base, action: "result_viewed" });
      trackedSimulatorActions.current.add("result_viewed");
    }
  };

  const faqs = [
    {
      q: "Quem pode se cadastrar no Programa de Afiliados?",
      a: "Qualquer pessoa física ou jurídica que possua relacionamento comercial com outras empresas. Ideal para freelancers, consultores de marketing, agências de publicidade complementares, designers, gestores de tráfego, contadores ou parceiros que confiam e indicam o trabalho da TAG08."
    },
    {
      q: "Qual é o valor da comissão oferecida?",
      a: "Fornecemos 10% de comissão sobre o valor líquido fechado do contrato. Para projetos de escopo fixo, como Branding e Desenvolvimento Web, a comissão é paga de forma única sobre os marcos liquidados. Para contratos recorrentes, como Gestão de Redes Sociais, você recebe 10% a cada mês enquanto o cliente permanecer ativo na agência, até o limite contratual de 12 meses."
    },
    {
      q: "Como indico um novo cliente e garanto meu comissionamento?",
      a: "Após se cadastrar no programa, você terá um canal direto com nosso gerente de contas. Cada indicação é registrada e vinculada ao seu nome ou CNPJ. Quando a proposta comercial é enviada ao lead indicado, você recebe uma notificação para acompanhar o progresso."
    },
    {
      q: "Qual é o prazo e a forma de pagamento da comissão?",
      a: "Os pagamentos são liberados e transferidos via PIX em até 5 dias úteis após a compensação efetiva do pagamento do cliente, seja em parcelas mensais ou no pagamento integral das etapas do projeto."
    },
    {
      q: "Eu preciso fechar a venda com o cliente indicado?",
      a: "Não. Seu papel é fazer a ponte inicial e apresentar um contato qualificado com interesse real nos nossos serviços. A apresentação de portfólio, formulação da proposta técnica, reuniões de fechamento e negociações ficam a cargo da equipe de vendas."
    }
  ];

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pb-20 relative overflow-hidden">
      {/* Ambient gradients */}
      <div className="absolute top-[8%] left-[-15%] w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] bg-brand/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Floating 3D background elements */}
      <Subtle3DCanvas intensity={1.5} className="absolute right-[-8%] top-[5%] w-[480px] h-[480px] opacity-[0.35] mix-blend-screen hidden lg:block" />

      {/* HERO SECTION */}
      <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 lg:items-center text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta self-start">
                PROGRAMA DE AFILIADOS // INDIQUE E GANHE
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter">
                INDIQUE CLIENTES, <br />
                <span className="text-brand-secondary">RECEBA COMISSÕES POR INDICAÇÕES.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-sm leading-relaxed font-sans font-medium">
                Recomende soluções de Branding, Desenvolvimento Web e Gestão de Mídias da TAG08. O programa prevê 10% sobre o valor líquido fechado, com pagamento conforme as regras do contrato e recorrência limitada a 12 meses.
              </p>
            </div>
          </div>

          {/* Large Hero Banner with Tilt animation */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[4/3] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <ResilientImage
                fallbackLabel="Programa de afiliados TAG08"
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1600"
                alt="Programa de Afiliados e Parceiros Comerciais TAG08"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1280px"
                className="w-full h-full object-cover grayscale brightness-40 transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.01]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent pointer-events-none" />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{ transform: "translateZ(45px)" }}>
                <TrackedOutboundLink
                  href={buildBrazilWhatsAppUrl("Olá,%20gostaria%20de%20me%20cadastrar%20no%20Programa%20de%20Afiliados%20da%20TAG08%20para%20fazer%20indicações!")}
                  target="_blank"
                  rel="noreferrer"
                  label="Cadastrar no programa de afiliados"
                  surface="affiliate-hero"
                  className="group min-h-11 bg-brand-secondary text-black font-sans font-black text-xs uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] motion-safe:hover:scale-105 transition-[background-color,box-shadow,transform] duration-200 border border-brand-secondary hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-black flex items-center gap-2 cursor-pointer z-20"
                >
                  <span>CADASTRAR MINHA INDICAÇÃO</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </TrackedOutboundLink>
              </div>

              {/* Absolutes tags in corners */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="tag08-meta text-xs text-brand-secondary tracking-widest block uppercase font-bold">ALTA PERFORMANCE E TRANSPARÊNCIA</span>
                  <p className="font-display font-black text-white text-xs sm:text-sm tracking-tight leading-none">Comissões pagas via Pix conforme o contrato</p>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-xs text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand motion-safe:animate-pulse" aria-hidden="true" />
                  <span>SIMULAÇÃO ATUALIZADA</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">10%</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">Percentual líquido<br/>por indicação fechada</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">Recorrente</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">Comissão mensal sobre<br/>serviços recorrentes</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Até 5 dias</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">Após a compensação<br/>do pagamento do cliente</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">R$ 0,00</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">Sem custo de adesão<br/>para parceiros</span>
            </div>
          </div>

        </div>
      </section>

      {/* DYNAMIC COMMISSION CALCULATOR */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 text-left relative overflow-hidden">
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/[0.015] rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              SIMULADOR DE GANHOS // RECEITAS POTENCIAIS
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">Simule suas Comissões Estimadas</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Ajuste uma quantidade hipotética de indicações fechadas em cada pilar e visualize uma estimativa baseada nos tickets médios de referência do programa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* Left Controls */}
            <div className="lg:col-span-7 bg-charcoal-900 border border-white/[0.05] p-8 rounded-3xl space-y-8 flex flex-col justify-between">
              
              {/* Branding Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-sans text-zinc-300">
                  <span className="flex items-center gap-1.5 font-bold uppercase"><Layers className="w-4 h-4 text-brand" /> Branding &amp; Identidade Visual</span>
                  <span className="text-brand-secondary font-black">{numBranding} {numBranding === 1 ? "projeto" : "projetos"}</span>
                </div>
                <input 
                  type="range" 
                  aria-label="Quantidade de projetos de branding e identidade visual"
                  aria-valuetext={`${numBranding} ${numBranding === 1 ? "projeto" : "projetos"} de branding`}
                  aria-describedby="affiliate-branding-help"
                  min="0" 
                  max="12" 
                  value={numBranding} 
                  onChange={(e) => {
                    setNumBranding(parseInt(e.target.value) || 0);
                    trackAffiliateSimulator("input_changed");
                  }}
                  className="w-full accent-brand-secondary cursor-pointer bg-charcoal-950 h-2 rounded-lg"
                />
                <div id="affiliate-branding-help" className="flex justify-between text-xs text-zinc-400 font-sans">
                  <span>Média do Projeto: R$ 3.500,00</span>
                  <span>Comissão por projeto: R$ 350,00</span>
                </div>
              </div>

              {/* Websites Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-sans text-zinc-300">
                  <span className="flex items-center gap-1.5 font-bold uppercase"><Sparkles className="w-4 h-4 text-brand" /> Sites &amp; Landing Pages</span>
                  <span className="text-brand-secondary font-black">{numWebsites} {numWebsites === 1 ? "projeto" : "projetos"}</span>
                </div>
                <input 
                  type="range" 
                  aria-label="Quantidade de projetos de sites e landing pages"
                  aria-valuetext={`${numWebsites} ${numWebsites === 1 ? "projeto" : "projetos"} de site`}
                  aria-describedby="affiliate-websites-help"
                  min="0" 
                  max="12" 
                  value={numWebsites} 
                  onChange={(e) => {
                    setNumWebsites(parseInt(e.target.value) || 0);
                    trackAffiliateSimulator("input_changed");
                  }}
                  className="w-full accent-brand-secondary cursor-pointer bg-charcoal-950 h-2 rounded-lg"
                />
                <div id="affiliate-websites-help" className="flex justify-between text-xs text-zinc-400 font-sans">
                  <span>Média do Projeto: R$ 5.500,00</span>
                  <span>Comissão por projeto: R$ 550,00</span>
                </div>
              </div>

              {/* Redes Sociais Support Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-sans text-zinc-300">
                  <span className="flex items-center gap-1.5 font-bold uppercase"><TrendingUp className="w-4 h-4 text-brand" /> Gestão de Redes Sociais (Mensal)</span>
                  <span className="text-brand-secondary font-black">{numRedesSociais} {numRedesSociais === 1 ? "contrato" : "contratos"}</span>
                </div>
                <input 
                  type="range" 
                  aria-label="Quantidade de contratos de gestao de redes sociais"
                  aria-valuetext={`${numRedesSociais} ${numRedesSociais === 1 ? "contrato" : "contratos"} mensais de redes sociais`}
                  aria-describedby="affiliate-social-help"
                  min="0" 
                  max="12" 
                  value={numRedesSociais} 
                  onChange={(e) => {
                    setNumRedesSociais(parseInt(e.target.value) || 0);
                    trackAffiliateSimulator("input_changed");
                  }}
                  className="w-full accent-brand-secondary cursor-pointer bg-charcoal-950 h-2 rounded-lg"
                />
                <div id="affiliate-social-help" className="flex justify-between text-xs text-zinc-400 font-sans">
                  <span>Média Mensal: R$ 2.200,00</span>
                  <span>Comissão Mensal Recorrente: R$ 220,00 por cliente</span>
                </div>
              </div>

            </div>

            {/* Right Display Card */}
            <div className="lg:col-span-5 bg-gradient-to-b from-neutral-900 to-charcoal-900 border border-white/[0.08] p-8 rounded-3xl flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/[0.03] rounded-full blur-xl pointer-events-none" aria-hidden="true" />
              
              <div className="space-y-6">
                <div>
                  <span className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest block font-bold leading-normal">ESTIMATIVA DO SIMULADOR</span>
                  <h3 className="font-display font-black text-2xl text-white tracking-tight leading-none mt-1">Ganhos de Indicação</h3>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/[0.04]" aria-live="polite" aria-atomic="true">
                  <div>
                    <span className="block text-xs text-zinc-400 tag08-meta uppercase tracking-widest leading-none">Projetos Pontuais (Fechamento Único):</span>
                    <span className="block font-display font-black text-2xl sm:text-3xl text-white mt-1">
                      R$ {totalOneTime.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs text-zinc-400 tag08-meta uppercase tracking-widest leading-none">Comissão Recorrente (Mensal):</span>
                    <span className="block font-display font-black text-2xl sm:text-3xl text-brand-secondary mt-1">
                      R$ {totalRecurring.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-8 space-y-4">
                <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium">
                  Valores estimados com base nos tickets médios de referência de Branding, Desenvolvimento Web e Gestão de Redes Sociais. O valor real depende do contrato fechado e dos pagamentos compensados.
                </p>

                <TrackedOutboundLink
                  href={buildBrazilWhatsAppUrl(`Olá,%20fiz%20uma%20simulação%20no%20site%20da%20TAG08!%20Gostaria%20de%20indicar%20oportunidades%20para%20Branding%20(${numBranding}%20proj),%20Sites%20(${numWebsites}%20proj)%20e%20Redes%20Sociais%20(${numRedesSociais}%20mensais).`)}
                  target="_blank"
                  rel="noreferrer"
                  label="Enviar simulação de afiliados"
                  surface="affiliate-simulator"
                  onClick={() => trackAffiliateSimulator("cta_clicked")}
                  className="group min-h-11 w-full bg-brand-secondary text-black font-sans font-black text-xs uppercase tracking-widest py-3.5 px-6 rounded-full shadow-[0_15px_30px_rgba(var(--color-brand-secondary-rgb),0.15)] flex items-center justify-center gap-1.5 motion-safe:hover:scale-[1.02] transition-[background-color,box-shadow,transform] duration-200 cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900"
                >
                  <span>GARANTIR MINHAS INDICAÇÕES</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </TrackedOutboundLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY PARTNER WITH US? */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-bold">VANTAGENS COMPETITIVAS</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">Vantagens de ser Parceiro TAG08</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Oferecemos muito mais do que apenas repasses financeiros. Nós cuidamos do fechamento e garantimos a integridade do portfólio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-charcoal-900 border border-white/[0.06] rounded-3xl p-8 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Percent className="w-5 h-5 text-brand" />
              </div>
              <h3 className="text-white font-display font-bold text-sm">Comissão de 10%</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium">
                A comissão prevista é de 10% sobre o valor líquido do contrato fechado, com repasse para a conta informada após a compensação do pagamento.
              </p>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.06] rounded-3xl p-8 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-brand-secondary" />
              </div>
              <h3 className="text-white font-display font-bold text-sm">Recorrência mensal</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium">
                Em serviços recorrentes, a comissão pode ser paga mensalmente enquanto o contrato estiver ativo, respeitando o limite contratual de até 12 meses.
              </p>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.06] rounded-3xl p-8 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Shield className="w-5 h-5 text-brand" />
              </div>
              <h3 className="text-white font-display font-bold text-sm">Portfólio para indicar</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium">
                Você apresenta soluções de Branding, Web e Redes Sociais com escopos organizados e uma equipe responsável pela condução comercial e técnica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS FLUX */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-900/30 text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              FLUXOGRAMA OPERACIONAL // PASSO A PASSO
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">O Fluxo da sua Renda com Indicações</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Da simples introdução até o repasse do pix de comissão, mapeamos todo o percurso de forma totalmente ágil e sem percalços.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", term: "CADASTRO & REGISTRO", desc: "Entre em contato conosco para registrar os dados básicos ou envie o contato da indicação diretamente ao nosso gerente de contas parceiras." },
              { num: "02", term: "ABORDAGEM COMERCIAL", desc: "Nossa equipe sênior assume as negociações comerciais, elabora a proposta e faz a apresentação profissional do portfólio." },
              { num: "03", term: "CONTRATO ASSINADO", desc: "A venda é formalizada com o cliente. Notificamos você quando a contratação do projeto for confirmada." },
              { num: "04", term: "RECEBIMENTO NO PIX", desc: "A cada pagamento ou mensalidade compensada enviada pelo cliente à agência, realizamos o repasse dos 10% em sua conta informada." }
            ].map((step, sIdx) => (
              <div key={sIdx} className="bg-charcoal-900 border border-white/[0.04] p-6 rounded-2xl space-y-4 flex flex-col justify-between relative hover:border-brand/20 transition-[border-color] duration-200">
                <span className="font-display font-black text-3xl text-brand-secondary">{step.num}</span>
                <div className="space-y-1">
                  <h3 className="text-white tag08-meta text-xs tracking-wider font-bold">{step.term}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="px-4 sm:px-6 md:px-8 py-24 max-w-4xl mx-auto space-y-12 text-left">
        <div className="text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-brand mx-auto" />
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">DÚVIDAS FREQUENTES SOBRE O PROGRAMA</h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-medium">
            Confira detalhes operacionais e tire todas as suas dúvidas sobre o andamento e compensação dos afiliados.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, fIdx) => (
            <div 
              key={fIdx} 
              className="border border-white/[0.04] bg-charcoal-900 rounded-2xl overflow-hidden hover:border-brand/20 transition-[border-color] duration-200"
            >
              <h3 className="m-0">
                <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === fIdx ? null : fIdx)}
                id={`affiliate-faq-question-${fIdx}`}
                aria-expanded={activeFaq === fIdx}
                aria-controls={`affiliate-faq-panel-${fIdx}`}
                className="min-h-11 w-full p-6 text-left flex items-center justify-between text-white font-display font-semibold text-xs sm:text-sm uppercase tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset cursor-pointer"
                >
                <span>{faq.q}</span>
                <span aria-hidden="true" className="text-brand font-sans text-lg shrink-0 ml-4 font-bold">
                  {activeFaq === fIdx ? "−" : "+"}
                </span>
                </button>
              </h3>
              
              {activeFaq === fIdx && (
                <div id={`affiliate-faq-panel-${fIdx}`} role="region" aria-labelledby={`affiliate-faq-question-${fIdx}`} className="px-6 pb-6 text-zinc-400 text-xs sm:text-xs font-sans leading-relaxed border-t border-white/[0.02] pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <ServiceInsightsBridge servicePath="/programa-afiliados" onNavigate={onNavigate} />

      {/* FINAL CALL TO ACTION CARD */}
      <section className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto pt-8">
        <div className="border border-white/[0.08] bg-gradient-to-br from-charcoal-900 to-black rounded-[32px] p-8 sm:p-12 md:p-16 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-20%] w-[450px] h-[450px] bg-brand/10 blur-[130px] rounded-full pointer-events-none" />
          
          <span className="tag08-meta text-xs text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/20 px-3 py-1 rounded-full uppercase tracking-widest font-black inline-block z-10">
            AUMENTE SUA RECEITA COM MENOS BUROCRACIA
          </span>
          
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tighter leading-tight max-w-3xl mx-auto z-10">
            PRONTO PARA ENTRAR NO <span className="text-brand-secondary">PROGRAMA DE AFILIADOS?</span>
          </h2>
          
          <p className="text-zinc-400 text-xs sm:text-sm font-medium max-w-2xl mx-auto z-10 leading-relaxed">
            Cadastre-se como parceiro, entenda as regras de comissionamento e envie sua primeira oportunidade para a equipe da TAG08.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 z-10 relative">
            <TrackedOutboundLink
              href={buildBrazilWhatsAppUrl("Olá,%20acabei%20de%20acessar%20a%20página%20de%20afiliados%20e%20gostaria%20de%20me%20cadastrar%20como%20parceiro.%20Quero%20entender%20as%20regras%20e%20enviar%20minhas%20indicações.")}
              target="_blank"
              rel="noreferrer"
              label="Entrar no programa de afiliados"
              surface="affiliate-final-cta"
              className="group min-h-11 bg-brand-secondary text-black font-sans font-black text-xs uppercase tracking-widest py-4 px-10 rounded-full shadow-[0_20px_50px_rgba(var(--color-brand-secondary-rgb),0.3)] motion-safe:hover:scale-[1.02] transition-[background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 flex items-center gap-2 cursor-pointer"
            >
              <span>QUERO ENTRAR NO PROGRAMA</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </TrackedOutboundLink>
          </div>
        </div>
      </section>

    </div>
  );
}
