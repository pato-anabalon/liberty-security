"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { ButtonVariant } from "@/components/atoms/Button";

type TrackedCtaProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  eventName: string;
  service?: string;
  showArrow?: boolean;
};

export function TrackedCta({ children, variant = "gold", className, eventName, service, showArrow = true, href = "#contact", onClick, ...props }: TrackedCtaProps) {
  return (
    <a
      className={cn("liberty-button", `liberty-button--${variant}`, className)}
      href={href}
      onClick={(event) => {
        trackEvent("cta_select", { cta: eventName, source_path: window.location.pathname, service: service ?? "", destination: href });
        onClick?.(event);
      }}
      {...props}
    >
      <span>{children}</span>
      {showArrow ? <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.8} /> : null}
    </a>
  );
}
