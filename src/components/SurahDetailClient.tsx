"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Ayah, SurahDetail } from "@/types/quran";
import { getAudio, getSurahByEdition } from "@/services/quranApi";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import AyahList from "@/components/AyahList";
import { usePlayerStore } from "@/store/usePlayerStore";

type Props = {
  surah: SurahDetail;
};

export default function SurahDetailClient({ surah }: Props) {
  const router = useRouter();
  const translationEdition = usePreferencesStore((state) => state.translationEdition);
  const recitationEdition = usePreferencesStore((state) => state.recitationEdition);
  const tafsirEdition = usePreferencesStore((state) => state.tafsirEdition);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTafsir, setShowTafsir] = useState(false);
  const [offlineSaved, setOfflineSaved] = useState(false);
  const setQueue = usePlayerStore((state) => state.setQueue);

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
  const isAudioReady = Boolean(audioData?.ayahs?.every((ayah) => Boolean(ayah.audio)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setShowTranslation((value) => !value)}
          className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
        >
          {showTranslation ? "Hide Translation" : "Show Translation"}
        </button>
        <button
          type="button"
          onClick={() => setShowTafsir((value) => !value)}
          className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
        >
          {showTafsir ? "Hide Tafsir" : "Show Tafsir"}
        </button>
        <p className="text-xs text-zinc-500">
          Translation: {translationEdition} • Tafsir: {tafsirEdition} • Reciter: {recitationEdition}
        </p>
        {fullSurahAudio?.audio && (
          <>
            <button
              type="button"
              onClick={() =>
                setQueue(
                  [
                    {
                      reference: `Surah ${surah.number}`,
                      surahNumber: surah.number,
                      ayahNumber: 1,
                      text: surah.englishName,
                      audioUrl: fullSurahAudio.audio,
                    },
                  ],
                  0,
                )
              }
              className="rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white"
            >
              Play Full Surah
            </button>
            <a
              href={fullSurahAudio.audio}
              className="rounded-full border border-primary-500 px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-200"
              download
            >
              Download Audio
            </a>
          </>
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
          className="rounded-full border border-primary-500 px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-200"
        >
          {offlineSaved ? "Remove Offline" : "Save Offline"}
        </button>
      </div>
      <AyahList
        surahNumber={surah.number}
        ayahs={ayahs}
        translations={translations}
        tafsir={showTafsir ? tafsirData?.ayahs?.map((ayah) => ayah.text) : undefined}
        recitationEdition={recitationEdition}
        audioReady={isAudioReady}
        audioLoading={isAudioLoading}
      />
    </div>
  );
}
