import { z } from "zod";
import { services } from "@/lib/content";

export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
export const ALLOWED_ATTACHMENT_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const serviceIds = services.map((service) => service.id) as [string, ...string[]];

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  organisation: z.string().trim().max(120).optional().default(""),
  email: z.email("Please enter a valid email address."),
  phone: z.string().trim().max(30).optional().default(""),
  service: z.enum(serviceIds, { error: "Please select a service." }),
  eventDate: z.string().trim().max(40).optional().default(""),
  location: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(20, "Please share a little more detail.").max(4000),
  privacyConsent: z.literal(true, { error: "Please confirm you agree to be contacted." }),
  attachmentUrl: z.url().optional().or(z.literal("")),
  attachmentName: z.string().trim().max(255).optional().default(""),
  sourcePath: z.string().trim().max(200).default("/"),
  website: z.string().max(0).optional().default(""),
});

export type ContactPayload = z.infer<typeof contactSchema>;
