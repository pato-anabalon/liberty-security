import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validation";

const valid = {
  name: "Taylor Smith",
  organisation: "Auckland Events",
  email: "taylor@example.co.nz",
  phone: "",
  service: "event-security",
  eventDate: "",
  location: "Auckland",
  message: "We are planning an event and need to discuss security coverage.",
  privacyConsent: true,
  attachmentUrl: "",
  attachmentName: "",
  sourcePath: "/",
  website: "",
};

describe("contactSchema", () => {
  it("accepts a clear enquiry", () => expect(contactSchema.safeParse(valid).success).toBe(true));
  it("rejects missing consent", () => expect(contactSchema.safeParse({ ...valid, privacyConsent: false }).success).toBe(false));
  it("rejects a honeypot value", () => expect(contactSchema.safeParse({ ...valid, website: "spam.example" }).success).toBe(false));
});
