export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200/60 py-8 text-sm text-zinc-500 dark:border-zinc-800/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row">
        <p>Built with alquran.cloud API for a focused Quran reading experience.</p>
        <a
          href="https://github.com/wal3fo"
          aria-label="Visit the author on GitHub"
          className="group inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600 transition hover:border-primary-500 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-zinc-800 dark:text-zinc-300"
          rel="noreferrer"
          target="_blank"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-current transition group-hover:text-primary-600"
          >
            <path d="M12 2C6.477 2 2 6.484 2 12.02c0 4.425 2.865 8.183 6.839 9.504.5.092.682-.218.682-.484 0-.236-.009-.86-.013-1.686-2.782.605-3.369-1.343-3.369-1.343-.454-1.163-1.11-1.472-1.11-1.472-.907-.62.069-.608.069-.608 1.003.071 1.531 1.034 1.531 1.034.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.254-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.254-.446-1.274.098-2.655 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.338 1.909-1.296 2.748-1.026 2.748-1.026.546 1.381.202 2.401.1 2.655.64.7 1.028 1.594 1.028 2.687 0 3.848-2.338 4.694-4.566 4.943.36.31.68.923.68 1.86 0 1.343-.012 2.425-.012 2.755 0 .268.18.58.688.481A10.02 10.02 0 0 0 22 12.02C22 6.484 17.523 2 12 2Z" />
          </svg>
          <span>GitHub</span>
        </a>
      </div>
    </footer>
  );
}
