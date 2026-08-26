import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const drag = readFileSync(resolve(process.cwd(), "client/src/components/DragFoodCanvas.tsx"), "utf8");
const reviews = readFileSync(resolve(process.cwd(), "client/src/components/GoogleReviews.tsx"), "utf8");

describe("Home editorial numbering", () => {
  it("keeps the visible Home sequence chronological from food edit through FAQs", () => {
    expect(drag).toContain("01 / The food edit");
    expect(home).toContain("02 / The Mall table");
    expect(reviews).toContain("03 / Selected diner proof");
    expect(home).toContain("04 / Before you visit");
    expect(home).toContain('maximalist-surface__figure" aria-hidden="true">02');
    expect(reviews).toContain('maximalist-surface__figure" aria-hidden="true">03');
  });
});
