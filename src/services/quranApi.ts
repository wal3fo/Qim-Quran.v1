import type {
  ApiResponse,
  AudioSurah,
  AyahReferenceData,
  Edition,
  JuzData,
  MetaData,
  SearchResult,
  SurahDetail,
  SurahSummary,
} from "@/types/quran";

const API_BASE = "https://api.alquran.cloud/v1";

const VALID_SURAH_MIN = 1;
const VALID_SURAH_MAX = 114;
const VALID_JUZ_MIN = 1;
const VALID_JUZ_MAX = 30;
const VALID_EDITION_TYPES = ["translation", "tafsir", "quran", "transliteration", "recitation"] as const;
const VALID_FORMATS = ["text", "audio"] as const;

const assertSurahNumber = (number: number) => {
  if (!Number.isInteger(number) || number < VALID_SURAH_MIN || number > VALID_SURAH_MAX) {
    throw new Error("Invalid surah number.");
  }
};

const assertJuzNumber = (number: number) => {
  if (!Number.isInteger(number) || number < VALID_JUZ_MIN || number > VALID_JUZ_MAX) {
    throw new Error("Invalid juz number.");
  }
};

const assertEdition = (edition: string) => {
  if (!edition || !edition.trim()) {
    throw new Error("Invalid edition identifier.");
  }
};

const assertAyahReference = (reference: string) => {
  const trimmed = reference.trim();
  if (!trimmed) {
    throw new Error("Invalid ayah reference.");
  }
  const isNumber = /^[0-9]+$/.test(trimmed);
  const isSurahAyah = /^[0-9]+:[0-9]+$/.test(trimmed);
  if (!isNumber && !isSurahAyah) {
    throw new Error("Invalid ayah reference.");
  }
};

const assertEditionType = (type: string) => {
  if (!VALID_EDITION_TYPES.includes(type as (typeof VALID_EDITION_TYPES)[number])) {
    throw new Error("Invalid edition type.");
  }
};

const assertFormat = (format: string) => {
  if (!VALID_FORMATS.includes(format as (typeof VALID_FORMATS)[number])) {
    throw new Error("Invalid edition format.");
  }
};

const assertKeyword = (keyword: string) => {
  if (!keyword.trim()) {
    throw new Error("Invalid search keyword.");
  }
};

type RequestOptions = RequestInit & {
  cacheTtl?: number;
  revalidate?: number;
  rateLimitKey?: string;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const memoryCache = new Map<string, CacheEntry<unknown>>();

const createRateLimiter = (limit: number, intervalMs: number) => {
  const hits = new Map<string, number[]>();
  return (key: string) => {
    const now = Date.now();
    const windowStart = now - intervalMs;
    const existing = hits.get(key) ?? [];
    const filtered = existing.filter((t) => t >= windowStart);
    if (filtered.length >= limit) {
      return false;
    }
    filtered.push(now);
    hits.set(key, filtered);
    return true;
  };
};

const rateLimiter = createRateLimiter(90, 60_000);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const withCache = <T>(key: string, ttl: number | undefined, resolver: () => Promise<T>) => {
  if (!ttl) {
    return resolver();
  }
  const cached = memoryCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return Promise.resolve(cached.value as T);
  }
  return resolver().then((value) => {
    memoryCache.set(key, { value, expiresAt: Date.now() + ttl });
    return value;
  });
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const url = `${API_BASE}${path}`;
  const cacheKey = `${url}:${JSON.stringify(options.body ?? "")}`;
  const rateKey = options.rateLimitKey ?? "alquran-cloud";
  if (typeof window !== "undefined") {
    const allowed = rateLimiter(rateKey);
    if (!allowed) {
      throw new Error("Rate limit exceeded. Please wait and try again.");
    }
  }
  return withCache(cacheKey, options.cacheTtl, async () => {
    const { cacheTtl, revalidate, rateLimitKey, ...fetchOptions } = options;
    const headers = new Headers(fetchOptions.headers);
    headers.set("Accept", "application/json");
    const finalOptions: RequestInit & { next?: NextFetchRequestConfig } = {
      ...fetchOptions,
      headers,
    };
    if (revalidate !== undefined) {
      finalOptions.next = { ...(finalOptions.next ?? {}), revalidate };
    }
    let attempt = 0;
    let lastError: unknown;
    while (attempt < 3) {
      try {
        const response = await fetch(url, finalOptions);
        const json = (await response.json()) as ApiResponse<T>;
        if (!response.ok || json.status !== "OK") {
          if (response.status === 429 || json.code === 429) {
            throw new Error("Rate limit exceeded. Please wait and try again.");
          }
          throw new Error(
            typeof json === "object" && json && "status" in json
              ? `API error: ${json.status} (${json.code})`
              : "API error",
          );
        }
        return json.data;
      } catch (error) {
        lastError = error;
        attempt += 1;
        if (attempt < 3) {
          await sleep(250 * attempt);
        }
      }
    }
    throw lastError ?? new Error("Unexpected API error");
  });
};

export const getSurahList = (options?: RequestOptions) =>
  request<SurahSummary[]>("/surah", { cacheTtl: 1000 * 60 * 60, revalidate: 86400, ...options });

export const getSurah = (number: number, options?: RequestOptions) => {
  assertSurahNumber(number);
  return request<SurahDetail>(`/surah/${number}`, options);
};

export const getSurahByEdition = (number: number, edition: string, options?: RequestOptions) => {
  assertSurahNumber(number);
  assertEdition(edition);
  return request<SurahDetail>(`/surah/${number}/${edition}`, options);
};

export const getSurahEditions = (number: number, options?: RequestOptions) => {
  assertSurahNumber(number);
  return request<SurahDetail[]>(`/surah/${number}/editions`, options);
};

export const getAyah = (reference: string, options?: RequestOptions) => {
  assertAyahReference(reference);
  return request<AyahReferenceData>(`/ayah/${reference}`, options);
};

export const getAyahByEdition = (reference: string, edition: string, options?: RequestOptions) => {
  assertAyahReference(reference);
  assertEdition(edition);
  return request<AyahReferenceData>(`/ayah/${reference}/${edition}`, options);
};

export const getAyahEditions = (reference: string, options?: RequestOptions) => {
  assertAyahReference(reference);
  return request<AyahReferenceData[]>(`/ayah/${reference}/editions`, options);
};

export const getJuz = (number: number, options?: RequestOptions) => {
  assertJuzNumber(number);
  return request<JuzData>(`/juz/${number}`, options);
};

export const getJuzByEdition = (number: number, edition: string, options?: RequestOptions) => {
  assertJuzNumber(number);
  assertEdition(edition);
  return request<JuzData>(`/juz/${number}/${edition}`, options);
};

export const getJuzEditions = (number: number, options?: RequestOptions) => {
  assertJuzNumber(number);
  return request<JuzData[]>(`/juz/${number}/editions`, options);
};

export const getEditions = (options?: RequestOptions) =>
  request<Edition[]>("/edition", { cacheTtl: 1000 * 60 * 60 * 6, revalidate: 86400, ...options });

export const getEditionsByType = (type: string, options?: RequestOptions) => {
  assertEditionType(type);
  return request<Edition[]>(`/edition/type/${type}`, options);
};

export const getEditionsByFormat = (format: string, options?: RequestOptions) => {
  assertFormat(format);
  return request<Edition[]>(`/edition/format/${format}`, options);
};

export const getEditionsByLanguage = (language: string, options?: RequestOptions) => {
  if (!language.trim()) {
    throw new Error("Invalid language code.");
  }
  return request<Edition[]>(`/edition/language/${language}`, options);
};

export const getAudio = (edition: string, reference: string | number, options?: RequestOptions) => {
  assertEdition(edition);
  if (typeof reference === "number") {
    assertSurahNumber(reference);
    return request<AudioSurah>(`/audio/${edition}/${reference}`, options);
  }
  assertAyahReference(reference);
  return request<AudioSurah>(`/audio/${edition}/${reference}`, options);
};

export const searchQuran = (
  keyword: string,
  surah: string | number,
  edition: string,
  options?: RequestOptions,
) =>
  (() => {
    assertKeyword(keyword);
    assertEdition(edition);
    if (surah !== "all") {
      const parsed = Number(surah);
      if (!Number.isInteger(parsed) || parsed < VALID_SURAH_MIN || parsed > VALID_SURAH_MAX) {
        throw new Error("Invalid surah filter.");
      }
    }
    return request<SearchResult>(
      `/search/${encodeURIComponent(keyword)}/${surah}/${encodeURIComponent(edition)}`,
      options,
    );
  })();

export const getMeta = (options?: RequestOptions) =>
  request<MetaData>("/meta", { cacheTtl: 1000 * 60 * 60 * 24, revalidate: 86400, ...options });
