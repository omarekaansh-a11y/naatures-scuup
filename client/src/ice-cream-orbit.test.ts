import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const orbit = readFileSync(resolve(process.cwd(), "client/src/components/IceCreamOrbit.tsx"), "utf8");
const manifest = readFileSync(resolve(process.cwd(), "client/src/lib/mango-scroll-frames.ts"), "utf8");
const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("GSAP scroll-driven ice-cream canvas sequence", () => {
  it("provides all 300 frames in ordered numeric storage paths", () => {
    expect(manifest).toContain("MANGO_SCROLL_FRAMES");
    expect((manifest.match(/\/manus-storage\//g) ?? [])).toHaveLength(300);
    expect(manifest).toContain("/manus-storage/ezgif-frame-001_");
    expect(manifest).toContain("/manus-storage/ezgif-frame-300_");
    expect(manifest).toContain("MANGO_SCROLL_FRAME_COUNT = MANGO_SCROLL_FRAMES.length");
  });

  it("uses GSAP ScrollTrigger to scrub the canvas frame playhead", () => {
    expect(orbit).toContain('from "gsap"');
    expect(orbit).toContain('from "gsap/ScrollTrigger"');
    expect(orbit).toContain("gsap.registerPlugin(ScrollTrigger)");
    expect(orbit).toContain("scrub: 0.35");
    expect(orbit).not.toContain("<video");
    expect(orbit).toContain("<canvas");
    expect(orbit).not.toContain("video.currentTime");
  });

  it("preloads frames with progress and retains mobile plus reduced-motion safeguards", () => {
    expect(orbit).toContain("Promise.all(MANGO_SCROLL_FRAMES.map(preloadFrame))");
    expect(orbit).toContain("Loading {loadedCount} of {MANGO_SCROLL_FRAME_COUNT} frames");
    expect(orbit).toContain("@media(max-width:760px)");
    expect(orbit).toContain("prefers-reduced-motion:reduce");
  });

  it("keeps the new canvas sequence in the Home pre-Drag It position", () => {
    expect(home).toContain("<IceCreamOrbit />");
    expect(home).not.toContain('className="story-section section-pad"');
  });
});

export {};
