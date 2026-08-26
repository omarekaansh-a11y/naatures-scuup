import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const faviconMarkup = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
const faviconGenerator = readFileSync(resolve(process.cwd(), "scripts/generate-header-logo-favicon.py"), "utf8");

describe("brand favicon", () => {
  it("uses freshly generated browser icons based on the exact owner logo source used by the header", () => {
    expect(faviconMarkup).toContain('/favicon.png?v=3');
    expect(faviconMarkup).toContain('/favicon.ico?v=3');
    expect(faviconMarkup).toContain('/apple-touch-icon.png?v=3');
    expect(faviconGenerator).toContain("naatures-scuup-logo-transparent.png");
    expect(faviconGenerator).toContain("favicon.ico");
    expect(faviconGenerator).toContain("apple-touch-icon.png");
  });
});

export {};
