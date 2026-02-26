"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useI18n } from "@/hooks/useI18n";
import { dictionaries } from "@/lib/i18n";
import ReadingModeToggle from "@/components/ReadingModeToggle";
import HighContrastToggle from "@/components/HighContrastToggle";
import FontScaleControl from "@/components/FontScaleControl";

type NavKey = keyof (typeof dictionaries)["en"];

const navItems: { href: string; key: NavKey }[] = [
  { href: "/", key: "home" },
  { href: "/surah", key: "surahs" },
  { href: "/juz", key: "juz" },
  { href: "/search", key: "search" },
  { href: "/editions", key: "editions" },
  { href: "/reciters", key: "reciters" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/60 bg-white/80 backdrop-blur dark:border-zinc-800/60 dark:bg-black/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-emerald-700 dark:text-emerald-300">
          Qim Quran
        </Link>
        <nav className="hidden gap-4 text-sm font-medium sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition ${
                pathname === item.href
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ReadingModeToggle />
          <HighContrastToggle />
          <FontScaleControl />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
