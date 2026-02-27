import { ImageResponse } from "next/og";
import { getAyah } from "@/services/quranApi";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Params = Promise<{ reference: string }>;

export const dynamic = "force-dynamic";

export default async function OpenGraphImage({ params }: { params: Params }) {
  const { reference } = await params;
  const ayah = await getAyah(reference, { revalidate: 3600 });
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          color: "#f8fafc",
          padding: "64px",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 24 }}>Qim Quran</div>
        <div style={{ fontSize: 32, textAlign: "center" }}>{ayah.text}</div>
        <div style={{ fontSize: 24, marginTop: 32, color: "#34d399" }}>
          {ayah.surah.englishName} • {ayah.numberInSurah}
        </div>
      </div>
    ),
    size,
  );
}
