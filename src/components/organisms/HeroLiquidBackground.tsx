"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./HeroLiquidBackground.module.css";

gsap.registerPlugin(useGSAP);

const ribbonMotion = [
  { fromX: -14, toX: 12, fromY: -6, toY: 7, fromRotation: -2.2, toRotation: 2.4, fromScale: 0.96, toScale: 1.05, fromAlpha: 0.72, toAlpha: 1, duration: 11.5, progress: 0.22 },
  { fromX: 12, toX: -13, fromY: 7, toY: -6, fromRotation: 1.8, toRotation: -2.1, fromScale: 1.04, toScale: 0.96, fromAlpha: 0.78, toAlpha: 1, duration: 14, progress: 0.46 },
  { fromX: -11, toX: 14, fromY: 5, toY: -7, fromRotation: -1.5, toRotation: 1.9, fromScale: 0.95, toScale: 1.04, fromAlpha: 0.68, toAlpha: 0.96, duration: 16.5, progress: 0.63 },
  { fromX: 10, toX: -12, fromY: -5, toY: 6, fromRotation: 1.7, toRotation: -1.6, fromScale: 1.04, toScale: 0.97, fromAlpha: 0.64, toAlpha: 0.9, duration: 19, progress: 0.79 },
] as const;

export function HeroLiquidBackground() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add(
      {
        compact: "(max-width: 767px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { compact, reduceMotion } = context.conditions as {
          compact: boolean;
          reduceMotion: boolean;
        };
        const ribbons = gsap.utils.toArray<HTMLElement>("[data-liquid-ribbon]");

        if (reduceMotion) {
          gsap.set(ribbons, { xPercent: 0, yPercent: 0, rotation: 0, scale: 1 });
          return;
        }

        ribbons.forEach((ribbon, index) => {
          const motion = ribbonMotion[index];
          const distance = compact ? 0.68 : 1;
          const tween = gsap.fromTo(
            ribbon,
            {
              xPercent: motion.fromX * distance,
              yPercent: motion.fromY * distance,
              rotation: motion.fromRotation * distance,
              scale: compact ? 1 : motion.fromScale,
              autoAlpha: motion.fromAlpha,
            },
            {
              xPercent: motion.toX * distance,
              yPercent: motion.toY * distance,
              rotation: motion.toRotation * distance,
              scale: compact ? 1.025 : motion.toScale,
              autoAlpha: motion.toAlpha,
              duration: compact ? motion.duration * 1.16 : motion.duration,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            },
          );

          tween.progress(motion.progress);
        });
      },
      scope,
    );

    return () => media.revert();
  }, { scope });

  return (
    <div ref={scope} className={styles.root} data-testid="hero-liquid-background" aria-hidden="true">
      <span className={`${styles.anchor} ${styles.anchorBack}`}><i className={`${styles.ribbon} ${styles.ribbonBack}`} data-liquid-ribbon /></span>
      <span className={`${styles.anchor} ${styles.anchorCentre}`}><i className={`${styles.ribbon} ${styles.ribbonCentre}`} data-liquid-ribbon /></span>
      <span className={`${styles.anchor} ${styles.anchorEdge}`}><i className={`${styles.ribbon} ${styles.ribbonEdge}`} data-liquid-ribbon /></span>
      <span className={`${styles.anchor} ${styles.anchorGold}`}><i className={`${styles.ribbon} ${styles.ribbonGold}`} data-liquid-ribbon /></span>
      <span className={styles.noise} />
      <span className={styles.scrim} />
    </div>
  );
}
