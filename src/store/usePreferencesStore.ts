"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createBrowserStorage } from "@/lib/storage";

export type ThemeMode = "light" | "dark" | "system";

export type PreferencesState = {
  theme: ThemeMode;
  language: string;
  textEdition: string;
  translationEdition: string;
  tafsirEdition: string;
  recitationEdition: string;
  fontScale: number;
  readingMode: "normal" | "focus";
  dailyNotifications: boolean;
  highContrast: boolean;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: string) => void;
  setTextEdition: (edition: string) => void;
  setTranslationEdition: (edition: string) => void;
  setTafsirEdition: (edition: string) => void;
  setRecitationEdition: (edition: string) => void;
  setFontScale: (scale: number) => void;
  setReadingMode: (mode: "normal" | "focus") => void;
  setDailyNotifications: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "system",
      language: "en",
      textEdition: "quran-uthmani",
      translationEdition: "en.asad",
      tafsirEdition: "en.jalalayn",
      recitationEdition: "ar.alafasy",
      fontScale: 1,
      readingMode: "normal",
      dailyNotifications: false,
      highContrast: false,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setTextEdition: (textEdition) => set({ textEdition }),
      setTranslationEdition: (translationEdition) => set({ translationEdition }),
      setTafsirEdition: (tafsirEdition) => set({ tafsirEdition }),
      setRecitationEdition: (recitationEdition) => set({ recitationEdition }),
      setFontScale: (fontScale) => set({ fontScale }),
      setReadingMode: (readingMode) => set({ readingMode }),
      setDailyNotifications: (dailyNotifications) => set({ dailyNotifications }),
      setHighContrast: (highContrast) => set({ highContrast }),
    }),
    {
      name: "qim-preferences",
      storage: createJSONStorage(() => createBrowserStorage()),
    },
  ),
);
