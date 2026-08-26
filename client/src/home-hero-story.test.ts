import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("follow-on home hero story", () => {
  it("continues the opening ice-cream story rather than restarting the page narrative", () => {
    expect(home).toContain("The story continues at the table");
    expect(home).toContain("THE SCOOP IS JUST");
    expect(home).toContain("the beginning.");
  });
});
