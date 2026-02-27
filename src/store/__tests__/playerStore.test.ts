import { beforeEach, describe, expect, it } from "vitest";
import { usePlayerStore } from "@/store/usePlayerStore";

const buildQueue = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    reference: `1:${index + 1}`,
    surahNumber: 1,
    ayahNumber: index + 1,
    text: `Ayah ${index + 1}`,
    audioUrl: `https://audio.example/${index + 1}.mp3`,
  }));

const resetState = () => {
  usePlayerStore.setState({
    queue: [],
    currentIndex: 0,
    isPlaying: false,
    playbackRate: 1,
    volume: 1,
    repeat: "off",
    shuffle: false,
  });
};

const assertPlaybackSequence = (count: number) => {
  const queue = buildQueue(count);
  usePlayerStore.getState().setQueue(queue, 0);
  expect(usePlayerStore.getState().currentIndex).toBe(0);
  expect(usePlayerStore.getState().isPlaying).toBe(true);
  for (let i = 0; i < count - 1; i += 1) {
    usePlayerStore.getState().next();
    expect(usePlayerStore.getState().currentIndex).toBe(i + 1);
    expect(usePlayerStore.getState().isPlaying).toBe(true);
  }
  usePlayerStore.getState().next();
  expect(usePlayerStore.getState().currentIndex).toBe(count - 1);
  expect(usePlayerStore.getState().isPlaying).toBe(false);
};

describe("player store sequencing", () => {
  beforeEach(resetState);

  it("plays through a queue of 1", () => {
    assertPlaybackSequence(1);
  });

  it("plays through a queue of 10", () => {
    assertPlaybackSequence(10);
  });

  it("plays through a queue of 100", () => {
    assertPlaybackSequence(100);
  });
});
