"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Logo } from "@/components/atoms/Logo";

gsap.registerPlugin(useGSAP);

const SESSION_KEY = "liberty-preloader-seen";

export function Preloader() {
  const scope = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);
  const [visible, setVisible] = useState(true);
  const particles = useMemo(() => Array.from({ length: 84 }, (_, index) => ({
    id: index,
    x: ((index * 47) % 100),
    y: ((index * 71) % 100),
    delay: (index % 12) * 0.018,
  })), []);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    try { sessionStorage.setItem(SESSION_KEY, "true"); } catch { /* storage may be disabled */ }
    setVisible(false);
    window.dispatchEvent(new CustomEvent("liberty:preloader-complete"));
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem(SESSION_KEY) === "true"; } catch { /* storage may be disabled */ }
    if (seen || reduced) {
      const timer = window.setTimeout(finish, 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useGSAP(() => {
    if (!visible || !scope.current) return;
    const timeline = gsap.timeline({ onComplete: finish });
    timeline
      .addLabel("particles")
      .fromTo("[data-preloader-particle]", { autoAlpha: 0, scale: 0 }, { autoAlpha: 0.85, scale: 1, duration: 0.45, stagger: 0.008, ease: "power2.out" })
      .to("[data-preloader-particle]", { x: (index) => (index % 2 === 0 ? -1 : 1) * (18 + index % 9), y: (index) => -Math.abs(42 - index), duration: 0.72, ease: "power3.inOut" }, "-=0.15")
      .addLabel("wing-wipe", "-=0.12")
      .fromTo("[data-preloader-wing='left']", { xPercent: -105 }, { xPercent: 0, duration: 0.42, ease: "power4.in" }, "wing-wipe")
      .fromTo("[data-preloader-wing='right']", { xPercent: 105 }, { xPercent: 0, duration: 0.42, ease: "power4.in" }, "<")
      .addLabel("hero-release")
      .to("[data-preloader-wing]", { scaleX: 1.45, autoAlpha: 0, duration: 0.45, ease: "power3.out" })
      .to(scope.current, { autoAlpha: 0, duration: 0.28, ease: "power2.out" }, "-=0.32");

    const hardTimeout = window.setTimeout(finish, 2800);
    return () => window.clearTimeout(hardTimeout);
  }, { scope, dependencies: [visible] });

  if (!visible) return null;
  return (
    <div ref={scope} className="preloader" data-testid="liberty-preloader" role="status" aria-label="Loading Liberty Security">
      <div className="preloader__brand"><Logo /></div>
      <div className="preloader__particles" aria-hidden="true">
        {particles.map((particle) => <i key={particle.id} data-preloader-particle style={{ left: `${particle.x}%`, top: `${particle.y}%`, transitionDelay: `${particle.delay}s` }} />)}
      </div>
      <div className="preloader__wing preloader__wing--left" data-preloader-wing="left" aria-hidden="true" />
      <div className="preloader__wing preloader__wing--right" data-preloader-wing="right" aria-hidden="true" />
      <button type="button" className="preloader__skip" onClick={finish} data-testid="liberty-preloader-skip">Skip intro</button>
    </div>
  );
}
