import { MetaChip } from "@/components/atoms/MetaChip";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  heading: string;
  copy?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  id?: string;
};

export function SectionHeading({ eyebrow, heading, copy, align = "left", tone = "dark", id }: SectionHeadingProps) {
  return (
    <header className={cn("section-heading", `section-heading--${align}`, `section-heading--${tone}`)}>
      <MetaChip>{eyebrow}</MetaChip>
      <h2 id={id}>{heading}</h2>
      {copy ? <p>{copy}</p> : null}
    </header>
  );
}
