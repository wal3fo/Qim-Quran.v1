import { notFound } from "next/navigation";
import { getSurah } from "@/services/quranApi";
import SurahDetailClient from "@/components/SurahDetailClient";
import SeoJsonLd from "@/components/SeoJsonLd";

type Props = {
  params: { number: string };
};

export async function generateMetadata({ params }: Props) {
  const number = Number(params.number);
  if (Number.isNaN(number)) {
    return { title: "Surah" };
  }
  const surah = await getSurah(number, { revalidate: 86400 });
  return {
    title: `${surah.englishName} | Surah ${surah.number}`,
    description: surah.englishNameTranslation,
  };
}

export const revalidate = 3600;

export default async function SurahDetailPage({ params }: Props) {
  const number = Number(params.number);
  if (Number.isNaN(number)) {
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
