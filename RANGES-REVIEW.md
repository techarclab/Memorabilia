# Ranges — what to check before launch

Fourteen supplier catalogues, 514 pages, now on the site as 505 products and 16 grid sheets.

The PDFs are flat images with no text behind them, so every code, name and spec on these pages was read by OCR from the page itself. The page image beside each product is the original and is never edited — it is the thing to trust if anything below disagrees with it.


## 1. Codes to confirm

I checked 17 codes by eye against their pages while building this and all 17 matched. Still, these are the ones that were *not* read cleanly off the page, so they are the ones worth ticking against the printed line sheet.


- **Read straight from the page:** 459
- **Inferred** from an unambiguous gap in the numbering: 29
- **From a page-numbering rule** confirmed across the whole book: 2
- **Checked by eye** where OCR could not settle it: 14
- **Still unknown** — shown as "Code on request": 1


| Code | Range | Page | How it was arrived at |
|---|---|---|---|
| `XG-B11` | Bags | 11 | inferred |
| `XG-B15` | Bags | 15 | inferred |
| `XG-046` | Bottles & Sippers | 37 | inferred |
| `—` | Card Holders | 9 | unknown |
| `XG-VC01` | Card Holders | 1 | inferred |
| `XG-D09` | Desk Organisers | 9 | inferred |
| `XG-T45` | Desk Organisers | 21 | verified |
| `XG-T59` | Desk Organisers | 22 | verified |
| `XG-T59` | Desk Organisers | 23 | verified |
| `XG-T63` | Desk Organisers | 24 | verified |
| `XG-T64` | Desk Organisers | 25 | verified |
| `XG-T65` | Desk Organisers | 26 | verified |
| `XG-T68` | Desk Organisers | 27 | verified |
| `XG-NB05` | Diaries | 5 | inferred |
| `XG-NB10` | Diaries | 10 | inferred |
| `XG-NB11` | Diaries | 11 | inferred |
| `XG-NB15` | Diaries | 15 | inferred |
| `XG-T01` | Electronics | 2 | inferred |
| `XG-T02` | Electronics | 3 | inferred |
| `XG-T03` | Electronics | 4 | inferred |
| `XG-T10` | Electronics | 10 | inferred |
| `XG-T16` | Electronics | 15 | verified |
| `XG-T28` | Electronics | 24 | inferred |
| `XG-T29` | Electronics | 25 | inferred |
| `XG-T30` | Electronics | 26 | inferred |
| `XG-T53` | Electronics | 49 | inferred |
| `XG-T59` | Electronics | 55 | verified |
| `XG-T63` | Electronics | 61 | verified |
| `XG-T65` | Electronics | 63 | inferred |
| `XG-T68` | Electronics | 66 | inferred |
| `XG-T69` | Electronics | 67 | inferred |
| `XG-T78` | Electronics | 76 | inferred |
| `XG-T94` | Electronics | 78 | verified |
| `XG-T97` | Electronics | 79 | verified |
| `XG-K11` | Keychains | 11 | inferred |
| `XG-K15` | Keychains | 14 | inferred |
| `XG-K31` | Keychains | 26 | verified |
| `XG-K32` | Keychains | 27 | verified |
| `XG-K50` | Keychains | 43 | inferred |
| `XG-MP29` | Metal Pens | 30 | sequence |
| `XG-MP51` | Metal Pens | 52 | sequence |
| `XG-M01` | Mugs & Tumblers | 1 | inferred |
| `XG-M11` | Mugs & Tumblers | 11 | inferred |
| `XG-M15` | Mugs & Tumblers | 15 | inferred |
| `XG-M33` | Mugs & Tumblers | 32 | inferred |
| `XG-M59` | Mugs & Tumblers | 56 | inferred |

## 2. Third-party brand marks

Several supplier pages show another company's logo as a branding mock-up. On Memorabilia's own site that reads to a visitor as *"we supplied them"*, which is a claim only you can make. Each product page carries a note saying the branding shown is the supplier's mock-up, but you should decide whether to keep these pages at all.


**This list is text-detected only.** It catches a brand *name* the OCR could read. A logo drawn as artwork — the Google mark on a bag, the Apple mark on a mug, the Mastercard roundels on a card holder, the Cadbury and Hershey's packs inside the Diwali hampers — will not appear here. Treat it as a starting point for a visual pass, not the whole answer.


| Code | Range | Page | Brand word found |
|---|---|---|---|
| `XG-FB01` | Bags | 25 | microsoft |
| `XG-FB02` | Bags | 26 | microsoft |
| `XG-D06` | Desk Organisers | 6 | apple |
| `XG-D07` | Desk Organisers | 7 | apple |
| `XG-T94` | Electronics | 78 | adani |
| `XG-K11` | Keychains | 11 | tata |
| `XG-M53` | Mugs & Tumblers | 50 | samsung |

Worth knowing: `XG-D06` is flagged for "apple" because the product is a desk organiser with an **apple-shaped clock** — the page says "Apple Clock Desk Organizer". That one is a false positive, and a good illustration of why the list needs a human pass.


## 3. Product names

380 products carry a name read from the page. The remaining 125 show the product type and its code instead — "Diwali Hamper XG-DS16", "Metal Pen XG-MP52" — because the page prints its description as artwork rather than as type the OCR could trust.


That is deliberate: a confident-sounding line of OCR noise on a product card is worse than an honest type-and-code, and the full page sits right beside it either way. If you want any of them written properly, they are all in `src/data/rangeRows.json` — the fourth field of each row.


By range:


| Range | Products | Named from the page | Type + code |
|---|---|---|---|
| Bottles & Sippers | 81 | 78 | 3 |
| Electronics | 78 | 44 | 34 |
| Diaries | 64 | 64 | 0 |
| Metal Pens | 61 | 41 | 20 |
| Mugs & Tumblers | 58 | 52 | 6 |
| Keychains | 44 | 41 | 3 |
| Diwali & Festive | 40 | 0 | 40 |
| Desk Organisers | 27 | 22 | 5 |
| Bags | 26 | 21 | 5 |
| Card Holders | 18 | 9 | 9 |
| Pen Boxes | 8 | 8 | 0 |

## 4. Books shown as sheets, not products

Three catalogues lay several SKUs out on a single page — ID Card Holders, Display Stands and Yoyo Badge Reels. Splitting those into invented single-product entries would have meant guessing which caption belonged to which item, so they are browsed page by page instead, with a line telling the buyer to quote the code printed beside what they want.


## 5. Not included

Three loose JPGs in the folder — `XG-U1.jpg`, `XG-U2.jpg`, `XG-U3.jpg` — are not in any catalogue and have no codes or specs attached, so I left them out rather than guess at what they are. Tell me what they belong to and they go in.
