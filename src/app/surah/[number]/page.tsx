import { notFound } from "next/navigation";
import { getSurah, getSurahList } from "@/services/quranApi";
import SurahDetailClient from "@/components/SurahDetailClient";
import SeoJsonLd from "@/components/SeoJsonLd";

type Params = Promise<{ number: string }>;

export async function generateStaticParams() {
  const surahs = await getSurahList({ revalidate: 86400 });
  return surahs.map((surah) => ({ number: String(surah.number) }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { number: numberStr } = await params;
  const number = Number(numberStr);
  if (!Number.isFinite(number)) {
    return { title: "Surah" };
  }
  const surah = await getSurah(number, { revalidate: 86400 });
  return {
    title: `${surah.englishName} | Surah ${surah.number}`,
    description: surah.englishNameTranslation,
  };
}

export const revalidate = 3600;

export default async function SurahDetailPage({ params }: { params: Params }) {
  const { number: numberStr } = await params;
  const number = Number(numberStr);
  if (!Number.isFinite(number)) {
    notFound();
  }
  const surah = await getSurah(number, { revalidate: 3600 });
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6">
      <SeoJsonLd
        json={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: `Surah ${surah.englishName}`,
          description: surah.englishNameTranslation,
        }}
      />
      <header className="space-y-2">
        <p className="text-sm font-semibold text-primary-600 dark:text-primary-300">
          Surah {surah.number}
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
          {surah.englishName}
        </h1>
        <p className="text-sm text-zinc-500">
          {surah.englishNameTranslation} • {surah.revelationType} • {surah.numberOfAyahs} Ayahs
        </p>
      </header>
      <SurahDetailClient surah={surah} />
    </main>
  );
}
