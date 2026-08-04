# Slack draft — Kristina + WoeiJing · double opt-in + remaining CTA destinations

**Date:** 4 Aug 2026 · **From:** Somesh · **Re:** FEAT-070 / D-24
**Status:** draft, not yet sent

Two asks in here. The first (double opt-in) is a real decision with legal weight.
The second (remaining CTAs) is the last of the D-24 mapping.

---

## Message

Hi both — newsletter signup is live on the site now, and everything Kristina mapped
on the Miro board is wired. Two things I'd like your call on.

### 1. Double opt-in — currently ON, want to confirm we keep it

Our Flodesk account has double opt-in **switched on** right now
(https://app.flodesk.com/account/double-opt-in · how it works:
https://help.flodesk.com/en/articles/4748417). I've set the site to match it
explicitly so the wording on the form is honest either way. Before we lock it in,
worth making sure we all mean to have it on.

**The difference, plainly:**

| | **Single opt-in** (off) | **Double opt-in** (on — what we have) |
|---|---|---|
| What happens | Someone types their email → they're subscribed | Someone types their email → Flodesk emails them → they click a link → *then* subscribed |
| List growth | Higher, no drop-off | Typically **20–40% never click through** |
| Address quality | Typos and fake addresses get in | Every address is verified real and owned by that person |
| Consent record | Weak — anyone can enter someone else's address | Strong; we also store the IP and timestamp of the opt-in |
| Deliverability | Bounces and spam complaints build up and damage sender reputation | Protects reputation |

**Why I'd keep it on:**

- **EU (GDPR)** — consent has to be freely given and demonstrable. A confirmation
  click plus a stored IP and timestamp is the cleanest proof we can hold. We have
  subscribers across Europe, so this genuinely applies to us.
- **US (CAN-SPAM)** — doesn't strictly require it, but it does hold us responsible
  for who we mail. Double opt-in is what stops someone signing up an address that
  isn't theirs.
- **Deliverability** — this is the practical one. A nonprofit's sender reputation is
  slow to build and painful to repair. Verified addresses mean fewer bounces, fewer
  spam complaints, and a better chance our emails land in inboxes at all.

**The honest cost:** we will sign up fewer people. Some genuinely interested
subscribers won't see the confirmation email or won't bother clicking. If the
priority right now is list growth over list quality, that's a legitimate reason to
turn it off — I'd just want that to be a decision we made rather than a default.

**What I need:** a yes to keeping it on, or a flag if you'd rather we didn't.

*(The site copy already reflects it — after signing up people see "Almost there —
check your inbox to confirm" rather than "You're in", so nobody thinks they're
subscribed when they aren't.)*

### 2. Four CTAs still need a destination

Everything on Kristina's Miro list is wired. Eight go to **www.contentment.org**;
the festival hero CTA goes to **Contentment Festival**. These four aren't assigned
yet, so they're currently falling back to www.contentment.org:

| Where | CTA | Currently |
|---|---|---|
| `/events` — top email capture fold | "Keep me in the loop" | falls back |
| `/events` — Upcoming grid | "Save my spot" (Festival virtual) | just scrolls to the signup fold |
| `/events` — Upcoming grid | "Be first to know" (Festival in-person) | just scrolls to the signup fold |
| `/events` — Upcoming grid | "Join the waitlist" (Bali retreat) | just scrolls to the signup fold |

The three Upcoming-grid ones each have a twin elsewhere on the page that you've
already assigned, so the obvious answer is to match them — but I didn't want to
assume, since scrolling to the signup fold is also a reasonable thing for them to do.

### 3. Two pages that never reached your review list

Flagging these because they're built and live but were never on the page list, so
neither of you has had a chance to look at them:

- **`/updates`** — the standalone newsletter signup page, linked from the footer.
- **`/404`** — the page someone lands on after a mistyped or dead link.

Both work; neither has had any non-engineering review of the copy or framing. Worth
five minutes each if you have them.

---

## Notes for Somesh (not part of the message)

- Flipping the decision later is a one-line change: `FLODESK_DOUBLE_OPTIN` in the
  env (and the matching value in the Netlify / Vercel dashboards). The success copy
  follows automatically from it — no code edit needed.
- If they say turn it off, it has to change in **both** places: the Flodesk account
  setting *and* the env var. Changing only one makes the on-screen message wrong again.
