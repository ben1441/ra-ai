import type { SearchAdapter, SearchResponse, SearchResult, AnySearchProvider } from "@/lib/search/types";
import { serpApiAdapter } from "@/lib/search/adapters/serpapi";
import { perplexityAdapter } from "@/lib/search/adapters/perplexity";
import { mockAdapter } from "@/lib/search/adapters/mock";
import { mastraPerplexityAdapter } from "@/lib/search/adapters/mastra-perplexity";
import { mastraSerpAdapter } from "@/lib/search/adapters/mastra-serp";

const ADAPTERS: Record<string, SearchAdapter> = {
  serpapi: serpApiAdapter,
  perplexity: perplexityAdapter,
  "mastra-perplexity": mastraPerplexityAdapter,
  "mastra-serp": mastraSerpAdapter,
  mock: mockAdapter,
};

export function pickAutoAdapter(): SearchAdapter {
  // Prefer Perplexity via MCP when explicitly configured
  if (mastraPerplexityAdapter.isConfigured()) return mastraPerplexityAdapter;
  // Next prefer direct SerpAPI (fastest)
  if (serpApiAdapter.isConfigured()) return serpApiAdapter;
  // Then direct Perplexity REST
  if (perplexityAdapter.isConfigured()) return perplexityAdapter;
  // If SerpAPI key exists but we want Mastra tool wrapper explicitly
  if (mastraSerpAdapter.isConfigured()) return mastraSerpAdapter;
  return mockAdapter;
}

export async function runSearch(query: string, provider: AnySearchProvider = "auto", opts?: { max?: number }): Promise<SearchResponse> {
  const t0 = Date.now();
  try {
    let adapter: SearchAdapter;
    if (provider === "auto") adapter = pickAutoAdapter();
    else adapter = ADAPTERS[provider as string] ?? pickAutoAdapter();

    if (!adapter.isConfigured() && adapter.name !== "mock") {
      // failover to mock to ensure demo works
      adapter = mockAdapter;
    }

    const results: SearchResult[] = await adapter.search(query, opts);
    return { provider: adapter.name, results, tookMs: Date.now() - t0 };
  } catch (error: any) {
    return { provider, results: [], tookMs: Date.now() - t0, error: error?.message || String(error) };
  }
}

