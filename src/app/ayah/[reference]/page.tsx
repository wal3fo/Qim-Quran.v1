import { getAyah } from "@/services/quranApi";

type Params = Promise<{ reference: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { reference } = await params;
  const ayah = await getAyah(reference, { revalidate: 3600 });
  return {
    title: `Ayah ${ayah.surah.number}:${ayah.numberInSurah}`,
    description: ayah.text,
    openGraph: {
      title: `Ayah ${ayah.surah.number}:${ayah.numberInSurah}`,
      description: ayah.text,
    },
  };
}

export default async function AyahPage({ params }: { params: Params }) {
  const { reference } = await params;
  const ayah = await getAyah(reference, { revalidate: 3600 });
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Ayah {ayah.surah.englishName} • {ayah.numberInSurah}
        </h1>
        <p className="text-sm text-zinc-500">
          Surah {ayah.surah.number} • Juz {ayah.juz} • Page {ayah.page}
        </p>
      </header>
      <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
        <p className="arabic-text text-3xl leading-relaxed text-zinc-900 dark:text-zinc-100">
          {ayah.text}
        </p>
      </div>
    </main>
  );
}
