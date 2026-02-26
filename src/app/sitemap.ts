import type { MetadataRoute } from "next";
import { getSurahList } from "@/services/quranApi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  const surahs = await getSurahList({ revalidate: 86400 });
  const staticRoutes = ["", "/surah", "/juz", "/search", "/editions", "/reciters"];
  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));
  surahs.forEach((surah) => {
    entries.push({
      url: `${siteUrl}/surah/${surah.number}`,
      lastModified: new Date(),
    });
  });
  return entries;
}
