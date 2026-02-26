"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createBrowserStorage } from "@/lib/storage";

export type ReadingEntry = {
  reference: string;
  surahNumber: number;
  ayahNumber: number;
  timestamp: string;
};

type ReadingProgressState = {
  lastRead?: ReadingEntry;
  history: ReadingEntry[];
  completionBySurah: Record<number, number>;
  setLastRead: (entry: ReadingEntry) => void;
  addHistory: (entry: ReadingEntry) => void;
  setCompletion: (surahNumber: number, percent: number) => void;
  clearHistory: () => void;
};

export const useReadingProgressStore = create<ReadingProgressState>()(
  persist(
    (set) => ({
      lastRead: undefined,
      history: [],
      completionBySurah: {},
      setLastRead: (entry) => set({ lastRead: entry }),
      addHistory: (entry) =>
        set((state) => ({
          history: [entry, ...state.history].slice(0, 20),
        })),
      setCompletion: (surahNumber, percent) =>
        set((state) => ({
          completionBySurah: { ...state.completionBySurah, [surahNumber]: percent },
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "qim-reading-progress",
      storage: createJSONStorage(() => createBrowserStorage()),
    },
  ),
);
