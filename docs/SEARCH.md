# Search integration

The app exposes a unified search endpoint and a chat command to quickly research topics.

## Providers
- serpapi (Google via SerpAPI)
- perplexity (Perplexity API chat/completions)
- mock (built-in fallback)

Auto selection order: SerpAPI → Perplexity → Mock.

Env vars:
- SERPAPI_KEY
- PERPLEXITY_API_KEY

## API
- GET /api/search?q=<query>&provider=auto|serpapi|perplexity|mock
- POST /api/search { "query": "...", "provider": "auto" }

Response shape:
```json
{
  "provider": "serpapi|perplexity|mock",
  "results": [
    { "title": "...", "url": "...", "snippet": "...", "source": "serpapi", "position": 1 }
  ],
  "tookMs": 123,
  "error": "optional"
}
```

## UI trigger
- In `components/chat/chat-interface.tsx`, typing `/search <query>` sends a request to `/api/search` and renders results as markdown in the chat via `MarkdownRenderer`.
- Non-/search messages continue to use the demo simulated AI response.
