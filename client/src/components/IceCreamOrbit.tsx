import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_VIDEO_SOURCE = "/manus-storage/mango-ice-cream-1440p-clean-scrub_59b5e815.mp4";
const MOBILE_VIDEO_SOURCE = "/manus-storage/mango-ice-cream-portrait-mobile_4b0f7dd0.mp4";
const VIDEO_POSTER = "/manus-storage/ezgif-frame-001_c0bf1371.png";
const STORY_SNAP_POINTS = [0, 0.11, 0.37, 0.64, 0.9, 1];

function setOpeningHeaderHidden(isHidden: boolean) {
  document.documentElement.dataset.iceHeroActive = isHidden ? "true" : "false";
}

function getStoryCheckpoint(progress: number) {
  if (progress < 0.235) return 0;
  if (progress < 0.505) return 1;
  if (progress < 0.775) return 2;
  return 3;
}

function MagneticTitle({ text }: { text: string }) {
  return <span className="ice-orbit__magnetic-word">{Array.from(text).map((character, index) => <span key={`${character}-${index}`} className="ice-orbit__story-glyph" data-story-glyph>{character === " " ? "\u00a0" : character}</span>)}</span>;
}

const sequenceStyles = `
  .ice-orbit{position:relative;width:100%;background:#d6d4d0;isolation:isolate}
  .ice-orbit__stage{position:relative;width:100%;height:100svh;overflow:hidden;background:#d6d4d0;perspective:1150px;perspective-origin:50% 50%}
  .ice-orbit__video{display:block;width:100%;height:100%;object-fit:cover;object-position:center;background:#d6d4d0}
  .ice-orbit__loading{position:absolute;inset:0;z-index:4;background:#d6d4d0}
  .ice-orbit__story{position:absolute;inset:0;z-index:3;pointer-events:none;color:rgb(54 43 38 / 90%);font-family:Montserrat,ui-sans-serif,system-ui,sans-serif;letter-spacing:-.018em}
  .ice-orbit__story-card{position:absolute;width:min(23rem,27vw);text-wrap:balance;transform-style:preserve-3d;transform-origin:center center;will-change:transform}
  .ice-orbit__story-card>*{position:relative;z-index:2;transform:translateZ(14px)}
  .ice-orbit__story-card--origin{top:18%;left:clamp(1.25rem,5vw,5.25rem);text-align:left}
  .ice-orbit__story-card--left{top:29%;left:clamp(1.25rem,5vw,5.25rem)}
  .ice-orbit__story-card--right{top:24%;right:clamp(1.25rem,5vw,5.25rem);bottom:auto;text-align:right}
  .ice-orbit__story-card--end{right:clamp(1.25rem,5vw,5.25rem);bottom:14%;left:auto;text-align:right}
  .ice-orbit__story-kicker{display:flex;align-items:center;gap:.7rem;margin:0 0 1rem;color:rgb(74 63 57 / 82%);font-family:Montserrat,ui-sans-serif,system-ui,sans-serif;font-size:.62rem;font-weight:400;letter-spacing:.24em;text-transform:uppercase}
  .ice-orbit__story-card--right .ice-orbit__story-kicker{justify-content:flex-end}
  .ice-orbit__story-kicker::before{content:"";display:block;width:1.8rem;height:1px;background:currentColor}
  .ice-orbit__story-title{margin:0;color:rgb(47 38 34)!important;font-family:"Playfair Display",Georgia,serif;font-size:clamp(2.3rem,5.6vw,5.8rem);font-weight:700;line-height:.86;letter-spacing:-.075em;text-transform:uppercase}
  .ice-orbit__magnetic-word{display:inline-block;white-space:nowrap}
  .ice-orbit__story-glyph{display:inline-block;will-change:transform;transform:translate3d(var(--glyph-x,0px),var(--glyph-y,0px),var(--glyph-z,0px)) scale(var(--glyph-scale-x,1),var(--glyph-scale-y,1)) skewX(var(--glyph-skew,0deg));transition:transform 440ms cubic-bezier(.16,1,.3,1)}
  .ice-orbit__story-card--origin .ice-orbit__story-title{font-size:clamp(2.75rem,5.9vw,6.05rem)}
  .ice-orbit__story-title em{font-family:"Playfair Display",Georgia,serif;font-style:italic;font-weight:700;letter-spacing:-.085em;text-transform:none}
  .ice-orbit__story-copy{max-width:29rem;margin:1.2rem 0 0;color:rgb(84 74 68 / 88%);font-family:Montserrat,ui-sans-serif,system-ui,sans-serif;font-size:clamp(.76rem,1.2vw,1rem);font-weight:400;line-height:1.6;letter-spacing:.06em}
  .ice-orbit__story-card--origin .ice-orbit__story-copy,.ice-orbit__story-card--end .ice-orbit__story-copy{margin-inline:auto}
  .ice-orbit__story-card--right .ice-orbit__story-copy{margin-left:auto}
  .ice-orbit__story-facts{display:flex;gap:.65rem;flex-wrap:wrap;margin:1.25rem 0 0;padding-top:.75rem;border-top:1px solid rgb(74 63 57 / 26%);color:rgb(74 63 57 / 76%);font:400 .54rem/1.3 Montserrat,ui-sans-serif,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase}.ice-orbit__story-facts span+span::before{content:"/";margin-right:.65rem;color:rgb(74 63 57 / 44%)}
  .ice-orbit__checkpoint-rail{position:absolute;z-index:4;left:clamp(1.25rem,5vw,5.25rem);bottom:clamp(1.5rem,4vw,3rem);display:flex;align-items:center;gap:.55rem;color:rgb(58 49 44 / 56%);font:400 .55rem/1 Montserrat,ui-sans-serif,system-ui,sans-serif;letter-spacing:.12em}.ice-orbit__checkpoint{display:block;width:.46rem;height:.46rem;border:1px solid currentColor;border-radius:999px;transition:background 180ms var(--ease-out),transform 180ms var(--ease-out)}.ice-orbit__checkpoint[data-active="true"]{background:currentColor;transform:scale(1.25)}.ice-orbit__checkpoint-label{margin-left:.25rem;text-transform:uppercase}.ice-orbit__checkpoint-prompt{margin-right:.3rem;font-size:.5rem;letter-spacing:.17em;text-transform:uppercase}
  .ice-orbit__scroll-button{position:absolute;z-index:5;left:50%;bottom:clamp(1.15rem,3vw,2.25rem);display:grid;width:3rem;height:3rem;place-items:center;padding:0;border:1px solid rgb(58 49 44 / 52%);border-radius:999px;background:rgb(214 212 208 / 80%);color:rgb(47 38 34);font:400 1.45rem/1 Montserrat,ui-sans-serif,system-ui,sans-serif;transform:translateX(-50%);transition:transform 180ms var(--ease-out),background 180ms var(--ease-out),border-color 180ms var(--ease-out);cursor:pointer}.ice-orbit__scroll-button:hover{background:rgb(214 212 208);border-color:rgb(58 49 44 / 78%)}.ice-orbit__scroll-button:focus-visible{outline:2px solid rgb(47 38 34);outline-offset:4px}.ice-orbit__scroll-button:active{transform:translateX(-50%) scale(.94)}.ice-orbit__scroll-button:disabled{opacity:0;pointer-events:none}
  @media(hover:hover) and (pointer:fine){.ice-orbit__story-card[data-active="true"]{pointer-events:auto}.ice-orbit__story-card[data-active="true"][data-interacting="true"] .ice-orbit__story-glyph{transition-duration:150ms}}
  @media(max-width:767px){.ice-orbit__stage{perspective:none}.ice-orbit__video{object-fit:cover;object-position:50% 50%;transform:scale(3.1);transform-origin:50% 50%}.ice-orbit__story,.ice-orbit__checkpoint-rail{display:none}.ice-orbit__scroll-button{bottom:calc(max(1.2rem,env(safe-area-inset-bottom)) + 4.35rem);width:3.25rem;height:3.25rem;background:rgb(214 212 208 / 88%)}}
  @media(prefers-reduced-motion:reduce){.ice-orbit__stage{min-height:100svh}}
`;

export function IceCreamOrbit() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const settleAnimationRef = useRef<number | null>(null);
  const releaseCompletionLockRef = useRef<(() => void) | null>(null);
  const checkpointRef = useRef(0);
  const storyProgress = useMotionValue(0);
  const openingOpacity = useTransform(storyProgress, [0, 0.02, 0.19, 0.22], [1, 1, 1, 0]);
  const openingY = useTransform(storyProgress, [0, 0.19, 0.22], [0, 0, -18]);
  const openingRotateY = useTransform(storyProgress, [0, 0.08, 0.19, 0.22], [-14, -4, 0, -18]);
  const openingRotateX = useTransform(storyProgress, [0, 0.19, 0.22], [6, 0, 9]);
  const openingZ = useTransform(storyProgress, [0, 0.08, 0.19, 0.22], [40, 76, 104, 14]);
  const parlourOpacity = useTransform(storyProgress, [0.25, 0.28, 0.45, 0.48], [0, 1, 1, 0]);
  const parlourY = useTransform(storyProgress, [0.25, 0.28, 0.48], [22, 0, -18]);
  const parlourRotateY = useTransform(storyProgress, [0.25, 0.28, 0.45, 0.48], [-16, -5, 0, -15]);
  const parlourRotateX = useTransform(storyProgress, [0.25, 0.45, 0.48], [7, 0, 8]);
  const parlourZ = useTransform(storyProgress, [0.25, 0.28, 0.45, 0.48], [20, 82, 118, 10]);
  const cravingOpacity = useTransform(storyProgress, [0.52, 0.55, 0.72, 0.75], [0, 1, 1, 0]);
  const cravingY = useTransform(storyProgress, [0.52, 0.55, 0.75], [22, 0, -18]);
  const cravingRotateY = useTransform(storyProgress, [0.52, 0.55, 0.72, 0.75], [16, 5, 0, 15]);
  const cravingRotateX = useTransform(storyProgress, [0.52, 0.72, 0.75], [7, 0, 8]);
  const cravingZ = useTransform(storyProgress, [0.52, 0.55, 0.72, 0.75], [20, 82, 118, 10]);
  const endOpacity = useTransform(storyProgress, [0.79, 0.82, 1], [0, 1, 1]);
  const endY = useTransform(storyProgress, [0.79, 0.82], [22, 0]);
  const endRotateY = useTransform(storyProgress, [0.79, 0.82, 1], [15, 3, 0]);
  const endRotateX = useTransform(storyProgress, [0.79, 0.82, 1], [7, 0, 0]);
  const endZ = useTransform(storyProgress, [0.79, 0.82, 1], [20, 84, 122]);
  const [isReady, setIsReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeCheckpoint, setActiveCheckpoint] = useState(0);
  const handleStoryPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const card = event.currentTarget;
    card.dataset.interacting = "true";
    card.querySelectorAll<HTMLElement>("[data-story-glyph]").forEach((glyph) => {
      const bounds = glyph.getBoundingClientRect();
      const deltaX = event.clientX - (bounds.left + bounds.width / 2);
      const deltaY = event.clientY - (bounds.top + bounds.height / 2);
      const distance = Math.hypot(deltaX, deltaY);
      const influence = Math.max(0, 1 - distance / 210);
      const safeDistance = Math.max(distance, 1);
      const directionX = deltaX / safeDistance;
      const directionY = deltaY / safeDistance;
      glyph.style.setProperty("--glyph-x", `${(directionX * influence * 3.2).toFixed(2)}px`);
      glyph.style.setProperty("--glyph-y", `${(directionY * influence * 2.2).toFixed(2)}px`);
      glyph.style.setProperty("--glyph-z", `${(influence * 3).toFixed(2)}px`);
      glyph.style.setProperty("--glyph-scale-x", `${(1 + influence * 0.025).toFixed(3)}`);
      glyph.style.setProperty("--glyph-scale-y", `${(1 - influence * 0.015).toFixed(3)}`);
      glyph.style.setProperty("--glyph-skew", `${(directionX * influence * 0.8).toFixed(2)}deg`);
    });
  };

  const handleStoryPointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    delete event.currentTarget.dataset.interacting;
    event.currentTarget.querySelectorAll<HTMLElement>("[data-story-glyph]").forEach((glyph) => {
      ["--glyph-x", "--glyph-y", "--glyph-z", "--glyph-scale-x", "--glyph-scale-y", "--glyph-skew"].forEach((property) => glyph.style.removeProperty(property));
    });
  };

  const handleScrollAdvance = () => {
    window.scrollBy({ top: Math.round(window.innerHeight * 0.82), behavior: reduceMotion ? "auto" : "smooth" });
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

      if (delta <= 0.04) {
        video.pause();
        video.playbackRate = 1;
        settleAnimationRef.current = null;
        if (targetTime >= video.duration - 0.04) releaseCompletionLockRef.current?.();
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
    storyProgress.set(0);
    checkpointRef.current = 0;
    setActiveCheckpoint(0);
    setIsReady(true);
  };

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
        targetTimeRef.current = self.progress * video.duration;
        storyProgress.set(self.progress);
        const nextCheckpoint = getStoryCheckpoint(self.progress);
        if (checkpointRef.current !== nextCheckpoint) {
          checkpointRef.current = nextCheckpoint;
          setActiveCheckpoint(nextCheckpoint);
        }
        advanceToTarget();
      },
      onEnter: () => setOpeningHeaderHidden(true),
      onEnterBack: () => setOpeningHeaderHidden(true),
      snap: reduceMotion ? undefined : { snapTo: STORY_SNAP_POINTS, delay: 0.08, duration: { min: 0.14, max: 0.32 }, ease: "power2.out", inertia: false },
      onLeave: (self) => {
        if (video.currentTime >= video.duration - 0.04) {
          setOpeningHeaderHidden(false);
          return;
        }
        waitingForCompletion = true;
        window.requestAnimationFrame(() => self.scroll(self.end - 2));
      },
    });

    releaseCompletionLockRef.current = () => {
      if (!waitingForCompletion) return;
      waitingForCompletion = false;
      setOpeningHeaderHidden(false);
      window.requestAnimationFrame(() => trigger.scroll(trigger.end + 2));
    };

    ScrollTrigger.refresh();
    return () => {
      releaseCompletionLockRef.current = null;
      setOpeningHeaderHidden(false);
      trigger.kill();
    };
  }, [isReady, reduceMotion]);

  useEffect(() => () => {
    if (settleAnimationRef.current !== null) window.cancelAnimationFrame(settleAnimationRef.current);
  }, []);

  return (
    <section ref={sectionRef} id="story" className="ice-orbit" aria-label="Full-screen mango ice-cream sequence">
      <style>{sequenceStyles}</style>
      <div className="ice-orbit__stage">
        <video
          ref={videoRef}
          className="ice-orbit__video"
          poster={VIDEO_POSTER}
          muted
          playsInline
          preload="auto"
          onLoadedData={handleVideoReady}
          aria-label="Mango ice-cream sequence"
        >
          <source media="(max-width: 767px)" src={MOBILE_VIDEO_SOURCE} type="video/mp4" />
          <source src={DESKTOP_VIDEO_SOURCE} type="video/mp4" />
        </video>
        <div className="ice-orbit__story" aria-hidden="true">
          <motion.div className="ice-orbit__story-card ice-orbit__story-card--origin" data-active={activeCheckpoint === 0} onPointerMove={handleStoryPointerMove} onPointerLeave={handleStoryPointerLeave} style={{ opacity: openingOpacity, y: openingY, rotateY: openingRotateY, rotateX: openingRotateX, z: openingZ }}>
            <p className="ice-orbit__story-kicker">The Mall · Kanpur</p>
            <h2 className="ice-orbit__story-title"><MagneticTitle text="Naatures" /><br /><em><MagneticTitle text="Scuup" /></em></h2>
            <p className="ice-orbit__story-copy">Kanpur&apos;s first live ice-cream parlour—one fresh scoop at a time.</p>
            <div className="ice-orbit__story-facts"><span>Live ice cream</span><span>Vegetarian dining</span></div>
          </motion.div>
          <motion.div className="ice-orbit__story-card ice-orbit__story-card--left" data-active={activeCheckpoint === 1} onPointerMove={handleStoryPointerMove} onPointerLeave={handleStoryPointerLeave} style={{ opacity: parlourOpacity, y: parlourY, rotateY: parlourRotateY, rotateX: parlourRotateX, z: parlourZ }}>
            <p className="ice-orbit__story-kicker">Mall Road, Kanpur</p>
            <h2 className="ice-orbit__story-title"><MagneticTitle text="Kanpur&apos;s first" /><br /><em><MagneticTitle text="live ice-cream" /></em><br /><MagneticTitle text="parlour" /></h2>
            <p className="ice-orbit__story-copy">Watch the cold come alive, one slow turn at a time.</p>
          </motion.div>
          <motion.div className="ice-orbit__story-card ice-orbit__story-card--right" data-active={activeCheckpoint === 2} onPointerMove={handleStoryPointerMove} onPointerLeave={handleStoryPointerLeave} style={{ opacity: cravingOpacity, y: cravingY, rotateY: cravingRotateY, rotateX: cravingRotateX, z: cravingZ }}>
            <p className="ice-orbit__story-kicker">Made for the table</p>
            <h2 className="ice-orbit__story-title"><MagneticTitle text="One place." /><br /><em><MagneticTitle text="Every craving." /></em></h2>
            <p className="ice-orbit__story-copy">From the first bite to the final frozen spoonful.</p>
          </motion.div>
          <motion.div className="ice-orbit__story-card ice-orbit__story-card--end" data-active={activeCheckpoint === 3} onPointerMove={handleStoryPointerMove} onPointerLeave={handleStoryPointerLeave} style={{ opacity: endOpacity, y: endY, rotateY: endRotateY, rotateX: endRotateX, z: endZ }}>
            <p className="ice-orbit__story-kicker">Keep it cold</p>
            <h2 className="ice-orbit__story-title"><em><MagneticTitle text="#Freeze the" /></em><br /><MagneticTitle text="happiness" /></h2>
          </motion.div>
        </div>
        <div className="ice-orbit__checkpoint-rail" aria-hidden="true"><span className="ice-orbit__checkpoint-prompt">Scroll to unfreeze</span>{["01", "02", "03", "04"].map((label, index) => <span key={label} className="ice-orbit__checkpoint" data-active={index === activeCheckpoint} />)}<span className="ice-orbit__checkpoint-label">{String(activeCheckpoint + 1).padStart(2, "0")} / 04</span></div>
        <button type="button" className="ice-orbit__scroll-button" onClick={handleScrollAdvance} disabled={!isReady} aria-label="Scroll down to continue"><span aria-hidden="true">↓</span></button>
        {!isReady && <div className="ice-orbit__loading" role="status" aria-label="Preparing the image sequence" />}
      </div>
    </section>
  );
}
