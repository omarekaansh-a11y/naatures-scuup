import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const drag = readFileSync(resolve(process.cwd(), "client/src/components/DragFoodCanvas.tsx"), "utf8");
const reviews = readFileSync(resolve(process.cwd(), "client/src/components/GoogleReviews.tsx"), "utf8");
const languageCopy = readFileSync(resolve(process.cwd(), "client/src/lib/language-copy.ts"), "utf8");

describe("Home editorial numbering", () => {
  it("keeps the visible Home sequence chronological from food edit through FAQs", () => {
    expect(drag).toContain("copy.eyebrow");
    expect(home).toContain("copy.tableEyebrow");
    expect(languageCopy).toContain("01 / The food edit");
    expect(languageCopy).toContain("02 / The Mall table");
    expect(reviews).toContain("copy.eyebrow");
    expect(languageCopy).toContain("03 / Selected diner proof");
    expect(home).toContain("copy.beforeVisit");
    expect(languageCopy).toContain("04 / Before you visit");
    expect(home).toContain('maximalist-surface__figure" aria-hidden="true">02');
    expect(reviews).toContain('maximalist-surface__figure" aria-hidden="true">03');
  });
});
