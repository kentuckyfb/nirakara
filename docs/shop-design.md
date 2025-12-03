# Shop Page Design Reference

## Purpose
E-commerce archive showcasing handcrafted silver pieces with a "chaos in silver" aesthetic (futuristic, minimal, metallic). Reference implementation in `src/pages/Shop.tsx`; design tokens in `src/index.css`.

## Brand System
- Fonts: `Prosto One` for headings, `Inter` for body.
- Palette: off-white bg `#f5f3ee`, black text, metallic accents; gradients and shadows from CSS vars in `:root`.
- Selection: black bg, white text.

## Layout Shell
- Fixed top 1px gradient bar; soft background gradients.
- Content width `max-w-[1600px]`, padding `px-2 sm:px-4`.
- Sections stack with generous whitespace.

## Feature Slider (Hero Rail)
- Autoplay every 5200ms (`useEffect` interval), slider items from featured products (`products.json` `isFeatured`), max 4.
- Grid on md+: `1fr / 1.2?1.5fr`. Left: code, category, name, short description, CTA. Right: hero image with grayscale hover reveal + overlay wash.
- Bottom controls: progress bars/dots; active bar wider/darker.

## Catalogue Header
- Title "The Archive" with mono "Collection" label.
- Mobile: compact label + tiny mono copy. Desktop: fuller paragraph (`max-w-md`).

## Filters
- Desktop sidebar (`lg`): bordered/blurred card, top accent line, small dots. Sticky with `STICKY_OFFSET = 96`; locks to bottom of catalogue when scrolled past.
- Groups from `shop.json`: Category, Material, Finish. Active state shows left bar + bold + tinted bg. Category default "All"; Material/Finish are single-select toggles.
- Mobile bar: sticky at catalogue top; toggle expands overlay grid of buttons; uses separate sticky calc with `headerOffset = 80`.

## Product Grid
- Desktop container: border, light blur, accent corners. Auto-fill columns `minmax(280px, 1fr)` with responsive gaps.
- Card hover swaps primary image with `secondImage` (product images index 1). Overlay shows code tag + arrow tile. Text: uppercase with tight tracking; price mono `text-[10px]`; category caption `text-[9px]`.
- Cards animate fade-in-up with stagger via `animationDelay` (`idx * 50ms`).

## Data Contracts
- `shop.json` supplies filter lists and base `items` (codes + images).
- `products.json` holds product metadata (slug, category, finish, images, price). Filtering maps UI labels to data slugs (Category map: Rings?ring, Chains?chain, Bracelets?bracelet, Ear Cuffs?ear-cuff). Finish mapping: Polished?polished, Matte?brushed, Oxidized?distressed. Material filter is placeholder.

## Motion
- Slider easing `cubic-bezier(0.22,1,0.36,1)`; hover scales; image grayscale reveal. Reduced-motion guard in `src/index.css`.

## Responsive Rules
- Mobile-first. Slider stacks text/image. Filters sidebar hidden on <lg; mobile sticky bar shown. Typography shrinks (`text-[8-12px]` mono labels). Grid still auto-fills.

## Content Sections Below Grid
- Material Philosophy: two-column block with heading, paragraph, small stats.
- Studio Notes: journal cards grid with category chips, dates, hover bg shift, borders/light blur.

## Patterns to Reuse
- Uppercase mono labels with heavy letter spacing for metadata.
- Thin gradient lines and small dots/square accents for section headers.
- Bordered, semi-transparent surfaces with subtle blur.
- Fixed-width max container, generous vertical rhythm.

## Interaction Notes
- Filters are single-select per group; clicking same value toggles off for Material/Finish. Slider dots clickable. Hover/focus states on interactive elements; add explicit focus styles if extending.

## Implementation Guidance for New Pages/Components
1) Use tokens in `src/index.css` (colors, fonts, gradients, shadows).
2) Keep typography hierarchy: brand font for headings, mono for system labels; uppercase with tracking for UI chrome.
3) Prefer thin accents (1?2px lines, dots) and gradient bars over heavy dividers.
4) Use bordered, lightly blurred surfaces instead of solid fills.
5) Match motion language: smooth easing, hover lift/scale; add reduced-motion guards for new animations.
6) Maintain responsive parity: mobile-first, `auto-fill` grids with sensible min widths, sticky adjustments per breakpoint.
7) Mirror filter API shape (`label`, `values`) and map UI labels to data slugs explicitly.
8) Keep CTAs concise, uppercase, thin underline/border states; use `lucide-react` icons (e.g., `ArrowUpRight`, `Plus`).
9) Respect routing/data patterns (`/product/:slug`, `products.json`, `shop.json`) to decouple copy/layout from logic.
10) Preserve off-white base background; only add colors aligned with metallic/black scheme.
