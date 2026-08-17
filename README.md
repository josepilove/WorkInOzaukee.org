# WorkInOzaukee.org

A working guide to where you can actually get something done in Port Washington,
Wisconsin. Astro, static, one dependency.

Thinking behind it lives in [`notes/`](./notes) — strategy, content model, and how to
aggregate venue data without scraping Facebook.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
```

## Adding a visit

**Say "log a visit" to Claude and describe the session however it comes out.** The
`log-visit` skill parses the brain dump, maps it onto the vocabulary, writes the file,
and runs the build. You shouldn't have to see YAML.

The skill reads `_vocabulary.md` from the content folders rather than carrying its own
copy of the allowed values, so it can't drift from the schema. It's also told to keep
your phrasing in the body — the prose is the product, and sanding it into marketing copy
would defeat the point.

It handles new venues too, including walking the rubric conversationally.

### By hand, if you must

The whole point is that this takes two minutes at the table. Copy
`src/content/visits/_template.md` to `src/content/visits/YYYY-MM-DD-venue-slug.md`
and fill in as much or as little as you feel like:

```yaml
---
date: 2026-08-24
venue: niederkorn-library
---

Quiet room was empty at 9. Outlets under every table along the north wall.
```

**Only `date` and `venue` are required.** Everything else is optional and renders blank
when absent. Files starting with `_` are ignored by the loader, so the template can live
in the folder without showing up on the site.

Visits are never edited after publishing. If a place changes, that's a new visit.

## The controlled vocabulary

You add venues rarely, so recall is the binding constraint. The vocabulary is defined
once in [`src/lib/vocab.ts`](src/lib/vocab.ts) and reaches you in four places, in
descending order of how little you have to remember:

1. **`_template.md`** in each content folder — copy it; allowed values sit in a comment
   on the line you're filling in.
2. **`_vocabulary.md`** in each content folder — the full cheat sheet, right next to the
   files, with a "when to use it" hint for every term. **Generated** by `npm run vocab`,
   never hand-edited, so it cannot drift from the schema.
3. **Editor autocomplete** — templates carry a `yaml-language-server: $schema` pointer to
   the JSON Schema Astro generates at `.astro/collections/*.schema.json`. Works in editors
   whose YAML support extends to Markdown frontmatter; if yours doesn't, items 1, 2 and 4
   still have you covered.
4. **The build error** — a wrong value prints the full allowed list:

   ```
   district: Invalid enum value.
   Expected 'downtown' | 'marina' | 'lakefront' | 'north-side' |
            'south-side' | 'west-side' | 'outskirts', received 'southside'
   ```

Changing the vocabulary means editing `src/lib/vocab.ts` and running `npm run vocab`.
The zod schemas build themselves from the same lists, so schema, docs, and templates
can't disagree.

Keep the lists short — every extra option is a thing to forget.

## Adding a venue

Copy an existing file in `src/content/venues/`. All seven days of `hours` must be
present — `null` means closed — so that "closed" is always a deliberate statement rather
than a field someone forgot.

Two fields carry more weight than they look like they do:

- **`hours_source`** — `owner` | `website` | `posted-sign` | `observed` | `third-party`.
  Drives how much the page tells readers to trust the hours. `owner` is the goal state
  for every venue.
- **`hours_checked`** — anything older than 90 days surfaces in the re-verify queue on
  the homepage. Bump the date when you confirm.

## Two audiences, two surfaces

The public pages answer a reader's question: *where can I work, and is it open?* They
show hours, provenance, and writeups — and never mention what's missing.

`/todo` is yours. It's `noindex`, disallowed in `robots.txt`, and linked from nowhere —
bookmark it. It carries the parts that would make the site read like a private notebook:

- **Next trip** — the day with the fewest confirmed options, scarcity-ranked, plus which
  places to try
- **Coverage by day** — what's open but unwritten
- **Hours to re-check** — anything past 90 days, with phone numbers
- **Seats not yet tried** — zones you've listed but never sat in. The cheapest entries
  you can write, since you already know the place.

Same data, same build. Only the framing differs: a gap is an invitation on the public
side and an assignment on yours.

## The rubric

Six dimensions, 1–5, all optional: **wifi, power, seat, sound, welcome, calls.**

**Scored on the venue, once — not per visit.** Outlets, seating, room noise and call
etiquette are properties of the room, not of a Tuesday. Scoring every session made every
entry expensive, and expensive entries don't get written. Venues get touched rarely,
which is where the effort belongs. Visits are back down to `date` + `venue` + prose.

Consistency comes from the anchors, not the numbers — a bare 1–5 drifts within a month
and today's 4 becomes next spring's 3 with no way to tell which. So every dimension has
sentences written at 1, 3 and 5 (use 2 and 4 for "between these"), published at
[`/rubric`](src/pages/rubric.astro). You score by finding the sentence that matches.

Scores are **judgments** and live in their own `scores:` block, separate from the raw
observations (`noise`, `laptops`, `weather`) which are facts and don't need a rubric.
Same split as venues vs. visits: record what was there, then say what you thought.

### No single star rating

The honest answer to "is this place good?" is "for what?" So the same six scores get
read three ways, weighted differently:

| Profile | Weighted toward |
|---|---|
| Deep work | sound 30, seat 25, power 20, wifi 15, welcome 10 |
| Calls & meetings | calls 40, sound 25, wifi 25, welcome 10 |
| Quick session | wifi 30, welcome 25, seat 20, power 15, sound 10 |

Tested with real numbers: a wine bar scoring 4s on sound and seat but 1 on calls reads
**Deep work 3.5 "workable"** and **Calls 2.7 "only if you have to."** One number would
have hidden exactly the thing worth knowing.

If under 70% of a profile's weight was scored, it prints "not enough scored to say"
rather than a number. A confident-looking 4.6 built from one answer is worse than an
admission you didn't check.

`rubric_version` is stamped on every visit, so rewriting the anchors later won't
silently mix old scores with new ones.

## How it works

Two collections with different lifespans:

| | `venues` | `visits` |
|---|---|---|
| Lifespan | mutable, re-checked | immutable once written |
| Holds | hours, address, zones | date, conditions, verdict |

The homepage grid derives three states per venue × day: **closed** (from venue hours),
**tested** (a visit exists on that weekday), **untested** (open, unconfirmed). That last
one is the to-do list, computed rather than maintained.

Day-of-week, season, time-of-day bucket, and duration are all derived from `date` and
`arrived`. Never type them.

Schemas are enforced at build time — a malformed entry fails the build with a readable
message instead of silently rendering blank.

## Deploy

```bash
./deploy.sh --dry    # show what would transfer
./deploy.sh          # build, then lftp mirror dist/ to Dreamhost
```

Same lftp/sftp pattern as the other sites in `~/Sites`, with one critical difference:
**this one mirrors `dist/`, not `./`.** The repo is source; the site is the build output.
Mirroring the root would publish `src/`, `node_modules`, and the source of the private
`/todo` page, while missing the actual HTML. The script also refuses to run if
`dist/index.html` is missing, since `--delete` against an empty build would wipe the
live site.

No CI, on purpose — the deploy runs from the Mac that already holds both SSH keys, so
there's no third-party credential to create, store, or rotate. `git push` is backup and
history, not a deploy trigger.

From the phone: use Dispatch, which runs the Cowork session on the Mac. If the Mac is
offline the work just waits.

## Gotcha: deleting a content file

Astro caches parsed collections in `node_modules/.astro/data-store.json`. Delete a visit
and its page can keep rebuilding from cache. If a ghost page survives a clean build:

```bash
rm -rf node_modules/.astro dist && npm run build
```

## Before you launch

- [ ] Write your first real visit — there are currently zero, so nothing is scored yet
- [ ] Real hours for **Tulip Cafe** — I couldn't find them published anywhere, so what's
      in the file is a placeholder with a deliberately old `hours_checked`
- [ ] Real hours for **Upper Lake Park** — set by ordinance, unconfirmed
- [ ] Confirm **Sacred Bean**'s Thu–Sun 7–11am window (off a listing site, and a window
      that specific tends to move)
- [ ] Replace **Java Dock**'s placeholder hours
- [ ] Confirm whether Upper Lake Park's pavilion outlets are live outside rental hours —
      that's the detail the whole entry rests on
- [ ] Swap `hello@workinozaukee.org` for a real address in `Layout.astro`, `about.astro`,
      and `index.astro`
