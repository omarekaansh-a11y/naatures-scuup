import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_VIDEO_SOURCE = "/manus-storage/mango-ice-cream-1440p-clean-scrub_59b5e815.mp4";
const MOBILE_VIDEO_SOURCE = "/manus-storage/mango-ice-cream-portrait-mobile_4b0f7dd0.mp4";
const VIDEO_POSTER = "/manus-storage/ezgif-frame-001_c0bf1371.png";
const STORY_SNAP_POINTS = [0, 0.11, 0.37, 0.64, 0.9, 1];

function getStoryCheckpoint(progress: number) {
  if (progress < 0.235) return 0;
  if (progress < 0.505) return 1;
  if (progress < 0.775) return 2;
  return 3;
}

const sequenceStyles = `
  .ice-orbit{position:relative;width:100%;background:#d6d4d0;isolation:isolate}
  .ice-orbit__stage{position:relative;width:100%;height:100svh;overflow:hidden;background:#d6d4d0}
  .ice-orbit__video{display:block;width:100%;height:100%;object-fit:cover;object-position:center;background:#d6d4d0}
  .ice-orbit__loading{position:absolute;inset:0;z-index:4;background:#d6d4d0}
  .ice-orbit__story{position:absolute;inset:0;z-index:3;pointer-events:none;color:rgb(54 43 38 / 90%);font-family:Montserrat,ui-sans-serif,system-ui,sans-serif;letter-spacing:-.018em}
  .ice-orbit__story-card{position:absolute;width:min(25rem,29vw);text-wrap:balance}
  .ice-orbit__story-card--origin{top:18%;left:clamp(1.25rem,5vw,5.25rem);text-align:left}
  .ice-orbit__story-card--left{top:29%;left:clamp(1.25rem,5vw,5.25rem)}
  .ice-orbit__story-card--right{top:24%;right:clamp(1.25rem,5vw,5.25rem);bottom:auto;text-align:right}
  .ice-orbit__story-card--end{right:clamp(1.25rem,5vw,5.25rem);bottom:14%;left:auto;text-align:right}
  .ice-orbit__story-kicker{display:flex;align-items:center;gap:.7rem;margin:0 0 1rem;color:rgb(74 63 57 / 82%);font-family:Montserrat,ui-sans-serif,system-ui,sans-serif;font-size:.62rem;font-weight:400;letter-spacing:.24em;text-transform:uppercase}
  .ice-orbit__story-card--right .ice-orbit__story-kicker{justify-content:flex-end}
  .ice-orbit__story-kicker::before{content:"";display:block;width:1.8rem;height:1px;background:currentColor}
  .ice-orbit__story-title{margin:0;color:rgb(47 38 34)!important;font-family:"Playfair Display",Georgia,serif;font-size:clamp(2.3rem,6.1vw,6.4rem);font-weight:700;line-height:.9;letter-spacing:-.065em;text-transform:uppercase}
  .ice-orbit__story-card--origin .ice-orbit__story-title{font-size:clamp(2.8rem,6.6vw,6.8rem)}
  .ice-orbit__story-title em{font-family:"Playfair Display",Georgia,serif;font-weight:700;letter-spacing:-.075em;text-transform:none}
  .ice-orbit__story-copy{max-width:29rem;margin:1.2rem 0 0;color:rgb(84 74 68 / 88%);font-family:Montserrat,ui-sans-serif,system-ui,sans-serif;font-size:clamp(.76rem,1.2vw,1rem);font-weight:400;line-height:1.6;letter-spacing:.06em}
  .ice-orbit__story-card--origin .ice-orbit__story-copy,.ice-orbit__story-card--end .ice-orbit__story-copy{margin-inline:auto}
  .ice-orbit__story-card--right .ice-orbit__story-copy{margin-left:auto}
  .ice-orbit__checkpoint-rail{position:absolute;z-index:4;left:clamp(1.25rem,5vw,5.25rem);bottom:clamp(1.5rem,4vw,3rem);display:flex;align-items:center;gap:.55rem;color:rgb(58 49 44 / 56%);font:400 .55rem/1 Montserrat,ui-sans-serif,system-ui,sans-serif;letter-spacing:.12em}.ice-orbit__checkpoint{display:block;width:.46rem;height:.46rem;border:1px solid currentColor;border-radius:999px;transition:background 180ms var(--ease-out),transform 180ms var(--ease-out)}.ice-orbit__checkpoint[data-active="true"]{background:currentColor;transform:scale(1.25)}.ice-orbit__checkpoint-label{margin-left:.25rem;text-transform:uppercase}
  @media(max-width:767px){.ice-orbit__video{object-fit:cover}.ice-orbit__story{--portrait-content-top:35svh;--portrait-content-bottom:66svh;padding-inline:max(1rem,env(safe-area-inset-left)) max(1rem,env(safe-area-inset-right))}.ice-orbit__story-card{box-sizing:border-box;width:clamp(6.25rem,31vw,9.5rem);max-width:calc(38vw - 1rem);text-wrap:pretty}.ice-orbit__story-card--origin{top:clamp(8.5rem,var(--portrait-content-top),17.5rem);left:max(1rem,env(safe-area-inset-left));text-align:left}.ice-orbit__story-card--left{top:clamp(10rem,38svh,19rem);left:max(1rem,env(safe-area-inset-left));text-align:left}.ice-orbit__story-card--right{top:clamp(9.5rem,37svh,18.5rem);right:max(1rem,env(safe-area-inset-right));text-align:right}.ice-orbit__story-card--end{top:clamp(11rem,42svh,20.5rem);right:max(1rem,env(safe-area-inset-right));bottom:auto;left:auto;text-align:right}.ice-orbit__story-title{font-size:clamp(1rem,5.4vw,1.55rem);line-height:.95;letter-spacing:-.05em}.ice-orbit__story-card--origin .ice-orbit__story-title{font-size:clamp(1.15rem,6vw,1.7rem)}.ice-orbit__story-card--end .ice-orbit__story-title{font-size:clamp(1.05rem,5.6vw,1.6rem)}.ice-orbit__story-kicker{gap:.38rem;margin-bottom:.5rem;font-size:clamp(.38rem,1.55vw,.48rem);letter-spacing:.13em}.ice-orbit__story-kicker::before{width:.9rem}.ice-orbit__story-copy{max-width:100%;margin-top:.6rem;font-size:clamp(.54rem,1.9vw,.62rem);line-height:1.4;letter-spacing:.02em}.ice-orbit__checkpoint-rail{left:max(1rem,env(safe-area-inset-left));bottom:max(1rem,env(safe-area-inset-bottom));gap:.4rem;font-size:.42rem}.ice-orbit__checkpoint{width:.36rem;height:.36rem}}
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
  const parlourOpacity = useTransform(storyProgress, [0.25, 0.28, 0.45, 0.48], [0, 1, 1, 0]);
  const parlourY = useTransform(storyProgress, [0.25, 0.28, 0.48], [22, 0, -18]);
  const cravingOpacity = useTransform(storyProgress, [0.52, 0.55, 0.72, 0.75], [0, 1, 1, 0]);
  const cravingY = useTransform(storyProgress, [0.52, 0.55, 0.75], [22, 0, -18]);
  const endOpacity = useTransform(storyProgress, [0.79, 0.82, 1], [0, 1, 1]);
  const endY = useTransform(storyProgress, [0.79, 0.82], [22, 0]);
  const [isReady, setIsReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeCheckpoint, setActiveCheckpoint] = useState(0);

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
    if (!isReady) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || !Number.isFinite(video.duration)) return;

    if (reduceMotion) {
      video.pause();
      video.currentTime = 0;
      storyProgress.set(0.12);
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
      snap: reduceMotion ? undefined : { snapTo: STORY_SNAP_POINTS, delay: 0.08, duration: { min: 0.14, max: 0.32 }, ease: "power2.out", inertia: false },
      onLeave: (self) => {
        if (video.currentTime >= video.duration - 0.04) return;
        waitingForCompletion = true;
        window.requestAnimationFrame(() => self.scroll(self.end - 2));
      },
    });

    releaseCompletionLockRef.current = () => {
      if (!waitingForCompletion) return;
      waitingForCompletion = false;
      window.requestAnimationFrame(() => trigger.scroll(trigger.end + 2));
    };

    ScrollTrigger.refresh();
    return () => {
      releaseCompletionLockRef.current = null;
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
          <motion.div className="ice-orbit__story-card ice-orbit__story-card--origin" style={{ opacity: openingOpacity, y: openingY }}>
            <p className="ice-orbit__story-kicker">The cold chapter</p>
            <h2 className="ice-orbit__story-title">Naatures<br /><em>Scuup</em></h2>
            <p className="ice-orbit__story-copy">A pause for the scoop, served at the pace of the table.</p>
          </motion.div>
          <motion.div className="ice-orbit__story-card ice-orbit__story-card--left" style={{ opacity: parlourOpacity, y: parlourY }}>
            <p className="ice-orbit__story-kicker">Mall Road, Kanpur</p>
            <h2 className="ice-orbit__story-title">Kanpur&apos;s first<br /><em>live ice-cream</em><br />parlour</h2>
            <p className="ice-orbit__story-copy">Watch the cold come alive, one slow turn at a time.</p>
          </motion.div>
          <motion.div className="ice-orbit__story-card ice-orbit__story-card--right" style={{ opacity: cravingOpacity, y: cravingY }}>
            <p className="ice-orbit__story-kicker">Made for the table</p>
            <h2 className="ice-orbit__story-title">One place.<br /><em>Every craving.</em></h2>
            <p className="ice-orbit__story-copy">From the first bite to the final frozen spoonful.</p>
          </motion.div>
          <motion.div className="ice-orbit__story-card ice-orbit__story-card--end" style={{ opacity: endOpacity, y: endY }}>
            <p className="ice-orbit__story-kicker">Keep it cold</p>
            <h2 className="ice-orbit__story-title"><em>#Freeze the</em><br />happiness</h2>
          </motion.div>
        </div>
        <div className="ice-orbit__checkpoint-rail" aria-hidden="true">{["01", "02", "03", "04"].map((label, index) => <span key={label} className="ice-orbit__checkpoint" data-active={index === activeCheckpoint} />)}<span className="ice-orbit__checkpoint-label">{String(activeCheckpoint + 1).padStart(2, "0")} / 04</span></div>
        {!isReady && <div className="ice-orbit__loading" role="status" aria-label="Preparing the image sequence" />}
      </div>
    </section>
  );
}
