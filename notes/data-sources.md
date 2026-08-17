# Aggregating venue data

*Draft — Aug 2026*

## Facebook: don't

Scraping Facebook or Instagram is off the table, for three converging reasons:

- **Terms.** Automated collection is prohibited by their terms of service. Meta has
  pursued this aggressively, including against small operators.
- **Practicality.** Login walls, anti-bot defenses, deliberately obfuscated markup that
  changes without notice. You'd be maintaining a scraper instead of visiting cafes.
- **It doesn't work anyway.** The information you want is in unstructured prose in a
  photo caption — *"closed Mon for a family thing 🙃"* — which no parser handles
  reliably.

The legitimate route is the **Meta Graph API**, but reading arbitrary Pages requires
Page Public Content Access, which needs App Review and is effectively unavailable to a
solo project. A venue *could* grant your app access to their own Page — which is just
the "get venues to feed you" play with more steps than a text message.

## The reframe: automate detection, not collection

The instinct to automate is worth interrogating at this scale. Twenty venues, each
changing hours maybe twice a year — that's ~40 changes annually, one every nine days.
No pipeline is going to beat walking downtown.

Worse, automation actively erodes the moat. Your differentiator is *first-hand,
recently verified*. Auto-published third-party data looks authoritative while being
exactly as stale as everyone else's, which is the failure everyone else already has.

So invert it. **A weekly job pulls your venues from a legitimate API, diffs against
your YAML, and emails you what changed.** You verify by phone or in person and update
by hand.

That gives you:

- No stale data ever published under your name — a human confirmed every line.
- An unbounded monitoring chore converted into a short queue of prompts.
- The same forcing-function pattern as the rest of the site: the machine finds gaps,
  you go close them.

## Sources, ranked

**1. The owner, directly.** Highest quality, and at twenty venues it's tractable. A
text message thread with four shop owners beats every API below. Also builds the
relationships the coworking endgame needs.

**2. Google Places API (New).** The best automated source — most small businesses
maintain their Google listing far better than their own website, because customers
actually see it.

- `regularOpeningHours` — the weekly schedule. What you want for change detection.
- `currentOpeningHours` — next seven days including holiday overrides. Note this field
  pushes the request into the **Enterprise** pricing tier.
- `businessStatus` — catches permanent closures, which is the single most embarrassing
  error a directory can make.

Cost is a non-issue at this scale: 20 venues checked weekly is ~1,040 calls/year.
At Pro-tier rates (~$17/1K) that's under $20/year, before any free monthly credit.
Check current terms on caching — Maps Platform restricts how long you may store
returned content, which is another argument for diff-and-discard rather than
mirroring into your repo.

**3. schema.org `LocalBusiness` JSON-LD on the venue's own site.** Free, and it's
*published expressly for machines to read* — no ambiguity about whether you should.
Look for `openingHoursSpecification` (structured `dayOfWeek`/`opens`/`closes`) or the
older `openingHours` shorthand (`"Mo,Tu,We,Th,Fr 09:00-17:00"`). Coverage among small
shops will be spotty, but it costs one fetch to find out.

**4. iCal / RSS from civic institutions.** The library and municipal sites likely
publish calendars in a real format. Best-quality data on the site, and free.

**5. Yelp Fusion API.** Free at low volume, includes hours. Storage and display terms
apply. Useful as a cross-check when Google and the website disagree.

**6. Your readers.** A plain "hours wrong? tell me" mailto link. At town scale this
produces real signal for zero engineering.

## OpenStreetMap — worth doing in both directions

OSM has a formalized [`opening_hours`](https://wiki.openstreetmap.org/wiki/Key:opening_hours)
tag with a proper grammar (`Mo-Th 09:00-20:00; Fr 09:00-18:00; Sa 09:00-13:00; Su off`),
and mature parsers exist for it. Data is ODbL — genuinely open, no storage restrictions,
no per-call cost.

Coverage in small-town Wisconsin will be thin. But that cuts the interesting way:
**you're collecting this data anyway, so contribute it back.** Verifying hours in
person and pushing them to OSM makes the work a public commons instead of your private
asset, which fits the `.org` and the non-Facebook ethos exactly. It also means the data
survives you losing interest — a hedge worth having.

Adopting OSM's `opening_hours` syntax as your own storage format is a reasonable call
too: it's expressive (handles holidays, seasonal ranges, "sunset"), already specified,
and gets you round-tripping for free.

## Suggested build order

1. Ship with hand-entered hours for a handful of venues. No pipeline at all.
2. Add the `hours_checked` display and the 90-day re-verify queue — pure UI, no data
   source needed, and it solves the trust problem on its own.
3. Only once ~15 venues exist, add the weekly Google Places diff-and-email job.
4. Opportunistically parse JSON-LD where venues publish it.
5. Push verified hours back to OSM as you confirm them.

Steps 1 and 2 deliver most of the value. Don't build 3 until the manual version
demonstrably hurts.
