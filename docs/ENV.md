# Environment setup

Create a .env.local file in the project root with any real provider keys:

SERPAPI_KEY=your_serpapi_key_here
PERPLEXITY_API_KEY=your_perplexity_key_here

Notes:
- If no keys are set, the app falls back to a mock search adapter.
- The search API will auto-select the first configured provider (SerpAPI, then Perplexity, else mock).
- Do NOT commit real keys. Use .env.local locally and Vercel project env vars in deployment.
