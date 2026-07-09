import { Service, Plan, PlanFeature, CaseStudy, BlogPost } from "./types";

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
    image: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=600",
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
    image: "https://images.unsplash.com/photo-1505664194779-8bebcb35da44?auto=format&fit=crop&q=80&w=600",
    metric: "18",
    metricLabel: "Novos Clientes Corporativos de Grande Porte",
    challenge: "O escritório operava sem representação moderna na internet. O antigo site de 2011 transmitia uma aparência desatualizada e amadora.",
    solution: "Criamos heráldica moderna, tipografia sênior alemã, e desenvolvemos um portal web institucional focado em explicar as soluções de governança societária e defesas tributárias de alto calibre.",
    results: [
      "Nova marca impactante consolidada em materiais executivos e no novo ecossistema",
      "Canal orgânico de SEO operando para perguntas-chave do direito empresarial",
      "Fechamento de 18 novos de contratos anuais de assessoria de alto nível"
    ]
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "estrategia-antes-da-estetica",
    title: "Seu conteúdo é bonito ou útil para vender?",
    excerpt: "Quando a peça só chama atenção, ela ajuda pouco a busca por IA e quase nada o comercial. O objetivo precisa ser decisão, não enfeite.",
    content: `Conteúdo bom responde uma pergunta real.
    
    Se a peça não ajuda o visitante a entender o problema, ela não ajuda a marca a vender. Em contexto de busca com IA, isso ficou mais claro: a resposta precisa ser direta, útil e conectada a uma ação.
    
    ### Sinais de que o conteúdo está fraco
    - fala bonito, mas não esclarece nada;
    - mostra estética, mas não mostra caminho;
    - recebe atenção, mas não melhora decisão;
    - gera postagem, mas não gera conversa comercial.
    
    ### O que funciona melhor
    1. escolher uma pergunta central;
    2. responder sem rodeio;
    3. mostrar o erro comum;
    4. apontar o próximo passo;
    5. ligar a resposta a um serviço real da TAG08.
    
    Se o seu conteúdo não faz isso, ele está trabalhando mais para aparência do que para posicionamento.`,
    category: "Estratégia",
    serviceTitle: "Assessoria de Marketing",
    servicePath: "/servicos/assessoria-marketing-digital-estrategico",
    serviceNote: "Quando a dúvida é posicionamento, o próximo passo é diagnóstico.",
    readTime: "4 min de leitura",
    date: "Jun 02, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "anatomia-do-caos-operacional",
    title: "Seu problema é marketing ou é operação sem processo?",
    excerpt: "Quando a empresa depende da memória de poucos, o conteúdo e a venda viram retrabalho. O diagnóstico certo começa antes da execução.",
    content: `Muita empresa acha que o problema está no marketing, mas o vazamento real está na operação.
    
    Quando ninguém sabe o que fazer sem perguntar de novo, o negócio produz atraso, ruído e desgaste. O conteúdo precisa refletir uma operação organizada, não mascarar um caos interno.
    
    ### Sintomas de alerta
    - o fundador centraliza tudo;
    - a equipe repete as mesmas dúvidas;
    - cada entrega depende de improviso;
    - o cliente sente a desorganização logo no contato.
    
    ### O que a TAG08 faz
    - mapeia o fluxo real;
    - reduz dependência de pessoas-chave;
    - cria playbooks e wikis;
    - estabelece regras de execução;
    - conecta processo, comunicação e atendimento.
    
    Se a operação não está clara, o conteúdo também não vai parecer confiável.`,
    category: "Processos",
    serviceTitle: "Process Intelligence",
    servicePath: "/servicos/process-intelligence",
    serviceNote: "Se o conteúdo expõe retrabalho, o processo precisa de clareza.",
    readTime: "6 min de leitura",
    date: "Mai 28, 2026",
    author: "Consultores de Processos TAG08",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "importancia-velocidade-conversao-sites",
    title: "Seu site está ajudando a resposta da IA ou atrapalhando o clique?",
    excerpt: "Quando a página demora ou explica mal, a mídia paga perde força e a busca por IA entrega menos confiança ao visitante.",
    content: `O site não é vitrine decorativa. Ele é o ponto onde a promessa vira prova.
    
    Se a página demora para abrir, confunde o visitante ou não responde a pergunta principal, a percepção de valor cai antes do contato acontecer.
    
    ### O que um site precisa fazer
    - abrir rápido;
    - explicar o que a empresa faz;
    - reforçar autoridade;
    - mostrar prova;
    - apontar para a ação correta.
    
    ### O que costumamos corrigir
    - imagens grandes demais;
    - blocos longos sem escaneabilidade;
    - CTA sem contexto;
    - hierarquia visual fraca;
    - promessa desalinhada com a página.
    
    Se o clique custa caro, a página precisa ser mais clara que o anúncio. Caso contrário, o tráfego paga a conta do erro.`,
    category: "Web",
    serviceTitle: "Desenvolvimento Web",
    servicePath: "/servicos/desenvolvimento-web",
    serviceNote: "Se o site atrapalha a leitura, ele precisa ser reestruturado.",
    readTime: "5 min de leitura",
    date: "Mai 15, 2026",
    author: "Dev Team TAG08",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600"
  }
];

