"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJuzByEdition } from "@/services/quranApi";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { formatReference } from "@/utils/quran";

export default function JuzClient() {
  const [juzNumber, setJuzNumber] = useState(1);
  const [surahFilter, setSurahFilter] = useState<number | "all">("all");
  const translationEdition = usePreferencesStore((state) => state.translationEdition);
  const recitationEdition = usePreferencesStore((state) => state.recitationEdition);
  const setQueue = usePlayerStore((state) => state.setQueue);

  const { data, isLoading } = useQuery({
    queryKey: ["juz", juzNumber, translationEdition],
    queryFn: () => getJuzByEdition(juzNumber, translationEdition),
  });

  const { data: audioData } = useQuery({
    queryKey: ["juz-audio", juzNumber, recitationEdition],
    queryFn: () => getJuzByEdition(juzNumber, recitationEdition),
  });

  const audioMap = useMemo(() => {
    const map = new Map<number, string>();
    audioData?.ayahs?.forEach((ayah) => {
      if (ayah.audio) {
        map.set(ayah.number, ayah.audio);
      }
    });
    return map;
  }, [audioData?.ayahs]);

  const filteredAyahs = useMemo(() => {
    if (!data?.ayahs) {
      return [];
    }
    if (surahFilter === "all") {
      return data.ayahs;
    }
    return data.ayahs.filter((ayah) => ayah.surah?.number === surahFilter);
  }, [data?.ayahs, surahFilter]);

  const surahOptions = useMemo(() => {
    if (!data?.surahs) {
      return [];
    }
    return Object.values(data.surahs);
  }, [data?.surahs]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          value={juzNumber}
          onChange={(event) => setJuzNumber(Number(event.target.value))}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-zinc-800 dark:bg-black"
        >
          {Array.from({ length: 30 }).map((_, index) => (
            <option key={index + 1} value={index + 1}>
              Juz {index + 1}
            </option>
          ))}
        </select>
        <select
          value={surahFilter}
          onChange={(event) =>
            setSurahFilter(event.target.value === "all" ? "all" : Number(event.target.value))
          }
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-zinc-800 dark:bg-black"
        >
          <option value="all">All Surahs</option>
          {surahOptions.map((surah) => (
            <option key={surah.number} value={surah.number}>
              {surah.englishName}
            </option>
          ))}
        </select>
      </div>
      {isLoading && <p className="text-sm text-zinc-500">Loading Juz...</p>}
      <div className="space-y-4">
        {filteredAyahs.map((ayah) => (
          <div
            key={`${ayah.number}-${ayah.numberInSurah}`}
            className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <p className="text-sm text-zinc-500">
              Surah {ayah.surah?.englishName} • Ayah {ayah.numberInSurah}
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              {ayah.text}
            </p>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => {
                  const audioUrl = audioMap.get(ayah.number);
                  if (!audioUrl) {
                    return;
                  }
                  setQueue(
                    [
                      {
                        reference: formatReference(ayah.surah?.number ?? 0, ayah.numberInSurah),
                        surahNumber: ayah.surah?.number ?? 0,
                        ayahNumber: ayah.numberInSurah,
                        text: ayah.text,
                        audioUrl,
                      },
                    ],
                    0,
                  );
                }}
                className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
              >
                Play Ayah
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
