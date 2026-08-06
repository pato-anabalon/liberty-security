"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function PrivacyDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const open = () => dialogRef.current?.showModal();
    window.addEventListener("liberty:open-privacy", open);
    return () => window.removeEventListener("liberty:open-privacy", open);
  }, []);
  return (
    <dialog ref={dialogRef} className="privacy-dialog" onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }} data-testid="privacy-notice-dialog">
      <div>
        <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close privacy notice"><X aria-hidden="true" /></button>
        <p className="privacy-dialog__eyebrow">Privacy notice</p>
        <h2>How enquiry information is handled</h2>
        <p>Liberty Security uses the details you submit only to assess and respond to your enquiry, and to continue a related business conversation.</p>
        <p>Attachments are intended to be stored privately. Authorised email links expire after seven days, and files are scheduled for deletion after 30 days once production storage is configured.</p>
        <p>Do not include highly sensitive personal information in the form or attachment. Formal company and privacy contact details will be added before launch.</p>
      </div>
    </dialog>
  );
}
