import type { UiLanguage } from "./siteI18n";

export const externalContentCopy: Record<UiLanguage, {
  machineTranslationLabel: string;
  showOriginalLabel: string;
  hideOriginalLabel: string;
}> = {
  pt: {
    machineTranslationLabel: "Tradução automática do original em português",
    showOriginalLabel: "Ver original em português",
    hideOriginalLabel: "Ocultar original em português"
  },
  en: {
    machineTranslationLabel: "Machine translation of the original Portuguese text",
    showOriginalLabel: "Show original in Portuguese",
    hideOriginalLabel: "Hide original in Portuguese"
  },
  es: {
    machineTranslationLabel: "Traducción automática del original en portugués",
    showOriginalLabel: "Ver original en portugués",
    hideOriginalLabel: "Ocultar original en portugués"
  }
};
