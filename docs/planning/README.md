# Planning & Execution

> **Contact:** somesh@contentment.org  
> **Canonical:** This folder is the **source of truth for build and execution.** The HTML briefs at `../TEAM-BRIEF.html`, `../TECH-BRIEF.html`, etc. are readable summaries only — if they conflict with files here, **this folder wins.**

Build-ready documents for the contentment.org redesign. All execution docs assume **no UI/UX changes** beyond the approved prototype (`site/index.html`).

| Document | File | Owner lens |
|----------|------|------------|
| Product Requirements | [PRD.md](./PRD.md) | Product |
| Technical Architecture | [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md) | Engineering |
| Open Technical Decisions | [DECISIONS.md](./DECISIONS.md) | Engineering lead |
| Security & Access | [SECURITY-AND-ACCESS.md](./SECURITY-AND-ACCESS.md) | Security |
| Frontend Specification | [FRONTEND-SPECIFICATION.md](./FRONTEND-SPECIFICATION.md) | Design / Frontend |
| Feature Tickets | [FEATURE-TICKETS.md](./FEATURE-TICKETS.md) | Engineering lead |

## Source of truth hierarchy

```
PRD (scope & MVP)
  ↓
Frontend Spec (locked UI — site/index.html)
  ↓
Technical Architecture + Security (how we build)
  ↓
Feature Tickets (execution order)
```

Content & copy: [`../MESSAGING-AND-COPY.md`](../MESSAGING-AND-COPY.md) · IA: [`../WEBSITE-ARCHITECTURE.md`](../WEBSITE-ARCHITECTURE.md)

**Not in this folder (by design):** role briefs (`../TEAM-BRIEF.md`, `../TECH-BRIEF.md`, …) and their `.html` twins — summaries for stakeholders, not duplicate specs.
