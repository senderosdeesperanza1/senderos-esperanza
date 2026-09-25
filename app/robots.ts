import type { MetadataRoute } from "next";

// Requerido por Next.js con output: "export" para generar robots.txt como archivo estático.
export const dynamic = "force-static";

const SITE_URL = "https://www.senderosdeesperanza.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
