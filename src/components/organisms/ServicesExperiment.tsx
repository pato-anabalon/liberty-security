"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { TrackedCta } from "@/components/molecules/TrackedCta";
import { trackEvent } from "@/lib/analytics";
import { services, type ServiceId } from "@/lib/content";
import styles from "./ServicesExperiment.module.css";

gsap.registerPlugin(useGSAP, Flip);

const desktopQuery = "(min-width: 1024px)";
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const detailImageMask = "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.14) 14%, rgba(0, 0, 0, 0.72) 31%, #000 47%)";

type ServicesExperimentProps = {
  contactHref?: string;
  contactEventName?: string;
};

export function ServicesExperiment({
  contactHref = "/#contact",
  contactEventName = "services_experiment_contact",
}: ServicesExperimentProps = {}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const openerIdRef = useRef<ServiceId | null>(null);
  const [selectedId, setSelectedId] = useState<ServiceId | null>(null);
  const { contextSafe } = useGSAP({ scope: rootRef });

  const openService = useCallback((serviceId: ServiceId) => {
    contextSafe(() => {
      const root = rootRef.current;
      if (!root || selectedId) return;

      const selectedPanel = root.querySelector<HTMLElement>(`[data-service-id="${serviceId}"]`);
      if (!selectedPanel) return;

      openerIdRef.current = serviceId;
      trackEvent("service_dialog_open", { service: serviceId, source_path: window.location.pathname });
      const reduceMotion = window.matchMedia(reducedMotionQuery).matches;
      const isDesktop = window.matchMedia(desktopQuery).matches;
      const otherPanels = Array.from(root.querySelectorAll<HTMLElement>("[data-service-panel]"))
        .filter((panel) => panel !== selectedPanel);

      if (reduceMotion) {
        flushSync(() => setSelectedId(serviceId));
        const imageFrame = selectedPanel.querySelector<HTMLElement>("[data-service-image-frame]");
        const imageWash = selectedPanel.querySelector<HTMLElement>("[data-service-image-wash]");
        gsap.set(imageFrame, {
          xPercent: isDesktop ? 32 : 12,
          maskImage: detailImageMask,
          webkitMaskImage: detailImageMask,
        });
        gsap.set(imageWash, { autoAlpha: 0 });
        root.querySelector<HTMLButtonElement>("[data-service-close]")?.focus();
        return;
      }

      const expand = () => {
        if (!isDesktop) gsap.set(selectedPanel, { zIndex: 2 });
        const state = Flip.getState(selectedPanel);
        flushSync(() => setSelectedId(serviceId));

        const imageFrame = selectedPanel.querySelector<HTMLElement>("[data-service-image-frame]");
        const imageWash = selectedPanel.querySelector<HTMLElement>("[data-service-image-wash]");
        const detailCopy = selectedPanel.querySelector<HTMLElement>("[data-service-detail-copy]");
        const closeButton = selectedPanel.querySelector<HTMLButtonElement>("[data-service-close]");
        const detailParts = selectedPanel.querySelectorAll<HTMLElement>("[data-service-detail-part]");

        gsap.set([detailCopy, closeButton, ...detailParts], { autoAlpha: 0 });

        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        timeline.add(
          Flip.from(state, {
            absolute: true,
            duration: 0.78,
            ease: "power3.inOut",
            scale: false,
          }),
          0,
        );
        timeline.addLabel("service-layout", ">");
        timeline.set(imageFrame, {
          maskImage: detailImageMask,
          webkitMaskImage: detailImageMask,
        }, "service-layout");
        timeline.fromTo(
          imageFrame,
          { xPercent: 0 },
          { xPercent: isDesktop ? 32 : 12, duration: 0.82, ease: "power3.inOut" },
          "service-layout",
        );
        timeline.to(imageWash, { autoAlpha: 0, duration: 0.36 }, "service-layout");
        timeline.fromTo(
          detailCopy,
          { autoAlpha: 0, x: -88 },
          { autoAlpha: 1, x: 0, duration: 0.62 },
          "service-layout+=0.1",
        );
        timeline.fromTo(
          closeButton,
          { autoAlpha: 0, x: 58, y: 48 },
          { autoAlpha: 1, x: 0, y: 0, duration: 0.52 },
          "service-layout+=0.18",
        );
        timeline.fromTo(
          detailParts,
          { autoAlpha: 0, x: -16 },
          { autoAlpha: 1, x: 0, duration: 0.34, stagger: 0.04 },
          "service-layout+=0.28",
        );
        timeline.call(() => {
          if (!isDesktop) gsap.set(selectedPanel, { clearProps: "zIndex" });
          closeButton?.focus();
        });
      };

      if (isDesktop) {
        gsap.to(otherPanels, {
          autoAlpha: 0,
          y: 14,
          duration: 0.2,
          stagger: 0.018,
          ease: "power2.in",
          onComplete: expand,
        });
      } else {
        expand();
      }
    })();
  }, [contextSafe, selectedId]);

  const closeService = useCallback(() => {
    contextSafe(() => {
      const root = rootRef.current;
      if (!root || !selectedId) return;

      const activePanel = root.querySelector<HTMLElement>(`[data-service-id="${selectedId}"]`);
      if (!activePanel) return;

      const reduceMotion = window.matchMedia(reducedMotionQuery).matches;
      const isDesktop = window.matchMedia(desktopQuery).matches;
      const restoreFocus = () => window.requestAnimationFrame(() => {
        const openerId = openerIdRef.current;
        if (!openerId) return;
        root.querySelector<HTMLElement>(`[data-service-id="${openerId}"]`)
          ?.querySelector<HTMLButtonElement>("button")
          ?.focus();
      });

      if (reduceMotion) {
        gsap.set(activePanel.querySelector<HTMLElement>("[data-service-image-frame]"), {
          clearProps: "transform,maskImage,webkitMaskImage",
        });
        gsap.set(activePanel.querySelector<HTMLElement>("[data-service-image-wash]"), { clearProps: "all" });
        flushSync(() => setSelectedId(null));
        restoreFocus();
        return;
      }

      const imageFrame = activePanel.querySelector<HTMLElement>("[data-service-image-frame]");
      const imageWash = activePanel.querySelector<HTMLElement>("[data-service-image-wash]");
      const detailCopy = activePanel.querySelector<HTMLElement>("[data-service-detail-copy]");
      const closeButton = activePanel.querySelector<HTMLButtonElement>("[data-service-close]");
      const detailParts = root.querySelectorAll<HTMLElement>("[data-service-detail-part]");
      if (!isDesktop) gsap.set(activePanel, { zIndex: 2 });
      const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });
      timeline.to(detailParts, { autoAlpha: 0, x: -14, duration: 0.18, stagger: 0.018 }, 0);
      timeline.to(detailCopy, { autoAlpha: 0, x: -76, duration: 0.38 }, 0.08);
      timeline.to(closeButton, { autoAlpha: 0, x: 52, y: 42, duration: 0.34 }, 0.08);
      timeline.to(imageFrame, { xPercent: 0, duration: 0.68, ease: "power3.inOut" }, 0.18);
      timeline.to(imageWash, { autoAlpha: 1, duration: 0.32 }, 0.24);
      timeline.call(() => {
        gsap.set(imageFrame, { clearProps: "transform,maskImage,webkitMaskImage" });
        gsap.set(imageWash, { clearProps: "all" });
        const state = Flip.getState(activePanel);
        flushSync(() => setSelectedId(null));

        const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-service-panel]"));
        const restoredPanel = root.querySelector<HTMLElement>(`[data-service-id="${selectedId}"]`);
        const otherPanels = panels.filter((panel) => panel !== restoredPanel);

        gsap.set(otherPanels, { autoAlpha: isDesktop ? 0 : 1, y: isDesktop ? 14 : 0 });
        const collapse = Flip.from(state, {
          absolute: true,
          duration: 0.72,
          ease: "power3.inOut",
          scale: false,
        });

        if (isDesktop) {
          gsap.to(otherPanels, {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.025,
            delay: 0.24,
            ease: "power2.out",
          });
        }

        collapse.eventCallback("onComplete", () => {
          if (!isDesktop) gsap.set(activePanel, { clearProps: "zIndex" });
          restoreFocus();
        });
      });
    })();
  }, [contextSafe, selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeService();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeService, selectedId]);

  return (
    <div ref={rootRef} className={styles.experiment}>
      <div
        className={styles.gallery}
        data-expanded={selectedId ? "true" : "false"}
        data-testid="services-experiment-gallery"
      >
        {services.map((service) => {
          const isSelected = selectedId === service.id;
          return (
            <article
              key={service.id}
              className={styles.panel}
              style={{ "--service-column": service.order } as CSSProperties}
              data-active={isSelected ? "true" : "false"}
              data-service-id={service.id}
              data-service-panel
              data-testid={`services-experiment-panel-${service.id}`}
            >
              <div className={styles.imageFrame} data-service-image-frame aria-hidden="true">
                <Image
                  src={service.image.src}
                  alt=""
                  fill
                  sizes={isSelected ? "100vw" : "(max-width: 1023px) calc(100vw - 2rem), 13vw"}
                  loading={service.order === 1 ? "eager" : "lazy"}
                  className={styles.serviceImage}
                  style={{ objectPosition: service.image.position }}
                />
                <span className={styles.imageWash} data-service-image-wash />
              </div>

              {isSelected ? (
                <div
                  id={`services-experiment-detail-${service.id}`}
                  className={styles.detail}
                  data-testid="services-experiment-detail"
                  role="region"
                  aria-labelledby={`services-experiment-title-${service.id}`}
                >
                  <button
                    type="button"
                    className={styles.closeButton}
                    onClick={closeService}
                    data-service-close
                    data-testid="services-experiment-close"
                  >
                    <ArrowLeft aria-hidden="true" size={17} />
                    Back to services
                  </button>
                  <div className={styles.detailCopy} data-service-detail-copy>
                    <span className={styles.number} data-service-detail-part>
                      Service {String(service.order).padStart(2, "0")}
                    </span>
                    <p className={styles.eyebrow} data-service-detail-part>{service.eyebrow}</p>
                    <h2 id={`services-experiment-title-${service.id}`} data-service-detail-part>{service.title}</h2>
                    <p className={styles.summary} data-service-detail-part>{service.summary}</p>
                    <p className={styles.description} data-service-detail-part>{service.detail}</p>
                    <ul data-service-detail-part>
                      {service.outcomes.map((outcome) => (
                        <li key={outcome}><Check aria-hidden="true" size={16} />{outcome}</li>
                      ))}
                    </ul>
                    <div className={styles.detailCta} data-service-detail-part>
                      <TrackedCta
                        href={contactHref}
                        eventName={contactEventName}
                        service={service.id}
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent("liberty:select-service", {
                            detail: { service: service.id },
                          }));
                          closeService();
                        }}
                        data-testid="services-experiment-contact-cta"
                      >
                        Discuss this service
                      </TrackedCta>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.panelButton}
                  onClick={() => openService(service.id)}
                  aria-expanded="false"
                  aria-controls={`services-experiment-detail-${service.id}`}
                >
                  <span className={styles.cardNumber}>{String(service.order).padStart(2, "0")}</span>
                  <span className={styles.cardCopy}>
                    <span>{service.eyebrow}</span>
                    <strong>{service.title}</strong>
                  </span>
                  <ArrowUpRight aria-hidden="true" className={styles.cardArrow} />
                </button>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
