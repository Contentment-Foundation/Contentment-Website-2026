# Story Board — Content & Media Feed Guide

How to add educator and student stories (photos, quotes, and video) to the **Story Board** and **Foundation Reach map** prototypes.

| | |
|---|---|
| **Story Board** | `site/story-board.html` · [contentmentweb2.netlify.app/story-board](https://contentmentweb2.netlify.app/story-board) |
| **Feed guide (team)** | `site/story-board-feed-guide.html` · `/story-board-feed-guide` |
| **Data file (today)** | `site/program-data.js` |
| **Status** | Phase 1 — manual data + Google Drive & YouTube links |

---

## Overview

Both prototypes read from **one shared data file**: `site/program-data.js`. When you add or update a story there, it appears on:

- the **Story Board** (hanging cards + full-story modal)
- the **Foundation Reach map** (country popup + slide-out story list)

### Roadmap

| Phase | Who updates content | Media | Publishing |
|-------|---------------------|-------|------------|
| **Now (Phase 1)** | Developer or technical volunteer | Google Drive image links, YouTube URLs | Edit `program-data.js`, deploy via Netlify |
| **Next (Phase 2)** | Program / comms staff via admin portal | Upload or link in portal; auto-optimized images | Portal saves to database → site pulls JSON at build or runtime |

This guide covers **Phase 1** in detail and sketches **Phase 2** so non-technical teammates know what is coming.

---

## Story fields (reference)

Each story is an object inside a country’s `stories` array in `PROGRAM`.

```js
{
  q: "Short headline quote — shown on the card and in the modal.",
  text: "1–2 sentence teaser (optional; defaults to q).",
  full: "Full story for the modal (optional; auto-filled from text if omitted).",
  by: "Name, role, location — e.g. Maria S., Principal, Ohio",
  role: "educator" | "student",
  img: "https://… direct image URL (Google Drive, CDN, or site/assets/)",
  cap: "Photo caption under the image (optional).",
  video: "https://www.youtube.com/watch?v=… (optional)"
}
```

| Field | Required | Used on Story Board | Used on map |
|-------|----------|---------------------|-------------|
| `q` | Yes | Card quote, modal headline | Popup quote |
| `text` | No | — | Teaser in list |
| `full` | No | Modal body | Expanded story |
| `by` | Yes | Attribution | Attribution |
| `role` | No* | Filter (Educator / Student) | Role label |
| `img` | No* | Card photo, modal image | Thumbnail |
| `cap` | No | Modal caption | — |
| `video` | No | ▶ badge on card; YouTube in modal (when set) | Play indicator |

\*If omitted, the file auto-fills placeholders (`role`, colored placeholder `img`, `cap`, `full`) for team review. **Replace these before launch.**

### Where stories live in the file

- **Country stories** — under `PROGRAM["Country Name"].stories`
- **City pin stories** — under keys like `PROGRAM["__Mumbai"]` (used by the map pin; also appear on the Story Board)

Country keys must match the map’s country names (e.g. `"United States of America"`, not `"USA"`).

---

## Phase 1 — Google Drive (photos)

### Recommended folder structure

Create a shared Google Drive folder, e.g.:

```
Contentment — Story Board Media/
  ├── Educators/
  │     ├── us-maria-s-principal.jpg
  │     └── …
  ├── Students/
  │     └── …
  └── _consent-forms/   (internal only — not linked on the site)
```

Use clear filenames: `country-shortname-role.jpg` (e.g. `kenya-aisha-teacher.jpg`).

### Sharing settings

1. Upload the image to the shared folder.
2. Right-click → **Share** → **General access**: *Anyone with the link* → **Viewer**.
3. Copy the share link. It looks like:
   `https://drive.google.com/file/d/1ABC…xyz/view?usp=sharing`

### Convert to a direct image URL

The website needs a **direct image URL**, not the Drive preview page.

**From the share link**, take the file ID (the long string between `/d/` and `/view`):

```
https://drive.google.com/file/d/FILE_ID_HERE/view
```

**Use this format in `img`:**

```
https://drive.google.com/uc?export=view&id=FILE_ID_HERE
```

**Example in `program-data.js`:**

```js
{
  q: "The curriculum changed how our whole school handles conflict.",
  by: "Maria S., Principal, Ohio",
  role: "educator",
  img: "https://drive.google.com/uc?export=view&id=1ABCxyz_EXAMPLE_ID",
  cap: "Maria leading a restorative circle, Columbus, 2025",
  text: "Before the program, disagreements ended in the office…",
  full: "Before the program, every disagreement seemed to end in my office…"
}
```

### Troubleshooting Drive images

| Problem | Fix |
|---------|-----|
| Broken image on site | Confirm link is *Anyone with the link*; use `uc?export=view&id=` format |
| Image loads in browser but not on Netlify | Drive sometimes blocks hotlinking; re-share or use Phase 2 CDN upload |
| Slow load | Prefer JPG/WebP under ~500 KB; resize before upload |

**Long-term:** Phase 2 portal will copy images to a fast CDN (Vercel Blob, Cloudinary, or similar) so Drive is only the staging area.

---

## Phase 1 — YouTube (video)

### When to use video

- Educator or student **interview clips**
- **Classroom b-roll** with voice-over quote
- **Event highlights** (assemblies, trainings)

Each story can have **one photo** (`img`) and **optionally** one **video** (`video`).

### Getting the URL

From YouTube:

- Full URL: `https://www.youtube.com/watch?v=dQw4j8KnQ0Y`
- Short URL: `https://youtu.be/dQw4j8KnQ0Y`

Paste either into the `video` field. The Story Board shows a **▶** on the card when `video` is set.

### Thumbnail / poster image

For best results, set **both** `video` and `img`:

- **`img`** — Google Drive photo (preferred) or YouTube thumbnail:
  `https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg`
- **`video`** — YouTube watch URL

```js
{
  q: "I used to feel like a volcano. Now I know how to breathe first.",
  by: "Jayden, age 11, Texas",
  role: "student",
  img: "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg",
  video: "https://www.youtube.com/watch?v=VIDEO_ID",
  cap: "Jayden after morning check-in, spring 2025",
  text: "When I get really mad I do the four-corner breathing…",
  full: "…"
}
```

### YouTube checklist

- Video must be **Public** or **Unlisted** (not Private)
- Confirm **consent** for minors on camera (see below)
- Add **captions** on YouTube for accessibility

---

## Step-by-step — add a new story (Phase 1)

1. **Collect content** — quote, full story, attribution, role, country (and city if map pin).
2. **Add media to Drive** — photo (required for launch); optional YouTube upload.
3. **Get URLs** — Drive direct `img` link; YouTube `video` link if applicable.
4. **Open** `site/program-data.js` — find the right country (or `__City` key).
5. **Append** a story object to that country’s `stories` array (comma after previous entry).
6. **Preview locally:**
   ```bash
   cd site && python3 -m http.server 8080
   ```
   Open http://localhost:8080/story-board and http://localhost:8080/foundation-reach-map (clean URLs match Netlify).
7. **Deploy** — push to `main`; Netlify rebuilds. Live: `/story-board`, `/foundation-reach-map` on contentmentweb2.netlify.app.

---

## Consent, privacy & quality

Before publishing real names, faces, or voices:

- [ ] Signed **media release** on file (especially for students under 18)
- [ ] **First name + last initial** or first name only for students, per school policy
- [ ] No **identifying details** the family would not want public (addresses, school names if restricted)
- [ ] Photo is **well lit**, respectful, and representative
- [ ] Quote is **accurate** and approved by the speaker or school lead
- [ ] **Captions** for video; **alt text** via descriptive `cap` for photos

Internal consent PDFs stay in Drive `_consent-forms/` — never linked in `program-data.js`.

---

## Phase 2 — Admin portal (planned)

Goal: **non-technical staff** can add, edit, and unpublish stories without touching code or JSON.

### Intended workflow

```
Staff logs in → New story form
  → Pick country / city, role, quote, full text, attribution
  → Upload photo OR paste Drive / YouTube link
  → Preview (same card + modal as Story Board)
  → Submit for review
Reviewer approves → Published to live feed
```

### Portal features (target)

| Feature | Benefit |
|---------|---------|
| Simple story form | No JSON, no Git |
| Media library | Reuse photos; auto-resize and CDN upload |
| Drive / YouTube import | Paste link → portal fetches thumbnail and stores embed ID |
| Draft / review / published | Comms reviews before go-live |
| Country & region tags | Syncs with map and Story Board filters |
| Unpublish / archive | Remove outdated stories without redeploying whole site |

### Technical direction (for developers)

- **Storage:** Supabase or similar (stories table + media metadata)
- **Auth:** Google Workspace SSO for `@contentment.org`
- **API:** `GET /api/stories` → JSON matching today’s story shape
- **Site integration:** Astro build fetches JSON, or client-side fetch with cache
- **Migration:** One-time import from `program-data.js` → database

Until the portal ships, **`site/program-data.js` remains the source of truth.**

---

## Quick copy-paste template

```js
{
  q: "",
  text: "",
  full: "",
  by: "",
  role: "educator",
  img: "https://drive.google.com/uc?export=view&id=",
  cap: "",
  video: ""
},
```

Remove `video` entirely if there is no clip.

---

## Who to contact

| Question | Contact |
|----------|---------|
| Adding stories, Drive/YouTube links | Program / comms lead |
| Technical edit or deploy | somesh@contentment.org |
| Consent or privacy | hello@contentment.org |

---

*Last updated: July 2026 · Story Board design prototype*
