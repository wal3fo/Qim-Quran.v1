"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const retryCountsRef = useRef<Record<string, number>>({});
  const queue = usePlayerStore((state) => state.queue);
  const currentIndex = usePlayerStore((state) => state.currentIndex);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const playbackRate = usePlayerStore((state) => state.playbackRate);
  const setPlaying = usePlayerStore((state) => state.setPlaying);
  const next = usePlayerStore((state) => state.next);
  const previous = usePlayerStore((state) => state.previous);
  const setPlaybackRate = usePlayerStore((state) => state.setPlaybackRate);
  const setRepeat = usePlayerStore((state) => state.setRepeat);
  const repeat = usePlayerStore((state) => state.repeat);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const current = queue[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current?.audioUrl) {
      if (isPlaying && current && !current.audioUrl) {
        setStatus("error");
        setErrorMessage("Audio is not available for this ayah.");
        console.error("Missing audio URL", { current });
        setPlaying(false);
      }
      return;
    }
    audio.src = current.audioUrl;
    retryCountsRef.current[current.audioUrl] = 0;
    setStatus("loading");
    setErrorMessage(null);
    if (isPlaying) {
      audio
        .play()
        .then(() => {
          setStatus("idle");
          console.info("Audio play started", { reference: current.reference });
        })
        .catch((error) => {
          console.error("Audio play failed", { reference: current.reference, error });
          setStatus("error");
          setErrorMessage("Playback failed. Tap play to retry.");
        });
    }
  }, [current?.audioUrl, isPlaying]);

  if (!current) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200/60 bg-white/95 px-4 py-3 backdrop-blur dark:border-zinc-800/60 dark:bg-black/95">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {current.reference}
          </p>
          <p className="text-xs text-zinc-500 line-clamp-1">{current.text}</p>
        </div>
        <div className="text-xs">
          {status === "loading" && <span className="text-primary-600">Loading audio...</span>}
          {status === "error" && errorMessage && (
            <span className="text-red-600">{errorMessage}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={previous}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => setPlaying(!isPlaying)}
            className="rounded-full bg-primary-600 px-4 py-1 text-xs font-semibold text-white"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={next}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
          >
            Next
          </button>
          <select
            value={playbackRate}
            onChange={(event) => setPlaybackRate(Number(event.target.value))}
            className="rounded-full border border-zinc-300 bg-transparent px-2 py-1 text-xs dark:border-zinc-700"
            aria-label="Playback speed"
          >
            {[0.75, 1, 1.25, 1.5].map((rate) => (
              <option key={rate} value={rate}>
                {rate}x
              </option>
            ))}
          </select>
          <select
            value={repeat}
            onChange={(event) => setRepeat(event.target.value as "off" | "ayah" | "surah")}
            className="rounded-full border border-zinc-300 bg-transparent px-2 py-1 text-xs dark:border-zinc-700"
            aria-label="Repeat mode"
          >
            <option value="off">No Repeat</option>
            <option value="ayah">Repeat Ayah</option>
            <option value="surah">Repeat Surah</option>
          </select>
        </div>
      </div>
      <audio
        ref={audioRef}
        onEnded={() => {
          console.info("Audio ended", { reference: current.reference });
          next();
        }}
        onPlay={() => {
          setPlaying(true);
          setStatus("idle");
          setErrorMessage(null);
        }}
        onPause={() => setPlaying(false)}
        onWaiting={() => setStatus("loading")}
        onCanPlay={() => setStatus("idle")}
        onError={() => {
          const audio = audioRef.current;
          const url = current?.audioUrl;
          if (!audio || !url) {
            return;
          }
          const retries = retryCountsRef.current[url] ?? 0;
          if (retries < 2) {
            retryCountsRef.current[url] = retries + 1;
            setStatus("loading");
            console.warn("Retrying audio load", { url, attempt: retries + 1 });
            setTimeout(() => {
              audio.load();
              audio.play().catch((error) => {
                console.error("Retry failed", { url, error });
                setStatus("error");
                setErrorMessage("Unable to load audio. Please try again.");
              });
            }, 300 * (retries + 1));
            return;
          }
          setStatus("error");
          setErrorMessage("Unable to load audio. Please try again.");
          console.error("Audio error after retries", { url });
          setPlaying(false);
        }}
      />
    </div>
  );
}
