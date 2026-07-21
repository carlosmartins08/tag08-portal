import React, { useEffect, useRef, useState } from "react";
import { 
  Building2, 
  User, 
  MapPin, 
  Globe, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Cpu, 
  Palette, 
  FileCode, 
  Gauge, 
  Sparkles, 
  ClipboardCheck, 
  ExternalLink,
  Lock,
  ShieldAlert,
  Send,
  MessageCircle,
  FolderDot
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { activateOnKeyboard } from "../../../lib/keyboard";
import {
  ONBOARDING_QUEUE_MAX_AGE_DAYS,
  ONBOARDING_QUEUE_MAX_RETRIES,
  ONBOARDING_QUEUE_SYNC_WINDOW_SECONDS,
  ONBOARDING_PAYLOAD_VERSION
} from "../../../../server/onboardingContract";
import { buildBrazilWhatsAppUrl } from "../../../config/siteNetwork";
import { trackFormStart, trackFormStep, trackFormSubmit, trackLeadEvent, trackOutboundClick } from "../../../lib/analytics";

type Language = "pt" | "en" | "es";
type DeliveryState = "idle" | "online" | "queued" | "error";
type QueueStatus = "pending" | "sent" | "retrying" | "error";
type OnboardingDeliveryStatus = "received" | "accepted" | "queued" | "failed";
type OnboardingSubmitResult = {
  ok: boolean;
  submissionId: string;
  status: OnboardingDeliveryStatus;
  receivedAt: string;
  error?: string;
};
type OnboardingSubmissionPayload = Record<string, unknown>;
type OnboardingQueueEntry = {
  id: string;
  submittedAt: string;
  payload: OnboardingSubmissionPayload;
  attempts: number;
  status: QueueStatus;
  lastAttemptAt?: string;
  nextAttemptAt?: string;
  lastError?: string;
};

const ONBOARDING_QUEUE_KEY = "tag08_onboarding_queue";
type OnboardingSubmitErrorKind = "validation" | "transport" | "payload";
type OnboardingSubmitErrorData = {
  kind: OnboardingSubmitErrorKind;
  message: string;
  status?: number;
};

class OnboardingSubmitError extends Error {
  kind: OnboardingSubmitErrorKind;
  status?: number;
  constructor(message: string, kind: OnboardingSubmitErrorKind, status?: number) {
    super(message);
    this.kind = kind;
    this.status = status;
    this.name = "OnboardingSubmitError";
  }
}

const isValidSubmissionResult = (value: unknown): value is OnboardingSubmitResult => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<OnboardingSubmitResult>;
  return (
    typeof candidate.ok === "boolean" &&
    typeof candidate.submissionId === "string" &&
    typeof candidate.receivedAt === "string" &&
    typeof candidate.status === "string" &&
    ["received", "accepted", "queued", "failed"].includes(candidate.status)
  );
};

const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Header & Titles
    op_tool: "Ferramenta Operacional de Integração",
    title_prefix: "Assistente de Onboarding",
    header_desc: "Inicie a engenharia de seu projeto de forma leve e progressiva. Evitamos a rigidez de formulários tradicionais por meio de perguntas táticas guiadas.",
    
    // Privacy Sidebar
    privacy_title: "GARANTIAS DE PRIVACIDADE",
    privacy_desc: "Sua empresa goza de absoluta proteção jurídica. Assinamos NDAs de confidencialidade padrão caso seja necessário antes do início de qualquer procedimento.",
    privacy_indicators: "PROTETORES ATIVOS:",
    privacy_p1: "Tratamento de dados sob a LGPD",
    privacy_p2: "Criptografia de upload no formulário",
    privacy_p3: "Suporte corporativo sob demanda",
    
    // Step indicator & generic
    step_label: "ETAPA",
    step_of: "DE",
    completed: "CONCLUÍDO",
    senior_info: "Informações sênior seguras",
    live_state: "LIVE STATE",
    
    // Buttons & Actions
    btn_start: "Começar Onboarding",
    btn_back: "Voltar",
    btn_next: "Avançar",
    btn_submit: "Enviar Onboarding Completo",
    btn_submitting: "Enviando dados...",
    btn_whatsapp: "Falar com a TAG08 no WhatsApp",
    back_to_start: "  Voltar para o início",
    status_idle: "Pronto para envio",
    status_online: "Formulário enviado com sucesso para o fluxo operacional da TAG08.",
    status_online_ref: "Envio confirmado: {status} ({submissionId}) em {receivedAt}.",
    status_queue_fallback: "Sem conectividade no momento. Seu envio foi salvo em fila local e será reenviado automaticamente.",
    status_queue_store_error: "Não foi possível salvar sua submissão para retry automático.",
    status_validation_error: "Dados inválidos: {details}. Corrija os campos e tente novamente.",
    status_transport_error: "Não foi possível concluir o envio agora. Tentativa em andamento em seguida.",
    status_sync_error: "Não foi possível sincronizar envios pendentes automaticamente.",
    status_queue_summary: "Há {count} envio(s) aguardando sincronização com a API.",
    
    // Step 0: Welcome Screen
    welcome_title: "Bem-vindo  TAG08. <br />Vamos organizar o início do seu projeto.",
    welcome_desc: "Este assistente vai reunir as informações essenciais para preparar sua jornada com clareza, segurança e direção. Responda no seu ritmo. O objetivo não burocratizar o início, mas evitar retrabalho e preparar nossa equipe para te atender melhor.",
    est_time: "Tempo Estimado",
    est_time_desc: "8 a 15 minutos em preenchimento fluido. Não é necessário preencher tudo de uma vez.",
    pass_guideline: "Diretriz de Senhas",
    pass_desc: "Não solicitamos ou aceitamos qualquer senha por este formulário. Suas credenciais estão preservadas.",
    
    // Sidebar Summary Box
    sidebar_title: "RESUMO DE CONSOLIDAÇÃO",
    sidebar_org: "ORGANIZAÇÃO",
    sidebar_rep: "RESPONSÁVEL",
    sidebar_moment: "MOMENTO SELECIONADO",
    sidebar_scope: "ESCOPO CONTRATADO",
    sidebar_target_90: "ALVO EM 90 DIAS",
    sidebar_pending: "Pendente preenchimento...",
    sidebar_waiting: "Aguardando dados...",
    sidebar_none_selected: "Não selecionado...",
    sidebar_no_service: "Nenhum serviço selecionado...",
    sidebar_lang_val: "Idioma",
    
    // Step 1: Dados da Empresa
    empresa_label_name: "Nome da Empresa ou Projeto *",
    empresa_placeholder_name: "Ex: Consultório Clínico Avançado",
    empresa_label_cnpj: "CNPJ ou CPF (Para faturamento de notas)",
    empresa_placeholder_cnpj: "Ex: 00.000.000/0001-00",
    empresa_label_city: "Cidade / Estado (Localização Sede)",
    empresa_placeholder_city: "Ex: São Paulo / SP",
    empresa_label_site: "Endereço do Site Institucional",
    empresa_placeholder_site: "Ex: https://suaempresa.com.br",
    empresa_label_insta: "Instagram Corporativo",
    empresa_placeholder_insta: "Ex: instagram.com/empresa",
    empresa_label_linkedin: "LinkedIn Institucional / Pessoal",
    empresa_placeholder_linkedin: "Ex: linkedin.com/company/suaempresa",
    empresa_lang_title: "Idioma Preferencial de Atendimento / Preferred Language",
    empresa_lang_badge: "Global Coverage / Suporte Internacional",
    empresa_lang_desc: "Oferecemos atendimento técnico corporativo em português para empresas brasileiras, com suporte operacional de engenharia em inglês ou espanhol para clientes internacionais.",
    empresa_lang_pt_desc: "Equipe nativa e playbooks em PT-BR",
    empresa_lang_en_desc: "Global support & English technical delivery",
    empresa_lang_es_desc: "Soporte y flujos estratégicos en español",
    
    // Step 2: Responsável / Contatos
    equipe_label_name: "Qual o seu nome? *",
    equipe_placeholder_name: "Ex: Dr. Fernando Guedes",
    equipe_label_role: "Cargo / Função na Empresa",
    equipe_placeholder_role: "Ex: Fundador e Diretor Clínico",
    equipe_label_email: "E-mail de Contato Comercial *",
    equipe_placeholder_email: "Ex: dr@clinicaguedes.com",
    equipe_label_whatsapp: "WhatsApp Corporativo / Pessoal *",
    equipe_placeholder_whatsapp: "Ex: (11) 99999-9999",
    equipe_section_focal: "Definies de Ponto Focal",
    equipe_label_ti: "Ponto focal técnico (ex: DNS, TI)",
    equipe_placeholder_ti: "Ex: Camila (Marketing)",
    equipe_label_approver: "Quem aprova decisões estratégicas? *",
    equipe_placeholder_approver: "Ex: Fernando Guedes",
    equipe_label_finance: "Recebe o financeiro? (Notas/Boletos)",
    equipe_placeholder_finance: "Ex: financeiro@empresa.com",
    
    // Step 3: Radar
    radar_label_moment: "Atualmente, qual destas frases melhor simboliza a realidade da sua empresa? *",
    radar_label_priority: "Caso a TAG08 pudesse solucionar uma prioridade primeiro, qual seria? *",
    radar_label_term: "Termômetro de Organização Atual",
    radar_term_desc: "Arraste para avaliar a organização e padrão de sua comunicação ou operações internas atualmente.",
    radar_term_score: "Nota:",
    radar_term_n1: "1\nMuito improvisada",
    radar_term_n2: "2\nExiste algo, mas sem padrão",
    radar_term_n3: "3\nFunciona, mas precisa de capricho",
    radar_term_n4: "4\nBoa, mas quer escalar de nível",
    radar_term_n5: "5\nEstruturada e em evolução",
    
    // Step 4: Serviços
    escopo_title: "MAPEAMENTO DE ENTRADA",
    escopo_heading: "Quais foram as soluções ou frentes acordadas com o comercial da TAG08?",
    escopo_desc: "Selecione um ou mais módulos abaixo contratados para ativarmos os briefings correspondentes.",
    escopo_label_custom: "Caso tenha escolhido \"Outro\", descreva brevemente qual o escopo contratado:",
    escopo_placeholder_custom: "Ex: Assessoria em automações de CRMs específicos",
    
    // Step 5: Briefing
    briefing_module_title: "MÓDULO CUSTOMIZADO ATIVO",
    briefing_module_desc: "Sua empresa contratou {services}. Responda abaixo os detalhes operacionais que ditou nossa produção técnica:",
    briefing_not_selected_desc: "Descreva brevemente detalhes, metas ou escopo contratado para as divisões assinaladas:",
    briefing_not_selected_placeholder: "Informe aqui metas de tráfego, detalhes do ecossistema audiovisual ou observações específicas do seu projeto.",
    
    // Step 6: Materiais
    materiais_title: "MATERIAIS E LINKS DE SUPORTE",
    materiais_desc: "Forneça links de pastas compartilhadas públicas ou materiais comerciais para abastecer nossa equipe (Ex: Google Drive, Dropbox, Figma).",
    materiais_warning: "ALERTA SEGURO: Não insira senhas sensíveis ou PINs de e-mails em nenhum dos campos.",
    materiais_label_drive: "Link Pasta Principal (Google Drive/Dropbox)",
    materiais_label_insta: "Link Instagram Atual",
    materiais_label_site: "Link Site Institucional do Negócio",
    materiais_label_portfolio: "Link Portfólio / Catálogo Oficial",
    materiais_label_references: "Referências Visuais (Links ou Pinterest)",
    materiais_label_documents: "Manual de Marca ou Logotipos (.PDF / .AI / .PNG)",
    materiais_label_commercial: "Apresentação Comercial / Pitch Deck",
    
    // Step 7: Expectativas
    expectativas_title: "DIREÇÃO E EXPECTATIVAS DE SUCESSO na TAG08",
    expectativas_subtitle: "Por que você buscou a TAG08 neste exato momento corporativo?",
    expectativas_desc: "Compreender os pontos sensíveis da sua marca nos blinda contra falhas e acelera a transição de seus novos canais.",
    expectativas_placeholder_1: "Ex: Sentimos que nossa comunicação atual nos faz parecer menores do que realmente somos...",
    expectativas_label_tried: "O que você já tentou antes para resolver esse desafio? (Ex: agências, time interno)",
    expectativas_placeholder_tried: "Ex: Contratamos uma agência tradicional de postagens cotidianas...",
    expectativas_label_did_not_work: "O que NO funcionou nessas tentativas passadas corporativas?",
    expectativas_placeholder_did_not_work: "Ex: Muitas postagens sem estética profissional, artes genéricas e falta de inteligência comercial...",
    expectativas_label_good_result: "Ao final de 90 dias de parceria com a TAG08, o que faria você sentir de verdade que deu o passo correto?",
    expectativas_placeholder_good_result: "Ex: Um posicionamento institucional sólido que atraia leads corporativos qualificados...",
    expectativas_label_urgency: "Qual é a sua principal urgência operacional ou comercial no momento?",
    expectativas_placeholder_urgency: "Ex: Redesenhar nosso site institucional que está obsoleto...",
    expectativas_label_not_err: "O que nós NÃO podemos errar de jeito nenhum na sua comunicação institucional ou de processos? *",
    expectativas_placeholder_not_err: "Ex: Linguagem informal demais, ou alterar a paleta de cores original da marca...",
    
    // Step 8: Consentimento
    consent_title: "TERMOS DE CONSENTIMENTO & SEGURANÇA",
    consent_subtitle: "Autorização para upload estratégico operacional de diretrizes",
    consent_desc: "Leia e marque as caixas abaixo para fins operacionais imediatos de kick-off.",
    consent_opt1: "Declaro que todas as informações corporativas prestadas são íntegras e verdadeiras.",
    consent_opt2: "Autorizo o uso destes dados unicamente pela equipe técnica da TAG08 para estrutura estratégica.",
    consent_opt3: "Confirmo que não forneci qualquer credencial de acesso direto ou senha de segurança neste fluxo.",
    
    // Step 9: Finalizado (WhatsApp)
    finalized_badge: "ONBOARDING ENVIADO COM SUCESSO",
    finalized_title: "Integração operacional em andamento!",
    finalized_desc_1: "Seus dados de direção corporativa foram consolidados com sucesso e já está na fila de triagem técnica de nossa equipe de engenharia e branding.",
    finalized_desc_2: "Para acelerar seu kickoff e confirmar o recebimento direto com o diretor técnico do seu projeto, clique no link abaixo para nos notificar via WhatsApp corporativo.",
    whatsapp_template_msg: "Olá time TAG08! Concluímos o preenchimento do nosso onboarding institucional via Assistente Conversacional.\\n\\nEmpresa: {company}\\nRepresentante: {name}\\nMeta dos próximos 90 dias: {goal}.\\n\\nAguardamos contato técnico para agendarmos nosso kickoff!",
    
    // Errors
    err_company_name: "O nome da sua empresa é essencial para darmos o pontapé.",
    err_responsible_name: "Informe o nome do responsável principal.",
    err_responsible_email: "Insira um endereço de e-mail corporativo válido.",
    err_responsible_whatsapp: "Precisamos de um número de WhatsApp ativo para contato técnico.",
    err_business_moment: "Por favor, selecione a alternativa que mais condiz com o momento de sua empresa.",
    err_priority_map: "Por favor, assinale qual rea de prioridade podemos te auxiliar primeiro.",
    err_selected_services: "Selecione ao menos um dos formatos ou serviços contratados de seu projeto.",
    err_consent: "Você precisa estar ciente e marcar todos os 3 tópicos de consentimento sob LGPD para submeter o onboarding."
  },
  en: {
    // Header & Titles
    op_tool: "Integration Operational Tool",
    title_prefix: "Onboarding Assistant",
    header_desc: "Start your project engineering smoothly and progressively. We avoid rigid traditional forms through guided tactical questions.",
    
    // Privacy Sidebar
    privacy_title: "PRIVACY GUARANTEES",
    privacy_desc: "Your company enjoys absolute legal protection. If necessary, we sign standard confidentiality NDAs before initiating any procedure.",
    privacy_indicators: "ACTIVE PROTECTORS:",
    privacy_p1: "Data processing under LGPD/GDPR regulations",
    privacy_p2: "Upload encryption within the form",
    privacy_p3: "On-demand corporate support",
    
    // Step indicator & generic
    step_label: "STEP",
    step_of: "OF",
    completed: "COMPLETED",
    senior_info: "Secure corporate data",
    live_state: "LIVE STATE",
    
    // Buttons & Actions
    btn_start: "Start Onboarding",
    btn_back: "Back",
    btn_next: "Next",
    btn_submit: "Submit Onboarding Guidelines",
    btn_submitting: "Submitting Data...",
    btn_whatsapp: "Message TAG08 on WhatsApp",
    back_to_start: "  Back to home",
    status_idle: "Ready to submit",
    status_online: "Your onboarding data has been accepted and is now being processed.",
    status_online_ref: "Submission accepted: {status} ({submissionId}) at {receivedAt}.",
    status_queue_fallback: "Connection interrupted. Submission saved in local queue and will retry automatically.",
    status_queue_store_error: "Could not save submission for automatic retry.",
    status_validation_error: "Validation issue: {details}. Correct the fields and try again.",
    status_transport_error: "Could not complete submission now. Retry will continue automatically.",
    status_sync_error: "Could not synchronize pending queue automatically.",
    status_queue_summary: "{count} queued items waiting for synchronization.",
    
    // Step 0: Welcome Screen
    welcome_title: "Welcome to TAG08. <br />Let's organize the start of your project.",
    welcome_desc: "This assistant will gather the essential information to prepare your journey with clarity, security, and direction. Answer at your own pace. The goal is not to create bureaucracy, but to avoid rework and prepare our team to serve you better.",
    est_time: "Estimated Time",
    est_time_desc: "8 to 15 minutes of fluid completion. No need to fill everything at once.",
    pass_guideline: "Password Guidelines",
    pass_desc: "We do not request or accept any passwords through this form. Your credentials are safe.",
    
    // Sidebar Summary Box
    sidebar_title: "CONSOLIDATION SUMMARY",
    sidebar_org: "COMPANY",
    sidebar_rep: "REPRESENTATIVE",
    sidebar_moment: "CHALLENGE SELECTED",
    sidebar_scope: "CONTRACTED SCOPE",
    sidebar_target_90: "90-DAY TARGET",
    sidebar_pending: "Pending completion...",
    sidebar_waiting: "Awaiting details...",
    sidebar_none_selected: "None selected...",
    sidebar_no_service: "No services selected...",
    sidebar_lang_val: "Language",
    
    // Step 1: Dados da Empresa
    empresa_label_name: "Company or Project Name *",
    empresa_placeholder_name: "e.g., Advanced Clinical Office",
    empresa_label_cnpj: "Registration Code (CNPJ / EIN / Corporate ID)",
    empresa_placeholder_cnpj: "e.g., Tax Number / EIN",
    empresa_label_city: "City / State / Country (Headquarters)",
    empresa_placeholder_city: "e.g., Miami / FL / USA",
    empresa_label_site: "Corporate Website URL",
    empresa_placeholder_site: "e.g., https://yourcompany.com",
    empresa_label_insta: "Official Instagram",
    empresa_placeholder_insta: "e.g., instagram.com/company",
    empresa_label_linkedin: "Corporate / Personal LinkedIn",
    empresa_placeholder_linkedin: "e.g., linkedin.com/company/yourcompany",
    empresa_lang_title: "Preferred Service Language / Idioma Preferencial",
    empresa_lang_badge: "Global Coverage / International Support",
    empresa_lang_desc: "We offer technical corporate service in Portuguese for Brazilian companies, as well as operational engineering support in English or Spanish for international clients.",
    empresa_lang_pt_desc: "Native team and playbooks in PT-BR",
    empresa_lang_en_desc: "Global support & English technical delivery",
    empresa_lang_es_desc: "Support and strategic flows in Spanish",
    
    // Step 2: Responsável / Contatos
    equipe_label_name: "What is your name? *",
    equipe_placeholder_name: "e.g., Mary Smith",
    equipe_label_role: "Role / Position in Company",
    equipe_placeholder_role: "e.g., Founder & Clinical Director",
    equipe_label_email: "Business Contact Email *",
    equipe_placeholder_email: "e.g., mary@yourcompany.com",
    equipe_label_whatsapp: "Corporate / Personal WhatsApp *",
    equipe_placeholder_whatsapp: "e.g., +1 (555) 019-2834",
    equipe_section_focal: "Focal Point Definitions",
    equipe_label_ti: "Technical focal point (e.g. DNS, IT)",
    equipe_placeholder_ti: "e.g., Camilla (Marketing)",
    equipe_label_approver: "Who approves strategic decisions? *",
    equipe_placeholder_approver: "e.g., CEO, Marketing Director or Mary herself",
    equipe_label_finance: "Receives billing / invoices?",
    equipe_placeholder_finance: "e.g., billing@company.com",
    
    // Step 3: Radar
    radar_label_moment: "What is your ecosystem's biggest challenge? *",
    radar_label_priority: "What is your main commercial priority with TAG08? *",
    radar_label_term: "Current Organization Level",
    radar_term_desc: "Drag to rate the general organization and standards of your communications u operations.",
    radar_term_score: "Score:",
    radar_term_n1: "1\nHighly improvised",
    radar_term_n2: "2\nSome rules exist, but no standards",
    radar_term_n3: "3\nWorks, but needs details",
    radar_term_n4: "4\nGood, but looking to scale up",
    radar_term_n5: "5\nFully structured and scaling",
    
    // Step 4: Serviços
    escopo_title: "INPUT SCOPE",
    escopo_heading: "What are the modules or service areas agreed with TAG08?",
    escopo_desc: "Select one or more modules below to unlock corresponding brief templates.",
    escopo_label_custom: "If you checked \"Other\", briefly describe the custom scope contracted:",
    escopo_placeholder_custom: "e.g., CRM automation mapping & advisory",
    
    // Step 5: Briefing
    briefing_module_title: "ACTIVE CUSTOMIZED BRIEF",
    briefing_module_desc: "Your company has selected {services}. Please provide operational details below:",
    briefing_not_selected_desc: "Briefly describe details, goals, or scope contracted for the checked divisions:",
    briefing_not_selected_placeholder: "Enter traffic goals, audiovisual assets, or project notes here.",
    
    // Step 6: Materiais
    materiais_title: "SUPPORTING FILES & LINKS",
    materiais_desc: "Provide public shared links or assets to supply our creative and technical team (e.g., Drive, Figma, templates).",
    materiais_warning: "SECURE ALERTE: Do not share passwords or credentials on this form.",
    materiais_label_drive: "Main Folder Link (Google Drive/Dropbox)",
    materiais_label_insta: "Current Instagram Link",
    materiais_label_site: "Current Corporate Link",
    materiais_label_portfolio: "Catalog / Corporate Deck Link",
    materiais_label_references: "Visual Reference Link (or Pinterest)",
    materiais_label_documents: "Brand Manual or Logotypes (.PDF / .AI / .PNG)",
    materials_label_commercial: "Commercial Slides / Pitch Deck",
    
    // Step 7: Expectativas
    expectativas_title: "STRATEGIC DIRECTION & 90-DAY METRICS",
    expectativas_subtitle: "Why did you reach out to TAG08 at this exact time?",
    expectativas_desc: "Understanding the sensitive points of your business protects our operations and speeds up onboarding setup.",
    expectativas_placeholder_1: "e.g., We feel our current messaging makes our business look smaller than it is...",
    expectativas_label_tried: "What have you tried before to solve this? (e.g., agencies, in-house team)",
    expectativas_placeholder_tried: "e.g., We worked with a local content agency focusing on daily raw posts...",
    expectativas_label_did_not_work: "What did NOT work in those past attempts?",
    expectativas_placeholder_did_not_work: "e.g., Too many visual styles, low strategic intelligence, high rework...",
    expectativas_label_good_result: "At the end of your first 90 days with TAG08, what achievements make you feel we made the correct step?",
    expectativas_placeholder_good_result: "e.g., Clear brand authority online with qualified inbound B2B leads...",
    expectativas_label_urgency: "What is your main tactical or business urgency right now?",
    expectativas_placeholder_urgency: "e.g., Overhaul our outdated institutional website...",
    expectativas_label_not_err: "What must we NOT get wrong under any circumstances in your communication? *",
    expectativas_placeholder_not_err: "e.g., Sounding too informal, or changing our core corporate colors...",
    
    // Step 8: Consentimento
    consent_title: "CONSENT & PRIVACY COVENANTS",
    consent_subtitle: "Data authorization to initiate launch procedures",
    consent_desc: "Read and check the fields below for immediate kick-off onboarding setup.",
    consent_opt1: "I declare that all corporate information provided is honest and true.",
    consent_opt2: "I authorize the use of this data solely by the TAG08 technical team for strategic structure setup.",
    consent_opt3: "I confirm that I have not provided any direct passwords or security credentials in this wizard.",
    
    // Step 9: Finalizado (WhatsApp)
    finalized_badge: "ONBOARDING SUBMITTED SUCCESSFULLY",
    finalized_title: "Integration setup starts now!",
    finalized_desc_1: "Your integration data has been integrated on your systems and is currently being analyzed by our senior creative and engineering teams.",
    whatsapp_template_msg: "Hello TAG08 team! I have completed our Onboarding Guidelines via the Conversational Assistant.\\n\\nCompany: {company}\\nRepresentative: {name}\\nTarget 90 days: {goal}.\\n\\nLooking forward to scheduling our kickoff!",
    
    // Errors
    err_company_name: "Please fill in the Company Name in Step 1.",
    err_responsible_name: "Please fill in Representative details (Step 2).",
    err_responsible_email: "Please enter a valid corporate email address.",
    err_responsible_whatsapp: "We need an active WhatsApp number for tactical contact.",
    err_business_moment: "Please select both the challenge and priority (Step 3).",
    err_priority_map: "Please select which area of priority we can assist you with first.",
    err_selected_services: "Please select at least one of the contracted services for your project.",
    err_consent: "You must review and check all 3 consent fields under regulation policies to submit onboarding."
  },
  es: {
    // Header & Titles
    op_tool: "Herramienta Operacional de Integración",
    title_prefix: "Asistente de Onboarding",
    header_desc: "Inicie la ingeniería de su proyecto de manera fluida y progresiva. Evitamos la rigidez de formularios tradicionales mediante preguntas tácticas guiadas.",
    
    // Privacy Sidebar
    privacy_title: "GARANTAS DE PRIVACIDAD",
    privacy_desc: "Su empresa goza de absoluta protección jurídica. Si es necesario, firmamos NDAs estándar de confidencialidad antes de iniciar cualquier procedimiento.",
    privacy_indicators: "PROTECTORES ACTIVOS:",
    privacy_p1: "Procesamiento bajo regulaciones de protección de datos",
    privacy_p2: "Encriptacin de archivos adjuntos en el formulario",
    privacy_p3: "Soporte corporativo especializado bajo demanda",
    
    // Step indicator & generic
    step_label: "ETAPA",
    step_of: "DE",
    completed: "COMPLETADO",
    senior_info: "Datos corporativos seguros",
    live_state: "LIVE STATE",
    
    // Buttons & Actions
    btn_start: "Comenzar Onboarding",
    btn_back: "Volver",
    btn_next: "Siguiente",
    btn_submit: "Enviar Onboarding Completo",
    btn_submitting: "Transmitiendo datos...",
    btn_whatsapp: "Contactar a TAG08 en WhatsApp",
    back_to_start: "  Volver al inicio",
    status_idle: "Listo para enviar",
    status_online: "Los datos se enviaron y están siendo procesados.",
    status_online_ref: "Envío confirmado: {status} ({submissionId}) a las {receivedAt}.",
    status_queue_fallback: "Sin conexión. La solicitud se guardó en cola local y se reenviará automáticamente.",
    status_queue_store_error: "No fue posible guardar la solicitud para reintento automático.",
    status_validation_error: "Error de validación: {details}. Corrija los campos y vuelva a intentar.",
    status_transport_error: "No fue posible completar el envío ahora. Reintentaremos automáticamente.",
    status_sync_error: "No se pudo sincronizar la cola pendiente automáticamente.",
    status_queue_summary: "Hay {count} envío(s) esperando sincronización.",
    
    // Step 0: Welcome Screen
    welcome_title: "Bienvenido a TAG08. <br />Vamos a organizar el inicio de su proyecto.",
    welcome_desc: "Este asistente reunir la información esencial para trazar su camino estratégico con claridad, seguridad y dirección. Responda a su propio ritmo. El objetivo no es burocratizar el inicio, sino evitar el retrabajo y preparar a nuestro equipo para servirle mejor.",
    est_time: "Tiempo Estimado",
    est_time_desc: "De 8 a 15 minutos en completado fluido. No es necesario rellenarlo todo de una sola vez.",
    pass_guideline: "Guas de Contraseas",
    pass_desc: "Não solicitamos ni aceptamos ningún tipo de contraseña a través de este formulario. Sus credenciales están totalmente preservadas.",
    
    // Sidebar Summary Box
    sidebar_title: "RESUMEN DE CONSOLIDACIÓN",
    sidebar_org: "EMPRESA / PROYECTO",
    sidebar_rep: "RESPONSABLE",
    sidebar_moment: "DESAFO SELECCIONADO",
    sidebar_scope: "ALCANCE CONTRATADO",
    sidebar_target_90: "META A 90 DAS",
    sidebar_pending: "Pendiente rellenar...",
    sidebar_waiting: "Aguardando datos...",
    sidebar_none_selected: "Ninguno seleccionado...",
    sidebar_no_service: "Ningn servicio seleccionado...",
    sidebar_lang_val: "Idioma",
    
    // Step 1: Dados da Empresa
    empresa_label_name: "Nombre de la Empresa o Proyecto *",
    empresa_placeholder_name: "ej. Oficina Clínica Avanzada",
    empresa_label_cnpj: "Cdigo de Registro Comercial (RUT / TAX ID)",
    empresa_placeholder_cnpj: "ej. RUT / RFC / NIT / ID Fiscal",
    empresa_label_city: "Ciudad / Estado / Pas (Sede)",
    empresa_placeholder_city: "ej. Bogotá / Cundinamarca / Colombia",
    empresa_label_site: "Dirección del Sitio Web",
    empresa_placeholder_site: "ej. https://suempresa.com",
    empresa_label_insta: "Instagram Oficial",
    empresa_placeholder_insta: "ej. instagram.com/empresa",
    empresa_label_linkedin: "LinkedIn Corporativo / Personal",
    empresa_placeholder_linkedin: "ej. linkedin.com/company/suempresa",
    empresa_lang_title: "Idioma preferido de atención / Preferred Language",
    empresa_lang_badge: "Cobertura Global / Soporte Internacional",
    empresa_lang_desc: "Ofrecemos atención técnica corporativa en portugués para empresas brasileñas, con soporte técnico de implementación en inglés o español para clientes internacionales.",
    empresa_lang_pt_desc: "Equipo nativo y documentos base en PT-BR",
    empresa_lang_en_desc: "Global support & English technical delivery",
    empresa_lang_es_desc: "Atención y flujos estratégicos en español",
    
    // Step 2: Responsável / Contatos
    equipe_label_name: "¿Cuál es su nombre? *",
    equipe_placeholder_name: "ej. Mara Silva",
    equipe_label_role: "Cargo / Función en la Empresa",
    equipe_placeholder_role: "ej. Fundador y Director Clínico",
    equipe_label_email: "Correo Electrónico de Contacto *",
    equipe_placeholder_email: "ej. maria@suempresa.com",
    equipe_label_whatsapp: "WhatsApp Corporativo / Personal *",
    equipe_placeholder_whatsapp: "ej. +57 300 123 4567",
    equipe_section_focal: "Definiciones de Punto Focal",
    equipe_label_ti: "Punto focal técnico (ej. DNS, TI)",
    equipe_placeholder_ti: "ej. Camila (Marketing)",
    equipe_label_approver: "?Qui?n aprueba decisiones estrat?gicas? *",
    equipe_placeholder_approver: "ej. CEO, Director de Marketing o la propia Mara",
    equipe_label_finance: "?Recibe facturaci?n y cobros?",
    equipe_placeholder_finance: "ej. financeiro@empresa.com",
    
    // Step 3: Radar
    radar_label_moment: "?Cu?l es el mayor desaf?o en su ecosistema actual? *",
    radar_label_priority: "?Cu?l es su m?xima prioridad comercial con TAG08? *",
    radar_label_term: "Nivel de Organización Actual",
    radar_term_desc: "Arrastren para evaluar la organización y estándares de sus comunicaciones u operaciones internas.",
    radar_term_score: "Nota:",
    radar_term_n1: "1\nMuy improvisada",
    radar_term_n2: "2\nExiste algo establecido pero sin estándares",
    radar_term_n3: "3\nFunciona bien pero requiere mayor estilización",
    radar_term_n4: "4\nBuena organización que busca escalar de nivel",
    radar_term_n5: "5\nTotalmente estandarizada y en crecimiento",
    
    // Step 4: Serviços
    escopo_title: "ALCANCE DE ENTRADA",
    escopo_heading: "?Cu?les son los m?dulos o ?reas de servicio acordados con TAG08?",
    escopo_desc: "Seleccione uno o más módulos abajo contratados para activar las directrices de briefing correspondientes.",
    escopo_label_custom: "Si ha seleccionado \"Otro\", describa brevemente el alcance personalizado contratado:",
    escopo_placeholder_custom: "ej. Asesoría en automatizaciones de CRMs y API de ventas",
    
    // Step 5: Briefing
    briefing_module_title: "MÓDULO SELECCIONADO ACTIVO",
    briefing_module_desc: "Su empresa ha contratado {services}. Responda por favor las preguntas tácticas a continuación:",
    briefing_not_selected_desc: "Describa brevemente los detalles, requerimientos o alcance del servicio personalizado contratado:",
    briefing_not_selected_placeholder: "Indique aqu sus objetivos comerciales, particularidades del ecosistema audiovisual o notas estratégicas.",
    
    // Step 6: Materiais
    materiais_title: "MATERIALES Y ENLACES DE SOPORTE",
    materiais_desc: "Adicione links de pastas públicas compartidas de marca o recursos estratégicos para nuestro equipo (ej. Google Drive, Dropbox, Figma).",
    materiais_warning: "AVISO DE SEGURIDAD: No comparta contraseñas ni pins de acceso mediante este formulario.",
    materiais_label_drive: "Enlace Carpeta Principal (Google Drive/Dropbox)",
    materiais_label_insta: "Enlace de Instagram Corporativo",
    materiais_label_site: "Enlace de Sitio Web Actual",
    materiais_label_portfolio: "Enlace del Catálogo / Portafolio Oficial",
    materiais_label_references: "Referencias Visuales (Enlace o tablero Pinterest)",
    materiais_label_documents: "Manuales de Identidad Visual o Logotipos (.PDF / .AI / .PNG)",
    materiais_label_commercial: "Presentaciones de Ventas / Pitch Deck",
    
    // Step 7: Expectativas
    expectativas_title: "PERSPECTIVAS OPERACIONALES & METAS DE ÉXITO",
    expectativas_subtitle: "?Por qu? recurri? a TAG08 en este momento particular?",
    expectativas_desc: "Mapear los dolores de su organización protege nuestras entregas técnicas y acelera la definición de canales de comunicación.",
    expectativas_placeholder_1: "ej. Sentimos que nuestra comunicación actual nos hace lucir más pequeños de lo que realmente somos...",
    expectativas_label_tried: "?Qu? ha intentado antes para resolver este desaf?o? (ej. agencias, recursos internos)",
    expectativas_placeholder_tried: "ej. Trabajamos provisionalmente con una agencia tradicional para posteos cotidianos...",
    expectativas_label_did_not_work: "?Qu? considera que fall? en esos intentos pasados?",
    expectativas_placeholder_did_not_work: "ej. Publicaciones genéricas sin estética sofisticada, alta demanda de correcciones...",
    expectativas_label_good_result: "Al cabo de 90 d?as de iniciar con TAG08, ?qu? logros le confirmar?an que tomamos la decisi?n adecuada?",
    expectativas_placeholder_good_result: "ej. Un posicionamiento institucional sólido en redes que capte leads de alto poder adquisitivo...",
    expectativas_label_urgency: "?Cu?l es su principal urgencia de operaciones o marketing en este instante?",
    expectativas_placeholder_urgency: "ej. Rediseñar y optimizar nuestro sitio web que está obsoleto...",
    expectativas_label_not_err: "?Qu? considera que NO podemos fallar de ninguna manera en sus entregables u operaciones de comunicaci?n? *",
    expectativas_placeholder_not_err: "ej. Emplear un lenguaje demasiado informal, o variar las tipografías oficiales de marca...",
    
    // Step 8: Consentimento
    consent_title: "POLÍTICAS DE CONSENTIMIENTO & PRIVACIDAD",
    consent_subtitle: "Autorización táctica para carga estratégica de guías de integración",
    consent_desc: "Marque las opciones de consentimiento para realizar el envío definitivo del onboarding.",
    consent_opt1: "Declaro que toda la información corporativa proporcionada es honesta y verídica.",
    consent_opt2: "Autorizo el uso de estos datos únicamente por el equipo técnico de TAG08 para definir la estrategia táctica.",
    consent_opt3: "Confirmo que no he proporcionado ninguna credencial directa de acceso ni contraseñas en este flujo.",
    
    // Step 9: Finalizado (WhatsApp)
    finalized_badge: "ONBOARDING ENVIADO CON ÉXITO",
    finalized_title: "Integración Operativa en proceso!",
    finalized_desc_1: "Sus directrices operativas han sido integradas en nuestro sistema de forma exitosa y se encuentran en nuestra cola de revisión técnica por los equipos creativo y de ingeniería.",
    finalized_desc_2: "Para acelerar la programación de su sesión de arranque (kickoff) y confirmar el recibimiento técnico con el director del proyecto, haga clic a continuación para notificarnos via WhatsApp.",
    whatsapp_template_msg: "Hola equipo TAG08! Completé nuestro onboarding de integración con el asistente conversacional.\\n\\nEmpresa: {company}\\nRepresentante: {name}\\nMeta de 90 días: {goal}.\\n\\n¡Quedamos atentos para agendar nuestro kickoff!",
    
    // Errors
    err_company_name: "Por favor, ingrese el nombre de su empresa en la Etapa 1.",
    err_responsible_name: "Por favor, complete los datos del Responsable (Etapa 2).",
    err_responsible_email: "Por favor, ingrese un correo electrónico corporativo válido.",
    err_responsible_whatsapp: "Necesitamos un número de WhatsApp activo para contacto táctico.",
    err_business_moment: "Por favor, seleccione la opción que mejor se ajuste al momento actual de su empresa.",
    err_priority_map: "Por favor, indique qué área de prioridad podemos ayudarle a resolver primero.",
    err_selected_services: "Seleccione al menos uno de los servicios o formatos contratados para su proyecto.",
    err_consent: "Debe revisar y marcar las 3 casillas de consentimiento para continuar."
  }
};

const momentOptions = {
  pt: [
    { label: "Tenho valor, mas nossa comunicação no reflete nossa magnitude.", value: "Tenho valor, mas minha comunicação no mostra isso." },
    { label: "Postamos frequentemente, mas sentimos falta de uma direção estratégica clara.", value: "Postamos, mas sem muita direção." },
    { label: "Meu site corporativo ou logotipo atual já não acompanha nossa maturidade.", value: "Meu site ou marca já não acompanha nosso momento." },
    { label: "Minha empresa cresceu rápido e a operação de entrega interna ficou desordenada.", value: "Minha empresa cresceu e a operação ficou confusa." },
    { label: "Nossos processos j existem no papel, mas o time no consegue aplic-los com zelo.", value: "Já temos processos, mas eles não são aplicados." },
    { label: "Queremos expandir nosso faturamento técnico corporativo, mas precisamos organizar a base.", value: "Quero crescer, mas preciso organizar a base." }
  ],
  en: [
    { label: "We have value, but our communication does not reflect our magnitude.", value: "Have value, but communication doesn't show it." },
    { label: "We post frequently, but we miss a clear strategic direction.", value: "Post, but without much direction." },
    { label: "Our current corporate website or logo no longer matches our maturity.", value: "Website or brand no longer matches our moment." },
    { label: "My company grew fast and internal operations became disorganized.", value: "Company grew and operations became confusing." },
    { label: "Our processes exist on paper, but the team can't practice them with zeal.", value: "Have processes, but they are not applied." },
    { label: "We want to expand our corporate revenues, but we need to organize the base.", value: "Want to grow, but need to organize base." }
  ],
  es: [
    { label: "Tenemos valor, pero nuestra comunicación no refleja nuestra magnitud.", value: "Tenemos valor, pero la comunicación no lo muestra." },
    { label: "Publicamos con frecuencia, pero sentimos que nos falta una dirección estratégica clara.", value: "Publicamos, pero sin mucha dirección." },
    { label: "Nuestro sitio web corporativo o logotipo actual ya no acompaña nuestra madurez.", value: "El sitio o marca ya no acompaña nuestro momento." },
    { label: "Mi empresa cresceu rápido y la operación de entrega interna se desorden.", value: "Mi empresa cresceu y la operación se voltou a confusa." },
    { label: "Nuestros procesos existen en papel, pero el equipo de trabajo no logra aplicarlos con esmero.", value: "Tenemos procesos, pero no se aplican." },
    { label: "Queremos expandir nuestra facturación técnica corporativa, pero necesitamos organizar la base.", value: "Queremos crecer, pero falta organizar la base." }
  ]
};

const priorityOptions = {
  pt: [
    { label: "Construir clareza de posicionamento de nosso nicho", value: "Clareza de posicionamento" },
    { label: "Organizar conteúdo editorial e presença estratégica nas redes", value: "Conteúdo e presença digital" },
    { label: "Refinar a identidade de marca para um padrão mais profissional", value: "Visual mais profissional" },
    { label: "Desenvolver um site de engenharia s sênior ou página de conversão", value: "Site ou página de venda" },
    { label: "Mapear e documentar nossos fluxos internos de processos", value: "Organizao de processos" },
    { label: "Estruturar anúncios, performance ativa e captação comercial", value: "Performance e captação" }
  ],
  en: [
    { label: "Build clear positioning inãour market niche", value: "Positioning clarity" },
    { label: "Organize editorial content and strategic social media presence", value: "Content and digital presence" },
    { label: "Refine brand identity to a more professional standard", value: "More professional visuals" },
    { label: "Develop a senior-engineered website or high-converting landing page", value: "Website or sales page" },
    { label: "Map and document our internal operating process flows", value: "Process organization" },
    { label: "Structure advertisements, active performance, and commercial leads", value: "Performance and leads generation" }
  ],
  es: [
    { label: "Construir claridad de posicionamiento de nuestro nicho", value: "Claridad de posicionamiento" },
    { label: "Organizar contenido editorial y presencia estratégica en redes", value: "Contenido y presencia digital" },
    { label: "Refinar la identidad de marca hacia un estándar más profesional", value: "Visual más profesional" },
    { label: "Desarrollar un sitio web corporativo o página de conversión", value: "Sitio o página de ventas" },
    { label: "Mapear y documentar nuestros flujos internos de procesos", value: "Organización de procesos" },
    { label: "Estructurar anuncios, rendimiento activo y captacin comercial", value: "Rendimiento y captacin" }
  ]
};

interface ClienteOnboardingProps {
  onNavigate: (page: string) => void;
}

export default function ClienteOnboarding({ onNavigate }: ClienteOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [deliveryState, setDeliveryState] = useState<DeliveryState>("idle");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [pendingQueueCount, setPendingQueueCount] = useState(0);
  
  // Developer log visual state
  const [showDevPayload, setShowDevPayload] = useState(false);
  const [generatedPayload, setGeneratedPayload] = useState<any>(null);
  const hasTrackedOnboardingStartRef = useRef(false);

  // STEP 1: Dados da Empresa
  const [companyName, setCompanyName] = useState("");
  const [cnpjCpf, setCnpjCpf] = useState("");
  const [cityState, setCityState] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyInstagram, setCompanyInstagram] = useState("");
  const [companyLinkedin, setCompanyLinkedin] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("pt");

  // STEP 2: Responsáveis pelo projeto
  const [responsibleName, setResponsibleName] = useState("");
  const [responsibleRole, setResponsibleRole] = useState("");
  const [responsibleEmail, setResponsibleEmail] = useState("");
  const [responsibleWhatsapp, setResponsibleWhatsapp] = useState("");
  const [focalPointText, setFocalPointText] = useState("");
  const [approverText, setApproverText] = useState("");
  const [financePointText, setFinancePointText] = useState("");

  // STEP 3: Radar do momento
  const [businessMoment, setBusinessMoment] = useState("");
  const [priorityMap, setPriorityMap] = useState("");
  const [maturityScore, setMaturityScore] = useState<number>(3);

  // STEP 4: Serviço contratado
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customServiceText, setCustomServiceText] = useState("");

  // STEP 5: Briefings especficos por serviço
  // 5a. Redes Sociais
  const [smChannels, setSmChannels] = useState("");
  const [smTargetAudience, setSmTargetAudience] = useState("");
  const [smPriorityProducts, setSmPriorityProducts] = useState("");
  const [smCompetitors, setSmCompetitors] = useState("");
  const [smHasBrandIdentity, setSmHasBrandIdentity] = useState("sim");
  const [smHasMediaBank, setSmHasMediaBank] = useState("sim");
  const [smRecordsVideos, setSmRecordsVideos] = useState("");
  const [smApprovesContent, setSmApprovesContent] = useState("");
  const [smForbiddenTopics, setSmForbiddenTopics] = useState("");

  // 5b. Branding
  const [brBrandExists, setBrBrandExists] = useState("não");
  const [brReasonForChange, setBrReasonForChange] = useState("");
  const [brDesiredAttributes, setBrDesiredAttributes] = useState("");
  const [brReferencesLink, setBrReferencesLink] = useState("");
  const [brAvoidBrands, setBrAvoidBrands] = useState("");
  const [brBrandNeverBeLike, setBrBrandNeverBeLike] = useState("");
  const [brHasNameSelected, setBrHasNameSelected] = useState("sim");
  const [brHasSloganText, setBrHasSloganText] = useState("");
  const [brRequiredApplications, setBrRequiredApplications] = useState("");

  // 5c. Web Development
  const [webHasDomain, setWebHasDomain] = useState("sim");
  const [webHasHosting, setWebHasHosting] = useState("sim");
  const [webCurrentSite, setWebCurrentSite] = useState("");
  const [webMainGoal, setWebMainGoal] = useState("");
  const [webRequiredPages, setWebRequiredPages] = useState("");
  const [webHasBrandIdentity, setWebHasBrandIdentity] = useState("sim");
  const [webHasTextsReady, setWebHasTextsReady] = useState("não");
  const [webHasFilesReady, setWebHasFilesReady] = useState("sim");
  const [webIntegrateWhatsApp, setWebIntegrateWhatsApp] = useState(false);
  const [webIntegrateForm, setWebIntegrateForm] = useState(false);
  const [webIntegrateCRM, setWebIntegrateCRM] = useState(false);
  const [webNeedsBlog, setWebNeedsBlog] = useState(false);
  const [webReferenceUrls, setWebReferenceUrls] = useState("");

  // 5d. Process Intelligence
  const [piTeamSize, setPiTeamSize] = useState("");
  const [piDepartments, setPiDepartments] = useState("");
  const [piDisorganizedAreas, setPiDisorganizedAreas] = useState("");
  const [piPersonDependent, setPiPersonDependent] = useState("");
  const [piReworkTasks, setPiReworkTasks] = useState("");
  const [piCurrentTools, setPiCurrentTools] = useState("");
  const [piHasDocumentation, setPiHasDocumentation] = useState("não");
  const [piHasOrgChart, setPiHasOrgChart] = useState("não");
  const [piHasMeetings, setPiHasMeetings] = useState("não");
  const [piMainBottleneck, setPiMainBottleneck] = useState("");

  // 5e. Process Activation
  const [paHasPiDiagnose, setPaHasPiDiagnose] = useState("não");
  const [paDocumentedProcesses, setPaDocumentedProcesses] = useState("");
  const [paUnappliedProcesses, setPaUnappliedProcesses] = useState("");
  const [paTeamsToTrain, setPaTeamsToTrain] = useState("");
  const [paResponsibleLeader, setPaResponsibleLeader] = useState("");
  const [paBiggestDifficulty, setPaBiggestDifficulty] = useState("");
  const [paHasTimeForTraining, setPaHasTimeForTraining] = useState("sim");

  // General fallback briefing
  const [generalBriefingText, setGeneralBriefingText] = useState("");

  // STEP 6: Materiais e links
  const [linkDrive, setLinkDrive] = useState("");
  const [linkInstagram, setLinkInstagram] = useState("");
  const [linkSite, setLinkSite] = useState("");
  const [linkPortfolio, setLinkPortfolio] = useState("");
  const [linkReferences, setLinkReferences] = useState("");
  const [linkDocuments, setLinkDocuments] = useState("");
  const [linkCommercial, setLinkCommercial] = useState("");

  // STEP 7: Expectativas (Proximos 90 dias)
  const [whySeekTag08, setWhySeekTag08] = useState("");
  const [whatTriedBefore, setWhatTriedBefore] = useState("");
  const [whatDidNotWork, setWhatDidNotWork] = useState("");
  const [goodResult90Days, setGoodResult90Days] = useState("");
  const [biggestUrgency, setBiggestUrgency] = useState("");
  const [notToMakeMistakes, setNotToMakeMistakes] = useState("");
  const [importantDeadlines, setImportantDeadlines] = useState("");

  // STEP 8: Consentimento
  const [consentTruth, setConsentTruth] = useState(false);
  const [consentUsage, setConsentUsage] = useState(false);
  const [consentNoPasswords, setConsentNoPasswords] = useState(false);

  // Errors state
  const [currentErrors, setCurrentErrors] = useState<string[]>([]);

  const getQueuedOnboardingEntries = (): OnboardingQueueEntry[] => {
    try {
      const raw = localStorage.getItem(ONBOARDING_QUEUE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? (parsed as OnboardingQueueEntry[]) : [];
      const now = Date.now();
      const maxAgeMs = ONBOARDING_QUEUE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

      const filtered = items.filter((entry) => {
        const submitted = new Date(entry.submittedAt || 0).getTime();
        const age = now - submitted;
        const canRetry = entry.status === "pending" || entry.status === "retrying";
        const isFailure = entry.status === "error";
        const isSent = entry.status === "sent";
        return (
          submitted > 0 &&
          age <= maxAgeMs &&
          (canRetry || isFailure || isSent) &&
          Boolean(entry.payload) &&
          entry.attempts <= ONBOARDING_QUEUE_MAX_RETRIES + 1
        );
      });

      const staleRemoved = items.length - filtered.length;
      if (staleRemoved > 0) {
        setQueuedOnboardingEntries(filtered);
      }

      return filtered;
    } catch {
      return [];
    }
  };
  const setQueuedOnboardingEntries = (entries: OnboardingQueueEntry[]) => {
    try {
      localStorage.setItem(ONBOARDING_QUEUE_KEY, JSON.stringify(entries));
    } catch {
      // Mantém apenas estado em memória se localStorage estiver indisponível.
    }
    setPendingQueueCount(entries.filter((entry) => entry.status !== "sent").length);
  };

  const buildRetryDelayMs = (attempt: number) => {
    const multiplier = Math.pow(2, Math.max(0, attempt - 1));
    return Math.min(Math.max(multiplier, 1), 10) * ONBOARDING_QUEUE_SYNC_WINDOW_SECONDS * 1000;
  };

  const sendToBackend = async (
    payload: OnboardingSubmissionPayload,
    fromQueue = false
  ) => {
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        meta: {
          ...(typeof payload === "object" && payload !== null ? ((payload as { meta?: Record<string, unknown> }).meta || {}) : {}),
          replayedFromQueue: fromQueue
        }
      }),
    });

    const parsedResult = await response.json().catch(() => null);
    if (!response.ok) {
      const message = typeof parsedResult?.error === "string" ? parsedResult.error : `Falha no envio: ${response.status} ${response.statusText}`;
      const isRecoverable =
        response.status >= 500 ||
        response.status === 0 ||
        response.status === 408 ||
        response.status === 429 ||
        response.status === 502 ||
        response.status === 503;

      if (!isRecoverable) {
        throw new OnboardingSubmitError(message, "validation", response.status);
      }
      throw new OnboardingSubmitError(message, "transport", response.status);
    }

    if (!isValidSubmissionResult(parsedResult)) {
      throw new OnboardingSubmitError("Resposta inválida do endpoint /api/onboarding", "payload", response.status);
    }

    return parsedResult;
  };

  const enqueueSubmission = (payload: OnboardingSubmissionPayload) => {
    const entries = getQueuedOnboardingEntries();
    const now = new Date();
    const entry: OnboardingQueueEntry = {
      id: `onb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      submittedAt: now.toISOString(),
      payload,
      attempts: 0,
      status: "pending",
      nextAttemptAt: now.toISOString()
    };
    const entriesWithoutSameSubmission = entries.filter((item) => JSON.stringify(item.payload) !== JSON.stringify(payload));
    setQueuedOnboardingEntries([...entriesWithoutSameSubmission, entry]);
    return entry;
  };

  const flushQueuedSubmissions = async () => {
    if (!navigator.onLine) return;

    const entries = getQueuedOnboardingEntries();
    if (!entries.length) return;

    const remaining: OnboardingQueueEntry[] = [];
    for (const entry of entries) {
      if (entry.status === "sent" || entry.status === "error") {
        remaining.push(entry);
        continue;
      }

      const shouldWait = entry.nextAttemptAt ? new Date(entry.nextAttemptAt).getTime() - Date.now() : 0;
      if (shouldWait > 0) {
        remaining.push(entry);
        continue;
      }
      try {
        await sendToBackend(entry.payload, true);
        entry.status = "sent";
        entry.lastAttemptAt = new Date().toISOString();
        entry.lastError = undefined;
      } catch (error) {
        entry.attempts += 1;
        entry.lastError = error instanceof Error ? error.message : "Erro desconhecido ao reenviar";
        entry.lastAttemptAt = new Date().toISOString();

        if (entry.attempts >= ONBOARDING_QUEUE_MAX_RETRIES) {
          entry.status = "error";
          entry.nextAttemptAt = undefined;
        } else {
          entry.status = "retrying";
          entry.nextAttemptAt = new Date(Date.now() + buildRetryDelayMs(entry.attempts)).toISOString();
          remaining.push(entry);
        }
      }
    }

    setQueuedOnboardingEntries(remaining);
  };
  useEffect(() => {
    setPendingQueueCount(getQueuedOnboardingEntries().filter((entry) => entry.status !== "sent").length);
    const syncQueueIfPossible = () => {
      if (!navigator.onLine) return;
      flushQueuedSubmissions().catch(() => {
        setDeliveryState("error");
        setDeliveryMessage(t("status_sync_error"));
      });
    };

    syncQueueIfPossible();
    window.addEventListener("online", syncQueueIfPossible);
    const timer = window.setInterval(syncQueueIfPossible, Math.max(ONBOARDING_QUEUE_SYNC_WINDOW_SECONDS * 1000, 20000));

    return () => {
      window.removeEventListener("online", syncQueueIfPossible);
      window.clearInterval(timer);
    };
  }, []);

  // Access key translations
  const t = (key: string): string => {
    const lang = (preferredLanguage as Language) || "pt";
    const dict = translations[lang] || translations.pt;
    return dict[key] || translations.pt[key] || "";
  };

  // Dynamic steps translation
  const getSteps = () => {
    const lang = (preferredLanguage as Language) || "pt";
    const localizedSteps = {
      pt: [
        { title: "Boas-vindas", desc: "Introdução ao Assistente" },
        { title: "Empresa", desc: "Dados da organização" },
        { title: "Equipe e Contatos", desc: "Responsáveis pelo projeto" },
        { title: "Radar", desc: "Momento e prioridades" },
        { title: "Escopo", desc: "Serviço contratado" },
        { title: "Briefing", desc: "Perguntas especficas" },
        { title: "Materiais", desc: "Arquivos e links de apoio" },
        { title: "Expectativas", desc: "Os próximos 90 dias" },
        { title: "Consentimento", desc: "Autorização de dados" },
        { title: "Finalizado", desc: "Confirmação e próximos passos" }
      ],
      en: [
        { title: "Welcome", desc: "Introduction to the Assistant" },
        { title: "Company", desc: "Company information" },
        { title: "Team & Contacts", desc: "Project owners" },
        { title: "Radar", desc: "Current status & priorities" },
        { title: "Scope", desc: "Contracted services" },
        { title: "Briefing", desc: "Technical questions" },
        { title: "Assets", desc: "Supporting files & links" },
        { title: "Expectations", desc: "The next 90 days" },
        { title: "Consent", desc: "Data authorization" },
        { title: "Completed", desc: "Confirmation & next steps" }
      ],
      es: [
        { title: "Bienvenida", desc: "Introducción al Asistente" },
        { title: "Empresa", desc: "Datos de la organización" },
        { title: "Equipo y Contactos", desc: "Responsables del proyecto" },
        { title: "Radar", desc: "Momento y prioridades" },
        { title: "Alcance", desc: "Servicio contratado" },
        { title: "Briefing", desc: "Preguntas especficas" },
        { title: "Materiales", desc: "Materiales y enlaces de apoyo" },
        { title: "Expectativas", desc: "Los próximos 90 das" },
        { title: "Consentimiento", desc: "Autorización de datos" },
        { title: "Finalizado", desc: "Confirmación y siguientes pasos" }
      ]
    };
    return localizedSteps[lang] || localizedSteps.pt;
  };

  const getWelcomeSteps = () => {
    const lang = (preferredLanguage as Language) || "pt";
    const data = {
      pt: [
        {
          phase: "Fase 01 // Diagnstico",
          title: "Mapeamento Tático",
          desc: "Alinhamento das dores e prioridades corporativas em minutos.",
          isHighlighted: false
        },
        {
          phase: "Fase 02 // Configuração",
          title: "Setup de Ativos",
          desc: "Upload limpo de manuais de marca, acessos técnicos e links sem estresse.",
          isHighlighted: true
        },
        {
          phase: "Fase 03 // Kickoff",
          title: "Engenharia Ativa",
          desc: "Mapeamento tabulado entregue diretamente ao diretor sênior de seu projeto.",
          isHighlighted: false
        }
      ],
      en: [
        {
          phase: "Phase 01 // Diagnosis",
          title: "Tactical Alignment",
          desc: "Map initial operational friction and commercial goals in minutes.",
          isHighlighted: false
        },
        {
          phase: "Phase 02 // Configuration",
          title: "Asset Setup",
          desc: "Direct integration of folders, brand assets, and reference decks.",
          isHighlighted: true
        },
        {
          phase: "Phase 03 // Kickoff",
          title: "Active Delivery",
          desc: "Data structured and forwarded to the senior executive of your project.",
          isHighlighted: false
        }
      ],
      es: [
        {
          phase: "Fase 01 // Diagnstico",
          title: "Alineación Táctica",
          desc: "Mapeo inmediato de dolores operativos y metas comerciales en minutos.",
          isHighlighted: false
        },
        {
          phase: "Fase 02 // Configuracin",
          title: "Setup de Activos",
          desc: "Carga segura de carpetas, recursos de diseño y credenciales públicas.",
          isHighlighted: true
        },
        {
          phase: "Fase 03 // Kickoff",
          title: "Entrega Activa",
          desc: "Informacin estructurada provista directamente al director del proyecto.",
          isHighlighted: false
        }
      ]
    };
    return data[lang] || data.pt;
  };

  const steps = getSteps();

  const getServicesOptions = () => {
    const lang = (preferredLanguage as Language) || "pt";
    const sTexts = {
      pt: {
        sm: "Gestão de Redes Sociais",
        br: "Branding & Identidade",
        web: "Desenvolvimento Web",
        pi: "Process Intelligence",
        pa: "Process Activation",
        traff: "Tráfego Pago",
        audio: "Produção Audiovisual",
        other: "Outro serviço customizado",
        other_lbl: "Outro"
      },
      en: {
        sm: "Social Media Management",
        br: "Branding & Identity",
        web: "Web Development",
        pi: "Process Intelligence",
        pa: "Process Activation",
        traff: "Paid Ads & Traffic",
        audio: "Audiovisual Production",
        other: "Other custom service",
        other_lbl: "Other"
      },
      es: {
        sm: "Gestión de Redes Sociales",
        br: "Branding e Identidad",
        web: "Desarrollo Web",
        pi: "Process Intelligence",
        pa: "Process Activation",
        traff: "Trfico Pago",
        audio: "Producción Audiovisual",
        other: "Otro servicio personalizado",
        other_lbl: "Otro"
      }
    };
    
    const sx = sTexts[lang] || sTexts.pt;
    
    return [
      { label: sx.sm, icon: Instagram, id: "Gestão de Redes Sociais" },
      { label: sx.br, icon: Palette, id: "Branding & Identidade" },
      { label: sx.web, icon: FileCode, id: "Desenvolvimento Web" },
      { label: sx.pi, icon: Cpu, id: "Process Intelligence" },
      { label: sx.pa, icon: Gauge, id: "Process Activation" },
      { label: sx.traff, icon: TrendingUp, id: "Tráfego Pago" },
      { label: sx.audio, icon: FolderDot, id: "Produção Audiovisual" },
      { label: sx.other, icon: Sparkles, id: "Outro" }
    ];
  };

  const servicesOptions = getServicesOptions();

  const handleToggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const validateCurrentStep = () => {
    const errs: string[] = [];
    
    if (currentStep === 1) {
      if (!companyName.trim()) errs.push(t("err_company_name"));
    } else if (currentStep === 2) {
      if (!responsibleName.trim()) errs.push(t("err_responsible_name"));
      if (!responsibleEmail.includes("@")) errs.push(t("err_responsible_email"));
      if (!responsibleWhatsapp.trim()) errs.push(t("err_responsible_whatsapp"));
    } else if (currentStep === 3) {
      if (!businessMoment) errs.push(t("err_business_moment"));
      if (!priorityMap) errs.push(t("err_priority_map"));
    } else if (currentStep === 4) {
      if (selectedServices.length === 0) errs.push(t("err_selected_services"));
    } else if (currentStep === 8) {
      if (!consentTruth || !consentUsage || !consentNoPasswords) {
        errs.push(t("err_consent"));
      }
    }

    setCurrentErrors(errs);
    return errs.length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        if (!hasTrackedOnboardingStartRef.current && nextStep > 0) {
          hasTrackedOnboardingStartRef.current = true;
          trackFormStart({
            form_name: "onboarding",
            form_surface: "onboarding-flow",
            page_path: "/cliente/onboarding"
          });
        }
        trackFormStep({
          form_name: "onboarding",
          form_surface: "onboarding-flow",
          step: nextStep,
          total_steps: steps.length - 1,
          page_path: "/cliente/onboarding"
        });
        return nextStep;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setCurrentErrors([]);
    setCurrentStep(prev => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Check if a specific service briefing is required based on selection
  const isSelected = (serviceId: string) => selectedServices.includes(serviceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setDeliveryState('idle');
    setDeliveryMessage('');

    const clientData = {
      companyName,
      cnpjCpf,
      cityState,
      website: companyWebsite,
      instagram: companyInstagram,
      linkedin: companyLinkedin,
      preferredLanguage
    };

    const projectContacts = {
      responsibleName,
      role: responsibleRole,
      email: responsibleEmail,
      whatsapp: responsibleWhatsapp,
      focalPoint: focalPointText || "Mesmo que o responsável de onboarding",
      approver: approverText || "Mesmo que o responsável de onboarding",
      financePoint: financePointText || "Mesmo que o responsável de onboarding"
    };

    const businessMomentData = {
      momentPhrase: businessMoment,
      priorityArea: priorityMap,
      maturityLevel: maturityScore
    };

    // Bundle specific questionnaires
    const serviceSpecificBriefing: any = {};
    if (isSelected("Gestão de Redes Sociais")) {
      serviceSpecificBriefing.gestaoRedesSociais = {
        channels: smChannels,
        targetAudience: smTargetAudience,
        priorityProducts: smPriorityProducts,
        competitors: smCompetitors,
        hasBrandIdentity: smHasBrandIdentity,
        hasMediaBank: smHasMediaBank,
        whoRecordsVideos: smRecordsVideos,
        whoApprovesContent: smApprovesContent,
        forbiddenTopics: smForbiddenTopics
      };
    }
    if (isSelected("Branding & Identidade")) {
      serviceSpecificBriefing.brandingIdentidade = {
        brandExists: brBrandExists,
        motivation: brReasonForChange,
        attributes: brDesiredAttributes,
        references: brReferencesLink,
        avoidBrands: brAvoidBrands,
        brandNeverBeLike: brBrandNeverBeLike,
        hasNameSelected: brHasNameSelected,
        sloganText: brHasSloganText,
        requiredApplications: brRequiredApplications
      };
    }
    if (isSelected("Desenvolvimento Web")) {
      serviceSpecificBriefing.desenvolvimentoWeb = {
        hasDomain: webHasDomain,
        hasHosting: webHasHosting,
        currentSite: webCurrentSite,
        mainGoal: webMainGoal,
        requiredPages: webRequiredPages,
        hasBrandIdentity: webHasBrandIdentity,
        hasTextsReady: webHasTextsReady,
        hasFilesReady: webHasFilesReady,
        references: webReferenceUrls,
        integrations: {
          whatsapp: webIntegrateWhatsApp,
          form: webIntegrateForm,
          crm: webIntegrateCRM,
          blog: webNeedsBlog
        }
      };
    }
    if (isSelected("Process Intelligence")) {
      serviceSpecificBriefing.processIntelligence = {
        teamSize: piTeamSize,
        departments: piDepartments,
        disorganizedAreas: piDisorganizedAreas,
        personDependent: piPersonDependent,
        reworkTasks: piReworkTasks,
        currentTools: piCurrentTools,
        hasDocumentation: piHasDocumentation,
        hasOrgChart: piHasOrgChart,
        hasMeetings: piHasMeetings,
        mainBottleneck: piMainBottleneck
      };
    }
    if (isSelected("Process Activation")) {
      serviceSpecificBriefing.processActivation = {
        hasPiDiagnose: paHasPiDiagnose,
        documentedProcesses: paDocumentedProcesses,
        unappliedProcesses: paUnappliedProcesses,
        teamsToTrain: paTeamsToTrain,
        responsibleLeader: paResponsibleLeader,
        biggestDifficulty: paBiggestDifficulty,
        hasTimeForTraining: paHasTimeForTraining
      };
    }
    
    // Fallback if none of specifically handled services are chosenãor they choose "Tráfego Pago", "Produção Audiovisual", "Outro"
    const hasUnmanagedService = selectedServices.some(s => ["Tráfego Pago", "Produção Audiovisual", "Outro"].includes(s));
    if (hasUnmanagedService || selectedServices.length === 0) {
      serviceSpecificBriefing.geral = {
        generalBriefingText
      };
    }

    const filesAndLinks = {
      drive: linkDrive,
      instagram: linkInstagram,
      site: linkSite,
      portfolio: linkPortfolio,
      references: linkReferences,
      documents: linkDocuments,
      commercial: linkCommercial
    };

    const expectations90Days = {
      whySeekTag08,
      whatTriedBefore,
      whatDidNotWork,
      goodResult90Days,
      biggestUrgency,
      notToMakeMistakes,
      importantDeadlines
    };

    const consent = {
      truthChecked: consentTruth,
      useChecked: consentUsage,
      noPasswordsChecked: consentNoPasswords
    };

    const submittedAt = new Date().toISOString();

    // Prepare ClickUp custom checklists and format task
    const primaryService = selectedServices[0] || "Escopo Customizado";
    const taskTitle = `Onboarding | ${companyName} | ${primaryService}`;
    
    const clickupPayload = {
      task: {
        name: taskTitle,
        description: `Processo de Onboarding TAG08 submetido pelo representante da empresa.\n\nEmpresa: ${companyName}\nResponsável: ${responsibleName}\nWpp: ${responsibleWhatsapp}\nEmail: ${responsibleEmail}\nVisualizar payload completo para extrair o briefing de produção.`,
        status: "Onboarding recebido",
        checklist: [
          { name: "Conferir dados cadastrais", resolved: false },
          { name: "Validar serviço contratado", resolved: false },
          { name: "Criar pasta no Drive", resolved: false },
          { name: "Criar projeto/card operacional", resolved: false },
          { name: "Adicionar cliente ao fluxo interno", resolved: false },
          { name: "Agendar kickoff", resolved: false },
          { name: "Solicitar materiais pendentes", resolved: false },
          { name: "Confirmar responsável interno", resolved: false },
          { name: "Atualizar status comercial", resolved: false },
          { name: "Concluir onboarding", resolved: false }
        ]
      }
    };

    // Prepare Sheets sheetPayload
    const sheetPayload = {
      row: {
        "Data de Submisso": submittedAt,
        "Nome da Empresa": companyName,
        "CNPJ/CPF": cnpjCpf,
        "Cidade/Estado": cityState,
        "Site Atual": companyWebsite,
        "Responsável Principal": responsibleName,
        "Cargo": responsibleRole,
        "Email": responsibleEmail,
        "WhatsApp": responsibleWhatsapp,
        "Serviço Contratado": selectedServices.join(", ") + (customServiceText ? ` (${customServiceText})` : ""),
        "Momento do Negcio": businessMoment,
        "Prioridade": priorityMap,
        "Maturidade": maturityScore,
        "Urgncia": biggestUrgency,
        "Prazo Crtico": importantDeadlines,
        "Ponto Focal TI/Ops": focalPointText,
        "Ponto Focal Financeiro": financePointText,
        "Idioma de Atendimento": preferredLanguage,
        "Status Geral": "Recebido"
      }
    };

    // The structured delivery blueprint payload
    const finalPayload: Record<string, unknown> = {
      clientData,
      projectContacts,
      selectedServices,
      businessMoment: businessMomentData,
      generalBriefing: expectations90Days,
      serviceSpecificBriefing,
      filesAndLinks,
      consent,
      submittedAt,
      source: "Assistente Onboarding TAG08",
      status: "Onboarding recebido",
      schemaVersion: ONBOARDING_PAYLOAD_VERSION,
      sheetPayload,
      clickupPayload
    };

    setGeneratedPayload(finalPayload);

    let shouldShowSuccessScreen = false;
    try {
      const response = await sendToBackend(finalPayload);
      setDeliveryState("online");
      setDeliveryMessage(
        t("status_online_ref")
          .replace("{status}", response.status)
          .replace("{submissionId}", response.submissionId)
          .replace("{receivedAt}", response.receivedAt)
      );
      await flushQueuedSubmissions();
      trackFormSubmit({
        form_name: "onboarding",
        form_surface: "onboarding-flow",
        status: "success",
        page_path: "/cliente/onboarding"
      });
      trackLeadEvent({
        action: "onboarding_submit",
        surface: "onboarding-flow",
        status: "online",
        language: preferredLanguage
      });
      shouldShowSuccessScreen = true;
    } catch (error) {
      const submitError = error instanceof OnboardingSubmitError ? error : null;
      const message =
        error instanceof Error ? error.message : "Falha no envio.";
      if (submitError?.kind === "validation") {
        setDeliveryState("error");
        setDeliveryMessage(
          t("status_validation_error").replace("{details}", message)
        );
        setCurrentErrors([message]);
        trackFormSubmit({
          form_name: "onboarding",
          form_surface: "onboarding-flow",
          status: "validation_error",
          page_path: "/cliente/onboarding"
        });
        trackLeadEvent({
          action: "onboarding_submit",
          surface: "onboarding-flow",
          status: "validation_error",
          language: preferredLanguage
        });
      } else {
        try {
          enqueueSubmission(finalPayload);
          setDeliveryState("queued");
          setDeliveryMessage(t("status_queue_fallback"));
          trackFormSubmit({
            form_name: "onboarding",
            form_surface: "onboarding-flow",
            status: "queued",
            page_path: "/cliente/onboarding"
          });
          trackLeadEvent({
            action: "onboarding_submit",
            surface: "onboarding-flow",
            status: "queued",
            language: preferredLanguage
          });
          shouldShowSuccessScreen = true;
        console.warn("Rota /api/onboarding indisponível. Formulário salvo localmente.");
        } catch {
          setDeliveryState("error");
          setDeliveryMessage(t("status_queue_store_error"));
          trackFormSubmit({
            form_name: "onboarding",
            form_surface: "onboarding-flow",
            status: "error",
            page_path: "/cliente/onboarding"
          });
          trackLeadEvent({
            action: "onboarding_submit",
            surface: "onboarding-flow",
            status: "queue_error",
            language: preferredLanguage
          });
        }
      }
    } finally {
      await new Promise(resolve => setTimeout(resolve, 1800));
      setIsSubmitting(false);
      if (shouldShowSuccessScreen) {
        setIsSubmitted(true);
        setCurrentStep(9);
      }
    }
  };

  const handleLaunchWhatsAppOnboardingFastTrack = () => {
    const text = `Olá time TAG08! Concluímos o preenchimento do nosso onboarding institucional via Assistente Conversacional.\n\nEmpresa: ${companyName}\nRepresentante: ${responsibleName}\nMeta dos próximos 90 dias: ${goodResult90Days || "(Preenchido no formulário)"}.\n\nAguardamos contato técnico para agendarmos nosso kickoff!`;
    const href = buildBrazilWhatsAppUrl(text);
    trackOutboundClick({
      label: "WhatsApp Brasil",
      url: href,
      surface: "onboarding-fast-track",
      language: preferredLanguage
    });
    window.open(href, "_blank");
  };

  // Helper renderer to represent the current fill-status on the dynamic left-card
  const renderSidebarSummaryBox = () => {
    return (
      <div className="bg-neutral-900/45 border border-white/[0.04] p-5 rounded-3xl space-y-5 text-left text-xs sticky top-32">
        <div className="flex items-center justify-between border-b border-white/[0.03] pb-3">
          <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-wider">{t("sidebar_title")}</span>
          <span className="font-sans text-xs text-brand-secondary bg-brand-secondary/5 px-2 py-0.5 rounded border border-brand-secondary/15">{t("live_state")}</span>
        </div>

        <div className="space-y-4">
          {/* Empresa item */}
          <div className="space-y-1">
            <span className="text-zinc-500 font-sans text-xs block">{t("sidebar_org")}</span>
            {companyName ? (
              <p className="text-white font-medium flex items-center gap-1.5 break-all">
                <Building2 className="w-3.5 h-3.5 text-brand-secondary shrink-0" /> {companyName}
              </p>
            ) : (
              <p className="text-zinc-600 italic">{t("sidebar_pending")}</p>
            )}
            <div className="flex gap-1 pt-1">
              <span className="px-1.5 py-0.5 bg-white/[0.04] border border-white/[0.06] text-xs rounded text-zinc-300 font-sans uppercase">
                {t("sidebar_lang_val")}: {preferredLanguage === "pt" ? "Português" : preferredLanguage === "en" ? "English" : "Español"}
              </span>
            </div>
          </div>

          {/* Contato item */}
          <div className="space-y-1 flex flex-col">
            <span className="text-zinc-500 font-sans text-xs block text-left">{t("sidebar_rep")}</span>
            {responsibleName ? (
              <span className="text-white font-medium flex items-center gap-1.5 break-all">
                <User className="w-3.5 h-3.5 text-brand-secondary shrink-0" /> {responsibleName}
              </span>
            ) : (
              <span className="text-zinc-600 italic">{t("sidebar_waiting")}</span>
            )}
          </div>

          {/* Radar Item */}
          <div className="space-y-1">
            <span className="text-zinc-500 font-sans text-xs block">{t("sidebar_moment")}</span>
            {businessMoment ? (
              <p className="text-zinc-300 line-clamp-2 leading-snug">{businessMoment}</p>
            ) : (
              <p className="text-zinc-600 italic">{t("sidebar_none_selected")}</p>
            )}
          </div>

          {/* Serviços contratados */}
          <div className="space-y-1">
            <span className="text-zinc-500 font-sans text-xs block">{t("sidebar_scope")}</span>
            {selectedServices.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedServices.map((srv, index) => (
                  <span key={index} className="px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] text-xs rounded text-zinc-300">
                    {srv}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-zinc-600 italic">{t("sidebar_no_service")}</p>
            )}
          </div>

          {/* Expectations metadata brief */}
          {goodResult90Days && (
            <div className="space-y-1 pt-1 border-t border-white/[0.03]">
              <span className="text-zinc-500 font-sans text-xs block">{t("sidebar_target_90")}</span>
              <p className="text-zinc-300 line-clamp-3 leading-relaxed">{goodResult90Days}</p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-white/[0.03] flex items-center gap-2 text-xs text-zinc-500 font-sans">
          <Lock className="w-3.5 h-3.5 text-zinc-600" />
          <span>{t("senior_info")}</span>
        </div>
      </div>
    );
  };

  // Assistant speaks configuration based on active step
  const getAssistantSpeak = () => {
    const lang = (preferredLanguage as Language) || "pt";
    const speaks: Record<Language, Record<number, string>> = {
      pt: {
        1: "Vamos começar pelo básico. Qual é o nome oficial da empresa ou projeto que iniciaremos?",
        2: "Legal. Agora me diz quem será a pessoa sênior principal que manterá contato técnico direto com a TAG08.",
        3: "Para eu interpretar melhor o seu ecossistema atual, escolha a frase tática que mais se alinha com sua realidade comercial.",
        4: "Excelente sintonia. Vamos delimitar quais são os formatos ou divisões de serviço contratadas da TAG08.",
        5: "Certo. Mapeamos seus serviços. Agora, vamos responder a algumas perguntas técnicas para abastecer nossa engenharia e criativos:",
        6: "Caso disponha de direitos, PDFs de identidade visual ou apresentações comerciais, forneça os links correspondentes abaixo (não envie senhas).",
        7: "Para finalizar nosso mapeamento institucional, me diga: daqui a 90 dias de parceria, o que faria você sentir que demos o passo correto?",
        8: "Estamos prontos. Leia e marque as caixas de consentimento para fazermos o upload seguro de suas diretrizes operacionais."
      },
      en: {
        1: "Let's start with the basics. What is the official name of the company or project we are starting?",
        2: "Great. Now tell me who will be the primary point of contact coordinating directly with TAG08.",
        3: "To better understand your current ecosystem, please choose the statement that best aligns with your business reality.",
        4: "Excellent synergy. Let's define which service branches or modules have been agreed with TAG08.",
        5: "All right. We mapped your services. Now, let's answer some technical questions to feed our engineering and creative teams.",
        6: "If you have shared folders, visual brand manuals, or sales decks, please share their links below (never share passcodes).",
        7: "To finalize our roadmap, tell me: after 90 days of partnership, what milestones would confirm we took the correct step?",
        8: "We are ready. Please read and check the consent boxes to safely upload your operational guidelines."
      },
      es: {
        1: "Comencemos con lo básico. ¿Cuál es el nombre oficial de la empresa o proyecto que iniciaremos?",
        2: "Estupendo. Ahora dígame quién será la persona principal de contacto coordinando directamente con TAG08.",
        3: "Para entender mejor su ecosistema actual, elija la frase táctica que mejor se alinee con su realidad comercial.",
        4: "Sintonía excelente. Vamos a definir qué ramas o módulos de servicio se han acordado con TAG08.",
        5: "De acuerdo. Mapeamos sus servicios. Ahora, respondamos algunas preguntas técnicas para abastecer a nuestros equipos creativos y de ingeniería.",
        6: "Si dispone de carpetas compartidas, manuales de identidad visual o presentaciones de ventas, comparta los enlaces a continuación (no comparta contraseñas).",
        7: "Para finalizar nuestro mapa de ruta corporativo, dígame: al cabo de 90 días de sociedad, qué logros le confirmarían que tomamos la decisión adecuada?",
        8: "Estamos del todo listos. Lea y marque las casillas de consentimiento para enviar de forma segura sus directrices operacionales."
      }
    };
    
    return speaks[lang]?.[currentStep] || (lang === "en" ? "Welcome to our accelerated onboarding." : lang === "es" ? "Bienvenido al onboarding institucional." : "Boas-vindas ao nosso onboarding institucional.");
  };

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pt-16 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 relative">
        
        {/* Subtle ambient blur background decorations */}
        <div className="absolute top-[10%] right-[-10%] w-[450px] h-[450px] bg-brand/[0.015] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/[0.01] rounded-full blur-[150px] pointer-events-none" />

        {/* Responsive Header Row with Integrated Language Switcher */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 border-b border-white/[0.04] pb-8">
          <div className="text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/5 border border-brand/20 rounded-full text-brand text-xs font-sans">
              <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
              <span>{t("op_tool")}</span>
            </div>
            <h1 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight">
              {t("title_prefix")} <span className="text-brand-secondary">TAG08</span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans max-w-2xl leading-relaxed">
              {t("header_desc")}
            </p>
          </div>

          {/* Quick Language Toggle */}
            <div className="flex items-center justify-center gap-1.5 self-center md:self-end bg-neutral-900/60 p-1.5 rounded-xl border border-white/[0.06] shrink-0">
            <span className="text-xs font-sans text-zinc-500 uppercase px-2 hidden sm:inline">Idioma / Language:</span>
            {[
              { code: "pt", label: "PT", title: "Português" },
              { code: "en", label: "EN", title: "English" },
              { code: "es", label: "ES", title: "Español" }
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setPreferredLanguage(lang.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold uppercase transition-all ${
                  preferredLanguage === lang.code
                    ? "bg-brand-secondary text-black shadow-[0_4px_12px_rgba(var(--color-brand-secondary-rgb),0.15)]"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                }`}
                title={lang.title}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Global Progress Bar Bar (From steps 1 to 9, hiding in welcome step 0 and submit step 9) */}
        {currentStep > 0 && currentStep < 9 && (
          <div className="mb-12 space-y-3">
            <div className="flex items-center justify-between text-xs font-sans text-zinc-500">
              <span className="uppercase tracking-widest text-brand-secondary font-semibold text-xs">
                {t("step_label")} {currentStep} {t("step_of")} {steps.length - 1} : {steps[currentStep].title}
              </span>
              <span>{Math.round((currentStep / (steps.length - 1)) * 100)}% {t("completed")}</span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.03] border border-white/[0.05] rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-secondary transition-all duration-500 ease-out shadow-[0_0_8px_rgba(var(--color-brand-secondary-rgb),0.3)]"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* MAIN WIZARD INTERFACES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT SIDEBAR (Resumo Lateral) - visible only in steps 2 to 8 */}
          <div className="lg:col-span-4 order-last lg:order-first">
            {currentStep > 1 && currentStep < 9 ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderSidebarSummaryBox()}
              </motion.div>
            ) : currentStep === 0 ? (
              <div className="p-6 rounded-3xl bg-neutral-900/30 border border-white/[0.04] text-left space-y-5">
                <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-wider font-bold block">{t("privacy_title")}</span>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  {t("privacy_desc")}
                </p>
                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] space-y-2 text-xs text-zinc-400">
                  <span className="text-white font-sans uppercase text-xs font-black block">{t("privacy_indicators")}</span>
                  <p>{t("privacy_p1")}</p>
                  <p>{t("privacy_p2")}</p>
                  <p>{t("privacy_p3")}</p>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-neutral-900/20 border border-white/[0.03] text-left text-xs text-zinc-500 font-sans space-y-4">
                <span>PLANO TÁTICO INICIAL TAG08 // SOBERANIA EMPRESARIAL</span>
                <p className="leading-relaxed">Nosso foco  dar clareza de posicionamento visual, desenvolvimento de engenharia web limpa e automação de playbooks de processos corporativos.</p>
              </div>
            )}
          </div>

          {/* RIGHT CONTAINER - INTERACTIVE ASSISTANT FORM CARD */}
          <div className="lg:col-span-8">
            <div className="bg-charcoal-900/70 border border-white/[0.06] rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden min-h-[480px] flex flex-col justify-between">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-8 text-left h-full flex flex-col justify-between"
                >
                  
                  {/* Step Speak section (if not step 0 or 9) */}
                  {currentStep > 0 && currentStep < 9 && (
                    <div className="flex gap-4 p-5 rounded-2xl bg-brand-secondary/[0.02] border border-brand-secondary/5 items-start">
                      <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 text-brand text-xs font-sans font-black shadow-[0_0_12px_rgba(var(--color-brand-rgb),0.15)]">
                        08
                      </div>
                      <div className="space-y-1">
                        <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black block">{t("chat_header_assistant")}</span>
                        <p className="text-zinc-200 text-xs sm:text-sm font-sans font-medium leading-relaxed font-sans">
                          "{getAssistantSpeak()}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 0: WELCOME SCREEN */}
                  {currentStep === 0 && (
                    <div className="space-y-8 py-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-brand-secondary/10 border border-brand-secondary/20 rounded-full text-brand-secondary text-xs tag08-meta tracking-widest uppercase w-fit select-none">
                          <Sparkles className="w-3 h-3 text-brand-secondary animate-pulse shrink-0" />
                        </div>
                        <h2 
                          className="font-display font-medium text-2xl sm:text-3.5xl text-gradient tracking-tight leading-none text-white font-semibold"
                          dangerouslySetInnerHTML={{ __html: t("welcome_title") }}
                        />
                        <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed max-w-3xl">
                          {t("welcome_desc")}
                        </p>
                      </div>

                      {/* TACTICAL PROGRESSION FRAMEWORK GRID (Inspired by reference presentation slideshow) */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                        {getWelcomeSteps().map((item, index) => {
                          const IconComp = index === 0 ? ClipboardCheck : index === 1 ? Cpu : Sparkles;
                          return item.isHighlighted ? (
                            /* HIGH STANDOUT NEON ACCENT CARD */
                            <div 
                              key={index}
                              className="bg-brand-secondary border border-black/10 p-5 rounded-[24px] text-left flex flex-col justify-between min-h-[160px] shadow-[0_12px_36px_rgba(var(--color-brand-secondary-rgb),0.12)] relative overflow-hidden select-none hover:scale-[1.02] transition-all duration-300"
                            >
                              <div className="absolute top-[-25px] right-[-25px] w-16 h-16 bg-white/20 rounded-full blur-xl pointer-events-none" />
                              <div className="flex items-center justify-between relative z-10">
                                <span className="font-sans text-xs font-black uppercase text-black/60 bg-black/5 px-2 py-0.5 rounded border border-black/5">
                                  {item.phase}
                                </span>
                                <IconComp className="w-3.5 h-3.5 text-black/70 animate-bounce" />
                              </div>
                              <div className="space-y-1 relative z-10 mt-4 text-left">
                                <h4 className="font-display font-black text-sm text-black tracking-tight leading-none">
                                  {item.title}
                                </h4>
                                <p className="text-black/70 text-xs leading-snug font-medium">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          ) : (
                            /* SLEEK AMBIENT DARK CORE CARD */
                            <div 
                              key={index}
                              className="bg-[#121214] border border-white/[0.05] hover:border-brand/20 p-5 rounded-[24px] text-left flex flex-col justify-between min-h-[160px] relative overflow-hidden select-none hover:scale-[1.02] transition-all duration-300"
                            >
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/[0.01] rounded-full blur-xl pointer-events-none" />
                              <div className="flex items-center justify-between relative z-10">
                                <span className="font-sans text-xs font-black uppercase text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                  {item.phase}
                                </span>
                                <IconComp className="w-3.5 h-3.5 text-zinc-500" />
                              </div>
                              <div className="space-y-1 relative z-10 mt-4 text-left">
                                <h4 className="font-display font-black text-sm text-white tracking-tight leading-none">
                                  {item.title}
                                </h4>
                                <p className="text-zinc-500 text-xs leading-snug font-medium">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                        <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] transition-colors space-y-1.5 font-sans text-left">
                          <div className="flex items-center gap-2 text-zinc-400 font-bold text-xs uppercase font-sans">
                            <Clock className="w-4 h-4 text-brand-secondary" /> {t("est_time")}
                          </div>
                          <p className="text-zinc-500 text-xs leading-relaxed font-medium">
                            {t("est_time_desc")}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] transition-colors space-y-1.5 font-sans text-left">
                          <div className="flex items-center gap-2 text-zinc-400 font-bold text-xs uppercase font-sans">
                            <ShieldAlert className="w-4 h-4 text-brand" /> {t("pass_guideline")}
                          </div>
                          <p className="text-red-300 text-xs leading-relaxed font-semibold">
                            {t("pass_desc")}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-white/[0.04] pt-6 flex justify-start">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="px-7 py-4.5 bg-brand-secondary hover:bg-brand-dark text-black text-xs font-sans font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2.5 cursor-pointer shadow-[0_8px_30px_rgba(var(--color-brand-secondary-rgb),0.18)] hover:-translate-y-0.5"
                        >
                          {t("btn_start")} <ArrowRight className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 1: DADOS DA EMPRESA */}
                  {currentStep === 1 && (
                    <div className="space-y-6 py-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                            {t("empresa_label_name")}
                          </label>
                          <div className="relative">
                            <Building2 className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-zinc-500" />
                            <input
                              type="text"
                              required
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-all font-sans"
                              placeholder={t("empresa_placeholder_name")}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                            {t("empresa_label_cnpj")}
                          </label>
                          <input
                            type="text"
                            value={cnpjCpf}
                            onChange={(e) => setCnpjCpf(e.target.value)}
                            className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-all font-sans"
                            placeholder={t("empresa_placeholder_cnpj")}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                            {t("empresa_label_city")}
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-zinc-500" />
                            <input
                              type="text"
                              value={cityState}
                              onChange={(e) => setCityState(e.target.value)}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-all font-sans"
                              placeholder={t("empresa_placeholder_city")}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                            {t("empresa_label_site")}
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-zinc-500" />
                            <input
                              type="url"
                              value={companyWebsite}
                              onChange={(e) => setCompanyWebsite(e.target.value)}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-all font-sans"
                              placeholder={t("empresa_placeholder_site")}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2">
                        <div className="space-y-2">
                          <label className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                            {t("empresa_label_insta")}
                          </label>
                          <div className="relative">
                            <Instagram className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-zinc-500" />
                            <input
                              type="text"
                              value={companyInstagram}
                              onChange={(e) => setCompanyInstagram(e.target.value)}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-all font-sans"
                              placeholder={t("empresa_placeholder_insta")}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                            {t("empresa_label_linkedin")}
                          </label>
                          <div className="relative">
                            <Linkedin className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-zinc-500" />
                            <input
                              type="text"
                              value={companyLinkedin}
                              onChange={(e) => setCompanyLinkedin(e.target.value)}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-all font-sans"
                              placeholder={t("empresa_placeholder_linkedin")}
                            />
                          </div>
                        </div>
                      </div>

                      {/* IDIOMA PREFERENCIAL DE ATENDIMENTO */}
                      <div className="space-y-4 pt-4 border-t border-white/[0.04]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h4 className="text-xs tag08-meta text-zinc-300 tracking-wider font-bold">
                            {t("empresa_lang_title")}
                          </h4>
                          <span className="font-sans text-xs text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/20 px-2.5 py-0.5 rounded uppercase font-black shrink-0 self-start">
                            {t("empresa_lang_badge")}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                          {t("empresa_lang_desc")}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { value: "pt", title: "Português", desc: t("empresa_lang_pt_desc") },
                            { value: "en", title: "English", desc: t("empresa_lang_en_desc") },
                            { value: "es", title: "Español", desc: t("empresa_lang_es_desc") }
                          ].map((lang) => (
                            <button
                              key={lang.value}
                              type="button"
                              onClick={() => setPreferredLanguage(lang.value)}
                              className={`p-4 rounded-xl border text-left transition-all ${
                                preferredLanguage === lang.value
                                  ? "bg-brand-secondary/10 border-brand-secondary text-white"
                                  : "bg-zinc-950/40 border-white/[0.08] hover:border-white/[0.18] text-zinc-300"
                              }`}
                            >
                              <div className="font-sans text-xs font-extrabold uppercase flex items-center justify-between">
                                <span>{lang.title}</span>
                                {preferredLanguage === lang.value && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
                                )}
                              </div>
                              <span className="text-xs text-zinc-400 block mt-1 leading-normal font-sans">{lang.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: RESPONSVEIS PELO PROJETO */}
                  {currentStep === 2 && (
                    <div className="space-y-6 py-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                            {t("equipe_label_name")}
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-zinc-500" />
                            <input
                              type="text"
                              required
                              value={responsibleName}
                              onChange={(e) => setResponsibleName(e.target.value)}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-all font-sans"
                              placeholder={t("equipe_placeholder_name")}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                            {t("equipe_label_role")}
                          </label>
                          <input
                            type="text"
                            value={responsibleRole}
                            onChange={(e) => setResponsibleRole(e.target.value)}
                            className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-all font-sans"
                            placeholder={t("equipe_placeholder_role")}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                            {t("equipe_label_email")}
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-zinc-500" />
                            <input
                              type="email"
                              required
                              value={responsibleEmail}
                              onChange={(e) => setResponsibleEmail(e.target.value)}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-all font-sans"
                              placeholder={t("equipe_placeholder_email")}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                            {t("equipe_label_whatsapp")}
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-zinc-500" />
                            <input
                              type="tel"
                              required
                              value={responsibleWhatsapp}
                              onChange={(e) => setResponsibleWhatsapp(e.target.value)}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-all font-sans"
                              placeholder={t("equipe_placeholder_whatsapp")}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-white/[0.04] pt-4 space-y-4">
                        <span className="text-xs tag08-meta uppercase tracking-widest text-zinc-500 font-bold block">{t("equipe_section_focal")}</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-sans text-zinc-400 uppercase">{t("equipe_label_ti")}</label>
                            <input
                              type="text"
                              value={focalPointText}
                              onChange={(e) => setFocalPointText(e.target.value)}
                              placeholder={t("equipe_placeholder_ti")}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-secondary"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-sans text-zinc-400 uppercase">{t("equipe_label_approver")}</label>
                            <input
                              type="text"
                              value={approverText}
                              onChange={(e) => setApproverText(e.target.value)}
                              placeholder={t("equipe_placeholder_approver")}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-secondary"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-sans text-zinc-400 uppercase">{t("equipe_label_finance")}</label>
                            <input
                              type="text"
                              value={financePointText}
                              onChange={(e) => setFinancePointText(e.target.value)}
                              placeholder={t("equipe_placeholder_finance")}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-secondary"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: RADAR DO MOMENTO */}
                  {currentStep === 3 && (
                    <div className="space-y-6 py-2">
                      <div className="space-y-3">
                        <label className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider block">
                          {t("radar_label_moment")}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5" role="radiogroup" aria-label={t("radar_label_moment")}>
                          {momentOptions[preferredLanguage as keyof typeof momentOptions].map((opt, idx) => (
                            <div
                              key={idx}
                              onClick={() => setBusinessMoment(opt.value)}
                              onKeyDown={(event) => activateOnKeyboard(event, () => setBusinessMoment(opt.value))}
                              role="radio"
                              aria-checked={businessMoment === opt.value}
                              tabIndex={0}
                              className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer text-left flex flex-col justify-between h-[110px] ${
                                businessMoment === opt.value
                                  ? "bg-brand-secondary/[0.03] border-brand-secondary shadow-[0_4px_15px_rgba(var(--color-brand-secondary-rgb),0.06)]"
                                  : "bg-neutral-900/40 border-white/[0.04] hover:bg-neutral-900/60 hover:border-white/[0.12]"
                              }`}
                            >
                              <p className="text-zinc-200 text-xs font-sans leading-relaxed flex-grow">
                                {opt.label}
                              </p>
                              <div className="flex items-center justify-between pt-2 border-t border-white/[0.02] text-xs font-sans text-zinc-500">
                                <span>{preferredLanguage === "en" ? "OPTION CODE" : preferredLanguage === "es" ? "OPCIÓN CÓD" : "OPÇÃO COD"} {idx+1}</span>
                                {businessMoment === opt.value && <span className="text-brand-secondary font-extrabold font-sans">{preferredLanguage === "en" ? "SELECTED" : preferredLanguage === "es" ? "SELECCIONADO" : "SELECIONADO"}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <label className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider block">
                          {t("radar_label_priority")}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label={t("radar_label_priority")}>
                          {priorityOptions[preferredLanguage as keyof typeof priorityOptions].map((opt, idx) => (
                            <div
                              key={idx}
                              onClick={() => setPriorityMap(opt.value)}
                              onKeyDown={(event) => activateOnKeyboard(event, () => setPriorityMap(opt.value))}
                              role="radio"
                              aria-checked={priorityMap === opt.value}
                              tabIndex={0}
                              className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                                priorityMap === opt.value
                                  ? "bg-white/[0.03] border-brand-secondary text-brand-secondary"
                                  : "bg-zinc-950 border-white/[0.04] text-zinc-400 hover:border-white/[0.1]"
                              }`}
                            >
                              <span className="text-xs font-sans block font-semibold leading-tight">{opt.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-white/[0.03]">
                        <div className="flex items-center justify-between">
                          <label className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                            {t("radar_label_term")}
                          </label>
                          <span className="font-sans text-xs text-brand-secondary font-semibold">
                            {t("radar_term_score")} {maturityScore} / 5
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                          {t("radar_term_desc")}
                        </p>
                        
                        <div className="space-y-3 pt-2">
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={maturityScore}
                            onChange={(e) => setMaturityScore(parseInt(e.target.value))}
                            className="w-full h-1 bg-white/[0.06] rounded-lg appearance-none cursor-pointer accent-brand-secondary"
                          />
                          <div className="grid grid-cols-5 text-center text-xs font-sans text-zinc-500">
                            <div className="whitespace-pre-line">{t("radar_term_n1")}</div>
                            <div className="whitespace-pre-line">{t("radar_term_n2")}</div>
                            <div className="whitespace-pre-line">{t("radar_term_n3")}</div>
                            <div className="whitespace-pre-line">{t("radar_term_n4")}</div>
                            <div className="whitespace-pre-line">{t("radar_term_n5")}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: SERVI!O CONTRATADO */}
                  {currentStep === 4 && (
                    <div className="space-y-6 py-2">
                      <div className="space-y-2">
                        <span className="text-xs font-sans text-zinc-500 uppercase">{t("escopo_title")}</span>
                        <h3 className="text-white font-display text-sm font-semibold">
                          {t("escopo_heading")}
                        </h3>
                        <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                          {t("escopo_desc")}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
                        {servicesOptions.map((opt) => {
                          const IconComp = opt.icon;
                          const active = isSelected(opt.id);
                          return (
                            <div
                              key={opt.id}
                              onClick={() => handleToggleService(opt.id)}
                              onKeyDown={(event) => activateOnKeyboard(event, () => handleToggleService(opt.id))}
                              role="checkbox"
                              aria-checked={active}
                              tabIndex={0}
                              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between text-left h-[130px] relative ${
                                active
                                  ? "bg-brand-secondary/[0.02] border-brand-secondary shadow-[0_4px_15px_rgba(var(--color-brand-secondary-rgb),0.05)]"
                                  : "bg-neutral-900/30 border-white/[0.04] hover:bg-neutral-900/60 hover:border-white/[0.1]"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                                  active ? "bg-brand/15 border-brand text-brand" : "bg-white/[0.02] border-white/[0.06] text-zinc-400"
                                }`}>
                                  <IconComp className="w-4.5 h-4.5" />
                                </div>
                                {active && (
                                  <div className="w-5 h-5 rounded-full bg-brand-secondary flex items-center justify-center">
                                    <Check className="w-3.5 h-3.5 text-black" />
                                  </div>
                                )}
                              </div>

                              <div className="space-y-0.5">
                                <p className={`text-xs font-display uppercase tracking-tight font-bold ${active ? "text-white" : "text-zinc-300"}`}>
                                  {opt.label}
                                </p>
                                <span className="text-xs font-sans text-zinc-500 uppercase">SYS MODULE</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {isSelected("Outro") && (
                        <div className="space-y-2 p-4 bg-white/[0.01] border border-white/[0.04] rounded-2xl">
                          <label className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider block">
                            {t("escopo_label_custom")}
                          </label>
                          <input
                            type="text"
                            value={customServiceText}
                            onChange={(e) => setCustomServiceText(e.target.value)}
                            placeholder={t("escopo_placeholder_custom")}
                            className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-all font-sans"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 5: BRIEFING ESPECFICO POR SERVI!O */}
                  {currentStep === 5 && (
                    <div className="space-y-6 py-2 overflow-y-auto max-h-[500px] pr-2">
                      <div className="space-y-2 bg-neutral-950 p-4 rounded-xl border border-white/[0.03] mb-4">
                        <span className="font-sans text-xs text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2 py-0.5 rounded font-black uppercase inline-block">MÓDULO CUSTOMIZADO ATIVO</span>
                        <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                          Sua empresa contratou <strong>{selectedServices.join(", ")}</strong>. Responda abaixo os detalhes operacionais que ditou nossa produção técnica:
                        </p>
                      </div>

                      {/* 5a. GESTO DE REDES SOCIAIS BRIEFING */}
                      {isSelected("Gestão de Redes Sociais") && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 p-5 rounded-2xl border border-white/[0.05] bg-neutral-900/30 text-left">
                          <h4 className="text-brand-secondary font-sans text-xs font-extrabold border-b border-white/[0.03] pb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-secondary" /> Redes Sociais & Conteúdo
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">Canais a serem trabalhados (Ex: Instagram, LinkedIn, YT)</label>
                              <input type="text" value={smChannels} onChange={(e) => setSmChannels(e.target.value)} placeholder="Instagram e YouTube" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400 font-sans">Qual o principal pblico desejado?</label>
                              <input type="text" value={smTargetAudience} onChange={(e) => setSmTargetAudience(e.target.value)} placeholder="Diretores de empresas parceiras" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                            <div className="space-y-1.5">
                              <label className="text-xs text-zinc-400 font-sans">Produtos/Serviços prioritrios a vender</label>
                              <input type="text" value={smPriorityProducts} onChange={(e) => setSmPriorityProducts(e.target.value)} placeholder="Tratamento estético VIP" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs text-zinc-400 font-sans">Quem são seus concorrentes diretos?</label>
                              <input type="text" value={smCompetitors} onChange={(e) => setSmCompetitors(e.target.value)} placeholder="..." className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                            <div className="space-y-1.5">
                              <label className="text-xs text-zinc-400 font-sans">Possui identidade visual consolidada?</label>
                              <select value={smHasBrandIdentity} onChange={(e) => setSmHasBrandIdentity(e.target.value)} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white">
                                <option value="sim">Sim, possuo manual completo e cores padrão</option>
                                <option value="no">Não possuo, necessito estrutura</option>
                              </select>
                            </div>
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400 font-sans">Possui banco de fotos/vídeos corporativos?</label>
                              <select value={smHasMediaBank} onChange={(e) => setSmHasMediaBank(e.target.value)} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white">
                                <option value="sim">Sim, temos acervo de fotos da equipe e operação</option>
                                <option value="no">Não possuímos acervo atual</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
                            <div className="space-y-1">
                              <label className="text-xs text-zinc-400">Quem gravar os vídeos?</label>
                              <input type="text" value={smRecordsVideos} onChange={(e) => setSmRecordsVideos(e.target.value)} placeholder="Dr. Fernando Guedes" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white" />
                            </div>
                            <div className="space-y-1 font-sans">
                              <label className="text-xs text-zinc-400">Quem aprova temas?</label>
                              <input type="text" value={smApprovesContent} onChange={(e) => setSmApprovesContent(e.target.value)} placeholder="..." className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white" />
                            </div>
                            <div className="space-y-1 font-sans">
                              <label className="text-xs text-zinc-400">Temas proibidos/bloqueados</label>
                              <input type="text" value={smForbiddenTopics} onChange={(e) => setSmForbiddenTopics(e.target.value)} placeholder="..." className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white" />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 5b. BRANDING BRIEFING */}
                      {isSelected("Branding & Identidade") && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 p-5 rounded-2xl border border-white/[0.05] bg-neutral-900/30 text-left">
                          <h4 className="text-brand-secondary font-sans text-xs font-extrabold border-b border-white/[0.03] pb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-secondary" /> Branding &amp; Identidade Visual
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">A marca/empresa já possui identidade visual ativa?</label>
                              <select value={brBrandExists} onChange={(e) => setBrBrandExists(e.target.value)} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white">
                                <option value="sim">Sim, mas está obsoleta (rebranding)</option>
                                <option value="não">Não, iniciaremos do zero completo</option>
                              </select>
                            </div>
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">Motivação por trás do projeto de identidade</label>
                              <input type="text" value={brReasonForChange} onChange={(e) => setBrReasonForChange(e.target.value)} placeholder="Atrair leads de maior poder aquisitivo" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                          </div>

                          <div className="space-y-2 font-sans">
                            <label className="text-xs text-zinc-400">Quais atributos comportamentais e conceitos visuais a marca deve transmitir?</label>
                            <textarea value={brDesiredAttributes} onChange={(e) => setBrDesiredAttributes(e.target.value)} rows={2} placeholder="Elegância discreta, sobriedade, robustez clínica e minimalismo sofisticado" className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl p-3 text-xs text-white resize-none" />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
                            <div className="space-y-1">
                              <label className="text-xs text-zinc-400">Marcas referência</label>
                              <input type="text" value={brReferencesLink} onChange={(e) => setBrReferencesLink(e.target.value)} placeholder="Ex: Apple" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white" />
                            </div>
                            <div className="space-y-1 font-sans">
                              <label className="text-xs text-zinc-400">Marcas a evitar</label>
                              <input type="text" value={brAvoidBrands} onChange={(e) => setBrAvoidBrands(e.target.value)} placeholder="..." className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white" />
                            </div>
                            <div className="space-y-1 font-sans">
                              <label className="text-xs text-zinc-400">O que nunca deve parecer?</label>
                              <input type="text" value={brBrandNeverBeLike} onChange={(e) => setBrBrandNeverBeLike(e.target.value)} placeholder="Ex: Amador ou espalhafatoso" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
                            <div className="space-y-1">
                              <label className="text-xs text-zinc-400">Nome já está definido?</label>
                              <select value={brHasNameSelected} onChange={(e) => setBrHasNameSelected(e.target.value)} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white">
                                <option value="sim">Sim, definitivo</option>
                                <option value="não">Não, necessito Naming</option>
                              </select>
                            </div>
                            <div className="space-y-1 font-sans">
                              <label className="text-xs text-zinc-400">Existe Slogan/Assinatura?</label>
                              <input type="text" value={brHasSloganText} onChange={(e) => setBrHasSloganText(e.target.value)} placeholder="Slogan atual" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white" />
                            </div>
                            <div className="space-y-1 font-sans">
                              <label className="text-xs text-zinc-400">Aplicações necessárias (.doc, sacolas, fardas)</label>
                              <input type="text" value={brRequiredApplications} onChange={(e) => setBrRequiredApplications(e.target.value)} placeholder="Ex: Receituários, Assinatura de Email" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white" />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 5c. WEB DEVELOPMENT BRIEFING */}
                      {isSelected("Desenvolvimento Web") && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 p-5 rounded-2xl border border-white/[0.05] bg-neutral-900/30 text-left">
                          <h4 className="text-brand-secondary font-sans text-xs font-extrabold border-b border-white/[0.03] pb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-secondary" /> Engenharia Web & Sites
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">J possui domínio registrado (ex: suaempresa.com.br)?</label>
                              <select value={webHasDomain} onChange={(e) => setWebHasDomain(e.target.value)} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white">
                                <option value="sim">Sim, domínio ativo e disponível</option>
                                <option value="não">Não temos, requeremos auxílio de compra</option>
                              </select>
                            </div>
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">Possui serviço de hospedagem ativada?</label>
                              <select value={webHasHosting} onChange={(e) => setWebHasHosting(e.target.value)} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white">
                                <option value="sim">Sim, possuo Cloud ativo</option>
                                <option value="não">Não, indicaremos os provedores modernos</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">Site atual (se houver)</label>
                              <input type="text" value={webCurrentSite} onChange={(e) => setWebCurrentSite(e.target.value)} placeholder="www.meusite.com.br" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">Qual o objetivo principal do novo site?</label>
                              <input type="text" value={webMainGoal} onChange={(e) => setWebMainGoal(e.target.value)} placeholder="Captar leads de alto padrão para reuniões" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                          </div>

                          <div className="space-y-1.5 font-sans">
                            <label className="text-xs text-zinc-400">Páginas e seções necessárias (Ex: Quem Somos, serviços, contato)</label>
                            <input type="text" value={webRequiredPages} onChange={(e) => setWebRequiredPages(e.target.value)} placeholder="Ex: Início, Equipe, 3 páginas de serviços, Contato" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
                            <div className="space-y-1">
                              <label className="text-xs text-zinc-400">Identidade de marca pronta?</label>
                              <select value={webHasBrandIdentity} onChange={(e) => setWebHasBrandIdentity(e.target.value)} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white">
                                <option value="sim">Sim, possuo assets e vetor</option>
                                <option value="não">Não, necessitamos branding previo</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-zinc-400">O material impresso/textos já estão prontos?</label>
                              <select value={webHasTextsReady} onChange={(e) => setWebHasTextsReady(e.target.value)} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white">
                                <option value="sim">Sim, textos finais redigidos</option>
                                <option value="não">Não, criaremos sob copy da TAG08</option>
                              </select>
                            </div>
                            <div className="space-y-1 font-sans">
                              <label className="text-xs text-zinc-400">Temos acervo real corporativo?</label>
                              <select value={webHasFilesReady} onChange={(e) => setWebHasFilesReady(e.target.value)} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white">
                                <option value="sim">Sim, fotos de excelente qualidade</option>
                                <option value="não">Não, usaremos banco premium</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-2 border-t border-white/[0.03] pt-3 font-sans">
                            <span className="text-xs font-sans uppercase tracking-widest text-zinc-500 font-bold block">Integrações desejadas:</span>
                            <div className="flex flex-wrap gap-4 pt-1">
                              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                                <input type="checkbox" checked={webIntegrateWhatsApp} onChange={(e) => setWebIntegrateWhatsApp(e.target.checked)} className="accent-brand-secondary bg-zinc-950 border-white/[0.1] rounded" /> WhatsApp Fluido
                              </label>
                              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                                <input type="checkbox" checked={webIntegrateForm} onChange={(e) => setWebIntegrateForm(e.target.checked)} className="accent-brand-secondary bg-zinc-950 border-white/[0.1] rounded" /> Formulários Seguros
                              </label>
                              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                                <input type="checkbox" checked={webIntegrateCRM} onChange={(e) => setWebIntegrateCRM(e.target.checked)} className="accent-brand-secondary bg-zinc-950 border-white/[0.1] rounded" /> CRM (ex: RD Station)
                              </label>
                              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                                <input type="checkbox" checked={webNeedsBlog} onChange={(e) => setWebNeedsBlog(e.target.checked)} className="accent-brand-secondary bg-zinc-950 border-white/[0.1] rounded" /> Insights de SEO
                              </label>
                            </div>
                          </div>

                          <div className="space-y-1.5 font-sans">
                            <label className="text-xs text-zinc-400">Websites de referência que consideram sofisticados</label>
                            <input type="text" value={webReferenceUrls} onChange={(e) => setWebReferenceUrls(e.target.value)} placeholder="www.referência.com, www.exemplo.com" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                          </div>
                        </motion.div>
                      )}

                      {/* 5d. PROCESS INTELLIGENCE BRIEFING */}
                      {isSelected("Process Intelligence") && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 p-5 rounded-2xl border border-white/[0.05] bg-neutral-900/30 text-left">
                          <h4 className="text-brand-secondary font-sans text-xs font-extrabold border-b border-white/[0.03] pb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-secondary" /> Process Intelligence
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">Total de colaboradores internos da sua empresa</label>
                              <input type="text" value={piTeamSize} onChange={(e) => setPiTeamSize(e.target.value)} placeholder="Ex: 12 pessoas" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">Quais divisões/setores estruturados operam hoje?</label>
                              <input type="text" value={piDepartments} onChange={(e) => setPiDepartments(e.target.value)} placeholder="Ex: Comercial, Financeiro, Pós-venda" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">Quais setores estão operando em maior desalinhamento?</label>
                              <input type="text" value={piDisorganizedAreas} onChange={(e) => setPiDisorganizedAreas(e.target.value)} placeholder="Ex: Atendimento comercial de entrada" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">Quais gargalos de tarefas requerem pessoas exclusivas?</label>
                              <input type="text" value={piPersonDependent} onChange={(e) => setPiPersonDependent(e.target.value)} placeholder="..." className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">Qual tarefa que costuma acumular maior retrabalho interno?</label>
                              <input type="text" value={piReworkTasks} onChange={(e) => setPiReworkTasks(e.target.value)} placeholder="Ex: Passagem de bastão do comercial para produção" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">Quais ferramentas/softwares utilizam hoje de forma fixa?</label>
                              <input type="text" value={piCurrentTools} onChange={(e) => setPiCurrentTools(e.target.value)} placeholder="Trello, WhatsApp Web, Pipedrive" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
                            <div className="space-y-1">
                              <label className="text-xs text-zinc-400">Há documentação prévia?</label>
                              <select value={piHasDocumentation} onChange={(e) => setPiHasDocumentation(e.target.value)} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white">
                                <option value="não">Não, operamos no intuitivo</option>
                                <option value="sim">Sim, temos manuais básicos</option>
                              </select>
                            </div>
                            <div className="space-y-1 font-sans">
                              <label className="text-xs text-zinc-400">Dispõe de Organograma?</label>
                              <select value={piHasOrgChart} onChange={(e) => setPiHasOrgChart(e.target.value)} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white">
                                <option value="não">Não, organograma inconsistente</option>
                                <option value="sim">Sim, desenhado definitivo</option>
                              </select>
                            </div>
                            <div className="space-y-1 font-sans">
                              <label className="text-xs text-zinc-400">Há rotina semanal de reuniões?</label>
                              <select value={piHasMeetings} onChange={(e) => setPiHasMeetings(e.target.value)} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white">
                                <option value="não">Não, apenas esporádico</option>
                                <option value="sim">Sim, de checkpoint diário/semanal</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1.5 font-sans">
                            <label className="text-xs text-zinc-400">Aponte o estopim de maior cansaço ou gargalo operacional atual</label>
                            <input type="text" value={piMainBottleneck} onChange={(e) => setPiMainBottleneck(e.target.value)} placeholder="Ex: Falta de padrão nas passagens de briefing técnicos" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                          </div>
                        </motion.div>
                      )}

                      {/* 5e. PROCESS ACTIVATION BRIEFING */}
                      {isSelected("Process Activation") && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 p-5 rounded-2xl border border-white/[0.05] bg-neutral-900/30 text-left">
                          <h4 className="text-brand-secondary font-sans text-xs font-extrabold border-b border-white/[0.03] pb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-secondary" /> Governança &amp; Process Activation
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">Já realizaram Process Intelligence com a TAG08?</label>
                              <select value={paHasPiDiagnose} onChange={(e) => setPaHasPiDiagnose(e.target.value)} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white">
                                <option value="sim">Sim, temos os playbooks desenhados</option>
                                <option value="não">Não, requeremos documentação inicial</option>
                              </select>
                            </div>
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">Quais processos já se encontram prontos no papel?</label>
                              <input type="text" value={paDocumentedProcesses} onChange={(e) => setPaDocumentedProcesses(e.target.value)} placeholder="Ex: Fluxograma do comercial e admissão" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">Processos não utilizados/adotados na rotina</label>
                              <input type="text" value={paUnappliedProcesses} onChange={(e) => setPaUnappliedProcesses(e.target.value)} placeholder="..." className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">Quais times/lideranças internas devem ser treinados?</label>
                              <input type="text" value={paTeamsToTrain} onChange={(e) => setPaTeamsToTrain(e.target.value)} placeholder="Ex: Equipe operacional de vendas" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">Indique o líder pela aplicação diária dos planos</label>
                              <input type="text" value={paResponsibleLeader} onChange={(e) => setPaResponsibleLeader(e.target.value)} placeholder="Ex: Gerente Administrativo" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">Maior dificuldade na adoção de manuais operacionais</label>
                              <input type="text" value={paBiggestDifficulty} onChange={(e) => setPaBiggestDifficulty(e.target.value)} placeholder="Ex: Esquecimento e resistência a novos softwares" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                          </div>

                          <div className="space-y-1.5 font-sans">
                            <label className="text-xs text-zinc-400">A equipe possui agenda livre e disposição para mentorias de liderança?</label>
                            <select value={paHasTimeForTraining} onChange={(e) => setPaHasTimeForTraining(e.target.value)} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white">
                              <option value="sim">Sim, de forma integrada no expediente</option>
                              <option value="não">Não, necessitaremos de horários restritivos</option>
                            </select>
                          </div>
                        </motion.div>
                      )}

                      {/* General fallback fields for other types */}
                      {(!isSelected("Gestão de Redes Sociais") && !isSelected("Branding & Identidade") && !isSelected("Desenvolvimento Web") && !isSelected("Process Intelligence") && !isSelected("Process Activation")) && (
                        <div className="space-y-3 font-sans">
                          <label className="text-xs text-zinc-400">{t("briefing_not_selected_desc")}</label>
                          <textarea value={generalBriefingText} onChange={(e) => setGeneralBriefingText(e.target.value)} rows={5} placeholder={t("briefing_not_selected_placeholder")} className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl p-3 text-xs text-white resize-none" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 6: MATERIAIS E LINKS DE APOIO */}
                  {currentStep === 6 && (
                    <div className="space-y-6 py-2">
                       <div className="space-y-1">
                        <span className="text-xs font-sans text-zinc-500 uppercase">{t("materiais_title")}</span>
                        <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                          {t("materiais_desc")}
                        </p>
                        <div className="text-xs text-amber-300 font-semibold flex items-center gap-1 font-sans pt-1">
                          <AlertCircle className="w-3.5 h-3.5" /> 
                          <span>{t("materiais_warning")}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                        <div className="space-y-1.5 font-sans">
                          <label className="text-xs text-zinc-400">{t("materiais_label_drive")}</label>
                          <input type="url" value={linkDrive} onChange={(e) => setLinkDrive(e.target.value)} placeholder="https://drive.google.com/..." className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                        </div>
                        <div className="space-y-1.5 font-sans">
                          <label className="text-xs text-zinc-400">{t("materiais_label_insta")}</label>
                          <input type="url" value={linkInstagram} onChange={(e) => setLinkInstagram(e.target.value)} placeholder="https://instagram.com/..." className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                        <div className="space-y-1.5 text-left">
                          <label className="text-xs text-zinc-400">{t("materiais_label_site")}</label>
                          <input type="url" value={linkSite} onChange={(e) => setLinkSite(e.target.value)} placeholder="https://suasite.com.br" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                        </div>
                        <div className="space-y-1.5 font-sans">
                          <label className="text-xs text-zinc-400">{t("materiais_label_portfolio")}</label>
                          <input type="url" value={linkPortfolio} onChange={(e) => setLinkPortfolio(e.target.value)} placeholder="https://..." className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
                        <div className="space-y-1 text-left">
                          <label className="text-xs text-zinc-400">{t("materiais_label_references")}</label>
                          <input type="url" value={linkReferences} onChange={(e) => setLinkReferences(e.target.value)} placeholder="https://..." className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white font-sans" />
                        </div>
                        <div className="space-y-1 font-sans">
                          <label className="text-xs text-zinc-400">{t("materiais_label_documents")}</label>
                          <input type="url" value={linkDocuments} onChange={(e) => setLinkDocuments(e.target.value)} placeholder="https://..." className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white font-sans" />
                        </div>
                        <div className="space-y-1 font-sans">
                          <label className="text-xs text-zinc-400">{t("materiais_label_commercial")}</label>
                          <input type="url" value={linkCommercial} onChange={(e) => setLinkCommercial(e.target.value)} placeholder="https://..." className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white font-sans" />
                        </div>
                      </div>
                    </div>
                  )}

                   {/* STEP 7: EXPECTATIVAS PARA PRÓXIMOS 90 DIAS */}
                  {currentStep === 7 && (
                    <div className="space-y-6 py-2 overflow-y-auto max-h-[500px] pr-2 font-sans">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-400">{t("expectativas_subtitle")}</label>
                          <input type="text" value={whySeekTag08} onChange={(e) => setWhySeekTag08(e.target.value)} placeholder={t("expectativas_placeholder_1")} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-400">{t("expectativas_label_tried")}</label>
                          <input type="text" value={whatTriedBefore} onChange={(e) => setWhatTriedBefore(e.target.value)} placeholder={t("expectativas_placeholder_tried")} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-400">{t("expectativas_label_did_not_work")}</label>
                          <input type="text" value={whatDidNotWork} onChange={(e) => setWhatDidNotWork(e.target.value)} placeholder={t("expectativas_placeholder_did_not_work")} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-400 font-bold text-brand-secondary">{t("expectativas_label_good_result")}</label>
                          <input type="text" required value={goodResult90Days} onChange={(e) => setGoodResult90Days(e.target.value)} placeholder={t("expectativas_placeholder_good_result")} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-400">{t("expectativas_label_urgency")}</label>
                          <input type="text" value={biggestUrgency} onChange={(e) => setBiggestUrgency(e.target.value)} placeholder={t("expectativas_placeholder_urgency")} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-400">{preferredLanguage === "en" ? "Are there important deadlines/launch dates?" : preferredLanguage === "es" ? "Tiene plazos de entrega/kickoff importantes?" : "Existe algum prazo importante ou kickoff agendado?"}</label>
                          <input type="text" value={importantDeadlines} onChange={(e) => setImportantDeadlines(e.target.value)} placeholder={preferredLanguage === "en" ? "e.g., Launch complete site by 30th" : preferredLanguage === "es" ? "Ej: Lanzar la web estratégica para el día 30" : "Ex: Lançar o site estratégico até o dia 30"} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-zinc-400">{t("expectativas_label_not_err")}</label>
                        <textarea value={notToMakeMistakes} onChange={(e) => setNotToMakeMistakes(e.target.value)} rows={2} placeholder={t("expectativas_placeholder_not_err")} className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl p-3 text-xs text-white resize-none" />
                      </div>
                    </div>
                  )}

                  {/* STEP 8: CONSENTIMENTO */}
                  {currentStep === 8 && (
                    <div className="space-y-6 py-2 font-sans">
                      <div className="p-5 rounded-2xl bg-brand-secondary/[0.01] border border-brand-secondary/10 space-y-4">
                        <div className="flex items-center gap-2.5 text-brand-secondary font-sans text-xs uppercase font-extrabold pb-2 border-b border-white/[0.03]">
                          <Lock className="w-4.5 h-4.5" /> {t("consent_title")}
                        </div>
                        
                        <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                          {t("consent_desc")}
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        <label className="flex items-start gap-3.5 p-4 bg-zinc-950/40 border border-white/[0.04] hover:border-white/[0.08] rounded-2xl cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={consentTruth}
                            onChange={(e) => setConsentTruth(e.target.checked)}
                            className="mt-1 w-4 h-4 accent-brand-secondary bg-zinc-900 border-white/[0.1] rounded shrink-0"
                          />
                          <p className="text-zinc-300 text-xs leading-relaxed">
                            {t("consent_opt1")}
                          </p>
                        </label>

                        <label className="flex items-start gap-3.5 p-4 bg-zinc-950/40 border border-white/[0.04] hover:border-white/[0.08] rounded-2xl cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={consentUsage}
                            onChange={(e) => setConsentUsage(e.target.checked)}
                            className="mt-1 w-4 h-4 accent-brand-secondary bg-zinc-900 border-white/[0.1] rounded shrink-0"
                          />
                          <p className="text-zinc-300 text-xs leading-relaxed">
                            {t("consent_opt2")}
                          </p>
                        </label>

                        <label className="flex items-start gap-3.5 p-4 bg-zinc-950/40 border border-white/[0.04] hover:border-white/[0.08] rounded-2xl cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={consentNoPasswords}
                            onChange={(e) => setConsentNoPasswords(e.target.checked)}
                            className="mt-1 w-4 h-4 accent-brand-secondary bg-zinc-900 border-white/[0.1] rounded shrink-0"
                          />
                          <p className="text-zinc-300 text-xs leading-relaxed">
                            {t("consent_opt3")}
                          </p>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* STEP 9: SUCCESS CONFIRMATION PAGE */}
                  {currentStep === 9 && isSubmitted && (
                    <div className="space-y-8 py-2 font-sans">
                      <div className="space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary flex items-center justify-center shadow-xl mb-4">
                          <ClipboardCheck className="w-8 h-8" />
                        </div>
                      <span className="tag08-meta text-xs text-brand-secondary uppercase font-black tracking-widest block">{t("finalized_badge")}</span>
                        <h2 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                          {t("finalized_title")}
                        </h2>
                        <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                          {t("finalized_desc_1")}
                        </p>
                        {deliveryMessage ? (
                          <p className="text-xs text-brand-secondary leading-relaxed">{deliveryMessage}</p>
                        ) : null}
                        {deliveryState === "queued" && pendingQueueCount > 0 ? (
                          <p className="text-xs text-zinc-400">
                            {t("status_queue_summary").replace("{count}", String(pendingQueueCount))}
                          </p>
                        ) : null}
                      </div>

                      {/* Onboarding automatic system checks */}
                      <div className="p-5 rounded-2xl bg-neutral-950 border border-white/[0.03] space-y-4 text-left">
                        <span className="font-sans text-xs text-brand-secondary uppercase font-black block">
                          {preferredLanguage === "en" ? "RECEIPT CHECKLIST // SYSTEM INDICATORS" : preferredLanguage === "es" ? "LISTA DE RECEPCIÓN // INDICADORES DEL SISTEMA" : "CHECKLIST DE RECEBIMENTO // SINALIZADORES SISTÊMICOS"}
                        </span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex gap-2.5 items-center text-xs text-zinc-300">
                            <div className="w-4 h-4 rounded-full bg-brand flex items-center justify-center text-black font-extrabold text-xs"><Check className="w-3 h-3" /></div>
                            <span>{preferredLanguage === "en" ? "Registration data received" : preferredLanguage === "es" ? "Datos de registro recibidos" : "Dados cadastrais recebidos"}</span>
                          </div>
                          <div className="flex gap-2.5 items-center text-xs text-zinc-300">
                            <div className="w-4 h-4 rounded-full bg-brand flex items-center justify-center text-black font-extrabold text-xs"><Check className="w-3 h-3" /></div>
                            <span>{preferredLanguage === "en" ? "Production briefing registered" : preferredLanguage === "es" ? "Briefing de producción registrado" : "Briefing de produção registrado"}</span>
                          </div>
                          <div className="flex gap-2.5 items-center text-xs text-zinc-300">
                            <div className="w-4 h-4 rounded-full bg-brand flex items-center justify-center text-black font-extrabold text-xs"><Check className="w-3 h-3" /></div>
                            <span>{preferredLanguage === "en" ? "Notification sent to TAG08 board" : preferredLanguage === "es" ? "Notificación enviada a la directiva" : "Notificação enviada à diretoria TAG08"}</span>
                          </div>
                          <div className="flex gap-2.5 items-center text-xs text-zinc-300 animate-pulse">
                            <div className="w-3 h-3 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_#fbbf24]" />
                            <span className="text-zinc-400">{preferredLanguage === "en" ? "Next step: Internal review" : preferredLanguage === "es" ? "Siguiente etapa: Revisão interna" : "Próxima etapa: Conferência interna"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] text-left">
                        <span className="font-sans text-xs text-zinc-500 uppercase font-black block mb-1">
                          {preferredLanguage === "en" ? "DURING THIS INTERVAL, YOU CAN PREPARE:" : preferredLanguage === "es" ? "DURANTE ESTE INTERVALO, PUEDE PREPARAR:" : "DURANTE ESSE INTERVALO, VOC? PODE SEPARAR:"}
                        </span>
                        
                        <ul className="space-y-1.5 text-zinc-400 text-xs">
                          <li className="flex gap-2 items-center">{preferredLanguage === "en" ? "Original brand assets (.EPS or vector Logo)" : preferredLanguage === "es" ? "Archivos originales de marca (.EPS o vector de Logo)" : "Arquivos originais da marca (.EPS ou vetor do Logotipo)"}</li>
                          <li className="flex gap-2 items-center">{preferredLanguage === "en" ? "Links and basic credentials of current channels" : preferredLanguage === "es" ? "Enlaces y credenciales básicas de canales actuales" : "Links e credenciais básicas dos canais atuais"}</li>
                          <li className="flex gap-2 items-center">{preferredLanguage === "en" ? "Image bank (team photos, physical workspace, or clinic)" : preferredLanguage === "es" ? "Banco de imagens (fotos del equipo, espacio físico o clínica)" : "Acervo de imagens (fotos da equipe, operação fsica ou clínica)"}</li>
                          <li className="flex gap-2 items-center">{preferredLanguage === "en" ? "Additional reference documents for scripts" : preferredLanguage === "es" ? "Documentos de referência adicionales para guiones" : "Documentos de referência adicionais para os roteiros"}</li>
                          <li className="flex gap-2 items-center">{preferredLanguage === "en" ? "Access details to be requested via secure & auditable channel" : preferredLanguage === "es" ? "Detalles de acceso que se solicitarán por canal seguro y auditable" : "Acessos que serão solicitados por canal seguro e auditável"}</li>
                        </ul>
                      </div>

                      {/* Developer playground view trigger */}
                      <div className="bg-charcoal-950 p-4 rounded-xl border border-white/[0.03] flex items-center justify-between text-xs font-sans">
                        <span className="text-zinc-400">
                          {preferredLanguage === "en" ? "Structured payload (Sheets & ClickUp) generated:" : preferredLanguage === "es" ? "Payload estructurado (Sheets y ClickUp) generado:" : "Payload estruturado (Sheets & ClickUp) gerado:"}
                        </span>
                        <button 
                          onClick={() => setShowDevPayload(!showDevPayload)} 
                          className="text-brand-secondary bg-brand-secondary/5 px-2.5 py-1 rounded border border-brand-secondary/15 hover:bg-brand-secondary/10 transition-colors uppercase text-xs"
                        >
                          {showDevPayload 
                            ? (preferredLanguage === "en" ? "Hide Structure" : preferredLanguage === "es" ? "Ocultar Estructura" : "Ocultar Estrutura") 
                            : (preferredLanguage === "en" ? "Inspect Payload" : preferredLanguage === "es" ? "Inspecionar Payload" : "Inspecionar Payload")}
                        </button>
                      </div>

                      {showDevPayload && generatedPayload && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: "auto" }}
                          className="bg-zinc-950 border border-white/[0.06] p-4 rounded-xl font-sans text-xs text-zinc-400 overflow-x-auto text-left space-y-3"
                        >
                          <div>
                            <span className="text-brand-secondary font-bold block mb-1 uppercase tracking-widest">// SHEETS INSTANT MAPPING PAYLOAD</span>
                            <pre className="p-2.5 bg-neutral-900 rounded select-all max-h-[150px] overflow-y-auto">
                              {JSON.stringify(generatedPayload.sheetPayload, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <span className="text-amber-400 font-bold block mb-1 uppercase tracking-widest">// CLICKUP INSTANT COMPLIANCE PAYLOAD</span>
                            <pre className="p-2.5 bg-neutral-900 rounded select-all max-h-[150px] overflow-y-auto">
                              {JSON.stringify(generatedPayload.clickupPayload, null, 2)}
                            </pre>
                          </div>
                        </motion.div>
                      )}

                      <div className="pt-4 border-t border-white/[0.04] flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <button
                          type="button"
                          onClick={() => onNavigate("/")}
                          className="font-sans text-xs text-zinc-500 hover:text-white uppercase tracking-wider transition-colors pt-1.5"
                        >
                          &larr; {preferredLanguage === "en" ? "Back to home" : preferredLanguage === "es" ? "Volver al inicio" : "Voltar para o início"}
                        </button>

                        <button
                          type="button"
                          onClick={handleLaunchWhatsAppOnboardingFastTrack}
                          className="px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-sans font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-[0_8px_30px_rgba(16,185,129,0.15)] hover:-translate-y-0.5"
                        >
                          <MessageCircle className="w-4.5 h-4.5" /> {preferredLanguage === "en" ? "Talk to TAG08 on WhatsApp" : preferredLanguage === "es" ? "Hablar con TAG08 en WhatsApp" : "Falar com a TAG08 no WhatsApp"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* BOTTOM CONTROLS FOR THE WIZARD */}
                  {currentStep > 0 && currentStep < 9 && (
                    <div className="pt-6 border-t border-white/[0.04] flex items-center justify-between mt-8">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="px-5 py-3 border border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.01] rounded-xl text-xs font-sans uppercase tracking-wider text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" /> Voltar
                      </button>

                      {currentErrors.length > 0 && (
                        <div className="hidden sm:flex text-red-400 text-xs items-center gap-1 max-w-[50%] font-medium">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{currentErrors[0]}</span>
                        </div>
                      )}

                      {currentStep < 8 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-6 py-3.5 bg-brand-secondary hover:bg-brand-dark text-black text-xs font-sans font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-[0_4px_20px_rgba(var(--color-brand-secondary-rgb),0.12)] hover:-translate-y-0.5"
                        >
                          Avançar <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="px-6 py-4 bg-brand hover:bg-brand-dark text-black text-xs font-sans font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_25px_rgba(var(--color-brand-rgb),0.15)]"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="w-4 h-4 border-2 border-black border-r-transparent rounded-full animate-spin shrink-0" />
                              {t("btn_submitting")}
                            </>
                          ) : (
                            <>
                              Enviar Onboarding Completo <Send className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Responsive Error Warning for smaller layout viewports */}
                  {currentErrors.length > 0 && (
                    <div className="flex sm:hidden p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 text-xs items-start gap-2 max-w-full font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{currentErrors[0]}</span>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}


















