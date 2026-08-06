import { del, list } from "@vercel/blob";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  let cursor: string | undefined;
  let removed = 0;
  do {
    const page = await list({ prefix: "liberty-enquiries/", cursor, limit: 1000 });
    const expired = page.blobs.filter((blob) => new Date(blob.uploadedAt).getTime() < cutoff);
    if (expired.length) {
      await del(expired.map((blob) => blob.url));
      removed += expired.length;
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return Response.json({ ok: true, removed });
}
