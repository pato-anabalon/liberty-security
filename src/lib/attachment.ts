import { createHmac, timingSafeEqual } from "node:crypto";

type AttachmentTokenPayload = { url: string; name: string; expiresAt: number };

export function isAllowedPrivateBlobUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".blob.vercel-storage.com") && url.pathname.includes("/liberty-enquiries/");
  } catch {
    return false;
  }
}

function secret() {
  return process.env.ATTACHMENT_SIGNING_SECRET ?? "";
}

export function createAttachmentToken(url: string, name: string, lifetimeSeconds = 7 * 24 * 60 * 60) {
  if (!secret()) return null;
  const encoded = Buffer.from(JSON.stringify({ url, name, expiresAt: Date.now() + lifetimeSeconds * 1000 } satisfies AttachmentTokenPayload)).toString("base64url");
  const signature = createHmac("sha256", secret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifyAttachmentToken(token: string): AttachmentTokenPayload | null {
  if (!secret()) return null;
  const [encoded, supplied] = token.split(".");
  if (!encoded || !supplied) return null;
  const expected = createHmac("sha256", secret()).update(encoded).digest("base64url");
  const left = Buffer.from(supplied);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as AttachmentTokenPayload;
    if (!payload.url || !payload.name || payload.expiresAt < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
