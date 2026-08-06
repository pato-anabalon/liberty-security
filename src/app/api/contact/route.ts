import { NextRequest } from "next/server";
import { Resend } from "resend";
import { createAttachmentToken, isAllowedPrivateBlobUrl } from "@/lib/attachment";
import { services } from "@/lib/content";
import { checkContactRateLimit } from "@/lib/rateLimit";
import { siteUrl } from "@/lib/seo";
import { contactSchema } from "@/lib/validation";

export const runtime = "nodejs";

function clean(value: string) {
  return value.replace(/[<>]/g, "");
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateLimit = await checkContactRateLimit(ip);
  if (!rateLimit.success) {
    const message = rateLimit.configured ? "Too many enquiries. Please wait and try again." : "The enquiry service is not fully configured.";
    return Response.json({ ok: false, error: message }, { status: rateLimit.configured ? 429 : 503 });
  }

  let input: unknown;
  try { input = await request.json(); } catch { return Response.json({ ok: false, error: "Invalid request." }, { status: 400 }); }
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return Response.json({ ok: false, error: "Please check the highlighted fields.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  if (parsed.data.website) return Response.json({ ok: true });
  if (parsed.data.attachmentUrl && !isAllowedPrivateBlobUrl(parsed.data.attachmentUrl)) {
    return Response.json({ ok: false, error: "The attachment reference is invalid." }, { status: 400 });
  }

  const service = services.find((item) => item.id === parsed.data.service)?.title ?? parsed.data.service;
  const attachmentToken = parsed.data.attachmentUrl ? createAttachmentToken(parsed.data.attachmentUrl, parsed.data.attachmentName || "attachment") : null;
  const attachmentLink = attachmentToken ? new URL(`/api/attachments/${attachmentToken}`, siteUrl).toString() : "No attachment";
  const message = [
    "New Liberty Security website enquiry",
    `Name: ${clean(parsed.data.name)}`,
    `Organisation: ${clean(parsed.data.organisation) || "Not provided"}`,
    `Email: ${clean(parsed.data.email)}`,
    `Phone: ${clean(parsed.data.phone) || "Not provided"}`,
    `Service: ${service}`,
    `Date: ${clean(parsed.data.eventDate) || "Not provided"}`,
    `Location: ${clean(parsed.data.location) || "Not provided"}`,
    `Source: ${clean(parsed.data.sourcePath)}`,
    `Attachment: ${attachmentLink}`,
    "",
    clean(parsed.data.message),
  ].join("\n");

  const configured = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.RESEND_FROM_EMAIL);
  if (!configured) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[Liberty local enquiry simulation]", message);
      return Response.json({ ok: true, simulated: true, message: "Local simulation complete. No email was sent." });
    }
    return Response.json({ ok: false, error: "Enquiries are temporarily unavailable. Please call Liberty Security." }, { status: 503 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.CONTACT_TO_EMAIL!,
      replyTo: parsed.data.email,
      subject: `Liberty enquiry — ${service}`,
      text: message,
    });
    if (result.error) throw new Error(result.error.message);
    return Response.json({ ok: true, simulated: false });
  } catch (error) {
    console.error("Liberty enquiry email failed", error);
    return Response.json({ ok: false, error: "Your enquiry could not be sent. Please try again or call us." }, { status: 502 });
  }
}
