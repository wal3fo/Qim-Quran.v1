# Qim Quran

![Qim Quran Logo](https://raw.githubusercontent.com/wal3fo/Qim-Quran.v1/main/public/icon.svg)

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-UNLICENSED-lightgrey)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen)

Qim Quran is a production-ready Quran web application built with the Next.js App Router and TypeScript. It integrates the full alquran.cloud API to deliver a fast, accessible, and mobile-first reading and listening experience.

## Features

- Full alquran.cloud API coverage (Surahs, Ayahs, Juz, Editions, Audio, Search, Meta)
- Strongly typed API layer with retry logic, caching, and rate limiting
- Quran reading with translation toggles, tafsir, and audio playback
- Persistent audio player with repeat, shuffle, and speed controls
- Bookmarks, reading progress, and recent history
- Editions and reciters discovery
- SEO-ready metadata, sitemap, and robots
- PWA manifest and offline cache
- Dark/light theme support and multilingual UI toggle

## Preview

![Qim Quran Preview](https://raw.githubusercontent.com/wal3fo/Qim-Quran.v1/main/public/QimteKw.png)

## Tech Stack

- Next.js App Router (TypeScript strict)
- Tailwind CSS
- Zustand (state)
- TanStack React Query (data fetching)
- React Hook Form (forms)
- Native HTML5 audio
- ESLint + Prettier

## Installation

### Prerequisites

- Node.js 18+
- npm 10+

### Install

```bash
npm install
```

## Usage

### Development

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

### Build

```bash
npm run build
```

### Start (Production)

```bash
npm run start
```

### Lint

```bash
npm run lint
```

### Tests

```bash
npm run test
```

## Environment Variables

Set a public base URL for metadata and sitemap:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Commands

| Command | Description |
| --- | --- |
| npm run dev | Start the local development server |
| npm run build | Build the production app |
| npm run start | Run the production server locally |
| npm run lint | Run lint checks |
| npm run test | Run unit tests |
| npm run pages:build | Build for Cloudflare Workers (OpenNext) |

## Deployment

### Cloudflare Pages (OpenNext)

1. Connect your repository to Cloudflare Pages.
2. Configure the build settings in the Cloudflare Dashboard:
   - **Build command:** `npm run pages:build`
   - **Build output directory:** `.open-next`
   - **Framework preset:** `None`
3. Cloudflare Pages will automatically build and deploy your project on every push.

No manual `wrangler deploy` or `wrangler pages deploy` is required. Manual deployment commands will fail because this is a Pages project.


### Vercel

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add the NEXT_PUBLIC_SITE_URL environment variable.
4. Deploy with the default Next.js build settings.

## API Reference

All endpoints are centralized in [quranApi.ts](file:///d:/#Github/Qim-Quran.v1/src/services/quranApi.ts) with typed responses and error handling. Core entry points:

- getSurahList
- getSurah
- getSurahByEdition
- getAyah
- getAudio
- searchQuran

## Contributing

We follow the Contributor Covenant. By participating, you are expected to uphold this code of conduct.

### How to Contribute

1. Fork the repo and create your branch: git checkout -b feature/your-feature
2. Commit your changes: git commit -m "feat: add your feature"
3. Push to the branch: git push origin feature/your-feature
4. Open a pull request

Read the Contributor Covenant Code of Conduct:
https://www.contributor-covenant.org/version/2/1/code_of_conduct/

## Changelog

Release notes are published here:
https://github.com/wal3fo/Qim-Quran.v1/releases

## License

This project is currently unlicensed. Contact the author for usage permissions.

## Acknowledgements

- https://alquran.cloud/ for the Quran API
- https://nextjs.org/ for the framework
- https://tailwindcss.com/ for styling

## Author

- GitHub: https://github.com/wal3fo
