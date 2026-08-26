import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_VIDEO_SOURCE = "/manus-storage/mango-ice-cream-1440p-clean-scrub_59b5e815.mp4";
const MOBILE_VIDEO_SOURCE = "/manus-storage/mango-ice-cream-portrait-mobile_4b0f7dd0.mp4";
const VIDEO_POSTER = "/manus-storage/ezgif-frame-001_c0bf1371.png";

const sequenceStyles = `
  .ice-orbit{position:relative;width:100%;background:#090306}
  .ice-orbit__stage{position:relative;width:100%;height:100svh;overflow:hidden;background:#090306}
  .ice-orbit__video{display:block;width:100%;height:100%;object-fit:cover;object-position:center;background:#090306}
  .ice-orbit__loading{position:absolute;inset:0;background:#090306}
  @media(max-width:767px){.ice-orbit__video{object-fit:cover}}
  @media(prefers-reduced-motion:reduce){.ice-orbit__stage{min-height:100svh}}
`;

export function IceCreamOrbit() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const settleAnimationRef = useRef<number | null>(null);
  const releaseCompletionLockRef = useRef<(() => void) | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

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
        advanceToTarget();
      },
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
        {!isReady && <div className="ice-orbit__loading" role="status" aria-label="Preparing the image sequence" />}
      </div>
    </section>
  );
}
