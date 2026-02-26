import JuzClient from "@/components/JuzClient";

export const metadata = {
  title: "Juz",
  description: "Read Quran by Juz with filters and audio playback.",
};

export default function JuzPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Juz View</h1>
        <p className="text-sm text-zinc-500">
          Navigate by Juz with translation filtering and quick access.
        </p>
      </header>
      <JuzClient />
    </main>
  );
}
