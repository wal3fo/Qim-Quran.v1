import { getSurahList } from "@/services/quranApi";
import SurahListClient from "@/components/SurahListClient";

export const metadata = {
  title: "Surah List",
  description: "Browse all Surahs of the Quran with quick access to details.",
};

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function SurahPage() {
  const surahs = await getSurahList({ revalidate: 86400 });
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Surah List</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Search, filter, and jump straight to recitation.
        </p>
      </div>
      <SurahListClient surahs={surahs} />
    </main>
  );
}
