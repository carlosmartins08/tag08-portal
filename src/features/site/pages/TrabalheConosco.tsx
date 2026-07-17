import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase, 
  MapPin, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Linkedin, 
  Globe, 
  FileText, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  ArrowUpRight,
  Sparkles, 
  Terminal, 
  HeartHandshake, 
  Cpu, 
  Flame,
  Plus,
  Trash2,
  Lock,
  Eye,
  Type,
  TrendingUp,
  Award
} from "lucide-react";
import { trackOutboundClick } from "../../../lib/analytics";

interface Vacancy {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  reward: string;
  description: string;
  requirements: string[];
}

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  linkedin: string;
  portfolio: string;
  coverLetter: string;
  fileName: string;
  status: "Pendente" | "Em AnÃ¡lise" | "Entrevista";
  submittedAt: string;
}

export default function TrabalheConosco({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [selectedVacancy, setSelectedVacancy] = useState<string>("copywriter");
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formLinkedin, setFormLinkedin] = useState("");
  const [formPortfolio, setFormPortfolio] = useState("");
  const [formCoverLetter, setFormCoverLetter] = useState("");
  
  // File Onboarding Wizard state
  const [currentStep, setCurrentStep] = useState(1);

  // File Upload Visual State
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status lists
  const [applications, setApplications] = useState<Application[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleOutboundClick = (label: string, url: string, surface: string) => {
    trackOutboundClick({
      label,
      url,
      surface
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formName.trim()) {
        newErrors.name = "Nome Ã© obrigatÃ³rio";
      }
      if (!formEmail.trim() || !formEmail.includes("@")) {
        newErrors.email = "E-mail vÃ¡lido Ã© obrigatÃ³rio";
      }
      if (!formPhone.trim()) {
        newErrors.phone = "Telefone Ã© obrigatÃ³rio";
      }
    } else if (step === 2) {
      if (!formLinkedin.trim() || !formLinkedin.includes("linkedin.com")) {
        newErrors.linkedin = "Insira um link do LinkedIn vÃ¡lido (contendo linkedin.com)";
      }
    } else if (step === 3) {
      if (!formCoverLetter.trim() || formCoverLetter.length < 20) {
        newErrors.coverLetter = "Sua mini-carta de apresentaÃ§Ã£o deve ter pelo menos 20 caracteres";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setErrors({});
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setErrors({});
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const vacancies: Vacancy[] = [
    {
      id: "copywriter",
      title: "Copywriter EstratÃ©gico SÃªnior",
      department: "Editorial & EstratÃ©gia",
      type: "PJ / HÃ­brido",
      location: "Joinville/SC ou SÃ£o Paulo/SP",
      reward: "R$ 6k - R$ 9k + BÃ´nus",
      description: "Buscamos um construtor de narrativas sÃªnior focado em reestruturar a percepÃ§Ã£o de marcas B2B e infoprodutos. Profissional com domÃ­nio absoluto sobre funis de conversÃ£o ativa, manual de voz e storytelling sofisticado.",
      requirements: [
        "PortfÃ³lio comprovado com projetos de alto ticket B2B ou infoprodutos de alto posicionamento",
        "Capacidade tÃ©cnica de criar diretrizes e playbooks de voz",
        "Conhecimento de SEO, marketing de conteÃºdo B2B e redaÃ§Ã£o publicitÃ¡ria clÃ¡ssica",
        "Perfil altamente orientado a prazos rÃ­gidos, processos claros e consistÃªncia"
      ]
    },
    {
      id: "ui-designer",
      title: "UI/UX & Web Designer SÃªnior",
      department: "CriaÃ§Ã£o & Tecnologia",
      type: "PJ / Remoto",
      location: "Foco Nacional",
      reward: "R$ 7k - R$ 10k",
      description: "Profissional obsessivo por estÃ©tica limpa, tipografia, contraste e arquiteturas de pÃ¡ginas que convertem. VocÃª serÃ¡ responsÃ¡vel por traduzir o posicionamento das marcas em interfaces memorÃ¡veis e leves usando Figma.",
      requirements: [
        "Figma em nÃ­vel avanÃ§ado (Auto Layout, Sistemas de Cores, ComponentizaÃ§Ã£o robusta)",
        "Sensibilidade estÃ©tica apurada (SuÃ­Ã§o, Brutalista, Minimalista)",
        "DesejÃ¡vel entendimento prÃ¡tico de HTML/CSS para facilitar o handoff",
        "OrganizaÃ§Ã£o extrema com arquivos, prazos e entrega"
      ]
    },
    {
      id: "trafego-performance",
      title: "Gestor de Performance & MÃ­dia Paga",
      department: "MÃ­dia & InteligÃªncia",
      type: "PJ / HÃ­brido",
      location: "Joinville/SC ou SÃ£o Paulo/SP",
      reward: "Fixo + VariÃ¡vel sobre ROAS",
      description: "Orientado por dados e conversÃµes reais. ResponsÃ¡vel por planejar e executar as campanhas pagas de trÃ¡fego (Meta Ads & Google Ads) conectadas diretamente aos funis de autoria e canais dos nossos parceiros estrategizados.",
      requirements: [
        "MÃ­nimo de 3 anos liderando mÃ­dias pagas em escala (alto investimento)",
        "DomÃ­nio sobre funis complexos, tagueamento analÃ­tico (GTM, GA4) e captaÃ§Ã£o B2B",
        "Habilidade para gerar relatÃ³rios visuais claros focados em margem e ROI",
        "Proatividade total para sugerir melhorias drÃ¡sticas nas Landing Pages"
      ]
    },
    {
      id: "espontanea",
      title: "Banco de Talentos / Candidatura EspontÃ¢nea",
      department: "Todas as Ã¡reas",
      type: "PJ ou Freelance",
      location: "HÃ­brido ou Remoto",
      reward: "A combinar",
      description: "NÃ£o encontrou uma vaga aberta que se encaixe no seu momento atual? Envie suas informaÃ§Ãµes e portfÃ³lio para nosso banco de talentos prioritÃ¡rio. Avaliamos novas fichas semanalmente.",
      requirements: [
        "Extrema dedicaÃ§Ã£o pela excelÃªncia em sua especialidade",
        "Vontade de trabalhar sob processos organizados e playbooks rigorosos",
        "Autonomia extrema para gerenciar o prÃ³prio escopo tÃ©cnico"
      ]
    }
  ];

  const activeVacancy = vacancies.find(v => v.id === selectedVacancy) || vacancies[0];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf") || file.name.endsWith(".docx")) {
        setUploadedFileName(file.name);
      } else {
        alert("Apenas arquivos PDF ou DOCX sÃ£o aceitos.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleApply = (id: string) => {
    setSelectedVacancy(id);
    setCurrentStep(1);
    setErrors({});
    setSubmitSuccess(false);
    const formElement = document.getElementById("application-form-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrors({});
    setSubmitError("");

    if (!validateStep(3) || !consent) {
      if (!consent) setSubmitError("Confirme o consentimento para enviar sua candidatura.");
      return;
    }

    setSubmitting(true);
    try {
      const locale = document.documentElement.lang.startsWith("en") ? "en" : document.documentElement.lang.startsWith("es") ? "es" : "pt";
      const response = await fetch("/api/talent-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify({
          vacancyId: activeVacancy.id,
          vacancyTitle: activeVacancy.title,
          name: formName,
          email: formEmail,
          phone: formPhone,
          linkedin: formLinkedin,
          portfolio: formPortfolio,
          coverLetter: formCoverLetter,
          resumeFileName: uploadedFileName,
          consent,
          consentVersion: "talent-v1",
          locale,
          source: "talent-page"
        })
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.applicationId) throw new Error("submission_failed");

      setApplications((current) => [
        {
          id: result.applicationId,
          name: formName,
          email: formEmail,
          phone: formPhone,
          role: activeVacancy.title,
          linkedin: formLinkedin,
          portfolio: formPortfolio,
          coverLetter: formCoverLetter,
          fileName: uploadedFileName || "Sem anexo",
          status: "Pendente",
          submittedAt: new Date().toLocaleDateString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        },
        ...current
      ]);
      setSubmitSuccess(true);
      setCurrentStep(1);
      setFormName("");
      setFormEmail("");
      setFormPhone("");
      setFormLinkedin("");
      setFormPortfolio("");
      setFormCoverLetter("");
      setUploadedFileName("");
      setConsent(false);
    } catch {
      setSubmitError("Não foi possível registrar sua candidatura agora. Tente novamente em instantes.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteApplication = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setApplications((current) => current.filter((app) => app.id !== id));
  };

  return (
    <div className="w-full bg-[#070708] select-none text-left relative overflow-hidden">
      
      {/* SECTION 1: THE PREMIUM DARK HERO HEADER (Inspired by mockup's head section) */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-36 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Block */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand/10 border border-brand/20 text-brand font-bold text-[10px] rounded-lg tracking-widest uppercase font-mono">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              DIGITAL MARKETING SERVICES &amp; STRATEGY
            </div>
            
            <h1 className="font-display font-black text-4xl sm:text-5xl text-white uppercase tracking-tighter leading-[1.0]">
              Trabalhe com uma equipe que acredita em <br/>
              <span className="text-brand">direÃ§Ã£o, responsabilidade e evoluÃ§Ã£o constante.</span>
            </h1>
            
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg">
              Buscamos profissionais obsessivos por estÃ©tica limpa, tipografia, contraste e arquiteturas de conteÃºdo que convertem de verdade. Venha trabalhar de forma inteligente, organizada e sÃ­ncrona.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#vagas-abertas-anchor" 
                className="px-6 py-3 bg-brand text-black font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-brand-dark transition-all duration-300 shadow-[0_8px_25px_rgba(var(--color-brand-rgb),0.15)] flex items-center gap-2"
              >
                Ver Vagas Abertas <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a 
                href="#aplicacao-direta-anchor" 
                className="px-6 py-3 bg-white/5 text-zinc-300 font-mono text-xs uppercase tracking-widest rounded-xl border border-white/5 hover:border-white/12 hover:text-white transition-all"
              >
                Banco de Talentos
              </a>
            </div>
          </div>

          {/* Right Hero Image Frame (Mockup Style: Tablet Holding Professional) */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 to-transparent rounded-[32px] transform translate-y-3 translate-x-3 -z-10 blur-md pointer-events-none" />
            <div className="border border-white/10 rounded-[32px] overflow-hidden bg-charcoal-900 group">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" 
                alt="Profissional TAG08" 
                className="w-full aspect-[4/5] object-cover group-hover:scale-103 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              {/* Floating aesthetic widget over image */}
              <div className="absolute bottom-5 left-5 right-5 bg-black/75 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-brand font-mono uppercase tracking-widest font-bold">POSICIONAMENTO SÃŠNIOR</p>
                  <p className="text-white text-xs font-bold mt-0.5">Let's grow your brand!</p>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: THE ELEGANT FLOATING CORE CAPSULE PILL CONTAINER (White Background) */}
      <div className="relative px-6 md:px-12 pb-32">
        <div className="max-w-6xl mx-auto bg-white text-zinc-900 rounded-[32px] sm:rounded-[48px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-8 sm:p-14 space-y-16 relative z-10 -mt-16 sm:-mt-24">
          
          {/* Bento layout secondary header cards inspired by tablet display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch border-b border-zinc-100 pb-12">
            
            {/* List column on left */}
            <div className="lg:col-span-3 space-y-4">
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono font-bold">DIRETRIZES // EXPERTISE</p>
              <ul className="space-y-2.5 font-display text-sm font-bold text-zinc-800">
                <li className="flex items-center gap-2 border-b border-zinc-50 pb-2 hover:translate-x-1 transition-transform cursor-default">
                  <span className="w-1.5 h-1.5 bg-brand border border-black/10 rounded-full" />
                  Strategy &amp; Positioning
                </li>
                <li className="flex items-center gap-2 border-b border-zinc-50 pb-2 hover:translate-x-1 transition-transform cursor-default">
                  <span className="w-1.5 h-1.5 bg-brand border border-black/10 rounded-full" />
                  Content Creation
                </li>
                <li className="flex items-center gap-2 border-b border-zinc-50 pb-2 hover:translate-x-1 transition-transform cursor-default">
                  <span className="w-1.5 h-1.5 bg-brand border border-black/10 rounded-full" />
                  SEO &amp; High Integrity Web
                </li>
                <li className="flex items-center gap-2 border-b border-zinc-50 pb-2 hover:translate-x-1 transition-transform cursor-default">
                  <span className="w-1.5 h-1.5 bg-brand border border-black/10 rounded-full" />
                  Premium Graphic Design
                </li>
                <li className="flex items-center gap-2 border-b border-zinc-50 pb-2 hover:translate-x-1 transition-transform cursor-default">
                  <span className="w-1.5 h-1.5 bg-brand border border-black/10 rounded-full" />
                  Performance Ads
                </li>
              </ul>
            </div>

            {/* Core culture central column */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-4 lg:border-l lg:border-zinc-100 lg:pl-10">
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono font-bold">VALORES EXTRAORDINÃRIOS</p>
                <h3 className="font-display font-black text-xl text-zinc-900 uppercase tracking-tight">
                  Social Media <br/>Management
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed font-sans">
                  NÃ£o criamos apenas posts redundantes de feed. Estruturamos autoria, tom de narrativa impecÃ¡vel e canais ativos que geram relevÃ¢ncia e conversÃ£o premium para clientes de alto ticket.
                </p>
              </div>
              <a 
                href="#vagas-abertas-anchor"
                className="inline-flex self-start px-4 py-2 bg-zinc-950 text-white font-mono font-bold text-[9.5px] uppercase tracking-wider rounded-lg hover:bg-zinc-800 transition-colors"
              >
                Conhecer MÃ©todos
              </a>
            </div>

            {/* Dynamic Black Premium Statement Card on Right */}
            <div className="lg:col-span-5 bg-zinc-950 text-white p-7 rounded-3xl flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-bl-full pointer-events-none" />
              <div className="space-y-2">
                <p className="text-[9px] text-brand uppercase tracking-widest font-mono font-bold">TAG08 ECOSSISTEMA</p>
                <h3 className="font-display font-black text-2xl uppercase tracking-tighter leading-none">
                  Let's grow your <br />Brand Together!
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans mt-2">
                  Oferecer serviÃ§os com prazos cirÃºrgicos e processos bem documentados. Esse Ã© nosso pacto. Se vocÃª compartilha disso, estamos esperando sua candidatura.
                </p>
              </div>
              <a 
                href="#aplicacao-direta-anchor"
                className="self-start px-4.5 py-2.5 bg-white text-zinc-950 hover:bg-brand font-mono font-bold text-[9.5px] uppercase tracking-widest rounded-xl transition-all duration-300"
              >
                Iniciar Cadastro Exclusivo
              </a>
            </div>

          </div>

          {/* TEAM PROFILE CARDS SHOWCASE ("Copitattes Togetter" Design block from mockup) */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 font-sans">
              <div className="space-y-1 text-left">
                <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest font-bold">INTERA??O SOCIAL &amp; COMPANHEIRISMO</span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-zinc-900 uppercase tracking-tight">
                  Nosso Time &amp; LÃ­deres <span className="text-brand drop-shadow-sm font-light font-sans">â—</span>
                </h2>
              </div>
              <p className="text-zinc-500 text-xs sm:text-sm font-sans tracking-wider max-w-xs leading-tight">
                Profissionais experientes que consolidam nosso ecossistema de entrega cirÃºrgica rÃ¡pida.
              </p>
            </div>

            {/* Split layout: Highlighted Founder on the Left (styled with high status dark block for visual rhythm within the white capsule), and the 4 experienced leaders in a 2x2 grid on the Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-sans">
              
              {/* Highlighter Founder Card (Dark contrast container for dynamic style rhythm) */}
              <div className="lg:col-span-4 bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden group min-h-[380px] shadow-lg">
                <div className="absolute inset-0 z-0 pointer-events-none">
                  {/* Founder photo */}
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" 
                    alt="Carlos Eduardo" 
                    className="w-full h-full object-cover opacity-15 grayscale brightness-[0.7] group-hover:scale-105 group-hover:opacity-25 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/75 to-transparent" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="px-2.5 py-1 bg-brand/10 border border-brand/25 rounded text-brand text-[8px] font-mono uppercase tracking-widest font-bold">
                    FUNDADOR // CE
                  </div>
                  <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                </div>

                <div className="relative z-10 space-y-4 mt-auto">
                  <div className="space-y-1">
                    <span className="font-mono text-[8px] text-zinc-500 block uppercase font-bold">DIRE??O GERAL</span>
                    <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">Carlos Eduardo</h3>
                    <p className="text-brand text-[10.5px] font-mono uppercase leading-none">Fundador &amp; Diretor de CriaÃ§Ã£o</p>
                    <p className="text-zinc-400 text-xs leading-relaxed pt-2 italic">
                      "Conduz o posicionamento das marcas parceiras por meio de metodologias consistentes de design e estÃ©tica refinada."
                    </p>
                  </div>

                  <a 
                    href="https://www.linkedin.com/in/carlos-eduardo-tag08"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleOutboundClick("LinkedIn", "https://www.linkedin.com/in/carlos-eduardo-tag08", "careers-profile-carlos")}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand hover:bg-white text-zinc-950 font-sans font-bold text-[9.5px] uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md hover:-translate-y-0.5 cursor-pointer max-w-max"
                  >
                    <Linkedin className="w-3.5 h-3.5 fill-current stroke-none" />
                    <span>Conectar no LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Leaders Grid (4 Cards in a high efficiency 2x2 grid) */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Leader Card 1 */}
                <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-3xl flex flex-col justify-between space-y-5 hover:shadow-md transition-all duration-350 group">
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-200 shrink-0 relative">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250" 
                        alt="Marina Fontes" 
                        className="w-full h-full object-cover group-hover:scale-104 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <span className="font-sans text-[7.5px] text-zinc-400 uppercase tracking-widest block bg-zinc-200/50 px-2 py-0.5 rounded w-max">UI/UX &amp; Brand Director</span>
                      <h4 className="font-display font-black text-base text-zinc-900 uppercase tracking-tight leading-none pt-0.5">Marina Fontes</h4>
                      <p className="text-zinc-500 text-[11px] font-sans leading-snug pt-1">
                        Cria diretrizes estÃ©ticas e manuais grÃ¡ficos para marcas com exigÃªncia alta de consistÃªncia visual.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-zinc-200/40 pt-3 flex items-center justify-between text-[9px] font-mono text-zinc-400 uppercase">
                    <span className="flex items-center gap-1">ðŸ“ Joinville / SC</span>
                    <a 
                      href="https://www.linkedin.com/in/marina-fontes-tag08"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleOutboundClick("LinkedIn", "https://www.linkedin.com/in/marina-fontes-tag08", "careers-profile-marina")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-950 hover:bg-brand text-white hover:text-black hover:font-bold rounded-lg transition-colors duration-205 text-[8.5px] tracking-wider uppercase font-mono cursor-pointer"
                    >
                      <Linkedin className="w-3 h-3 fill-current stroke-none" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>

                {/* Leader Card 2 */}
                <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-3xl flex flex-col justify-between space-y-5 hover:shadow-md transition-all duration-350 group">
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-200 shrink-0 relative">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250" 
                        alt="Renato Silveira" 
                        className="w-full h-full object-cover group-hover:scale-104 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <span className="font-sans text-[7.5px] text-zinc-400 uppercase tracking-widest block bg-zinc-200/50 px-2 py-0.5 rounded w-max">Tech Lead Architect</span>
                      <h4 className="font-display font-black text-base text-zinc-900 uppercase tracking-tight leading-none pt-0.5">Renato Silveira</h4>
                      <p className="text-zinc-500 text-[11px] font-sans leading-snug pt-1">
                        ResponsÃ¡vel pela integridade tÃ©cnica, empacotamento leve e SEO dos sites.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-zinc-200/40 pt-3 flex items-center justify-between text-[9px] font-mono text-zinc-400 uppercase">
                    <span className="flex items-center gap-1">ðŸ“ SÃ£o Paulo / SP</span>
                    <a 
                      href="https://www.linkedin.com/in/renato-silveira-tag08"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleOutboundClick("LinkedIn", "https://www.linkedin.com/in/renato-silveira-tag08", "careers-profile-renato")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-950 hover:bg-brand text-white hover:text-black hover:font-bold rounded-lg transition-colors duration-205 text-[8.5px] tracking-wider uppercase font-mono cursor-pointer"
                    >
                      <Linkedin className="w-3 h-3 fill-current stroke-none" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>

                {/* Leader Card 3 */}
                <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-3xl flex flex-col justify-between space-y-5 hover:shadow-md transition-all duration-350 group">
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-200 shrink-0 relative">
                      <img 
                        src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250" 
                        alt="Amanda Reis" 
                        className="w-full h-full object-cover group-hover:scale-104 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <span className="font-sans text-[7.5px] text-zinc-400 uppercase tracking-widest block bg-zinc-200/50 px-2 py-0.5 rounded w-max">Content Strategist</span>
                      <h4 className="font-display font-black text-base text-zinc-900 uppercase tracking-tight leading-none pt-0.5">Amanda Reis</h4>
                      <p className="text-zinc-500 text-[11px] font-sans leading-snug pt-1">
                        DomÃ­nio em roteiros, storytelling e manuais de voz para executivos.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-zinc-200/40 pt-3 flex items-center justify-between text-[9px] font-mono text-zinc-400 uppercase">
                    <span className="flex items-center gap-1">ðŸ“ Remoto / Brasil</span>
                    <a 
                      href="https://www.linkedin.com/in/amanda-reis-tag08"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleOutboundClick("LinkedIn", "https://www.linkedin.com/in/amanda-reis-tag08", "careers-profile-amanda")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-950 hover:bg-brand text-white hover:text-black hover:font-bold rounded-lg transition-colors duration-205 text-[8.5px] tracking-wider uppercase font-mono cursor-pointer"
                    >
                      <Linkedin className="w-3 h-3 fill-current stroke-none" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>

                {/* Leader Card 4 */}
                <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-3xl flex flex-col justify-between space-y-5 hover:shadow-md transition-all duration-350 group">
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-200 shrink-0 relative">
                      <img 
                        src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250" 
                        alt="Lucas Mendes" 
                        className="w-full h-full object-cover group-hover:scale-104 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <span className="font-sans text-[7.5px] text-zinc-400 uppercase tracking-widest block bg-zinc-200/50 px-2 py-0.5 rounded w-max">Performance Specialist</span>
                      <h4 className="font-display font-black text-base text-zinc-900 uppercase tracking-tight leading-none pt-0.5">Lucas Mendes</h4>
                      <p className="text-zinc-500 text-[11px] font-sans leading-snug pt-1">
                        AnÃ¡lise fria de CPA, LTV e otimizaÃ§Ã£o cirÃºrgica no Meta &amp; Google Ads.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-zinc-200/40 pt-3 flex items-center justify-between text-[9px] font-mono text-zinc-400 uppercase">
                    <span className="flex items-center gap-1">ðŸ“ SÃ£o Paulo / SP</span>
                    <a 
                      href="https://www.linkedin.com/in/lucas-mendes-tag08"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleOutboundClick("LinkedIn", "https://www.linkedin.com/in/lucas-mendes-tag08", "careers-profile-lucas")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-950 hover:bg-brand text-white hover:text-black hover:font-bold rounded-lg transition-colors duration-205 text-[8.5px] tracking-wider uppercase font-mono cursor-pointer"
                    >
                      <Linkedin className="w-3 h-3 fill-current stroke-none" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>

              </div>

            </div>

            {/* TEAM COLLECTIVE LINKEDIN HUB SECTION */}
            <div className="bg-zinc-50 border border-zinc-200/80 rounded-3xl p-6 sm:p-8 mt-10 relative overflow-hidden text-left">
              <div className="absolute top-[-30px] right-[-30px] w-64 h-64 bg-brand/[0.05] rounded-full blur-[100px] pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 font-sans">
                <div className="lg:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-950 text-brand font-mono text-[8px] lg:text-[9.5px] font-black tracking-widest uppercase">
                    <Linkedin className="w-3.5 h-3.5 fill-brand stroke-none" />
                    <span>InovaÃ§Ã£o, Processos & Insights DiÃ¡rios</span>
                  </div>
                  <h4 className="font-display font-black text-zinc-900 text-lg sm:text-xl uppercase tracking-tight leading-none">
                    Engaje com nossos diretores no LinkedIn
                  </h4>
                  <p className="text-zinc-500 text-xs leading-relaxed max-w-2xl font-medium">
                    Acompanhe a rotina de faturamento de alto ticket, as preleÃ§Ãµes de design estratÃ©gico do nosso fundador e a engenharia web sem construtores de cÃ³digo desenvolvida pelo nosso time. Conecte-se com nossos lÃ­deres para insights diÃ¡rios que aceleram carreiras e marcas corporativas.
                  </p>
                </div>
                
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end w-full">
                  <div className="bg-white border border-zinc-200 rounded-2xl p-4 text-center sm:text-left lg:text-left flex-1 shadow-sm">
                    <span className="block font-display font-black text-lg text-zinc-900">32k+ conexÃµes</span>
                    <span className="block text-zinc-400 font-mono text-[8px] uppercase tracking-wider mt-0.5">Autoridade de mercado unificada</span>
                  </div>
                  <div className="bg-zinc-950 text-white rounded-2xl p-4 text-center sm:text-left lg:text-left flex-1 shadow-sm">
                    <span className="block font-display font-black text-lg text-brand">Insights Reais</span>
                    <span className="block text-zinc-400 font-mono text-[8px] uppercase tracking-wider mt-0.5">Artigos e playbooks semanais</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ACTIVE OPPORTUNITIES AREA */}
          <div id="vagas-abertas-anchor" className="space-y-10 pt-8 border-t border-zinc-100">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-zinc-100 pb-5">
              <div className="text-left space-y-1">
                <span className="font-mono text-[9px] text-brand bg-black px-2 py-0.5 rounded uppercase tracking-widest font-black">CARREIRA CORPORATIVA // SELE??O R?GIDA</span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-zinc-900 uppercase tracking-tight">
                  Vagas em Aberto
                </h2>
              </div>
              <p className="text-zinc-400 text-xs font-mono uppercase tracking-widest">
                {vacancies.length} POSIÃ‡Ã•ES DISPONÃVEIS
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT SIDE: Navigation buttons */}
              <div className="lg:col-span-5 space-y-2.5">
                {vacancies.map((v) => {
                  const isActive = selectedVacancy === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVacancy(v.id)}
                      className={`w-full p-4.5 rounded-2xl border text-left flex flex-col justify-between items-start transition-all duration-300 cursor-pointer focus:outline-none ${
                        isActive
                          ? "bg-zinc-950 border-zinc-950 text-white shadow-lg"
                          : "bg-zinc-50 border-zinc-100 text-zinc-800 hover:bg-zinc-100/60"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`font-mono text-[8.5px] font-bold px-2 py-0.5 rounded uppercase ${
                          isActive ? "bg-brand/20 text-brand" : "bg-zinc-200 text-zinc-600"
                        }`}>
                          {v.department}
                        </span>
                        <span className={`text-[9.5px] font-sans ${isActive ? "text-zinc-400" : "text-zinc-500"}`}>
                          {v.type}
                        </span>
                      </div>
                      <h3 className={`font-display font-bold text-sm sm:text-base mt-2`}>
                        {v.title}
                      </h3>
                    </button>
                  );
                })}
              </div>

              {/* RIGHT SIDE: Rich specifications card wrapper inside White Area */}
              <div className="lg:col-span-7 bg-zinc-50 border border-zinc-100 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden text-left shadow-sm">
                
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/65 pb-5">
                  <div>
                    <h3 className="font-display font-black text-xl sm:text-2xl text-zinc-900 uppercase tracking-tight leading-none">
                      {activeVacancy.title}
                    </h3>
                    <p className="text-zinc-400 font-mono text-[9px] uppercase tracking-wider mt-1">
                      {activeVacancy.department} â¬¢ {activeVacancy.type}
                    </p>
                  </div>
                  <div className="px-3 py-1.5 bg-zinc-950 text-brand rounded-xl text-xs font-sans font-bold tracking-wide">
                    {activeVacancy.reward}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-mono text-[9.5px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                      DescriÃ§Ã£o do Escopo TÃ©cnico
                    </h4>
                    <p className="text-zinc-600 text-xs sm:text-[13px] leading-relaxed">
                      {activeVacancy.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <h4 className="font-mono text-[9.5px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5">
                      Requisitos DesejÃ¡veis para Handoff Perfeito
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {activeVacancy.requirements.map((req, i) => (
                        <div key={i} className="flex gap-2.5 items-start bg-white border border-zinc-100 p-3 rounded-xl shadow-xs">
                          <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5 stroke-[2.5]" />
                          <span className="text-xs text-zinc-650 leading-relaxed font-sans">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-5 border-t border-zinc-200/60 text-xs font-sans text-zinc-400 justify-between">
                    <div className="flex items-center gap-3.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {activeVacancy.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" /> Imediata
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleApply(activeVacancy.id)}
                      className="px-4.5 py-2.5 bg-zinc-950 text-white font-mono font-bold text-[9.5px] uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      Preencher FormulÃ¡rio <ArrowRight className="w-3.5 h-3.5 text-brand" />
                    </button>
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* NOVO BLOCO CENTRAL: DIRETRIZES DE CULTURA, REQUISITOS, TIPO DE CONTRATO E ETAPAS DE SELE??O */}
          <div className="space-y-12 pt-12 border-t border-zinc-100 text-left">
            
            {/* Cultura e Expectativas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
              <div className="space-y-4">
                <span className="font-mono text-[9px] text-brand bg-zinc-950 px-2.5 py-1 rounded font-black uppercase tracking-widest inline-block">
                  NOSSO MANIFESTO INTERNO // RIGOR DE ENTREGA
                </span>
                <h3 className="font-display font-black text-2xl text-zinc-900 leading-tight uppercase">
                  O que esperamos do seu trabalho todos os dias
                </h3>
                <p className="text-zinc-500 text-xs sm:text-sm font-sans leading-relaxed">
                  A TAG08 executa uma parceria consultiva sÃ³lida baseada em processos e rigor tÃ©cnico de ponta. NÃ£o somos um local de improvisaÃ§Ãµes ou desculpas de cronogramas. Nosso pacto operacional baseia-se em quatro pilares estritos:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Rigor ClÃ´nico de Prazos", desc: "Se uma tarefa estÃ¡ mapeada para entrega na terÃ§a-feira Ã s 14h, ela serÃ¡ disponibilizada pontualmente sem atrasos." },
                  { title: "DocumentaÃ§Ã£o de Ativos", desc: "Todo o seu escopo intelectual de processos e designs precisa ser documentado de maneira limpa para a equipe." },
                  { title: "ComunicaÃ§Ã£o Altamente Ativa", desc: "Esperamos respostas cÃ©leres sobre as demandas ativas, sem barreiras de silÃªncio ou pendÃªncias." },
                  { title: "Const?ncia de Qualidade", desc: "Sua cent?sima entrega de arte, copy ou c?digo deve conter o mesmo padr?o de excel?ncia cl?nica da primeira." }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1.5">
                    <h4 className="text-zinc-900 font-display font-bold text-xs uppercase tracking-tight">{item.title}</h4>
                    <p className="text-zinc-500 text-[11px] leading-relaxed font-sans">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tipos de VÃ­nculos de Trabalho */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 text-white space-y-6">
              <div className="space-y-2">
                <span className="font-mono text-[8.5px] text-brand uppercase tracking-widest font-black block">OPÃ‡Ã•ES DE PARCERIA // CONDIÃ‡Ã•ES CONTRATUAIS</span>
                <h4 className="font-display font-black text-xl uppercase">Formatos de ContrataÃ§Ã£o e AtuaÃ§Ã£o DisponÃ­veis</h4>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans max-w-xl">
                  Estamos constantemente em busca das melhores mentes do mercado independente de sua preferÃªncia logÃ­stica comercial de contrataÃ§Ã£o:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { title: "Regime PJ (Prestador)", focus: "FLEXIBILIDADE E ESCALA", desc: "Ideal para consultores seniores autorais e designers que preferem emitir Notas Fiscais com flexibilidade de horas." },
                  { title: "Regime CLT (Fixo)", focus: "ESTABILIDADE & SUPORTE", desc: "Para profissionais focados em dedicaÃ§Ã£o integral e desenvolvimento contÃ­nuo nos escritÃ³rios de Joinville ou SÃ£o Paulo." },
                  { title: "Banco de Freelance", focus: "DEMANDAS SOB ESCALA", desc: "Projetos isolados pontuais pagos por frentes de entrega especÃ­ficas sÃªnior de Branding, Web ou CriaÃ§Ã£o de Identidades." },
                  { title: "Est?gio de Cria??o", focus: "FORMA??O OPERACIONAL", desc: "Para mentes promissoras acad?micas dispostas a adotar nossa rigorosa cultura e metodologia de design e processos." }
                ].map((bond, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-left">
                    <span className="font-mono text-[8.5px] text-brand border border-brand/15 bg-brand/5 px-2 py-0.5 rounded uppercase block w-max">
                      {bond.focus}
                    </span>
                    <h5 className="text-white font-display font-bold text-xs uppercase">{bond.title}</h5>
                    <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">{bond.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Etapas do Processo de AvaliaÃ§Ã£o de Candidatos */}
            <div className="space-y-6 pt-6 border-t border-zinc-100">
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest font-bold block">workflow seletivo // sem desvios</span>
                <h4 className="font-display font-black text-xl text-zinc-900 uppercase">Como avaliamos e integramos novos talentos</h4>
                <p className="text-zinc-500 text-xs sm:text-sm font-sans leading-relaxed max-w-xl">
                  Nosso processo de recrutamento Ã© transparente, rÃ¡pido e focado em competÃªncia operacional tÃ©cnica real:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { step: "01", title: "Ficha & Triagem", desc: "RevisÃ£o detalhada de seu portfÃ³lio de especialista, histÃ³rico de links e e-mail de contato." },
                  { step: "02", title: "Entrevista de Sintonia", desc: "Conversa rÃ¡pida de 15 minutos para avaliar sinergia com nossa rigorosa cultura e expectativas PJ/CLT." },
                  { step: "03", title: "Desafio TÃ©cnico Real", desc: "Um teste prÃ¡tico real remunerado focado no seu escopo imediato operacional de entrega diÃ¡ria." },
                  { step: "04", title: "Alinhamento & Onboarding", desc: "Assinatura segura de contratos, entrega do seu manual de onboarding e liberaÃ§Ã£o de seus acessos centrais." }
                ].map((st, sIdx) => (
                  <div key={sIdx} className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50 flex gap-4">
                    <div className="font-sans font-black text-zinc-300 text-2xl shrink-0 mt-0.5">{st.step}</div>
                    <div className="space-y-0.5 text-left">
                      <h5 className="text-zinc-900 font-display font-bold text-xs uppercase tracking-tight">{st.title}</h5>
                      <p className="text-zinc-500 text-[11px] leading-relaxed font-sans">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* APPLICATION FORM & LOCAL REVIEWS DESK */}
          <div id="application-form-section" className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8 border-t border-zinc-100 items-start">
            
            {/* Form desk on left (Dynamic Animated Multi-step Wizard) */}
            <div id="aplicacao-direta-anchor" className="lg:col-span-7 bg-zinc-50 border border-zinc-100 p-6 sm:p-9 rounded-3xl relative overflow-hidden space-y-6 min-h-[520px] flex flex-col justify-between">
              
              <div className="space-y-6">
                
                {/* Visual Step Progress Indicator */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {[1, 2, 3].map((step) => (
                      <React.Fragment key={step}>
                        <div 
                          onClick={() => {
                            // Let users go back to previous steps by clicking on the indicator if validated
                            if (step < currentStep) {
                              setCurrentStep(step);
                            } else if (step > currentStep) {
                              // If they try to skip ahead, validate step by step
                              if (currentStep === 1 && validateStep(1)) {
                                if (step === 3 && validateStep(2)) {
                                  setCurrentStep(3);
                                } else if (step === 2) {
                                  setCurrentStep(2);
                                }
                              } else if (currentStep === 2 && validateStep(2) && step === 3) {
                                setCurrentStep(3);
                              }
                            }
                          }}
                          className={`flex items-center justify-center w-8 h-8 rounded-xl text-xs font-sans font-bold transition-all duration-300 cursor-pointer ${
                            currentStep === step 
                              ? "bg-zinc-950 text-white shadow-md ring-2 ring-brand" 
                              : currentStep > step 
                                ? "bg-green-600 text-white" 
                                : "bg-white border border-zinc-200 text-zinc-400 hover:border-zinc-300"
                          }`}
                        >
                          {currentStep > step ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : step}
                        </div>
                        {step < 3 && (
                          <div className="flex-1 h-0.5 rounded-full overflow-hidden bg-zinc-250/70">
                            <motion.div 
                              className="h-full bg-green-600"
                              initial={{ width: "0%" }}
                              animate={{ width: currentStep > step ? "100%" : "0%" }}
                              transition={{ duration: 0.4 }}
                            />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Header text containing dynamic personalization */}
                  <div className="space-y-1 text-left">
                    <span className="font-mono text-[9px] text-brand bg-black px-2 py-0.5 rounded font-black uppercase tracking-widest inline-block">
                      ETAPA {currentStep} DE 3 " {currentStep === 1 ? "DADOS PESSOAIS" : currentStep === 2 ? "LINKS PROFISSIONAIS" : "CURR?CULO & APRESENTA??O"}
                    </span>
                    <h2 className="font-display font-black text-2xl text-zinc-900 uppercase tracking-tight">
                      {currentStep === 1 ? "IdentificaÃ§Ã£o PrimÃ¡ria" : currentStep === 2 ? "PresenÃ§a na Web" : "Ficha & Conquistas"}
                    </h2>
                    <p className="text-zinc-500 text-xs">
                      {currentStep === 1 
                        ? `Apresente-se brevemente para iniciarmos seu processo de seleÃ§Ã£o para a vaga de ${activeVacancy.title}.` 
                        : currentStep === 2 
                          ? `Excelente, ${formName.split(" ")[0]}! Agora, compartilhe os links onde seu trabalho Ã© exposto.` 
                          : `Quase lÃ¡! Para finalizar, anexe seu currÃ­culo e faÃ§a uma mini apresentaÃ§Ã£o profissional.`}
                    </p>
                  </div>
                </div>

                {/* Submitting the form block */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence mode="wait">
                    
                    {/* STEP 1: APRESENTA??O PRIM?RIA */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        <div id="field-name" className="space-y-1.5 text-left">
                          <label className="block text-[9.5px] uppercase tracking-widest font-bold text-zinc-500 font-mono">
                            Nome Completo *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                            <input
                              type="text"
                              placeholder="Ex: Carlos Silva"
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              className={`w-full bg-white border rounded-xl py-3 px-10 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 font-sans ${
                                errors.name ? "border-red-500 ring-1 ring-red-500/20" : "border-zinc-200"
                              }`}
                            />
                          </div>
                          {errors.name && <span className="text-red-500 text-[10px] font-sans block mt-1">{errors.name}</span>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div id="field-email" className="space-y-1.5 text-left">
                            <label className="block text-[9.5px] uppercase tracking-widest font-bold text-zinc-500 font-mono">
                              E-mail de Contato *
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                              <input
                                type="email"
                                placeholder="Ex: carlos@empresa.com"
                                value={formEmail}
                                onChange={(e) => setFormEmail(e.target.value)}
                                className={`w-full bg-white border rounded-xl py-3 px-10 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 font-sans ${
                                  errors.email ? "border-red-500 ring-1 ring-red-500/20" : "border-zinc-200"
                                }`}
                              />
                            </div>
                            {errors.email && <span className="text-red-500 text-[10px] font-sans block mt-1">{errors.email}</span>}
                          </div>

                          <div id="field-phone" className="space-y-1.5 text-left">
                            <label className="block text-[9.5px] uppercase tracking-widest font-bold text-zinc-500 font-mono">
                              WhatsApp de Contato *
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                              <input
                                type="tel"
                                placeholder="Ex: (47) 99999-9999"
                                value={formPhone}
                                onChange={(e) => setFormPhone(e.target.value)}
                                className={`w-full bg-white border rounded-xl py-3 px-10 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 font-sans ${
                                  errors.phone ? "border-red-500" : "border-zinc-200"
                                }`}
                              />
                            </div>
                            {errors.phone && <span className="text-red-500 text-[10px] font-sans block mt-1">{errors.phone}</span>}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: CONEXÃ•ES PROFISSIONAIS */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        <div id="field-linkedin" className="space-y-1.5 text-left">
                          <label className="block text-[9.5px] uppercase tracking-widest font-bold text-zinc-500 font-mono">
                            Perfil do LinkedIn *
                          </label>
                          <div className="relative">
                            <Linkedin className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                            <input
                              type="url"
                              placeholder="Ex: linkedin.com/in/seunome"
                              value={formLinkedin}
                              onChange={(e) => setFormLinkedin(e.target.value)}
                              className={`w-full bg-white border rounded-xl py-3 px-10 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 font-sans ${
                                errors.linkedin ? "border-red-500" : "border-zinc-200"
                              }`}
                            />
                          </div>
                          {errors.linkedin && <span className="text-red-500 text-[10px] font-sans block mt-1">{errors.linkedin}</span>}
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label className="block text-[9.5px] uppercase tracking-widest font-bold text-zinc-500 font-mono">
                            Link do PortfÃ³lio / GitHub (Opcional)
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                            <input
                              type="url"
                              placeholder="Ex: behance.net/seunome ou github.com/seunome"
                              value={formPortfolio}
                              onChange={(e) => setFormPortfolio(e.target.value)}
                              className="w-full bg-white border border-zinc-200 rounded-xl py-3 px-10 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 font-sans"
                            />
                          </div>
                          <p className="text-[10px] text-zinc-450 leading-tight">
                            Gostamos de analisar cases prÃ¡ticos. Recomendamos inserir seu portfÃ³lio para ganhar destaque preferencial na triagem.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: CURRÃCULO & MINI LETTER */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        {/* Drag and Drop Zone */}
                        <div className="space-y-1.5 text-left">
                          <label className="block text-[9.5px] uppercase tracking-widest font-bold text-zinc-500 font-mono">
                            Adicionar CurrÃ­culo (PDF/DOCX)
                          </label>
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-5 hover:bg-zinc-100/50 transition-all text-center cursor-pointer flex flex-col items-center justify-center ${
                              isDragging 
                                ? "border-zinc-950 bg-zinc-100" 
                                : uploadedFileName 
                                  ? "border-green-500/50 bg-green-500/[0.01]" 
                                  : "border-zinc-200 hover:border-zinc-300"
                            }`}
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept=".pdf,.docx"
                              className="hidden"
                            />
                            
                            <FileText className={`w-8 h-8 mb-1.5 ${uploadedFileName ? "text-green-600" : "text-zinc-400"}`} />
                            {uploadedFileName ? (
                              <div className="space-y-1">
                                <p className="text-xs text-zinc-900 font-bold">{uploadedFileName}</p>
                                <p className="text-[9px] text-brand bg-black px-1.5 py-0.5 rounded font-mono uppercase inline-block">Anexo Pronto</p>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <p className="text-xs text-zinc-800 font-bold">
                                  Arraste seu PDF aqui ou <span className="text-zinc-650 underline">explore arquivos</span>
                                </p>
                                <p className="text-[9.5px] text-zinc-400 font-sans">Tamanho limite: 10MB</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Miniature Pitch Letter */}
                        <div id="field-coverLetter" className="space-y-1.5 text-left">
                          <label className="block text-[9.5px] uppercase tracking-widest font-bold text-zinc-500 font-mono">
                            Diferencial &amp; Foco em Resultados *
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Conte em poucas linhas seus maiores cases de conversÃ£o sÃ³lida ou reestruturaÃ§Ã£o estÃ©tica..."
                            value={formCoverLetter}
                            onChange={(e) => setFormCoverLetter(e.target.value)}
                            className={`w-full bg-white border rounded-xl p-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 font-sans leading-relaxed ${
                              errors.coverLetter ? "border-red-500" : "border-zinc-200"
                            }`}
                          />
                          {errors.coverLetter && <span className="text-red-500 text-[10px] font-sans block mt-1">{errors.coverLetter}</span>}
                        </div>
                        <label className="flex items-start gap-2 text-left text-[10px] text-zinc-500 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={consent}
                            onChange={(event) => setConsent(event.target.checked)}
                            className="mt-0.5 h-3.5 w-3.5 accent-[var(--color-brand)]"
                          />
                          <span>Autorizo o uso destes dados para a seleção e o Banco de Talentos da TAG08.</span>
                        </label>
                        {submitError ? <p role="alert" className="text-[10px] text-red-500">{submitError}</p> : null}
                      </motion.div>
                    )}

                  </AnimatePresence>
                </form>

              </div>

              {/* Step Navigation Controls bottom footer */}
              <div className="pt-6 border-t border-zinc-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[10px] text-zinc-400 leading-tight flex items-center gap-1.5 self-start sm:self-center">
                  <Lock className="w-3.5 h-3.5 text-zinc-350 shrink-0" /> GestÃ£o privativa de dados e cookies locais.
                </p>
                
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-5 py-3 border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 font-mono font-bold text-[10.5px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      Voltar
                    </button>
                  )}
                  
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full sm:w-auto px-6.5 py-3 bg-zinc-950 text-white font-mono font-bold text-[10.5px] uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Continuar <ArrowRight className="w-3.5 h-3.5 text-brand" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full sm:w-auto px-6.5 py-3 bg-brand hover:bg-brand-dark text-black font-mono font-bold text-[10.5px] uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_12px_rgba(var(--color-brand-rgb),0.15)] cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {submitting ? "Enviando..." : "Enviar Candidatura"} <Send className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  )}
                </div>
              </div>

              {/* SUCCESS MODAL PANEL */}
              <AnimatePresence>
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 z-30"
                  >
                    <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-5 border border-green-150">
                      <CheckCircle2 className="w-8 h-8 animate-bounce" />
                    </div>
                    <h3 className="font-display font-black text-xl text-zinc-900 uppercase tracking-tight">
                      Candidatura Recebida!
                    </h3>
                    <p className="text-zinc-500 text-xs sm:text-sm mt-2 max-w-sm leading-relaxed">
                      Sua triagem de competÃªncia para a vaga de <span className="text-zinc-950 font-bold">{activeVacancy.title}</span> foi consolidada. Retornaremos em breve.
                    </p>
                    
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <button
                        onClick={() => setSubmitSuccess(false)}
                        className="px-4.5 py-2.5 bg-zinc-950 text-white font-mono font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        Enviar Outra Ficha
                      </button>
                      <button
                        onClick={() => onNavigate("/")}
                        className="px-4.5 py-2.5 bg-zinc-100 text-zinc-800 border border-zinc-200 font-mono text-[10px] uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all cursor-pointer"
                      >
                        PÃ¡gina Inicial
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Applicant tracker on right */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-zinc-50 border border-zinc-100 p-5 sm:p-6.5 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 font-mono text-[9px] text-brand bg-black px-2 py-0.5 rounded font-bold uppercase tracking-wider self-start inline-flex">
                  <Terminal className="w-3.5 h-3.5 animate-pulse" />
                  Console de Rastreamento
                </div>
                
                <h3 className="font-display font-black text-lg text-zinc-900 uppercase tracking-tight leading-none">
                  Suas Fichas Enviadas
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Confira em tempo real o status operacional do seu processo seletivo armazenado no navegador.
                </p>

                <div className="space-y-2.5 pt-1">
                  {applications.length === 0 ? (
                    <div className="border border-dashed border-zinc-200 rounded-2xl p-6 text-center text-zinc-400 font-mono text-[9.5px] space-y-1 uppercase">
                      <p>Nenhuma ficha enviada recentemente.</p>
                      <p className="text-zinc-400 text-[8.5px]">Seu status aparecerÃ¡ de forma privativa assim que submetido.</p>
                    </div>
                  ) : (
                    applications.map((app) => (
                      <div 
                        key={app.id}
                        className="bg-white border border-zinc-250/65 p-4 rounded-xl space-y-2 relative group hover:border-zinc-950 transition-colors"
                      >
                        <button
                          onClick={(e) => handleDeleteApplication(app.id, e)}
                          className="absolute top-4 right-4 p-1 shadow-sm opacity-0 group-hover:opacity-100 bg-zinc-50 hover:bg-zinc-100 text-zinc-400 hover:text-red-500 rounded-lg transition-all cursor-pointer"
                          title="Remover histÃ³rico"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-[8.5px] text-brand bg-black px-1.5 py-0.5 rounded font-bold">
                            {app.id}
                          </span>
                          <span className="text-[9px] font-bold font-sans px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-green-500 animate-ping" /> {app.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                            {app.role}
                          </h4>
                          <p className="text-[10px] text-zinc-400 font-sans">
                            Submetido em: {app.submittedAt}
                          </p>
                        </div>

                        <div className="border-t border-zinc-100 pt-2 flex justify-between items-center text-[10px] text-zinc-500">
                          <span className="truncate max-w-[130px] font-mono text-[9px]">CV: {app.fileName}</span>
                          <a 
                            href={app.linkedin} 
                            target="_blank" 
                            rel="noreferrer"
                            className="hover:text-zinc-900 font-sans text-[9px] font-bold flex items-center gap-0.5"
                          >
                            LinkedIn <ArrowRight className="w-2.5 h-2.5 text-brand" />
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Cultural Banner */}
              <div className="bg-zinc-950 text-white p-6.5 rounded-3xl text-left space-y-3.5 shadow-md relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
                <div className="inline-flex px-2 py-0.5 bg-brand/10 text-brand font-mono text-[9px] font-black uppercase rounded-md">
                  CULTURA TAG08
                </div>
                <h4 className="font-display font-bold text-white uppercase text-xs sm:text-sm">
                  Pacto de Alinhamento de Valor
                </h4>
                <p className="text-zinc-400 text-[11.5px] leading-relaxed font-sans">
                  Desenvolvemos pessoas que gostam de processos independentes com metas claras de performance e transparÃªncia. Se vocÃª procura um lugar sem drama operacional com alto ticket B2B, faÃ§a sua candidatura.
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
      
    </div>
  );
}
