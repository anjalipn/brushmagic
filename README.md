# Brushmagic

A simple, private gallery website for showcasing your daughter's artwork. No login,
no database, no tracking — just files you edit.

## Adding new artwork

### Option A: the script (recommended)

Run this from the project folder, pointing it at the photo wherever it is on your
computer (Desktop, Downloads, Photos export, etc.):

```bash
python3 scripts/add_artwork.py ~/Desktop/photo.jpg \
  --title "Rainbow Dragon" \
  --age 6 \
  --date 2026-07-15 \
  --medium "Crayon and marker" \
  --description "A dragon that breathes rainbows instead of fire."
```

It copies the photo into `images/art/` and adds the entry to
`js/artworks-data.js` for you — no manual editing needed.

You can also just run `python3 scripts/add_artwork.py ~/Desktop/photo.jpg` with no
other flags and it'll ask you for the title, age, date, etc. one at a time.

Once you've added a few real pieces, remove the placeholder "Sample:" entries:

```bash
python3 scripts/add_artwork.py --remove-samples
```

(You can also pass `--remove-samples` together with an add command to add a piece
and clean up the samples in one step.)

### Option B: editing the file by hand

1. Put the photo in `images/art/` (e.g. `images/art/rainbow-dragon.jpg`).
2. Open `js/artworks-data.js` and add a new entry to the `ARTWORKS` list:

   ```js
   {
     title: "Rainbow Dragon",
     image: "images/art/rainbow-dragon.jpg",
     placeholderColor: null,
     date: "2026-07-01",
     age: 6,
     medium: "Crayon and marker",
     description: "A dragon that breathes rainbows instead of fire."
   }
   ```
3. Delete the "Sample:" entries once you've added a few real ones.
4. Save, refresh the page — done. Filters (by age) update automatically.

## Editing the "About" section

Open `index.html` and edit the text inside `<section class="about-section">`.
Add a real photo by uncommenting the `<img>` tag and pointing it at a file in
`images/profile/`.

## Previewing locally

Just double-click `index.html` to open it in a browser, or for the best experience
run a tiny local server from this folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Publishing it for free

Any static hosting works since there's no backend. Easiest options:

- **Netlify Drop** — go to https://app.netlify.com/drop and drag this whole folder in.
  Gives you a free URL in seconds; you can add a custom domain later.
- **GitHub Pages** — push this folder to a GitHub repo and enable Pages in the repo
  settings.
- **Vercel** — `vercel deploy` from this folder (needs the Vercel CLI).

## Privacy notes (this site involves a child's photos)

- The `<meta name="robots" content="noindex, nofollow">` tag in `index.html` asks
  search engines not to index the site. Keep it unless you want the site to be
  publicly searchable.
- No cookies, analytics, or third-party scripts are loaded — the site makes zero
  outside network requests, so there's nothing to be GDPR-compliant *about* beyond
  the photos/text you choose to publish.
- Consider using a first name only (not a full name) and avoiding identifying
  details like school name or location in captions.
- If you want it more private than "unlisted," most static hosts (Netlify, Vercel)
  offer free password-protection on the free tier, or you can keep the link
  unlisted and only share it with family.
