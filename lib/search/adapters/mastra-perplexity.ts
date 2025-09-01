import type { SearchAdapter, SearchResult } from "@/lib/search/types";
import { getMcpClient } from "@/lib/mastra/mcp";
import { RuntimeContext } from "@mastra/core/di";

async function callPerplexityMcp(query: string): Promise<any> {
  const client = getMcpClient();
  const toolsets: Record<string, any> = await (client as any).getToolsets();

  const keys = Object.keys(toolsets);
  const candidates = [
    // common namespaced keys
    ...keys.filter((k) => k.toLowerCase() === "perplexity.search"),
    ...keys.filter((k) => k.toLowerCase() === "perplexity.perplexity_search"),
    // generic: same server, includes search
    ...keys.filter((k) => k.toLowerCase().startsWith("perplexity.") && k.toLowerCase().includes("search")),
    // fallback: any tool mentioning perplexity + search
    ...keys.filter((k) => k.toLowerCase().includes("perplexity") && k.toLowerCase().includes("search")),
    // last resort: any search tool
    ...keys.filter((k) => k.toLowerCase().endsWith(".search") || k.toLowerCase().includes("search")),
  ];
  const selectedKey = candidates.find(Boolean);
  const tool = selectedKey ? toolsets[selectedKey] : undefined;
  if (!tool || typeof tool.execute !== "function") {
    throw new Error("Perplexity MCP search tool not available (no matching tool found)");
  }

  const runtimeContext = new RuntimeContext();
  try {
    // Most servers expect `query`
    return await tool.execute({ context: { query }, runtimeContext });
  } catch (e1) {
    try {
      // Some expect `q`
      return await tool.execute({ context: { q: query }, runtimeContext });
    } catch (e2) {
      // Give a concise error with tool name to help debugging
      const name = selectedKey || "unknown";
      throw new Error(`Perplexity MCP tool execution failed for ${name}: ${e2 instanceof Error ? e2.message : String(e2)}`);
    }
  }
}

function coerceToResults(raw: any, max = 5): SearchResult[] {
  // Try common containers
  const containers = [raw, raw?.results, raw?.data, raw?.items, raw?.sources, raw?.links];
  let list: any[] | null = null;
  for (const c of containers) {
    if (Array.isArray(c) && c.length) {
      list = c;
      break;
    }
  }
  if (!list) {
    // Sometimes the payload is wrapped or in string JSON
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        return coerceToResults(parsed, max);
      } catch {
        return [];
      }
    }
    // Try nested common field
    for (const key of ["results", "data", "items", "sources", "links"]) {
      if (Array.isArray(raw?.[key])) {
        list = raw[key];
        break;
      }
    }
  }
  if (!list) return [];

  return list.slice(0, max).map((r, i): SearchResult => {
    const title = r?.title || r?.name || r?.headline || r?.text?.slice?.(0, 120) || "Untitled";
    const url = r?.url || r?.link || r?.source || r?.href || "";
    const snippet = r?.snippet || r?.description || r?.summary || r?.text || "";
    return { title, url, snippet, source: "mastra-perplexity", position: i + 1 };
  });
}

export const mastraPerplexityAdapter: SearchAdapter = {
  name: "mastra-perplexity",
  isConfigured: () => !!process.env.PERPLEXITY_API_KEY,
  async search(query, opts) {
    const raw = await callPerplexityMcp(query);
    return coerceToResults(raw, opts?.max ?? 5);
  },
};
