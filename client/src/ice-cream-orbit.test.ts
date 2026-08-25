import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const orbit = readFileSync(resolve(process.cwd(), "client/src/components/IceCreamOrbit.tsx"), "utf8");
const manifest = readFileSync(resolve(process.cwd(), "client/src/lib/mango-scroll-frames.ts"), "utf8");
const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("full-screen GSAP canvas frame sequence", () => {
  it("provides all 300 cleaned frames in exact numeric storage order", () => {
    expect(manifest).toContain("MANGO_SCROLL_FRAMES");
    expect(manifest).toContain("Ordered 001–300 high-detail AI dessert sequence");
    expect((manifest.match(/\/manus-storage\//g) ?? [])).toHaveLength(300);
    expect(manifest).toContain("/manus-storage/ai-mango-frame-001_d0a0ec01.jpg");
    expect(manifest).toContain("/manus-storage/ai-mango-frame-300_1a4471f4.jpg");
    const actualFrameNumbers = [...manifest.matchAll(/ai-mango-frame-(\d{3})_/g)].map((match) => Number(match[1]));
    expect(actualFrameNumbers).toEqual(Array.from({ length: 300 }, (_, index) => index + 1));
  });

  it("uses GSAP ScrollTrigger to pin and scrub the canvas until the final frame", () => {
    expect(orbit).toContain('from "gsap"');
    expect(orbit).toContain('from "gsap/ScrollTrigger"');
    expect(orbit).toContain("gsap.registerPlugin(ScrollTrigger)");
    expect(orbit).toContain("scrub: 0.35");
    expect(orbit).toContain("pin: \".ice-orbit__stage\"");
    expect(orbit).toContain("pinSpacing: true");
    expect(orbit).toContain("frame: MANGO_SCROLL_FRAME_COUNT - 1");
    expect(orbit).toContain("<canvas");
  });

  it("preloads the image sequence with a text-free fallback and full-screen canvas framing", () => {
    expect(orbit).toContain("Promise.all(MANGO_SCROLL_FRAMES.map(preloadFrame))");
    expect(orbit).toContain("Math.round(clamp(frameIndex / (MANGO_SCROLL_FRAME_COUNT - 1))");
    expect(orbit).toContain("framesRef.current[safeFrame]");
    expect(orbit).toContain("height:100svh");
    expect(orbit).toContain("drawCoverFrame");
    expect(orbit).toContain('className="ice-orbit__loading"');
    expect(orbit).not.toContain("Come for the craving.");
    expect(orbit).not.toContain("Stay for the scoop.");
    expect(orbit).not.toContain("One table. Many moods.");
  });

  it("keeps the full-screen canvas sequence in the Home pre-Drag It position", () => {
    expect(home).toContain("<IceCreamOrbit />");
    expect(home).not.toContain('className="story-section section-pad"');
  });
});

export {};
