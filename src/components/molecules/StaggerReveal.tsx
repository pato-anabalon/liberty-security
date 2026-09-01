"use client";

import { useRef, type ElementType, type HTMLAttributes, type ReactNode, type Ref } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type StaggerRevealProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  stagger?: number;
  y?: number;
  delay?: number;
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className">;

export function StaggerReveal({
  as: Tag = "div",
  className,
  children,
  stagger = 0.08,
  y = 24,
  delay = 0,
  ...rest
}: StaggerRevealProps) {
  const scope = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const container = scope.current;
    if (!container || container.children.length === 0) return;

    gsap.fromTo(Array.from(container.children), { autoAlpha: 0, y }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.75,
      delay,
      ease: "power3.out",
      stagger,
      scrollTrigger: { trigger: container, start: "top 88%", once: true },
      clearProps: "transform,opacity,visibility",
    });
  }, { scope, dependencies: [delay, stagger, y] });

  return (
    <Tag ref={scope as Ref<HTMLElement>} className={className} {...rest}>
      {children}
    </Tag>
  );
}
