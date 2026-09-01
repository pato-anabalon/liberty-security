import { ArrowUp } from "lucide-react";
import { Container } from "@/components/atoms/Container";
import { Logo } from "@/components/atoms/Logo";
import { PrivacyButton } from "@/components/molecules/PrivacyButton";
import { contactContent, navigation, siteNotice } from "@/lib/content";

export function Footer() {
  return (
    <footer className="site-footer" data-testid="site-footer">
      <Container>
        <div className="site-footer__lead">
          <Logo />
          <p>Genuine commitment to protecting people.</p>
        </div>
        <div className="site-footer__grid">
          <div><span>Navigate</span>{navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</div>
          {/* Social links hidden pre-launch — see docs/TO-DO.md §3.
              {socialLinks.map((item) => item.href ? <a key={item.label} href={item.href}>{item.label}</a> : <span className="site-footer__pending" key={item.label}>{item.label} · pending</span>)}
          */}
          <div><span>Connect</span><a href={contactContent.phoneHref}>{contactContent.phoneDisplay}</a><a href={contactContent.emailHref}>{contactContent.emailDisplay}</a></div>
          <div><span>Coverage</span><p>{siteNotice}</p></div>
        </div>
        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} Liberty Security. NZBN {contactContent.nzbnDisplay}. Security licence details pending approval.</p>
          <PrivacyButton />
          <a href="#top" aria-label="Back to top">Back to top <ArrowUp aria-hidden="true" size={15} /></a>
        </div>
        <p className="site-footer__credit">Built with <span aria-hidden="true">💜</span><span className="sr-only">love</span> by <a href="https://www.nodo.co.nz" target="_blank" rel="noopener noreferrer">Nodo.co.nz</a></p>
      </Container>
    </footer>
  );
}
