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
  volume: number;
  repeat: "off" | "ayah" | "surah";
  shuffle: boolean;
  setQueue: (queue: PlayerAyah[], startIndex?: number) => void;
  playAt: (index: number) => void;
  setPlaying: (playing: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  setRepeat: (repeat: "off" | "ayah" | "surah") => void;
  toggleShuffle: () => void;
  updateQueueItem: (index: number, update: Partial<PlayerAyah>) => void;
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
      volume: 1,
      repeat: "off",
      shuffle: false,
      setQueue: (queue, startIndex = 0) =>
        set({ queue, currentIndex: startIndex, isPlaying: true }),
      playAt: (index) => set({ currentIndex: index, isPlaying: true }),
      setPlaying: (isPlaying) => set({ isPlaying }),
      setPlaybackRate: (playbackRate) => set({ playbackRate }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      setRepeat: (repeat) => set({ repeat }),
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
      updateQueueItem: (index, update) =>
        set((state) => {
          if (index < 0 || index >= state.queue.length) {
            return state;
          }
          const queue = [...state.queue];
          queue[index] = { ...queue[index], ...update };
          return { queue };
        }),
      next: () => {
        const { currentIndex, queue, repeat, shuffle } = get();
        if (repeat === "ayah") {
          set({ isPlaying: true });
          return;
        }
        if (shuffle && queue.length > 1) {
          let nextIndex = currentIndex;
          while (nextIndex === currentIndex) {
            nextIndex = Math.floor(Math.random() * queue.length);
          }
          set({ currentIndex: nextIndex, isPlaying: true });
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
        volume: state.volume,
        repeat: state.repeat,
        shuffle: state.shuffle,
      }),
    },
  ),
);
