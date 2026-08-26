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

  it("adds a clean desktop narrative while creating a distraction-free, tightly focused mobile hero", () => {
    expect(orbit).toContain('className="ice-orbit__loading"');
    expect(orbit).toContain('background:#d6d4d0 url("/manus-storage/ezgif-frame-001_c0bf1371.png") center/cover no-repeat');
    expect(orbit).toContain("prefers-reduced-motion");
    expect(orbit).toContain("@media(max-width:767px){.ice-orbit__stage{perspective:none}");
    expect(orbit).toContain(".ice-orbit__video{object-fit:cover;object-position:50% 50%");
    expect(orbit).toContain('from "framer-motion"');
    expect(orbit).toContain("const storyProgress = useMotionValue(0)");
    expect(orbit).toContain("The Mall · Kanpur");
    expect(orbit).toContain("Kanpur&apos;s first live ice-cream parlour");
    expect(orbit).toContain("Live ice cream");
    expect(orbit).toContain("Scroll to unfreeze");
    expect(orbit).toContain("Kanpur&apos;s first");
    expect(orbit).toContain("One place.");
    expect(orbit).toContain("#Freeze the");
    expect(orbit).toContain("ice-orbit__story");
    expect(orbit).toContain("background:#d6d4d0");
    expect(orbit).toContain("color:rgb(47 38 34)!important");
    expect(orbit).toContain(".ice-orbit__story-card--origin{top:18%;left:clamp(1.25rem,5vw,5.25rem);text-align:left}");
    expect(orbit).toContain(".ice-orbit__story-card--right{top:24%;right:clamp(1.25rem,5vw,5.25rem)");
    expect(orbit).toContain(".ice-orbit__story-card--end{right:clamp(1.25rem,5vw,5.25rem);bottom:14%;left:auto;text-align:right}");
    expect(orbit).not.toContain("-webkit-mask-image");
    expect(orbit).not.toContain("ice-orbit__stage::after");
    expect(orbit).not.toContain("radial-gradient");
    expect(orbit).not.toContain("linear-gradient");
    expect(orbit).not.toContain("filter:");
    expect(orbit).not.toContain("text-shadow:");
    expect(orbit).toContain('font-family:"Playfair Display",Georgia,serif');
    expect(orbit).toContain("font-family:Montserrat,ui-sans-serif,system-ui,sans-serif");
    expect(orbit).toContain(".ice-orbit__video{object-fit:cover;object-position:50% 50%;transform:scale(2.9)");
    expect(orbit).toContain(".ice-orbit__story{display:block;z-index:6;pointer-events:none}");
    expect(orbit).toContain('.ice-orbit__story-card[data-active="true"]{display:block!important;opacity:1!important');
    expect(orbit).toContain("Kanpur&apos;s first<br /><em>live scoop.</em>");
    expect(orbit).toContain("Made cold.<br /><em>Made live.</em>");
    expect(orbit).toContain("One table.<br /><em>Every craving.</em>");
    expect(orbit).toContain("Freeze the<br /><em>happiness.</em>");
    expect(orbit).toContain("transform:translate3d(-50%,0,44px) rotateX(5deg) rotateY(-4deg)!important");
    expect(orbit).toContain("perspective:980px!important");
    expect(orbit).toContain("The Naatures Scuup way.");
    expect(orbit).toContain(".ice-orbit__story-card--origin,.ice-orbit__story-card--left,.ice-orbit__story-card--right,.ice-orbit__story-card--end{top:49%!important");
    expect(orbit).toContain("ice-orbit__scroll-button");
    expect(orbit).toContain("4.35rem");
    expect(orbit).toContain('aria-label="Scroll down to continue"');
    expect(orbit).toContain("const handleScrollAdvance");
    expect(orbit).toContain("window.scrollBy");
    expect(orbit).toContain("ice-orbit__scroll-prompt");
    expect(orbit).toContain('aria-label="Scroll to the next part of the story"');
    expect(orbit).toContain(">Scroll!</button>");
  });

  it("keeps the sequence before Drag It on Home", () => {
    expect(home).toContain("<IceCreamOrbit />");
    expect(home.indexOf("<IceCreamOrbit />")).toBeLessThan(home.indexOf('className="craving-ribbon"'));
    expect(home).toContain('scrollToId("#location")');
    expect(home).not.toContain('className="story-section section-pad"');
  });

  it("uses discrete narrative checkpoints and non-overlapping story windows", () => {
    expect(orbit).toContain("STORY_SNAP_POINTS");
    expect(orbit).toContain("snapTo: STORY_SNAP_POINTS");
    expect(orbit).toContain("getStoryCheckpoint");
    expect(orbit).toContain("ice-orbit__checkpoint-rail");
    expect(orbit).toContain("perspective:1150px");
    expect(orbit).toContain("transform-style:preserve-3d");
    expect(orbit).toContain("const openingRotateY");
    expect(orbit).toContain("const parlourRotateY");
    expect(orbit).toContain("const cravingRotateY");
    expect(orbit).toContain("const endRotateY");
    expect(orbit).toContain("@media(hover:hover) and (pointer:fine)");
    expect(orbit).toContain('data-active={activeCheckpoint === 0}');
    expect(orbit).toContain('.ice-orbit__story-card[data-active="true"][data-interacting="true"] .ice-orbit__story-glyph');
    expect(orbit).toContain("handleStoryPointerMove");
    expect(orbit).toContain("MagneticTitle");
    expect(orbit).toContain("data-story-glyph");
    expect(orbit).toContain("--glyph-x");
    expect(orbit).not.toContain("ice-orbit__liquid-wake");
    expect(orbit).toContain("transform 440ms");
    expect(orbit).toContain("distance / 210");
    expect(orbit).toContain("influence * 3.2");
    expect(orbit).toContain("[40, 76, 104, 14]");
    expect(orbit).toContain("[20, 82, 118, 10]");
    expect(orbit).toContain("0.19, 0.22");
    expect(orbit).toContain("0.25, 0.28");
    expect(orbit).toContain("0.45, 0.48");
    expect(orbit).toContain("0.52, 0.55");
    expect(orbit).toContain("0.72, 0.75");
  });

  it("conceals the global header while the opening sequence remains in view", () => {
    expect(orbit).toContain("setOpeningHeaderHidden");
    expect(orbit).toContain("document.documentElement.dataset.iceHeroActive");
    expect(orbit).toContain("onEnter: () => setOpeningHeaderHidden(true)");
    expect(orbit).toContain("setOpeningHeaderHidden(false)");
  });
});

export {};
