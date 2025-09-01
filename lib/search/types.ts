export type SearchProvider = 'serpapi' | 'perplexity' | 'auto' | 'mock';
// Extended providers for Mastra-backed integrations
// - 'mastra-perplexity': Uses Mastra MCP client to call the Perplexity MCP server tools
// - 'mastra-serp': Uses a custom Mastra tool that wraps SerpAPI
export type MastraSearchProvider = 'mastra-perplexity' | 'mastra-serp';
export type AnySearchProvider = SearchProvider | MastraSearchProvider;

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string; // e.g., 'serpapi' | 'perplexity' | 'mock'
  position?: number;
}

export interface SearchResponse {
  provider: AnySearchProvider | string;
  results: SearchResult[];
  tookMs?: number;
  error?: string;
}

export interface SearchAdapter {
  name: Exclude<AnySearchProvider, 'auto'>;
  isConfigured: () => boolean;
  search: (query: string, opts?: { max?: number }) => Promise<SearchResult[]>;
}
