# Contentment Foundation — Project Documentation

> **Contact:** somesh@contentment.org

Planning and content docs for the contentment.org redesign (Q2 2026). All files are draft unless marked approved.

## Source of truth — start here

**`docs/planning/` is canonical for how we build.** If anything else disagrees (HTML briefs, `*-BRIEF.md` summaries, old notes), **`planning/` wins.**

| Layer | Location | Role |
|-------|----------|------|
| **Execution (canonical)** | [`planning/`](./planning/) | PRD, technical architecture, tickets, security, frontend spec, decisions |
| **Content & IA** | `docs/*.md` (root) | Messaging, voice, evidence, sitemap — not duplicated in `planning/` |
| **Team orientation (optional)** | `*-BRIEF.html` + `*-BRIEF.md` | Short readable summaries for stakeholders; must align with `planning/` |
| **Deploy copy** | `site/docs/` (gitignored) | Generated on Netlify build from `docs/*.html` — not stored in repo |

See [`planning/README.md`](./planning/README.md) for the build hierarchy.

---

## Planning & execution (canonical)

| Doc | File |
|-----|------|
| PRD | [planning/PRD.md](./planning/PRD.md) |
| Technical architecture | [planning/TECHNICAL-ARCHITECTURE.md](./planning/TECHNICAL-ARCHITECTURE.md) |
| Open technical decisions | [planning/DECISIONS.md](./planning/DECISIONS.md) |
| Security & access | [planning/SECURITY-AND-ACCESS.md](./planning/SECURITY-AND-ACCESS.md) |
| Frontend specification | [planning/FRONTEND-SPECIFICATION.md](./planning/FRONTEND-SPECIFICATION.md) |
| Feature tickets | [planning/FEATURE-TICKETS.md](./planning/FEATURE-TICKETS.md) |

---

## Content & information architecture

| Doc | File | Use when you need… |
|-----|------|-------------------|
| **Messaging & copy** | [MESSAGING-AND-COPY.md](./MESSAGING-AND-COPY.md) | Taglines, belief journey, page copy briefs, stats, CTAs (wins on copy conflicts) |
| **Voice & tone** | [VOICE-AND-TONE.md](./VOICE-AND-TONE.md) | Persona, tone principles, pre-publish voice check |
| **Evidence & research** | [EVIDENCE-AND-RESEARCH.md](./EVIDENCE-AND-RESEARCH.md) | Citable sources, DOIs, ready-to-use copy lines |
| **Site architecture** | [WEBSITE-ARCHITECTURE.md](./WEBSITE-ARCHITECTURE.md) | Sitemap, URLs, phases, deployment model |

---

## Published briefs (web) — summaries only

HTML briefs are **not** replacements for `planning/`. They are styled one-pagers for reading on Netlify (`/docs`). **Edit `.html` here**; run [`../scripts/copy-docs.sh`](../scripts/copy-docs.sh) locally (or let Netlify run it on deploy) to copy into `site/docs/`.

| Page | Source file | Canonical detail lives in… |
|------|-------------|---------------------------|
| **Docs hub** | [index.html](./index.html) | — |
| **Team brief** | [TEAM-BRIEF.html](./TEAM-BRIEF.html) | [planning/PRD.md](./planning/PRD.md), [MESSAGING-AND-COPY.md](./MESSAGING-AND-COPY.md) |
| **Tech brief** | [TECH-BRIEF.html](./TECH-BRIEF.html) | [planning/TECHNICAL-ARCHITECTURE.md](./planning/TECHNICAL-ARCHITECTURE.md) |
| **Growth brief** | [GROWTH-BRIEF.html](./GROWTH-BRIEF.html) | [MESSAGING-AND-COPY.md](./MESSAGING-AND-COPY.md), [planning/FEATURE-TICKETS.md](./planning/FEATURE-TICKETS.md) (TICKET-080/081) |
| **Automation brief** | [AUTOMATION-BRIEF.html](./AUTOMATION-BRIEF.html) | [planning/TECHNICAL-ARCHITECTURE.md](./planning/TECHNICAL-ARCHITECTURE.md) §6, [AUTOMATION-BRIEF.md](./AUTOMATION-BRIEF.md) |

Matching `*-BRIEF.md` files at `docs/` root are optional repo copies of the same summaries. **Do not treat them as a second spec** — update `planning/` first, then refresh briefs if needed.

Live preview (Netlify, interim): https://contentmentweb2.netlify.app/docs

## Google Drive links (optional)

**Markdown stays private.** All `.md` files under `docs/` and `docs/planning/` remain in the GitHub repo only — do not upload them to public Google Drive.

**Optional:** Export an HTML brief as PDF or Google Doc for stakeholders who need Drive access. Paste **Anyone with the link** URLs in **[`drive-links.js`](./drive-links.js)**:

```javascript
window.TCF_DRIVE_LINKS = {
  folder: 'https://drive.google.com/drive/folders/…',  // optional
  teamBrief: 'https://drive.google.com/file/d/…/view?usp=sharing',
  techBrief: '',
  growthBrief: '',
  automationBrief: '',
};
```

Leave a key as `''` to hide that link. The web briefs on Netlify remain the primary reading experience.

Production target: Vercel → `contentment.org` — see [WEBSITE-ARCHITECTURE.md](./WEBSITE-ARCHITECTURE.md) and [planning/TECHNICAL-ARCHITECTURE.md](./planning/TECHNICAL-ARCHITECTURE.md).

All `.md` files remain in the private GitHub repo — not published to public Drive.

## Authority order (conflicts)

1. **Build & execution** → `docs/planning/` (PRD, architecture, tickets, security, frontend spec, decisions)  
2. **Copy & messaging** → [MESSAGING-AND-COPY.md](./MESSAGING-AND-COPY.md)  
3. **Persona & style** → [VOICE-AND-TONE.md](./VOICE-AND-TONE.md)  
4. **URLs & structure** → [WEBSITE-ARCHITECTURE.md](./WEBSITE-ARCHITECTURE.md)  
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
