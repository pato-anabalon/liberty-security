import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MetaChip({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("meta-chip", className)}>{children}</span>;
}
