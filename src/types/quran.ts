export type ApiStatus = "OK" | "ERROR";

export interface ApiResponse<T> {
  code: number;
  status: ApiStatus;
  data: T;
}

export type RevelationType = "Meccan" | "Medinan";

export interface SurahSummary {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: RevelationType;
  numberOfAyahs: number;
}

export interface SajdaInfo {
  id: number;
  recommended: boolean;
  obligatory: boolean;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | SajdaInfo;
  audio?: string;
  audioSecondary?: string[];
  surah?: SurahSummary;
}

export interface Edition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: "text" | "audio";
  type: "quran" | "translation" | "tafsir" | "transliteration" | "recitation";
  direction?: "rtl" | "ltr";
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: RevelationType;
  numberOfAyahs: number;
  ayahs: Ayah[];
  edition?: Edition;
}

export interface JuzData {
  number: number;
  ayahs: Ayah[];
  surahs: Record<string, { number: number; name: string; englishName: string }>;
  edition?: Edition;
}

export interface AyahReferenceData {
  number: number;
  text: string;
  edition?: Edition;
  surah: SurahSummary;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | SajdaInfo;
  audio?: string;
  audioSecondary?: string[];
}

export interface AudioSurah {
  identifier: string;
  surah: SurahSummary;
  audio: string;
  edition?: Edition;
}

export interface SearchMatch {
  number: number;
  text: string;
  edition?: Edition;
  surah: SurahSummary;
  numberInSurah: number;
}

export interface SearchResult {
  count: number;
  matches: SearchMatch[];
}

export interface MetaData {
  surahs: {
    count: number;
    references: SurahSummary[];
  };
  sajdas: {
    count: number;
    references: Array<{
      surah: number;
      ayah: number;
      recommended: boolean;
      obligatory: boolean;
    }>;
  };
}
