"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Ayah, SurahDetail } from "@/types/quran";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import AyahList from "@/components/AyahList";
import { usePlayerStore } from "@/store/usePlayerStore";
import { getAudio, getSurahByEdition, getEditionsByType } from "@/services/quranApi";

type Props = {
  surah: SurahDetail;
};

export default function SurahDetailClient({ surah }: Props) {
  const router = useRouter();
  const translationEdition = usePreferencesStore((state) => state.translationEdition);
  const setTranslationEdition = usePreferencesStore((state) => state.setTranslationEdition);
  const recitationEdition = usePreferencesStore((state) => state.recitationEdition);
  const tafsirEdition = usePreferencesStore((state) => state.tafsirEdition);
  const setTafsirEdition = usePreferencesStore((state) => state.setTafsirEdition);
  
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTafsir, setShowTafsir] = useState(false);
  const [offlineSaved, setOfflineSaved] = useState(false);
  const setQueue = usePlayerStore((state) => state.setQueue);
  const isQueueActive = usePlayerStore((state) => state.isQueueActive);

  // Fetch available tafsir editions
  const { data: tafsirEditions } = useQuery({
    queryKey: ["editions-tafsir"],
    queryFn: () => getEditionsByType("tafsir"),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  // Fetch available translation editions
  const { data: translationEditions } = useQuery({
    queryKey: ["editions-translation"],
    queryFn: () => getEditionsByType("translation"),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  useEffect(() => {
    if (surah.number < 114) {
      router.prefetch(`/surah/${surah.number + 1}`);
    }
  }, [router, surah.number]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem(`offline-surah-${surah.number}`);
    setOfflineSaved(Boolean(stored));
  }, [surah.number]);

  const { data: translationData } = useQuery({
    queryKey: ["surah-translation", surah.number, translationEdition],
    queryFn: () => getSurahByEdition(surah.number, translationEdition),
  });

  const { data: audioData, isLoading: isAudioLoading } = useQuery({
    queryKey: ["surah-audio", surah.number, recitationEdition],
    queryFn: () => getSurahByEdition(surah.number, recitationEdition),
  });

  const { data: tafsirData } = useQuery({
    queryKey: ["surah-tafsir", surah.number, tafsirEdition],
    queryFn: () => getSurahByEdition(surah.number, tafsirEdition),
    enabled: showTafsir,
  });

  const ayahs = useMemo<Ayah[]>(() => {
    if (!audioData?.ayahs) {
      return surah.ayahs;
    }
    return surah.ayahs.map((ayah, index) => ({
      ...ayah,
      audio: audioData.ayahs[index]?.audio,
    }));
  }, [surah.ayahs, audioData?.ayahs]);

  const { data: fullSurahAudio } = useQuery({
    queryKey: ["surah-full-audio", surah.number, recitationEdition],
    queryFn: () => getAudio(recitationEdition, surah.number),
  });

  const translations = showTranslation
    ? translationData?.ayahs?.map((ayah) => ayah.text)
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <button
            type="button"
            onClick={() => setShowTranslation((value) => !value)}
            className={`flex-1 rounded-full border px-4 py-1.5 text-xs font-medium transition-all sm:flex-none ${
              showTranslation
                ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600"
            }`}
          >
            {showTranslation ? "Translation On" : "Translation Off"}
          </button>
          
          {showTranslation && translationEditions && (
            <select
              value={translationEdition}
              onChange={(e) => setTranslationEdition(e.target.value)}
              className="flex-1 rounded-full border border-zinc-300 bg-transparent px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary-500 dark:border-zinc-700 sm:flex-none"
            >
              {translationEditions
                .filter(e => e.language === "en" || e.language === "ar")
                .map((edition) => (
                <option key={edition.identifier} value={edition.identifier} className="dark:bg-zinc-900">
                  {edition.englishName}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <button
            type="button"
            onClick={() => setShowTafsir((value) => !value)}
            className={`flex-1 rounded-full border px-4 py-1.5 text-xs font-medium transition-all sm:flex-none ${
              showTafsir
                ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600"
            }`}
          >
            {showTafsir ? "Tafsir On" : "Tafsir Off"}
          </button>

          {showTafsir && tafsirEditions && (
            <select
              value={tafsirEdition}
              onChange={(e) => setTafsirEdition(e.target.value)}
              className="flex-1 rounded-full border border-zinc-300 bg-transparent px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary-500 dark:border-zinc-700 sm:flex-none"
            >
              {tafsirEditions.map((edition) => (
                <option key={edition.identifier} value={edition.identifier} className="dark:bg-zinc-900">
                  {edition.englishName}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex w-full items-center justify-between gap-3 sm:flex-1 sm:justify-end">
          {fullSurahAudio?.audio && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isQueueActive}
                onClick={() =>
                  setQueue(
                    [
                      {
                        reference: `${surah.englishName} ${surah.number}`,
                        surahNumber: surah.number,
                        ayahNumber: 1,
                        text: surah.englishName,
                        audioUrl: fullSurahAudio.audio,
                      },
                    ],
                    0,
                  )
                }
                className="rounded-full bg-primary-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 disabled:opacity-50 shadow-sm transition-all active:scale-95"
              >
                {isQueueActive ? "Playing..." : "Play All"}
              </button>
              <a
                href={fullSurahAudio.audio}
                className="rounded-full border border-primary-500 px-4 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-50 dark:text-primary-200 dark:hover:bg-primary-900/20 transition-all active:scale-95"
                download
              >
                Download
              </a>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              if (typeof window === "undefined") {
                return;
              }
              if (offlineSaved) {
                window.localStorage.removeItem(`offline-surah-${surah.number}`);
                setOfflineSaved(false);
                return;
              }
              window.localStorage.setItem(
                `offline-surah-${surah.number}`,
                JSON.stringify({
                  surah,
                  storedAt: new Date().toISOString(),
                }),
              );
              setOfflineSaved(true);
            }}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
              offlineSaved
                ? "border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                : "border-primary-500 text-primary-700 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-900/20"
            }`}
          >
            {offlineSaved ? "Saved" : "Offline"}
          </button>
        </div>
      </div>

      <AyahList
        surahNumber={surah.number}
        surahName={surah.englishName}
        ayahs={ayahs}
        translations={translations}
        tafsir={showTafsir ? tafsirData?.ayahs?.map((ayah) => ayah.text) : undefined}
        recitationEdition={recitationEdition}
        audioLoading={isAudioLoading}
      />
    </div>
  );
}
