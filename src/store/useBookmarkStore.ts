"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createBrowserStorage } from "@/lib/storage";

export type Bookmark = {
  reference: string;
  surahNumber: number;
  ayahNumber: number;
  text: string;
  createdAt: string;
};

type BookmarkState = {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (reference: string) => void;
  isBookmarked: (reference: string) => boolean;
};

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (bookmark) =>
        set((state) => ({
          bookmarks: state.bookmarks.some((b) => b.reference === bookmark.reference)
            ? state.bookmarks
            : [bookmark, ...state.bookmarks],
        })),
      removeBookmark: (reference) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((bookmark) => bookmark.reference !== reference),
        })),
      isBookmarked: (reference) => get().bookmarks.some((bookmark) => bookmark.reference === reference),
    }),
    {
      name: "qim-bookmarks",
      storage: createJSONStorage(() => createBrowserStorage()),
    },
  ),
);
