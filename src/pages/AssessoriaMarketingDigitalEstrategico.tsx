import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, ArrowRight, ArrowUpRight, BarChart3, Users, Settings, 
  ShieldCheck, Cpu, Sparkles, Clock, Zap, Award, Target, 
  LineChart, ChevronDown, MessageSquare, LineChart as ChartIcon, Eye
} from "lucide-react";
import ThreeDimensionalTilt from "../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../components/Subtle3DCanvas";
import MiniCases from "../components/MiniCases";
import { buildBrazilWhatsAppUrl } from "../config/siteNetwork";

interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    value: number;
    text: string;
  }[];
}

const auditQuestions: Question[] = [
  {
    id: 1,
    text: "Qual Ò� o maior gargalo comercial da sua marca no momento?",
    options: [
      { label: "A", value: 10, text: "NÒ�o geramos contatos regulares de potenciais clientes (orgÒ�nico ou pago)" },
      { label: "B", value: 20, text: "AtÒ� geramos leads, mas sÒ�o desqualificados, choram preÒ�o e travam no comercial" },
      { label: "C", value: 15, text: "Nossa presenÒ�a digital Ò� inexistente ou amadora frente aos nossos concorrentes" },
      { label: "D", value: 25, text: "Falta de governanÒ�a: temos boas ideias mas falta equipe dedicada para executar" }
    ]
  },
  {
    id: 2,
    text: "Qual Ò� o investimento mensal atual (ou planejado) em trÒ�fego pago?",
    options: [
      { label: "A", value: 10, text: "NÒ�o investimos em anÒ�ncios (foco exclusivo em redes sociais orgÒ�nicas)" },
      { label: "B", value: 15, text: "Investimento inicial ou instÒ�vel (atÒ� R$ 2.000 / mÒ�s)" },
      { label: "C", value: 25, text: "Investimento moderado (entre R$ 2.000 e R$ 10.000 / mÒ�s)" },
      { label: "D", value: 30, text: "Investimento agressivo com busca de escala (acima de R$ 10.000 / mÒ�s)" }
    ]
  },
  {
    id: 3,
    text: "Como vocÒ� define o ticket mÒ�dio da sua soluÒ�Ò�o ou produto principal?",
    options: [
      { label: "A", value: 10, text: "Varejo ou baixo valor (Abaixo de R$ 500 por venda/assinatura)" },
      { label: "B", value: 15, text: "MÒ�dio valor transacional (Entre R$ 500 e R$ 2.500)" },
      { label: "C", value: 25, text: "High Ticket ou ServiÒ�o Premium (Entre R$ 2.500 e R$ 10.000)" },
      { label: "D", value: 30, text: "Corporativo, Enterprise ou B2B Complexo (Acima de R$ 10.000)" }
    ]
  },
  {
    id: 4,
    text: "Quem dita a direÒ�Ò�o tÒ�tica e faz a gestÒ�o do seu marketing hoje?",
    options: [
      { label: "A", value: 10, text: "O prÒ�prio fundador / dono conduz quando tem tempo livre operacional" },
      { label: "B", value: 15, text: "Contratamos freelancers ou agÒ�ncias, mas operam soltos, sem direcionamento sÒ�nior" },
      { label: "C", value: 20, text: "Temos um departamento interno jÒ�nior ou intermediÒ�rio sem governanÒ�a estrita" },
      { label: "D", value: 25, text: "Contamos com um CMO estrategista liderando e acompanhando dados em tempo real" }
    ]
  }
];

interface AssessoriaProps {
  onNavigate: (page: string) => void;
}

export default function AssessoriaMarketingDigitalEstrategico({ onNavigate }: AssessoriaProps) {
  const [activeFaq, setActiveFaq] = useState<number>(0);
  
  // Quiz states
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { score: number; text: string }>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleSelectOption = (questionId: number, score: number, text: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { score, text }
    }));

    if (currentQuestionIdx < auditQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setCurrentQuestionIdx(0);
    setQuizCompleted(false);
  };

  // Diagnostic calculations
  const calculateTotalScore = () => {
    return (Object.values(answers) as Array<{ score: number; text: string }>).reduce((sum, current) => sum + current.score, 0);
  };

  const getDiagnosticOutput = () => {
    const totalScore = calculateTotalScore();
    if (totalScore <= 45) {
      return {
        level: "NÒ�vel PrimÒ�rio (InstÒ�vel)",
        percentage: totalScore,
        color: "text-red-400 border-red-500/20 bg-red-500/5",
        description: "Seu marketing estÒ� operando com alta dependÒ�ncia de aÒ�Ò�es esporÒ�dicas e sem previsibilidade comercial. Falta um processo de atraÒ�Ò�o regular e posicionamento visual refinado para parar de brigar por preÒ�o baixo.",
        focus: "ConstruÒ�Ò�o de Landing Pages de alta velocidade, definiÒ�Ò�o de identidade verbal limpa e ativaÒ�Ò�o de campanhas de trÒ�fego de alta intenÒ�Ò�o.",
        recommendation: "NÒ�cleo ACCELERA ���⬝ TrÒ�fego de Elite + LPs Premium"
      };
    } else if (totalScore <= 75) {
      return {
        level: "NÒ�vel IntermediÒ�rio (RuÒ�do de Imagem)",
        percentage: totalScore,
        color: "text-brand border-brand/20 bg-brand/5",
        description: "Seu negÒ�cio jÒ� roda anÒ�ncios ou posta conteÒ�dos, porÒ�m hÒ� um desalinhamento sÒ�rio de imagem. Os leads chegam desinformados ou desqualificados de fato, gerando desperdÒ�cio e exaustÒ�o do seu comercial sÒ�nior.",
        focus: "Reposicionamento de Branding completo, revisÒ�o criativa e pautas de redes sociais sÒ�brias orientadas Ò� alta retenÒ�Ò�o e qualificaÒ�Ò�o.",
        recommendation: "NÒ�cleo AUTHORITY ���⬝ Branding SÒ�nior + Redes Sociais EstratÒ�gicas"
      };
    } else {
      return {
        level: "NÒ�vel AvanÒ�ado (Necessidade de GovernanÒ�a)",
        percentage: totalScore,
        color: "text-brand-secondary border-brand-secondary/20 bg-brand-secondary/5",
        description: "Sua marca possui atraÒ�Ò�o e ticket consistentes, mas carece de processos fechados e controle sob os canais. A execuÒ�Ò�o tÒ�cnica varia e hÒ� vazamento de dados analÒ�ticos reais no funil corporativo.",
        focus: "Process Intelligence, governanÒ�a semanal de mÒ�tricas de ROI/CAC via Business Intelligence e playbooks operacionais Notion/Wiki.",
        recommendation: "NÒ�cleo ENTERPRISE ���⬝ InteligÒ�ncia de Processos + BI Centralizado"
      };
    }
  };

  const getWhatsAppLink = () => {
    const diag = getDiagnosticOutput();
    const message = `OlÒ� TAG08! Fiz o diagnÒ�stico estratÒ�gico inteligente de marketing no site e cheguei no seguinte setup:
  
- MATURIDADE DE MARKETING: ${diag.level} (${diag.percentage} pontos)
- ANOMALIA PRINCIAPAL IDENTIFICADA: ${diag.description}
- PLANO DE ASSESSORIA INDICADO: ${diag.recommendation}
- FOCO RECOMENDADO: ${diag.focus}

Gostaria de agendar minha sessÒ�o de clareza gratuita de 30 minutos com um estrategista sÒ�nior para analisar este diagnÒ�stico em detalhes!`;

    return buildBrazilWhatsAppUrl(message);
  };

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const faqCategories = [
    { id: 0, title: "MODELO DE ASSESSORIA" },
    { id: 1, title: "DIREÒ⬡Ò�O VS. AGÒŠNCIA" },
    { id: 2, title: "EQUIPE INTERNA" },
    { id: 3, title: "ONBOARDING & PRAZOS" },
    { id: 4, title: "GARANTIA DE SLA" }
  ];

  const faqQuestions = [
    "O que Ò� a Assessoria de Marketing Digital EstratÒ�gico da TAG08?",
    "Qual a diferenÒ�a de contratar a Assessoria da TAG08 vs. uma agÒ�ncia de marketing tradicional?",
    "Preciso ter uma equipe interna de marketing instalada na minha empresa?",
    "Como funcionam o onboarding e a entrega dos primeiros resultados?",
    "HÒ� alguma garantia contratual de regularidade e pontualidade?"
  ];

  const faqAnswers = [
    "Ò⬰ uma soluÒ�Ò�o consultiva e executora que assume o papel de uma direÒ�Ò�o sÒ�nior externa para sua marca. NÒ�s desenhamos a estratÒ�gia, organizamos o branding, estruturamos as frentes web, otimizamos campanhas pagas e instalamos dashboards de Business Intelligence integrados ao seu CRM de forma contÒ�nua.",
    "AgÒ�ncias tradicionais muitas vezes operam sem diagnÒ�stico estratÒ�gico ou metas claras de receita. A assessoria da TAG08 une inteligÒ�ncia de processos, sofisticaÒ�Ò�o estÒ�tica e foco em indicadores Ò�teis para decisÒ�o. NÒ�s conduzimos do diagnÒ�stico Ò� implantaÒ�Ò�o com mÒ�todo e clareza.",
    "NÒ�o. A assessoria da TAG08 opera de duas maneiras: podemos atuar como seu departamento terceirizado de marketing estratÒ�gico e visual, ou apoiar sua equipe interna por meio de treinamentos e auditorias sÒ�niores.",
    "Nosso fluxo de entrada inicia-se com uma ImersÒ�o Operacional (Fase de Process Intelligence) de atÒ� 15 dias, na qual mapeamos seu comprador, concorrentes e desvios de imagem. Depois disso, iniciamos as novas landing pages e a ativaÒ�Ò�o de trÒ�fego de forma progressiva, com acompanhamento dos primeiros resultados no primeiro ciclo operacional.",
    "Sim. Trabalhamos com acordo de nÒ�vel de serviÒ�o (SLA) em contrato, com cronogramas definidos, acompanhamento claro e previsibilidade operacional. Quando hÒ� dependÒ�ncias externas, elas sÒ�o tratadas com transparÒ�ncia e comunicaÒ�Ò�o antecipada."
  ];

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-[6%] left-[-15%] w-[620px] h-[620px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[620px] h-[620px] bg-brand/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Floating 3D Geometric mesh for tech authority decoration */}
      <Subtle3DCanvas intensity={1.4} className="absolute right-[-10%] top-[4%] w-[490px] h-[490px] opacity-[0.38] mix-blend-screen hidden lg:block" />

      {/*=========================================
          HERO SECTION: EXECUTIVE SYSTEM
         =========================================*/}
      <section className="px-6 md:px-8 py-12 md:py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-baseline text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono">
                ASSESSORIA EM MARKETING // TAG08 CONSULTING
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter uppercase font-display">
                DireÒ�Ò�o SÒ�nior. <br />
                <span className="text-brand">O fim do marketing infantil e amador.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-[15px] leading-relaxed font-sans font-medium">
                Sua empresa nÒ�o cresce com ideias rasas, posts automÒ�ticos de agÒ�ncias convencionais ou verba de anÒ�ncios sem controle tÒ�tico. Unimos direÒ�Ò�o sÒ�nior, ecossistema visual consistente, funis proprietÒ�rios de conversÒ�o e dashboards reais para captar clientes qualificados.
              </p>
            </div>
          </div>

          {/* Panoramic High-Status Hero banner with responsive absolute badges */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px]">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.35/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <img 
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1600"
                alt="Assessoria de Marketing EstratÒ�gico Equipe TAG08"
                className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-[1.01] transition-all duration-1000 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />

              {/* Floating Primary Action button */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{ transform: "translateZ(50px)" }}>
                <a
                  href="#diagnostic-audit"
                  className="bg-brand-secondary text-black font-display font-black text-[10px] sm:text-[11px] uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.32)] hover:scale-105 duration-300 transition-all border border-brand-secondary hover:bg-brand-dark flex items-center gap-2 cursor-pointer z-20"
                >
                  <span>SOLICITAR DIAGNÒ�SSTICO</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </a>
              </div>

              {/* Absolute Corner details */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="font-mono text-[8.5px] text-brand-secondary tracking-widest block uppercase font-semibold">TAG08 STRATEGIC ENGINE</span>
                  <h4 className="font-display font-black text-white text-xs sm:text-sm uppercase tracking-tight leading-none">Processos, Identidade Visual Premium e Engenharia Comercial</h4>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-[8px] text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>PREMIUM CORE STATUS // ONLINE</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* Core Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-2 text-left border-t border-white/[0.04]">
            <div className="space-y-1.5">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Consistente</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">DireÒ�Ò�o SÒ�nior ao seu Lado<br/>Com CritÒ�rio e Acompanhamento</span>
            </div>
            <div className="space-y-1.5">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">+230%</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Retorno MÒ�dio AnalÒ�tico<br/>Sob OrÒ�amento de Meta Ads</span>
            </div>
            <div className="space-y-1.5">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">BI Real</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">TransparÒ�ncia Integral em CRM<br/>Sem Planilhas Maquiadas</span>
            </div>
            <div className="space-y-1.5">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">PadrÒ�o Ouro</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Acordo de SLA Estrito de<br/>Prazo e ExecuÒ�Ò�o em PeÒ�as</span>
            </div>
          </div>

        </div>
      </section>

      {/*=========================================
          COMPARISON MATRIX
         =========================================*/}
      <section className="px-6 md:px-8 py-20 bg-charcoal-900/15 border-b border-white/[0.04] text-left relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-left space-y-3 max-w-2xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
              ANÒ�LISE DE EQUIVALÒŠNCIA COMERCIAL // CONFRONTE
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tighter">
              Por que a Assessoria TAG08 Ò� a SoluÒ�Ò�o Definitiva?
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Compare as abordagens convencionais de mercado com a sofisticaÒ�Ò�o operacional da nossa equipe estratÒ�gica e conclua com critÒ�rio racional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Box: Traditional agency */}
            <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-red-500/10" />
              <div className="flex items-center gap-2 text-zinc-500 font-mono text-[9px] uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400/70" />
                <span>AgÒ�ncia / Freelancer Tradicional</span>
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-white uppercase leading-none">O Modelo Ineficiente</h3>
              
              <ul className="space-y-4">
                {[
                  "Artistas genÒ�ricos entregando criativos do Canva idÒ�nticos aos seus concorrentes.",
                  "Foco puramente em postagens estÒ�ticas sem funis ou CRM de vendas integrado.",
                  "AusÒ�ncia de relatÒ�rios reais de ROI ou relatÒ�rios mascarados com desculpas tÒ�cnicas.",
                  "Atrasos reiterados de cronograma com desorganizaÒ�Ò�o de pastas e documentos no Drive.",
                  "InterlocuÒ�Ò�o com estagiÒ�rios juniores sob demanda sem senso real de negÒ�cio."
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-zinc-500 text-xs sm:text-sm leading-relaxed">
                    <span className="text-red-400 font-bold font-sans">/ &times;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Box: TAG08 Advisory */}
            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 transition-colors duration-300 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-brand/20 via-brand/40 to-transparent" />
              <div className="flex items-center gap-2 text-brand font-mono text-[9px] uppercase tracking-widest font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                <span>Assessoria EstratÒ�gica TAG08</span>
              </div>
              <h3 className="font-display font-medium text-lg sm:text-xl text-brand-secondary uppercase leading-none">O PadrÒ�o SÒ�nior Premium</h3>
              
              <ul className="space-y-4">
                {[
                  "Design e identidade sob medida, com tipografia, paletas e tom de voz refinados.",
                  "Direcionamento completo unindo engenharia de cÒ�digo, criativos e fluxo comercial.",
                  "MÒ�tricas reais e dashboards personalizados em Looker Studio atualizados em tempo real.",
                  "Acordo contratual de SLA de pontualidade: cronogramas entregues de forma antecipada.",
                  "PresenÒ�a constante de um estrategista CMO sÒ�nior na rotina da sua marca."
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-white text-xs sm:text-sm leading-relaxed font-medium">
                    <span className="text-brand font-black font-semibold">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* INTERACTIVE INNOVATION: SIMULADOR DE SINERGIA DE CANAIS */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-950 text-left relative overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-brand/[0.015] rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-semibold bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              PLANEJAMENTO DE CRESCIMENTO // SIMULADOR ESTRATÒ⬰GICO
            </span>
            <h2 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
              Simulador de AtivaÒ�Ò�o de Sinergia de Canais (Growth Engine)
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
              Crescer nÒ�o Ò� sobre gastar mais em anÒ�ncios; Ò� sobre sinergia de canais, inteligÒ�ncia de conversÒ�o e direÒ�Ò�o de CMO. Ajuste os controles e adicione pilares de assessoria tÒ�tica para projetar o faturamento potencial e a reduÒ�Ò�o de Custo por Lead (CPL) da sua marca.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Controls */}
            <div className="lg:col-span-5 bg-charcoal-900/60 border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-6">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block pb-3 border-b border-white/[0.05]">
                  Configure sua OperaÒ�Ò�o de Marketing:
                </span>

                {/* Slider 1: Verba publicitaria */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider">
                      Verba mensal de trÒ�fego:
                    </label>
                    <span className="text-sm font-sans text-brand-secondary font-black bg-brand-secondary/10 px-2.5 py-0.5 rounded-lg border border-brand-secondary/20">
                      R$ <span id="adv-spend-val">5.000</span>
                    </span>
                  </div>
                  <input 
                    type="range" 
                    id="adv-spend"
                    min="2000" 
                    max="50000" 
                    step="1000" 
                    defaultValue="5000"
                    onChange={() => (window as any)._updateGrowthEngine && (window as any)._updateGrowthEngine()}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
                  />
                  <div className="flex items-center justify-between text-[9px] font-sans text-zinc-500">
                    <span>R$ 2.000</span>
                    <span>R$ 25.000</span>
                    <span>R$ 50.000+</span>
                  </div>
                </div>

                {/* Checklist de Sinergias */}
                <div className="space-y-3 pt-3 border-t border-white/[0.05]">
                  <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold block">ATIVAR PILARES DE ASSESSORIA TAG08:</span>
                  
                  <div className="space-y-2">
                    {[
                      { id: "cmo", label: "Assessoria CMO & BI (-25% desperdÒ�cio)" },
                      { id: "lp", label: "Landing Pages Ultra-velozes (1.5x conversÒ�o)" },
                      { id: "branding", label: "Branding & Tom de Voz sÒ�nior (+30% LTV)" }
                    ].map((pilar) => {
                      return (
                        <label key={pilar.id} className="flex items-center gap-3 p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl cursor-pointer hover:bg-white/[0.02]">
                          <input 
                            type="checkbox" 
                            id={`chk-${pilar.id}`}
                            defaultChecked={pilar.id === "cmo"}
                            onChange={() => (window as any)._updateGrowthEngine && (window as any)._updateGrowthEngine()}
                            className="rounded border-zinc-700 bg-zinc-900 text-brand focus:ring-brand"
                          />
                          <span className="text-xs text-zinc-300 font-sans font-medium">{pilar.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-2">
                <div className="flex items-center gap-2 text-brand">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider">A Sinergia Multiplicadora</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  Quando vocÒ� ativa a assessoria de marketing estratÒ�gica, vocÒ� nÒ�o apenas melhora as artes ou os anÒ�ncios, vocÒ� ajusta a conversÒ�o das pÒ�ginas de destino, direciona o criativo da equipe e elimina canais caros e ineficientes.
                </p>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-7 bg-[#09090b] border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-6 w-full">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold block">
                  Resultados Estimados com Sinergia Ativa:
                </span>

                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="font-mono text-[8px] text-zinc-500 uppercase font-black block">Leads de Alto PadrÒ�o / MÒ�s</span>
                    <p id="ge-leads" className="text-3xl font-display font-black text-white">45</p>
                    <span className="text-[9px] text-zinc-400 block leading-tight font-sans">
                      Contatos qualificados de faturamento ativo.
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-brand-secondary/[0.02] border border-brand-secondary/10 space-y-1">
                    <span className="font-mono text-[8px] text-brand-secondary/80 uppercase font-black block">Custo por Lead (CPL)</span>
                    <p id="ge-cpl" className="text-3xl font-display font-black text-brand-secondary">R$ 110</p>
                    <span className="text-[9px] text-zinc-400 block leading-tight font-sans">
                      PreÒ�o mÒ�dio pago para atraÒ�Ò�o de cada lead qualificado.
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 space-y-1">
                    <span className="font-mono text-[8px] text-emerald-500/80 uppercase font-black block">Retorno Projetado (ROAS)</span>
                    <p id="ge-roas" className="text-3xl font-display font-black text-emerald-500">4.5x</p>
                    <span className="text-[9px] text-zinc-400 block leading-tight font-sans">
                      Multiplicador estimado de retorno sobre o investimento.
                    </span>
                  </div>
                </div>

                {/* Summary bar chart */}
                <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5 space-y-4">
                  <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold block">Faturamento Adicional Potencial Estimado</span>
                  
                  <div className="flex items-center justify-between border-b border-white/[0.05] pb-3 text-xs">
                    <span className="text-zinc-400">Receita de Vendas Estimada / MÒ�s:</span>
                    <span id="ge-revenue" className="font-sans text-base font-black text-white">R$ 45.000</span>
                  </div>

                  <p className="text-[10px] text-zinc-500 font-sans">
                    *CÒ�lculos baseados em um ticket mÒ�dio de vendas de R$ 2.500 por lead convertido comercialmente e taxa de fechamento comercial de 20%.
                  </p>
                </div>
              </div>

              {/* JS Logic */}
              <script dangerouslySetInnerHTML={{
                __html: `
                  (function() {
                    window._updateGrowthEngine = function() {
                      const spendEl = document.getElementById("adv-spend");
                      const spend = spendEl ? parseInt(spendEl.value) : 5000;

                      const spendText = document.getElementById("adv-spend-val");
                      if (spendText) spendText.innerText = spend.toLocaleString("pt-BR");

                      // Checkboxes
                      const hasCmo = document.getElementById("chk-cmo")?.checked || false;
                      const hasLp = document.getElementById("chk-lp")?.checked || false;
                      const hasBrand = document.getElementById("chk-branding")?.checked || false;

                      // Formulas
                      let wasteSavings = hasCmo ? 0.75 : 1.0;
                      let convMultiplier = hasLp ? 1.5 : 1.0;
                      let ticketBoost = hasBrand ? 1.3 : 1.0;

                      // Base lead cost starts at R$ 200
                      let baseCpl = 200 * wasteSavings;
                      // Conversion multiplier drops CPL further
                      let finalCpl = Math.max(35, Math.round(baseCpl / (convMultiplier * (hasBrand ? 1.1 : 1.0))));

                      const leads = Math.round(spend / finalCpl);
                      const roas = parseFloat((4.5 * (hasCmo ? 1.2 : 1.0) * convMultiplier * ticketBoost).toFixed(1));
                      const revenue = Math.round(leads * 0.2 * (2500 * ticketBoost));

                      const lEl = document.getElementById("ge-leads");
                      const cEl = document.getElementById("ge-cpl");
                      const rEl = document.getElementById("ge-roas");
                      const revEl = document.getElementById("ge-revenue");

                      if (lEl) lEl.innerText = leads.toLocaleString("pt-BR");
                      if (cEl) cEl.innerText = "R$ " + finalCpl.toLocaleString("pt-BR");
                      if (rEl) rEl.innerText = roas.toFixed(1) + "x";
                      if (revEl) revEl.innerText = "R$ " + revenue.toLocaleString("pt-BR");
                    };
                    setTimeout(() => {
                      window._updateGrowthEngine && window._updateGrowthEngine();
                    }, 500);
                  })();
                `
              }} />

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 mt-6">
                <span className="font-mono text-[8px] text-zinc-600">PROJEÒ⬡Ò�O CALCULADA BASEADA NA MÒ⬰TRICA DE SERVIÒ⬡OS TAG08 // 2026</span>
                <button 
                  onClick={() => onNavigate("/contato")}
                  className="text-xs font-mono text-brand font-black uppercase hover:underline flex items-center gap-1.5 cursor-pointer focus:outline-none"
                >
                  Desenhar Meu Planejamento <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*=========================================
          THE 4 STRATEGIC MARKETING PILLARS
         =========================================*/}
      <section className="px-6 md:px-8 py-20 border-b border-white/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-semibold bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              PILARE OPERACIONAIS
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tighter leading-none">
              Os Quatro Pilares do MÒ�todo de Assessoria TAG08
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              Trabalhamos de forma contÒ�nua e integrada para cobrir todas as disciplinas tÒ�ticas necessÒ�rias para o seu crescimento saudÒ�vel de fato.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              {
                num: "01",
                icon: Target,
                title: "DiagnÒ�stico & InteligÒ�ncia",
                desc: "Analisamos seus concorrentes diretos, definimos seu ICP (Ideal Customer Profile) e desenhamos o message-market fit ideal para atrair o pÒ�blico sÒ�nior."
              },
              {
                num: "02",
                icon: Zap,
                title: "Design de Elite & LP",
                desc: "Sua identidade, copys e landing pages esculpidas do absoluto zero. Uma presenÒ�a elegante que justifica seus preÒ�os de forma imediata."
              },
              {
                num: "03",
                icon: LineChart,
                title: "TrÒ�fego Pago de Elite",
                desc: "Meta Ads, Google Search e LinkedIn Ads tÒ�ticos. Sem verba jogada no lixo em campanhas amadoras: focamos puramente em quem quer pagar seu ticket."
              },
              {
                num: "04",
                icon: Cpu,
                title: "BI Centralizado & CRM",
                desc: "RelatÒ�rios operacionais transparentes criados em Looker Studio. ConexÒ�o real com seu CRM comercial para auditar as mÒ�tricas de vendas."
              }
            ].map((pilar, idx) => {
              const PilarIcon = pilar.icon;
              return (
                <div 
                  key={idx}
                  className="bg-charcoal-900 border border-white/[0.05] rounded-2xl p-6 sm:p-8 hover:border-brand/30 hover:bg-white/[0.015] transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-80 group"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                  
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-2xl text-zinc-800 group-hover:text-brand transition-colors uppercase">
                        {pilar.num}.
                      </span>
                      <div className="p-2 bg-white/[0.03] text-zinc-400 group-hover:text-brand group-hover:bg-brand/10 rounded-lg transition-all">
                        <PilarIcon className="w-4.5 h-4.5" />
                      </div>
                    </div>
                    <h3 className="text-white text-base sm:text-lg font-display font-medium uppercase tracking-tight group-hover:text-brand transition-colors leading-[1.25]">
                      {pilar.title}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                      {pilar.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.04] text-[9px] font-mono text-zinc-500 uppercase tracking-widest relative z-10 flex justify-between">
                    <span>MÒ�SDULO DE ASSESSORIA</span>
                    <span className="text-brand font-semibold select-none">MÒ⬰TODO_0{idx + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/*=========================================
          INTERACTIVE MARKETING AUDIT SIMULATOR
         =========================================*/}
      <section id="diagnostic-audit" className="px-6 md:px-8 py-20 bg-charcoal-900/25 border-b border-white/[0.04] text-left relative z-10 scroll-mt-24">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl">
            <div className="space-y-3">
              <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
                METODOLOGIA DE DIAGNÒ�SSTICO // INTERATIVO
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tighter">
                FaÒ�a o seu <span className="text-brand">Simulador Inteligente</span> de DiagnÒ�stico Comercial
              </h2>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Descubra em segundos o Ò�ndice real de maturidade do seu marketing, mapeie desvios graves de imagem e veja qual o nosso plano recomendado de assessoria.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-charcoal-900 border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand/[0.015] to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-[60px] pointer-events-none" />

              <AnimatePresence mode="wait">
                {!quizCompleted ? (
                  <motion.div
                    key={currentQuestionIdx}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-8"
                  >
                    {/* Header info */}
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-4">
                      <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-wider font-extrabold">
                        AUDITORIA INTELIGENTE DE ALTA PERFORMANCE
                      </span>
                      <span className="font-sans text-xs text-zinc-500">
                        {currentQuestionIdx + 1} / {auditQuestions.length}
                      </span>
                    </div>

                    {/* Progress feedback bar */}
                    <div className="w-full h-1 bg-white/[0.02] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand transition-all duration-300"
                        style={{ width: `${((currentQuestionIdx) / auditQuestions.length) * 100}%` }}
                      />
                    </div>

                    {/* Question text */}
                    <h3 className="font-display font-semibold text-lg sm:text-xl text-white leading-snug">
                      {auditQuestions[currentQuestionIdx].text}
                    </h3>

                    {/* Options list column */}
                    <div className="grid gap-3.5 pt-2">
                      {auditQuestions[currentQuestionIdx].options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(auditQuestions[currentQuestionIdx].id, opt.value, opt.text)}
                          className="w-full text-left p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-brand/40 group transition-all duration-200 flex gap-4 items-center focus:outline-none cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-lg bg-white/[0.03] group-hover:bg-brand/20 border border-white/10 group-hover:border-brand/40 flex items-center justify-center font-sans text-[10px] text-zinc-400 group-hover:text-brand font-bold shrink-0">
                            {opt.label}
                          </div>
                          <span className="text-zinc-300 text-xs sm:text-sm font-sans font-medium group-hover:text-white transition-colors">
                            {opt.text}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                  >
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                        <span className="font-mono text-[9px] text-brand uppercase tracking-wider font-extrabold">
                          DIAGNOSTICO TÒ�TICO FINALIZADO
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-zinc-500">TAG08_DIAG_ENGINE</span>
                    </div>

                    {/* Scoring and output display */}
                    {(() => {
                      const diag = getDiagnosticOutput();
                      return (
                        <div className="space-y-6">
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl border border-white/[0.06] bg-black/40">
                            <div className="text-center sm:text-left space-y-1.5 shrink-0">
                              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Ò�NDICE DE MATURIDADE</span>
                              <h4 className="font-display font-black text-3xl text-white uppercase leading-none">{diag.level}</h4>
                              <p className="text-zinc-400 text-xs font-mono font-bold uppercase text-brand mt-1">{diag.recommendation}</p>
                            </div>
                            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-charcoal-950 border border-white/5 shadow-inner">
                              <div className="absolute inset-1.5 rounded-full border border-dashed border-white/10 animate-spin-slow" />
                              <span className="font-display font-black text-2xl text-white text-brand-gradient">{diag.percentage}%</span>
                            </div>
                          </div>

                          <div className="space-y-4 text-zinc-300 text-xs sm:text-sm font-sans leading-relaxed text-left bg-white/[0.01] border border-white/[0.03] p-5 sm:p-6 rounded-xl">
                            <div>
                              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-black block mb-1">Mapeamento de Desvios</span>
                              <p className="text-zinc-300 font-medium">{diag.description}</p>
                            </div>
                            <div className="pt-4 border-t border-white/[0.04]">
                              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-black block mb-1.5">Foco Operacional Imediato Recomendado</span>
                              <div className="flex gap-2.5 items-start">
                                <div className="mt-0.5 p-1 rounded bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary">
                                  <Sparkles className="w-3.5 h-3.5" />
                                </div>
                                <p className="text-white font-semibold text-xs leading-normal">{diag.focus}</p>
                              </div>
                            </div>
                          </div>

                          {/* Action tools */}
                          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <a
                              href={getWhatsAppLink()}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-brand-secondary hover:bg-brand hover:shadow-[0_10px_35px_rgba(var(--color-brand-secondary-rgb),0.25)] text-black text-xs font-mono font-black uppercase tracking-widest py-4 px-6 rounded-xl text-center transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_30px_rgba(var(--color-brand-secondary-rgb),0.15)] md:col-span-1"
                            >
                              <MessageSquare className="w-4 h-4 text-black" />
                              <span>CHAMAR NO WHATSAPP</span>
                            </a>
                            <button
                              type="button"
                              onClick={handleResetQuiz}
                              className="bg-white/5 hover:bg-white/[0.08] text-white hover:text-white border border-white/10 hover:border-white/20 text-xs font-mono font-bold uppercase tracking-widest py-4 px-6 rounded-xl text-center transition-all duration-300 cursor-pointer"
                            >
                              REPETIR DIAGNÒ�SSTICO
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* MiniCases Validation block */}
      <MiniCases onNavigate={onNavigate} />

      {/*=========================================
          BOTTOM CTA CARD (WHATSAPP NEON CALLOUT)
         =========================================*/}
      <section className="py-20 px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

          {/* Left Block: Image portrait */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[500px]">
            <div className="absolute inset-0 bg-black/15 rounded-[24px] overflow-hidden" />
            <img 
              src="https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=800" 
              alt="TAG08 Marketing Directors Support" 
              className="absolute inset-0 w-full h-full object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[10%] hover:scale-105 duration-500 transition-all"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] text-white/60 bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-black border border-white/5">
                  MARKETING EXECUTIVE
                </span>
                <span className="font-mono text-[9px] text-white/50 tracking-wider font-extrabold">
                  CMO_ADVISORY
                </span>
              </div>
              <div className="space-y-1.5 opacity-25 select-none">
                <div className="font-display font-extrabold text-[1.8rem] text-white/50 tracking-widest leading-none uppercase select-none">
                  marketing_cmo
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/30 tracking-widest leading-none uppercase select-none pl-6">
                  strategic_core_
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  SLA: 100% SECURE
                </span>
                <span className="font-mono text-[9px] text-white/60 bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-black border border-white/5">
                  SÒŠNIOR EXECUTION
                </span>
              </div>
            </div>
          </div>

          {/* Right Block: Content & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 text-left h-full relative z-10 lg:pl-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-black font-semibold">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/90">
                  CONECTE SEU COMERCIAL A UM FLUXO SEGURO
                </span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black leading-[0.9] tracking-tighter uppercase font-display">
                AGENDE SUA SESSÒ�O <br />
                DE CLAREZA GRATUITA!
              </h2>
              <p className="text-black/85 text-[11px] sm:text-xs max-w-lg leading-relaxed font-sans font-bold uppercase">
                Em uma videoconferÒ�ncia privada e sem compromisso de 30 minutos, nosso especialista sÒ�nior mapearÒ� o funil de atraÒ�Ò�o da sua marca, resolverÒ� ruÒ�dos da sua identidade visual e desenharÒ� o plano recomendado.
              </p>
            </div>
            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 max-w-md relative overflow-hidden text-left font-sans">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-4 items-start select-none">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black shrink-0 shadow-lg shadow-brand/10 hover:scale-105 transition-all">
                  <ArrowUpRight className="w-5 h-5 rotate-45 stroke-[2.5] text-black" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-[8px] text-brand uppercase tracking-wider font-extrabold block">
                    SESSÒ�O EXCLUSIVA DEDICADA
                  </span>
                  <p className="text-white text-xs leading-snug font-sans font-semibold">
                    Saia com o diagnÒ�stico e aÒ�Ò�es tÒ�ticas recomendadas em mÒ�os, de forma totalmente isenta e estruturada.
                  </p>
                </div>
              </div>
              <div className="space-y-3 font-sans">
                <a 
                  href={buildBrazilWhatsAppUrl("OlÒ�! Gostaria de agendar uma sessÒ�o de clareza gratuita para minha marca com um dos especialistas sÒ�niores da TAG08.")}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-black transition-all">
                        <span className="text-[9px] font-mono font-black tracking-tight text-brand group-hover:text-black">BR</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase font-black tracking-wider leading-none">
                          FALAR CONOSCO DIRETAMENTE (WhatsApp)
                        </span>
                        <span className="text-white text-xs font-mono font-bold tracking-wider group-hover:text-brand transition-colors mt-0.5">
                          +55 83 9.9886-8882
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-brand font-mono font-bold uppercase tracking-wider bg-brand/10 py-1 px-2.5 rounded-lg group-hover:bg-brand group-hover:text-black transition-all">
                      CONECTAR
                    </span>
                  </div>
                </a>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 text-xs font-sans select-none">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                  <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest font-extrabold">
                    AGÒŠNCIA TAG08
                  </span>
                </div>
                <span className="font-mono text-[8.5px] text-brand font-bold bg-brand/10 border border-brand/25 px-2 py-0.5 rounded uppercase leading-none">
                  VIVA_CORE
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/*=========================================
          FAQ SECTION (Premium 12-Column Layout)
         =========================================*/}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[40px] bg-charcoal-950 border border-white/[0.04] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
            {/* Lado Esquerdo: NavegaÒ�Ò�o de DÒ�vidas */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono">
                  FAQ // ENCONTRE RESPOSTAS
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter uppercase">
                  DÒšVIDAS &amp; <br />
                  SUA DECISÒ�O
                </h2>
                <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans max-w-sm">
                  EsclareÒ�a as principais dÒ�vidas sobre como a TAG08 lidera, executa e garante a evoluÒ�Ò�o estratÒ�gica e analÒ�tica do seu marketing digital sÒ�nior.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {faqCategories.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveFaq(item.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group cursor-pointer ${
                      activeFaq === item.id
                        ? "bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)]"
                        : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                    }`}
                  >
                    <span className="font-mono text-xs font-black uppercase tracking-wider flex items-center gap-3">
                      <span className={activeFaq === item.id ? "text-black" : "text-brand"}>
                        {String(item.id + 1).padStart(2, '0')}.
                      </span>
                      {item.title}
                    </span>
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                      activeFaq === item.id ? "text-black rotate-[-45deg] stroke-[2.5]" : "text-zinc-500"
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Lado Central: Imagem + Resposta */}
            <div className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-white/[0.04] bg-[#0c0c0e]">
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800"
                alt="TAG08 Assessoria"
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div className="absolute top-6 left-6 z-10 pointer-events-none font-mono text-[8px] text-white/20 uppercase tracking-widest leading-none">
                SYS // CMO_ADVISORY
              </div>

              <div className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left font-sans">
                <span className="font-mono text-[8.5px] text-brand uppercase tracking-widest font-black block">
                  {faqCategories[activeFaq].title}
                </span>
                
                <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {faqQuestions[activeFaq]}
                </h4>
                
                <p className="text-zinc-300 text-xs sm:text-[12.5px] leading-relaxed font-sans font-medium">
                  {faqAnswers[activeFaq]}
                </p>
              </div>
            </div>

            {/* Lado Direito: Callouts adicionais sÒ�nior */}
            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-bold">PROPOSTA DE VALOR</span>
                  <h4 className="text-white font-semibold text-sm leading-snug">Metodologia CientÒ�fica e Rigor Visual</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    SubstituÒ�mos desculpas e cronogramas atrasados por governanÒ�a ativa, transparÒ�ncia de BI e consistÒ�ncia no posicionamento.
                  </p>
                </div>
                <button
                  onClick={() => handleLinkClick("/servicos")}
                  className="group flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5"
                >
                  <span>Ver Todos ServiÒ�os</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-black/60 uppercase tracking-widest block font-extrabold">CMO DIRETOR</span>
                  <h4 className="text-black font-black text-sm uppercase leading-tight tracking-tight">Precisa de AlocaÒ�Ò�o de Equipe?</h4>
                  <p className="text-black/85 text-[11.5px] font-semibold leading-relaxed font-sans">
                    Converse com nossos diretores seniores em canal direto reservado e entenda a disponibilidade tÒ�cnica imediata para seu projeto.
                  </p>
                </div>
                <a
                  href={buildBrazilWhatsAppUrl("OlÒ�! Eu gostaria de saber mais sobre a assessoria de marketing estratÒ�gico da TAG08 e as modalidades de alocaÒ�Ò�o de equipe disponÒ�veis.")}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between text-xs font-sans font-bold text-black border-t border-black/10 pt-2 cursor-pointer select-none"
                >
                  <span>MENSAGEM PRIVADA</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
