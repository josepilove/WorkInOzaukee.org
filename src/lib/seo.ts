import type { CollectionEntry } from 'astro:content';
import { DAYS, formatRange } from './hours';

export const SITE = {
  url: 'https://workinozaukee.org',
  name: 'Work in Ozaukee',
  tagline: 'Where to work in Port Washington, Wisconsin',
  locale: 'en_US',
  region: 'Ozaukee County, Wisconsin',
};

type Venue = CollectionEntry<'venues'>;

/** schema.org day names, in the order our hours object uses. */
const SCHEMA_DAY: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

/**
 * Our venue types → schema.org types. Being specific matters: an answer engine
 * treats CafeOrCoffeeShop and Park very differently, and "LocalBusiness" for a
 * public park is just wrong.
 */
const SCHEMA_TYPE: Record<string, string> = {
  cafe: 'CafeOrCoffeeShop',
  library: 'Library',
  coworking: 'LocalBusiness',
  'hotel-lobby': 'LocalBusiness',
  bar: 'BarOrPub',
  brewery: 'Brewery',
  restaurant: 'Restaurant',
  outdoor: 'Park',
  civic: 'CivicStructure',
  other: 'LocalBusiness',
};

function postalAddress(venue: Venue) {
  return {
    '@type': 'PostalAddress',
    streetAddress: venue.data.address?.split(',')[0]?.trim(),
    addressLocality: 'Port Washington',
    addressRegion: 'WI',
    addressCountry: 'US',
  };
}

/**
 * Publishing hours as machine-readable data is the single highest-value thing
 * here. It's also the honest move: the same provenance we show humans
 * (hours_source, hours_checked) becomes dateModified, so an answer engine can
 * see how fresh the claim is rather than assuming.
 */
export function venueJsonLd(venue: Venue) {
  const d = venue.data;
  const openingHours = DAYS.filter((day) => d.hours[day]).map((day) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: `https://schema.org/${SCHEMA_DAY[day]}`,
    opens: d.hours[day]![0],
    closes: d.hours[day]![1],
  }));

  return {
    '@context': 'https://schema.org',
    '@type': SCHEMA_TYPE[d.type] ?? 'LocalBusiness',
    '@id': `${SITE.url}/venues/${venue.id}/#place`,
    name: d.name,
    url: `${SITE.url}/venues/${venue.id}/`,
    ...(d.url ? { sameAs: [d.url] } : {}),
    ...(d.phone ? { telephone: d.phone } : {}),
    ...(d.address ? { address: postalAddress(venue) } : {}),
    ...(d.coords
      ? { geo: { '@type': 'GeoCoordinates', latitude: d.coords[0], longitude: d.coords[1] } }
      : {}),
    ...(openingHours.length ? { openingHoursSpecification: openingHours } : {}),
    ...(d.cost === 'free' ? { isAccessibleForFree: true } : {}),
    publicAccess: true,
    dateModified: d.hours_checked,
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Hours source',
        value: d.hours_source,
      },
      {
        '@type': 'PropertyValue',
        name: 'Hours last confirmed',
        value: d.hours_checked,
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: `${SITE.url}/`,
    description: SITE.tagline,
    inLanguage: 'en-US',
    publisher: { '@type': 'Person', name: 'Joe Elmendorf' },
  };
}

/** A plain list of places, which is what a "best places to work in X" query wants. */
export function itemListJsonLd(venues: Venue[], name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: venues.length,
    itemListElement: venues.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE.url}/venues/${v.id}/`,
      name: v.data.name,
    })),
  };
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Turn venue names inside a sentence into links to the venue's own site.
 *
 * The same answer string feeds both the visible page and the FAQPage JSON-LD.
 * Structured data must stay plain text, so linking happens only here, on the
 * rendered side — one source of truth, no chance of the two drifting.
 *
 * Longest name first, so "Sacred Bean Coffee Co." isn't clipped by a shorter
 * name that happens to be a prefix of it.
 */
export function linkifyVenues(text: string, venues: Venue[]): string {
  let html = escapeHtml(text);
  const ordered = [...venues].sort((a, b) => b.data.name.length - a.data.name.length);

  for (const v of ordered) {
    const name = escapeHtml(v.data.name);
    if (!html.includes(name)) continue;

    const external = v.data.url;
    // rel="noopener" only — deliberately NOT noreferrer.
    //
    // noopener stops the opened page reaching back through window.opener
    // (reverse tabnabbing). Modern browsers imply it for target="_blank", but
    // it costs nothing to be explicit.
    //
    // noreferrer would strip the Referer header, which means a venue owner
    // checking their analytics would never see this site sending them traffic.
    // That referral is the entire argument for "let me keep your hours listed" —
    // suppressing it would be throwing away the proof.
    const anchor = external
      ? `<a href="${escapeHtml(external)}" class="ext" target="_blank" rel="noopener">${name}<svg class="ext-icon" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M4 2h6v6M10 2 3 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="sr-only"> (opens their website in a new tab)</span></a>`
      : `<a href="/venues/${v.id}">${name}</a>`;

    // Replace only the first mention — repeat links in one answer are noise.
    html = html.replace(name, anchor);
  }

  return html;
}

export function faqJsonLd(qas: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qas.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${SITE.url}${t.path}`,
    })),
  };
}

/**
 * A one-sentence factual summary of a venue's hours, in prose.
 *
 * Answer engines quote sentences, not tables. This gives them something
 * accurate and self-contained to lift, rather than leaving them to infer
 * opening times from a grid of cells.
 */
export function hoursSentence(venue: Venue): string {
  const open = DAYS.filter((d) => venue.data.hours[d]);
  if (open.length === 0) return `${venue.data.name} has no listed opening hours.`;

  const byRange = new Map<string, string[]>();
  for (const day of open) {
    const key = formatRange(venue.data.hours[day]);
    byRange.set(key, [...(byRange.get(key) ?? []), day]);
  }

  const label: Record<string, string> = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday',
  };

  const parts = [...byRange.entries()].map(([range, days]) => {
    const names = days.map((d) => label[d]);
    const list =
      names.length === 1
        ? names[0]
        : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
    return `${list} ${range}`;
  });

  const closed = DAYS.filter((d) => !venue.data.hours[d]).map((d) => label[d]);
  const closedPart =
    closed.length === 0
      ? ''
      : ` It is closed ${
          closed.length === 1
            ? closed[0]
            : `${closed.slice(0, -1).join(', ')} and ${closed[closed.length - 1]}`
        }.`;

  return `${venue.data.name} is open ${parts.join('; ')}.${closedPart}`;
}
