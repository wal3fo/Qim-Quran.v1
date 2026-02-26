"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import type { Edition } from "@/types/quran";

type Props = {
  reciters: Edition[];
};

export default function ReciterGrid({ reciters }: Props) {
  const setQueue = usePlayerStore((state) => state.setQueue);
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reciters.map((reciter) => (
        <div
          key={reciter.identifier}
          className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {reciter.englishName}
          </p>
          <p className="text-sm text-zinc-500">{reciter.language.toUpperCase()}</p>
          <button
            type="button"
            onClick={() =>
              setQueue(
                [
                  {
                    reference: "Sample",
                    surahNumber: 1,
                    ayahNumber: 1,
                    text: "Sample Recitation",
                    audioUrl: `https://cdn.islamic.network/quran/audio-surah/128/${reciter.identifier}/1.mp3`,
                  },
                ],
                0,
              )
            }
            className="mt-3 rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
          >
            Play Sample
          </button>
        </div>
      ))}
    </div>
  );
}
