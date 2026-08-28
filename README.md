# Naatures Scuup

Naatures Scuup is a bilingual English and Hindi premium vegetarian restaurant experience for Mall Road, Kanpur. This repository contains the React/Vite application, its reusable interface components, source data, verification scripts, and the media used by the public site.

## Portability and media

The active site uses two media locations. Small and medium assets are committed under `client/public/site-media/` and are referenced with `/site-media/...`. Eight high-resolution assets exceed the managed checkpoint’s repository-file threshold, so they are stored in managed web storage and referenced with the exact `/manus-storage/...` paths below. This keeps the deployed site at full fidelity while allowing checkpoints and publishing to complete reliably.

| Active asset | Runtime path | Used by |
| --- | --- | --- |
| `mango-ice-cream-1440p-clean-scrub_59b5e815.mp4` | `/manus-storage/mango-ice-cream-1440p-clean-scrub_59b5e815_6c44a1ac.mp4` | Desktop cinematic |
| `mango-ice-cream-portrait-mobile_4b0f7dd0.mp4` | `/manus-storage/mango-ice-cream-portrait-mobile_4b0f7dd0_e590f890.mp4` | Mobile cinematic |
| `naatures-scuup-logo-transparent_7cd2ca72.png` | `/manus-storage/naatures-scuup-logo-transparent_7cd2ca72_f0ac6aa1.png` | Shared header logo |
| `naatures-scuup-menu-hero-custom_6f7d6358.png` | `/manus-storage/naatures-scuup-menu-hero-custom_6f7d6358_ee90b33c.png` | Full Menu hero |
| `pizza-and-pasta-chapter-hd_5aadedcb.png` | `/manus-storage/pizza-and-pasta-chapter-hd_5aadedcb_04d0d487.png` | Pizza & Pasta chapter |
| `desserts-ice-creams-chapter-hd_8d76f08d.png` | `/manus-storage/desserts-ice-creams-chapter-hd_8d76f08d_6c11cac9.png` | Ice Creams chapter |
| `naatures-scuup-live-ice-cream_cc0fddc0.jpg` | `/manus-storage/naatures-scuup-live-ice-cream_cc0fddc0_60926744.jpg` | Live Ice Creams chapter |
| `naatures-scuup-pizza-pasta_d2c371a3.jpg` | `/manus-storage/naatures-scuup-pizza-pasta_d2c371a3_70204bd5.jpg` | Extras chapter and Drag It |

The original files are also preserved in the sandbox’s external static-asset area at `/home/ubuntu/webdev-static-assets/naatures-scuup/` for future re-upload or migration. The 26 smaller active images remain in the repository under `client/public/site-media/`. The old `client/src/lib/mango-scroll-frames.ts` manifest is retained as historical source material from an earlier canvas experiment and is not imported by the current video-based cinematic.

## Run locally

Install the pinned dependencies with `pnpm install`, then start the development server with `pnpm dev`. The production bundle can be checked with `pnpm build`. Source tests run with `pnpm test`, and TypeScript validation runs with `pnpm check`.

The public-facing pages are available at `/` and `/menu`. The project includes the reusable components under `client/src/components/`, route-level pages under `client/src/pages/`, bilingual copy and menu data under `client/src/lib/`, and focused regression scripts under `scripts/`.

## Configuration

The public site does not require a third-party API key for its local media or display-only menu. A standalone clone of the fullstack template may still require the platform-provided environment variables listed in the project template, such as `DATABASE_URL`, `JWT_SECRET`, and OAuth values, if authentication or server procedures are enabled. These values are intentionally not committed to GitHub. Never commit `.env` files or production credentials.

The managed deployment also supplies the `/manus-storage/` proxy and platform services. The current public media is duplicated locally for GitHub portability, but platform-specific authentication, database, analytics, and deployment behavior still require the appropriate environment configuration outside the repository.

## Verification

The latest packaged changes were checked with the Vitest suite and TypeScript compiler before delivery. Browser verification scripts cover the cinematic story, reverse checkpoint navigation, native completion lock, layered Home handoff, responsive mobile layouts, bilingual rendering, Drag It interaction, menu navigation, metadata, favicon, and public controls.
