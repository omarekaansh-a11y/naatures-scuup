import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const favicon = readFileSync(resolve(process.cwd(), "client/public/favicon.svg"), "utf8");

describe("brand favicon", () => {
  it("uses the supplied Naatures Scuup logo with transparent alpha masking", () => {
    expect(favicon).toContain("Naatures Scuup logo");
    expect(favicon).toContain("/manus-storage/naatures-scuup-logo-transparent_7cd2ca72.png");
    expect(favicon).toContain('mask="url(#brand-logo-mask)"');
  });
});

export {};

