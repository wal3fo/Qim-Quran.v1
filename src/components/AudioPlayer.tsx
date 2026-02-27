"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { AudioPlayerCore } from "@/lib/audioPlayerCore";

/**
 * AudioPlayer component that integrates with the framework-agnostic AudioPlayerCore.
 * This refactor ensures sequential playback, correct event listener hygiene, and 
 * handles state synchronization with the Zustand store.
 * 
 * Prior flaws resolved:
 * 1. Event listener duplication: Listeners are now bound once in the Core class constructor.
 * 2. Stalled progression: The "ended" event now reliably triggers the next ayah in the Core class.
 * 3. Memory leaks: Core class provides a cleanup routine for teardown.
 */
export default function AudioPlayer() {
  const audioCoreRef = useRef<AudioPlayerCore | null>(null);
  
  // Store state
  const queue = usePlayerStore((state) => state.queue);
  const currentIndex = usePlayerStore((state) => state.currentIndex);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const isQueueActive = usePlayerStore((state) => state.isQueueActive);
  const playbackRate = usePlayerStore((state) => state.playbackRate);
  const volume = usePlayerStore((state) => state.volume);
  const repeat = usePlayerStore((state) => state.repeat);
  const shuffle = usePlayerStore((state) => state.shuffle);

  // Store actions
  const setPlaying = usePlayerStore((state) => state.setPlaying);
  const setPlaybackRate = usePlayerStore((state) => state.setPlaybackRate);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const setRepeat = usePlayerStore((state) => state.setRepeat);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);
  const syncState = usePlayerStore((state) => state.syncState);

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const current = queue[currentIndex];

  // Initialize the framework-agnostic core logic
  useEffect(() => {
    if (!audioCoreRef.current) {
      audioCoreRef.current = new AudioPlayerCore((state) => {
        // Synchronize core state back to Zustand for UI reactivity
        syncState(state);
      });
    }

    return () => {
      audioCoreRef.current?.cleanup();
      audioCoreRef.current = null;
    };
  }, [syncState]);

  // Handle external controls (Volume, Rate)
  useEffect(() => {
    audioCoreRef.current?.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    audioCoreRef.current?.setPlaybackRate(playbackRate);
  }, [playbackRate]);

  // Detect and react to store changes (Play All, Play Single, Pause)
  const lastQueueRef = useRef(queue);
  const lastIsPlayingRef = useRef(isPlaying);
  const lastIndexRef = useRef(currentIndex);

  useEffect(() => {
    if (!audioCoreRef.current) return;

    const queueChanged = queue !== lastQueueRef.current;
    const playToggled = isPlaying !== lastIsPlayingRef.current;
    const indexChanged = currentIndex !== lastIndexRef.current;

    if (queueChanged && isPlaying) {
      // New queue set (Play All or Play Surah)
      audioCoreRef.current.playAll(queue, currentIndex);
    } else if (playToggled) {
      // Simple play/pause toggle
      if (isPlaying) audioCoreRef.current.resume();
      else audioCoreRef.current.pause();
    } else if (indexChanged && isPlaying) {
      // Manual track change
      audioCoreRef.current.playAll(queue, currentIndex);
    }

    lastQueueRef.current = queue;
    lastIsPlayingRef.current = isPlaying;
    lastIndexRef.current = currentIndex;
  }, [queue, isPlaying, currentIndex]);

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
          {isQueueActive && <span className="text-primary-600 font-medium">Sequential Playback Active</span>}
          {status === "error" && (
            <span className="text-red-600 ml-2">Playback issue. Retrying...</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => audioCoreRef.current?.previous()}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Prev
          </button>
          
          <button
            type="button"
            onClick={() => setPlaying(!isPlaying)}
            className="rounded-full bg-primary-600 px-4 py-1 text-xs font-semibold text-white hover:bg-primary-700 transition-colors shadow-sm"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          
          <button
            type="button"
            onClick={() => audioCoreRef.current?.next()}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Next
          </button>

          <button
            type="button"
            onClick={toggleShuffle}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              shuffle 
                ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300" 
                : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            {shuffle ? "Shuffle On" : "Shuffle Off"}
          </button>

          <div className="flex items-center gap-2 ml-2">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Vol</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              className="h-1.5 w-20 accent-primary-600 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Volume"
            />
          </div>

          <select
            value={playbackRate}
            onChange={(event) => setPlaybackRate(Number(event.target.value))}
            className="rounded-full border border-zinc-300 bg-transparent px-2 py-1 text-xs dark:border-zinc-700 focus:ring-1 focus:ring-primary-500 outline-none"
            aria-label="Playback speed"
          >
            {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
              <option key={rate} value={rate} className="dark:bg-zinc-900">
                {rate}x
              </option>
            ))}
          </select>

          <select
            value={repeat}
            onChange={(event) => setRepeat(event.target.value as "off" | "ayah" | "surah")}
            className="rounded-full border border-zinc-300 bg-transparent px-2 py-1 text-xs dark:border-zinc-700 focus:ring-1 focus:ring-primary-500 outline-none"
            aria-label="Repeat mode"
          >
            <option value="off" className="dark:bg-zinc-900">No Repeat</option>
            <option value="ayah" className="dark:bg-zinc-900">Repeat Ayah</option>
            <option value="surah" className="dark:bg-zinc-900">Repeat Surah</option>
          </select>
        </div>
      </div>
    </div>
  );
}
