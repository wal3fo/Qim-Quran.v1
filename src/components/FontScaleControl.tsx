"use client";

import { usePreferencesStore } from "@/store/usePreferencesStore";

export default function FontScaleControl() {
  const fontScale = usePreferencesStore((state) => state.fontScale);
  const setFontScale = usePreferencesStore((state) => state.setFontScale);
  return (
    <input
      type="range"
      min={0.9}
      max={1.4}
      step={0.05}
      value={fontScale}
      onChange={(event) => setFontScale(Number(event.target.value))}
      aria-label="Font size"
      className="w-24"
    />
  );
}
