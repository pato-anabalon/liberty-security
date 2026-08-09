import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Liberty Security", short_name: "Liberty", description: "People-first security services across the Auckland Region.", start_url: "/", display: "standalone", background_color: "#000000", theme_color: "#1e2a38" };
}
