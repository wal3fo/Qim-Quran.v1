"use client";

import Link from "next/link";
import { useReadingProgressStore } from "@/store/useReadingProgressStore";

export default function RecentlyRead() {
  const history = useReadingProgressStore((state) => state.history);
  if (!history.length) {
    return <p className="text-sm text-zinc-500">No recent readings yet.</p>;
  }
  return (
    <ul className="space-y-2">
      {history.slice(0, 5).map((entry) => (
        <li key={`${entry.reference}-${entry.timestamp}`}>
          <Link
            className="text-sm font-medium text-primary-700 hover:text-primary-900 dark:text-primary-300"
            href={`/surah/${entry.surahNumber}`}
          >
            Surah {entry.surahNumber}, Ayah {entry.ayahNumber}
          </Link>
        </li>
      ))}
    </ul>
  );
}
