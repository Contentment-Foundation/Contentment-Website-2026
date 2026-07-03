# Project Tracker — contentment.org

> **Last updated:** 3 July 2026 · Somesh Bhardwaj  
> **Spec detail** (acceptance criteria): [FEATURE-TICKETS.md](./FEATURE-TICKETS.md) · **Decisions**: [DECISIONS.md](./DECISIONS.md)

---

## Status key

| Symbol | Status | Meaning |
|--------|--------|---------|
| 🔵 | Open | Ready to start, no blockers |
| 🟡 | In Progress | Actively being worked on |
| 🟠 | Blocked | Waiting on external input or dependency |
| ⏸️ | Pending | Waiting on a team decision |
| ✅ | Done | Completed and verified |
| 📅 | Scheduled | Planned for a later phase |
| 🚫 | Cancelled | Dropped — will not do |

**Prefixes:** `FEAT` = feature · `OPS` = infrastructure/config · `DOC` = documentation · `QA` = quality/audit

---

## Master Ticket Table

| ID | Title | Cat | Phase | Priority | Status | Raised by | Owner | Opened | Closed | Depends on | Blocker / Note |
|----|-------|-----|-------|----------|--------|-----------|-------|--------|--------|------------|----------------|
| FEAT-001 | Extract shared layout (CSS tokens, nav, footer) | FEAT | 1 | Must | 🔵 Open | Somesh | Engineering | Jun 2026 | — | — | — |
| FEAT-002 | Multi-page routing scaffold (Astro) | FEAT | 1 | Must | ⏸️ Pending | Somesh | Engineering | Jun 2026 | — | FEAT-001 | Astro vs static partials — awaiting Anik input |
| FEAT-003 | Mobile navigation drawer | FEAT | 1 | Must | 🔵 Open | Somesh | Engineering | Jun 2026 | — | FEAT-001 | — |
| FEAT-004 | Wire all nav and footer links | FEAT | 1 | Must | 🔵 Open | Somesh | Engineering | Jun 2026 | — | FEAT-002 | Social URLs needed from comms |
| FEAT-010 | Migrate homepage to `/` route | FEAT | 1 | Must | 🟡 In Progress | Somesh | Dave Kebo | Jun 2026 | — | FEAT-001, FEAT-002 | — |
| FEAT-011 | Homepage copy audit vs messaging brief | FEAT | 1 | Should | 🔵 Open | Somesh | Engineering | Jun 2026 | — | FEAT-010 | — |
| FEAT-020 | Build `/why` page | FEAT | 1 | Must | 🔵 Open | Somesh | Engineering | Jun 2026 | — | FEAT-001, FEAT-002 | — |
| FEAT-030 | Stories data model + JSON seed (min 3 stories) | FEAT | 1 | Must | 🟠 Blocked | Somesh | Engineering | Jun 2026 | — | — | Waiting on comms for story content + photos |
| FEAT-031 | Build `/stories` index | FEAT | 1 | Must | 🔵 Open | Somesh | Engineering | Jun 2026 | — | FEAT-030, FEAT-002 | — |
| FEAT-032 | Build `/stories/[slug]` individual template | FEAT | 1.5 | Should | 📅 Scheduled | Somesh | Engineering | Jun 2026 | — | FEAT-030, FEAT-031 | — |
| FEAT-033 | Interactive global educator map | FEAT | 2 | Nice | 📅 Scheduled | Somesh | Engineering | Jun 2026 | — | FEAT-031 | — |
| FEAT-040 | Build `/schools` page | FEAT | 1 | Must | 🔵 Open | Somesh | Engineering | Jun 2026 | — | FEAT-002 | — |
| FEAT-041 | School discovery form | FEAT | 1 | Should | 🔵 Open | Somesh | Engineering | Jun 2026 | — | FEAT-040 | — |
| FEAT-050 | Build `/give` gateway page | FEAT | 1 | Must | 🔵 Open | Somesh | Engineering | Jun 2026 | — | FEAT-002 | — |
| FEAT-051 | Build `/give/monthly` conversion page | FEAT | 1 | Must | 🟠 Blocked | Somesh | Engineering | Jun 2026 | — | FEAT-050, FEAT-060 | Blocked on Keela URLs + tier amount decision |
| FEAT-060 | Keela donation integration — wire all CTAs | FEAT | 1 | Must | 🟠 Blocked | Somesh | Engineering | Jun 2026 | — | — | Waiting on finance for live Keela checkout URLs |
| FEAT-070 | Newsletter integration (Flodesk embed or API) | FEAT | 1 | Must | 🔵 Open | Somesh | Engineering | Jun 2026 | — | FEAT-010, credentials | — |
| FEAT-071 | `/privacy` and `/terms` pages | FEAT | 1 | Must | 🔵 Open | Somesh | Engineering | Jun 2026 | — | FEAT-002, legal copy | Waiting on legal copy + cookie banner decision |
| FEAT-080 | Analytics setup (GA4 + PostHog + Clarity) | FEAT | 1 | Must | ⏸️ Pending | Somesh | Engineering | Jun 2026 | — | FEAT-002 | PostHog cloud vs self-hosted GCP — pending decision |
| FEAT-081 | SEO baseline (meta, OG, sitemap, robots, `llms.txt`, favicon) | FEAT | 1 | Should | 🔵 Open | Somesh | Engineering | Jun 2026 | — | FEAT-002 | — |
| FEAT-090 | Events & Experiences page | FEAT | 1.5 | Should | 📅 Scheduled | Somesh | Engineering | Jun 2026 | — | FEAT-002, event calendar | — |
| FEAT-091 | Homeroom gated member hub (`/homeroom`) | FEAT | 2 | Nice | 📅 Scheduled | Somesh | Engineering | Jun 2026 | — | FEAT-060, FEAT-092 | — |
| FEAT-092 | Homeroom access middleware (edge + password) | FEAT | 2 | Nice | 📅 Scheduled | Somesh | Engineering | Jun 2026 | — | Edge function hosting | — |
| FEAT-093 | About section (5 sub-pages) | FEAT | 2 | Nice | 📅 Scheduled | Somesh | Engineering | Jun 2026 | — | FEAT-002, content briefs | — |
| FEAT-094 | Campaign page template (`/festival/2026`) | FEAT | 2 | Nice | 📅 Scheduled | Somesh | Engineering | Jun 2026 | — | FEAT-080 | — |
| FEAT-100 | Pre-launch QA (a11y, Lighthouse ≥85, Keela live test) | QA | 1 | Must | 🔵 Open | Somesh | Somesh | Jun 2026 | — | All must-have FEATs + QA-001 | — |
| FEAT-101 | Production deploy + DNS cutover to contentment.org | OPS | 1 | Must | 🔵 Open | Somesh | Somesh | Jun 2026 | — | FEAT-100 | — |
| OPS-001 | Add security headers to `netlify.toml` (interim env) | OPS | 1 | Must | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | — | X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy added |
| OPS-002 | Commit `vercel.json` from spec in TECHNICAL-ARCHITECTURE §9 | OPS | 1 | Must | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | — | CSP, security headers, redirects, API function timeout — committed |
| OPS-003 | CI step — auto-regenerate `contentment-home.html` on push | OPS | 1 | Should | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | — | Implemented as `.github/workflows/sync-single-file-build.yml` (watches `site/index.html`) |
| QA-001 | Story Board a11y gaps — dialog focus trap, `aria-pressed`, live region | QA | 1 | Must | ✅ Done | Somesh | Somesh | Jul 2026 | 3 Jul 2026 | — | Dialog semantics, focus trap, focus return, aria-pressed on toggles + filter chips, live region on count — all closed |
| DOC-001 | Fix wrong doc paths in brief footers | DOC | 1 | Must | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | — | TECH-BRIEF, TEAM-BRIEF, GROWTH-BRIEF — all paths corrected |
| DOC-002 | Add `llms.txt` spec to GROWTH-BRIEF + FEAT-081 | DOC | 1 | Should | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | — | Comprehensive `llms.txt` guidance added to GROWTH-BRIEF §6 |
| DOC-003 | Add favicon to pre-launch checklist | DOC | 1 | Must | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | — | Pre-launch blocker confirmed in GROWTH-BRIEF |
| DOC-004 | Add `rel="noopener"` to SECURITY-AND-ACCESS §8 checklist | DOC | 1 | Must | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | — | Added `rel="noopener noreferrer"` check + Drive view-only confirmation to §8 |
| DOC-005 | Clarify local dev instructions in TECH-BRIEF (prototype vs post-scaffold) | DOC | 1 | Should | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | — | Both rows now separate: `python3 -m http.server 8080` (now) vs `astro dev` (post TICKET-002) |
| DOC-006 | Update DECISION-001 — analytics stack (Plausible → GA4 + PostHog + Clarity) | DOC | 1 | Must | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | — | — |
| DOC-007 | Update DECISION-002 — cookie banner required (GA4 Consent Mode v2) | DOC | 1 | Must | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | DOC-006 | — |
| DOC-008 | Update GROWTH-BRIEF §1 analytics stack | DOC | 1 | Must | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | DOC-006 | — |
| DOC-009 | Update TECH-BRIEF + TECHNICAL-ARCHITECTURE env vars (remove Plausible, add GA4/PostHog) | DOC | 1 | Must | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | DOC-006 | — |
| DOC-010 | Write ANIK-REVIEW-RESPONSE.md with hyperlinks + issue tracker | DOC | 1 | Must | ✅ Done | Somesh | Somesh | Jul 2026 | 3 Jul 2026 | — | — |
| DOC-011 | ACCESSIBILITY.md — WCAG 2.1 AA target, ARIA map, known gaps | DOC | 1 | Must | ✅ Done | Somesh | Somesh | Jun 2026 | Jun 2026 | — | — |
| — | Plausible analytics integration | — | — | — | 🚫 Cancelled | Somesh | — | Jun 2026 | 3 Jul 2026 | — | Paid tool; GA4 + PostHog cover same needs at no cost |
| — | Supabase (replaced by GCP Cloud SQL) | — | — | — | 🚫 Cancelled | Somesh | — | Jun 2026 | Jun 2026 | — | Standardised on GCP stack |

---

## Pending decisions — unblocks multiple tickets

| Decision | Options | Waiting on | Gates |
|----------|---------|------------|-------|
| Astro vs static partials build | Astro 4.x (current plan) vs flat HTML + `_partials/` inject script | Anik Ghosh | FEAT-002 and all downstream Phase 1 tickets |
| Homeroom tier amounts | $5 / $25 / $100 vs $25 / $50 / $100 | Finance / Leadership | FEAT-051 copy, FEAT-060 URL wiring |
| PostHog hosting | Cloud (faster to ship) vs self-hosted on GCP (no third-party data) | Somesh / team | FEAT-080 |
| Cookie consent tool | Osano free tier vs custom `<dialog>` | Team | FEAT-071, FEAT-080 |

---

## External blockers — not in engineering's control

| Blocker | Waiting on | Gates |
|---------|-----------|-------|
| Live Keela checkout URLs | Finance team | FEAT-060, FEAT-051 |
| Story content (3+ stories, photos, permissions) | Comms / Programs team | FEAT-030, FEAT-031 |
| Legal copy for `/privacy` and `/terms` | Legal / Ops | FEAT-071 |
| Social media URLs (LinkedIn, Instagram, YouTube) | Comms team | FEAT-004 |

---

## Critical path — Phase 1

```
FEAT-001 → FEAT-002* → FEAT-003
                     → FEAT-004 (needs social URLs from comms)
                     → FEAT-010 [Dave] → FEAT-011
                     → FEAT-020
                     → FEAT-031 (needs FEAT-030 — blocked on comms content)
                     → FEAT-040 → FEAT-041
                     → FEAT-050 → FEAT-060 (blocked: finance URLs)
                                → FEAT-051 (blocked: FEAT-060 + tier decision)
                     → FEAT-070
                     → FEAT-071 (needs legal copy + cookie decision)
                     → FEAT-080* (pending PostHog hosting decision)
                     → FEAT-081

OPS-001  ← no dependency — ship now
OPS-002  ← no dependency — ship now
OPS-003  ← no dependency — ship now
QA-001   ← must close before FEAT-100

FEAT-100 (all must-haves + QA-001) → FEAT-101 (DNS cutover)

* = pending decision
```

---

## Related documents

| Document | Purpose |
|----------|---------|
| [FEATURE-TICKETS.md](./FEATURE-TICKETS.md) | Full ticket specs — acceptance criteria, AI prompt seeds |
| [DECISIONS.md](./DECISIONS.md) | Open and resolved technical decisions |
| [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md) | Stack, env vars, CI/CD, DNS runbook |
| [SECURITY-AND-ACCESS.md](./SECURITY-AND-ACCESS.md) | Security checklist, pre-launch gates |
| [ACCESSIBILITY.md](./ACCESSIBILITY.md) | WCAG 2.1 AA checklist, ARIA map, known gaps |
| [GROWTH-BRIEF](../briefs/GROWTH-BRIEF.md) | Analytics, SEO, UTM taxonomy |
| [../correspondence/ANIK-REVIEW-RESPONSE.md](../correspondence/ANIK-REVIEW-RESPONSE.md) | Final response to Anik Ghosh's engineering review — issue tracker, hyperlinked doc refs |

---

## Changelog

| Date | Change |
|------|--------|
| 3 Jul 2026 | Initial tracker. All FEAT tickets from FEATURE-TICKETS.md ported. OPS + DOC tickets added from Anik review. Done and cancelled rows added. |
| 3 Jul 2026 | OPS-001, OPS-002, OPS-003, QA-001, DOC-001, DOC-002, DOC-003 all marked ✅ Done — all Somesh-owned items from Anik's review resolved and committed. |
| 3 Jul 2026 | DOC-004, DOC-005 marked ✅ Done — `rel="noopener"` added to SECURITY-AND-ACCESS §8; local dev instructions clarified in TECH-BRIEF. All DOC tickets from Anik's review now closed. |
