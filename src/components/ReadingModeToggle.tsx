"use client";

import { usePreferencesStore } from "@/store/usePreferencesStore";

export default function ReadingModeToggle() {
  const readingMode = usePreferencesStore((state) => state.readingMode);
  const setReadingMode = usePreferencesStore((state) => state.setReadingMode);
  return (
    <select
      value={readingMode}
      onChange={(event) => setReadingMode(event.target.value as "normal" | "focus")}
      className="rounded-full border border-zinc-300 bg-transparent px-2 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
      aria-label="Reading mode"
    >
      <option value="normal">Normal</option>
      <option value="focus">Focus</option>
    </select>
  );
}
