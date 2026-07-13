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

export const BLOG_POSTS: EditorialBlogPost[] = [
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
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600",
    slug: "estrategia-antes-da-estetica",
    readingTime: "4 min de leitura",
    relatedServiceTitle: "Assessoria de Marketing",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico",
    relatedObjection: "Quando a marca precisa de direcao antes de produzir mais conteudo.",
    decisionStage: "entendimento",
    strategicSynthesis: {
      problem: "O conteudo chama atencao, mas nao organiza a decisao.",
      thesis: "Se a peÃ§a nao esclarece o problema, ela ainda nao cumpre a funcao editorial da TAG08.",
      risk: "A marca fica bonita, mas continua sem orientar escolha.",
      nextStep: "Abrir uma assessoria para alinhar posicionamento, objeÃ§oes e proximo passo."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "No topo do funil, utilidade vence estetica quando o objetivo e qualificar a leitura."
      }
    ],
    framework: {
      title: "Framework de leitura",
      rows: [
        { label: "Pergunta central", value: "O conteudo ajuda ou apenas enfeita?" },
        { label: "Sinal de alerta", value: "A peÃ§a chama atencao, mas nao orienta acao." },
        { label: "Resposta pratica", value: "Reescrever com foco em problema, tese e proximo passo." }
      ]
    },
    faq: [
      {
        question: "Esse tipo de conteudo serve para qualquer marca?",
        answer: "Serve quando a marca precisa transformar atencao em clareza comercial."
      }
    ],
    relatedInsights: ["anatomia-do-caos-operacional", "importancia-velocidade-conversao-sites"]
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
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600",
    slug: "anatomia-do-caos-operacional",
    readingTime: "6 min de leitura",
    relatedServiceTitle: "Process Intelligence",
    relatedServicePath: "/servicos/process-intelligence",
    relatedObjection: "Quando o retrabalho da equipe parece problema de marketing.",
    decisionStage: "comparação",
    strategicSynthesis: {
      problem: "O sintoma aparece na venda, mas a causa costuma estar na rotina interna.",
      thesis: "Processo claro sustenta conteudo claro. Um nao compensa o outro.",
      risk: "A empresa tenta comunicar melhor sem corrigir o caos operacional.",
      nextStep: "Mapear fluxo real, dependencias e pontos de ruído antes de ampliar a comunicacao."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Quando a equipe repete perguntas, o conteudo costuma estar refletindo uma operacao mal definida."
      }
    ],
    framework: {
      title: "Checklist de diagnostico",
      rows: [
        { label: "Fundador", value: "Centraliza tudo?" },
        { label: "Equipe", value: "Repete as mesmas duvidas?" },
        { label: "Entrega", value: "Depende de improviso?" }
      ]
    },
    faq: [
      {
        question: "Processo e marketing competem entre si?",
        answer: "Nao. O marketing fica mais claro quando a operacao sustenta a promessa."
      }
    ],
    relatedInsights: ["estrategia-antes-da-estetica", "importancia-velocidade-conversao-sites"]
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
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600",
    slug: "importancia-velocidade-conversao-sites",
    readingTime: "5 min de leitura",
    relatedServiceTitle: "Desenvolvimento Web",
    relatedServicePath: "/servicos/desenvolvimento-web",
    relatedObjection: "Quando a pagina parece boa, mas continua lenta ou confusa.",
    decisionStage: "decisão",
    strategicSynthesis: {
      problem: "A pagina pode ter boa aparencia e ainda assim prejudicar a leitura.",
      thesis: "Velocidade, clareza e hierarquia sao parte da promessa, nao detalhe tecnico.",
      risk: "O clique fica caro demais para sustentar uma pagina fraca.",
      nextStep: "Reestruturar a pagina para explicar melhor, carregar mais rapido e orientar a acao."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Quando a pagina atrapalha a resposta, o problema e de arquitetura de informacao antes de ser visual."
      }
    ],
    framework: {
      title: "Matriz de leitura",
      rows: [
        { label: "Abrir rapido", value: "Evita perda de atencao antes do conteudo carregar." },
        { label: "Explicar bem", value: "Mostra o papel da pagina sem ruido." },
        { label: "Apontar a acao", value: "Leva o visitante para o proximo passo certo." }
      ]
    },
    faq: [
      {
        question: "Um site bonito ja resolve o problema?",
        answer: "Nao. A interface precisa ajudar o visitante a entender, confiar e agir."
      }
    ],
    relatedInsights: ["estrategia-antes-da-estetica", "anatomia-do-caos-operacional"]
  },
  {
    id: "novos-influenciadores",
    slug: "novos-influenciadores",
    title: "Novos influenciadores mudaram a lógica da recomendação?",
    excerpt: "Influência hoje não depende só de fama. O que pesa é contexto, relevância e encaixe entre público, produto e mensagem.",
    content: `A influência deixou de ser apenas alcance.

Hoje, o que decide o efeito de uma parceria é a qualidade do contexto. Um criador pode ter menos seguidores e ainda assim gerar mais atenção útil do que perfis enormes sem conexão com a audiência certa.

### O que observar antes de contratar
- afinidade real com o público;
- coerência entre a mensagem e a marca;
- histórico de credibilidade;
- formato de conteúdo que o público já consome.

### O erro mais comum
Escolher influência pela aparência do perfil e não pela função que ele cumpre na conversa comercial.

Quando a marca entende isso, influenciador deixa de ser atalho e vira peça de estratégia.`,
    category: "Estratégia",
    serviceTitle: "Assessoria de Marketing",
    servicePath: "/servicos/assessoria-marketing-digital-estrategico",
    serviceNote: "Antes de usar influência, vale entender que função a parceria precisa cumprir.",
    readTime: "4 min de leitura",
    readingTime: "4 min de leitura",
    date: "Jun 07, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Assessoria de Marketing",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico",
    relatedObjection: "Quando a marca quer usar influenciadores sem perder critério.",
    decisionStage: "entendimento",
    strategicSynthesis: {
      problem: "A escolha do influenciador costuma começar pela vitrine e nao pela funcao.",
      thesis: "Influência funciona quando encaixa publico, tema e momento da marca.",
      risk: "A parceria gera ruido, mas nao clareza comercial.",
      nextStep: "Definir objetivo, criterio de seleção e a pergunta que a campanha precisa responder."
    },
    expertLens: [
      {
        title: "Lupa TAG08",
        body: "Mais importante que reach e perguntar: essa pessoa melhora ou atrapalha a decisao?"
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
    relatedInsights: ["consumidores-conscientes", "influenciadores-virtuais"]
  },
  {
    id: "definir-objetivo-marketing",
    slug: "definir-objetivo-marketing",
    title: "Antes de anunciar, qual objetivo sua marca precisa resolver?",
    excerpt: "Sem objetivo claro, a campanha coleta cliques demais e decisão de menos. A estratégia começa pela pergunta certa.",
    content: `Toda campanha precisa responder a uma pergunta principal.

Se o objetivo não está claro, a mídia vira gasto difuso. Pode até gerar movimento, mas não necessariamente avança a decisão do mercado.

### Objetivos comuns
- gerar descoberta;
- aumentar consideração;
- sustentar a decisão;
- ativar uma oferta específica.

### O que a TAG08 protege
Definição de objetivo antes de mídia, linguagem e orçamento. Isso evita campanhas que parecem ativas, mas não ajudam a empresa a escolher o caminho certo.`,
    category: "Estratégia",
    serviceTitle: "Assessoria de Marketing",
    servicePath: "/servicos/assessoria-marketing-digital-estrategico",
    serviceNote: "Antes do anúncio, vem a decisão sobre o que a campanha precisa fazer.",
    readTime: "4 min de leitura",
    readingTime: "4 min de leitura",
    date: "Jun 08, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Assessoria de Marketing",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico",
    relatedObjection: "Quando a verba existe, mas a pergunta principal ainda não foi definida.",
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
        question: "Uma campanha pode ter mais de um objetivo?",
        answer: "Pode, mas um deles precisa liderar. Sem isso, a leitura fica confusa."
      }
    ],
    relatedInsights: ["como-anunciar-no-google", "campanha-ideal-mensurar-resultados"]
  },
  {
    id: "jornada-do-consumidor-commerce-connections",
    slug: "jornada-do-consumidor-commerce-connections",
    title: "A jornada do consumidor muda o que a marca deve explicar",
    excerpt: "Quando a marca entende a jornada, ela para de publicar só para ocupar espaço e começa a responder o momento certo do público.",
    content: `A jornada do consumidor não é um diagrama decorativo.

Ela mostra em que momento a pessoa está e o que ela precisa entender para avançar com segurança. Isso muda linguagem, formato e até o tipo de prova que faz sentido mostrar.

### Leitura prática
- descoberta pede contexto;
- consideração pede comparação;
- decisão pede clareza e segurança;
- continuidade pede utilidade real.

Quando a marca respeita essa lógica, o conteúdo deixa de ser genérico e passa a acompanhar o raciocínio do comprador.`,
    category: "Estratégia",
    serviceTitle: "Gestão de Redes Sociais",
    servicePath: "/servicos/gestao-de-redes-sociais",
    serviceNote: "Conteúdo melhora quando a marca entende em que etapa o público está.",
    readTime: "5 min de leitura",
    readingTime: "5 min de leitura",
    date: "Jun 09, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Gestão de Redes Sociais",
    relatedServicePath: "/servicos/gestao-de-redes-sociais",
    relatedObjection: "Quando o conteúdo fala certo, mas na etapa errada.",
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
      {
        question: "Toda publicação precisa cobrir a jornada inteira?",
        answer: "Não. Cada peça pode cumprir um papel específico dentro do percurso."
      }
    ],
    relatedInsights: ["definir-objetivo-marketing", "youtube-para-consideracao"]
  },
  {
    id: "gerar-leads-google-ads",
    slug: "gerar-leads-google-ads",
    title: "Gerar leads no Google Ads não começa pelo anúncio",
    excerpt: "A campanha só funciona quando a estrutura já sabe o que captar, onde levar e como qualificar a resposta do clique.",
    content: `Lead não nasce do botão de impulsionar.

A conta só começa a fazer sentido quando existe oferta clara, página que explica e próximo passo definido. Sem isso, o anúncio compra tráfego e devolve frustração.

### O que precisa existir
- objetivo comercial explícito;
- página coerente com a promessa;
- medição mínima confiável;
- resposta rápida para o contato.

### O que a TAG08 faz
Organiza a base antes do anúncio para que o tráfego pago tenha função real e não apenas aparência de movimento.`,
    category: "Performance",
    serviceTitle: "Assessoria de Marketing",
    servicePath: "/servicos/assessoria-marketing-digital-estrategico",
    serviceNote: "Antes de gerar leads, a marca precisa sustentar o que prometeu no clique.",
    readTime: "5 min de leitura",
    readingTime: "5 min de leitura",
    date: "Jun 10, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Assessoria de Marketing",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico",
    relatedObjection: "Quando a empresa quer lead, mas ainda não fechou a estrutura da oferta.",
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
        question: "Google Ads sempre funciona?",
        answer: "Funciona quando a estrutura comercial suporta a campanha."
      }
    ],
    relatedInsights: ["como-anunciar-no-google", "campanha-ideal-mensurar-resultados"]
  },
  {
    id: "consideracao-no-funil",
    slug: "consideracao-no-funil",
    title: "Consideração não é atenção: é contexto suficiente para avançar",
    excerpt: "Quando a marca entra na etapa de consideração, ela precisa ser útil, comparável e fácil de entender.",
    content: `Consideração é a fase em que a pessoa está olhando melhor.

Ela já reconhece o tema e agora precisa de contexto suficiente para comparar caminhos. Aqui, o conteúdo precisa reduzir dúvida, não aumentar ruído.

### O que ajuda na consideração
- exemplos claros;
- explicação de diferenças;
- prova do método;
- chamada para o próximo passo.

Quando a marca publica pensando nessa fase, ela ajuda o visitante a avançar em vez de apenas consumir informação.`,
    category: "Estratégia",
    serviceTitle: "Assessoria de Marketing",
    servicePath: "/servicos/assessoria-marketing-digital-estrategico",
    serviceNote: "Consideração pede clareza, comparação e uma resposta útil para quem ainda avalia.",
    readTime: "4 min de leitura",
    readingTime: "4 min de leitura",
    date: "Jun 11, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Assessoria de Marketing",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico",
    relatedObjection: "Quando a audiência já viu a marca, mas ainda precisa comparar melhor.",
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
      {
        question: "Conteúdo de consideração precisa vender?",
        answer: "Precisa avançar a leitura e preparar a decisão, não encerrar a conversa à força."
      }
    ],
    relatedInsights: ["youtube-para-consideracao", "campanha-ideal-mensurar-resultados"]
  },
  {
    id: "youtube-para-consideracao",
    slug: "youtube-para-consideracao",
    title: "YouTube pode ajudar a marca a ser considerada, não só vista",
    excerpt: "O vídeo funciona melhor quando a marca usa o canal para explicar, demonstrar e sustentar confiança.",
    content: `YouTube não é só vitrine de alcance.

Para muitas marcas, ele funciona como uma sala de explicação. Um bom vídeo ajuda o público a entender melhor a oferta, o contexto e a diferença entre opções.

### O que o vídeo precisa fazer
- explicar uma dúvida real;
- demonstrar o método ou uso;
- reforçar confiança;
- conduzir para um próximo passo.

Vídeo sem função vira presença vazia. Vídeo com papel claro vira apoio editorial e comercial.`,
    category: "Performance",
    serviceTitle: "Gestão de Redes Sociais",
    servicePath: "/servicos/gestao-de-redes-sociais",
    serviceNote: "YouTube funciona melhor quando a marca quer ajudar o público a entender antes de decidir.",
    readTime: "5 min de leitura",
    readingTime: "5 min de leitura",
    date: "Jun 12, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Gestão de Redes Sociais",
    relatedServicePath: "/servicos/gestao-de-redes-sociais",
    relatedObjection: "Quando o vídeo precisa fazer mais do que aparecer.",
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
      {
        question: "Todo vídeo precisa vender?",
        answer: "Não. Alguns vídeos precisam apenas preparar a decisão com mais clareza."
      }
    ],
    relatedInsights: ["consideracao-no-funil", "influenciadores-virtuais"]
  },
  {
    id: "campanha-ideal-mensurar-resultados",
    slug: "campanha-ideal-mensurar-resultados",
    title: "Como escolher a campanha ideal sem confundir objetivo com mídia",
    excerpt: "A campanha certa depende da pergunta de negócio. O canal vem depois dessa escolha.",
    content: `Escolher campanha pela plataforma é inverter a ordem.

A pergunta certa é: o que precisamos resolver agora? Depois disso, a mídia deixa de ser escolha por moda e passa a ser decisão por função.

### Perguntas úteis
- queremos alcance, consideração ou conversão?
- qual etapa da jornada precisa de apoio?
- qual métrica vai provar progresso?

Uma campanha ideal é a que encaixa objetivo, mensagem e medida de sucesso.`,
    category: "Performance",
    serviceTitle: "Assessoria de Marketing",
    servicePath: "/servicos/assessoria-marketing-digital-estrategico",
    serviceNote: "Campanha ideal nasce da pergunta certa, não da plataforma mais famosa.",
    readTime: "4 min de leitura",
    readingTime: "4 min de leitura",
    date: "Jun 13, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Assessoria de Marketing",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico",
    relatedObjection: "Quando a escolha da mídia está na frente da definição do objetivo.",
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
    relatedInsights: ["gerar-leads-google-ads", "definir-objetivo-marketing"]
  },
  {
    id: "negocios-ao-universo-online",
    slug: "negocios-ao-universo-online",
    title: "Levar sua empresa para o online começa pela estrutura, não pela urgência",
    excerpt: "Entrar no digital sem estrutura só acelera confusão. O online pede base, clareza e ordem.",
    content: `Ir para o online não é só publicar uma página.

Antes de acelerar, a marca precisa saber o que vai explicar, onde o visitante vai chegar e como a operação vai sustentar a promessa.

### O que importa primeiro
- conteúdo básico;
- navegação simples;
- canais de contato claros;
- rotina mínima de atualização.

Digital sem estrutura multiplica ruído. Estrutura antes da pressa evita retrabalho.`,
    category: "Web",
    serviceTitle: "Desenvolvimento Web",
    servicePath: "/servicos/desenvolvimento-web",
    serviceNote: "Ir para o online pede estrutura que aguente a operação depois da publicação.",
    readTime: "5 min de leitura",
    readingTime: "5 min de leitura",
    date: "Jun 14, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Desenvolvimento Web",
    relatedServicePath: "/servicos/desenvolvimento-web",
    relatedObjection: "Quando o negócio quer ir para o digital sem desenhar a base.",
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
      {
        question: "Um site simples resolve no início?",
        answer: "Resolve, desde que ele tenha função clara e consiga evoluir."
      }
    ],
    relatedInsights: ["ferramentas-gratuitas-expansao", "boas-praticas-manutencao-site"]
  },
  {
    id: "ferramentas-gratuitas-expansao",
    slug: "ferramentas-gratuitas-expansao",
    title: "Ferramentas gratuitas ajudam, mas não substituem clareza operacional",
    excerpt: "A tecnologia certa ajuda a crescer quando a rotina já sabe o que precisa fazer.",
    content: `Ferramenta não organiza decisão sozinha.

Ela ajuda a executar melhor o que já está claro. Quando a empresa tenta usar software para resolver problema de método, normalmente troca bagunça manual por bagunça digital.

### Uso inteligente
- escolher por função;
- evitar excesso de apps;
- padronizar rotina;
- revisar o que realmente gera valor.

Ferramentas são apoio. A clareza da operação continua sendo o ponto de partida.`,
    category: "Processos",
    serviceTitle: "Process Intelligence",
    servicePath: "/servicos/process-intelligence",
    serviceNote: "Ferramentas funcionam melhor quando o processo já foi entendido.",
    readTime: "4 min de leitura",
    readingTime: "4 min de leitura",
    date: "Jun 15, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Process Intelligence",
    relatedServicePath: "/servicos/process-intelligence",
    relatedObjection: "Quando a empresa quer ferramenta antes de organizar a rotina.",
    decisionStage: "entendimento",
    strategicSynthesis: {
      problem: "A empresa quer automatizar antes de entender o processo.",
      thesis: "Ferramenta boa amplia clareza, nao substitui método.",
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
    relatedInsights: ["negocios-ao-universo-online", "boas-praticas-manutencao-site"]
  },
  {
    id: "consumidores-conscientes",
    slug: "consumidores-conscientes",
    title: "Consumidores conscientes compram de empresas inteligentes",
    excerpt: "O público percebe rapidamente quando a marca pensa com clareza ou apenas fala bonito.",
    content: `Quem compra com mais consciência lê sinais.

Ele percebe se a empresa sabe o que está fazendo, se organiza a própria mensagem e se respeita o tempo de decisão do cliente. Inteligência, aqui, é clareza aplicada.

### O que esse público valoriza
- coerência;
- utilidade;
- respeito;
- contexto;
- resposta objetiva.

Marcas inteligentes não prometem tudo. Elas explicam bem o que realmente entregam.`,
    category: "Estratégia",
    serviceTitle: "Gestão de Redes Sociais",
    servicePath: "/servicos/gestao-de-redes-sociais",
    serviceNote: "Consumidor consciente responde melhor a marcas que pensam com clareza.",
    readTime: "4 min de leitura",
    readingTime: "4 min de leitura",
    date: "Jun 16, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Gestão de Redes Sociais",
    relatedServicePath: "/servicos/gestao-de-redes-sociais",
    relatedObjection: "Quando o público já não aceita discurso vazio.",
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
    relatedInsights: ["novos-influenciadores", "influenciadores-virtuais"]
  },
  {
    id: "transformacao-digital-erros",
    slug: "transformacao-digital-erros",
    title: "Três erros de transformação digital que travam a evolução da marca",
    excerpt: "Digitalização sem critério gera mais ruído que avanço. O problema costuma ser ordem, não ferramenta.",
    content: `Transformação digital falha quando começa pela aparência.

Os três erros mais comuns são: comprar ferramenta sem processo, criar conteúdo sem função e mudar a superfície sem ajustar a operação.

### Como evitar
- começar pela pergunta de negócio;
- definir rotina antes de software;
- alinhar comunicação e operação;
- medir o que realmente muda.

Transformação digital boa não é a mais chamativa. É a que deixa a empresa mais clara e mais governável.`,
    category: "Processos",
    serviceTitle: "Process Intelligence",
    servicePath: "/servicos/process-intelligence",
    serviceNote: "Transformação digital boa começa com ordem, não com pressa.",
    readTime: "5 min de leitura",
    readingTime: "5 min de leitura",
    date: "Jun 17, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Process Intelligence",
    relatedServicePath: "/servicos/process-intelligence",
    relatedObjection: "Quando a empresa quer transformação sem revisar o próprio método.",
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
    relatedInsights: ["ferramentas-gratuitas-expansao", "boas-praticas-manutencao-site"]
  },
  {
    id: "influenciadores-virtuais",
    slug: "influenciadores-virtuais",
    title: "Influenciadores virtuais mudam o jogo, mas não substituem estratégia",
    excerpt: "A novidade chama atenção, mas a decisão continua dependendo de contexto, coerência e leitura de público.",
    content: `Influenciadores virtuais são um sinal de mudança, não uma solução automática.

Eles ampliam possibilidades de narrativa, mas ainda precisam ser avaliados pelo mesmo critério que qualquer ação: encaixe com público, função comercial e coerência com a marca.

### Leitura da TAG08
- novidade sem estratégia vira curiosidade passageira;
- estratégia com novidade pode reforçar diferencial;
- o público continua decidindo por confiança.

O recurso é interessante. A disciplina continua sendo indispensável.`,
    category: "Estratégia",
    serviceTitle: "Assessoria de Marketing",
    servicePath: "/servicos/assessoria-marketing-digital-estrategico",
    serviceNote: "Novidade visual não dispensa critério estratégico.",
    readTime: "4 min de leitura",
    readingTime: "4 min de leitura",
    date: "Jun 18, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Assessoria de Marketing",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico",
    relatedObjection: "Quando a marca quer novidade sem perder coerencia.",
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
    relatedInsights: ["novos-influenciadores", "consumidores-conscientes"]
  },
  {
    id: "como-anunciar-no-google",
    slug: "como-anunciar-no-google",
    title: "Anunciar no Google: onde cada rede cumpre um papel",
    excerpt: "Pesquisa, display, YouTube, Gmail e Shopping servem funções diferentes. A escolha certa depende da intenção.",
    content: `Nem todo anúncio no Google faz a mesma coisa.

A rede certa depende da intenção do negócio. Pesquisa captura demanda ativa, display amplia presença, YouTube sustenta consideração, Gmail pode apoiar contato e Shopping ajuda a expor produtos quando há oferta compatível.

### Como pensar
- intenção primeiro;
- rede depois;
- criativo por função;
- métrica coerente com o objetivo.

Quando a ordem está clara, a mídia deixa de ser catálogo de formatos e vira decisão comercial.`,
    category: "Performance",
    serviceTitle: "Assessoria de Marketing",
    servicePath: "/servicos/assessoria-marketing-digital-estrategico",
    serviceNote: "A rede certa depende da função que a campanha precisa cumprir.",
    readTime: "5 min de leitura",
    readingTime: "5 min de leitura",
    date: "Jun 19, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Assessoria de Marketing",
    relatedServicePath: "/servicos/assessoria-marketing-digital-estrategico",
    relatedObjection: "Quando a equipe quer anunciar sem escolher o papel de cada rede.",
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
    relatedInsights: ["gerar-leads-google-ads", "youtube-para-consideracao"]
  },
  {
    id: "boas-praticas-manutencao-site",
    slug: "boas-praticas-manutencao-site",
    title: "Boas práticas de manutenção para seu site",
    excerpt: "Site bom também precisa de rotina: atualização, segurança, performance e revisão de links.",
    content: `Manutenção não é detalhe pós-lançamento.

Um site sem revisão envelhece rápido. Links quebram, páginas ficam desatualizadas e a percepção de cuidado cai. A manutenção protege a experiência e a confiança.

### Rotina mínima
- revisar páginas e links;
- checar formulários e integrações;
- atualizar conteúdo e acessos;
- observar velocidade e segurança.

Quando a manutenção vira disciplina, o site continua útil depois da entrega.`,
    category: "Web",
    serviceTitle: "Hospedagem e Manutenção",
    servicePath: "/hospedagem-manutencao-sites",
    serviceNote: "Manutenção preserva o valor do site depois da publicação.",
    readTime: "4 min de leitura",
    readingTime: "4 min de leitura",
    date: "Jun 20, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Hospedagem e Manutenção",
    relatedServicePath: "/hospedagem-manutencao-sites",
    relatedObjection: "Quando o site já existe, mas ninguém está cuidando dele de verdade.",
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
      {
        question: "Manutenção é só para site WordPress?",
        answer: "Não. Todo site precisa de rotina de cuidado, independentemente da tecnologia."
      }
    ],
    relatedInsights: ["negocios-ao-universo-online", "ferramentas-gratuitas-expansao"]
  },
  {
    id: "facebook-vender-mais",
    slug: "facebook-vender-mais",
    title: "Facebook pode vender mais quando a marca usa a plataforma com intenção",
    excerpt: "A rede funciona melhor quando a conversa comercial é clara e o tráfego sabe para onde ir.",
    content: `Facebook ainda pode ser útil quando cumpre um papel claro.

A plataforma deixa de ser apenas postagem e passa a apoiar tráfego, relacionamento e resposta comercial quando a marca sabe para onde quer levar o público.

### O que ajuda
- mensagem direta;
- segmentação coerente;
- apoio do WhatsApp ou landing page;
- consistência entre anúncio e oferta.

Venda não vem da plataforma sozinha. Vem da intenção correta usando a plataforma certa.`,
    category: "Performance",
    serviceTitle: "Gestão de Redes Sociais",
    servicePath: "/servicos/gestao-de-redes-sociais",
    serviceNote: "Facebook pode apoiar venda, desde que a intenção esteja clara.",
    readTime: "4 min de leitura",
    readingTime: "4 min de leitura",
    date: "Jun 21, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Gestão de Redes Sociais",
    relatedServicePath: "/servicos/gestao-de-redes-sociais",
    relatedObjection: "Quando a rede social precisa ajudar o comercial sem virar promessa vazia.",
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
    relatedInsights: ["novos-influenciadores", "como-anunciar-no-google"]
  },
  {
    id: "automacao-marketing-vendas",
    slug: "automacao-marketing-vendas",
    title: "Automação de marketing aumenta vendas quando há método",
    excerpt: "Automatizar sem regra só acelera erro. Com processo, automação vira apoio real ao comercial.",
    content: `Automação não substitui método.

Ela melhora o que já está claro. Quando a empresa organiza entrada, segmentação e resposta, a automação começa a liberar tempo e consistência para o time.

### O que observar
- jornada definida;
- mensagens coerentes;
- gatilhos bem escolhidos;
- revisão contínua do fluxo.

Automação boa não parece mágica. Parece operação bem desenhada.`,
    category: "Processos",
    serviceTitle: "Process Intelligence",
    servicePath: "/servicos/process-intelligence",
    serviceNote: "Automação só escala o que já foi organizado.",
    readTime: "5 min de leitura",
    readingTime: "5 min de leitura",
    date: "Jun 22, 2026",
    author: "Equipe Editorial TAG08",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
    relatedServiceTitle: "Process Intelligence",
    relatedServicePath: "/servicos/process-intelligence",
    relatedObjection: "Quando a equipe quer automatizar sem revisar a lógica do processo.",
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
    relatedInsights: ["ferramentas-gratuitas-expansao", "transformacao-digital-erros"]
  }
];

