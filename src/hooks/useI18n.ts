"use client";

import { dictionaries, type Locale } from "@/lib/i18n";
import { usePreferencesStore } from "@/store/usePreferencesStore";

export const useI18n = () => {
  const language = usePreferencesStore((state) => state.language) as Locale;
  const dictionary = dictionaries[language] ?? dictionaries.en;
  const t = (key: keyof typeof dictionary) => dictionary[key] ?? dictionaries.en[key];
  return { t, locale: language };
};
