"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/store/usePreferencesStore";

export default function DailyAyahNotifier() {
  const enabled = usePreferencesStore((state) => state.dailyNotifications);

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !("Notification" in window)) {
      return;
    }
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
    const interval = setInterval(() => {
      if (Notification.permission === "granted") {
        new Notification("Qim Quran", {
          body: "Your daily Ayah reminder is ready.",
        });
      }
    }, 1000 * 60 * 60 * 24);
    return () => clearInterval(interval);
  }, [enabled]);

  return null;
}
