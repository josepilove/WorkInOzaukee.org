import type { CollectionEntry } from 'astro:content';
import { HOURS_TRUST } from './vocab';

export type Venue = CollectionEntry<'venues'>;
export type Visit = CollectionEntry<'visits'>;

export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export type DayKey = (typeof DAYS)[number];

export const DAY_LABEL: Record<DayKey, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
};

/** JS getDay() is 0=Sunday. */
const JS_DAY_TO_KEY: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/**
 * Build a Date in LOCAL time from "YYYY-MM-DD".
 *
 * new Date("2026-08-24") parses as UTC midnight, which is the previous day in
 * every US timezone — so getDay() silently returns the wrong weekday and the
 * whole grid shifts by one. This is the bug that would have been hardest to
 * notice and worst to discover later.
 */
export function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function dayKeyOf(dateStr: string): DayKey {
  return JS_DAY_TO_KEY[parseLocalDate(dateStr).getDay()];
}

export function toDateStr(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function minutesOf(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h < 12 ? 'am' : 'pm';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour}${period}` : `${hour}:${String(m).padStart(2, '0')}${period}`;
}

export function formatRange(range: [string, string] | null): string {
  return range ? `${formatTime(range[0])}–${formatTime(range[1])}` : 'Closed';
}

export function formatDate(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// The grid
// ---------------------------------------------------------------------------

/**
 * Three states per venue × day.
 *
 *   closed   — venue hours say so
 *   tested   — a visit exists whose date falls on this weekday
 *   untested — open, but nobody has confirmed it works. This is the to-do list.
 *
 * The gap between "open" and "tested" is computed, never maintained. That
 * difference is the entire forcing function.
 */
export type CellState = 'closed' | 'tested' | 'untested';

export function gridState(venue: Venue, day: DayKey, visits: Visit[]): CellState {
  if (!venue.data.hours[day]) return 'closed';
  const tested = visits.some(
    (v) => v.data.venue.id === venue.id && dayKeyOf(v.data.date) === day,
  );
  return tested ? 'tested' : 'untested';
}

/** Every open-but-unconfirmed slot, worst day first. Your queue. */
export function gaps(venues: Venue[], visits: Visit[]) {
  const out: { venue: Venue; day: DayKey }[] = [];
  for (const day of DAYS) {
    for (const venue of venues) {
      if (gridState(venue, day, visits) === 'untested') out.push({ venue, day });
    }
  }
  return out;
}

export function gapsByDay(venues: Venue[], visits: Visit[]) {
  return DAYS.map((day) => ({
    day,
    open: venues.filter((v) => v.data.hours[day] !== null).length,
    tested: venues.filter((v) => gridState(v, day, visits) === 'tested').length,
  }));
}

// ---------------------------------------------------------------------------
// Open now
// ---------------------------------------------------------------------------

export type OpenStatus =
  | { state: 'open'; until: string }
  | { state: 'degraded'; until: string; reason: string }
  | { state: 'closed'; reason?: string }
  | { state: 'unknown' };

export function statusAt(venue: Venue, now: Date): OpenStatus {
  const today = toDateStr(now);
  const exception = venue.data.exceptions.find((e) => e.date === today);
  if (exception?.status === 'closed') {
    return { state: 'closed', reason: exception.reason };
  }

  const range = venue.data.hours[JS_DAY_TO_KEY[now.getDay()]];
  if (!range) return { state: 'closed' };

  const mins = now.getHours() * 60 + now.getMinutes();
  if (mins < minutesOf(range[0]) || mins >= minutesOf(range[1])) {
    return { state: 'closed' };
  }

  if (exception?.status === 'degraded') {
    return { state: 'degraded', until: range[1], reason: exception.reason };
  }
  return { state: 'open', until: range[1] };
}

// ---------------------------------------------------------------------------
// Staleness — the honesty machinery
// ---------------------------------------------------------------------------

export const STALE_AFTER_DAYS = 90;

export function daysSince(dateStr: string, now: Date): number {
  const then = parseLocalDate(dateStr);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((start.getTime() - then.getTime()) / 86_400_000);
}

export function isStale(venue: Venue, now: Date): boolean {
  return daysSince(venue.data.hours_checked, now) > STALE_AFTER_DAYS;
}

/** Venues whose hours need re-checking, oldest first. Another self-filling queue. */
export function reverifyQueue(venues: Venue[], now: Date): Venue[] {
  return venues
    .filter((v) => isStale(v, now))
    .sort((a, b) => daysSince(b.data.hours_checked, now) - daysSince(a.data.hours_checked, now));
}

// Re-exported from the controlled vocabulary so there is exactly one place
// where a source term is defined, labelled, and assigned a trust level.
export { SOURCE_LABEL } from './vocab';

/** How much the reader should trust this line. Drives the visual treatment. */
export function sourceTrust(source: string): 'high' | 'medium' | 'low' {
  return HOURS_TRUST[source] ?? 'low';
}

// ---------------------------------------------------------------------------
// Derived from the visit date — never entered by hand
// ---------------------------------------------------------------------------

export type Season = 'winter' | 'spring' | 'summer' | 'fall';

export function seasonOf(dateStr: string): Season {
  const m = parseLocalDate(dateStr).getMonth(); // 0-indexed
  if (m <= 1 || m === 11) return 'winter';
  if (m <= 4) return 'spring';
  if (m <= 7) return 'summer';
  return 'fall';
}

export type TimeBucket = 'early' | 'morning' | 'midday' | 'afternoon' | 'evening';

export function timeBucket(hhmm: string): TimeBucket {
  const m = minutesOf(hhmm);
  if (m < 8 * 60) return 'early';
  if (m < 11 * 60) return 'morning';
  if (m < 14 * 60) return 'midday';
  if (m < 17 * 60) return 'afternoon';
  return 'evening';
}

export function duration(arrived?: string, left?: string): string | null {
  if (!arrived || !left) return null;
  const mins = minutesOf(left) - minutesOf(arrived);
  if (mins <= 0) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function visitsFor(venueId: string, visits: Visit[]): Visit[] {
  return visits
    .filter((v) => v.data.venue.id === venueId)
    .sort((a, b) => b.data.date.localeCompare(a.data.date));
}

export function sortVisits(visits: Visit[]): Visit[] {
  return [...visits].sort((a, b) => b.data.date.localeCompare(a.data.date));
}
