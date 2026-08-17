import { getCollection } from 'astro:content';
import { sortVisits, parseLocalDate, formatDate } from '../lib/hours';
import type { APIRoute } from 'astro';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') ?? 'https://workinozaukee.org';
  const visits = sortVisits(await getCollection('visits'));
  const venues = await getCollection('venues');
  const nameOf = (id: string) => venues.find((v) => v.id === id)?.data.name ?? id;

  const items = visits
    .map((v) => {
      const title = `${nameOf(v.data.venue.id)}, ${formatDate(v.data.date)}`;
      const link = `${base}/log/${v.id}`;
      // Noon local, so the date can't slip backwards in any US timezone.
      const pub = parseLocalDate(v.data.date);
      pub.setHours(12);
      return `    <item>
      <title>${escape(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pub.toUTCString()}</pubDate>
      <description>${escape(v.data.verdict ?? '')}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Work in Ozaukee</title>
    <link>${base}</link>
    <description>Where to work in Port Washington, Wisconsin. Hand-checked, dated, no account required.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
