"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/store/usePreferencesStore";

export default function ReadingModeClass() {
  const readingMode = usePreferencesStore((state) => state.readingMode);
  useEffect(() => {
    const root = document.documentElement;
    if (readingMode === "focus") {
      root.classList.add("focus-mode");
    } else {
      root.classList.remove("focus-mode");
    }
  }, [readingMode]);
  return null;
}
