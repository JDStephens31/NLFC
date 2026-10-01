# New Life Family Church — Website

A static site (plain HTML/CSS/JS, no build step). Open `index.html` in a browser,
or drop the whole folder onto Netlify / GitHub Pages / any web host.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, service times, vision, pastor intro, first-visit steps |
| `about.html` | Our Vision (full text from `content/Our Vision.txt`) |
| `pastor.html` | Meet Our Pastor (full text from `content/My Pastor.txt`), plus Luke, Jon & Nic |
| `visit.html` | Service times, what a Sunday looks like, FAQ |
| `contact.html` | Church details, phone, Facebook, map |

## Assets

```
assets/css/styles.css     all styling; design tokens are at the top
assets/js/main.js         mobile nav, sticky header, hero sunrise, scroll reveal, year
assets/img/logo.png       the church logo (supplied, full size — source file, not loaded by pages)
assets/img/logo-128.png   header/footer logo (resized from logo.png)
assets/img/favicon-32.png, apple-touch-icon.png, logo-512.png   browser/phone icons
assets/img/pastor-will-stephens.jpg  Pastor Will photo (copy of "Meet our pastor.jpg")
assets/img/luke-jon-nic.jpg          Luke, Jon & Nic photo (jon_nic_luke.jpg, border cropped)
assets/img/hero-scape.svg the rolling-hills illustration used in every hero
```

## Colors

Sampled from the logo and defined as CSS custom properties in `:root`:

| Token | Value | Where it shows |
| --- | --- | --- |
| `--ink` | `#0b1f4d` | Headings, footer background |
| `--navy` / `--navy-deep` | `#00419a` / `#002f73` | Logo lettering blue — hero cards, CTA banners, links |
| `--gold` / `--gold-bright` | `#fcb316` / `#fec52e` | Logo sun — buttons, accents, sunrise rays |
| `--sage` / `--pine` | `#63b423` / `#0a5a32` | Logo hills and pines — secondary bands |
| `--cream` / `--paper` | `#fdfaf2` / `#f6f1e3` | Page and alternating section backgrounds |

The landscape illustrations (`hero-scape.svg` and the inline SVGs in `index.html`
and `visit.html`) use the logo's teal-blue mountains (`#016a93`), green hills
(`#2f8f3a`, `#63b423`), and pine trees (`#03532f`).

Change a value in `:root` and it updates everywhere.

## Before this goes live — placeholders to replace

These are invented stand-ins, not real church data. Search and replace each
across all five HTML files:

- **Facebook link** — the Facebook icon in every footer (and the link on
  `contact.html`) points at `#`. Search for `aria-label="Facebook"` and replace
  the `href` with the church's page URL.

## SEO

Already in place on every page:

- A unique `<title>` and meta description with the church name, "Campton, KY",
  and (where it fits) the service time, address, or phone number.
- Open Graph / Twitter tags so links shared on Facebook or in texts get a proper
  title and description.
- `Church` structured data (JSON-LD) with the name, address, and phone, plus a
  `Person` block for Pastor Will on `pastor.html`.
- Image `width`/`height` attributes, a small header logo instead of the 1.6 MB
  original, and `robots.txt`.

Still to do once the site has its web address (e.g. `https://example.org`):

- Add `<link rel="canonical" href="https://…/page.html">` and `og:url` to each page.
- Add `og:image` pointing at an absolute URL for `assets/img/logo-512.png` (or a
  1200×630 photo), and switch `twitter:card` to `summary_large_image` if it's a photo.
- Add `"url"`, `"logo"`, and `"sameAs": ["<Facebook URL>"]` to the `Church` JSON-LD.
- Create `sitemap.xml` and add a `Sitemap:` line to `robots.txt`.
- Claim the church on **Google Business Profile** with the same name, address, and
  phone — that drives the map results for "church near me" far more than anything
  on the site itself.

When uploading, leave out the working files: `Mockup/`, `content/`, the `.txt`
files in the root, and the unused originals (`jon_nic_luke.jpg`, `Meet our pastor.jpg`).

## Photography

The pastor sections (`index.html`, `pastor.html`) and the Luke, Jon & Nic section
(`pastor.html`) use real photos. The other decorative panels (`.frame`) still hold
inline SVG illustrations. To swap one for a picture, replace the `<svg>` inside a
`.frame` with an `<img>`. It fills the frame automatically, and the optional
`--focus` sets which part of the photo stays in view when it's cropped:

```html
<img src="assets/img/your-photo.jpg" alt="Describe the photo" style="--focus: 50% 25%">
```

Good candidates: the congregation on a Sunday and the building exterior.

## The scroll-driven sunrise

Every hero is a small scene: night sky, a sun tucked behind the ridgeline, the
hills, then a warm light wash. As the hero scrolls past, `main.js` writes a
single custom property — `--sunrise`, running `0` → `1` — onto any element
marked `data-sunrise`. Each layer in `styles.css` reads that one number, so the
sun climbs, the rays fan out and rotate, the sky warms, and the hills catch the
light together.

To tune it, edit these in `styles.css` (section 7):

- `.hero-sun { transform: … }` — how far the sun travels. The second number in
  `calc(42% - var(--sunrise) * 84%)` is the distance; raising it makes the sun
  climb higher. Keep it low enough that the sun stays clear of the headline.
- `.hero-sky { background: … }` — how warm the sky gets at full sunrise.
- `.hero-wash { opacity / background }` — the light spilling across the hills.

The pace is set in `main.js` by `rect.height * 0.85` — the sun finishes its arc
once the hero has scrolled 85% of its own height past the top of the screen.

Visitors who set "reduce motion" in their OS get the scene already lit, with no
scroll animation at all.

## Notes

- Fonts are Fraunces + Inter, loaded from Google Fonts. If you'd rather not
  depend on an external request, download them into `assets/fonts/` and swap the
  `<link>` for an `@font-face` block.
- The site works with JavaScript disabled; `main.js` only adds the mobile menu,
  the sunrise, scroll animations, and the footer year. Without it the hero simply
  renders in its pre-dawn state.
- Laid out fluidly from 320px up — no fixed widths, and every grid collapses on
  its own. Verified at 320, 375, 504, 780, and 1440px.
- Motion is disabled automatically for visitors who set "reduce motion" in their
  OS settings.
