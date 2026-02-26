"use client";

import { usePreferencesStore } from "@/store/usePreferencesStore";

export default function HighContrastToggle() {
  const highContrast = usePreferencesStore((state) => state.highContrast);
  const setHighContrast = usePreferencesStore((state) => state.setHighContrast);
  return (
    <button
      type="button"
      onClick={() => setHighContrast(!highContrast)}
      className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
    >
      {highContrast ? "Contrast On" : "Contrast Off"}
    </button>
  );
}
