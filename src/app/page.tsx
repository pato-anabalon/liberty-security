import { LibertyLandingPage } from "@/components/templates/LibertyLandingPage";
import { libertyOrganizationJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(libertyOrganizationJsonLd).replace(/</g, "\\u003c") }} />
      <LibertyLandingPage />
    </>
  );
}
