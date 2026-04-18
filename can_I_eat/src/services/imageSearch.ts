/**
 * Fetches a food image URL from free sources (no API key required).
 *
 * Strategy:
 *  1. Open Food Facts  — best for packaged/branded products
 *  2. Wikipedia (EN)   — best for generic dishes & ingredients
 *  3. Wikipedia (native language) — for non-English food names
 *
 * The caller (SearchScreen) will also retry with `result.englishName` if
 * the first pass with the raw query returns null.
 */

function fetchWithTimeout(url: string, ms = 6000): Promise<Response> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    fetch(url, { headers: { Accept: 'application/json' } })
      .then((res) => { clearTimeout(timer); resolve(res); })
      .catch((err) => { clearTimeout(timer); reject(err); });
  });
}

/** Open Food Facts product search — returns the front image URL or null */
async function fetchFromOpenFoodFacts(query: string): Promise<string | null> {
  try {
    const encoded = encodeURIComponent(query.trim());
    const res = await fetchWithTimeout(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encoded}&search_simple=1&action=process&json=1&fields=image_front_url,image_url&page_size=3`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const products: any[] = data?.products ?? [];
    for (const p of products) {
      const url: string | undefined = p.image_front_url || p.image_url;
      if (url && url.startsWith('http')) return url;
    }
    return null;
  } catch {
    return null;
  }
}

/** Wikipedia summary API for a given subdomain (e.g. 'en', 'ko', 'ja') */
async function fetchFromWikipedia(
  query: string,
  lang: string = 'en'
): Promise<string | null> {
  try {
    const encoded = encodeURIComponent(query.trim());
    const res = await fetchWithTimeout(
      `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encoded}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const url: string | undefined =
      data?.thumbnail?.source ?? data?.originalimage?.source;
    return url ?? null;
  } catch {
    return null;
  }
}

/** Detect if string contains Korean (Hangul) characters */
function isKorean(s: string): boolean {
  return /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(s);
}

/** Detect if string contains Japanese (Hiragana/Katakana/Kanji) characters */
function isJapanese(s: string): boolean {
  return /[\u3040-\u30FF\u4E00-\u9FFF]/.test(s);
}

/**
 * Main export — tries multiple sources and returns the first image URL found.
 * Returns null if nothing is found (caller shows a placeholder).
 */
export async function fetchFoodImageUrl(query: string): Promise<string | null> {
  if (!query.trim()) return null;

  // Build list of parallel requests based on the script of the query
  const tasks: Promise<string | null>[] = [
    fetchFromOpenFoodFacts(query),
    fetchFromWikipedia(query, 'en'),
  ];

  if (isKorean(query)) {
    tasks.push(fetchFromWikipedia(query, 'ko'));
  } else if (isJapanese(query)) {
    tasks.push(fetchFromWikipedia(query, 'ja'));
  }

  // Run all in parallel, return the first non-null result
  const results = await Promise.all(tasks);
  return results.find((r) => r !== null) ?? null;
}
