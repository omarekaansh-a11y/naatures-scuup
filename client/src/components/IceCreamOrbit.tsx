import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, TouchEvent as ReactTouchEvent } from "react";
import { motion, useMotionValue } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/contexts/LanguageContext";
import { cinematicCopy } from "@/lib/language-copy";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_VIDEO_SOURCE = "/manus-storage/mango-ice-cream-1440p-clean-scrub_59b5e815.mp4";
const MOBILE_VIDEO_SOURCE = "/manus-storage/mango-ice-cream-portrait-mobile_4b0f7dd0.mp4";
const VIDEO_POSTER = "/manus-storage/ezgif-frame-001_c0bf1371.png";
const STORY_SCROLL_START = 0.02;
const STORY_SCROLL_END = 0.88;
const STORY_CHECKPOINT_COUNT = 5;
const CHECKPOINT_GLIDE_MS = 780;
const CHECKPOINT_IDLE_MS = 120;
const CINEMATIC_GROUND = "#b8babc";
const STORY_SCROLL_POINTS = Array.from(
  { length: STORY_CHECKPOINT_COUNT },
  (_, index) => STORY_SCROLL_START + ((STORY_SCROLL_END - STORY_SCROLL_START) * index) / (STORY_CHECKPOINT_COUNT - 1),
);
const CAMERA_COMPOSITIONS = [
  { x: 26, y: 0, rotation: -0.45, scale: 1.36, origin: "100% 50%", duration: 1880, mobileX: -1.4, mobileY: 0 },
  { x: 31, y: -0.3, rotation: -0.8, scale: 1.4, origin: "100% 50%", duration: 2080, mobileX: 1.8, mobileY: -0.4 },
  { x: -31, y: 0.25, rotation: 0.7, scale: 1.4, origin: "0% 50%", duration: 1760, mobileX: -1.8, mobileY: 0.25 },
  { x: 31, y: 0.45, rotation: -0.52, scale: 1.38, origin: "100% 50%", duration: 1980, mobileX: 1.5, mobileY: 0.35 },
  { x: -28, y: -0.15, rotation: 0.34, scale: 1.34, origin: "0% 50%", duration: 2260, mobileX: -1.2, mobileY: -0.15 },
] as const;

function setOpeningHeaderHidden(isHidden: boolean) {
  document.documentElement.dataset.iceHeroActive = isHidden ? "true" : "false";
}

function getStoryCheckpoint(progress: number) {
  const closestStop = STORY_SCROLL_POINTS.reduce(
    (closestIndex, point, index) => Math.abs(point - progress) < Math.abs(STORY_SCROLL_POINTS[closestIndex] - progress) ? index : closestIndex,
    0,
  );
  return closestStop;
}

function MagneticTitle({ text }: { text: string }) {
  return <span className="ice-orbit__magnetic-word">{Array.from(text).map((character, index) => <span key={`${character}-${index}`} className="ice-orbit__story-glyph" data-story-glyph>{character === " " ? "\u00a0" : character}</span>)}</span>;
}

const sequenceStyles = `
  .ice-orbit{position:relative;width:100%;background:${CINEMATIC_GROUND};isolation:isolate}
  .ice-orbit__stage{position:relative;width:100%;height:100svh;overflow:hidden;background:${CINEMATIC_GROUND};perspective:1150px;perspective-origin:50% 50%}
  .ice-orbit__video{display:block;width:100%;height:100%;object-fit:cover;object-position:center;background:${CINEMATIC_GROUND} url("/manus-storage/ezgif-frame-001_c0bf1371.png") center/cover no-repeat;transform:translate3d(var(--camera-x,0vw),var(--camera-y,0vh),0) rotate(var(--camera-rotation,0deg)) scale(var(--camera-scale,1));transform-origin:var(--camera-origin,50% 50%);transition:transform var(--camera-duration,2000ms) cubic-bezier(.22,1,.36,1);will-change:transform}
  .ice-orbit__loading{position:absolute;inset:0;z-index:4;background:${CINEMATIC_GROUND} url("/manus-storage/ezgif-frame-001_c0bf1371.png") center/cover no-repeat;pointer-events:none}
  .ice-orbit__story{position:absolute;inset:0;z-index:3;pointer-events:none;color:rgb(54 43 38 / 90%);font-family:Montserrat,ui-sans-serif,system-ui,sans-serif;letter-spacing:-.018em}
  .ice-orbit__story-card{position:absolute;width:min(21rem,24vw);text-wrap:balance;transform-style:preserve-3d;transform-origin:center center;will-change:transform,opacity}
  .ice-orbit__story-card>*{position:relative;z-index:2;transform:translateZ(14px)}
  .ice-orbit__story-card--origin{top:18%;left:clamp(1.25rem,5vw,5.25rem);text-align:left}
  .ice-orbit__story-card--left{top:29%;left:clamp(1.25rem,5vw,5.25rem)}
  .ice-orbit__story-card--right{top:24%;right:clamp(1.25rem,5vw,5.25rem);bottom:auto;text-align:right}
  .ice-orbit__story-card--variety{top:58%;left:clamp(1.25rem,5vw,5.25rem);width:min(20rem,23vw);text-align:left}.ice-orbit__story-card--end{right:clamp(1.25rem,5vw,5.25rem);bottom:14%;left:auto;text-align:right}
  .ice-orbit__story-kicker{display:flex;align-items:center;gap:.7rem;margin:0 0 1rem;color:rgb(74 63 57 / 82%);font-family:Montserrat,ui-sans-serif,system-ui,sans-serif;font-size:.62rem;font-weight:400;letter-spacing:.24em;text-transform:uppercase}
  .ice-orbit__story-card--right .ice-orbit__story-kicker{justify-content:flex-end}
  .ice-orbit__story-kicker::before{content:"";display:block;width:1.8rem;height:1px;background:currentColor}
  .ice-orbit__story-title{margin:0;color:rgb(47 38 34)!important;font-family:"Playfair Display",Georgia,serif;font-size:clamp(2.55rem,5.55vw,5.85rem);font-weight:700;line-height:.86;letter-spacing:-.075em;text-transform:uppercase}
  .ice-orbit__story-title--label{display:table;max-width:100%;padding:.5rem .65rem .58rem;border:2px solid var(--print-ink);background:var(--print-lime);box-shadow:5px 5px 0 var(--print-ink);color:var(--print-ink)!important;transform:rotate(-.7deg)}
  .ice-orbit__magnetic-word{display:inline-block;white-space:nowrap}
  .ice-orbit__story-glyph{display:inline-block;will-change:transform;transform:translate3d(var(--glyph-x,0px),var(--glyph-y,0px),var(--glyph-z,0px)) scale(var(--glyph-scale-x,1),var(--glyph-scale-y,1)) skewX(var(--glyph-skew,0deg));transition:transform 560ms cubic-bezier(.16,1,.3,1)}
  .ice-orbit__story-card--origin .ice-orbit__story-title{font-size:clamp(3rem,6.3vw,6.55rem)}
  .ice-orbit__story-title em{font-family:"Playfair Display",Georgia,serif;font-style:italic;font-weight:700;letter-spacing:-.085em;text-transform:none}
  .ice-orbit__story-copy{max-width:29rem;margin:1.2rem 0 0;color:rgb(84 74 68 / 88%);font-family:Montserrat,ui-sans-serif,system-ui,sans-serif;font-size:clamp(.82rem,1.34vw,1.08rem);font-weight:400;line-height:1.6;letter-spacing:.06em}
  .ice-orbit__story-copy--label{display:table;max-width:min(25rem,100%);padding:.55rem .65rem;border:2px solid var(--print-ink);background:var(--print-lime);box-shadow:4px 4px 0 var(--print-ink);color:var(--print-ink);font-weight:700;line-height:1.35;transform:rotate(.5deg)}
  .ice-orbit__story-closing-stamp{display:table;margin:1rem 0 0 auto;padding:.42rem .55rem;border:2px solid var(--print-ink);background:var(--print-lime);box-shadow:4px 4px 0 var(--print-ink);color:var(--print-ink);font:800 .54rem/1 Montserrat,ui-sans-serif,system-ui,sans-serif;letter-spacing:.11em;text-transform:uppercase;transform:rotate(-1.1deg)}
  .ice-orbit__story-card--origin .ice-orbit__story-copy,.ice-orbit__story-card--end .ice-orbit__story-copy{margin-inline:auto}
  .ice-orbit__story-card--right .ice-orbit__story-copy{margin-left:auto}
  .ice-orbit__story-facts{display:flex;gap:.65rem;flex-wrap:wrap;margin:1.25rem 0 0;padding-top:.75rem;border-top:1px solid rgb(74 63 57 / 26%);color:rgb(74 63 57 / 76%);font:400 .54rem/1.3 Montserrat,ui-sans-serif,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase}.ice-orbit__story-facts span+span::before{content:"/";margin-right:.65rem;color:rgb(74 63 57 / 44%)}
  .ice-orbit__checkpoint-rail{position:absolute;z-index:4;left:clamp(1.25rem,5vw,5.25rem);bottom:clamp(1.5rem,4vw,3rem);display:flex;align-items:center;gap:.55rem;color:rgb(58 49 44 / 56%);font:400 .55rem/1 Montserrat,ui-sans-serif,system-ui,sans-serif;letter-spacing:.12em}.ice-orbit__checkpoint{display:block;width:.46rem;height:.46rem;border:1px solid currentColor;border-radius:999px;transition:background 180ms var(--ease-out),transform 180ms var(--ease-out)}.ice-orbit__checkpoint[data-active="true"]{background:currentColor;transform:scale(1.25)}.ice-orbit__checkpoint-label{margin-left:.25rem;text-transform:uppercase}.ice-orbit__checkpoint-prompt{margin-right:.3rem;font-size:.5rem;letter-spacing:.17em;text-transform:uppercase}
  .ice-orbit__scroll-prompt{position:absolute;z-index:7;top:clamp(1.25rem,3.2vw,2.6rem);left:50%;display:inline-flex;align-items:center;gap:.5rem;border:0;background:transparent;color:rgb(47 38 34 / 84%);font:700 .56rem/1 Montserrat,ui-sans-serif,system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase;transform:translateX(-50%);cursor:pointer}.ice-orbit__scroll-prompt::after{content:"";width:1.35rem;height:1px;background:currentColor;opacity:.65}.ice-orbit__scroll-prompt:focus-visible{outline:2px solid rgb(47 38 34);outline-offset:5px}.ice-orbit__scroll-prompt:active{transform:translateX(-50%) scale(.96)}
  .ice-orbit__scroll-button{position:absolute;z-index:5;left:50%;bottom:clamp(1.15rem,3vw,2.25rem);display:none;width:3rem;height:3rem;place-items:center;padding:0;border:1px solid rgb(58 49 44 / 52%);border-radius:999px;background:rgb(214 212 208 / 80%);color:rgb(47 38 34);font:400 1.45rem/1 Montserrat,ui-sans-serif,system-ui,sans-serif;transform:translateX(-50%);transition:transform 180ms var(--ease-out),background 180ms var(--ease-out),border-color 180ms var(--ease-out);cursor:pointer}.ice-orbit__scroll-button:hover{background:rgb(214 212 208);border-color:rgb(58 49 44 / 78%)}.ice-orbit__scroll-button:focus-visible{outline:2px solid rgb(47 38 34);outline-offset:4px}.ice-orbit__scroll-button:active{transform:translateX(-50%) scale(.94)}.ice-orbit__scroll-button:disabled{opacity:0;pointer-events:none}
  @media(hover:hover) and (pointer:fine){.ice-orbit__story-card[data-active="true"]{pointer-events:auto}.ice-orbit__story-card[data-active="true"][data-interacting="true"] .ice-orbit__story-glyph{transition-duration:240ms}}
  .ice-orbit__mobile-title{display:none}
  @media(max-width:767px){.ice-orbit__stage{perspective:none;background:${CINEMATIC_GROUND}}.ice-orbit__video{object-fit:cover;object-position:50% 50%;background-color:${CINEMATIC_GROUND};transform:translate3d(var(--mobile-camera-x,0vw),var(--mobile-camera-y,0vh),0) scale(2.9);transform-origin:50% 50%;transition:transform var(--camera-duration,2000ms) cubic-bezier(.22,1,.36,1)}.ice-orbit__story{display:block;z-index:6;pointer-events:none}.ice-orbit__story-card{display:none!important;top:calc(4.8rem + env(safe-area-inset-top))!important;right:auto!important;bottom:auto!important;left:1rem!important;width:min(12rem,54vw)!important;text-align:left!important;transform:none!important}.ice-orbit__story-card[data-active="true"]{display:block!important;opacity:1!important;transform:none!important}.ice-orbit__story-card>*{transform:none!important}.ice-orbit__story-kicker,.ice-orbit__story-copy,.ice-orbit__story-facts,.ice-orbit__desktop-title{display:none!important}.ice-orbit__mobile-title{display:inline}.ice-orbit__story-title,.ice-orbit__story-card--origin .ice-orbit__story-title{color:rgb(47 38 34)!important;font-size:clamp(1.28rem,6.3vw,1.65rem)!important;line-height:.84!important;letter-spacing:-.065em!important}.ice-orbit__story-title em{letter-spacing:-.075em}.ice-orbit__checkpoint-rail{display:none}.ice-orbit__scroll-prompt{top:calc(4.25rem + env(safe-area-inset-top));right:1rem;left:auto;font-size:.48rem;letter-spacing:.16em;transform:none}.ice-orbit__scroll-prompt:active{transform:scale(.96)}.ice-orbit__scroll-button{bottom:calc(max(1.2rem,env(safe-area-inset-bottom)) + 4.35rem);display:grid;width:3.25rem;height:3.25rem;background:rgb(214 212 208 / 88%)}}
  @media(max-width:767px){.ice-orbit__stage{perspective:980px!important;perspective-origin:50% 44%}.ice-orbit__story-card{top:29%!important;left:50%!important;right:auto!important;bottom:auto!important;width:min(18rem,78vw)!important;text-align:center!important;transform-origin:center center!important;transform-style:preserve-3d!important}.ice-orbit__story-card[data-active="true"]{transform:translate3d(-50%,0,44px) rotateX(5deg) rotateY(-4deg)!important}.ice-orbit__story-card--left[data-active="true"]{transform:translate3d(-50%,0,50px) rotateX(4deg) rotateY(5deg)!important}.ice-orbit__story-card--right[data-active="true"]{transform:translate3d(-50%,0,54px) rotateX(6deg) rotateY(-6deg)!important}.ice-orbit__story-card--end[data-active="true"]{transform:translate3d(-50%,0,48px) rotateX(4deg) rotateY(4deg)!important}.ice-orbit__story-card>*{transform:translateZ(18px)!important}.ice-orbit__story-kicker{display:flex!important;justify-content:center!important;gap:.45rem!important;margin:0 0 .48rem!important;color:rgb(47 38 34 / 82%)!important;font-size:.46rem!important;letter-spacing:.17em!important}.ice-orbit__story-kicker::before{width:1.2rem!important}.ice-orbit__story-copy{display:block!important;max-width:17rem!important;margin:.55rem auto 0!important;color:rgb(47 38 34 / 88%)!important;font-size:.62rem!important;line-height:1.38!important;letter-spacing:.035em!important}.ice-orbit__story-facts{display:flex!important;justify-content:center!important;gap:.42rem!important;margin:.52rem auto 0!important;padding-top:.45rem!important;border-top-color:rgb(47 38 34 / 26%)!important;color:rgb(47 38 34 / 76%)!important;font-size:.41rem!important;letter-spacing:.1em!important}.ice-orbit__story-facts span+span::before{margin-right:.42rem!important}.ice-orbit__story-title,.ice-orbit__story-card--origin .ice-orbit__story-title{color:rgb(47 38 34)!important;font-size:clamp(2.05rem,10.2vw,2.9rem)!important;line-height:.78!important;letter-spacing:-.075em!important;text-wrap:balance}.ice-orbit__story-title em{letter-spacing:-.09em!important}.ice-orbit__story-card--end .ice-orbit__story-copy{display:block!important}.ice-orbit__desktop-title{display:none!important}.ice-orbit__mobile-title{display:inline!important}}
  @media(max-width:767px){.ice-orbit__story-card--origin{top:55%!important;left:50%!important;width:min(16rem,70vw)!important;text-align:center!important}.ice-orbit__story-card--origin[data-active="true"]{transform:translate3d(-50%,0,48px) rotateX(6deg) rotateY(-3deg)!important}.ice-orbit__story-card--left{top:49%!important;left:.7rem!important;width:min(12rem,47vw)!important;text-align:left!important}.ice-orbit__story-card--left[data-active="true"]{transform:translate3d(0,0,52px) rotateX(5deg) rotateY(7deg)!important}.ice-orbit__story-card--left .ice-orbit__story-kicker{justify-content:flex-start!important}.ice-orbit__story-card--left .ice-orbit__story-copy{margin-left:0!important}.ice-orbit__story-card--right{top:46%!important;right:.7rem!important;left:auto!important;width:min(12rem,47vw)!important;text-align:right!important}.ice-orbit__story-card--right[data-active="true"]{transform:translate3d(0,0,54px) rotateX(6deg) rotateY(-8deg)!important}.ice-orbit__story-card--right .ice-orbit__story-kicker{justify-content:flex-end!important}.ice-orbit__story-card--right .ice-orbit__story-copy{margin-right:0!important;margin-left:auto!important}.ice-orbit__story-card--variety{top:53%!important;right:auto!important;bottom:auto!important;left:50%!important;width:min(15rem,68vw)!important;text-align:center!important}.ice-orbit__story-card--variety[data-active="true"]{transform:translate3d(-50%,0,44px) rotateX(5deg) rotateY(-4deg)!important}.ice-orbit__story-card--end{top:54%!important;right:auto!important;bottom:auto!important;left:50%!important;width:min(17rem,74vw)!important;text-align:center!important}.ice-orbit__story-card--end[data-active="true"]{transform:translate3d(-50%,0,42px) rotateX(4deg) rotateY(3deg)!important}.ice-orbit__story-card--end .ice-orbit__story-copy{margin-top:.42rem!important}}
  @media(max-width:767px){.ice-orbit__story-card--origin,.ice-orbit__story-card--left,.ice-orbit__story-card--right{top:60%!important;right:auto!important;bottom:auto!important;left:50%!important;width:min(15rem,67vw)!important;text-align:center!important}.ice-orbit__story-card--variety{top:53%!important;right:auto!important;bottom:auto!important;left:50%!important;width:min(14.5rem,65vw)!important;text-align:center!important}.ice-orbit__story-card--end{top:53%!important;right:auto!important;bottom:auto!important;left:50%!important;width:min(17rem,74vw)!important;text-align:center!important}.ice-orbit__story-card--origin[data-active="true"]{transform:translate3d(-50%,0,48px) rotateX(5deg) rotateY(-3deg)!important}.ice-orbit__story-card--left[data-active="true"]{transform:translate3d(-50%,0,50px) rotateX(4deg) rotateY(4deg)!important}.ice-orbit__story-card--right[data-active="true"]{transform:translate3d(-50%,0,52px) rotateX(5deg) rotateY(-5deg)!important}.ice-orbit__story-card--variety[data-active="true"]{transform:translate3d(-50%,0,50px) rotateX(4deg) rotateY(-4deg)!important}.ice-orbit__story-card--end[data-active="true"]{transform:translate3d(-50%,0,46px) rotateX(4deg) rotateY(3deg)!important}.ice-orbit__story-card--left .ice-orbit__story-kicker,.ice-orbit__story-card--right .ice-orbit__story-kicker,.ice-orbit__story-card--variety .ice-orbit__story-kicker{justify-content:center!important}.ice-orbit__story-card--left .ice-orbit__story-copy,.ice-orbit__story-card--right .ice-orbit__story-copy,.ice-orbit__story-card--variety .ice-orbit__story-copy{margin-right:auto!important;margin-left:auto!important}.ice-orbit__story-kicker{font-size:.5rem!important;color:rgb(47 38 34 / 92%)!important}.ice-orbit__story-copy{font-size:.68rem!important;line-height:1.42!important;color:rgb(47 38 34 / 94%)!important}.ice-orbit__story-facts{font-size:.45rem!important;color:rgb(47 38 34 / 84%)!important}.ice-orbit__story-card--origin .ice-orbit__story-facts,.ice-orbit__story-card--left .ice-orbit__story-facts,.ice-orbit__story-card--right .ice-orbit__story-facts,.ice-orbit__story-card--variety .ice-orbit__story-facts{display:none!important}.ice-orbit__story-card--origin .ice-orbit__story-kicker,.ice-orbit__story-card--left .ice-orbit__story-kicker,.ice-orbit__story-card--right .ice-orbit__story-kicker,.ice-orbit__story-card--variety .ice-orbit__story-kicker{margin-bottom:.28rem!important}.ice-orbit__story-card--origin .ice-orbit__story-copy,.ice-orbit__story-card--left .ice-orbit__story-copy,.ice-orbit__story-card--right .ice-orbit__story-copy,.ice-orbit__story-card--variety .ice-orbit__story-copy{margin-top:.34rem!important;font-size:.62rem!important;line-height:1.3!important}.ice-orbit__story-card--end .ice-orbit__story-title{font-size:clamp(1.85rem,9.2vw,2.55rem)!important;line-height:.82!important}.ice-orbit__story-title--label{margin-inline:auto!important;padding:.34rem .42rem .4rem!important;font-size:clamp(1.6rem,7vw,2.1rem)!important;box-shadow:3px 3px 0 var(--print-ink)}.ice-orbit__story-copy--label{margin:.45rem auto 0!important;padding:.4rem .48rem!important;font-size:.56rem!important;line-height:1.27!important;box-shadow:3px 3px 0 var(--print-ink)}.ice-orbit__story-closing-stamp{margin:.6rem auto 0!important;padding:.36rem .43rem!important;font-size:.46rem!important;box-shadow:3px 3px 0 var(--print-ink)} }
  @media(min-width:768px){.ice-orbit__stage{perspective:1150px!important;perspective-origin:50% 50%!important}.ice-orbit__video{object-fit:cover!important;object-position:center!important}.ice-orbit__story-card--origin{top:18%!important;right:auto!important;bottom:auto!important;left:clamp(1.25rem,5vw,5.25rem)!important;width:min(25rem,29vw)!important;text-align:left!important}.ice-orbit__story-card--left{top:25%!important;right:auto!important;bottom:auto!important;left:clamp(1.25rem,5vw,5.25rem)!important;width:min(20rem,22vw)!important;text-align:left!important}.ice-orbit__story-card--left .ice-orbit__story-title--label{padding:.42rem .54rem .48rem!important;font-size:clamp(2.1rem,3.9vw,4.2rem)!important;line-height:.82!important}.ice-orbit__story-card--right{top:24%!important;right:clamp(1.25rem,5vw,5.25rem)!important;bottom:auto!important;left:auto!important;width:min(25rem,29vw)!important;text-align:right!important}.ice-orbit__story-card--end{top:auto!important;right:clamp(1.25rem,5vw,5.25rem)!important;bottom:14%!important;left:auto!important;width:min(25rem,29vw)!important;text-align:right!important}.ice-orbit__story-card>*{transform:translateZ(14px)!important}.ice-orbit__story-kicker,.ice-orbit__story-copy,.ice-orbit__story-facts{display:flex!important}.ice-orbit__story-copy{display:block!important}.ice-orbit__mobile-title{display:none!important}.ice-orbit__desktop-title{display:inline!important}}
  @media(max-width:767px){.ice-orbit__video{transform:scale(2.72)!important;transition:none!important}.ice-orbit__story-card--origin,.ice-orbit__story-card--left,.ice-orbit__story-card--right{top:64%!important}.ice-orbit__story-card--variety,.ice-orbit__story-card--end{top:59%!important}}
  @media(prefers-reduced-motion:reduce){.ice-orbit__stage{min-height:100svh}}
`;

export function IceCreamOrbit() {
  const { language } = useLanguage();
  const copy = cinematicCopy[language];
  const [originMobileTop, originMobileEmphasis] = copy.originMobile.split("|");
  const [parlourDesktopTop, parlourDesktopEmphasis, parlourDesktopBottom] = copy.parlourDesktop.split("|");
  const [parlourMobileTop, parlourMobileEmphasis] = copy.parlourMobile.split("|");
  const [cravingDesktopTop, cravingDesktopEmphasis] = copy.cravingDesktop.split("|");
  const [cravingMobileTop, cravingMobileEmphasis] = copy.cravingMobile.split("|");
  const [varietyDesktopTop, varietyDesktopEmphasis] = copy.varietyDesktop.split("|");
  const [varietyMobileTop, varietyMobileEmphasis] = copy.varietyMobile.split("|");
  const [endDesktopTop, endDesktopBottom] = copy.endDesktop.split("|");
  const [endMobileTop, endMobileEmphasis] = copy.endMobile.split("|");
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const settleAnimationRef = useRef<number | null>(null);
  const releaseCompletionLockRef = useRef<(() => void) | null>(null);
  const cinematicTriggerRef = useRef<ScrollTrigger | null>(null);
  const completionLockedRef = useRef(false);
  const checkpointStepRef = useRef(0);
  const checkpointInputLockedRef = useRef(false);
  const checkpointInputDirectionRef = useRef<1 | -1 | null>(null);
  const checkpointReleaseTimeoutRef = useRef<number | null>(null);
  const checkpointAnimationRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const checkpointRef = useRef(0);
  const postCinematicExitRef = useRef(false);
  const storyProgress = useMotionValue(0);
  const [isReady, setIsReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeCheckpoint, setActiveCheckpoint] = useState(0);
  const [cameraReadyForMotion, setCameraReadyForMotion] = useState(false);
  const cardStyle = (index: number, rotateY: number, rotateX: number, rotateZ: number) => ({
    opacity: activeCheckpoint === index ? 1 : 0,
    y: activeCheckpoint === index ? 0 : index < activeCheckpoint ? -28 : 28,
    rotateY: activeCheckpoint === index ? rotateY : rotateY * 1.65,
    rotateX: activeCheckpoint === index ? rotateX : rotateX + 7,
    rotateZ: activeCheckpoint === index ? rotateZ : rotateZ * 0.45,
    z: activeCheckpoint === index ? 84 : 10,
  });
  const camera = CAMERA_COMPOSITIONS[activeCheckpoint];
  const cameraStyle = {
    "--camera-x": `${camera.x}vw`,
    "--camera-y": `${camera.y}vh`,
    "--camera-rotation": `${camera.rotation}deg`,
    "--camera-scale": String(camera.scale),
    "--camera-origin": camera.origin,
    "--camera-duration": `${cameraReadyForMotion ? camera.duration : 0}ms`,
    "--mobile-camera-x": `${camera.mobileX}vw`,
    "--mobile-camera-y": `${camera.mobileY}vh`,
  } as React.CSSProperties;
  const handleStoryPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const card = event.currentTarget;
    card.dataset.interacting = "true";
    card.querySelectorAll<HTMLElement>("[data-story-glyph]").forEach((glyph) => {
      const bounds = glyph.getBoundingClientRect();
      const deltaX = event.clientX - (bounds.left + bounds.width / 2);
      const deltaY = event.clientY - (bounds.top + bounds.height / 2);
      const distance = Math.hypot(deltaX, deltaY);
      const influence = Math.max(0, 1 - distance / 260);
      const safeDistance = Math.max(distance, 1);
      const directionX = deltaX / safeDistance;
      const directionY = deltaY / safeDistance;
      glyph.style.setProperty("--glyph-x", `${(directionX * influence * 1.05).toFixed(2)}px`);
      glyph.style.setProperty("--glyph-y", `${(directionY * influence * 0.7).toFixed(2)}px`);
      glyph.style.setProperty("--glyph-z", `${(influence * 0.8).toFixed(2)}px`);
      glyph.style.setProperty("--glyph-scale-x", `${(1 + influence * 0.007).toFixed(3)}`);
      glyph.style.setProperty("--glyph-scale-y", `${(1 - influence * 0.005).toFixed(3)}`);
      glyph.style.setProperty("--glyph-skew", `${(directionX * influence * 0.16).toFixed(2)}deg`);
    });
  };

  const handleStoryPointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    delete event.currentTarget.dataset.interacting;
    event.currentTarget.querySelectorAll<HTMLElement>("[data-story-glyph]").forEach((glyph) => {
      ["--glyph-x", "--glyph-y", "--glyph-z", "--glyph-scale-x", "--glyph-scale-y", "--glyph-skew"].forEach((property) => glyph.style.removeProperty(property));
    });
  };

  const requestCheckpointAdvance = (direction: 1 | -1) => {
    const trigger = cinematicTriggerRef.current;
    if (!trigger || completionLockedRef.current) return;
    const currentScroll = trigger.scroll();
    if (currentScroll < trigger.start - 4 || currentScroll > trigger.end + 4) return;

    const nextStep = Math.max(0, Math.min(STORY_SCROLL_POINTS.length - 1, checkpointStepRef.current + direction));
    if (nextStep === checkpointStepRef.current) return;

    if (checkpointInputLockedRef.current && checkpointInputDirectionRef.current !== direction) {
      if (checkpointReleaseTimeoutRef.current !== null) window.clearTimeout(checkpointReleaseTimeoutRef.current);
      if (checkpointAnimationRef.current !== null) window.cancelAnimationFrame(checkpointAnimationRef.current);
      checkpointReleaseTimeoutRef.current = null;
      checkpointAnimationRef.current = null;
    } else if (checkpointInputLockedRef.current) {
      return;
    }

    setCameraReadyForMotion(true);
    checkpointStepRef.current = nextStep;
    checkpointInputLockedRef.current = true;
    checkpointInputDirectionRef.current = direction;
    if (checkpointReleaseTimeoutRef.current !== null) window.clearTimeout(checkpointReleaseTimeoutRef.current);
    const targetScroll = trigger.start + (trigger.end - trigger.start) * STORY_SCROLL_POINTS[nextStep];
    if (checkpointAnimationRef.current !== null) window.cancelAnimationFrame(checkpointAnimationRef.current);
    const scrollStart = window.scrollY;
    const distance = targetScroll - scrollStart;
    const animationStart = window.performance.now();
    const glideToCheckpoint = (now: number) => {
      const progress = Math.min((now - animationStart) / CHECKPOINT_GLIDE_MS, 1);
      // A longer cubic ease-out preserves the physical carry of a scroll gesture without overshooting into the next story state.
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      window.scrollTo({ top: scrollStart + distance * easedProgress, behavior: "auto" });
      if (progress < 1) {
        checkpointAnimationRef.current = window.requestAnimationFrame(glideToCheckpoint);
      } else {
        checkpointAnimationRef.current = null;
      }
    };
    if (reduceMotion) {
      window.scrollTo({ top: targetScroll, behavior: "auto" });
    } else {
      checkpointAnimationRef.current = window.requestAnimationFrame(glideToCheckpoint);
    }
    checkpointReleaseTimeoutRef.current = window.setTimeout(() => {
      checkpointInputLockedRef.current = false;
      checkpointInputDirectionRef.current = null;
      checkpointReleaseTimeoutRef.current = null;
    }, reduceMotion ? 0 : CHECKPOINT_GLIDE_MS + CHECKPOINT_IDLE_MS);
  };

  const handleScrollAdvance = () => requestCheckpointAdvance(1);

  const exitCompletedCinematic = (inputDistance: number) => {
    const trigger = cinematicTriggerRef.current;
    const section = sectionRef.current;
    const stage = section?.querySelector<HTMLElement>(".ice-orbit__stage");
    if (!trigger || !section || !stage) return;

    postCinematicExitRef.current = true;
    completionLockedRef.current = false;
    checkpointInputLockedRef.current = false;
    setOpeningHeaderHidden(false);
    trigger.kill(true);
    cinematicTriggerRef.current = null;
    const forwardOffset = Math.max(Math.min(inputDistance * 0.35, window.innerHeight * 0.58), 180);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: section.offsetTop + stage.offsetHeight + forwardOffset, behavior: "auto" });
    });
  };

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (isReady) event.preventDefault();
  };

  const handleTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    const touchStartY = touchStartYRef.current;
    const touchEndY = event.changedTouches[0]?.clientY;
    touchStartYRef.current = null;
    if (touchStartY === null || touchEndY === undefined || Math.abs(touchStartY - touchEndY) < 26) return;
    const video = videoRef.current;
    const trigger = cinematicTriggerRef.current;
    const isFinished = video && (video.ended || video.currentTime >= video.duration - 0.01);
    if (touchStartY > touchEndY && trigger && checkpointStepRef.current >= STORY_SCROLL_POINTS.length - 1 && isFinished) {
      exitCompletedCinematic(Math.abs(touchStartY - touchEndY));
      return;
    }
    requestCheckpointAdvance(touchStartY > touchEndY ? 1 : -1);
  };

  const advanceToTarget = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    if (settleAnimationRef.current !== null) return;

    const settle = () => {
      const targetTime = targetTimeRef.current;
      const delta = targetTime - video.currentTime;

      if (delta < -0.08) {
        video.pause();
        video.currentTime = targetTime;
        settleAnimationRef.current = null;
        return;
      }

      const finalTarget = targetTime >= video.duration - 0.04;
      if (finalTarget && !(video.ended || video.currentTime >= video.duration - 0.01)) {
        video.playbackRate = delta > 3 ? 2 : delta > 1 ? 1.45 : 1.08;
        if (video.paused) void video.play().catch(() => undefined);
        settleAnimationRef.current = window.requestAnimationFrame(settle);
        return;
      }

      if (delta <= 0.04) {
        video.pause();
        video.playbackRate = 1;
        settleAnimationRef.current = null;
        if (finalTarget) releaseCompletionLockRef.current?.();
        return;
      }

      video.playbackRate = delta > 3 ? 2 : delta > 1 ? 1.45 : 1.08;
      if (video.paused) void video.play().catch(() => undefined);
      settleAnimationRef.current = window.requestAnimationFrame(settle);
    };

    settleAnimationRef.current = window.requestAnimationFrame(settle);
  };

  const handleVideoReady = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    targetTimeRef.current = 0;
    completionLockedRef.current = false;
    checkpointStepRef.current = 0;
    checkpointInputLockedRef.current = false;
    checkpointInputDirectionRef.current = null;
    setCameraReadyForMotion(false);
    storyProgress.set(0);
    checkpointRef.current = 0;
    setActiveCheckpoint(0);
    setIsReady(true);
  };

  useEffect(() => {
    const handleCheckpointWheel = (event: WheelEvent) => {
      const trigger = cinematicTriggerRef.current;
      if (!isReady || !trigger || Math.abs(event.deltaY) < 4) return;
      const video = videoRef.current;
      if (event.deltaY > 0 && video && (video.ended || video.currentTime >= video.duration - 0.01)) {
        event.preventDefault();
        exitCompletedCinematic(Math.abs(event.deltaY));
        return;
      }
      const currentScroll = trigger.scroll();
      if (currentScroll < trigger.start - 4 || currentScroll > trigger.end + 4) return;
      event.preventDefault();
      if (checkpointInputLockedRef.current) {
        const inputDirection: 1 | -1 = event.deltaY > 0 ? 1 : -1;
        if (checkpointInputDirectionRef.current !== inputDirection) {
          requestCheckpointAdvance(inputDirection);
          return;
        }
        if (checkpointReleaseTimeoutRef.current !== null) window.clearTimeout(checkpointReleaseTimeoutRef.current);
        checkpointReleaseTimeoutRef.current = window.setTimeout(() => {
          checkpointInputLockedRef.current = false;
          checkpointInputDirectionRef.current = null;
          checkpointReleaseTimeoutRef.current = null;
        }, reduceMotion ? 0 : CHECKPOINT_GLIDE_MS + CHECKPOINT_IDLE_MS);
        return;
      }
      requestCheckpointAdvance(event.deltaY > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", handleCheckpointWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", handleCheckpointWheel, { capture: true });
  }, [isReady, reduceMotion]);

  useEffect(() => {
    const revealHeaderAfterExit = () => {
      const trigger = cinematicTriggerRef.current;
      const video = videoRef.current;
      if (!trigger || !video || !(video.ended || video.currentTime >= video.duration - 0.01)) return;
      if (window.scrollY > trigger.end + 80) setOpeningHeaderHidden(false);
    };
    window.addEventListener("scroll", revealHeaderAfterExit, { passive: true });
    return () => window.removeEventListener("scroll", revealHeaderAfterExit);
  }, [setOpeningHeaderHidden]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(query.matches);
    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    setOpeningHeaderHidden(true);
    return () => setOpeningHeaderHidden(false);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || !Number.isFinite(video.duration)) return;

    if (reduceMotion) {
      video.pause();
      video.currentTime = 0;
      storyProgress.set(0.12);
      setOpeningHeaderHidden(false);
      return;
    }

    let waitingForCompletion = false;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${Math.max(window.innerHeight * 3.75, 2800)}`,
      pin: ".ice-orbit__stage",
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const finalStoryCheckpoint = STORY_SCROLL_POINTS[STORY_SCROLL_POINTS.length - 1];
        const isAtFinalStoryCheckpoint = self.progress >= finalStoryCheckpoint - 0.004;
        if (self.progress < finalStoryCheckpoint - 0.02) completionLockedRef.current = false;
        if (isAtFinalStoryCheckpoint && !(video.ended || video.currentTime >= video.duration - 0.01)) {
          completionLockedRef.current = true;
          waitingForCompletion = true;
        }
        targetTimeRef.current = completionLockedRef.current ? video.duration : self.progress * video.duration;
        storyProgress.set(self.progress);
        const nextCheckpoint = getStoryCheckpoint(self.progress);
        const nextScrollStep = STORY_SCROLL_POINTS.reduce((closestIndex, point, index) => Math.abs(point - self.progress) < Math.abs(STORY_SCROLL_POINTS[closestIndex] - self.progress) ? index : closestIndex, 0);
        checkpointStepRef.current = nextScrollStep;
        if (checkpointRef.current !== nextCheckpoint) {
          checkpointRef.current = nextCheckpoint;
          setActiveCheckpoint(nextCheckpoint);
        }
        advanceToTarget();
      },
      onEnter: () => setOpeningHeaderHidden(true),
      onEnterBack: () => setOpeningHeaderHidden(true),
      onLeave: (self) => {
        if (video.ended || video.currentTime >= video.duration - 0.01) {
          if (postCinematicExitRef.current || self.scroll() > self.end + 80) setOpeningHeaderHidden(false);
          return;
        }
        completionLockedRef.current = true;
        waitingForCompletion = true;
        window.requestAnimationFrame(() => self.scroll(self.end - 2));
      },
    });
    cinematicTriggerRef.current = trigger;

    releaseCompletionLockRef.current = () => {
      if (!waitingForCompletion) return;
      if (!(video.ended || video.currentTime >= video.duration - 0.01)) return;
      waitingForCompletion = false;
      completionLockedRef.current = false;
    };

    ScrollTrigger.refresh();
    return () => {
      releaseCompletionLockRef.current = null;
      cinematicTriggerRef.current = null;
      completionLockedRef.current = false;
      setOpeningHeaderHidden(false);
      trigger.kill();
    };
  }, [isReady, reduceMotion]);

  useEffect(() => () => {
    if (settleAnimationRef.current !== null) window.cancelAnimationFrame(settleAnimationRef.current);
    if (checkpointReleaseTimeoutRef.current !== null) window.clearTimeout(checkpointReleaseTimeoutRef.current);
    if (checkpointAnimationRef.current !== null) window.cancelAnimationFrame(checkpointAnimationRef.current);
  }, []);

  return (
    <section ref={sectionRef} id="story" className="ice-orbit" aria-label="Full-screen mango ice-cream sequence">
      <style>{sequenceStyles}</style>
      <div className="ice-orbit__stage" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <video
          ref={videoRef}
          className="ice-orbit__video"
          style={cameraStyle}
          poster={VIDEO_POSTER}
          muted
          playsInline
          preload="auto"
          onLoadedData={handleVideoReady}
          onEnded={() => releaseCompletionLockRef.current?.()}
          aria-label={copy.videoLabel}
        >
          <source media="(max-width: 767px)" src={MOBILE_VIDEO_SOURCE} type="video/mp4" />
          <source src={DESKTOP_VIDEO_SOURCE} type="video/mp4" />
        </video>
        <div className="ice-orbit__story" aria-hidden="true">
          <motion.div className="ice-orbit__story-card ice-orbit__story-card--origin" data-active={activeCheckpoint === 0} onPointerMove={handleStoryPointerMove} onPointerLeave={handleStoryPointerLeave} transition={{ type: "tween", duration: 0.36, ease: [0.22, 1, 0.36, 1] }} style={cardStyle(0, 0, 0, 0)}>
            <p className="ice-orbit__story-kicker">{copy.originKicker}</p>
            <h2 className="ice-orbit__story-title"><span className="ice-orbit__desktop-title"><MagneticTitle text="Naatures" /><br /><em><MagneticTitle text="Scuup" /></em></span><span className="ice-orbit__mobile-title">{originMobileTop}<br /><em>{originMobileEmphasis}</em></span></h2>
            <p className="ice-orbit__story-copy">{copy.originCopy}</p>
            <div className="ice-orbit__story-facts"><span>{copy.liveIceCream}</span><span>{copy.vegetarianDining}</span></div>
          </motion.div>
          <motion.div className="ice-orbit__story-card ice-orbit__story-card--left" data-active={activeCheckpoint === 1} onPointerMove={handleStoryPointerMove} onPointerLeave={handleStoryPointerLeave} transition={{ type: "tween", duration: 0.36, ease: [0.22, 1, 0.36, 1] }} style={cardStyle(1, -3, 0, -0.3)}>
            <p className="ice-orbit__story-kicker">{copy.parlourKicker}</p>
            <h2 className="ice-orbit__story-title ice-orbit__story-title--label"><span className="ice-orbit__desktop-title"><MagneticTitle text={parlourDesktopTop} /><br /><em><MagneticTitle text={parlourDesktopEmphasis} /></em><br /><MagneticTitle text={parlourDesktopBottom} /></span><span className="ice-orbit__mobile-title">{parlourMobileTop}<br /><em>{parlourMobileEmphasis}</em></span></h2>
            <p className="ice-orbit__story-copy">{copy.parlourCopy}</p>
          </motion.div>
          <motion.div className="ice-orbit__story-card ice-orbit__story-card--right" data-active={activeCheckpoint === 2} onPointerMove={handleStoryPointerMove} onPointerLeave={handleStoryPointerLeave} transition={{ type: "tween", duration: 0.36, ease: [0.22, 1, 0.36, 1] }} style={cardStyle(2, 3, 0, 0.2)}>
            <p className="ice-orbit__story-kicker">{copy.cravingKicker}</p>
            <h2 className="ice-orbit__story-title"><span className="ice-orbit__desktop-title"><MagneticTitle text={cravingDesktopTop} /><br /><em><MagneticTitle text={cravingDesktopEmphasis} /></em></span><span className="ice-orbit__mobile-title">{cravingMobileTop}<br /><em>{cravingMobileEmphasis}</em></span></h2>
            <p className="ice-orbit__story-copy ice-orbit__story-copy--label">{copy.cravingCopy}</p>
          </motion.div>
          <motion.div className="ice-orbit__story-card ice-orbit__story-card--variety" data-active={activeCheckpoint === 3} onPointerMove={handleStoryPointerMove} onPointerLeave={handleStoryPointerLeave} transition={{ type: "tween", duration: 0.36, ease: [0.22, 1, 0.36, 1] }} style={cardStyle(3, -3, 0, -0.2)}>
            <p className="ice-orbit__story-kicker">{copy.varietyKicker}</p>
            <h2 className="ice-orbit__story-title"><span className="ice-orbit__desktop-title"><MagneticTitle text={varietyDesktopTop} /><br /><em><MagneticTitle text={varietyDesktopEmphasis} /></em></span><span className="ice-orbit__mobile-title">{varietyMobileTop}<br /><em>{varietyMobileEmphasis}</em></span></h2>
            <p className="ice-orbit__story-copy ice-orbit__story-copy--label">{copy.varietyCopy}</p>
          </motion.div>
          <motion.div className="ice-orbit__story-card ice-orbit__story-card--end" data-active={activeCheckpoint === 4} onPointerMove={handleStoryPointerMove} onPointerLeave={handleStoryPointerLeave} transition={{ type: "tween", duration: 0.36, ease: [0.22, 1, 0.36, 1] }} style={cardStyle(4, 3, 0, 0.18)}>
            <p className="ice-orbit__story-kicker">{copy.endKicker}</p>
            <h2 className="ice-orbit__story-title" aria-label={copy.endHashtagAria}><span className="ice-orbit__desktop-title"><em><MagneticTitle text={endDesktopTop} /></em><br /><MagneticTitle text={endDesktopBottom} /></span><span className="ice-orbit__mobile-title">{endMobileTop}<br /><em>{endMobileEmphasis}</em></span></h2>
            <p className="ice-orbit__story-copy">{copy.endCopy}</p>
            <span className="ice-orbit__story-closing-stamp">{copy.closingStamp}</span>
          </motion.div>
        </div>
        <div className="ice-orbit__checkpoint-rail" aria-hidden="true"><span className="ice-orbit__checkpoint-prompt">{copy.checkpointPrompt}</span>{["01", "02", "03", "04", "05"].map((label, index) => <span key={label} className="ice-orbit__checkpoint" data-active={index === activeCheckpoint} />)}<span className="ice-orbit__checkpoint-label">{String(activeCheckpoint + 1).padStart(2, "0")} / 05</span></div>
        <button type="button" className="ice-orbit__scroll-prompt" onClick={handleScrollAdvance} disabled={!isReady} aria-label={copy.nextStory}>{copy.scrollPrompt}</button>
        {!isReady && <div className="ice-orbit__loading" role="status" aria-label={copy.preparing} />}
      </div>
    </section>
  );
}
