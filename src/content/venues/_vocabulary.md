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

## `serves`

What you can buy. A list. Leave empty if nothing.

| value | when to use it |
| --- | --- |
| `coffee` | Espresso drinks, drip, the usual. |
| `other-drinks` | Tea, smoothies, soda — something for people who are done with coffee. |
| `meals` | Real food you could call lunch. |
| `snacks` | Pastries, bakery, something to pick at. |
| `alcohol` | Beer, wine, cocktails. |

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

## Scoring

All under a `scores:` block on the **venue**, scored once per place rather than
per visit — outlets, seating, room noise and call etiquette are properties of the
room, not of a Tuesday.

Two kinds of dimension, because "is this good?" has two kinds of answer.

### Quality — `1`–`5`, higher is better

For things where one end is simply worse. Nobody prefers unreliable wifi.
Anchors are at 1, 3 and 5; use 2 and 4 for "between these two."

#### `wifi` — Did the connection hold up?

| | |
| --- | --- |
| **1** | None, or it dropped constantly. Tether or leave. |
| **3** | Fine for mail and documents. A video call would be a gamble. |
| **5** | Held a video call without thinking about it. |

#### `power` — Could you plug in where you wanted to sit?

| | |
| --- | --- |
| **1** | No outlet you could reach. Whatever your battery holds is the session. |
| **3** | Outlets exist, but you chose your seat around them or ran a cord. |
| **5** | Power at most seats. Sit wherever you like. |

#### `seat` — Could you work there for three hours?

| | |
| --- | --- |
| **1** | Stool, wobbly table, or nowhere to put a laptop and a cup at once. |
| **3** | Fine for an hour. Sore by the second. |
| **5** | Table at the right height, chair with a back, room for laptop, notebook and coffee. |

#### `welcome` — Could you stay without feeling like a problem?

| | |
| --- | --- |
| **1** | Clear you're overstaying — signs, glances, or laptops discouraged at peak. |
| **3** | Nobody minds a couple of hours as long as you keep ordering. |
| **5** | Laptops are normal here. Stay all morning, nobody notices. |

#### `calls` — Could you take one?

| | |
| --- | --- |
| **1** | No. You'd be that person. |
| **3** | Possible if you step outside or wait for a lull. |
| **5** | Take it at your seat, or there’s a room or corner made for it. |

### Continua — `-2`…`+2`, neither end is wrong

For things where both poles are somebody's ideal, often the same person on
different days. There is no "good" direction, so don't score these as if there
were — pick the end the room actually sits at.

#### `sound` — What does the room sound like?

**Hushed** `-2` ←→ `+2` **Lively**

| | |
| --- | --- |
| **-2** | Library quiet. You can hear your own typing, and so can everyone else. |
| **0** | Steady background — some conversation, music you stop noticing. |
| **+2** | Full of people talking. Energising if you want company, hopeless if you need to think. |

#### `pace` — How fast does the room turn over?

**Lingering** `-2` ←→ `+2` **Brisk**

| | |
| --- | --- |
| **-2** | People settle in for hours. Nothing about the room hurries you. |
| **0** | Ordinary churn. Nobody is watching the clock but nobody is camped either. |
| **+2** | Constant in-and-out, queue at the counter, tables turning. Fine for an hour, tiring for four. |

### How they combine

Quality dimensions are weighted straight. On the continua each profile has a
**target** rather than a preference for "high" — so the same score reads as a
match or a mismatch depending on the kind of day being asked about.

- **Deep work** — A long stretch of focus. Quiet, somewhere to settle, and power.
  seat 20%, power 15%, wifi 15%, wants hushed sound 30%, wants lingering pace 20%
- **Calls & meetings** — A day of talking to people. Needs bandwidth and somewhere to talk.
  calls 40%, wifi 30%, wants leans hushed sound 20%, wants in between pace 10%
- **Quick session** — An hour between things. Sit down, get online, get out.
  wifi 35%, welcome 25%, seat 15%, wants leans brisk pace 15%, wants in between sound 10%
- **Company** — Working alone is fine; working near people is better. You want a room with something going on.
  welcome 30%, seat 15%, wifi 10%, wants lively sound 30%, wants in between pace 15%

Skip anything you haven't tested. A profile refuses to compute below 70% coverage
and prints "not enough scored to say" instead — leaving a dimension out is
always safer than guessing at it.

Set `scores_updated` when you re-score. Current rubric version: **2**.

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
