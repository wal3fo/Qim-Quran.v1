"use client";

import { useReadingProgressStore } from "@/store/useReadingProgressStore";

export default function ReadingProgressSummary() {
  const completionBySurah = useReadingProgressStore((state) => state.completionBySurah);
  const completionValues = Object.values(completionBySurah);
  const average =
    completionValues.length > 0
      ? completionValues.reduce((sum, value) => sum + value, 0) / completionValues.length
      : 0;

  return (
    <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Reading progress</h2>
      <p className="mt-2 text-sm text-zinc-500">
        Average completion: {Math.round(average)}%
      </p>
      <div className="mt-4 h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-2 rounded-full bg-primary-500"
          style={{ width: `${Math.min(100, Math.max(0, average))}%` }}
        />
      </div>
    </div>
  );
}
