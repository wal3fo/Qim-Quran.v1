"use client";

type Props = {
  language: string;
  format: string;
  type: string;
  onLanguageChange: (value: string) => void;
  onFormatChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  languages: string[];
};

export default function EditionFilters({
  language,
  format,
  type,
  onLanguageChange,
  onFormatChange,
  onTypeChange,
  languages,
}: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <select
        value={language}
        onChange={(event) => onLanguageChange(event.target.value)}
        className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-zinc-800 dark:bg-black"
      >
        <option value="all">All languages</option>
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang.toUpperCase()}
          </option>
        ))}
      </select>
      <select
        value={format}
        onChange={(event) => onFormatChange(event.target.value)}
        className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-zinc-800 dark:bg-black"
      >
        <option value="all">All formats</option>
        <option value="text">Text</option>
        <option value="audio">Audio</option>
      </select>
      <select
        value={type}
        onChange={(event) => onTypeChange(event.target.value)}
        className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-zinc-800 dark:bg-black"
      >
        <option value="all">All types</option>
        <option value="quran">Quran</option>
        <option value="translation">Translation</option>
        <option value="tafsir">Tafsir</option>
        <option value="transliteration">Transliteration</option>
        <option value="audio">Audio</option>
      </select>
    </div>
  );
}
