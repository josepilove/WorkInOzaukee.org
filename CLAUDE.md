# WorkInOzaukee.org — working notes for Claude

A guide to where you can actually get work done in Port Washington, Wisconsin.
Astro, static, one dependency. Thinking and strategy live in [`notes/`](./notes).

## What this project is really for

Two audiences, and they pull in different directions:

1. **Readers** want to know where to work and whether it's open. Public pages serve
   only this.
2. **Joe** wants a reason to leave the house. The site is a forcing function — gaps in
   coverage are prompts to go somewhere new.

Those goals conflict on the page. A public homepage full of "untested" labels reads as
an unfinished notebook. So the bookkeeping lives at `/todo`, which is `noindex`,
disallowed in `robots.txt`, and linked from nowhere.

**Never put coverage gaps, re-check queues, or chore language on a public page.**
On the public side a gap is an invitation ("been here on a Monday? tell me"). On `/todo`
it's an assignment.

## The constraint that governs everything

The cost of writing an entry must stay near zero, or the habit dies and the site dies
with it. This has already gone wrong once: a rubric, a controlled vocabulary and two
template files turned logging a visit into a chore, and Joe correctly said he'd never
do it.

Before adding any field, ask whether it makes an entry more expensive to write. If it
does, it probably belongs on the venue (touched rarely) rather than the visit.

**Logging a visit happens by conversation, not by editing YAML.** The `log-visit` skill
parses a brain dump and writes the file.

## Architecture

Two content collections with different lifespans:

| | `venues` | `visits` |
|---|---|---|
| Lifespan | mutable, needs re-verification | immutable once written |
| Holds | hours, address, zones, **rubric scores** | date, conditions, prose |
| Required | name, type, hours (7 days), hours_checked | date, venue |

Putting hours on a visit gives you N conflicting copies. Putting "it was loud today" on
a venue overwrites a fact with a mood.

Visits are **never revised**. If a place changes, that's a new visit.

The homepage grid derives three states per venue × day: closed (venue hours), tested (a
visit exists on that weekday), untested. The difference between open and tested is the
to-do list — computed, never maintained.

Day of week, season, time-of-day, and duration are **derived** from `date` and
`arrived`. Never add fields for them.

## Non-obvious things that will bite you

- **YAML parses unquoted dates into UTC-midnight `Date` objects**, which is the previous
  day in US timezones — the whole grid shifts by one. `content.config.ts` normalizes to
  a string; `parseLocalDate()` in `src/lib/hours.ts` builds local Dates. Never use
  `new Date(dateString)` on a date field.
- **Astro caches collections** in `node_modules/.astro/data-store.json`. Delete a content
  file and its page can keep rebuilding from cache. Fix:
  `rm -rf node_modules/.astro dist && npm run build`.
- **"Open right now" must be client-side.** A static build can't know when someone looks.
- The vocabulary is defined once in `src/lib/vocab.ts`. Zod schemas and the
  `_vocabulary.md` cheat sheets are both generated from it — run `npm run vocab` after
  changing it. Never hand-edit a `_vocabulary.md`.
- Files starting with `_` are skipped by the content loader. That's how templates and
  cheat sheets live in the content folders.

## Provenance is the whole product

Hours are the only data here that genuinely rots, so every listing shows where it came
from and when it was last confirmed. `hours_source` is `owner` | `first-person` |
`website` | `third-party`, and it drives the trust badge.

**Never render a guess in the same typeface as a fact.** Never inflate a source. Honest
staleness beats false confidence — that's the only reason to trust this over a stale
Google result.

Data is **never scraped**, especially not from Facebook. See
[`notes/data-sources.md`](./notes/data-sources.md); the approach is to automate
*detection* of changes and verify by hand.

## Editorial voice

First person, opinionated, specific. The moat is that every entry is somewhere Joe has
actually sat — details like which corner has outlets and what happens at 3pm are the
whole point.

When writing up a visit from his description, **keep his phrasing**. Tighten grammar,
cut filler, don't turn it into marketing copy. "The back corner is the only good spot
once the sun moves" should not become "the rear seating area offers optimal afternoon
conditions."

Never add a venue he hasn't been to.

## Commands

```bash
npm run dev      # localhost:4321
npm run build    # → dist/
npm run vocab    # regenerate _vocabulary.md files (needs Node 22.18+)
./deploy.sh      # build + lftp mirror dist/ to Dreamhost
./deploy.sh --dry
```

## Deployment

Runs from Joe's Mac, which holds both SSH keys (GitHub and Dreamhost). There is no CI —
deliberately, so there's no third-party credential to manage.

- `./deploy.sh` publishes the site. **It mirrors `dist/`, never the repo root** — unlike
  his other sites, this one has a build step, and mirroring `./` would publish `src/`,
  `node_modules` and the source of the private `/todo` while missing the actual HTML.
- The script refuses to run if `dist/index.html` is missing, because `--delete` against
  an empty build would wipe the live site.
- `git push` is backup and history, not a deploy trigger. Remote is
  `git@github.com:josepilove/WorkInOzaukee.org.git` on `main`.

If a shell can't reach Dreamhost or GitHub, it's a sandbox without his keys — commit and
say what's pending rather than retrying. The work waits for him; nothing is lost.

## Current state

Port Washington only. Five venues, most with placeholder hours that need first-hand
confirmation — see the checklist at the end of `README.md`. Scoring is on venues, not
visits. `/todo` shows what to do next.
