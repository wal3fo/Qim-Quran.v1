import Link from "next/link";
import { getAyah, getEditionsByFormat, getEditionsByType, getSurahList } from "@/services/quranApi";
import RecentlyRead from "@/components/RecentlyRead";
import DailyAyahToggle from "@/components/DailyAyahToggle";
import ReadingProgressSummary from "@/components/ReadingProgressSummary";

const getDaySeed = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export default async function Home() {
  const surahs = await getSurahList({ revalidate: 86400 });
  const seed = getDaySeed() % surahs.length;
  const selectedSurah = surahs[seed];
  const randomAyahNumber = (seed % selectedSurah.numberOfAyahs) + 1;
  const ayah = await getAyah(`${selectedSurah.number}:${randomAyahNumber}`, { revalidate: 86400 });
  const audioEditions = await getEditionsByFormat("audio", { revalidate: 86400 });
  const translationEditions = await getEditionsByType("translation", { revalidate: 86400 });

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-4 py-12 sm:px-6">
      <section className="rounded-3xl border border-primary-200/50 bg-primary-50 p-8 dark:border-primary-900/40 dark:bg-primary-900/20">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-300">
              Ayah of the day
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              {selectedSurah.englishName} • {randomAyahNumber}
            </h1>
          </div>
          <p className="arabic-text text-right text-3xl leading-relaxed text-zinc-900 dark:text-zinc-100">
            {ayah.text}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/surah/${selectedSurah.number}`}
              className="rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold text-white"
            >
              Read Surah
            </Link>
            <Link
              href="/search"
              className="rounded-full border border-primary-600 px-4 py-2 text-xs font-semibold text-primary-700 dark:text-primary-200"
            >
              Search Quran
            </Link>
            <DailyAyahToggle />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Quick navigation</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <Link href="/surah" className="text-primary-700 dark:text-primary-300">
              Browse Surahs
            </Link>
            <Link href="/juz" className="text-primary-700 dark:text-primary-300">
              Explore Juz
            </Link>
            <Link href="/editions" className="text-primary-700 dark:text-primary-300">
              Editions & Translations
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Recently read</h2>
          <div className="mt-4">
            <RecentlyRead />
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Featured reciters
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            {audioEditions.slice(0, 4).map((edition) => (
              <li key={edition.identifier}>{edition.englishName}</li>
            ))}
          </ul>
        </div>
      </section>

      <ReadingProgressSummary />

      <section className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Featured translations
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {translationEditions.slice(0, 6).map((edition) => (
            <div
              key={edition.identifier}
              className="rounded-xl border border-zinc-200 p-3 text-sm dark:border-zinc-800"
            >
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {edition.englishName}
              </p>
              <p className="text-xs text-zinc-500">{edition.language.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export const revalidate = 86400;
