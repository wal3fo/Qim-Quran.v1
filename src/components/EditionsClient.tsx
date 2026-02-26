"use client";

import { useMemo, useState } from "react";
import type { Edition } from "@/types/quran";
import EditionFilters from "@/components/EditionFilters";
import { usePreferencesStore } from "@/store/usePreferencesStore";

type Props = {
  editions: Edition[];
};

export default function EditionsClient({ editions }: Props) {
  const [language, setLanguage] = useState("all");
  const [format, setFormat] = useState("all");
  const [type, setType] = useState("all");
  const setTranslationEdition = usePreferencesStore((state) => state.setTranslationEdition);

  const languages = useMemo(
    () => Array.from(new Set(editions.map((edition) => edition.language))),
    [editions],
  );

  const filtered = useMemo(() => {
    return editions.filter((edition) => {
      const matchesLanguage = language === "all" || edition.language === language;
      const matchesFormat = format === "all" || edition.format === format;
      const matchesType = type === "all" || edition.type === type;
      return matchesLanguage && matchesFormat && matchesType;
    });
  }, [editions, language, format, type]);

  return (
    <div className="space-y-6">
      <EditionFilters
        language={language}
        format={format}
        type={type}
        onLanguageChange={setLanguage}
        onFormatChange={setFormat}
        onTypeChange={setType}
        languages={languages}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((edition) => (
          <div
            key={edition.identifier}
            className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {edition.englishName}
            </p>
            <p className="text-sm text-zinc-500">
              {edition.language.toUpperCase()} • {edition.type}
            </p>
            <button
              type="button"
              onClick={() => setTranslationEdition(edition.identifier)}
              className="mt-3 rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
            >
              Set Preferred
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
