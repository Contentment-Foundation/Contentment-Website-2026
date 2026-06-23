# Contentment Foundation — Project Documentation

Planning and content docs for the contentment.org redesign (Q2 2026). All files are draft unless marked approved.

## Published briefs (web)

HTML briefs are built from this folder and served under `/docs/` on the Netlify preview. **Edit the `.html` files here** — they are copied into `site/docs/` at deploy (see root [`README.md`](../README.md)).

| Page | Source file | URL |
|------|-------------|-----|
| **Docs hub** | [index.html](./index.html) | `/docs` |
| **Team brief** | [TEAM-BRIEF.html](./TEAM-BRIEF.html) | `/docs/team-brief` |
| **Tech brief** | [TECH-BRIEF.html](./TECH-BRIEF.html) | `/docs/tech-brief` |
| **Growth brief** | [GROWTH-BRIEF.html](./GROWTH-BRIEF.html) | `/docs/growth-brief` |

Live preview: https://contentmentweb2.netlify.app/docs

Markdown sources (`.md`) below are for planning in-repo; they are not published to the site unless converted to HTML.

## Documents

| Doc | File | Use when you need… |
|-----|------|-------------------|
| **Evidence & research** | [EVIDENCE-AND-RESEARCH.md](./EVIDENCE-AND-RESEARCH.md) | Citable external sources (Jennings, Durlak), ready-to-use copy lines, DOIs |
| **Messaging & copy** | [MESSAGING-AND-COPY.md](./MESSAGING-AND-COPY.md) | Taglines, belief journey, page copy briefs, stats, CTAs, guardrails, handoff checklist |
| **Voice & tone** | [VOICE-AND-TONE.md](./VOICE-AND-TONE.md) | Persona, tone principles, style craft, pre-publish voice check |
| **Site architecture** | [WEBSITE-ARCHITECTURE.md](./WEBSITE-ARCHITECTURE.md) | Sitemap, URLs, phases, Homeroom, campaign pages, build notes |

## Planning & execution

Build-ready docs in [`planning/`](./planning/):

| Doc | File |
|-----|------|
| PRD | [planning/PRD.md](./planning/PRD.md) |
| Technical architecture | [planning/TECHNICAL-ARCHITECTURE.md](./planning/TECHNICAL-ARCHITECTURE.md) |
| Security & access | [planning/SECURITY-AND-ACCESS.md](./planning/SECURITY-AND-ACCESS.md) |
| Frontend specification | [planning/FRONTEND-SPECIFICATION.md](./planning/FRONTEND-SPECIFICATION.md) |
| Feature tickets | [planning/FEATURE-TICKETS.md](./planning/FEATURE-TICKETS.md) |

## How they relate

```
Evidence & Research ─►  PROOF (external citations, DOIs)
Messaging & Copy    ─►  WHAT to say (wins on copy conflicts)
Voice & Tone        ─►  WHO we sound like (persona & craft)
Site Architecture   ─►  WHERE it lives (URLs & structure)
```

## Authority order

1. **Copy & messaging** → Messaging brief  
2. **Persona & writing style** → Voice & tone (messaging brief references this for persona depth)  
3. **Structure & URLs** → Website architecture (messaging page map may name pages not yet in the sitemap — reconcile as IA finalizes)

## Build reference

Homepage prototype and dev notes live outside `docs/`:

- [`../site/index.html`](../site/index.html) — current Phase 1 homepage  
- [`../README.md`](../README.md) — local preview, deploy, design tokens
