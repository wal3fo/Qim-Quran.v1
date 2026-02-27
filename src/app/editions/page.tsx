import { getEditions } from "@/services/quranApi";
import EditionsClient from "@/components/EditionsClient";

export const metadata = {
  title: "Editions",
  description: "Browse Quran editions, translations, and tafsir sources.",
};

export const dynamic = "force-dynamic";

export default async function EditionsPage() {
  const editions = await getEditions({ revalidate: 86400 });
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Editions</h1>
        <p className="text-sm text-zinc-500">
          Filter by language, format, and type. Save your preferred translation.
        </p>
      </header>
      <EditionsClient editions={editions} />
    </main>
  );
}
