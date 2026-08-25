# Naatures Scuup — Implementation Handoff Specification

## Product intent

Naatures Scuup is a display-only premium vegetarian multi-cuisine restaurant website for Mall Road, Kanpur. It supports discovery, menu browsing, location planning, social proof, and social/contact navigation. It deliberately provides no ordering, reservation, payment, account, or transaction flows.

## Brand direction

The visual system is the **Mall Road Monograph**: deep maroon, warm cream, mango yellow, restrained fennel green, editorial serif display typography, compact Manrope-style utility typography, thin rules, asymmetric composition, and tactile but restrained motion. The supplied Naatures Scuup logo is shown with a non-destructive SVG chroma-alpha treatment so the source background is visually transparent while the original wordmark remains intact.

## Routes and structure

- `/` — Home landing page with immersive hero, story, draggable food canvas, ice-cream destination panel, authentic Google Maps review grid, interactive location atlas, FAQs, footer, and mobile visit dock.
- `/menu` — Full display-only menu with 17 chapter groups, 204 dishes, chapter artwork, search, category filtering, alphabetical sorting, and price low-to-high/high-to-low sorting.
- Unknown routes — branded 404 recovery page with links back to Home, Full Menu, and Mall Road directions.

The shared shell uses a responsive header, accessible hamburger navigation, scroll-to-top control, route transition treatment, footer social links, phone link, and Google Maps link. Wouter handles route selection and route changes reset the destination scroll position.

## Content and assets

Foreground food photography is limited to owner-supplied restaurant images. Generated imagery is used only as atmospheric background artwork, including the Home hero, Full Menu hero, ice-cream destination, and chapter artwork. Assets are referenced through durable Manus storage URLs rather than bundled local media. Menu notes are source-backed concise descriptions, and reviews are authentic Google Maps content rather than fabricated testimonials.

## Interaction model

The Home Drag It area is a direct-manipulation stack with pointer, touch, keyboard, diagonal movement, constrained velocity projection, low-momentum settling, stable card keys, staged incoming-card transitions, and reduced-motion behavior. The café-dog illustration is an inline SVG-style mascot with a seated posture, beret, chair, table, cup, coffee steam, idle sniff, ear twitch, tail wag, and softer greeting reaction. The location atlas uses the Google Maps JavaScript integration with real map tiles, native wheel/pinch gestures, custom maroon styling, Naatures Scuup and The Mall markers, and a Google Maps directions link fallback.

## Opening hours

The regular weekly schedule is shown on the Home hero, Home visit card, footer, and Full Menu hero, and is represented in Restaurant JSON-LD:

| Days | Hours |
|---|---|
| Monday, Tuesday, Thursday, Friday, Saturday, Sunday | 11:00 AM–11:00 PM |
| Wednesday | 10:00 AM–11:00 PM |

Temporary holiday-specific wording is intentionally excluded.

## SEO and social readiness

`client/index.html` includes a factual description, canonical URL, Open Graph and Twitter metadata, social image, SVG favicon, Google Search Console verification tag, and Restaurant JSON-LD with address, telephone, cuisine, coordinates, social links, and weekly opening hours. Route metadata adds unique page titles/descriptions and noindex handling for the 404 page.

## Validation expectations

Before release, run `pnpm test`, `pnpm check`, and `pnpm build`; inspect the Home and Full Menu routes at desktop and mobile widths; verify that no foreground image is duplicated unintentionally; confirm that all external links open safely in a new tab; and confirm that display-only constraints remain visible in the FAQ and navigation language.
