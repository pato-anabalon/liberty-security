import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/atoms/Container";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { ServicesExperiment } from "@/components/organisms/ServicesExperiment";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Services concept | Liberty Security",
  description: "A temporary interaction concept for the Liberty Security services section.",
  alternates: { canonical: "/services-experiment" },
  robots: { index: false, follow: false, nocache: true },
};

export default function ServicesExperimentPage() {
  return (
    <main className={styles.page}>
      <section
        id="services"
        className={styles.section}
        data-testid="services-experiment-section"
        aria-labelledby="services-experiment-heading"
      >
        <div className={styles.pattern} data-testid="services-experiment-pattern" aria-hidden="true">
          <Image
            src="/services/services-low-poly-background.png"
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            className={styles.patternImage}
          />
        </div>
        <Container className={styles.inner}>
          <SectionHeading
            id="services-experiment-heading"
            eyebrow="What we protect"
            heading="Security shaped around the situation — not a generic shift."
            copy="Start with the service closest to your needs. We’ll clarify the details together before proposing the right team and approach."
          />
          <ServicesExperiment />
        </Container>
      </section>
    </main>
  );
}
