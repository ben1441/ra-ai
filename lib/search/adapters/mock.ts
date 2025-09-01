import type { SearchAdapter, SearchResult } from "@/lib/search/types";

const MOCK: SearchResult[] = [
  {
    title: "OpenAI Research Overview",
    url: "https://openai.com/research",
    snippet: "Latest publications, findings, and updates from OpenAI research.",
    source: "mock",
    position: 1,
  },
  {
    title: "Google AI Blog",
    url: "https://ai.googleblog.com/",
    snippet: "Official Google AI research blog with papers and announcements.",
    source: "mock",
    position: 2,
  },
  {
    title: "arXiv: Artificial Intelligence",
    url: "https://arxiv.org/list/cs.AI/recent",
    snippet: "Recent submissions in artificial intelligence on arXiv.",
    source: "mock",
    position: 3,
  },
];

export const mockAdapter: SearchAdapter = {
  name: "mock",
  isConfigured: () => true,
  async search(query, opts) {
    const max = opts?.max ?? 5;
    // Slightly customize snippets with the query for realism
    return MOCK.slice(0, max).map((r) => ({
      ...r,
      snippet: `${r.snippet} (query: ${query})`,
    }));
  },
};
