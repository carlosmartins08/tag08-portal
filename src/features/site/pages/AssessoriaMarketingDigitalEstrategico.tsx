import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, ArrowRight, ArrowUpRight, BarChart3, Users, Settings, 
  ShieldCheck, Cpu, Sparkles, Clock, Zap, Award, Target, 
  LineChart, ChevronDown, MessageSquare, LineChart as ChartIcon, Eye
} from "lucide-react";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import MiniCases from "../../../components/MiniCases";
import { buildBrazilWhatsAppUrl } from "../../../config/siteNetwork";

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
    text: "Qual Ã© o maior gargalo comercial da sua marca no momento?",
    options: [
      { label: "A", value: 10, text: "NÃ£o geramos contatos regulares de potenciais clientes (orgÃ¢nico ou pago)" },
      { label: "B", value: 20, text: "AtÃ© geramos leads, mas sÃ£o desqualificados, choram preÃ§o e travam no comercial" },
      { label: "C", value: 15, text: "Nossa presenÃ§a digital Ã© inexistente ou amadora frente aos nossos concorrentes" },
      { label: "D", value: 25, text: "Falta de governanÃ§a: temos boas ideias mas falta equipe dedicada para executar" }
    ]
  },
  {
    id: 2,
    text: "Qual Ã© o investimento mensal atual (ou planejado) em trÃ¡fego pago?",
    options: [
      { label: "A", value: 10, text: "NÃ£o investimos em anÃºncios (foco exclusivo em redes sociais orgÃ¢nicas)" },
      { label: "B", value: 15, text: "Investimento inicial ou instÃ¡vel (atÃ© R$ 2.000 / mÃªs)" },
      { label: "C", value: 25, text: "Investimento moderado (entre R$ 2.000 e R$ 10.000 / mÃªs)" },
      { label: "D", value: 30, text: "Investimento em canais sem prioridade clara (acima de R$ 10.000 / mÃªs)" }
    ]
  },
  {
    id: 3,
    text: "Como vocÃª define o ticket mÃ©dio da sua soluÃ§Ã£o ou produto principal?",
    options: [
      { label: "A", value: 10, text: "Varejo ou baixo valor (Abaixo de R$ 500 por venda/assinatura)" },
      { label: "B", value: 15, text: "MÃ©dio valor transacional (Entre R$ 500 e R$ 2.500)" },
      { label: "C", value: 25, text: "ServiÃ§o especializado ou venda consultiva (Entre R$ 2.500 e R$ 10.000)" },
      { label: "D", value: 30, text: "Corporativo, Enterprise ou B2B Complexo (Acima de R$ 10.000)" }
    ]
  },
  {
    id: 4,
    text: "Quem dita a direÃ§Ã£o tÃ¡tica e faz a gestÃ£o do seu marketing hoje?",
    options: [
      { label: "A", value: 10, text: "O prÃ³prio fundador / dono conduz quando tem tempo livre operacional" },
      { label: "B", value: 15, text: "Contratamos freelancers ou agÃªncias, mas operam soltos, sem direÃ§Ã£o clara" },
      { label: "C", value: 20, text: "Temos um departamento interno jÃºnior ou intermediÃ¡rio sem governanÃ§a estrita" },
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
    if (totalScore <= 35) {
      return {
        level: "Baixa clareza",
        percentage: totalScore,
        color: "text-red-400 border-red-500/20 bg-red-500/5",
        description: "A marca ainda depende muito de aÃ§Ãµes isoladas e de decisÃµes pouco organizadas. Falta uma base mais clara de posicionamento, mensagem e prÃ³ximos passos.",
        focus: "O primeiro foco costuma ser clareza estratÃ©gica e alinhamento de comunicaÃ§Ã£o.",
        recommendation: "A prioridade agora Ã© estruturar a base antes de ampliar a execuÃ§Ã£o."
      };
    } else if (totalScore <= 60) {
      return {
        level: "Clareza em construÃ§Ã£o",
        percentage: totalScore,
        color: "text-brand border-brand/20 bg-brand/5",
        description: "JÃ¡ existe movimento, mas a comunicaÃ§Ã£o ainda pode ficar mais coerente entre canais, conteÃºdos e materiais comerciais.",
        focus: "Ajuste de mensagem, consistÃªncia e estrutura de canais.",
        recommendation: "Vale organizar prioridades antes de ampliar qualquer frente."
      };
    } else if (totalScore <= 85) {
      return {
        level: "Boa direÃ§Ã£o",
        percentage: totalScore,
        color: "text-brand-secondary border-brand-secondary/20 bg-brand-secondary/5",
        description: "A marca jÃ¡ tem um caminho mais consistente, mas ainda pode ganhar clareza na sustentaÃ§Ã£o da rotina e na priorizaÃ§Ã£o das frentes.",
        focus: "Foco em acompanhamento, revisÃ£o e continuidade do que jÃ¡ foi estruturado.",
        recommendation: "O prÃ³ximo passo Ã© consolidar mÃ©todo e manter a execuÃ§Ã£o responsÃ¡vel."
      };
    } else {
      return {
        level: "Pronta para avanÃ§ar",
        percentage: totalScore,
        color: "text-brand-secondary border-brand-secondary/20 bg-brand-secondary/5",
        description: "Existe base suficiente para seguir com mais seguranÃ§a, desde que a execuÃ§Ã£o continue sendo acompanhada com critÃ©rio.",
        focus: "Prioridade em consistÃªncia, ajustes e continuidade.",
        recommendation: "A leitura nÃ£o substitui uma anÃ¡lise completa, mas ajuda a identificar se o prÃ³ximo passo deve ser clareza, estrutura, conteÃºdo, canal ou operaÃ§Ã£o."
      };
    }
  };

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const faqCategories = [
    { id: 0, title: "O QUE Ã‰" },
    { id: 1, title: "ESCOPO" },
    { id: 2, title: "QUANDO FAZ SENTIDO" },
    { id: 3, title: "EQUIPE INTERNA" },
    { id: 4, title: "CLAREZA E PRÃ“XIMO PASSO" }
  ];

  const faqQuestions = [
    "O que Ã© a Assessoria de Marketing EstratÃ©gico da TAG08?",
    "A assessoria inclui execuÃ§Ã£o de marketing?",
    "Quando faz sentido contratar assessoria?",
    "A assessoria substitui uma equipe interna?",
    "A TAG08 faz promessas com a assessoria?"
  ];

  const faqAnswers = [
    "Ã‰ um acompanhamento para organizar posicionamento, prioridades, comunicaÃ§Ã£o, canais e prÃ³ximos passos antes da execuÃ§Ã£o. O foco Ã© ajudar a marca a decidir melhor e evitar aÃ§Ãµes soltas.",
    "Depende do escopo. Em alguns casos a assessoria orienta decisÃµes e organiza o plano. Em outros, pode se conectar com serviÃ§os de conteÃºdo, branding, audiovisual, web ou processos.",
    "Quando a marca sente que estÃ¡ fazendo muitas aÃ§Ãµes, mas ainda falta clareza sobre mensagem, pÃºblico, canais, prioridades ou direÃ§Ã£o comercial.",
    "NÃ£o necessariamente. A TAG08 pode apoiar a tomada de decisÃ£o, orientar prioridades e ajudar a equipe interna ou parceiros externos a trabalharem com mais clareza.",
    "NÃ£o prometemos crescimento instantÃ¢neo, retorno financeiro ou ganho artificial. A assessoria busca construir clareza, critÃ©rio, consistÃªncia e melhoria contÃ­nua com responsabilidade."
  ];

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-[6%] left-[-15%] w-[620px] h-[620px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[620px] h-[620px] bg-brand/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Floating 3D Geometric mesh for tech authority decoration */}
      <Subtle3DCanvas intensity={1.4} className="absolute right-[-10%] top-[4%] w-[490px] h-[490px] opacity-[0.38] mix-blend-screen hidden lg:block" />

      {/*=========================================
          COMPARISON MATRIX
         =========================================*/}
      <section className="px-6 md:px-8 py-20 bg-charcoal-900/15 border-b border-white/[0.04] text-left relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-3 max-w-2xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
              COMPARA??O ESTRAT?GICA
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tighter">
              A diferenÃ§a entre executar aÃ§Ãµes soltas e trabalhar com direÃ§Ã£o.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              A assessoria existe para ajudar a marca a entender prioridades, organizar decisÃµes e reduzir desperdÃ­cio de esforÃ§o antes de transformar ideias em aÃ§Ãµes de marketing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-red-500/10" />
              <div className="flex items-center gap-2 text-zinc-500 font-mono text-[9px] uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400/70" />
                <span>ExecuÃ§Ã£o sem direÃ§Ã£o</span>
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-white uppercase leading-none">Quando tudo comeÃ§a pela urgÃªncia</h3>

              <ul className="space-y-4">
                {[
                  "AÃ§Ãµes sÃ£o feitas por urgÃªncia, gosto pessoal ou tentativa isolada, sem clareza de prioridade, mensagem ou continuidade.",
                  "A entrega tende a ganhar mais coerÃªncia quando existe clareza sobre prioridades, canais, mensagem e capacidade real de execuÃ§Ã£o.",
                  "O esforÃ§o se espalha em vÃ¡rias frentes sem um critÃ©rio claro de foco e sequÃªncia."
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
              <div className="flex items-center gap-2 text-brand font-mono text-[9px] uppercase tracking-widest font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                <span>Assessoria com direÃ§Ã£o</span>
              </div>
              <h3 className="font-display font-medium text-lg sm:text-xl text-brand-secondary uppercase leading-none">Quando a decisÃ£o parte de diagnÃ³stico</h3>

              <ul className="space-y-4">
                {[
                  "As decisÃµes partem de diagnÃ³stico, critÃ©rios, prioridades e um plano possÃ­vel de executar com responsabilidade.",
                  "A assessoria ajuda a organizar comunicaÃ§Ã£o, canais e prÃ³ximos passos antes de ampliar a produÃ§Ã£o.",
                  "O objetivo Ã© reduzir improviso, desalinhamento e retrabalho para que a execuÃ§Ã£o tenha mais consistÃªncia."
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
              LEITURA DE PRIORIDADES
            </span>
            <h2 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
              Antes de combinar canais, entenda o que precisa ser priorizado.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
              Nem toda marca precisa ativar todos os canais ao mesmo tempo. A assessoria ajuda a identificar quais frentes fazem sentido agora, quais podem esperar e quais dependem de estrutura antes da execuÃ§Ã£o.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-5 bg-charcoal-900/60 border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-6">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block pb-3 border-b border-white/[0.05]">
                  MAPA DE PRIORIDADES DE MARKETING
                </span>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider">
                      Leitura inicial:
                    </label>
                    <span className="text-sm font-sans text-brand-secondary font-black bg-brand-secondary/10 px-2.5 py-0.5 rounded-lg border border-brand-secondary/20">
                      Contexto
                    </span>
                  </div>
                  <input 
                    type="range" 
                    id="adv-spend"
                    min="2000" 
                    max="50000" 
                    step="1000" 
                    defaultValue="5000"
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
                  />
                  <div className="flex items-center justify-between text-[9px] font-sans text-zinc-500">
                    <span>Estrutura</span>
                    <span>DireÃ§Ã£o</span>
                    <span>Prioridade</span>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/[0.05]">
                  <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold block">FRENTES AVALIADAS:</span>
                  
                  <div className="space-y-2">
                    {[
                      { id: "positioning", label: "Posicionamento e mensagem" },
                      { id: "content", label: "ConteÃºdo e relacionamento" },
                      { id: "channels", label: "Canais e conversÃ£o" },
                      { id: "operations", label: "OperaÃ§Ã£o e acompanhamento" }
                    ].map((pilar) => {
                      return (
                        <label key={pilar.id} className="flex items-center gap-3 p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl cursor-pointer hover:bg-white/[0.02]">
                          <input 
                            type="checkbox" 
                            id={`chk-${pilar.id}`}
                            defaultChecked={pilar.id === "positioning"}
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
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider">LEITURA INICIAL</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  O melhor caminho depende do equilÃ­brio entre clareza, estrutura e capacidade de execuÃ§Ã£o.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#09090b] border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-6 w-full">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold block">
                  Leitura qualitativa das frentes:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="font-mono text-[8px] text-zinc-500 uppercase font-black block">Posicionamento e mensagem</span>
                    <p className="text-white text-sm font-medium leading-relaxed">Quando a marca ainda precisa deixar mais claro o que faz, para quem faz e por que deve ser escolhida.</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-brand-secondary/[0.02] border border-brand-secondary/10 space-y-1">
                    <span className="font-mono text-[8px] text-brand-secondary/80 uppercase font-black block">ConteÃºdo e relacionamento</span>
                    <p className="text-zinc-300 text-sm leading-relaxed">Quando a presenÃ§a digital precisa de frequÃªncia, linha editorial e conexÃ£o com o pÃºblico certo.</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 space-y-1">
                    <span className="font-mono text-[8px] text-emerald-500/80 uppercase font-black block">Canais e conversÃ£o</span>
                    <p className="text-zinc-300 text-sm leading-relaxed">Quando site, landing page, WhatsApp, redes sociais ou materiais comerciais precisam trabalhar de forma mais integrada.</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="font-mono text-[8px] text-zinc-500 uppercase font-black block">OperaÃ§Ã£o e acompanhamento</span>
                    <p className="text-zinc-300 text-sm leading-relaxed">Quando a execuÃ§Ã£o depende de processo, responsÃ¡veis, revisÃ£o e melhoria contÃ­nua.</p>
                  </div>
                </div>

                <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5 space-y-4">
                  <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold block">Leitura inicial</span>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    Leitura inicial: o melhor caminho depende do equilÃ­brio entre clareza, estrutura e capacidade de execuÃ§Ã£o.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 mt-6">
                <span className="font-mono text-[8px] text-zinc-600">MAPA ORIENTADO POR PRIORIDADES // TAG08</span>
                <button 
                  onClick={() => onNavigate("/contato")}
                  className="text-xs font-mono text-brand font-black uppercase hover:underline flex items-center gap-1.5 cursor-pointer focus:outline-none"
                >
                  SOLICITAR LEITURA ESTRATÃ‰GICA <ArrowRight className="w-3.5 h-3.5" />
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
              MÃ‰TODO DA ASSESSORIA
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tighter leading-none">
              Quatro frentes para transformar dÃºvida em direÃ§Ã£o.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              A assessoria organiza o que a marca precisa entender, decidir, planejar e acompanhar antes de transformar marketing em execuÃ§Ã£o.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              {
                num: "01",
                icon: Target,
                title: "DiagnÃ³stico do momento",
                desc: "Entendemos contexto, objetivos, gargalos, canais atuais e limitaÃ§Ãµes reais antes de recomendar qualquer aÃ§Ã£o."
              },
              {
                num: "02",
                icon: Zap,
                title: "Posicionamento e mensagem",
                desc: "Organizamos como a marca deve se apresentar, quais mensagens precisam ser fortalecidas e o que precisa ficar mais claro para o pÃºblico."
              },
              {
                num: "03",
                icon: LineChart,
                title: "Plano de prioridades",
                desc: "Definimos o que vem primeiro, o que pode esperar e quais frentes fazem sentido para o momento atual do negÃ³cio."
              },
              {
                num: "04",
                icon: Cpu,
                title: "Acompanhamento da execuÃ§Ã£o",
                desc: "Apoiamos a leitura do processo, os ajustes necessÃ¡rios e a continuidade das decisÃµes para evitar aÃ§Ãµes soltas."
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
                    <span>MÃ“DULO DE ASSESSORIA</span>
                    <span className="text-brand font-semibold select-none">MÃ‰TODO_0{idx + 1}</span>
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
                LEITURA DE MATURIDADE
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tighter">
                Sua marca tem clareza suficiente para executar?
              </h2>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Este diagnÃ³stico inicial ajuda a perceber se a marca jÃ¡ tem direÃ§Ã£o, mensagem, canais e estrutura suficientes para avanÃ§ar com mais seguranÃ§a.
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
                          LEITURA INICIAL CONCLUÃDA
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
                              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">LEITURA ATUAL</span>
                              <h4 className={`font-display font-black text-3xl uppercase leading-none ${diag.color}`}>{diag.level}</h4>
                              <p className="text-zinc-400 text-xs font-mono font-bold uppercase text-brand mt-1">{diag.recommendation}</p>
                            </div>
                            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-charcoal-950 border border-white/5 shadow-inner">
                              <div className="absolute inset-1.5 rounded-full border border-dashed border-white/10 animate-spin-slow" />
                              <span className="font-display font-black text-[13px] sm:text-sm text-white text-center leading-tight px-2">{diag.level}</span>
                            </div>
                          </div>

                          <div className="space-y-4 text-zinc-300 text-xs sm:text-sm font-sans leading-relaxed text-left bg-white/[0.01] border border-white/[0.03] p-5 sm:p-6 rounded-xl">
                            <div>
                              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-black block mb-1">Leituras observadas</span>
                              <p className="text-zinc-300 font-medium">{diag.description}</p>
                            </div>
                            <div className="pt-4 border-t border-white/[0.04]">
                              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-black block mb-1.5">PrÃ³ximo foco</span>
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
                              className="bg-brand-secondary hover:bg-brand hover:shadow-[0_10px_35px_rgba(var(--color-brand-secondary-rgb),0.25)] text-black text-xs font-mono font-black uppercase tracking-widest py-4 px-6 rounded-xl text-center transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_30px_rgba(var(--color-brand-secondary-rgb),0.15)] md:col-span-1"
                            >
                              <MessageSquare className="w-4 h-4 text-black" />
                              <span>SOLICITAR DIAGNÃ“STICO COMPLETO</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleResetQuiz}
                              className="bg-white/5 hover:bg-white/[0.08] text-white hover:text-white border border-white/10 hover:border-white/20 text-xs font-mono font-bold uppercase tracking-widest py-4 px-6 rounded-xl text-center transition-all duration-300 cursor-pointer"
                            >
                              REPETIR DIAGNÃ“STICO
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

      {/*=========================================
          CTA FINAL + FAQ
         =========================================*/}
      <section className="py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="rounded-[32px] sm:rounded-[40px] border border-white/[0.06] bg-black/45 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 min-h-[320px] sm:min-h-[380px] relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=1200"
                  alt="TAG08 assessoria"
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.48] contrast-[1.05]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/35 to-black/75" />
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-white/70">
                    Pr&oacute;ximo passo
                  </span>
                  <div className="space-y-3 max-w-sm">
                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                      A assessoria faz sentido quando a marca precisa entender melhor o que priorizar antes de executar.
                    </p>
                    <div className="flex flex-wrap gap-2 text-[9px] font-mono uppercase tracking-widest text-white/55">
                      <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1">Clareza</span>
                      <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1">Dire&ccedil;&atilde;o</span>
                      <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1">Prioridade</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 bg-white text-black">
                <div className="space-y-4 max-w-2xl">
                  <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-black/60">
                    PrÃ³ximo passo
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black leading-[0.92] tracking-tighter uppercase">
                    Vamos entender se a assessoria faz sentido para sua marca?
                  </h2>
                  <p className="text-black/75 text-sm sm:text-[15px] leading-relaxed max-w-xl">
                    Antes de propor qualquer plano, a TAG08 entende seu momento, seus gargalos e suas prioridades para indicar se a assessoria estratÃ©gica &eacute; o caminho mais coerente agora.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={buildBrazilWhatsAppUrl("OlÃ¡ TAG08! Gostaria de conversar sobre assessoria de marketing estratÃ©gico para entender se faz sentido para a minha marca.")}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-black text-white px-5 py-3 text-xs sm:text-sm font-mono font-bold uppercase tracking-widest transition-transform hover:-translate-y-0.5"
                  >
                    <span>FALAR COM A TAG08</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleLinkClick("/servicos")}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-5 py-3 text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-black transition-colors hover:bg-black/[0.06]"
                  >
                    <span>VER OUTRAS SOLUÃ‡Ã•ES</span>
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
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono">
                    D&Uacute;VIDAS SOBRE ASSESSORIA
                  </div>
                  <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter uppercase">
                    Antes de contratar, entenda como a assessoria funciona.
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans max-w-sm">
                    A assessoria existe para ajudar a marca a decidir melhor antes de executar. As respostas abaixo ajudam a entender quando esse caminho faz sentido e o que esperar do processo.
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
                  TAG08 // ASSESSORIA
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

              <div className="lg:col-span-4 flex flex-col justify-between gap-4">
                <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                  <div className="space-y-2">
                    <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-bold">PROPOSTA DE VALOR</span>
                    <h4 className="text-white font-semibold text-sm leading-snug">Dire&ccedil;&atilde;o antes da execu&ccedil;&atilde;o</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                      A assessoria organiza entendimento, prioridades e escopo antes de qualquer entrega.
                    </p>
                  </div>
                  <button
                    onClick={() => handleLinkClick("/servicos")}
                    className="group flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5"
                  >
                    <span>VER OUTRAS SOLUÃ‡Ã•ES</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                  <div className="space-y-2">
                    <span className="font-mono text-[8.5px] text-black/60 uppercase tracking-widest block font-extrabold">CONTATO DIRETO</span>
                    <h4 className="text-black font-black text-sm uppercase leading-tight tracking-tight">Falar com a TAG08</h4>
                    <p className="text-black/85 text-[11.5px] font-semibold leading-relaxed font-sans">
                      Se fizer sentido, o prÃ³ximo passo &eacute; conversar sobre contexto, escopo e prioridade.
                    </p>
                  </div>
                  <a
                    href={buildBrazilWhatsAppUrl("OlÃ¡ TAG08! Gostaria de entender se a assessoria estratÃ©gica faz sentido para a minha marca.")}
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


