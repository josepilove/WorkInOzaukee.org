---
# yaml-language-server: $schema=../../../.astro/collections/venues.schema.json
#
# Copy this file, don't edit it. Filename becomes the slug — `sacred-bean.md`
# is what a visit's `venue:` refers to.
#
# Full vocabulary with hints: ./_vocabulary.md
# Anything not on that list fails the build, on purpose.

name: Somewhere New
type: cafe                 # cafe library coworking hotel-lobby bar brewery restaurant outdoor civic other
district: downtown         # downtown marina lakefront north-side south-side west-side outskirts
address: 000 N Franklin St, Port Washington, WI 53074
indoor: true
seasons: [winter, spring, summer, fall]   # drop seasons for outdoor spots
cost: purchase-expected    # free purchase-expected membership paid
serves: [coffee, snacks]   # coffee other-drinks meals snacks alcohol — omit if nothing
calls_ok: unknown          # yes quietly rooms no unknown

# All seven days required. `null` means closed — so "closed" is always
# something you said, never something you forgot.
hours:
  mon: null
  tue: ["07:00", "15:00"]
  wed: ["07:00", "15:00"]
  thu: ["07:00", "15:00"]
  fri: ["07:00", "15:00"]
  sat: ["08:00", "14:00"]
  sun: null

hours_checked: 2026-01-01
hours_source: third-party  # owner first-person website third-party
hours_url: https://example.com/hours

# Scoring. Once per place — anchors in ./_vocabulary.md.
# Skip anything you haven't tested; profiles refuse to compute below 70% coverage.
scores:
  # Quality: 1 bad … 5 good
  wifi: 3                  # did the connection hold up?
  power: 3                 # could you plug in where you wanted to sit?
  seat: 3                  # could you work there for three hours?
  welcome: 3               # could you stay without feeling like a problem?
  calls: 3                 # could you take one?
  # Continua: neither end is wrong, pick where the room actually sits
  sound: 0                 # -2 hushed … +2 lively
  pace: 0                  # -2 lingering … +2 brisk
scores_updated: 2026-01-01

# Optional. Delete what you don't need.
# shares_space_with: cavelier-wine-bar
# zones:
#   - id: window-corner
#     name: Corner by the window
#     notes: Two outlets under the sill. Glare after 2pm.
# exceptions:
#   - date: 2026-12-25
#     status: closed        # closed degraded extended
#     reason: Christmas
# url: https://example.com/
# phone: (262) 555-0000
---

A sentence or two on what the place is and why it's here. Then whatever you
don't yet know — open questions are good content and they give you a reason to
go back.
