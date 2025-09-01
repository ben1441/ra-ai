import { MCPClient } from "@mastra/mcp";

let _client: MCPClient | null = null;

export function getMcpClient(): MCPClient {
  if (_client) return _client;

  const url = process.env.PERPLEXITY_MCP_URL || process.env.MCP_PERPLEXITY_URL;
  const command = process.env.PERPLEXITY_MCP_COMMAND || "npx";
  const args = (process.env.PERPLEXITY_MCP_ARGS && JSON.parse(process.env.PERPLEXITY_MCP_ARGS)) || ["-y", "perplexity-mcp-server"]; // falls back to npx perplexity-mcp-server

  const servers: any = {};
  if (url) {
    try {
      servers.perplexity = { url: new URL(url) };
    } catch {
      // ignore invalid URL, fallback to stdio
    }
  }
  if (!servers.perplexity) {
    servers.perplexity = {
      command,
      args,
      env: {
        PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY ?? "",
      },
    };
  }

  _client = new MCPClient({ servers });
  return _client;
}
