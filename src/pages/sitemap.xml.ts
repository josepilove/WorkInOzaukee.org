import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { SITE } from '../lib/seo';

/**
 * Hand-rolled rather than pulling in @astrojs/sitemap — one dependency is a
 * feature of this project, and the route list is small enough to be obvious.
 *
 * /todo is deliberately absent: it's noindex and disallowed in robots.txt.
 */
export const GET: APIRoute = async () => {
  const venues = await getCollection('venues');
  const visits = await getCollection('visits');

  const urls: { loc: string; lastmod?: string; priority: string }[] = [
    { loc: '/', priority: '1.0' },
    { loc: '/port-washington', priority: '0.9' },
    { loc: '/venues', priority: '0.8' },
    { loc: '/scoring', priority: '0.4' },
    { loc: '/log', priority: '0.6' },
    ...venues.map((v) => ({
      loc: `/venues/${v.id}`,
      lastmod: v.data.hours_checked,
      priority: '0.8',
    })),
    ...visits.map((v) => ({
      loc: `/log/${v.id}`,
      lastmod: v.data.date,
      priority: '0.5',
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE.url}${u.loc}${u.loc === '/' ? '' : '/'}</loc>${
      u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''
    }
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
