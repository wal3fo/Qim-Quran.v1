"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/60 bg-white/80 backdrop-blur dark:border-zinc-800/60 dark:bg-black/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 sm:h-9 sm:w-9 overflow-hidden rounded-lg">
            <Image
              src="/QimteKw.png"
              alt="QimQuran Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 hidden xs:block">
            QimQuran
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden gap-5 text-sm font-medium lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors duration-200 ${
                pathname === item.href
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <ReadingModeToggle />
            <HighContrastToggle />
            <FontScaleControl />
          </div>
          <ThemeToggle />
          
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 lg:hidden"
            aria-label="Toggle menu"
          >
            <div className="relative h-5 w-5">
              <span
                className={`absolute block h-0.5 w-5 bg-current transition-all duration-300 ${
                  isMenuOpen ? "top-2 rotate-45" : "top-0.5"
                }`}
              />
              <span
                className={`absolute top-2 block h-0.5 w-5 bg-current transition-opacity duration-300 ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute block h-0.5 w-5 bg-current transition-all duration-300 ${
                  isMenuOpen ? "top-2 -rotate-45" : "top-3.5"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 top-[57px] z-50 bg-white dark:bg-black lg:hidden transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 py-8">
          <nav className="flex flex-col gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xl font-semibold transition-colors ${
                  pathname === item.href
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto space-y-8 pb-12">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Language</p>
                <LanguageToggle />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Reading Mode</p>
                <ReadingModeToggle />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Contrast</p>
                <HighContrastToggle />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Font Scale</p>
                <FontScaleControl />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

