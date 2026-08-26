import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const mobileStyles = readFileSync(resolve(process.cwd(), "client/src/mobile-first.css"), "utf8");
const orbit = readFileSync(resolve(process.cwd(), "client/src/components/IceCreamOrbit.tsx"), "utf8");

describe("mobile-first optimization safeguards", () => {
  it("keeps navigation usable through the mobile opening sequence and reserves safe areas", () => {
    expect(mobileStyles).toContain('html:root[data-ice-hero-active="true"] body .site-header');
    expect(mobileStyles).toContain("safe-area-inset-top");
    expect(mobileStyles).toContain("safe-area-inset-bottom");
    expect(mobileStyles).toContain("min-width: 44px");
    expect(mobileStyles).toContain("min-height: 44px");
  });

  it("preserves the focused mobile opening and a direct scroll affordance", () => {
    expect(orbit).toContain("transform:scale(3.1)");
    expect(orbit).toContain(".ice-orbit__story,.ice-orbit__checkpoint-rail{display:none}");
    expect(orbit).toContain('aria-label="Scroll down to continue"');
  });
});
