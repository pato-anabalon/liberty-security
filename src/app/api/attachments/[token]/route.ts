import { get } from "@vercel/blob";
import { verifyAttachmentToken } from "@/lib/attachment";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const payload = verifyAttachmentToken(token);
  if (!payload) return new Response("This attachment link is invalid or has expired.", { status: 403 });
  const result = await get(payload.url, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) return new Response("Attachment not found.", { status: 404 });
  return new Response(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${payload.name.replace(/[\"\r\n]/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
