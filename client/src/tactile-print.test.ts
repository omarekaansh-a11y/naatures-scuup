import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const printStyles = readFileSync(resolve(process.cwd(), "client/src/tactile-print.css"), "utf8");
const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const menu = readFileSync(resolve(process.cwd(), "client/src/pages/MenuPage.tsx"), "utf8");
const reviews = readFileSync(resolve(process.cwd(), "client/src/components/GoogleReviews.tsx"), "utf8");

describe("tactile print visual system", () => {
  it("defines varied paper, ink, maximalist material layers, organic seams, and motion safeguards", () => {
    expect(printStyles).toContain(".print-paper");
    expect(printStyles).toContain(".print-halftone");
    expect(printStyles).toContain(".print-edge-boil");
    expect(printStyles).toContain(".print-ink");
    expect(printStyles).toContain(".maximalist-surface__forms");
    expect(printStyles).toContain(".maximalist-surface__label");
    expect(printStyles).toContain(".maximalist-card");
    expect(printStyles).toContain(".organic-wave");
    expect(printStyles).toContain("@keyframes printEdgeBoil");
    expect(printStyles).toContain("prefers-reduced-motion");
    expect(printStyles).toContain('data-mobile-network="constrained"');
  });

  it("applies tactile layers to the requested home, menu, review, and scoop surfaces", () => {
    expect(home).toContain("ice-cream-destination print-surface print-surface--dark print-halftone maximalist-surface");
    expect(home).toContain('tone="maroon-to-night"');
    expect(menu).toContain('className="menu-page print-paper"');
    expect(menu).toContain("menu-chapter-break print-surface print-halftone maximalist-chapter");
    expect(menu).toContain("menu-dish-card print-edge-boil maximalist-card");
    expect(menu).toContain('tone="cream-to-sage"');
    expect(reviews).toContain("reviews-section section-pad print-paper maximalist-surface maximalist-surface--sage");
    expect(reviews).toContain("review-card review-card--proof print-edge-boil maximalist-card");
  });
});
