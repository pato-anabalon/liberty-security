"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { LibertyShapeName } from "@/lib/motion/libertyShapes";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const sceneOrder: LibertyShapeName[] = ["eagle", "services", "shield", "path", "auckland", "wings", "promise"];

export function MotionDirector() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const sections = gsap.utils.toArray<HTMLElement>("[data-motion-scene]");
    sections.forEach((section, index) => {
      const to = (section.dataset.motionScene ?? sceneOrder[index] ?? "eagle") as LibertyShapeName;
      const from = sceneOrder[Math.max(0, sceneOrder.indexOf(to) - 1)] ?? "eagle";
      ScrollTrigger.create({
        trigger: section,
        start: index === 0 ? "top top" : "top 78%",
        end: index === 0 ? "bottom top" : "top 24%",
        scrub: true,
        onUpdate: ({ progress }) => {
          window.dispatchEvent(new CustomEvent("liberty:motion-scene", { detail: { from, to, progress } }));
        },
      });
    });
  }, { scope });

  return <div ref={scope} className="motion-director" aria-hidden="true" />;
}
