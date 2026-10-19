# Broker Site Code Map — brokers.xelo.media (index.html)

Generated 19 Oct 2026. Reference for every future change.

---

## Sections — page order

### nav
- Container: `<nav>` fixed, `z-index:200`
- Height: `64px` default → `72px` at `min-width:901px`
- Sizing: `position:fixed; top:0; left:0; right:0`
- Children: `.nl` (logo), `.nv` (nav links × 12), `.nc` (3 buttons)
- Media queries:
  - `min-width:901px` → `height:72px; .nv gap:16px; .nv a font-size:12px`
  - `max-width:1300px` → `padding:0 28px; .nv gap:8px` (all buttons remain)
  - `max-width:900px` → `padding:0 24px; nav .nv,.nc .ghost { display:none }`

### hero (`#` / `.hero`)
- Container: `.wrap-wide` (max-width:1700px, padding:0 24px)
- Sizing: `padding:120px 0 72px` → at `min-width:901px` becomes flex column, padding `88px 48px 88px`
- Layout: `.hero-grid` — `grid-template-columns:1fr 420px` → `1fr 480px` at `min-width:901px` → `1fr` at `max-width:900px`
- Children: text column (h1, stats, CTAs), `.hero-visual` (video-mock, thumbnail row)
- Media queries:
  - `min-width:901px` → hero becomes flex, wide padding, grid widens right column to 480px
  - `max-width:900px` → grid collapses to 1fr
  - `max-width:600px` → `.hero-stats` collapses to 1fr
- JS: `switchHero()` (line ~815) — swaps hero video src + aspect ratio on thumbnail click

### stats (`#stats`)
- Container: `.wrap-wide`
- Sizing: `section{padding:90px 0}` → `64px 0` at `max-width:900px`
- Layout: `.stats-grid` — `grid-template-columns:repeat(2,1fr)` → `repeat(4,1fr)` at `min-width:901px`
- Children: 4 stat cards (4×, 73%, 58%, 1 in 10)

### examples (`#examples`)
- Container: `.wrap-wide`
- Sizing: `padding:80px 0 100px` at `min-width:901px`
- Layout: `.examples-layout` — `grid-template-columns:360px 1fr` → `1fr` at `max-width:1400px` (text stacks above) → `1fr` redundantly at `max-width:900px`
- Left: `.examples-text` (h2, sub, CTA button)
- Right: `.examples-frames` containing `#market-preview-pair`
  - `#market-preview-pair`: flex row containing MacBook + phone
    - `.market-preview-desktop` → `.macbook-photo-wrap` (680px fixed, aspect-ratio 2528/1684) with `img` + `.macbook-photo-overlay` (iframe)
    - `.market-preview-phone` → `.phone-bezel` (254px×453px) → status bar + `#market-iframe-phone`
  - `#market-cards-fallback` (initially `display:none`) — fallback dark card
- Media queries:
  - `min-width:1700px` → macbook-photo-wrap widens to 800px, iframe scale 0.350
  - `max-width:1400px` → examples-layout stacks (1fr), devices still side by side
  - `max-width:1000px` → MacBook hidden, phone solo scaled up (310×553px, iframe scale 0.738)
  - `max-width:900px` → pair justify-content: space-around
  - `max-width:639px` → pair hidden entirely
- JS (line ~853): fallback logic — hides pair on `window.innerWidth < 640`; sets 4s timeout, if neither `market-iframe` nor `market-iframe-phone` fires `load`, hides pair and shows fallback

### how (`#how`)
- Container: `.wrap` (max-width:1400px)
- Sizing: section default
- Layout: `.steps` flex column with vertical timeline connector `::before`
- Children: 4 step rows (upload → video → 12 languages → market + James)

### features (`#features`)
- Container: `.wrap-wide`
- Layout: `.feat-grid` — `grid-template-columns:repeat(3,1fr)` → `repeat(2,1fr)` at `max-width:900px` → `1fr` at `max-width:600px`
- Children: 9 feature tiles (AI Video, Voice narration, AI copywriting, 12 languages, Aerial video, Portal export, James, Embed widget, Analytics)

### market (`#market`)
- Container: `.wrap` (max-width:1400px)
- Layout: `.market-layout` — `grid-template-columns:1fr 1fr` → `1fr` at `max-width:900px`
- Right: `.mcard` with 3 live listing thumbnails + real images from R2

### james (`#james`)
- Container: `.wrap`
- Layout: `.james-layout` — `1fr 1fr` → `1fr` at `max-width:900px`
- Left: `.chat-mock` (simulated conversation UI)
- Right: heading + 4 perk bullets + CTA

### embed (`#embed`)
- Container: `.wrap`
- Layout: `.embed-layout` — `1fr 1fr` → `1fr` at `max-width:900px`
- Right: `.code-mock` (HTML code display) + instruction note

### compare (`#compare`)
- Container: `.wrap-wide`
- Layout: `.comp-wrap` with `.comp-table` (5 cols: feature, Xelo, videographer, DIY, no video)
- `overflow-x:auto` on `.comp-wrap` for horizontal scroll on narrow screens

### pricing (`#pricing`)
- Container: `.wrap-wide`
- Layout:
  - `.pricing-top` — `grid-template-columns:1fr 1fr` → `1fr` at `max-width:900px`
    - Left: `.pricing-hd` (heading + sub)
    - Right: `.plan` Trial card (€0, FREE badge, 10 feature bullets, flags, Start free button)
  - `.plans-lower` — `grid-template-columns:repeat(3,1fr)` → `repeat(2,1fr)` at `max-width:900px` → `1fr` at `max-width:600px`
    - 3 cards: Starter (€99), Professional (€249), Agency (From €690)
  - `.credit-note` — full-width fine print
- JS (line ~796): `applyPricing()` — fetches `/api/pricing`, hydrates IDs: `price-starter`, `price-professional`, `price-agency`, `sub-starter`, `sub-professional`, `agency-cta`, `.training-text`, `.trial-seconds-pf`, `.faq-allowances-text`

### buy-more (`#buy-more`)
- Container: `.wrap`
- Layout: `grid-template-columns:repeat(auto-fit,minmax(300px,1fr))` for 2 top-up cards + `1fr 1fr` cost comparison block
- Two top-up items: Extra listing slot (€89) + Video seconds (€21/60s) — both "coming soon"

### faq (`#faq`)
- Container: `.wrap-sm` (max-width:780px → 1040px at `min-width:901px`)
- Layout: `.faq-list` flex column, accordion items
- 5 questions; JS `toggleFaq()` (line ~794) toggles `open` class, animates `max-height`

### contact / CTA (`.cta-section`, `#contact`)
- Container: `.wrap-wide`
- Sizing: `padding:80px 0`, radial gradient background at `min-width:901px`
- Layout: `.cta-grid` — `1fr` → `1fr 1fr` at `min-width:901px`
- Right: `.cta-proof` — 3 stat items (4×, 73%, minutes)

### footer
- Container: direct `<footer>` with `padding:32px 48px` → `padding:24px` at `max-width:900px`
- Layout: flex row, space-between; logo + copyright left, links right

---

## All media queries (order of declaration)

| Query | What it does |
|---|---|
| `max-width:900px` (block 1, ~line 205) | Collapses all 2-col layouts to 1fr, hides nav links + ghost button, reduces padding |
| `max-width:600px` (~line 218) | feat-grid, plans-lower, hero-stats, market-live-grid → 1fr |
| `min-width:901px` (~line 219) | Desktop enhancements: nav height, hero flex, larger gaps, stats 4-col, wider btn, etc. |
| `min-width:1700px` (~line 292) | macbook-photo-wrap → 800px, iframe scale 0.350 |
| `max-width:1400px` (~line 296) | examples-layout → 1fr (text stacks above devices) |
| `max-width:1000px` (~line 300) | MacBook hidden, phone solo + scaled up |
| `max-width:1300px` (~line 316) | Nav padding 0 28px, nav gap 8px |
| `max-width:900px` (block 2, ~line 322) | examples-layout 1fr, pair justify space-around |
| `max-width:639px` (~line 323) | market-preview-pair hidden |

---

## All JS functions / blocks

| Function / block | Line | What it does |
|---|---|---|
| `toggleFaq(el)` | ~794 | Accordion open/close on FAQ items |
| `applyPricing(data)` IIFE | ~796 | Fetches `/api/pricing`, hydrates plan prices + seconds + training text |
| `switchHero(thumb, src, label, ratio)` | ~815 | Swaps hero video, updates aspect ratio + label |
| DOMContentLoaded autoplay block | ~827 | Explicit play() for all `video[autoplay]` + IntersectionObserver for scroll-into-view |
| Market preview fallback IIFE | ~853 | Hides pair at <640px width; 4s timeout fires fallback if neither iframe loads |
| Scrollspy IIFE | ~877 | IntersectionObserver highlights active nav link |
| Status bar clock IIFE | ~905 | Updates `#psb-time` every 10s |

---

## Image / asset references

| File | Where used | Size |
|---|---|---|
| `macbook-frame.jpg` | `#examples` MacBook composite `<img>` | 96KB, 1400×932px, navy background |
| `https://app.xelo.media/xelo-logo-full.png` | Nav logo + footer logo | Remote |
| `https://app.xelo.media/public/listings/…/photo_01.jpg` × 3 | `#market` listing thumbnails | Remote R2 |
| Hero video `.mp4` × 3 | `#hero` video-mock + thumbnails | Remote R2 |

---

## MacBook overlay coordinates

For `macbook-frame.jpg` (1400×932, navy background):
- `.macbook-photo-overlay`: `left:18%; top:17%; width:63%; height:55%`
- iframe: `width:1440px; height:900px; transform:scale(0.298); transform-origin:top left`
- At ≥1700px: scale becomes 0.350 (wrap wider → MacBook 800px)
