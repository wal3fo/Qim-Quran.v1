import { PlayerAyah } from "@/store/usePlayerStore";

/**
 * Framework-agnostic AudioPlayer core class.
 * Encapsulates all logic for sequential playback, event hygiene, and edge cases.
 * Resolves prior flaws where event listeners could duplicate or progression would stall.
 */
export class AudioPlayerCore {
  private audio: HTMLAudioElement;
  private queue: PlayerAyah[] = [];
  private currentIndex: number = 0;
  private isPlaying: boolean = false;
  private retryCounts: Record<string, number> = {};
  private maxRetries = 2;
  private debounceTimeout: NodeJS.Timeout | null = null;
  private onStateChange: (state: {
    isPlaying: boolean;
    currentIndex: number;
    queue: PlayerAyah[];
  }) => void;
  private onFinish: (() => void) | null = null;

  constructor(onStateChange: (state: {
    isPlaying: boolean;
    currentIndex: number;
    queue: PlayerAyah[];
  }) => void) {
    this.audio = new Audio();
    this.onStateChange = onStateChange;
    this.setupListeners();
  }

  /**
   * Bind event listeners exactly once to the audio element.
   */
  private setupListeners() {
    this.audio.addEventListener("ended", this.handleEnded);
    this.audio.addEventListener("error", this.handleError);
    this.audio.addEventListener("play", this.handlePlay);
    this.audio.addEventListener("pause", this.handlePause);
  }

  /**
   * Remove listeners to prevent memory leaks.
   */
  private cleanupListeners() {
    this.audio.removeEventListener("ended", this.handleEnded);
    this.audio.removeEventListener("error", this.handleError);
    this.audio.removeEventListener("play", this.handlePlay);
    this.audio.removeEventListener("pause", this.handlePause);
  }

  private handleEnded = () => {
    console.info("AudioPlayerCore: Ayah ended, advancing...", { index: this.currentIndex });
    this.next();
  };

  /**
   * Handle playback errors with exponential backoff and skipping logic.
   */
  private handleError = () => {
    const current = this.queue[this.currentIndex];
    if (!current?.audioUrl) return;

    const retries = this.retryCounts[current.audioUrl] || 0;
    if (retries < this.maxRetries) {
      this.retryCounts[current.audioUrl] = retries + 1;
      const delay = Math.pow(2, retries) * 1000; // 1s, 2s retry delay
      console.warn(`AudioPlayerCore: Error at ${current.reference}, retrying in ${delay}ms`, {
        attempt: retries + 1,
      });
      setTimeout(() => {
        if (this.isPlaying) this.playCurrent();
      }, delay);
    } else {
      console.error("AudioPlayerCore: Max retries reached, skipping to next ayah", {
        reference: current.reference,
      });
      this.next();
    }
  };

  private handlePlay = () => {
    this.isPlaying = true;
    this.notify();
  };

  private handlePause = () => {
    // Internal pause handling if needed
  };

  /**
   * Rebuild the queue and start sequential playback from a user gesture.
   */
  public playAll(ayahs: PlayerAyah[], startIndex = 0, onFinish?: () => void) {
    // Check if we're already playing this exact queue and index to avoid redundant restarts
    if (
      this.isPlaying &&
      this.currentIndex === startIndex &&
      this.queue.length === ayahs.length &&
      this.queue[0]?.reference === ayahs[0]?.reference
    ) {
      console.info("AudioPlayerCore: Already playing this queue at this index, ignoring playAll");
      return;
    }

    // Debounce to prevent multiple rapid executions
    if (this.debounceTimeout) return;
    this.debounceTimeout = setTimeout(() => {
      this.debounceTimeout = null;
    }, 150);

    console.info("AudioPlayerCore: Rebuilding queue and starting playback", { 
      count: ayahs.length, 
      startIndex 
    });
    
    this.stop(); // Stop any current playback
    this.queue = [...ayahs];
    this.currentIndex = startIndex;
    this.isPlaying = true;
    this.onFinish = onFinish || null;
    
    this.playCurrent();
  }

  /**
   * Stop playback, clear queue, and reset state.
   */
  public stop() {
    if (!this.audio) return;
    
    // To avoid AbortError, we only pause if we're not already paused
    if (!this.audio.paused) {
      this.audio.pause();
    }
    this.audio.src = "";
    this.isPlaying = false;
    this.queue = [];
    this.currentIndex = 0;
    this.retryCounts = {};
    this.notify();
  }

  public pause() {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
    this.isPlaying = false;
    this.notify();
  }

  public resume() {
    if (this.queue.length > 0 && this.audio) {
      this.audio.play().catch((err) => {
        if (err.name !== "AbortError") console.error("AudioPlayerCore: Resume failed", err);
      });
      this.isPlaying = true;
      this.notify();
    }
  }

  /**
   * Load and play the current ayah in the queue.
   */
  private playCurrent() {
    const current = this.queue[this.currentIndex];
    if (!current) {
      this.finish();
      return;
    }

    if (!current.audioUrl) {
      console.warn("AudioPlayerCore: Skipping ayah with missing audio URL", {
        reference: current.reference,
      });
      this.next();
      return;
    }

    if (!this.audio) return;

    this.audio.src = current.audioUrl;
    this.audio.load();
    
    // Capture the play promise to handle AbortError gracefully
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        if (error.name === "AbortError") {
          // Ignore AbortError as it's usually due to intentional interruption
          console.info("AudioPlayerCore: Playback interrupted (AbortError)");
        } else {
          console.error("AudioPlayerCore: Playback failed", {
            error,
            reference: current.reference,
          });
        }
      });
    }
    this.notify();
  }

  public getCurrentIndex() {
    return this.currentIndex;
  }

  public getQueue() {
    return this.queue;
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  public next() {
    if (this.currentIndex < this.queue.length - 1) {
      this.currentIndex++;
      this.playCurrent();
    } else {
      this.finish();
    }
  }

  public previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.playCurrent();
    }
  }

  private finish() {
    console.info("AudioPlayerCore: Sequential playback completed");
    this.isPlaying = false;
    this.notify();
    if (this.onFinish) this.onFinish();
  }

  private notify() {
    this.onStateChange({
      isPlaying: this.isPlaying,
      currentIndex: this.currentIndex,
      queue: this.queue,
    });
  }

  /**
   * Complete teardown to prevent memory leaks and ghost audio.
   */
  public cleanup() {
    this.stop();
    this.cleanupListeners();
    this.onFinish = null;
    this.onStateChange = () => {};
    // @ts-ignore
    this.audio = null;
  }

  public setVolume(volume: number) {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  public setPlaybackRate(rate: number) {
    this.audio.playbackRate = rate;
  }
}
