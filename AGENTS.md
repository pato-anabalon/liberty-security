<!-- BEGIN:nextjs-agent-rules -->
# Next.js version rule

This project uses Next.js 16. Read the relevant guide in `node_modules/next/dist/docs/` before changing framework behaviour, conventions or file structure.
<!-- END:nextjs-agent-rules -->

# Liberty Security contributor rules

## Architecture

- App Router routes live in `src/app`.
- Use Server Components by default and narrow Client Components to interactivity.
- Follow `atoms`, `molecules`, `organisms`, `templates` in `src/components` when reuse is real.
- Commercial content belongs in `src/lib/content.ts`; SEO belongs in `src/lib/seo.ts`.
- Tokens and shared styles belong in `src/app/globals.css`; static assets belong in `public`.

## Commands

Run `npm run lint`, `npm run typecheck`, `npm run test` and `npm run build`. For visual or interaction changes also run `npm run test:e2e` and inspect 375, 768, 1024 and 1440 widths.

## Commercial/content boundaries

- The site is one landing page. No plans, pricing or individual service pages without approval.
- Auckland Region only. Do not claim 24/7 availability.
- Event Security leads; service hierarchy is controlled by `order`.
- CCTV Monitoring means on-site surveillance.
- Never invent clients, testimonials, reviews, credentials, licences, awards, metrics or outcomes.
- Development placeholders must remain absent from production.

## Refactor boundary

State what changes, what remains protected, what is out of scope and how the work will be verified. Do not use a small task to rename selectors, rewrite copy, alter metadata, change hover behaviour or reorganise motion. Create a shared component only when repetition or a clear boundary warrants it.

## SEO

Keep `lang="en-NZ"`, one H1, canonical, Open Graph, Twitter, robots, sitemap and real structured data. Do not add FAQ/review schema without visible verified content. Record blockers and decisions in `SEO_WORKLOG.md`.

## Motion

Keep four behaviours separate: preloader, scrub, once and hover. Use `useGSAP`/scoped cleanup, transforms and opacity. ScrollTrigger belongs at the top-level timeline/section director. Reduced-motion users receive static complete content. Preserve mobile particle/DPR/FPS caps and never turn a scrub animation into autoplay.

## Selectors and docs

Treat all `data-testid` values in `Liberty Security_PROJECT_CONTEXT.md` as stable API. Update README, project context and SEO worklog with implementation decisions rather than reconstructing them at the end.
