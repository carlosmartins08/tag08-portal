import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, LineChart, MessageSquare, Settings, Target } from "lucide-react";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import MiniCases from "../../../components/MiniCases";
import TrustTestimonialsSection from "../../../components/TrustTestimonialsSection";
import { buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl } from "../../../config/siteNetwork";
import { trackOutboundClick } from "../../../lib/analytics";
import { useSimulatorTracking } from "../../../lib/useSimulatorTracking";

interface AssessoriaProps {
  onNavigate: (page: string) => void;
}

interface Question {
  id: number;
  text: string;
  options: Array<{ label: string; value: number; text: string }>;
}

const AUDIT_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Como as prioridades de marketing são definidas hoje?",
    options: [
      { label: "A", value: 10, text: "A urgência da semana define o que entra na frente" },
      { label: "B", value: 16, text: "Existe um plano, mas ele muda com frequência e sem critério claro" },
      { label: "C", value: 23, text: "As prioridades existem, mas nem toda a equipe ou parceiro as entende" },
      { label: "D", value: 30, text: "As prioridades são acordadas, registradas e revisadas com quem decide" }
    ]
  },
  {
    id: 2,
    text: "A mensagem da marca se mantém coerente entre os canais?",
    options: [
      { label: "A", value: 10, text: "Cada canal ou pessoa fala de um jeito, conforme a demanda" },
      { label: "B", value: 16, text: "Temos uma ideia de mensagem, mas ela varia muito na prática" },
      { label: "C", value: 23, text: "A mensagem é clara, porém ainda há pontos de contato desalinhados" },
      { label: "D", value: 30, text: "Existe uma direção comum para mensagem, canal e material comercial" }
    ]
  },
  {
    id: 3,
    text: "Como as decisões entre equipe, parceiros e liderança são conduzidas?",
    options: [
      { label: "A", value: 10, text: "As decisões ficam soltas ou dependem de quem está disponível" },
      { label: "B", value: 16, text: "Cada parceiro executa sua parte, mas faltam critérios compartilhados" },
      { label: "C", value: 23, text: "Há responsáveis, mas aprovações e decisões ainda geram retrabalho" },
      { label: "D", value: 30, text: "Papéis, critérios de aprovação e momentos de revisão estão claros" }
    ]
  },
  {
    id: 4,
    text: "Qual é a capacidade real de transformar uma decisão em execução?",
    options: [
      { label: "A", value: 10, text: "Não há responsável ou rotina para sustentar as decisões" },
      { label: "B", value: 16, text: "A execução acontece por esforço, mas sem uma sequência sustentável" },
      { label: "C", value: 23, text: "Há capacidade e responsáveis, embora alguns alinhamentos travem o fluxo" },
      { label: "D", value: 30, text: "A operação tem donos, rotina de acompanhamento e espaço para ajustes" }
    ]
  }
];

const CAPABILITIES = [
  { icon: Target, title: "Posicionamento e mensagem", description: "Clareza sobre oferta, público, percepção e mensagens que precisam sustentar a marca." },
  { icon: MessageSquare, title: "Conteúdo e relacionamento", description: "Argumentos e conversas que ajudam o público a compreender melhor a marca e sua oferta." },
  { icon: LineChart, title: "Canais e conversão", description: "Pontos de contato organizados para apoiar a jornada e o próximo passo." },
  { icon: Settings, title: "Operação e acompanhamento", description: "Responsáveis, prioridades, revisão e rotina para reduzir improviso." }
] as const;

const METHOD_STEPS = [
  { title: "Entender o cenário", description: "Contexto, objetivos, gargalos, canais e limitações reais antes de recomendar ações." },
  { title: "Ler a maturidade", description: "Desalinhamentos entre oferta, mensagem, rotina e capacidade de execução." },
  { title: "Definir prioridades", description: "O que vem primeiro, o que pode esperar e qual sequência é viável agora." },
  { title: "Acompanhar decisões", description: "Critérios, revisões e ajustes compatíveis com o escopo combinado." }
] as const;

const FIT_SIGNALS = [
  "A marca já tem frentes, pessoas ou parceiros em movimento, mas falta uma direção comum.",
  "As prioridades mudam sem critério e cada decisão reabre discussões ou cria retrabalho.",
  "Existe disposição para compartilhar contexto, participar das decisões e sustentar uma rotina possível."
] as const;

const NON_FIT_SIGNALS = [
  "A necessidade é uma entrega isolada, com escopo já totalmente definido.",
  "A expectativa é receber uma solução pronta sem acesso ao contexto ou participação nas decisões.",
  "Ainda não existe uma pessoa disponível para validar prioridades, aprovar caminhos e acompanhar a evolução."
] as const;

const FAQ_ITEMS = [
  { question: "O que é a Assessoria de Marketing Estratégico da TAG08?", answer: "É um acompanhamento para organizar posicionamento, prioridades, comunicação, canais e próximos passos antes de ampliar a execução. O foco é melhorar a qualidade das decisões de marketing e reduzir ações soltas." },
  { question: "A assessoria inclui execução de marketing?", answer: "Depende do escopo. Em alguns casos, a assessoria orienta decisões e organiza o planejamento. Em outros, ela se conecta a soluções específicas da TAG08. A proposta define o que está incluído, quem executa e quais decisões seguem com a empresa." },
  { question: "Quando a assessoria faz sentido?", answer: "Quando decisões, canais, equipes ou parceiros precisam trabalhar com uma direção comum. Pode não ser o melhor caminho para uma entrega pontual, para quem espera execução sem participação ou quando não há uma pessoa disponível para decidir e acompanhar." },
  { question: "Qual é o ritmo e a participação esperada?", answer: "O ritmo é definido no escopo. A marca compartilha contexto, indica uma pessoa com poder de decisão e participa dos retornos combinados. A TAG08 organiza a condução; decisões de negócio continuam sendo da empresa." },
  { question: "A TAG08 substitui equipe interna ou parceiros?", answer: "Não. A assessoria pode organizar prioridades, critérios e planejamento para que equipe interna e parceiros trabalhem com maior alinhamento. Papéis, aprovações e responsabilidades são definidos no início." },
  { question: "Quanto tempo dura e como o investimento é definido?", answer: "Tempo e investimento dependem do contexto, escopo, quantidade de frentes e disponibilidade da operação. A TAG08 propõe um formato somente depois de entender o cenário e confirmar o encaixe." },
  { question: "A TAG08 faz promessas de resultado?", answer: "Não. A assessoria não promete crescimento instantâneo, retorno financeiro ou resultado artificial. O trabalho busca clareza, critério, planejamento, consistência e melhoria contínua com responsabilidade." }
] as const;

const actionTransition = "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none";

export default function AssessoriaMarketingDigitalEstrategico({ onNavigate }: AssessoriaProps) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { score: number; text: string }>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [shouldRestoreQuizFocus, setShouldRestoreQuizFocus] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const trackSimulator = useSimulatorTracking("marketing_assessment_quiz", 1, "/servicos/assessoria-marketing-digital-estrategico");
  const brazilConsultationWhatsappUrl = buildBrazilWhatsAppUrl("Olá TAG08! Gostaria de conversar sobre Assessoria de Marketing Estratégico e entender os próximos passos para a minha empresa.");
  const brazilDiagnosticWhatsappUrl = buildBrazilWhatsAppUrl("Olá TAG08! Concluí a leitura inicial de maturidade e gostaria de conversar sobre Assessoria de Marketing Estratégico para entender os próximos passos da minha empresa.");
  const internationalDiagnosticWhatsappUrl = buildInternationalWhatsAppUrl("Hello TAG08! I completed the initial assessment and would like to discuss Strategic Marketing Advisory and the next steps for my company.");

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  const scrollToDiagnostic = () => {
    document.getElementById("diagnostic-audit")?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  };

  const handleConsultationWhatsAppClick = (surface: string) => {
    trackSimulator("cta_clicked");
    trackOutboundClick({ label: "WhatsApp Brasil", url: brazilConsultationWhatsappUrl, surface });
  };

  const handleDiagnosticWhatsAppClick = (label: string, url: string) => {
    trackSimulator("cta_clicked");
    trackOutboundClick({ label, url, surface: "assessoria-diagnostic-result" });
  };

  const handleSelectOption = (questionId: number, score: number, text: string) => {
    trackSimulator("input_changed");
    setAnswers((current) => ({ ...current, [questionId]: { score, text } }));
    setShouldRestoreQuizFocus(true);

    if (currentQuestionIdx < AUDIT_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((current) => current + 1);
      return;
    }

    setQuizCompleted(true);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIdx === 0) return;
    setShouldRestoreQuizFocus(true);
    setCurrentQuestionIdx((current) => current - 1);
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setCurrentQuestionIdx(0);
    setQuizCompleted(false);
    setShouldRestoreQuizFocus(true);
  };

  useEffect(() => {
    if (!shouldRestoreQuizFocus) return;

    const timer = window.setTimeout(() => {
      (quizCompleted ? resultHeadingRef.current : questionHeadingRef.current)?.focus();
      setShouldRestoreQuizFocus(false);
    }, prefersReducedMotion ? 0 : 220);

    return () => window.clearTimeout(timer);
  }, [currentQuestionIdx, prefersReducedMotion, quizCompleted, shouldRestoreQuizFocus]);

  const totalScore = Object.values(answers).reduce((sum, answer) => sum + answer.score, 0);
  const diagnostic = totalScore <= 59
    ? { level: "Baixa clareza", tone: "text-red-300", description: "A marca ainda depende de ações isoladas e de decisões pouco organizadas.", focus: "O primeiro foco costuma ser clareza estratégica e alinhamento de comunicação.", recommendation: "A prioridade agora é estruturar a base antes de ampliar a execução." }
    : totalScore <= 79
      ? { level: "Clareza em construção", tone: "text-brand", description: "Já existe movimento, mas a comunicação ainda pode ganhar consistência entre canais e materiais.", focus: "Ajustar mensagem, consistência e estrutura de canais.", recommendation: "Vale organizar prioridades antes de ampliar qualquer frente." }
      : totalScore <= 100
        ? { level: "Boa direção", tone: "text-brand", description: "A marca tem um caminho mais consistente, mas ainda pode ganhar clareza na sustentação da rotina.", focus: "Foco em acompanhamento, revisão e continuidade do que já foi estruturado.", recommendation: "O próximo passo é consolidar método e manter a execução responsável." }
        : { level: "Direção mais consolidada", tone: "text-brand", description: "Existe uma base organizada para decidir e executar, embora prioridades e contexto precisem ser revistos com a operação.", focus: "Prioridade em consistência, revisão e continuidade.", recommendation: "A leitura não substitui uma análise completa, mas indica uma base estruturada para os próximos passos." };
  const quizProgress = quizCompleted ? 100 : Math.round(((currentQuestionIdx + 1) / AUDIT_QUESTIONS.length) * 100);
  const quizTransition = prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: [0.23, 1, 0.32, 1] as const };

  return (
    <div className="min-h-screen overflow-hidden bg-charcoal-950 pb-20 text-white">
      <section className="border-b border-white/[0.06] px-4 py-12 sm:px-6 sm:py-20 md:px-8">
        <div className="mx-auto max-w-7xl space-y-10 sm:space-y-14">
          <div className="grid grid-cols-1 items-end gap-7 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-5 lg:col-span-7">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand">Assessoria de marketing estratégico</p>
              <h1 className="max-w-4xl font-display text-4xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
                Direção de marketing <span className="text-brand">antes de ampliar a execução.</span>
              </h1>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a data-testid="assessoria-hero-contact" href={brazilConsultationWhatsappUrl} onClick={() => handleConsultationWhatsAppClick("assessoria-hero")} target="_blank" rel="noreferrer" aria-label="Falar com a TAG08 pelo WhatsApp, abre em nova guia" className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-xs font-black uppercase tracking-widest text-black shadow-[0_12px_36px_rgba(var(--color-brand-rgb),0.18)] ${actionTransition}`}>
                  <span>Falar com a TAG08</span><ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                </a>
                <button type="button" onClick={scrollToDiagnostic} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-200 ${actionTransition}`}>
                  <span>Fazer leitura inicial</span><ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-zinc-300 lg:col-span-5 lg:pb-1">A TAG08 organiza contexto, posicionamento, prioridades, comunicação e próximos passos para que decisões de marketing deixem de nascer da urgência e passem a seguir critérios mais claros.</p>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] border border-white/[0.08] bg-charcoal-900 shadow-2xl sm:aspect-[2.39/1] sm:rounded-[32px]">
            <Image fill preload sizes="(max-width: 768px) 100vw, (max-width: 1280px) calc(100vw - 4rem), 1280px" src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1600" alt="Reunião de planejamento estratégico" className="object-cover grayscale brightness-50" referrerPolicy="no-referrer" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6"><p className="text-sm font-bold text-white">Diagnóstico, prioridades e direção de marketing.</p></div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-zinc-950/70 px-4 py-16 sm:px-6 sm:py-20 md:px-8">
        <div className="mx-auto max-w-7xl space-y-10 sm:space-y-14">
          <div className="max-w-3xl space-y-3">
            <h2 className="font-display text-3xl font-black leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl">Quando a assessoria faz sentido.</h2>
            <p className="text-sm leading-relaxed text-zinc-300">A assessoria resolve falta de direção e coordenação. Não substitui uma decisão que a marca ainda não quer ou não consegue tomar.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 border-y border-white/[0.08] py-1 md:grid-cols-2">
            <article className="border-b border-white/[0.08] py-7 md:border-b-0 md:border-r md:pr-8">
              <p className="text-sm font-bold text-brand">Há encaixe quando</p>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-200">
                {FIT_SIGNALS.map((item) => <li key={item} className="flex gap-3"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" /><span>{item}</span></li>)}
              </ul>
            </article>
            <article className="py-7 md:pl-8">
              <p className="text-sm font-bold text-zinc-200">Talvez não seja agora se</p>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-300">
                {NON_FIT_SIGNALS.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true" className="mt-0.5 text-brand">—</span><span>{item}</span></li>)}
              </ul>
            </article>
          </div>
          <div className="space-y-5">
            <div className="max-w-3xl">
              <h2 className="font-display text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">Como a TAG08 organiza a decisão.</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">A execução só ganha consistência quando contexto, prioridade e responsabilidade estão alinhados.</p>
            </div>
            <ol className="grid grid-cols-1 border-t border-white/[0.08] md:grid-cols-2 lg:grid-cols-4">
              {METHOD_STEPS.map((step, index) => <li key={step.title} className={`min-h-[170px] border-b border-white/[0.08] py-6 ${index % 2 === 0 ? "md:border-r md:pr-6 lg:border-r" : "md:pl-6 lg:border-r lg:pr-6"} ${index === 3 ? "lg:border-r-0" : ""}`}><h3 className="text-sm font-bold text-white">{step.title}</h3><p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-300">{step.description}</p></li>)}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20 md:px-8">
        <div className="mx-auto max-w-7xl space-y-9 sm:space-y-12">
          <div className="max-w-3xl space-y-3">
            <h2 className="font-display text-3xl font-black leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl">O que organizamos antes de ampliar frentes.</h2>
            <p className="text-sm leading-relaxed text-zinc-300">A assessoria conecta posicionamento, comunicação, canais e operação. Nem toda frente precisa acontecer ao mesmo tempo; a escolha depende do contexto, da prioridade e da capacidade real de execução.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((capability) => {
              const Icon = capability.icon;
              return <article key={capability.title} className="border-t border-white/[0.12] py-5"><Icon aria-hidden="true" className="h-5 w-5 text-brand" /><h3 className="mt-8 font-display text-lg font-black tracking-tight text-white">{capability.title}</h3><p className="mt-3 text-sm leading-relaxed text-zinc-300">{capability.description}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section id="diagnostic-audit" className="scroll-mt-24 border-b border-white/[0.06] bg-zinc-950/70 px-4 py-16 sm:px-6 sm:py-20 md:px-8">
        <div className="mx-auto max-w-5xl space-y-9 sm:space-y-12">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand">Leitura inicial opcional</p>
            <h2 className="font-display text-3xl font-black leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl">Sua empresa tem direção suficiente para executar com consistência?</h2>
            <p className="text-sm leading-relaxed text-zinc-300">Esta leitura inicial ajuda a perceber se prioridades, mensagem, canais, responsabilidades e capacidade de execução estão organizados o suficiente para sustentar os próximos passos.</p>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-charcoal-900 p-6 shadow-2xl sm:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {!quizCompleted ? <motion.div key={currentQuestionIdx} initial={prefersReducedMotion ? false : { opacity: 0, transform: "translateX(10px)" }} animate={{ opacity: 1, transform: "translateX(0)" }} exit={prefersReducedMotion ? undefined : { opacity: 0, transform: "translateX(-8px)" }} transition={quizTransition} className="space-y-7">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4"><p className="text-xs font-bold uppercase tracking-widest text-brand">Leitura de maturidade</p><p className="text-xs text-zinc-300">{currentQuestionIdx + 1} de {AUDIT_QUESTIONS.length}</p></div>
                <div role="progressbar" aria-label="Progresso do diagnóstico" aria-valuemin={0} aria-valuemax={100} aria-valuenow={quizProgress} aria-valuetext={`Pergunta ${currentQuestionIdx + 1} de ${AUDIT_QUESTIONS.length}`} className="h-1 w-full overflow-hidden rounded-full bg-white/[0.08]"><div className="h-full bg-brand transition-[width] duration-200 ease-out motion-reduce:transition-none" style={{ width: `${quizProgress}%` }} /></div>
                <h3 ref={questionHeadingRef} tabIndex={-1} className="font-display text-xl font-black leading-snug text-white sm:text-2xl">{AUDIT_QUESTIONS[currentQuestionIdx].text}</h3>
                <div className="grid gap-3">
                  {AUDIT_QUESTIONS[currentQuestionIdx].options.map((option) => {
                    const isSelected = answers[AUDIT_QUESTIONS[currentQuestionIdx].id]?.score === option.value;
                    return <button key={option.label} type="button" onClick={() => handleSelectOption(AUDIT_QUESTIONS[currentQuestionIdx].id, option.value, option.text)} aria-pressed={isSelected} className={`flex min-h-12 w-full items-center gap-4 rounded-xl border p-4 text-left text-sm ${isSelected ? "border-brand/60 bg-brand/[0.08] text-white" : "border-white/[0.10] bg-white/[0.01] text-zinc-200 hover:border-brand/45 hover:bg-white/[0.03]"} ${actionTransition}`}><span aria-hidden="true" className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-black ${isSelected ? "bg-brand text-black" : "bg-white/[0.08] text-zinc-200"}`}>{option.label}</span><span>{option.text}</span></button>;
                  })}
                </div>
                <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <button type="button" onClick={handlePreviousQuestion} disabled={currentQuestionIdx === 0} className={`inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-zinc-200 disabled:cursor-not-allowed disabled:opacity-45 ${actionTransition}`}>Voltar uma pergunta</button>
                  <p className="text-xs leading-relaxed text-zinc-300 sm:text-right">Sua resposta pode ser alterada antes da leitura final.</p>
                </div>
              </motion.div> : <motion.div initial={prefersReducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={quizTransition} className="space-y-7">
                <div className="border-b border-white/[0.08] pb-4"><p className="text-xs font-bold uppercase tracking-widest text-brand">Leitura orientativa concluída</p></div>
                <div className="rounded-2xl border border-white/[0.08] bg-black/25 p-6"><p className="text-xs font-bold uppercase tracking-widest text-zinc-300">Leitura atual</p><h3 ref={resultHeadingRef} tabIndex={-1} className={`mt-3 font-display text-3xl font-black leading-none ${diagnostic.tone}`}>{diagnostic.level}</h3><p className="mt-5 text-sm leading-relaxed text-zinc-200">{diagnostic.description}</p><p className="mt-4 border-t border-white/[0.08] pt-4 text-sm font-semibold leading-relaxed text-white">{diagnostic.focus}</p><p className="mt-3 text-sm leading-relaxed text-zinc-300">{diagnostic.recommendation}</p></div>
                <p className="text-sm leading-relaxed text-zinc-300">Esta leitura organiza percepções da própria empresa; não substitui diagnóstico técnico, análise de canais ou recomendação comercial.</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <a href={brazilDiagnosticWhatsappUrl} onClick={() => handleDiagnosticWhatsAppClick("WhatsApp Brasil", brazilDiagnosticWhatsappUrl)} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp Brasil sobre esta leitura, abre em nova guia" className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-xs font-black uppercase tracking-widest text-black ${actionTransition}`}><MessageSquare className="h-4 w-4" />WhatsApp Brasil</a>
                  <a href={internationalDiagnosticWhatsappUrl} onClick={() => handleDiagnosticWhatsAppClick("WhatsApp Internacional", internationalDiagnosticWhatsappUrl)} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp Internacional sobre esta leitura, abre em nova guia" className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-brand/45 px-5 py-3 text-xs font-black uppercase tracking-widest text-brand ${actionTransition}`}><MessageSquare className="h-4 w-4" />WhatsApp Internacional</a>
                  <button type="button" onClick={handleResetQuiz} className={`min-h-11 rounded-xl border border-white/10 px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-200 sm:col-span-2 ${actionTransition}`}>Repetir leitura</button>
                </div>
              </motion.div>}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <MiniCases route="/servicos/assessoria-marketing-digital-estrategico" onNavigate={onNavigate} badge="Experiências acompanhadas" title="Provas apresentadas com contexto" subtitle="Uma seleção de experiências autorizadas para esta rota. Cada caso representa um contexto, escopo e momento próprios." />
      <TrustTestimonialsSection />

      <section className="border-b border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20 md:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="max-w-3xl space-y-3"><h2 className="font-display text-3xl font-black leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl">Dúvidas antes de conversar.</h2><p className="text-sm leading-relaxed text-zinc-300">As respostas abaixo ajudam a entender o que esperar antes de avaliar um escopo.</p></div>
          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaq === index;
              const panelId = `assessoria-faq-panel-${index}`;
              const headingId = `assessoria-faq-heading-${index}`;
              return (
                <article key={item.question} className="py-1">
                  <h3 id={headingId}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className={`flex min-h-14 w-full items-center justify-between gap-5 py-4 text-left text-base font-bold text-white ${actionTransition}`}
                    >
                      <span>{item.question}</span>
                      <ChevronDown aria-hidden="true" className={`h-5 w-5 shrink-0 text-brand transition-transform duration-200 ease-out motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  </h3>
                  {isOpen && (
                    <div id={panelId} role="region" aria-labelledby={headingId} className="pb-5 pr-10 text-sm leading-relaxed text-zinc-300">
                      {item.answer}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-brand p-7 text-black sm:p-10">
          <div className="max-w-2xl"><h2 className="font-display text-3xl font-black leading-[0.98] tracking-[-0.04em] sm:text-4xl">Vamos entender se a assessoria faz sentido para sua marca?</h2><p className="mt-5 text-sm leading-relaxed text-black/75">Antes de propor qualquer formato, a TAG08 entende contexto, posicionamento, prioridades e capacidade de execução para indicar o caminho mais coerente para este momento.</p></div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href={brazilConsultationWhatsappUrl} onClick={() => handleConsultationWhatsAppClick("assessoria-final-cta")} target="_blank" rel="noreferrer" aria-label="Falar com a TAG08 pelo WhatsApp, abre em nova guia" className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-black uppercase tracking-widest text-white ${actionTransition}`}>Falar com a TAG08<ArrowUpRight className="h-4 w-4" /></a>
            <button type="button" onClick={() => handleLinkClick("/servicos")} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/15 px-5 py-3 text-xs font-bold uppercase tracking-widest text-black ${actionTransition}`}>Ver outras soluções<ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      </section>

      <ServiceInsightsBridge servicePath="/servicos/assessoria-marketing-digital-estrategico" onNavigate={onNavigate} />
    </div>
  );
}
