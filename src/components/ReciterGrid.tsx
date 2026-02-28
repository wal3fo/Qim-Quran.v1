"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { getAudio } from "@/services/quranApi";
import type { Edition } from "@/types/quran";

type Props = {
  reciters: Edition[];
};

export default function ReciterGrid({ reciters }: Props) {
  const setQueue = usePlayerStore((state) => state.setQueue);
  const recitationEdition = usePreferencesStore((state) => state.recitationEdition);
  const setRecitationEdition = usePreferencesStore((state) => state.setRecitationEdition);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reciters.map((reciter) => {
        const isActive = recitationEdition === reciter.identifier;
        return (
          <div
            key={reciter.identifier}
            className={`rounded-2xl border p-4 transition-all duration-300 ${
              isActive
                ? "border-primary-500 bg-primary-50/50 ring-1 ring-primary-500/20 dark:bg-primary-900/10"
                : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {reciter.englishName}
                </p>
                <p className="text-sm text-zinc-500">{reciter.language.toUpperCase()}</p>
              </div>
              {isActive && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
              )}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const audio = await getAudio(reciter.identifier, 1);
                    setQueue(
                      [
                        {
                          reference: `${reciter.englishName} (Sample)`,
                          surahNumber: 1,
                          ayahNumber: 1,
                          text: "Sample Recitation",
                          audioUrl: audio.audio,
                        },
                      ],
                      0,
                    );
                  } catch {
                    return;
                  }
                }}
                className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Play Sample
              </button>
              <button
                type="button"
                onClick={() => setRecitationEdition(reciter.identifier)}
                disabled={isActive}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 cursor-default"
                    : "bg-primary-600 text-white hover:bg-primary-700 shadow-sm"
                }`}
              >
                {isActive ? "Selected" : "Select Reciter"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
