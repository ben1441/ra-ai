import type { SearchAdapter, SearchResult } from "@/lib/search/types";
import { createTool } from "@mastra/core/tools";
import { RuntimeContext } from "@mastra/core/di";
import { z } from "zod";

const SERPAPI_BASE = "https://serpapi.com/search.json";

const serpSearchTool = createTool({
  id: "serpapi_search",
  description:
    "Search the web using SerpAPI's Google engine. Returns top results with title, url, and snippet.",
  inputSchema: z.object({
    query: z.string().min(1),
    max: z.number().int().min(1).max(10).default(5),
  }),
  outputSchema: z.object({
    results: z
      .array(
        z.object({
          title: z.string().optional(),
          url: z.string().optional(),
          snippet: z.string().optional(),
          position: z.number().optional(),
        })
      )
      .default([]),
  }),
  execute: async ({ context }) => {
    const { query, max } = context;
    const apiKey = process.env.SERPAPI_KEY as string | undefined;
    if (!apiKey) throw new Error("SERPAPI_KEY is not set");

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

    return {
      results: organic.slice(0, max ?? 5).map((r: any, i: number) => ({
        title: r.title || r.snippet || "Untitled",
        url: r.link || r.url || "",
        snippet: r.snippet || "",
        position: r.position ?? i + 1,
      })),
    };
  },
});

export const mastraSerpAdapter: SearchAdapter = {
  name: "mastra-serp",
  isConfigured: () => typeof process.env.SERPAPI_KEY === "string" && !!process.env.SERPAPI_KEY,
  async search(query, opts) {
    const runtimeContext = new RuntimeContext();
    const out = await serpSearchTool.execute({ context: { query, max: opts?.max ?? 5 }, runtimeContext });
    const results: SearchResult[] = (out?.results ?? []).map((r, i): SearchResult => ({
      title: r.title || "Untitled",
      url: r.url || "",
      snippet: r.snippet || "",
      source: "mastra-serp",
      position: r.position ?? i + 1,
    }));
    return results;
  },
};
