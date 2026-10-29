import { useRef, useState } from "react";
import ResilientImage from "../../../components/ResilientImage";
import { ArrowUpRight, Shield, ArrowRight, Percent, TrendingUp, HelpCircle } from "lucide-react";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import { trackCtaClick, trackSimulatorEvent } from "../../../lib/analytics";
import { AFFILIATE_COMMISSION_RATES, calculateAffiliateCommission, isActiveRecurringCommissionEligible, type PartnershipModality } from "../../../lib/simulators/affiliateCommission";

interface ProgramaAfiliadosProps {
  onNavigate: (page: string) => void;
  contactHref: string;
}

export default function ProgramaAfiliados({ onNavigate, contactHref }: ProgramaAfiliadosProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const trackedSimulatorActions = useRef(new Set<string>());
  
  const [modality, setModality] = useState<PartnershipModality>("referral");
  const [recurringFirstPaymentReceived, setRecurringFirstPaymentReceived] = useState(0);
  const [activeRecurringRevenueReceived, setActiveRecurringRevenueReceived] = useState(0);
  const [daysSinceFirstPayment, setDaysSinceFirstPayment] = useState(0);
  const [clientIsActive, setClientIsActive] = useState(false);
  const [partnerIsActive, setPartnerIsActive] = useState(false);
  const [partnerCommercialActivityMaintained, setPartnerCommercialActivityMaintained] = useState(false);
  const [sebraeFirstInstallmentsReceived, setSebraeFirstInstallmentsReceived] = useState(0);
  const [otherFirstInstallmentsReceived, setOtherFirstInstallmentsReceived] = useState(0);

  const recurringEligibility = {
    modality,
    recurringFirstPaymentReceived,
    activeRecurringRevenueReceived,
    daysSinceFirstPayment,
    clientIsActive,
    partnerIsActive,
    partnerCommercialActivityMaintained,
    sebraeFirstInstallmentsReceived,
    otherFirstInstallmentsReceived
  };
  const recurringCommissionEligible = isActiveRecurringCommissionEligible(recurringEligibility);
  const commission = calculateAffiliateCommission({
    ...recurringEligibility
  });
  const formatCurrency = (amount: number) => amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const formatPercent = (rate: number) => `${Math.round(rate * 100)}%`;
  const recurringFirstPaymentRate = formatPercent(AFFILIATE_COMMISSION_RATES.recurringFirstPayment);
  const activeRecurringRate = formatPercent(AFFILIATE_COMMISSION_RATES.activePartnerRecurring);
  const sebraeOneTimeRate = formatPercent(AFFILIATE_COMMISSION_RATES.sebraeOneTime);
  const otherOneTimeRate = formatPercent(AFFILIATE_COMMISSION_RATES.otherOneTime);
  const recurringStartAfterDays = AFFILIATE_COMMISSION_RATES.recurringStartAfterDays;

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
      q: "Quem pode se cadastrar no Programa de Parceria?",
      a: "O programa tem duas modalidades: Parceiro de Indicação, que identifica e contextualiza uma oportunidade e aproxima o cliente da TAG08; e Parceiro Comercial Ativo, que também atua de forma contínua no relacionamento comercial e pós-venda."
    },
    {
      q: "Qual é o valor da comissão oferecida?",
      a: `Na modalidade Parceiro de Indicação, contratos recorrentes elegíveis preveem ${recurringFirstPaymentRate} da primeira mensalidade efetivamente paga pelo cliente e recebida pela TAG08. Na modalidade Parceiro Comercial Ativo, contratos recorrentes elegíveis preveem os mesmos ${recurringFirstPaymentRate} da primeira mensalidade e ${activeRecurringRate} sobre a receita recorrente elegível recebida a partir de ${recurringStartAfterDays} dias, enquanto cliente e parceiro estiverem ativos e o parceiro mantiver a atuação comercial e de pós-venda. Em serviços pontuais, a comissão do Parceiro Comercial Ativo é de ${sebraeOneTimeRate} para serviços vinculados a Sebrae, subsídio ou programa e ${otherOneTimeRate} nos demais casos, sobre a primeira parcela elegível recebida.`
    },
    {
      q: "Como indico um novo cliente e garanto meu comissionamento?",
      a: "Apresente e contextualize a oportunidade e informe a modalidade de parceria. O reconhecimento depende da contribuição comercial efetiva, da aprovação da TAG08 e do recebimento da receita elegível; o registro ou a precedência de uma indicação, por si só, não garante comissão nem titularidade permanente sobre o cliente."
    },
    {
      q: "Qual é o prazo e a forma de pagamento da comissão?",
      a: "A comissão só é devida quando a oportunidade tiver contribuição atribuível ao parceiro, for aprovada pela TAG08 e o valor elegível tiver sido efetivamente recebido. Forma e prazo de repasse devem constar do instrumento aplicável antes do início da parceria; esta página não promete um prazo de pagamento."
    },
    {
      q: "Eu preciso fechar a venda com o cliente indicado?",
      a: "No Parceiro de Indicação, a atuação é apresentar a oportunidade, contextualizar a necessidade e fazer a introdução; a TAG08 conduz proposta e contratação. No Parceiro Comercial Ativo, o parceiro também atua continuamente em prospecção, relacionamento, qualificação, acompanhamento e pós-venda, enquanto a TAG08 mantém a responsabilidade por aprovar e formalizar a oferta e o contrato."
    },
    {
      q: "A parceria é exclusiva?",
      a: "Não. A parceria não reserva cidade, estado, região, nicho ou país. A indicação, por si só, também não cria titularidade permanente sobre uma conta que não se converteu."
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
                PROGRAMA DE PARCERIA
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter">
                FAÇA PARCERIAS, <br />
                <span className="text-brand-secondary">RECEBA COMISSÕES POR INDICAÇÕES.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-sm leading-relaxed font-sans font-medium">
                Escolha entre apresentar uma oportunidade à TAG08 ou atuar continuamente na frente comercial. As modalidades têm responsabilidades e regras de remuneração diferentes, sempre condicionadas à aprovação e ao recebimento efetivo dos valores elegíveis.
              </p>
            </div>
          </div>

          {/* Large Hero Banner with Tilt animation */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[4/3] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <ResilientImage
                fallbackLabel="Programa de Parceria TAG08"
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1600"
                alt="Programa de Parceria e parceiros comerciais TAG08"
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
                  <span>INICIAR CONVERSA SOBRE PARCERIA</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </a>
              </div>

              {/* Absolutes tags in corners */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="tag08-meta text-xs text-brand-secondary tracking-widest block uppercase font-bold">ALTA PERFORMANCE E TRANSPARÊNCIA</span>
                  <p className="font-display font-black text-white text-xs sm:text-sm tracking-tight leading-none">Comissões condicionadas às regras aprovadas</p>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-xs text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand motion-safe:animate-pulse" aria-hidden="true" />
                  <span>SIMULAÇÃO ATUALIZADA</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">{recurringFirstPaymentRate}</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">Da primeira mensalidade<br/>recorrente elegível recebida</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">{activeRecurringRate}</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">Só na modalidade ativa,<br/>a partir de {recurringStartAfterDays} dias</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">{sebraeOneTimeRate} / {otherOneTimeRate}</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">Serviços pontuais<br/>da modalidade ativa</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">Aberta</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">Sem exclusividade<br/>territorial ou de nicho</span>
            </div>
          </div>

        </div>
      </section>

      {/* DYNAMIC COMMISSION CALCULATOR */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 text-left relative overflow-hidden">
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/[0.015] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">SIMULADOR // CEN&Aacute;RIO INFORMADO POR VOC&Ecirc;</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">Simule um cen&aacute;rio de comiss&atilde;o</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">Informe apenas valores eleg&iacute;veis efetivamente pagos e recebidos. Para servi&ccedil;os pontuais, use a base de receita pr&oacute;pria da TAG08 ap&oacute;s as exclus&otilde;es descritas no resultado. A simula&ccedil;&atilde;o n&atilde;o promete contrata&ccedil;&atilde;o ou pagamento.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-7 bg-charcoal-900 border border-white/[0.05] p-8 rounded-3xl space-y-8 flex flex-col justify-between">
              <fieldset className="space-y-3">
                <legend className="text-xs sm:text-sm font-sans text-zinc-300 font-bold uppercase">Modalidade de parceria</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-start gap-3 p-4 rounded-2xl border border-white/[0.08] bg-charcoal-950 cursor-pointer">
                    <input type="radio" name="partnership-modality" value="referral" checked={modality === "referral"} onChange={() => { setModality("referral"); trackAffiliateSimulator("input_changed"); }} className="mt-1 accent-brand-secondary" />
                    <span><strong className="block text-sm text-white">Parceiro de Indica&ccedil;&atilde;o</strong><span className="block mt-1 text-xs text-zinc-400">Apresenta e contextualiza a oportunidade; a TAG08 conduz proposta e contrata&ccedil;&atilde;o.</span></span>
                  </label>
                  <label className="flex items-start gap-3 p-4 rounded-2xl border border-white/[0.08] bg-charcoal-950 cursor-pointer">
                    <input type="radio" name="partnership-modality" value="active_commercial" checked={modality === "active_commercial"} onChange={() => { setModality("active_commercial"); trackAffiliateSimulator("input_changed"); }} className="mt-1 accent-brand-secondary" />
                    <span><strong className="block text-sm text-white">Parceiro Comercial Ativo</strong><span className="block mt-1 text-xs text-zinc-400">Atua continuamente em prospec&ccedil;&atilde;o, relacionamento, qualifica&ccedil;&atilde;o, acompanhamento e p&oacute;s-venda.</span></span>
                  </label>
                </div>
              </fieldset>

              <div className="space-y-3">
                <label htmlFor="affiliate-recurring-first-payment" className="block text-xs sm:text-sm font-sans text-zinc-300 font-bold">Valor da primeira mensalidade recorrente eleg&iacute;vel, pago pelo cliente e recebido pela TAG08 (R$)</label>
                <input id="affiliate-recurring-first-payment" type="number" min="0" step="0.01" inputMode="decimal" value={recurringFirstPaymentReceived} onChange={(event) => { setRecurringFirstPaymentReceived(Number(event.target.value)); trackAffiliateSimulator("input_changed"); }} className="w-full min-h-11 px-4 rounded-xl bg-charcoal-950 border border-white/[0.1] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary" />
                <p className="text-xs text-zinc-400">A comiss&atilde;o ilustrativa &eacute; {recurringFirstPaymentRate} desta base eleg&iacute;vel para contrato recorrente aprovado.</p>
              </div>

              {modality === "active_commercial" && <>
                <fieldset className="space-y-3">
                  <legend className="block text-xs sm:text-sm font-sans text-zinc-300 font-bold">Condi&ccedil;&otilde;es para simular a recorr&ecirc;ncia</legend>
                  <div className="space-y-2">
                    <label htmlFor="affiliate-days-since-first-payment" className="block text-xs font-sans text-zinc-300">Dias desde o pagamento da primeira mensalidade</label>
                    <input id="affiliate-days-since-first-payment" type="number" min="0" step="1" inputMode="numeric" value={daysSinceFirstPayment} onChange={(event) => { setDaysSinceFirstPayment(Number(event.target.value)); trackAffiliateSimulator("input_changed"); }} className="w-full min-h-11 px-4 rounded-xl bg-charcoal-950 border border-white/[0.1] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary" />
                  </div>
                  <label className="flex items-start gap-3 text-xs leading-relaxed text-zinc-300">
                    <input type="checkbox" checked={clientIsActive} onChange={(event) => { setClientIsActive(event.target.checked); trackAffiliateSimulator("input_changed"); }} className="mt-0.5 accent-brand-secondary" />
                    <span>O cliente permanece ativo e gerou receita recorrente eleg&iacute;vel efetivamente recebida.</span>
                  </label>
                  <label className="flex items-start gap-3 text-xs leading-relaxed text-zinc-300">
                    <input type="checkbox" checked={partnerIsActive} onChange={(event) => { setPartnerIsActive(event.target.checked); trackAffiliateSimulator("input_changed"); }} className="mt-0.5 accent-brand-secondary" />
                    <span>O parceiro permanece ativo no Programa.</span>
                  </label>
                  <label className="flex items-start gap-3 text-xs leading-relaxed text-zinc-300">
                    <input type="checkbox" checked={partnerCommercialActivityMaintained} onChange={(event) => { setPartnerCommercialActivityMaintained(event.target.checked); trackAffiliateSimulator("input_changed"); }} className="mt-0.5 accent-brand-secondary" />
                    <span>O parceiro mantém a atua&ccedil;&atilde;o comercial e de p&oacute;s-venda esperada.</span>
                  </label>
                </fieldset>
                <div className="space-y-3">
                  <label htmlFor="affiliate-active-recurring-revenue" className="block text-xs sm:text-sm font-sans text-zinc-300 font-bold">Receita recorrente eleg&iacute;vel efetivamente recebida (R$)</label>
                  <input id="affiliate-active-recurring-revenue" type="number" min="0" step="0.01" inputMode="decimal" value={activeRecurringRevenueReceived} onChange={(event) => { setActiveRecurringRevenueReceived(Number(event.target.value)); trackAffiliateSimulator("input_changed"); }} className="w-full min-h-11 px-4 rounded-xl bg-charcoal-950 border border-white/[0.1] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary" />
                  <p className="text-xs text-zinc-400">A comiss&atilde;o de {activeRecurringRate} s&oacute; &eacute; calculada a partir do {recurringStartAfterDays}&ordm; dia quando todas as condi&ccedil;&otilde;es acima forem atendidas.</p>
                </div>
                <div className="space-y-3">
                  <label htmlFor="affiliate-sebrae-first-installments" className="block text-xs sm:text-sm font-sans text-zinc-300 font-bold">Base l&iacute;quida da primeira parcela recebida em servi&ccedil;o pontual Sebrae/subs&iacute;dio/programa (R$)</label>
                  <input id="affiliate-sebrae-first-installments" type="number" min="0" step="0.01" inputMode="decimal" value={sebraeFirstInstallmentsReceived} onChange={(event) => { setSebraeFirstInstallmentsReceived(Number(event.target.value)); trackAffiliateSimulator("input_changed"); }} className="w-full min-h-11 px-4 rounded-xl bg-charcoal-950 border border-white/[0.1] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary" />
                  <p className="text-xs text-zinc-400">Estimativa de {sebraeOneTimeRate} sobre a primeira parcela eleg&iacute;vel recebida.</p>
                </div>
                <div className="space-y-3">
                  <label htmlFor="affiliate-other-first-installments" className="block text-xs sm:text-sm font-sans text-zinc-300 font-bold">Base l&iacute;quida da primeira parcela recebida em outros servi&ccedil;os pontuais (R$)</label>
                  <input id="affiliate-other-first-installments" type="number" min="0" step="0.01" inputMode="decimal" value={otherFirstInstallmentsReceived} onChange={(event) => { setOtherFirstInstallmentsReceived(Number(event.target.value)); trackAffiliateSimulator("input_changed"); }} className="w-full min-h-11 px-4 rounded-xl bg-charcoal-950 border border-white/[0.1] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary" />
                  <p className="text-xs text-zinc-400">Estimativa de {otherOneTimeRate} sobre a primeira parcela eleg&iacute;vel recebida.</p>
                </div>
              </>}
            </div>

            <div className="lg:col-span-5 bg-gradient-to-b from-neutral-900 to-charcoal-900 border border-white/[0.08] p-8 rounded-3xl flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/[0.03] rounded-full blur-xl pointer-events-none" aria-hidden="true" />
              <div className="space-y-6 relative">
                <div>
                  <span className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest block font-bold leading-normal">CEN&Aacute;RIO ILUSTRATIVO</span>
                  <h3 className="font-display font-black text-2xl text-white tracking-tight leading-none mt-1">Valores estimados</h3>
                </div>
                <div className="space-y-4 pt-4 border-t border-white/[0.04]" aria-live="polite" aria-atomic="true">
                  <div><span className="block text-xs text-zinc-400 tag08-meta uppercase tracking-widest leading-normal">Comiss&atilde;o sobre a primeira mensalidade recorrente:</span><span data-testid="affiliate-first-payment-commission" className="block font-display font-black text-2xl sm:text-3xl text-white mt-1">{formatCurrency(commission.recurringFirstPaymentCommission)}</span></div>
                  {modality === "active_commercial" && <>
                    <div><span className="block text-xs text-zinc-400 tag08-meta uppercase tracking-widest leading-normal">Comiss&atilde;o recorrente estimada a partir do dia {recurringStartAfterDays}, se eleg&iacute;vel:</span><span data-testid="affiliate-active-recurring-commission" className="block font-display font-black text-2xl sm:text-3xl text-brand-secondary mt-1">{formatCurrency(commission.activeRecurringCommission)}/m&ecirc;s</span></div>
                    <div><span className="block text-xs text-zinc-400 tag08-meta uppercase tracking-widest leading-normal">Servi&ccedil;os pontuais Sebrae/subs&iacute;dio/programa ({sebraeOneTimeRate}):</span><span data-testid="affiliate-sebrae-one-time-commission" className="block font-display font-black text-xl text-white mt-1">{formatCurrency(commission.sebraeOneTimeCommission)}</span></div>
                    <div><span className="block text-xs text-zinc-400 tag08-meta uppercase tracking-widest leading-normal">Outros servi&ccedil;os pontuais ({otherOneTimeRate}):</span><span data-testid="affiliate-other-one-time-commission" className="block font-display font-black text-xl text-white mt-1">{formatCurrency(commission.otherOneTimeCommission)}</span></div>
                    <p className="text-xs text-zinc-400">A recorr&ecirc;ncia de {activeRecurringRate} n&atilde;o &eacute; vital&iacute;cia nem passiva: depende de contrato ativo, receita efetivamente recebida e atua&ccedil;&atilde;o cont&iacute;nua do parceiro.</p>
                    <p className="text-xs text-zinc-400">Para servi&ccedil;os pontuais, a base exclui impostos e reten&ccedil;&otilde;es, descontos, m&iacute;dia, custos de terceiros, hospedagem, ferramentas, despesas repassadas, reembolsos e valores que n&atilde;o representem receita pr&oacute;pria da TAG08.</p>
                    <p role="status" className="text-xs text-zinc-400">{recurringCommissionEligible ? "As condições informadas atendem ao marco e aos requisitos usados nesta simulação." : `A comissão recorrente permanece em zero até que o marco de ${recurringStartAfterDays} dias e todas as condições sejam atendidos.`}</p>
                  </>}
                  {modality === "referral" && <p className="text-xs text-zinc-400">A modalidade de indica&ccedil;&atilde;o n&atilde;o projeta comiss&atilde;o recorrente de {activeRecurringRate} ap&oacute;s {recurringStartAfterDays} dias nem comiss&atilde;o de servi&ccedil;o pontual.</p>}
                </div>
              </div>
              <div className="pt-8 space-y-4 relative">
                <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium">A simula&ccedil;&atilde;o usa exclusivamente os valores informados e n&atilde;o garante elegibilidade, contrata&ccedil;&atilde;o ou pagamento. A oportunidade precisa ser atribu&iacute;vel ao parceiro e aprovada pela TAG08; somente valores eleg&iacute;veis efetivamente recebidos geram comiss&atilde;o. A parceria n&atilde;o &eacute; exclusiva.</p>
                <a href={contactHref} onClick={() => { trackAffiliateSimulator("cta_clicked"); trackCtaClick({ cta_name: "Falar sobre parceria", cta_location: "affiliate-simulator", cta_type: "internal", page_path: "/programa-afiliados" }); }} className="group min-h-11 w-full bg-brand-secondary text-black font-sans font-black text-xs uppercase tracking-widest py-3.5 px-6 rounded-full shadow-[0_15px_30px_rgba(var(--color-brand-secondary-rgb),0.15)] flex items-center justify-center gap-1.5 motion-safe:hover:scale-[1.02] transition-[background-color,box-shadow,transform] duration-200 cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900"><span>FALAR SOBRE PARCERIA</span><ArrowRight className="w-3.5 h-3.5" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY PARTNER WITH US? */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-bold">VANTAGENS COMPETITIVAS</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">Vantagens de ser Parceiro TAG08</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              A TAG08 valida a oferta, o escopo e a formalização com o cliente; a participação do parceiro varia conforme a modalidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-charcoal-900 border border-white/[0.06] rounded-3xl p-8 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Percent className="w-5 h-5 text-brand" />
              </div>
              <h3 className="text-white font-display font-bold text-sm">Modalidades com regras distintas</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium">
                No Parceiro de Indicação, a atuação é apresentar e contextualizar a oportunidade e fazer a introdução. A TAG08 conduz a proposta e a contratação.
              </p>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.06] rounded-3xl p-8 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-brand-secondary" />
              </div>
              <h3 className="text-white font-display font-bold text-sm">Atuação comercial ativa</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium">
                O Parceiro Comercial Ativo acompanha prospecção, relacionamento, qualificação, negociação comercial, pós-venda e cuidado da conta. Não define preço, oferta, escopo ou condições comerciais da TAG08.
              </p>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.06] rounded-3xl p-8 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Shield className="w-5 h-5 text-brand" />
              </div>
              <h3 className="text-white font-display font-bold text-sm">Sem exclusividade</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium">
                A parceria não reserva território ou nicho. O reconhecimento de comissão depende da contribuição registrada, aprovação da TAG08 e recebimento do valor elegível.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS FLUX */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-900/30 text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              FLUXOGRAMA OPERACIONAL // PASSO A PASSO
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">Como funciona a parceria</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              As oportunidades são registradas e avaliadas pela TAG08. A modalidade escolhida define a participação comercial e as regras aplicáveis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", term: "ESCOLHA DA MODALIDADE", desc: "Indique se sua participação será como Parceiro de Indicação ou Parceiro Comercial Ativo." },
              { num: "02", term: "REGISTRO DA OPORTUNIDADE", desc: "A oportunidade e a contribuição do parceiro precisam ser registradas para análise da TAG08." },
              { num: "03", term: "APROVAÇÃO E CONTRATAÇÃO", desc: "A TAG08 avalia a oportunidade, aprova a oferta e formaliza o contrato diretamente com o cliente." },
              { num: "04", term: "APURAÇÃO DA COMISSÃO", desc: "A comissão é apurada conforme a modalidade, as condições vigentes e os valores elegíveis efetivamente recebidos." }
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
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">DÚVIDAS FREQUENTES SOBRE O PROGRAMA</h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-medium">
            Confira os detalhes do Programa de Parceria e tire suas dúvidas sobre o acompanhamento das indicações.
          </p>
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
            AUMENTE SUA RECEITA COM MENOS BUROCRACIA
          </span>
          
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tighter leading-tight max-w-3xl mx-auto z-10">
            PRONTO PARA ENTRAR NO <span className="text-brand-secondary">PROGRAMA DE PARCERIA?</span>
          </h2>
          
          <p className="text-zinc-400 text-xs sm:text-sm font-medium max-w-2xl mx-auto z-10 leading-relaxed">
            Cadastre-se como parceiro, entenda as regras de comissionamento e envie sua primeira oportunidade para a equipe da TAG08.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 z-10 relative">
            <a
              href={contactHref}
              onClick={() => trackCtaClick({ cta_name: "Entrar no Programa de Parceria", cta_location: "affiliate-final-cta", cta_type: "internal", page_path: "/programa-afiliados" })}
              className="group min-h-11 bg-brand-secondary text-black font-sans font-black text-xs uppercase tracking-widest py-4 px-10 rounded-full shadow-[0_20px_50px_rgba(var(--color-brand-secondary-rgb),0.3)] motion-safe:hover:scale-[1.02] transition-[background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 flex items-center gap-2 cursor-pointer"
            >
              <span>CONVERSAR SOBRE PARCERIA</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
