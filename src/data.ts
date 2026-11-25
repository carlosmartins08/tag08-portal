import { Service, Plan, PlanFeature, CaseStudy, BlogPost } from "./types";

export interface EditorialBlogPost extends BlogPost {
  slug: string;
  readingTime?: string;
  relatedServicePath: string;
  relatedServiceTitle: string;
  relatedObjection?: string;
  decisionStage: "entendimento" | "comparação" | "decisão" | "continuidade";
  strategicSynthesis: {
    problem: string;
    thesis: string;
    risk: string;
    nextStep: string;
  };
  expertLens?: Array<{
    title: string;
    body: string;
  }>;
  framework?: {
    title: string;
    rows: Array<{
      label: string;
      value: string;
    }>;
  };
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  relatedInsights?: string[];
}

export const SERVICES: Service[] = [
  {
    id: "redes-sociais",
    title: "Gestão de Redes Sociais",
    shortDescription: "Planejamento, criação, publicação e análise para marcas que precisam de presença digital consistente.",
    category: "presence",
    description: "Transformamos perfis em canais estratégicos de construção de marca, educando seu mercado e gerando oportunidades qualificadas de venda através de conteúdo profundo e relevante.",
    forWhom: "Empresas e profissionais liberais que buscam representação digital madura de suas marcas, evitando amadorismo e postagens sem propósito.",
    deliverables: [
      "Planejamento de linha editorial e pautas estratégicas",
      "Roteirização de Reels, Carrosséis e Posts estáticos",
      "Identidade visual dedicada para redes sociais",
      "Redação criativa de legendas com foco em SEO",
      "Agendamento estruturado e relatórios mensais de performance"
    ],
    slug: "/servicos/gestao-de-redes-sociais"
  },
  {
    id: "branding",
    title: "Branding e Identidade Visual",
    shortDescription: "Construção de marcas mais claras, memoráveis e alinhadas ao seu posicionamento estratégico.",
    category: "branding",
    description: "Criamos as marcas do futuro unindo conceitos sólidos, tipografias requintadas, paletas de cores magnéticas e manuais de uso versáteis que comunicam autoridade instantaneamente.",
    forWhom: "Empresas em expansão que sentem que sua atual identidade gráfica não reflete mais a qualidade de seus produtos ou a sofisticação do negócio.",
    deliverables: [
      "Logotipo, Símbolo, Tipografia e Paleta de Cores",
      "Manual completo de Diretrizes e Identidade de Marca",
      "Aplicações corporativas (cartões, papelaria, assinaturas de e-mail)",
      "Guia completo de tom de voz e diretrizes de comunicação",
      "Arquivos finais vetorizados e prontos para uso digital e impresso"
    ],
    slug: "/servicos/branding-identidade"
  },
  {
    id: "desenvolvimento-web",
    title: "Desenvolvimento Web",
    shortDescription: "Sites, landing pages e estruturas digitais pensadas para comunicar, posicionar e converter.",
    category: "web",
    description: "Criamos portais institucionais velozes, responsivos e otimizados para mecanismos de busca que representam sua agência ou negócio físico como o líder incontestável da sua categoria.",
    forWhom: "Empresas com tráfego gerado, mas com site antigo ou ultrapassado que prejudica a conversão, ou novos negócios buscando lançar com excelência técnica.",
    deliverables: [
      "Desenvolvimento em código moderno de alta performance",
      "Design responsivo otimizado para celulares, tablets e computadores",
      "Copywriting focado em conversão e autoridade institucional",
      "Estruturação de SEO On-Page para atração orgânica",
      "Integrações nativas com formulários, WhatsApp e ferramentas de analytics"
    ],
    slug: "/servicos/desenvolvimento-web"
  },
  {
    id: "trafego-pago",
    title: "Tráfego Pago e Performance",
    shortDescription: "Campanhas orientadas por dados para ampliar alcance, gerar oportunidades e otimizar resultados.",
    category: "performance",
    description: "Criamos e gerenciamos campanhas patrocinadas no Google Ads, Meta Ads e LinkedIn Ads. Alocamos seu orçamento com inteligência para capturar o público comprador ideal.",
    forWhom: "Empresas de serviços, B2B ou infoprodutos que querem gerar leads qualificados recorrentes sem depender apenas do fluxo orgânico.",
    deliverables: [
      "Estudo detalhado do público-alvo e canais de maior retorno",
      "Configuração técnica completa de Tags de Conversão (Pixel, GA4, GTM)",
      "Criação e testes contínuos de anúncios gráficos e em vídeo",
      "Análise diária de lances, orçamentos e otimizações de conversão",
      "Dashboard dinâmico em tempo real para tomada de decisão"
    ],
    slug: "/servicos"
  },
  {
    id: "producao-audiovisual",
    title: "Produção Audiovisual",
    shortDescription: "Conteúdos em vídeo com roteiro, direção e edição para fortalecer autoridade e conexão.",
    category: "presence",
    description: "Em um mundo cada vez mais pautado por vídeos curtos (Reels, TikTok, Shorts), estruturamos toda a roteirização, direção visual e pós-produção dinâmica para que seus vídeos engajem e instruam seu lead.",
    forWhom: "Líderes de negócios, médicos, advogados e executivos que querem desenvolver autoridade pessoal através de vídeos profissionais nas redes.",
    deliverables: [
      "Roteirização magnética de vídeos voltados a prender atenção",
      "Edição profissional dinâmica com legendas estéticas e transições elegantes",
      "Tratamento de áudio profissional e seleção de trilhas adequadas",
      "Direção de postura, iluminação e enquadramento remoto ou presencial",
      "Curadoria de cortes dinâmicos para reaproveitamento de aulas e podcasts"
    ],
    slug: "/servicos/producao-audiovisual"
  },
  {
    id: "process-intelligence",
    title: "Process Intelligence",
    shortDescription: "Estruturação de processos, fluxos, playbooks e ativos de gestão corporativa.",
    category: "processes",
    description: "Uma assessoria para transformar caos operacional em clareza para o crescimento. Mapeamos gargalos, eliminamos ruídos internos e documentamos rotinas vitais em um hub de conhecimento.",
    forWhom: "Empresas maduras enfrentando problemas de retrabalho, perda de dados, sobrecarga da liderança ou alta dependência de pessoas-chave.",
    deliverables: [
      "Diagnóstico operacional completo com identificação de gargalos de tempo",
      "Manual ou wiki corporativa centralizada (Base de Conhecimento)",
      "Playbooks operacionais por setor (Vendas, Marketing, Suporte)",
      "Modelagem visual dos fluxos de trabalho ideais para a operação",
      "Entrega e estruturação de ativos de gestão reutilizáveis"
    ],
    slug: "/servicos/process-intelligence"
  },
  {
    id: "process-activation",
    title: "Process Activation",
    shortDescription: "Ativação, ensino aplicado e acompanhamento contínuo para sustentar processos e rotinas estruturadas.",
    category: "processes",
    description: "Garantimos que a estruturação de processos não vire um documento empoeirado. Entramos na rotina da agência e do time para treinar pessoas, implantar checklists diários e instaurar governança.",
    forWhom: "Empresas que já passaram pela estruturação (Process Intelligence) mas sofrem com falta de disciplina ou dificuldade do time em adotar as novas rotinas.",
    deliverables: [
      "Treinamentos ao vivo focados nas ferramentas e playbooks definidos",
      "Auditoria semanal das tarefas e checklists dos colaboradores",
      "Relatório de adesão do time e pontos de atrito para ajustes",
      "Mentoria dedicada à liderança para facilitação da rotina interna",
      "Dinâmicas de melhoria contínua baseadas nas fricções cotidianas"
    ],
    slug: "/servicos/process-activation"
  }
];

export const PLANS: Plan[] = [
  {
    id: "start",
    name: "PLANO START",
    tagline: "Indicado para profissionais liberais, MEIs e negócios locais iniciando no digital e buscando validação rápida.",
    recommended: false,
    indicative: "Profissionais liberais e negócios iniciais que necessitam de presença visual limpa.",
    deliverables: [
      "Direcionamento estratégico geral de posicionamento",
      "Planejamento de até 8 conteúdos mensais",
      "Produção de artes de alta qualidade estética",
      "Redação detalhada de legendas persuasivas",
      "Arquivos organizados prontos para publicação na sua pasta",
      "Suporte humanizado mensal via WhatsApp comercial"
    ],
    ctaText: "Começar com Direção"
  },
  {
    id: "base",
    name: "PLANO BASE",
    tagline: "A escolha padrão de empresas consolidadas que operam com foco em autoridade intelectual e pautas mensais recorrentes.",
    recommended: true,
    indicative: "Empresas e marcas pessoais consolidadas que precisam de posicionamento claro.",
    deliverables: [
      "Diagnóstico estratégico inicial e acompanhamento mensal",
      "Planejamento estratégico de pauta mensal integrada",
      "Até 12 conteúdos mensais (Arts, Reels, Carrosséis)",
      "Copys focadas em SEO nas legendas",
      "Agendamento e publicação das artes executados pela TAG08",
      "Relatório analítico de engajamento e alcance",
      "Reunião mensal de feedback estratégico"
    ],
    ctaText: "Estruturar Minha Presença"
  },
  {
    id: "performance",
    name: "PLANO PERFORMANCE",
    tagline: "Desenvolvido para marcas que desejam alta frequência de Reels/vídeos com roteiro primoroso e pós-produção requintada.",
    recommended: false,
    indicative: "Marcas focadas em liderança de autoridade com audiência em canais de alto engajamento.",
    deliverables: [
      "Planejamento estratégico profundo de Storytelling corporativo",
      "Até 12 vídeos estruturados com dinâmica profissional por mês",
      "Até 8 artes premium intercaladas para grade editorial coesa",
      "Guia completo de roteiros com gatilhos de retenção",
      "Publicação, monitoramento de comentários e automação de chamadas",
      "Relatório mensal minucioso focado em leads e alcance",
      "Time multidisciplinar exclusivo (Copy, Design, Editor, Estrategista)"
    ],
    ctaText: "Crescer com Performance"
  }
];

export const COMPARATIVE_FEATURES: PlanFeature[] = [
  { name: "Foco Estratégico", start: "Direcionamento de Conteúdo", base: "Planejamento Estratégico de Pauta", performance: "Storytelling profundo + Captação" },
  { name: "Produção de Artes", start: "Até 8 artes no mês", base: "Até 8 artes / Carrosséis", performance: "Até 8 artes premium no mês" },
  { name: "Produção de Vídeos (Reels/TikTok)", start: "Não incluso", base: "Até 4 vídeos com edição", performance: "Até 12 vídeos com roteiro e edição" },
  { name: "Agendamento e Publicação", start: "Cliente realiza", base: "Executado pela TAG08", performance: "Executado pela TAG08" },
  { name: "Relatório de Resultados", start: "Não incluso", base: "Mensal simplificado", performance: "Mensal avançado com insights comerciais" },
  { name: "Reuniões Mensais", start: "Não incluso", base: "1 reunião de alinhamento", performance: "2 reuniões ou acompanhamento ágil" },
  { name: "Time de Especialistas", start: "1 Designer + 1 Suporte", base: "Copywriter, Designer e Gestor", performance: "Estrategista, Roteirista, Designer e Editor" },
  { name: "Suporte", start: "WhatsApp (Útil)", base: "WhatsApp preferencial", performance: "Canal direto exclusivo com o time" },
  { name: "Investimento Recomendado", start: "Sob consulta (Início)", base: "Sob consulta (Intermediário)", performance: "Sob consulta (Escala)" }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "case-clinica-alphaville",
    title: "Reposicionamento Premium que triplicou o ticket médio de procedimentos de estética avançada",
    client: "Clínica Médica Alphaville",
    category: "Branding & Redes Sociais",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=600",
    metric: "+240%",
    metricLabel: "Faturamento em Procedimentos High Ticket",
    challenge: "A clínica produzia muito conteúdo técnico de baixo impacto e se posicionava por preço, atraindo interessados em descontos rápidos em vez de pacientes qualificados buscando valor.",
    solution: "Desenvolvemos uma nova identidade verbal inspirada no luxo minimalista, reformulamos a paleta cromática para tons sóbrios, estruturamos roteiros autorais profundos para o médico-fundador e implantamos o Plano Performance.",
    results: [
      "Aumento imediato de percepção de autoridade com a nova identidade verbal",
      "Redução em 40% na atração de curiosos e aumento nas conversões de altíssimo valor",
      "Aumento de 240% no faturamento de tratamentos completos em 90 dias"
    ]
  },
  {
    id: "case-saas-process",
    title: "Aceleração B2B estruturando a operação comercial e canais de tráfego pago de alta intenção",
    client: "ProcessFlow SaaS",
    category: "Processos, Tráfego & Web",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    metric: "4.2x",
    metricLabel: "Retorno sobre Investimento (ROAS)",
    challenge: "O software de ERP possuía um site confuso, lento, sem funil de captação de leads. Os vendedores recebiam contatos frios sem clareza operacional do que fazer.",
    solution: "Auditamos os pontos críticos do fluxo comercial (Process Intelligence), reestruturamos as landing pages em código de alta performance, e ativamos campanhas no Google e LinkedIn Ads focados em tomadores de decisão.",
    results: [
      "Processo comercial unificado em playbooks de fácil consulta para novos SDRs",
      "Taxa de conversão das Landing Pages otimizadas subiu de 1.2% para 5.8%",
      "Custo por Lead Qualificado (SQL) reduzido pela metade em apenas dois meses"
    ]
  },
  {
    id: "case-branding-advocacia",
    title: "Branding de luxo e presença digital para um renomado escritório de Advocacia Empresarial",
    client: "Nunes & Associados",
    category: "Branding & Desenvolvimento Web",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=600",
    metric: "18",
    metricLabel: "Novos Clientes Corporativos de Grande Porte",
    challenge: "O escritório operava sem representação moderna na internet. O antigo site de 2011 transmitia uma aparência desatualizada e amadora.",
    solution: "Criamos heráldica moderna, tipografia sênior alemã, e desenvolvemos um portal web institucional focado em explicar as soluções de governança societária e defesas tributárias de alto calibre.",
    results: [
      "Nova marca impactante consolidada em materiais executivos e no novo ecossistema",
      "Canal orgânico de SEO operando para perguntas-chave do direito empresarial",
      "Fechamento de 18 novos de contratos anuais de assessoria de alto nível"
    ]
  },
  {
    id: "lavarroupa-sa-branding-lavanderia-self-service",
    title: "LavarRoupa S.A.: naming, branding e experiência para uma lavanderia self-service",
    metaTitle: "Branding para lavanderia self-service | Case LavarRoupa S.A.",
    metaDescription: "Conheça o projeto da LavarRoupa S.A., marca criada pela TAG08 desde o naming até a identidade, experiência física, presença digital e mídia paga.",
    client: "LavarRoupa S.A.",
    category: "Branding e Identidade Visual",
    summary: "A TAG08 participou da criação do nome e do sistema de marca de uma lavanderia self-service em Campina Grande, conectando identidade, experiência do espaço e presença digital.",
    searchIntent: "comercial-investigativa",
    projectStatus: "Projeto implantado. O uso atual da identidade ainda precisa ser confirmado.",
    relatedServicePath: "/servicos/branding-identidade",
    relatedServiceTitle: "Branding e Identidade Visual",
    challenge: "Transformar um serviço funcional de lavanderia em uma marca contemporânea, prática e conectada ao comportamento de um público digital.",
    solution: "A direção partiu da experiência de autosserviço e do tempo de permanência no espaço. O conceito foi levado do naming ao sistema visual e às aplicações físicas e digitais.",
    deliverables: [
      "Naming e conceito de marca.",
      "Logotipo, símbolo, identidade visual e manual de marca.",
      "Aplicações de comunicação visual no ambiente físico.",
      "Criação e configuração de canais digitais.",
      "Campanhas de Google Ads na etapa de divulgação."
    ]
  },
  {
    id: "centro-de-olhos-rebranding-clinica-oftalmologica",
    title: "Centro de Olhos: rebranding de uma clínica tradicional sem apagar sua história",
    metaTitle: "Rebranding para clínica oftalmológica | Case Centro de Olhos",
    metaDescription: "Veja como a TAG08 modernizou a identidade do Centro de Olhos, em Guarabira, preservando reconhecimento e construindo uma marca mais atual, humana e consistente.",
    client: "Centro de Olhos",
    category: "Branding e Identidade Visual",
    summary: "O projeto reorganizou a identidade de uma clínica conhecida na região, buscando atualizar sua expressão visual sem descartar o reconhecimento já construído.",
    searchIntent: "comercial-investigativa",
    projectStatus: "A nova identidade foi implantada; o escopo e a continuidade de uso devem ser validados antes da publicação.",
    relatedServicePath: "/servicos/branding-identidade",
    relatedServiceTitle: "Branding e Identidade Visual",
    challenge: "Modernizar a marca de uma clínica tradicional sem perder familiaridade, confiança e reconhecimento junto ao público.",
    solution: "O trabalho combinou estudo de marca, pesquisa de mercado, estratégia digital, posicionamento e desenvolvimento de uma identidade visual atualizada.",
    deliverables: [
      "Estudo de marca e pesquisa de mercado.",
      "Estratégia digital e posicionamento.",
      "Rebranding e sistema de identidade visual.",
      "Trabalho anterior de gestão de redes sociais, descrito separadamente do rebranding."
    ]
  },
  {
    id: "levisage-branding-clinica-premium",
    title: "LeVisage: branding, site e experiência para uma clínica especializada",
    metaTitle: "Branding para clínica premium | Case LeVisage",
    metaDescription: "Conheça o projeto histórico da LeVisage, clínica de João Pessoa para a qual a TAG08 desenvolveu branding, experiência física, site e presença digital.",
    client: "LeVisage",
    category: "Branding e Identidade Visual",
    summary: "O projeto histórico reuniu marca, expressão visual, experiência física e presença digital para uma clínica especializada. A versão atual do site não foi confirmada como entrega da TAG08.",
    searchIntent: "comercial-investigativa",
    projectStatus: "Projeto histórico implantado; o site atualmente online não foi validado como a versão produzida pela TAG08.",
    relatedServicePath: "/servicos/branding-identidade",
    relatedServiceTitle: "Branding e Identidade Visual",
    challenge: "Construir uma presença sofisticada e tecnológica sem tornar a marca fria, excessivamente luxuosa ou menos confiável como serviço de saúde.",
    solution: "A direção conectou sistema de marca, experiência física e presença digital durante o período do projeto, mantendo a credibilidade médica como parte da expressão.",
    deliverables: [
      "Sistema de marca e linguagem visual.",
      "Aplicações na experiência física.",
      "Site desenvolvido durante o período do projeto; a versão atual requer verificação antes de atribuição pública.",
      "Estruturação inicial da presença digital."
    ]
  },
  {
    id: "alugue-por-temporada-branding-produto-digital",
    title: "Alugue por Temporada: da criação da marca à evolução para produto digital",
    metaTitle: "Branding para aluguel por temporada | Case Alugue por Temporada",
    metaDescription: "Veja o trabalho da TAG08 com o Alugue por Temporada desde a criação da marca até a evolução de sua presença e estrutura digital.",
    client: "Alugue por Temporada",
    clientLogo: "/clients/logo-mono-white_AluguePorTemporada.svg",
    clientLogoEvidenceKey: "client-logo/alugue-por-temporada",
    category: "Branding e Posicionamento",
    summary: "O material descreve a evolução da marca e de suas camadas digitais junto com a operação. O aplicativo aparece como uma etapa futura, não como produto já lançado.",
    searchIntent: "comercial-investigativa",
    projectStatus: "Relacionamento descrito como ativo; confirmar quais entregas digitais estão concluídas e o estágio atual do produto.",
    relatedServicePath: "/servicos/desenvolvimento-web",
    relatedServiceTitle: "Desenvolvimento Web",
    challenge: "Organizar a marca e a presença digital em torno de uma operação de aluguel por temporada que começou de forma prática e evoluiu ao longo do tempo.",
    solution: "O trabalho descrito conectou posicionamento de marca, canais, conteúdo e camadas digitais. O crescimento operacional não é atribuído exclusivamente à comunicação ou à TAG08.",
    deliverables: [
      "Estratégia, posicionamento e identidade visual.",
      "Estruturação de canais sociais e conteúdo audiovisual.",
      "Desenvolvimento de site.",
      "Trabalho em evolução relacionado a produto digital, CRM e integrações; escopo concluído precisa de confirmação."
    ]
  },
  {
    id: "luciana-gadelha-marca-pessoal",
    title: "Marca pessoal, conteúdo e presença digital com continuidade",
    metaTitle: "Marca pessoal para profissionais de saúde | Case Luciana Gadelha",
    metaDescription: "Como a TAG08 estruturou marca pessoal, identidade visual, site e conteúdo para uma dermatologista com reputação profissional consolidada.",
    client: "Luciana Gadelha",
    clientLogo: "/clients/LucianaGadelha_logo-light.svg",
    clientLogoEvidenceKey: "client-logo/luciana-gadelha",
    category: "Posicionamento e Conteúdo",
    summary: "A dermatologista já tinha reputação profissional; o desafio era levar essa identidade aos canais digitais com direção e consistência, sem reduzir o trabalho a publicações avulsas.",
    searchIntent: "comercial-investigativa",
    projectStatus: "Cliente ativo e parceria de longo prazo, conforme o material editorial.",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico",
    relatedServiceTitle: "Assessoria de Marketing Estratégico",
    challenge: "Construir uma presença digital reconhecível e coerente com a reputação profissional já existente.",
    solution: "A TAG08 estruturou posicionamento e identidade visual, desenvolveu o site e conectou estratégia editorial, conteúdo audiovisual e canais digitais ao longo da parceria.",
    deliverables: ["Posicionamento de marca pessoal.", "Identidade visual e site.", "Estratégia editorial, conteúdo e audiovisual."]
  },
  {
    id: "espaco-glau-campos-identidade-visual",
    title: "Espaço Glau Campos: identidade visual e modernização de marca",
    client: "Espaço Glau Campos", category: "Branding e Identidade Visual",
    summary: "O trabalho se concentrou na identidade visual e na modernização da marca, organizando elementos para uma expressão mais atual.",
    projectStatus: "Síntese limitada aos pontos coincidentes entre os registros consultados; sem métricas ou alegações de resultado.",
    relatedServicePath: "/servicos/branding-identidade", relatedServiceTitle: "Branding e Identidade Visual",
    challenge: "Atualizar a expressão da marca e organizar um sistema de identidade visual.",
    solution: "A TAG08 desenvolveu um sistema de identidade visual e modernização de marca conforme os pontos comuns registrados nas fontes.",
    deliverables: ["Sistema de identidade visual e modernização da marca."]
  },
  {
    id: "unida-construtora-presenca-digital", title: "Unida Construtora: reconstrução histórica da presença web",
    client: "Unida Construtora", category: "Desenvolvimento Web",
    summary: "O material registra uma reconstrução de site concluída no período do projeto. O site atual não deve ser atribuído à TAG08.",
    projectStatus: "Projeto histórico concluído; a versão atual do site não é atribuída à TAG08.",
    relatedServicePath: "/servicos/desenvolvimento-web", relatedServiceTitle: "Desenvolvimento Web",
    challenge: "Reorganizar a presença web da empresa no período documentado.",
    solution: "A TAG08 realizou uma reconstrução histórica do site; não há evidência para atribuir a versão atual à agência.",
    deliverables: ["Reconstrução de site no período documentado."]
  },
  {
    id: "econotrip-modelagem-prototipo-mvp", title: "EconoTrip: da modelagem de negócio ao protótipo de produto",
    client: "EconoTrip", category: "Estratégia e Produto Digital",
    summary: "O material acompanha uma ideia por modelagem de negócio, protótipo e MVP, sem documentar resultados de tração comercial.",
    projectStatus: "Produto evoluiu depois do trabalho documentado; não atribuir tração ou resultados comerciais.",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico", relatedServiceTitle: "Assessoria de Marketing Estratégico",
    challenge: "Transformar uma ideia inicial em hipóteses e um caminho de validação de produto.",
    solution: "O trabalho descrito percorreu modelagem do negócio, conceito de marca, protótipo e MVP.",
    deliverables: ["Modelagem de negócio.", "Conceito de marca, protótipo e MVP para validação."]
  },
  {
    id: "personapp-evolucao-produto-digital", title: "PersonApp: estruturação e evolução de produto digital",
    client: "PersonApp", category: "Estratégia e Produto Digital",
    summary: "O material descreve evolução de produto a partir de dores, hipóteses e validação. Indicadores de abandono não foram validados para divulgação.",
    projectStatus: "Produto em evolução; status de programas e indicadores precisam de confirmação.",
    relatedServicePath: "/servicos/desenvolvimento-web", relatedServiceTitle: "Desenvolvimento Web",
    challenge: "Organizar hipóteses e decisões de produto durante sua evolução.",
    solution: "O trabalho descrito conectou leitura de problema, validação, marca e estrutura de plataforma.",
    deliverables: ["Estruturação de hipóteses e validação de produto.", "Trabalho de marca e plataforma em evolução."]
  },
  {
    id: "liga-do-laser-preparacao-infoproduto", title: "Liga do Laser: estruturação de oferta e pré-lançamento",
    client: "Liga do Laser", category: "Estratégia e Conteúdo",
    summary: "O material registra preparação de oferta e conteúdo para pré-lançamento. O produto não foi lançado segundo a fonte.",
    projectStatus: "Pré-lançamento; não apresentar como produto lançado nem atribuir vendas.",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico", relatedServiceTitle: "Assessoria de Marketing Estratégico",
    challenge: "Organizar uma oferta de conhecimento e preparar sua comunicação antes do lançamento.",
    solution: "O trabalho descrito concentrou-se na estruturação da oferta, conteúdo e preparação do pré-lançamento.",
    deliverables: ["Estruturação de oferta e conteúdo para pré-lançamento."]
  },
  {
    id: "sm-advocacia-marca-conteudo", title: "SM Advocacia: trabalho histórico de marca e conteúdo",
    client: "SM Advocacia", category: "Branding e Conteúdo",
    summary: "O material descreve trabalho histórico de marca e conteúdo. Um produto de gestão mencionado permaneceu como proposta e não foi lançado.",
    projectStatus: "Relacionamento encerrado ou marca renomeada; produto proposto não foi lançado.",
    relatedServicePath: "/servicos/branding-identidade", relatedServiceTitle: "Branding e Identidade Visual",
    challenge: "Organizar comunicação e expressão de marca no contexto documentado.",
    solution: "O escopo descrito abrangeu marca e conteúdo; não há evidência de implantação do produto proposto.",
    deliverables: ["Trabalho histórico de marca e conteúdo."]
  },
  {
    id: "jl-corretora-rebranding", title: "JL Corretora de Seguros: rebranding histórico",
    client: "JL Corretora de Seguros", category: "Branding e Identidade Visual",
    summary: "O material registra um rebranding concluído. A identidade atual foi substituída e não deve ser apresentada como vigente.",
    projectStatus: "Projeto histórico concluído; identidade atual substituiu a desenvolvida no período.",
    relatedServicePath: "/servicos/branding-identidade", relatedServiceTitle: "Branding e Identidade Visual",
    challenge: "Atualizar a identidade da corretora no período do projeto.",
    solution: "A TAG08 desenvolveu um rebranding histórico; a fonte não sustenta afirmações de crescimento comercial.",
    deliverables: ["Rebranding e identidade visual no período documentado."]
  },
  {
    id: "chama-o-dermato-lancamentos", title: "Chama o Dermato: aprendizados de dois lançamentos",
    client: "Chama o Dermato", category: "Estratégia e Produto Digital",
    summary: "A fonte relata dois lançamentos com resultados qualitativos diferentes. O produto foi depois incorporado a DoctorPlay/S-Qualis.",
    projectStatus: "Iniciativa posteriormente incorporada a outros produtos; manter separada do case DoctorPlay.",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico", relatedServiceTitle: "Assessoria de Marketing Estratégico",
    challenge: "Planejar e executar lançamentos de uma iniciativa de conteúdo em saúde.",
    solution: "O material registra dois ciclos e seus aprendizados, sem sustentar alegações financeiras.",
    deliverables: ["Estruturação de dois ciclos de lançamento; resultados financeiros não publicados."]
  },
  {
    id: "doctorplay-modelagem-marca-produto", title: "DoctorPlay: modelagem de negócio, marca e conceito de plataforma",
    client: "DoctorPlay", category: "Estratégia e Produto Digital",
    summary: "O material documenta modelagem de negócio, marca e conceito operacional/midiático. Não confirma que a plataforma completa tenha sido lançada.",
    projectStatus: "Projeto histórico; confirmar implantação antes de descrever a plataforma como operacional.",
    relatedServicePath: "/servicos/desenvolvimento-web", relatedServiceTitle: "Desenvolvimento Web",
    challenge: "Estruturar o conceito de negócio e sua proposta de plataforma de conteúdo em saúde.",
    solution: "O trabalho descrito reuniu modelagem de negócio, marca e estrutura operacional para o conceito de plataforma.",
    deliverables: ["Modelagem de negócio.", "Marca e conceito operacional/midiático da plataforma."]
  }
];

export const BLOG_POSTS: EditorialBlogPost[] = [
  {
    id: "estrategia-antes-da-estetica",
    title: "Conteúdo estratégico: como transformar comunicação em apoio à decisão",
    excerpt: "Conteúdo não precisa vender o tempo inteiro. Precisa ajudar o público a reconhecer problemas, entender alternativas, reduzir dúvidas e chegar mais preparado à próxima decisão.",
    content: `Uma empresa pode produzir materiais visualmente excelentes e ainda obrigar o time comercial a explicar tudo do zero.

Isso acontece quando a comunicação cumpre função estética, mas não ajuda o público a compreender o negócio.

Conteúdo estratégico começa antes do formato. A pergunta não é primeiro se a empresa fará Reels, carrossel, vídeo ou artigo. A pergunta é:

**o que nosso público precisa entender para conseguir tomar uma decisão melhor?**

### Conteúdo não existe para preencher calendário

Toda pauta deveria cumprir alguma função.

Ela pode:

- ajudar alguém a reconhecer um problema;
- explicar um conceito;
- responder uma objeção;
- comparar alternativas;
- mostrar como a empresa pensa;
- demonstrar processo;
- reduzir risco;
- preparar uma conversa comercial.

Quando não existe função definida, a marca pode publicar muito e construir pouco.

### Atenção não é a mesma coisa que intenção

Curtidas, visualizações e alcance ajudam a entender distribuição, mas não mostram sozinhos se o conteúdo melhorou uma decisão.

Um artigo visto por poucas pessoas pode ser extremamente valioso se responder exatamente à dúvida de um decisor.

Por isso, a métrica precisa acompanhar a função.

### Conteúdo também qualifica

Uma empresa que explica como trabalha, o que considera importante e quais limites existem tende a receber conversas mais contextualizadas.

O potencial cliente chega entendendo melhor o problema, a solução e os critérios de escolha.

Isso melhora a conversa comercial sem transformar cada publicação em anúncio.

### A pergunta prática

Antes de ampliar o volume de conteúdo, faça um inventário:

- quais dúvidas aparecem repetidamente?
- quais objeções travam propostas?
- o que o comercial precisa explicar toda semana?
- quais conceitos os clientes confundem?
- quais decisões exigem mais contexto?

Cada repetição pode indicar uma pauta.`,
    category: "Estratégia",
    serviceTitle: "Assessoria Estratégica de Negócios",
    servicePath: "/servicos/assessoria-marketing-digital-estrategico",
    serviceNote: "Conteúdo estratégico começa pela leitura das dúvidas, objeções e decisões que a marca precisa organizar.",
    readTime: "2 min de leitura",
    date: "Set 11, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600",
    slug: "conteudo-estrategico-apoia-decisoes",
    readingTime: "2 min de leitura",
    relatedServiceTitle: "Assessoria Estratégica de Negócios",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico",
    relatedObjection: "Se a empresa publica, mas ainda não existe uma lógica clara conectando comunicação, posicionamento, jornada e objetivos, o problema pode estar antes do calendário.",
    decisionStage: "entendimento",
    strategicSynthesis: {
      problem: "A marca mantém presença, mas o comercial ainda precisa explicar do zero o valor e o funcionamento da oferta.",
      thesis: "Conteúdo estratégico não ocupa calendário: organiza entendimento e melhora a qualidade da decisão.",
      risk: "A empresa mede atenção como resultado e continua atraindo conversas sem repertório ou aderência.",
      nextStep: "Mapear dúvidas, objeções e decisões recorrentes antes de definir o próximo calendário editorial."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Estética constrói percepção; clareza constrói compreensão. O conteúdo forte precisa das duas coisas, nessa ordem de função."
      }
    ],
    framework: {
      title: "Checklist de conteúdo estratégico",
      rows: [
        { label: "Pergunta", value: "Qual dúvida, objeção ou decisão a pauta precisa trabalhar?" },
        { label: "Função", value: "Ela ajuda a descobrir, comparar, decidir ou avançar?" },
        { label: "Critério", value: "O leitor termina entendendo algo que melhora a próxima decisão?" }
      ]
    },
    faq: [
      {
        question: "O que é conteúdo estratégico?",
        answer: "É conteúdo produzido com uma função definida: educar, reduzir objeções, demonstrar autoridade, qualificar oportunidades ou apoiar uma decisão."
      },
      {
        question: "Conteúdo estratégico precisa vender diretamente?",
        answer: "Não. Ele pode atuar antes da compra, ajudando o público a compreender problemas, avaliar alternativas e desenvolver critérios."
      },
      {
        question: "Design e estética deixam de ser importantes?",
        answer: "Não. A estética fortalece o conteúdo quando organiza a mensagem e facilita a compreensão, em vez de substituir a ideia central."
      }
    ],
    relatedInsights: ["anatomia-do-caos-operacional", "importancia-velocidade-conversao-sites"]
  },
  {
    id: "anatomia-do-caos-operacional",
    title: "Marketing ou processo? Como identificar quando o problema da venda está na operação",
    excerpt: "Nem toda dificuldade comercial é falta de divulgação. Antes de aumentar mídia e conteúdo, vale verificar se a operação consegue aproveitar as oportunidades que já recebe.",
    content: `Uma empresa pode aumentar tráfego, conteúdo e geração de oportunidades e continuar vendendo mal.

O problema pode não estar na falta de demanda.

Pode estar no caminho que a oportunidade percorre depois que chega.

### Alguns sinais aparecem rapidamente

- leads ficam sem resposta;
- ninguém sabe quem deveria assumir determinada oportunidade;
- cada vendedor conduz de uma forma;
- propostas são enviadas sem acompanhamento;
- informações ficam espalhadas em WhatsApp;
- motivos de perda não são registrados;
- marketing e comercial trabalham com versões diferentes da realidade.

Quando isso acontece, trazer mais oportunidades pode simplesmente aumentar a quantidade de problemas entrando no sistema.

### Como diferenciar marketing de processo

Se poucas oportunidades chegam, pode existir um problema de aquisição.

Se oportunidades chegam, mas são inadequadas, vale revisar público, mensagem e oferta.

Se boas oportunidades chegam, mas atendimento, follow-up ou proposta são inconsistentes, o gargalo provavelmente já está na operação.

Se a venda acontece, mas a entrega gera conflito, o problema pode estar ainda depois do comercial.

### Processo não significa burocracia

Processo significa tornar claros:

- responsáveis;
- decisões;
- sequência;
- informações necessárias;
- critérios;
- exceções;
- registros.

O objetivo não é fazer as pessoas preencherem mais documentos.

É reduzir a dependência de improviso.

### Automatizar antes de organizar aumenta o risco

CRM, automação e IA podem acelerar um fluxo.

Mas, se o fluxo estiver errado, a tecnologia também acelera o erro.

Por isso, a pergunta anterior à ferramenta é:

**como esse processo realmente funciona hoje?**`,
    category: "Processos",
    serviceTitle: "Process Intelligence",
    servicePath: "/servicos/process-intelligence",
    serviceNote: "Se o conteúdo expõe retrabalho, o processo precisa de clareza.",
    readTime: "2 min de leitura",
    date: "Set 11, 2026",
    author: "Consultores de Processos TAG08",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600",
    slug: "marketing-ou-processo-problema-vendas",
    readingTime: "2 min de leitura",
    relatedServiceTitle: "Process Intelligence",
    relatedServicePath: "/servicos/process-intelligence",
    relatedObjection: "Quando o sintoma aparece em vendas, atendimento ou retrabalho, mas a causa ainda não está clara, vale mapear a operação antes de investir em mais aquisição.",
    decisionStage: "comparação",
    strategicSynthesis: {
      problem: "O sintoma aparece na venda, mas a causa costuma estar na rotina interna.",
      thesis: "Processo claro sustenta conteúdo claro. Um não compensa o outro.",
      risk: "A empresa tenta comunicar melhor sem corrigir o caos operacional.",
      nextStep: "Mapear fluxo real, dependências e pontos de ruído antes de ampliar a comunicação."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Quando a equipe repete perguntas, o conteúdo costuma estar refletindo uma operação mal definida."
      }
    ],
    framework: {
      title: "Checklist de diagnóstico",
      rows: [
        { label: "Fundador", value: "Centraliza tudo?" },
        { label: "Equipe", value: "Repete as mesmas dúvidas?" },
        { label: "Entrega", value: "Depende de improviso?" }
      ]
    },
    faq: [
      {
        question: "### Como saber se minha empresa precisa de mais marketing ou melhorar processos?",
        answer: "A resposta depende de onde ocorre o principal gargalo. Quando poucas oportunidades qualificadas chegam e a operação consegue atendê-las bem, aquisição pode ser a prioridade. Quando oportunidades já existem, mas atendimento, acompanhamento, registro ou conversão são inconsistentes, existe um componente operacional relevante."
      },
      {
        question: "Um CRM resolve problemas de processo comercial?",
        answer: "Um CRM pode organizar informações, etapas e acompanhamento, mas não define sozinho um bom processo. Quando papéis, critérios, fluxo e responsabilidades ainda estão confusos, a ferramenta tende a apenas digitalizar essa confusão."
      },
      {
        question: "É necessário interromper campanhas enquanto os processos são reorganizados?",
        answer: "Não existe uma regra única. Em alguns casos, aquisição e organização podem evoluir paralelamente. Em outros, aumentar demanda antes de corrigir gargalos pode ampliar desperdício e desgaste. A decisão depende da capacidade atual da operação e da gravidade das falhas encontradas."
      }
    ],
    relatedInsights: ["automacao-marketing-vendas", "ferramentas-gratuitas-expansao"]
  },
  {
    id: "importancia-velocidade-conversao-sites",
    title: "Seu site está preparado para ser entendido por pessoas, buscadores e sistemas de IA?",
    excerpt: "SEO e descoberta por IA começam pelo mesmo fundamento: um site tecnicamente acessível, semanticamente claro e capaz de explicar bem o negócio.",
    content: `A busca mudou.

Hoje uma empresa quer aparecer no Google, mas também quer ser compreendida por sistemas que pesquisam, resumem, comparam e recomendam informações.

Isso não elimina os fundamentos.

Torna a clareza ainda mais importante.

### Antes de pensar em IA, o site precisa conseguir explicar o negócio

Uma página de serviço deveria responder claramente:

- o que é o serviço;
- para quem serve;
- qual problema trata;
- como funciona;
- o que pode fazer parte;
- quais limites existem;
- quais dúvidas são comuns;
- qual é o próximo passo.

Se nem uma pessoa consegue entender isso com facilidade, não existe técnica de otimização capaz de compensar totalmente o problema.

### Arquitetura também comunica

Títulos, subtítulos, páginas específicas, links internos e hierarquia de informação ajudam mecanismos a entender relações.

Não basta mencionar várias palavras-chave.

É necessário construir contexto.

### SEO e IA não são estratégias opostas

Um conteúdo bem estruturado para busca também tende a ser mais compreensível para mecanismos generativos:

- linguagem clara;
- entidades bem definidas;
- respostas diretas;
- informação original;
- links coerentes;
- fonte confiável.

### Dados estruturados ajudam, mas não substituem conteúdo

Schema pode facilitar interpretação técnica.

Ele não transforma conteúdo fraco em fonte relevante.

### O objetivo final continua sendo negócio

Ser citado por uma IA ou aparecer em uma busca só tem valor se a pessoa encontrar informação útil e conseguir avançar.

Descoberta sem experiência termina em tráfego desperdiçado.`,
    category: "Web e Tecnologia",
    serviceTitle: "Desenvolvimento Web",
    servicePath: "/servicos/desenvolvimento-web",
    serviceNote: "Se o site atrapalha a leitura, ele precisa ser reestruturado.",
    readTime: "2 min de leitura",
    date: "Set 11, 2026",
    author: "Dev Team TAG08",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600",
    slug: "site-inteligencia-artificial-seo-estrutura",
    readingTime: "2 min de leitura",
    relatedServiceTitle: "Desenvolvimento Web",
    relatedServicePath: "/servicos/desenvolvimento-web",
    relatedObjection: "Quando o site existe, mas não explica bem a empresa, a oferta e o próximo passo, otimização precisa começar pela estrutura.",
    decisionStage: "decisão",
    strategicSynthesis: {
      problem: "A página pode ter boa aparência e ainda assim prejudicar a leitura.",
      thesis: "Velocidade, clareza e hierarquia são parte da promessa, não detalhe técnico.",
      risk: "O clique fica caro demais para sustentar uma página fraca.",
      nextStep: "Reestruturar a página para explicar melhor, carregar mais rápido e orientar a ação."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Quando a página atrapalha a resposta, o problema é de arquitetura de informação antes de ser visual."
      }
    ],
    framework: {
      title: "Matriz de leitura",
      rows: [
        { label: "Abrir rápido", value: "Evita perda de atenção antes do conteúdo carregar." },
        { label: "Explicar bem", value: "Mostra o papel da página sem ruído." },
        { label: "Apontar a ação", value: "Leva o visitante para o próximo passo certo." }
      ]
    },
    faq: [
      {
        question: "### Existe uma otimização específica para aparecer nas respostas de IA do Google?",
        answer: "Segundo a orientação atual do Google, não existe requisito técnico adicional específico para AI Overviews ou AI Mode. Os fundamentos de SEO, indexação, conteúdo útil, experiência e rastreabilidade continuam sendo a base."
      },
      {
        question: "Como fazer um site aparecer no ChatGPT?",
        answer: "Não existe garantia de aparição ou posição. A OpenAI informa que sites públicos podem aparecer na busca do ChatGPT e recomenda permitir o acesso do OAI-SearchBot para que o conteúdo possa ser encontrado e utilizado em resumos e citações."
      },
      {
        question: "Dados estruturados fazem a inteligência artificial recomendar uma empresa?",
        answer: "Não existe garantia desse tipo. Dados estruturados ajudam mecanismos a interpretar determinados elementos da página, mas precisam representar corretamente o conteúdo visível. Eles complementam uma boa arquitetura; não substituem relevância, autoridade, clareza ou qualidade."
      }
    ],
    relatedInsights: ["negocios-ao-universo-online", "boas-praticas-manutencao-site"]
  },
  {
    id: "novos-influenciadores",
    slug: "novos-influenciadores",
    title: "Influenciadores: alcance importa menos quando falta contexto",
    excerpt: "Uma parceria funciona quando público, mensagem, momento e credibilidade estão alinhados. Número de seguidores sozinho não resolve essa equação.",
    content: `Influência não é sinônimo de audiência grande.

Uma pessoa com uma comunidade menor pode exercer mais influência sobre determinada decisão do que um perfil enorme sem relação real com o tema.

Antes de contratar um influenciador, pergunte:

- esse público possui aderência com nossa oferta?
- o tema faz sentido naquele perfil?
- existe confiança construída?
- o formato combina com a mensagem?
- qual comportamento esperamos gerar?

### O erro comum

A marca escolhe pelo perfil visual, alcance ou quantidade de seguidores.

Depois tenta encaixar a oferta.

A ordem deveria ser inversa.

Primeiro definimos a função da parceria.

Depois procuramos quem consegue cumpri-la.`,
    category: "Aquisição e Mídia",
    serviceTitle: "Assessoria Estratégica de Negócios",
    servicePath: "/servicos/assessoria-marketing-digital-estrategico",
    serviceNote: "Antes de usar influência, vale entender que função a parceria precisa cumprir.",
    readTime: "1 min de leitura",
    readingTime: "1 min de leitura",
    date: "Jun 07, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Assessoria Estratégica de Negócios",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico",
    relatedObjection: "Quando uma parceria ainda começa pela escolha do influenciador e não pelo objetivo, vale organizar estratégia antes da contratação.",
    decisionStage: "entendimento",
    strategicSynthesis: {
      problem: "A escolha do influenciador costuma começar pela vitrine e não pela função.",
      thesis: "Influência funciona quando encaixa público, tema e momento da marca.",
      risk: "A parceria gera ruído, mas não clareza comercial.",
      nextStep: "Definir objetivo, critério de seleção e a pergunta que a campanha precisa responder."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Mais importante que o alcance é perguntar: essa pessoa melhora ou atrapalha a decisão?"
      }
    ],
    framework: {
      title: "Filtro de escolha",
      rows: [
        { label: "Público", value: "Existe sobreposição real com a marca?" },
        { label: "Mensagem", value: "O discurso combina com a oferta?" },
        { label: "Objetivo", value: "A parceria quer alcance, contexto ou prova?" }
      ]
    },
    faq: [
      {
        question: "Microinfluenciadores fazem sentido?",
        answer: "Fazem, quando o encaixe com a audiência é mais forte que a vaidade do número."
      }
    ],
    relatedInsights: ["influenciadores-virtuais"]
  },
  {
    id: "definir-objetivo-marketing",
    slug: "objetivo-de-campanha-antes-de-anunciar",
    title: "Antes de anunciar: qual problema a campanha precisa resolver?",
    excerpt: "Google, Meta ou LinkedIn vêm depois. Primeiro é preciso definir comportamento esperado, oferta, público e critério de sucesso.",
    content: `A discussão sobre mídia costuma começar pela plataforma.

“Google ou Instagram?”

“Quanto investir?”

“Qual público segmentar?”

Mas essas são perguntas de execução.

Existe uma anterior:

**qual função essa campanha precisa cumprir?**

### “Quero vender mais” ainda é amplo demais

Uma campanha pode existir para:

- gerar descoberta;
- capturar demanda existente;
- validar uma mensagem;
- gerar diagnósticos;
- recuperar oportunidades;
- incentivar retorno;
- testar oferta.

Cada função muda mensagem, página, público e métrica.

### Resultado de plataforma e resultado de negócio não são iguais

Clique não é venda.

Formulário não é cliente.

Lead não é necessariamente oportunidade.

A campanha precisa ser conectada ao processo comercial para que a análise continue depois da conversão digital.

### Página e atendimento também fazem parte

Um anúncio pode fazer seu trabalho perfeitamente e enviar a pessoa para:

- página confusa;
- WhatsApp sem resposta;
- proposta genérica;
- atendimento despreparado.

Nesse caso, o problema não está necessariamente na campanha.

### Sete perguntas antes da mídia

1. Qual problema estamos tentando resolver?
2. Quem vive esse problema?
3. Qual comportamento queremos provocar?
4. Qual oferta responde melhor?
5. Qual mensagem precisa ser entendida?
6. Como registraremos o avanço?
7. O que mostrará que aprendemos ou avançamos?

Depois disso escolhemos canal e investimento.`,
    category: "Aquisição e Mídia",
    serviceTitle: "Assessoria Estratégica de Negócios",
    servicePath: "/servicos/assessoria-marketing-digital-estrategico",
    serviceNote: "Antes do anúncio, vem a decisão sobre o que a campanha precisa fazer.",
    readTime: "2 min de leitura",
    readingTime: "2 min de leitura",
    date: "Set 11, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Assessoria Estratégica de Negócios",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico",
    relatedObjection: "Google, Meta ou LinkedIn vêm depois. Primeiro é preciso definir comportamento esperado, oferta, público e critério de sucesso.",
    decisionStage: "entendimento",
    strategicSynthesis: {
      problem: "A campanha nasce sem uma pergunta de negocio clara.",
      thesis: "Objetivo certo reduz desperdicio e melhora leitura dos resultados.",
      risk: "O time mede volume, mas não entende avanço real.",
      nextStep: "Definir o papel da campanha antes de escolher canal ou criativo."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Mídia sem objetivo vira barulho com planilha bonita."
      }
    ],
    framework: {
      title: "Pergunta de partida",
      rows: [
        { label: "Hoje", value: "Você quer descobrir, comparar ou fechar?" },
        { label: "Ação", value: "Qual mudança a campanha deve provocar?" },
        { label: "Métrica", value: "O que prova que o objetivo foi atingido?" }
      ]
    },
    faq: [
      {
        question: "### Qual deve ser o primeiro passo antes de criar uma campanha de anúncios?",
        answer: "A primeira definição está no problema e no comportamento que a campanha precisa influenciar. Plataforma, verba e criativos passam a ter mais sentido quando existe clareza sobre público, oferta, jornada, conversão e critério de sucesso."
      },
      {
        question: "Google Ads ou Meta Ads: qual é melhor?",
        answer: "Não existe resposta universal. Os canais funcionam em contextos e comportamentos diferentes. A escolha depende de onde existe demanda, do nível de consciência do público, da oferta, do formato necessário e da função que a campanha terá na jornada."
      },
      {
        question: "É possível anunciar com orçamento pequeno?",
        answer: "Sim, dependendo do objetivo. Um orçamento limitado pode ser útil para testes, validação ou campanhas específicas. O ponto central está em alinhar expectativa, mercado, canal e volume necessário para produzir aprendizado ou resultado relevante."
      }
    ],
    relatedInsights: ["gerar-leads-google-ads", "campanha-ideal-mensurar-resultados", "como-anunciar-no-google"]
  },
  {
    id: "jornada-do-consumidor-commerce-connections",
    slug: "jornada-do-consumidor-conteudo-decisoes",
    title: "Jornada do consumidor: o que seu público precisa entender antes de decidir",
    excerpt: "Conteúdo funciona melhor quando responde à pergunta que o público está fazendo em cada momento da decisão.",
    content: `A jornada não é uma linha reta.

Uma pessoa pode conhecer a marca, sumir, voltar pelo Google, consultar avaliações, assistir a um vídeo e só então conversar.

Por isso, o objetivo não é controlar cada caminho.

É garantir que existam respostas quando as dúvidas aparecerem.

### Descoberta

Pergunta principal:

**“O que está acontecendo?”**

O conteúdo ajuda a reconhecer sintomas e nomear problemas.

### Consideração

Pergunta principal:

**“Quais caminhos existem?”**

Entram comparações, critérios, riscos e alternativas.

### Decisão

Pergunta principal:

**“Qual solução e qual fornecedor fazem sentido?”**

Processo, prova, escopo e próximos passos ganham importância.

### Relacionamento

Depois da contratação, conteúdo também ajuda a alinhar expectativa, ensinar uso e melhorar experiência.

### O erro

Repetir a mesma mensagem para todos os momentos.

Uma marca que só oferece orçamento fala com quem já decidiu.

Uma marca que só educa pode nunca conectar conhecimento à solução.`,
    category: "Conteúdo e Redes",
    serviceTitle: "Gestão de Redes Sociais",
    servicePath: "/servicos/gestao-de-redes-sociais",
    serviceNote: "Conteúdo melhora quando a marca entende em que etapa o público está.",
    readTime: "1 min de leitura",
    readingTime: "1 min de leitura",
    date: "Set 11, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Gestão de Redes Sociais",
    relatedServicePath: "/servicos/gestao-de-redes-sociais",
    relatedObjection: "Revise seu calendário pela pergunta: o que a pessoa precisa compreender neste estágio?",
    decisionStage: "comparação",
    strategicSynthesis: {
      problem: "A marca comunica sem considerar o momento da decisão.",
      thesis: "Jornada bem lida deixa o conteúdo mais útil e mais preciso.",
      risk: "A mensagem parece boa, mas não encaixa no que o público precisa naquele instante.",
      nextStep: "Revisar o conteúdo a partir da pergunta que a audiência está fazendo."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Não é só o que dizer. É quando dizer e para quem."
      }
    ],
    framework: {
      title: "Mapa da jornada",
      rows: [
        { label: "Descoberta", value: "A pessoa precisa entender o problema." },
        { label: "Consideração", value: "Ela compara caminhos e alternativas." },
        { label: "Decisão", value: "Ela quer segurança para seguir." }
      ]
    },
    faq: [
      { question: "O que é jornada do consumidor?", answer: "É o conjunto de interações, dúvidas e decisões que uma pessoa atravessa ao se relacionar com uma necessidade, uma categoria e uma marca. Modelos como descoberta, consideração e decisão ajudam a organizar essa leitura, mas o comportamento real nem sempre ocorre de forma linear." },
      { question: "Que conteúdo funciona melhor em cada etapa?", answer: "Na descoberta, conteúdos que ajudam a reconhecer problemas e contexto. Na consideração, comparações, critérios, aprofundamentos e respostas a objeções. Próximo da decisão, processos, cases, provas, FAQs e conteúdos que reduzem risco tendem a ganhar importância." },
      { question: "Todo conteúdo precisa vender?", answer: "Não. Conteúdos podem cumprir diferentes funções: educar, gerar reconhecimento, construir autoridade, reduzir objeções, demonstrar método ou apoiar uma decisão. A estratégia está em saber por que o conteúdo existe e qual continuidade faz sentido." }
    ],
    relatedInsights: ["consideracao-no-funil", "consumidores-conscientes"]
  },
  {
    id: "gerar-leads-google-ads",
    slug: "gerar-leads-google-ads-pre-requisitos",
    title: "Google Ads gera leads. Sua empresa consegue aproveitá-los?",
    excerpt: "Antes de ampliar investimento, verifique oferta, página, mensuração e processo comercial.",
    content: `Mais leads não significam necessariamente mais oportunidades.

O que importa é a qualidade e o que acontece depois que o contato chega.

### 1. Oferta

A pessoa precisa entender o que está sendo apresentado e para quem faz sentido.

### 2. Página

O destino deve continuar a promessa iniciada no anúncio.

Uma boa página precisa responder rapidamente:

- o que é;
- para quem;
- qual problema trata;
- por que considerar;
- qual próximo passo.

### 3. Mensuração

Custo por lead sozinho pode enganar.

É necessário acompanhar qualidade, avanço, proposta e resultado comercial.

### 4. Atendimento

Uma conversão pode ser perdida minutos depois por:

- demora;
- falta de responsável;
- resposta genérica;
- follow-up inexistente.

### Escala vem depois

Se oferta, página, mensuração e comercial ainda têm problemas, aumentar verba amplia ineficiência.`,
    category: "Aquisição e Mídia",
    serviceTitle: "Assessoria Estratégica de Negócios",
    servicePath: "/servicos/assessoria-marketing-digital-estrategico",
    serviceNote: "Antes de gerar leads, a marca precisa sustentar o que prometeu no clique.",
    readTime: "1 min de leitura",
    readingTime: "1 min de leitura",
    date: "Set 11, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Assessoria Estratégica de Negócios",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico",
    relatedObjection: "Antes de ampliar investimento, verifique oferta, página, mensuração e processo comercial.",
    decisionStage: "decisão",
    strategicSynthesis: {
      problem: "O anúncio é tratado como começo, quando ele é só a ponta do sistema.",
      thesis: "A conversão melhora quando oferta, página e medição trabalham juntos.",
      risk: "O lead chega, mas o funil não sustenta a resposta.",
      nextStep: "Ajustar a base antes de aumentar investimento."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Lead bom depende mais de clareza do que de truque de mídia."
      }
    ],
    framework: {
      title: "Checklist do clique",
      rows: [
        { label: "Oferta", value: "Está clara o suficiente?" },
        { label: "Página", value: "Responde a pergunta principal?" },
        { label: "Métrica", value: "Sabemos o que é um lead qualificado?" }
      ]
    },
    faq: [
      {
        question: "### Google Ads funciona para gerar leads?",
        answer: "Pode funcionar muito bem quando existe demanda, oferta compatível, campanha estruturada, página adequada, mensuração e capacidade comercial. O resultado depende do sistema completo, não apenas da configuração da plataforma."
      },
      {
        question: "O que é mais importante: quantidade ou qualidade de leads?",
        answer: "Depende do modelo de negócio, mas volume sem aderência pode gerar custo e sobrecarga. Para operações comerciais, o ideal é acompanhar não apenas contatos, mas também qualificação, propostas, vendas e valor gerado. O próprio Google recomenda aproximar as metas de otimização de resultados empresariais mais relevantes quando existe estrutura de dados para isso."
      },
      {
        question: "Preciso de landing page para anunciar no Google?",
        answer: "Não existe uma exigência universal de utilizar uma landing page exclusiva, mas o destino do anúncio precisa oferecer uma experiência coerente com a procura e com a expectativa criada pelo anúncio. Relevância, utilidade e facilidade de navegação fazem parte da avaliação da experiência da página de destino no Google Ads."
      }
    ],
    relatedInsights: ["anatomia-do-caos-operacional", "como-anunciar-no-google"]
  },
  {
    id: "consideracao-no-funil",
    slug: "consideracao-funil-reduzir-duvidas",
    title: "Consideração: o conteúdo que ajuda o cliente a comparar antes de decidir",
    excerpt: "Entre reconhecer o problema e contratar existe uma etapa decisiva: entender alternativas, avaliar risco e construir critérios.",
    content: `Quando as empresas parecem iguais, a comparação tende a cair no preço.

Por isso, comunicação de consideração precisa ajudar o cliente a entender diferenças reais.

### Explique os critérios

Uma marca pode ensinar:

- quando determinado serviço faz sentido;
- quando não faz;
- o que muda entre alternativas;
- quais riscos existem;
- o que avaliar numa proposta.

Isso não significa atacar concorrentes.

Significa aumentar a qualidade da decisão.

### Objeções são pautas

“Está caro.”

“Posso fazer internamente.”

“Já tentei antes.”

“Não tenho tempo.”

Essas frases contêm dúvidas que o conteúdo pode trabalhar de forma útil.

### Prova precisa de contexto

Um case sem contexto é apenas afirmação.

Processo, decisão e raciocínio ajudam muito mais a construir confiança.`,
    category: "Estratégia",
    serviceTitle: "Assessoria Estratégica de Negócios",
    servicePath: "/servicos/assessoria-marketing-digital-estrategico",
    serviceNote: "Consideração pede clareza, comparação e uma resposta útil para quem ainda avalia.",
    readTime: "1 min de leitura",
    readingTime: "1 min de leitura",
    date: "Set 11, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Assessoria Estratégica de Negócios",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico",
    relatedObjection: "Entre reconhecer o problema e contratar existe uma etapa decisiva: entender alternativas, avaliar risco e construir critérios.",
    decisionStage: "comparação",
    strategicSynthesis: {
      problem: "A marca fala com quem ainda está avaliando, mas sem dar contexto suficiente.",
      thesis: "Na consideração, utilidade e comparação valem mais que impacto vazio.",
      risk: "A peça entretém, mas não ajuda a avançar.",
      nextStep: "Montar conteúdo que compare caminhos e simplifique a escolha."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Consideração é menos sobre chamar atenção e mais sobre ser escolhida."
      }
    ],
    framework: {
      title: "Checklist de consideração",
      rows: [
        { label: "Comparação", value: "A peça ajuda a decidir entre caminhos?" },
        { label: "Prova", value: "Mostra por que esse caminho faz sentido?" },
        { label: "Ação", value: "Deixa claro o próximo passo?" }
      ]
    },
    faq: [
      { question: "O que é a etapa de consideração no funil de vendas?", answer: "É o momento em que a pessoa já reconhece uma necessidade e começa a avaliar alternativas, critérios, riscos e fornecedores. Não é necessariamente uma etapa linear, mas representa um nível maior de intenção e comparação." },
      { question: "Qual conteúdo funciona melhor na consideração?", answer: "Comparativos, cases, FAQs, explicações de processo, critérios de escolha, demonstrações, conteúdos sobre objeções e materiais que ajudem a reduzir risco e diferenciar alternativas." },
      { question: "Conteúdo de consideração deve falar diretamente do serviço?", answer: "Pode falar, mas não precisa ser apenas promocional. Em muitos casos, ensinar como avaliar soluções e reconhecer quando cada alternativa faz sentido gera mais confiança do que repetir benefícios da própria empresa." }
    ],
    relatedInsights: ["jornada-do-consumidor-commerce-connections", "youtube-para-consideracao"]
  },
  {
    id: "youtube-para-consideracao",
    slug: "youtube-para-empresas-consideracao",
    title: "YouTube para empresas: quando profundidade ajuda o cliente a decidir",
    excerpt: "Algumas dúvidas, comparações e demonstrações precisam de mais tempo do que um vídeo curto consegue oferecer.",
    content: `Nem toda decisão cabe em trinta segundos.

Serviços consultivos, soluções técnicas e compras de maior risco precisam de contexto.

### O YouTube pode funcionar como biblioteca

Vídeos podem explicar:

- processos;
- comparações;
- demonstrações;
- objeções;
- cases;
- decisões técnicas.

### Profundidade também gera confiança

Autoridade não depende de parecer especialista.

Depende de conseguir explicar um problema complexo de maneira compreensível.

### O comercial também pode usar o conteúdo

Um bom vídeo pode ser enviado depois de uma reunião, antes de uma proposta ou para responder uma dúvida recorrente.

Isso transforma audiovisual em ativo comercial.`,
    category: "Conteúdo e Redes",
    serviceTitle: "Produção Audiovisual",
    servicePath: "/servicos/producao-audiovisual",
    serviceNote: "Vídeos estratégicos aprofundam perguntas, demonstram método e sustentam confiança antes da decisão.",
    readTime: "1 min de leitura",
    readingTime: "1 min de leitura",
    date: "Set 11, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Produção Audiovisual",
    relatedServicePath: "/servicos/producao-audiovisual",
    relatedObjection: "Algumas dúvidas, comparações e demonstrações precisam de mais tempo do que um vídeo curto consegue oferecer.",
    decisionStage: "comparação",
    strategicSynthesis: {
      problem: "A marca usa vídeo como presença, mas não como explicação.",
      thesis: "O canal cresce quando o conteúdo ajuda a comparar e confiar.",
      risk: "Muitos views, pouca clareza.",
      nextStep: "Estruturar roteiro para responder uma dúvida real."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Vídeo bom não é o que chama mais atenção. É o que sustenta mais entendimento."
      }
    ],
    framework: {
      title: "Função do vídeo",
      rows: [
        { label: "Explicar", value: "A peça responde uma dúvida?" },
        { label: "Demonstrar", value: "Mostra como algo funciona?" },
        { label: "Conduzir", value: "Aponta o próximo passo?" }
      ]
    },
    faq: [
      { question: "YouTube funciona para empresas B2B?", answer: "Pode funcionar especialmente bem quando a venda envolve conhecimento, comparação, ciclo mais longo ou confiança. O valor não depende apenas do alcance: vídeos podem apoiar pesquisa, consideração e conversas comerciais." },
      { question: "Vídeos longos são melhores do que vídeos curtos?", answer: "Não existe superioridade universal. Vídeos curtos funcionam bem quando a mensagem pode ser resolvida rapidamente. Assuntos complexos podem exigir mais tempo. A duração deve acompanhar a profundidade necessária, não uma regra fixa." },
      { question: "Uma empresa precisa publicar toda semana no YouTube?", answer: "Não existe frequência universal. Consistência é importante, mas a capacidade de produzir conteúdos relevantes e sustentáveis também. Para algumas empresas, uma biblioteca menor e mais útil pode gerar mais valor do que volume sem direção." }
    ],
    relatedInsights: ["consideracao-no-funil"]
  },
  {
    id: "campanha-ideal-mensurar-resultados",
    slug: "campanha-ideal-mensurar-resultados",
    title: "A campanha ideal começa pelo objetivo, não pela plataforma",
    excerpt: "A escolha do canal vem depois de definir o resultado, o público e o comportamento esperado da campanha.",
    content: `Escolher campanha por canal é inverter a ordem.

Primeiro responda:

- queremos gerar descoberta?
- consideração?
- demanda?
- conversão?
- aprendizado?

Depois definimos:

- mensagem;
- público;
- canal;
- verba;
- métrica.

A mídia correta é consequência da função que a campanha precisa cumprir.`,
    category: "Aquisição e Mídia",
    serviceTitle: "Assessoria Estratégica de Negócios",
    servicePath: "/servicos/assessoria-marketing-digital-estrategico",
    serviceNote: "Campanha ideal nasce da pergunta certa, não da plataforma mais famosa.",
    readTime: "1 min de leitura",
    readingTime: "1 min de leitura",
    date: "Jun 13, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Assessoria Estratégica de Negócios",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico",
    relatedObjection: "A escolha do canal vem depois de definir o resultado, o público e o comportamento esperado da campanha.",
    decisionStage: "decisão",
    strategicSynthesis: {
      problem: "A campanha é escolhida antes da definição estratégica.",
      thesis: "Objetivo, mensagem e medida de sucesso precisam andar juntos.",
      risk: "A verba vira experimento sem leitura.",
      nextStep: "Escolher a campanha depois de resolver a pergunta do negócio."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Mídia é consequência de decisão, não substituto de estratégia."
      }
    ],
    framework: {
      title: "Tríade da escolha",
      rows: [
        { label: "Objetivo", value: "O que precisa mudar agora?" },
        { label: "Mídia", value: "Qual canal serve melhor esse objetivo?" },
        { label: "Métrica", value: "Como saber se funcionou?" }
      ]
    },
    faq: [
      {
        question: "Posso testar vários canais ao mesmo tempo?",
        answer: "Pode, mas sem perder a leitura do objetivo principal."
      }
    ],
    relatedInsights: ["definir-objetivo-marketing", "como-anunciar-no-google"]
  },
  {
    id: "negocios-ao-universo-online",
    slug: "levar-negocio-para-o-digital-com-estrutura",
    title: "Entrar no digital sem organizar a operação pode apenas ampliar a desorganização",
    excerpt: "Site, Instagram e e-commerce não substituem oferta, atendimento, responsabilidade e processo.",
    content: `Abrir canais é fácil.

Sustentar o que eles prometem é outra história.

Antes de ampliar a presença digital, uma empresa precisa avaliar:

### Oferta

Está claro o que vendemos?

### Informação

Produtos, serviços, preços, políticas e conteúdos estão organizados?

### Atendimento

Quem recebe as oportunidades?

### Conversão

O que esperamos que a pessoa faça?

### Responsabilidade

Quem mantém cada canal?

### Operação

A empresa consegue cumprir a experiência prometida?

### Mensuração

Conseguimos aprender com o que acontece?

### E-commerce evidencia esse problema

Uma loja virtual não cria sozinha estoque confiável, logística, política comercial ou atendimento.

Tecnologia expõe a operação.`,
    category: "Web e Tecnologia",
    serviceTitle: "Desenvolvimento Web",
    servicePath: "/servicos/desenvolvimento-web",
    serviceNote: "Ir para o online pede estrutura que aguente a operação depois da publicação.",
    readTime: "1 min de leitura",
    readingTime: "1 min de leitura",
    date: "Set 11, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Desenvolvimento Web",
    relatedServicePath: "/servicos/desenvolvimento-web",
    relatedObjection: "Site, Instagram e e-commerce não substituem oferta, atendimento, responsabilidade e processo.",
    decisionStage: "entendimento",
    strategicSynthesis: {
      problem: "A pressa de ir para o online costuma vir antes da estrutura mínima.",
      thesis: "A base digital precisa existir antes da aceleração.",
      risk: "O projeto entra no ar, mas não consegue sustentar a operação.",
      nextStep: "Organizar a estrutura antes de aumentar a visibilidade."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Online sem base é só uma forma mais rápida de desorganização."
      }
    ],
    framework: {
      title: "Base mínima",
      rows: [
        { label: "Explicar", value: "A marca é compreensível em poucos segundos?" },
        { label: "Navegar", value: "O visitante encontra o que procura?" },
        { label: "Operar", value: "A equipe consegue manter o sistema?" }
      ]
    },
    faq: [
      { question: "Qual é a estrutura mínima para uma empresa começar no digital?", answer: "Não existe uma configuração universal. Em muitos negócios, uma base inicial pode combinar site, presença no Google, um canal de atendimento e uma rede social prioritária. A escolha depende de público, oferta, jornada e capacidade operacional." },
      { question: "Uma empresa precisa ter site mesmo usando Instagram e WhatsApp?", answer: "Não em todos os casos e momentos. O site, porém, oferece uma base própria para organizar informações, posicionamento, conteúdo, conversão e busca. Quanto maior a complexidade ou maturidade do negócio, maior tende a ser o valor de possuir um ativo digital próprio." },
      { question: "É melhor começar com site institucional ou e-commerce?", answer: "A resposta depende da operação. Quando catálogo, estoque, logística, pagamento, políticas e atendimento ainda não estão suficientemente organizados, um e-commerce pode introduzir complexidade antes da hora. Um diagnóstico de prontidão ajuda a definir o estágio adequado." }
    ],
    relatedInsights: ["importancia-velocidade-conversao-sites", "boas-praticas-manutencao-site"]
  },
  {
    id: "ferramentas-gratuitas-expansao",
    slug: "ferramentas-gratuitas-expansao",
    title: "Ferramentas ajudam a organizar. Mas não decidem como sua operação deveria funcionar.",
    excerpt: "Ferramentas ajudam quando objetivos, responsáveis, entradas, saídas e decisões da rotina já estão claros.",
    content: `Software não cria método.

Planilhas, automações, CRMs e ferramentas gratuitas podem melhorar muito uma rotina quando já existe clareza sobre:

- objetivo;
- responsável;
- entrada;
- saída;
- decisão;
- registro.

Sem isso, a empresa apenas digitaliza a confusão.

### Antes da ferramenta

Mapeie:

1. o que acontece;
2. quem participa;
3. onde existem decisões;
4. quais informações são necessárias;
5. o que precisa ficar registrado.

Depois procure a tecnologia.`,
    category: "Processos",
    serviceTitle: "Process Intelligence",
    servicePath: "/servicos/process-intelligence",
    serviceNote: "Ferramentas funcionam melhor quando o processo já foi entendido.",
    readTime: "1 min de leitura",
    readingTime: "1 min de leitura",
    date: "Jun 15, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Process Intelligence",
    relatedServicePath: "/servicos/process-intelligence",
    relatedObjection: "Ferramentas ajudam quando objetivos, responsáveis, entradas, saídas e decisões da rotina já estão claros.",
    decisionStage: "entendimento",
    strategicSynthesis: {
      problem: "A empresa quer automatizar antes de entender o processo.",
      thesis: "Ferramenta boa amplia clareza, não substitui método.",
      risk: "O caos apenas muda de formato.",
      nextStep: "Mapear a rotina real antes de comprar mais software."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Software não corrige processo confuso."
      }
    ],
    framework: {
      title: "Critério de escolha",
      rows: [
        { label: "Função", value: "O que a ferramenta precisa resolver?" },
        { label: "Rotina", value: "A equipe consegue sustentar o uso?" },
        { label: "Valor", value: "Ela simplifica ou só adiciona etapas?" }
      ]
    },
    faq: [
      {
        question: "Ferramenta gratuita sempre vale a pena?",
        answer: "Só quando ela melhora a rotina sem criar mais ruído."
      }
    ],
    relatedInsights: ["anatomia-do-caos-operacional", "transformacao-digital-erros", "automacao-marketing-vendas"]
  },
  {
    id: "consumidores-conscientes",
    slug: "consumidores-conscientes",
    title: "O público está mais criterioso. Sua comunicação acompanha essa maturidade?",
    excerpt: "Clientes pesquisam, comparam e consultam avaliações. A comunicação precisa respeitar esse repertório.",
    content: `Clientes conseguem pesquisar, comparar, consultar avaliações e chegar à conversa com repertório.

Isso aumenta a importância de uma comunicação que respeite inteligência e contexto.

Esse público tende a valorizar:

- coerência;
- informação útil;
- transparência;
- especificidade;
- respostas objetivas;
- limites claros.

Prometer tudo pode gerar menos confiança do que explicar bem o que realmente é possível entregar.`,
    category: "Conteúdo e Redes",
    serviceTitle: "Gestão de Redes Sociais",
    servicePath: "/servicos/gestao-de-redes-sociais",
    serviceNote: "Consumidor consciente responde melhor a marcas que pensam com clareza.",
    readTime: "1 min de leitura",
    readingTime: "1 min de leitura",
    date: "Jun 16, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Gestão de Redes Sociais",
    relatedServicePath: "/servicos/gestao-de-redes-sociais",
    relatedObjection: "Clientes pesquisam, comparam e consultam avaliações. A comunicação precisa respeitar esse repertório.",
    decisionStage: "entendimento",
    strategicSynthesis: {
      problem: "A empresa comunica como se o público ainda tolerasse genérico.",
      thesis: "Consumidor consciente pede mais critério e mais utilidade.",
      risk: "A marca perde confiança antes da conversa comercial.",
      nextStep: "Revisar a comunicação para a maturidade real do público."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Quanto mais consciente o cliente, menos espaço para ruído e promessa vazia."
      }
    ],
    framework: {
      title: "O que importa",
      rows: [
        { label: "Coerência", value: "O que a marca fala bate com o que entrega?" },
        { label: "Utilidade", value: "A peça ajuda o leitor de verdade?" },
        { label: "Respeito", value: "A mensagem trata o público como adulto?" }
      ]
    },
    faq: [
      {
        question: "Isso vale para qualquer segmento?",
        answer: "Vale ainda mais onde a decisão exige confiança e comparação."
      }
    ],
    relatedInsights: ["jornada-do-consumidor-commerce-connections", "facebook-vender-mais"]
  },
  {
    id: "transformacao-digital-erros",
    slug: "transformacao-digital-erros",
    title: "Transformação digital: três erros que modernizam a ferramenta e preservam o problema",
    excerpt: "Modernizar sistemas não resolve fluxos confusos se responsabilidades, decisões e informações continuam desorganizadas.",
    content: `Digitalização não é apenas colocar software em cima de uma rotina antiga.

Três erros aparecem com frequência.

### 1. Comprar tecnologia antes de compreender o processo

A ferramenta passa a reproduzir um fluxo confuso.

### 2. Criar canais sem definir função

A empresa acumula site, redes, CRM e automações sem clareza sobre o papel de cada um.

### 3. Mudar interface sem mudar operação

A experiência parece moderna, mas decisões, responsabilidades e dados continuam desorganizados.

### A sequência mais segura

Entender → modelar → validar → estruturar → desenvolver → testar → ativar.`,
    category: "Processos",
    serviceTitle: "Process Intelligence",
    servicePath: "/servicos/process-intelligence",
    serviceNote: "Transformação digital boa começa com ordem, não com pressa.",
    readTime: "1 min de leitura",
    readingTime: "1 min de leitura",
    date: "Jun 17, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Process Intelligence",
    relatedServicePath: "/servicos/process-intelligence",
    relatedObjection: "Modernizar sistemas não resolve fluxos confusos se responsabilidades, decisões e informações continuam desorganizadas.",
    decisionStage: "continuidade",
    strategicSynthesis: {
      problem: "A transformação é tratada como estética tecnológica.",
      thesis: "O avanço real depende de método, rotina e clareza.",
      risk: "A empresa moderniza a interface, mas mantém o mesmo caos.",
      nextStep: "Escolher o que deve ser organizado antes de acelerar."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Trocar sistema não é o mesmo que evoluir."
      }
    ],
    framework: {
      title: "Erros a evitar",
      rows: [
        { label: "Ferramenta", value: "Comprar antes de entender a rotina." },
        { label: "Conteúdo", value: "Publicar sem função clara." },
        { label: "Operação", value: "Manter o mesmo fluxo bagunçado." }
      ]
    },
    faq: [
      {
        question: "Transformação digital é só tecnologia?",
        answer: "Não. É método, rotina, decisão e tecnologia na ordem certa."
      }
    ],
    relatedInsights: ["anatomia-do-caos-operacional", "ferramentas-gratuitas-expansao", "automacao-marketing-vendas"]
  },
  {
    id: "influenciadores-virtuais",
    slug: "influenciadores-virtuais",
    title: "Influenciadores virtuais são recurso. Estratégia continua sendo a decisão.",
    excerpt: "Influenciadores virtuais podem chamar atenção, mas precisam cumprir uma função estratégica clara para a marca.",
    content: `Novidade tecnológica chama atenção.

Mas atenção não responde:

- para quem?
- para quê?
- em qual contexto?
- com qual mensagem?
- gerando qual comportamento?

Influenciadores virtuais podem ser úteis quando reforçam uma tese da marca.

Quando entram apenas porque são novidade, tendem a produzir curiosidade sem construção real de posicionamento.`,
    category: "Aquisição e Mídia",
    serviceTitle: "Assessoria Estratégica de Negócios",
    servicePath: "/servicos/assessoria-marketing-digital-estrategico",
    serviceNote: "Novidade visual não dispensa critério estratégico.",
    readTime: "1 min de leitura",
    readingTime: "1 min de leitura",
    date: "Jun 18, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Assessoria Estratégica de Negócios",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico",
    relatedObjection: "Influenciadores virtuais podem chamar atenção, mas precisam cumprir uma função estratégica clara para a marca.",
    decisionStage: "entendimento",
    strategicSynthesis: {
      problem: "A novidade tecnológica pode mascarar falta de método.",
      thesis: "Recurso novo só ajuda quando serve uma tese de marca.",
      risk: "O público vê novidade, mas não enxerga sentido.",
      nextStep: "Checar se o recurso realmente melhora a mensagem."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Novo não é sinônimo de melhor. Melhor é o que resolve a decisão."
      }
    ],
    framework: {
      title: "Critério de uso",
      rows: [
        { label: "Contexto", value: "O recurso faz sentido para o público?" },
        { label: "Função", value: "Ele melhora a mensagem?" },
        { label: "Risco", value: "Pode distrair mais do que ajudar?" }
      ]
    },
    faq: [
      {
        question: "Vale testar influenciadores virtuais?",
        answer: "Sim, se o teste estiver amarrado a função e não apenas curiosidade."
      }
    ],
    relatedInsights: ["novos-influenciadores"]
  },
  {
    id: "como-anunciar-no-google",
    slug: "como-anunciar-no-google",
    title: "Google Ads: como escolher a rede pela intenção, não pelo formato",
    excerpt: "Pesquisa, YouTube, Display e Shopping cumprem funções diferentes. A escolha deve partir da intenção da campanha.",
    content: `Pesquisa, YouTube, Display e Shopping não cumprem a mesma função.

### Pesquisa

Captura demanda já expressa.

### YouTube

Pode ajudar descoberta, consideração e explicação.

### Display

Pode apoiar alcance, lembrança e retomada.

### Shopping

Faz sentido quando existe catálogo estruturado e intenção de produto.

A pergunta não é:

“qual rede é melhor?”

É:

**qual comportamento precisamos influenciar?**`,
    category: "Aquisição e Mídia",
    serviceTitle: "Assessoria Estratégica de Negócios",
    servicePath: "/servicos/assessoria-marketing-digital-estrategico",
    serviceNote: "A rede certa depende da função que a campanha precisa cumprir.",
    readTime: "1 min de leitura",
    readingTime: "1 min de leitura",
    date: "Jun 19, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Assessoria Estratégica de Negócios",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico",
    relatedObjection: "Pesquisa, YouTube, Display e Shopping cumprem funções diferentes. A escolha deve partir da intenção da campanha.",
    decisionStage: "decisão",
    strategicSynthesis: {
      problem: "As redes são tratadas como equivalentes, quando não são.",
      thesis: "Cada formato do Google cumpre uma função específica no funil.",
      risk: "A verba vai para o canal errado.",
      nextStep: "Mapear intenção antes de distribuir o investimento."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "O canal certo é consequência da intenção certa."
      }
    ],
    framework: {
      title: "Função por rede",
      rows: [
        { label: "Pesquisa", value: "Captura demanda ativa." },
        { label: "YouTube", value: "Apoia consideração." },
        { label: "Display", value: "Amplia presença e lembrança." }
      ]
    },
    faq: [
      {
        question: "Uma campanha precisa usar todas as redes?",
        answer: "Não. O melhor é usar só as que servem ao objetivo."
      }
    ],
    relatedInsights: ["definir-objetivo-marketing", "gerar-leads-google-ads"]
  },
  {
    id: "boas-praticas-manutencao-site",
    slug: "manutencao-de-site-seguranca-performance",
    title: "Seu site não termina quando entra no ar: o que precisa ser acompanhado depois da publicação",
    excerpt: "Segurança, backups, formulários, conteúdo e desempenho precisam fazer parte da rotina de um site que participa do negócio.",
    content: `Um site pode estar no ar e já estar falhando.

Um formulário pode parar de enviar.

Uma informação pode ficar desatualizada.

Uma integração pode quebrar.

O problema é que muitas falhas aparecem apenas quando alguém percebe uma consequência.

### O que acompanhar

**Atualizações**
Dependências e recursos precisam ser mantidos.

**Segurança**
A superfície de risco muda com o tempo.

**Backups**
A frequência deve acompanhar a dinâmica do site.

**Performance**
Não significa perseguir nota perfeita, mas preservar boa experiência.

**Formulários**
Todo ponto de contato precisa ser testado.

**Conteúdo**
Informação antiga também é falha.

**SEO técnico**
Links, páginas e indexação precisam ser acompanhados.

**Infraestrutura**
Disponibilidade e hospedagem continuam importando.

### Manutenção preventiva não significa zero falha

Significa aumentar a chance de identificar e corrigir problemas antes de impacto maior.`,
    category: "Web e Tecnologia",
    serviceTitle: "Hospedagem e Manutenção",
    servicePath: "/hospedagem-manutencao-sites",
    serviceNote: "Manutenção preserva o valor do site depois da publicação.",
    readTime: "1 min de leitura",
    readingTime: "1 min de leitura",
    date: "Set 11, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Hospedagem e Manutenção",
    relatedServicePath: "/hospedagem-manutencao-sites",
    relatedObjection: "Segurança, backups, formulários, conteúdo e desempenho precisam fazer parte da rotina de um site que participa do negócio.",
    decisionStage: "continuidade",
    strategicSynthesis: {
      problem: "O site é tratado como algo pronto e nunca mais revisado.",
      thesis: "Manutenção sustenta confiança, continuidade e estabilidade.",
      risk: "O site degrada sem ninguém perceber a tempo.",
      nextStep: "Criar uma rotina simples de cuidado e acompanhamento."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "O site publicado ainda precisa de cuidado. Depois do ar, começa outra etapa."
      }
    ],
    framework: {
      title: "Rotina de cuidado",
      rows: [
        { label: "Segurança", value: "Atualizações e acessos sob controle." },
        { label: "Performance", value: "Velocidade e estabilidade revisadas." },
        { label: "Conteúdo", value: "Páginas mantidas vivas e corretas." }
      ]
    },
    faq: [
      { question: "Com que frequência um site precisa de manutenção?", answer: "A frequência depende da tecnologia, criticidade, volume de alterações e função do site. Algumas verificações podem ser contínuas, outras semanais, mensais ou trimestrais. Sites com vendas, campanhas ou integrações críticas tendem a exigir acompanhamento mais próximo." },
      { question: "Atualizar plugins já é suficiente para manter um site?", answer: "Não. Atualizações são apenas uma parte. Manutenção também pode envolver segurança, backups, performance, formulários, integrações, conteúdo, links, disponibilidade e revisão de informações." },
      { question: "Um site antigo deve ser mantido ou reconstruído?", answer: "Depende da base existente. Quando tecnologia, arquitetura e estrutura ainda suportam evolução, manutenção e melhorias podem ser suficientes. Quando limitações estruturais geram retrabalho recorrente, uma reconstrução pode fazer mais sentido." }
    ],
    relatedInsights: ["importancia-velocidade-conversao-sites", "negocios-ao-universo-online"]
  },
  {
    id: "facebook-vender-mais",
    slug: "facebook-vender-mais",
    title: "Facebook ainda funciona? A resposta depende da função que ele exerce na estratégia",
    excerpt: "A utilidade do Facebook depende do público, do objetivo do canal e de sua integração com atendimento e estratégia.",
    content: `Perguntar se uma plataforma “ainda funciona” costuma simplificar demais a decisão.

O Facebook pode continuar relevante para públicos, contextos e objetivos específicos.

A pergunta correta é:

**o nosso público está aqui e existe uma função clara para este canal?**

Quando existe:

- mensagem adequada;
- público compatível;
- destino coerente;
- integração com atendimento;
- objetivo mensurável;

a plataforma pode cumprir um papel útil.

Quando não existe, aumentar frequência dificilmente resolve.`,
    category: "Conteúdo e Redes",
    serviceTitle: "Gestão de Redes Sociais",
    servicePath: "/servicos/gestao-de-redes-sociais",
    serviceNote: "Facebook pode apoiar venda, desde que a intenção esteja clara.",
    readTime: "1 min de leitura",
    readingTime: "1 min de leitura",
    date: "Jun 21, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Gestão de Redes Sociais",
    relatedServicePath: "/servicos/gestao-de-redes-sociais",
    relatedObjection: "A utilidade do Facebook depende do público, do objetivo do canal e de sua integração com atendimento e estratégia.",
    decisionStage: "decisão",
    strategicSynthesis: {
      problem: "A plataforma é usada sem uma intenção comercial precisa.",
      thesis: "Facebook funciona quando a mensagem e o destino da ação estão alinhados.",
      risk: "Mais posts, pouca venda e muita dispersão.",
      nextStep: "Definir a rota do clique e a função da peça."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Redes sociais vendem melhor quando ajudam a avançar a conversa, não quando tentam fechar sozinhas."
      }
    ],
    framework: {
      title: "Condição de uso",
      rows: [
        { label: "Mensagem", value: "O texto convida para o próximo passo certo?" },
        { label: "Destino", value: "O clique leva para um lugar coerente?" },
        { label: "Função", value: "A peça ajuda o comercial ou só ocupa espaço?" }
      ]
    },
    faq: [
      {
        question: "Facebook ainda vale para marca B2B?",
        answer: "Vale quando ele faz parte de uma rota clara de conteúdo e resposta."
      }
    ],
    relatedInsights: ["jornada-do-consumidor-commerce-connections", "consumidores-conscientes"]
  },
  {
    id: "automacao-marketing-vendas",
    slug: "automacao-marketing-vendas",
    title: "Automação de marketing não corrige processo ruim. Ela o executa mais rápido.",
    excerpt: "Antes de automatizar mensagens, distribuição e follow-up, a empresa precisa saber qual jornada pretende automatizar.",
    content: `Automação pode liberar tempo, reduzir tarefas repetitivas e aumentar consistência.

Mas ela depende de regras.

Antes de configurar gatilhos, precisamos saber:

- quem entra no fluxo;
- por qual motivo;
- quais informações existem;
- qual mensagem faz sentido;
- qual ação é esperada;
- quando uma pessoa precisa assumir;
- quando o fluxo deve parar.

### O erro

A empresa percebe desorganização e compra uma ferramenta.

Depois tenta adaptar a rotina ao software.

O resultado costuma ser um processo confuso executado com mais velocidade.

### A sequência melhor

Primeiro:

mapear.

Depois:

definir responsabilidade.

Depois:

validar regras.

Só então:

automatizar.

### Automação deve ampliar capacidade

Ela é mais útil quando retira esforço mecânico sem retirar contexto das decisões que ainda precisam de pessoas.`,
    category: "Processos",
    serviceTitle: "Process Intelligence",
    servicePath: "/servicos/process-intelligence",
    serviceNote: "Automação só escala o que já foi organizado.",
    readTime: "1 min de leitura",
    readingTime: "1 min de leitura",
    date: "Jun 22, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Process Intelligence",
    relatedServicePath: "/servicos/process-intelligence",
    relatedObjection: "Antes de automatizar mensagens, distribuição e follow-up, a empresa precisa saber qual jornada pretende automatizar.",
    decisionStage: "continuidade",
    strategicSynthesis: {
      problem: "A automação entra antes da organização do fluxo.",
      thesis: "Automação boa amplia o processo, não corrige improviso.",
      risk: "O erro fica mais rápido.",
      nextStep: "Organizar a rotina antes de automatizar a resposta."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Automação sem método é só velocidade para repetir o que já estava errado."
      }
    ],
    framework: {
      title: "Pré-requisitos",
      rows: [
        { label: "Fluxo", value: "Está claro de ponta a ponta?" },
        { label: "Mensagem", value: "O que a automação precisa dizer?" },
        { label: "Revisão", value: "Existe rotina para corrigir o que sair do esperado?" }
      ]
    },
    faq: [
      {
        question: "Automação serve para qualquer negócio?",
        answer: "Serve quando existe processo para sustentar o fluxo automático."
      }
    ],
    relatedInsights: ["anatomia-do-caos-operacional", "ferramentas-gratuitas-expansao", "transformacao-digital-erros"]
  }
];

