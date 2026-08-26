import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const mobileStyles = readFileSync(resolve(process.cwd(), "client/src/mobile-first.css"), "utf8");
const orbit = readFileSync(resolve(process.cwd(), "client/src/components/IceCreamOrbit.tsx"), "utf8");
const app = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
const enhancer = readFileSync(resolve(process.cwd(), "client/src/components/MobileExperienceEnhancer.tsx"), "utf8");
const menu = readFileSync(resolve(process.cwd(), "client/src/pages/MenuPage.tsx"), "utf8");
const dragCanvas = readFileSync(resolve(process.cwd(), "client/src/components/DragFoodCanvas.tsx"), "utf8");
const header = readFileSync(resolve(process.cwd(), "client/src/components/SiteHeader.tsx"), "utf8");

describe("mobile-first optimization safeguards", () => {
  it("keeps navigation usable through the mobile opening sequence and reserves safe areas", () => {
    expect(mobileStyles).toContain('html:root[data-ice-hero-active="true"] body .site-header');
    expect(mobileStyles).toContain("safe-area-inset-top");
    expect(mobileStyles).toContain("safe-area-inset-bottom");
    expect(mobileStyles).toContain("min-width: 44px");
    expect(mobileStyles).toContain("min-height: 44px");
  });

  it("preserves the focused mobile opening and a direct scroll affordance", () => {
    expect(orbit).toContain("transform:scale(2.9)");
    expect(orbit).toContain(".ice-orbit__story{display:block;z-index:6;pointer-events:none}");
    expect(orbit).toContain(".ice-orbit__checkpoint-rail{display:none}");
    expect(orbit).toContain('aria-label="Scroll down to continue"');
  });

  it("adds app-style progress, return navigation, touch resilience, low-motion fallbacks, and menu input guidance", () => {
    expect(app).toContain("MobileExperienceEnhancer");
    expect(app).toContain('href="#main-content"');
    expect(enhancer).toContain("mobile-scroll-progress");
    expect(enhancer).toContain("mobile-quick-top");
    expect(enhancer).toContain("--mobile-scroll-progress");
    expect(mobileStyles).toContain("touch-action: manipulation");
    expect(mobileStyles).toContain("content-visibility: auto");
    expect(mobileStyles).toContain("prefers-reduced-data");
    expect(mobileStyles).toContain("mobile-skip-link");
    expect(mobileStyles).toContain(".mobile-skip-link { display: none; }");
    expect(mobileStyles).toContain("-webkit-overflow-scrolling: touch");
    expect(mobileStyles).toContain("drag-it-mobile-guide--visible");
    expect(mobileStyles).toContain(".drag-it-playground { position: relative; }");
    expect(menu).toContain('inputMode="search"');
    expect(menu).toContain('enterKeyHint="search"');
    expect(menu).toContain('aria-live="polite"');
    expect(dragCanvas).toContain("naatures-scuup-mobile-drag-guide");
    expect(dragCanvas).toContain("Swipe a card in any direction");
  });

  it("keeps the header free of a duplicate mobile top action while adding mobile network and category-navigation safeguards", () => {
    expect(header).not.toContain("site-top-control");
    expect(menu).toContain("selectMobileGroup");
    expect(menu).toContain('id="menu-results"');
    expect(menu).toContain('tabIndex={-1}');
    expect(mobileStyles).toContain("data-mobile-network");
    expect(mobileStyles).toContain("scroll-snap-type: x proximity");
    expect(mobileStyles).toContain("prefers-contrast: more");
  });
});
