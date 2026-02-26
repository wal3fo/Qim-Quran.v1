"use client";

import { useEffect, useRef } from "react";
import type { AyahReferenceData } from "@/types/quran";

type Props = {
  open: boolean;
  onClose: () => void;
  ayah?: AyahReferenceData;
};

export default function AyahModal({ open, onClose, ayah }: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
    }
    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  if (!ayah) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-900 shadow-xl dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {ayah.surah.englishName} • {ayah.numberInSurah}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
          >
            Close
          </button>
        </div>
        <p className="text-right text-2xl leading-relaxed">{ayah.text}</p>
        <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
          <span>Juz {ayah.juz}</span>
          <span>Page {ayah.page}</span>
          <span>Ruku {ayah.ruku}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(ayah.text)}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
          >
            Copy Ayah
          </button>
          <a
            href={`https://alquran.cloud/ayah/${ayah.surah.number}:${ayah.numberInSurah}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
          >
            Open Source
          </a>
        </div>
      </div>
    </dialog>
  );
}
