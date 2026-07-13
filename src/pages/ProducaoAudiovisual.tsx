import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, ArrowRight, ArrowUpRight, Camera, Video, Film, Sparkles, 
  Layers, Play, PlayCircle, Eye, Settings, Clock, ShieldCheck, 
  Smartphone, Monitor, ChevronDown, MessageSquare, Award, Tv,
  ListPlus, Plus, Info, HelpCircle
} from "lucide-react";
import ThreeDimensionalTilt from "../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../components/Subtle3DCanvas";
import MiniCases from "../components/MiniCases";
import { buildBrazilWhatsAppUrl } from "../config/siteNetwork";

interface Deliverable {
  id: string;
  name: string;
  category: "digital" | "event" | "inst" | "ads";
  desc: string;
}

const DELIVERABLES: Deliverable[] = [
  { id: "aftermovie", name: "Aftermovie do Evento", category: "event", desc: "VÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­deo cinematogrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡fico com os melhores momentos emocionais e tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnicos." },
  { id: "reels", name: "Reels de Alto Impacto", category: "digital", desc: "Formatos rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pidos (9:16) pensados para alcance qualificado e boa retenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o." },
  { id: "cortes", name: "Cortes de Falas & Palestras", category: "digital", desc: "Falas impactantes editadas dinamicamente com legendas premium." },
  { id: "depoimentos", name: "Depoimentos de Clientes (Social Proof)", category: "event", desc: "Entrevistas rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pidas colhendo feedbacks espontÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½neos ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºteis para a prova social." },
  { id: "institucional", name: "VÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­deo Resumo Institucional", category: "inst", desc: "ApresentaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o executiva sÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³bria direcionada ao investidor corporativo." },
  { id: "teaser", name: "Teaser PrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©/PÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³s Evento", category: "event", desc: "Gatilho de expectativa ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©pico para ancorar as campanhas de marketing." },
  { id: "stories", name: "Stories DinÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢micos em Tempo Real", category: "digital", desc: "CaptaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½pida para publicaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½o em tempo de execuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½o das atividades." },
  { id: "anuncios", name: "VariaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes para TrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡fego Pago (Ads)", category: "ads", desc: "Criativos com ganchos fortes adaptados especificamente para conversÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o." },
  { id: "banco", name: "Banco de Imagens Exclusivo", category: "inst", desc: "Recortes em alta resoluÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de equipe, infraestrutura e processos de entrega." }
];

interface Formato {
  id: string;
  name: string;
  tag: string;
  desc: string;
  features: string[];
}

const FORMATOS: Formato[] = [
  {
    id: "essencial",
    name: "ConteÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºdo Essencial",
      tag: "GRAVAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ES PONTUAIS OU REDES",
    desc: "Perfeito para marcas pessoais, gravaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes pontuais de estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºdio e bastidores internos das marcas.",
    features: [
      "GravaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o sob demanda e rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pida",
      "Bastidores e produÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pida",
      "Foco em Reels e Shorts verticais",
      "Roteiro bÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡sico de direÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o"
    ]
  },
  {
    id: "cobertura",
    name: "Cobertura EstratÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©gica",
      tag: "EVENTOS E ATIVAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ES",
    desc: "Desenvolvido para eventos corporativos de mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©dio e grande porte, palestras, ativaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes de patrocinadores e lanÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§amentos.",
    features: [
      "Mapeamento tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡tico do cronograma antes",
      "Foco em depoimentos e aftermovie",
      "Entrega ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡gil para aproveitamento",
      "Teaser do evento em alta energia"
    ]
  },
  {
    id: "completa",
    name: "ProduÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Executiva Completa",
    tag: "END-TO-END SYSTEM",
    desc: "Nossa entrega mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡xima de ponta a ponta. Planejamento estratÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©gico, roteirizaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o, mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºltiplos formatos de captaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o e planos estritos de distribuiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o contÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­nua.",
    features: [
      "DireÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o sÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªnior de narrativa",
      "Roteiros detalhados e marcaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de cena",
      "CaptaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes cinematogrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ficas sob medida",
      "AdaptaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o para mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºltiplos canais comerciais"
    ]
  }
];

interface FAQCategory {
  id: number;
  title: string;
}

const faqCategories: FAQCategory[] = [
  { id: 0, title: "ESCOPO & EXPERT" },
  { id: 1, title: "ENTREGAS E CORTES" },
  { id: 2, title: "ROTEIRO E DIREÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O" },
  { id: 3, title: "DESLOCAMENTO BR" },
  { id: 4, title: "FILMAGEM VS EDIÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O" }
];

const faqQuestions = [
  "A TAG08 faz apenas filmagem ou tambÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©m a ediÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o contÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­nua?",
  "Como funcionam as entregas de vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­deos curtos em formato Reels e Stories?",
  "Existe roteirizaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o prÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©via e marcaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o antes do inÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­cio das gravaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes?",
  "A TAG08 atende fora do polo base? Quais taxas extras de viagem incidem?",
  "Posso contratar a TAG08 apenas para pÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³s-produÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o ou ediÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de material ja captado?"
];

const faqAnswers = [
  "Nossa atuaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ de ponta a ponta. NÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o somos simples operadores de cÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢mera: desenhamos a estratÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©gia de posicionamento, roteirizamos, dirigimos a gravaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o, realizamos a captaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½udio e vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­deo em qualidade de cinema, tratamos cor, editamos cortes estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ticos e dinÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢micos de alta velocidade e estruturamos as legendas premium.",
  "Totalmente inclusos dentro do planejamento estratÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©gico. Criamos ganchos fortes nos primeiros 3 segundos do vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­deo, aplicando quebras de padrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o e legendas elegantes para boa retenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o nas redes sociais, integradas ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tica do seu branding.",
  "Sim. Antes de ligarmos qualquer equipamento de captaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o, construÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­mos um cronograma tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡tico integrado. Mapeamos os pontos focais obrigatÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rios do evento corporativo ou da produÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºdio, preparamos roteiro tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnico de perguntas para colher depoimentos isentos de dor e definimos as referÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias de corte.",
  "Atendemos em todo o territÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rio nacional. Nossas operaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes principais abrangem projetos com logÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­stica coordenada. Custos adicionais de transporte terrestre/aÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©reo, seguro de equipamentos e ajuda de custo de hospedagem e alimentaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o sÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o acordados de forma transparente direto no escopo contratual.",
  "Sim. Para marcas e eventos com grandes acervos raw histÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³ricos de gravaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o, oferecemos a modalidade de consultoria pÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³s-editorial e design de narrativa rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pida. Criamos novos roteiros tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ticos, aplicamos cortes rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pidos adaptados em novas copys, inserimos legendas modernas e refinamos a identidade sonora para reaproveitar seu acervo."
];

interface ProducaoProps {
  onNavigate: (page: string) => void;
}

export default function ProducaoAudiovisual({ onNavigate }: ProducaoProps) {
  const [activeFaq, setActiveFaq] = useState<number>(0);
  
  // Custom calculator states
  const [selectedFormat, setSelectedFormat] = useState<string>("cobertura");
  const [selectedTools, setSelectedTools] = useState<string[]>(["aftermovie", "reels", "depoimentos"]);

  const handleToggleTool = (toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(t => t !== toolId) 
        : [...prev, toolId]
    );
  };

  const currentFormatDetails = FORMATOS.find(f => f.id === selectedFormat) || FORMATOS[1];

  const getWhatsAppLink = () => {
    const formatName = currentFormatDetails.name.toUpperCase();
    const deliverablesList = selectedTools
      .map(id => DELIVERABLES.find(d => d.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    const message = `OlÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ TAG08! Configurei minha proposta tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnica usando o simulador inteligente de produÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o audiovisual e cheguei no seguinte setup:
  
 - FORMATO DE CONTRATAÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½!ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½O: ${formatName}
 - ENTREGÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂVEIS DESEJADOS: ${deliverablesList}

Gostaria de agendar minha sessÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de clareza de 30 minutos com um diretor de produÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o audiovisual para viabilizar as diÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rias e o plano orÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§amentÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio.`;

    return buildBrazilWhatsAppUrl(message);
  };

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-[8%] left-[-10%] w-[580px] h-[580px] bg-brand/[0.015] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[25%] right-[-12%] w-[580px] h-[580px] bg-brand/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Floating 3D Geometric Mesh for Tech/Artistic Authority */}
      <Subtle3DCanvas intensity={1.5} className="absolute right-[-8%] top-[5%] w-[480px] h-[480px] opacity-[0.35] mix-blend-screen hidden lg:block animate-pulse-slow" />

      {/*=========================================
          SECTION 1: HERO - THE CINEMATIC SYSTEM
         =========================================*/}
      <section className="px-6 md:px-8 py-12 md:py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-baseline text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono">
                ProduÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o Audiovisual
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter uppercase font-display">
                Narrativa audiovisual com <br />
                <span className="text-brand">presenÃƒÆ’Ã‚Â§a e funÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o estratÃƒÆ’Ã‚Â©gica.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-[15px] leading-relaxed font-sans font-medium">
                A TAG08 transforma presenÃƒÆ’Ã‚Â§a, fala, ambiente, bastidores e eventos em conteÃƒÆ’Ã‚Âºdo com clareza, estÃƒÆ’Ã‚Â©tica e funÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o estratÃƒÆ’Ã‚Â©gica. Antes de gravar, entendemos o contexto da marca, os usos do material e os formatos que precisam sustentar comunicaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o, portfÃƒÆ’Ã‚Â³lio e relacionamento.
              </p>
            </div>
          </div>

          {/* Epic Widescreen Cinematic Image Banner with Hover badging */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px]">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.35/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <img 
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1600"
                alt="ProduÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o Audiovisual TAG08"
                className="w-full h-full object-cover grayscale brightness-40 group-hover:scale-[1.02] transition-all duration-1000 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent pointer-events-none" />

              {/* Central Floating Callout */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{ transform: "translateZ(50px)" }}>
                <a
                  href="#planner"
                  className="bg-brand-secondary text-black font-mono font-black text-[9.5px] sm:text-[10.5px] uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.3)] hover:scale-105 duration-300 transition-all border border-brand-secondary hover:bg-brand-dark flex items-center gap-2 cursor-pointer z-20"
                >
                  <span>PLANEJAR MEU AUDIOVISUAL</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </a>
              </div>

              {/* Bottom detail row */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="font-mono text-[8.5px] text-brand-secondary tracking-widest block uppercase font-bold">TAG08 AUDIOVISUAL</span>
                  <h4 className="font-display font-black text-white text-xs sm:text-sm uppercase tracking-tight leading-none">Narrativa, presenÃƒÆ’Ã‚Â§a e conteÃƒÆ’Ã‚Âºdo com direÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o</h4>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-[8.5px] text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
                  <span>CaptaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o, ediÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o e distribuiÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o para uso recorrente</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* Hero benefit cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-2 text-left border-t border-white/[0.04]">
            <div className="space-y-1.5">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Narrativa</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Capta fala, bastidores e ambiente<br/>com intenÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o editorial</span>
            </div>
            <div className="space-y-1.5">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">Clareza</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Organiza o material para apoiar<br/>apresentaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o, redes e site</span>
            </div>
            <div className="space-y-1.5">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">AplicaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">PeÃƒÆ’Ã‚Â§as pensadas para uso recorrente<br/>e consistente</span>
            </div>
            <div className="space-y-1.5">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">Continuidade</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">ConteÃƒÆ’Ã‚Âºdo ÃƒÆ’Ã‚Âºtil depois da gravaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o<br/>e da ediÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o</span>
            </div>
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 2: PROBLEM PANEL (Muitas marcas registram momentos, mas...)
         =========================================*/}
      <section className="px-6 md:px-8 py-20 bg-charcoal-900/15 border-b border-white/[0.04] text-left relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl">
            <div className="space-y-3">
              <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
                Sinais de desalinhamento audiovisual
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tighter">
                Quando o vÃƒÂ­deo existe, mas ainda nÃƒÂ£o sustenta a marca.
              </h2>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Muitas marcas produzem vÃƒÂ­deo, mas seguem com material sem intenÃƒÂ§ÃƒÂ£o clara, sem narrativa definida, sem formato adequado ou sem reaproveitamento consistente. O problema nem sempre ÃƒÂ© falta de vÃƒÂ­deo. Muitas vezes ÃƒÂ© falta de intenÃƒÂ§ÃƒÂ£o, narrativa, formato e continuidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {[
              {
                title: "Registro sem intenÃƒÂ§ÃƒÂ£o",
                desc: "O material mostra o que aconteceu, mas nÃƒÂ£o ajuda a marca a comunicar uma ideia, uma postura ou um contexto com mais clareza."
              },
              {
                title: "Fala sem direÃƒÂ§ÃƒÂ£o",
                desc: "Depoimentos, bastidores e cenas sÃƒÂ£o gravados sem um eixo editorial claro, o que enfraquece a leitura do conteÃƒÂºdo."
              },
              {
                title: "Formato ÃƒÂºnico para tudo",
                desc: "O mesmo vÃƒÂ­deo tenta servir redes, site, apresentaÃƒÂ§ÃƒÂ£o e evento sem adaptaÃƒÂ§ÃƒÂ£o para cada ponto de contato."
              },
              {
                title: "Bastidores sem reaproveitamento",
                desc: "O conteÃƒÂºdo fica parado depois da gravaÃƒÂ§ÃƒÂ£o e nÃƒÂ£o vira cortes, trechos ou peÃƒÂ§as de apoio para a comunicaÃƒÂ§ÃƒÂ£o da marca."
              },
              {
                title: "EdiÃƒÂ§ÃƒÂ£o sem contexto",
                desc: "A montagem existe, mas nÃƒÂ£o conversa com posicionamento, linguagem ou prÃƒÂ³ximo passo da marca."
              },
              {
                title: "Continuidade fragilizada",
                desc: "O material nÃƒÂ£o cria uma base ÃƒÂºtil para usos futuros e acaba exigindo novo esforÃƒÂ§o toda vez que a marca precisa comunicar algo."
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-charcoal-900 border border-white/[0.04] rounded-2xl p-6 sm:p-7 space-y-3 hover:border-red-500/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/5 text-red-400 border border-red-500/10 flex items-center justify-center font-sans text-[10px] font-bold">
                  SINAL {String(idx + 1).padStart(2, '0')}
                </div>
                <h4 className="text-white text-base sm:text-lg font-display font-semibold uppercase tracking-tight">
                  {item.title}
                </h4>
                <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 3: TARGET AUDIENCE (Para quem ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©)
         =========================================*/}
      <section className="px-6 md:px-8 py-20 border-b border-white/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto space-y-14 text-center">
          
          <div className="max-w-2xl mx-auto space-y-3 text-center">
            <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              MAPEAMENTO DE SOLICITANTES // DIALÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½0TICA
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tighter">
              Para quem o Audiovisual de Elite ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© ObrigatÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rio?
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              Identifique se o seu formato de atuaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o comercial demanda uma roupagem visual sofisticada no patamar exigido por seus consumidores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              {
                icon: Award,
                title: "Empresas com Eventos SÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªniores",
                desc: "Encontros corporativos, palestras exclusivas, summits e workshops premium necessitam perpetuar o calor e alto status da marca no digital pÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³s-evento."
              },
              {
                icon: Layers,
                title: "Marcas com LanÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§amentos e AtivaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes",
                desc: "Anas de lanÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§amentos de produtos fÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­sicos digitais, promoÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes de impacto ou aberturas de filias exigem narrativa cinematogrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡fica de peso."
              },
              {
                icon: Play,
                title: "Especialistas e Marcas Pessoais",
                desc: "Profissionais liberais, conselheiros, executivos de board e infoprodutores premium precisam gerar regularidade de autoridade limpa e polida."
              },
              {
                icon: Monitor,
                title: "Empresas que Querem Humanizar OperaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes",
                desc: "NegÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³cios que buscam mostrar seus bastidores, engenharia operacional robusta, escritÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rio fÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­sico e a uniÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o da equipe de forma elegante."
              },
              {
                icon: Video,
                title: "TrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡fego Pago Exigindo Alta RetenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o",
                desc: "Lojas c2c, serviÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§os b2b e marcas de luxo que precisam de funis de criativos cinematogrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ficos para performar agressivamente em anÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºncios."
              },
              {
                icon: Film,
                title: "DocumentaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de Legado e ReputaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o",
                desc: "InstituiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes, fundaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes e cooperativas que pretendem consolidar em vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­deo seus manifestos fundadores, projetos sociais e reputaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o real."
              }
            ].map((audience, idx) => {
              const AudienceIcon = audience.icon;
              return (
                <div 
                  key={idx}
                  className="bg-charcoal-900 border border-white/[0.05] rounded-2xl p-6 hover:border-brand/30 hover:bg-white/[0.015] transition-all duration-300 flex flex-col justify-between group h-64"
                >
                  <div className="space-y-4">
                    <div className="p-2.5 bg-white/[0.03] text-zinc-400 group-hover:text-brand group-hover:bg-brand/10 rounded-xl transition-all w-10 h-10 flex items-center justify-center">
                      <AudienceIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-white text-base sm:text-lg font-display font-semibold uppercase tracking-tight group-hover:text-brand transition-colors">
                      {audience.title}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                      {audience.desc}
                    </p>
                  </div>
                  <div className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest select-none">
                    DIRECIONAMENTO // COD_0{idx + 1}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 4: ACTIVE FRONTS OF ACTION (Frentes de atuaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o)
         =========================================*/}
      <section className="px-6 md:px-8 py-20 bg-charcoal-900/10 border-b border-white/[0.04] text-left relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-left space-y-3 max-w-2xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
              SERVIÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½!OS INTEGRADOS // AUDIOVISUAL COMPACT
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-white uppercase tracking-tighter">
              As Quatro Frentes de AtuaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o SÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªnior da TAG08
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Estruturamos as frentes de captaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o, direÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnica e roteiro para atender com precisÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o executiva a cada objetivo de posicionamento no mercado digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                num: "FRENTE 01",
                title: "CaptaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o & ConteÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºdo para Redes Sociais",
                desc: "ProduÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o contÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­nua e planejada sob roteiro refinado para TikTok, Instagram Reels, LinkedIn e canais digitais modernos de negÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³cios.",
                list: ["Roteiro de quebra de padrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o inicial", "CaptaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de alta nitidez com pÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½s color-grading", "Cortes rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½pidos e dinÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢micos", "Legendas de alto padrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o", "Efeitos sonoros sutis e envolventes"]
              },
              {
                num: "FRENTE 02",
                title: "Cobertura de Eventos Corporativos",
                desc: "Ancoragem completa de palestras, ativaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes de patrocinadores, summits e festas internas de marcas corporativas.",
                list: ["Aftermovie cinematogrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½fico", "Cortes rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½pidos editados no local", "Depoimentos de participantes colhidos com maestria", "Galeria organizada de fotos institucionais", "Stories dinÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢micos sob demanda"]
              },
              {
                num: "FRENÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¥ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚Â¬Ãƒâ€šÃ‚Â¡ 03",
                title: "VÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­deos Institucionais & DocumentÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rios de Marca",
                desc: "Manifestos de negÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³cio, histÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rias fundadoras e documentÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rios de processos industriais ou de escritÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rios focados em autoridade.",
                list: ["VÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­deo institucional", "Manifesto de marca assinado por diretores", "VÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­deos para recepÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o e showrooms", "VÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­deo comercial para captaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de sÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³cios", "ApresentaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes com Motion Graphics"]
              },
              {
                num: "FRENTE 04",
                title: "Campanhas Visuais & LanÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§amentos",
                desc: "VÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­deos estruturados de vendas para ancorar campanhas agressivas de trÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡fego pago, lanÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§amentos de infoprodutos e novas linhas luxo.",
                list: ["VÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½deos em formato 16:9 e vertical 9:16", "Estrutura rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½pida para mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºltiplos anÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºncios (A/B)", "Roteiro orientado ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ aÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½o imediata pÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½s-clique", "DireÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½o de cÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢mera voltada ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ alta conversÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o", "CTA de alta densidade no desfecho"]
              }
            ].map((frente, idx) => (
              <div 
                key={idx}
                className="bg-charcoal-900 border border-white/[0.06] rounded-2.5xl p-6 sm:p-10 space-y-6 hover:border-brand/40 hover:bg-white/[0.01] transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/[0.015] rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-2">
                  <span className="font-mono text-[9px] text-brand-secondary font-black uppercase tracking-widest">{frente.num}</span>
                  <h3 className="font-display font-medium text-lg sm:text-xl text-white uppercase leading-snug">
                    {frente.title}
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                    {frente.desc}
                  </p>
                </div>

                <div className="space-y-3.5 pt-4 border-t border-white/[0.04]">
                  <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-bold">ENTREGÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂVEIS POSSÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂVEIS:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {frente.list.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex gap-2.5 items-center">
                        <Check className="w-3.5 h-3.5 text-brand shrink-0 stroke-[2.5]" />
                        <span className="text-zinc-300 text-xs font-medium font-sans">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 5: INTERACTIVE SIMULATOR (PLANNER)
         =========================================*/}
      <section id="planner" className="px-6 md:px-8 py-20 border-b border-white/[0.04] text-left relative z-10 scroll-mt-24">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl">
            <div className="space-y-3">
              <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                MONTE SEU CHECKLIST // SIMULADOR DE AUDIOVISUAL
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tighter">
                Simulador Inteligente de Planejamento de DiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ria
              </h2>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Selecione o seu formato tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡tico de preferÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia e monte o pacote de entregÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡veis do seu projeto. Obtenha um resumo tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnico imediato.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Lado Esquerdo: Formato (Column) + EntregÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡veis */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Formatos Buttons Selector */}
              <div className="space-y-4">
                <span className="font-mono text-[9.5px] text-zinc-500 uppercase tracking-widest font-bold block">1. ESCOLHA O FORMATO DE CONTRATAÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½!ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½O</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {FORMATOS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setSelectedFormat(f.id);
                        // Auto reset/preset default deliverables depending on selected format
                        if (f.id === "essencial") setSelectedTools(["reels", "cortes"]);
                        else if (f.id === "cobertura") setSelectedTools(["aftermovie", "reels", "depoimentos"]);
                        else setSelectedTools(["institucional", "reels", "depoimentos", "anuncios", "banco"]);
                      }}
                      className={`p-4 rounded-xl text-left border relative transition-all cursor-pointer focus:outline-none ${
                        selectedFormat === f.id
                          ? "bg-brand/5 border-brand text-white shadow-xl shadow-brand/5"
                          : "bg-white/[0.01] border-white/5 text-zinc-400 hover:border-white/10"
                      }`}
                    >
                      <span className="font-sans text-[7px] text-brand block mb-1 font-black uppercase tracking-wider">{f.tag}</span>
                      <h4 className="text-white text-xs sm:text-sm font-semibold uppercase leading-tight">{f.name}</h4>
                    </button>
                  ))}
                </div>
              </div>

              {/* Deliverables Grid selector */}
              <div className="space-y-4">
                <span className="font-mono text-[9.5px] text-zinc-500 uppercase tracking-widest font-bold block">2. SELECIONE OS ENTREGÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂVEIS DESEJADOS</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {DELIVERABLES.map((del) => {
                    const isSelected = selectedTools.includes(del.id);
                    return (
                      <button
                        key={del.id}
                        onClick={() => handleToggleTool(del.id)}
                        className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between h-36 cursor-pointer focus:outline-none group ${
                          isSelected
                            ? "bg-brand text-black border-brand/40 shadow-lg shadow-brand/5 font-medium"
                            : "bg-white/[0.01] border-white/5 text-zinc-400 hover:border-white/10"
                        }`}
                      >
                        <div className="space-y-1 text-left">
                          <h5 className={`text-xs uppercase font-semibold font-display tracking-tight leading-snug group-hover:text-white transition-colors ${isSelected ? "text-black group-hover:text-black" : "text-white"}`}>
                            {del.name}
                          </h5>
                          <p className={`text-[10px] leading-relaxed line-clamp-3 font-medium transition-colors ${isSelected ? "text-black/75" : "text-zinc-500 group-hover:text-zinc-400"}`}>
                            {del.desc}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center w-full pt-2 border-t border-black/5">
                          <span className={`font-sans text-[7px] font-bold uppercase ${isSelected ? "text-black/60" : "text-zinc-400"}`}>{del.category} asset</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? "bg-black text-brand border-black" : "border-zinc-700 text-zinc-500"}`}>
                            {isSelected ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <Plus className="w-2.5 h-2.5" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Lado Direito: Preview de Setup a enviar por WhatsApp */}
            <div className="lg:col-span-5">
              <div className="bg-charcoal-900 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                    <span className="font-mono text-[9px] text-brand uppercase tracking-wider font-extrabold">RESUMO DA PROPOSTA AUDIOVISUAL</span>
                  </div>
                  <span className="font-mono text-[9px] text-zinc-500">TAG08_PROD_SYSTEM</span>
                </div>

                {/* Setup selected details */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase font-black block">FORMATO SELECIONADO:</span>
                    <h4 className="font-display font-medium text-lg text-brand-secondary uppercase tracking-tight leading-none">
                      {currentFormatDetails.name}
                    </h4>
                    <p className="text-zinc-400 text-xs leading-normal">
                      {currentFormatDetails.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.04] space-y-2.5 text-left">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase font-black block">INCLUSO NESSE FORMATO:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {currentFormatDetails.features.map((feat, fidx) => (
                        <div key={fidx} className="flex gap-2 items-center">
                          <Check className="w-3 h-3 text-brand text-xs shrink-0" />
                          <span className="text-zinc-300 text-[11px] font-medium font-sans">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chosen tools list output */}
                  <div className="pt-4 border-t border-white/[0.04] space-y-2.5">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase font-black block">CARDS DE ENTREGAS OPERACIONAIS ({selectedTools.length}):</span>
                    <div className="flex flex-wrap gap-2 text-left max-h-40 overflow-y-auto pr-1">
                      {selectedTools.map((tId) => {
                        const dl = DELIVERABLES.find(d => d.id === tId);
                        if (!dl) return null;
                        return (
                          <span key={tId} className="px-2.5 py-1 bg-white/[0.03] border border-white/5 text-zinc-300 text-[10px] rounded-lg font-sans font-medium hover:border-brand/40 transition-colors">
                            {dl.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Core action trigger with prefilled parameters */}
                <div className="pt-4 space-y-3">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full bg-brand-secondary hover:bg-brand hover:shadow-[0_15px_35px_rgba(var(--color-brand-secondary-rgb),0.22)] text-black text-xs font-mono font-black uppercase tracking-widest py-4 rounded-xl text-center transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_30px_rgba(var(--color-brand-secondary-rgb),0.15)]"
                  >
                    <MessageSquare className="w-4 h-4 text-black" />
                    <span>CHAMAR NO WHATSAPP</span>
                  </a>
                  <span className="block text-center font-mono text-[8px] text-zinc-500 uppercase leading-none select-none">
                    ALERTA: DIÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂRIAS SOB CONSULTA DE DATA DA AGENDA
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 6: METHODOLOGY TIMELINE (Antes, Durante, Depois)
         =========================================*/}
      <section className="px-6 md:px-8 py-20 border-b border-white/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              METODOLOGIA DE PROCESSOS // DIRETRIZ
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tighter">
              A Cobertura ComeÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§a Antes e Continua Depois do Evento
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
              Nenhum profissional da TAG08 chega ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ captaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o apenas segurando uma cÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢mera. Nosso mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½todo cobre o ciclo de vida completo de ponta a ponta.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left relative">
            {/* Visual connector lines for large screens */}
            <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-gradient-to-r from-brand/20 via-brand/40 to-transparent z-0 hidden lg:block -translate-y-16" />

            {[
              {
                num: "01",
                tag: "ALINHAMENTO PRÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂTICO",
                title: "O Antes: InteligÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia e Roteiro",
                color: "group-hover:border-brand/40",
                list: [
                  "Briefing profundo do evento ou campanha",
                  "Mapeamento dos palestrantes obrigatÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rios",
                  "CriaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de guia narrativo e lista de cenas obrigatÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rias",
                  "PreparaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de roteiro de perguntas para depoimentos",
                  "DefiniÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o estrita das referÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias de estilo visual"
                ]
              },
              {
                num: "02",
                tag: "EXECUÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½O DE CAMPO",
                title: "O Durante: CaptaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de Alta Fidelidade",
                color: "group-hover:border-brand-secondary/40 border-l border-r border-white/5",
                list: [
                  "PresenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§a de um diretor de narrativa em campo",
                  "CaptaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o em alta resoluÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½o (CÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½meras FX CinematogrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ficas)",
                  "Colheita espontÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢nea de depoimentos estruturados",
                  "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âudio profissional sem chiados ou ecos",
                  "Captura focada na experiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia do participante"
                ]
              },
              {
                num: "03",
                tag: "PÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½S-PRODUÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½!ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½O SÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½`NIOR",
                title: "O Depois: EdiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o e Entrega Veloz",
                color: "group-hover:border-brand/40",
                list: [
                  "SeleÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o rigorosa de frames sob alta aprovaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o",
                  "Tratamento de cor (Color Grading) sÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³brio",
                  "CriaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de cortes rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pidos e micro-teasers em 48h",
                  "Montagem de aftermovies ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©picos ou institucionais",
                  "Entrega organizada em galeria ou pastas estruturadas"
                ]
              }
            ].map((step, idx) => (
              <div 
                key={idx}
                className="bg-charcoal-900 border border-white/[0.05] rounded-2xl p-6 sm:p-9 relative z-10 group hover:bg-white/[0.015] transition-all duration-300 flex flex-col justify-between min-h-[440px]"
              >
                <div className="space-y-5 text-left">
                  <div className="flex justify-between items-center">
                    <span className="font-display font-black text-2xl text-zinc-800 group-hover:text-brand transition-colors select-none">
                      {step.num}.
                    </span>
                    <span className="font-mono text-[8px] text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2 py-0.5 rounded uppercase font-black uppercase">
                      {step.tag}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight group-hover:text-brand transition-colors leading-[1.25]">
                    {step.title}
                  </h3>

                  <ul className="space-y-3 pt-3 border-t border-white/[0.04]">
                    {step.list.map((item, idxx) => (
                      <li key={idxx} className="flex gap-2.5 items-start">
                        <Check className="w-3.5 h-3.5 text-brand shrink-0 stroke-[2.5] mt-0.5" />
                        <span className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed group-hover:text-zinc-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/[0.04] text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest flex justify-between">
                  <span>METODOLOGIA ATIVA</span>
                  <span className="text-brand font-bold select-none">TAG08_PROCESS_0{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 7: INCLUSIONS AND ADD-ONS
         =========================================*/}
      <section className="px-6 md:px-8 py-20 bg-charcoal-900/10 border-b border-white/[0.04] text-left relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-left space-y-3 max-w-2xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
              TABELA DE INCLUSÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O TÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½0CNICA // RIGOR COMERCIAL
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tighter">
              Clareza Estrita: O que estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ incluso no Escopo?
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Sem promessas fantasiosas ou surpresas no final do projeto. Veja de forma limpa todas as rotinas embutidas sob contrato e quais itens podem ser solicitados separadamente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* O QUE ESTÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â INCLUSO */}
            <div className="bg-charcoal-900 border border-white/[0.06] rounded-2.5xl p-6 sm:p-9 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-brand font-mono text-[9px] uppercase tracking-widest font-black pb-4 border-b border-white/[0.04]">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>PRESET PADRÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢O // INCLUSO EM NOSSOS ESCOPOS</span>
                </div>
                
                <div className="grid gap-4.5 pt-6 text-left">
                  {[
                    { title: "DireÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½o de captaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o dedicada", desc: "Acompanhamento no set com olhar contÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½nuo sobre falas obrigatÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½rias e ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ngulos." },
                    { title: "Roteiro e guia de cenas", desc: "Cronograma tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnico planejado integrado ao time de marketing do contratante." },
                    { title: "SLA estrito de ediÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o e finalizaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o", desc: "Entrega programada em cronogramas transparentes de andamento." },
                    { title: "Trilha sonora licenciada inclusa", desc: "MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºsicas e efeitos sonoros isentos de royalties de direitos autorais." },
                    { title: "Entrega em galeria digital organizada", desc: "Todos os arquivos finais segmentados por formato direto no Drive de forma limpa." }
                  ].map((inc, iIdx) => (
                    <div key={iIdx} className="flex gap-3 text-left">
                      <div className="w-5 h-5 rounded-md bg-brand/10 text-brand flex items-center justify-center font-bold text-[10px] shrink-0 font-sans mt-0.5">
                        {iIdx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-white text-xs sm:text-sm font-semibold uppercase">{inc.title}</h4>
                        <p className="text-zinc-400 text-xs leading-normal">{inc.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-white/[0.04] text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                SUPORTE INCLUSO SOB SLA CONTRATUAL
              </div>
            </div>

            {/* CONTRATADO ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¬ PARTE */}
            <div className="bg-white/[0.01] border border-white/[0.04] rounded-2.5xl p-6 sm:p-9 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-zinc-500 font-mono text-[9px] uppercase tracking-widest font-bold pb-4 border-b border-white/[0.04]">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-650" />
                  <span>OPCIONAIS DISPONÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½VEIS // CONTRATADOS ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ PARTE</span>
                </div>
                
                <div className="grid gap-4.5 pt-6 text-left">
                  {[
                    { title: "DiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rias operacionais adicionais", desc: "Garantia de equipe estendida em eventos corporativos com mais de 3 dias." },
                    { title: "CaptaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes aÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©reas por Drone", desc: "AutorizaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o prÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©via de espaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§os pela ANAC e voos cinÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©ticos profissionais." },
                    { title: "Viagens intermunicipais ou interestaduais", desc: "Deslocamento de equipe e frete de lentes protegidos fora da regiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o metropolitana." },
                    { title: "Sistemas de locuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o em estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºdio", desc: "Vozes profissionais registradas para manifestos ou vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­deos institucionais de alto luxo." },
                    { title: "Motion graphics e animaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes complexas", desc: "CriaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o sob medida em canvas 3D e renderizaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes animadas para marcas tech." }
                  ].map((opt, oIdx) => (
                    <div key={oIdx} className="flex gap-3 text-left">
                      <div className="w-5 h-5 rounded-md bg-white/5 text-zinc-400 border border-white/5 flex items-center justify-center font-bold text-[10px] shrink-0 font-sans mt-0.5">
                        +{oIdx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-zinc-300 text-xs sm:text-sm font-semibold uppercase">{opt.title}</h4>
                        <p className="text-zinc-500 text-xs leading-normal">{opt.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-white/[0.04] text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest">
                CONTROLE DE ALTERAÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½!ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½"ES E ADULTOS ADICIONAIS
              </div>
            </div>
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 8: SYNERGY INTEGRATION (Audiovisual + soluÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes)
         =========================================*/}
      <section className="px-6 md:px-8 py-20 border-b border-white/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              CONEXÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢O DE PRODUTO // CROSS LINKING
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tighter">
              A Sinergia Correta: Audiovisual no Ecossistema TAG08
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
              Quando unimos a captaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o cinematogrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡fica ao poder das outras disciplinas tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ticas de marketing da TAG08, o resultado comercial escala.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              {
                title: "Audiovisual + Redes Sociais",
                desc: "Transformamos horas de captaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes brutas em um cronograma impecÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡vel de pautas contÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­nuas para alimentar seu perfil mensalmente.",
                cta: "GestÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de Redes Sociais",
                page: "/servicos/gestao-de-redes-sociais"
              },
              {
                title: "Audiovisual + Branding SÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªnior",
                desc: "Traduzimos paleta de cores, tipografia, logos e tom de voz diretamente para o color-grading e trilha sonora das suas mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­dias corporativas.",
                cta: "Branding & Identidade",
                page: "/servicos/branding-identidade"
              },
              {
                title: "Audiovisual + Estruturas Web",
                desc: "Anexamos os vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­deos institucionais rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pidos compactados em landing pages de alta velocidade para nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o atrasar o carregamento.",
                cta: "Desenvolvimento Web",
                page: "/servicos/desenvolvimento-web"
              },
              {
                title: "Audiovisual + TrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡fego de Elite",
                desc: "Seus vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­deos verticais prontos divididos em criativos de anÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºncios inteligentes e variaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ticas de hooks visuais para mais conversÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes.",
                cta: "Contato",
                page: "/contato"
              }
            ].map((syn, idx) => (
              <div 
                key={idx}
                className="bg-charcoal-900 border border-white/[0.05] rounded-2xl p-6.5 sm:p-7 hover:border-brand/40 transition-colors duration-300 flex flex-col justify-between h-72 group"
              >
                <div className="space-y-4">
                  <span className="font-mono text-[8.5px] text-brand-secondary font-black uppercase tracking-widest block">SINERGIA {String(idx + 1).padStart(2, '0')}</span>
                  <h3 className="text-white text-base sm:text-lg font-display font-semibold uppercase tracking-tight group-hover:text-brand transition-colors leading-[1.2]">
                    {syn.title}
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    {syn.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleLinkClick(syn.page)}
                  className="group flex items-center justify-between text-xs font-sans font-bold text-zinc-500 hover:text-brand cursor-pointer select-none pt-3 border-t border-white/5 w-full focus:outline-none"
                >
                  <span className="uppercase text-[10px] tracking-widest">{syn.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* MiniCases Validation panel */}
      <MiniCases onNavigate={onNavigate} />

      {/*=========================================
          SECTION 9: BOTTOM CTA CARD (WHATSAPP NEON)
         =========================================*/}
      <section className="py-20 px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden animate-fade-in">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

          {/* Left Block: Image frame */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[500px]">
            <div className="absolute inset-0 bg-black/15 rounded-[24px] overflow-hidden" />
            <img 
              src="https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=800" 
              alt="TAG08 Equipe TÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnica Apoio Audiovisual" 
              className="absolute inset-0 w-full h-full object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[10%] hover:scale-105 duration-500 transition-all"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] text-white/60 bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-black border border-white/5">
                  CINEMATOGRAPHER
                </span>
                <span className="font-mono text-[9px] text-white/50 tracking-wider font-extrabold">
                  STAGE_CONTROL
                </span>
              </div>
              <div className="space-y-1.5 opacity-25 select-none">
                <div className="font-display font-extrabold text-[1.8rem] text-white/50 tracking-widest leading-none uppercase select-none">
                  audiovisual_core
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/30 tracking-widest leading-none uppercase select-none pl-6">
                  strategic_evolution_
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  SLA: ISO SECURED
                </span>
                <span className="font-mono text-[9px] text-white/60 bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-black border border-white/5">
                  HIGH RESOLUTION
                </span>
              </div>
            </div>
          </div>

          {/* Right Block: Details */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 text-left h-full relative z-10 lg:pl-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-black font-semibold">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/90">
                  RESERVE SUA DIÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½RIA CONFORME CRONOGRAMA DE OPERAÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½!ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½O
                </span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black leading-[0.9] tracking-tighter uppercase font-display">
                RESERVE O RIGOR <br />
                DA SUA CAPTAÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½!ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½O!
              </h2>
              <p className="text-black/85 text-[11px] sm:text-xs max-w-lg leading-relaxed font-sans font-bold uppercase">
                Em videoconferÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia privada rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pida de 30 minutos, nosso diretor operacional de audiovisual analisarÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ seu cronograma, validarÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ focos de cenas obrigatÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rias e desenharÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ o playbook de tomadas completo.
              </p>
            </div>
            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 max-w-md relative overflow-hidden text-left font-sans">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-4 items-start select-none">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black shrink-0 shadow-lg shadow-brand/10 hover:scale-105 transition-all">
                  <ArrowUpRight className="w-5 h-5 rotate-45 stroke-[2.5] text-black" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-[8px] text-brand uppercase tracking-wider font-extrabold block">
                    CONSULTA DE AGENDA COMERCIAL
                  </span>
                  <p className="text-white text-xs leading-snug font-sans font-semibold">
                    Avaliaremos a viabilidade logÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­stica internacional de viagens e equipes para data indicada.
                  </p>
                </div>
              </div>

              {/* Contacts info details */}
              <div className="space-y-3 font-sans">
                <a 
                  href={buildBrazilWhatsAppUrl("OlÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡! Gostaria de agendar um diÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡logo operacional para entender a viabilidade de agenda de captaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o cinematogrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡fica da TAG08 no meu evento de marca.")}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-black transition-all">
                        <span className="text-[9px] font-mono font-black tracking-tight text-brand group-hover:text-black">BR</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase font-black tracking-wider leading-none">
                          FALAR CONOSCO DIRETAMENTE (WhatsApp)
                        </span>
                        <span className="text-white text-xs font-mono font-bold tracking-wider group-hover:text-brand transition-colors mt-0.5">
                          +55 83 9.9886-8882
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-brand font-mono font-bold uppercase tracking-wider bg-brand/10 py-1 px-2.5 rounded-lg group-hover:bg-brand group-hover:text-black transition-all">
                      CONECTAR
                    </span>
                  </div>
                </a>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 text-xs font-sans select-none">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                  <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest font-extrabold">
                    TAG08 BROADCAST
                  </span>
                </div>
                <span className="font-mono text-[8.5px] text-brand font-bold bg-brand/10 border border-brand/25 px-2 py-0.5 rounded uppercase leading-none">
                  VIVA_CORE
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 10: FAQ (Premium 12-Column Layout matching GestaoRedesSociais)
         =========================================*/}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[40px] bg-charcoal-950 border border-white/[0.04] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
            {/* Left Side: Accordion Category selector */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono">
                  FAQ // ENCONTRE RESPOSTAS
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter uppercase">
                  DÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½aVIDAS &amp; <br />
                  SUA DECISÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢O
                </h2>
                <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans max-w-sm">
                  EsclareÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§a as principais dÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºvidas sobre como a TAG08 lidera, executa e garante a pÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³s-produÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o e entrega ideal do seu posicionamento visual.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {faqCategories.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveFaq(item.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group cursor-pointer ${
                      activeFaq === item.id
                        ? "bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)]"
                        : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                    }`}
                  >
                    <span className="font-mono text-xs font-black uppercase tracking-wider flex items-center gap-3">
                      <span className={activeFaq === item.id ? "text-black" : "text-brand"}>
                        {String(item.id + 1).padStart(2, '0')}.
                      </span>
                      {item.title}
                    </span>
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                      activeFaq === item.id ? "text-black rotate-[-45deg] stroke-[2.5]" : "text-zinc-500"
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Central Side: Responsive image + Answer container */}
            <div className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-white/[0.04] bg-[#0c0c0e]">
              <img
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800"
                alt="Cinema Production TAG08"
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div className="absolute top-6 left-6 z-10 pointer-events-none font-mono text-[8px] text-white/20 uppercase tracking-widest leading-none">
                SYS // BROADCAST_FAQ
              </div>

              <div className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left font-sans">
                <span className="font-mono text-[8.5px] text-brand uppercase tracking-widest font-black block">
                  {faqCategories[activeFaq].title}
                </span>
                
                <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {faqQuestions[activeFaq]}
                </h4>
                
                <p className="text-zinc-300 text-xs sm:text-[12.5px] leading-relaxed font-sans font-medium">
                  {faqAnswers[activeFaq]}
                </p>
              </div>
            </div>

            {/* Right Side: Proposional side cards */}
            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-bold">PORTFÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½LIO &amp; MOCKUPS</span>
                  <h4 className="text-white font-semibold text-sm leading-snug">Rigor TÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnico e Processos SÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³lidos</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    SubstituÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­mos gravaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes brutas sem sentido por roteiros tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ticos, cronograma de tomadas e entrega rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pida em canais integrados.
                  </p>
                </div>
                <button
                  onClick={() => handleLinkClick("/servicos")}
                  className="group flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5"
                >
                  <span>Ver Todos ServiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§os</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-black/60 uppercase tracking-widest block font-extrabold">CMO BROADCAST</span>
                  <h4 className="text-black font-black text-sm uppercase leading-tight tracking-tight">Precisa de Escopo Customizado?</h4>
                  <p className="text-black/85 text-[11.5px] font-semibold leading-relaxed font-sans">
                    Fale em canal reservado e discuta ideias de aftermovies, institucionais exclusivos ou documentÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rios de marca com diretores.
                  </p>
                </div>
                <a
                  href={buildBrazilWhatsAppUrl("OlÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡! Gostaria de conversar com os diretores de audiovisual da TAG08 sobre um escopo de captaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o personalizado para meu negÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³cio.")}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between text-xs font-sans font-bold text-black border-t border-black/10 pt-2 cursor-pointer select-none"
                >
                  <span>MENSAGEM PRIVADA</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
