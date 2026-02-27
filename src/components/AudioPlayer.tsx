"use client";

import { useEffect, useRef, useState } from "react";
import { getAudio } from "@/services/quranApi";
import { usePlayerStore } from "@/store/usePlayerStore";
import { usePreferencesStore } from "@/store/usePreferencesStore";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const retryCountsRef = useRef<Record<string, number>>({});
  const suppressPauseRef = useRef(false);
  const transitionRef = useRef(false);
  const loadingReferenceRef = useRef<string | null>(null);
  const queue = usePlayerStore((state) => state.queue);
  const currentIndex = usePlayerStore((state) => state.currentIndex);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const playbackRate = usePlayerStore((state) => state.playbackRate);
  const volume = usePlayerStore((state) => state.volume);
  const setPlaying = usePlayerStore((state) => state.setPlaying);
  const next = usePlayerStore((state) => state.next);
  const previous = usePlayerStore((state) => state.previous);
  const setPlaybackRate = usePlayerStore((state) => state.setPlaybackRate);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const setRepeat = usePlayerStore((state) => state.setRepeat);
  const repeat = usePlayerStore((state) => state.repeat);
  const shuffle = usePlayerStore((state) => state.shuffle);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);
  const updateQueueItem = usePlayerStore((state) => state.updateQueueItem);
  const recitationEdition = usePreferencesStore((state) => state.recitationEdition);
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
    if (!audio || !current) {
      return;
    }
    if (!current.audioUrl) {
      if (loadingReferenceRef.current === current.reference) {
        return;
      }
      loadingReferenceRef.current = current.reference;
      setStatus("loading");
      setErrorMessage(null);
      console.info("Fetching missing audio", { reference: current.reference, recitationEdition });
      getAudio(recitationEdition, current.reference)
        .then((audioResponse) => {
          if (!audioResponse.audio) {
            throw new Error("Audio not available.");
          }
          updateQueueItem(currentIndex, { audioUrl: audioResponse.audio });
        })
        .catch((error) => {
          console.error("Failed to fetch audio", { reference: current.reference, error });
          setStatus("error");
          setErrorMessage("Unable to load audio. Please try again.");
          setPlaying(false);
        })
        .finally(() => {
          loadingReferenceRef.current = null;
        });
      return;
    }
    audio.src = current.audioUrl;
    audio.load();
    retryCountsRef.current[current.audioUrl] = 0;
    setStatus("loading");
    setErrorMessage(null);
    if (isPlaying) {
      audio
        .play()
        .then(() => {
          suppressPauseRef.current = false;
          setStatus("idle");
          console.info("Audio play started", { reference: current.reference });
        })
        .catch((error) => {
          console.error("Audio play failed", { reference: current.reference, error });
          transitionRef.current = false;
          setStatus("error");
          setErrorMessage("Playback failed. Tap play to retry.");
        });
    }
  }, [current?.audioUrl, current?.reference, currentIndex, isPlaying, recitationEdition, updateQueueItem]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current?.audioUrl || !isPlaying) {
      return;
    }
    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setStatus("idle");
        })
        .catch((error) => {
          console.error("Autoplay resume failed", { reference: current.reference, error });
          transitionRef.current = false;
          setStatus("error");
          setErrorMessage("Playback failed. Tap play to retry.");
        });
    }
  }, [currentIndex, current?.audioUrl, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.volume = volume;
  }, [volume]);

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
          <button
            type="button"
            onClick={toggleShuffle}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
          >
            {shuffle ? "Shuffle On" : "Shuffle Off"}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className="h-7 w-24"
            aria-label="Volume"
          />
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
          suppressPauseRef.current = true;
          transitionRef.current = true;
          next();
        }}
        onPlay={() => {
          setPlaying(true);
          setStatus("idle");
          setErrorMessage(null);
          suppressPauseRef.current = false;
          transitionRef.current = false;
        }}
        onPause={() => {
          if (suppressPauseRef.current || transitionRef.current) {
            return;
          }
          setPlaying(false);
        }}
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
                transitionRef.current = false;
                setStatus("error");
                setErrorMessage("Unable to load audio. Please try again.");
              });
            }, 300 * (retries + 1));
            return;
          }
          transitionRef.current = false;
          setStatus("error");
          setErrorMessage("Unable to load audio. Please try again.");
          console.error("Audio error after retries", { url });
          setPlaying(false);
        }}
      />
    </div>
  );
}
