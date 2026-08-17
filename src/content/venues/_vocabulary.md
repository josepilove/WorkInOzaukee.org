<!--
  GENERATED FILE — do not edit by hand.
  Run `npm run vocab` after changing src/lib/vocab.ts.
  Ignored by the content loader (leading underscore).
-->

# Venue vocabulary

Every allowed value, in the folder where you need it. If a value isn't listed
here, the build will reject it — that's deliberate.

## Required every time

`name`, `type`, `hours` (all seven days — use `null` for closed, so that
"closed" is always a deliberate statement rather than a forgotten field), and
`hours_checked`.

Everything else has a sensible default.

## `type` *(required)*

What kind of place this is.

| value | when to use it |
| --- | --- |
| `cafe` | Coffee shop. Buying something is expected. |
| `library` | Public library. |
| `coworking` | Purpose-built workspace, paid or membership. |
| `hotel-lobby` | Lobby seating. Usually open to anyone who looks like a guest. |
| `bar` | Wine bar, cocktail bar, tavern. Afternoon hours matter here. |
| `brewery` | Taproom. Dead mid-afternoon, which is the opportunity. |
| `restaurant` | Sit-down food. Off-peak only. |
| `outdoor` | Park, pavilion, beach, bench. Seasonal by definition. |
| `civic` | Municipal building, community center, museum. |
| `other` | Doesn't fit. Say why in the body. |

## `district`

Roughly where in town. Groups the Places page.

| value | when to use it |
| --- | --- |
| `downtown` | Franklin St and the blocks around it. |
| `marina` | Harbor and Old Theater Square side. |
| `lakefront` | On the lake — Upper Lake Park, the bluff, the beach. |
| `north-side` | North of downtown. |
| `south-side` | South of downtown, incl. S Spring St. |
| `west-side` | West of downtown, incl. W Grand Ave. |
| `outskirts` | Edge of town or just outside it. Driving required. |

## `cost`

What it costs to sit there.

| value | when to use it |
| --- | --- |
| `free` | Walk in, sit down, buy nothing. |
| `purchase-expected` | Nobody stops you, but you'd feel like a jerk. Budget a drink every couple of hours. |
| `membership` | Requires signing up. |
| `paid` | Per-day or per-hour charge. |

## `calls_ok`

Whether you can take a call.

| value | when to use it |
| --- | --- |
| `yes` | Take a call at your seat. Nobody cares. |
| `quietly` | Possible if you keep your voice down or wait for a lull. |
| `rooms` | There is a bookable room with a door. The best case. |
| `no` | You'd be that person. Step outside. |
| `unknown` | Haven't worked out the etiquette here yet. |

## `hours_source`

Where the hours came from. Drives how much readers are told to trust them.

| value | when to use it |
| --- | --- |
| `owner` | They told me directly — in person, by email, or by text. The goal state. |
| `first-person` | I read them myself: the door, a sign, or staff told me while I was there. |
| `website` | Their own site or booking page. |
| `third-party` | A listing site said so. Assume wrong until confirmed. |

## `seasons`

When the place is usable at all. A list. Outdoor spots are not year-round.

| value | when to use it |
| --- | --- |
| `winter` | Dec–Feb. |
| `spring` | Mar–May. |
| `summer` | Jun–Aug. |
| `fall` | Sep–Nov. |

## `exceptions[].status`

One-off deviations from the normal hours.

| value | when to use it |
| --- | --- |
| `closed` | Shut when it normally would not be. |
| `degraded` | Open but unworkable — live music, private event, wifi down. Worse than closed, because you drove there. |
| `extended` | Open later or earlier than usual. |

### How `hours_source` is displayed

| value | shown to readers as | trust |
| --- | --- | --- |
| `owner` | "confirmed with the owner" | high |
| `first-person` | "checked in person" | high |
| `website` | "from their website" | medium |
| `third-party` | "from a listing site, unconfirmed" | low |

Low-trust sources render with a "?" badge. Bump this to `first-person` or
`owner` the moment you confirm, and update `hours_checked` with it.

## The rubric

Six dimensions, `1`–`5`, all optional, under a `scores:` block on the **venue**.

Scored once per place, not per visit — outlets, seating, room noise and call
etiquette are properties of the room, not of a Tuesday. Score against these
sentences rather than by feel; that's what keeps a 4 in November meaning what a
4 in March meant. Anchors are written at 1, 3 and 5; use 2 and 4 for "between
these two."

### `wifi` — Did the connection hold up?

| | |
| --- | --- |
| **1** | None, or it dropped constantly. Tether or leave. |
| **3** | Fine for mail and documents. A video call would be a gamble. |
| **5** | Held a video call without thinking about it. |

### `power` — Could you plug in where you wanted to sit?

| | |
| --- | --- |
| **1** | No outlet you could reach. Whatever your battery holds is the session. |
| **3** | Outlets exist, but you chose your seat around them or ran a cord. |
| **5** | Power at most seats. Sit wherever you like. |

### `seat` — Could you work there for three hours?

| | |
| --- | --- |
| **1** | Stool, wobbly table, or nowhere to put a laptop and a cup at once. |
| **3** | Fine for an hour. Sore by the second. |
| **5** | Table at the right height, chair with a back, room for laptop, notebook and coffee. |

### `sound` — Could you think?

| | |
| --- | --- |
| **1** | Unworkable. Music too loud to hold a thought, or a grinder every ninety seconds. |
| **3** | Steady background hum. Headphones solve it. |
| **5** | Quiet enough to work without headphones, not so quiet you feel watched. |

### `welcome` — Could you stay without feeling like a problem?

| | |
| --- | --- |
| **1** | Clear you're overstaying — signs, glances, or laptops discouraged at peak. |
| **3** | Nobody minds a couple of hours as long as you keep ordering. |
| **5** | Laptops are normal here. Stay all morning, nobody notices. |

### `calls` — Could you take one?

| | |
| --- | --- |
| **1** | No. You'd be that person. |
| **3** | Possible if you step outside or wait for a lull. |
| **5** | Take it at your seat, or there’s a room or corner made for it. |

### How they combine

- **Deep work** — A long stretch of focus. Somewhere to sit, quiet, and power.
  sound 30%, seat 25%, power 20%, wifi 15%, welcome 10%
- **Calls & meetings** — A day of talking to people. Needs bandwidth and somewhere to talk.
  calls 40%, sound 25%, wifi 25%, welcome 10%
- **Quick session** — An hour between things. Sit down, get online, get out.
  wifi 30%, welcome 25%, seat 20%, power 15%, sound 10%

Skip anything you haven't tested. A profile refuses to compute below 70% coverage
and prints "not enough scored to say" instead — leaving a dimension out is
always safer than guessing at it.

Set `scores_updated` when you re-score. Current rubric version: **1**.

## Fields with no fixed vocabulary

| field | notes |
| --- | --- |
| `address` | Free text. |
| `coords` | `[lat, lng]`. Optional, unused so far. |
| `indoor` | `true` / `false`. Drives the Wisconsin-January question. |
| `hours_url` | Where you'd go to re-check. Must be a full URL. |
| `shares_space_with` | Slug of another venue at the same address. |
| `zones` | List of `{ id, name, notes }`. `id` is what a visit's `zone` refers to. |
| `url`, `phone` | Free text. Phone shows on /todo so you can call to re-check. |
