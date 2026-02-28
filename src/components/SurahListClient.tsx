"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { SurahSummary } from "@/types/quran";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { getAudio } from "@/services/quranApi";

type Props = {
  surahs: SurahSummary[];
};

export default function SurahListClient({ surahs }: Props) {
  const [query, setQuery] = useState("");
  const [revelationType, setRevelationType] = useState<"all" | "Meccan" | "Medinan">("all");
  const [page, setPage] = useState(1);
  const recitationEdition = usePreferencesStore((state) => state.recitationEdition);
  const setQueue = usePlayerStore((state) => state.setQueue);

  useEffect(() => {
    setPage(1);
  }, [query, revelationType]);

  const filtered = useMemo(() => {
    const lowered = query.toLowerCase();
    return surahs.filter((surah) => {
      const matchesQuery =
        surah.englishName.toLowerCase().includes(lowered) ||
        surah.englishNameTranslation.toLowerCase().includes(lowered) ||
        surah.number.toString().includes(lowered);
      const matchesType = revelationType === "all" || surah.revelationType === revelationType;
      return matchesQuery && matchesType;
    });
  }, [surahs, query, revelationType]);

  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search surah name or number"
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-zinc-800 dark:bg-black"
        />
        <select
          value={revelationType}
          onChange={(event) => setRevelationType(event.target.value as typeof revelationType)}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-zinc-800 dark:bg-black"
        >
          <option value="all">All</option>
          <option value="Meccan">Meccan</option>
          <option value="Medinan">Medinan</option>
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paged.map((surah) => (
          <div
            key={surah.number}
            className="group relative rounded-2xl border border-zinc-200 bg-white p-4 transition-all duration-200 hover:border-primary-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-400"
          >
            <div className="flex items-center justify-between">
              <Link
                href={`/surah/${surah.number}`}
                className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-primary-600 dark:group-hover:text-primary-400"
              >
                {surah.englishName}
              </Link>
              <span className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                {surah.number}
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-500 line-clamp-1">{surah.englishNameTranslation}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">
                {surah.revelationType} • {surah.numberOfAyahs} Ayahs
              </span>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const audio = await getAudio(recitationEdition, surah.number);
                    setQueue(
                      [
                        {
                          reference: `${surah.englishName} ${surah.number}`,
                          surahNumber: surah.number,
                          ayahNumber: 1,
                          text: surah.englishName,
                          audioUrl: audio.audio,
                        },
                      ],
                      0,
                    );
                  } catch {
                    return;
                  }
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-colors hover:bg-primary-600 hover:text-white dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-500 dark:hover:text-white active:scale-90"
                aria-label={`Play ${surah.englishName}`}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
        >
          Previous
        </button>
        <span className="text-xs text-zinc-500">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
