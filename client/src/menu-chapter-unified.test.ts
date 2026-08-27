import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const chapterStyles = readFileSync(resolve(process.cwd(), "client/src/menu-chapter-visuals.css"), "utf8");
const menuPage = readFileSync(resolve(process.cwd(), "client/src/pages/MenuPage.tsx"), "utf8");

describe("unified image-led menu chapters", () => {
  it("keeps each chapter as one unfiltered photograph with high-contrast printed labels", () => {
    expect(chapterStyles).toContain("Unified photo chapter");
    expect(chapterStyles).toContain("filter:none!important");
    expect(chapterStyles).toContain(".menu-page .menu-chapter-break__veil{display:none!important}");
    expect(chapterStyles).toContain("background:var(--cream)");
    expect(chapterStyles).toContain("background:var(--print-lime)");
  });

  it("uses distinct chapter artwork for Live Ice Creams and Extras", () => {
    expect(menuPage).toContain('"live-ice-creams": { src: "/manus-storage/naatures-scuup-live-ice-cream_cc0fddc0.jpg"');
    expect(menuPage).toContain('extras: { src: "/manus-storage/naatures-scuup-pizza-pasta_d2c371a3.jpg"');
    expect(menuPage).not.toContain('"live-ice-creams": { src: "/manus-storage/desserts-ice-creams-chapter-hd_8d76f08d.png"');
    expect(menuPage).not.toContain('extras: { src: "/manus-storage/pizza-and-pasta-chapter-hd_5aadedcb.png"');
  });
});
