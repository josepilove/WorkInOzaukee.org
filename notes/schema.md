# Content model

*Draft — Aug 2026. Values in examples are illustrative, not verified.*

## Two content types, because two different lifespans

The mistake would be one flat file type. Attributes divide cleanly into things that
**belong to a place** (change slowly, shared across every visit) and things that
**belong to a session** (true forever, never revised).

| | Venue | Visit |
|---|---|---|
| One per | place | session |
| Lifespan | mutable, needs re-checking | immutable once published |
| Holds | hours, address, seasons, zones | date, time, conditions, verdict |
| Count | ~20–40 | grows forever |

Put hours in a visit and you get twenty conflicting copies. Put "it was loud today" in
a venue and you've overwritten a fact with a mood.

## The join that generates your to-do list

- **"Open Monday"** comes from venue hours.
- **"Verified good on Monday"** comes from whether any visit exists with a Monday date.

The difference between those two sets *is* the Monday gap — computed, not maintained.
The homepage grid can render three states per cell: open and tested, open but untested
(your prompt to go), and closed. That's the forcing function as a database query.

## Derive, don't type

Your three axes mostly already exist in the date. Never enter these by hand:

| Wanted | Derived from |
|---|---|
| day of week | visit `date` |
| month, season | visit `date` |
| time-of-day bucket | visit `arrived` |
| duration | `arrived` + `left` |
| "is it open now" | venue `hours` + clock |

The only explicit season field lives on the **venue** — because a lakefront bench isn't
*available* in January, which is different from not having been visited in January.

## Venue

```yaml
---
slug: niederkorn-library
name: W.J. Niederkorn Library
type: library          # cafe | library | coworking | hotel-lobby | brewery | outdoor | civic | other
district: west-side    # downtown | lakefront | marina | west-side | north | south
address: 316 W Grand Ave, Port Washington, WI 53074
coords: [43.3874, -87.8779]
indoor: true
seasons: [winter, spring, summer, fall]   # when the place is usable at all
cost: free             # free | purchase-expected | membership | paid
hours:                 # drives the grid; null = closed
  mon: [09:00, 20:00]
  tue: [09:00, 20:00]
  wed: [09:00, 20:00]
  thu: [09:00, 20:00]
  fri: [09:00, 18:00]
  sat: [09:00, 13:00]
  sun: null
hours_checked: 2026-08-17     # honesty field — render as "hours last confirmed…"
hours_source: website  # owner | website | posted-sign | observed | third-party
hours_url: https://www.wjnlib.org/
exceptions:            # ephemeral, best-effort, never promised complete
  - date: 2026-09-01
    status: closed
    reason: Labor Day
  - date: 2026-09-18
    status: degraded
    reason: Live music 6–8pm, back room unusable
calls_ok: rooms        # yes | quietly | no | rooms (bookable private space)
zones:
  - id: quiet-room
    name: Quiet study room
    notes: No-talking policy. Best for deep work.
  - id: study-rooms
    name: Bookable study rooms
    notes: Added in renovation. Reportedly includes telemedicine rooms.
  - id: main-floor
    name: Main floor tables
url: https://www.wjnlib.org/
---
```

## Visit

```yaml
---
date: 2026-08-24        # required — carries day, month, season
venue: niederkorn-library   # required
arrived: "09:10"        # optional but cheap; drives time-of-day
left: "12:40"
zone: quiet-room        # which seating area — the differentiated axis
wifi: good              # good | ok | bad
outlets: at-seat        # at-seat | nearby | none
noise: 1                # 1 silent … 5 loud
laptops: 4              # others working. best single "am I welcome here" signal
light: good             # good | dim | glare
temp: cold              # cold | fine | warm  (Wisconsin: drafty window seats are real)
weather: "68F, overcast"    # context for outdoor + seasonal entries
rating: 4               # 1–5, this session only
verdict: Best Monday option in town, and the only place you can take a call.
photo: ./2026-08-24-niederkorn.jpg
---

Prose goes here. Five sentences is a complete entry.
```

## Required core: three fields

`date`, `venue`, and a sentence of prose. **Everything else optional.**

This is the load-bearing rule. Every additional required field is a tax on going out,
and the whole point is to lower that cost. A missing value renders as blank, not as an
error or a "0". An entry typed one-handed at the table is worth more than a complete
one written never.

The optional fields are there for the days you feel like it — and because once a few
dozen entries exist, even patchy data supports real queries.

## Provenance beats accuracy

`hours_source` matters as much as the hours themselves, because it sets how much the
reader should trust the line and how urgently you need to recheck it.

- `owner` — they told you directly. Highest trust, longest recheck interval, and the
  goal state for every venue.
- `website` / `posted-sign` — solid, recheck a couple times a year.
- `observed` — you were there and it was open. Weak evidence about the *schedule*.
- `third-party` — a listing site said so. Assume wrong until confirmed.

Render it plainly: *"Hours per the owner, confirmed Aug 17"* vs. *"Hours per a listing
site — unconfirmed."* Never present a guess in the same typeface as a fact. This is the
whole reason someone would trust you over a stale Google result, and it costs nothing
but honesty.

`exceptions` are deliberately a thin, best-effort list — one-off closures and
work-relevant degradations only. `status: degraded` matters more than closures for your
audience: a place that's open but unworkable is worse than a place that's shut, because
you drove there.

## What it unlocks once entries accumulate

- **Grid:** day × venue, with tested / untested / closed states.
- **"Open right now"** — hours plus the clock, the single most useful view.
- **Seasonal split** — same venue in July vs. January, from visit dates alone.
- **Zone rankings** within a venue, once a place has 4+ visits across zones.
- **Time-of-day patterns** — the 3pm school-letout effect shows up in `noise` and
  `laptops` plotted against `arrived`.
- **Call-friendly filter** — `calls_ok`, the thing every remote worker needs and no
  cafe listing publishes.
- **Staleness flags** — venues whose `hours_checked` is older than ~90 days surface as
  a re-verify queue. Another self-generating to-do list.

## Deliberately omitted for now

Ratings by other people, submissions, comments, a map, star aggregates across visits.
All of it is easy to add later on top of this schema, and none of it matters before
there are entries.
