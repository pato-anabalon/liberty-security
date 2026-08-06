import { afterEach, describe, expect, it } from "vitest";
import { createAttachmentToken, isAllowedPrivateBlobUrl, verifyAttachmentToken } from "@/lib/attachment";

const previous = process.env.ATTACHMENT_SIGNING_SECRET;
afterEach(() => { process.env.ATTACHMENT_SIGNING_SECRET = previous; });

describe("attachment tokens", () => {
  it("round trips signed private attachment details", () => {
    process.env.ATTACHMENT_SIGNING_SECRET = "test-only-secret";
    const token = createAttachmentToken("https://blob.example/private.pdf", "brief.pdf", 60);
    expect(token).toBeTruthy();
    expect(verifyAttachmentToken(token!)).toMatchObject({ name: "brief.pdf" });
  });

  it("rejects tampering", () => {
    process.env.ATTACHMENT_SIGNING_SECRET = "test-only-secret";
    const token = createAttachmentToken("https://blob.example/private.pdf", "brief.pdf", 60)!;
    expect(verifyAttachmentToken(`${token}x`)).toBeNull();
  });

  it("accepts only Liberty enquiry URLs from Vercel Blob", () => {
    expect(isAllowedPrivateBlobUrl("https://store.private.blob.vercel-storage.com/liberty-enquiries/brief.pdf")).toBe(true);
    expect(isAllowedPrivateBlobUrl("https://example.com/liberty-enquiries/brief.pdf")).toBe(false);
    expect(isAllowedPrivateBlobUrl("https://store.private.blob.vercel-storage.com/another-folder/brief.pdf")).toBe(false);
  });
});
