import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "gold" | "dark" | "cream" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
  showArrow?: boolean;
};

export function Button({ variant = "gold", className, children, showArrow = false, ...props }: ButtonProps) {
  return (
    <button className={cn("liberty-button", `liberty-button--${variant}`, className)} {...props}>
      <span>{children}</span>
      {showArrow ? <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.8} /> : null}
    </button>
  );
}
