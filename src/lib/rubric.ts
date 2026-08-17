/**
 * The scoring model.
 *
 * Two kinds of dimension, because "is this place good?" has two kinds of answer.
 *
 *   QUALITY (1–5, higher is better)
 *     Things where one end is simply worse. Nobody prefers unreliable wifi or a
 *     table that wobbles. A plain scale is the honest shape.
 *
 *   CONTINUUM (−2…+2, between two legitimate poles)
 *     Things where both ends are somebody's ideal. A hushed room and a lively
 *     one are not better and worse, they're different days. Scoring these 1–5
 *     was meaningless — "sound: 4" told you nothing about which direction.
 *
 * Consistency comes from the anchors either way. You score by finding the
 * sentence that matches, not by picking a number that feels right.
 *
 * Because continua have no "good" end, a profile can't just weight-and-average
 * them. Each profile carries a TARGET, and fit is distance from that target.
 * Deep work wants hushed; Company wants lively; same number, opposite reading.
 */

export const RUBRIC_VERSION = 2;

export type QualityKey = 'wifi' | 'power' | 'seat' | 'welcome' | 'calls';
export type ContinuumKey = 'sound' | 'pace';
export type Dimension = QualityKey | ContinuumKey;

export interface QualityDef {
  kind: 'quality';
  key: QualityKey;
  label: string;
  question: string;
  anchors: { 1: string; 3: string; 5: string };
}

export interface ContinuumDef {
  kind: 'continuum';
  key: ContinuumKey;
  label: string;
  question: string;
  low: string; // the −2 pole
  high: string; // the +2 pole
  anchors: { '-2': string; '0': string; '2': string };
}

export type DimensionDef = QualityDef | ContinuumDef;

export const QUALITIES: QualityDef[] = [
  {
    kind: 'quality',
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
    kind: 'quality',
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
    kind: 'quality',
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
    kind: 'quality',
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
    kind: 'quality',
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

export const CONTINUA: ContinuumDef[] = [
  {
    kind: 'continuum',
    key: 'sound',
    label: 'Sound',
    question: 'What does the room sound like?',
    low: 'Hushed',
    high: 'Lively',
    anchors: {
      '-2': 'Library quiet. You can hear your own typing, and so can everyone else.',
      '0': 'Steady background — some conversation, music you stop noticing.',
      '2': 'Full of people talking. Energising if you want company, hopeless if you need to think.',
    },
  },
  {
    kind: 'continuum',
    key: 'pace',
    label: 'Pace',
    question: 'How fast does the room turn over?',
    low: 'Lingering',
    high: 'Brisk',
    anchors: {
      '-2': 'People settle in for hours. Nothing about the room hurries you.',
      '0': 'Ordinary churn. Nobody is watching the clock but nobody is camped either.',
      '2': 'Constant in-and-out, queue at the counter, tables turning. Fine for an hour, tiring for four.',
    },
  },
];

export const DIMENSIONS: DimensionDef[] = [...QUALITIES, ...CONTINUA];

export const DIMENSION_BY_KEY = Object.fromEntries(
  DIMENSIONS.map((d) => [d.key, d]),
) as Record<Dimension, DimensionDef>;

export type Scores = Partial<Record<Dimension, number>>;

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------

export interface Profile {
  key: string;
  label: string;
  blurb: string;
  /** Quality dimensions: plain weights. Higher score is better. */
  qualities: Partial<Record<QualityKey, number>>;
  /** Continua: where this profile WANTS to land, and how much it cares. */
  targets: Partial<Record<ContinuumKey, { target: number; weight: number }>>;
}

export const PROFILES: Profile[] = [
  {
    key: 'deep',
    label: 'Deep work',
    blurb: 'A long stretch of focus. Quiet, somewhere to settle, and power.',
    qualities: { seat: 0.2, power: 0.15, wifi: 0.15 },
    targets: { sound: { target: -2, weight: 0.3 }, pace: { target: -2, weight: 0.2 } },
  },
  {
    key: 'calls',
    label: 'Calls & meetings',
    blurb: 'A day of talking to people. Needs bandwidth and somewhere to talk.',
    qualities: { calls: 0.4, wifi: 0.3 },
    targets: { sound: { target: -1, weight: 0.2 }, pace: { target: 0, weight: 0.1 } },
  },
  {
    key: 'quick',
    label: 'Quick session',
    blurb: 'An hour between things. Sit down, get online, get out.',
    qualities: { wifi: 0.35, welcome: 0.25, seat: 0.15 },
    targets: { pace: { target: 1, weight: 0.15 }, sound: { target: 0, weight: 0.1 } },
  },
  {
    key: 'company',
    label: 'Company',
    blurb: "Working alone is fine; working near people is better. You want a room with something going on.",
    qualities: { welcome: 0.3, seat: 0.15, wifi: 0.1 },
    targets: { sound: { target: 2, weight: 0.3 }, pace: { target: 0, weight: 0.15 } },
  },
];

// ---------------------------------------------------------------------------
// Fit
// ---------------------------------------------------------------------------

/**
 * Everything normalizes to 0–1 before it's combined.
 *
 *   quality:   (v − 1) / 4          → 1 is 0.0, 5 is 1.0
 *   continuum: 1 − |v − target| / 4 → on target is 1.0, opposite pole is 0.0
 *
 * Weights are renormalized to whatever was actually scored, and below the
 * coverage floor we return null rather than a number. A confident-looking 4.6
 * assembled from one answer is worse than admitting the place wasn't checked.
 */
export const COVERAGE_FLOOR = 0.7;

export function profileScore(scores: Scores, profile: Profile): number | null {
  let weighted = 0;
  let present = 0;

  for (const [key, weight] of Object.entries(profile.qualities) as [QualityKey, number][]) {
    const v = scores[key];
    if (typeof v === 'number') {
      weighted += ((v - 1) / 4) * weight;
      present += weight;
    }
  }

  for (const [key, spec] of Object.entries(profile.targets) as [
    ContinuumKey,
    { target: number; weight: number },
  ][]) {
    const v = scores[key];
    if (typeof v === 'number') {
      weighted += (1 - Math.abs(v - spec.target) / 4) * spec.weight;
      present += spec.weight;
    }
  }

  if (present < COVERAGE_FLOOR) return null;
  // Present on a familiar 1–5 scale.
  return (weighted / present) * 4 + 1;
}

export function hasAnyScore(scores: Scores | undefined): boolean {
  if (!scores) return false;
  return DIMENSIONS.some((d) => typeof scores[d.key] === 'number');
}

export function formatScore(n: number): string {
  return n.toFixed(1).replace(/\.0$/, '');
}

export function verdictFor(n: number): string {
  if (n >= 4.5) return 'as good as it gets here';
  if (n >= 3.75) return 'reliably good';
  if (n >= 3) return 'workable';
  if (n >= 2) return 'only if you have to';
  return 'no';
}

/** Where a value sits on a continuum, in words. Never "3 out of 5". */
export function continuumLabel(def: ContinuumDef, v: number): string {
  if (v <= -2) return def.low.toLowerCase();
  if (v === -1) return `leans ${def.low.toLowerCase()}`;
  if (v === 0) return 'in between';
  if (v === 1) return `leans ${def.high.toLowerCase()}`;
  return def.high.toLowerCase();
}

/** 0–100, for a bar. −2 sits at the left pole, +2 at the right. */
export function continuumPercent(v: number): number {
  return ((v + 2) / 4) * 100;
}

/** The profile a place suits best — the useful one-line answer. */
export function bestProfile(scores: Scores): { profile: Profile; score: number } | null {
  let best: { profile: Profile; score: number } | null = null;
  for (const p of PROFILES) {
    const s = profileScore(scores, p);
    if (s !== null && (best === null || s > best.score)) best = { profile: p, score: s };
  }
  return best;
}
