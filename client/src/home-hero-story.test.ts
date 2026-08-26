import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("consolidated home story", () => {
  it("removes the redundant follow-on hero and carries its hospitality details into the scoop destination", () => {
    expect(home).not.toContain('className="hero hero--frontispiece hero--after-story"');
    expect(home).toContain("Save room.");
    expect(home).toContain("From South Indian favourites and shareable pizza");
    expect(home).toContain("100%");
    expect(home).toContain("204 DISHES");
    expect(home).toContain("Directions to Mall Road");
  });
});
