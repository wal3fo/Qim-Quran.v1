import type { MetadataRoute } from "next";
import { getSurahList } from "@/services/quranApi";
import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = env.siteUrl;
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
