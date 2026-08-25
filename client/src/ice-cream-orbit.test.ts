import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const orbit = readFileSync(resolve(process.cwd(), "client/src/components/IceCreamOrbit.tsx"), "utf8");
const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("scroll-driven ice-cream orbit", () => {
  it("uses the supplied mango video as a scroll-scrubbed, muted inline visual", () => {
    expect(orbit).toContain('/manus-storage/mango-ice-cream-orbit_67d8ab47.mp4');
    expect(orbit).toContain("video.currentTime = targetTime");
    expect(orbit).toContain("muted playsInline");
    expect(orbit).toContain('preload="metadata"');
  });

  it("keeps the required editorial copy, responsive behavior, and reduced-motion fallback", () => {
    expect(orbit).toContain("Come for the craving.");
    expect(orbit).toContain("Stay for the scoop.");
    expect(orbit).toContain("One table. Many moods.");
    expect(orbit).toContain("@media(max-width:760px)");
    expect(orbit).toContain("prefers-reduced-motion:reduce");
  });

  it("replaces the prior static story bridge before Drag It", () => {
    expect(home).toContain("<IceCreamOrbit />");
    expect(home).not.toContain('className="story-section section-pad"');
  });
});

export {};

