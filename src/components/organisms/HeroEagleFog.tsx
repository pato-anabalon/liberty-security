"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./HeroEagleFog.module.css";

gsap.registerPlugin(useGSAP);

const fogMotion = [
  { fromX: -26, toX: 20, fromY: -7, toY: 8, fromRotation: -2.4, toRotation: 1.8, duration: 8.5, startProgress: 0.24 },
  { fromX: 22, toX: -20, fromY: 9, toY: -7, fromRotation: 2, toRotation: -1.6, duration: 10.5, startProgress: 0.48 },
  { fromX: -18, toX: 26, fromY: 10, toY: -5, fromRotation: -1.4, toRotation: 2.2, duration: 12.5, startProgress: 0.67 },
] as const;

export function HeroEagleFog() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add(
      {
        compact: "(max-width: 767px)",
        desktop: "(min-width: 1024px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { compact, desktop, reduceMotion } = context.conditions as {
          compact: boolean;
          desktop: boolean;
          reduceMotion: boolean;
        };
        const fogLayers = gsap.utils.toArray<HTMLElement>("[data-fog-layer]");

        if (reduceMotion) {
          gsap.set(fogLayers, { autoAlpha: 0 });
          return;
        }

        fogLayers.forEach((layer, index) => {
          const motion = fogMotion[index];
          const distance = desktop ? 1 : compact ? 0.62 : 0.8;
          const tween = gsap.fromTo(
            layer,
            {
              xPercent: motion.fromX * distance,
              yPercent: motion.fromY * distance,
              rotation: motion.fromRotation * distance,
              scale: compact ? 0.94 : 1,
              autoAlpha: 0.34 + index * 0.04,
            },
            {
              xPercent: motion.toX * distance,
              yPercent: motion.toY * distance,
              rotation: motion.toRotation * distance,
              scale: compact ? 1.01 : desktop ? 1.1 : 1.06,
              autoAlpha: 0.56 + index * 0.05,
              duration: compact ? motion.duration * 1.18 : motion.duration,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            },
          );

          tween.progress(motion.startProgress);
        });
      },
      scope,
    );

    return () => media.revert();
  }, { scope });

  return (
    <div ref={scope} className={styles.root} data-testid="hero-eagle-fog" aria-hidden="true">
      <div className={styles.visual}>
        <span className={`${styles.fog} ${styles.fogBack}`} data-fog-layer />
        <span className={`${styles.fog} ${styles.fogMiddle}`} data-fog-layer />
        <span className={`${styles.fog} ${styles.fogFront}`} data-fog-layer />
      </div>
    </div>
  );
}
