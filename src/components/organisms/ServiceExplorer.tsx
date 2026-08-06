"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { ServiceCard } from "@/components/molecules/ServiceCard";
import { TrackedCta } from "@/components/molecules/TrackedCta";
import { services, type Service } from "@/lib/content";
import { trackEvent } from "@/lib/analytics";

export function ServiceExplorer() {
  const [selected, setSelected] = useState<Service | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) dialog.showModal();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  function openService(service: Service) {
    setSelected(service);
    trackEvent("service_dialog_open", { service: service.id, source_path: window.location.pathname });
  }

  function chooseService(service: Service) {
    window.dispatchEvent(new CustomEvent("liberty:select-service", { detail: { service: service.id } }));
    setSelected(null);
  }

  return (
    <>
      <div className="services-grid" data-testid="home-services-card-grid">
        {services.map((service) => <ServiceCard key={service.id} service={service} onOpen={openService} />)}
      </div>
      <dialog ref={dialogRef} className="service-dialog" onClose={() => setSelected(null)} onClick={(event) => { if (event.target === dialogRef.current) setSelected(null); }} data-testid="service-details-dialog">
        {selected ? (
          <div className="service-dialog__panel">
            <button className="service-dialog__close" type="button" onClick={() => setSelected(null)} aria-label="Close service details"><X aria-hidden="true" /></button>
            <span className="service-dialog__number">Service {String(selected.order).padStart(2, "0")}</span>
            <p className="service-dialog__eyebrow">{selected.eyebrow}</p>
            <h2>{selected.title}</h2>
            <p className="service-dialog__detail">{selected.detail}</p>
            <ul>{selected.outcomes.map((outcome) => <li key={outcome}><Check aria-hidden="true" size={17} />{outcome}</li>)}</ul>
            <TrackedCta href="#contact" eventName="service_dialog_contact" service={selected.id} onClick={() => chooseService(selected)} data-testid="service-dialog-contact-cta">Discuss this service</TrackedCta>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
