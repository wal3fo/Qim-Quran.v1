"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createBrowserStorage } from "@/lib/storage";

export type PlayerAyah = {
  reference: string;
  surahNumber: number;
  ayahNumber: number;
  text: string;
  audioUrl?: string;
};

type PlayerState = {
  queue: PlayerAyah[];
  currentIndex: number;
  isPlaying: boolean;
  playbackRate: number;
  repeat: "off" | "ayah" | "surah";
  setQueue: (queue: PlayerAyah[], startIndex?: number) => void;
  playAt: (index: number) => void;
  setPlaying: (playing: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setRepeat: (repeat: "off" | "ayah" | "surah") => void;
  next: () => void;
  previous: () => void;
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      queue: [],
      currentIndex: 0,
      isPlaying: false,
      playbackRate: 1,
      repeat: "off",
      setQueue: (queue, startIndex = 0) =>
        set({ queue, currentIndex: startIndex, isPlaying: true }),
      playAt: (index) => set({ currentIndex: index, isPlaying: true }),
      setPlaying: (isPlaying) => set({ isPlaying }),
      setPlaybackRate: (playbackRate) => set({ playbackRate }),
      setRepeat: (repeat) => set({ repeat }),
      next: () => {
        const { currentIndex, queue, repeat } = get();
        if (repeat === "ayah") {
          set({ isPlaying: true });
          return;
        }
        const nextIndex = currentIndex + 1;
        if (nextIndex < queue.length) {
          set({ currentIndex: nextIndex, isPlaying: true });
        } else if (repeat === "surah") {
          set({ currentIndex: 0, isPlaying: true });
        } else {
          set({ isPlaying: false });
        }
      },
      previous: () => {
        const { currentIndex } = get();
        const prevIndex = Math.max(0, currentIndex - 1);
        set({ currentIndex: prevIndex, isPlaying: true });
      },
    }),
    {
      name: "qim-player",
      storage: createJSONStorage(() => createBrowserStorage()),
      partialize: (state) => ({
        playbackRate: state.playbackRate,
        repeat: state.repeat,
      }),
    },
  ),
);
