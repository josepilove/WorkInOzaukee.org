/**
 * The controlled vocabulary. Single source of truth.
 *
 * Every enum in the site is defined here once, with a human hint. The zod
 * schemas in content.config.ts are built from these lists, and the cheat sheets
 * at src/content/*_vocabulary.md are GENERATED from them (`npm run vocab`).
 *
 * That's the point: a hand-written reference drifts from the schema within a
 * couple of edits and then quietly lies to you. This one can't.
 *
 * Keep the lists short. Every extra option is a thing to forget, and you add
 * venues rarely enough that recall is the binding constraint.
 */

export interface Term {
  value: string;
  hint: string;
}

export interface Vocab {
  field: string;
  applies: 'venue' | 'visit';
  required: boolean;
  about: string;
  terms: readonly Term[];
}

// --- venue fields ----------------------------------------------------------

export const VENUE_TYPES = [
  { value: 'cafe', hint: 'Coffee shop. Buying something is expected.' },
  { value: 'library', hint: 'Public library.' },
  { value: 'coworking', hint: 'Purpose-built workspace, paid or membership.' },
  { value: 'hotel-lobby', hint: 'Lobby seating. Usually open to anyone who looks like a guest.' },
  { value: 'bar', hint: 'Wine bar, cocktail bar, tavern. Afternoon hours matter here.' },
  { value: 'brewery', hint: 'Taproom. Dead mid-afternoon, which is the opportunity.' },
  { value: 'restaurant', hint: 'Sit-down food. Off-peak only.' },
  { value: 'outdoor', hint: 'Park, pavilion, beach, bench. Seasonal by definition.' },
  { value: 'civic', hint: 'Municipal building, community center, museum.' },
  { value: 'other', hint: "Doesn't fit. Say why in the body." },
] as const;

export const DISTRICTS = [
  { value: 'downtown', hint: 'Franklin St and the blocks around it.' },
  { value: 'marina', hint: 'Harbor and Old Theater Square side.' },
  { value: 'lakefront', hint: 'On the lake — the parks up on the bluff, the beach.' },
  { value: 'north-side', hint: 'North of downtown.' },
  { value: 'south-side', hint: 'South of downtown, incl. S Spring St.' },
  { value: 'west-side', hint: 'West of downtown, incl. W Grand Ave.' },
  { value: 'outskirts', hint: 'Edge of town or just outside it. Driving required.' },
] as const;

export const COSTS = [
  { value: 'free', hint: 'Walk in, sit down, buy nothing.' },
  { value: 'purchase-expected', hint: "Nobody stops you, but you'd feel like a jerk. Budget a drink every couple of hours." },
  { value: 'membership', hint: 'Requires signing up.' },
  { value: 'paid', hint: 'Per-day or per-hour charge.' },
] as const;

/**
 * What you can buy. Matters for a long session — whether you can stay through
 * lunch without packing up is a real question, and nobody publishes it.
 *
 * Availability only. Whether the coffee is any good is a judgment, and belongs
 * in the prose where it can be said properly.
 */
export const SERVES = [
  { value: 'coffee', hint: 'Espresso drinks, drip, the usual.' },
  { value: 'other-drinks', hint: 'Tea, smoothies, soda — something for people who are done with coffee.' },
  { value: 'meals', hint: 'Real food you could call lunch.' },
  { value: 'snacks', hint: 'Pastries, bakery, something to pick at.' },
  { value: 'alcohol', hint: 'Beer, wine, cocktails.' },
] as const;

/**
 * Parking, from the point of view of someone about to sit for three hours.
 * The question isn't "is there parking," it's "will I find a spot and can I
 * leave the car there."
 */
export const PARKING = [
  { value: 'lot', hint: 'Its own lot. Park and forget about it.' },
  { value: 'street-easy', hint: 'On-street, and there is usually a spot out front.' },
  { value: 'street-tight', hint: 'On-street, expect to circle — worse in summer and on weekends.' },
  { value: 'ramp', hint: 'Public ramp or municipal lot within a short walk.' },
  { value: 'none', hint: 'Nowhere practical to leave a car.' },
] as const;

/** Short reader-facing phrasing. The vocab value is for authoring, not display. */
export const PARKING_LABEL: Record<string, string> = {
  lot: 'its own lot',
  'street-easy': 'street, usually easy',
  'street-tight': 'street, can be tight',
  ramp: 'public ramp nearby',
  none: 'nowhere practical',
};

export const CALLS_OK = [
  { value: 'yes', hint: 'Take a call at your seat. Nobody cares.' },
  { value: 'quietly', hint: 'Possible if you keep your voice down or wait for a lull.' },
  { value: 'rooms', hint: 'There is a bookable room with a door. The best case.' },
  { value: 'no', hint: "You'd be that person. Step outside." },
  { value: 'unknown', hint: "Haven't worked out the etiquette here yet." },
] as const;

/**
 * Where the hours came from. This drives how much the page tells readers to
 * trust the listing, so it matters more than it looks.
 */
export const HOURS_SOURCES = [
  { value: 'owner', hint: 'They told me directly — in person, by email, or by text. The goal state.' },
  { value: 'first-person', hint: 'I read them myself: the door, a sign, or staff told me while I was there.' },
  { value: 'website', hint: 'Their own site or booking page.' },
  { value: 'third-party', hint: 'A listing site said so. Assume wrong until confirmed.' },
] as const;

export const HOURS_TRUST: Record<string, 'high' | 'medium' | 'low'> = {
  owner: 'high',
  'first-person': 'high',
  website: 'medium',
  'third-party': 'low',
};

export const SOURCE_LABEL: Record<string, string> = {
  owner: 'confirmed with the owner',
  'first-person': 'checked in person',
  website: 'from their website',
  'third-party': 'from a listing site, unconfirmed',
};

export const SEASONS = [
  { value: 'winter', hint: 'Dec–Feb.' },
  { value: 'spring', hint: 'Mar–May.' },
  { value: 'summer', hint: 'Jun–Aug.' },
  { value: 'fall', hint: 'Sep–Nov.' },
] as const;

export const EXCEPTION_STATUS = [
  { value: 'closed', hint: 'Shut when it normally would not be.' },
  { value: 'degraded', hint: 'Open but unworkable — live music, private event, wifi down. Worse than closed, because you drove there.' },
  { value: 'extended', hint: 'Open later or earlier than usual.' },
] as const;

// --- visit fields ----------------------------------------------------------

export const WIFI = [
  { value: 'good', hint: 'Held up. No thinking required.' },
  { value: 'ok', hint: 'Fine for mail and docs. A call would be a gamble.' },
  { value: 'bad', hint: 'Dropped, throttled, or a captive portal that kept logging me out.' },
  { value: 'none', hint: 'No wifi. Tether or leave.' },
] as const;

export const OUTLETS = [
  { value: 'at-seat', hint: 'Plug in where you sat.' },
  { value: 'nearby', hint: 'Had to pick a seat around them, or ran a cord.' },
  { value: 'none', hint: 'Battery only.' },
] as const;

export const LIGHT = [
  { value: 'good', hint: 'Enough to read by, no glare on the screen.' },
  { value: 'dim', hint: 'Fine for a bar, hard for a spreadsheet.' },
  { value: 'glare', hint: 'Sun straight onto the screen. Depends on time of day — say which.' },
] as const;

export const TEMP = [
  { value: 'cold', hint: 'Drafty, or the door kept opening. Real problem Nov–Mar.' },
  { value: 'fine', hint: 'Never thought about it.' },
  { value: 'warm', hint: 'Stuffy or in direct sun.' },
] as const;

// --- everything, for the generator ----------------------------------------

export const VOCAB: Vocab[] = [
  { field: 'type', applies: 'venue', required: true, about: 'What kind of place this is.', terms: VENUE_TYPES },
  { field: 'district', applies: 'venue', required: false, about: 'Roughly where in town. Groups the Places page.', terms: DISTRICTS },
  { field: 'cost', applies: 'venue', required: false, about: 'What it costs to sit there.', terms: COSTS },
  { field: 'serves', applies: 'venue', required: false, about: 'What you can buy. A list. Leave empty if nothing.', terms: SERVES },
  { field: 'parking', applies: 'venue', required: false, about: 'Whether you will find a spot and can leave the car for a few hours.', terms: PARKING },
  { field: 'calls_ok', applies: 'venue', required: false, about: 'Whether you can take a call.', terms: CALLS_OK },
  { field: 'hours_source', applies: 'venue', required: false, about: 'Where the hours came from. Drives how much readers are told to trust them.', terms: HOURS_SOURCES },
  { field: 'seasons', applies: 'venue', required: false, about: 'When the place is usable at all. A list. Outdoor spots are not year-round.', terms: SEASONS },
  { field: 'exceptions[].status', applies: 'venue', required: false, about: 'One-off deviations from the normal hours.', terms: EXCEPTION_STATUS },
  { field: 'wifi', applies: 'visit', required: false, about: 'Observed connection quality.', terms: WIFI },
  { field: 'outlets', applies: 'visit', required: false, about: 'Observed power access.', terms: OUTLETS },
  { field: 'light', applies: 'visit', required: false, about: 'Observed light.', terms: LIGHT },
  { field: 'temp', applies: 'visit', required: false, about: 'Observed temperature.', terms: TEMP },
];

/** Pull the bare values for a zod enum. */
export function values<T extends readonly Term[]>(terms: T): [string, ...string[]] {
  return terms.map((t) => t.value) as [string, ...string[]];
}
