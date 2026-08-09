"use client";

import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { CheckCircle2, FileUp, LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { TextAreaField, TextField } from "@/components/atoms/TextField";
import { contactContent, services, type ServiceId } from "@/lib/content";
import { trackEvent } from "@/lib/analytics";
import { ALLOWED_ATTACHMENT_TYPES, contactSchema, MAX_ATTACHMENT_BYTES } from "@/lib/validation";

type Status = "idle" | "uploading" | "sending" | "success" | "error";
type FieldErrors = Record<string, string | undefined>;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [service, setService] = useState<ServiceId>("event-security");
  const [file, setFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function selectService(event: Event) {
      const selected = (event as CustomEvent<{ service: ServiceId }>).detail.service;
      setService(selected);
      requestAnimationFrame(() => document.querySelector<HTMLElement>("#contact")?.focus({ preventScroll: true }));
    }
    window.addEventListener("liberty:select-service", selectService);
    return () => window.removeEventListener("liberty:select-service", selectService);
  }, []);

  function onFileChange(next: File | null) {
    setFeedback("");
    if (!next) { setFile(null); return; }
    if (!ALLOWED_ATTACHMENT_TYPES.includes(next.type as (typeof ALLOWED_ATTACHMENT_TYPES)[number])) {
      setErrors((current) => ({ ...current, attachment: "Use PDF, DOCX, JPEG, PNG or WebP." }));
      return;
    }
    if (next.size > MAX_ATTACHMENT_BYTES) {
      setErrors((current) => ({ ...current, attachment: "The file must be 10 MB or smaller." }));
      return;
    }
    setErrors((current) => ({ ...current, attachment: undefined }));
    setFile(next);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "uploading" || status === "sending") return;
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      organisation: String(form.get("organisation") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      service,
      eventDate: String(form.get("eventDate") ?? ""),
      location: String(form.get("location") ?? ""),
      message: String(form.get("message") ?? ""),
      privacyConsent: form.get("privacyConsent") === "on",
      attachmentUrl: "",
      attachmentName: file?.name ?? "",
      sourcePath: window.location.pathname,
      website: String(form.get("website") ?? ""),
    };
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0]])));
      setStatus("error");
      setFeedback("Please check the highlighted fields.");
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }

    setErrors({});
    setFeedback("");
    trackEvent("form_submit", { service, source_path: window.location.pathname, has_attachment: Boolean(file) });
    try {
      if (file) {
        setStatus("uploading");
        try {
          const blob = await upload(`liberty-enquiries/${file.name}`, file, {
            access: "private",
            handleUploadUrl: "/api/upload",
            multipart: true,
          });
          payload.attachmentUrl = blob.url;
        } catch (uploadError) {
          if (process.env.NODE_ENV === "production") throw uploadError;
          setFeedback("Local simulation: the attachment name is recorded, but no file was uploaded.");
        }
      }
      setStatus("sending");
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { ok?: boolean; error?: string; message?: string; simulated?: boolean };
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Your enquiry could not be sent.");
      setStatus("success");
      setFeedback(result.simulated ? (result.message ?? "Local simulation complete.") : "Thank you. Your enquiry has been sent to Liberty Security.");
      trackEvent("form_success", { service, source_path: window.location.pathname, simulated: Boolean(result.simulated) });
      formRef.current?.reset();
      setService("event-security");
      setFile(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Your enquiry could not be sent. Please try again.";
      setStatus("error");
      setFeedback(message);
      trackEvent("form_error", { service, source_path: window.location.pathname, reason: message.slice(0, 120) });
    }
  }

  const busy = status === "uploading" || status === "sending";
  return (
    <form ref={formRef} className="contact-form" onSubmit={onSubmit} noValidate data-testid="contact-form">
      <div className="contact-form__grid">
        <TextField id="name" name="name" label="Your name" autoComplete="name" required error={errors.name} />
        <TextField id="organisation" name="organisation" label="Organisation (optional)" autoComplete="organization" error={errors.organisation} />
        <TextField id="email" name="email" type="email" label="Email address" autoComplete="email" required error={errors.email} />
        <TextField id="phone" name="phone" type="tel" label="Phone (optional)" autoComplete="tel" error={errors.phone} />
        <div className="field">
          <label htmlFor="service">Service needed <span aria-hidden="true">*</span></label>
          <select id="service" name="service" value={service} onChange={(event) => setService(event.target.value as ServiceId)} aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? "service-error" : undefined} required>
            {services.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
          {errors.service ? <p className="field__error" id="service-error" role="alert">{errors.service}</p> : null}
        </div>
        <TextField id="eventDate" name="eventDate" type="date" label="Date (optional)" error={errors.eventDate} />
        <TextField id="location" name="location" label="Auckland location (optional)" autoComplete="street-address" error={errors.location} className="contact-form__wide" />
        <TextAreaField id="message" name="message" label="What do you need protected?" rows={5} required hint="Include the setting, approximate people involved and anything that feels important." error={errors.message} className="contact-form__wide" />
      </div>
      <div className="file-field">
        <input ref={fileRef} id="attachment" name="attachment" type="file" accept=".pdf,.docx,.jpg,.jpeg,.png,.webp" onChange={(event) => onFileChange(event.target.files?.[0] ?? null)} />
        <label htmlFor="attachment"><FileUp aria-hidden="true" /><span><strong>{file ? file.name : "Attach a brief or site file"}</strong><small>PDF, DOCX, JPEG, PNG or WebP · up to 10 MB</small></span></label>
        {file ? <button type="button" aria-label={`Remove ${file.name}`} onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ""; }}><X aria-hidden="true" size={17} /></button> : null}
        {errors.attachment ? <p className="field__error" role="alert">{errors.attachment}</p> : null}
      </div>
      <div className="contact-form__honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <label className="consent-field">
        <input type="checkbox" name="privacyConsent" aria-invalid={Boolean(errors.privacyConsent)} aria-describedby={errors.privacyConsent ? "privacyConsent-error" : undefined} />
        <span>I agree that Liberty Security may use these details to respond to my enquiry. <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("liberty:open-privacy"))}>Read privacy notice</button>.</span>
      </label>
      {errors.privacyConsent ? <p className="field__error" id="privacyConsent-error" role="alert">{errors.privacyConsent}</p> : null}
      <div className="contact-form__submit">
        <Button type="submit" variant="gold" showArrow disabled={busy} data-testid="contact-form-submit-button">
          {busy ? <><LoaderCircle className="spin" aria-hidden="true" /> {status === "uploading" ? "Uploading file" : "Sending enquiry"}</> : "Send enquiry"}
        </Button>
        <p>Prefer direct contact? Call <a href={contactContent.phoneHref}>{contactContent.phoneDisplay}</a> or email <a href={contactContent.emailHref}>{contactContent.emailDisplay}</a>.</p>
      </div>
      {feedback ? (
        <div className={`form-status form-status--${status}`} role={status === "error" ? "alert" : "status"} aria-live="polite" data-testid={`contact-form-${status}-state`}>
          {status === "success" ? <CheckCircle2 aria-hidden="true" /> : null}<p>{feedback}</p>
        </div>
      ) : null}
    </form>
  );
}
