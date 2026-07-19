export const ACTIVATION_LEVELS = [
  {
    id: "bronze",
    name: "Bronze // Operação Caótica",
    description: "Processos na cabeça das pessoas, planilhas desorganizadas, WhatsApp misturado e fundadores como gargalo diário de dúvidas."
  },
  {
    id: "prata",
    name: "Prata // Organização Parcial",
    description: "Alguns playbooks escritos, mas desatualizados, e ferramentas com uso inconsistente pela equipe."
  },
  {
    id: "ouro",
    name: "Ouro // Automação Pronta",
    description: "Integra sistemas em tempo real e certifica que o time execute os fluxos sem atrito."
  }
] as const;

export type ActivationLevel = (typeof ACTIVATION_LEVELS)[number]["id"];

type ActivationPhase = {
  step: string;
  title: string;
  description: string;
  badge: string;
};

export type ActivationRoadmap = {
  duration: string;
  phases: readonly ActivationPhase[];
};

export const ACTIVATION_ROADMAPS: Record<ActivationLevel, ActivationRoadmap> = {
  bronze: {
    duration: "Duração: 4 semanas",
    phases: [
      { step: "FASE 1", title: "Mapeamento e Diagnóstico Clínico", description: "Entrevistas com equipe de holding e comercial, catalogação de gargalos de tempo e desenho do mapa inicial.", badge: "Semana 1" },
      { step: "FASE 2", title: "Escrita de Playbooks e Criação de Wikis", description: "Estruturação das wikis de ferramentas, senhas de equipe, roteiros de onboarding e criação de playbooks visuais no Notion.", badge: "Semana 2" },
      { step: "FASE 3", title: "Sessões Ativas e Treinamentos Curtos", description: "Sessões dinâmicas de handoff com toda a equipe, ajustes ao vivo nos sistemas e vídeos curtos explicativos.", badge: "Semana 3" },
      { step: "FASE 4", title: "Auditoria de Disciplina e Adesão", description: "Auditoria ativa diária para verificar conformidade com planilhas, novos canais e fluxos, ajustando atritos práticos.", badge: "Semana 4" }
    ]
  },
  prata: {
    duration: "Duração: 6 semanas",
    phases: [
      { step: "FASE 1", title: "Inventário de Sistemas e Auditoria de Processos", description: "Mapeamento das ferramentas ativas, identificação de dados duplicados e furos de follow-up.", badge: "Semana 1 - 2" },
      { step: "FASE 2", title: "Reestruturação e Atualização de Wikis", description: "Consolidação de uma wiki central e reformulação de fluxos confusos, com limpeza de checklists antigos.", badge: "Semana 2 - 3" },
      { step: "FASE 3", title: "Integração de Alertas e Automação Básica", description: "Criação de automações leves de notificação para alertas urgentes de leads abandonados.", badge: "Semana 4 - 5" },
      { step: "FASE 4", title: "Simulados Práticos de Ativação", description: "Treinamento intensivo da equipe comercial sob cenários reais, certificando a adoção das novas regras de CRM.", badge: "Semana 6" }
    ]
  },
  ouro: {
    duration: "Duração: 8 semanas",
    phases: [
      { step: "FASE 1", title: "Arquitetura de Dados e Blueprint API", description: "Desenho técnico do fluxo de informações entre ERP, CRMs, WhatsApp Cloud API e banco de dados analítico.", badge: "Semana 1 - 2" },
      { step: "FASE 2", title: "Desenvolvimento de Automações Nativas", description: "Desenvolvimento dos fluxos de integração automática, webhooks e gatilhos de sincronização constante.", badge: "Semana 3 - 5" },
      { step: "FASE 3", title: "Simulados e Tratamento de Erros", description: "Testes de estresse, implementação de alertas de erro automáticos e manuais de contingência operacional.", badge: "Semana 6 - 7" },
      { step: "FASE 4", title: "Handoff Técnico e Ativação Operacional", description: "Entrega dos fluxogramas, documentação de APIs, painel de monitoramento e treinamento do responsável interno.", badge: "Semana 8" }
    ]
  }
};
