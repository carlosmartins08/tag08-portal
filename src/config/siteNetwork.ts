export const SITE_LANGUAGES = ["pt", "en", "es"] as const;
export type SiteLanguage = (typeof SITE_LANGUAGES)[number];

export const PRIMARY_SITE_DOMAIN = "https://tag08.com.br";

export type OfficialChannel = {
  key: string;
  label: string;
  href: string;
  kind: "social" | "business" | "contact";
};

export type WhatsAppContact = {
  key: string;
  label: string;
  display: string;
  phoneE164: string;
  href: string;
  defaultMessage: string;
  country: PhoneCountry;
};

export type PhoneCountry = {
  isoCode: string | null;
  name: string;
  flag: string;
};

const COUNTRY_BY_DIALING_PREFIX: Array<{ prefix: string; country: PhoneCountry }> = [
  { prefix: "+55", country: { isoCode: "BR", name: "Brasil", flag: "🇧🇷" } },
  { prefix: "+56", country: { isoCode: "CL", name: "Chile", flag: "🇨🇱" } }
];

/** Identifies only configured calling codes; unknown numbers remain explicitly global. */
export const getCountryFromPhoneE164 = (phoneE164: string): PhoneCountry =>
  COUNTRY_BY_DIALING_PREFIX.find(({ prefix }) => phoneE164.startsWith(prefix))?.country
  ?? { isoCode: null, name: "Internacional", flag: "🌐" };

const normalizeWhatsAppMessage = (message: string) => {
  let normalized = message;

  while (/%[0-9A-Fa-f]{2}/.test(normalized)) {
    try {
      const decoded = decodeURIComponent(normalized);
      if (decoded === normalized) {
        break;
      }
      normalized = decoded;
    } catch {
      break;
    }
  }

  return encodeURIComponent(normalized);
};

export const buildWhatsAppUrl = (phoneE164: string, message: string) =>
  `https://wa.me/${phoneE164.replace("+", "")}?text=${normalizeWhatsAppMessage(message)}`;

export const buildBrazilWhatsAppUrl = (message: string) => buildWhatsAppUrl(TAG08_OFFICIAL_CONTACT.phoneE164, message);

export const buildInternationalWhatsAppUrl = (message: string) =>
  buildWhatsAppUrl(TAG08_OFFICIAL_CONTACT.phoneInternationalE164, message);

export const buildGoogleMapsEmbedUrl = (query: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

export const TAG08_OFFICIAL_CONTACT = {
  email: "contato@tag08.com.br",
  phoneDisplay: "+55 83 9.9886-8882",
  phoneE164: "+5583998868882",
  whatsappUrl: "https://wa.me/5583998868882",
  phoneInternationalDisplay: "+56 9 9793 7611",
  phoneInternationalE164: "+56997937611",
  whatsappInternationalUrl: "https://wa.me/56997937611",
  whatsappBusinessUrl: "https://wa.me/message/XURZIJ762YMVB1",
  address: "R. Cassimiro de Abreu, Nº60, Sala 05 - Brisamar, João Pessoa - PB, 58033-330",
  googleBusinessUrl: "https://www.google.com/maps/place/TAG08+-+Marketing+e+Consultoria/@-7.1156342,-34.8392458,17z/data=!3m1!4b1!4m6!3m5!1s0x7acdd0b243e5f99:0x38faad53f378edb2!8m2!3d-7.1156342!4d-34.8392458!16s%2Fg%2F11gmwz_kwt!5m1!1e4?hl=pt_BR&entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D"
} as const;

export const TAG08_OFFICIAL_YOUTUBE_HANDLE = "@tag08.com.br_sobre";
export const TAG08_OFFICIAL_YOUTUBE_URL = `https://www.youtube.com/${TAG08_OFFICIAL_YOUTUBE_HANDLE}`;
export const TAG08_OFFICIAL_PINTEREST_URL = "https://br.pinterest.com/agencia_tag08/";

export const TAG08_WHATSAPP_CONTACTS: WhatsAppContact[] = [
  {
    key: "brazil",
    label: "Brasil",
    display: TAG08_OFFICIAL_CONTACT.phoneDisplay,
    phoneE164: TAG08_OFFICIAL_CONTACT.phoneE164,
    country: getCountryFromPhoneE164(TAG08_OFFICIAL_CONTACT.phoneE164),
    href: buildBrazilWhatsAppUrl("Olá, gostaria de falar com a TAG08"),
    defaultMessage: "Olá, gostaria de falar com a TAG08"
  },
  {
    key: "international",
    label: "Internacional",
    display: TAG08_OFFICIAL_CONTACT.phoneInternationalDisplay,
    phoneE164: TAG08_OFFICIAL_CONTACT.phoneInternationalE164,
    country: getCountryFromPhoneE164(TAG08_OFFICIAL_CONTACT.phoneInternationalE164),
    href: buildInternationalWhatsAppUrl("Hello, I would like to talk to TAG08"),
    defaultMessage: "Hello, I would like to talk to TAG08"
  }
];

export const TAG08_OFFICIAL_CHANNELS: OfficialChannel[] = [
  {
    key: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/tag08.com.br",
    kind: "social"
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/tag08-com-br/",
    kind: "social"
  },
  {
    key: "youtube",
    label: "YouTube",
    href: TAG08_OFFICIAL_YOUTUBE_URL,
    kind: "social"
  },
  {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/tag08.com.br/",
    kind: "social"
  },
  {
    key: "x",
    label: "X",
    href: "https://x.com/TAG08_com_br",
    kind: "social"
  },
  {
    key: "pinterest",
    label: "Pinterest",
    href: TAG08_OFFICIAL_PINTEREST_URL,
    kind: "social"
  },
  {
    key: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@tag08.com.br",
    kind: "social"
  },
  {
    key: "google-business",
    label: "Google Meu Negócio",
    href: TAG08_OFFICIAL_CONTACT.googleBusinessUrl,
    kind: "business"
  }
];

export type EcosystemProperty = {
  key: string;
  domain: string;
  localeHint: SiteLanguage;
  activeLanguages: readonly SiteLanguage[];
  homepagePath: string;
  focus: string;
  links: Record<SiteLanguage, string>;
};

export const TAG08_ECOSYSTEM_PROPERTIES: EcosystemProperty[] = [
  {
    key: "hospedagem",
    domain: "https://hospedagem.tag08.com.br",
    localeHint: "pt",
    activeLanguages: ["pt", "en", "es"],
    homepagePath: "/",
    focus: "hospedagem-manutencao-sites",
    links: {
      pt: "https://hospedagem.tag08.com.br/",
      en: "https://hospedagem.tag08.com.br/",
      es: "https://hospedagem.tag08.com.br/"
    }
  },
  {
    key: "influenciador",
    domain: "https://influenciador.tag08.com.br",
    localeHint: "pt",
    activeLanguages: ["pt", "en", "es"],
    homepagePath: "/",
    focus: "gestao-de-redes-sociais",
    links: {
      pt: "https://influenciador.tag08.com.br/",
      en: "https://influenciador.tag08.com.br/",
      es: "https://influenciador.tag08.com.br/"
    }
  },
  {
    key: "process-inteligente",
    domain: "https://processo.tag08.com.br",
    localeHint: "pt",
    activeLanguages: ["pt", "en", "es"],
    homepagePath: "/",
    focus: "process-intelligence",
    links: {
      pt: "https://processo.tag08.com.br/",
      en: "https://processo.tag08.com.br/",
      es: "https://processo.tag08.com.br/"
    }
  },
  {
    key: "process-activation",
    domain: "https://processos.tag08.com.br",
    localeHint: "pt",
    activeLanguages: ["pt", "en", "es"],
    homepagePath: "/",
    focus: "process-activation",
    links: {
      pt: "https://processos.tag08.com.br/",
      en: "https://processos.tag08.com.br/",
      es: "https://processos.tag08.com.br/"
    }
  },
  {
    key: "plano-base",
    domain: "https://plano-base.tag08.com.br",
    localeHint: "pt",
    activeLanguages: ["pt", "en", "es"],
    homepagePath: "/",
    focus: "plano-base",
    links: {
      pt: "https://plano-base.tag08.com.br/",
      en: "https://plano-base.tag08.com.br/",
      es: "https://plano-base.tag08.com.br/"
    }
  }
];

export const getLocalizedNetworkLinks = (language: SiteLanguage): Array<{ key: string; label: string; url: string }> => {
  const languageLabelByKey: Record<string, Record<SiteLanguage, string>> = {
    "hospedagem": {
      pt: "Hospedagem e Manutenção",
      en: "Hosting & Maintenance",
      es: "Alojamiento y Mantenimiento"
    },
    "influenciador": {
      pt: "Gestão de Influenciadores",
      en: "Influencer Management",
      es: "Gestión de Influencers"
    },
    "process-inteligente": {
      pt: "Process Intelligence",
      en: "Process Intelligence",
      es: "Inteligencia de Procesos"
    },
    "process-activation": {
      pt: "Process Activation",
      en: "Process Activation",
      es: "Process Activation"
    },
    "plano-base": {
      pt: "Plano Base TAG08",
      en: "TAG08 Core Plan",
      es: "Plan Base TAG08"
    }
  };

  return TAG08_ECOSYSTEM_PROPERTIES.map((property) => ({
    key: property.key,
    label: languageLabelByKey[property.key][language] || languageLabelByKey[property.key].pt,
    url: property.links[language] || property.links.pt
  }));
};


