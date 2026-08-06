# Liberty Security — Project Context

## Business objective

Help organisations and individuals in the Auckland Region understand Liberty quickly, choose a relevant security service, feel less uncertainty and start a commercial conversation. The site sells confidence, communication and partnership—not technical complexity.

Approved positioning: premium, modern, clear, agile and people-first. Primary line: **People protecting people.** Supporting promise: **Genuine commitment to protecting people.** Event Security leads. Liberty has two founders with more than fifteen years of combined industry experience; no other proof claim is approved.

## Information architecture

One indexable route, `/`, with anchors:

1. Hero — immediate proposition and enquiry CTA.
2. Services — eight ordered cards; detailed copy in an accessible dialog.
3. Why Liberty — values and differentiation.
4. Process — five-step working relationship.
5. Clients/industries — environments served, without client logos.
6. About — approved founding story; founder details withheld in production.
7. Contact — contextual enquiry form and mock phone.
8. Footer — coverage, pending social channels and privacy notice.

FAQ, testimonials, credentials, case studies and team profiles stay hidden until real material exists. There are no plans, prices or individual service pages.

## Content model

`src/lib/content.ts` is the source for navigation, hero, services, values, process, industries, about, contact and pending social data. Each service includes `id`, `order`, title, eyebrow, summary, detail, outcomes and icon. Reorder services only by changing `order`. Never bury commercial copy across visual components when it belongs in this model.

## Component architecture

- `atoms`: Button, Container, Logo, MetaChip, TextField.
- `molecules`: SectionHeading, ScrollReveal, ServiceCard, TrackedCta, PrivacyButton.
- `organisms`: Header, Footer, ServiceExplorer, Preloader, LibertyMotionCanvas, MotionDirector, ContactForm, PrivacyDialog, AnalyticsConsent.
- `templates`: LibertyLandingPage.

Pages and metadata stay server-rendered. State, browser APIs, dialogs, analytics, forms and motion are narrow Client Component islands.

## Visual system

Tokens: Black `#2B2B2B`, Cream `#F2EFE8`, Liberty Gold `#C8A45D`, Liberty Blue `#1E2A38`, Secondary Cream `#F3E9D8`, Secondary Blue `#3C507D`. Sora is the display face; Manrope is the body face. Surfaces alternate cream, blue, black and gold. Buttons, text links, chips and informational labels remain visually distinct.

The source JPEG is preserved in `docs/logo.jpeg` and copied to `public/brand/liberty-security-logo.jpeg`. The header uses a compact crop plus a text wordmark because a transparent production logo is still pending.

## Responsive decisions

- Mobile: stacked hero actions, overlay navigation, one-column cards, 1,600 particles, DPR capped at 1 and approximately 30 fps.
- Tablet: two-column services, two-column forms, revised process layout.
- Tablet motion: 3,800 particles with an intermediate eagle scale and composition.
- Desktop: four-column services, full navigation, 6,200 particles, DPR capped at 1.5 and local pointer interaction.
- Large desktop: wider controlled container and more section rhythm.

No heavy video is rendered. Layout uses `overflow-x: clip`; visual QA must still test 375, 768, 1024 and 1440 widths.

## Motion architecture

Motion types remain separated:

- Preloader: once per session, own labelled GSAP timeline, skip control and 2.8-second hard timeout. Two wing-shaped wipes release the hero particle formation event.
- Scroll story: top-level ScrollTriggers in `MotionDirector` emit section-local scene progress.
- WebGL: `LibertyMotionCanvas` uses a custom round-particle shader and morphs a persistent point field through eagle, eight service clusters, shield, five-step path, Auckland-inspired field, wings and final shield. The hero eagle reserves 50% of particles for its contour, 34% for internal mass and 16% for a blue/gold depth field. Cursor input creates bounded local repulsion and a maximum subtle 3D tilt; it never translates the complete cloud.
- Once reveals: `ScrollReveal` uses one-shot viewport entrance timelines.
- Hover: CSS-owned and not overwritten by scroll timelines.

Reduced motion removes the preloader, WebGL canvas and reveal transforms while retaining every message and CTA. It shows the complete static eagle artwork. WebGL failure uses the same static fallback.

## Integrations

- Contact API validates with Zod, rate-limits through Upstash and sends through Resend.
- Upload API issues client-upload tokens for one private Vercel Blob file up to 10 MB: PDF, DOCX, JPEG, PNG or WebP.
- Email attachment links are HMAC-signed for seven days. A protected daily cron deletes enquiry blobs older than 30 days.
- Development can simulate email and record an attachment name. Production cannot return a fake success.
- GTM loads only after explicit consent and only when `NEXT_PUBLIC_GTM_ID` exists.
- Trello and Telegram are out of scope.

## Route/index state

| Route | Purpose | Index |
| --- | --- | --- |
| `/` | Commercial landing | Index/follow |
| `/api/contact` | Enquiry delivery | Disallowed |
| `/api/upload` | Blob upload token | Disallowed |
| `/api/attachments/[token]` | Expiring private download | Disallowed |
| `/api/cron/purge-attachments` | Retention cron | Disallowed |

## Stable `data-testid` map

| Selector | Purpose |
| --- | --- |
| `site-navigation` | Header navigation |
| `mobile-navigation-toggle` | Mobile menu state |
| `header-contact-cta` | Header conversion CTA |
| `liberty-preloader`, `liberty-preloader-skip` | Intro and escape control |
| `liberty-motion-canvas` | Persistent visual layer |
| `liberty-motion-static-fallback` | Reduced-motion/WebGL-failure eagle |
| `home-hero-section` | Hero |
| `hero-primary-cta`, `hero-secondary-cta` | Hero conversion paths |
| `home-services-section`, `home-services-card-grid` | Service section/grid |
| `services-card-{service-id}` | Repeated service card |
| `services-card-{service-id}-details` | Service dialog opener |
| `service-details-dialog`, `service-dialog-contact-cta` | Dialog and CTA |
| `home-why-liberty-section`, `home-values-grid` | Values section |
| `home-process-section`, `home-process-step-list` | Process |
| `home-clients-section`, `home-industries-list` | Industries |
| `home-about-section` | About |
| `about-team-development-placeholders` | Dev-only team fixtures |
| `home-contact-section`, `contact-form` | Contact section/form |
| `contact-form-submit-button` | Form submission |
| `contact-form-{status}-state` | Accessible form feedback |
| `privacy-notice-dialog` | Privacy content |
| `analytics-consent-banner` | Analytics choice |
| `site-footer` | Footer |

## Protected decisions

- Keep one landing route; do not add service or plan routes without approval.
- Keep Event Security first unless commercial priority changes.
- Do not claim 24/7 availability, national coverage, clients, reviews, metrics, licences, awards or results.
- CCTV means on-site CCTV surveillance, not remote monitoring.
- Keep scrub, once, hover and preloader behaviours isolated.
- Do not load analytics before consent.
- Never publish development fixtures or fake form success in production.
- Do not rename stable selectors or change out-of-scope copy, motion, hover or metadata incidentally.

## Verification baseline — 2026-08-03

- ESLint, strict TypeScript, ten Vitest checks and production build pass.
- Playwright: thirteen passing checks across mobile and desktop; the desktop-only mobile-menu case is intentionally skipped. This includes a clean-session test of the preloader-to-canvas handoff.
- Axe: no serious or critical WCAG A/AA violations on mobile or desktop.
- Visual QA: 375, 768, 1024 and 1440 px each report zero horizontal overflow and zero page/console errors.
- Local enquiry path is verified browser → `/api/contact` → simulated response → accessible success state. Resend, Blob and Upstash require real credentials before their external boundaries can be verified.
- `npm audit --omit=dev` currently reports upstream transitive advisories in Next.js PostCSS/Sharp; no compatible automatic fix is available.
