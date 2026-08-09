"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  PRELOADER_SESSION_KEY,
  calculateCoverRadius,
  createCompletionGate,
  shouldBypassPreloader,
  waitForPreloaderAssets,
} from "@/lib/motion/preloader";
import { PRELOADER_COMPLETE_EVENT } from "@/lib/motion/preloaderRelease";

gsap.registerPlugin(useGSAP);

type PreloaderPhase = "checking" | "playing" | "hidden";

const LIBERTY_LETTERS = Array.from("LIBERTY");

function SecurityIndicator({ filled = false }: { filled?: boolean }) {
  return (
    <span className={filled ? "preloader__security-row preloader__security-row--fill" : "preloader__security-row preloader__security-row--outline"}>
      <i />
      <strong>SECURITY</strong>
      <i />
    </span>
  );
}

export function Preloader() {
  const scope = useRef<HTMLDivElement>(null);
  const [completionGate] = useState(createCompletionGate);
  const [phase, setPhase] = useState<PreloaderPhase>("checking");

  const finish = useCallback(() => {
    completionGate.run(() => {
      try { window.sessionStorage.setItem(PRELOADER_SESSION_KEY, "true"); } catch { /* storage may be disabled */ }
      setPhase("hidden");
      window.dispatchEvent(new CustomEvent(PRELOADER_COMPLETE_EVENT));
    });
  }, [completionGate]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let storage: Storage | null = null;
    try { storage = window.sessionStorage; } catch { /* accessing storage may be restricted */ }

    const replaySeenSession = process.env.NODE_ENV === "development";
    const bypass = shouldBypassPreloader(storage, reduced, replaySeenSession);
    const timer = window.setTimeout(() => {
      if (bypass) finish();
      else setPhase("playing");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [finish]);

  useEffect(() => {
    if (phase === "hidden") return;

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousRootOverscroll = root.style.overscrollBehavior;

    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";

    return () => {
      root.style.overflow = previousRootOverflow;
      root.style.overscrollBehavior = previousRootOverscroll;
      body.style.overflow = previousBodyOverflow;
    };
  }, [phase]);

  useGSAP(() => {
    if (phase !== "playing" || !scope.current) return;

    const pointAnchor = scope.current.querySelector<HTMLElement>("[data-preloader-point-anchor]");
    const cover = scope.current.querySelector<HTMLElement>("[data-preloader-cover]");
    const logo = scope.current.querySelector<HTMLImageElement>("[data-preloader-logo]");
    const heroImage = document.querySelector<HTMLImageElement>("[data-eagle-image]");
    if (!pointAnchor || !cover) {
      finish();
      return;
    }

    const abortController = new AbortController();
    const fontsReady = "fonts" in document ? document.fonts.ready : undefined;
    const assetsReady = waitForPreloaderAssets({
      images: [logo, heroImage],
      fontsReady,
      timeoutMs: 2200,
      signal: abortController.signal,
    });

    const getCoverCircle = (radius: number | "cover") => {
      const rect = pointAnchor.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const circleRadius = radius === "cover"
        ? calculateCoverRadius({
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            centerX,
            centerY,
          })
        : radius;

      return `circle(${circleRadius}px at ${centerX}px ${centerY}px)`;
    };

    const timeline = gsap.timeline({ onComplete: finish });
    timeline
      .addLabel("intro")
      .fromTo("[data-preloader-composition]", { y: 10, scale: 0.985 }, { y: 0, scale: 1, duration: 0.28, ease: "power2.out" }, "intro")
      .to("[data-preloader-fill]", { clipPath: "inset(0 8% 0 0)", duration: 1.35, ease: "power1.out" }, "intro+=0.08")
      .addPause("assets-ready", () => {
        void assetsReady.then(() => {
          if (!abortController.signal.aborted) timeline.play();
        });
      })
      .addLabel("complete")
      .to("[data-preloader-fill]", { clipPath: "inset(0 0% 0 0)", duration: 0.25, ease: "power2.inOut" }, "complete")
      .to("[data-preloader-indicator]", { scaleX: 0, autoAlpha: 0, transformOrigin: "50% 50%", duration: 0.42, ease: "power3.inOut" })
      .addLabel("point", "-=0.1")
      .set(cover, { clipPath: () => getCoverCircle(0) }, "point")
      .to(cover, { clipPath: () => getCoverCircle(7), duration: 0.12, ease: "power2.out" }, "point")
      .to(cover, {
        clipPath: () => getCoverCircle("cover"),
        duration: 0.8,
        ease: "power3.inOut",
      });

    return () => abortController.abort();
  }, { scope, dependencies: [phase, finish], revertOnUpdate: true });

  if (phase === "hidden") return null;

  return (
    <div ref={scope} className="preloader" data-testid="liberty-preloader" data-preloader-phase={phase} role="status" aria-label="Loading Liberty Security">
      <div className="preloader__composition" data-preloader-composition aria-hidden="true">
        <Image
          className="preloader__logo"
          src="/brand/liberty-logo.png"
          alt=""
          width={924}
          height={539}
          priority
          sizes="(max-width: 599px) 128px, 152px"
          data-preloader-logo
        />
        <div className="preloader__liberty" aria-hidden="true">
          {LIBERTY_LETTERS.map((letter, index) => <span key={`${letter}-${index}`}>{letter}</span>)}
        </div>
        <div className="preloader__loader">
          <span className="preloader__indicator" data-preloader-indicator>
            <SecurityIndicator />
            <span className="preloader__indicator-fill" data-preloader-fill>
              <SecurityIndicator filled />
            </span>
          </span>
          <span className="preloader__point-anchor" data-preloader-point-anchor />
        </div>
      </div>
      <span className="preloader__cover" data-preloader-cover aria-hidden="true" />
    </div>
  );
}
