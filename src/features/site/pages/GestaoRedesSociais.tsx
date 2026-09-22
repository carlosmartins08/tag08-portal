import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MessageSquare, Sparkles, TrendingUp, ArrowUpRight, ArrowRight, Users, Plus, Minus } from "lucide-react";
import { buildBrazilWhatsAppUrl } from "../../../config/siteNetwork";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import ResilientImage from "../../../components/ResilientImage";
import { trackVideoEvent } from "../../../lib/analytics";
import { useSimulatorTracking } from "../../../lib/useSimulatorTracking";
import { useOfficialYouTubeVideos } from "../../../lib/useOfficialYouTubeVideos";

type DiagnosticKey = "challenge" | "routine" | "channels" | "priority" | "formats" | "moment";
type DiagnosticAnswer = string | string[];

interface DiagnosticOption {
  value: string;
  label: string;
}

interface DiagnosticQuestion {
  key: DiagnosticKey;
  step: string;
  title: string;
  helper: string;
  multi?: boolean;
  options: DiagnosticOption[];
}

const EDITORIAL_DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    key: "challenge",
    step: "Etapa 01",
    title: "Qual é o principal desafio hoje?",
    helper: "Escolha a leitura que mais descreve o travamento atual.",
    options: [
      { value: "clarity", label: "Falta clareza" },
      { value: "consistency", label: "Falta consistência" },
      { value: "time", label: "Falta tempo" },
      { value: "direction", label: "Não sei por onde começar" }
    ]
  },
  {
    key: "routine",
    step: "Etapa 02",
    title: "Como a rotina atual funciona?",
    helper: "Queremos entender se existe fluxo, improviso ou pausa.",
    options: [
      { value: "none", label: "Ainda não existe" },
      { value: "improvised", label: "É improvisada" },
      { value: "partial", label: "Existe, mas é parcial" },
      { value: "reviewed", label: "Já existe com revisão" }
    ]
  },
  {
    key: "channels",
    step: "Etapa 03",
    title: "Quais canais vocês usam hoje?",
    helper: "Marque os canais que fazem parte da rotina da marca.",
    multi: true,
    options: [
      { value: "instagram", label: "Instagram" },
      { value: "tiktok", label: "TikTok" },
      { value: "linkedin", label: "LinkedIn" },
      { value: "youtube", label: "YouTube" },
      { value: "site-whatsapp", label: "Site e WhatsApp" }
    ]
  },
  {
    key: "priority",
    step: "Etapa 04",
    title: "Qual função principal a presença nas redes precisa cumprir agora?",
    helper: "Escolha a função principal da presença nas redes neste momento.",
    options: [
      { value: "authority", label: "Fortalecer percepção e autoridade" },
      { value: "recurrence", label: "Presença recorrente" },
      { value: "behind-scenes", label: "Mostrar bastidores e processo" },
      { value: "commercial-support", label: "Apoiar comunicação comercial" }
    ]
  },
  {
    key: "formats",
    step: "Etapa 05",
    title: "Quais formatos fazem sentido para a rotina atual?",
    helper: "Marque os formatos que podem fazer sentido para a comunicação atual. A escolha não significa inclusão automática no escopo.",
    multi: true,
    options: [
      { value: "reels", label: "Reels e cortes" },
      { value: "carousels", label: "Carrosséis" },
      { value: "testimonials", label: "Depoimentos" },
      { value: "institutional", label: "Vídeo institucional" },
      { value: "bastidores", label: "Bastidores" }
    ]
  },
  {
    key: "moment",
    step: "Etapa 06",
    title: "Qual é o momento da marca?",
    helper: "Isso ajuda a entender o nível de organização e a profundidade de apoio necessária.",
    options: [
      { value: "foundation", label: "Precisa organizar a base" },
      { value: "review", label: "Quer revisar a direção" },
      { value: "accelerate", label: "Quer avançar com mais consistência" },
      { value: "start", label: "Quer iniciar uma rotina" }
    ]
  }
];

const EDITORIAL_DIAGNOSTIC_STEP_COUNT = EDITORIAL_DIAGNOSTIC_QUESTIONS.length + 1;

const getDiagnosticQuestion = (key: DiagnosticKey) =>
  EDITORIAL_DIAGNOSTIC_QUESTIONS.find((question) => question.key === key);

const getDiagnosticValueLabel = (key: DiagnosticKey, value: DiagnosticAnswer) => {
  const question = getDiagnosticQuestion(key);
  if (!question) {
    return "Aguardando resposta";
  }

  if (Array.isArray(value)) {
    if (!value.length) {
      return "Aguardando resposta";
    }

    return value
      .map((item) => question.options.find((option) => option.value === item)?.label ?? item)
      .join(" • ");
  }

  return question.options.find((option) => option.value === value)?.label ?? "Aguardando resposta";
};

const buildDiagnosticRecommendation = ({
  challenge,
  routine,
  moment,
}: {
  challenge: string;
  routine: string;
  moment: string;
}) => {
  if (!challenge || !routine || !moment) {
    return "Complete as respostas para gerar a leitura final e o próximo passo.";
  }

  if (challenge === "direction" || routine === "none") {
    return "Começar por direção editorial, temas prioritários e uma rotina possível antes de pensar em volume.";
  }

  if (challenge === "clarity" || moment === "review") {
    return "Revisar narrativa, prioridade editorial e formatos que expliquem melhor a oferta.";
  }

  if (challenge === "consistency" || routine === "improvised") {
    return "Organizar frequência, revisão e formatos para reduzir improviso e sustentar presença.";
  }

  if (moment === "accelerate") {
    return "A conversa pode avançar para escopo, responsabilidades e cadência compatíveis com a rotina atual.";
  }

  return "A TAG08 pode ajudar a transformar esta leitura em linha editorial, formatos e próximos passos mais claros.";
};

interface SocialMediaProps {
  onNavigate: (page: string) => void;
}

export default function GestaoRedesSociais({ onNavigate }: SocialMediaProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeFaq, setActiveFaq] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [diagnosticStep, setDiagnosticStep] = useState(0);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<Record<DiagnosticKey, DiagnosticAnswer>>({
    challenge: "",
    routine: "",
    channels: [],
    priority: "",
    formats: [],
    moment: ""
  });
  const [diagnosticName, setDiagnosticName] = useState("");
  const [diagnosticWhatsapp, setDiagnosticWhatsapp] = useState("");
  const [diagnosticConsent, setDiagnosticConsent] = useState(false);
  const trackSimulator = useSimulatorTracking("social_editorial_diagnostic", 1, "/servicos/gestao-de-redes-sociais");

  const isContactStep = diagnosticStep === EDITORIAL_DIAGNOSTIC_QUESTIONS.length;
  const isDiagnosticComplete = diagnosticStep === EDITORIAL_DIAGNOSTIC_STEP_COUNT;
  const diagnosticProgress = Math.round((Math.min(diagnosticStep, EDITORIAL_DIAGNOSTIC_STEP_COUNT) / EDITORIAL_DIAGNOSTIC_STEP_COUNT) * 100);
  const activeDiagnosticQuestion = isContactStep || isDiagnosticComplete
    ? null
    : EDITORIAL_DIAGNOSTIC_QUESTIONS[diagnosticStep];
  const activeDiagnosticAnswer = activeDiagnosticQuestion
    ? diagnosticAnswers[activeDiagnosticQuestion.key]
    : "";
  const activeDiagnosticSelectedValues = Array.isArray(activeDiagnosticAnswer)
    ? activeDiagnosticAnswer
    : activeDiagnosticAnswer
      ? [activeDiagnosticAnswer]
      : [];
  const activeDiagnosticSelectedLabels = activeDiagnosticQuestion
    ? getDiagnosticValueLabel(activeDiagnosticQuestion.key, activeDiagnosticAnswer)
    : "Aguardando resposta";
  const hasActiveDiagnosticSelection = activeDiagnosticSelectedLabels !== "Aguardando resposta";
  const challengeLabel = getDiagnosticValueLabel("challenge", diagnosticAnswers.challenge);
  const routineLabel = getDiagnosticValueLabel("routine", diagnosticAnswers.routine);
  const channelsLabel = getDiagnosticValueLabel("channels", diagnosticAnswers.channels);
  const priorityLabel = getDiagnosticValueLabel("priority", diagnosticAnswers.priority);
  const formatsLabel = getDiagnosticValueLabel("formats", diagnosticAnswers.formats);
  const momentLabel = getDiagnosticValueLabel("moment", diagnosticAnswers.moment);
  const diagnosticReady = Boolean(
    challengeLabel !== "Aguardando resposta" &&
    routineLabel !== "Aguardando resposta" &&
    channelsLabel !== "Aguardando resposta" &&
    priorityLabel !== "Aguardando resposta" &&
    formatsLabel !== "Aguardando resposta" &&
    momentLabel !== "Aguardando resposta" &&
    diagnosticName.trim() &&
    diagnosticWhatsapp.trim() &&
    diagnosticConsent
  );
  const canContinueDiagnostic = activeDiagnosticQuestion
    ? hasActiveDiagnosticSelection
    : isContactStep
      ? diagnosticReady
      : false;
  const diagnosticRecommendation = buildDiagnosticRecommendation({
    challenge: diagnosticAnswers.challenge as string,
    routine: diagnosticAnswers.routine as string,
    moment: diagnosticAnswers.moment as string
  });
  const { videos: youtubeVideos, source: youtubeSource, isLoading: isYouTubeLoading } = useOfficialYouTubeVideos(3);
  const visibleVideos = youtubeSource === "live" ? youtubeVideos : [];
  const diagnosticSummaryCards = [
    { label: "Principal desafio", value: challengeLabel },
    { label: "Rotina atual", value: routineLabel },
    { label: "Canais usados", value: channelsLabel },
    { label: "Prioridade editorial", value: priorityLabel },
    { label: "Formatos de interesse", value: formatsLabel },
    { label: "Momento da marca", value: momentLabel }
  ];
  const diagnosticMessage = `Olá TAG08! Concluí meu diagnóstico editorial.

Seu diagnóstico editorial

Principal desafio: ${challengeLabel}
Rotina atual: ${routineLabel}
Canais usados: ${channelsLabel}
Prioridade editorial: ${priorityLabel}
Formatos desejados: ${formatsLabel}
Momento da marca: ${momentLabel}
Estrutura de interesse sinalizada: ${selectedPlan ?? "Ainda não indicada"}
Nome: ${diagnosticName.trim()}
WhatsApp: ${diagnosticWhatsapp.trim()}
Consentimento: ${diagnosticConsent ? "Autorizado" : "Não autorizado"}

Próximo passo: conversar com a TAG08 para entender contexto, escopo e direção editorial.`;
  const diagnosticWhatsAppUrl = buildBrazilWhatsAppUrl(diagnosticMessage);

  const scrollToEditorialDiagnostic = () => {
    document.getElementById("diagnostico-editorial")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setDiagnosticSingleAnswer = (key: Exclude<DiagnosticKey, "channels" | "formats">, value: string) => {
    trackSimulator("input_changed");
    setDiagnosticAnswers((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleDiagnosticMultiAnswer = (key: "channels" | "formats", value: string) => {
    trackSimulator("input_changed");
    setDiagnosticAnswers((prev) => {
      const current = Array.isArray(prev[key]) ? (prev[key] as string[]) : [];
      return {
        ...prev,
        [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
      };
    });
  };

  const handleDiagnosticAnswerSelect = (question: DiagnosticQuestion, optionValue: string) => {
    if (question.multi) {
      toggleDiagnosticMultiAnswer(question.key as "channels" | "formats", optionValue);
      return;
    }

    setDiagnosticSingleAnswer(question.key as Exclude<DiagnosticKey, "channels" | "formats">, optionValue);
  };

  const continueDiagnostic = () => {
    if (isDiagnosticComplete) return;

    if (isContactStep) {
      if (!diagnosticReady) return;
      setDiagnosticStep(EDITORIAL_DIAGNOSTIC_STEP_COUNT);
      return;
    }

    const question = EDITORIAL_DIAGNOSTIC_QUESTIONS[diagnosticStep];
    const value = diagnosticAnswers[question.key];
    const hasAnswer = Array.isArray(value) ? value.length > 0 : Boolean(value);
    if (!hasAnswer) return;

    setDiagnosticStep((current) => current + 1);
  };

  const goToPreviousDiagnosticStep = () => {
    if (diagnosticStep > 0) {
      setDiagnosticStep((current) => current - 1);
    }
  };

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const faqItems = [
    {
      id: 0,
      eyebrow: "Função da gestão",
      question: "A gestão de redes sociais é só produção de posts?",
      answer:
        "Não. A produção faz parte da entrega, mas a gestão começa por contexto, linha editorial, planejamento, formatos, revisão e acompanhamento."
    },
    {
      id: 1,
      eyebrow: "Escolha do plano",
      question: "Qual é a diferença entre Start, Base e Performance?",
      answer:
        "A principal diferença está na profundidade da operação e na divisão de responsabilidades. No Start, o cliente participa mais e normalmente assume parte da rotina. O Base organiza planejamento e produção recorrente. O Performance atende operações que precisam de maior integração entre conteúdo, vídeo, publicação e acompanhamento."
    },
    {
      id: 2,
      eyebrow: "Publicação",
      question: "A TAG08 publica os conteúdos?",
      answer:
        "Depende da estrutura contratada. No Start, a publicação normalmente fica com o cliente. Base e Performance podem incluir publicação nos canais definidos conforme a proposta vigente."
    },
    {
      id: 3,
      eyebrow: "Vídeo e captação",
      question: "Vídeos fazem parte da gestão?",
      answer:
        "Roteiros, edição e conteúdos em vídeo podem compor determinados escopos. Captação presencial não está incluída automaticamente e, quando necessária, é tratada como projeto ou contratação complementar."
    },
    {
      id: 4,
      eyebrow: "Resultados",
      question: "A TAG08 garante alcance, leads ou vendas?",
      answer:
        "Não. A TAG08 trabalha para organizar direção, consistência, produção e acompanhamento. Resultados também dependem de oferta, mercado, atendimento, investimento, operação e outras variáveis."
    }
  ];
  const activeFaqItem = faqItems[activeFaq] ?? faqItems[0];

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pb-20 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-[8%] left-[-15%] w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] bg-brand/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle floating 3D element in the background of user focus */}
      <Subtle3DCanvas intensity={1.3} className="absolute right-[-8%] top-[5%] w-[480px] h-[480px] opacity-[0.35] mix-blend-screen hidden lg:block" />

      {/* SECTION 1 - HERO: THE EDITORIAL SYSTEM (Synchronized Style) */}
      <section className="tag08-section px-4 sm:px-6 md:px-8 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 lg:items-center text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta self-start">
                GESTÃO DE REDES SOCIAIS // TAG08
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter font-display">
                Redes sociais <br />
                <span className="text-brand">com direção, linha editorial e consistência.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-sm leading-relaxed font-sans font-medium">
                A TAG08 organiza a presença da marca nas redes sociais com planejamento, linha editorial, formatos, produção e acompanhamento para que o conteúdo deixe de ser postagem solta e passe a cumprir uma função clara na comunicação e no processo comercial.
              </p>
            </div>
          </div>

          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[4/3] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <ResilientImage
                sizes="100vw"
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600"
                alt="Planejamento de conteúdo para redes sociais"
                fallbackLabel="Presença com direção TAG08"
                preload
                className="object-cover grayscale brightness-50 group-hover:scale-[1.01] transition-all duration-1000 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{ transform: "translateZ(45px)" }}>
                <button
                  onClick={scrollToEditorialDiagnostic}
                  className="group -translate-y-10 bg-brand-secondary text-black font-sans font-black text-xs sm:translate-y-0 sm:text-xs uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] hover:scale-105 duration-300 transition-all border border-brand-secondary hover:bg-brand-dark flex items-center gap-2 cursor-pointer z-20"
                >
                  <span>DIAGNÓSTICO EDITORIAL</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              <div className="absolute bottom-12 left-6 right-6 flex items-end justify-between z-10 pointer-events-none sm:bottom-6" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="tag08-meta text-xs text-brand-secondary tracking-widest block uppercase font-bold">CONTEÚDO E FORMATOS</span>
                  <h4 className="font-display font-black text-white text-xs sm:text-sm tracking-tight leading-none">Conteúdo com direção e revisão</h4>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-xs text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>CONTEÚDO EM CONTEXTO</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Linha editorial</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">Temas, mensagens, formatos e prioridades<br/>organizados com intenção.</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">Frequência possível</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">Cadência compatível com a realidade da<br/>operação e com a capacidade de aprovação.</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Narrativa de marca</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">Mensagem coerente entre conteúdo,<br/>legenda, formato e conversa.</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">Acompanhamento</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">Revisão contínua para aprender com o ciclo<br/>e ajustar a direção quando necessário.</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - SEGMENTATION / QUANDO INVESTIR IN SOCIAL MEDIA */}
      <section className="tag08-section px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-900/10 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-4 space-y-4">
            <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest block font-bold">Sinais de desalinhamento</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white leading-none tracking-tight">
              Quando as redes sociais <span className="text-brand">deixam de construir presença.</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Muitas marcas publicam com frequência, mas ainda não conseguem transmitir clareza, consistência ou percepção correta de valor. O problema nem sempre é falta de conteúdo; muitas vezes é falta de linha editorial, posicionamento, prioridade e critério de produção.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="tag08-surface-card p-6 border hover:border-brand/40 duration-300 rounded-3xl space-y-3 transition-all">
              <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">Postagens sem direção</span>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                Os conteúdos saem, mas não parecem construir uma narrativa clara sobre a marca, seus diferenciais ou sua forma de gerar valor.
              </p>
            </div>

            <div className="tag08-surface-card p-6 border hover:border-brand/40 duration-300 rounded-3xl space-y-3 transition-all">
              <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">Calendário sem prioridade</span>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                A rotina existe, mas os temas são definidos por urgência, tendência ou improviso, sem conexão com uma estratégia maior.
              </p>
            </div>

            <div className="tag08-surface-card p-6 border hover:border-brand/40 duration-300 rounded-3xl space-y-3 transition-all">
              <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">Visual sem consistência</span>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                Cada peça parece seguir uma lógica diferente, dificultando reconhecimento e continuidade da identidade entre as publicações.
              </p>
            </div>

            <div className="tag08-surface-card p-6 border hover:border-brand/40 duration-300 rounded-3xl space-y-3 transition-all">
              <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">Pouca conexão com o comercial</span>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                O conteúdo até movimenta a página, mas não ajuda o público a entender melhor a oferta, o processo ou o próximo passo.
              </p>
            </div>

            <div className="tag08-surface-card p-6 border hover:border-brand/40 duration-300 rounded-3xl space-y-3 transition-all sm:col-span-2">
              <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">Produção difícil de sustentar</span>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                A marca depende de esforço pontual, ideias soltas e aprovações demoradas, tornando a presença instável.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* SECTION 3 - DELIVERABLES (The "What" with Clean Features Grid) */}
      <section className="tag08-section px-4 sm:px-6 md:px-8 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-bold">O que organizamos</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Gestão de redes não é só calendário. É direção editorial.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              A TAG08 organiza temas, formatos, frequência, linguagem, produção, identidade visual aplicada e revisão para que a presença da marca nas redes sociais tenha coerência, continuidade e função dentro da estratégia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="tag08-surface-card border hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm">Linha editorial</h4>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Definição de temas, mensagens, pilares e prioridades que orientam o conteúdo antes da produção.
                </p>
              </div>
            </div>

            <div className="tag08-surface-card border hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm">Calendário possível</h4>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Organização de uma rotina compatível com o momento, os canais, a equipe e a capacidade real de aprovação.
                </p>
              </div>
            </div>

            <div className="tag08-surface-card border hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm">Criação de conteúdo</h4>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Produção dos formatos previstos no escopo a partir da linha editorial aprovada.
                </p>
              </div>
            </div>

            <div className="tag08-surface-card border hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Users className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm">Direção visual</h4>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Aplicação consistente da identidade da marca nos materiais produzidos para os canais definidos.
                </p>
              </div>
            </div>

            <div className="tag08-surface-card border hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm">Acompanhamento e revisão</h4>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Leitura do ciclo para ajustar temas, linguagem, formatos e prioridades quando necessário.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* SECTION 4 - PLANOS DISPONaVEIS & COPES (Immediate Action Offerings) */}
      <section className="tag08-section px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-900/10 text-left">
        <div className="max-w-7xl mx-auto space-y-16 lg:space-y-20">
          
          {/* SECTION 4 - PLANOS DISPONIVEIS */}
          <div className="space-y-3 max-w-3xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              Estruturas recorrentes
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-white leading-tight">
              Escolha a estrutura que sua rotina consegue sustentar.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl">
              Start, Base e Performance respondem a necessidades e níveis de participação diferentes. O diagnóstico confirma a aderência antes da proposta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {[
              {
                name: "Plano Start",
                eyebrow: "ENTRADA ESTRATÉGICA",
                stage: "INÍCIO ORIENTADO",
                subtitle: "Para começar com direção e maior participação do cliente.",
                desc: "Estrutura indicada para profissionais e pequenos negócios que precisam organizar uma presença inicial, conseguem participar mais da rotina e normalmente assumem a publicação.",
                includes: [
                  "Direção inicial e linha editorial",
                  "Produção prevista para o ciclo",
                  "Participação do cliente nas aprovações e, normalmente, na publicação"
                ],
                support: "Evolua quando a rotina pedir produção e acompanhamento mais constantes."
              },
              {
                name: "Plano Base",
                eyebrow: "CONSISTÊNCIA MENSAL",
                stage: "ROTINA CONSOLIDADA",
                subtitle: "Para negócios ativos que precisam transformar comunicação improvisada em rotina.",
                desc: "A TAG08 organiza planejamento e produção recorrente para marcas com oferta ativa que precisam manter linha editorial, consistência e continuidade.",
                includes: [
                  "Planejamento e produção mensal",
                  "Linha editorial e rotina de revisão",
                  "Acompanhamento conforme o escopo contratado"
                ],
                support: "Faz sentido evoluir quando mais canais, formatos e responsabilidades passam a exigir maior coordenação."
              },
              {
                name: "Plano Performance",
                eyebrow: "OPERAÇÃO INTEGRADA",
                stage: "COORDENAÇÃO AMPLIADA",
                subtitle: "Para marcas que precisam de maior integração entre planejamento, produção e acompanhamento.",
                desc: "Estrutura recorrente mais completa, indicada quando existe necessidade real de coordenar conteúdo, vídeo, publicação, acompanhamento e análise com maior profundidade.",
                includes: [
                  "Planejamento com maior integração entre frentes",
                  "Produção e publicação conforme o escopo vigente",
                  "Acompanhamento e revisão com maior profundidade operacional"
                ],
                support: "Indicado quando a operação exige mais coordenação, não apenas mais volume."
              }
            ].map((plan) => (
              <motion.div
                key={plan.name}
                whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                className="border rounded-3xl p-7 flex flex-col justify-between gap-8 transition-all duration-300 relative overflow-hidden bg-charcoal-900 border-white/[0.04]"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2 py-0.5 rounded font-black max-w-max">
                      {plan.eyebrow}
                    </span>
                    <span className="font-sans text-xs text-zinc-400 font-bold">{plan.stage}</span>
                  </div>

                  <h3 className="text-white font-display font-medium text-xl tracking-tight leading-none pt-2">{plan.name}</h3>
                  <p className="text-brand-secondary text-xs font-black uppercase tracking-[0.14em]">{plan.subtitle}</p>
                  <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">{plan.desc}</p>
                  <div className="space-y-3 rounded-2xl border border-white/[0.04] bg-white/[0.01] p-4">
                    <p className="tag08-meta text-xs font-black uppercase tracking-widest text-zinc-500">O que esta estrutura organiza</p>
                    <ul className="space-y-2">
                      {plan.includes.map((item) => (
                        <li key={item} className="flex gap-2 text-xs font-sans leading-relaxed text-zinc-300">
                          <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-secondary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-zinc-300 text-xs font-sans leading-relaxed border-l border-brand-secondary/30 pl-3">{plan.support}</p>
                </div>

                <div className="pt-6 border-t border-white/[0.04] mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlan(plan.name);
                      scrollToEditorialDiagnostic();
                    }}
                    aria-label={`Avaliar adequação ao ${plan.name}`}
                    className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-brand-secondary/20 bg-brand-secondary/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-brand-secondary transition-all duration-300 hover:bg-brand-secondary hover:text-black"
                  >
                    <span>ENTENDER ESCOPO</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Incluso x Não Incluso */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-12 border-t border-white/[0.04]">
            
            {/* Left intro details column */}
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
              <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                LIMITES E EXPECTATIVAS
              </span>
              <h3 className="font-display font-medium text-3xl text-white tracking-tight">
                O escopo muda conforme a estrutura contratada.
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                Start, Base e Performance não possuem a mesma divisão de responsabilidades. A proposta confirma formatos, publicação, acompanhamento, canais e responsabilidades antes do início.
              </p>

              <div className="p-5 rounded-2xl bg-brand-secondary/[0.01] border border-white/[0.03] text-xs text-zinc-400 font-sans leading-relaxed">
                A composição final é confirmada na proposta vigente.
              </div>
            </div>

            {/* Inclusions and Exclusions ledger boxes */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Incluso */}
              <div className="bg-charcoal-900 border border-white/[0.05] p-7 rounded-3xl space-y-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand/30" />
                <span className="font-sans text-xs text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded font-black uppercase inline-block">
                  PODE COMPOR A GESTÃO
                </span>
                
                <div className="space-y-3.5">
                  {[
                    "Diagnóstico ou briefing inicial",
                    "Planejamento e linha editorial",
                    "Calendário ou cronograma",
                    "Peças, legendas e conteúdos previstos no escopo",
                    "Roteiros e direcionamentos de gravação",
                    "Fluxo de revisão e aprovação",
                    "Publicação, quando prevista na proposta",
                    "Acompanhamento, conforme estrutura contratada"
                  ].map((inc, index) => (
                    <div key={index} className="flex gap-3 text-xs text-zinc-300 font-sans items-start font-medium leading-relaxed font-semibold">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-1.5 shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Não incluso */}
              <div className="bg-charcoal-900 border border-white/[0.05] p-7 rounded-3xl space-y-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-zinc-600/30" />
                <span className="font-sans text-xs text-zinc-500 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded font-black uppercase inline-block">
                  NÃO ENTRA AUTOMATICAMENTE
                </span>
                
                <div className="space-y-3.5">
                  {[
                    "Tráfego pago",
                    "Gestão de SAC, comentários ou inbox",
                    "Captação presencial",
                    "Identidade visual completa ou rebranding",
                    "Site, landing page ou desenvolvimento de funil",
                    "Automações",
                    "Atendimento ilimitado",
                    "Urgências fora do ciclo",
                    "Garantia de leads, vendas ou crescimento"
                  ].map((exc, index) => (
                    <div key={index} className="flex gap-3 text-xs text-zinc-400 font-sans items-start font-medium leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                      <span>{exc}</span>
                    </div>
                  ))}
                </div>
                
                <p className="text-xs text-zinc-500 font-sans leading-normal pt-2 border-t border-white/[0.03] uppercase">
                  Itens complementares dependem de diagnóstico, escopo, capacidade e investimento próprios.
                </p>
              </div>
            </div>
          </div>

          {/* Ciclo Mensal de Operação - CHRONOLOGICAL TIMELINE */}
          <div className="space-y-10 pt-12 border-t border-white/[0.04]">
            <div className="space-y-3">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                CICLO MENSAL
              </span>
              <h3 className="font-display font-medium text-3xl text-white tracking-tight">
                Uma rotina de conteúdo com método.
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl">
                O ciclo organiza contexto, produção, revisão e aprendizados para manter a comunicação coerente sem depender de urgência de última hora.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Leitura e planejamento", desc: "Organizamos contexto, objetivos, temas, prioridades e formatos antes da produção do ciclo." },
                { title: "Produção", desc: "Desenvolvemos os materiais previstos no escopo a partir da linha editorial e das prioridades definidas." },
                { title: "Revisão e distribuição", desc: "Conduzimos revisão e aprovação e, quando previsto na proposta, publicação nos canais definidos." },
                { title: "Acompanhamento", desc: "Os aprendizados do ciclo ajudam a orientar temas, formatos, linguagem e ajustes futuros." }
              ].map((step, sIdx) => (
                <div key={sIdx} className="bg-charcoal-900 border border-white/[0.04] p-6 rounded-2xl text-left space-y-4 hover:border-brand/10 transition-all duration-300">
                  <div className="font-sans text-xs font-black text-brand-secondary bg-brand-secondary/5 w-8 h-8 rounded-lg flex items-center justify-center border border-brand-secondary/10 shadow-[0_4px_10px_rgba(var(--color-brand-secondary-rgb),0.05)]">
                    0{sIdx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white font-display font-bold text-xs sm:text-sm tracking-tight">{step.title}</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Relatórios e Aprendizados - ACTIVE DASHBOARD PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-12 border-t border-white/[0.04]">
            <div className="lg:col-span-5 space-y-4">
              <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                LEITURA E APRENDIZADO
              </span>
              <h3 className="font-display font-medium text-3xl text-white tracking-tight">
                Acompanhamos a presença para melhorar a consistência editorial
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                A leitura do trabalho serve para ajustar temas, formatos, frequência e pontos de melhoria sem transformar redes sociais em promessa de resultado.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Presença mais coerente", desc: "O foco é tornar a comunicação mais clara, reconhecível e conectada ao posicionamento da marca." },
                { title: "Leitura de conteúdo", desc: "Observamos se os formatos ajudam a sustentar a narrativa ou apenas ocupam espaço." },
                { title: "Aproximação do público", desc: "Observamos se conteúdos, formatos e mensagens ajudam o público a compreender melhor a marca, a oferta e o próximo passo." },
                { title: "Ajuste contínuo", desc: "Usamos os aprendizados do ciclo para refinar temas, frequência e linguagem editorial." }
              ].map((item, iIdx) => (
                <div key={iIdx} className="p-5 rounded-2xl bg-charcoal-900/60 border border-white/[0.03] space-y-1.5 text-left hover:border-brand/10 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-brand-secondary" />
                  <h4 className="text-white text-xs sm:text-sm font-display font-bold tracking-tight">{item.title}</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <ServiceInsightsBridge
        servicePath="/servicos/gestao-de-redes-sociais"
        onNavigate={onNavigate}
      />

      {/* INTERACTIVE INNOVATION: SIMULADOR DE DIAGNÓSTICO EDITORIAL */}
      <section id="diagnostico-editorial" className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-950 text-left relative overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-brand/[0.01] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              Diagnóstico editorial
            </span>
            <h2 className="font-display font-medium text-3xl text-white tracking-tight">
              Leitura do que pode estar travando sua presença nas redes.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
              Nem sempre o problema é postar pouco. Muitas vezes a presença digital trava por falta de linha editorial, frequência possível, clareza de mensagem, consistência visual ou processo de aprovação.
            </p>
            {selectedPlan && (
              <p className="border-l border-brand-secondary/40 pl-3 text-xs font-sans leading-relaxed text-zinc-300">
                Você sinalizou interesse no <strong className="font-bold text-white">{selectedPlan}</strong>. A conversa de diagnóstico ajuda a entender se essa estrutura faz sentido para o momento da marca.
              </p>
            )}
          </div>

          <div className="mx-auto max-w-4xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-charcoal-950 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
            <div className="space-y-3 border-b border-white/[0.06] px-6 pb-5 pt-6 sm:px-10 sm:pt-8">
              <div className="flex items-center justify-between gap-4">
                <span className="tag08-meta text-xs text-zinc-400 tracking-wide">
                  Pré-qualificação editorial · {isDiagnosticComplete ? "Concluída" : `Etapa ${diagnosticStep + 1} de ${EDITORIAL_DIAGNOSTIC_STEP_COUNT}`}
                </span>
                <span className="tag08-meta text-xs text-zinc-400 tracking-wide">
                  {diagnosticProgress}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Progresso da pré-qualificação editorial"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={diagnosticProgress}
                aria-valuetext={isDiagnosticComplete ? "Diagnóstico concluído" : `Etapa ${diagnosticStep + 1} de ${EDITORIAL_DIAGNOSTIC_STEP_COUNT}`}
                className="h-1 rounded-full bg-white/[0.06] overflow-hidden"
              >
                <div
                  className="h-full rounded-full bg-brand-secondary transition-all duration-300"
                  style={{ width: `${diagnosticProgress}%` }}
                />
              </div>
            </div>

            <div className="min-h-[420px] px-6 py-8 sm:min-h-[460px] sm:px-10 sm:py-10" aria-live="polite">
              {activeDiagnosticQuestion && (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black block">
                      {activeDiagnosticQuestion.step}
                    </span>
                    <h3 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
                      {activeDiagnosticQuestion.title}
                    </h3>
                    <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
                      {activeDiagnosticQuestion.helper}
                      {activeDiagnosticQuestion.multi && " Você pode selecionar mais de uma opção."}
                    </p>
                  </div>

                  <fieldset className="grid grid-cols-1 gap-3 border-0 p-0 sm:grid-cols-2">
                    <legend className="sr-only">
                      {activeDiagnosticQuestion.title}. {activeDiagnosticQuestion.multi ? "Selecione uma ou mais opções." : "Selecione uma opção."}
                    </legend>
                    {activeDiagnosticQuestion.options.map((option) => {
                      const isActive = activeDiagnosticSelectedValues.includes(option.value);
                      return (
                        <label
                          key={option.value}
                          className={`min-h-[76px] rounded-2xl border px-4 py-4 text-left text-sm leading-snug transition-all duration-200 cursor-pointer hover:-translate-y-0.5 focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-secondary focus-within:ring-offset-2 focus-within:ring-offset-charcoal-950 ${
                            isActive
                              ? "border-brand-secondary bg-brand-secondary/10 text-brand-secondary shadow-[0_12px_30px_rgba(var(--color-brand-secondary-rgb),0.08)]"
                              : "border-white/[0.10] bg-white/[0.015] text-zinc-200 hover:border-white/25 hover:bg-white/[0.035] hover:text-white"
                          }`}
                        >
                          <input
                            type={activeDiagnosticQuestion.multi ? "checkbox" : "radio"}
                            name={`diagnostic-${activeDiagnosticQuestion.key}`}
                            checked={isActive}
                            onChange={() => handleDiagnosticAnswerSelect(activeDiagnosticQuestion, option.value)}
                            className="sr-only"
                          />
                          {option.label}
                        </label>
                      );
                    })}
                  </fieldset>

                  {hasActiveDiagnosticSelection && (
                    <p className="tag08-meta text-xs uppercase tracking-widest text-brand-secondary">
                      Seleção atual: {activeDiagnosticSelectedLabels}
                    </p>
                  )}
                </div>
              )}

              {isContactStep && (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black block">
                      Etapa final
                    </span>
                    <h3 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
                      Para quem enviamos este resumo?
                    </h3>
                    <p id="diagnostic-contact-hint" className="max-w-2xl text-sm leading-relaxed text-zinc-400">
                      Seus dados entram apenas para que a conversa continue com o contexto que você acabou de preencher.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className="tag08-meta text-xs text-zinc-400 tracking-wide block">Nome</span>
                      <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        required
                        aria-describedby="diagnostic-contact-hint"
                        value={diagnosticName}
                        onChange={(event) => setDiagnosticName(event.target.value)}
                        placeholder="Seu nome"
                        className="min-h-12 w-full rounded-2xl border border-white/[0.10] bg-white/[0.015] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-brand-secondary"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="tag08-meta text-xs text-zinc-400 tracking-wide block">WhatsApp</span>
                      <input
                        type="tel"
                        name="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        required
                        aria-describedby="diagnostic-contact-hint"
                        value={diagnosticWhatsapp}
                        onChange={(event) => setDiagnosticWhatsapp(event.target.value)}
                        placeholder="+55 83 9XXXX-XXXX"
                        className="min-h-12 w-full rounded-2xl border border-white/[0.10] bg-white/[0.015] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-brand-secondary"
                      />
                    </label>
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.015] p-4">
                    <input
                      type="checkbox"
                      checked={diagnosticConsent}
                      onChange={(event) => setDiagnosticConsent(event.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-black/40 accent-brand"
                    />
                    <span className="text-xs leading-relaxed text-zinc-400">
                      Autorizo a TAG08 a usar estas respostas para continuar o atendimento por WhatsApp e evitar que eu repita tudo depois.
                    </span>
                  </label>
                </div>
              )}

              {isDiagnosticComplete && (
                <div className="space-y-7">
                  <div className="space-y-3">
                    <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black block">
                      Diagnóstico concluído
                    </span>
                    <h3 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
                      Seu resumo está pronto para enviar.
                    </h3>
                    <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
                      A leitura abaixo permite que a TAG08 continue a conversa sem repetir perguntas nem perder o contexto.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {diagnosticSummaryCards.map((card) => (
                      <div key={card.label} className="space-y-1.5 rounded-2xl border border-white/[0.08] bg-white/[0.015] p-4">
                        <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest font-bold block">
                          {card.label}
                        </span>
                        <p className="text-sm font-semibold leading-snug text-white">{card.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 rounded-2xl border border-brand-secondary/20 bg-brand-secondary/[0.04] p-5">
                    <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black block">
                      Leitura inicial
                    </span>
                    <p className="text-sm font-semibold leading-snug text-white">{diagnosticRecommendation}</p>
                    <p className="text-xs leading-relaxed text-zinc-400">
                      A aderência entre Start, Base e Performance é confirmada na conversa de diagnóstico.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] bg-white/[0.015] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
              {isDiagnosticComplete ? (
                <button
                  type="button"
                  onClick={() => setDiagnosticStep(0)}
                  className="min-h-11 rounded-full border border-white/[0.10] px-5 tag08-meta text-xs font-black uppercase tracking-widest text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                >
                  Revisar respostas
                </button>
              ) : diagnosticStep > 0 ? (
                <button
                  type="button"
                  onClick={goToPreviousDiagnosticStep}
                  className="min-h-11 rounded-full border border-white/[0.10] px-5 tag08-meta text-xs font-black uppercase tracking-widest text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                >
                  Voltar
                </button>
              ) : (
                <span className="hidden sm:block" />
              )}

              {isDiagnosticComplete ? (
                <a
                  href={diagnosticReady ? diagnosticWhatsAppUrl : "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-disabled={!diagnosticReady}
                  onClick={(event) => {
                    if (!diagnosticReady) {
                      event.preventDefault();
                    } else {
                      trackSimulator("cta_clicked");
                    }
                  }}
                  className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 tag08-meta text-xs font-black uppercase tracking-widest text-black transition-all duration-300 hover:bg-brand-dark"
                >
                  <span>Compartilhar por WhatsApp</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5] transition-transform group-hover:translate-x-1" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={continueDiagnostic}
                  disabled={!canContinueDiagnostic}
                  className={`min-h-11 rounded-full px-5 tag08-meta text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                    canContinueDiagnostic
                      ? "bg-brand text-black hover:bg-brand-dark"
                      : "cursor-not-allowed bg-white/[0.06] text-zinc-600"
                  }`}
                >
                  {isContactStep ? "Ver resumo" : "Continuar"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* SHORTS & BASTIDORES PRODUCTION SHOWCASE */}
      <section className="px-4 sm:px-6 md:px-8 py-20 border-b border-white/[0.04] bg-charcoal-900/20 text-left relative overflow-hidden">
        {/* Background visual accents */}
        <div className="absolute top-1/4 right-[10%] w-[350px] h-[350px] bg-brand/[0.01] rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-secondary/15 border border-brand-secondary/20 text-brand-secondary font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
                VÍDEO DENTRO DA LINHA EDITORIAL
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white leading-none tracking-tighter">
                Conteúdo audiovisual também precisa cumprir uma função.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                Quando faz sentido para a estratégia, vídeo, bastidores, falas e recortes ampliam os formatos da marca sem romper a coerência da linha editorial.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {isYouTubeLoading ? (
              <div
                role="status"
                aria-live="polite"
                aria-busy="true"
                className="sm:col-span-2 lg:col-span-3 rounded-[28px] border border-white/[0.06] bg-white/[0.02] p-6 text-xs sm:text-sm leading-relaxed text-zinc-400"
              >
                Carregando vídeos oficiais…
              </div>
            ) : visibleVideos.length > 0 ? visibleVideos.map((video) => (
              <motion.a
                key={video.id}
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackVideoEvent({
                    action: "selected",
                    video_id: video.embedCode,
                    video_source: "youtube",
                    surface: "social-media-shorts",
                    page_path: "/servicos/gestao-de-redes-sociais"
                  })
                }
                whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                className="group block rounded-[28px] overflow-hidden border border-white/[0.06] bg-white/[0.02] transition-all duration-300 hover:border-brand-secondary/45 hover:shadow-[0_18px_50px_rgba(var(--color-brand-secondary-rgb),0.08)]"
              >
                <div className="relative aspect-[16/10] bg-zinc-900">
                  <ResilientImage
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    src={video.thumbnail}
                    alt={video.title}
                    fallbackLabel="Vídeo oficial TAG08"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/25" />

                  <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                    <span className="tag08-meta text-xs font-black uppercase tracking-[0.16em] text-brand-secondary">
                      CONTEÚDO RECENTE
                    </span>
                  </div>

                  <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                    <span className="tag08-meta text-xs font-black uppercase tracking-[0.16em] text-zinc-200">
                      YouTube oficial
                    </span>
                  </div>

                  <div className="absolute inset-x-4 bottom-4 space-y-2">
                    <span className="tag08-meta text-xs font-black uppercase tracking-[0.18em] text-brand-secondary/90">
                      {video.category}
                    </span>
                    <h3 className="font-display text-lg leading-tight font-black text-white">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs tag08-meta font-bold uppercase tracking-[0.18em] text-zinc-200">
                      <span>Assistir no YouTube</span>
                      <ArrowUpRight className="h-4 w-4 stroke-[2.5] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </div>
              </motion.a>
            )) : (
              <div className="sm:col-span-2 lg:col-span-3 rounded-[28px] border border-white/[0.06] bg-white/[0.02] p-6 text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Nenhum vídeo oficial está disponível neste momento. Quando houver conteúdo publicado no canal oficial, ele aparecerá aqui.
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 border border-white/[0.05] bg-white/[0.02] rounded-[24px] p-5 sm:p-6">
            <span className="tag08-meta text-xs font-black uppercase tracking-[0.18em] text-brand-secondary">
              Fonte oficial
            </span>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Quando disponíveis, os conteúdos são sincronizados do canal oficial da TAG08 e funcionam como referência real de linguagem, formato e produção.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION - FAQ */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[40px] bg-charcoal-950 border border-white/[0.04] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
                  Dúvidas sobre gestão de redes
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter">
                  Antes de contratar, <br />
                  entenda como a gestão funciona.
                </h2>
                <p className="text-zinc-300 font-medium text-xs sm:text-xs leading-relaxed font-sans max-w-sm">
                  A gestão de redes sociais da TAG08 organiza linha editorial, frequência, formatos, criação, revisão e acompanhamento para construir uma presença mais clara e consistente.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {faqItems.map((item) => {
                  const isActive = activeFaq === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveFaq(item.id)}
                      aria-pressed={isActive}
                      className={`w-full min-h-[66px] flex items-center justify-between gap-4 px-4 py-4 rounded-xl border transition-all duration-200 text-left group cursor-pointer hover:-translate-y-0.5 ${
                        isActive
                          ? "bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)]"
                          : "bg-white/[0.015] border-white/10 text-zinc-300 hover:text-white hover:border-white/20 hover:bg-white/[0.03]"
                      }`}
                    >
                      <span className="min-w-0 tag08-meta text-xs font-semibold uppercase tracking-wider flex items-center gap-3">
                        <span className={isActive ? "shrink-0 text-black" : "shrink-0 text-brand"}>
                          {String(item.id + 1).padStart(2, "0")}.
                        </span>
                        <span className="truncate">{item.question}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                          isActive
                            ? "border-black/15 bg-black/10 text-black"
                            : "border-white/10 bg-white/5 text-zinc-200 group-hover:text-white"
                        }`}
                      >
                        {isActive ? <Minus className="h-4 w-4 stroke-[2.5]" /> : <Plus className="h-4 w-4 stroke-[2.5]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-white/[0.04] bg-charcoal-950">
              <ResilientImage
                sizes="(max-width: 1024px) 100vw, 34vw"
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800"
                alt="Planejamento de gestão de redes sociais"
                fallbackLabel="Gestão de redes TAG08"
                className="object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div aria-hidden="true" className="absolute top-6 left-6 z-10 pointer-events-none tag08-meta text-xs text-white/20 uppercase tracking-widest leading-none">
                GESTÃO DE REDES
              </div>

              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left"
              >
                <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black block">
                  {activeFaqItem.eyebrow}
                </span>

                <h4 className="text-white font-semibold text-sm sm:text-base leading-tight border-b border-white/5 pb-2">
                  {activeFaqItem.question}
                </h4>

                <p className="text-zinc-300 text-xs sm:text-xs leading-relaxed font-sans font-medium">
                  {activeFaqItem.answer}
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              <div className="bg-charcoal-900 border border-white/5 rounded-2xl p-5 hover:border-brand/20 hover:-translate-y-0.5 transition-all duration-200 text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest block font-bold">Como agimos</span>
                  <h4 className="text-white font-semibold text-sm leading-snug">Linha editorial, frequência possível e revisão contínua.</h4>
                  <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                    Reduzimos improviso organizando temas, formatos, produção e revisão de acordo com o posicionamento e a capacidade real da operação.
                  </p>
                </div>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all duration-200 text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-black/60 uppercase tracking-widest block font-extrabold">Próximo passo</span>
                  <h4 className="text-black font-black text-sm leading-tight tracking-tight">O melhor caminho começa pelo entendimento do momento atual.</h4>
                  <p className="text-black/85 text-xs font-semibold leading-relaxed font-sans">
                    A conversa inicial organiza contexto, prioridades, responsabilidades e aderência antes da proposta.
                  </p>
                </div>
                <a
                  href={buildBrazilWhatsAppUrl("Ol%C3%A1,%20gostaria%20de%20entender%20a%20melhor%20forma%20de%20organizar%20a%20presen%C3%A7a%20da%20minha%20marca%20nas%20redes.")}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between text-xs font-sans font-black text-black select-none border-t border-black/10 pt-3 hover:translate-x-0.5 transition-all duration-200"
                >
                  <span>FALAR COM A TAG08</span>
                  <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - ACTION TRIGGER FOOTER */}
      <section className="px-4 sm:px-6 md:px-8 py-14 sm:py-16 text-center space-y-4 sm:space-y-5 max-w-4xl mx-auto">
        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-tight tracking-tighter">
          Presença consistente começa com uma rotina que a marca consegue sustentar.
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          A TAG08 organiza planejamento editorial, formatos, produção e acompanhamento de acordo com o momento da marca e com a estrutura necessária para sustentar a comunicação.
        </p>
        <div className="pt-2 sm:pt-3">
          <button
            onClick={() => handleLinkClick("/contato")}
            className="group bg-brand text-black font-sans font-black text-xs uppercase tracking-widest py-3.5 px-7 rounded-full shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.22)] hover:bg-brand-dark duration-300 transition-all cursor-pointer flex items-center gap-2 mx-auto"
          >
            <span>ENTENDER SE A GESTÃO FAZ SENTIDO</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </section>

    </div>
  );
}

















