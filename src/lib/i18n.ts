export const dictionaries = {
  en: {
    home: "Home",
    surahs: "Surahs",
    juz: "Juz",
    search: "Search",
    editions: "Editions",
    reciters: "Reciters",
  },
  ar: {
    home: "الرئيسية",
    surahs: "السور",
    juz: "الأجزاء",
    search: "بحث",
    editions: "الإصدارات",
    reciters: "القراء",
  },
  fr: {
    home: "Accueil",
    surahs: "Sourates",
    juz: "Juz",
    search: "Recherche",
    editions: "Éditions",
    reciters: "Récitateurs",
  },
  id: {
    home: "Beranda",
    surahs: "Surah",
    juz: "Juz",
    search: "Cari",
    editions: "Edisi",
    reciters: "Qari",
  },
};

export type Locale = keyof typeof dictionaries;
