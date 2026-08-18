import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  values,
  VENUE_TYPES,
  DISTRICTS,
  COSTS,
  SERVES,
  CALLS_OK,
  HOURS_SOURCES,
  SEASONS,
  EXCEPTION_STATUS,
  WIFI,
  OUTLETS,
  LIGHT,
  TEMP,
} from './lib/vocab';

/**
 * Two collections, because the data has two different lifespans.
 *
 *   venues — mutable facts about a place. Need periodic re-verification.
 *   visits — immutable observations from one session. Never revised.
 *
 * Putting hours on a visit gives you N conflicting copies; putting
 * "it was loud today" on a venue overwrites a fact with a mood.
 */

const TIME = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use 24-hour HH:MM, e.g. "09:00" or "17:30"');

// Dates are normalized to a "YYYY-MM-DD" string rather than a Date object.
//
// YAML silently parses an unquoted 2026-08-11 into a Date at UTC midnight, which
// is the *previous day* in every US timezone — so getDay() returns the wrong
// weekday and the entire grid shifts by one. Rather than making you remember to
// quote every date, we accept both and normalize here. Reading the calendar date
// back with UTC getters is what keeps it from sliding.
const DATE = z.preprocess(
  (val) => {
    if (val instanceof Date) {
      const p = (n: number) => String(n).padStart(2, '0');
      return `${val.getUTCFullYear()}-${p(val.getUTCMonth() + 1)}-${p(val.getUTCDate())}`;
    }
    return val;
  },
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
);

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

// [open, close] or null for closed. Every day must be present, so that
// "closed" is always a deliberate statement rather than a forgotten field.
const hoursShape = Object.fromEntries(
  DAYS.map((d) => [d, z.tuple([TIME, TIME]).nullable()]),
) as Record<(typeof DAYS)[number], z.ZodType<[string, string] | null>>;

const venues = defineCollection({
  // Files starting with _ are ignored, so _template.md can sit alongside real entries.
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/venues' }),
  schema: z.object({
    name: z.string(),
    type: z.enum(values(VENUE_TYPES)),

    // Some venues share an address and split the clock — Sacred Bean runs
    // mornings inside Cavelier, which is closed until afternoon.
    shares_space_with: z.string().optional(),
    district: z.enum(values(DISTRICTS)).default('downtown'),
    address: z.string().optional(),
    coords: z.tuple([z.number(), z.number()]).optional(),
    indoor: z.boolean().default(true),

    // When the place is usable at all — distinct from when you've visited.
    // A lakefront bench isn't *available* in January.
    seasons: z
      .array(z.enum(values(SEASONS)))
      .default(['winter', 'spring', 'summer', 'fall']),

    cost: z.enum(values(COSTS)).default('purchase-expected'),

    // What you can buy. Availability only — whether it's any good belongs in prose.
    serves: z.array(z.enum(values(SERVES))).default([]),

    hours: z.object(hoursShape),

    // Provenance matters as much as the value. Never render a guess in the
    // same typeface as a fact.
    hours_checked: DATE,
    hours_source: z.enum(values(HOURS_SOURCES)).default('third-party'),
    hours_url: z.string().url().optional(),

    // Ephemeral, best-effort, never promised complete. "degraded" matters more
    // than "closed" here — open but unworkable is worse, because you drove there.
    exceptions: z
      .array(
        z.object({
          date: DATE,
          status: z.enum(values(EXCEPTION_STATUS)),
          reason: z.string(),
        }),
      )
      .default([]),

    calls_ok: z.enum(values(CALLS_OK)).default('unknown'),

    zones: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          notes: z.string().optional(),
        }),
      )
      .default([]),

    // --- the rubric ------------------------------------------------------
    // Lives on the VENUE, not the visit.
    //
    // Almost everything it measures — outlets, seating, room noise, whether you
    // can take a call — is a property of the place, not of one session. Scoring
    // per visit made every entry expensive, and expensive entries don't get
    // written. Venues get touched rarely, which is exactly where the effort
    // belongs.
    //
    // Score against the anchors on /rubric. Every dimension optional; profiles
    // refuse to compute below 70% coverage.
    scores: z
      .object({
        // Quality — 1 is bad, 5 is good.
        wifi: z.number().min(1).max(5).optional(),
        power: z.number().min(1).max(5).optional(),
        seat: z.number().min(1).max(5).optional(),
        welcome: z.number().min(1).max(5).optional(),
        calls: z.number().min(1).max(5).optional(),
        // Continua — −2 and +2 are both legitimate, just different days.
        // sound: −2 hushed … +2 lively
        // pace:  −2 lingering … +2 brisk
        sound: z.number().int().min(-2).max(2).optional(),
        pace: z.number().int().min(-2).max(2).optional(),
      })
      .optional(),
    scores_updated: DATE.optional(),

    // Stamped so that if the anchors are ever rewritten, old scores stay
    // comparable to each other rather than being silently mixed with new ones.
    rubric_version: z.number().int().default(2),

    url: z.string().url().optional(),
    phone: z.string().optional(),
  }),
});

const visits = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/visits' }),
  schema: z.object({
    // --- the only required fields, by design ---------------------------
    // Every additional required field is a tax on going out. An entry typed
    // one-handed at the table is worth more than a complete one written never.
    date: DATE,
    venue: reference('venues'),

    // --- everything below is optional; absent renders blank, not zero ---
    arrived: TIME.optional(),
    left: TIME.optional(),
    zone: z.string().optional(),

    wifi: z.enum(values(WIFI)).optional(),
    outlets: z.enum(values(OUTLETS)).optional(),
    noise: z.number().int().min(1).max(5).optional(),
    laptops: z.number().int().min(0).optional(),
    light: z.enum(values(LIGHT)).optional(),
    temp: z.enum(values(TEMP)).optional(),
    weather: z.string().optional(),

    verdict: z.string().optional(),
    photo: z.string().optional(),
  }),
});

export const collections = { venues, visits };
