import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const map = readFileSync(resolve(process.cwd(), "client/src/components/LocationAtlas.tsx"), "utf8");
const printStyles = readFileSync(resolve(process.cwd(), "client/src/tactile-print.css"), "utf8");
const sequenceVerifier = readFileSync(resolve(process.cwd(), "scripts/verify-drag-sequence.mjs"), "utf8");

describe("pasta image placement", () => {
  it("reserves green pasta for the circular map layer and keeps red pasta in Drag It", () => {
    expect(home).toContain("screenshot-109_b4ce8442.png");
    expect(home).not.toContain("screenshot-108_6acee474.png");
    expect(map).toContain("visit-map__material-image");
    expect(printStyles).toContain("screenshot-108_6acee474.png");
    expect(printStyles).toContain("border-radius:50%");
    expect(sequenceVerifier).toContain("[1, 2, 3, 4, 5, 6, 1]");
  });
});
