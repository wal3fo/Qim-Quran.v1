"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/store/usePreferencesStore";

export default function FontScaleClass() {
  const fontScale = usePreferencesStore((state) => state.fontScale);
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--font-scale", fontScale.toString());
  }, [fontScale]);
  return null;
}
