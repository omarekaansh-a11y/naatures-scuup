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

  it("adds a dark cinematic four-part story system while retaining dedicated portrait playback and safe loading behavior", () => {
    expect(orbit).toContain('className="ice-orbit__loading"');
    expect(orbit).toContain("prefers-reduced-motion");
    expect(orbit).toContain("@media(max-width:767px){.ice-orbit__video{object-fit:cover;filter:brightness(.7)");
    expect(orbit).toContain('from "framer-motion"');
    expect(orbit).toContain("const storyProgress = useMotionValue(0)");
    expect(orbit).toContain("Naatures");
    expect(orbit).toContain("Kanpur&apos;s first");
    expect(orbit).toContain("One place.");
    expect(orbit).toContain("#Freeze the");
    expect(orbit).toContain("ice-orbit__story");
    expect(orbit).toContain("rgb(255 255 255 / 90%)");
    expect(orbit).toContain("color:rgb(255 255 255 / 92%)!important");
    expect(orbit).toContain(".ice-orbit__story-card--origin{top:18%;left:clamp(1.25rem,5vw,5.25rem);text-align:left}");
    expect(orbit).toContain(".ice-orbit__story-card--right{top:24%;right:clamp(1.25rem,5vw,5.25rem)");
    expect(orbit).toContain(".ice-orbit__story-card--end{right:clamp(1.25rem,5vw,5.25rem);bottom:14%;left:auto;text-align:right}");
    expect(orbit).not.toContain("-webkit-mask-image");
    expect(orbit).toContain('font-family:"Playfair Display",Georgia,serif');
    expect(orbit).toContain("font-family:Montserrat,ui-sans-serif,system-ui,sans-serif");
  });

  it("keeps the sequence before Drag It on Home", () => {
    expect(home).toContain("<IceCreamOrbit />");
    expect(home).not.toContain('className="story-section section-pad"');
  });
});

export {};
