"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Menu, Phone, X } from "lucide-react";
import { Container } from "@/components/atoms/Container";
import { TrackedCta } from "@/components/molecules/TrackedCta";
import { contactContent, navigation } from "@/lib/content";
import { afterPreloaderComplete } from "@/lib/motion/preloaderRelease";

gsap.registerPlugin(useGSAP);

export function Header() {
  const scope = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const leftNavigation = navigation.slice(0, 2);
  const rightNavigation = navigation.slice(2);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(scope.current, { autoAlpha: 0, yPercent: -110 });
    const timeline = gsap.timeline({ paused: true });
    timeline
      .addLabel("navbar-intro")
      .to(scope.current, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
      }, "navbar-intro");

    return afterPreloaderComplete(() => timeline.play(0));
  }, { scope });

  return (
    <header ref={scope} className="site-header" data-testid="site-navigation">
      <Container className="site-header__inner">
        <a href="#top" className="site-header__brand" aria-label="Liberty Security home" onClick={() => setOpen(false)}>
          <Image src="/brand/liberty-logo.png" alt="" width={924} height={539} priority sizes="(max-width: 767px) 88px, 104px" />
        </a>
        <button className="site-header__toggle" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen((value) => !value)} data-testid="mobile-navigation-toggle">
          <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav id="primary-navigation" className="site-header__nav" aria-label="Primary navigation" data-open={open}>
          <div className="site-header__links site-header__links--left">
            {leftNavigation.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}
          </div>
          <div className="site-header__right">
            <div className="site-header__links site-header__links--right">
              {rightNavigation.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}
            </div>
            <div className="site-header__actions">
              <a className="site-header__phone" href={contactContent.phoneHref} aria-label={`Call Liberty Security on ${contactContent.phoneDisplay}`} onClick={() => setOpen(false)}><Phone aria-hidden="true" size={16} /> {contactContent.phoneDisplay}</a>
              <TrackedCta className="site-header__cta" href="#contact" variant="gold" eventName="header_contact" data-testid="header-contact-cta" onClick={() => setOpen(false)}>Let’s talk</TrackedCta>
            </div>
          </div>
          <p className="site-header__credit">Built with <span aria-hidden="true">💜</span><span className="sr-only">love</span> by <a href="https://www.nodo.co.nz" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Nodo.co.nz</a></p>
        </nav>
      </Container>
    </header>
  );
}
