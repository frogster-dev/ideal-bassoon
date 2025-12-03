import { useAppPreferences } from "@/libs/zustand/app-preference-store";
import { useMemo } from "react";

// Import translation files
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

const translations = {
  en,
  fr,
};

type TranslationKey = string;

/**
 * Custom hook for handling translations in the app
 * @returns Object containing the translation function t() and current language
 */
export function useTranslation() {
  const { language, setLanguage } = useAppPreferences();

  const currentTranslations = useMemo(() => {
    return translations[language] || translations.en;
  }, [language]);

  /**
   * Translation function to get translated text
   * @param key - The translation key in dot notation (e.g., "common.welcome" or "session.start")
   * @param fallback - Optional fallback text if translation is not found
   * @returns The translated string or the fallback/key if not found
   */
  const t = (key: TranslationKey, fallback?: string): string => {
    const keys = key.split(".");
    let value: any = currentTranslations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }

    return typeof value === "string" ? value : fallback || key;
  };

  return {
    t,
    language,
    setLanguage,
  };
}
