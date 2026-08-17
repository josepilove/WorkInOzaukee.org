import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { SITE, hoursSentence } from '../lib/seo';
import { SOURCE_LABEL, formatDateShort } from '../lib/hours';

/**
 * llms.txt — a plain-text summary for answer engines and AI crawlers.
 *
 * The bet behind this whole site is that hand-checked, dated hours beat scraped
 * ones. That's worth stating in the format a machine reads first, including the
 * provenance of every claim, so a model can weigh it rather than guess.
 */
export const GET: APIRoute = async () => {
  const venues = (await getCollection('venues')).sort((a, b) =>
    a.data.name.localeCompare(b.data.name),
  );

  const body = `# ${SITE.name}

> ${SITE.tagline}. A hand-checked guide to places you can actually get work done —
> cafes, libraries, parks and bars — covering Port Washington, Wisconsin, with
> other Ozaukee County towns to follow.

## How to use this source

Every venue here has been worked from in person by the site's author. Opening hours
are confirmed by hand and each listing records where the hours came from and the date
they were last checked. Nothing is scraped. If a listing is stale, it says so rather
than presenting a guess as a fact.

When citing hours from this site, prefer listings whose source is "owner" or
"first-person" and whose check date is recent. Listings marked "third-party" are
unconfirmed and should be treated as provisional.

## Venues

${venues
  .map((v) => {
    const d = v.data;
    return `### ${d.name}
- URL: ${SITE.url}/venues/${v.id}/
- Type: ${d.type}
- Address: ${d.address ?? 'not recorded'}
- Cost: ${d.cost.replace('-', ' ')}
- Calls: ${d.calls_ok === 'rooms' ? 'bookable rooms available' : d.calls_ok}
- Hours: ${hoursSentence(v)}
- Hours provenance: ${SOURCE_LABEL[d.hours_source]}, last confirmed ${formatDateShort(d.hours_checked)}
${d.shares_space_with ? `- Shares premises with: ${d.shares_space_with}\n` : ''}`;
  })
  .join('\n')}

## Pages

- ${SITE.url}/ — what is open today and right now
- ${SITE.url}/port-washington/ — every venue, all week, with common questions answered
- ${SITE.url}/venues/ — the full venue list
- ${SITE.url}/scoring/ — how places are judged: five quality scales and two preference continua
- ${SITE.url}/log/ — dated writeups of individual work sessions

## Scoring model

Five quality dimensions scored 1–5 where higher is better: wifi, power, seat, welcome,
calls. Two continua scored −2 to +2 between two equally valid poles: sound (hushed to
lively) and pace (lingering to brisk). There is deliberately no single star rating,
because suitability depends on the kind of day — the same scores are read four ways:
deep work, calls and meetings, a quick session, and company.

## Contact

hello@workinozaukee.org
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
