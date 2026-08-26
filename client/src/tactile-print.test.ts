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
    expect(printStyles).toContain(".film-print-text");
    expect(printStyles).toContain("@keyframes filmGateWeave");
    expect(printStyles).toContain(".layered-image-depth");
    expect(printStyles).toContain(".print-edge-boil--rough");
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
    expect(reviews).toContain("review-card review-card--proof print-edge-boil print-edge-boil--rough maximalist-card");
  });

  it("keeps Drag It’s restored ring-and-line gesture and uses layered halftone waves instead of geometric fragments", () => {
    expect(printStyles).toContain(".drag-it-section.maximalist-drag .drag-it-playground:before");
    expect(printStyles).toContain(".drag-it-section.maximalist-drag .drag-it-copy:after{display:none}");
    expect(printStyles).toContain("mask-image:radial-gradient");
    expect(printStyles).toContain("mask-repeat:no-repeat");
    expect(printStyles).toContain("every ornament resolves inside the panel");
    expect(printStyles).toContain(".drag-it-section.maximalist-drag .drag-it-layout:before,.drag-it-section.maximalist-drag .drag-it-layout:after{inset:8% 4%}");
    expect(printStyles).toContain("Hierarchy reset: the dog, editorial copy, and real food stack lead");
    expect(printStyles).toContain(".drag-it-section.maximalist-drag:before{display:none}");
    expect(printStyles).toContain("Drag It has no decorative box geometry");
    expect(printStyles).toContain(".drag-it-section.print-edge-boil:before,.drag-it-section.print-edge-boil--rough:after{display:none}");
    expect(printStyles).not.toContain(".drag-it-section.maximalist-drag .drag-it-layout:before{position:absolute;z-index:-1;inset:7% 0 4%");
  });
});
