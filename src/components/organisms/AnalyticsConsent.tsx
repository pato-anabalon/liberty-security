"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { trackEvent } from "@/lib/analytics";

type Consent = "accepted" | "declined" | null;
const STORAGE_KEY = "liberty-analytics-consent";

export function AnalyticsConsent({ gtmId }: { gtmId?: string }) {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Consent;
    const timer = window.setTimeout(() => {
      setConsent(saved === "accepted" || saved === "declined" ? saved : null);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function update(value: Exclude<Consent, null>) {
    localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
    trackEvent("consent_update", { analytics_consent: value });
  }

  return (
    <>
      {consent === "accepted" && gtmId ? (
        <>
          <Script id="gtm-loader" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}</Script>
          <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" /></noscript>
        </>
      ) : null}
      {ready && consent === null ? (
        <aside className="consent-banner" aria-label="Analytics preferences" data-testid="analytics-consent-banner">
          <p><strong>Your privacy matters.</strong> We use optional analytics to understand how the site is used. No analytics loads until you choose.</p>
          <div>
            <button type="button" onClick={() => update("declined")}>Decline</button>
            <button type="button" onClick={() => update("accepted")}>Allow analytics</button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
