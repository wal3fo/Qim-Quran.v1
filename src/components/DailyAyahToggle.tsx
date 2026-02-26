"use client";

import { usePreferencesStore } from "@/store/usePreferencesStore";

export default function DailyAyahToggle() {
  const enabled = usePreferencesStore((state) => state.dailyNotifications);
  const setDailyNotifications = usePreferencesStore((state) => state.setDailyNotifications);
  return (
    <button
      type="button"
      onClick={() => setDailyNotifications(!enabled)}
      className="rounded-full border border-primary-600 px-4 py-2 text-xs font-semibold text-primary-700 dark:text-primary-200"
    >
      {enabled ? "Disable Daily Ayah" : "Enable Daily Ayah"}
    </button>
  );
}
