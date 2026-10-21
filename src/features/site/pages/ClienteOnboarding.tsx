import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { activateOnKeyboard } from "../../../lib/keyboard";
import {
  ONBOARDING_PAYLOAD_VERSION
} from "../../../../server/onboardingContract";
import { buildBrazilWhatsAppUrl } from "../../../config/siteNetwork";
import type { RouteLocale } from "../../../config/routeRegistry";
import { ONBOARDING_DRAFT_VERSION, parseOnboardingDraft, type OnboardingDraft } from "../../../lib/onboardingDraft";

type Language = "pt" | "en" | "es";
type DeliveryState = "idle" | "online" | "error";
type OnboardingDeliveryStatus = "received" | "accepted" | "failed";
type OnboardingSubmitResult = {
  ok: boolean;
  submissionId: string;
  status: OnboardingDeliveryStatus;
  receivedAt: string;
  error?: string;
};
type OnboardingSubmissionPayload = Record<string, unknown>;
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
    ["received", "accepted", "failed"].includes(candidate.status)
  );
};

const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Header & Titles
    op_tool: "Ferramenta Operacional de Integração",
    title_prefix: "Assistente de Onboarding",
    header_desc: "Inicie a engenharia de seu projeto de forma leve e progressiva. Evitamos a rigidez de formulários tradicionais por meio de perguntas táticas guiadas.",
    
    // Privacy Sidebar
    privacy_title: "TRATAMENTO RESPONSÁVEL DE DADOS",
    privacy_desc: "As informações ficam vinculadas à jornada autorizada e são usadas para preparar o projeto. Não envie senhas ou dados desnecessários.",
    privacy_indicators: "COMO OS DADOS SÃO USADOS:",
    privacy_p1: "Tratamento conforme a LGPD",
    privacy_p2: "Links e materiais usados apenas no briefing",
    privacy_p3: "Acessos sempre solicitados por canal seguro",
    
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
    welcome_steps_title: "Como funciona",
    question_label: "PERGUNTA",
    exit_flow: "Sair do preenchimento",
    confirm_exit_flow: "Suas respostas ainda não foram enviadas e serão perdidas se você sair. Deseja sair do onboarding?",
    question_company_identity: "Qual é o nome da sua empresa ou projeto?",
    question_company_location: "Onde sua empresa está localizada?",
    question_digital_presence: "Onde podemos conhecer sua presença digital?",
    question_service_language: "Em qual idioma o cliente prefere receber atendimento?",
    question_project_contact: "Quem será o contato principal do projeto?",
    question_contact_channels: "Como podemos falar com essa pessoa?",
    question_additional_contacts: "Há outros contatos que devem participar do projeto?",
    question_business_moment: "Qual frase melhor representa o momento da empresa?",
    question_priority: "Qual deve ser a primeira prioridade?",
    question_maturity: "Como você avalia hoje a organização da empresa?",
    question_services: "Quais serviços foram contratados?",
    question_service_briefing: "Há detalhes específicos do escopo que devemos conhecer?",
    question_materials: "Onde estão os materiais de referência do projeto?",
    question_success: "O que seria um bom resultado nos primeiros 90 dias?",
    question_consent: "Você confirma estas informações e autorizações?",
    est_time: "Tempo Estimado",
    est_time_desc: "Leva de 8 a 15 minutos. Preencha em uma única sessão: as respostas não enviadas não ficam salvas se você sair desta página.",
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
    empresa_lang_title: "Em qual idioma o cliente prefere receber o atendimento?",
    empresa_lang_badge: "Preferência do cliente",
    empresa_lang_desc: "Esta escolha não altera o idioma deste formulário. Se a equipe TAG08 estiver preenchendo, selecione o idioma preferido pelo cliente.",
    empresa_lang_pt_desc: "Equipe nativa e playbooks em PT-BR",
    empresa_lang_en_desc: "Global support & English technical delivery",
    empresa_lang_es_desc: "Soporte y flujos estratégicos en español",
    
    // Step 2: Responsável / Contatos
    equipe_label_name: "Nome do contato responsável pelo projeto *",
    equipe_placeholder_name: "Ex: Dr. Fernando Guedes",
    equipe_label_role: "Cargo / Função na Empresa",
    equipe_placeholder_role: "Ex: Fundador e Diretor Clínico",
    equipe_label_email: "E-mail de Contato Comercial *",
    equipe_placeholder_email: "Ex: dr@clinicaguedes.com",
    equipe_label_whatsapp: "WhatsApp Corporativo / Pessoal *",
    equipe_placeholder_whatsapp: "Ex: (11) 99999-9999",
    equipe_additional_contacts: "Adicionar outros contatos (opcional)",
    equipe_label_ti: "Ponto focal técnico (ex: DNS, TI)",
    equipe_placeholder_ti: "Ex: Camila (Marketing)",
    equipe_label_approver: "Quem aprova decisões estratégicas?",
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
    briefing_module_desc: "Sua empresa contratou {services}. Se quiser, acrescente detalhes específicos para cada serviço; você pode avançar sem responder a todos.",
    briefing_optional_details: "Adicionar detalhes por serviço (opcional)",
    briefing_not_selected_desc: "Algum contexto importante que ainda não perguntamos? (opcional — não repita informações já preenchidas)",
    briefing_not_selected_placeholder: "Se houver algo relevante que ficou de fora, conte aqui. Você pode deixar em branco.",
    
    // Step 6: Materiais
    materiais_title: "MATERIAIS E LINKS DE SUPORTE",
    materiais_desc: "Forneça links de pastas compartilhadas públicas ou materiais comerciais para abastecer nossa equipe (Ex: Google Drive, Dropbox, Figma).",
    materiais_label_drive: "Link Pasta Principal (Google Drive/Dropbox)",
    materiais_more_links: "Adicionar outros materiais (opcional)",
    materiais_label_portfolio: "Link Portfólio / Catálogo Oficial",
    materiais_label_references: "Referências Visuais (Links ou Pinterest)",
    materiais_label_documents: "Manual de Marca ou Logotipos (.PDF / .AI / .PNG)",
    materiais_label_commercial: "Apresentação Comercial / Pitch Deck",
    
    // Step 7: Expectativas
    expectativas_title: "DIREÇÃO E EXPECTATIVAS DE SUCESSO na TAG08",
    expectativas_optional_context: "Adicionar contexto opcional",
    expectativas_answer_label: "Sua resposta",
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
    finalized_badge: "ONBOARDING RECEBIDO",
    finalized_queued_badge: "AGUARDANDO SINCRONIZAÇÃO",
    finalized_title: "Informações registradas com sucesso",
    finalized_queued_title: "Envio ainda não recebido pela TAG08",
    finalized_desc_1: "Suas informações foram recebidas e registradas para o projeto contratado.",
    finalized_queued_desc: "O envio está na fila local deste navegador. O sistema tentará novamente quando a conexão voltar; confira este status mais tarde.",
    finalized_desc_2: "A TAG08 dará continuidade às próximas etapas do processo. Se quiser, você também pode falar com a equipe pelo WhatsApp.",
    whatsapp_template_msg: "Olá time TAG08! Concluímos o preenchimento do nosso onboarding institucional via Assistente Conversacional.\\n\\nEmpresa: {company}\\nRepresentante: {name}\\nMeta dos próximos 90 dias: {goal}.\\n\\nAguardamos contato técnico para agendarmos nosso kickoff!",
    
    // Errors
    err_company_name: "O nome da sua empresa é essencial para darmos o pontapé.",
    err_responsible_name: "Informe o nome do responsável principal.",
    err_responsible_email: "Insira um endereço de e-mail corporativo válido.",
    err_company_website: "Informe um endereço de site válido.",
    err_responsible_whatsapp: "Precisamos de um número de WhatsApp ativo para contato técnico.",
    err_business_moment: "Por favor, selecione a alternativa que mais condiz com o momento de sua empresa.",
    err_priority_map: "Por favor, assinale qual área de prioridade podemos te auxiliar primeiro.",
    err_selected_services: "Selecione ao menos um dos formatos ou serviços contratados de seu projeto.",
    err_good_result: "Descreva o que seria um bom resultado nos primeiros 90 dias.",
    err_consent: "Você precisa estar ciente e marcar todos os 3 tópicos de consentimento sob LGPD para submeter o onboarding."
  },
  en: {
    // Header & Titles
    op_tool: "Integration Operational Tool",
    title_prefix: "Onboarding Assistant",
    header_desc: "Start your project engineering smoothly and progressively. We avoid rigid traditional forms through guided tactical questions.",
    
    // Privacy Sidebar
    privacy_title: "RESPONSIBLE DATA HANDLING",
    privacy_desc: "This information is linked to the authorized journey and used to prepare the project. Do not submit passwords or unnecessary data.",
    privacy_indicators: "HOW DATA IS USED:",
    privacy_p1: "Processing under applicable privacy rules",
    privacy_p2: "Links and assets used for the briefing",
    privacy_p3: "Access requests always use a secure channel",
    
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
    welcome_steps_title: "How it works",
    question_label: "QUESTION",
    exit_flow: "Exit onboarding",
    confirm_exit_flow: "Your answers have not been submitted and will be lost if you leave. Do you want to exit onboarding?",
    question_company_identity: "What is the name of your company or project?",
    question_company_location: "Where is your company located?",
    question_digital_presence: "Where can we learn about your digital presence?",
    question_service_language: "Which language does the client prefer for support?",
    question_project_contact: "Who will be the primary project contact?",
    question_contact_channels: "How can we reach this person?",
    question_additional_contacts: "Are there other contacts who should be involved?",
    question_business_moment: "Which statement best describes the company's current situation?",
    question_priority: "What should be the first priority?",
    question_maturity: "How would you rate the company's current organization?",
    question_services: "Which services were contracted?",
    question_service_briefing: "Are there scope details our team should know?",
    question_materials: "Where can we find the project's reference materials?",
    question_success: "What would a good result in the first 90 days look like?",
    question_consent: "Do you confirm this information and these permissions?",
    est_time: "Estimated Time",
    est_time_desc: "It takes 8 to 15 minutes. Complete it in one session: unsent answers are not saved if you leave this page.",
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
    empresa_lang_title: "Which language does the client prefer for TAG08 support?",
    empresa_lang_badge: "Client preference",
    empresa_lang_desc: "This choice does not change the language of this form. If the TAG08 team is completing it, select the language preferred by the client.",
    empresa_lang_pt_desc: "Native team and playbooks in PT-BR",
    empresa_lang_en_desc: "Global support & English technical delivery",
    empresa_lang_es_desc: "Support and strategic flows in Spanish",
    
    // Step 2: Responsável / Contatos
    equipe_label_name: "Name of the client's project contact *",
    equipe_placeholder_name: "e.g., Mary Smith",
    equipe_label_role: "Role / Position in Company",
    equipe_placeholder_role: "e.g., Founder & Clinical Director",
    equipe_label_email: "Business Contact Email *",
    equipe_placeholder_email: "e.g., mary@yourcompany.com",
    equipe_label_whatsapp: "Corporate / Personal WhatsApp *",
    equipe_placeholder_whatsapp: "e.g., +1 (555) 019-2834",
    equipe_additional_contacts: "Add other contacts (optional)",
    equipe_label_ti: "Technical focal point (e.g. DNS, IT)",
    equipe_placeholder_ti: "e.g., Camilla (Marketing)",
    equipe_label_approver: "Who approves strategic decisions?",
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
    briefing_module_desc: "You selected {services}. Add service-specific details below if they are relevant; you can continue without answering every field.",
    briefing_optional_details: "Add service details (optional)",
    briefing_not_selected_desc: "Is there important context we have not asked about? (optional — do not repeat information already provided)",
    briefing_not_selected_placeholder: "If anything relevant was left out, add it here. You can leave this blank.",
    
    // Step 6: Materiais
    materiais_title: "SUPPORTING FILES & LINKS",
    materiais_desc: "Provide public shared links or assets to supply our creative and technical team (e.g., Drive, Figma, templates).",
    materiais_label_drive: "Main Folder Link (Google Drive/Dropbox)",
    materiais_more_links: "Add other materials (optional)",
    materiais_label_portfolio: "Catalog / Corporate Deck Link",
    materiais_label_references: "Visual Reference Link (or Pinterest)",
    materiais_label_documents: "Brand Manual or Logotypes (.PDF / .AI / .PNG)",
    materials_label_commercial: "Commercial Slides / Pitch Deck",
    
    // Step 7: Expectativas
    expectativas_title: "STRATEGIC DIRECTION & 90-DAY METRICS",
    expectativas_optional_context: "Add optional context",
    expectativas_answer_label: "Your answer",
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
    finalized_badge: "ONBOARDING RECEIVED",
    finalized_queued_badge: "SYNC PENDING",
    finalized_title: "Information recorded successfully",
    finalized_queued_title: "TAG08 has not received this submission yet",
    finalized_desc_1: "Your information has been received and recorded for the contracted project.",
    finalized_queued_desc: "The submission is in this browser's local queue. The app will retry when the connection returns; check this status again later.",
    finalized_desc_2: "TAG08 will continue with the next steps. If you wish, you can also contact the team on WhatsApp.",
    whatsapp_template_msg: "Hello TAG08 team! I have completed our Onboarding Guidelines via the Conversational Assistant.\\n\\nCompany: {company}\\nRepresentative: {name}\\nTarget 90 days: {goal}.\\n\\nLooking forward to scheduling our kickoff!",
    
    // Errors
    err_company_name: "Please fill in the Company Name in Step 1.",
    err_responsible_name: "Please fill in Representative details (Step 2).",
    err_responsible_email: "Please enter a valid corporate email address.",
    err_company_website: "Enter a valid website address.",
    err_responsible_whatsapp: "We need an active WhatsApp number for tactical contact.",
    err_business_moment: "Please select both the challenge and priority (Step 3).",
    err_priority_map: "Please select which area of priority we can assist you with first.",
    err_selected_services: "Please select at least one of the contracted services for your project.",
    err_good_result: "Describe what a good result in the first 90 days would look like.",
    err_consent: "You must review and check all 3 consent fields under regulation policies to submit onboarding."
  },
  es: {
    // Header & Titles
    op_tool: "Herramienta Operacional de Integración",
    title_prefix: "Asistente de Onboarding",
    header_desc: "Inicie la ingeniería de su proyecto de manera fluida y progresiva. Evitamos la rigidez de formularios tradicionales mediante preguntas tácticas guiadas.",
    
    // Privacy Sidebar
    privacy_title: "TRATAMIENTO RESPONSABLE DE DATOS",
    privacy_desc: "La información queda vinculada a la jornada autorizada y se usa para preparar el proyecto. No envíe contraseñas ni datos innecesarios.",
    privacy_indicators: "CÓMO SE USAN LOS DATOS:",
    privacy_p1: "Tratamiento conforme a las reglas aplicables",
    privacy_p2: "Enlaces y materiales usados para el briefing",
    privacy_p3: "Los accesos se solicitan por un canal seguro",
    
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
    welcome_steps_title: "Cómo funciona",
    question_label: "PREGUNTA",
    exit_flow: "Salir del onboarding",
    confirm_exit_flow: "Sus respuestas aún no se han enviado y se perderán si sale. ¿Desea salir del onboarding?",
    question_company_identity: "¿Cuál es el nombre de su empresa o proyecto?",
    question_company_location: "¿Dónde está ubicada su empresa?",
    question_digital_presence: "¿Dónde podemos conocer su presencia digital?",
    question_service_language: "¿En qué idioma prefiere recibir atención el cliente?",
    question_project_contact: "¿Quién será el contacto principal del proyecto?",
    question_contact_channels: "¿Cómo podemos comunicarnos con esta persona?",
    question_additional_contacts: "¿Hay otros contactos que deban participar en el proyecto?",
    question_business_moment: "¿Qué frase representa mejor el momento actual de la empresa?",
    question_priority: "¿Cuál debería ser la primera prioridad?",
    question_maturity: "¿Cómo evalúa hoy la organización de la empresa?",
    question_services: "¿Qué servicios fueron contratados?",
    question_service_briefing: "¿Hay detalles del alcance que debamos conocer?",
    question_materials: "¿Dónde están los materiales de referencia del proyecto?",
    question_success: "¿Qué sería un buen resultado durante los primeros 90 días?",
    question_consent: "¿Confirma esta información y estas autorizaciones?",
    est_time: "Tiempo Estimado",
    est_time_desc: "Toma de 8 a 15 minutos. Complételo en una sola sesión: las respuestas no enviadas no se guardan si sale de esta página.",
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
    empresa_lang_title: "¿En qué idioma prefiere recibir atención el cliente?",
    empresa_lang_badge: "Preferencia del cliente",
    empresa_lang_desc: "Esta elección no cambia el idioma de este formulario. Si el equipo TAG08 lo está completando, seleccione el idioma que prefiere el cliente.",
    empresa_lang_pt_desc: "Equipo nativo y documentos base en PT-BR",
    empresa_lang_en_desc: "Global support & English technical delivery",
    empresa_lang_es_desc: "Atención y flujos estratégicos en español",
    
    // Step 2: Responsável / Contatos
    equipe_label_name: "Nombre del contacto responsable del proyecto *",
    equipe_placeholder_name: "ej. Mara Silva",
    equipe_label_role: "Cargo / Función en la Empresa",
    equipe_placeholder_role: "ej. Fundador y Director Clínico",
    equipe_label_email: "Correo Electrónico de Contacto *",
    equipe_placeholder_email: "ej. maria@suempresa.com",
    equipe_label_whatsapp: "WhatsApp Corporativo / Personal *",
    equipe_placeholder_whatsapp: "ej. +57 300 123 4567",
    equipe_additional_contacts: "Añadir otros contactos (opcional)",
    equipe_label_ti: "Punto focal técnico (ej. DNS, TI)",
    equipe_placeholder_ti: "ej. Camila (Marketing)",
    equipe_label_approver: "¿Quién aprueba decisiones estratégicas?",
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
    briefing_module_desc: "Seleccionó {services}. Si lo desea, añada detalles específicos de cada servicio; puede continuar sin responder todos los campos.",
    briefing_optional_details: "Añadir detalles por servicio (opcional)",
    briefing_not_selected_desc: "¿Hay algún contexto importante que aún no preguntamos? (opcional — no repita información ya indicada)",
    briefing_not_selected_placeholder: "Si quedó algo relevante fuera, cuéntelo aquí. Puede dejarlo en blanco.",
    
    // Step 6: Materiais
    materiais_title: "MATERIALES Y ENLACES DE SOPORTE",
    materiais_desc: "Adicione links de pastas públicas compartidas de marca o recursos estratégicos para nuestro equipo (ej. Google Drive, Dropbox, Figma).",
    materiais_label_drive: "Enlace Carpeta Principal (Google Drive/Dropbox)",
    materiais_more_links: "Añadir otros materiales (opcional)",
    materiais_label_portfolio: "Enlace del Catálogo / Portafolio Oficial",
    materiais_label_references: "Referencias Visuales (Enlace o tablero Pinterest)",
    materiais_label_documents: "Manuales de Identidad Visual o Logotipos (.PDF / .AI / .PNG)",
    materiais_label_commercial: "Presentaciones de Ventas / Pitch Deck",
    
    // Step 7: Expectativas
    expectativas_title: "PERSPECTIVAS OPERACIONALES & METAS DE ÉXITO",
    expectativas_optional_context: "Añadir contexto opcional",
    expectativas_answer_label: "Su respuesta",
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
    finalized_badge: "ONBOARDING RECIBIDO",
    finalized_queued_badge: "PENDIENTE DE SINCRONIZACIÓN",
    finalized_title: "Información registrada con éxito",
    finalized_queued_title: "TAG08 aún no ha recibido este envío",
    finalized_desc_1: "Su información fue recibida y registrada para el proyecto contratado.",
    finalized_queued_desc: "El envío está en la cola local de este navegador. Se volverá a intentar cuando se restablezca la conexión; revise este estado más tarde.",
    finalized_desc_2: "TAG08 dará continuidad a las próximas etapas del proceso. Si lo desea, también puede hablar con el equipo por WhatsApp.",
    whatsapp_template_msg: "Hola equipo TAG08! Completé nuestro onboarding de integración con el asistente conversacional.\\n\\nEmpresa: {company}\\nRepresentante: {name}\\nMeta de 90 días: {goal}.\\n\\n¡Quedamos atentos para agendar nuestro kickoff!",
    
    // Errors
    err_company_name: "Por favor, ingrese el nombre de su empresa en la Etapa 1.",
    err_responsible_name: "Por favor, complete los datos del Responsable (Etapa 2).",
    err_responsible_email: "Por favor, ingrese un correo electrónico corporativo válido.",
    err_company_website: "Ingrese una dirección de sitio web válida.",
    err_responsible_whatsapp: "Necesitamos un número de WhatsApp activo para contacto táctico.",
    err_business_moment: "Por favor, seleccione la opción que mejor se ajuste al momento actual de su empresa.",
    err_priority_map: "Por favor, indique qué área de prioridad podemos ayudarle a resolver primero.",
    err_selected_services: "Seleccione al menos uno de los servicios o formatos contratados para su proyecto.",
    err_good_result: "Describa cómo sería un buen resultado durante los primeros 90 días.",
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
  locale: RouteLocale;
}

export default function ClienteOnboarding({ onNavigate, locale }: ClienteOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [deliveryState, setDeliveryState] = useState<DeliveryState>("idle");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [draftLoadError, setDraftLoadError] = useState(false);
  const [draftSaveState, setDraftSaveState] = useState<"saved" | "saving" | "error">("saved");
  const submissionKeyRef = useRef("");
  const submissionTimestampRef = useRef("");
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isFlowActive = currentStep > 0 && currentStep < 9;
  

  useEffect(() => {
    if (isFlowActive) {
      requestAnimationFrame(() => stepHeadingRef.current?.focus({ preventScroll: true }));
    }
  }, [currentStep, currentQuestion, isFlowActive]);

  useEffect(() => {
    if (!isFlowActive) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFlowActive]);

  // STEP 1: Dados da Empresa
  const [companyName, setCompanyName] = useState("");
  const [cnpjCpf, setCnpjCpf] = useState("");
  const [cityState, setCityState] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyInstagram, setCompanyInstagram] = useState("");
  const [companyLinkedin, setCompanyLinkedin] = useState("");
  const [serviceLanguage, setServiceLanguage] = useState<Language>("pt");
  const uiLanguage: Language = locale;

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

  const draftValues: Record<string, string | number | boolean | string[]> = {
    currentQuestion, companyName, cnpjCpf, cityState, companyWebsite, companyInstagram, companyLinkedin, serviceLanguage,
    responsibleName, responsibleRole, responsibleEmail, responsibleWhatsapp, focalPointText, approverText, financePointText,
    businessMoment, priorityMap, maturityScore, selectedServices, customServiceText,
    smChannels, smTargetAudience, smPriorityProducts, smCompetitors, smHasBrandIdentity, smHasMediaBank, smRecordsVideos, smApprovesContent, smForbiddenTopics,
    brBrandExists, brReasonForChange, brDesiredAttributes, brReferencesLink, brAvoidBrands, brBrandNeverBeLike, brHasNameSelected, brHasSloganText, brRequiredApplications,
    webHasDomain, webHasHosting, webCurrentSite, webMainGoal, webRequiredPages, webHasBrandIdentity, webHasTextsReady, webHasFilesReady, webIntegrateWhatsApp, webIntegrateForm, webIntegrateCRM, webNeedsBlog, webReferenceUrls,
    piTeamSize, piDepartments, piDisorganizedAreas, piPersonDependent, piReworkTasks, piCurrentTools, piHasDocumentation, piHasOrgChart, piHasMeetings, piMainBottleneck,
    paHasPiDiagnose, paDocumentedProcesses, paUnappliedProcesses, paTeamsToTrain, paResponsibleLeader, paBiggestDifficulty, paHasTimeForTraining,
    generalBriefingText, linkDrive, linkPortfolio, linkReferences, linkDocuments, linkCommercial,
    whySeekTag08, whatTriedBefore, whatDidNotWork, goodResult90Days, biggestUrgency, notToMakeMistakes, importantDeadlines,
    consentTruth, consentUsage, consentNoPasswords
  };
  const draftSetters: Record<string, (value: unknown) => void> = {
    currentQuestion: (value) => setCurrentQuestion(Number(value)),
    companyName: (value) => setCompanyName(String(value)), cnpjCpf: (value) => setCnpjCpf(String(value)),
    cityState: (value) => setCityState(String(value)), companyWebsite: (value) => setCompanyWebsite(String(value)), companyInstagram: (value) => setCompanyInstagram(String(value)),
    companyLinkedin: (value) => setCompanyLinkedin(String(value)), serviceLanguage: (value) => setServiceLanguage(value === "en" || value === "es" ? value : "pt"),
    responsibleName: (value) => setResponsibleName(String(value)), responsibleRole: (value) => setResponsibleRole(String(value)), responsibleEmail: (value) => setResponsibleEmail(String(value)),
    responsibleWhatsapp: (value) => setResponsibleWhatsapp(String(value)), focalPointText: (value) => setFocalPointText(String(value)), approverText: (value) => setApproverText(String(value)), financePointText: (value) => setFinancePointText(String(value)),
    businessMoment: (value) => setBusinessMoment(String(value)), priorityMap: (value) => setPriorityMap(String(value)), maturityScore: (value) => setMaturityScore(Number(value)),
    selectedServices: (value) => setSelectedServices(Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []), customServiceText: (value) => setCustomServiceText(String(value)),
    smChannels: (value) => setSmChannels(String(value)), smTargetAudience: (value) => setSmTargetAudience(String(value)), smPriorityProducts: (value) => setSmPriorityProducts(String(value)), smCompetitors: (value) => setSmCompetitors(String(value)),
    smHasBrandIdentity: (value) => setSmHasBrandIdentity(String(value)), smHasMediaBank: (value) => setSmHasMediaBank(String(value)), smRecordsVideos: (value) => setSmRecordsVideos(String(value)), smApprovesContent: (value) => setSmApprovesContent(String(value)), smForbiddenTopics: (value) => setSmForbiddenTopics(String(value)),
    brBrandExists: (value) => setBrBrandExists(String(value)), brReasonForChange: (value) => setBrReasonForChange(String(value)), brDesiredAttributes: (value) => setBrDesiredAttributes(String(value)), brReferencesLink: (value) => setBrReferencesLink(String(value)), brAvoidBrands: (value) => setBrAvoidBrands(String(value)), brBrandNeverBeLike: (value) => setBrBrandNeverBeLike(String(value)), brHasNameSelected: (value) => setBrHasNameSelected(String(value)), brHasSloganText: (value) => setBrHasSloganText(String(value)), brRequiredApplications: (value) => setBrRequiredApplications(String(value)),
    webHasDomain: (value) => setWebHasDomain(String(value)), webHasHosting: (value) => setWebHasHosting(String(value)), webCurrentSite: (value) => setWebCurrentSite(String(value)), webMainGoal: (value) => setWebMainGoal(String(value)), webRequiredPages: (value) => setWebRequiredPages(String(value)), webHasBrandIdentity: (value) => setWebHasBrandIdentity(String(value)), webHasTextsReady: (value) => setWebHasTextsReady(String(value)), webHasFilesReady: (value) => setWebHasFilesReady(String(value)),
    webIntegrateWhatsApp: (value) => setWebIntegrateWhatsApp(value === true), webIntegrateForm: (value) => setWebIntegrateForm(value === true), webIntegrateCRM: (value) => setWebIntegrateCRM(value === true), webNeedsBlog: (value) => setWebNeedsBlog(value === true), webReferenceUrls: (value) => setWebReferenceUrls(String(value)),
    piTeamSize: (value) => setPiTeamSize(String(value)), piDepartments: (value) => setPiDepartments(String(value)), piDisorganizedAreas: (value) => setPiDisorganizedAreas(String(value)), piPersonDependent: (value) => setPiPersonDependent(String(value)), piReworkTasks: (value) => setPiReworkTasks(String(value)), piCurrentTools: (value) => setPiCurrentTools(String(value)), piHasDocumentation: (value) => setPiHasDocumentation(String(value)), piHasOrgChart: (value) => setPiHasOrgChart(String(value)), piHasMeetings: (value) => setPiHasMeetings(String(value)), piMainBottleneck: (value) => setPiMainBottleneck(String(value)),
    paHasPiDiagnose: (value) => setPaHasPiDiagnose(String(value)), paDocumentedProcesses: (value) => setPaDocumentedProcesses(String(value)), paUnappliedProcesses: (value) => setPaUnappliedProcesses(String(value)), paTeamsToTrain: (value) => setPaTeamsToTrain(String(value)), paResponsibleLeader: (value) => setPaResponsibleLeader(String(value)), paBiggestDifficulty: (value) => setPaBiggestDifficulty(String(value)), paHasTimeForTraining: (value) => setPaHasTimeForTraining(String(value)),
    generalBriefingText: (value) => setGeneralBriefingText(String(value)), linkDrive: (value) => setLinkDrive(String(value)), linkPortfolio: (value) => setLinkPortfolio(String(value)), linkReferences: (value) => setLinkReferences(String(value)), linkDocuments: (value) => setLinkDocuments(String(value)), linkCommercial: (value) => setLinkCommercial(String(value)),
    whySeekTag08: (value) => setWhySeekTag08(String(value)), whatTriedBefore: (value) => setWhatTriedBefore(String(value)), whatDidNotWork: (value) => setWhatDidNotWork(String(value)), goodResult90Days: (value) => setGoodResult90Days(String(value)), biggestUrgency: (value) => setBiggestUrgency(String(value)), notToMakeMistakes: (value) => setNotToMakeMistakes(String(value)), importantDeadlines: (value) => setImportantDeadlines(String(value)),
    consentTruth: (value) => setConsentTruth(value === true), consentUsage: (value) => setConsentUsage(value === true), consentNoPasswords: (value) => setConsentNoPasswords(value === true)
  };

  useEffect(() => {
    let active = true;
    fetch("/api/onboarding/progress", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("access_unavailable");
        return response.json();
      })
      .then((result) => {
        if (!active) return;
        const draft = parseOnboardingDraft(result?.draft);
        if (draft) {
          setCurrentStep(draft.currentStep);
          const storedQuestion = Number(draft.values.currentQuestion ?? 0);
          const restoredQuestion = draft.currentStep === 2 && draft.values.submissionMode === "tag08_team"
            ? Math.max(0, Math.min(2, storedQuestion - 1))
            : storedQuestion;
          setCurrentQuestion(restoredQuestion);
          Object.entries(draft.values).forEach(([key, value]) => {
            if (key !== "currentQuestion") draftSetters[key]?.(value);
          });
        }
        if (result?.completed === true) {
          setIsSubmitted(true);
          setCurrentStep(9);
          setDeliveryState("online");
        }
        setIsDraftLoaded(true);
      })
      .catch(() => {
        if (!active) return;
        setDraftLoadError(true);
        setIsDraftLoaded(true);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!isDraftLoaded || isSubmitted || currentStep >= 9) return;
    const draft: OnboardingDraft = { version: ONBOARDING_DRAFT_VERSION, currentStep, values: draftValues };
    const timer = window.setTimeout(async () => {
      setDraftSaveState("saving");
      try {
        const response = await fetch("/api/onboarding/progress", {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ draft }), cache: "no-store"
        });
        if (!response.ok) throw new Error("progress_unavailable");
        setDraftSaveState("saved");
      } catch {
        setDraftSaveState("error");
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [isDraftLoaded, isSubmitted, currentStep, JSON.stringify(draftValues)]);

  const sendToBackend = async (payload: OnboardingSubmissionPayload) => {
    if (!submissionKeyRef.current) submissionKeyRef.current = crypto.randomUUID();
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": submissionKeyRef.current },
      body: JSON.stringify(payload),
      cache: "no-store"
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

  useEffect(() => {
    if (currentStep === 0 || currentStep === 9) return;

    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [currentStep]);

  // Access key translations
  const t = (key: string): string => {
    const lang = uiLanguage;
    const dict = translations[lang] || translations.pt;
    return dict[key] || translations.pt[key] || "";
  };

  // Dynamic steps translation
  const getSteps = () => {
    const lang = uiLanguage;
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
    const lang = uiLanguage;
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

  const getQuestionCount = (step: number) => {
    if (step === 1) return 4;
    if (step === 2) return 3;
    if (step === 3) return 3;
    return step > 0 && step < 9 ? 1 : 0;
  };

  const totalQuestions = Array.from({ length: 8 }, (_, index) => getQuestionCount(index + 1)).reduce((sum, count) => sum + count, 0);
  const currentQuestionNumber = Array.from({ length: Math.max(0, currentStep - 1) }, (_, index) => getQuestionCount(index + 1))
    .reduce((sum, count) => sum + count, currentQuestion) + 1;

  const getServicesOptions = () => {
    const lang = uiLanguage;
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
      { label: sx.traff, icon: TrendingUp, id: "Tráfego Pago", requiresGeneralBriefing: true },
      { label: sx.audio, icon: FolderDot, id: "Produção Audiovisual", requiresGeneralBriefing: true },
      { label: sx.other, icon: Sparkles, id: "Outro", requiresGeneralBriefing: true }
    ];
  };

  const servicesOptions = getServicesOptions();
  const hasUnmanagedServiceSelected = servicesOptions.some(
    (service) => service.requiresGeneralBriefing && selectedServices.includes(service.id)
  );

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
      if (companyWebsite.trim() && !isValidWebsite(companyWebsite)) errs.push(t("err_company_website"));
    } else if (currentStep === 2) {
      if (!responsibleName.trim()) errs.push(t("err_responsible_name"));
      if (!isValidEmail(responsibleEmail)) errs.push(t("err_responsible_email"));
      if (!responsibleWhatsapp.trim()) errs.push(t("err_responsible_whatsapp"));
    } else if (currentStep === 3) {
      if (!businessMoment) errs.push(t("err_business_moment"));
      if (!priorityMap) errs.push(t("err_priority_map"));
    } else if (currentStep === 4) {
      if (selectedServices.length === 0) errs.push(t("err_selected_services"));
    } else if (currentStep === 7 && !goodResult90Days.trim()) {
      errs.push(t("err_good_result"));
      const requiredResult = document.getElementById("onboarding-good-result");
      if (requiredResult instanceof HTMLInputElement) {
        requiredResult.setCustomValidity(t("err_good_result"));
        requiredResult.reportValidity();
      }
    } else if (currentStep === 8) {
      if (!consentTruth || !consentUsage || !consentNoPasswords) {
        errs.push(t("err_consent"));
      }
    }

    setCurrentErrors(errs);
    return errs.length === 0;
  };

  const validateCurrentQuestion = () => {
    const errs: string[] = [];

    if (currentStep === 1 && currentQuestion === 0 && !companyName.trim()) {
      errs.push(t("err_company_name"));
    } else if (currentStep === 2) {
      if (currentQuestion === 0 && !responsibleName.trim()) errs.push(t("err_responsible_name"));
      if (currentQuestion === 1 && !isValidEmail(responsibleEmail)) errs.push(t("err_responsible_email"));
      if (currentQuestion === 1 && !responsibleWhatsapp.trim()) errs.push(t("err_responsible_whatsapp"));
    } else if (currentStep === 3 && currentQuestion === 0 && !businessMoment) {
      errs.push(t("err_business_moment"));
    } else if (currentStep === 3 && currentQuestion === 1 && !priorityMap) {
      errs.push(t("err_priority_map"));
    } else if (currentStep === 4 && selectedServices.length === 0) {
      errs.push(t("err_selected_services"));
    } else if (currentStep === 7 && !goodResult90Days.trim()) {
      errs.push(t("err_good_result"));
      const requiredResult = document.getElementById("onboarding-good-result");
      if (requiredResult instanceof HTMLInputElement) {
        requiredResult.setCustomValidity(t("err_good_result"));
        requiredResult.reportValidity();
      }
    }

    setCurrentErrors(errs);
    return errs.length === 0;
  };

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const isValidWebsite = (value: string) => {
    try {
      const candidate = /^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`;
      const parsed = new URL(candidate);
      return (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.hostname.includes(".");
    } catch {
      return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentQuestion()) {
      const questionCount = getQuestionCount(currentStep);
      const nextQuestion = currentQuestion + 1;

      if (nextQuestion < questionCount) {
        setCurrentQuestion(nextQuestion);
      } else {
        setCurrentStep((prev) => prev + 1);
        setCurrentQuestion(0);
      }
      setCurrentErrors([]);
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  };

  const handlePrev = () => {
    setCurrentErrors([]);
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    } else if (currentStep > 1) {
      const previousStep = currentStep - 1;
      setCurrentStep(previousStep);
      setCurrentQuestion(getQuestionCount(previousStep) - 1);
    } else {
      setCurrentStep(0);
      setCurrentQuestion(0);
    }
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
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
      preferredLanguage: serviceLanguage
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
    if (hasUnmanagedServiceSelected || selectedServices.length === 0) {
      serviceSpecificBriefing.geral = {
        generalBriefingText
      };
    }

    const filesAndLinks = {
      drive: linkDrive,
      instagram: companyInstagram,
      site: companyWebsite,
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
      noPasswordsChecked: consentNoPasswords,
      authorizationConfirmedByOperator: false
    };

    if (!submissionTimestampRef.current) submissionTimestampRef.current = new Date().toISOString();
    const submittedAt = submissionTimestampRef.current;

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
        "Idioma de Atendimento": serviceLanguage,
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
      submissionContext: { submittedBy: "client" },
      submittedAt,
      source: "Assistente Onboarding TAG08",
      status: "Onboarding recebido",
      schemaVersion: ONBOARDING_PAYLOAD_VERSION,
      sheetPayload,
      clickupPayload
    };

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
      } else {
        setDeliveryState("error");
        setDeliveryMessage(t("status_validation_error").replace("{details}", "Não foi possível enviar agora. Tente novamente."));
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
    const text = "Olá, concluí o onboarding e gostaria de confirmar o recebimento.";
    const href = buildBrazilWhatsAppUrl(text);
    window.open(href, "_blank");
  };

  // Helper renderer to represent the current fill-status on the dynamic left-card
  const renderSidebarSummaryBox = () => {
    return (
      <div className="space-y-5 text-left text-xs">
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
              <p className="text-zinc-400 italic">{t("sidebar_pending")}</p>
            )}
            <div className="flex gap-1 pt-1">
              <span className="px-1.5 py-0.5 bg-white/[0.04] border border-white/[0.06] text-xs rounded text-zinc-300 font-sans uppercase">
                {t("sidebar_lang_val")}: {serviceLanguage === "pt" ? "Português" : serviceLanguage === "en" ? "English" : "Español"}
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
              <span className="text-zinc-400 italic">{t("sidebar_waiting")}</span>
            )}
          </div>

          {/* Radar Item */}
          <div className="space-y-1">
            <span className="text-zinc-500 font-sans text-xs block">{t("sidebar_moment")}</span>
            {businessMoment ? (
              <p className="text-zinc-300 line-clamp-2 leading-snug">{businessMoment}</p>
            ) : (
              <p className="text-zinc-400 italic">{t("sidebar_none_selected")}</p>
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
              <p className="text-zinc-400 italic">{t("sidebar_no_service")}</p>
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

        <div className="pt-3 border-t border-white/[0.03] flex items-center gap-2 text-xs text-zinc-400 font-sans">
          <Lock className="w-3.5 h-3.5 text-zinc-400" />
          <span>{t("senior_info")}</span>
        </div>
      </div>
    );
  };

  // One prompt per screen keeps the flow focused without changing its payload.
  const getAssistantSpeak = () => {
    const questions: Record<number, string[]> = {
      1: ["question_company_identity", "question_company_location", "question_digital_presence", "question_service_language"],
      2: ["question_project_contact", "question_contact_channels", "question_additional_contacts"],
      3: ["question_business_moment", "question_priority", "question_maturity"],
      4: ["question_services"],
      5: ["question_service_briefing"],
      6: ["question_materials"],
      7: ["question_success"],
      8: ["question_consent"],
    };
    const key = questions[currentStep]?.[currentQuestion];
    return key ? t(key) : getLegacyAssistantSpeak();
  };

  const handleFlowKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isFlowActive || event.key !== "Tab") return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter((element) => element.getClientRects().length > 0 && !element.closest("[hidden]"));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  /* legacy prompt map retained below only during this replacement */
  const getLegacyAssistantSpeak = () => {
    const lang = uiLanguage;
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

  const onboardingView = (
    <div data-onboarding-unsent={isFlowActive ? "true" : undefined} onKeyDown={handleFlowKeyDown} role={isFlowActive ? "dialog" : undefined} aria-modal={isFlowActive ? true : undefined} aria-labelledby={isFlowActive ? "onboarding-question-title" : undefined} className={`bg-charcoal-950 text-white font-sans ${isFlowActive ? "fixed inset-0 z-[9999] h-[100dvh] w-screen overflow-hidden" : "min-h-screen overflow-x-clip pt-16 pb-20"}`}>
      <p className="sr-only" aria-live="polite">{draftSaveState === "saving" ? "Salvando progresso" : draftSaveState === "error" ? "Não foi possível salvar o progresso" : "Progresso salvo"}</p>
      <div className={`relative mx-auto ${isFlowActive ? "flex h-full w-full max-w-5xl flex-col px-5 sm:px-8" : "max-w-7xl px-6"}`}>
        
        {/* Subtle ambient blur background decorations */}
        {!isFlowActive && <div className="absolute top-[10%] right-[-10%] w-[450px] h-[450px] bg-brand/[0.015] rounded-full blur-[140px] pointer-events-none" />}
        {!isFlowActive && <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/[0.01] rounded-full blur-[150px] pointer-events-none" />}

        {/* Onboarding page heading */}
        {!isFlowActive && <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 border-b border-white/[0.04] pb-8">
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

        </div>}

        {/* Question progress; the introductory screen stays in the normal page flow. */}
        {isFlowActive && (
          <div className="sticky top-0 z-20 -mx-5 flex items-center gap-4 border-b border-white/[0.08] bg-charcoal-950 px-5 py-3 sm:-mx-8 sm:px-8">
            <button type="button" onClick={() => window.confirm(t("confirm_exit_flow")) && onNavigate("/")} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-2 text-sm text-zinc-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary">
              <ArrowLeft className="h-4 w-4" />{t("exit_flow")}
            </button>
            <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-xs font-sans text-zinc-500">
              <span className="uppercase tracking-widest text-brand-secondary font-semibold text-xs">
                {t("question_label")} {currentQuestionNumber} {t("step_of")} {totalQuestions}
              </span>
              <span>{Math.round((currentQuestionNumber / totalQuestions) * 100)}% {t("completed")}</span>
            </div>
            <div
              className="h-1.5 w-full bg-white/[0.03] border border-white/[0.05] rounded-full overflow-hidden"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((currentQuestionNumber / totalQuestions) * 100)}
              aria-valuetext={`${t("question_label")} ${currentQuestionNumber} ${t("step_of")} ${totalQuestions}`}
              aria-label={t("question_label")}
            >
              <div 
                className="h-full bg-brand-secondary transition-[width] duration-200 ease-out motion-reduce:transition-none shadow-[0_0_8px_rgba(var(--color-brand-secondary-rgb),0.3)]"
                style={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }}
              />
            </div>
            </div>
          </div>
        )}

        <div className={`mx-auto w-full ${isFlowActive ? "flex min-h-0 flex-1 flex-col" : "max-w-3xl"}`}>
          {!isFlowActive && currentStep > 1 && currentStep < 9 ? (
            <details className="mb-5 rounded-xl border border-white/[0.06] bg-neutral-900/30 px-4 py-3">
              <summary className="min-h-11 cursor-pointer flex items-center text-sm font-semibold text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary">
                {t("sidebar_title")}
              </summary>
              <div className="pt-4">{renderSidebarSummaryBox()}</div>
            </details>
          ) : null}

          <div className={isFlowActive ? "flex min-h-0 flex-1 flex-col" : "relative rounded-2xl border border-white/[0.06] bg-charcoal-900/70 p-5 sm:p-8"}>
              <form id="onboarding-form" noValidate onSubmit={handleSubmit} className={isFlowActive ? "flex min-h-0 flex-1 flex-col" : undefined}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentStep}-${currentQuestion}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
                  className={isFlowActive ? "flex min-h-0 flex-1 flex-col justify-between overflow-x-hidden overflow-y-auto overscroll-contain text-left" : "space-y-8 text-left h-full flex flex-col justify-between"}
                >
                  
                  {currentStep > 0 && currentStep < 9 ? (
                    <div className="mx-auto w-full max-w-3xl space-y-3 border-b border-white/[0.06] pb-6 pt-8 sm:pt-12">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{steps[currentStep].title}</p>
                      <h2 id="onboarding-question-title" ref={stepHeadingRef} tabIndex={-1} className="max-w-2xl scroll-mt-24 text-2xl font-semibold leading-snug tracking-tight text-white focus:outline-none sm:text-4xl" aria-live="polite">
                        {getAssistantSpeak()}
                      </h2>
                    </div>
                  ) : (
                    <h2 ref={stepHeadingRef} tabIndex={-1} className="sr-only focus:outline-none" aria-live="polite">
                      {currentStep === 9 ? t("finalized_title") : t("welcome_title").replace("<br />", " ")}
                    </h2>
                  )}

                  {/* STEP 0: WELCOME SCREEN */}
                  {!isFlowActive && currentStep === 0 && (
                    <div className="space-y-8 py-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-brand-secondary/10 border border-brand-secondary/20 rounded-full text-brand-secondary text-xs tag08-meta tracking-widest uppercase w-fit select-none">
                          <Sparkles className="w-3 h-3 text-brand-secondary animate-pulse shrink-0" />
                        </div>
                        <h2 
                          className="font-display font-medium text-2xl sm:text-4xl text-gradient tracking-tight leading-none text-white font-semibold"
                          dangerouslySetInnerHTML={{ __html: t("welcome_title") }}
                        />
                        <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed max-w-3xl">
                          {t("welcome_desc")}
                        </p>
                        <details className="space-y-3 border-t border-white/[0.06] pt-4">
                          <summary className="min-h-11 cursor-pointer text-xs font-semibold text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary">
                            {t("privacy_title")}
                          </summary>
                          <div className="space-y-2 text-xs leading-relaxed text-zinc-400">
                            <p>{t("privacy_desc")}</p>
                            <p className="font-semibold text-zinc-300">{t("privacy_indicators")}</p>
                            <p>{t("privacy_p1")}</p>
                            <p>{t("privacy_p2")}</p>
                            <p>{t("privacy_p3")}</p>
                          </div>
                        </details>
                      </div>

                      <details className="border-t border-white/[0.06] pt-4">
                        <summary className="min-h-11 cursor-pointer text-sm font-semibold text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary">
                          {t("welcome_steps_title")}
                        </summary>
                        <div className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                        {getWelcomeSteps().map((item, index) => {
                          const IconComp = index === 0 ? ClipboardCheck : index === 1 ? Cpu : Sparkles;
                          return item.isHighlighted ? (
                            /* HIGH STANDOUT NEON ACCENT CARD */
                            <div 
                              key={index}
                              className="bg-brand-secondary border border-black/10 p-5 rounded-[24px] text-left flex flex-col justify-between min-h-[140px] shadow-[0_12px_36px_rgba(var(--color-brand-secondary-rgb),0.12)] relative overflow-hidden"
                            >
                              <div className="absolute top-[-25px] right-[-25px] w-16 h-16 bg-white/20 rounded-full blur-xl pointer-events-none" />
                              <div className="flex items-center justify-between relative z-10">
                                <span className="font-sans text-xs font-black uppercase text-black/60 bg-black/5 px-2 py-0.5 rounded border border-black/5">
                                  {item.phase}
                                </span>
                                <IconComp className="w-3.5 h-3.5 text-black/80" />
                              </div>
                              <div className="space-y-1 relative z-10 mt-4 text-left">
                                <h3 className="font-display font-black text-sm text-black tracking-tight leading-none">
                                  {item.title}
                                </h3>
                                <p className="text-black/70 text-xs leading-snug font-medium">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          ) : (
                            /* SLEEK AMBIENT DARK CORE CARD */
                            <div 
                              key={index}
                              className="bg-charcoal-950 border border-white/[0.05] hover:border-brand/20 p-5 rounded-[24px] text-left flex flex-col justify-between min-h-[140px] relative overflow-hidden transition-[border-color,background-color] duration-200"
                            >
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/[0.01] rounded-full blur-xl pointer-events-none" />
                              <div className="flex items-center justify-between relative z-10">
                                <span className="font-sans text-xs font-black uppercase text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                  {item.phase}
                                </span>
                                <IconComp className="w-3.5 h-3.5 text-zinc-500" />
                              </div>
                              <div className="space-y-1 relative z-10 mt-4 text-left">
                                <h3 className="font-display font-black text-sm text-white tracking-tight leading-none">
                                  {item.title}
                                </h3>
                                <p className="text-zinc-500 text-xs leading-snug font-medium">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                        </div>
                      </details>

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
                          onClick={() => { setCurrentQuestion(0); setCurrentErrors([]); setCurrentStep(1); }}
                          className="inline-flex min-h-11 items-center gap-2.5 px-7 py-4 bg-brand-secondary hover:bg-brand-dark text-black text-xs font-sans font-bold uppercase tracking-widest rounded-xl transition-[background-color,box-shadow] duration-200 cursor-pointer shadow-[0_8px_30px_rgba(var(--color-brand-secondary-rgb),0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900"
                        >
                          {t("btn_start")} <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 1: DADOS DA EMPRESA */}
                  {currentStep === 1 && (
                    <div className="mx-auto w-full max-w-3xl space-y-6 py-8 sm:py-12">
                      <div hidden={currentQuestion !== 0} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="onboarding-company-name" className="text-xs tag08-meta text-zinc-300 uppercase tracking-wider">
                            {t("empresa_label_name")}
                          </label>
                          <div className="relative">
                            <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                            <input
                              id="onboarding-company-name"
                              name="companyName"
                              autoComplete="organization"
                              type="text"
                              required
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-[border-color,box-shadow] duration-200 font-sans"
                              placeholder={t("empresa_placeholder_name")}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="onboarding-cnpj" className="text-xs tag08-meta text-zinc-300 uppercase tracking-wider">
                            {t("empresa_label_cnpj")}
                          </label>
                          <input
                            id="onboarding-cnpj"
                            name="cnpjCpf"
                            type="text"
                            value={cnpjCpf}
                            onChange={(e) => setCnpjCpf(e.target.value)}
                            className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-[border-color,box-shadow] duration-200 font-sans"
                            placeholder={t("empresa_placeholder_cnpj")}
                          />
                        </div>
                      </div>

                      <div hidden={currentQuestion !== 1 && currentQuestion !== 2} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="onboarding-city" className="text-xs tag08-meta text-zinc-300 uppercase tracking-wider">
                            {t("empresa_label_city")}
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                            <input
                              id="onboarding-city"
                              name="cityState"
                              type="text"
                              value={cityState}
                              onChange={(e) => setCityState(e.target.value)}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-[border-color,box-shadow] duration-200 font-sans"
                              placeholder={t("empresa_placeholder_city")}
                            />
                          </div>
                        </div>

                        <div hidden={currentQuestion !== 2} className="space-y-2">
                          <label htmlFor="onboarding-website" className="text-xs tag08-meta text-zinc-300 uppercase tracking-wider">
                            {t("empresa_label_site")}
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                            <input
                              id="onboarding-website"
                              name="companyWebsite"
                              type="url"
                              value={companyWebsite}
                              onChange={(e) => setCompanyWebsite(e.target.value)}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-[border-color,box-shadow] duration-200 font-sans"
                              placeholder={t("empresa_placeholder_site")}
                            />
                          </div>
                        </div>
                      </div>

                      <div hidden={currentQuestion !== 2} className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2">
                        <div className="space-y-2">
                          <label htmlFor="onboarding-instagram" className="text-xs tag08-meta text-zinc-300 uppercase tracking-wider">
                            {t("empresa_label_insta")}
                          </label>
                          <div className="relative">
                            <Instagram className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                            <input
                              id="onboarding-instagram"
                              name="companyInstagram"
                              type="text"
                              value={companyInstagram}
                              onChange={(e) => setCompanyInstagram(e.target.value)}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-[border-color,box-shadow] duration-200 font-sans"
                              placeholder={t("empresa_placeholder_insta")}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="onboarding-linkedin" className="text-xs tag08-meta text-zinc-300 uppercase tracking-wider">
                            {t("empresa_label_linkedin")}
                          </label>
                          <div className="relative">
                            <Linkedin className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                            <input
                              id="onboarding-linkedin"
                              name="companyLinkedin"
                              type="text"
                              value={companyLinkedin}
                              onChange={(e) => setCompanyLinkedin(e.target.value)}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-[border-color,box-shadow] duration-200 font-sans"
                              placeholder={t("empresa_placeholder_linkedin")}
                            />
                          </div>
                        </div>
                      </div>

                      {/* IDIOMA PREFERENCIAL DE ATENDIMENTO */}
                      <div hidden={currentQuestion !== 3} className="space-y-4 pt-4 border-t border-white/[0.04]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h3 className="text-xs tag08-meta text-zinc-300 tracking-wider font-bold">
                            {t("empresa_lang_title")}
                          </h3>
                          <span className="font-sans text-xs text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/20 px-2.5 py-0.5 rounded uppercase font-black shrink-0 self-start">
                            {t("empresa_lang_badge")}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                          {t("empresa_lang_desc")}
                        </p>
                        
                        <div role="group" aria-label={t("empresa_lang_title")} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { value: "pt", title: "Português", desc: t("empresa_lang_pt_desc") },
                            { value: "en", title: "English", desc: t("empresa_lang_en_desc") },
                            { value: "es", title: "Español", desc: t("empresa_lang_es_desc") }
                          ].map((lang) => (
                            <button
                              key={lang.value}
                              type="button"
                              onClick={() => setServiceLanguage(lang.value as Language)}
                              aria-pressed={serviceLanguage === lang.value}
                              className={`min-h-11 p-4 rounded-xl border text-left transition-[background-color,border-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary ${
                                serviceLanguage === lang.value
                                  ? "bg-brand-secondary/10 border-brand-secondary text-white"
                                  : "bg-zinc-950/40 border-white/[0.08] hover:border-white/[0.18] text-zinc-300"
                              }`}
                            >
                              <div className="font-sans text-xs font-extrabold uppercase flex items-center justify-between">
                                <span>{lang.title}</span>
                                {serviceLanguage === lang.value && (
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
                    <div className="mx-auto w-full max-w-3xl space-y-6 py-8 sm:py-12">
                      <div hidden={currentQuestion !== 0} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="onboarding-responsible-name" className="text-xs tag08-meta text-zinc-300 uppercase tracking-wider">
                            {t("equipe_label_name")}
                          </label>
                          <div className="relative">
                          <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                            <input
                              id="onboarding-responsible-name"
                              name="responsibleName"
                              autoComplete="name"
                              type="text"
                              required
                              value={responsibleName}
                              onChange={(e) => setResponsibleName(e.target.value)}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-[border-color,box-shadow] duration-200 font-sans"
                              placeholder={t("equipe_placeholder_name")}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="onboarding-responsible-role" className="text-xs tag08-meta text-zinc-300 uppercase tracking-wider">
                            {t("equipe_label_role")}
                          </label>
                          <input
                            id="onboarding-responsible-role"
                            name="responsibleRole"
                            type="text"
                            value={responsibleRole}
                            onChange={(e) => setResponsibleRole(e.target.value)}
                            className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-[border-color,box-shadow] duration-200 font-sans"
                            placeholder={t("equipe_placeholder_role")}
                          />
                        </div>
                      </div>

                      <div hidden={currentQuestion !== 1} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="onboarding-responsible-email" className="text-xs tag08-meta text-zinc-300 uppercase tracking-wider">
                            {t("equipe_label_email")}
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                            <input
                              id="onboarding-responsible-email"
                              name="responsibleEmail"
                              autoComplete="email"
                              type="email"
                              required
                              value={responsibleEmail}
                              onChange={(e) => setResponsibleEmail(e.target.value)}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-[border-color,box-shadow] duration-200 font-sans"
                              placeholder={t("equipe_placeholder_email")}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="onboarding-responsible-whatsapp" className="text-xs tag08-meta text-zinc-300 uppercase tracking-wider">
                            {t("equipe_label_whatsapp")}
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                            <input
                              id="onboarding-responsible-whatsapp"
                              name="responsibleWhatsapp"
                              autoComplete="tel"
                              type="tel"
                              required
                              value={responsibleWhatsapp}
                              onChange={(e) => setResponsibleWhatsapp(e.target.value)}
                              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-[border-color,box-shadow] duration-200 font-sans"
                              placeholder={t("equipe_placeholder_whatsapp")}
                            />
                          </div>
                        </div>
                      </div>

                      <details hidden={currentQuestion !== 2} className="border-t border-white/[0.04] pt-4">
                        <summary className="min-h-11 cursor-pointer text-sm font-semibold text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary">
                          {t("equipe_additional_contacts")}
                        </summary>
                        <div className="space-y-4 pt-3">
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
                      </details>
                    </div>
                  )}

                  {/* STEP 3: RADAR DO MOMENTO */}
                  {currentStep === 3 && (
                    <div className="mx-auto w-full max-w-3xl space-y-6 py-8 sm:py-12">
                      <div hidden={currentQuestion !== 0} className="space-y-3">
                        <label className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider block">
                          {t("radar_label_moment")}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5" role="radiogroup" aria-label={t("radar_label_moment")}>
                          {momentOptions[uiLanguage].map((opt) => (
                            <div
                              key={opt.value}
                              onClick={() => setBusinessMoment(opt.value)}
                              onKeyDown={(event) => activateOnKeyboard(event, () => setBusinessMoment(opt.value))}
                              role="radio"
                              aria-checked={businessMoment === opt.value}
                              tabIndex={0}
                              className={`flex min-h-11 p-4 rounded-2xl border transition-[background-color,border-color,box-shadow] duration-200 cursor-pointer text-left flex-col justify-between min-h-[96px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 ${
                                businessMoment === opt.value
                                  ? "bg-brand-secondary/[0.03] border-brand-secondary shadow-[0_4px_15px_rgba(var(--color-brand-secondary-rgb),0.06)]"
                                  : "bg-neutral-900/40 border-white/[0.04] hover:bg-neutral-900/60 hover:border-white/[0.12]"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-zinc-200 text-xs font-sans leading-relaxed flex-grow">{opt.label}</p>
                                {businessMoment === opt.value && <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-secondary" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div hidden={currentQuestion !== 1} className="space-y-3 pt-2">
                        <label className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider block">
                          {t("radar_label_priority")}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label={t("radar_label_priority")}>
                          {priorityOptions[uiLanguage].map((opt, idx) => (
                            <div
                              key={idx}
                              onClick={() => setPriorityMap(opt.value)}
                              onKeyDown={(event) => activateOnKeyboard(event, () => setPriorityMap(opt.value))}
                              role="radio"
                              aria-checked={priorityMap === opt.value}
                              tabIndex={0}
                              className={`flex min-h-11 items-center justify-center p-3.5 rounded-xl border text-center cursor-pointer transition-[background-color,border-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 ${
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

                      <div hidden={currentQuestion !== 2} className="space-y-3 pt-4 border-t border-white/[0.03]">
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
                              className={`flex min-h-11 p-4 rounded-2xl border cursor-pointer transition-[background-color,border-color,box-shadow] duration-200 flex-col justify-between text-left min-h-[120px] relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 ${
                                active
                                  ? "bg-brand-secondary/[0.02] border-brand-secondary shadow-[0_4px_15px_rgba(var(--color-brand-secondary-rgb),0.05)]"
                                  : "bg-neutral-900/30 border-white/[0.04] hover:bg-neutral-900/60 hover:border-white/[0.1]"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                                  active ? "bg-brand/15 border-brand text-brand" : "bg-white/[0.02] border-white/[0.06] text-zinc-400"
                                }`}>
                                  <IconComp className="w-4 h-4" />
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
                            className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand text-white transition-[border-color,box-shadow] duration-200 font-sans"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 5: BRIEFING ESPECFICO POR SERVI!O */}
                  {currentStep === 5 && (
                    <div className="space-y-6 py-2 pr-2">
                      <div className="space-y-2 bg-neutral-950 p-4 rounded-xl border border-white/[0.03] mb-4">
                        <span className="font-sans text-xs text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2 py-0.5 rounded font-black uppercase inline-block">{t("briefing_module_title")}</span>
                        <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                          {t("briefing_module_desc").replace("{services}", selectedServices.join(", "))}
                        </p>
                      </div>

                      {(["Gestão de Redes Sociais", "Branding & Identidade", "Desenvolvimento Web", "Process Intelligence", "Process Activation"].some((service) => isSelected(service))) && (
                        <details className="space-y-4 border-t border-white/[0.06] pt-3">
                          <summary className="min-h-11 cursor-pointer text-sm font-semibold text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary">
                            {t("briefing_optional_details")}
                          </summary>
                          <div className="space-y-5 pt-2">
                      {/* 5a. GESTO DE REDES SOCIAIS BRIEFING */}
                      {isSelected("Gestão de Redes Sociais") && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 p-5 rounded-2xl border border-white/[0.05] bg-neutral-900/30 text-left">
                          <h3 className="text-brand-secondary font-sans text-xs font-extrabold border-b border-white/[0.03] pb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-secondary" /> Redes Sociais & Conteúdo
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-400">Canais a serem trabalhados (Ex: Instagram, LinkedIn, YT)</label>
                              <input type="text" value={smChannels} onChange={(e) => setSmChannels(e.target.value)} placeholder="Instagram e YouTube" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                            <div className="space-y-1.5 font-sans">
                              <label className="text-xs text-zinc-300 font-sans">Qual o principal público desejado?</label>
                              <input type="text" value={smTargetAudience} onChange={(e) => setSmTargetAudience(e.target.value)} placeholder="Diretores de empresas parceiras" className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                            <div className="space-y-1.5">
                              <label className="text-xs text-zinc-300 font-sans">Produtos/Serviços prioritários a vender</label>
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
                          <h3 className="text-brand-secondary font-sans text-xs font-extrabold border-b border-white/[0.03] pb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-secondary" /> Branding &amp; Identidade Visual
                          </h3>

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
                          <h3 className="text-brand-secondary font-sans text-xs font-extrabold border-b border-white/[0.03] pb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-secondary" /> Engenharia Web & Sites
                          </h3>

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
                          <h3 className="text-brand-secondary font-sans text-xs font-extrabold border-b border-white/[0.03] pb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-secondary" /> Process Intelligence
                          </h3>

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
                          <h3 className="text-brand-secondary font-sans text-xs font-extrabold border-b border-white/[0.03] pb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-secondary" /> Governança &amp; Process Activation
                          </h3>

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
                          </div>
                        </details>
                      )}

                      {/* General fallback fields for other types */}
                      {(hasUnmanagedServiceSelected || selectedServices.length === 0) && (
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
                      </div>

                      <div className="space-y-4 pb-2">
                        <div className="max-w-2xl space-y-1.5 font-sans">
                          <label htmlFor="onboarding-drive-link" className="text-xs text-zinc-400">{t("materiais_label_drive")}</label>
                          <input id="onboarding-drive-link" type="url" value={linkDrive} onChange={(e) => setLinkDrive(e.target.value)} placeholder="https://drive.google.com/..." className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                        </div>

                        <details className="border-t border-white/[0.06] pt-3">
                          <summary className="min-h-11 cursor-pointer text-sm font-semibold text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary">
                            {t("materiais_more_links")}
                          </summary>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                            <div className="space-y-1.5 font-sans">
                              <label htmlFor="onboarding-portfolio-link" className="text-xs text-zinc-400">{t("materiais_label_portfolio")}</label>
                              <input id="onboarding-portfolio-link" type="url" value={linkPortfolio} onChange={(e) => setLinkPortfolio(e.target.value)} placeholder="https://..." className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                            <div className="space-y-1 font-sans">
                              <label htmlFor="onboarding-reference-link" className="text-xs text-zinc-400">{t("materiais_label_references")}</label>
                              <input id="onboarding-reference-link" type="url" value={linkReferences} onChange={(e) => setLinkReferences(e.target.value)} placeholder="https://..." className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white font-sans" />
                            </div>
                            <div className="space-y-1 font-sans">
                              <label htmlFor="onboarding-documents-link" className="text-xs text-zinc-400">{t("materiais_label_documents")}</label>
                              <input id="onboarding-documents-link" type="url" value={linkDocuments} onChange={(e) => setLinkDocuments(e.target.value)} placeholder="https://..." className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white font-sans" />
                            </div>
                            <div className="space-y-1 font-sans">
                              <label htmlFor="onboarding-commercial-link" className="text-xs text-zinc-400">{t("materiais_label_commercial")}</label>
                              <input id="onboarding-commercial-link" type="url" value={linkCommercial} onChange={(e) => setLinkCommercial(e.target.value)} placeholder="https://..." className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white font-sans" />
                            </div>
                          </div>
                        </details>
                      </div>
                    </div>
                  )}

                   {/* STEP 7: EXPECTATIVAS PARA PRÓXIMOS 90 DIAS */}
                  {currentStep === 7 && (
                    <div className="space-y-6 py-2 pr-2 font-sans">
                      <div className="max-w-2xl space-y-2">
                        <label htmlFor="onboarding-good-result" className="text-sm font-semibold text-zinc-200">{t("expectativas_answer_label")}</label>
                        <input id="onboarding-good-result" type="text" required value={goodResult90Days} onChange={(e) => { e.currentTarget.setCustomValidity(""); setGoodResult90Days(e.target.value); }} placeholder={t("expectativas_placeholder_good_result")} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-3 text-sm text-white" />
                      </div>

                      <details className="space-y-4 border-t border-white/[0.06] pt-4">
                        <summary className="min-h-11 cursor-pointer text-sm font-semibold text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary">
                          {t("expectativas_optional_context")}
                        </summary>
                        <div className="space-y-5 pt-2">
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
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-400">{t("expectativas_label_urgency")}</label>
                          <input type="text" value={biggestUrgency} onChange={(e) => setBiggestUrgency(e.target.value)} placeholder={t("expectativas_placeholder_urgency")} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-400">{uiLanguage === "en" ? "Are there important deadlines or launch dates?" : uiLanguage === "es" ? "¿Hay fechas límite o de lanzamiento importantes?" : "Existe algum prazo importante ou kickoff agendado?"}</label>
                          <input type="text" value={importantDeadlines} onChange={(e) => setImportantDeadlines(e.target.value)} placeholder={uiLanguage === "en" ? "e.g., Launch the new website by the 30th" : uiLanguage === "es" ? "Ej.: lanzar el nuevo sitio antes del día 30" : "Ex.: lançar o novo site até o dia 30"} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white" />
                          </div>
                        </div>
                          <div className="space-y-1.5">
                        <label className="text-xs text-zinc-400">{t("expectativas_label_not_err")}</label>
                        <textarea value={notToMakeMistakes} onChange={(e) => setNotToMakeMistakes(e.target.value)} rows={2} placeholder={t("expectativas_placeholder_not_err")} className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl p-3 text-xs text-white resize-none" />
                      </div>
                        </div>
                      </details>
                    </div>
                  )}

                  {/* STEP 8: CONSENTIMENTO */}
                  {currentStep === 8 && (
                    <div className="space-y-6 py-2 font-sans">
                      <div className="p-5 rounded-2xl bg-brand-secondary/[0.01] border border-brand-secondary/10 space-y-4">
                        <div className="flex items-center gap-2.5 text-brand-secondary font-sans text-xs uppercase font-extrabold pb-2 border-b border-white/[0.03]">
                          <Lock className="w-4 h-4" /> {t("consent_title")}
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
                        <div className="w-16 h-16 rounded-3xl border flex items-center justify-center shadow-xl mb-4 bg-brand-secondary/10 border-brand-secondary/20 text-brand-secondary">
                          <ClipboardCheck className="w-8 h-8" />
                        </div>
                      <span className="tag08-meta text-xs uppercase font-black tracking-widest block text-brand-secondary">{t("finalized_badge")}</span>
                        <h2 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                          {t("finalized_title")}
                        </h2>
                        <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{t("finalized_desc_1")}</p>
                        {deliveryMessage ? (
                          <p className="text-xs text-brand-secondary leading-relaxed">{deliveryMessage}</p>
                        ) : null}
                      </div>

                      {/* Onboarding automatic system checks */}
                      <div className="p-5 rounded-2xl bg-neutral-950 border border-white/[0.03] space-y-4 text-left">
                        <span className="font-sans text-xs text-brand-secondary uppercase font-black block">
                          {uiLanguage === "en" ? "SUBMISSION STATUS" : uiLanguage === "es" ? "ESTADO DEL ENVÍO" : "STATUS DO ENVIO"}
                        </span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex gap-2.5 items-center text-xs text-zinc-300">
                            <div className="w-4 h-4 rounded-full bg-brand flex items-center justify-center text-black font-extrabold text-xs"><Check className="w-3 h-3" /></div>
                            <span>{uiLanguage === "en" ? "Registration data received" : uiLanguage === "es" ? "Datos de registro recibidos" : "Dados cadastrais recebidos"}</span>
                          </div>
                          <div className="flex gap-2.5 items-center text-xs text-zinc-300">
                            <div className="w-4 h-4 rounded-full bg-brand flex items-center justify-center text-black font-extrabold text-xs"><Check className="w-3 h-3" /></div>
                            <span>{uiLanguage === "en" ? "Project briefing registered" : uiLanguage === "es" ? "Briefing del proyecto registrado" : "Briefing do projeto registrado"}</span>
                          </div>
                          <div className="flex gap-2.5 items-center text-xs text-zinc-300">
                            <div className="w-4 h-4 rounded-full bg-brand flex items-center justify-center text-black font-extrabold text-xs"><Check className="w-3 h-3" /></div>
                            <span>{uiLanguage === "en" ? "Submission received and recorded" : uiLanguage === "es" ? "Envío recibido y registrado" : "Envio recebido e registrado"}</span>
                          </div>
                          <div className="flex gap-2.5 items-center text-xs text-zinc-300 animate-pulse">
                            <div className="w-3 h-3 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_#fbbf24]" />
                            <span className="text-zinc-400">{uiLanguage === "en" ? "TAG08 will continue the next steps" : uiLanguage === "es" ? "TAG08 dará continuidad a las próximas etapas" : "A TAG08 dará continuidade às próximas etapas"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] text-left">
                        <span className="font-sans text-xs text-zinc-500 uppercase font-black block mb-1">
                          {uiLanguage === "en" ? "DURING THIS INTERVAL, YOU CAN PREPARE:" : uiLanguage === "es" ? "DURANTE ESTE INTERVALO, PUEDE PREPARAR:" : "DURANTE ESSE INTERVALO, VOCÊ PODE SEPARAR:"}
                        </span>
                        
                        <ul className="space-y-1.5 text-zinc-400 text-xs">
                          <li className="flex gap-2 items-center">{uiLanguage === "en" ? "Original brand assets (.EPS or vector Logo)" : uiLanguage === "es" ? "Archivos originales de marca (.EPS o vector de Logo)" : "Arquivos originais da marca (.EPS ou vetor do Logotipo)"}</li>
                          <li className="flex gap-2 items-center">{uiLanguage === "en" ? "Links and basic credentials of current channels" : uiLanguage === "es" ? "Enlaces y credenciales básicas de canales actuales" : "Links e credenciais básicas dos canais atuais"}</li>
                          <li className="flex gap-2 items-center">{uiLanguage === "en" ? "Image bank (team photos, physical workspace, or clinic)" : uiLanguage === "es" ? "Banco de imagens (fotos del equipo, espacio físico o clínica)" : "Acervo de imagens (fotos da equipe, operação fsica ou clínica)"}</li>
                          <li className="flex gap-2 items-center">{uiLanguage === "en" ? "Additional reference documents for scripts" : uiLanguage === "es" ? "Documentos de referência adicionales para guiones" : "Documentos de referência adicionais para os roteiros"}</li>
                          <li className="flex gap-2 items-center">{uiLanguage === "en" ? "Access details to be requested via secure & auditable channel" : uiLanguage === "es" ? "Detalles de acceso que se solicitarán por canal seguro y auditable" : "Acessos que serão solicitados por canal seguro e auditável"}</li>
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-white/[0.04] flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <button
                          type="button"
                          onClick={() => onNavigate("/")}
                          className="font-sans text-xs text-zinc-500 hover:text-white uppercase tracking-wider transition-colors pt-1.5"
                        >
                          &larr; {uiLanguage === "en" ? "Back to home" : uiLanguage === "es" ? "Volver al inicio" : "Voltar para o início"}
                        </button>

                        <button
                          type="button"
                          onClick={handleLaunchWhatsAppOnboardingFastTrack}
                          className="inline-flex min-h-11 items-center gap-2 px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-sans font-bold uppercase tracking-widest rounded-xl transition-[background-color,box-shadow] duration-200 cursor-pointer shadow-[0_8px_30px_rgba(16,185,129,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
                        >
                          <MessageCircle className="w-4 h-4" /> {uiLanguage === "en" ? "Talk to TAG08 on WhatsApp" : uiLanguage === "es" ? "Hablar con TAG08 en WhatsApp" : "Falar com a TAG08 no WhatsApp"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* BOTTOM CONTROLS FOR THE WIZARD */}
                  {currentStep > 0 && currentStep < 9 && (
                    <div className="sticky bottom-0 z-10 -mx-5 mt-auto flex items-center justify-between gap-3 border-t border-white/[0.08] bg-charcoal-950 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:-mx-8 sm:px-8">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="inline-flex min-h-11 items-center gap-1.5 px-5 py-3 border border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.01] rounded-xl text-xs font-sans uppercase tracking-wider text-zinc-300 hover:text-white transition-[background-color,border-color,color] duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70"
                      >
                        <ArrowLeft className="w-4 h-4" /> {t("btn_back")}
                      </button>

                      {currentErrors.length > 0 && (
                        <div role="alert" aria-live="assertive" className="hidden sm:flex text-red-300 text-xs items-center gap-1 max-w-[50%] font-medium">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{currentErrors[0]}</span>
                        </div>
                      )}

                      {currentStep < 8 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="inline-flex min-h-11 items-center gap-1.5 px-6 py-3.5 bg-brand-secondary hover:bg-brand-dark text-black text-xs font-sans font-bold uppercase tracking-widest rounded-xl transition-[background-color,box-shadow] duration-200 cursor-pointer shadow-[0_4px_20px_rgba(var(--color-brand-secondary-rgb),0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/70"
                        >
                          {t("btn_next")} <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                        className="inline-flex min-h-11 items-center gap-2 px-6 py-4 bg-brand hover:bg-brand-dark text-black text-xs font-sans font-bold uppercase tracking-widest rounded-xl transition-[background-color,box-shadow] duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_25px_rgba(var(--color-brand-rgb),0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="w-4 h-4 border-2 border-black border-r-transparent rounded-full animate-spin shrink-0" />
                              {t("btn_submitting")}
                            </>
                          ) : (
                            <>
                              {t("btn_submit")} <Send className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Responsive Error Warning for smaller layout viewports */}
                  {currentErrors.length > 0 && (
                    <div role="alert" aria-live="assertive" className="flex sm:hidden p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 text-xs items-start gap-2 max-w-full font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{currentErrors[0]}</span>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
              </form>

            </div>
        </div>

      </div>
    </div>
  );

  if (!isDraftLoaded || draftLoadError) {
    return <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-charcoal-950 px-6 text-center text-zinc-200" aria-live="polite">
      <p>{draftLoadError ? "Não foi possível carregar seu onboarding. Verifique a conexão ou solicite um novo link de acesso." : "Carregando seu onboarding seguro…"}</p>
      {draftLoadError ? <button type="button" className="min-h-11 rounded-lg border border-white/20 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary" onClick={() => window.location.reload()}>Tentar novamente</button> : null}
    </main>;
  }

  return isFlowActive && typeof document !== "undefined"
    ? createPortal(onboardingView, document.body)
    : onboardingView;
}


















