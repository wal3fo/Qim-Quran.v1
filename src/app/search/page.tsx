"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { normalizeKeyword } from "@/utils/quran";
import { searchQuran } from "@/services/quranApi";

type FormValues = {
  keyword: string;
  surah: string;
};

export default function SearchPage() {
  const { register, watch } = useForm<FormValues>({
    defaultValues: { keyword: "", surah: "all" },
  });
  const [advanced, setAdvanced] = useState(false);
  const [page, setPage] = useState(1);
  const translationEdition = usePreferencesStore((state) => state.translationEdition);
  const keyword = watch("keyword");
  const surah = watch("surah");
  const debouncedKeyword = useDebouncedValue(keyword, 400);
  const normalizedKeyword = useMemo(() => normalizeKeyword(debouncedKeyword), [debouncedKeyword]);

  useEffect(() => {
    setPage(1);
  }, [normalizedKeyword, surah, translationEdition]);

  const { data, isLoading } = useQuery({
    queryKey: ["search", normalizedKeyword, surah, translationEdition],
    queryFn: () => searchQuran(normalizedKeyword, surah, translationEdition),
    enabled: normalizedKeyword.length > 2,
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Search Quran</h1>
        <p className="text-sm text-zinc-500">Global search with edition and surah filters.</p>
      </header>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-zinc-500">
          <input
            type="checkbox"
            checked={advanced}
            onChange={(event) => setAdvanced(event.target.checked)}
          />
          Advanced search
        </label>
        <span className="text-xs text-zinc-400">Edition: {translationEdition}</span>
      </div>
      <div className={`grid gap-3 ${advanced ? "sm:grid-cols-[2fr_1fr]" : "sm:grid-cols-1"}`}>
        <input
          {...register("keyword")}
          placeholder="Search keyword"
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-800 dark:bg-black"
        />
        {advanced && (
          <select
            {...register("surah")}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-black"
          >
            <option value="all">All Surahs</option>
            {Array.from({ length: 114 }).map((_, index) => (
              <option key={index + 1} value={index + 1}>
                Surah {index + 1}
              </option>
            ))}
          </select>
        )}
      </div>
      {isLoading && normalizedKeyword.length > 2 && (
        <p className="text-sm text-zinc-500">Searching...</p>
      )}
      {!normalizedKeyword && (
        <p className="text-sm text-zinc-500">Enter at least 3 characters to search.</p>
      )}
      <div className="space-y-4">
        {data?.matches
          ?.slice((page - 1) * 10, page * 10)
          .map((match) => (
          <div
            key={`${match.surah.number}-${match.numberInSurah}`}
            className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <p className="text-sm text-zinc-500">
              {match.surah.englishName} • Ayah {match.numberInSurah}
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              {match.text.split(new RegExp(`(${normalizedKeyword})`, "gi")).map((part, index) =>
                part.toLowerCase() === normalizedKeyword.toLowerCase() ? (
                  <span key={index} className="rounded bg-primary-100 px-1 text-primary-800">
                    {part}
                  </span>
                ) : (
                  <span key={index}>{part}</span>
                ),
              )}
            </p>
          </div>
          ))}
      </div>
      {data?.matches && data.matches.length > 10 && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
          >
            Previous
          </button>
          <span className="text-xs text-zinc-500">
            Page {page} of {Math.ceil(data.matches.length / 10)}
          </span>
          <button
            type="button"
            onClick={() =>
              setPage((prev) => Math.min(Math.ceil(data.matches.length / 10), prev + 1))
            }
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
