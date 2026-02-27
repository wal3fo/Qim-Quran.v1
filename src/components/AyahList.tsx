"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AyahModal from "@/components/AyahModal";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useReadingProgressStore } from "@/store/useReadingProgressStore";
import type { Ayah } from "@/types/quran";
import { getAudio, getAyah } from "@/services/quranApi";
import { formatReference } from "@/utils/quran";

type Props = {
  surahNumber: number;
  surahName: string;
  ayahs: Ayah[];
  translations?: string[];
  tafsir?: string[];
  recitationEdition: string;
  audioLoading: boolean;
};

export default function AyahList({
  surahNumber,
  surahName,
  ayahs,
  translations,
  tafsir,
  recitationEdition,
  audioLoading,
}: Props) {
  const setQueue = usePlayerStore((state) => state.setQueue);
  const currentIndex = usePlayerStore((state) => state.currentIndex);
  const queue = usePlayerStore((state) => state.queue);
  const isQueueActive = usePlayerStore((state) => state.isQueueActive);
  const setQueueActive = usePlayerStore((state) => state.setQueueActive);
  const addBookmark = useBookmarkStore((state) => state.addBookmark);
  const removeBookmark = useBookmarkStore((state) => state.removeBookmark);
  const isBookmarked = useBookmarkStore((state) => state.isBookmarked);
  const setLastRead = useReadingProgressStore((state) => state.setLastRead);
  const addHistory = useReadingProgressStore((state) => state.addHistory);
  const setCompletion = useReadingProgressStore((state) => state.setCompletion);
  const [selectedReference, setSelectedReference] = useState<string | null>(null);
  const [playError, setPlayError] = useState<string | null>(null);
  const [playLoadingReference, setPlayLoadingReference] = useState<string | null>(null);

  const { data: selectedAyah } = useQuery({
    queryKey: ["ayah-detail", selectedReference],
    queryFn: () => getAyah(selectedReference ?? ""),
    enabled: Boolean(selectedReference),
  });

  const playerQueue = useMemo(
    () =>
      ayahs.map((ayah) => ({
        reference: `${surahName} ${surahNumber}:${ayah.numberInSurah}`,
        surahNumber,
        ayahNumber: ayah.numberInSurah,
        text: ayah.text,
        audioUrl: ayah.audio,
      })),
    [ayahs, surahNumber, surahName],
  );

  const handlePlayAll = () => {
    if (isQueueActive) return; // Debounce/Prevent rapid clicks
    setPlayError(null);
    if (audioLoading) {
      setPlayError("Audio is still loading. Playback will start as audio becomes available.");
    }
    console.info("Play all ayahs", { surahNumber, count: playerQueue.length });
    setQueue(playerQueue, 0);
  };

  const handlePlayAyah = async (reference: string, index: number, audioUrl?: string) => {
    setPlayError(null);
    setQueueActive(false); // Manual play aborts the queue as per requirements
    if (!audioUrl) {
      setPlayLoadingReference(reference);
      try {
        console.info("Fetching audio for ayah", { reference, recitationEdition });
        const audio = await getAudio(recitationEdition, reference);
        if (!audio.audio) {
          throw new Error("Audio not available.");
        }
        setQueue(
          [
            {
              reference: `${surahName} ${surahNumber}:${ayahs[index]?.numberInSurah ?? index + 1}`,
              surahNumber,
              ayahNumber: ayahs[index]?.numberInSurah ?? index + 1,
              text: ayahs[index]?.text ?? "",
              audioUrl: audio.audio,
            },
          ],
          0,
        );
      } catch (error) {
        console.error("Failed to load ayah audio", { reference, error });
        setPlayError("Unable to load audio. Please try again.");
      } finally {
        setPlayLoadingReference(null);
      }
      return;
    }
    console.info("Play ayah", { reference });
    setQueue(playerQueue, index);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Ayahs</h2>
        <button
          type="button"
          onClick={handlePlayAll}
          disabled={isQueueActive || audioLoading}
          className="rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50 transition-opacity"
        >
          {audioLoading ? "Loading Audio..." : isQueueActive ? "Playing..." : "Play All"}
        </button>
      </div>
      {playError && <p className="text-sm text-red-600">{playError}</p>}
      <div className="space-y-4">
        {ayahs.map((ayah, index) => {
          const reference = formatReference(surahNumber, ayah.numberInSurah);
          const active = queue[currentIndex]?.reference === reference;
          const bookmarked = isBookmarked(reference);
          const isLoading = playLoadingReference === reference;
          return (
            <div
              key={reference}
              className={`rounded-2xl border p-4 ${
                active
                  ? "border-primary-500 bg-primary-50/70 dark:bg-primary-900/20"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <p className="arabic-text text-2xl leading-relaxed text-zinc-900 dark:text-zinc-100">
                    {ayah.text}
                  </p>
                  {translations?.[index] && (
                    <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                      {translations[index]}
                    </p>
                  )}
                  {tafsir?.[index] && (
                    <p className="rounded-xl bg-zinc-50 p-3 text-sm leading-6 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                      {tafsir[index]}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-zinc-500">Ayah {ayah.numberInSurah}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      await handlePlayAyah(reference, index, ayah.audio);
                      const entry = {
                        reference,
                        surahNumber,
                        ayahNumber: ayah.numberInSurah,
                        timestamp: new Date().toISOString(),
                      };
                      setLastRead(entry);
                      addHistory(entry);
                      setCompletion(surahNumber, Math.round(((index + 1) / ayahs.length) * 100));
                    }}
                    disabled={isLoading}
                    className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
                  >
                    {isLoading ? "Loading..." : "Play"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      bookmarked
                        ? removeBookmark(reference)
                        : addBookmark({
                            reference,
                            surahNumber,
                            ayahNumber: ayah.numberInSurah,
                            text: ayah.text,
                            createdAt: new Date().toISOString(),
                          })
                    }
                    className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
                  >
                    {bookmarked ? "Bookmarked" : "Bookmark"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(ayah.text)}
                    className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedReference(reference)}
                    className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <AyahModal
        open={Boolean(selectedReference)}
        onClose={() => setSelectedReference(null)}
        ayah={selectedAyah}
      />
    </div>
  );
}
