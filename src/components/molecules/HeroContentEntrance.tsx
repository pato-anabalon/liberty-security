"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { afterPreloaderComplete } from "@/lib/motion/preloaderRelease";

gsap.registerPlugin(useGSAP, SplitText);

export function HeroContentEntrance({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const heading = scope.current?.querySelector("h1");
    const lead = scope.current?.querySelector(":scope > p");
    if (!heading || !lead) return;

    const headingSplit = SplitText.create(heading, {
      type: "words",
      wordsClass: "hero-heading-word",
      mask: "words",
      tag: "span",
      aria: "auto",
    });
    const leadSplit = SplitText.create(lead, {
      type: "words",
      wordsClass: "hero-lead-word",
      tag: "span",
      aria: "auto",
    });

    gsap.set(".meta-chip", { autoAlpha: 0, y: 14 });
    gsap.set(headingSplit.words, { autoAlpha: 0, yPercent: 115, rotationX: -65, transformPerspective: 900, transformOrigin: "50% 100%" });
    gsap.set(leadSplit.words, { autoAlpha: 0, x: -10, y: 8 });
    gsap.set(".hero-section__actions .liberty-button", { autoAlpha: 0, y: 18 });

    const timeline = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.out" },
    });

    timeline
      .addLabel("hero-intro")
      .to(".meta-chip", { autoAlpha: 1, y: 0, duration: 0.55, clearProps: "transform,opacity,visibility" }, "hero-intro")
      .to(headingSplit.words, {
        autoAlpha: 1,
        yPercent: 0,
        rotationX: 0,
        duration: 0.88,
        stagger: 0.11,
        clearProps: "transform,opacity,visibility",
      }, "hero-intro+=0.06")
      .to(leadSplit.words, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        duration: 0.58,
        stagger: 0.028,
        clearProps: "transform,opacity,visibility",
      }, "hero-intro+=0.34")
      .to(".hero-section__actions .liberty-button", {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.09,
        clearProps: "transform,opacity,visibility",
      }, "hero-intro+=0.72");

    const stopWaiting = afterPreloaderComplete(() => timeline.play(0));

    return () => {
      stopWaiting();
      headingSplit.revert();
      leadSplit.revert();
    };
  }, { scope });

  return <div ref={scope} className="hero-section__copy">{children}</div>;
}
