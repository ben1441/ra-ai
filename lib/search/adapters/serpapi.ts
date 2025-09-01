import type { SearchAdapter, SearchResult } from "@/lib/search/types";

const SERPAPI_BASE = "https://serpapi.com/search.json";

async function fetchSerpApi(query: string, apiKey: string, max = 5): Promise<SearchResult[]> {
  const url = new URL(SERPAPI_BASE);
  url.searchParams.set("engine", "google");
  url.searchParams.set("q", query);
  url.searchParams.set("api_key", apiKey);

  const res = await fetch(url.toString(), { next: { revalidate: 0 } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`SerpAPI HTTP ${res.status}: ${text || res.statusText}`);
  }
  const json: any = await res.json();
  const organic: any[] = json.organic_results || [];
  return organic.slice(0, max).map((r, i): SearchResult => ({
    title: r.title || r.snippet || "Untitled",
    url: r.link || r.url || "",
    snippet: r.snippet || "",
    source: "serpapi",
    position: r.position ?? i + 1,
  }));
}

export const serpApiAdapter: SearchAdapter = {
  name: "serpapi",
  isConfigured: () => typeof process.env.SERPAPI_KEY === "string" && !!process.env.SERPAPI_KEY,
  async search(query, opts) {
    const key = process.env.SERPAPI_KEY as string | undefined;
    if (!key) throw new Error("SERPAPI_KEY is not set");
    return fetchSerpApi(query, key, opts?.max ?? 5);
  },
};
