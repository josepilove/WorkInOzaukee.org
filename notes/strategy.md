# WorkInOzaukee.org — Strategy Notes

*Drafted Aug 2026*

## The reframe

This is not a directory project. It's a **demand-aggregation project for a coworking
space**, and the directory is the thing that earns people's attention along the way.

That changes what "good" looks like. A directory succeeds by being complete. This
succeeds by producing a list of named humans in Ozaukee County who would pay for a
desk — because that list is the only asset that makes a real space possible. Nobody
lends money, leases a storefront, or partners with you on the strength of a nice
website. They do it on the strength of "I have 180 people on an email list and 15 who
show up every Thursday."

So every decision gets tested against: *does this get me closer to knowing who these
people are and what they'd pay for?*

## The other motive, which matters more

There's a second purpose, and it's arguably the primary one: **the site is a forcing
function.** Right now Mondays don't happen, because the two good coffee places are
closed and there's no reason to solve it. But "find out what's open Monday" is a task.
"Try the other seating area at the place I already like" is a task. Having the site
turns getting out of the house from a preference into an assignment.

That's a legitimate reason to build something, and it should drive the design more
than the coworking endgame does. Concretely, it means:

- **Gaps in the site should be visible and nagging.** A blank Monday column isn't an
  embarrassment, it's a to-do list. Publish the holes.
- **Going out has to produce an artifact.** Whatever the format, a visit should end
  with something published. Staying home produces nothing, visibly.
- **The cost of documenting has to be near zero** — five minutes at the table, a photo
  and a few lines. If an entry requires an evening of writing, the project dies in
  three weeks and takes the habit with it.

The failure mode to watch: a self-discipline device that becomes an obligation
generates guilt, and guilt makes you avoid the thing. Guard against this by keeping
entries tiny and by choosing a format where a quiet week leaves no hole (see below).

## Why the fundamentals are favorable

- **17.5% of Ozaukee workers were remote in 2024** (21% in 2021 — among the highest
  in Wisconsin), driven by an IT- and finance-heavy local economy. On ~95,000
  residents that's roughly 8,000–9,000 people with this problem.
- **Almost no supply.** One coworking space in Cedarburg, the Ozaukee Nonprofit
  Center in Grafton. No default answer to "where do I go?"
- **Three walkable downtowns** — Cedarburg, Port Washington, Grafton/Thiensville —
  with historic buildings and civic interest in daytime foot traffic. That is the
  setup where small-market coworking actually pencils out.
- **No incumbent.** The national directories are stale here. Tourism-bureau listicles
  are shallow. There's no local voice on this at all.

## What the site is for

**Its job:** be so useful that a stranger gives you their email address, and so
specific that they trust your judgment about where to work.

**Not its job:** be comprehensive, be a database, rank on Google. Search volume for
"coworking Cedarburg" is functionally zero. Distribution here is Facebook groups,
Nextdoor, librarians, the local paper, and word of mouth. Build for sharing, not for
crawling.

The competitive moat is one sentence: *you have personally worked from every place on
this list.* National sites cannot do that. Listicle writers do not do that. Lean all
the way into first-person, opinionated, recently-verified. Include the things nobody
else writes down — which corner has outlets, where you can take a call without
annoying anyone, what happens at 3pm when school lets out, whether the wifi survives
a video call.

## Positioning: the non-Facebook channel

Local businesses publish hours, closures, and changes to Facebook and nowhere else.
Google listings go stale, websites go unmaintained, and anyone who isn't on the
platform is simply locked out of knowing whether a place is open. That's a real,
widely-felt gap, and serving it makes the site useful to people who don't care about
remote work at all — which widens the audience and fits the `.org`.

It also implies design constraints, and they're all easy: no login walls, no embedded
feeds, plain HTML, RSS, and email. The **email list gets more valuable**, because it's
the delivery channel for people who deliberately rejected the other delivery channel.
"This week: X closed Monday for renovation, Y added Sunday hours" is a genuinely useful
local email — and it builds exactly the list the coworking endgame needs.

### The trap

This inverts the sustainability logic the whole plan rests on. Log entries are
immutable and generate no debt. **Hours and closures are the highest-decay data there
is** — pure maintenance obligation, and the moment yours is wrong once, the trust is
gone. Done naively, this is the thing that swallows the project.

Four rules keep it bounded:

1. **Never claim currency you can't back.** Show `hours last confirmed Aug 17` on every
   listing. Honest staleness beats false authority, and it lets readers judge for
   themselves. Venues past ~90 days surface as a re-verify queue — another
   self-generating to-do list rather than a hidden liability.

2. **Separate stable from ephemeral.** Regular weekly hours change maybe twice a year;
   that's tractable. Closures and specials change constantly; treat them as best-effort
   and never promise completeness.

3. **Filter by "does this affect working here?"** You're not building a town bulletin
   board. Live music Thursday, a private event, closed for renovation, wifi out — those
   belong. Half-price muffins don't. This keeps scope bounded and the site coherent.

4. **Only cover places you'd actually work.** That's the natural boundary. The moment
   you're listing every restaurant in town, it's a different and much larger project.

### The move that makes it sustainable

Don't mirror Facebook — **get the venues to feed you directly.**

Small businesses post to Facebook because it's the only free channel they know about.
Offer them a different one: *tell me when your hours change and I'll keep you listed on
a site people actually use.* Some will happily text or email you updates. That turns
maintenance from your job into theirs, which is the only version of this that survives
contact with year two.

At Port Washington scale this is genuinely doable — a walkable downtown, maybe twenty
relevant venues, and you're already a regular at two. And it builds exactly the
relationships the coworking endgame depends on, with exactly the people who own space.

## Scope: Port Washington deep, every kind of place

Narrow the geography, keep the venue types wide. **Port Washington only, to start** —
cafes, the library, hotel lobbies, breweries in dead afternoon hours, the marina, the
lakefront, benches on the Interurban Trail for walking calls.

Deep-on-one-town beats a thin county survey, for reasons that all point the same way:

- It's **actually verifiable.** You can revisit every entry monthly without it being a
  job. County-wide, you can't, and the list rots.
- It's **more useful.** "Everywhere in Port Washington, including which seat" is worth
  reading. "Two cafes each in eight towns" is worth nothing.
- It **matches the forcing function.** The point is to get *you* out, and you're not
  driving to Belgium on a Tuesday.
- Expansion is free later — Cedarburg and Grafton can come from contributors who want
  their town covered, which is a much better recruiting pitch than asking for help
  with a list that's already county-wide and half-empty.

The domain still fits. Start as Port Washington, grow into the county name.

Wisconsin seasonality is a publishing rhythm, not a problem. Half these spots are
seasonal, which hands you a reason to email people at least twice a year: a summer
edition and a January survival guide.

## The format: a log, not a directory

This is the most important structural decision, and the Monday problem makes the case.

A **directory entry is a permanent maintenance obligation.** Every venue page you
publish is a promise to keep it accurate forever. Twenty pages means twenty small
recurring debts, and that debt is what kills every project like this.

A **dated field note is complete the moment you publish it.** "Monday Aug 24, corner
booth by the window, outlet under the table, wifi held up on a video call, three other
laptops at 10am" is true forever. It never needs updating. It can never be wrong.

For a project whose purpose is to reward getting out of the house, the log wins
outright:

- Every visit produces a finished artifact. No backlog.
- A quiet week leaves no stale content, just no new content.
- Accumulated visits are the credibility no other site has — "I've worked here eleven
  times, here's the pattern" is unassailable.
- Venue summaries can be **derived** from the log later, once there's enough material,
  each one backed by dated visits.

Publish from the table, not from the couch that evening.

## The organizing axis is *when*, not *where*

Every other site organizes by place or amenity. Organize by **day and time**, because
that's the question you actually have: *where can I work right now?*

The homepage is a day-of-week grid. Monday's column is visibly thin — and that gap is
both the site's most useful content and the thing that gets you out on Mondays.

**Seating zones within a venue** are the other unpublished axis, and your instinct
there is right. "This place has four distinct areas and only one works after 10am" is
the level of detail that makes people trust you, and it's a renewable content source:
one venue can support five separate visits before it's exhausted. That's how the habit
sustains itself without needing many venues.

## Port Washington leads to verify

Unverified — from search, and hours especially need checking in person:

- **W.J. Niederkorn Library**, 316 W Grand Ave — listed Mon–Thu 9am–8pm, Fri to 6pm,
  Sat 9am–1pm. Has a quiet study room plus newly added study/meeting rooms, reportedly
  including telemedicine rooms. **This may already be the Monday answer**, and the
  call-friendly rooms are the thing cafes can never offer.
- **Amplify Cafe** (formerly Banjo's Brews), 115 N Franklin St, inside Lakeside Music &
  Naturals — listed as open daily 6am–6pm. Worth confirming; if true, another Monday
  option.
- **Java Dock Cafe**, Old Theater Square near the marina.
- **Smith Bros. Coffee House**, 100 N Franklin — appears to have closed.
- Untested categories: hotel lobbies, the marina area, breweries mid-afternoon.

## The engine is the meetup, not the site

Websites don't create community. A repeating calendar event does.

The fastest path to what you actually want — working alongside other people — isn't a
website at all. It's texting three people and picking a Thursday. Do that first, this
week, before any of the rest of this. The site exists to scale past your existing
network, and it can't do that until there's something to scale.

Rules that make a small recurring meetup work:

- **Same place, same time, every week.** Variety kills attendance; predictability is
  the entire product. "Ozaukee Remote Work Thursdays, 9–noon, [one venue]."
- **Show up alone the first three times** and don't read anything into it.
- **No agenda.** It's parallel work, not networking. Say so explicitly — it lowers
  the cost of coming.
- **Tell the venue.** A weekday-morning crowd during their dead hours is a gift.
  They'll hold a table and may become your first partner conversation.

## Launch sequence

1. **Publish the list already in your head**, arranged as a day-of-week grid with the
   Monday gap showing. One static page, hand-written. No CMS, no Airtable, no filters.
   This week.
2. **Solve Monday first.** Go to the library on a Monday, then somewhere untested, and
   write both up. That's the founding content and it proves the format to yourself.
3. **Work the seating-zone angle at the two places you already like.** Cheapest possible
   entries, and it establishes the level of detail the site is known for.
4. **One email capture with one specific promise** — "monthly-ish: new spots and the
   next meetup." Not "subscribe for updates."
5. **Start the meetup.** Before the site is good. Port Washington, one venue, weekly.
6. **Seed distribution deliberately:** the library staff first (natural allies, and
   they'll tell patrons), then local Facebook groups, Nextdoor, Ozaukee Press,
   Visit Port Washington, the chamber. Each is a conversation, not a link drop.
7. **Instrument the coworking question** from day one (below).

## Toward an actual space

Small-market coworking is a hard business — thin margins, and the survivors are
almost always attached to something else: a landlord with vacant space, a nonprofit,
a library, or a municipality with downtown-revitalization money. The realistic path is
**partner with someone who already has space**, not sign a lease.

Which means the next twelve months are a free feasibility study. Things to learn from
the people who show up:

- What would you actually pay per month? (Ask concretely: $75? $150? $250?)
- Do you need a desk, a room, or just a table with company?
- How often — daily, or two days a week?
- What's the dealbreaker: taking calls, printing, 24-hour access, parking, childcare
  proximity?
- Which downtown? People will not drive across the county.

Natural allies once you have numbers: the chambers of commerce, a downtown BID,
Ozaukee County economic development, the libraries, and any landlord with a vacant
second floor on a main street. "I have a list of 200 local remote workers" is exactly
what a downtown business association wants to hear.

## Deliberately don't build

- A filterable database. The universe is 30–60 venues. That fits on one page.
- User accounts, reviews, or submissions — until people are asking for them.
- A map, at first. Ozaukee is small and everyone knows where Cedarburg is.
- Anything that increases maintenance debt before there's an audience to serve.

## On the name

Earlier concern: "WorkInOzaukee.org" reads like a jobs board, and there are real
economic-development orgs in that space.

With the community/coworking goal, this mostly resolves. `.org` fits a civic,
community-run thing. "Work in Ozaukee" works as an umbrella for a directory, a
meetup, *and* eventually a space — where "OzaukeeDesks.com" or similar would box you
in. Some arriving visitors will expect employment listings; a clear headline fixes
that. Keep it.

## Open questions

- Which downtown is the center of gravity — where do you actually want to end up?
- Is this yours, or does it want a co-founder? Community projects with one owner
  stall when that person gets busy.
- How much do you want your name on it? "A remote worker in Ozaukee County" vs. Joe
  Elmendorf changes how venues and partners respond to you.
