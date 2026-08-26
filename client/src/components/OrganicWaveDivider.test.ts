import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const divider = readFileSync(resolve(process.cwd(), "client/src/components/OrganicWaveDivider.tsx"), "utf8");

describe("organic section divider", () => {
  it("uses a responsive SVG wave with named editorial colour transitions", () => {
    expect(divider).toContain("preserveAspectRatio=\"none\"");
    expect(divider).toContain("organic-wave--");
    expect(divider).toContain("cream-to-maroon");
    expect(divider).toContain("maroon-to-night");
    expect(divider).toContain("night-to-cream");
  });
});
