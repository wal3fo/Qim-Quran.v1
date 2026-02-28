# Qim Quran - Modern Quran Web Application

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Non--Profit-green)](https://github.com/wal3fo/Qim-Quran.v1#license)

Qim Quran is a comprehensive, open-source web application designed for reading, listening, and studying the Holy Quran. Built with modern technologies like Next.js 16 and TypeScript, it offers a fast, accessible, and user-friendly experience across all devices.
=======
# Qim Quran
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-UNLICENSED-lightgrey)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen)
>>>>>>> 41ae8b4b0a44743a6121dbb0b544da0f331e60fa

---

## 📖 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

- **Full Quran Access**: Browse the entire Quran by Surah, Juz, or specific Ayah.
- **Audio Recitations**: High-quality audio from a wide range of world-renowned reciters with persistent playback.
- **Translations & Tafsir**: Multiple language editions and scholarly commentaries (Tafsir) available for study.
- **Advanced Search**: Quickly find ayahs and surahs using keyword search.
- **Personalized Experience**:
  - **Font Scaling**: Adjust text size for comfortable reading.
  - **High Contrast Mode**: Enhanced visibility for accessibility.
  - **Reading Modes**: Toggle between different reading layouts.
  - **Theme Support**: Seamless switching between Dark and Light modes.
- **PWA Support**: Fully installable as a Progressive Web App for offline-ready mobile and desktop experiences.
- **Reading Progress**: Automatically tracks and bookmarks your last read position.
- **Daily Ayah**: Browser notifications providing daily inspiration from the Quran.

---

## 🏗 Architecture

The project follows a modern **Modular Monolith** approach within a Next.js framework:

- **Frontend**: Utilizes Next.js App Router for server-side rendering (SSR) and static site generation (SSG) where optimal.
- **State Management**: 
  - **Zustand**: Handles global UI states like user preferences, bookmarks, and the audio player state.
  - **TanStack Query**: Manages server state, caching, and synchronization with the Al-Quran Cloud API.
- **Service Layer**: A dedicated API service layer (`src/services/quranApi.ts`) handles all external data requests with built-in:
  - **Rate Limiting**: Ensures compliance with API provider limits.
  - **Caching Strategy**: Memory-based caching for faster repeated data access.
  - **Error Handling**: Robust retry logic for network resilience.
- **PWA Integration**: Service workers handle background notifications and asset caching for an app-like feel.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **State**: [Zustand](https://zustand-demo.pmnd.rs/) & [TanStack React Query](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: Custom SVG & Headless UI components
- **Testing**: [Vitest](https://vitest.dev/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) via [OpenNext](https://open-next.js.org/)

---

## 🚀 Installation

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v10.0.0 or higher (or equivalent package manager like pnpm/yarn)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/wal3fo/Qim-Quran.v1.git
   cd Qim-Quran.v1
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

---

## 💡 Usage

### Development Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Runs the app in development mode |
| `npm run build` | Builds the production-ready application |
| `npm run test` | Executes the test suite using Vitest |
| `npm run lint` | Runs ESLint to check for code quality issues |

### Deployment

This project is configured for deployment on **Cloudflare Pages**. You can build the worker using:
```bash
npm run worker:build
```

---

## 🤝 Contributing

We welcome contributions to Qim Quran! To contribute:

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

Please ensure your code follows the existing style and passes all tests.

---

## 📜 License

### Non-Profit & Non-Commercial License

This project is licensed for **Non-Profit and Non-Commercial Use Only**. 

**Permitted Use Cases:**
- Personal study and religious education.
- Use in non-profit educational institutions and community centers.
- Open-source contributions and forks for non-commercial purposes.

**Prohibited Use Cases:**
- Selling the software or any derivative works.
- Using the software in revenue-generating applications or websites.
- Redistribution of the code for commercial gain.

**Disclaimer:**
The software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and non-infringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.

---

## 📧 Contact

**Project Lead**: [Wal3fo](https://github.com/wal3fo)

For any inquiries, bug reports, or feature requests, please open an [issue](https://github.com/wal3fo/Qim-Quran.v1/issues) on GitHub.

---

*Made with ❤️ for the Ummah.*
