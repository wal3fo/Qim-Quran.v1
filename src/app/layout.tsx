import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AudioPlayer from "@/components/AudioPlayer";
import PwaRegister from "@/components/PwaRegister";
import DailyAyahNotifier from "@/components/DailyAyahNotifier";
import ReadingModeClass from "@/components/ReadingModeClass";
import HighContrastClass from "@/components/HighContrastClass";
import FontScaleClass from "@/components/FontScaleClass";
import { env } from "@/lib/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const arabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Qim Quran",
  description: "A modern Quran web application with translations and recitations.",
  metadataBase: new URL(env.siteUrl),
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Qim Quran",
    description: "A modern Quran web application with translations and recitations.",
    url: "/",
    siteName: "Qim Quran",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${arabic.variable} antialiased`}
      >
        <Providers>
          <SiteHeader />
          {children}
          <SiteFooter />
          <AudioPlayer />
          <PwaRegister />
          <DailyAyahNotifier />
          <ReadingModeClass />
          <HighContrastClass />
          <FontScaleClass />
        </Providers>
      </body>
    </html>
  );
}
