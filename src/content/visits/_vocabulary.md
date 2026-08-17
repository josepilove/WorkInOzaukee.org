<!--
  GENERATED FILE — do not edit by hand.
  Run `npm run vocab` after changing src/lib/vocab.ts.
  Ignored by the content loader (leading underscore).
-->

# Visit vocabulary

Every allowed value, in the folder where you need it. If a value isn't listed
here, the build will reject it — that's deliberate.

> You shouldn't need this. Say **"log a visit"** to Claude and describe the
> session however it comes out — the skill parses it and writes the file.
> This is the reference for the rare time you do it by hand.

## Required every time

Just `date` and `venue`. That's the whole obligation — every extra required
field is a tax on going out, and an entry typed one-handed at the table beats a
complete one written never.

`venue` must match a filename in `../venues/` without the `.md`.

The scoring rubric is **not** here — it lives on the venue, scored once per
place. See `../venues/_vocabulary.md`.

## Observations (facts)

These record what was there. They are not judgments and don't need the rubric.

## `wifi`

Observed connection quality.

| value | when to use it |
| --- | --- |
| `good` | Held up. No thinking required. |
| `ok` | Fine for mail and docs. A call would be a gamble. |
| `bad` | Dropped, throttled, or a captive portal that kept logging me out. |
| `none` | No wifi. Tether or leave. |

## `outlets`

Observed power access.

| value | when to use it |
| --- | --- |
| `at-seat` | Plug in where you sat. |
| `nearby` | Had to pick a seat around them, or ran a cord. |
| `none` | Battery only. |

## `light`

Observed light.

| value | when to use it |
| --- | --- |
| `good` | Enough to read by, no glare on the screen. |
| `dim` | Fine for a bar, hard for a spreadsheet. |
| `glare` | Sun straight onto the screen. Depends on time of day — say which. |

## `temp`

Observed temperature.

| value | when to use it |
| --- | --- |
| `cold` | Drafty, or the door kept opening. Real problem Nov–Mar. |
| `fine` | Never thought about it. |
| `warm` | Stuffy or in direct sun. |

| field | notes |
| --- | --- |
| `arrived`, `left` | `"HH:MM"` 24-hour, quoted. Derives duration and time-of-day. |
| `noise` | `1` silent … `5` loud. A measurement, not a score — loud isn't always bad. |
| `laptops` | How many others were working. The "am I welcome here" signal. |
| `weather` | Free text, e.g. `"68F, overcast"`. Matters most for outdoor venues. |
| `zone` | Must match a `zones[].id` on the venue. |
| `verdict` | One line. This is what shows in the log. |

## Never entered by hand

Day of week, season, time-of-day bucket, and duration are all derived from
`date` and `arrived`. Don't add fields for them.
