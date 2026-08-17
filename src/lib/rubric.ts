/**
 * The rubric.
 *
 * Consistency doesn't come from the numbers, it comes from the anchors. A bare
 * 1–5 drifts within a month — today's 4 is next spring's 3 and there's no way to
 * tell which. So every level here has words attached, and you score by finding
 * the sentence that matches rather than by picking a number that feels right.
 *
 * Anchors are written at 1, 3 and 5. Use 2 and 4 for "between these two."
 *
 * These are JUDGMENTS. They live alongside — not instead of — the raw
 * observations on a visit (noise level, laptop count, weather), which are facts
 * and don't need a rubric. Same split as venues vs. visits: record what was
 * there, then say what you thought of it.
 */

export const RUBRIC_VERSION = 1;

export type Dimension = 'wifi' | 'power' | 'seat' | 'sound' | 'welcome' | 'calls';

export interface DimensionDef {
  key: Dimension;
  label: string;
  question: string;
  anchors: { 1: string; 3: string; 5: string };
}

export const DIMENSIONS: DimensionDef[] = [
  {
    key: 'wifi',
    label: 'Wifi',
    question: 'Did the connection hold up?',
    anchors: {
      1: 'None, or it dropped constantly. Tether or leave.',
      3: 'Fine for mail and documents. A video call would be a gamble.',
      5: 'Held a video call without thinking about it.',
    },
  },
  {
    key: 'power',
    label: 'Power',
    question: 'Could you plug in where you wanted to sit?',
    anchors: {
      1: 'No outlet you could reach. Whatever your battery holds is the session.',
      3: 'Outlets exist, but you chose your seat around them or ran a cord.',
      5: 'Power at most seats. Sit wherever you like.',
    },
  },
  {
    key: 'seat',
    label: 'Seat',
    question: 'Could you work there for three hours?',
    anchors: {
      1: 'Stool, wobbly table, or nowhere to put a laptop and a cup at once.',
      3: 'Fine for an hour. Sore by the second.',
      5: 'Table at the right height, chair with a back, room for laptop, notebook and coffee.',
    },
  },
  {
    key: 'sound',
    label: 'Sound',
    question: 'Could you think?',
    anchors: {
      1: 'Unworkable. Music too loud to hold a thought, or a grinder every ninety seconds.',
      3: 'Steady background hum. Headphones solve it.',
      5: 'Quiet enough to work without headphones, not so quiet you feel watched.',
    },
  },
  {
    key: 'welcome',
    label: 'Welcome',
    question: 'Could you stay without feeling like a problem?',
    anchors: {
      1: "Clear you're overstaying — signs, glances, or laptops discouraged at peak.",
      3: 'Nobody minds a couple of hours as long as you keep ordering.',
      5: 'Laptops are normal here. Stay all morning, nobody notices.',
    },
  },
  {
    key: 'calls',
    label: 'Calls',
    question: 'Could you take one?',
    anchors: {
      1: "No. You'd be that person.",
      3: 'Possible if you step outside or wait for a lull.',
      5: 'Take it at your seat, or there’s a room or corner made for it.',
    },
  },
];

export const DIMENSION_BY_KEY = Object.fromEntries(
  DIMENSIONS.map((d) => [d.key, d]),
) as Record<Dimension, DimensionDef>;

export type Scores = Partial<Record<Dimension, number>>;

/**
 * One number can't answer "is this place good," because the honest answer is
 * "for what?" A wine bar that's hopeless for a video call may be the best room
 * in town for three hours of writing. So the same six scores get read three
 * ways rather than averaged into a star rating that hides the tradeoff.
 */
export interface Profile {
  key: string;
  label: string;
  blurb: string;
  weights: Partial<Record<Dimension, number>>;
}

export const PROFILES: Profile[] = [
  {
    key: 'deep',
    label: 'Deep work',
    blurb: 'A long stretch of focus. Somewhere to sit, quiet, and power.',
    weights: { sound: 0.3, seat: 0.25, power: 0.2, wifi: 0.15, welcome: 0.1 },
  },
  {
    key: 'calls',
    label: 'Calls & meetings',
    blurb: 'A day of talking to people. Needs bandwidth and somewhere to talk.',
    weights: { calls: 0.4, sound: 0.25, wifi: 0.25, welcome: 0.1 },
  },
  {
    key: 'quick',
    label: 'Quick session',
    blurb: 'An hour between things. Sit down, get online, get out.',
    weights: { wifi: 0.3, welcome: 0.25, seat: 0.2, power: 0.15, sound: 0.1 },
  },
];

/**
 * Weighted mean over whatever dimensions were actually scored, with the weights
 * renormalized to what's present.
 *
 * The coverage floor is the important part: if fewer than 70% of a profile's
 * weight was scored, return null instead of a number. A "Deep work: 4.6" built
 * from one dimension is worse than no score at all, because it looks like the
 * real thing.
 */
export const COVERAGE_FLOOR = 0.7;

export function profileScore(scores: Scores, profile: Profile): number | null {
  let weighted = 0;
  let present = 0;
  for (const [dim, weight] of Object.entries(profile.weights) as [Dimension, number][]) {
    const v = scores[dim];
    if (typeof v === 'number') {
      weighted += v * weight;
      present += weight;
    }
  }
  if (present < COVERAGE_FLOOR) return null;
  return weighted / present;
}

export function hasAnyScore(scores: Scores | undefined): boolean {
  if (!scores) return false;
  return DIMENSIONS.some((d) => typeof scores[d.key] === 'number');
}

/** Average each dimension across visits, so a venue reads as its typical self. */
export function averageScores(all: (Scores | undefined)[]): {
  scores: Scores;
  counts: Partial<Record<Dimension, number>>;
} {
  const scores: Scores = {};
  const counts: Partial<Record<Dimension, number>> = {};
  for (const dim of DIMENSIONS.map((d) => d.key)) {
    const vals = all
      .map((s) => s?.[dim])
      .filter((v): v is number => typeof v === 'number');
    if (vals.length) {
      scores[dim] = vals.reduce((a, b) => a + b, 0) / vals.length;
      counts[dim] = vals.length;
    }
  }
  return { scores, counts };
}

export function formatScore(n: number): string {
  return n.toFixed(1).replace(/\.0$/, '');
}

/** Plain-language read of a profile score, so the number isn't doing all the work. */
export function verdictFor(n: number): string {
  if (n >= 4.5) return 'as good as it gets here';
  if (n >= 3.75) return 'reliably good';
  if (n >= 3) return 'workable';
  if (n >= 2) return 'only if you have to';
  return 'no';
}
