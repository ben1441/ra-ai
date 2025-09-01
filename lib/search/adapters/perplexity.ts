import type { SearchAdapter, SearchResult } from "@/lib/search/types";

const PPLX_URL = "https://api.perplexity.ai/chat/completions";

async function fetchPerplexity(query: string, apiKey: string, max = 5): Promise<SearchResult[]> {
  const res = await fetch(PPLX_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        {
          role: "system",
          content:
            "You are a web research assistant. Return ONLY valid JSON array named results with objects {title,url,snippet}. No prose. Limit to top items and prefer authoritative sources.",
        },
        { role: "user", content: query },
      ],
      temperature: 0,
    }),
    // prevent Next from caching
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Perplexity HTTP ${res.status}: ${text || res.statusText}`);
  }

  const data: any = await res.json();
  const raw = data?.choices?.[0]?.message?.content ?? "";
  // Strip code fences if present and parse
  const cleaned = String(raw).trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "");
  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    // Try to extract JSON array via regex
    const match = cleaned.match(/\[([\s\S]*)\]/);
    if (match) parsed = JSON.parse(`[${match[1]}]`);
  }

  const arr: any[] = Array.isArray(parsed?.results) ? parsed.results : Array.isArray(parsed) ? parsed : [];
  return arr.slice(0, max).map((r, i): SearchResult => ({
    title: r.title || "Untitled",
    url: r.url || "",
    snippet: r.snippet || "",
    source: "perplexity",
    position: i + 1,
  }));
}

export const perplexityAdapter: SearchAdapter = {
  name: "perplexity",
  isConfigured: () => typeof process.env.PERPLEXITY_API_KEY === "string" && !!process.env.PERPLEXITY_API_KEY,
  async search(query, opts) {
    const key = process.env.PERPLEXITY_API_KEY as string | undefined;
    if (!key) throw new Error("PERPLEXITY_API_KEY is not set");
    return fetchPerplexity(query, key, opts?.max ?? 5);
  },
};
