import { useRef, useState } from "react";
import ResilientImage from "../../../components/ResilientImage";
import { ArrowUpRight, Shield, ArrowRight, Percent, TrendingUp, HelpCircle } from "../../../components/DooIcons";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import { trackCtaClick, trackSimulatorEvent } from "../../../lib/analytics";
import { AFFILIATE_COMMISSION_RATES, calculateAffiliateCommission, isActiveRecurringCommissionEligible, type PartnershipModality } from "../../../lib/simulators/affiliateCommission";
import type { RouteLocale } from "../../../config/routeRegistry";

interface ProgramaAfiliadosProps {
  onNavigate: (page: string) => void;
  contactHref: string;
  locale?: RouteLocale;
}

const AFFILIATE_COPY: Record<string, { en: string; es: string }> = {
  "PROGRAMA DE PARCERIA": { en: "PARTNERSHIP PROGRAM", es: "PROGRAMA DE ALIANZAS" },
  "FAÇA PARCERIAS,": { en: "BUILD PARTNERSHIPS,", es: "CREA ALIANZAS," },
  "RECEBA COMISSÕES POR INDICAÇÕES.": { en: "EARN COMMISSIONS FOR REFERRALS.", es: "RECIBE COMISIONES POR REFERENCIAS." },
  "Escolha entre apresentar uma oportunidade à TAG08 ou atuar continuamente na frente comercial. As modalidades têm responsabilidades e regras de remuneração diferentes, sempre condicionadas à aprovação e ao recebimento efetivo dos valores elegíveis.": { en: "Choose whether to introduce an opportunity to TAG08 or to stay actively involved in the commercial relationship. Each partnership type has distinct responsibilities and compensation rules, always subject to approval and actual receipt of eligible amounts.", es: "Elige entre presentar una oportunidad a TAG08 o participar de forma continua en la gestión comercial. Cada modalidad tiene responsabilidades y reglas de remuneración distintas, siempre sujetas a aprobación y al cobro efectivo de los importes elegibles." },
  "Programa de Parceria TAG08": { en: "TAG08 Partnership Program", es: "Programa de Alianzas TAG08" },
  "Programa de Parceria e parceiros comerciais TAG08": { en: "TAG08 Partnership Program and commercial partners", es: "Programa de Alianzas y socios comerciales de TAG08" },
  "INICIAR CONVERSA SOBRE PARCERIA": { en: "START A PARTNERSHIP CONVERSATION", es: "INICIAR UNA CONVERSACIÓN SOBRE LA ALIANZA" },
  "ALTA PERFORMANCE E TRANSPARÊNCIA": { en: "HIGH PERFORMANCE AND TRANSPARENCY", es: "ALTO DESEMPEÑO Y TRANSPARENCIA" },
  "Comissões condicionadas às regras aprovadas": { en: "Commissions subject to approved rules", es: "Comisiones sujetas a las reglas aprobadas" },
  "SIMULAÇÃO ATUALIZADA": { en: "SIMULATION UPDATED", es: "SIMULACIÓN ACTUALIZADA" },
  "Da primeira mensalidade": { en: "On the first monthly payment", es: "De la primera mensualidad" },
  "recorrente elegível recebida": { en: "eligible recurring payment received", es: "recurrente elegible recibida" },
  "Só na modalidade ativa,": { en: "Only for the active partnership,", es: "Solo en la modalidad activa," },
  "a partir de": { en: "starting", es: "a partir del" },
  "dias": { en: "days", es: "días" },
  "Serviços pontuais": { en: "One-time services", es: "Servicios puntuales" },
  "da modalidade ativa": { en: "under the active partnership", es: "de la modalidad activa" },
  "Aberta": { en: "Open", es: "Abierta" },
  "Sem exclusividade": { en: "No exclusivity", es: "Sin exclusividad" },
  "territorial ou de nicho": { en: "by territory or niche", es: "territorial ni de nicho" },
  "SIMULADOR // CENÁRIO INFORMADO POR VOCÊ": { en: "SIMULATOR // YOUR SCENARIO", es: "SIMULADOR // ESCENARIO INFORMADO POR TI" },
  "Simule um cenário de comissão": { en: "Simulate a commission scenario", es: "Simula un escenario de comisión" },
  "Informe apenas valores elegíveis efetivamente pagos e recebidos. Para serviços pontuais, use a base de receita própria da TAG08 após as exclusões descritas no resultado. A simulação não promete contratação ou pagamento.": { en: "Enter only eligible amounts actually paid by the client and received by TAG08. For one-time services, use TAG08's own revenue after the exclusions shown in the result. This simulation does not promise a contract or payment.", es: "Introduce solo importes elegibles efectivamente pagados y recibidos por TAG08. Para servicios puntuales, usa los ingresos propios de TAG08 después de las exclusiones indicadas en el resultado. Esta simulación no garantiza contratación ni pago." },
  "Modalidade de parceria": { en: "Partnership type", es: "Modalidad de alianza" },
  "Parceiro de Indicação": { en: "Referral Partner", es: "Socio de Referencia" },
  "Apresenta e contextualiza a oportunidade; a TAG08 conduz proposta e contratação.": { en: "Introduces and contextualizes the opportunity; TAG08 leads the proposal and contracting.", es: "Presenta y contextualiza la oportunidad; TAG08 dirige la propuesta y la contratación." },
  "Parceiro Comercial Ativo": { en: "Active Commercial Partner", es: "Socio Comercial Activo" },
  "Atua continuamente em prospecção, relacionamento, qualificação, acompanhamento e pós-venda.": { en: "Continuously handles prospecting, relationships, qualification, follow-up, and post-sale support.", es: "Participa continuamente en prospección, relación, calificación, seguimiento y posventa." },
  "Deixe em branco os tipos de receita que não fazem parte do cenário; informe 0 se a receita se aplica, mas não houve base elegível.": { en: "Leave revenue types outside this scenario blank; enter 0 when a revenue type applies but has no eligible base.", es: "Deja en blanco los tipos de ingresos que no forman parte del escenario; introduce 0 si el tipo de ingreso aplica, pero no hubo base elegible." },
  "Valor da primeira mensalidade recorrente elegível, pago pelo cliente e recebido pela TAG08 (R$)": { en: "Eligible first recurring monthly payment, paid by the client and received by TAG08 (BRL)", es: "Primera mensualidad recurrente elegible, pagada por el cliente y recibida por TAG08 (BRL)" },
  "A comissão ilustrativa é ": { en: "The illustrative commission is ", es: "La comisión ilustrativa es del " },
  "desta base elegível para contrato recorrente aprovado.": { en: "of this eligible base for an approved recurring contract.", es: "sobre esta base elegible para un contrato recurrente aprobado." },
  "Condições para simular a recorrência": { en: "Conditions for simulating recurring commission", es: "Condiciones para simular la comisión recurrente" },
  "Dias desde o pagamento da primeira mensalidade": { en: "Days since the first monthly payment", es: "Días desde el pago de la primera mensualidad" },
  "O cliente permanece ativo e gerou receita recorrente elegível efetivamente recebida.": { en: "The client remains active and generated eligible recurring revenue that was actually received.", es: "El cliente sigue activo y generó ingresos recurrentes elegibles efectivamente recibidos." },
  "O parceiro permanece ativo no Programa.": { en: "The partner remains active in the Program.", es: "El socio sigue activo en el Programa." },
  "O parceiro mantém a atuação comercial e de pós-venda esperada.": { en: "The partner maintains the expected commercial and post-sale involvement.", es: "El socio mantiene la participación comercial y de posventa esperada." },
  "Receita recorrente elegível efetivamente recebida (R$)": { en: "Eligible recurring revenue actually received (BRL)", es: "Ingresos recurrentes elegibles efectivamente recibidos (BRL)" },
  "A comissão de ": { en: "The ", es: "La comisión del " },
  "só é calculada a partir do ": { en: "commission is calculated only from day ", es: "solo se calcula a partir del día " },
  "º dia quando todas as condições acima forem atendidas.": { en: " onward when all the conditions above are met.", es: " cuando se cumplen todas las condiciones anteriores." },
  "Para serviços pontuais, informe somente a receita própria da TAG08 na primeira parcela recebida. Desconsidere tributos e retenções, descontos, mídia, custos de terceiros, hospedagem, ferramentas, despesas repassadas e reembolsos.": { en: "For one-time services, enter only TAG08's own revenue from the first installment received. Exclude taxes and withholdings, discounts, media spend, third-party costs, hosting, tools, pass-through expenses, and refunds.", es: "Para servicios puntuales, introduce solo los ingresos propios de TAG08 correspondientes a la primera cuota recibida. Excluye impuestos y retenciones, descuentos, inversión en medios, costos de terceros, alojamiento, herramientas, gastos repercutidos y reembolsos." },
  "Base líquida da primeira parcela recebida em serviço pontual Sebrae/subsídio/programa (R$)": { en: "Net base of the first installment received for a Sebrae/subsidy/program one-time service (BRL)", es: "Base neta de la primera cuota recibida por un servicio puntual vinculado a Sebrae/subsidio/programa (BRL)" },
  "Estimativa de ": { en: "Estimated at ", es: "Estimación del " },
  "sobre a primeira parcela elegível recebida.": { en: "on the first eligible installment received.", es: "sobre la primera cuota elegible recibida." },
  "Base líquida da primeira parcela recebida em outros serviços pontuais (R$)": { en: "Net base of the first installment received for other one-time services (BRL)", es: "Base neta de la primera cuota recibida por otros servicios puntuales (BRL)" },
  "CENÁRIO ILUSTRATIVO": { en: "ILLUSTRATIVE SCENARIO", es: "ESCENARIO ILUSTRATIVO" },
  "Resultado do cenário": { en: "Scenario result", es: "Resultado del escenario" },
  "Corrija os campos destacados para ver uma estimativa confiável.": { en: "Correct the highlighted fields to see a reliable estimate.", es: "Corrige los campos marcados para ver una estimación confiable." },
  "Informe ao menos uma base elegível recebida. Deixe em branco os tipos de receita que não fazem parte do cenário.": { en: "Enter at least one eligible base that has been received. Leave revenue types outside this scenario blank.", es: "Introduce al menos una base elegible recibida. Deja en blanco los tipos de ingresos que no forman parte del escenario." },
  "Comissão sobre a primeira mensalidade recorrente:": { en: "Commission on the first recurring monthly payment:", es: "Comisión sobre la primera mensualidad recurrente:" },
  "Comissão recorrente estimada a partir do dia ": { en: "Estimated recurring commission from day ", es: "Comisión recurrente estimada a partir del día " },
  ", se elegível:": { en: ", if eligible:", es: ", si es elegible:" },
  "/mês": { en: "/month", es: "/mes" },
  "Serviços pontuais Sebrae/subsídio/programa (": { en: "Sebrae/subsidy/program one-time services (", es: "Servicios puntuales Sebrae/subsidio/programa (" },
  "Outros serviços pontuais (": { en: "Other one-time services (", es: "Otros servicios puntuales (" },
  "A recorrência de ": { en: "The recurring commission of ", es: "La comisión recurrente del " },
  "não é vitalícia nem passiva: depende de contrato ativo, receita efetivamente recebida e atuação contínua do parceiro.": { en: "is neither lifetime nor passive: it depends on an active contract, revenue actually received, and the partner's continued involvement.", es: "no es vitalicia ni pasiva: depende de un contrato activo, ingresos efectivamente recibidos y la participación continua del socio." },
  "Para serviços pontuais, a base exclui impostos e retenções, descontos, mídia, custos de terceiros, hospedagem, ferramentas, despesas repassadas, reembolsos e valores que não representem receita própria da TAG08.": { en: "For one-time services, the base excludes taxes and withholdings, discounts, media spend, third-party costs, hosting, tools, pass-through expenses, refunds, and amounts that are not TAG08's own revenue.", es: "Para servicios puntuales, la base excluye impuestos y retenciones, descuentos, inversión en medios, costos de terceros, alojamiento, herramientas, gastos repercutidos, reembolsos e importes que no representen ingresos propios de TAG08." },
  "As condições informadas atendem ao marco e aos requisitos usados nesta simulação.": { en: "The entered conditions meet the milestone and requirements used in this simulation.", es: "Las condiciones indicadas cumplen el plazo y los requisitos utilizados en esta simulación." },
  "A comissão recorrente permanece em zero até que o marco de ": { en: "Recurring commission remains zero until the ", es: "La comisión recurrente permanece en cero hasta que se cumpla el plazo de " },
  " dias e todas as condições sejam atendidos.": { en: "-day milestone and all conditions are met.", es: " días y se cumplan todas las condiciones." },
  "A modalidade de indicação não projeta comissão recorrente de ": { en: "The referral partnership does not project recurring commission of ", es: "La modalidad de referencia no proyecta una comisión recurrente del " },
  " após ": { en: " after ", es: " después de " },
  " dias nem comissão de serviço pontual.": { en: " days or commission on one-time services.", es: " días ni comisiones por servicios puntuales." },
  "A simulação usa exclusivamente os valores informados e não garante elegibilidade, contratação ou pagamento. A oportunidade precisa ser atribuível ao parceiro e aprovada pela TAG08; somente valores elegíveis efetivamente recebidos geram comissão. A parceria não é exclusiva.": { en: "This simulation uses only the values entered and does not guarantee eligibility, a contract, or payment. The opportunity must be attributable to the partner and approved by TAG08; only eligible amounts actually received generate commission. The partnership is non-exclusive.", es: "La simulación utiliza únicamente los valores introducidos y no garantiza elegibilidad, contratación ni pago. La oportunidad debe ser atribuible al socio y aprobada por TAG08; solo los importes elegibles efectivamente recibidos generan comisión. La alianza no es exclusiva." },
  "FALAR SOBRE PARCERIA": { en: "DISCUSS A PARTNERSHIP", es: "HABLAR SOBRE LA ALIANZA" },
  "VANTAGENS COMPETITIVAS": { en: "PARTNERSHIP BENEFITS", es: "VENTAJAS DE LA ALIANZA" },
  "Vantagens de ser Parceiro TAG08": { en: "Benefits of partnering with TAG08", es: "Ventajas de ser socio de TAG08" },
  "A TAG08 valida a oferta, o escopo e a formalização com o cliente; a participação do parceiro varia conforme a modalidade.": { en: "TAG08 validates the offer and scope and formalizes the agreement with the client; the partner's role depends on the partnership type.", es: "TAG08 valida la oferta y el alcance, y formaliza el acuerdo con el cliente; la participación del socio depende de la modalidad." },
  "Modalidades com regras distintas": { en: "Distinct partnership rules", es: "Modalidades con reglas distintas" },
  "No Parceiro de Indicação, a atuação é apresentar e contextualizar a oportunidade e fazer a introdução. A TAG08 conduz a proposta e a contratação.": { en: "A Referral Partner presents and contextualizes the opportunity and makes the introduction. TAG08 leads the proposal and contracting.", es: "El Socio de Referencia presenta y contextualiza la oportunidad y realiza la presentación inicial. TAG08 dirige la propuesta y la contratación." },
  "Atuação comercial ativa": { en: "Active commercial involvement", es: "Participación comercial activa" },
  "O Parceiro Comercial Ativo acompanha prospecção, relacionamento, qualificação, negociação comercial, pós-venda e cuidado da conta. Não define preço, oferta, escopo ou condições comerciais da TAG08.": { en: "The Active Commercial Partner supports prospecting, relationships, qualification, commercial discussions, post-sale support, and account care. The partner does not set TAG08's pricing, offer, scope, or commercial terms.", es: "El Socio Comercial Activo acompaña la prospección, la relación, la calificación, la negociación comercial, la posventa y la atención de la cuenta. No define precios, oferta, alcance ni condiciones comerciales de TAG08." },
  "A parceria não reserva território ou nicho. O reconhecimento de comissão depende da contribuição registrada, aprovação da TAG08 e recebimento do valor elegível.": { en: "The partnership does not reserve a territory or niche. Commission recognition depends on a documented contribution, TAG08 approval, and receipt of the eligible amount.", es: "La alianza no reserva territorios ni nichos. El reconocimiento de la comisión depende de una contribución registrada, la aprobación de TAG08 y el cobro del importe elegible." },
  "FLUXOGRAMA OPERACIONAL // PASSO A PASSO": { en: "OPERATING FLOW // STEP BY STEP", es: "FLUJO OPERATIVO // PASO A PASO" },
  "Como funciona a parceria": { en: "How the partnership works", es: "Cómo funciona la alianza" },
  "As oportunidades são registradas e avaliadas pela TAG08. A modalidade escolhida define a participação comercial e as regras aplicáveis.": { en: "TAG08 records and evaluates opportunities. The chosen partnership type determines the commercial role and applicable rules.", es: "TAG08 registra y evalúa las oportunidades. La modalidad elegida define la participación comercial y las reglas aplicables." },
  "ESCOLHA DA MODALIDADE": { en: "CHOOSE A PARTNERSHIP TYPE", es: "ELIGE LA MODALIDAD" },
  "Indique se sua participação será como Parceiro de Indicação ou Parceiro Comercial Ativo.": { en: "Choose whether you will participate as a Referral Partner or Active Commercial Partner.", es: "Indica si participarás como Socio de Referencia o Socio Comercial Activo." },
  "REGISTRO DA OPORTUNIDADE": { en: "REGISTER THE OPPORTUNITY", es: "REGISTRA LA OPORTUNIDAD" },
  "A oportunidade e a contribuição do parceiro precisam ser registradas para análise da TAG08.": { en: "The opportunity and the partner's contribution must be recorded for TAG08 to review.", es: "La oportunidad y la contribución del socio deben registrarse para que TAG08 las evalúe." },
  "APROVAÇÃO E CONTRATAÇÃO": { en: "APPROVAL AND CONTRACTING", es: "APROBACIÓN Y CONTRATACIÓN" },
  "A TAG08 avalia a oportunidade, aprova a oferta e formaliza o contrato diretamente com o cliente.": { en: "TAG08 evaluates the opportunity, approves the offer, and contracts directly with the client.", es: "TAG08 evalúa la oportunidad, aprueba la oferta y formaliza el contrato directamente con el cliente." },
  "APURAÇÃO DA COMISSÃO": { en: "COMMISSION CALCULATION", es: "CÁLCULO DE LA COMISIÓN" },
  "A comissão é apurada conforme a modalidade, as condições vigentes e os valores elegíveis efetivamente recebidos.": { en: "Commission is calculated according to the partnership type, current conditions, and eligible amounts actually received.", es: "La comisión se calcula según la modalidad, las condiciones vigentes y los importes elegibles efectivamente recibidos." },
  "DÚVIDAS FREQUENTES SOBRE O PROGRAMA": { en: "FREQUENT QUESTIONS ABOUT THE PROGRAM", es: "PREGUNTAS FRECUENTES SOBRE EL PROGRAMA" },
  "Confira os detalhes do Programa de Parceria e tire suas dúvidas sobre o acompanhamento das indicações.": { en: "Review the Partnership Program details and learn how referrals are followed up.", es: "Consulta los detalles del Programa de Alianzas y resuelve tus dudas sobre el seguimiento de referencias." },
  "AUMENTE SUA RECEITA COM MENOS BUROCRACIA": { en: "GROW YOUR REVENUE WITH LESS ADMIN", es: "AUMENTA TUS INGRESOS CON MENOS TRÁMITES" },
  "PRONTO PARA ENTRAR NO": { en: "READY TO JOIN THE", es: "¿LISTO PARA UNIRTE AL" },
  "PROGRAMA DE PARCERIA?": { en: "PARTNERSHIP PROGRAM?", es: "PROGRAMA DE ALIANZAS?" },
  "Cadastre-se como parceiro, entenda as regras de comissionamento e envie sua primeira oportunidade para a equipe da TAG08.": { en: "Register as a partner, review the commission rules, and submit your first opportunity to the TAG08 team.", es: "Regístrate como socio, consulta las reglas de comisiones y envía tu primera oportunidad al equipo de TAG08." },
  "CONVERSAR SOBRE PARCERIA": { en: "DISCUSS A PARTNERSHIP", es: "HABLAR SOBRE LA ALIANZA" },
  "Quem pode se cadastrar no Programa de Parceria?": { en: "Who can join the Partnership Program?", es: "¿Quién puede inscribirse en el Programa de Alianzas?" },
  "O programa tem duas modalidades: Parceiro de Indicação, que identifica e contextualiza uma oportunidade e aproxima o cliente da TAG08; e Parceiro Comercial Ativo, que também atua de forma contínua no relacionamento comercial e pós-venda.": { en: "The program has two types: a Referral Partner identifies and contextualizes an opportunity and introduces the client to TAG08; an Active Commercial Partner also stays involved in the commercial relationship and post-sale support.", es: "El programa tiene dos modalidades: el Socio de Referencia identifica y contextualiza una oportunidad y acerca al cliente a TAG08; el Socio Comercial Activo también participa de forma continua en la relación comercial y la posventa." },
  "Qual é o valor da comissão oferecida?": { en: "What commission is offered?", es: "¿Cuál es el importe de la comisión?" },
  "Referral Partner: eligible recurring contracts qualify for ": { en: "For a Referral Partner, eligible recurring contracts qualify for ", es: "Para el Socio de Referencia, los contratos recurrentes elegibles dan derecho al " },
  " of the first monthly payment actually paid by the client and received by TAG08. ": { en: " of the first monthly payment actually paid by the client and received by TAG08. ", es: " de la primera mensualidad efectivamente pagada por el cliente y recibida por TAG08. " },
  "For an Active Commercial Partner, eligible recurring contracts qualify for the same ": { en: "For an Active Commercial Partner, eligible recurring contracts qualify for the same ", es: "Para el Socio Comercial Activo, los contratos recurrentes elegibles dan derecho al mismo " },
  " of the first monthly payment, plus ": { en: " of the first monthly payment, plus ", es: " de la primera mensualidad, más un " },
  " on eligible recurring revenue actually received starting ": { en: " on eligible recurring revenue actually received starting ", es: " sobre los ingresos recurrentes elegibles efectivamente recibidos a partir de " },
  " days after the first monthly payment, while the client and partner remain active and the partner maintains the expected commercial and post-sale involvement. ": { en: " days after the first monthly payment, while the client and partner remain active and the partner maintains the expected commercial and post-sale involvement. ", es: " días después del primer pago mensual, mientras el cliente y el socio sigan activos y el socio mantenga la participación comercial y de posventa esperada. " },
  "For one-time services, the Active Commercial Partner earns ": { en: "For one-time services, the Active Commercial Partner earns ", es: "Para los servicios puntuales, el Socio Comercial Activo recibe un " },
  " for services linked to Sebrae, a subsidy, or a program, and ": { en: " for services linked to Sebrae, a subsidy, or a program, and ", es: " para los servicios vinculados a Sebrae, subsidios o programas, y un " },
  " in other cases, on the first eligible installment received.": { en: " in other cases, on the first eligible installment received.", es: " en los demás casos, sobre la primera cuota elegible recibida." },
  "Como indico um novo cliente e garanto meu comissionamento?": { en: "How do I refer a new client and qualify for commission?", es: "¿Cómo refiero a un nuevo cliente y puedo optar a una comisión?" },
  "Apresente e contextualize a oportunidade e informe a modalidade de parceria. O reconhecimento depende da contribuição comercial efetiva, da aprovação da TAG08 e do recebimento da receita elegível; o registro ou a precedência de uma indicação, por si só, não garante comissão nem titularidade permanente sobre o cliente.": { en: "Introduce and contextualize the opportunity and state the partnership type. Recognition depends on an actual commercial contribution, TAG08 approval, and receipt of eligible revenue; registration or being the first to refer does not by itself guarantee commission or permanent ownership of the client.", es: "Presenta y contextualiza la oportunidad e indica la modalidad. El reconocimiento depende de una contribución comercial efectiva, la aprobación de TAG08 y el cobro de ingresos elegibles; el registro o la prioridad de una referencia, por sí solos, no garantizan comisión ni titularidad permanente sobre el cliente." },
  "Qual é o prazo e a forma de pagamento da comissão?": { en: "When and how is commission paid?", es: "¿Cuándo y cómo se paga la comisión?" },
  "A comissão só é devida quando a oportunidade tiver contribuição atribuível ao parceiro, for aprovada pela TAG08 e o valor elegível tiver sido efetivamente recebido. Forma e prazo de repasse devem constar do instrumento aplicável antes do início da parceria; esta página não promete um prazo de pagamento.": { en: "Commission is due only when the opportunity has a contribution attributable to the partner, is approved by TAG08, and the eligible amount has actually been received. The applicable agreement must specify the payment method and timing before the partnership begins; this page does not promise a payment date.", es: "La comisión solo se devenga cuando la oportunidad cuenta con una contribución atribuible al socio, TAG08 la aprueba y el importe elegible se ha cobrado efectivamente. El acuerdo aplicable debe especificar la forma y el plazo de pago antes de iniciar la alianza; esta página no promete una fecha de pago." },
  "Eu preciso fechar a venda com o cliente indicado?": { en: "Do I need to close the sale with the referred client?", es: "¿Tengo que cerrar la venta con el cliente referido?" },
  "No Parceiro de Indicação, a atuação é apresentar a oportunidade, contextualizar a necessidade e fazer a introdução; a TAG08 conduz proposta e contratação. No Parceiro Comercial Ativo, o parceiro também atua continuamente em prospecção, relacionamento, qualificação, acompanhamento e pós-venda, enquanto a TAG08 mantém a responsabilidade por aprovar e formalizar a oferta e o contrato.": { en: "A Referral Partner presents the opportunity, explains the need, and makes the introduction; TAG08 leads the proposal and contracting. An Active Commercial Partner also remains involved in prospecting, relationships, qualification, follow-up, and post-sale support, while TAG08 remains responsible for approving and formalizing the offer and contract.", es: "El Socio de Referencia presenta la oportunidad, contextualiza la necesidad y realiza la presentación inicial; TAG08 dirige la propuesta y la contratación. El Socio Comercial Activo también participa continuamente en prospección, relación, calificación, seguimiento y posventa, mientras TAG08 conserva la responsabilidad de aprobar y formalizar la oferta y el contrato." },
  "A parceria é exclusiva?": { en: "Is the partnership exclusive?", es: "¿La alianza es exclusiva?" },
  "Não. A parceria não reserva cidade, estado, região, nicho ou país. A indicação, por si só, também não cria titularidade permanente sobre uma conta que não se converteu.": { en: "No. The partnership does not reserve a city, state, region, niche, or country. A referral alone also does not create permanent ownership of an account that does not convert.", es: "No. La alianza no reserva ciudades, estados, regiones, nichos ni países. Una referencia por sí sola tampoco crea titularidad permanente sobre una cuenta que no se convierte." },
  "Primeira mensalidade": { en: "First monthly payment", es: "Primera mensualidad" },
  "Recorrência": { en: "Recurring commission", es: "Comisión recurrente" },
  "Serviço pontual vinculado a programa": { en: "One-time service linked to a program", es: "Servicio puntual vinculado a un programa" },
  "Outro serviço pontual": { en: "Other one-time service", es: "Otro servicio puntual" },
  "Informe um valor numérico válido.": { en: "Enter a valid number.", es: "Introduce un número válido." },
  "Informe um valor igual ou maior que zero.": { en: "Enter a value of zero or greater.", es: "Introduce un valor igual o superior a cero." },
  "Informe o valor com até duas casas decimais.": { en: "Enter no more than two decimal places.", es: "Introduce un valor con un máximo de dos decimales." },
  "Informe um número inteiro de dias.": { en: "Enter a whole number of days.", es: "Introduce un número entero de días." },
  "Informe zero ou mais dias.": { en: "Enter zero or more days.", es: "Introduce cero o más días." }
};

const localizeAffiliate = (source: string, locale: RouteLocale): string => {
  if (locale === "pt") return source;
  const translated = AFFILIATE_COPY[source]?.[locale];
  if (!translated) throw new Error(`Missing ${locale} affiliate copy for: ${source}`);
  return translated;
};

export default function ProgramaAfiliados({ onNavigate, contactHref, locale = "pt" }: ProgramaAfiliadosProps) {
  const t = (source: string) => localizeAffiliate(source, locale);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const trackedSimulatorActions = useRef(new Set<string>());
  
  const [modality, setModality] = useState<PartnershipModality>("referral");
  const [recurringFirstPaymentReceived, setRecurringFirstPaymentReceived] = useState("");
  const [activeRecurringRevenueReceived, setActiveRecurringRevenueReceived] = useState("");
  const [daysSinceFirstPayment, setDaysSinceFirstPayment] = useState("");
  const [clientIsActive, setClientIsActive] = useState(false);
  const [partnerIsActive, setPartnerIsActive] = useState(false);
  const [partnerCommercialActivityMaintained, setPartnerCommercialActivityMaintained] = useState(false);
  const [sebraeFirstInstallmentsReceived, setSebraeFirstInstallmentsReceived] = useState("");
  const [otherFirstInstallmentsReceived, setOtherFirstInstallmentsReceived] = useState("");

  const getAmountError = (value: string) => {
    if (!value.trim()) return null;
    const amount = Number(value);
    if (!Number.isFinite(amount)) return t("Informe um valor numérico válido.");
    if (amount < 0) return t("Informe um valor igual ou maior que zero.");
    if (!Number.isInteger(amount * 100)) return t("Informe o valor com até duas casas decimais.");
    return null;
  };
  const getDaysError = (value: string) => {
    if (!value.trim()) return null;
    const days = Number(value);
    if (!Number.isFinite(days) || !Number.isInteger(days)) return t("Informe um número inteiro de dias.");
    if (days < 0) return t("Informe zero ou mais dias.");
    return null;
  };
  const amountErrors = {
    recurringFirstPaymentReceived: getAmountError(recurringFirstPaymentReceived),
    activeRecurringRevenueReceived: getAmountError(activeRecurringRevenueReceived),
    sebraeFirstInstallmentsReceived: getAmountError(sebraeFirstInstallmentsReceived),
    otherFirstInstallmentsReceived: getAmountError(otherFirstInstallmentsReceived)
  };
  const daysError = getDaysError(daysSinceFirstPayment);
  const hasInputError = Boolean(
    amountErrors.recurringFirstPaymentReceived ||
    (modality === "active_commercial" && (daysError || amountErrors.activeRecurringRevenueReceived || amountErrors.sebraeFirstInstallmentsReceived || amountErrors.otherFirstInstallmentsReceived))
  );
  const hasEnteredAmount = [
    recurringFirstPaymentReceived,
    ...(modality === "active_commercial" ? [activeRecurringRevenueReceived, sebraeFirstInstallmentsReceived, otherFirstInstallmentsReceived] : [])
  ].some((value) => value.trim() !== "");
  const amountOrZero = (value: string) => value.trim() === "" ? 0 : Number(value);
  const daysOrZero = daysSinceFirstPayment.trim() === "" ? 0 : Number(daysSinceFirstPayment);

  const recurringEligibility = {
    modality,
    recurringFirstPaymentReceived: amountOrZero(recurringFirstPaymentReceived),
    activeRecurringRevenueReceived: amountOrZero(activeRecurringRevenueReceived),
    daysSinceFirstPayment: daysOrZero,
    clientIsActive,
    partnerIsActive,
    partnerCommercialActivityMaintained,
    sebraeFirstInstallmentsReceived: amountOrZero(sebraeFirstInstallmentsReceived),
    otherFirstInstallmentsReceived: amountOrZero(otherFirstInstallmentsReceived)
  };
  const recurringCommissionEligible = isActiveRecurringCommissionEligible(recurringEligibility);
  const commission = calculateAffiliateCommission({
    ...recurringEligibility
  });
  const currencyLocale = locale === "en" ? "en" : locale === "es" ? "es" : "pt-BR";
  const formatCurrency = (amount: number) => amount.toLocaleString(currencyLocale, { style: "currency", currency: "BRL" });
  const formatPercent = (rate: number) => `${Math.round(rate * 100)}%`;
  const recurringFirstPaymentRate = formatPercent(AFFILIATE_COMMISSION_RATES.recurringFirstPayment);
  const activeRecurringRate = formatPercent(AFFILIATE_COMMISSION_RATES.activePartnerRecurring);
  const sebraeOneTimeRate = formatPercent(AFFILIATE_COMMISSION_RATES.sebraeOneTime);
  const otherOneTimeRate = formatPercent(AFFILIATE_COMMISSION_RATES.otherOneTime);
  const recurringStartAfterDays = AFFILIATE_COMMISSION_RATES.recurringStartAfterDays;
  const resultAnnouncement = [
    recurringFirstPaymentReceived.trim() !== "" && `${t("Primeira mensalidade")}: ${formatCurrency(commission.recurringFirstPaymentCommission)}.`,
    modality === "active_commercial" && activeRecurringRevenueReceived.trim() !== "" && `${t("Recorr\u00eancia")}: ${formatCurrency(commission.activeRecurringCommission)} ${t("/m\u00eas")}.`,
    modality === "active_commercial" && sebraeFirstInstallmentsReceived.trim() !== "" && `${t("Servi\u00e7o pontual vinculado a programa")}: ${formatCurrency(commission.sebraeOneTimeCommission)}.`,
    modality === "active_commercial" && otherFirstInstallmentsReceived.trim() !== "" && `${t("Outro servi\u00e7o pontual")}: ${formatCurrency(commission.otherOneTimeCommission)}.`,
  ].filter(Boolean).join(" ");

  const trackAffiliateSimulator = (action: "input_changed" | "cta_clicked") => {
    const base = {
      simulator_id: "affiliate_commission",
      simulator_version: AFFILIATE_COMMISSION_RATES.version,
      page_path: "/programa-afiliados"
    };

    if (!trackedSimulatorActions.current.has("started")) {
      trackSimulatorEvent({ ...base, action: "started" });
      trackedSimulatorActions.current.add("started");
    }

    if (!trackedSimulatorActions.current.has(action)) {
      trackSimulatorEvent({ ...base, action });
      trackedSimulatorActions.current.add(action);
    }

    if (action === "input_changed" && !trackedSimulatorActions.current.has("result_viewed")) {
      trackSimulatorEvent({ ...base, action: "result_viewed" });
      trackedSimulatorActions.current.add("result_viewed");
    }
  };

  const faqs = [
    {
      q: t("Quem pode se cadastrar no Programa de Parceria?"),
      a: t("O programa tem duas modalidades: Parceiro de Indicação, que identifica e contextualiza uma oportunidade e aproxima o cliente da TAG08; e Parceiro Comercial Ativo, que também atua de forma contínua no relacionamento comercial e pós-venda.")
    },
    {
      q: t("Qual é o valor da comissão oferecida?"),
      a: `${t("Referral Partner: eligible recurring contracts qualify for ")}${recurringFirstPaymentRate}${t(" of the first monthly payment actually paid by the client and received by TAG08. ")}${t("For an Active Commercial Partner, eligible recurring contracts qualify for the same ")}${recurringFirstPaymentRate}${t(" of the first monthly payment, plus ")}${activeRecurringRate}${t(" on eligible recurring revenue actually received starting ")}${recurringStartAfterDays}${t(" days after the first monthly payment, while the client and partner remain active and the partner maintains the expected commercial and post-sale involvement. ")}${t("For one-time services, the Active Commercial Partner earns ")}${sebraeOneTimeRate}${t(" for services linked to Sebrae, a subsidy, or a program, and ")}${otherOneTimeRate}${t(" in other cases, on the first eligible installment received.")}`
    },
    {
      q: t("Como indico um novo cliente e garanto meu comissionamento?"),
      a: t("Apresente e contextualize a oportunidade e informe a modalidade de parceria. O reconhecimento depende da contribuição comercial efetiva, da aprovação da TAG08 e do recebimento da receita elegível; o registro ou a precedência de uma indicação, por si só, não garante comissão nem titularidade permanente sobre o cliente.")
    },
    {
      q: t("Qual é o prazo e a forma de pagamento da comissão?"),
      a: t("A comissão só é devida quando a oportunidade tiver contribuição atribuível ao parceiro, for aprovada pela TAG08 e o valor elegível tiver sido efetivamente recebido. Forma e prazo de repasse devem constar do instrumento aplicável antes do início da parceria; esta página não promete um prazo de pagamento.")
    },
    {
      q: t("Eu preciso fechar a venda com o cliente indicado?"),
      a: t("No Parceiro de Indicação, a atuação é apresentar a oportunidade, contextualizar a necessidade e fazer a introdução; a TAG08 conduz proposta e contratação. No Parceiro Comercial Ativo, o parceiro também atua continuamente em prospecção, relacionamento, qualificação, acompanhamento e pós-venda, enquanto a TAG08 mantém a responsabilidade por aprovar e formalizar a oferta e o contrato.")
    },
    {
      q: t("A parceria é exclusiva?"),
      a: t("Não. A parceria não reserva cidade, estado, região, nicho ou país. A indicação, por si só, também não cria titularidade permanente sobre uma conta que não se converteu.")
    }
  ];

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pb-20 relative overflow-hidden">
      {/* Ambient gradients */}
      <div className="absolute top-[8%] left-[-15%] w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] bg-brand/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Floating 3D background elements */}
      <Subtle3DCanvas intensity={1.5} className="absolute right-[-8%] top-[5%] w-[480px] h-[480px] opacity-[0.35] mix-blend-screen hidden lg:block" />

      {/* HERO SECTION */}
      <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 lg:items-center text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta self-start">
                {t("PROGRAMA DE PARCERIA")}</div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter">
                {t("FAÇA PARCERIAS,")}<br />
                <span className="text-brand-secondary">{t("RECEBA COMISSÕES POR INDICAÇÕES.")}</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-sm leading-relaxed font-sans font-medium">
                {t("Escolha entre apresentar uma oportunidade à TAG08 ou atuar continuamente na frente comercial. As modalidades têm responsabilidades e regras de remuneração diferentes, sempre condicionadas à aprovação e ao recebimento efetivo dos valores elegíveis.")}</p>
            </div>
          </div>

          {/* Large Hero Banner with Tilt animation */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[4/3] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <ResilientImage
                fallbackLabel={t("Programa de Parceria TAG08")}
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1600"
                alt={t("Programa de Parceria e parceiros comerciais TAG08")}
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1280px"
                className="w-full h-full object-cover grayscale brightness-40 transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.01]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent pointer-events-none" />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{ transform: "translateZ(45px)" }}>
                <a
                  href={contactHref}
                  onClick={() => trackCtaClick({ cta_name: "Iniciar conversa sobre parceria", cta_location: "affiliate-hero", cta_type: "internal", page_path: "/programa-afiliados" })}
                  className="group min-h-11 bg-brand-secondary text-black font-sans font-black text-xs uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] motion-safe:hover:scale-105 transition-[background-color,box-shadow,transform] duration-200 border border-brand-secondary hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-black flex items-center gap-2 cursor-pointer z-20"
                >
                  <span>{t("INICIAR CONVERSA SOBRE PARCERIA")}</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </a>
              </div>

              {/* Absolutes tags in corners */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="tag08-meta text-xs text-brand-secondary tracking-widest block uppercase font-bold">{t("ALTA PERFORMANCE E TRANSPARÊNCIA")}</span>
                  <p className="font-display font-black text-white text-xs sm:text-sm tracking-tight leading-none">{t("Comissões condicionadas às regras aprovadas")}</p>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-xs text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand motion-safe:animate-pulse" aria-hidden="true" />
                  <span>{t("SIMULAÇÃO ATUALIZADA")}</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">{recurringFirstPaymentRate}</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">{t("Da primeira mensalidade")}<br/>{t("recorrente elegível recebida")}</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">{activeRecurringRate}</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">{t("Só na modalidade ativa,")}<br/>{t("a partir de")}{" "}{recurringStartAfterDays} {t("dias")}</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">{sebraeOneTimeRate} / {otherOneTimeRate}</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">{t("Serviços pontuais")}<br/>{t("da modalidade ativa")}</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">{t("Aberta")}</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">{t("Sem exclusividade")}<br/>{t("territorial ou de nicho")}</span>
            </div>
          </div>

        </div>
      </section>

      {/* DYNAMIC COMMISSION CALCULATOR */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 text-left relative overflow-hidden">
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/[0.015] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">{t("SIMULADOR // CENÁRIO INFORMADO POR VOCÊ")}</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">{t("Simule um cenário de comissão")}</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">{t("Informe apenas valores elegíveis efetivamente pagos e recebidos. Para serviços pontuais, use a base de receita própria da TAG08 após as exclusões descritas no resultado. A simulação não promete contratação ou pagamento.")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-7 bg-charcoal-900 border border-white/[0.05] p-8 rounded-3xl space-y-8 flex flex-col justify-between">
              <fieldset className="space-y-3">
                <legend className="text-xs sm:text-sm font-sans text-zinc-300 font-bold uppercase">{t("Modalidade de parceria")}</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-start gap-3 p-4 rounded-2xl border border-white/[0.08] bg-charcoal-950 cursor-pointer">
                    <input type="radio" name="partnership-modality" value="referral" checked={modality === "referral"} onChange={() => { setModality("referral"); trackAffiliateSimulator("input_changed"); }} className="mt-1 accent-brand-secondary" />
                    <span><strong className="block text-sm text-white">{t("Parceiro de Indicação")}</strong><span className="block mt-1 text-xs text-zinc-400">{t("Apresenta e contextualiza a oportunidade; a TAG08 conduz proposta e contratação.")}</span></span>
                  </label>
                  <label className="flex items-start gap-3 p-4 rounded-2xl border border-white/[0.08] bg-charcoal-950 cursor-pointer">
                    <input type="radio" name="partnership-modality" value="active_commercial" checked={modality === "active_commercial"} onChange={() => { setModality("active_commercial"); trackAffiliateSimulator("input_changed"); }} className="mt-1 accent-brand-secondary" />
                    <span><strong className="block text-sm text-white">{t("Parceiro Comercial Ativo")}</strong><span className="block mt-1 text-xs text-zinc-400">{t("Atua continuamente em prospecção, relacionamento, qualificação, acompanhamento e pós-venda.")}</span></span>
                  </label>
                </div>
              </fieldset>

              <p className="text-xs leading-relaxed text-zinc-400">{t("Deixe em branco os tipos de receita que não fazem parte do cenário; informe 0 se a receita se aplica, mas não houve base elegível.")}</p>

              <div className="space-y-3">
                <label htmlFor="affiliate-recurring-first-payment" className="block text-xs sm:text-sm font-sans text-zinc-300 font-bold">{t("Valor da primeira mensalidade recorrente elegível, pago pelo cliente e recebido pela TAG08 (R$)")}</label>
                <input id="affiliate-recurring-first-payment" type="number" min="0" step="0.01" inputMode="decimal" value={recurringFirstPaymentReceived} aria-invalid={Boolean(amountErrors.recurringFirstPaymentReceived)} aria-describedby={amountErrors.recurringFirstPaymentReceived ? "affiliate-recurring-first-payment-error" : undefined} onChange={(event) => { setRecurringFirstPaymentReceived(event.target.value); trackAffiliateSimulator("input_changed"); }} className="w-full min-h-11 px-4 rounded-xl bg-charcoal-950 border border-white/[0.1] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary" />
                {amountErrors.recurringFirstPaymentReceived && <p id="affiliate-recurring-first-payment-error" role="alert" className="text-xs text-red-300">{amountErrors.recurringFirstPaymentReceived}</p>}
                <p className="text-xs text-zinc-400">{t("A comissão ilustrativa é ")}{recurringFirstPaymentRate} {t("desta base elegível para contrato recorrente aprovado.")}</p>
              </div>

              {modality === "active_commercial" && <>
                <fieldset className="space-y-3">
                  <legend className="block text-xs sm:text-sm font-sans text-zinc-300 font-bold">{t("Condições para simular a recorrência")}</legend>
                  <div className="space-y-2">
                    <label htmlFor="affiliate-days-since-first-payment" className="block text-xs font-sans text-zinc-300">{t("Dias desde o pagamento da primeira mensalidade")}</label>
                    <input id="affiliate-days-since-first-payment" type="number" min="0" step="1" inputMode="numeric" value={daysSinceFirstPayment} aria-invalid={Boolean(daysError)} aria-describedby={daysError ? "affiliate-days-since-first-payment-error" : undefined} onChange={(event) => { setDaysSinceFirstPayment(event.target.value); trackAffiliateSimulator("input_changed"); }} className="w-full min-h-11 px-4 rounded-xl bg-charcoal-950 border border-white/[0.1] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary" />
                    {daysError && <p id="affiliate-days-since-first-payment-error" role="alert" className="text-xs text-red-300">{daysError}</p>}
                  </div>
                  <label className="flex items-start gap-3 text-xs leading-relaxed text-zinc-300">
                    <input type="checkbox" checked={clientIsActive} onChange={(event) => { setClientIsActive(event.target.checked); trackAffiliateSimulator("input_changed"); }} className="mt-0.5 accent-brand-secondary" />
                    <span>{t("O cliente permanece ativo e gerou receita recorrente elegível efetivamente recebida.")}</span>
                  </label>
                  <label className="flex items-start gap-3 text-xs leading-relaxed text-zinc-300">
                    <input type="checkbox" checked={partnerIsActive} onChange={(event) => { setPartnerIsActive(event.target.checked); trackAffiliateSimulator("input_changed"); }} className="mt-0.5 accent-brand-secondary" />
                    <span>{t("O parceiro permanece ativo no Programa.")}</span>
                  </label>
                  <label className="flex items-start gap-3 text-xs leading-relaxed text-zinc-300">
                    <input type="checkbox" checked={partnerCommercialActivityMaintained} onChange={(event) => { setPartnerCommercialActivityMaintained(event.target.checked); trackAffiliateSimulator("input_changed"); }} className="mt-0.5 accent-brand-secondary" />
                    <span>{t("O parceiro mantém a atuação comercial e de pós-venda esperada.")}</span>
                  </label>
                </fieldset>
                <div className="space-y-3">
                  <label htmlFor="affiliate-active-recurring-revenue" className="block text-xs sm:text-sm font-sans text-zinc-300 font-bold">{t("Receita recorrente elegível efetivamente recebida (R$)")}</label>
                  <input id="affiliate-active-recurring-revenue" type="number" min="0" step="0.01" inputMode="decimal" value={activeRecurringRevenueReceived} aria-invalid={Boolean(amountErrors.activeRecurringRevenueReceived)} aria-describedby={amountErrors.activeRecurringRevenueReceived ? "affiliate-active-recurring-revenue-error" : undefined} onChange={(event) => { setActiveRecurringRevenueReceived(event.target.value); trackAffiliateSimulator("input_changed"); }} className="w-full min-h-11 px-4 rounded-xl bg-charcoal-950 border border-white/[0.1] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary" />
                  {amountErrors.activeRecurringRevenueReceived && <p id="affiliate-active-recurring-revenue-error" role="alert" className="text-xs text-red-300">{amountErrors.activeRecurringRevenueReceived}</p>}
                  <p className="text-xs text-zinc-400">{t("A comissão de ")}{activeRecurringRate} {t("só é calculada a partir do ")}{recurringStartAfterDays}{t("º dia quando todas as condições acima forem atendidas.")}</p>
                </div>
                <p className="text-xs leading-relaxed text-zinc-400">{t("Para serviços pontuais, informe somente a receita própria da TAG08 na primeira parcela recebida. Desconsidere tributos e retenções, descontos, mídia, custos de terceiros, hospedagem, ferramentas, despesas repassadas e reembolsos.")}</p>
                <div className="space-y-3">
                  <label htmlFor="affiliate-sebrae-first-installments" className="block text-xs sm:text-sm font-sans text-zinc-300 font-bold">{t("Base líquida da primeira parcela recebida em serviço pontual Sebrae/subsídio/programa (R$)")}</label>
                  <input id="affiliate-sebrae-first-installments" type="number" min="0" step="0.01" inputMode="decimal" value={sebraeFirstInstallmentsReceived} aria-invalid={Boolean(amountErrors.sebraeFirstInstallmentsReceived)} aria-describedby={amountErrors.sebraeFirstInstallmentsReceived ? "affiliate-sebrae-first-installments-error" : undefined} onChange={(event) => { setSebraeFirstInstallmentsReceived(event.target.value); trackAffiliateSimulator("input_changed"); }} className="w-full min-h-11 px-4 rounded-xl bg-charcoal-950 border border-white/[0.1] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary" />
                  {amountErrors.sebraeFirstInstallmentsReceived && <p id="affiliate-sebrae-first-installments-error" role="alert" className="text-xs text-red-300">{amountErrors.sebraeFirstInstallmentsReceived}</p>}
                  <p className="text-xs text-zinc-400">{t("Estimativa de ")}{sebraeOneTimeRate} {t("sobre a primeira parcela elegível recebida.")}</p>
                </div>
                <div className="space-y-3">
                  <label htmlFor="affiliate-other-first-installments" className="block text-xs sm:text-sm font-sans text-zinc-300 font-bold">{t("Base líquida da primeira parcela recebida em outros serviços pontuais (R$)")}</label>
                  <input id="affiliate-other-first-installments" type="number" min="0" step="0.01" inputMode="decimal" value={otherFirstInstallmentsReceived} aria-invalid={Boolean(amountErrors.otherFirstInstallmentsReceived)} aria-describedby={amountErrors.otherFirstInstallmentsReceived ? "affiliate-other-first-installments-error" : undefined} onChange={(event) => { setOtherFirstInstallmentsReceived(event.target.value); trackAffiliateSimulator("input_changed"); }} className="w-full min-h-11 px-4 rounded-xl bg-charcoal-950 border border-white/[0.1] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary" />
                  {amountErrors.otherFirstInstallmentsReceived && <p id="affiliate-other-first-installments-error" role="alert" className="text-xs text-red-300">{amountErrors.otherFirstInstallmentsReceived}</p>}
                  <p className="text-xs text-zinc-400">{t("Estimativa de ")}{otherOneTimeRate} {t("sobre a primeira parcela elegível recebida.")}</p>
                </div>
              </>}
            </div>

            <div className="lg:col-span-5 bg-gradient-to-b from-neutral-900 to-charcoal-900 border border-white/[0.08] p-8 rounded-3xl flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/[0.03] rounded-full blur-xl pointer-events-none" aria-hidden="true" />
              <div className="space-y-6 relative">
                <div>
                  <span className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest block font-bold leading-normal">{t("CENÁRIO ILUSTRATIVO")}</span>
                  <h3 className="font-display font-black text-2xl text-white tracking-tight leading-none mt-1">{t("Resultado do cenário")}</h3>
                </div>
                {hasInputError ? (
                  <p data-testid="affiliate-simulator-invalid-state" role="status" className="border-t border-white/[0.04] pt-4 text-sm text-zinc-300">{t("Corrija os campos destacados para ver uma estimativa confiável.")}</p>
                ) : !hasEnteredAmount ? (
                  <p data-testid="affiliate-simulator-empty-state" className="border-t border-white/[0.04] pt-4 text-sm text-zinc-300">{t("Informe ao menos uma base elegível recebida. Deixe em branco os tipos de receita que não fazem parte do cenário.")}</p>
                ) : (
                <div className="space-y-4 pt-4 border-t border-white/[0.04]">
                  {recurringFirstPaymentReceived.trim() !== "" && <div><span className="block text-xs text-zinc-400 tag08-meta uppercase tracking-widest leading-normal">{t("Comissão sobre a primeira mensalidade recorrente:")}</span><span data-testid="affiliate-first-payment-commission" className="block font-display font-black text-2xl sm:text-3xl text-white mt-1">{formatCurrency(commission.recurringFirstPaymentCommission)}</span></div>}
                  {modality === "active_commercial" && <>
                    {activeRecurringRevenueReceived.trim() !== "" && <div><span className="block text-xs text-zinc-400 tag08-meta uppercase tracking-widest leading-normal">{t("Comissão recorrente estimada a partir do dia ")}{recurringStartAfterDays}{t(", se elegível:")}</span><span data-testid="affiliate-active-recurring-commission" className="block font-display font-black text-2xl sm:text-3xl text-brand-secondary mt-1">{formatCurrency(commission.activeRecurringCommission)}{t("/mês")}</span></div>}
                    {sebraeFirstInstallmentsReceived.trim() !== "" && <div><span className="block text-xs text-zinc-400 tag08-meta uppercase tracking-widest leading-normal">{t("Serviços pontuais Sebrae/subsídio/programa (")}{sebraeOneTimeRate}):</span><span data-testid="affiliate-sebrae-one-time-commission" className="block font-display font-black text-xl text-white mt-1">{formatCurrency(commission.sebraeOneTimeCommission)}</span></div>}
                    {otherFirstInstallmentsReceived.trim() !== "" && <div><span className="block text-xs text-zinc-400 tag08-meta uppercase tracking-widest leading-normal">{t("Outros serviços pontuais (")}{otherOneTimeRate}):</span><span data-testid="affiliate-other-one-time-commission" className="block font-display font-black text-xl text-white mt-1">{formatCurrency(commission.otherOneTimeCommission)}</span></div>}
                    <p className="text-xs text-zinc-400">{t("A recorrência de ")}{activeRecurringRate} {t("não é vitalícia nem passiva: depende de contrato ativo, receita efetivamente recebida e atuação contínua do parceiro.")}</p>
                    <p className="text-xs text-zinc-400">{t("Para serviços pontuais, a base exclui impostos e retenções, descontos, mídia, custos de terceiros, hospedagem, ferramentas, despesas repassadas, reembolsos e valores que não representem receita própria da TAG08.")}</p>
                    {activeRecurringRevenueReceived.trim() !== "" && <p className="text-xs text-zinc-400">{recurringCommissionEligible ? t("As condi\u00e7\u00f5es informadas atendem ao marco e aos requisitos usados nesta simula\u00e7\u00e3o.") : `${t("A comiss\u00e3o recorrente permanece em zero at\u00e9 que o marco de ")}${recurringStartAfterDays}${t(" dias e todas as condi\u00e7\u00f5es sejam atendidos.")}`}</p>}
                  </>}
                  {modality === "referral" && <p className="text-xs text-zinc-400">{t("A modalidade de indicação não projeta comissão recorrente de ")}{activeRecurringRate} {t(" após ")}{recurringStartAfterDays} {t(" dias nem comissão de serviço pontual.")}</p>}
                </div>
                )}
                {hasEnteredAmount && !hasInputError && <p data-testid="affiliate-result-announcement" className="sr-only" role="status" aria-live="polite" aria-atomic="true">{resultAnnouncement}</p>}
              </div>
              <div className="pt-8 space-y-4 relative">
                <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium">{t("A simulação usa exclusivamente os valores informados e não garante elegibilidade, contratação ou pagamento. A oportunidade precisa ser atribuível ao parceiro e aprovada pela TAG08; somente valores elegíveis efetivamente recebidos geram comissão. A parceria não é exclusiva.")}</p>
                <a href={contactHref} onClick={() => { trackAffiliateSimulator("cta_clicked"); trackCtaClick({ cta_name: "Falar sobre parceria", cta_location: "affiliate-simulator", cta_type: "internal", page_path: "/programa-afiliados" }); }} className="group min-h-11 w-full bg-brand-secondary text-black font-sans font-black text-xs uppercase tracking-widest py-3.5 px-6 rounded-full shadow-[0_15px_30px_rgba(var(--color-brand-secondary-rgb),0.15)] flex items-center justify-center gap-1.5 motion-safe:hover:scale-[1.02] transition-[background-color,box-shadow,transform] duration-200 cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900"><span>{t("FALAR SOBRE PARCERIA")}</span><ArrowRight className="w-3.5 h-3.5" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY PARTNER WITH US? */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-bold">{t("VANTAGENS COMPETITIVAS")}</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">{t("Vantagens de ser Parceiro TAG08")}</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              {t("A TAG08 valida a oferta, o escopo e a formalização com o cliente; a participação do parceiro varia conforme a modalidade.")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-charcoal-900 border border-white/[0.06] rounded-3xl p-8 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Percent className="w-5 h-5 text-brand" />
              </div>
              <h3 className="text-white font-display font-bold text-sm">{t("Modalidades com regras distintas")}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium">
                {t("No Parceiro de Indicação, a atuação é apresentar e contextualizar a oportunidade e fazer a introdução. A TAG08 conduz a proposta e a contratação.")}</p>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.06] rounded-3xl p-8 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-brand-secondary" />
              </div>
              <h3 className="text-white font-display font-bold text-sm">{t("Atuação comercial ativa")}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium">
                {t("O Parceiro Comercial Ativo acompanha prospecção, relacionamento, qualificação, negociação comercial, pós-venda e cuidado da conta. Não define preço, oferta, escopo ou condições comerciais da TAG08.")}</p>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.06] rounded-3xl p-8 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Shield className="w-5 h-5 text-brand" />
              </div>
              <h3 className="text-white font-display font-bold text-sm">{t("Sem exclusividade")}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium">
                {t("A parceria não reserva território ou nicho. O reconhecimento de comissão depende da contribuição registrada, aprovação da TAG08 e recebimento do valor elegível.")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS FLUX */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-900/30 text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              {t("FLUXOGRAMA OPERACIONAL // PASSO A PASSO")}</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">{t("Como funciona a parceria")}</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              {t("As oportunidades são registradas e avaliadas pela TAG08. A modalidade escolhida define a participação comercial e as regras aplicáveis.")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", term: t("ESCOLHA DA MODALIDADE"), desc: t("Indique se sua participação será como Parceiro de Indicação ou Parceiro Comercial Ativo.") },
              { num: "02", term: t("REGISTRO DA OPORTUNIDADE"), desc: t("A oportunidade e a contribuição do parceiro precisam ser registradas para análise da TAG08.") },
              { num: "03", term: t("APROVAÇÃO E CONTRATAÇÃO"), desc: t("A TAG08 avalia a oportunidade, aprova a oferta e formaliza o contrato diretamente com o cliente.") },
              { num: "04", term: t("APURAÇÃO DA COMISSÃO"), desc: t("A comissão é apurada conforme a modalidade, as condições vigentes e os valores elegíveis efetivamente recebidos.") }
            ].map((step, sIdx) => (
              <div key={sIdx} className="bg-charcoal-900 border border-white/[0.04] p-6 rounded-2xl space-y-4 flex flex-col justify-between relative hover:border-brand/20 transition-[border-color] duration-200">
                <span className="font-display font-black text-3xl text-brand-secondary">{step.num}</span>
                <div className="space-y-1">
                  <h3 className="text-white tag08-meta text-xs tracking-wider font-bold">{step.term}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="px-4 sm:px-6 md:px-8 py-24 max-w-4xl mx-auto space-y-12 text-left">
        <div className="text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-brand mx-auto" />
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">{t("DÚVIDAS FREQUENTES SOBRE O PROGRAMA")}</h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-medium">
            {t("Confira os detalhes do Programa de Parceria e tire suas dúvidas sobre o acompanhamento das indicações.")}</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, fIdx) => (
            <div 
              key={fIdx} 
              className="border border-white/[0.04] bg-charcoal-900 rounded-2xl overflow-hidden hover:border-brand/20 transition-[border-color] duration-200"
            >
              <h3 className="m-0">
                <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === fIdx ? null : fIdx)}
                id={`affiliate-faq-question-${fIdx}`}
                aria-expanded={activeFaq === fIdx}
                aria-controls={`affiliate-faq-panel-${fIdx}`}
                className="min-h-11 w-full p-6 text-left flex items-center justify-between text-white font-display font-semibold text-xs sm:text-sm uppercase tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset cursor-pointer"
                >
                <span>{faq.q}</span>
                <span aria-hidden="true" className="text-brand font-sans text-lg shrink-0 ml-4 font-bold">
                  {activeFaq === fIdx ? "−" : "+"}
                </span>
                </button>
              </h3>
              
              {activeFaq === fIdx && (
                <div id={`affiliate-faq-panel-${fIdx}`} role="region" aria-labelledby={`affiliate-faq-question-${fIdx}`} className="px-6 pb-6 text-zinc-400 text-xs sm:text-xs font-sans leading-relaxed border-t border-white/[0.02] pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <ServiceInsightsBridge servicePath="/programa-afiliados" onNavigate={onNavigate} />

      {/* FINAL CALL TO ACTION CARD */}
      <section className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto pt-8">
        <div className="border border-white/[0.08] bg-gradient-to-br from-charcoal-900 to-black rounded-[32px] p-8 sm:p-12 md:p-16 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-20%] w-[450px] h-[450px] bg-brand/10 blur-[130px] rounded-full pointer-events-none" />
          
          <span className="tag08-meta text-xs text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/20 px-3 py-1 rounded-full uppercase tracking-widest font-black inline-block z-10">
            {t("AUMENTE SUA RECEITA COM MENOS BUROCRACIA")}</span>
          
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tighter leading-tight max-w-3xl mx-auto z-10">
            {t("PRONTO PARA ENTRAR NO")}{" "}<span className="text-brand-secondary">{t("PROGRAMA DE PARCERIA?")}</span>
          </h2>
          
          <p className="text-zinc-400 text-xs sm:text-sm font-medium max-w-2xl mx-auto z-10 leading-relaxed">
            {t("Cadastre-se como parceiro, entenda as regras de comissionamento e envie sua primeira oportunidade para a equipe da TAG08.")}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 z-10 relative">
            <a
              href={contactHref}
              onClick={() => trackCtaClick({ cta_name: "Entrar no Programa de Parceria", cta_location: "affiliate-final-cta", cta_type: "internal", page_path: "/programa-afiliados" })}
              className="group min-h-11 bg-brand-secondary text-black font-sans font-black text-xs uppercase tracking-widest py-4 px-10 rounded-full shadow-[0_20px_50px_rgba(var(--color-brand-secondary-rgb),0.3)] motion-safe:hover:scale-[1.02] transition-[background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 flex items-center gap-2 cursor-pointer"
            >
              <span>{t("CONVERSAR SOBRE PARCERIA")}</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
