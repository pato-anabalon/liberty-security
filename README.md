# Liberty Security

Production-oriented single-page website for Liberty Security, an Auckland Region security provider. The site presents eight services through one commercial story, uses accessible service dialogs, and moves enquiries into a contextual contact form without publishing unverified proof or pricing.

## Stack

- Next.js 16 App Router, React 19 and strict TypeScript
- Tailwind CSS 4 plus design tokens in `src/app/globals.css`
- GSAP, `@gsap/react` and ScrollTrigger
- Three.js for the persistent particle story
- Lucide icons, Zod validation
- Vercel Blob, Upstash Redis and Resend integration boundaries
- Vitest and Playwright

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. With no service credentials, enquiries are simulated in development and logged server-side. Production never reports a simulated success.

## Scripts

```bash
npm run dev          # local development
npm run lint         # ESLint
npm run typecheck    # strict TypeScript
npm run test         # unit tests
npm run test:e2e     # responsive browser checks
npm run qa:visual    # screenshots + overflow/console checks at four widths
npm run build        # production build
npm run verify       # lint + typecheck + unit tests + build
```

## Public route and sections

Only `/` is indexable. It contains `hero`, `services`, `why-liberty`, `process`, `clients`, `about` and `contact`. Service detail is presented in a dialog; there are no service or plan routes. `/api/*` contains operational handlers and is disallowed in robots.

Commercial copy lives in `src/lib/content.ts`; metadata and structured data live in `src/lib/seo.ts`.

## Environment variables

| Variable | Purpose | Required for production |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, sitemap and links | Yes |
| `NEXT_PUBLIC_GTM_ID` | Consent-gated Google Tag Manager | When analytics is approved |
| `CONTACT_TO_EMAIL` | Enquiry recipient | Yes |
| `RESEND_FROM_EMAIL` | Verified Resend sender | Yes |
| `RESEND_API_KEY` | Email delivery | Yes |
| `BLOB_READ_WRITE_TOKEN` | Private attachment storage | Yes for uploads |
| `UPSTASH_REDIS_REST_URL` | Contact rate limiting | Yes |
| `UPSTASH_REDIS_REST_TOKEN` | Contact rate limiting | Yes |
| `ATTACHMENT_SIGNING_SECRET` | Seven-day private download links | Yes for uploads |
| `CRON_SECRET` | Authorises 30-day attachment purge | Yes for uploads |

Never commit `.env.local` or secrets. The mock phone number and pending company details must be replaced before launch.

## Deployment

1. Push to `https://github.com/pato-anabalon/liberty-security`.
2. Import the repository into the `nodo-nz` Vercel team.
3. Provision Private Vercel Blob and Upstash Redis, then add all production variables.
4. Create and verify the Resend sending domain and recipient.
5. Set the final domain in `NEXT_PUBLIC_SITE_URL`, deploy, then inspect metadata, email, private downloads and cron logs.

## Deeper documentation

- [Project context](./Liberty%20Security_PROJECT_CONTEXT.md)
- [SEO worklog](./SEO_WORKLOG.md)
- [Contributor rules](./AGENTS.md)

Source brand files remain untouched in `docs/`.

## Known dependency advisory

As of 2026-08-02, `npm audit --omit=dev` reports three high-severity transitive advisories in the current Next.js dependency tree (`postcss` and `sharp`). The scaffold is already on Next.js `16.2.12`; npm offers only a breaking, incorrect downgrade as an automatic fix. Do not run `npm audit fix --force`. Recheck when a compatible Next.js release updates those transitive packages.
