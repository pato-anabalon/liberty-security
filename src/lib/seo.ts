import type { Metadata } from "next";
import { contactContent } from "@/lib/content";

export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

export const seo = {
  name: "Liberty Security",
  title: "Liberty Security | Professional Security Services Auckland",
  description: "People-first security services across the Auckland Region, including event security, close protection, guarding and on-site CCTV monitoring.",
  locale: "en_NZ",
  canonicalPath: "/",
} as const;

export const homeMetadata: Metadata = {
  metadataBase: siteUrl,
  title: seo.title,
  description: seo.description,
  alternates: { canonical: seo.canonicalPath },
  openGraph: {
    type: "website",
    locale: seo.locale,
    url: seo.canonicalPath,
    siteName: seo.name,
    title: seo.title,
    description: seo.description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Liberty Security — People protecting people" }],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

export const libertyOrganizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: seo.name,
  url: siteUrl.toString(),
  logo: new URL("/brand/liberty-security-logo.jpeg", siteUrl).toString(),
  telephone: contactContent.phoneHref.replace("tel:", ""),
  email: contactContent.emailDisplay,
  identifier: {
    "@type": "PropertyValue",
    propertyID: "NZBN",
    value: contactContent.nzbnValue,
  },
  areaServed: { "@type": "AdministrativeArea", name: "Auckland Region" },
  slogan: "People protecting people.",
  description: seo.description,
};
