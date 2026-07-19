import { useRef, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { MessageSquare, Sparkles, TrendingUp, ArrowUpRight, ArrowRight, Users, Plus, Minus } from "lucide-react";
import { buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl } from "../../../config/siteNetwork";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import MiniCases from "../../../components/MiniCases";
import TrustTestimonialsSection from "../../../components/TrustTestimonialsSection";
import { trackVideoEvent } from "../../../lib/analytics";
import { useSimulatorTracking } from "../../../lib/useSimulatorTracking";
import { useOfficialYouTubeVideos } from "../../../lib/useOfficialYouTubeVideos";

/*
interface PlayableShort {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  duration: string;
  videoUrl: string;
  thumbnail: string;
  behindTheScenes: string;
  strategy: string;
  successMetric: string;
  metrics: {
    reach: string;
    saves: string;
    directs: string;
  };
  deliverables: string[];
}

const shortsData: PlayableShort[] = [
  {
    id: "short-01",
    title: "Bastidores de identidade",
    subtitle: "Processo visual e direção",
    category: "Branding & Design",
    duration: "42s",
    videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227e333ef33d97d477e6e5d8a011de&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=600",
    behindTheScenes: "Registro do processo de criacao, escolhas visuais e alinhamento com o posicionamento da marca.",
    strategy: "Mostra como os bastidores ajudam a explicar a logica da identidade sem depender de promessas comerciais artificiais.",
    successMetric: "Apoia reconhecimento e aproxima o publico da proposta da marca.",
    metrics: {
      reach: "Clareza",
      saves: "Coerencia",
      directs: "Aproximacao"
    },
    deliverables: [
      "Roteiro de bastidores",
      "Captacao do processo",
      "Edicao curta",
      "Apoio a linha editorial"
    ]
  },
  {
    id: "short-02",
    title: "Falas e autoridade",
    subtitle: "Conteudo com contexto",
    category: "Autoridade",
    duration: "58s",
    videoUrl: "https://player.vimeo.com/external/435674703.sd.mp4?s=7f60714b9b94091ecf3306ee1b14c1e4004cbe90&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600",
    behindTheScenes: "Recortes de fala, rotina ou explicacao que tornam a marca mais compreensivel para o publico.",
    strategy: "Valoriza a fala com ritmo e cortes que ajudam a leitura da ideia principal.",
    successMetric: "Recorte util para redes, site e pecas de apoio.",
    metrics: {
      reach: "Contexto",
      saves: "Ritmo",
      directs: "Aproximacao"
    },
    deliverables: [
      "Captacao de falas",
      "Recorte de entrevistas",
      "Edicao objetiva",
      "Versoes curtas para redes"
    ]
  },
  {
    id: "short-03",
    title: "Conteudo curto para redes",
    subtitle: "Formato rapido com linha editorial",
    category: "Recortes Sociais",
    duration: "35s",
    videoUrl: "https://player.vimeo.com/external/403841133.sd.mp4?s=d010d9c4fecd6a56f082e6ea9a75677ff0a65383&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600",
    behindTheScenes: "Pecas curtas pensadas para circular nas redes com funcao clara dentro da pauta.",
    strategy: "Ajuda a presenca a ficar recorrente sem depender de um unico formato ou de expectativas artificiais.",
    successMetric: "Formato que reforca presenca e facilita reaproveitamento.",
    metrics: {
      reach: "Linha",
      saves: "Frequencia",
      directs: "Distribuicao"
    },
    deliverables: [
      "Roteiro curto",
      "Edicao agil",
      "Legendagem objetiva",
      "Recortes para feed e stories"
    ]
  },
  {
    id: "short-04",
    title: "Reaproveitamento editorial",
    subtitle: "Transformacao de materiais",
    category: "Reaproveitamento",
    duration: "50s",
    videoUrl: "https://player.vimeo.com/external/517602126.sd.mp4?s=eef87fc4dc8d3df623f9bca7ddaff8e16fd4eb17&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600",
    behindTheScenes: "Transforma gravacoes, eventos e conteudos longos em recortes menores e mais distribuiiveis.",
    strategy: "Aproveita o que ja foi captado para ampliar a vida util do material na linha editorial.",
    successMetric: "Mais consistencia a partir de materiais ja existentes.",
    metrics: {
      reach: "Uso",
      saves: "Atencao",
      directs: "Continuidade"
    },
    deliverables: [
      "Selecao de trechos",
      "Montagem de recortes",
      "Ajuste de ritmo",
      "Versoes por canal"
    ]
  }
];
*/

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
    title: "Qual prioridade editorial faz mais sentido agora?",
    helper: "Escolha a função principal da presença nas redes neste momento.",
    options: [
      { value: "authority", label: "Autoridade" },
      { value: "recurrence", label: "Presença recorrente" },
      { value: "behind-scenes", label: "Bastidores" },
      { value: "commercial-support", label: "Apoio comercial" }
    ]
  },
  {
    key: "formats",
    step: "Etapa 05",
    title: "Que formatos fazem mais sentido?",
    helper: "Marque os formatos que o material precisa sustentar.",
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
    helper: "Isso ajuda a TAG08 a entender urgência e profundidade do apoio.",
    options: [
      { value: "foundation", label: "Precisa organizar a base" },
      { value: "review", label: "Quer revisar a direção" },
      { value: "accelerate", label: "Quer acelerar com critério" },
      { value: "start", label: "Quer iniciar agora" }
    ]
  }
];

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
    return "Começar por direção editorial, linha de conteúdo e rotina possível antes de pensar em volume.";
  }

  if (challenge === "clarity" || moment === "review") {
    return "Revisar narrativa, prioridade editorial e formatos que expliquem melhor a oferta.";
  }

  if (challenge === "consistency" || routine === "improvised") {
    return "Organizar frequência, revisão e formatos para reduzir improviso e sustentar presença.";
  }

  if (moment === "accelerate") {
    return "A conversa pode avançar para escopo, formato e cadência com foco em consistência.";
  }

  return "A TAG08 pode ajudar a transformar o diagnóstico em linha editorial, formato e próxima ação prática.";
};

interface SocialMediaProps {
  onNavigate: (page: string) => void;
}

export default function GestaoRedesSociais({ onNavigate }: SocialMediaProps) {
  const [activeFaq, setActiveFaq] = useState(0);
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
  const diagnosticQuestionRefs = useRef<Record<DiagnosticKey, HTMLDivElement | null>>({
    challenge: null,
    routine: null,
    channels: null,
    priority: null,
    formats: null,
    moment: null
  });

  const answeredCount = EDITORIAL_DIAGNOSTIC_QUESTIONS.reduce((count, question) => {
    const value = diagnosticAnswers[question.key];
    if (Array.isArray(value)) {
      return count + (value.length > 0 ? 1 : 0);
    }
    return count + (value ? 1 : 0);
  }, 0);

  const diagnosticProgress = Math.round((answeredCount / EDITORIAL_DIAGNOSTIC_QUESTIONS.length) * 100);
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
  const diagnosticRecommendation = buildDiagnosticRecommendation({
    challenge: diagnosticAnswers.challenge as string,
    routine: diagnosticAnswers.routine as string,
    moment: diagnosticAnswers.moment as string
  });
  const { videos: visibleVideos } = useOfficialYouTubeVideos(3);
  const diagnosticSummaryCards = [
    { label: "Principal desafio", value: challengeLabel },
    { label: "Rotina atual", value: routineLabel },
    { label: "Canais usados", value: channelsLabel },
    { label: "Prioridade editorial", value: priorityLabel },
    { label: "Formato recomendado", value: formatsLabel },
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
Nome: ${diagnosticName.trim()}
WhatsApp: ${diagnosticWhatsapp.trim()}
Consentimento: ${diagnosticConsent ? "Autorizado" : "Não autorizado"}

Próximo passo: conversar com a TAG08 para entender escopo e direção editorial.`;
  const diagnosticWhatsAppUrl = buildBrazilWhatsAppUrl(diagnosticMessage);

  const scrollToDiagnosticQuestion = (key: DiagnosticKey) => {
    const target = diagnosticQuestionRefs.current[key];
    if (!target) return;

    window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
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

    const nextQuestionIndex = EDITORIAL_DIAGNOSTIC_QUESTIONS.findIndex((item) => item.key === question.key) + 1;
    const nextQuestion = EDITORIAL_DIAGNOSTIC_QUESTIONS[nextQuestionIndex];
    if (nextQuestion) {
      scrollToDiagnosticQuestion(nextQuestion.key);
    }
  };

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const faqItems = [
    {
      id: 0,
      eyebrow: "Planejamento editorial",
      question: "A gestão de redes sociais é só fazer posts?",
      answer:
        "Não. A gestão envolve linha editorial, calendário, linguagem, criação, direção visual, revisão e acompanhamento. O objetivo é dar função ao conteúdo dentro da estratégia da marca."
    },
    {
      id: 1,
      eyebrow: "Frequência possível",
      question: "Preciso postar todos os dias?",
      answer:
        "Não necessariamente. A frequência precisa ser possível de sustentar e coerente com o momento da marca. Uma rotina realista costuma ser melhor do que volume sem critério."
    },
    {
      id: 2,
      eyebrow: "Criação de conteúdo",
      question: "A TAG08 cria os conteúdos?",
      answer:
        "Sim, dentro do escopo contratado. Podemos apoiar temas, legendas, peças, roteiros, formatos e organização editorial conforme a necessidade da marca."
    },
    {
      id: 3,
      eyebrow: "Vídeos e bastidores",
      question: "A gestão inclui vídeos e bastidores?",
      answer:
        "Pode incluir ou se conectar com produção audiovisual quando isso fizer sentido para a estratégia. Vídeos curtos, bastidores e recortes devem servir à linha editorial, não apenas ocupar espaço."
    },
    {
      id: 4,
      eyebrow: "Expectativas e resultado",
      question: "A TAG08 promete alcance ou engajamento?",
      answer:
        "Não prometemos alcance, engajamento ou crescimento instantâneo. Trabalhamos para construir clareza, consistência, presença e melhoria contínua com responsabilidade."
    }
  ];
  const activeFaqItem = faqItems[activeFaq] ?? faqItems[0];

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-[8%] left-[-15%] w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] bg-brand/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle floating 3D element in the background of user focus */}
      <Subtle3DCanvas intensity={1.3} className="absolute right-[-8%] top-[5%] w-[480px] h-[480px] opacity-[0.35] mix-blend-screen hidden lg:block" />

      {/* SECTION 1 - HERO: THE EDITORIAL SYSTEM (Synchronized Style) */}
      <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono self-start">
                GESTÃO DE REDES SOCIAIS // TAG08
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter uppercase font-display">
                Redes sociais <br />
                <span className="text-brand">com direção, linha editorial e consistência.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-sans font-medium">
                A TAG08 organiza a presença da marca nas redes sociais com estratégia, narrativa, calendário, formatos e acompanhamento para que o conteúdo deixe de ser postagem solta e passe a cumprir uma função clara.
              </p>
            </div>
          </div>

          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <Image
                fill
                sizes="100vw"
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600"
                alt="Presença com direção TAG08"
                className="object-cover grayscale brightness-50 group-hover:scale-[1.01] transition-all duration-1000 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{ transform: "translateZ(45px)" }}>
                <button
                  onClick={() => handleLinkClick("/servicos/producao-audiovisual")}
                  className="group bg-brand-secondary text-black font-mono font-black text-[10px] sm:text-[11px] uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] hover:scale-105 duration-300 transition-all border border-brand-secondary hover:bg-brand-dark flex items-center gap-2 cursor-pointer z-20"
                >
                  <span>CONHECER PRODUCAO AUDIOVISUAL</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="font-mono text-[8.5px] text-brand-secondary tracking-widest block uppercase font-bold">FORMATOS EM USO // TAG08</span>
                  <h4 className="font-display font-black text-white text-xs sm:text-sm uppercase tracking-tight leading-none">Recortes com direção e revisão</h4>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-[8px] text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>CONTEUDO EM ANDAMENTO</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Linha editorial</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Temas, formatos e prioridades<br/>organizados com intenção</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">Frequência possível</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Cadência pensada para a<br/>realidade da operação</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Narrativa de marca</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Mensagem coerente entre feed,<br/>legenda e conversa</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">Acompanhamento</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Revisão contínua para ajustar<br/>a direção quando preciso</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - SEGMENTATION / QUANDO INVESTIR IN SOCIAL MEDIA */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04] bg-charcoal-900/10 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-4 space-y-4">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Sinais de desalinhamento</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-none tracking-tight">
              Quando as redes sociais <span className="text-brand">deixam de construir presença.</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Muitas marcas publicam com frequência, mas ainda não conseguem transmitir clareza, consistência ou percepção de valor. O problema nem sempre é falta de conteúdo; muitas vezes é falta de linha editorial, posicionamento e critério de produção.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">Postagens sem direção</span>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                Os conteúdos saem, mas não parecem construir uma narrativa clara sobre a marca, seus diferenciais ou sua forma de gerar valor.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">Calendário sem prioridade</span>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                A rotina existe, mas os temas sóo definidos por urgência, tendência ou improviso, sem conexão com uma estratégia maior.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">Visual sem consistência</span>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                Cada peça parece seguir uma lógica diferente, enfraquecendo reconhecimento, confiança e percepção profissional.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">Pouca conexão com o comercial</span>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                O conteúdo até movimenta a página, mas não ajuda o público a entender melhor a oferta, o processo ou o próximo passo.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all sm:col-span-2">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">Produção difícil de sustentar</span>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                A marca depende de esforço pontual, ideias soltas e aprovações demoradas, tornando a presença instável.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* SECTION 3 - DELIVERABLES (The "What" with Clean Features Grid) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-bold">O que organizamos</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Gestão de redes não é só calendário. É direção editorial.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              A TAG08 estrutura temas, formatos, frequência, linguagem, design e revisão para que a presença da marca nas redes tenha consistência e função dentro da estratégia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Linha editorial</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Definição de temas, mensagens, pilares de conteúdo e prioridades para orientar a comunicação da marca.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Calendário possível</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Organização de uma rotina de publicação compatével com o momento, a equipe, os canais e a capacidade de aprovação.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Criação de conteúdo</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Desenvolvimento de legendas, peças, roteiros e formatos alinhados ao posicionamento e ao objetivo de cada publicação.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Users className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Direção visual</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Aplicação de identidade, estética, hierarquia e consistência visual para fortalecer reconhecimento e percepção profissional.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Acompanhamento e revisão</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Leitura do que precisa evoluir, ajustes de rota, organização de feedbacks e melhoria contínua do processo editorial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* SECTION 4 - PLANOS DISPONaVEIS & COPES (Immediate Action Offerings) */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-900/10 text-left">
        <div className="max-w-7xl mx-auto space-y-28">
          
          {/* SECTION 4 - PLANOS DISPONIVEIS */}
          <div className="space-y-3 max-w-3xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              Níveis de escopo
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-white leading-tight uppercase">
              Escolha o escopo pelo momento da sua presença digital.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl">
              A gestão de redes pode começar de forma mais enxuta ou evoluir para uma rotina editorial mais completa. O escopo ideal depende da maturidade da marca, da frequência possível e da estrutura disponível para aprovar e sustentar conteúdo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {[
              {
                name: "Presença organizada",
                subtitle: "Para marcas que precisam sair da postagem solta.",
                desc: "Organização inicial de temas, calendário, linguagem e peças para criar uma rotina mais clara e consistente nas redes.",
                badge: "01"
              },
              {
                name: "Linha editorial recorrente",
                subtitle: "Para marcas que precisam manter frequência com intenção.",
                desc: "Planejamento, criação e acompanhamento de conteúdos com narrativa, formatos definidos e alinhamento ao posicionamento da marca.",
                badge: "02"
              },
              {
                name: "Conteúdo com acompanhamento",
                subtitle: "Para marcas que precisam evoluir a presença com mais critério.",
                desc: "Gestão editorial com revisão, ajustes de rota, leitura de aprendizados e integração com outras frentes de comunicação.",
                badge: "03"
              }
            ].map((plan) => (
              <motion.div
                key={plan.badge}
                whileHover={{ y: -6 }}
                className="border rounded-3xl p-7 flex flex-col justify-between gap-8 transition-all duration-300 relative overflow-hidden bg-charcoal-900 border-white/[0.04]"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[9px] text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2 py-0.5 rounded font-black max-w-max">
                      {plan.badge}
                    </span>
                    <span className="font-sans text-[9px] text-zinc-500 font-bold">ESCOPO</span>
                  </div>

                  <h3 className="text-white font-display font-medium text-xl uppercase tracking-tight leading-none pt-2">{plan.name}</h3>
                  <p className="text-brand-secondary text-[10px] font-black uppercase tracking-[0.22em]">{plan.subtitle}</p>
                  <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">{plan.desc}</p>
                </div>

                <div className="pt-6 border-t border-white/[0.04] mt-8">
                  <button
                    type="button"
                    onClick={() => handleLinkClick("/contato")}
                    className="group inline-flex items-center justify-center gap-2 rounded-full border border-brand-secondary/20 bg-brand-secondary/10 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-brand-secondary transition-all duration-300 hover:bg-brand-secondary hover:text-black"
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
              <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                ALINHAMENTO DE EXPECTATIVAS // TRANSPARÊNCIA
              </span>
              <h3 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
                O que garantimos (e o que foca em outras areas)
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                Nossa filosofia repudia falsas promessas de escopo infinito sem direção tática. Esclarecer com integridade os limites da nossa produção corporativa é nossa garantia de sinergia:
              </p>

              <div className="p-5 rounded-2xl bg-brand-secondary/[0.01] border border-white/[0.03] text-xs text-zinc-400 font-sans leading-relaxed">
                Nossa equipe foca estritamente no planejamento, design e rotinas intelectuais. Para gravação física, fornecemos roteiros clínicos que você ou seu time gravam de forma descomplicada.
              </div>
            </div>

            {/* Inclusions and Exclusions ledger boxes */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Incluso */}
              <div className="bg-charcoal-900 border border-white/[0.05] p-7 rounded-3xl space-y-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand/30" />
                <span className="font-mono text-[9px] text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded font-black uppercase inline-block">
                  INCLUSO NO ESCOPO MENSAL
                </span>
                
                <div className="space-y-3.5">
                  {[
                    "Planejamento de linha editorial sob medida",
                    "Roteiros escritos com gancho e call-to-action",
                    "Design exclusivo sob Figma para carrossóis",
                    "Legendas magnéticas para educar o público",
                    "Agendamento e automação das postagens"
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
                <span className="font-mono text-[9px] text-zinc-500 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded font-black uppercase inline-block">
                  NÃO INCLUÍDO NESTA DIVISÃO
                </span>
                
                <div className="space-y-3.5">
                  {[
                    "Gravações de câmera (deslocamento físico)",
                    "Orçamento de trafego pago ativo",
                    "Interações de Direct, comentarios e SAC",
                    "Apoio de coprodução física presencial",
                    "Criação integral de nova marca/rebranding"
                  ].map((exc, index) => (
                    <div key={index} className="flex gap-3 text-xs text-zinc-400 font-sans items-start font-medium leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                      <span>{exc}</span>
                    </div>
                  ))}
                </div>
                
                <p className="text-[10px] text-zinc-500 font-mono leading-normal pt-2 border-t border-white/[0.03] uppercase">
                  * Disponaveis em outras frentes integradas do ecossistema.
                </p>
              </div>
            </div>
          </div>

          {/* Ciclo Mensal de Operação - CHRONOLOGICAL TIMELINE */}
          <div className="space-y-10 pt-12 border-t border-white/[0.04]">
            <div className="space-y-3">
              <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                METODOLOGIA DE FLUXO
              </span>
              <h3 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
                Nosso Ciclo Mensal Sistemático
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl">
                Seguimos um ritmo de planejamento consistente para manter sua grade de canais digitais organizada, clara e sem depender de urgência de última hora:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Linha editorial", desc: "Definimos temas, mensagens e prioridades para orientar a produção ao longo do mês." },
                { title: "Formatos e roteiros", desc: "Estruturamos falas, carrossóis e recortes para manter consistência entre conteúdo e posicionamento." },
                { title: "Ajustes de identidade", desc: "Aplicamos identidade, hierarquia visual e consistência para que os conteúdos comuniquem a mesma marca." },
                { title: "Acompanhamento contínuo", desc: "Revisamos a rotina e os aprendizados para ajustar temas, formatos e frequência quando necessório." }
              ].map((step, sIdx) => (
                <div key={sIdx} className="bg-charcoal-900 border border-white/[0.04] p-6 rounded-2xl text-left space-y-4 hover:border-brand/10 transition-all duration-300">
                  <div className="font-sans text-[10px] font-black text-brand-secondary bg-brand-secondary/5 w-8 h-8 rounded-lg flex items-center justify-center border border-brand-secondary/10 shadow-[0_4px_10px_rgba(var(--color-brand-secondary-rgb),0.05)]">
                    0{sIdx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white font-display font-bold text-xs sm:text-sm uppercase tracking-tight">{step.title}</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Relatórios e Aprendizados - ACTIVE DASHBOARD PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-12 border-t border-white/[0.04]">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                CULTURE OF METRICS MENSAL
              </span>
              <h3 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
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
                { title: "Aproximação do público", desc: "Acompanhamos se os recortes e as falas facilitam compreensão, confiança e próximo passo." },
                { title: "Ajuste contínuo", desc: "Usamos os aprendizados do ciclo para refinar temas, frequência e linguagem editorial." }
              ].map((item, iIdx) => (
                <div key={iIdx} className="p-5 rounded-2xl bg-charcoal-900/60 border border-white/[0.03] space-y-1.5 text-left hover:border-brand/10 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-brand-secondary" />
                  <h4 className="text-white text-xs sm:text-sm font-display font-bold uppercase tracking-tight">{item.title}</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5 - TRUST CORE BAR */}
      <section className="px-4 sm:px-6 md:px-8 py-10 border-b border-white/[0.04] bg-charcoal-900/40 text-left">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-2 max-w-3xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              Critérios de confiança
            </span>
            <h4 className="text-white font-display font-black text-sm uppercase tracking-tight">
              O que sustenta uma presença mais consistente.
            </h4>
            <p className="text-zinc-400 text-xs font-sans font-medium leading-relaxed max-w-2xl">
              A gestão de redes funciona melhor quando existe direção editorial, rotina possível, revisão constante e conexão com o posicionamento da marca.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3 space-y-1">
              <span className="block text-[9px] font-black uppercase tracking-widest text-brand-secondary">Linha editorial</span>
              <p className="text-[11px] leading-relaxed text-zinc-300">Temas, mensagens e formatos organizados antes da produção.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3 space-y-1">
              <span className="block text-[9px] font-black uppercase tracking-widest text-brand-secondary">Rotina possível</span>
              <p className="text-[11px] leading-relaxed text-zinc-300">Frequência compatével com a estrutura real da marca.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3 space-y-1">
              <span className="block text-[9px] font-black uppercase tracking-widest text-brand-secondary">Consistência visual</span>
              <p className="text-[11px] leading-relaxed text-zinc-300">Peças alinhadas à identidade, estética e percepção desejada.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3 space-y-1">
              <span className="block text-[9px] font-black uppercase tracking-widest text-brand-secondary">Acompanhamento</span>
              <p className="text-[11px] leading-relaxed text-zinc-300">Revisão, aprendizados e ajustes para manter a presença em evolução.</p>
            </div>
          </div>
        </div>
      </section>

      <ServiceInsightsBridge
        servicePath="/servicos/gestao-de-redes-sociais"
        onNavigate={onNavigate}
      />

      {/* CASE STUDIES / CLIENTS LOGO SOCIAL PROOF */}
      <MiniCases 
        onNavigate={onNavigate} 
        title="Projetos que mostram conteúdo com direção."
        subtitle="A gestão de redes funciona melhor quando a marca combina linha editorial, consistência visual, frequência possível e revisão contínua. Os projetos devem mostrar esse processo, não prometer resultado instantâneo."
        badge="MÉTODO EM PRÁTICA"
      />

      {/* INTERACTIVE INNOVATION: SIMULADOR DE DIAGNÓSTICO EDITORIAL */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-950 text-left relative overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-brand/[0.01] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              Diagnóstico editorial
            </span>
            <h2 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
              O que está travando sua presença nas redes?
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
              Nem sempre o problema é postar pouco. Muitas vezes a presença digital trava por falta de linha editorial, frequência possível, clareza de mensagem, consistência visual ou processo de aprovação.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-5 bg-charcoal-900/60 border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.05] pb-3">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold block">
                    Pré-qualificação editorial
                  </span>
                  <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
                    {answeredCount}/{EDITORIAL_DIAGNOSTIC_QUESTIONS.length} respostas
                  </span>
                </div>

                <div className="space-y-4">
                  {EDITORIAL_DIAGNOSTIC_QUESTIONS.map((question) => {
                    const currentValue = diagnosticAnswers[question.key];
                    const selectedLabels = getDiagnosticValueLabel(question.key, currentValue);
                    const hasSelection = selectedLabels !== "Aguardando resposta";
                    const selectedValues = Array.isArray(currentValue)
                      ? currentValue
                      : currentValue
                        ? [currentValue]
                        : [];

                    return (
                      <div
                        key={question.key}
                        ref={(node) => {
                          diagnosticQuestionRefs.current[question.key] = node;
                        }}
                        className="space-y-3 rounded-2xl border border-white/[0.05] bg-white/[0.01] p-4 sm:p-5 scroll-mt-24"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1.5">
                            <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-black block">
                              {question.step}
                            </span>
                            <p className="text-xs font-mono text-zinc-200 font-bold uppercase tracking-wider block">
                              {question.title}
                            </p>
                            <p className="text-[11px] text-zinc-400 leading-relaxed">
                              {question.helper}
                            </p>
                          </div>
                          {hasSelection && (
                            <span className="inline-flex shrink-0 items-center rounded-full border border-brand/20 bg-brand/5 px-2.5 py-1 font-mono text-[8px] uppercase tracking-widest text-brand">
                              OK
                            </span>
                          )}
                        </div>

                        <div className={`grid gap-2 ${question.multi ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}>
                          {question.options.map((option) => {
                            const isActive = selectedValues.includes(option.value);
                            return (
                              <button
                                key={option.value}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => handleDiagnosticAnswerSelect(question, option.value)}
                                className={`rounded-xl border px-3 py-3 text-left transition-all duration-200 cursor-pointer text-xs sm:text-[13px] leading-snug hover:-translate-y-0.5 ${
                                  isActive
                                    ? "bg-brand-secondary/10 border-brand-secondary text-brand-secondary"
                                    : "bg-white/[0.01] border-white/10 text-zinc-300 hover:text-white hover:border-white/20"
                                }`}
                              >
                                {option.label}
                              </button>
                            );
                          })}
                        </div>

                        {hasSelection && (
                          <p className="text-[10px] text-brand-secondary font-mono uppercase tracking-widest leading-relaxed">
                            Seleção atual: {selectedLabels}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="space-y-2 rounded-2xl border border-white/[0.05] bg-white/[0.01] p-4 text-left">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold block">
                      Nome
                    </span>
                    <input
                      type="text"
                      value={diagnosticName}
                      onChange={(event) => setDiagnosticName(event.target.value)}
                      placeholder="Seu nome"
                      className="w-full rounded-xl border border-white/[0.06] bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand/40"
                    />
                  </label>

                  <label className="space-y-2 rounded-2xl border border-white/[0.05] bg-white/[0.01] p-4 text-left">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold block">
                      WhatsApp
                    </span>
                    <input
                      type="tel"
                      value={diagnosticWhatsapp}
                      onChange={(event) => setDiagnosticWhatsapp(event.target.value)}
                      placeholder="+55 83 9XXXX-XXXX"
                      className="w-full rounded-xl border border-white/[0.06] bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand/40"
                    />
                  </label>
                </div>

                <label className="flex items-start gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.01] p-4 text-left cursor-pointer">
                  <input
                    type="checkbox"
                    checked={diagnosticConsent}
                    onChange={(event) => setDiagnosticConsent(event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-black/40 accent-brand"
                  />
                  <span className="space-y-1">
                    <span className="block font-mono text-[9px] text-zinc-300 font-bold uppercase tracking-widest">
                      Consentimento LGPD
                    </span>
                    <span className="block text-[11px] text-zinc-400 leading-relaxed">
                      Autorizo a TAG08 a usar essas respostas para continuar o atendimento por WhatsApp e evitar que eu repita tudo depois.
                    </span>
                  </span>
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-2">
                <div className="flex items-center gap-2 text-brand">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider">
                    Resumo útil para atendimento
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  As respostas viram uma leitura organizada que a equipe pode abrir já com contexto. O objetivo é reduzir repetição e acelerar a conversa certa.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#09090b] border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-6 w-full">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2 max-w-2xl">
                    <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                      Seu diagnóstico editorial
                    </span>
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                      Resumo pronto para enviar
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                      A leitura abaixo ajuda a TAG08 a continuar a conversa sem repetir perguntas e sem perder a lógica do seu contexto.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3 min-w-[120px]">
                    <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-bold block">
                      Progresso
                    </span>
                    <p className="text-2xl font-display font-black text-white leading-none mt-1">
                      {diagnosticProgress}%
                    </p>
                  </div>
                </div>

                <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className="h-full bg-brand-secondary transition-all duration-300"
                    style={{ width: `${diagnosticProgress}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {diagnosticSummaryCards.map((card) => (
                    <div key={card.label} className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4 space-y-1.5">
                      <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-bold block">
                        {card.label}
                      </span>
                      <p className="text-sm sm:text-[15px] text-white font-semibold leading-snug">
                        {card.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/[0.05] bg-white/[0.01] p-4 space-y-1.5">
                    <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-bold block">
                      Contato recebido
                    </span>
                    <p className="text-sm text-white font-semibold leading-snug">
                      {diagnosticName.trim() || "Aguardando nome"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.05] bg-white/[0.01] p-4 space-y-1.5">
                    <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-bold block">
                      WhatsApp informado
                    </span>
                    <p className="text-sm text-white font-semibold leading-snug">
                      {diagnosticWhatsapp.trim() || "Aguardando WhatsApp"}
                    </p>
                  </div>
                </div>

                <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold block">
                      Leitura da TAG08
                    </span>
                    <span className={`font-mono text-[8px] uppercase tracking-widest font-black px-2.5 py-1 rounded-md border ${
                      diagnosticConsent
                        ? "text-brand-secondary border-brand-secondary/20 bg-brand-secondary/5"
                        : "text-zinc-500 border-white/[0.05] bg-white/[0.01]"
                    }`}>
                      {diagnosticConsent ? "Consentimento ativo" : "Consentimento pendente"}
                    </span>
                  </div>
                  <p className="text-white text-sm sm:text-base font-semibold leading-snug">
                    {diagnosticRecommendation}
                  </p>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    O diagnóstico ajuda a organizar prioridade, formato e próximo passo. Quando isso chega pronto para a equipe, a conversa comercial fica mais objetiva.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-t border-white/[0.05] pt-4 mt-6">
                <div className="space-y-1.5 max-w-md">
                  <span className="font-mono text-[8px] text-zinc-600 uppercase tracking-widest font-bold block">
                    Antes de compartilhar
                  </span>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    {diagnosticReady
                      ? "O resumo já está pronto para ser enviado com contexto."
                      : "Complete respostas, nome, WhatsApp e consentimento para liberar o envio."}
                  </p>
                </div>

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
                  className={`group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-mono text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    diagnosticReady
                      ? "bg-brand text-black hover:bg-brand-dark shadow-[0_12px_35px_rgba(var(--color-brand-secondary-rgb),0.2)]"
                      : "cursor-not-allowed bg-white/[0.05] text-zinc-500 border border-white/[0.06]"
                  }`}
                >
                  <span>ENVIAR DIAGNÓSTICO POR WHATSAPP</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform group-hover:translate-x-1" />
                </a>
              </div>
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-secondary/15 border border-brand-secondary/20 text-brand-secondary font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono">
                FORMATOS AUDIOVISUAIS // TAG08
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white leading-none tracking-tighter uppercase">
                Conteúdos recentes do canal com função editorial.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                Quando fazem sentido para a estratégia, vídeos curtos, bastidores, falas e recortes ajudam a tornar a presença da marca mais humana, clara e recorrente nas redes sociais.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleVideos.map((video) => (
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
                whileHover={{ y: -4 }}
                className="group block rounded-[28px] overflow-hidden border border-white/[0.06] bg-white/[0.02] transition-all duration-300 hover:border-brand-secondary/45 hover:shadow-[0_18px_50px_rgba(var(--color-brand-secondary-rgb),0.08)]"
              >
                <div className="relative aspect-[16/10] bg-zinc-900">
                  <Image
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    src={video.thumbnail}
                    alt={video.title}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/25" />

                  <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                    <span className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-brand-secondary">
                      CONTEÚDO RECENTE
                    </span>
                  </div>

                  <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                    <span className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-zinc-200">
                      YouTube oficial
                    </span>
                  </div>

                  <div className="absolute inset-x-4 bottom-4 space-y-2">
                    <span className="font-mono text-[9px] font-black uppercase tracking-[0.28em] text-brand-secondary/90">
                      {video.category}
                    </span>
                    <h3 className="font-display text-lg leading-tight font-black text-white uppercase">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-200">
                      <span>Assistir no YouTube</span>
                      <ArrowUpRight className="h-4 w-4 stroke-[2.5] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          <div className="flex flex-col gap-2 border border-white/[0.05] bg-white/[0.02] rounded-[24px] p-5 sm:p-6">
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.28em] text-brand-secondary">
              Fonte oficial
            </span>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Os conteúdos acima são sincronizados do canal oficial da TAG08 e funcionam como apoio editorial para mostrar bastidores, contexto e presença real sem criar vídeo fictício dentro da página.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 6 - WORK SYSTEM (WhatsApp official contact block) */}
      <section className="py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          {/* Left Column: Portrait */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[520px]">
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden" />
            <Image
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
              alt="TAG08 Social Media Specialist" 
              className="object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[15%] transition-all duration-500 hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  SISTEMA DE TRABALHO
                </span>
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  TAG08
                </span>
              </div>
              <div className="space-y-1.5 opacity-30 select-none">
                <div className="font-display font-extrabold text-[1.8rem] text-white/40 tracking-widest leading-none uppercase select-none">
                  redes_sociais
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                  linha_editorial
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  fluxo editorial
                </span>
                <span className="font-mono text-[9px] text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  acompanhamento
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 text-left h-full relative z-10 lg:pl-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-black font-semibold">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/90">
                  SISTEMA DE TRABALHO
                </span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black leading-[0.9] tracking-tighter uppercase font-display">
                COMO CONDUZIMOS A <br />
                    GESTÃO DE REDES SOCIAIS.
              </h2>
              <p className="text-black/85 text-[11px] sm:text-xs max-w-lg leading-relaxed font-sans font-extrabold uppercase">
                A TAG08 organiza a presenca nas redes com planejamento editorial, producao alinhada, revisao, publicacao e acompanhamento. O objetivo e reduzir improviso e manter a comunicacao coerente com o posicionamento da marca.
              </p>
            </div>

            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 max-w-md relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-4 items-start select-none">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black shrink-0 shadow-lg shadow-brand/10 hover:scale-105 transition-transform duration-200">
                  <ArrowUpRight className="w-5 h-5 rotate-45 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-[8px] text-brand uppercase tracking-wider font-extrabold block">
                    PLANEJAMENTO EDITORIAL
                  </span>
                  <p className="text-white text-xs leading-snug font-sans font-semibold">
                    Definimos temas, mensagens e prioridades antes da producao para orientar a linha editorial.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <a 
                  href={buildBrazilWhatsAppUrl("Ola,%20gostaria%20de%20falar%20com%20a%20TAG08%20sobre%20gestao%20de%20redes%20sociais.")}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-black transition-all duration-200">
                        <span className="text-[9px] font-mono font-black tracking-tight text-brand group-hover:text-black">BR</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase font-black tracking-wider leading-none">
                          WHATSAPP OFICIAL
                        </span>
                        <span className="text-white text-xs font-mono font-bold tracking-wider group-hover:text-brand transition-colors mt-0.5">
                          +55 83 9.9886-8882
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-brand font-mono font-bold uppercase tracking-wider bg-brand/10 py-1 px-2.5 rounded-lg group-hover:bg-brand group-hover:text-black transition-all">
                      FALAR COM A TAG08
                    </span>
                  </div>
                </a>

                <a 
                  href={buildInternationalWhatsAppUrl("Hello,%20I%20would%20like%20to%20talk%20to%20TAG08%20about%20social%20media%20management.")}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary shrink-0 group-hover:bg-brand-secondary group-hover:text-black transition-all duration-200">
                        <span className="text-[9px] font-mono font-black tracking-tight text-brand-secondary group-hover:text-black">INT</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase font-black tracking-wider leading-none">
                          WHATSAPP INTERNACIONAL
                        </span>
                        <span className="text-white text-xs font-mono font-bold tracking-wider group-hover:text-brand-secondary transition-colors mt-0.5">
                          +56 9 9793 7611
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-brand-secondary font-mono font-bold uppercase tracking-wider bg-brand-secondary/10 py-1 px-2.5 rounded-lg group-hover:bg-brand-secondary group-hover:text-black transition-all">
                      FALAR COM A TAG08
                    </span>
                  </div>
                </a>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                  <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest font-extrabold">
                    TAG08
                  </span>
                </div>
                <span className="font-sans text-[8.5px] text-brand font-bold bg-brand/10 border border-brand/20 px-2 rounded">
                  ATENDIMENTO ONLINE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 - CTA para Landing Comercial - PREMIUM GRAPHIC BLOCK */}
      <section className="py-10 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-900/10 text-left">
        <div className="max-w-7xl mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/50 border border-white/[0.06] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-7 text-left">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            
            <div className="relative z-10 space-y-2 max-w-2xl">
              <span className="font-mono text-[9px] text-brand-secondary bg-brand-secondary/5 px-2.5 py-0.5 rounded border border-brand-secondary/10 uppercase tracking-widest font-black">PRÓXIMO PASSO</span>
              <h3 className="font-display font-semibold text-xl sm:text-2xl text-white uppercase tracking-tight">Vamos organizar a presença da sua marca nas redes?</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                Antes de propor uma rotina de conteúdo, a TAG08 entende seu posicionamento, seus canais, sua frequência possível e os gargalos que hoje dificultam uma presença mais consistente.
              </p>
            </div>
            
            <button
              onClick={() => {
                onNavigate("/contato");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group relative px-6 py-4 bg-brand-secondary hover:bg-brand-dark text-black text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shrink-0 overflow-hidden shadow-[0_8px_30px_rgba(var(--color-brand-secondary-rgb),0.15)] hover:-translate-y-0.5 relative z-10 cursor-pointer"
            >
              ORGANIZAR MINHA PRESENÇA <ArrowRight className="w-4 h-4 ml-1.5 inline-block group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <TrustTestimonialsSection />

      {/* SECTION - FAQ */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[40px] bg-charcoal-950 border border-white/[0.04] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono">
                  Dúvidas sobre gestão de redes
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter uppercase">
                  Antes de contratar, <br />
                  entenda como a gestão funciona.
                </h2>
                <p className="text-zinc-300 font-medium text-xs sm:text-[13px] leading-relaxed font-sans max-w-sm">
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
                      aria-expanded={isActive}
                      aria-controls={`faq-panel-${item.id}`}
                      className={`w-full min-h-[66px] flex items-center justify-between gap-4 px-4 py-4 rounded-xl border transition-all duration-200 text-left group cursor-pointer hover:-translate-y-0.5 ${
                        isActive
                          ? "bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)]"
                          : "bg-white/[0.015] border-white/10 text-zinc-300 hover:text-white hover:border-white/20 hover:bg-white/[0.03]"
                      }`}
                    >
                      <span className="min-w-0 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-3">
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

            <div className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-white/[0.04] bg-[#0c0c0e]">
              <Image
                fill
                sizes="(max-width: 1024px) 100vw, 34vw"
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800"
                alt="TAG08 Redes Sociais"
                className="object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div className="absolute top-6 left-6 z-10 pointer-events-none font-mono text-[8px] text-white/20 uppercase tracking-widest leading-none">
                SYS // SOCIAL_MGMT
              </div>

              <div
                id={`faq-panel-${activeFaqItem.id}`}
                className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left"
              >
                <span className="font-mono text-[8.5px] text-brand uppercase tracking-widest font-black block">
                  {activeFaqItem.eyebrow}
                </span>

                <h4 className="text-white font-semibold text-sm sm:text-base leading-tight border-b border-white/5 pb-2">
                  {activeFaqItem.question}
                </h4>

                <p className="text-zinc-300 text-xs sm:text-[12.5px] leading-relaxed font-sans font-medium">
                  {activeFaqItem.answer}
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-brand/20 hover:-translate-y-0.5 transition-all duration-200 text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-bold">Como agimos</span>
                  <h4 className="text-white font-semibold text-sm leading-snug">Linha editorial, frequência possível e revisão constante.</h4>
                  <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                    Evitamos improviso e mantemos a presença coerente com o posicionamento da marca.
                  </p>
                </div>
                <button
                  onClick={() => handleLinkClick("/servicos")}
                  className="group flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <span>Ver Soluções</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all duration-200 text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-black/60 uppercase tracking-widest block font-extrabold">Próximo passo</span>
                  <h4 className="text-black font-black text-sm uppercase leading-tight tracking-tight">Quer entender o melhor caminho para sua marca?</h4>
                  <p className="text-black/85 text-[11.5px] font-semibold leading-relaxed font-mono">
                    Fale com a TAG08 para entender se gestão de redes, conteúdo, audiovisual ou outro caminho faz mais sentido agora.
                  </p>
                </div>
                <a
                  href={buildBrazilWhatsAppUrl("Ola,%20gostaria%20de%20entender%20a%20melhor%20forma%20de%20organizar%20a%20presenca%20da%20minha%20marca%20nas%20redes.")}
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
        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase leading-tight tracking-tighter">
          Organize uma presença mais clara nas redes. <br />
          <span className="text-brand">A TAG08 ajuda a estruturar linha editorial, frequência, formatos e revisão para publicar com mais critério.</span>
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          A TAG08 ajuda a organizar linha editorial, frequência, formatos e revisão para que sua marca publique com mais critério e consistência.
        </p>
        <div className="pt-2 sm:pt-3">
          <button
            onClick={() => handleLinkClick("/contato")}
            className="group bg-brand text-black font-mono font-black text-[10px] uppercase tracking-widest py-3.5 px-7 rounded-full shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.22)] hover:bg-brand-dark duration-300 transition-all cursor-pointer flex items-center gap-2 mx-auto"
          >
            <span>ORGANIZAR MINHA PRESENÇA</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </section>

    </div>
  );
}

















