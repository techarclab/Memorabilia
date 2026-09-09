# Memorabilia — website

A React single-page application for Memorabilia's corporate gifting catalogue: 367
gift-set SKUs drawn from the seventeen line sheets, plus 505 single products across
fourteen supplier ranges, a browse-by-category system, a quote list in place of a
cart, and the motion layer that carries the brand.

**Memorabilia is bulk-only, and the site publishes no prices.** Every figure moves
with quantity, branding method, colourway split and timeline, so a number printed on
a product card would be wrong for almost everyone reading it. The site collects a
brief instead; the quote comes back by email within a working day. There is no cart,
no checkout, no rate card and no price field in the data.

---

## Stack

| Layer | Choice |
|---|---|
| Build | Vite 5 |
| UI | React 18 + TypeScript 5.6 |
| Styling | Tailwind CSS 3.4 + the JPP design system (`src/styles/jpp.css`) |
| Components | shadcn/ui primitives (Radix UI + CVA + tailwind-merge) |
| Routing | React Router 6 |
| Data fetching | TanStack Query 5 (wired and ready — the catalogue is currently local) |
| Icons | A hand-drawn set in `src/lib/icons.tsx`, plus lucide-react where useful |

Frontend only. There is no server: the catalogue ships as data with the bundle,
and the two forms are stubs. Point them at a CRM, an inbox or a serverless
function when the client picks one.

## Running it

```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # → dist/
npm run preview  # serve the production build
```

`dist/` is a static site. Any host will serve it — Netlify, Vercel, S3,
cPanel — with one requirement: **rewrite all unknown paths to `index.html`**,
because routing happens in the browser. On Apache that is a two-line
`.htaccess`; on Netlify a `_redirects` file containing `/* /index.html 200`.

## Layout

```
src/
  data/catalog.ts        367 SKUs, branding methods, colour tokens
  data/categories.ts     the category system — every count computed from the data
  data/ranges.ts         the fourteen supplier ranges, and their spec facets
  data/rangeRows.json    505 range products + 16 grid sheets, as compact arrays
  data/rows.json         the catalogue itself, as compact arrays
  types.ts               Product, BrandingMethod, BasketLine
  store/StoreContext.tsx the quote list, persisted to localStorage
  hooks/useMotion.ts     reveals, counters, split headlines, magnetics, ambient tone
  lib/icons.tsx          the icon set
  components/            layout, product card, quick view, drawer, forms
  pages/                 one file per route
  styles/jpp.css         the design system — tokens, components, motion
  styles/react.css       the few rules specific to this build
public/assets/img/       367 product photographs, WebP, 1040×690
public/assets/img/ranges/  514 catalogue pages, WebP, 1400px long edge
```

### Brand name vs. product codes

The brand shown to visitors is **Memorabilia**. Product codes keep the `JPP`
prefix — `JPP B5001`, `JPP 3041` — because that is what is printed on the line
sheets and on the boxes, and buyers order against it. Changing the displayed
brand does not change a single SKU. If the codes are ever re-issued, they live
in one place: `src/data/rows.json`, first field of each row.

### The home page's motion

Four things move, and each one is carrying an argument rather than decorating one.

**The catalogue marquee** — two rows of real product shots drifting in opposite
directions. "872 products" is a number a visitor skims; sixty photographs sliding past
is the same fact arriving through the eyes. It pauses on hover so it never fights a
click, and the tiles use their own small stills (`public/assets/img/thumb/`) because 32
full product photographs is about 3 MB of decoration.

**The size story** (`SizeStory.tsx`) — the section is four viewports tall with its
contents pinned, so scrolling advances the same cover design from a two-piece set to a
five. It is the range's whole proposition — choose the look first, then the budget per
head — and scrolling it lands in a way a paragraph never does, because the photograph
changes and the cover does not. Below 1080px nothing is pinned, so the steps are
buttons and you tap through the same story. Under `prefers-reduced-motion` it settles
on the five-piece and reads as a normal split feature.

**The brief builder** (`BriefBuilder.tsx`) — four questions, answered from the
catalogue itself. The count is a live filter over the gift sets, the three thumbnails
are the sets it found, and the button opens the catalogue already filtered so nothing
is chosen twice. A test asserts the number it promises is the number the catalogue
then shows. The headcount deliberately filters nothing, because it does not change
which sets exist — it is used to say whether the run clears the 25-piece minimum.

**Tilt, sheen and reveals** — a couple of degrees of tilt on the category tiles, one
slow sheen across the primary button, and the existing scroll reveals. Small on
purpose: four degrees reads as the card noticing you, ten reads as a demo of a tilt
library.

Every one of these is a no-op under `prefers-reduced-motion`, and a test checks that
rather than trusting it.

### Ranges

`/ranges` holds fourteen supplier catalogues — bags, bottles, mugs, diaries, pens,
keychains, card holders, desk pieces, electronics, festive hampers and more. They sit
apart from the gift sets deliberately: a gift set is chosen by piece count and series,
a bottle by millilitres, and one grid would leave half the sidebar meaningless for
half the results.

Three of the fourteen books lay several SKUs out per page. Those are browsed by the
sheet rather than split into invented single-product entries.

**On the codes.** These catalogues arrived as flat images with no text layer, so every
code, name and spec was read by OCR from the page. `codeSource` on each row records how
it was arrived at — read, inferred from an unambiguous numbering gap, taken from a
page rule confirmed across the whole book, or checked by eye. `RANGES-REVIEW.md` lists
everything that was not simply read, for checking against the printed line sheet before
launch. The page image beside each product is the original and is never edited.

The whole section is a lazily-loaded route, so a visitor who only came for the gift
sets never downloads the 505 products' worth of codes and specs.

### Categories

`src/data/categories.ts` builds every category from the catalogue rather than by
hand, for one reason: a tile that promises "4-in-1 Sets" and lands on an empty
grid is worse than no tile at all. The count on each tile is the real number of
SKUs behind it, and its link is the exact filter the catalogue page applies — so
the two cannot drift apart. Four views (set size, range, contents, character)
because four different buyers arrive with four different first questions.

Occasions are the one editorial judgement on the site. They are suggestions
mapped to real filters, and the page says so.

### The idea the site is built on

Every cover design runs across the whole range — the same look as a two, three,
four or five piece set. The range matrix and the design-family strip on the
catalogue page exist to make that legible in one glance, because it is the thing
that lets a buyer choose a look first and a set size second.

Two more conventions from the line sheets are encoded throughout: **Combo**
always means a vacuum flask is included, and **Premium** always means the
upgraded covers and the deeper presentation case.

---

## Before this goes live

These are deliberate placeholders. Each one is visible on the page and must be
replaced with something real.

1. **The client logo wall is empty by design.** The proof band shows
   `Client One`…`Client Six` and says so on the page. Add Memorabilia's own clients only
   with written permission — a real company's logo on a supplier's site without
   it is a legal problem, not a design decision.
2. **The testimonials are sample copy**, labelled as such. Replace with real,
   attributable quotes.
3. **Both forms are inert** until a Firebase project is configured. They validate
   and confirm; without a project they say plainly that nothing was sent.
4. **Two video slots** ("Watch Video", "Watch Our Story") show a toast. Drop the
   film in when it is shot.
5. **Contact details are placeholders** — phone, both email addresses.
6. **Range codes and names need a pass** — see `RANGES-REVIEW.md`. It lists every
   code that was not read cleanly, every page where the OCR saw another company's
   brand name, and the products showing a type-and-code name rather than a read one.
7. **Some range pages show third-party logos** as the supplier's branding mock-ups.
   Each product page says so, but decide whether to keep those pages before launch —
   a customer's logo on a supplier's site reads as a client claim.

### On product photography

Each of the 367 images is a complete page from the client's line sheets —
title, code badge, product shot, colour swatches and feature strip, exactly as
printed. Nothing is cropped away.

`tools/extract/` holds both cuts:

* `full.py` — what ships. Renders every page, trims any blank paper margin, and
  pads the result out to one 3:4 canvas so a grid of them lines up. The pages
  are not all the same shape (the gift-set sheets are A4, the luxury sheets are
  nearly square), and they are **padded** to the common shape rather than
  cropped to it, with the pad colour sampled from each page's own border so a
  cream sheet pads cream and a black sheet pads black. The site's frames are
  3:4 to match, so `object-fit` has nothing left to trim.
* `band.py` + `run.py` — a tighter cut that finds the product and drops the page
  furniture, if the full sheets ever feel too busy. It measures how much of each
  row differs from the page's ground and keeps the longest unbroken run, since a
  product covers a wide band of rows and a line of type never does. Run it, point
  `public/assets/img` at its output, and set every `aspect-ratio` in
  `src/styles/jpp.css` back to `1.5`.

Two things to know about shipping the full sheets. The pages carry **JPP**
branding in their artwork, so that name is visible on the site even though the
site itself now reads Memorabilia — if the rename is meant to reach customers,
the sheets need re-laying out or the tighter cut needs using. And the pages
repeat information the site already shows: the code appears in the badge and
under the product name, the colourways appear both in the swatch strip and in
the card's dots.

These are catalogue pages, not studio photography, and the products deserve a
proper shoot when there is budget. Do **not** replace them with AI-generated
product images: buyers order by SKU code, and a photograph that does not match
what arrives is a returns and trust problem. AI is fine for atmosphere,
lifestyle and texture — never for the product itself.

### Still uncatalogued

Six segments from the line sheets have not been entered yet: drinkware (43pp),
metal pens (65pp), notebooks and organisers (98pp), card holders (10pp), felt
bags (8pp) and mobile stands (16pp). The Accessories page states this openly.
