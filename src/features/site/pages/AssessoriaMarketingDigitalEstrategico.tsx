import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Cpu, Sparkles, Zap, Target, LineChart, MessageSquare, Settings } from "lucide-react";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import MiniCases from "../../../components/MiniCases";
import TrustTestimonialsSection from "../../../components/TrustTestimonialsSection";
import { buildBrazilWhatsAppUrl } from "../../../config/siteNetwork";
import { useSimulatorTracking } from "../../../lib/useSimulatorTracking";

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
    text: "Qual é o maior gargalo comercial da sua marca no momento?",
    options: [
      { label: "A", value: 10, text: "Não geramos contatos regulares de potenciais clientes (orgânico ou pago)" },
      { label: "B", value: 20, text: "Até geramos leads, mas são desqualificados, choram preço e travam no comercial" },
      { label: "C", value: 15, text: "Nossa presença digital é inexistente ou amadora frente aos nossos concorrentes" },
      { label: "D", value: 25, text: "Falta de governança: temos boas ideias mas falta equipe dedicada para executar" }
    ]
  },
  {
    id: 2,
    text: "Qual é o investimento mensal atual (ou planejado) em tráfego pago?",
    options: [
      { label: "A", value: 10, text: "Não investimos em anúncios (foco exclusivo em redes sociais orgânicas)" },
      { label: "B", value: 15, text: "Investimento inicial ou instável (até R$ 2.000 / mês)" },
      { label: "C", value: 25, text: "Investimento moderado (entre R$ 2.000 e R$ 10.000 / mês)" },
      { label: "D", value: 30, text: "Investimento em canais sem prioridade clara (acima de R$ 10.000 / mês)" }
    ]
  },
  {
    id: 3,
    text: "Como você define o ticket médio da sua solução ou produto principal?",
    options: [
      { label: "A", value: 10, text: "Varejo ou baixo valor (Abaixo de R$ 500 por venda/assinatura)" },
      { label: "B", value: 15, text: "Médio valor transacional (Entre R$ 500 e R$ 2.500)" },
      { label: "C", value: 25, text: "Serviço especializado ou venda consultiva (Entre R$ 2.500 e R$ 10.000)" },
      { label: "D", value: 30, text: "Corporativo, Enterprise ou B2B Complexo (Acima de R$ 10.000)" }
    ]
  },
  {
    id: 4,
    text: "Quem dita a direção tática e faz a gestão do seu marketing hoje?",
    options: [
      { label: "A", value: 10, text: "O próprio fundador / dono conduz quando tem tempo livre operacional" },
      { label: "B", value: 15, text: "Contratamos freelancers ou agências, mas operam soltos, sem direção clara" },
      { label: "C", value: 20, text: "Temos um departamento interno júnior ou intermediário sem governança estrita" },
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
  const trackSimulator = useSimulatorTracking("marketing_assessment_quiz", 1, "/servicos/assessoria-marketing-digital-estrategico");

  const handleSelectOption = (questionId: number, score: number, text: string) => {
    trackSimulator("input_changed");
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
    if (totalScore <= 35) {
      return {
        level: "Baixa clareza",
        percentage: totalScore,
        color: "text-red-400 border-red-500/20 bg-red-500/5",
        description: "A marca ainda depende muito de ações isoladas e de decisões pouco organizadas. Falta uma base mais clara de posicionamento, mensagem e próximos passos.",
        focus: "O primeiro foco costuma ser clareza estratégica e alinhamento de comunicação.",
        recommendation: "A prioridade agora é estruturar a base antes de ampliar a execução."
      };
    } else if (totalScore <= 60) {
      return {
        level: "Clareza em construção",
        percentage: totalScore,
        color: "text-brand border-brand/20 bg-brand/5",
        description: "Já existe movimento, mas a comunicação ainda pode ficar mais coerente entre canais, conteúdos e materiais comerciais.",
        focus: "Ajuste de mensagem, consistência e estrutura de canais.",
        recommendation: "Vale organizar prioridades antes de ampliar qualquer frente."
      };
    } else if (totalScore <= 85) {
      return {
        level: "Boa direção",
        percentage: totalScore,
        color: "text-brand-secondary border-brand-secondary/20 bg-brand-secondary/5",
        description: "A marca já tem um caminho mais consistente, mas ainda pode ganhar clareza na sustentação da rotina e na priorização das frentes.",
        focus: "Foco em acompanhamento, revisão e continuidade do que já foi estruturado.",
        recommendation: "O próximo passo é consolidar método e manter a execução responsável."
      };
    } else {
      return {
        level: "Pronta para avançar",
        percentage: totalScore,
        color: "text-brand-secondary border-brand-secondary/20 bg-brand-secondary/5",
        description: "Existe base suficiente para seguir com mais segurança, desde que a execução continue sendo acompanhada com critério.",
        focus: "Prioridade em consistência, ajustes e continuidade.",
        recommendation: "A leitura não substitui uma análise completa, mas ajuda a identificar se o próximo passo deve ser clareza, estrutura, conteúdo, canal ou operação."
      };
    }
  };

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const faqCategories = [
    { id: 0, title: "O QUE É" },
    { id: 1, title: "ESCOPO" },
    { id: 2, title: "QUANDO FAZ SENTIDO" },
    { id: 3, title: "EQUIPE INTERNA" },
    { id: 4, title: "CLAREZA E PRÓXIMO PASSO" }
  ];

  const faqQuestions = [
    "O que é a Assessoria de Marketing Estratégico da TAG08?",
    "A assessoria inclui execução de marketing?",
    "Quando faz sentido contratar assessoria?",
    "A assessoria substitui uma equipe interna?",
    "A TAG08 faz promessas com a assessoria?"
  ];

  const faqAnswers = [
    "É um acompanhamento para organizar posicionamento, prioridades, comunicação, canais e próximos passos antes da execução. O foco é ajudar a marca a decidir melhor e evitar ações soltas.",
    "Depende do escopo. Em alguns casos a assessoria orienta decisões e organiza o plano. Em outros, pode se conectar com serviços de conteúdo, branding, audiovisual, web ou processos.",
    "Quando a marca sente que está fazendo muitas ações, mas ainda falta clareza sobre mensagem, público, canais, prioridades ou direção comercial.",
    "Não necessariamente. A TAG08 pode apoiar a tomada de decisão, orientar prioridades e ajudar a equipe interna ou parceiros externos a trabalharem com mais clareza.",
    "Não prometemos crescimento instantâneo, retorno financeiro ou ganho artificial. A assessoria busca construir clareza, critério, consistência e melhoria contínua com responsabilidade."
  ];

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pb-20 relative overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-[6%] left-[-15%] w-[620px] h-[620px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[620px] h-[620px] bg-brand/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Floating 3D Geometric mesh for tech authority decoration */}
      <Subtle3DCanvas intensity={1.4} className="absolute right-[-10%] top-[4%] w-[490px] h-[490px] opacity-[0.38] mix-blend-screen hidden lg:block" />

      <section className="tag08-section px-4 sm:px-6 md:px-8 border-b border-white/[0.04] text-left relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-8 space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-secondary/20 bg-brand-secondary/5 px-3 py-1.5 tag08-meta text-xs font-black uppercase tracking-widest text-brand-secondary">
              Assessoria de marketing estratégico
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black leading-[0.92] tracking-tighter text-white">
              Direção de marketing antes de ampliar a execução.
            </h1>
            <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-zinc-400">
              A assessoria organiza contexto, prioridades, mensagem e próximos passos para que a marca pare de reagir por urgência e passe a decidir com mais critério.
            </p>
            <div className="flex flex-wrap gap-2 text-xs tag08-meta font-bold uppercase tracking-widest text-zinc-300">
              {['Diagnóstico', 'Prioridades', 'Acompanhamento'].map((item) => (
                <span key={item} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5">
                  {item}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleLinkClick("/contato")}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand px-5 py-3 text-xs tag08-meta font-black uppercase tracking-widest text-black transition-transform hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              Solicitar diagnóstico
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="lg:col-span-4 rounded-3xl border border-white/[0.06] bg-charcoal-900/80 p-5 sm:p-6 space-y-4">
            <div className="space-y-2">
              <span className="tag08-meta text-xs font-black uppercase tracking-widest text-brand">Quando faz sentido</span>
              <p className="text-sm leading-relaxed text-zinc-300">
                Quando existem muitas frentes, mas ainda falta clareza sobre o que priorizar, comunicar e acompanhar.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleLinkClick('/contato')}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-xs tag08-meta font-black uppercase tracking-widest text-black transition-colors hover:bg-brand-dark"
            >
              Entender o melhor caminho
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/*=========================================
          COMPARISON MATRIX
         =========================================*/}
      <section className="tag08-section px-4 sm:px-6 md:px-8 bg-charcoal-900/15 border-b border-white/[0.04] text-left relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-3 max-w-2xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
              COMPARAÇÃO ESTRATÉGICA
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tighter">
              A diferença entre executar ações soltas e trabalhar com direção.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              A assessoria existe para ajudar a marca a entender prioridades, organizar decisões e reduzir desperdício de esforço antes de transformar ideias em ações de marketing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-red-500/10" />
              <div className="flex items-center gap-2 text-zinc-500 tag08-meta text-xs uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400/70" />
                <span>Execução sem direção</span>
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-white leading-none">Quando tudo começa pela urgência</h3>

              <ul className="space-y-4">
                {[
                  "Ações são feitas por urgência, gosto pessoal ou tentativa isolada, sem clareza de prioridade, mensagem ou continuidade.",
                  "A entrega tende a ganhar mais coerência quando existe clareza sobre prioridades, canais, mensagem e capacidade real de execução.",
                  "O esforço se espalha em várias frentes sem um critério claro de foco e sequência."
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-zinc-500 text-xs sm:text-sm leading-relaxed">
                    <span className="text-red-400 font-bold font-sans">/ &times;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 transition-colors duration-300 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-brand/20 via-brand/40 to-transparent" />
              <div className="flex items-center gap-2 text-brand tag08-meta text-xs uppercase tracking-widest font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                <span>Assessoria com direção</span>
              </div>
              <h3 className="font-display font-medium text-lg sm:text-xl text-brand-secondary leading-none">Quando a decisão parte de diagnóstico</h3>

              <ul className="space-y-4">
                {[
                  "As decisões partem de diagnóstico, critérios, prioridades e um plano possível de executar com responsabilidade.",
                  "A assessoria ajuda a organizar comunicação, canais e próximos passos antes de ampliar a produção.",
                  "O objetivo é reduzir improviso, desalinhamento e retrabalho para que a execução tenha mais consistência."
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
      {/* SECTION 3 - ESCOPO: a página explica a oferta antes de pedir dados. */}
      <section className="tag08-section px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-950 text-left relative overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-brand/[0.015] blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          <div className="tag08-section__header">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-bold">O que organizamos</span>
            <h2 className="tag08-section__heading font-display font-black text-3xl sm:text-4xl text-white">
              Antes de combinar canais, organizamos a base da decisão.
            </h2>
            <p className="tag08-section__copy text-zinc-400 text-sm font-sans">
              A assessoria conecta posicionamento, conteúdo, canais e operação. Nem toda frente precisa acontecer agora; a escolha depende do contexto e da capacidade real de execução.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Target, title: "Posicionamento e mensagem", description: "Clareza sobre o que a marca faz, para quem faz e por que deve ser escolhida." },
              { icon: MessageSquare, title: "Conteúdo e relacionamento", description: "Linha editorial e conversas que ajudam o público a entender a marca." },
              { icon: LineChart, title: "Canais e conversão", description: "Site, redes, materiais e pontos de contato trabalhando com a mesma direção." },
              { icon: Settings, title: "Operação e acompanhamento", description: "Responsáveis, revisão e rotina para sustentar a execução sem improviso." }
            ].map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="tag08-surface-card rounded-3xl border p-6 space-y-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/5 bg-zinc-950 text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-sm font-black text-white">{item.title}</h3>
                    <p className="text-xs leading-relaxed text-zinc-400">{item.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      {/*=========================================
          THE 4 STRATEGIC MARKETING PILLARS
         =========================================*/}
      <section className="tag08-section px-4 sm:px-6 md:px-8 border-b border-white/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-semibold bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              MÉTODO DA ASSESSORIA
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tighter leading-none">
              Quatro frentes para transformar dúvida em direção.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              A assessoria organiza o que a marca precisa entender, decidir, planejar e acompanhar antes de transformar marketing em execução.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              {
                num: "01",
                icon: Target,
                title: "Diagnóstico do momento",
                desc: "Entendemos contexto, objetivos, gargalos, canais atuais e limitações reais antes de recomendar qualquer ação."
              },
              {
                num: "02",
                icon: Zap,
                title: "Posicionamento e mensagem",
                desc: "Organizamos como a marca deve se apresentar, quais mensagens precisam ser fortalecidas e o que precisa ficar mais claro para o público."
              },
              {
                num: "03",
                icon: LineChart,
                title: "Plano de prioridades",
                desc: "Definimos o que vem primeiro, o que pode esperar e quais frentes fazem sentido para o momento atual do negócio."
              },
              {
                num: "04",
                icon: Cpu,
                title: "Acompanhamento da execução",
                desc: "Apoiamos a leitura do processo, os ajustes necessários e a continuidade das decisões para evitar ações soltas."
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
                    <h3 className="text-white text-base sm:text-lg font-display font-medium tracking-tight group-hover:text-brand transition-colors leading-[1.25]">
                      {pilar.title}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed">
                      {pilar.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.04] text-xs tag08-meta text-zinc-500 uppercase tracking-widest relative z-10 flex justify-between">
                    <span>MÓDULO DE ASSESSORIA</span>
                    <span className="text-brand font-semibold select-none">MÉTODO_0{idx + 1}</span>
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
      <section id="diagnostic-audit" className="tag08-section px-4 sm:px-6 md:px-8 bg-charcoal-900/25 border-b border-white/[0.04] text-left relative z-10 scroll-mt-24">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl">
            <div className="space-y-3">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
                LEITURA DE MATURIDADE
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tighter">
                Sua marca tem clareza suficiente para executar?
              </h2>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Este diagnóstico inicial ajuda a perceber se a marca já tem direção, mensagem, canais e estrutura suficientes para avançar com mais segurança.
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
                      <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-wider font-extrabold">
                        LEITURA INICIAL DE MATURIDADE
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
                          <div className="w-6 h-6 rounded-lg bg-white/[0.03] group-hover:bg-brand/20 border border-white/10 group-hover:border-brand/40 flex items-center justify-center font-sans text-xs text-zinc-400 group-hover:text-brand font-bold shrink-0">
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
                        <span className="tag08-meta text-xs text-brand uppercase tracking-wider font-extrabold">
                          LEITURA INICIAL CONCLUÍDA
                        </span>
                      </div>
                      <span className="font-sans text-xs text-zinc-500">TAG08_DIAG_ENGINE</span>
                    </div>

                    {/* Scoring and output display */}
                    {(() => {
                      const diag = getDiagnosticOutput();
                      return (
                        <div className="space-y-6">
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl border border-white/[0.06] bg-black/40">
                            <div className="text-center sm:text-left space-y-1.5 shrink-0">
                              <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest block font-bold">LEITURA ATUAL</span>
                              <h4 className={`font-display font-black text-3xl uppercase leading-none ${diag.color}`}>{diag.level}</h4>
                              <p className="text-zinc-400 text-xs font-sans font-bold uppercase text-brand mt-1">{diag.recommendation}</p>
                            </div>
                            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-charcoal-950 border border-white/5 shadow-inner">
                              <div className="absolute inset-1.5 rounded-full border border-dashed border-white/10 animate-spin-slow" />
                              <span className="font-display font-black text-xs sm:text-sm text-white text-center leading-tight px-2">{diag.level}</span>
                            </div>
                          </div>

                          <div className="space-y-4 text-zinc-300 text-xs sm:text-sm font-sans leading-relaxed text-left bg-white/[0.01] border border-white/[0.03] p-5 sm:p-6 rounded-xl">
                            <div>
                              <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest font-black block mb-1">Leituras observadas</span>
                              <p className="text-zinc-300 font-medium">{diag.description}</p>
                            </div>
                            <div className="pt-4 border-t border-white/[0.04]">
                              <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest font-black block mb-1.5">Próximo foco</span>
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
                            <button
                              type="button"
                              onClick={() => onNavigate("/contato")}
                              className="bg-brand-secondary hover:bg-brand hover:shadow-[0_10px_35px_rgba(var(--color-brand-secondary-rgb),0.25)] text-black text-xs font-sans font-black uppercase tracking-widest py-4 px-6 rounded-xl text-center transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_30px_rgba(var(--color-brand-secondary-rgb),0.15)] md:col-span-1"
                            >
                              <MessageSquare className="w-4 h-4 text-black" />
                              <span>SOLICITAR DIAGNÓSTICO COMPLETO</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleResetQuiz}
                              className="bg-white/5 hover:bg-white/[0.08] text-white hover:text-white border border-white/10 hover:border-white/20 text-xs font-sans font-bold uppercase tracking-widest py-4 px-6 rounded-xl text-center transition-all duration-300 cursor-pointer"
                            >
                              REPETIR DIAGNÓSTICO
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

      <ServiceInsightsBridge
        servicePath="/servicos/assessoria-marketing-digital-estrategico"
        onNavigate={onNavigate}
      />

      {/* MiniCases Validation block */}
      <MiniCases onNavigate={onNavigate} />

      <TrustTestimonialsSection />

      {/*=========================================
          CTA FINAL + FAQ
         =========================================*/}
      <section className="tag08-section px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="rounded-[32px] sm:rounded-[40px] border border-white/[0.06] bg-black/45 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 min-h-[320px] sm:min-h-[380px] relative overflow-hidden">
                <Image
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  src="https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=1200"
                  alt="TAG08 assessoria"
                  className="object-cover brightness-[0.48] contrast-[1.05]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/35 to-black/75" />
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs tag08-meta font-bold uppercase tracking-widest text-white/70">
                    Pr&oacute;ximo passo
                  </span>
                  <div className="space-y-3 max-w-sm">
                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                      A assessoria faz sentido quando a marca precisa entender melhor o que priorizar antes de executar.
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs tag08-meta uppercase tracking-widest text-white/55">
                      <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1">Clareza</span>
                      <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1">Dire&ccedil;&atilde;o</span>
                      <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1">Prioridade</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 bg-white text-black">
                <div className="space-y-4 max-w-2xl">
                  <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs tag08-meta font-bold uppercase tracking-widest text-black/60">
                    Próximo passo
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black leading-[0.92] tracking-tighter">
                    Vamos entender se a assessoria faz sentido para sua marca?
                  </h2>
                  <p className="text-black/75 text-sm sm:text-sm leading-relaxed max-w-xl">
                    Antes de propor qualquer plano, a TAG08 entende seu momento, seus gargalos e suas prioridades para indicar se a assessoria estratégica &eacute; o caminho mais coerente agora.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={buildBrazilWhatsAppUrl("Olá TAG08! Gostaria de conversar sobre assessoria de marketing estratégico para entender se faz sentido para a minha marca.")}
                    onClick={() => trackSimulator("cta_clicked")}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-black text-white px-5 py-3 text-xs sm:text-sm tag08-meta font-bold uppercase tracking-widest transition-transform hover:-translate-y-0.5"
                  >
                    <span>FALAR COM A TAG08</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleLinkClick("/servicos")}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-5 py-3 text-xs sm:text-sm tag08-meta font-bold uppercase tracking-widest text-black transition-colors hover:bg-black/[0.06]"
                  >
                    <span>VER OUTRAS SOLUÇÕES</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] sm:rounded-[40px] bg-charcoal-950 border border-white/[0.05] p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
              <div className="lg:col-span-4 flex flex-col justify-between space-y-8 text-left">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
                    D&Uacute;VIDAS SOBRE ASSESSORIA
                  </div>
                  <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter">
                    Antes de contratar, entenda como a assessoria funciona.
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-sans max-w-sm">
                    A assessoria existe para ajudar a marca a decidir melhor antes de executar. As respostas abaixo ajudam a entender quando esse caminho faz sentido e o que esperar do processo.
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  {faqCategories.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveFaq(item.id)}
                      aria-expanded={activeFaq === item.id}
                      aria-controls="assessoria-faq-panel"
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group cursor-pointer ${
                        activeFaq === item.id
                          ? "bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)]"
                          : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                      }`}
                    >
                      <span className="tag08-meta text-xs font-black uppercase tracking-wider flex items-center gap-3">
                        <span className={activeFaq === item.id ? "text-black" : "text-brand"}>
                          {String(item.id + 1).padStart(2, "0")}.
                        </span>
                        {item.title}
                      </span>
                      <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${activeFaq === item.id ? "text-black rotate-[-45deg] stroke-[2.5]" : "text-zinc-500"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-white/[0.04] bg-[#0c0c0e]">
                <Image
                  fill
                  sizes="(max-width: 1024px) 100vw, 34vw"
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800"
                  alt="TAG08 Assessoria"
                  className="object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
                />
                <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                    <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                    <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                  </svg>
                </div>
                <div className="absolute top-6 left-6 z-10 pointer-events-none tag08-meta text-xs text-white/20 uppercase tracking-widest leading-none">
                  TAG08 // ASSESSORIA
                </div>

                <div
                  id="assessoria-faq-panel"
                  role="region"
                  aria-live="polite"
                  className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left font-sans"
                >
                  <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black block">
                    {faqCategories[activeFaq].title}
                  </span>

                  <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                    {faqQuestions[activeFaq]}
                  </h4>

                  <p className="text-zinc-300 text-xs sm:text-xs leading-relaxed font-sans font-medium">
                    {faqAnswers[activeFaq]}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-between gap-4">
                <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                  <div className="space-y-2">
                    <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest block font-bold">PROPOSTA DE VALOR</span>
                    <h4 className="text-white font-semibold text-sm leading-snug">Dire&ccedil;&atilde;o antes da execu&ccedil;&atilde;o</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                      A assessoria organiza entendimento, prioridades e escopo antes de qualquer entrega.
                    </p>
                  </div>
                  <button
                    onClick={() => handleLinkClick("/servicos")}
                    className="group flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5"
                  >
                    <span>VER OUTRAS SOLUÇÕES</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                  <div className="space-y-2">
                    <span className="tag08-meta text-xs text-black/60 uppercase tracking-widest block font-extrabold">CONTATO DIRETO</span>
                    <h4 className="text-black font-black text-sm leading-tight tracking-tight">Falar com a TAG08</h4>
                    <p className="text-black/85 text-xs font-semibold leading-relaxed font-sans">
                      Se fizer sentido, o próximo passo &eacute; conversar sobre contexto, escopo e prioridade.
                    </p>
                  </div>
                  <a
                    href={buildBrazilWhatsAppUrl("Olá TAG08! Gostaria de entender se a assessoria estratégica faz sentido para a minha marca.")}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between text-xs font-sans font-bold text-black border-t border-black/10 pt-2 cursor-pointer select-none"
                  >
                    <span>FALAR COM A TAG08</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}


