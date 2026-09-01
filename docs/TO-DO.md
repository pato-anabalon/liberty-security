# TO-DO — Pre-launch hidden content

Items intentionally hidden before the production launch. Nothing has been deleted; each entry lists the file, the exact edit, and how to restore it once the content is ready.

## 1. Evidence note box (`.evidence-note`)

- **File:** `src/components/templates/LibertyLandingPage.tsx`
- **Status:** JSX commented out inside the `#clients` section.
- **How to restore:**
  1. Remove the `{/* ... */}` wrapper around the `<div className="evidence-note">` block.
  2. Re-add `Radio` to the `lucide-react` import at the top of the file.

```tsx
<div className="evidence-note">
  <Radio aria-hidden="true" />
  <div>
    <strong>No borrowed proof.</strong>
    <p>Client logos, reviews and credentials will only appear here after Liberty has approval and evidence to publish them.</p>
  </div>
</div>
```

## 2. About section (landing + navbar)

### 2a. Landing section

- **File:** `src/components/templates/LibertyLandingPage.tsx`
- **Status:** Entire `<section id="about">` commented out.
- **How to restore:**
  1. Remove the `{/* ... */}` wrapper around the `<section id="about">` block.
  2. Re-add `Sparkles` to the `lucide-react` import.
  3. Re-add `aboutContent` to the `@/lib/content` import.
  4. Re-add the local flag inside the component:
     ```ts
     const showDevelopmentTeamMocks = process.env.NODE_ENV !== "production";
     ```

### 2b. Navbar entry

- **File:** `src/lib/content.ts`
- **Status:** `About us` commented out in `navigation`; `Contact us` added in its place.
- **How to restore:**
  1. Uncomment the `About us` entry.
  2. Remove the `Contact us` entry (or keep both if the final design calls for it).

```ts
export const navigation = [
  { label: "Services", href: "#services" },
  { label: "Why Liberty", href: "#why-liberty" },
  { label: "How we work", href: "#process" },
  { label: "About us", href: "#about" },
] as const;
```

> Note: `navigation` is consumed by both `Header.tsx` and `Footer.tsx`, so this single change restores the link in both places.

## 3. Social links (LinkedIn, Facebook, Instagram)

- **File:** `src/components/organisms/Footer.tsx`
- **Status:** `socialLinks` render commented out; the data in `src/lib/content.ts` is untouched.
- **How to restore:**
  1. Re-add `socialLinks` to the `@/lib/content` import.
  2. Uncomment the `.map(...)` render inside the `Connect` column.
  3. Populate `href` values in `socialLinks` (currently `null`) in `src/lib/content.ts`.

```tsx
<div>
  <span>Connect</span>
  <a href={contactContent.phoneHref}>{contactContent.phoneDisplay}</a>
  <a href={contactContent.emailHref}>{contactContent.emailDisplay}</a>
  {socialLinks.map((item) => item.href
    ? <a key={item.label} href={item.href}>{item.label}</a>
    : <span className="site-footer__pending" key={item.label}>{item.label} · pending</span>
  )}
</div>
```

## 4. PSPLA security licence (pending — request after launch)

- **Status:** Licence number not yet issued by PSPLA. The disclaimer copy `Security licence details pending approval.` has been removed from `src/components/organisms/Footer.tsx` to avoid publishing a "pending" claim on the live site.
- **Action items:**
  1. Submit the PSPLA licence application (owner responsibility).
  2. Once the licence number is issued, add it to the footer copy in `src/components/organisms/Footer.tsx`.
  3. Update `libertyOrganizationJsonLd` in `src/lib/seo.ts` to include the licence (e.g. as an additional `identifier` entry with `propertyID: "PSPLA"`).

**Suggested footer copy once issued:**

```tsx
<p>© {new Date().getFullYear()} Liberty Security. NZBN {contactContent.nzbnDisplay}. PSPLA licence {contactContent.licenceDisplay}.</p>
```

