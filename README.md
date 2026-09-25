# Alex Neilson Studio — Portfolio Site

A Next.js 14 (App Router) + TypeScript + Tailwind CSS rebuild of the
sidebar-nav / masonry-grid portfolio layout: a homepage with one card
per category, and each category's own page showing every image of that
category's work, plus a working contact form.

There's no separate "project" page — clicking a category card on the
homepage goes straight to that category's full image gallery, nothing
in between.

All content (images) is placeholder — see "5. Add your real content"
below to swap it for your own work. Images are hosted on **Cloudinary**
(free) rather than bundled into the site, so swapping a picture is
just: upload to Cloudinary, paste the URL into one file, push.

---

## 1. Prerequisites

You only need two things installed on your computer:

1. **Node.js** — version 18.18 or newer (20 LTS recommended).
   Download from https://nodejs.org (choose the "LTS" version) and install it.
   Node comes bundled with **npm**, which you'll also need.
2. A code editor, e.g. **VS Code** (https://code.visualstudio.com) — optional
   but recommended if you'll be editing content.

To check you have Node and npm installed, open a terminal (Terminal on
Mac/Linux, Command Prompt or PowerShell on Windows) and run:

```bash
node -v
npm -v
```

Both should print a version number. If they error with "command not
found", reinstall Node.js and restart your terminal.

---

## 2. Get the code onto your computer

Unzip the folder you downloaded (`portfolio-site.zip`) anywhere convenient,
e.g. your Desktop or a `~/projects` folder. Then open a terminal **inside
that folder**:

```bash
cd path/to/portfolio-site
```

(On Mac, you can drag the folder onto the Terminal window after typing
`cd ` to auto-fill the path.)

---

## 3. Install dependencies

Still inside the project folder, run:

```bash
npm install
```

This downloads Next.js, React, Tailwind and the other packages listed in
`package.json` into a new `node_modules` folder. It takes 10–60 seconds
depending on your connection. You only need to do this once (and again
any time you change `package.json`).

---

## 4. Run it locally

```bash
npm run dev
```

You'll see output ending in something like:

```
▲ Next.js 14.2.35
- Local: http://localhost:3000
✓ Ready in 1.2s
```

Open **http://localhost:3000** in your browser. You should see the site:
sidebar on the left with your category links, homepage grid of 7 category
cards on the right. Click any card — it goes straight to that category's
full image gallery. Try the contact page too.

The dev server has hot-reload: edit any file and save, and the browser
updates automatically. Stop the server anytime with `Ctrl + C` in the
terminal.

---

## 5. Add your real content

There are two independent kinds of images per category:
- **The cover** — the single image shown on that category's card, on
  the homepage and in "You may also like". Set once per category,
  directly in the code (only 7 of these total, so this is a one-time
  setup, not something you'll touch often).
- **The gallery** — every image of that category's actual work, shown
  on that category's own page. **This part is fully automatic** — the
  site pulls every image straight from a Cloudinary folder. Your
  client (or you) just drags images into the right folder on
  Cloudinary; no code, no per-image editing, ever, no matter whether
  that's 2 images or 20.

### 5a. Create your free Cloudinary account

1. Go to https://cloudinary.com and sign up (free tier is plenty for a
   portfolio — 25 GB storage/bandwidth).
2. Once logged in, you'll land on the **Dashboard**. You'll need three
   things from this page in a moment: **Cloud name**, **API Key**, and
   **API Secret** (click "reveal" next to API Secret to see it).

### 5b. Create one folder per category — plus a cover folder for each

In Cloudinary's **Media Library**, create a folder for each category —
**the folder name has to exactly match that category's slug** (the
`slug` field in `lib/data.ts`, lowercase, hyphens not spaces):

```
branding/
fashion-studio/
social-media/
magazine-cover/
logos/
wedding/
typography/
```

Then create one more parent folder called `covers`, and inside it, one
subfolder per category, same slugs:

```
covers/
  branding/
  fashion-studio/
  social-media/
  magazine-cover/
  logos/
  wedding/
  typography/
```

These `covers/<slug>` folders are for the single image used on that
category's home-page card (and in "You may also like") — put exactly
**one** image in each. The plain top-level folders (`branding/` etc.)
are that category's full gallery, shown on its own page — put as many
images in those as you actually have.

This folder naming is the only rule that matters. From now on, adding
or replacing an image in any of these folders — gallery or cover — is
the entire content-update process, no code involved.

**Note if you're curious why an uploaded image's URL doesn't show its
folder name** (e.g. `.../upload/v1234567890/my-photo.jpg` with no
`branding/` in it) — that's expected on every Cloudinary account
created since mid-2024. Folders are just organizational labels now,
separate from the file's actual web address. The site already accounts
for this (it asks Cloudinary "what's in this folder?" directly, rather
than guessing from the URL), so it works correctly either way — you
don't need to do anything differently.

### 5c. Connect the site to Cloudinary

Copy `.env.example` to `.env.local` (same folder as `package.json`):

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the three values from step 5a:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Restart `npm run dev` if it's running. Upload a test image into, say,
the `branding` folder, wait a few seconds, then visit
http://localhost:3000/work/branding — it should be there. (Locally,
you'll see it on the next page load; in production it refreshes at
most every 5 minutes automatically — see the note below.)

**`CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are private** —
notice they don't start with `NEXT_PUBLIC_`, unlike some other env
vars you might see elsewhere. Never commit `.env.local` (it's already
gitignored) and never paste these into client-facing code.

### 5d. Set each category's cover image

Upload one image into that category's `covers/<slug>` folder (from
step 5b) — that's it, the card picks it up automatically, same as the
gallery does. Its height in the grid is set automatically too, from
the image's real dimensions, so it's never oddly cropped.

**If you'd rather hardcode a cover in code instead** (e.g. you want it
pinned to something specific regardless of what's in Cloudinary, or
you're testing locally before setting up the `covers` folders), open
**`lib/data.ts`** and find the `COVERS` object (a little further down
than `CATEGORIES`) — it starts out empty:

```ts
const COVERS: Partial<Record<string, GalleryImage>> = {
  // branding: { src: "...", c1: "#5b6b4f", c2: "#3a4a34", ratio: 1.3 },
};
```

Add an entry keyed by that category's slug:

```ts
const COVERS: Partial<Record<string, GalleryImage>> = {
  branding: {
    src: "https://res.cloudinary.com/your-cloud-name/image/upload/v.../branding-cover.jpg",
    c1: "#5b6b4f",
    c2: "#3a4a34",
    ratio: 1.3,
  },
};
```

This is a fallback, in priority order: a real image in that category's
`covers/<slug>` Cloudinary folder wins if one exists; otherwise a
`COVERS` entry here is used if you added one; otherwise it falls back
to a gradient placeholder. Note this `COVERS` object is a separate spot
from `CATEGORIES` at the top of the file, which only holds each
category's `slug`/`title` — don't try adding `cover` there directly,
TypeScript will flag it as an unknown property. Also note that unlike
the Cloudinary-folder route, a manually hardcoded `ratio` here is a
guess, not measured from the real image — if the card looks cropped
oddly, that's usually a sign the number doesn't match the image; the
`covers/<slug>` folder route avoids this entirely since it's measured
automatically.

### How "automatic" actually works

The category page asks Cloudinary "what's in this folder?" and renders
whatever comes back — so uploading a new image really is the whole
update. In production, that check is cached for 5 minutes at a time
(so the site isn't hammering Cloudinary on every single visitor) —
meaning a newly uploaded image shows up live on the site within about
5 minutes, with no redeploy, no `git push`, nothing for you to do.
Locally with `npm run dev` it's even simpler: every page load re-checks.

If a category's Cloudinary folder is empty (or the env vars above
aren't set yet), that category quietly falls back to a few gradient
placeholders instead of showing a blank page — useful while you're
still setting things up, and it self-corrects the moment real images
exist in that folder.

### Text

| What | File |
|---|---|
| Name in the sidebar logo ("Alex" / "Neilson") | `components/Logo.tsx` |
| Tagline under the logo ("GRAPHIC & BRAND DESIGN") | `components/Sidebar.tsx` |
| Homepage heading + subtext | `app/page.tsx` |
| Browser tab title / meta description | `app/layout.tsx` (the `metadata` object) |
| Category names in the sidebar nav | `lib/data.ts` (the `CATEGORIES` array — renaming here updates the nav, the URL, and every page automatically; if you rename a category, rename its Cloudinary folder to match) |
| Contact page heading/copy | `app/contact/page.tsx` |
| Number of "You may also like" categories shown | `app/work/[slug]/page.tsx` (the `getOtherCategories(params.slug, 4)` call — change the `4`) |
| How often the gallery re-checks Cloudinary | `app/work/[slug]/page.tsx` (`export const revalidate = 300;` — in seconds) |

### Fonts

Fonts are loaded in **`app/layout.tsx`**:

```ts
import { Fraunces, Inter } from "next/font/google";

const fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-fraunces" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter" });
```

To swap either one, replace the import name with any other
[Google Font](https://fonts.google.com) (e.g. `import { Playfair_Display } from "next/font/google"`)
and update the two `const` declarations to match — keep the same
`variable` name (`--font-fraunces` / `--font-inter`) so you don't have
to touch anything else. Fraunces is the serif used for headings/logo;
Inter is the sans-serif used for body text and UI. The mapping from
those CSS variables to Tailwind's `font-serif` / `font-sans` utility
classes lives in **`tailwind.config.ts`** if you want to rename them.

---

## 6. Build for production (optional, good to test before deploying)

```bash
npm run build
npm run start
```

`build` compiles an optimized production version; `start` serves that
build at http://localhost:3000 the same way it'll run once deployed.

---

## 7. Push it to GitHub

1. Create a new repository on https://github.com (click the "+" in the
   top right → "New repository"). Leave it empty (no README, no
   .gitignore — you already have your own).
2. Back in your terminal, inside the project folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

(Replace the URL with the one GitHub shows you after creating the repo.)
The `.gitignore` file already excludes `node_modules` and build output,
so only your source code gets pushed.

---

## 8. Deploy on Render (free)

1. Go to https://render.com and sign up/log in (you can sign in with
   GitHub directly).
2. Click **New +** → **Web Service**.
3. Connect your GitHub account if prompted, then select the repository
   you just pushed.
4. Render will detect it's a Node project. Set:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: Free
5. Before deploying, add your Cloudinary credentials under the
   **Environment** tab (same three values as your local `.env.local`):
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
6. Click **Create Web Service**. Render will install, build, and deploy —
   this takes a few minutes the first time. You'll get a live URL like
   `https://your-site.onrender.com`.

**Note on the free tier**: Render's free web services spin down after
~15 minutes of no traffic. The next visitor after that will see a
~30-second cold start while it spins back up. This is normal on the
free tier and fine for a portfolio — just know it's not instant if it
hasn't been visited in a while.

Once deployed, category galleries update themselves straight from
Cloudinary (see section 5) — you generally won't need to `git push`
again just to change images. You'd only redeploy for things like
updating a category's cover image or editing site text.

---

## 9. Wiring up the contact form (optional)

Right now, submitting the contact form validates the input and logs it
on the server, but doesn't send you an email. To make it actually send
mail, see the comment in `app/api/contact/route.ts` for a ready-to-use
Resend (https://resend.com) example — sign up for a free API key, add
it as an environment variable (`RESEND_API_KEY`) both in a local
`.env.local` file and in Render's dashboard under your service's
"Environment" tab, and uncomment the example code.

---

## Project structure

```
app/
  layout.tsx              → sidebar + fonts + page shell (every page)
  page.tsx                → homepage (7 category cards)
  work/[slug]/page.tsx     → a category's own page: its full gallery + "You may also like"
  contact/page.tsx        → contact page
  api/contact/route.ts    → contact form backend (stub)
components/
  Sidebar.tsx              → left nav + mobile drawer
  Logo.tsx                 → "Alex / Neilson" wordmark
  PageShell.tsx            → fixed header + independently scrollable content, shared by home/category pages
  CategoryCard.tsx          → one clickable card linking to a category (home + "You may also like")
  CategoryCardGrid.tsx      → masonry grid of CategoryCards
  GalleryGrid.tsx           → masonry grid of a category's own (non-clickable) images
  ContactForm.tsx          → contact form + submit logic
lib/
  data.ts                  → categories + cover images + placeholder gradients (edit for cover images/text)
  cloudinary.ts             → fetches each category's gallery live from its Cloudinary folder
```
