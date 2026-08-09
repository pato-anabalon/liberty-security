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
7. Contact — contextual enquiry form with verified phone and email.
8. Footer — coverage, NZBN, pending social channels and privacy notice.

FAQ, testimonials, credentials, case studies and team profiles stay hidden until real material exists. There are no plans, prices or individual service pages.

## Content model

`src/lib/content.ts` is the source for navigation, hero, services, values, process, industries, about, verified contact/NZBN details and pending social data. Each service includes `id`, `order`, title, eyebrow, summary, detail, outcomes, icon and an image descriptor with source/focal position. Reorder services only by changing `order`. Never bury commercial copy across visual components when it belongs in this model.

## Component architecture

- `atoms`: Button, Container, Logo, MetaChip, TextField.
- `molecules`: SectionHeading, ScrollReveal, HeroContentEntrance, ServiceCard, TrackedCta, PrivacyButton.
- `organisms`: Header, Footer, ServiceExplorer, ServicesExperiment, Preloader, HeroEagleImage, HeroLiquidBackground, HeroEagleFog, ContactForm, PrivacyDialog, AnalyticsConsent.
- `templates`: LibertyLandingPage.

Pages and metadata stay server-rendered. State, browser APIs, dialogs, analytics, forms and motion are narrow Client Component islands.

## Visual system

Tokens: Black `#000000`, Cream `#F2EFE8`, Liberty Gold `#C8A45D`, Liberty Blue `#1E2A38`, Secondary Cream `#F3E9D8`, Secondary Blue `#3C507D`. Sora is the display face; Manrope is the body face. Surfaces alternate cream, blue, black and gold. Buttons, text links, chips and informational labels remain visually distinct.

The source JPEG is preserved in `docs/logo.jpeg` and copied to `public/brand/liberty-security-logo.jpeg` for the footer. The header and preloader use the dedicated transparent `public/brand/liberty-logo.png` mark.

## Responsive decisions

- Mobile: stacked hero actions, overlay navigation, one-column cards, a right-cropped eagle image and simplified localized fog.
- Tablet: two-column services, two-column forms, revised process layout.
- Tablet motion: responsive eagle image and localized fog.
- Desktop: four-column services, full navigation, a right-aligned eagle image and localized fog.
- Large desktop: wider controlled container and more section rhythm.
- Services: desktop from 1024 px uses eight vertical panels that expand into one inline detail; tablet/mobile use a single-column accordion. The landing owns the approved implementation and low-poly background transition; the temporary review route has no header, preloader, footer or other landing sections.
- Header: `public/brand/liberty-logo.png` is the centred `#top` link. Services and Why Liberty sit to its left; How we work and About us sit to its right; phone and the rounded enquiry CTA occupy the far-right action group. Mobile keeps the centred mark and moves all navigation/actions into the existing overlay menu.
- Header container: unlike section content, the desktop header uses near-viewport width so its contact actions reach the right edge. The mobile navigation is an opaque, full-height absolute overlay below the fixed header; this avoids the `backdrop-filter` containing-block issue that previously left menu children overflowing over the hero without their background.

No heavy video is rendered. Layout uses `overflow-x: clip`; visual QA must still test 375, 768, 1024 and 1440 widths.

## Motion architecture

Motion types remain separated:

- Preloader: once per session, own labelled GSAP timeline and no Skip control. A white, centred logo/wordmark composition fills the outlined `— SECURITY —` indicator to 92% while logo, font and hero-image readiness resolve within a 2.2-second timeout measured from timeline start. The final fill contracts into a black point rendered as a vector circular clip on a viewport-sized layer; `liberty:preloader-complete` fires only after the radius reaches the farthest corner. It does not own any hero animation.
- Navbar entrance: `Header` owns a scoped GSAP timeline that descends from above after `liberty:preloader-complete`, clears its inline transform styles on completion and remains static for reduced-motion users. Mobile menu state and transitions remain CSS/React-owned.
- Hero layers: `HeroEagleImage` owns `public/brand/eagle.jpg` and its eye-centred iris/depth intro at the back; `HeroEagleFog` keeps three localized fog layers over the eagle; content remains above both.
- Reserved experiment: `HeroLiquidBackground` and its styles remain available but are not mounted. The mist treatment was removed from the hero pending a better section placement.
- Hero fog: `HeroEagleFog` owns only the localized fog and its motion. Its scoped `useGSAP` lifecycle animates transforms and opacity, with slightly stronger desktop travel and slower compact motion. It is autoplay motion, not scrub motion.
- Hero content entrance: `HeroContentEntrance` owns one scoped GSAP/SplitText timeline. H1 words use a masked perspective reveal, lead words use a separate lateral wave and the CTAs remain whole. It waits for `liberty:preloader-complete`, restores split markup during cleanup, clears inline transform styles to preserve CTA hovers and skips motion entirely for reduced-motion users.
- Once reveals: `ScrollReveal` uses one-shot viewport entrance timelines.
- Hover: CSS-owned and not overwritten by scroll timelines.
- Services gallery: `ServicesExperiment` owns one scoped, click-driven GSAP Flip transition on both the landing and temporary review route. Opening is intentionally staged: the selected image holds its accordion presentation while the gallery clears, then shifts right as its left transparency mask, left-entering detail card and bottom-right back control resolve together. Closing reverses those roles before restoring the accordion; fixed desktop grid columns preserve the selected service's slot while Flip temporarily positions it absolutely. It never uses ScrollTrigger or shares a timeline with other landing motion; reduced motion changes state instantly.

Reduced motion removes the preloader, fog drift and reveal transforms while retaining every message, CTA and the complete static eagle photograph.

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
| `/services-experiment` | Temporary services interaction prototype | Noindex/nofollow; excluded from sitemap |
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
| `liberty-preloader` | First-session intro and hero release boundary |
| `hero-eagle-image` | Eagle photograph at the back of the hero stack |
| `hero-eagle-fog` | Localized fog above the eagle position |
| `liberty-motion-static-fallback` | Eagle photograph; remains static for reduced motion |
| `home-hero-section` | Hero |
| `hero-primary-cta`, `hero-secondary-cta` | Hero conversion paths |
| `home-services-section`, `home-services-card-grid`, `home-services-pattern` | Landing service section, gallery and background |
| `services-experiment-section`, `services-experiment-gallery`, `services-experiment-pattern` | Temporary services prototype surfaces |
| `services-experiment-panel-{service-id}` | Shared landing/review service panel |
| `services-experiment-detail`, `services-experiment-close`, `services-experiment-contact-cta` | Shared expanded detail controls |
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
- Keep preloader, hero fog, once and hover behaviours isolated.
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

## Motion verification update — 2026-08-05

- Replaced the hero particle cloud with the then-current shared line-mesh graph; preloader, scroll scene events, local pointer deformation, reduced-motion fallback and stable selectors remained intact at that point.
- ESLint, strict TypeScript, ten Vitest checks and the production build pass.
- Playwright: thirteen passing checks and one expected desktop skip, including the clean-session preloader handoff and reduced-motion fallback.
- Production visual QA at 375, 768, 1024 and 1440 px reports zero horizontal overflow and zero page/console errors; the hero render was inspected at all four widths.

## Hero fog update — 2026-08-07

- Replaced the visible hero line eagle with `public/brand/eagle.jpg` on an absolute-black hero and isolated the photograph, mist and localized fog into separate components.
- Added the reference-inspired `HeroLiquidBackground` between the eagle photograph and localized fog without adding another canvas/WebGL renderer.
- Removed `HeroLiquidBackground` from the rendered hero after visual review; retained the isolated component for possible reuse in another section.
- Removed the persistent WebGL line story, its motion director and Three.js dependency after visual review. No eagle line layer remains behind later sections.
- Increased the localized fog contrast and layer opacity while preserving its slow movement, right-side placement, three-layer structure and reduced-motion fallback.
- Removed the separate `Our standard` proof panel from the hero and softened only the two hero CTAs with a moderate corner radius. Their copy, destinations, analytics events, hover behaviour and stable selectors remain unchanged.
- Kept the secondary CTA label and down arrow on one line, then added a preloader-coordinated staggered entrance for the hero eyebrow, heading, lead and actions. The animation is isolated from fog, scroll reveals and hover behaviour.
- Refined the hero entrance so the H1 and lead animate word by word with distinct treatments while CTAs remain intact. Added an independent eye-centred iris and depth settle for the eagle image; both timelines share only the preloader release signal. The iris uses a progressive fade and symmetric easing so the visible eagle develops continuously instead of appearing after a wipe crosses the JPEG's black margins. The experimental gold light sweep was removed after review.
- Reduced motion keeps the eagle photograph static and removes the fog layers. Stable selectors, preloader, once reveals, hovers, commercial copy and metadata remain unchanged.
- ESLint, strict TypeScript, eight Vitest checks and the production build pass after removing the line subsystem. Playwright was intentionally not run for this revision. The build requires network access while Manrope and Sora remain sourced through `next/font` Google Fonts.

## Preloader transition update — 2026-08-07

- Replaced the particles, wing wipe, legacy logo treatment and Skip control with the responsive white logo/`LIBERTY`/`— SECURITY —` composition.
- The fill advances to 92% while logo, fonts and the hero image resolve, then contracts into a black point whose scale is calculated against the farthest viewport corner.
- The public session key, `liberty-preloader` selector and `liberty:preloader-complete` event remain stable. The event is emitted once only after the screen is fully black; navbar, eagle and hero-copy timelines remain unchanged.
- Scroll is locked only while the overlay exists and restored during every completion or cleanup path. Reduced motion, seen sessions and restricted storage bypass the intro.
- The server-rendered state is intentionally visible without JavaScript: logo and `LIBERTY` render normally, `— SECURITY —` starts in outline and the expansion point starts at scale zero. GSAP animates transforms and the fill after hydration but never owns the composition's initial visibility, preventing a blank white screen on throttled connections.
- Production preserves the once-per-session key. Development intentionally ignores an existing seen value on full page loads so the fill, contraction and circular handoff remain reviewable on `localhost`; reduced motion and unavailable storage still bypass the intro. `data-preloader-phase` exposes `checking`, `playing` or `hidden` for manual DevTools diagnosis.
- The circular handoff animates `clip-path: circle()` on one fixed black layer instead of scaling a 14 px DOM circle. This keeps the expanding edge crisp at large desktop resolutions without changing its origin, timing or coverage calculation.
- ESLint, strict TypeScript, eighteen Vitest checks and the production build pass. The slow-hydration blank state was found through manual Chrome throttling after automated browser checks missed it; do not use Playwright as visual acceptance for this preloader. Further visual validation follows direct user feedback.
