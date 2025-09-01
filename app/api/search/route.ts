import { runSearch } from "@/lib/search";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? searchParams.get("query") ?? "";
  const provider = (searchParams.get("provider") ?? "auto") as any;
  if (!q.trim()) {
    return Response.json({ error: "Missing query parameter 'q'" }, { status: 400 });
  }
  const data = await runSearch(q, provider);
  return Response.json(data, { status: data.error ? 502 : 200 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const q = String(body.query ?? body.q ?? "");
    const provider = (body.provider ?? "auto") as any;
    if (!q.trim()) {
      return Response.json({ error: "Missing 'query' in body" }, { status: 400 });
    }
    const data = await runSearch(q, provider);
    return Response.json(data, { status: data.error ? 502 : 200 });
  } catch (e: any) {
    return Response.json({ error: e?.message || String(e) }, { status: 500 });
  }
}
