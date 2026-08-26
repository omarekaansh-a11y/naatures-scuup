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

const sequenceStyles = `
  .ice-orbit{position:relative;width:100%;background:#d6d4d0;isolation:isolate}
  .ice-orbit__stage{position:relative;width:100%;height:100svh;overflow:hidden;background:#d6d4d0;perspective:1150px;perspective-origin:50% 50%}
  .ice-orbit__video{display:block;width:100%;height:100%;object-fit:cover;object-position:center;background:#d6d4d0}
  .ice-orbit__loading{position:absolute;inset:0;z-index:4;background:#d6d4d0}
  .ice-orbit__story{position:absolute;inset:0;z-index:3;pointer-events:none;color:rgb(54 43 38 / 90%);font-family:Montserrat,ui-sans-serif,system-ui,sans-serif;letter-spacing:-.018em}
  .ice-orbit__story-card{position:absolute;width:min(23rem,27vw);text-wrap:balance;transform-style:preserve-3d;transform-origin:center center;will-change:transform;--pointer-x:50%;--pointer-y:50%}
  .ice-orbit__story-card>:not(.ice-orbit__ripple-field){position:relative;z-index:2;transform:translateZ(14px)}
  .ice-orbit__story-card::before{position:absolute;z-index:-1;inset:-1rem;content:"";border:1px solid rgb(255 193 91 / 54%);border-radius:45% 55% 52% 48% / 47% 50% 50% 53%;background:rgb(255 235 191 / 25%);opacity:0;pointer-events:none;transform:translateZ(-26px) scale(.86);clip-path:ellipse(0% 0% at 50% 52%);transition:clip-path 480ms cubic-bezier(.16,1,.3,1),opacity 120ms var(--ease-out),transform 480ms cubic-bezier(.16,1,.3,1)}
  .ice-orbit__story-card::after{position:absolute;z-index:0;left:var(--pointer-x);top:var(--pointer-y);width:8rem;height:8rem;content:"";border-radius:50%;pointer-events:none;opacity:0;background:rgb(255 222 155 / 32%);box-shadow:0 0 2.7rem 1.05rem rgb(255 187 68 / 25%);transform:translate(-50%,-50%) translateZ(-12px);transition:opacity 160ms var(--ease-out)}
  .ice-orbit__ripple-field{position:absolute;z-index:1;inset:-1rem;pointer-events:none;transform:translateZ(32px)}
  .ice-orbit__text-ripple{position:absolute;display:block;width:1rem;height:1rem;border:1px solid rgb(255 238 199 / 76%);border-radius:999px;box-shadow:0 0 0 1px rgb(255 177 55 / 22%);opacity:0;transform:translate(-50%,-50%) scale(.18);animation:ice-orbit-text-ripple 680ms cubic-bezier(.16,1,.3,1) forwards}
  @keyframes ice-orbit-text-ripple{0%{opacity:.92;transform:translate(-50%,-50%) scale(.18)}55%{opacity:.5}100%{opacity:0;transform:translate(-50%,-50%) scale(9)}}
  .ice-orbit__story-card--origin{top:18%;left:clamp(1.25rem,5vw,5.25rem);text-align:left}
  .ice-orbit__story-card--left{top:29%;left:clamp(1.25rem,5vw,5.25rem)}
  .ice-orbit__story-card--right{top:24%;right:clamp(1.25rem,5vw,5.25rem);bottom:auto;text-align:right}
  .ice-orbit__story-card--end{right:clamp(1.25rem,5vw,5.25rem);bottom:14%;left:auto;text-align:right}
  .ice-orbit__story-kicker{display:flex;align-items:center;gap:.7rem;margin:0 0 1rem;color:rgb(74 63 57 / 82%);font-family:Montserrat,ui-sans-serif,system-ui,sans-serif;font-size:.62rem;font-weight:400;letter-spacing:.24em;text-transform:uppercase}
  .ice-orbit__story-card--right .ice-orbit__story-kicker{justify-content:flex-end}
  .ice-orbit__story-kicker::before{content:"";display:block;width:1.8rem;height:1px;background:currentColor}
  .ice-orbit__story-title{margin:0;color:rgb(47 38 34)!important;font-family:"Playfair Display",Georgia,serif;font-size:clamp(2.3rem,5.6vw,5.8rem);font-weight:700;line-height:.86;letter-spacing:-.075em;text-transform:uppercase}
  .ice-orbit__story-card--origin .ice-orbit__story-title{font-size:clamp(2.75rem,5.9vw,6.05rem)}
  .ice-orbit__story-title em{font-family:"Playfair Display",Georgia,serif;font-style:italic;font-weight:700;letter-spacing:-.085em;text-transform:none}
  .ice-orbit__story-copy{max-width:29rem;margin:1.2rem 0 0;color:rgb(84 74 68 / 88%);font-family:Montserrat,ui-sans-serif,system-ui,sans-serif;font-size:clamp(.76rem,1.2vw,1rem);font-weight:400;line-height:1.6;letter-spacing:.06em}
  .ice-orbit__story-card--origin .ice-orbit__story-copy,.ice-orbit__story-card--end .ice-orbit__story-copy{margin-inline:auto}
  .ice-orbit__story-card--right .ice-orbit__story-copy{margin-left:auto}
  .ice-orbit__story-facts{display:flex;gap:.65rem;flex-wrap:wrap;margin:1.25rem 0 0;padding-top:.75rem;border-top:1px solid rgb(74 63 57 / 26%);color:rgb(74 63 57 / 76%);font:400 .54rem/1.3 Montserrat,ui-sans-serif,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase}.ice-orbit__story-facts span+span::before{content:"/";margin-right:.65rem;color:rgb(74 63 57 / 44%)}
  .ice-orbit__checkpoint-rail{position:absolute;z-index:4;left:clamp(1.25rem,5vw,5.25rem);bottom:clamp(1.5rem,4vw,3rem);display:flex;align-items:center;gap:.55rem;color:rgb(58 49 44 / 56%);font:400 .55rem/1 Montserrat,ui-sans-serif,system-ui,sans-serif;letter-spacing:.12em}.ice-orbit__checkpoint{display:block;width:.46rem;height:.46rem;border:1px solid currentColor;border-radius:999px;transition:background 180ms var(--ease-out),transform 180ms var(--ease-out)}.ice-orbit__checkpoint[data-active="true"]{background:currentColor;transform:scale(1.25)}.ice-orbit__checkpoint-label{margin-left:.25rem;text-transform:uppercase}.ice-orbit__checkpoint-prompt{margin-right:.3rem;font-size:.5rem;letter-spacing:.17em;text-transform:uppercase}
  @media(hover:hover) and (pointer:fine){.ice-orbit__story-card[data-active="true"]{pointer-events:auto}.ice-orbit__story-card[data-active="true"]:hover::before{opacity:1;transform:translateZ(-26px) scale(1.06);clip-path:ellipse(140% 130% at var(--pointer-x) var(--pointer-y))}.ice-orbit__story-card[data-active="true"][data-interacting="true"]::after{opacity:1}.ice-orbit__story-card[data-active="true"]:hover .ice-orbit__story-title{letter-spacing:-.086em;transition:letter-spacing 420ms cubic-bezier(.16,1,.3,1)}.ice-orbit__story-card[data-active="true"]:hover .ice-orbit__story-kicker{transform:translateZ(32px) translateY(-2px);transition:transform 420ms cubic-bezier(.16,1,.3,1)}.ice-orbit__story-card[data-active="true"]:hover .ice-orbit__story-copy,.ice-orbit__story-card[data-active="true"]:hover .ice-orbit__story-facts{transform:translateZ(25px) translateY(2px);transition:transform 460ms cubic-bezier(.16,1,.3,1)}}
  @media(max-width:767px){.ice-orbit__stage{perspective:850px}.ice-orbit__video{object-fit:cover}.ice-orbit__story{--portrait-content-top:35svh;--portrait-content-bottom:66svh;padding-inline:max(1rem,env(safe-area-inset-left)) max(1rem,env(safe-area-inset-right))}.ice-orbit__story-card{box-sizing:border-box;width:clamp(6.25rem,31vw,9.5rem);max-width:calc(38vw - 1rem);text-wrap:pretty}.ice-orbit__story-card--origin{top:clamp(8.5rem,var(--portrait-content-top),17.5rem);left:max(1rem,env(safe-area-inset-left));text-align:left}.ice-orbit__story-card--left{top:clamp(10rem,38svh,19rem);left:max(1rem,env(safe-area-inset-left));text-align:left}.ice-orbit__story-card--right{top:clamp(9.5rem,37svh,18.5rem);right:max(1rem,env(safe-area-inset-right));text-align:right}.ice-orbit__story-card--end{top:clamp(11rem,42svh,20.5rem);right:max(1rem,env(safe-area-inset-right));bottom:auto;left:auto;text-align:right}.ice-orbit__story-title{font-size:clamp(1rem,5.4vw,1.55rem);line-height:.9;letter-spacing:-.06em}.ice-orbit__story-card--origin .ice-orbit__story-title{font-size:clamp(1.15rem,6vw,1.7rem)}.ice-orbit__story-card--end .ice-orbit__story-title{font-size:clamp(1.05rem,5.6vw,1.6rem)}.ice-orbit__story-kicker{gap:.38rem;margin-bottom:.5rem;font-size:clamp(.38rem,1.55vw,.48rem);letter-spacing:.13em}.ice-orbit__story-kicker::before{width:.9rem}.ice-orbit__story-copy{max-width:100%;margin-top:.6rem;font-size:clamp(.54rem,1.9vw,.62rem);line-height:1.4;letter-spacing:.02em}.ice-orbit__story-facts{display:none}.ice-orbit__checkpoint-rail{left:max(1rem,env(safe-area-inset-left));bottom:max(1rem,env(safe-area-inset-bottom));gap:.4rem;font-size:.42rem}.ice-orbit__checkpoint{width:.36rem;height:.36rem}.ice-orbit__checkpoint-prompt{display:none}}
  @media(prefers-reduced-motion:reduce){.ice-orbit__stage{min-height:100svh}}
`;

export function IceCreamOrbit() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const settleAnimationRef = useRef<number | null>(null);
  const releaseCompletionLockRef = useRef<(() => void) | null>(null);
  const checkpointRef = useRef(0);
  const rippleIdRef = useRef(0);
  const lastRippleRef = useRef({ x: -1000, y: -1000, at: 0 });
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
  const [textRipples, setTextRipples] = useState<Array<{ id: number; checkpoint: number; x: number; y: number }>>([]);

  const handleStoryPointerMove = (event: ReactPointerEvent<HTMLDivElement>, checkpoint: number) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    card.style.setProperty("--pointer-x", `${x}%`);
    card.style.setProperty("--pointer-y", `${y}%`);
    card.dataset.interacting = "true";

    const now = performance.now();
    const distance = Math.hypot(x - lastRippleRef.current.x, y - lastRippleRef.current.y);
    if (distance < 17 && now - lastRippleRef.current.at < 72) return;

    lastRippleRef.current = { x, y, at: now };
    const ripple = { id: rippleIdRef.current++, checkpoint, x, y };
    setTextRipples((previous) => [...previous.slice(-7), ripple]);
    window.setTimeout(() => setTextRipples((previous) => previous.filter((entry) => entry.id !== ripple.id)), 760);
  };

  const handleStoryPointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    delete event.currentTarget.dataset.interacting;
  };

  const renderStoryRipples = (checkpoint: number) => textRipples
    .filter((ripple) => ripple.checkpoint === checkpoint)
    .map((ripple) => <span key={ripple.id} className="ice-orbit__text-ripple" style={{ left: `${ripple.x}%`, top: `${ripple.y}%` }} />);

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
          <motion.div className="ice-orbit__story-card ice-orbit__story-card--origin" data-active={activeCheckpoint === 0} onPointerMove={(event) => handleStoryPointerMove(event, 0)} onPointerLeave={handleStoryPointerLeave} style={{ opacity: openingOpacity, y: openingY, rotateY: openingRotateY, rotateX: openingRotateX, z: openingZ }}>
            <span className="ice-orbit__ripple-field" aria-hidden="true">{renderStoryRipples(0)}</span>
            <p className="ice-orbit__story-kicker">The Mall · Kanpur</p>
            <h2 className="ice-orbit__story-title">Naatures<br /><em>Scuup</em></h2>
            <p className="ice-orbit__story-copy">Kanpur&apos;s first live ice-cream parlour—one fresh scoop at a time.</p>
            <div className="ice-orbit__story-facts"><span>Live ice cream</span><span>Vegetarian dining</span></div>
          </motion.div>
          <motion.div className="ice-orbit__story-card ice-orbit__story-card--left" data-active={activeCheckpoint === 1} onPointerMove={(event) => handleStoryPointerMove(event, 1)} onPointerLeave={handleStoryPointerLeave} style={{ opacity: parlourOpacity, y: parlourY, rotateY: parlourRotateY, rotateX: parlourRotateX, z: parlourZ }}>
            <span className="ice-orbit__ripple-field" aria-hidden="true">{renderStoryRipples(1)}</span>
            <p className="ice-orbit__story-kicker">Mall Road, Kanpur</p>
            <h2 className="ice-orbit__story-title">Kanpur&apos;s first<br /><em>live ice-cream</em><br />parlour</h2>
            <p className="ice-orbit__story-copy">Watch the cold come alive, one slow turn at a time.</p>
          </motion.div>
          <motion.div className="ice-orbit__story-card ice-orbit__story-card--right" data-active={activeCheckpoint === 2} onPointerMove={(event) => handleStoryPointerMove(event, 2)} onPointerLeave={handleStoryPointerLeave} style={{ opacity: cravingOpacity, y: cravingY, rotateY: cravingRotateY, rotateX: cravingRotateX, z: cravingZ }}>
            <span className="ice-orbit__ripple-field" aria-hidden="true">{renderStoryRipples(2)}</span>
            <p className="ice-orbit__story-kicker">Made for the table</p>
            <h2 className="ice-orbit__story-title">One place.<br /><em>Every craving.</em></h2>
            <p className="ice-orbit__story-copy">From the first bite to the final frozen spoonful.</p>
          </motion.div>
          <motion.div className="ice-orbit__story-card ice-orbit__story-card--end" data-active={activeCheckpoint === 3} onPointerMove={(event) => handleStoryPointerMove(event, 3)} onPointerLeave={handleStoryPointerLeave} style={{ opacity: endOpacity, y: endY, rotateY: endRotateY, rotateX: endRotateX, z: endZ }}>
            <span className="ice-orbit__ripple-field" aria-hidden="true">{renderStoryRipples(3)}</span>
            <p className="ice-orbit__story-kicker">Keep it cold</p>
            <h2 className="ice-orbit__story-title"><em>#Freeze the</em><br />happiness</h2>
          </motion.div>
        </div>
        <div className="ice-orbit__checkpoint-rail" aria-hidden="true"><span className="ice-orbit__checkpoint-prompt">Scroll to unfreeze</span>{["01", "02", "03", "04"].map((label, index) => <span key={label} className="ice-orbit__checkpoint" data-active={index === activeCheckpoint} />)}<span className="ice-orbit__checkpoint-label">{String(activeCheckpoint + 1).padStart(2, "0")} / 04</span></div>
        {!isReady && <div className="ice-orbit__loading" role="status" aria-label="Preparing the image sequence" />}
      </div>
    </section>
  );
}
