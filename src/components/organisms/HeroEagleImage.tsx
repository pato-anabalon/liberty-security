"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { afterPreloaderComplete } from "@/lib/motion/preloaderRelease";
import styles from "./HeroEagleImage.module.css";

gsap.registerPlugin(useGSAP);

export function HeroEagleImage() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set("[data-eagle-visual]", {
      autoAlpha: 0,
      clipPath: "circle(0% at 58% 33%)",
      scale: 0.985,
      transformOrigin: "58% 33%",
    });
    gsap.set("[data-eagle-image]", { xPercent: 2, scale: 1.06, transformOrigin: "58% 33%" });

    const timeline = gsap.timeline({ paused: true });
    timeline
      .addLabel("eagle-intro")
      .to("[data-eagle-visual]", { autoAlpha: 1, duration: 1.05, ease: "sine.out" }, "eagle-intro")
      .to("[data-eagle-visual]", {
        clipPath: "circle(115% at 58% 33%)",
        scale: 1,
        duration: 1.75,
        ease: "power2.inOut",
        clearProps: "transform,opacity,visibility,clipPath",
      }, "eagle-intro")
      .to("[data-eagle-image]", {
        xPercent: 0,
        scale: 1,
        duration: 1.9,
        ease: "expo.out",
        clearProps: "transform",
      }, "eagle-intro");

    return afterPreloaderComplete(() => timeline.play(0));
  }, { scope });

  return (
    <div ref={scope} className={styles.root} data-testid="hero-eagle-image" aria-hidden="true">
      <div className={styles.visual} data-eagle-visual>
        <Image
          className={styles.image}
          src="/brand/eagle.jpg"
          alt=""
          fill
          sizes="(max-width: 767px) 92vw, (max-width: 1023px) 62vw, 50vw"
          fetchPriority="high"
          data-testid="liberty-motion-static-fallback"
          data-eagle-image
        />
      </div>
    </div>
  );
}
