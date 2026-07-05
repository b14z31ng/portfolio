import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface SimpleProject {
  slug: string;
}

interface SimpleBlogPost {
  slug: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/projects", "/experience", "/blog"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  let projectRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];

  // Fetch projects
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/projects/public`);
    if (res.ok) {
      const data = await res.json();
      projectRoutes = (data.items || []).map((project: SimpleProject) => ({
        url: `${SITE_URL}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (err) {
    console.error("Sitemap: failed to fetch projects:", err);
  }

  // Fetch blog posts
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/blog/public`);
    if (res.ok) {
      const data = await res.json();
      blogRoutes = (data.items || []).map((post: SimpleBlogPost) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (err) {
    console.error("Sitemap: failed to fetch blog posts:", err);
  }

  return [...routes, ...projectRoutes, ...blogRoutes];
}
