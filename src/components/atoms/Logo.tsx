import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  compact?: boolean;
};

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <span className={cn("liberty-logo", compact && "liberty-logo--compact", className)}>
      <span className="liberty-logo__mark" aria-hidden="true">
        <Image src="/brand/liberty-security-logo.jpeg" alt="" width={1079} height={1142} priority sizes="48px" />
      </span>
      <span className="liberty-logo__wordmark">
        <strong>LIBERTY</strong>
        <small>SECURITY</small>
      </span>
      <span className="sr-only">Liberty Security</span>
    </span>
  );
}
