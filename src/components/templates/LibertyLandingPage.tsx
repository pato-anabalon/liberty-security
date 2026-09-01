import { ArrowDown, ArrowRight, Mail, Phone, Shield } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/atoms/Container";
import { MetaChip } from "@/components/atoms/MetaChip";
import { HeroContentEntrance } from "@/components/molecules/HeroContentEntrance";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { StaggerReveal } from "@/components/molecules/StaggerReveal";
import { TrackedCta } from "@/components/molecules/TrackedCta";
import { AnalyticsConsent } from "@/components/organisms/AnalyticsConsent";
import { ContactForm } from "@/components/organisms/ContactForm";
import { Footer } from "@/components/organisms/Footer";
import { Header } from "@/components/organisms/Header";
import { HeroEagleFog } from "@/components/organisms/HeroEagleFog";
import { HeroEagleImage } from "@/components/organisms/HeroEagleImage";
import { Preloader } from "@/components/organisms/Preloader";
import { PrivacyDialog } from "@/components/organisms/PrivacyDialog";
import { ServicesExperiment } from "@/components/organisms/ServicesExperiment";
import { contactContent, heroContent, industries, processSteps, valuePillars } from "@/lib/content";

export function LibertyLandingPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Preloader />
      <Header />
      <main id="main-content">
        <section id="top" className="hero-section" data-testid="home-hero-section" aria-labelledby="hero-heading">
          <HeroEagleImage />
          <HeroEagleFog />
          <Container className="hero-section__inner">
            <HeroContentEntrance>
              <MetaChip>{heroContent.eyebrow}</MetaChip>
              <h1 id="hero-heading">People <em>protecting</em> people.</h1>
              <p>{heroContent.lead}</p>
              <div className="hero-section__actions">
                <TrackedCta href="#contact" eventName="hero_contact" data-testid="hero-primary-cta">{heroContent.primaryCta}</TrackedCta>
                <TrackedCta className="hero-section__secondary-cta" href="#services" variant="outline" eventName="hero_services" showArrow={false} data-testid="hero-secondary-cta">{heroContent.secondaryCta}<ArrowDown aria-hidden="true" size={16} /></TrackedCta>
              </div>
            </HeroContentEntrance>
            <p className="hero-section__scroll"><span>Scroll to follow the story</span><i aria-hidden="true" /></p>
          </Container>
        </section>

        <section id="services" className="services-section section-surface section-surface--cream" data-testid="home-services-section" aria-labelledby="services-heading">
          <div className="services-section__pattern" data-testid="home-services-pattern" aria-hidden="true">
            <Image
              src="/services/services-low-poly-background.png"
              alt=""
              fill
              sizes="100vw"
              className="services-section__pattern-image"
            />
          </div>
          <Container className="services-section__inner">
            <ScrollReveal><SectionHeading id="services-heading" eyebrow="What we protect" heading="Security shaped around the situation — not a generic shift." copy="Start with the service closest to your needs. We’ll clarify the details together before proposing the right team and approach." /></ScrollReveal>
            <div data-testid="home-services-card-grid">
              <ServicesExperiment contactHref="#contact" contactEventName="service_detail_contact" />
            </div>
          </Container>
        </section>

        <section id="why-liberty" className="why-section section-surface section-surface--blue" data-testid="home-why-liberty-section" aria-labelledby="why-heading">
          <Container>
            <div className="why-section__intro">
              <ScrollReveal><SectionHeading id="why-heading" eyebrow="Why Liberty" heading="Confidence is built before anyone arrives on site." copy="Liberty was created to raise the standard of service around security personnel — with preparation, direct communication and accountable leadership." tone="light" /></ScrollReveal>
              <blockquote>“Security should create confidence — not uncertainty.”</blockquote>
            </div>
            <div className="values-grid" data-testid="home-values-grid">
              {valuePillars.map((pillar, index) => (
                <ScrollReveal key={pillar.title} className="value-card-reveal" delay={index * 0.04}>
                  <article className="value-card">
                    <span className="value-card__monogram" aria-hidden="true">{pillar.title.charAt(0)}</span>
                    <h3>{pillar.title}</h3>
                    <p>{pillar.copy}</p>
                    <span className="value-card__number">{String(index + 1).padStart(2, "0")}</span>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>

        <section id="process" className="process-section section-surface section-surface--black" data-testid="home-process-section" aria-labelledby="process-heading">
          <Container>
            <ScrollReveal><SectionHeading id="process-heading" eyebrow="The Liberty experience" heading="Straightforward from first conversation to final review." copy="A clear five-step rhythm keeps the right people informed and makes every assignment easier to manage." tone="light" /></ScrollReveal>
            <StaggerReveal as="ol" className="process-list" data-testid="home-process-step-list" stagger={0.09}>
              {processSteps.map((step) => <li key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.copy}</p></div><ArrowRight aria-hidden="true" /></li>)}
            </StaggerReveal>
          </Container>
        </section>

        <section id="clients" className="industries-section section-surface section-surface--cream" data-testid="home-clients-section" aria-labelledby="clients-heading">
          <Container>
            <div className="industries-section__layout">
              <ScrollReveal><SectionHeading id="clients-heading" eyebrow="Environments we understand" heading="Auckland is not one setting. Your security plan should reflect that." copy="We support organisations and individuals across event, hospitality, commercial, construction and private environments in the Auckland Region." /></ScrollReveal>
              <StaggerReveal className="industries-list" data-testid="home-industries-list" stagger={0.05} y={18}>{industries.map((industry, index) => <span key={industry}><i>{String(index + 1).padStart(2, "0")}</i>{industry}</span>)}</StaggerReveal>
            </div>
            {/* Hidden pre-launch — see docs/TO-DO.md §1.
            <div className="evidence-note"><Radio aria-hidden="true" /><div><strong>No borrowed proof.</strong><p>Client logos, reviews and credentials will only appear here after Liberty has approval and evidence to publish them.</p></div></div>
            */}
          </Container>
        </section>

        {/* Hidden pre-launch — see docs/TO-DO.md §2a.
        <section id="about" className="about-section section-surface section-surface--gold" data-testid="home-about-section" aria-labelledby="about-heading">
          <Container>
            <div className="about-section__statement">
              <MetaChip>{aboutContent.eyebrow}</MetaChip>
              <h2 id="about-heading">{aboutContent.heading}</h2>
              <div>{aboutContent.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </div>
            <aside className="about-section__promise">
              <Sparkles aria-hidden="true" />
              <p>Choosing Liberty means choosing a partner — not simply a security provider.</p>
              <span>People protecting people.</span>
            </aside>
            {showDevelopmentTeamMocks ? (
              <div className="team-placeholders" data-testid="about-team-development-placeholders">
                {["Founder profile pending", "Founder profile pending"].map((title, index) => <article key={`${title}-${index}`}><div aria-hidden="true" /><span>Development placeholder</span><h3>{title}</h3><p>{aboutContent.founderNote}</p></article>)}
              </div>
            ) : null}
          </Container>
        </section>
        */}

        <section id="contact" tabIndex={-1} className="contact-section section-surface section-surface--blue" data-testid="home-contact-section" aria-labelledby="contact-heading">
          <Container>
            <div className="contact-section__layout">
              <StaggerReveal className="contact-section__intro" stagger={0.09} y={22}>
                <MetaChip>{contactContent.eyebrow}</MetaChip>
                <h2 id="contact-heading">{contactContent.heading}</h2>
                <p>{contactContent.lead}</p>
                <div className="contact-section__links">
                  <a href={contactContent.phoneHref} className="contact-section__phone"><Phone aria-hidden="true" /><span><small>Call Liberty</small>{contactContent.phoneDisplay}</span></a>
                  <a href={contactContent.emailHref} className="contact-section__email"><Mail aria-hidden="true" /><span><small>Email Liberty</small>{contactContent.emailDisplay}</span></a>
                </div>
                <div className="contact-section__confidence"><Shield aria-hidden="true" /><p>Your information is used to respond to this enquiry. Production integrations fail safely if they are not configured.</p></div>
              </StaggerReveal>
              <ScrollReveal delay={0.15}><ContactForm /></ScrollReveal>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
      <PrivacyDialog />
      <AnalyticsConsent gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
    </>
  );
}
