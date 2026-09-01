import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { ALLOWED_ATTACHMENT_TYPES, MAX_ATTACHMENT_BYTES } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!process.env.BLOB_STORE_ID && !process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ error: "Attachment storage is not configured." }, { status: 503 });
  }
  try {
    const body = await request.json() as HandleUploadBody;
    const response = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("liberty-enquiries/")) throw new Error("Invalid attachment path.");
        return {
          allowedContentTypes: [...ALLOWED_ATTACHMENT_TYPES],
          maximumSizeInBytes: MAX_ATTACHMENT_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ originalPathname: pathname, createdAt: new Date().toISOString() }),
        };
      },
      onUploadCompleted: async () => {},
    });
    return Response.json(response);
  } catch (error) {
    console.error("Liberty attachment upload failed", error);
    return Response.json({ error: "The attachment could not be uploaded." }, { status: 400 });
  }
}
