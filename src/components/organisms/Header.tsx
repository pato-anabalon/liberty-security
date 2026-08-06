"use client";

import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Container } from "@/components/atoms/Container";
import { Logo } from "@/components/atoms/Logo";
import { TrackedCta } from "@/components/molecules/TrackedCta";
import { contactContent, navigation } from "@/lib/content";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  return (
    <header className="site-header" data-testid="site-navigation">
      <Container className="site-header__inner">
        <a href="#top" className="site-header__logo" aria-label="Liberty Security home" onClick={() => setOpen(false)}><Logo compact /></a>
        <button className="site-header__toggle" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen((value) => !value)} data-testid="mobile-navigation-toggle">
          <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav id="primary-navigation" className="site-header__nav" aria-label="Primary navigation" data-open={open}>
          {navigation.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}
          <a className="site-header__phone" href={contactContent.phoneHref} aria-label={`Call Liberty Security on ${contactContent.phoneDisplay}`}><Phone aria-hidden="true" size={16} /> {contactContent.phoneDisplay}</a>
          <TrackedCta href="#contact" variant="gold" eventName="header_contact" data-testid="header-contact-cta" onClick={() => setOpen(false)}>Let’s talk</TrackedCta>
        </nav>
      </Container>
    </header>
  );
}
