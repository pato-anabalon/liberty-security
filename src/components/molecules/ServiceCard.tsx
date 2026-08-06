"use client";

import { CalendarCheck, Camera, HardHat, Hotel, KeyRound, ShieldCheck, UserRoundCheck, Wine } from "lucide-react";
import type { Service } from "@/lib/content";

const icons = {
  calendar: CalendarCheck,
  user: UserRoundCheck,
  hotel: Hotel,
  "hard-hat": HardHat,
  wine: Wine,
  key: KeyRound,
  shield: ShieldCheck,
  camera: Camera,
} as const;

export function ServiceCard({ service, onOpen }: { service: Service; onOpen: (service: Service) => void }) {
  const Icon = icons[service.icon];
  return (
    <article className="service-card" data-testid={`services-card-${service.id}`}>
      <div className="service-card__top">
        <span className="service-card__number">{String(service.order).padStart(2, "0")}</span>
        <Icon aria-hidden="true" strokeWidth={1.4} />
      </div>
      <p className="service-card__eyebrow">{service.eyebrow}</p>
      <h3>{service.title}</h3>
      <p>{service.summary}</p>
      <button type="button" onClick={() => onOpen(service)} aria-haspopup="dialog" data-testid={`services-card-${service.id}-details`}>View service <span aria-hidden="true">↗</span></button>
    </article>
  );
}
