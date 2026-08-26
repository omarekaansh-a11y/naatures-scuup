import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const chapterStyles = readFileSync(resolve(process.cwd(), "client/src/menu-chapter-visuals.css"), "utf8");

describe("unified image-led menu chapters", () => {
  it("keeps each chapter as one unfiltered photograph with high-contrast printed labels", () => {
    expect(chapterStyles).toContain("Unified photo chapter");
    expect(chapterStyles).toContain("filter:none!important");
    expect(chapterStyles).toContain(".menu-page .menu-chapter-break__veil{display:none!important}");
    expect(chapterStyles).toContain("background:var(--cream)");
    expect(chapterStyles).toContain("background:var(--print-lime)");
  });
});
