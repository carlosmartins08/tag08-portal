import { useState } from "react";
import ResilientImage from "../../../components/ResilientImage";
import { BookOpen, ShieldAlert, ArrowUpRight, CheckSquare, Zap, Target, RefreshCw, BarChart2, ArrowRight, MessageSquare, Workflow } from "../../../components/DooIcons";
import { useReducedMotion } from "motion/react";
import { buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl } from "../../../config/siteNetwork";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import TrackedOutboundLink from "../../../components/TrackedOutboundLink";
import { ACTIVATION_LEVELS, ACTIVATION_ROADMAPS, type ActivationLevel } from "../../../lib/simulators/processActivation";
import { useSimulatorTracking } from "../../../lib/useSimulatorTracking";
import type { RouteLocale } from "../../../config/routeRegistry";

interface ActivationProps {
  onNavigate: (page: string) => void;
  locale?: RouteLocale;
}

const PROCESS_ACTIVATION_COPY = {
  "Process Activation": { en: "Process Activation", es: "Process Activation" },
  "DIVISÃO DE SUSTENTAÇÃO OPERACIONAL // TAG08": { en: "OPERATIONAL CONTINUITY DIVISION // TAG08", es: "DIVISIÓN DE CONTINUIDAD OPERATIVA // TAG08" },
  "para transformar processos estruturados em execução real.": { en: "turning structured processes into real-world execution.", es: "para convertir procesos estructurados en ejecución real." },
  "De que adiantam manuais perfeitos documentados em PDFs ou wikis se o seu time os ignora na vida real? O Process Activation ensina com workshops práticos, ativa as wikis diretamente nas tarefas diárias e audita com relatórios para sustentar a nova conduta de crescimento corporativo.": { en: "What good are perfectly documented PDF manuals or wikis if your team ignores them in practice? Process Activation uses practical workshops, brings the wikis into daily tasks, and audits implementation through reports to help sustain new operating practices.", es: "¿De qué sirven manuales perfectos documentados en PDF o wikis si el equipo los ignora en la práctica? Process Activation trabaja con talleres prácticos, incorpora las wikis a las tareas diarias y audita su aplicación mediante informes para ayudar a sostener nuevas prácticas operativas." },
  "Habilitação Operacional e Aprendizado Aplicado TAG08": { en: "Operational enablement and applied learning at TAG08", es: "Habilitación operativa y aprendizaje aplicado de TAG08" },
  "Process Activation // TAG08": { en: "Process Activation // TAG08", es: "Process Activation // TAG08" },
  "Falar com a TAG08 sobre ativação": { en: "Talk to TAG08 about process activation", es: "Hablar con TAG08 sobre la activación de procesos" },
  "ATIVAR NOVA ROTINA": { en: "ACTIVATE A NEW ROUTINE", es: "ACTIVAR UNA NUEVA RUTINA" },
  "TAG08 OPERATIONAL ACTIVATOR": { en: "TAG08 OPERATIONAL ACTIVATION", es: "ACTIVACIÓN OPERATIVA TAG08" },
  "Cultura de Adesão e Sustentabilidade de Rotinas": { en: "A culture of adoption and sustained routines", es: "Cultura de adopción y continuidad de rutinas" },
  "PROC_ACTIVATION // ENABLED": { en: "PROC_ACTIVATION // ENABLED", es: "PROC_ACTIVATION // ENABLED" },
  "Importante: Condição Essencial de Contratação": { en: "Important: essential engagement requirement", es: "Importante: requisito esencial para contratar" },
  "é expressamente condicionado à contratação e conclusão prévia do": { en: "is expressly conditional on the prior engagement and completion of", es: "está expresamente condicionado a la contratación y finalización previa de" },
  "Process Intelligence": { en: "Process Intelligence", es: "Process Intelligence" },
  ". Ele não atua criando manuais do absoluto zero ou substituindo o mapeamento técnico. Sua função é implantar, de forma prática e supervisionada, as wikis e playbooks já construídos na primeira fase de assessoria técnica.": { en: ". It does not create manuals from scratch or replace technical process mapping. Its role is to implement, in a practical and supervised way, the wikis and playbooks already developed during the first technical consulting phase.", es: ". No crea manuales desde cero ni sustituye el mapeo técnico de procesos. Su función es implementar, de forma práctica y supervisada, las wikis y playbooks ya desarrollados en la primera fase de consultoría técnica." },
  "Disciplina aplicada sustenta a operação": { en: "Applied discipline supports operations", es: "La disciplina aplicada sostiene la operación" },
  "Sessões": { en: "Sessions", es: "Sesiones" },
  "Treinamentos e alinhamentos coordenados": { en: "Coordinated training and alignment", es: "Capacitaciones y alineación coordinadas" },
  "Auditoria": { en: "Auditing", es: "Auditoría" },
  "Acompanhamento e revisão de conduta": { en: "Ongoing monitoring and practice reviews", es: "Seguimiento y revisión de prácticas" },
  "30 Dias": { en: "30 days", es: "30 días" },
  "Supervisão técnica durante a ativação": { en: "Technical supervision during activation", es: "Supervisión técnica durante la activación" },
  "FRICÇÃO PÓS-ESTRUTURAÇÃO": { en: "FRICTION AFTER PROCESS DESIGN", es: "FRICCIÓN TRAS DISEÑAR LOS PROCESOS" },
  "POR QUE PROCESSOS REAIS DE": { en: "WHY DO WELL-DESIGNED", es: "¿POR QUÉ LOS PROCESOS" },
  "QUALIDADE FALHAM?": { en: "PROCESSES STILL FAIL?", es: "BIEN DISEÑADOS FALLAN?" },
  "Escrever um manual operacional limpo a 30% do esforço; a rotina tática de adoção do time responde pelos outros 70%.": { en: "Writing a clear operating manual accounts for 30% of the effort; the team's day-to-day adoption work accounts for the other 70%.", es: "Redactar un manual operativo claro representa el 30 % del esfuerzo; la adopción diaria por parte del equipo representa el otro 70 %." },
  "01 // MANUAIS ESQUECIDOS": { en: "01 // FORGOTTEN MANUALS", es: "01 // MANUALES OLVIDADOS" },
  "O PDF perfeito foi ignorado pelo time": { en: "The perfect PDF was ignored by the team", es: "El equipo ignoró el PDF perfecto" },
  "Seus manuais estão perfeitos em documentos compartilhados no Google Drive, mas a equipe os ignora no cotidiano e repete as velhas metodologias do improviso. Supere essa inércia.": { en: "Your manuals may be neatly stored in shared Google Drive documents, yet the team ignores them in daily work and falls back on improvisation. Help the new practices take hold.", es: "Tus manuales pueden estar bien organizados en documentos compartidos de Google Drive, pero el equipo los ignora en el trabajo diario y vuelve a improvisar. Ayuda a consolidar las nuevas prácticas." },
  "02 // INDISCIPLINA DE ROTINAS ANTIGAS": { en: "02 // OLD ROUTINES PERSIST", es: "02 // PERSISTEN LAS RUTINAS ANTIGUAS" },
  "Fricção de adesão de colaboradores": { en: "Barriers to team adoption", es: "Dificultades para la adopción del equipo" },
  "Membros mais antigos do time sentem extrema dificuldade em preencher relatórios, centralizar conversas e usar a nova wiki corporativa. Atuamos com paciência técnico-metodológica.": { en: "Some team members may find it difficult to complete reports, centralize conversations, or use a new company wiki. We work through these changes with a structured, patient approach.", es: "Algunas personas del equipo pueden tener dificultades para completar informes, centralizar conversaciones o usar una nueva wiki corporativa. Acompañamos estos cambios con un enfoque estructurado y paciente." },
  "03 // FALTA DE TEMPO DA GESTÃO DE TOPO": { en: "03 // LIMITED LEADERSHIP CAPACITY", es: "03 // POCO TIEMPO DE LA DIRECCIÓN" },
  "Fundadores exaustos de fiscalizar o fluxo": { en: "Founders tired of monitoring every workflow", es: "Fundadores cansados de supervisar cada flujo" },
  "Sua diretoria de sócios não possui disponibilidade semanal para cobrar a conduta das regras dos setores na ponta do cronograma. Nós assumimos essa responsabilidade tática.": { en: "Your leadership team may not have the weekly capacity to follow up on how each department applies its procedures. TAG08 can take on the agreed operational monitoring role.", es: "Es posible que la dirección no tenga tiempo cada semana para dar seguimiento a cómo cada área aplica sus procedimientos. TAG08 puede asumir el seguimiento operativo acordado." },
  "04 // EVAPORAÇÃO SILENCIOSA DO MÉTODO": { en: "04 // PRACTICES GRADUALLY FADE", es: "04 // LAS PRÁCTICAS SE DILUYEN" },
  "A nova cultura evapora gradualmente": { en: "New practices can gradually fade", es: "Las nuevas prácticas pueden perder fuerza" },
  "A euforia das primeiras duas semanas de playbooks passa, e o time lentamente retorna ao caos e às conversas sem rumo por falta de fiscalização séria recorrente. Proteja seu investimento.": { en: "After the initial enthusiasm around new playbooks fades, teams can drift back to old habits without consistent follow-up. Ongoing review helps keep the agreed practices visible.", es: "Cuando pasa el entusiasmo inicial por los playbooks, el equipo puede volver a sus hábitos anteriores si falta seguimiento constante. La revisión periódica ayuda a mantener visibles las prácticas acordadas." },
  "PILARES DE ATIVAÇÃO PRÁTICA SÊNIOR": { en: "PRACTICAL ACTIVATION PILLARS", es: "PILARES DE ACTIVACIÓN PRÁCTICA" },
  "COMO NOSSA ATIVAÇÃO CONDUZ SEU TIME": { en: "HOW ACTIVATION SUPPORTS YOUR TEAM", es: "CÓMO LA ACTIVACIÓN ACOMPAÑA A TU EQUIPO" },
  "Agimos como um vetor ativo de disciplina. Treinamos, testamos na rotina prática e cobramos a consolidação da nova rotina com foco na autonomia plena.": { en: "We act as an active driver of discipline. We train, test routines in day-to-day work, and follow up on the consolidation of new routines with a focus on full autonomy.", es: "Actuamos como impulsores activos de disciplina. Capacitamos, probamos las rutinas en el trabajo diario y damos seguimiento a su consolidación con foco en la autonomía plena." },
  "Implantação Imediata": { en: "Practical implementation", es: "Implementación práctica" },
  "Organizamos ritos práticos de introdução por meio de checklists dinâmicos no dia a dia do colaborador, vinculando as wikis aos cards de tarefas reais de forma rápida.": { en: "We introduce practical routines through dynamic checklists in employees' daily work, linking the wikis to real task cards.", es: "Introducimos rutinas prácticas mediante listas dinámicas en el trabajo diario, vinculando las wikis con tareas reales." },
  "Workshops Dedicados": { en: "Focused workshops", es: "Talleres específicos" },
  "Workshops interativos em vídeo com o time focado no uso das ferramentas, gravação de dúvidas conceituais das wikis, e preenchimento de métricas comerciais de rotina operacional.": { en: "Interactive video workshops help the team use its tools, clarify questions about the wikis, and work with operational and commercial routine metrics.", es: "Los talleres interactivos en video ayudan al equipo a usar sus herramientas, resolver dudas sobre las wikis y trabajar con métricas operativas y comerciales." },
  "Auditoria Recorrente": { en: "Ongoing review", es: "Revisión periódica" },
  "Analises de adesão periódicas no cronograma das wikis. Destacómos condutas exemplares e auxiliamos os colaboradores com dificuldades técnicas no funil operacional da empresa.": { en: "We periodically review adoption against the wiki schedule, recognize effective practices, and help employees facing technical difficulties in the company's workflows.", es: "Revisamos periódicamente la adopción según el calendario de las wikis, reconocemos las buenas prácticas y ayudamos a quienes encuentran dificultades técnicas en los procesos de la empresa." },
  "Ajustes Incrementais": { en: "Incremental adjustments", es: "Ajustes incrementales" },
  "A rotina prática esbarra em atritos inevitáveis. Customizamos e polimos as regras e os playbooks de forma orgânica de acordo com o crescimento real das suas divisões táticas.": { en: "Day-to-day work can reveal friction. We refine rules and playbooks as the company's operational needs evolve.", es: "El trabajo diario puede revelar dificultades. Ajustamos las reglas y los playbooks a medida que evolucionan las necesidades operativas de la empresa." },
  "DESVOLVIMENTO DA MAIOR DISCIPLINA": { en: "BUILDING CONSISTENT PRACTICES", es: "CONSOLIDAR PRÁCTICAS" },
  "BENEFÍCIOS DA GOVERNANÇA ATIVA": { en: "BENEFITS OF ACTIVE GOVERNANCE", es: "BENEFICIOS DE LA GESTIÓN ACTIVA" },
  "Garanta que sua empresa funcione de forma automatizada sob padrões estruturados de excelência, sem depender do monitoramento microgerenciado dos sócios.": { en: "Ensure your company operates in an automated way under structured standards of excellence, without depending on owners to micromanage and monitor it.", es: "Garantiza que tu empresa funcione de forma automatizada bajo estándares estructurados de excelencia, sin depender de la supervisión microgestionada de los socios." },
  "Aprendizado Prático": { en: "Applied learning", es: "Aprendizaje práctico" },
  "O time aprende engajado em sessões assistidas rápidas diretamente nas rotinas de tarefas da empresa.": { en: "The team learns through short guided sessions embedded in the company's task routines.", es: "El equipo aprende mediante sesiones breves y guiadas integradas en sus tareas habituales." },
  "Precedência e Ordem": { en: "Clear priorities", es: "Prioridades claras" },
  "Estruturação de prazos claros e unificados, com checklists transparentes e acessíveis a toda a equipe.": { en: "Clear, consistent deadlines supported by checklists that the whole team can access.", es: "Plazos claros y coherentes, con listas de verificación accesibles para todo el equipo." },
  "Sustentabilidade Core": { en: "Sustained practices", es: "Continuidad operativa" },
  "Garantimos a fiscalização contínua das regras táticas sem gastar o cronograma pessoal semanal dos fundadores.": { en: "We ensure continuous monitoring of tactical rules without consuming the founders’ weekly personal schedules.", es: "Garantizamos la supervisión continua de las reglas tácticas sin consumir la agenda semanal personal de los fundadores." },
  "Cultura de Autonomia": { en: "A culture of autonomy", es: "Cultura de autonomía" },
  "Os manuais permanecem vivos, sofrendo polimentos constantes táticos para guiar novos crescimentos futuros.": { en: "Manuals stay active and receive ongoing tactical refinements to guide future growth.", es: "Los manuales siguen vigentes y reciben ajustes tácticos constantes para orientar el crecimiento futuro." },
  "O FIM DA CENTRALIZAÇÃO DESESPERADA": { en: "LESS DEPENDENCE ON THE FOUNDER", es: "MENOS DEPENDENCIA DEL FUNDADOR" },
  "O Process Activation cria uma cultura operacional de autonomia. O time passa a conduzir com mais clareza as atividades de venda, suporte e faturamento mesmo na ausência do fundador.": { en: "Process Activation supports a more autonomous operating culture, helping the team handle sales, support, and billing activities with greater clarity when the founder is unavailable.", es: "Process Activation promueve una cultura operativa más autónoma y ayuda al equipo a gestionar ventas, soporte y facturación con mayor claridad cuando el fundador no está disponible." },
  "PROCESS ACTIVATION // TAG08": { en: "PROCESS ACTIVATION // TAG08", es: "PROCESS ACTIVATION // TAG08" },
  "METODOLOGIA ATIVA // ROADMAP DE EXECUÇÃO": { en: "ACTIVE METHODOLOGY // IMPLEMENTATION ROADMAP", es: "METODOLOGÍA ACTIVA // PLAN DE IMPLEMENTACIÓN" },
  "Simulador de Maturidade Operacional e Cronograma": { en: "Operational maturity and timeline simulator", es: "Simulador de madurez operativa y cronograma" },
  "O sucesso de uma automação corporativa não depende do software, mas da adesão do time. Identifique abaixo o nível de maturidade atual da sua operação e visualize o plano de cronograma exato para ativação e integração de playbooks.": { en: "Automation depends on how people adopt the process, not on software alone. Select your operation's current maturity level to view an illustrative activation roadmap for integrating playbooks.", es: "La automatización depende de la adopción de los procesos por parte del equipo, no solo del software. Selecciona el nivel actual de madurez operativa para consultar un plan ilustrativo de activación e integración de playbooks." },
  "Nível de Maturidade Atual:": { en: "Current maturity level:", es: "Nivel actual de madurez:" },
  "Metodologia Hands-on TAG08": { en: "TAG08 hands-on approach", es: "Enfoque práctico de TAG08" },
  "Nossa equipe não entrega apenas manuais estáticos em PDF que ninguém lê. Nós conduzimos as sessões, gravamos treinamentos curtos, estruturamos ferramentas e auditamos a execução por 30 dias para garantir adoção real de 100% do time.": { en: "Our team does not only deliver static PDF manuals that nobody reads. We lead sessions, record short training materials, structure tools, and audit implementation for 30 days to ensure actual adoption by 100% of the team.", es: "Nuestro equipo no entrega únicamente manuales estáticos en PDF que nadie lee. Conducimos sesiones, grabamos capacitaciones breves, estructuramos herramientas y auditamos la ejecución durante 30 días para garantizar la adopción real del 100 % del equipo." },
  "Plano de Cronograma e Entregas de Ativação:": { en: "Activation timeline and deliverables:", es: "Cronograma y entregables de activación:" },
  "PROCESSO REGULADO SOB CONFORMIDADE OPERACIONAL ISO 9001 // 2026": { en: "PROCESS GOVERNANCE UNDER ISO 9001 OPERATIONAL COMPLIANCE // 2026", es: "PROCESO REGULADO BAJO CONFORMIDAD OPERATIVA ISO 9001 // 2026" },
  "Cronometrar Minha Ativação": { en: "Discuss my activation timeline", es: "Consultar mi cronograma de activación" },
  "Especialista em ativação": { en: "Process activation specialist", es: "Especialista en activación de procesos" },
  "TAG08 Activation Specialist": { en: "TAG08 process activation specialist", es: "Especialista en activación de procesos de TAG08" },
  "OPERATIONAL CORE": { en: "OPERATIONAL CORE", es: "NÚCLEO OPERATIVO" },
  "sustentação_rota_": { en: "operational_continuity_", es: "continuidad_operativa_" },
  "LATENCY: 12MS": { en: "LATENCY: 12MS", es: "LATENCIA: 12MS" },
  "SÊNIOR SECURITY": { en: "SENIOR SECURITY", es: "SEGURIDAD SENIOR" },
  "CONFIRA NOSSO SISTEMA DE TRABALHO": { en: "SEE HOW WE WORK", es: "CONOCE CÓMO TRABAJAMOS" },
  "ATIVAMOS SISTEMAS": { en: "WE ACTIVATE SYSTEMS", es: "ACTIVAMOS SISTEMAS" },
  "E SUSTENTAMOS REGRAS!": { en: "AND SUSTAIN PRACTICES!", es: "Y SOSTENEMOS LAS PRÁCTICAS" },
  "INTEGRAMOS WORKSHOPS PRÁTICOS PARALELOS, CRIAMOS ROTINAS COM CHECKLISTS DIÁRIAS DIRETAS NO PAINEL E AUDITAMOS CONTINUAMENTE A ADESÃO DA SUA EQUIPE PARA GERAR AUTONOMIA REAL DAS OPERAÇÕES.": { en: "WE RUN PRACTICAL WORKSHOPS, BUILD DAILY CHECKLISTS INTO YOUR WORKFLOWS, AND REVIEW TEAM ADOPTION TO SUPPORT GREATER OPERATIONAL AUTONOMY.", es: "REALIZAMOS TALLERES PRÁCTICOS, INCORPORAMOS LISTAS DIARIAS A LOS FLUJOS DE TRABAJO Y REVISAMOS LA ADOPCIÓN DEL EQUIPO PARA FAVORECER UNA MAYOR AUTONOMÍA OPERATIVA." },
  "GOVERNANÇA ATIVA": { en: "ACTIVE GOVERNANCE", es: "GESTIÓN ACTIVA" },
  "Evite manuais de processo engavetados. Sustentamos as regras de trabalho para que o time opere de forma autanoma sem supervisão.": { en: "Keep process manuals connected to daily work. We help sustain agreed practices so the team can work with greater autonomy.", es: "Vincula los manuales de procesos con el trabajo diario. Ayudamos a mantener las prácticas acordadas para que el equipo trabaje con mayor autonomía." },
  "Solicitar diagnóstico de Process Activation": { en: "Request a Process Activation assessment", es: "Solicitar un diagnóstico de Process Activation" },
  "BR": { en: "BR", es: "BR" },
  "PROPRIETÁRIO DIRETO (WhatsApp)": { en: "DIRECT CONTACT (WhatsApp)", es: "CONTACTO DIRECTO (WhatsApp)" },
  "CONECTAR": { en: "CONNECT", es: "CONTACTAR" },
  "Request Process Activation consulting": { en: "Request Process Activation consulting", es: "Solicitar consultoría de Process Activation" },
  "INT": { en: "INT", es: "INT" },
  "INTERNATIONAL DIRECT (WhatsApp)": { en: "INTERNATIONAL CONTACT (WhatsApp)", es: "CONTACTO INTERNACIONAL (WhatsApp)" },
  "AGÊNCIA TAG08": { en: "TAG08 AGENCY", es: "AGENCIA TAG08" },
  "OPERação ATIVA 100% online": { en: "OPERATING 100% ONLINE", es: "OPERACIÓN 100 % EN LÍNEA" },
  "ALINHAMENTO DE ENTRADA // EXIGÊNCIAS PRÉVIAS": { en: "STARTING POINT // PREREQUISITES", es: "PUNTO DE PARTIDA // REQUISITOS PREVIOS" },
  "Sua empresa está pronta para a Ativação de Processos?": { en: "Is your company ready for Process Activation?", es: "¿Tu empresa está preparada para Process Activation?" },
  "A divisão de Activation é extremamente realizadora e tática, mas exige que sua empresa preencha critérios de entrada mínimos. Sem eles, qualquer esforço de implantação de auditoria será inofensivo:": { en: "Process Activation is practical and tactical, but it depends on a few prerequisites. Without them, implementation and auditing efforts may not be effective:", es: "Process Activation es práctico y táctico, pero depende de algunos requisitos previos. Sin ellos, la implementación y las auditorías pueden no ser efectivas:" },
  "Processos Mapeados": { en: "Mapped processes", es: "Procesos mapeados" },
  "Sua marca precisa ter manuais, playbooks ou fluxos de trabalho previamente consolidados (caso não possua, indicamos nossa divisão Process Intelligence).": { en: "Your company should already have documented manuals, playbooks, or workflows. If not, Process Intelligence may be the appropriate first step.", es: "La empresa debe contar con manuales, playbooks o flujos de trabajo documentados. Si aún no los tiene, Process Intelligence puede ser el primer paso adecuado." },
  "Liderança Comprometida": { en: "Committed leadership", es: "Liderazgo comprometido" },
  "Os diretores e fundadores precisam dar respaldo absoluto de autoridade aos nossos auditores para cobrar a equipe.": { en: "Directors and founders need to give the agreed operational leads authority to follow up with the team.", es: "La dirección y los fundadores deben otorgar a los responsables operativos acordados la autoridad necesaria para dar seguimiento al equipo." },
  "LIMITES DE ESCOPO // ATUAÇÃO PROFISSIONAL": { en: "SCOPE // PROFESSIONAL RESPONSIBILITIES", es: "ALCANCE // RESPONSABILIDADES PROFESIONALES" },
  "O que não está incluído na Ativação de Processos": { en: "What Process Activation does not include", es: "Qué no incluye Process Activation" },
  "Nós auditamos, implantamos e cobramos conformidade técnica com afinco, mas não assumimos atribuições internas que pertencem pura e exclusivamente à sua diretoria:": { en: "We audit implementation and follow up on agreed technical practices, but we do not take over responsibilities that belong to your company's leadership:", es: "Auditamos la implementación y damos seguimiento a las prácticas técnicas acordadas, pero no asumimos responsabilidades que corresponden a la dirección de tu empresa:" },
  "Não Somos RH do Cliente": { en: "We are not your HR department", es: "No somos el área de RR. HH. del cliente" },
  "Nós reportamos o não cumprimento de processos e erros operacionais, mas demissões, contratações e advertências legais cabem ao seu RH.": { en: "We report process non-compliance and operational issues; hiring, dismissals, and formal disciplinary actions remain the responsibility of your HR team.", es: "Informamos incumplimientos y problemas operativos; las contrataciones, los despidos y las medidas disciplinarias formales corresponden al área de RR. HH. del cliente." },
  "Não Alteramos Seus Contratos": { en: "We do not change your contracts", es: "No modificamos tus contratos" },
  "Não fazemos alterações legais em obrigações de trabalho de colaboradores ou fornecedores externos sem sua expressa validação.": { en: "We do not make legal changes to employees' or external suppliers' work obligations without your explicit approval.", es: "No modificamos legalmente las obligaciones laborales de empleados o proveedores externos sin tu aprobación expresa." },
  "Não Somos Gerentes Permanentes": { en: "We are not permanent managers", es: "No somos gestores permanentes" },
  "Nossa divisão opera para implantar autonomia. Treinamos seus líderes internos para que eles assumam a sustentação permanente.": { en: "Our work is designed to support autonomy. We train your internal leaders to sustain the practices over time.", es: "Nuestro trabajo busca promover la autonomía. Capacitamos a tus líderes internos para que mantengan las prácticas a largo plazo." },
  "Não Gerenciamos Suas Finanças": { en: "We do not manage your finances", es: "No gestionamos tus finanzas" },
  "Efetuamos auditoria operacional na prestação de contas, mas transferências bancárias e decisões de tesouraria continuam com você.": { en: "We can review operational accountability, but bank transfers and treasury decisions remain your responsibility.", es: "Podemos revisar la rendición de cuentas operativa, pero las transferencias bancarias y las decisiones de tesorería siguen siendo responsabilidad del cliente." },
  "SISTEMA SEMANAL DE CRITÉRIOS": { en: "WEEKLY REVIEW CYCLE", es: "CICLO DE REVISIÓN SEMANAL" },
  "O funcionamento prático do nosso Ciclo Mensal e Semanal": { en: "How our weekly and monthly review cycle works", es: "Cómo funciona nuestro ciclo de revisión semanal y mensual" },
  "A adesão aos manuais do seu negócio ocorre por insistência e constância analítica. Nosso time executa um cronograma estável e repetitivo nos bastidores:": { en: "Adopting your operating manuals takes consistency and review. Our team follows a recurring schedule behind the scenes:", es: "Adoptar los manuales operativos requiere constancia y seguimiento. Nuestro equipo trabaja con un calendario recurrente:" },
  "1. Monitoramento Ativo": { en: "1. Active monitoring", es: "1. Seguimiento activo" },
  "Nossos auditores extraem diariamente relatórios de sistemas (Notion, Trello, CRM, etc.) para verificar conformidade tática.": { en: "Our auditors review reports from systems such as Notion, Trello, or a CRM to check how agreed practices are being applied.", es: "Nuestros auditores revisan informes de sistemas como Notion, Trello o un CRM para comprobar cómo se aplican las prácticas acordadas." },
  "2. Cobrança e Apoio": { en: "2. Follow-up and support", es: "2. Seguimiento y apoyo" },
  "Colaboradores com atraso recebem alertas e suporte rápido para esclarecer possíveis dúvidas sistêmicas.": { en: "Team members who fall behind receive reminders and support to clarify questions about the workflow.", es: "Quienes se retrasan reciben avisos y apoyo para resolver dudas sobre el flujo de trabajo." },
  "3. Briefing de Resultados": { en: "3. Results briefing", es: "3. Revisión de resultados" },
  "Reunião rápida semanal com a diretoria para relatar o cumprimento exato dos indicadores de aderência dos times.": { en: "A short weekly meeting with leadership reviews the team's agreed adoption indicators.", es: "Una breve reunión semanal con la dirección revisa los indicadores acordados de adopción del equipo." },
  "4. Calibragem Mensal": { en: "4. Monthly calibration", es: "4. Ajuste mensual" },
  "Encontros de fim de ciclo para ajustar fluxos que geram ruído estrutural ou gargalos operacionais frequentes.": { en: "End-of-cycle meetings adjust workflows that create recurring structural friction or operational bottlenecks.", es: "Las reuniones de cierre del ciclo ajustan los flujos que generan fricción estructural o cuellos de botella recurrentes." },
  "MATRIZ DE FRONTEIRAS // RESPONSABILIDADE OPERACIONAL": { en: "RESPONSIBILITY MATRIX // OPERATIONAL SCOPE", es: "MATRIZ DE RESPONSABILIDADES // ALCANCE OPERATIVO" },
  "Quem responde por qual entrega?": { en: "Who is responsible for each deliverable?", es: "¿Quién es responsable de cada entrega?" },
  "Operamos integrados, mas as fronteiras de decisão precisam estar desenhadas com absoluta clareza técnica:": { en: "We work together, while keeping decision-making responsibilities clearly defined:", es: "Trabajamos de forma coordinada y mantenemos claras las responsabilidades de decisión:" },
  "Esfera de Atuação TAG08": { en: "TAG08 responsibilities", es: "Responsabilidades de TAG08" },
  "Esfera de Atuação do Cliente": { en: "Client responsibilities", es: "Responsabilidades del cliente" },
  "Auditoria contínua de adesão aos manuais operacionais cadastrados.": { en: "Ongoing review of adoption of the documented operating manuals.", es: "Revisión continua de la adopción de los manuales operativos documentados." },
  "Atendimento ou execução direta das tarefas operacionais cotidianas.": { en: "Direct service delivery or execution of day-to-day operational tasks.", es: "Atención o ejecución directa de las tareas operativas diarias." },
  "Alertas de atraso e notificações individuais de inconformidade tática.": { en: "Reminders about delays and individual notices of deviations from agreed practices.", es: "Avisos de retrasos y notificaciones individuales sobre desviaciones de las prácticas acordadas." },
  "Sanções oficiais de RH, reuniões de advertência ou demissões.": { en: "Formal HR actions, disciplinary meetings, or dismissals.", es: "Medidas formales de RR. HH., reuniones disciplinarias o despidos." },
  "Criação de sessões explicativas adicionais de sistemas se necessário.": { en: "Additional explanatory sessions about systems, when needed.", es: "Sesiones explicativas adicionales sobre sistemas, cuando sean necesarias." },
  "Disponibilizar tempo dos times para as reuniões de alinhamento.": { en: "Making time available for teams to attend alignment meetings.", es: "Reservar tiempo para que los equipos asistan a las reuniones de alineación." },
  "Garantir notas mensais agregadas de qualidade operacional por área.": { en: "Providing aggregated monthly operational quality reports by area.", es: "Proporcionar informes mensuales agregados de calidad operativa por área." },
  "Definir metas comerciais sêniores e direcionar investimentos do negócio.": { en: "Setting senior-level commercial goals and directing business investments.", es: "Definir objetivos comerciales estratégicos y orientar las inversiones del negocio." },
  "[TAG08]": { en: "[TAG08]", es: "[TAG08]" },
  "[CLIENTE]": { en: "[CLIENT]", es: "[CLIENTE]" },
  "CRITÉRIO DE ESCOLHA OPERACIONAL": { en: "WHEN THIS SERVICE MAY FIT", es: "CUÁNDO PUEDE SER ADECUADO" },
  "Quando contratar nossa ativação sênior?": { en: "When should you consider senior process activation?", es: "¿Cuándo considerar la activación de procesos senior?" },
  "Se sua empresa já ultrapassou o faturamento bruto anual de R$ 300k, possui mais de 4 pessoas na operação, mas você sente que, como fundador, continua preso no operacional de microgerenciamento de tarefas básicas e cobranças redundantes todos os dias, a TAG08 Activation é o encaixe operacional perfeito para a libertação estratégica de seu tempo de negócios.": { en: "If your company has exceeded BRL 300,000 in annual gross revenue and has more than four people in operations, but you remain caught up as a founder in micromanaging basic tasks and repetitive daily follow-ups, TAG08 Activation is the ideal operational fit to strategically free up your business time.", es: "Si tu empresa ya superó los 300.000 BRL de ingresos brutos anuales y tiene más de cuatro personas en operaciones, pero sigues atrapado como fundador en la microgestión de tareas básicas y seguimientos diarios repetitivos, TAG08 Activation es el ajuste operativo ideal para liberar estratégicamente tu tiempo de negocio." },
  "ESTRUTURA DE AUDITORIA ATIVA": { en: "ACTIVE REVIEW STRUCTURE", es: "ESTRUCTURA DE REVISIÓN ACTIVA" },
  "Sua equipe precisa de acompanhamento operacional sênior?": { en: "Does your team need senior operational support?", es: "¿Tu equipo necesita acompañamiento operativo senior?" },
  "Fale com nossos engenheiros de processos e agende um diagnóstico sobre a atual taxa de adesão a manuais e playbooks da sua empresa.": { en: "Talk with our process specialists about assessing how your team currently uses its manuals and playbooks.", es: "Habla con nuestros especialistas en procesos para evaluar cómo utiliza tu equipo los manuales y playbooks." },
  "Auditar Adesão de Processos": { en: "Review process adoption", es: "Evaluar la adopción de procesos" },
  "FAQ // ENCONTRE RESPOSTAS": { en: "FAQ // FIND ANSWERS", es: "PREGUNTAS FRECUENTES // RESPUESTAS" },
  "DÚVIDAS &amp;": { en: "QUESTIONS &", es: "DUDAS Y" },
  ".": { en: ".", es: "." },
  "ATIVAÇÃO PRÁTICA": { en: "PRACTICAL ACTIVATION", es: "ACTIVACIÓN PRÁCTICA" },
  "Esclareça as principais dúvidas sobre como a metodologia ativa playbooks na rotina real dos colaboradores.": { en: "Find answers to common questions about bringing playbooks into employees' day-to-day work.", es: "Resuelve dudas frecuentes sobre cómo incorporar playbooks al trabajo diario del equipo." },
  "REQUISITO INTELLIGENCE": { en: "PROCESS INTELLIGENCE REQUIREMENT", es: "REQUISITO DE PROCESS INTELLIGENCE" },
  "ENGANJAMENTO DO TIME": { en: "TEAM PARTICIPATION", es: "PARTICIPACIÓN DEL EQUIPO" },
  "SISTEMAS DE AUDITORIA": { en: "REVIEW PROCESS", es: "PROCESO DE REVISIÓN" },
  "PERÍODO DE SUSTENTAÇÃO": { en: "SUPPORT PERIOD", es: "PERÍODO DE ACOMPAÑAMIENTO" },
  "TAG08 Process Activation": { en: "TAG08 Process Activation", es: "Process Activation de TAG08" },
  "PROPOSTA DE VALOR": { en: "VALUE PROPOSITION", es: "PROPUESTA DE VALOR" },
  "Como agimos de forma organizada?": { en: "How do we organize the work?", es: "¿Cómo organizamos el trabajo?" },
  "Eliminamos o esquecimento operacional e táticas manuais obsoletas. Garantimos sustentação de rotas.": { en: "We eliminate operational oversights and outdated manual tactics. We ensure continuity of workflows.", es: "Eliminamos los olvidos operativos y las tácticas manuales obsoletas. Garantizamos la continuidad de los flujos." },
  "Ver Serviços": { en: "View services", es: "Ver servicios" },
  "FALE COM O DIRETOR": { en: "TALK TO OUR DIRECTOR", es: "HABLA CON NUESTRO DIRECTOR" },
  "Quer desenhar uma estratégia sob medida?": { en: "Would you like to discuss a tailored approach?", es: "¿Quieres conversar sobre un enfoque personalizado?" },
  "Fale diretamente com os tomadores de decisão da TAG08 via WhatsApp para avaliar a viabilidade de alocação de equipe.": { en: "Talk with TAG08 decision-makers on WhatsApp to discuss whether team allocation is feasible.", es: "Habla por WhatsApp con quienes toman decisiones en TAG08 para evaluar la viabilidad de asignar un equipo." },
  "Conversar Agora": { en: "Talk to TAG08", es: "Hablar con TAG08" },
  "Conversar agora": { en: "Talk to TAG08", es: "Hablar con TAG08" },
  "SAIA DA INDISCIPLINA INTELECTUAL": { en: "MOVE FROM DOCUMENTED PROCESSES TO DAILY PRACTICE", es: "LLEVA LOS PROCESOS DOCUMENTADOS A LA PRÁCTICA DIARIA" },
  "E GARANTA A ADOÇÃO PLENA DOS SEUS PROCESSOS.": { en: "AND SUPPORT THEIR ADOPTION ACROSS YOUR TEAM.", es: "Y FAVORECE SU ADOPCIÓN EN TODO EL EQUIPO." },
  "Evite gastar milhares de reais escrevendo wikis de qualidade para deixá-las engavetadas pegando poeira digital. Fale com nosso diretor de sustentação.": { en: "If your team has well-prepared wikis that are not part of its daily work, talk with our operations lead about practical adoption support.", es: "Si tu equipo tiene wikis bien preparadas que no forman parte del trabajo diario, habla con nuestro responsable de operaciones sobre cómo facilitar su adopción." },
  "DISPARAR ATIVAÇÃO DE PROCESSOS DE ELITE": { en: "DISCUSS PROCESS ACTIVATION", es: "CONSULTAR PROCESS ACTIVATION" },
  "Bronze // Operação Caótica": { en: "Bronze // Unstructured operations", es: "Bronce // Operación poco estructurada" },
  "Processos na cabeça das pessoas, planilhas desorganizadas, WhatsApp misturado e fundadores como gargalo diário de dúvidas.": { en: "Processes live in people's heads, spreadsheets are disorganized, WhatsApp conversations are mixed together, and founders are the daily point of escalation.", es: "Los procesos dependen de la memoria del equipo, las hojas de cálculo están desordenadas, se mezclan conversaciones en WhatsApp y los fundadores resuelven dudas a diario." },
  "Prata // Organização Parcial": { en: "Silver // Partially organized", es: "Plata // Organización parcial" },
  "Alguns playbooks escritos, mas desatualizados, e ferramentas com uso inconsistente pela equipe.": { en: "Some playbooks are documented but outdated, and the team uses its tools inconsistently.", es: "Algunos playbooks están documentados, pero desactualizados, y el equipo usa las herramientas de forma inconsistente." },
  "Ouro // Automação Pronta": { en: "Gold // Ready for automation", es: "Oro // Preparada para automatizar" },
  "Integra sistemas em tempo real e certifica que o time execute os fluxos sem atrito.": { en: "Integrates systems in real time and certifies that the team carries out workflows without friction.", es: "Integra sistemas en tiempo real y certifica que el equipo ejecute los flujos sin fricción." },
  "Duração: 4 semanas": { en: "Duration: 4 weeks", es: "Duración: 4 semanas" },
  "Duração: 6 semanas": { en: "Duration: 6 weeks", es: "Duración: 6 semanas" },
  "Duração: 8 semanas": { en: "Duration: 8 weeks", es: "Duración: 8 semanas" },
  "FASE 1": { en: "PHASE 1", es: "FASE 1" }, "FASE 2": { en: "PHASE 2", es: "FASE 2" }, "FASE 3": { en: "PHASE 3", es: "FASE 3" }, "FASE 4": { en: "PHASE 4", es: "FASE 4" },
  "Mapeamento e Diagnóstico Clínico": { en: "Process mapping and assessment", es: "Mapeo y diagnóstico de procesos" },
  "Entrevistas com equipe de holding e comercial, catalogação de gargalos de tempo e desenho do mapa inicial.": { en: "Interviews with the holding company and sales teams, identification of time bottlenecks, and an initial process map.", es: "Entrevistas con los equipos de la holding y comercial, identificación de cuellos de botella y elaboración de un mapa inicial." },
  "Escrita de Playbooks e Criação de Wikis": { en: "Playbook writing and wiki creation", es: "Redacción de playbooks y creación de wikis" },
  "Estruturação das wikis de ferramentas, senhas de equipe, roteiros de onboarding e criação de playbooks visuais no Notion.": { en: "Structuring tool and team-access wikis, onboarding guides, and visual playbooks in Notion.", es: "Estructuración de wikis de herramientas y accesos, guías de incorporación y playbooks visuales en Notion." },
  "Sessões Ativas e Treinamentos Curtos": { en: "Live sessions and short training", es: "Sesiones prácticas y capacitación breve" },
  "Sessões dinâmicas de handoff com toda a equipe, ajustes ao vivo nos sistemas e vídeos curtos explicativos.": { en: "Interactive handoff sessions with the team, live system adjustments, and short explanatory videos.", es: "Sesiones interactivas de traspaso con el equipo, ajustes en vivo de los sistemas y videos explicativos breves." },
  "Auditoria de Disciplina e Adesão": { en: "Practice and adoption review", es: "Revisión de prácticas y adopción" },
  "Auditoria ativa diária para verificar conformidade com planilhas, novos canais e fluxos, ajustando atritos práticos.": { en: "Daily review of agreed practices across spreadsheets, channels, and workflows, with adjustments to practical friction.", es: "Revisión diaria de las prácticas acordadas en hojas de cálculo, canales y flujos, con ajustes ante dificultades prácticas." },
  "Semana 1": { en: "Week 1", es: "Semana 1" }, "Semana 2": { en: "Week 2", es: "Semana 2" }, "Semana 3": { en: "Week 3", es: "Semana 3" }, "Semana 4": { en: "Week 4", es: "Semana 4" },
  "Inventário de Sistemas e Auditoria de Processos": { en: "Systems inventory and process review", es: "Inventario de sistemas y revisión de procesos" },
  "Mapeamento das ferramentas ativas, identificação de dados duplicados e furos de follow-up.": { en: "Mapping active tools and identifying duplicate data and follow-up gaps.", es: "Mapeo de herramientas activas e identificación de datos duplicados y brechas de seguimiento." },
  "Reestruturação e Atualização de Wikis": { en: "Wiki restructuring and updates", es: "Reestructuración y actualización de wikis" },
  "Consolidação de uma wiki central e reformulação de fluxos confusos, com limpeza de checklists antigos.": { en: "Consolidating a central wiki and clarifying workflows while retiring outdated checklists.", es: "Consolidación de una wiki central y simplificación de flujos confusos, con depuración de listas antiguas." },
  "Integração de Alertas e Automação Básica": { en: "Alerts and basic automation", es: "Alertas y automatización básica" },
  "Criação de automações leves de notificação para alertas urgentes de leads abandonados.": { en: "Setting up lightweight notifications for urgent alerts about unattended leads.", es: "Creación de notificaciones sencillas para alertas urgentes sobre oportunidades sin seguimiento." },
  "Simulados Práticos de Ativação": { en: "Practical activation exercises", es: "Ejercicios prácticos de activación" },
  "Treinamento intensivo da equipe comercial sob cenários reais, certificando a adoção das novas regras de CRM.": { en: "Intensive sales-team exercises based on realistic scenarios to support adoption of the new CRM practices.", es: "Ejercicios intensivos para el equipo comercial, basados en situaciones reales, para facilitar la adopción de las nuevas prácticas del CRM." },
  "Semana 1 - 2": { en: "Weeks 1–2", es: "Semanas 1–2" }, "Semana 2 - 3": { en: "Weeks 2–3", es: "Semanas 2–3" }, "Semana 4 - 5": { en: "Weeks 4–5", es: "Semanas 4–5" }, "Semana 6": { en: "Week 6", es: "Semana 6" },
  "Arquitetura de Dados e Blueprint API": { en: "Data architecture and API blueprint", es: "Arquitectura de datos y diseño de API" },
  "Desenho técnico do fluxo de informações entre ERP, CRMs, WhatsApp Cloud API e banco de dados analítico.": { en: "Technical design for information flows between ERP systems, CRMs, WhatsApp Cloud API, and an analytics database.", es: "Diseño técnico de los flujos de información entre ERP, CRM, WhatsApp Cloud API y una base de datos analítica." },
  "Desenvolvimento de Automações Nativas": { en: "Native automation development", es: "Desarrollo de automatizaciones nativas" },
  "Desenvolvimento dos fluxos de integração automática, webhooks e gatilhos de sincronização constante.": { en: "Developing automated integration workflows, webhooks, and ongoing synchronization triggers.", es: "Desarrollo de flujos de integración automática, webhooks y activadores de sincronización continua." },
  "Simulados e Tratamento de Erros": { en: "Exercises and error handling", es: "Simulaciones y gestión de errores" },
  "Testes de estresse, implementação de alertas de erro automáticos e manuais de contingência operacional.": { en: "Stress tests, automated error alerts, and operational contingency guides.", es: "Pruebas de estrés, alertas automáticas de errores y guías de contingencia operativa." },
  "Handoff Técnico e Ativação Operacional": { en: "Technical handoff and operational activation", es: "Traspaso técnico y activación operativa" },
  "Entrega dos fluxogramas, documentação de APIs, painel de monitoramento e treinamento do responsável interno.": { en: "Delivery of flowcharts, API documentation, a monitoring dashboard, and training for the internal owner.", es: "Entrega de diagramas de flujo, documentación de API, panel de seguimiento y capacitación para la persona responsable." },
  "Semana 3 - 5": { en: "Weeks 3–5", es: "Semanas 3–5" },
  "Semana 6 - 7": { en: "Weeks 6–7", es: "Semanas 6–7" }, "Semana 8": { en: "Week 8", es: "Semana 8" }
  ,"Posso contratar o Activation sem o Intelligence?": { en: "Can I hire Activation without Intelligence?", es: "¿Puedo contratar Activation sin Intelligence?" }
  ,"Como vocês engajam a equipe na nova cultura?": { en: "How do you engage the team in the new practices?", es: "¿Cómo involucran al equipo en las nuevas prácticas?" }
  ,"Quem audita o cumprimento dos fluxos?": { en: "Who reviews whether workflows are being followed?", es: "¿Quién revisa el cumplimiento de los flujos?" }
  ,"Qual o período de sustentação supervisionada?": { en: "How long does supervised support last?", es: "¿Cuánto dura el acompañamiento supervisado?" }
  ,"Não. O Process Activation exige a conclusão prévia do Process Intelligence. Não implantamos manuais sem os playbooks e as wikis estarem estruturados e organizados sob nossa aprovação de calibre técnico.": { en: "No. Process Activation requires Process Intelligence to be completed first. We do not implement manuals until the playbooks and wikis have been structured and organized through our technical review.", es: "No. Process Activation requiere completar primero Process Intelligence. No implementamos manuales hasta que los playbooks y las wikis estén estructurados y organizados tras nuestra revisión técnica." }
  ,"Promovemos workshops dinâmicos assistidos voltados ao uso correto das ferramentas, criamos rotinas com checklists visuais de tarefas diárias e conectamos as bases de senhas diretas à mesa de trabalho produtiva de cada colaborador.": { en: "We run guided workshops on using the tools, establish daily routines with visual task checklists, and connect direct password repositories to each employee's workspace.", es: "Realizamos talleres guiados sobre el uso de las herramientas, creamos rutinas con listas visuales de tareas diarias y conectamos las bases de contraseñas con el espacio de trabajo de cada persona." }
  ,"Nossa assessoria sênior realiza vistorias periódicas de conformidade diretamente nos painéis digitais, quantifica a adesão operacional da equipe e auxilia individualmente colaboradores que demonstrem gargalos de ritmo ou aprendizagem.": { en: "Our senior consultants periodically review compliance in digital dashboards, measure team adoption, and provide individual support to team members facing workflow or learning difficulties.", es: "Nuestros consultores senior revisan periódicamente el cumplimiento en paneles digitales, miden la adopción del equipo y apoyan individualmente a quienes enfrentan dificultades con los flujos o el aprendizaje." }
  ,"O programa dura em média até 30 dias de acompanhamento diário ativo, garantindo polimentos finos de playbooks diante de fricções do mundo real e gerando a consolidação final da autonomia do seu negócio.": { en: "The program typically includes up to 30 days of active daily follow-up, refining playbooks in response to real-world friction and supporting the development of greater business autonomy.", es: "El programa suele incluir hasta 30 días de seguimiento diario activo, con ajustes a los playbooks ante dificultades reales y apoyo para consolidar una mayor autonomía operativa." }
} satisfies Record<string, { en: string; es: string }>;

export const getProcessActivationCopy = (source: string, locale: RouteLocale): string => {
  if (locale === "pt") return source;
  const translated = PROCESS_ACTIVATION_COPY[source];
  if (translated) return translated[locale];
  throw new Error(`Missing ${locale} Process Activation copy for: ${source}`);
};

const tx = getProcessActivationCopy;

export default function ProcessActivation({ onNavigate, locale = "pt" }: ActivationProps) {
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeLevel, setActiveLevel] = useState<ActivationLevel>("bronze");
  const prefersReducedMotion = useReducedMotion();
  const trackSimulator = useSimulatorTracking("process_activation_maturity", 1, "/servicos/process-activation");
  const roadmap = ACTIVATION_ROADMAPS[activeLevel];
  const selectedActivationLevel = ACTIVATION_LEVELS.find((level) => level.id === activeLevel);
  const activationArticle = locale === "pt" ? "O" : locale === "en" ? "The" : "El";
  const localizedSelectedLevelName = selectedActivationLevel
    ? tx(selectedActivationLevel.name, locale)
    : activeLevel;
  const localizedRoadmapDuration = tx(roadmap.duration, locale);
  const portugueseSimulatorMessage = `Olá TAG08! Usei o simulador de Process Activation e selecionei o nível ${selectedActivationLevel?.name ?? activeLevel}. O cronograma indicado é ${roadmap.duration}, com ${roadmap.phases.length} fases. Quero conversar sobre o diagnóstico e os próximos passos.`;
  const englishSimulatorMessage = `Hello TAG08! I used the Process Activation simulator and selected the ${localizedSelectedLevelName} level. The indicated roadmap is ${localizedRoadmapDuration}, across ${roadmap.phases.length} phases. I would like to discuss the assessment and next steps.`;
  const spanishSimulatorMessage = `Hola TAG08. Usé el simulador de Process Activation y seleccioné el nivel ${localizedSelectedLevelName}. El plan indicado dura ${localizedRoadmapDuration} e incluye ${roadmap.phases.length} fases. Quisiera conversar sobre el diagnóstico y los próximos pasos.`;
  const finalContactMessage = locale === "pt"
    ? "Olá, gostaria de consultar viabilidade estratégica especializada para minha marca!"
    : locale === "en"
      ? "Hello, I would like to discuss whether specialized process activation is a good fit for my company."
      : "Hola, quisiera conversar sobre si la activación especializada de procesos es adecuada para mi empresa.";
  const finalContactUrl = locale === "pt"
    ? buildBrazilWhatsAppUrl("Olá,%20gostaria%20de%20consultar%20viabilidade%20estratégica%20especializada%2520para%20minha%20marca!")
    : locale === "en"
      ? buildInternationalWhatsAppUrl(finalContactMessage)
      : buildInternationalWhatsAppUrl(finalContactMessage);
  const localizedSimulatorMessage = locale === "pt"
    ? portugueseSimulatorMessage
    : locale === "en" ? englishSimulatorMessage : spanishSimulatorMessage;
  const processActivationBrazilUrl = buildBrazilWhatsAppUrl(localizedSimulatorMessage);
  const processActivationInternationalUrl = buildInternationalWhatsAppUrl(
    locale === "pt" ? `Hello TAG08! I used the Process Activation simulator and selected the ${selectedActivationLevel?.name ?? activeLevel} level. The recommended roadmap is ${roadmap.duration}, across ${roadmap.phases.length} phases. I would like to discuss the assessment and next steps.` : localizedSimulatorMessage
  );
  const primaryActivationUrl = locale === "pt" ? processActivationBrazilUrl : processActivationInternationalUrl;

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pb-20 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-[8%] left-[-15%] w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] bg-brand/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle floating 3D element in the background of user focus */}
      <div aria-hidden="true">
        <Subtle3DCanvas intensity={1.3} className="absolute right-[-8%] top-[5%] w-[480px] h-[480px] opacity-[0.35] mix-blend-screen hidden lg:block" />
      </div>

      {/* SECTION 1 - HERO: THE EDITORIAL SYSTEM (Synchronized Style) */}
      <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          {/* 1. Header Typography block (Ref Style: Expert guidance / tailored solution) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 lg:items-center text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta self-start">
                {tx("DIVISÃO DE SUSTENTAÇÃO OPERACIONAL // TAG08", locale)}</div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter font-display">
                Process Activation{" "}<br />
                <span className="text-brand">{tx("para transformar processos estruturados em execução real.", locale)}</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-sm leading-relaxed font-sans font-medium">
                {tx("De que adiantam manuais perfeitos documentados em PDFs ou wikis se o seu time os ignora na vida real? O Process Activation ensina com workshops práticos, ativa as wikis diretamente nas tarefas diárias e audita com relatórios para sustentar a nova conduta de crescimento corporativo.", locale)}</p>
            </div>
          </div>

          {/* 2. Panoramic Wide Banner Image with capsule neon overlay trigger wrapped in 3D perspective tilt container */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <ResilientImage
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600"
                alt={tx("Habilitação Operacional e Aprendizado Aplicado TAG08", locale)}
                fallbackLabel={tx("Process Activation // TAG08", locale)}
                priority
                sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1280px) calc(100vw - 4rem), 1152px"
                className="w-full h-full object-cover grayscale brightness-50 motion-safe:group-hover:scale-[1.01] transition-transform duration-200 ease-out"
                referrerPolicy="no-referrer"
              />
              {/* Elegant overlay masks */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />

              {/* Glowing neon action button floating inside face banner mimicking "Free Trial" anchor */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{ transform: "translateZ(45px)" }}>
                <TrackedOutboundLink
                  label="Falar com a TAG08 sobre ativação"
                  surface="process-activation-hero-cta"
                  href={primaryActivationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group min-h-11 bg-brand-secondary text-black font-sans font-black text-xs sm:text-xs uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] motion-safe:hover:scale-105 active:scale-[0.98] transition-transform duration-200 border border-brand-secondary hover:bg-brand-dark flex items-center gap-2 cursor-pointer z-20"
                >
                  <span>{tx("ATIVAR NOVA ROTINA", locale)}</span>
                  <ArrowUpRight aria-hidden="true" className="w-4 h-4 stroke-[2.5]" />
                </TrackedOutboundLink>
              </div>

              {/* Absolute indicator tags on corners */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="tag08-meta text-xs text-brand-secondary tracking-widest block uppercase font-bold">{tx("TAG08 OPERATIONAL ACTIVATOR", locale)}</span>
                  <p className="font-display font-black text-white text-xs sm:text-sm tracking-tight leading-none">{tx("Cultura de Adesão e Sustentabilidade de Rotinas", locale)}</p>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-xs text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>{tx("PROC_ACTIVATION // ENABLED", locale)}</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* CRITICAL CONTRACT PREREQUISITE ALERT (Beautifully integrated as an editorial premium notice) */}
          <div className="bg-brand/[0.03] border-2 border-brand/20 p-6 rounded-3xl flex items-start gap-4 text-left max-w-7xl mx-auto shadow-lg">
            <div className="p-3 bg-brand/10 text-brand rounded-2xl shrink-0">
              <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <p className="tag08-meta text-xs text-brand tracking-wider font-black">{tx("Importante: Condição Essencial de Contratação", locale)}</p>
              <p className="text-zinc-300 text-xs sm:text-xs leading-relaxed font-sans font-medium">
                {activationArticle}{" "}<strong>{tx("Process Activation", locale)}</strong> {tx("é expressamente condicionado à contratação e conclusão prévia do", locale)}{" "}<strong>{tx("Process Intelligence", locale)}</strong>{tx(". Ele não atua criando manuais do absoluto zero ou substituindo o mapeamento técnico. Sua função é implantar, de forma prática e supervisionada, as wikis e playbooks já construídos na primeira fase de assessoria técnica.", locale)}</p>
            </div>
          </div>

          {/* 3. High status core statistics row matching screenshot layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">70%</span>
              <span className="block text-zinc-300 tag08-meta text-xs uppercase tracking-widest leading-normal">{tx("Disciplina aplicada sustenta a operação", locale)}</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">{tx("Sessões", locale)}</span>
              <span className="block text-zinc-300 tag08-meta text-xs uppercase tracking-widest leading-normal">{tx("Treinamentos e alinhamentos coordenados", locale)}</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">{tx("Auditoria", locale)}</span>
              <span className="block text-zinc-300 tag08-meta text-xs uppercase tracking-widest leading-normal">{tx("Acompanhamento e revisão de conduta", locale)}</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">{tx("30 Dias", locale)}</span>
              <span className="block text-zinc-300 tag08-meta text-xs uppercase tracking-widest leading-normal">{tx("Supervisão técnica durante a ativação", locale)}</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2 - SEGMENTATION / PARA QUEM a (Desafios comuns) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04] bg-charcoal-900/10 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-4 space-y-4">
            <span className="tag08-meta text-xs text-zinc-300 uppercase tracking-widest block font-bold">{tx("FRICÇÃO PÓS-ESTRUTURAÇÃO", locale)}</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white leading-none tracking-tight">
              {tx("POR QUE PROCESSOS REAIS DE", locale)}{" "}<span className="text-brand">{tx("QUALIDADE FALHAM?", locale)}</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              {tx("Escrever um manual operacional limpo a 30% do esforço; a rotina tática de adoção do time responde pelos outros 70%.", locale)}</p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-200 rounded-3xl space-y-2 transition-colors">
              <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">{tx("01 // MANUAIS ESQUECIDOS", locale)}</span>
              <h3 className="text-white font-display font-black text-sm">{tx("O PDF perfeito foi ignorado pelo time", locale)}</h3>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                {tx("Seus manuais estão perfeitos em documentos compartilhados no Google Drive, mas a equipe os ignora no cotidiano e repete as velhas metodologias do improviso. Supere essa inércia.", locale)}</p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-200 rounded-3xl space-y-2 transition-colors">
              <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">{tx("02 // INDISCIPLINA DE ROTINAS ANTIGAS", locale)}</span>
              <h3 className="text-white font-display font-black text-sm">{tx("Fricção de adesão de colaboradores", locale)}</h3>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                {tx("Membros mais antigos do time sentem extrema dificuldade em preencher relatórios, centralizar conversas e usar a nova wiki corporativa. Atuamos com paciência técnico-metodológica.", locale)}</p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-200 rounded-3xl space-y-2 transition-colors">
              <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">{tx("03 // FALTA DE TEMPO DA GESTÃO DE TOPO", locale)}</span>
              <h3 className="text-white font-display font-black text-sm">{tx("Fundadores exaustos de fiscalizar o fluxo", locale)}</h3>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                {tx("Sua diretoria de sócios não possui disponibilidade semanal para cobrar a conduta das regras dos setores na ponta do cronograma. Nós assumimos essa responsabilidade tática.", locale)}</p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-200 rounded-3xl space-y-2 transition-colors">
              <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">{tx("04 // EVAPORAÇÃO SILENCIOSA DO MÉTODO", locale)}</span>
              <h3 className="text-white font-display font-black text-sm">{tx("A nova cultura evapora gradualmente", locale)}</h3>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                {tx("A euforia das primeiras duas semanas de playbooks passa, e o time lentamente retorna ao caos e às conversas sem rumo por falta de fiscalização séria recorrente. Proteja seu investimento.", locale)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - DELIVERABLES PILARES (The "What" with Clean Features Grid) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-bold">{tx("PILARES DE ATIVAÇÃO PRÁTICA SÊNIOR", locale)}</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">{tx("COMO NOSSA ATIVAÇÃO CONDUZ SEU TIME", locale)}</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              {tx("Agimos como um vetor ativo de disciplina. Treinamos, testamos na rotina prática e cobramos a consolidação da nova rotina com foco na autonomia plena.", locale)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="group rounded-3xl border border-[color:var(--color-text-secondary)] bg-[color:var(--color-text-primary)] p-6 text-[color:var(--color-main)] shadow-[var(--shadow-base)] transition-[border-color,box-shadow,transform] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-[color:var(--color-accent-readable)] motion-safe:hover:shadow-[var(--shadow-emphasis)] motion-reduce:transform-none">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--color-charcoal-700)] bg-[color:var(--color-main)]">
                <Zap className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-sm font-black text-[color:var(--color-main)]">{tx("Implantação Imediata", locale)}</h3>
                <p className="text-xs font-medium leading-relaxed text-[color:var(--color-charcoal-700)] sm:text-xs">
                  {tx("Organizamos ritos práticos de introdução por meio de checklists dinâmicos no dia a dia do colaborador, vinculando as wikis aos cards de tarefas reais de forma rápida.", locale)}</p>
              </div>
            </div>

            <div className="group rounded-3xl border border-[color:var(--color-text-secondary)] bg-[color:var(--color-text-primary)] p-6 text-[color:var(--color-main)] shadow-[var(--shadow-base)] transition-[border-color,box-shadow,transform] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-[color:var(--color-accent-readable)] motion-safe:hover:shadow-[var(--shadow-emphasis)] motion-reduce:transform-none">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--color-charcoal-700)] bg-[color:var(--color-main)]">
                <BookOpen className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-sm font-black text-[color:var(--color-main)]">{tx("Workshops Dedicados", locale)}</h3>
                <p className="text-xs font-medium leading-relaxed text-[color:var(--color-charcoal-700)] sm:text-xs">
                  {tx("Workshops interativos em vídeo com o time focado no uso das ferramentas, gravação de dúvidas conceituais das wikis, e preenchimento de métricas comerciais de rotina operacional.", locale)}</p>
              </div>
            </div>

            <div className="group rounded-3xl border border-[color:var(--color-text-secondary)] bg-[color:var(--color-text-primary)] p-6 text-[color:var(--color-main)] shadow-[var(--shadow-base)] transition-[border-color,box-shadow,transform] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-[color:var(--color-accent-readable)] motion-safe:hover:shadow-[var(--shadow-emphasis)] motion-reduce:transform-none">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--color-charcoal-700)] bg-[color:var(--color-main)]">
                <Target className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-sm font-black text-[color:var(--color-main)]">{tx("Auditoria Recorrente", locale)}</h3>
                <p className="text-xs font-medium leading-relaxed text-[color:var(--color-charcoal-700)] sm:text-xs">
                  {tx("Analises de adesão periódicas no cronograma das wikis. Destacómos condutas exemplares e auxiliamos os colaboradores com dificuldades técnicas no funil operacional da empresa.", locale)}</p>
              </div>
            </div>

            <div className="group rounded-3xl border border-[color:var(--color-text-secondary)] bg-[color:var(--color-text-primary)] p-6 text-[color:var(--color-main)] shadow-[var(--shadow-base)] transition-[border-color,box-shadow,transform] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-[color:var(--color-accent-readable)] motion-safe:hover:shadow-[var(--shadow-emphasis)] motion-reduce:transform-none">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--color-charcoal-700)] bg-[color:var(--color-main)]">
                <RefreshCw className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-sm font-black text-[color:var(--color-main)]">{tx("Ajustes Incrementais", locale)}</h3>
                <p className="text-xs font-medium leading-relaxed text-[color:var(--color-charcoal-700)] sm:text-xs">
                  {tx("A rotina prática esbarra em atritos inevitáveis. Customizamos e polimos as regras e os playbooks de forma orgânica de acordo com o crescimento real das suas divisões táticas.", locale)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - BENEFITS (Why activate) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04] bg-charcoal-900/10 text-left">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-bold">{tx("DESVOLVIMENTO DA MAIOR DISCIPLINA", locale)}</span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">{tx("BENEFÍCIOS DA GOVERNANÇA ATIVA", locale)}</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              {tx("Garanta que sua empresa funcione de forma automatizada sob padrões estruturados de excelência, sem depender do monitoramento microgerenciado dos sócios.", locale)}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-5 bg-zinc-900/40 border border-white/[0.03] rounded-3xl space-y-2">
              <CheckSquare className="w-5 h-5 text-brand" />
              <h3 className="text-white font-display font-black text-sm">{tx("Aprendizado Prático", locale)}</h3>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">{tx("O time aprende engajado em sessões assistidas rápidas diretamente nas rotinas de tarefas da empresa.", locale)}</p>
            </div>
            <div className="p-5 bg-zinc-900/40 border border-white/[0.03] rounded-3xl space-y-2">
              <CheckSquare className="w-5 h-5 text-brand" />
              <h3 className="text-white font-display font-black text-sm">{tx("Precedência e Ordem", locale)}</h3>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">{tx("Estruturação de prazos claros e unificados, com checklists transparentes e acessíveis a toda a equipe.", locale)}</p>
            </div>
            <div className="p-5 bg-zinc-900/40 border border-white/[0.03] rounded-3xl space-y-2">
              <CheckSquare className="w-5 h-5 text-brand" />
              <h3 className="text-white font-display font-black text-sm">{tx("Sustentabilidade Core", locale)}</h3>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">{tx("Garantimos a fiscalização contínua das regras táticas sem gastar o cronograma pessoal semanal dos fundadores.", locale)}</p>
            </div>
            <div className="p-5 bg-zinc-900/40 border border-white/[0.03] rounded-3xl space-y-2">
              <CheckSquare className="w-5 h-5 text-brand" />
              <h3 className="text-white font-display font-black text-sm">{tx("Cultura de Autonomia", locale)}</h3>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">{tx("Os manuais permanecem vivos, sofrendo polimentos constantes táticos para guiar novos crescimentos futuros.", locale)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - TRUST CORE BAR */}
      <section className="px-4 sm:px-6 md:px-8 py-10 border-b border-white/[0.04] bg-charcoal-900/40 text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-3xl">
            <p className="text-white font-display font-black text-sm tracking-tight">{tx("O FIM DA CENTRALIZAÇÃO DESESPERADA", locale)}</p>
            <p className="text-zinc-400 text-xs font-sans font-medium leading-relaxed">
              {tx("O Process Activation cria uma cultura operacional de autonomia. O time passa a conduzir com mais clareza as atividades de venda, suporte e faturamento mesmo na ausência do fundador.", locale)}</p>
          </div>
          <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest border border-brand-secondary/20 bg-brand-secondary/5 px-3.5 py-2 rounded-xl shrink-0 font-black">
            {tx("PROCESS ACTIVATION // TAG08", locale)}</span>
        </div>
      </section>

      {/* INTERACTIVE INNOVATION: SIMULADOR DE MATURIDADE OPERACIONAL & CRONOGRAMA */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 text-left relative overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-brand/[0.01] rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              {tx("METODOLOGIA ATIVA // ROADMAP DE EXECUÇÃO", locale)}</span>
            <h2 className="font-display font-medium text-3xl text-white tracking-tight">
              {tx("Simulador de Maturidade Operacional e Cronograma", locale)}</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
              {tx("O sucesso de uma automação corporativa não depende do software, mas da adesão do time. Identifique abaixo o nível de maturidade atual da sua operação e visualize o plano de cronograma exato para ativação e integração de playbooks.", locale)}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Controls */}
            <div className="lg:col-span-5 bg-charcoal-900/60 border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-6">
                <span className="tag08-meta text-xs text-zinc-300 uppercase tracking-widest font-bold block pb-3 border-b border-white/[0.05]">
                  {tx("Nível de Maturidade Atual:", locale)}</span>

                {/* Level Selectors */}
                {ACTIVATION_LEVELS.map((level) => {
                  const isSelected = level.id === activeLevel;
                  return (
                    <button
                      key={level.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => { trackSimulator("input_changed"); setActiveLevel(level.id); }}
                      className={`p-4 rounded-xl text-left border relative transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary ${
                        isSelected ? "bg-brand-secondary/5 border-brand-secondary text-white" : "bg-white/[0.01] border-white/5 text-zinc-400 hover:border-white/10"
                      }`}
                    >
                    <h3 className="text-white text-xs sm:text-sm font-semibold leading-tight">{tx(level.name, locale)}</h3>
                      <p className="text-zinc-300 text-xs mt-1 leading-snug">{tx(level.description, locale)}</p>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-2">
                <div className="flex items-center gap-2 text-brand">
                  <Zap className="w-4 h-4 shrink-0" />
                  <span className="text-xs tag08-meta font-black uppercase tracking-wider">{tx("Metodologia Hands-on TAG08", locale)}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {tx("Nossa equipe não entrega apenas manuais estáticos em PDF que ninguém lê. Nós conduzimos as sessões, gravamos treinamentos curtos, estruturamos ferramentas e auditamos a execução por 30 dias para garantir adoção real de 100% do time.", locale)}</p>
              </div>
            </div>

            {/* Timeline Panel */}
            <div className="lg:col-span-7 bg-charcoal-950 border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-6 w-full">
                <div className="flex items-center justify-between">
                  <span className="tag08-meta text-xs text-zinc-300 uppercase tracking-widest font-bold block">
                    {tx("Plano de Cronograma e Entregas de Ativação:", locale)}</span>
                  <span className="font-sans text-xs text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded font-black">
                    {localizedRoadmapDuration}
                  </span>
                </div>

                {/* Vertical Timeline Steps */}
                <div key={activeLevel} className="space-y-4">
                  {roadmap.phases.map((phase, phaseIndex) => (
                    <div
                      key={phase.step}
                      className="roadmap-phase-enter p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-start gap-4 hover:border-brand/20 transition-colors duration-200"
                      style={{ animationDelay: `${phaseIndex * 45}ms` }}
                    >
                      <div className="font-sans text-xs font-black text-brand bg-brand/5 border border-brand/10 rounded px-2.5 py-1 shrink-0 mt-0.5">
                        {tx(phase.step, locale)}
                      </div>
                      <div className="space-y-1 text-left">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white text-xs sm:text-sm font-bold leading-tight">
                            {tx(phase.title, locale)}
                          </h3>
                          <span className="text-xs font-sans text-zinc-300 font-bold">
                            {tx(phase.badge, locale)}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-sans">
                          {tx(phase.description, locale)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 mt-6">
                <span className="font-sans text-xs text-zinc-600">{tx("PROCESSO REGULADO SOB CONFORMIDADE OPERACIONAL ISO 9001 // 2026", locale)}</span>
                <button 
                  onClick={() => onNavigate("/contato")}
                  className="min-h-11 text-xs font-sans text-brand font-black uppercase hover:underline flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
                >
                  {tx("Cronometrar Minha Ativação", locale)}{" "}<ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION - WORK SYSTEM (WhatsApp Neon Callout inspired by screenshot) */}
      <section className="py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          {/* Left Column: Portrait */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[440px]">
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden" />
                <ResilientImage
              fallbackLabel={tx("Especialista em ativação", locale)}
              sizes="(max-width: 1024px) 100vw, 42vw"
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
              alt={tx("TAG08 Activation Specialist", locale)}
              className="object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[15%] motion-safe:hover:scale-[1.02] transition-transform duration-200"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between items-start">
                <span className="tag08-meta text-xs text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  {tx("OPERATIONAL CORE", locale)}</span>
                <span className="font-sans text-xs text-white/40 tracking-wider">
                  TAG08.v3</span>
              </div>
              <div className="space-y-1.5 opacity-30 select-none">
                <div className="font-display font-extrabold text-[1.8rem] text-white/40 tracking-widest leading-none uppercase select-none">
                  processes_active</div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                  {tx("sustentação_rota_", locale)}</div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-sans text-xs text-white/40 tracking-wider">
                  {tx("LATENCY: 12MS", locale)}</span>
                <span className="tag08-meta text-xs text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  {tx("SÊNIOR SECURITY", locale)}</span>
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
                <span className="tag08-meta text-xs tracking-widest uppercase font-bold text-black/90">
                  {tx("CONFIRA NOSSO SISTEMA DE TRABALHO", locale)}</span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black leading-[0.9] tracking-tighter font-display">
                {tx("ATIVAMOS SISTEMAS", locale)}{" "}<br />
                {tx("E SUSTENTAMOS REGRAS!", locale)}</h2>
              <p className="text-black/85 text-xs sm:text-xs max-w-lg leading-relaxed font-sans font-extrabold uppercase">
                {tx("INTEGRAMOS WORKSHOPS PRÁTICOS PARALELOS, CRIAMOS ROTINAS COM CHECKLISTS DIÁRIAS DIRETAS NO PAINEL E AUDITAMOS CONTINUAMENTE A ADESÃO DA SUA EQUIPE PARA GERAR AUTONOMIA REAL DAS OPERAÇÕES.", locale)}</p>
            </div>

            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 max-w-md relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-4 items-start select-none">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black shrink-0 shadow-lg shadow-brand/10 hover:scale-105 transition-transform duration-200">
                  <Workflow className="w-5 h-5 stroke-[2.5] text-black" />
                </div>
                <div className="space-y-0.5">
                  <span className="tag08-meta text-xs text-brand uppercase tracking-wider font-extrabold block">
                  {tx("GOVERNANÇA ATIVA", locale)}</span>
                  <p className="text-white text-xs leading-snug font-sans font-semibold">
                    {tx("Evite manuais de processo engavetados. Sustentamos as regras de trabalho para que o time opere de forma autanoma sem supervisão.", locale)}</p>
                </div>
              </div>

              {/* DUAL CLIENT CONNECTION CHANNELS (BR & INT) */}
              <div className="space-y-3">
                <TrackedOutboundLink
                  label="Solicitar diagnóstico de Process Activation"
                  surface="process-activation-contact-card-br"
                  href={processActivationBrazilUrl}
                  onClick={() => trackSimulator("cta_clicked")}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-colors duration-200 group shadow-inner"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-black transition-colors duration-200">
                        <span className="text-xs font-sans font-black tracking-tight text-brand group-hover:text-black">{tx("BR", locale)}</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="tag08-meta text-xs text-zinc-300 uppercase font-black tracking-wider leading-none">
                          {tx("PROPRIETÁRIO DIRETO (WhatsApp)", locale)}</span>
                        <span className="text-white text-xs font-sans font-bold tracking-wider group-hover:text-brand transition-colors mt-0.5">
                          +55 83 9.9886-8882</span>
                      </div>
                    </div>
                    <span className="text-xs text-brand tag08-meta font-bold uppercase tracking-wider bg-brand/10 py-1 px-2.5 rounded-lg group-hover:bg-brand group-hover:text-black transition-colors duration-200">
                      {tx("CONECTAR", locale)}</span>
                  </div>
                </TrackedOutboundLink>

                <TrackedOutboundLink
                  label="Request Process Activation consulting"
                  surface="process-activation-contact-card-int"
                  href={processActivationInternationalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-colors duration-200 group shadow-inner"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary shrink-0 group-hover:bg-brand-secondary group-hover:text-black transition-colors duration-200">
                        <span className="text-xs font-sans font-black tracking-tight text-brand-secondary group-hover:text-black">{tx("INT", locale)}</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="tag08-meta text-xs text-zinc-300 uppercase font-black tracking-wider leading-none">
                          {tx("INTERNATIONAL DIRECT (WhatsApp)", locale)}</span>
                        <span className="text-white text-xs font-sans font-bold tracking-wider group-hover:text-brand-secondary transition-colors mt-0.5">
                          +56 9 9793 7611</span>
                      </div>
                    </div>
                    <span className="text-xs text-brand-secondary tag08-meta font-bold uppercase tracking-wider bg-brand-secondary/10 py-1 px-2.5 rounded-lg group-hover:bg-brand-secondary group-hover:text-black transition-colors duration-200">
                      {tx("CONECTAR", locale)}</span>
                  </div>
                </TrackedOutboundLink>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                  <span className="tag08-meta text-xs text-white/50 uppercase tracking-widest font-extrabold">
                    {tx("AGÊNCIA TAG08", locale)}</span>
                </div>
                <span className="font-sans text-xs text-brand font-bold bg-brand/10 border border-brand/20 px-2 rounded">
                  {tx("OPERação ATIVA 100% online", locale)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOVO BLOCO: PRÉ-REQUISITOS, O QUE NÃO FAZEMOS, CICLO DE AUDITORIA, MATRIZ E CTA */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-zinc-950 text-left">
        <div className="max-w-7xl mx-auto space-y-24">
          
          {/* Pré-requisitos para contratação */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                {tx("ALINHAMENTO DE ENTRADA // EXIGÊNCIAS PRÉVIAS", locale)}</span>
              <h2 className="font-display font-medium text-2xl sm:text-3xl text-white">
                {tx("Sua empresa está pronta para a Ativação de Processos?", locale)}</h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                {tx("A divisão de Activation é extremamente realizadora e tática, mas exige que sua empresa preencha critérios de entrada mínimos. Sem eles, qualquer esforço de implantação de auditoria será inofensivo:", locale)}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { title: "Processos Mapeados", desc: "Sua marca precisa ter manuais, playbooks ou fluxos de trabalho previamente consolidados (caso não possua, indicamos nossa divisão Process Intelligence)." },
                { title: "Liderança Comprometida", desc: "Os diretores e fundadores precisam dar respaldo absoluto de autoridade aos nossos auditores para cobrar a equipe." }
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-charcoal-900 border border-white/[0.04] space-y-2">
                  <h3 className="text-white text-xs sm:text-sm font-display font-medium tracking-tight text-brand-secondary">{tx(item.title, locale)}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{tx(item.desc, locale)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* O que não fazemos na Ativação */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10 border-t border-white/[0.04]">
            <div className="lg:col-span-5 space-y-4">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                {tx("LIMITES DE ESCOPO // ATUAÇÃO PROFISSIONAL", locale)}</span>
              <h3 className="font-display font-medium text-2xl text-white">
                {tx("O que não está incluído na Ativação de Processos", locale)}</h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                {tx("Nós auditamos, implantamos e cobramos conformidade técnica com afinco, mas não assumimos atribuições internas que pertencem pura e exclusivamente à sua diretoria:", locale)}</p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { title: "Não Somos RH do Cliente", desc: "Nós reportamos o não cumprimento de processos e erros operacionais, mas demissões, contratações e advertências legais cabem ao seu RH." },
                { title: "Não Alteramos Seus Contratos", desc: "Não fazemos alterações legais em obrigações de trabalho de colaboradores ou fornecedores externos sem sua expressa validação." },
                { title: "Não Somos Gerentes Permanentes", desc: "Nossa divisão opera para implantar autonomia. Treinamos seus líderes internos para que eles assumam a sustentação permanente." },
                { title: "Não Gerenciamos Suas Finanças", desc: "Efetuamos auditoria operacional na prestação de contas, mas transferências bancárias e decisões de tesouraria continuam com você." }
              ].map((point, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.03] space-y-1">
                  <h3 className="text-white text-xs sm:text-sm font-display font-medium tracking-tight text-zinc-300">{tx(point.title, locale)}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{tx(point.desc, locale)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ciclo de auditoria semanal */}
          <div className="space-y-8 pt-10 border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                {tx("SISTEMA SEMANAL DE CRITÉRIOS", locale)}</span>
              <h3 className="font-display font-medium text-2xl text-white">
                {tx("O funcionamento prático do nosso Ciclo Mensal e Semanal", locale)}</h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed max-w-2xl">
                {tx("A adesão aos manuais do seu negócio ocorre por insistência e constância analítica. Nosso time executa um cronograma estável e repetitivo nos bastidores:", locale)}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              {[
                { title: "1. Monitoramento Ativo", desc: "Nossos auditores extraem diariamente relatórios de sistemas (Notion, Trello, CRM, etc.) para verificar conformidade tática." },
                { title: "2. Cobrança e Apoio", desc: "Colaboradores com atraso recebem alertas e suporte rápido para esclarecer possíveis dúvidas sistêmicas." },
                { title: "3. Briefing de Resultados", desc: "Reunião rápida semanal com a diretoria para relatar o cumprimento exato dos indicadores de aderência dos times." },
                { title: "4. Calibragem Mensal", desc: "Encontros de fim de ciclo para ajustar fluxos que geram ruído estrutural ou gargalos operacionais frequentes." }
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="group rounded-2xl border border-[color:var(--color-text-secondary)] bg-[color:var(--color-text-primary)] p-5 text-[color:var(--color-main)] shadow-[var(--shadow-base)] transition-[border-color,box-shadow,transform] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-[color:var(--color-accent-readable)] motion-safe:hover:shadow-[var(--shadow-emphasis)] motion-reduce:transform-none"
                >
                  <h3 className="font-display text-xs font-semibold tracking-tight text-[color:var(--color-main)] sm:text-sm">{tx(step.title, locale)}</h3>
                  <p className="font-sans text-xs leading-relaxed text-[color:var(--color-charcoal-700)]">{tx(step.desc, locale)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Matriz de Responsabilidades (TAG08 vs. Cliente) */}
          <div className="space-y-6 pt-10 border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                {tx("MATRIZ DE FRONTEIRAS // RESPONSABILIDADE OPERACIONAL", locale)}</span>
              <h3 className="font-display font-medium text-2xl text-white">
                {tx("Quem responde por qual entrega?", locale)}</h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed max-w-xl">
                {tx("Operamos integrados, mas as fronteiras de decisão precisam estar desenhadas com absoluta clareza técnica:", locale)}</p>
            </div>

            <div className="border border-white/[0.06] rounded-2xl overflow-hidden divide-y divide-white/[0.06] bg-charcoal-900/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 tag08-meta text-xs text-zinc-300 uppercase tracking-wider bg-white/[0.01]">
                <div>{tx("Esfera de Atuação TAG08", locale)}</div>
                <div>{tx("Esfera de Atuação do Cliente", locale)}</div>
              </div>

              {[
                { col1: "Auditoria contínua de adesão aos manuais operacionais cadastrados.", col2: "Atendimento ou execução direta das tarefas operacionais cotidianas." },
                { col1: "Alertas de atraso e notificações individuais de inconformidade tática.", col2: "Sanções oficiais de RH, reuniões de advertência ou demissões." },
                { col1: "Criação de sessões explicativas adicionais de sistemas se necessário.", col2: "Disponibilizar tempo dos times para as reuniões de alinhamento." },
                { col1: "Garantir notas mensais agregadas de qualidade operacional por área.", col2: "Definir metas comerciais sêniores e direcionar investimentos do negócio." }
              ].map((row, rIdx) => (
                <div key={rIdx} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 text-xs sm:text-sm">
                  <div className="text-zinc-300 font-sans flex gap-2">
                    <span className="text-brand-secondary font-sans font-bold shrink-0">{tx("[TAG08]", locale)}</span>
                    <span>{tx(row.col1, locale)}</span>
                  </div>
                  <div className="text-zinc-400 font-sans flex gap-2 border-t md:border-t-0 border-white/[0.03] pt-3 md:pt-0">
                    <span className="text-zinc-300 font-sans font-bold shrink-0">{tx("[CLIENTE]", locale)}</span>
                    <span>{tx(row.col2, locale)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quando Contratar */}
          <div className="p-6 sm:p-8 rounded-3xl bg-charcoal-900 border border-white/[0.05] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-10 border-t border-white/[0.04]">
            <div className="lg:col-span-8 space-y-2">
              <span className="tag08-meta text-xs text-zinc-300 uppercase tracking-widest font-black block">{tx("CRITÉRIO DE ESCOLHA OPERACIONAL", locale)}</span>
              <h3 className="text-white font-display font-medium text-lg">{tx("Quando contratar nossa ativação sênior?", locale)}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                {tx("Se sua empresa já ultrapassou o faturamento bruto anual de R$ 300k, possui mais de 4 pessoas na operação, mas você sente que, como fundador, continua preso no operacional de microgerenciamento de tarefas básicas e cobranças redundantes todos os dias, a TAG08 Activation é o encaixe operacional perfeito para a libertação estratégica de seu tempo de negócios.", locale)}</p>
            </div>
            <div className="lg:col-span-4 flex justify-end">
              <span className="font-sans text-xs text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/15 px-4 py-2 rounded-xl">
                {tx("ESTRUTURA DE AUDITORIA ATIVA", locale)}</span>
            </div>
          </div>

          {/* CTA para Ativação */}
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-[color:var(--color-text-secondary)] bg-[color:var(--color-text-primary)] p-6 text-left text-[color:var(--color-main)] shadow-[var(--shadow-base)] transition-[border-color,box-shadow] duration-200 sm:flex-row sm:p-8 motion-safe:hover:border-[color:var(--color-accent-readable)] motion-safe:hover:shadow-[var(--shadow-emphasis)]">
            <div className="space-y-1">
              <h3 className="font-display text-lg font-semibold text-[color:var(--color-main)]">{tx("Sua equipe precisa de acompanhamento operacional sênior?", locale)}</h3>
              <p className="max-w-xl font-sans text-xs leading-relaxed text-[color:var(--color-charcoal-700)] sm:text-sm">
                {tx("Fale com nossos engenheiros de processos e agende um diagnóstico sobre a atual taxa de adesão a manuais e playbooks da sua empresa.", locale)}</p>
            </div>
            <button
              onClick={() => {
                onNavigate("/contato");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="min-h-11 shrink-0 rounded-xl border border-[color:var(--color-main)] bg-[color:var(--color-main)] px-6 py-4 text-xs font-bold uppercase tracking-widest text-[color:var(--color-text-primary)] transition-[background-color,border-color,transform] duration-200 hover:border-[color:var(--color-charcoal-700)] hover:bg-[color:var(--color-charcoal-700)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-readable)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-text-primary)]"
            >
              {tx("Auditar Adesão de Processos", locale)}</button>
          </div>

        </div>
      </section>

      <ServiceInsightsBridge
        servicePath="/servicos/process-activation"
        onNavigate={onNavigate}
        locale={locale}
        variant="editorial-light"
      />

      {/* SECTION - FAQ */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[40px] bg-charcoal-950 border border-white/[0.04] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
                  {tx("FAQ // ENCONTRE RESPOSTAS", locale)}</div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter">
                  {tx("DÚVIDAS &amp;", locale)}{" "}<br />
                  {tx("ATIVAÇÃO PRÁTICA", locale)}</h2>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-sans max-w-sm">
                  {tx("Esclareça as principais dúvidas sobre como a metodologia ativa playbooks na rotina real dos colaboradores.", locale)}</p>
              </div>

              <div className="space-y-3 pt-4">
                {([
                  { id: 0, title: "REQUISITO INTELLIGENCE" },
                  { id: 1, title: "ENGANJAMENTO DO TIME" },
                  { id: 2, title: "SISTEMAS DE AUDITORIA" },
                  { id: 3, title: "PERÍODO DE SUSTENTAÇÃO" }
                ]).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-expanded={activeFaq === item.id}
                    aria-controls={`activation-faq-panel-${item.id}`}
                    onClick={() => setActiveFaq(item.id)}
                    className={`w-full min-h-11 flex items-center justify-between p-4 rounded-xl border transition-colors duration-200 text-left group cursor-pointer active:scale-[0.99] ${
                      activeFaq === item.id
                        ? "bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)]"
                        : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                    }`}
                  >
                    <span className="tag08-meta text-xs font-black uppercase tracking-wider flex items-center gap-3">
                      <span className={activeFaq === item.id ? "text-black" : "text-brand"}>
                        {String(item.id + 1).padStart(2, '0')}{tx(".", locale)}</span>
                      {tx(item.title, locale)}
                    </span>
                    <ArrowRight aria-hidden="true" className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${
                      activeFaq === item.id ? "text-black rotate-[-45deg] stroke-[2.5]" : "text-zinc-500"
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[300px] sm:min-h-[380px] rounded-3xl overflow-hidden border border-white/[0.04] bg-charcoal-900">
                <ResilientImage
                fallbackLabel="Process Activation // TAG08"
                sizes="(max-width: 1024px) 100vw, 34vw"
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                alt={tx("TAG08 Process Activation", locale)}
                className="object-cover grayscale brightness-[0.22] contrast-[1.1] transition-opacity duration-200 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div aria-hidden="true" className="absolute top-6 left-6 z-10 pointer-events-none tag08-meta text-xs text-white/20 uppercase tracking-widest leading-none">
                SYS // PROCESS_ACTIVE</div>

              <div id={`activation-faq-panel-${activeFaq}`} role="region" aria-labelledby={`activation-faq-heading-${activeFaq}`} className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left">
                <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black block">
                  {tx(([
                    "REQUISITO INTELLIGENCE",
                    "ENGANJAMENTO DO TIME",
                    "SISTEMAS DE AUDITORIA",
                    "PERÍODO DE SUSTENTAÇÃO"
                  ])[activeFaq], locale)}
                </span>
                
                <h3 id={`activation-faq-heading-${activeFaq}`} className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {tx(([
                    "Posso contratar o Activation sem o Intelligence?",
                    "Como vocês engajam a equipe na nova cultura?",
                    "Quem audita o cumprimento dos fluxos?",
                    "Qual o período de sustentação supervisionada?"
                  ])[activeFaq], locale)}
                </h3>
                
                <p className="text-zinc-300 text-xs sm:text-xs leading-relaxed font-sans font-medium">
                  {tx(([
                    "Não. O Process Activation exige a conclusão prévia do Process Intelligence. Não implantamos manuais sem os playbooks e as wikis estarem estruturados e organizados sob nossa aprovação de calibre técnico.",
                    "Promovemos workshops dinâmicos assistidos voltados ao uso correto das ferramentas, criamos rotinas com checklists visuais de tarefas diárias e conectamos as bases de senhas diretas à mesa de trabalho produtiva de cada colaborador.",
                    "Nossa assessoria sênior realiza vistorias periódicas de conformidade diretamente nos painéis digitais, quantifica a adesão operacional da equipe e auxilia individualmente colaboradores que demonstrem gargalos de ritmo ou aprendizagem.",
                    "O programa dura em média até 30 dias de acompanhamento diário ativo, garantindo polimentos finos de playbooks diante de fricções do mundo real e gerando a consolidação final da autonomia do seu negócio."
                  ])[activeFaq], locale)}
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              <div className="bg-charcoal-900 border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-colors duration-200 text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-zinc-300 uppercase tracking-widest block font-bold">{tx("PROPOSTA DE VALOR", locale)}</span>
                  <h3 className="text-white font-semibold text-sm leading-snug">{tx("Como agimos de forma organizada?", locale)}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    {tx("Eliminamos o esquecimento operacional e táticas manuais obsoletas. Garantimos sustentação de rotas.", locale)}</p>
                </div>
                <button
                  onClick={() => handleLinkClick("/servicos")}
                  className="group min-h-11 flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5 transition-colors duration-200"
                >
                  <span>{tx("Ver Serviços", locale)}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 motion-safe:hover:scale-[1.01] transition-transform duration-200 text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-black/80 uppercase tracking-widest block font-extrabold">{tx("FALE COM O DIRETOR", locale)}</span>
                  <h3 className="text-black font-black text-sm leading-tight tracking-tight">{tx("Quer desenhar uma estratégia sob medida?", locale)}</h3>
                  <p className="text-black/85 text-xs font-semibold leading-relaxed font-sans">
                    {tx("Fale diretamente com os tomadores de decisão da TAG08 via WhatsApp para avaliar a viabilidade de alocação de equipe.", locale)}</p>
                </div>
                <TrackedOutboundLink
                  label="Conversar agora"
                  surface="process-activation-final-cta"
                  href={finalContactUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group min-h-11 flex items-center justify-between text-xs font-sans font-black text-black select-none border-t border-black/10 pt-3 hover:translate-x-0.5 transition-transform duration-200"
                >
                  <span>{tx("Conversar Agora", locale)}</span>
                  <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
                </TrackedOutboundLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 - ACTION TRIGGER FOOTER */}
      <section className="px-4 sm:px-6 md:px-8 py-20 text-center space-y-6 max-w-4xl mx-auto">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-none tracking-tighter">
          {tx("SAIA DA INDISCIPLINA INTELECTUAL", locale)}{" "}<br />
          <span className="text-brand">{tx("E GARANTA A ADOÇÃO PLENA DOS SEUS PROCESSOS.", locale)}</span>
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          {tx("Evite gastar milhares de reais escrevendo wikis de qualidade para deixá-las engavetadas pegando poeira digital. Fale com nosso diretor de sustentação.", locale)}</p>
        <div className="pt-4">
          <button
            onClick={() => handleLinkClick("/contato")}
            className="group min-h-11 bg-brand text-black font-sans font-black text-xs uppercase tracking-widest py-4 px-8 rounded-full shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.22)] hover:bg-brand-dark transition-colors duration-200 active:scale-[0.98] cursor-pointer flex items-center gap-2 mx-auto"
          >
            <span>{tx("DISPARAR ATIVAÇÃO DE PROCESSOS DE ELITE", locale)}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </section>
    </div>
  );
}












