"use client";

import { usePreferencesStore } from "@/store/usePreferencesStore";

const languages = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
  { code: "fr", label: "FR" },
  { code: "id", label: "ID" },
];

export default function LanguageToggle() {
  const language = usePreferencesStore((state) => state.language);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  return (
    <select
      value={language}
      onChange={(event) => setLanguage(event.target.value)}
      className="rounded-full border border-zinc-300 bg-transparent px-2 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
      aria-label="Language"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
