import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const orbit = readFileSync(resolve(process.cwd(), "client/src/components/IceCreamOrbit.tsx"), "utf8");
const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("full-screen GSAP ice-cream sequence", () => {
  it("uses cleaned desktop and mobile video sources derived from the approved frames", () => {
    expect(orbit).toContain("mango-ice-cream-1440p-clean-scrub_59b5e815.mp4");
    expect(orbit).toContain("mango-ice-cream-portrait-mobile_4b0f7dd0.mp4");
    expect(orbit).toContain('media="(max-width: 767px)"');
    expect(orbit).toContain("ezgif-frame-001_c0bf1371.png");
    expect(orbit).toContain("<video");
    expect(orbit).toContain('preload="auto"');
    expect(orbit).not.toContain("MANGO_SCROLL_FRAMES");
  });

  it("uses sequential native playback for a restrained catch-up glide rather than random seeking", () => {
    expect(orbit).toContain('from "gsap/ScrollTrigger"');
    expect(orbit).toContain("ScrollTrigger.create");
    expect(orbit).toContain("const advanceToTarget");
    expect(orbit).toContain("video.playbackRate = delta > 3 ? 2 : delta > 1 ? 1.45 : 1.08");
    expect(orbit).toContain("void video.play()");
    expect(orbit).toContain("window.requestAnimationFrame");
    expect(orbit).toContain("const releaseCompletionLockRef");
    expect(orbit).toContain("onLeave: (self)");
    expect(orbit).toContain("self.scroll(self.end - 2)");
    expect(orbit).toContain("trigger.scroll(trigger.end + 2)");
    expect(orbit).toContain("window.innerHeight * 3.75");
    expect(orbit).toContain('pin: ".ice-orbit__stage"');
  });

  it("keeps playback text-free with the dedicated portrait mobile composition and safe loading behavior", () => {
    expect(orbit).toContain('className="ice-orbit__loading"');
    expect(orbit).toContain("prefers-reduced-motion");
    expect(orbit).toContain("@media(max-width:767px){.ice-orbit__video{object-fit:cover}}");
    expect(orbit).not.toContain("Come for the craving.");
    expect(orbit).not.toContain("Stay for the scoop.");
  });

  it("keeps the sequence before Drag It on Home", () => {
    expect(home).toContain("<IceCreamOrbit />");
    expect(home).not.toContain('className="story-section section-pad"');
  });
});

export {};
