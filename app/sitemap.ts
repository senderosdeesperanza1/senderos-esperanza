import type { MetadataRoute } from "next";

// Requerido por Next.js con output: "export" para generar sitemap.xml como archivo estático.
export const dynamic = "force-static";

const SITE_URL = "https://www.senderosdeesperanza.org";

// El sitio usa exportación estática (output: "export") con trailingSlash: true,
// así que las URLs reales terminan en "/" (excepto la portada).
const rutas: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "nosotros", priority: 0.8, changeFrequency: "monthly" },
  { path: "nosotros/impacto", priority: 0.7, changeFrequency: "monthly" },
  { path: "nosotros/opiniones", priority: 0.7, changeFrequency: "weekly" },
  { path: "nosotros/testimonios", priority: 0.6, changeFrequency: "monthly" },
  { path: "nosotros/transparencia", priority: 0.7, changeFrequency: "monthly" },
  { path: "programas", priority: 0.9, changeFrequency: "monthly" },
  { path: "programas/educacion", priority: 0.8, changeFrequency: "monthly" },
  { path: "programas/seguridad-alimentaria", priority: 0.8, changeFrequency: "monthly" },
  { path: "programas/cuidado", priority: 0.8, changeFrequency: "monthly" },
  { path: "programas/talleres", priority: 0.7, changeFrequency: "monthly" },
  { path: "programas/terremoto", priority: 0.7, changeFrequency: "monthly" },
  { path: "contacto", priority: 0.6, changeFrequency: "yearly" },
  { path: "donar", priority: 0.9, changeFrequency: "monthly" },
  { path: "privacy-policy", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();
  return rutas.map(({ path, priority, changeFrequency }) => ({
    url: path ? `${SITE_URL}/${path}/` : `${SITE_URL}/`,
    lastModified: ahora,
    changeFrequency,
    priority,
  }));
}
