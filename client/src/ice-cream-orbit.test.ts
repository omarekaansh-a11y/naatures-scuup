import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const orbit = readFileSync(resolve(process.cwd(), "client/src/components/IceCreamOrbit.tsx"), "utf8");
const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("full-screen GSAP ice-cream sequence", () => {
  it("uses a single cleaned lightweight 1440p video built from the approved frames", () => {
    expect(orbit).toContain("mango-ice-cream-1440p-clean-scrub_59b5e815.mp4");
    expect(orbit).toContain("ezgif-frame-001_c0bf1371.png");
    expect(orbit).toContain("<video");
    expect(orbit).toContain('preload="auto"');
    expect(orbit).not.toContain("MANGO_SCROLL_FRAMES");
  });

  it("uses animation-frame video seeking with restrained GSAP momentum easing", () => {
    expect(orbit).toContain('from "gsap"');
    expect(orbit).toContain('from "gsap/ScrollTrigger"');
    expect(orbit).toContain("gsap.registerPlugin(ScrollTrigger)");
    expect(orbit).toContain("scrub: 0.65");
    expect(orbit).toContain("window.innerHeight * 3.75");
    expect(orbit).toContain('pin: ".ice-orbit__stage"');
    expect(orbit).toContain("const scheduleSeek");
    expect(orbit).toContain("window.requestAnimationFrame");
  });

  it("keeps playback text-free with a safe loading and reduced-motion path", () => {
    expect(orbit).toContain('className="ice-orbit__loading"');
    expect(orbit).toContain("prefers-reduced-motion");
    expect(orbit).not.toContain("Come for the craving.");
    expect(orbit).not.toContain("Stay for the scoop.");
    expect(orbit).not.toContain("One table. Many moods.");
  });

  it("uses a less-cropped compact-screen composition without changing desktop cover framing", () => {
    expect(orbit).toContain("@media(max-width:767px)");
    expect(orbit).toContain("object-fit:contain");
    expect(orbit).toContain("transform:scale(1.12)");
    expect(orbit).toContain(".ice-orbit__stage::before");
    expect(orbit).toContain("filter:blur(30px)");
    expect(orbit).toContain("background:transparent");
    expect(orbit).toContain("object-fit:cover");
  });

  it("keeps the sequence before Drag It on Home", () => {
    expect(home).toContain("<IceCreamOrbit />");
    expect(home).not.toContain('className="story-section section-pad"');
  });
});

export {};
