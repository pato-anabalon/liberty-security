# SEO Worklog

## Current status

The technical foundation is implemented for one Auckland-focused landing page. `/` is indexable; operational routes are disallowed. The canonical URL currently falls back to `http://localhost:3000` and must be replaced through `NEXT_PUBLIC_SITE_URL` before production.

## Implemented

- `lang="en-NZ"` and one visible H1.
- Unique home title and description in `src/lib/seo.ts`.
- Canonical, Open Graph and Twitter metadata.
- Programmatic 1200×630 Open Graph image.
- `robots.ts`, single-URL `sitemap.ts` and web manifest.
- Organization + LocalBusiness JSON-LD with Auckland Region coverage.
- Semantic anchor navigation and internal links.
- Only real content is exposed; no FAQ or review schema.

## Indexable routes

| Route | Index state | Primary intent |
| --- | --- | --- |
| `/` | index, follow | security services Auckland; event security Auckland |

No individual service routes exist by approved commercial decision.

`/services-experiment` is a temporary review surface for the approved landing services interaction, with `noindex, nofollow`, a self-referencing canonical and no sitemap entry. It is not an SEO landing page or an approved individual service route.

## Pending technical work

- Set final domain and verify canonical/OG absolute URLs.
- Add the remaining verified legal, address and licence details when approved.
- Add production favicon/logo assets from a transparent master.
- Validate structured data in Rich Results Test after deployment.
- Submit sitemap and inspect `/` in Google Search Console.
- Confirm production robots and canonical from built HTML.
- Recheck the current Next.js transitive PostCSS/Sharp advisories when a compatible release is available; do not apply npm's proposed forced downgrade.

## Pending content/evidence

- Legal entity, security licence/credential, approved address and hours.
- Founder names, roles, biographies and approved photos.
- Approved social profile URLs.
- Approved client logos, testimonials, credentials and case studies.
- Real FAQ questions before showing FAQ content or FAQ JSON-LD.

## Future landing opportunities

Only consider these after search demand, operational capacity and unique evidence are confirmed: Event Security Auckland, Construction Site Security Auckland, Hotel Security Auckland, Close Protection Auckland and Hospitality Security Auckland. Do not clone thin service pages.

## External actions

1. Create/verify Google Business Profile with consistent legal details.
2. Connect final domain to Search Console and submit `/sitemap.xml`.
3. Configure GTM/GA4 after IDs and consent policy are approved.
4. Maintain accurate local citations and service categories.

## Decision history

- 2026-08-02: approved single landing instead of hub/service routes.
- 2026-08-02: Auckland Region set as current coverage; 24/7 omitted.
- 2026-08-02: plans/pricing removed; all conversion is enquiry-led.
- 2026-08-02: FAQ remains hidden and no Breadcrumb/FAQ schema is emitted.
- 2026-08-02: client evidence uses an honest pending state rather than mock proof.
- 2026-08-05: the hero visual changed from particles to an animated line mesh; commercial copy, headings, metadata and structured data remain unchanged.
- 2026-08-07: replaced the visible hero line eagle with `public/brand/eagle.jpg` and an isolated GSAP fog component on absolute black. Copy, headings, metadata, structured data and commercial claims remain unchanged.
- 2026-08-07: added a reference-inspired animated light-fold background behind the complete hero. Copy, headings, metadata, structured data and commercial claims remain unchanged.
- 2026-08-07: removed the mist experiment from the rendered hero and retained its isolated component for possible reuse elsewhere. The hero returns to the eagle image plus localized fog; SEO and commercial content remain unchanged.
- 2026-08-07: removed the persistent WebGL eagle line layer from all non-hero sections, including its motion director and Three.js dependency. The hero image and localized fog remain unchanged; SEO and commercial content are unaffected.
- 2026-08-07: increased the localized hero fog visibility without changing copy, headings, metadata, structured data or commercial claims.
- 2026-08-07: removed the secondary `Our standard` hero panel and rounded only the hero CTAs. Primary copy, CTA destinations, headings, metadata, structured data and commercial claims remain unchanged.
- 2026-08-07: kept the secondary hero CTA content on one line and added a reduced-motion-safe hero content entrance after the preloader. Copy, CTA destinations, headings, metadata, structured data and commercial claims remain unchanged.
- 2026-08-07: split the H1 and hero lead into accessible word-level entrance sequences and added an independent cinematic eagle reveal. CTA content, copy, headings, metadata, structured data and commercial claims remain unchanged.
- 2026-08-07: corrected the eagle intro by centring its reveal on the eye and extending the fade/mask progression; this motion-only adjustment does not change indexable content, metadata, structured data or commercial claims.
- 2026-08-07: removed the gold light sweep from the eagle intro while retaining its eye-centred iris and depth settle; indexable content and SEO surfaces remain unchanged.
- 2026-08-07: replaced the header wordmark with the centred `liberty-logo.png`, redistributed navigation around it, renamed two labels to `How we work` and `About us`, and kept all anchor destinations unchanged. Metadata, structured data and commercial claims are unaffected.
- 2026-08-07: widened the desktop header container, removed the phone underline and corrected the mobile navigation to use an opaque full-height overlay. This responsive-only adjustment leaves navigation destinations and SEO surfaces unchanged.
- 2026-08-07: added a reduced-motion-safe top-to-bottom navbar entrance after the preloader. Navigation content, destinations, metadata and structured data remain unchanged.
- 2026-08-07: replaced the first-session preloader with a white logo/wordmark loader and a black circular hero handoff, removing its Skip control. This motion-only change leaves indexable copy, headings, metadata, structured data and commercial claims unchanged.
- 2026-08-07: corrected the preloader's server-rendered state so its branding remains visible before JavaScript hydration on slow connections. The correction changes no indexable copy, metadata, structured data or commercial claims.
- 2026-08-07: replaced the preloader's raster-prone scaled point with a vector circular clip for a cleaner fullscreen handoff. This rendering-only adjustment changes no indexable or commercial content.
- 2026-08-09: added the isolated `/services-experiment` prototype to test an image-led gallery-to-detail interaction. It remains `noindex, nofollow`, excluded from the sitemap and separate from the landing until visual approval.
- 2026-08-09: promoted the approved image-led gallery, inline detail interaction and low-poly transition background into the landing `#services` section. Commercial copy, service order, contact preselection, metadata and structured data remain unchanged; the review route stays non-indexable.
- 2026-08-09: replaced the mock phone and published the supplied email and NZBN across contact surfaces and Organization/LocalBusiness structured data. Legal entity, address, hours and licence evidence remain pending.
- 2026-08-09: kept the active mobile services panel above sibling cards for the full GSAP Flip open/close transition, clearing its temporary layer afterward. Desktop motion, service content, order, metadata and structured data remain unchanged.
- 2026-08-09: refreshed `home-values-grid` with layered, numbered Liberty cards inspired by the supplied infographic reference. Value copy, order, reveal motion, selectors, metadata and structured data remain unchanged.
