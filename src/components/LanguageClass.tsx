"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/store/usePreferencesStore";

export default function LanguageClass() {
  const language = usePreferencesStore((state) => state.language);
  
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  return null;
}
