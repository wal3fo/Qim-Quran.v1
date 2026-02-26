import { getEditionsByFormat } from "@/services/quranApi";
import ReciterGrid from "@/components/ReciterGrid";

export const metadata = {
  title: "Reciters",
  description: "Explore Quran reciters and listen to sample recitations.",
};

export default async function RecitersPage() {
  const reciters = await getEditionsByFormat("audio", { revalidate: 86400 });
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Reciters</h1>
        <p className="text-sm text-zinc-500">
          Discover reciters and play a quick sample before diving in.
        </p>
      </header>
      <ReciterGrid reciters={reciters.slice(0, 24)} />
    </main>
  );
}
