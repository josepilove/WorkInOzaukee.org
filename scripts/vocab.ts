/**
 * Generates the vocabulary cheat sheets that sit next to the content files.
 *
 *   npm run vocab
 *
 * Writes src/content/venues/_vocabulary.md and src/content/visits/_vocabulary.md
 * from src/lib/vocab.ts and src/lib/rubric.ts. Both start with "_" so the Astro
 * loader skips them — they're for you, in the folder, at the moment you're
 * writing an entry.
 *
 * Generated rather than hand-written on purpose: a reference doc you maintain by
 * hand drifts from the schema in about two edits and then quietly lies to you.
 */

import { writeFileSync } from 'node:fs';
import { VOCAB, HOURS_TRUST, SOURCE_LABEL, type Vocab } from '../src/lib/vocab.ts';
import { DIMENSIONS, PROFILES, RUBRIC_VERSION } from '../src/lib/rubric.ts';

const HEADER = (kind: string) => `<!--
  GENERATED FILE — do not edit by hand.
  Run \`npm run vocab\` after changing src/lib/vocab.ts.
  Ignored by the content loader (leading underscore).
-->

# ${kind} vocabulary

Every allowed value, in the folder where you need it. If a value isn't listed
here, the build will reject it — that's deliberate.
`;

function renderField(v: Vocab): string {
  const rows = v.terms
    .map((t) => `| \`${t.value}\` | ${t.hint} |`)
    .join('\n');
  return `
## \`${v.field}\`${v.required ? ' *(required)*' : ''}

${v.about}

| value | when to use it |
| --- | --- |
${rows}
`;
}

// --- the rubric (venue-level) ---------------------------------------------

const rubricDoc = `
## The rubric

Six dimensions, \`1\`–\`5\`, all optional, under a \`scores:\` block on the **venue**.

Scored once per place, not per visit — outlets, seating, room noise and call
etiquette are properties of the room, not of a Tuesday. Score against these
sentences rather than by feel; that's what keeps a 4 in November meaning what a
4 in March meant. Anchors are written at 1, 3 and 5; use 2 and 4 for "between
these two."

${DIMENSIONS.map(
  (d) => `### \`${d.key}\` — ${d.question}

| | |
| --- | --- |
| **1** | ${d.anchors[1]} |
| **3** | ${d.anchors[3]} |
| **5** | ${d.anchors[5]} |
`,
).join('\n')}
### How they combine

${PROFILES.map(
  (p) =>
    `- **${p.label}** — ${p.blurb}\n  ${Object.entries(p.weights)
      .map(([d, w]) => `${d} ${Math.round((w as number) * 100)}%`)
      .join(', ')}`,
).join('\n')}

Skip anything you haven't tested. A profile refuses to compute below 70% coverage
and prints "not enough scored to say" instead — leaving a dimension out is
always safer than guessing at it.

Set \`scores_updated\` when you re-score. Current rubric version: **${RUBRIC_VERSION}**.
`;

// --- venues ---------------------------------------------------------------

const venueFields = VOCAB.filter((v) => v.applies === 'venue');

const trustNote = `
### How \`hours_source\` is displayed

| value | shown to readers as | trust |
| --- | --- | --- |
${Object.keys(SOURCE_LABEL)
  .map((k) => `| \`${k}\` | "${SOURCE_LABEL[k]}" | ${HOURS_TRUST[k]} |`)
  .join('\n')}

Low-trust sources render with a "?" badge. Bump this to \`first-person\` or
\`owner\` the moment you confirm, and update \`hours_checked\` with it.
`;

const venueDoc = `${HEADER('Venue')}
## Required every time

\`name\`, \`type\`, \`hours\` (all seven days — use \`null\` for closed, so that
"closed" is always a deliberate statement rather than a forgotten field), and
\`hours_checked\`.

Everything else has a sensible default.
${venueFields.map(renderField).join('')}${trustNote}${rubricDoc}
## Fields with no fixed vocabulary

| field | notes |
| --- | --- |
| \`address\` | Free text. |
| \`coords\` | \`[lat, lng]\`. Optional, unused so far. |
| \`indoor\` | \`true\` / \`false\`. Drives the Wisconsin-January question. |
| \`hours_url\` | Where you'd go to re-check. Must be a full URL. |
| \`shares_space_with\` | Slug of another venue at the same address. |
| \`zones\` | List of \`{ id, name, notes }\`. \`id\` is what a visit's \`zone\` refers to. |
| \`url\`, \`phone\` | Free text. Phone shows on /todo so you can call to re-check. |
`;

// --- visits ---------------------------------------------------------------

const visitFields = VOCAB.filter((v) => v.applies === 'visit');

const visitDoc = `${HEADER('Visit')}
> You shouldn't need this. Say **"log a visit"** to Claude and describe the
> session however it comes out — the skill parses it and writes the file.
> This is the reference for the rare time you do it by hand.

## Required every time

Just \`date\` and \`venue\`. That's the whole obligation — every extra required
field is a tax on going out, and an entry typed one-handed at the table beats a
complete one written never.

\`venue\` must match a filename in \`../venues/\` without the \`.md\`.

The scoring rubric is **not** here — it lives on the venue, scored once per
place. See \`../venues/_vocabulary.md\`.

## Observations (facts)

These record what was there. They are not judgments and don't need the rubric.
${visitFields.map(renderField).join('')}
| field | notes |
| --- | --- |
| \`arrived\`, \`left\` | \`"HH:MM"\` 24-hour, quoted. Derives duration and time-of-day. |
| \`noise\` | \`1\` silent … \`5\` loud. A measurement, not a score — loud isn't always bad. |
| \`laptops\` | How many others were working. The "am I welcome here" signal. |
| \`weather\` | Free text, e.g. \`"68F, overcast"\`. Matters most for outdoor venues. |
| \`zone\` | Must match a \`zones[].id\` on the venue. |
| \`verdict\` | One line. This is what shows in the log. |

## Never entered by hand

Day of week, season, time-of-day bucket, and duration are all derived from
\`date\` and \`arrived\`. Don't add fields for them.
`;

writeFileSync(new URL('../src/content/venues/_vocabulary.md', import.meta.url), venueDoc);
writeFileSync(new URL('../src/content/visits/_vocabulary.md', import.meta.url), visitDoc);

console.log('Wrote src/content/venues/_vocabulary.md');
console.log('Wrote src/content/visits/_vocabulary.md');
