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

type RequestOptions = RequestInit & {
  cacheTtl?: number;
  revalidate?: number;
  rateLimitKey?: string;
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
    const finalOptions: RequestInit & { next?: { revalidate?: number } } = {
      ...fetchOptions,
      headers: {
        Accept: "application/json",
        ...fetchOptions.headers,
      },
    };
    if (revalidate !== undefined) {
      finalOptions.next = { revalidate };
    }
    let attempt = 0;
    let lastError: unknown;
    while (attempt < 3) {
      try {
        const response = await fetch(url, finalOptions);
        const json = (await response.json()) as ApiResponse<T>;
        if (!response.ok || json.status !== "OK") {
          throw new Error(
            typeof json === "object" && json && "status" in json
              ? `API error: ${json.status}`
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

export const getSurah = (number: number, options?: RequestOptions) =>
  request<SurahDetail>(`/surah/${number}`, options);

export const getSurahByEdition = (number: number, edition: string, options?: RequestOptions) =>
  request<SurahDetail>(`/surah/${number}/${edition}`, options);

export const getSurahEditions = (number: number, options?: RequestOptions) =>
  request<SurahDetail[]>(`/surah/${number}/editions`, options);

export const getAyah = (reference: string, options?: RequestOptions) =>
  request<AyahReferenceData>(`/ayah/${reference}`, options);

export const getAyahByEdition = (reference: string, edition: string, options?: RequestOptions) =>
  request<AyahReferenceData>(`/ayah/${reference}/${edition}`, options);

export const getAyahEditions = (reference: string, options?: RequestOptions) =>
  request<AyahReferenceData[]>(`/ayah/${reference}/editions`, options);

export const getJuz = (number: number, options?: RequestOptions) =>
  request<JuzData>(`/juz/${number}`, options);

export const getJuzByEdition = (number: number, edition: string, options?: RequestOptions) =>
  request<JuzData>(`/juz/${number}/${edition}`, options);

export const getJuzEditions = (number: number, options?: RequestOptions) =>
  request<JuzData[]>(`/juz/${number}/editions`, options);

export const getEditions = (options?: RequestOptions) =>
  request<Edition[]>("/edition", { cacheTtl: 1000 * 60 * 60 * 6, revalidate: 86400, ...options });

export const getEditionsByType = (type: string, options?: RequestOptions) =>
  request<Edition[]>(`/edition/type/${type}`, options);

export const getEditionsByFormat = (format: string, options?: RequestOptions) =>
  request<Edition[]>(`/edition/format/${format}`, options);

export const getEditionsByLanguage = (language: string, options?: RequestOptions) =>
  request<Edition[]>(`/edition/language/${language}`, options);

export const getAudio = (edition: string, surah: number, options?: RequestOptions) =>
  request<AudioSurah>(`/audio/${edition}/${surah}`, options);

export const getAudioSurah = (edition: string, surah: number, options?: RequestOptions) =>
  request<AudioSurah>(`/audio-surah/${edition}/${surah}`, options);

export const searchQuran = (
  keyword: string,
  surah: string | number,
  edition: string,
  options?: RequestOptions,
) =>
  request<SearchResult>(
    `/search/${encodeURIComponent(keyword)}/${surah}/${encodeURIComponent(edition)}`,
    options,
  );

export const getMeta = (options?: RequestOptions) =>
  request<MetaData>("/meta", { cacheTtl: 1000 * 60 * 60 * 24, revalidate: 86400, ...options });
