# Qim Quran

Qim Quran is a production-ready Quran web application built with Next.js App Router and TypeScript. It integrates the full alquran.cloud API to deliver a fast, accessible, and mobile-first reading and listening experience.

## Features

- Full alquran.cloud API coverage (Surahs, Ayahs, Juz, Editions, Audio, Search, Meta)
- Strongly typed API layer with retry logic and caching
- Quran reading with translation toggles and audio playback
- Persistent audio player with repeat and speed controls
- Bookmarks, reading progress, and recent history
- Editions and reciters discovery
- SEO-ready metadata, sitemap, and robots
- PWA manifest and offline cache
- Dark/light theme support and multilingual UI toggle

## Tech Stack

- Next.js App Router (TypeScript strict)
- Tailwind CSS
- Zustand (state)
- TanStack React Query (data fetching)
- React Hook Form (forms)
- Native HTML5 audio
- ESLint + Prettier

## Folder Structure

```
/app
  /surah
  /juz
  /search
  /editions
  /reciters
/components
/services
/store
/hooks
/lib
/types
/utils
/public
```

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the app.

## Environment

Set a public base URL for metadata and sitemap:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add the NEXT_PUBLIC_SITE_URL environment variable.
4. Deploy with the default Next.js build settings.

## Scripts

- npm run dev
- npm run build
- npm run start
- npm run lint

## Accessibility

The UI is keyboard navigable with semantic components and high-contrast friendly colors. Arabic content uses a dedicated font family to improve readability.

## API Usage

All endpoints are centralized in `src/services/quranApi.ts` with typed responses and error handling. The layer supports caching and retry logic for production resilience.
