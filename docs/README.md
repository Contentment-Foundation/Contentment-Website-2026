# Documentation Index — contentment.org

> *Navigation index for all files in `docs/`. For full project orientation, read [`../README.md`](../README.md) first.*

> **Contact:** somesh@contentment.org

Planning and content docs for the contentment.org redesign (Q2 2026). All files are draft unless marked approved.

## Document flow — use in this order

```
PRD.md → TECHNICAL-ARCHITECTURE.md → DECISIONS.md → FEATURE-TICKETS.md → TRACKER.md
```

1. **PRD** — defines what and why
2. **TECHNICAL-ARCHITECTURE** — defines how (stack, integrations, env vars)
3. **DECISIONS** — resolve open choices before writing tickets
4. **FEATURE-TICKETS** — write the spec (what to build, acceptance criteria)
5. **TRACKER** — update live status (always last; reflects what's defined in 1–4)

Briefs (`docs/briefs/`) are stakeholder summaries. Correspondence (`docs/correspondence/`) holds external review responses. Neither is a spec — `docs/planning/` wins on all conflicts.

---

## Source of truth

**`docs/planning/` is canonical for how we build.** If anything else disagrees (HTML briefs, `*-BRIEF.md` summaries, old notes), **`planning/` wins.**

| Layer | Location | Role |
|-------|----------|------|
| **Execution (canonical)** | [`planning/`](./planning/) | PRD, technical architecture, tickets, decisions, security, frontend spec, tracker |
| **Content & IA** | [`research/`](./research/) | Messaging, voice, evidence, sitemap — not duplicated in `planning/` |
| **Team orientation** | [`briefs/`](./briefs/) | Short readable summaries for stakeholders; must align with `planning/` |
| **External comms** | [`correspondence/`](./correspondence/) | Review responses, stakeholder communications |
| **Deploy copy** | `site/docs/` (gitignored) | Generated on Netlify build from `docs/briefs/*.html` — not stored in repo |

---

## Planning & execution (canonical)

| Doc | File | Purpose |
|-----|------|---------|
| PRD | [planning/PRD.md](./planning/PRD.md) | Product requirements, audiences, success metrics, phase gates |
| Technical architecture | [planning/TECHNICAL-ARCHITECTURE.md](./planning/TECHNICAL-ARCHITECTURE.md) | Stack, integrations, env vars, CI/CD, DNS runbook, `vercel.json` spec |
| Open technical decisions | [planning/DECISIONS.md](./planning/DECISIONS.md) | Resolved and open choices — check here before reopening a decision |
| Security & access | [planning/SECURITY-AND-ACCESS.md](./planning/SECURITY-AND-ACCESS.md) | Security posture, pre-launch checklist, error handling |
| Frontend specification | [planning/FRONTEND-SPECIFICATION.md](./planning/FRONTEND-SPECIFICATION.md) | Design system, CSS tokens, components, integration specs |
| Accessibility | [planning/ACCESSIBILITY.md](./planning/ACCESSIBILITY.md) | WCAG 2.1 AA target, ARIA pattern map, known gaps |
| Feature tickets (spec) | [planning/FEATURE-TICKETS.md](./planning/FEATURE-TICKETS.md) | Acceptance criteria, AI prompt seeds — the spec, not a status tracker |
| **Tracker (status)** | [planning/TRACKER.md](./planning/TRACKER.md) | **Live status of every ticket — owner, dates, blockers, critical path** |

---

## Content & information architecture

| Doc | File | Use when you need… |
|-----|------|-------------------|
| **Messaging & copy** | [research/MESSAGING-AND-COPY.md](./research/MESSAGING-AND-COPY.md) | Taglines, belief journey, page copy briefs, stats, CTAs (wins on copy conflicts) |
| **Voice & tone** | [research/VOICE-AND-TONE.md](./research/VOICE-AND-TONE.md) | Persona, tone principles, pre-publish voice check |
| **Evidence & research** | [research/EVIDENCE-AND-RESEARCH.md](./research/EVIDENCE-AND-RESEARCH.md) | Citable sources, DOIs, ready-to-use copy lines |
| **Site architecture** | [research/WEBSITE-ARCHITECTURE.md](./research/WEBSITE-ARCHITECTURE.md) | Sitemap, URLs, phases, deployment model |

---

## Published briefs (web) — summaries only

HTML briefs are **not** replacements for `planning/`. They are styled one-pagers for reading on Netlify (`/docs`). **Edit `.html` in `docs/briefs/`**; run [`../scripts/copy-docs.sh`](../scripts/copy-docs.sh) locally (or let Netlify run it on deploy) to copy into `site/docs/`.

| Page | Source file | Canonical detail lives in… |
|------|-------------|---------------------------|
| **Docs hub** | [index.html](./index.html) | — |
| **Team brief** | [briefs/TEAM-BRIEF.html](./briefs/TEAM-BRIEF.html) | [planning/PRD.md](./planning/PRD.md), [research/MESSAGING-AND-COPY.md](./research/MESSAGING-AND-COPY.md) |
| **Tech brief** | [briefs/TECH-BRIEF.html](./briefs/TECH-BRIEF.html) | [planning/TECHNICAL-ARCHITECTURE.md](./planning/TECHNICAL-ARCHITECTURE.md) |
| **Growth brief** | [briefs/GROWTH-BRIEF.html](./briefs/GROWTH-BRIEF.html) | [research/MESSAGING-AND-COPY.md](./research/MESSAGING-AND-COPY.md), [planning/FEATURE-TICKETS.md](./planning/FEATURE-TICKETS.md) (TICKET-080/081) |
| **Automation brief** | [briefs/AUTOMATION-BRIEF.html](./briefs/AUTOMATION-BRIEF.html) | [planning/TECHNICAL-ARCHITECTURE.md](./planning/TECHNICAL-ARCHITECTURE.md) §6, [briefs/AUTOMATION-BRIEF.md](./briefs/AUTOMATION-BRIEF.md) |

Matching `*-BRIEF.md` files in `docs/briefs/` are the markdown source of each brief. **Do not treat them as a second spec** — update `planning/` first, then refresh briefs if needed.

Live preview (Netlify, interim): https://contentmentweb2.netlify.app/docs

Production target: Vercel → `contentment.org` — see [research/WEBSITE-ARCHITECTURE.md](./research/WEBSITE-ARCHITECTURE.md) and [planning/TECHNICAL-ARCHITECTURE.md](./planning/TECHNICAL-ARCHITECTURE.md).

All `.md` files remain in the private GitHub repo only — do not upload to public Google Drive.

## Correspondence — `docs/correspondence/`

External review responses and stakeholder communications. Not planning docs — do not use these as specs.

| Document | Purpose |
|----------|---------|
| [ANIK-REVIEW-RESPONSE.md](./correspondence/ANIK-REVIEW-RESPONSE.md) | Response to Anik Ghosh's engineering review (Jul 2026) — issue tracker, hyperlinked doc refs |

---

## Authority order (conflicts)

1. **Build & execution** → `docs/planning/` (PRD, architecture, tickets, security, frontend spec, decisions)  
2. **Copy & messaging** → [research/MESSAGING-AND-COPY.md](./research/MESSAGING-AND-COPY.md)  
3. **Persona & style** → [research/VOICE-AND-TONE.md](./research/VOICE-AND-TONE.md)  
4. **URLs & structure** → [research/WEBSITE-ARCHITECTURE.md](./research/WEBSITE-ARCHITECTURE.md)  
5. **HTML / `*-BRIEF.md` summaries** → orientation only; must match 1–4 above  

```
planning/ (how we build)     ← canonical for engineering
MESSAGING + WEBSITE-ARCH     ← canonical for copy & URLs
*-BRIEF.html / .md           ← readable summaries (Netlify / repo)
site/docs/                   ← deploy copy only
```

## Build reference

Homepage prototype and dev notes live outside `docs/`:

- [`../site/index.html`](../site/index.html) — current Phase 1 homepage  
- [`../README.md`](../README.md) — local preview, deploy, design tokens
