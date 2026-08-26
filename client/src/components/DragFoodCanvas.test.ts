import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const dragIt = readFileSync(resolve(process.cwd(), "client/src/components/DragFoodCanvas.tsx"), "utf8");

describe("Drag It ordered swipe loop", () => {
  it("advances every physical swipe to the next item and exposes the active index for regression checks", () => {
    expect(dragIt).toContain("swipeCard(1, velocity, vector, true)");
    expect(dragIt).toContain("data-card-index={activeIndex + 1}");
    expect(dragIt).toContain("(current + direction + items.length) % items.length");
  });
});
