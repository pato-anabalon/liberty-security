"use client";

export function PrivacyButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("liberty:open-privacy"))}>Privacy notice</button>;
}
