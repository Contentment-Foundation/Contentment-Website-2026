# contentment.org — Custom Automation & Integrations Brief
> Q2 2026 · Engineering, Operations & Growth Team · Full detail in `docs/planning/`  
> Prepared by **Somesh Bhardwaj** · somesh@contentment.org · Sr. System Admin, Full Stack AI Engineer · The Contentment Foundation

---

## Automation Principle

**Event-driven. Lightweight first.** Every automation starts with a trigger (a form submission, a donation, an RSVP) and ends with an outcome (a Slack notification, a calendar entry, a lead row in Sheets). Use the lowest-friction tool that meets the need: a Vercel Serverless Function for anything touching the site; Zapier/Make.com for connecting third-party services; native platform automations (Flodesk workflows, Keela notifications) where they already exist.

```
Site event / form
  └── Vercel Serverless Function (POST /api/*)
        ├── Flodesk API      — newsletter, welcome sequence, tagging
        ├── Slack Webhook    — team notifications (new lead, new member, error)
        ├── Google Sheets    — lead logging, event RSVPs
        ├── Google Calendar  — event creation, reminders
        ├── Zoom API         — webinar registration, link generation
        ├── Google Drive     — story content, meeting notes, assets
        └── Keela Webhook    — donation confirmed → member lookup → Slack
```

---

## Automation Matrix — Triggers × Destinations

| # | Trigger | Source | → Slack | → Zoom | → Google Workspace | → Flodesk | → Other |
|---|---------|--------|---------|--------|--------------------|-----------|---------|
| A1 | School form submitted | `/api/school-inquiry` | ✓ Partnerships | — | ✓ Sheets (leads) | ✓ Tag: `school-inquiry` | — |
| A2 | Newsletter signup | Flodesk / `/api/newsletter` | ✓ Growth | — | ✓ Sheets (email log) | ✓ Native workflow | — |
| A3 | Homeroom member joined | Keela webhook | ✓ Team `#homeroom` | — | ✓ Sheets (members) | ✓ Welcome sequence | — |
| A4 | Event RSVP | Form / Raisely webhook | ✓ Events team | ✓ Registrant added | ✓ Calendar (attendee) | ✓ Confirmation email | — |
| A5 | Story content submitted | Google Form | ✓ `#content` | — | ✓ Drive (folder) | — | — |
| A6 | Server/form error (500) | Vercel fn | ✓ `#errors` (P1 ping) | — | — | — | PagerDuty (Phase 2+) |
| A7 | Festival registration | `/api/festival-register` | ✓ `#festival-2026` | ✓ Webinar reg | ✓ Calendar invite | ✓ Festival sequence | — |
| A8 | Homeroom password reset | Admin trigger | — | — | — | ✓ Magic link email | — |
| A9 | Weekly digest | Cron (Monday 8am) | ✓ `#metrics` | — | ✓ Sheets summary | — | — |

---

## Slack — Notification Triggers

### Channels to create

| Channel | Purpose | Audience |
|---------|---------|----------|
| `#homeroom` | New Homeroom member joins; cancellation alert | Core team |
| `#partnerships` | School inquiry submitted | Partnerships lead + exec |
| `#growth` | Newsletter signup spikes; /why shares | Marketing |
| `#events` | New RSVP; Zoom link generated | Events team |
| `#content` | Educator story submitted | Comms team |
| `#errors` | Form submission errors; API failures | Engineering |
| `#metrics` | Weekly automated digest | All staff |

### Slack webhook setup

Each channel gets an Incoming Webhook URL (Slack App → Incoming Webhooks).  
Store as server-only env vars — never in client-side code.

```bash
SLACK_WEBHOOK_PARTNERSHIPS=https://hooks.slack.com/services/...
SLACK_WEBHOOK_HOMEROOM=https://hooks.slack.com/services/...
SLACK_WEBHOOK_GROWTH=https://hooks.slack.com/services/...
SLACK_WEBHOOK_EVENTS=https://hooks.slack.com/services/...
SLACK_WEBHOOK_CONTENT=https://hooks.slack.com/services/...
SLACK_WEBHOOK_ERRORS=https://hooks.slack.com/services/...
SLACK_WEBHOOK_METRICS=https://hooks.slack.com/services/...
```

### Slack message format (Vercel fn → POST to webhook URL)

```json
{
  "text": ":school: New school inquiry from *Lincoln Elementary* — Kenya",
  "blocks": [
    {
      "type": "section",
      "fields": [
        { "type": "mrkdwn", "text": "*School:*\nLincoln Elementary" },
        { "type": "mrkdwn", "text": "*Country:*\nKenya" },
        { "type": "mrkdwn", "text": "*Contact:*\nAnna Mwangi · anna@lincoln.ke" },
        { "type": "mrkdwn", "text": "*Role:*\nPrincipal" }
      ]
    },
    {
      "type": "actions",
      "elements": [
        { "type": "button", "text": { "type": "plain_text", "text": "View in Sheets" },
          "url": "https://docs.google.com/spreadsheets/d/..." },
        { "type": "button", "text": { "type": "plain_text", "text": "Reply via email" },
          "url": "mailto:anna@lincoln.ke" }
      ]
    }
  ]
}
```

### Error alert format (500 / API failure)

```json
{
  "text": ":rotating_light: *FORM ERROR* on `/api/school-inquiry` — 2026-06-23 14:23 UTC",
  "attachments": [{
    "color": "#e53e3e",
    "fields": [
      { "title": "Error", "value": "Flodesk API returned 503", "short": false },
      { "title": "User email", "value": "anna@lincoln.ke", "short": true },
      { "title": "Fallback sent?", "value": "Yes — mailto shown to user", "short": true }
    ]
  }]
}
```

---

## Zoom — Event & Webinar Integration

### Use cases

| Use case | Zoom feature | Trigger | Output |
|----------|-------------|---------|--------|
| Festival 2026 virtual session | Webinar | User registers on site | Unique join link emailed |
| Monthly Homeroom Q&A | Meeting (recurring) | Member RSVP | Calendar invite + Zoom link |
| School discovery call | Meeting (one-off) | Partnerships books via Calendly/form | Zoom link in confirmation email |
| Educator training | Webinar | Email announcement | Registration link in Flodesk email |

### Zoom OAuth app setup

1. Create a **Server-to-Server OAuth app** in Zoom Marketplace (no user login required)
2. Scopes needed: `meeting:write:admin`, `webinar:write:admin`, `webinar:read:admin`
3. Store credentials as server-only env vars:

```bash
ZOOM_ACCOUNT_ID=...
ZOOM_CLIENT_ID=...
ZOOM_CLIENT_SECRET=...
```

### Webinar registration flow

```
User fills event RSVP form
  → POST /api/event-rsvp
      body: { "event_id", "first_name", "last_name", "email", "zoom_webinar_id" }
  → Server:
      1. POST https://api.zoom.us/v2/webinars/{webinar_id}/registrants
         body: { "email", "first_name", "last_name" }
         → returns { "join_url", "registrant_id" }
      2. Store registrant in Google Sheets (RSVP log)
      3. POST Slack webhook → #events channel
      4. Response to browser: success with join_url displayed
      5. Flodesk API — add to "event-attendees" segment → confirmation email with join_url
```

### Zoom environment variables

```bash
ZOOM_ACCOUNT_ID=
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=
ZOOM_FESTIVAL_WEBINAR_ID=    # Pre-created in Zoom Webinars dashboard
```

---

## Google Workspace — Drive, Sheets, Calendar, Forms

### Google Drive — Content workflow

| Folder | Purpose | Access |
|--------|---------|--------|
| `/TCF Website/Stories — Submissions` | Educator story submissions from Google Form | Comms team |
| `/TCF Website/Stories — Published` | Approved stories ready for dev handoff | Comms + Engineering |
| `/TCF Website/Design Assets` | OG images, brand assets, event graphics | Design + Engineering |
| `/TCF Website/Meeting Notes` | Sprint reviews, stakeholder meetings | All team |
| `/TCF Website/Analytics Reports` | Monthly Plausible/GA4 exports | Marketing + Exec |

**Service account:** Create a GCP service account with Drive API write access. Store credentials as `GCP_SERVICE_ACCOUNT_JSON` (already in env var list in TECHNICAL-ARCHITECTURE.md).

### Google Sheets — Lead tracking

| Sheet | Populated by | Columns |
|-------|-------------|---------|
| `School Inquiries` | `/api/school-inquiry` → Vercel fn | timestamp, school_name, contact_name, contact_email, role, country, message, status |
| `Newsletter Signups` | Flodesk webhook or `/api/newsletter` | timestamp, email, first_name, source (UTM) |
| `Event RSVPs` | `/api/event-rsvp` | timestamp, event_name, name, email, zoom_join_url, attended |
| `Homeroom Members` | Keela webhook | timestamp, email, tier, keela_id, country |
| `Weekly Metrics` | Cron job every Monday | sessions, conversions, signups, school_leads, top_page |

**Append row pattern (Vercel fn → Sheets API):**

```typescript
// Using googleapis npm package (server-side only)
const sheets = google.sheets({ version: 'v4', auth });
await sheets.spreadsheets.values.append({
  spreadsheetId: process.env.GOOGLE_SCHOOL_SHEET_ID,
  range: 'Sheet1!A:H',
  valueInputOption: 'USER_ENTERED',
  requestBody: {
    values: [[
      new Date().toISOString(),
      body.school_name,
      body.contact_name,
      body.contact_email,
      body.role ?? '',
      body.country ?? '',
      body.message ?? '',
      'new'   // status
    ]]
  }
});
```

### Google Calendar — Events

| Trigger | Calendar action |
|---------|----------------|
| New event published to /events page | Create public calendar entry via Vercel fn or manual + Make.com |
| Event RSVP confirmed | Add registrant email as attendee (if meeting-style event) |
| Festival webinar scheduled | Create calendar event with Zoom join link in description |

**Calendar env vars:**

```bash
GOOGLE_CALENDAR_ID=       # TCF events calendar ID (e.g., abc123@group.calendar.google.com)
GOOGLE_SCHOOL_SHEET_ID=   # Google Sheets ID for school inquiries
GOOGLE_RSVP_SHEET_ID=     # Google Sheets ID for event RSVPs
GOOGLE_METRICS_SHEET_ID=  # Weekly metrics sheet
```

### Google Forms — School discovery (alternative / Phase 2)

Google Forms can be used as a **no-code alternative** to the custom school inquiry form for:
- Early-stage partnerships conversations before the Astro site is fully live
- Festival workshops requiring structured attendee intake
- Internal team intake (story submission from field staff)

Integration: Google Forms → Google Sheets (automatic native link) → Zapier/Make.com → Slack notification.

---

## Zapier / Make.com — Automation Glue Layer

Use Zapier or Make.com for third-party connections where writing a Vercel Serverless Function is over-engineering:

### Recommended Zapier/Make.com flows

| # | Trigger | Action | Tool | Complexity |
|---|---------|--------|------|------------|
| Z1 | New row in `School Inquiries` Sheets | Post Slack message to `#partnerships` | Make.com | Low |
| Z2 | Flodesk: new subscriber joins `newsletter` segment | Append row to `Newsletter Signups` sheet | Zapier | Low |
| Z3 | Keela: donation confirmed (webhook) | Post to Slack `#homeroom` + append to `Homeroom Members` sheet | Make.com | Medium |
| Z4 | New row in `Event RSVPs` sheet | Send personalised email via Gmail (confirmation) | Zapier | Low |
| Z5 | New file in Drive `Stories — Submissions` | Post Slack message to `#content` | Make.com | Low |
| Z6 | Every Monday 8am | Pull last 7 days from Plausible API → post digest to Slack `#metrics` | Make.com | Medium |
| Z7 | New calendar event created | Post Slack `#events` with event name + link | Zapier | Low |

> **Decision guide:** Write a Vercel fn when the trigger is a user-facing form POST and you need rate limiting, honeypot checks, or an immediate browser response. Use Zapier/Make.com when the trigger is a third-party system event (Keela webhook, Flodesk event, Sheets row) with no browser waiting on the result.

### Recommended platform

| | Zapier | Make.com (Integromat) |
|--|--------|----------------------|
| Best for | Simple 2-step zaps; non-technical team members | Complex multi-step flows; conditional logic; data transformation |
| Free tier | 100 tasks/month | 1,000 operations/month |
| Cost at scale | $~20/month (Starter) | $9/month (Core) |
| Recommended | ✓ If ops team manages it | ✓ If engineer sets it up |

---

## Keela — Webhook & Donation Notifications

Keela supports outbound webhooks for donation events. Configure in Keela Admin → Integrations → Webhooks.

### Events to subscribe to

| Keela event | → Action |
|-------------|---------|
| `donation.completed` | POST to `/api/keela-webhook` → Slack `#homeroom` + Sheets append |
| `recurring.created` | POST to `/api/keela-webhook` → Flodesk: add to `homeroom-members` segment + trigger welcome sequence |
| `recurring.cancelled` | POST to `/api/keela-webhook` → Slack `#homeroom` alert + Flodesk: move to `homeroom-churned` |
| `donation.refunded` | POST to `/api/keela-webhook` → Slack `#errors` alert |

### Webhook handler (Vercel fn — `/api/keela-webhook`)

```typescript
POST /api/keela-webhook
Headers: x-keela-signature: <HMAC-SHA256 of body using KEELA_WEBHOOK_SECRET>

Server:
  1. Verify HMAC signature (reject if invalid — prevents spoofing)
  2. Parse event type
  3. donation.completed / recurring.created:
     → POST to Slack webhook (SLACK_WEBHOOK_HOMEROOM)
     → Append to Homeroom Members Google Sheet
     → POST to Flodesk: add subscriber to 'homeroom-members' segment
  4. recurring.cancelled:
     → POST to Slack #homeroom with cancellation alert
     → Move Flodesk subscriber to 'homeroom-churned' segment
  5. Return 200 OK immediately (Keela retries on non-200)
```

```bash
KEELA_WEBHOOK_SECRET=    # For HMAC verification — from Keela Admin
```

---

## Flodesk — Native Automation Sequences

Flodesk handles email delivery natively. These workflows should be configured directly in Flodesk (no code needed):

| Trigger (Flodesk) | Segment | Sequence |
|-------------------|---------|---------|
| Subscriber added to `newsletter` | newsletter | Welcome email (immediate) → Day 3 story → Day 7 community |
| Subscriber added to `homeroom-members` | homeroom-members | Welcome: you're a Founding Member (immediate) → Day 3 impact story → Day 7 events invite → Monthly digest |
| Subscriber added to `school-inquiry` | school-inquiry | Confirmation: we received your message (immediate) → partnerships team follow-up is manual |
| Subscriber added to `event-attendees` | event-attendees | Confirmation with Zoom link → Day-before reminder → Post-event thank you |
| Subscriber moved to `homeroom-churned` | homeroom-churned | Win-back email (Day 7 after cancellation) |

---

## Full Environment Variable Reference

```bash
# ─── Slack ───────────────────────────────────────────────────────────────────
SLACK_WEBHOOK_PARTNERSHIPS=
SLACK_WEBHOOK_HOMEROOM=
SLACK_WEBHOOK_GROWTH=
SLACK_WEBHOOK_EVENTS=
SLACK_WEBHOOK_CONTENT=
SLACK_WEBHOOK_ERRORS=
SLACK_WEBHOOK_METRICS=

# ─── Zoom ────────────────────────────────────────────────────────────────────
ZOOM_ACCOUNT_ID=
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=
ZOOM_FESTIVAL_WEBINAR_ID=

# ─── Google Workspace ────────────────────────────────────────────────────────
GOOGLE_CALENDAR_ID=
GOOGLE_SCHOOL_SHEET_ID=
GOOGLE_RSVP_SHEET_ID=
GOOGLE_METRICS_SHEET_ID=
# GCP_SERVICE_ACCOUNT_JSON already in TECHNICAL-ARCHITECTURE.md env list

# ─── Keela ───────────────────────────────────────────────────────────────────
KEELA_WEBHOOK_SECRET=

# ─── Flodesk (already listed) ────────────────────────────────────────────────
# FLODESK_API_KEY — see TECHNICAL-ARCHITECTURE.md
```

All vars go in **Vercel project → Settings → Environment Variables**. Never commit values to the repo.

---

## Implementation Sequence — Automation Sprint

```
Phase 1 (with TICKET-070/080):
  Step 1  Slack app + Incoming Webhooks configured (all 7 channels)
  Step 2  /api/school-inquiry → Slack #partnerships + Sheets append
  Step 3  /api/newsletter → Flodesk API (Option B Vercel fn)
  Step 4  Keela webhook handler (/api/keela-webhook) — HMAC verify + Slack + Flodesk

Phase 1.5 (after site launch):
  Step 5  Zoom Server-to-Server OAuth app; Festival webinar ID created
  Step 6  /api/event-rsvp → Zoom registration + Sheets append + Slack #events + Flodesk
  Step 7  Make.com: Keela webhook → Sheets (members) as backup/redundancy
  Step 8  Make.com: Monday cron → Plausible API → Slack #metrics digest

Phase 2 (Homeroom gated hub live):
  Step 9  Magic-link auth → Flodesk trigger
  Step 10 Google Drive service account: story submission workflow
  Step 11 PostHog integration (if funnel A/B testing required)
```

---

## Security Notes

- All webhook secrets (Slack, Keela HMAC) stored in Vercel env only — never in code or Slack messages
- All Zoom credentials are Server-to-Server OAuth — no user login flow, no token in browser
- Google Sheets API calls go through service account (`GCP_SERVICE_ACCOUNT_JSON`) — server-only
- Validate all inbound webhooks (HMAC for Keela; check `User-Agent` for Zoom)
- Rate-limit `/api/event-rsvp` and `/api/keela-webhook` at Vercel edge (5 req / 15 min / IP)

---

## Related Documents

| Need | Document |
|------|----------|
| Full stack and env var baseline | `docs/planning/TECHNICAL-ARCHITECTURE.md` |
| Form API specs (`/api/newsletter`, `/api/school-inquiry`) | `docs/TECH-BRIEF.md` |
| Flodesk email sequence content | `docs/GROWTH-BRIEF.md` (Section 2 — User Journeys) |
| Feature tickets for analytics and integrations | `docs/planning/FEATURE-TICKETS.md` (TICKET-070, TICKET-080) |
| Security and access rules | `docs/planning/SECURITY-AND-ACCESS.md` |
