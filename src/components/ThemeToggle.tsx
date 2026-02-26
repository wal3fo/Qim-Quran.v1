"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return null;
  }
  const nextTheme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:border-primary-500 hover:text-primary-700 dark:border-zinc-700 dark:text-zinc-200"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
