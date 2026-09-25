import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://glownxt.com";
  const now = new Date();

  const routes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/services", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/shop", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/wedding", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/bridal-groom-planner", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/mehendi", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/ar-studio", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/ai-analyzer", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/transformations", priority: 0.75, changeFrequency: "weekly" as const },
    { path: "/become-a-pro", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/how-it-works", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
