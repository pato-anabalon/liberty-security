export type LibertyEventName = "cta_select" | "service_dialog_open" | "form_submit" | "form_success" | "form_error" | "consent_update";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(event: LibertyEventName, payload: Record<string, string | boolean | number>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });
}
