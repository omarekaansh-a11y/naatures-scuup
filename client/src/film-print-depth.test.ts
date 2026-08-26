import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const printStyles = readFileSync(resolve(process.cwd(), "client/src/tactile-print.css"), "utf8");
const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const menu = readFileSync(resolve(process.cwd(), "client/src/pages/MenuPage.tsx"), "utf8");
const footer = readFileSync(resolve(process.cwd(), "client/src/components/SiteFooter.tsx"), "utf8");
const map = readFileSync(resolve(process.cwd(), "client/src/components/LocationAtlas.tsx"), "utf8");

describe("film-print depth and maximalist utility surfaces", () => {
  it("provides gate weave, layered imagery, edge detail, and accessibility fallbacks", () => {
    expect(printStyles).toContain("filmGateWeave");
    expect(printStyles).toContain("filmFlicker");
    expect(printStyles).toContain("layered-image-depth--faq");
    expect(printStyles).toContain("layered-image-depth--footer");
    expect(printStyles).toContain("layered-image-depth--map");
    expect(printStyles).toContain("prefers-reduced-motion");
    expect(printStyles).toContain('data-mobile-network="constrained"');
  });

  it("applies depth away from the approved cinematic sequence and protects utility interactions", () => {
    expect(home).toContain("print-paper print-halftone print-edge-boil layered-image-depth layered-image-depth--faq");
    expect(menu).toContain("layered-image-depth--menu");
    expect(footer).toContain("film-footer print-surface print-surface--dark print-halftone layered-image-depth layered-image-depth--footer");
    expect(map).toContain("maximalist-map print-surface print-surface--dark");
    expect(map).toContain("layered-image-depth layered-image-depth--map");
    expect(map).toContain("print-edge-boil--rough");
    expect(map).toContain("visit-map__material-image");
    expect(printStyles).toContain(".menu-page .menu-dish-card h2");
    expect(printStyles).toContain("background:var(--print-lime)");
    expect(printStyles).toContain(".site-header--hamburger:after");
  });
});
