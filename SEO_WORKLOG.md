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

## Pending technical work

- Set final domain and verify canonical/OG absolute URLs.
- Replace the temporary phone number and add verified legal/contact details.
- Add production favicon/logo assets from a transparent master.
- Validate structured data in Rich Results Test after deployment.
- Submit sitemap and inspect `/` in Google Search Console.
- Confirm production robots and canonical from built HTML.
- Recheck the current Next.js transitive PostCSS/Sharp advisories when a compatible release is available; do not apply npm's proposed forced downgrade.

## Pending content/evidence

- Legal entity, NZBN, security licence/credential, approved address, email and hours.
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
