import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SOURCE = "/manus-storage/mango-ice-cream-1440p-clean-scrub_59b5e815.mp4";
const VIDEO_POSTER = "/manus-storage/ezgif-frame-001_c0bf1371.png";

const sequenceStyles = `
  .ice-orbit{position:relative;width:100%;background:#090306}
  .ice-orbit__stage{position:relative;width:100%;height:100svh;overflow:hidden;background:#090306}
  .ice-orbit__video{display:block;width:100%;height:100%;object-fit:cover;object-position:center;background:#090306}
  .ice-orbit__loading{position:absolute;inset:0;background:#090306}
  @media(prefers-reduced-motion:reduce){.ice-orbit__stage{min-height:100svh}}
`;

export function IceCreamOrbit() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const seekAnimationRef = useRef<number | null>(null);
  const pendingTimeRef = useRef(0);
  const [isReady, setIsReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const scheduleSeek = (time: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    pendingTimeRef.current = Math.max(0, Math.min(video.duration, time));
    if (seekAnimationRef.current !== null) return;
    seekAnimationRef.current = window.requestAnimationFrame(() => {
      seekAnimationRef.current = null;
      const targetTime = pendingTimeRef.current;
      if (Math.abs(video.currentTime - targetTime) > 1 / 48) video.currentTime = targetTime;
    });
  };

  const handleVideoReady = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setIsReady(true);
    scheduleSeek(0);
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
      scheduleSeek(0);
      return;
    }

    const playhead = { time: 0 };
    const context = gsap.context(() => {
      gsap.to(playhead, {
        time: video.duration,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 3.75, 2800)}`,
          scrub: 0.7,
          pin: ".ice-orbit__stage",
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: () => scheduleSeek(playhead.time),
        },
      });
    }, section);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, [isReady, reduceMotion]);

  useEffect(() => () => {
    if (seekAnimationRef.current !== null) window.cancelAnimationFrame(seekAnimationRef.current);
  }, []);

  return (
    <section ref={sectionRef} id="story" className="ice-orbit" aria-label="Full-screen mango ice-cream sequence">
      <style>{sequenceStyles}</style>
      <div className="ice-orbit__stage">
        <video
          ref={videoRef}
          className="ice-orbit__video"
          src={VIDEO_SOURCE}
          poster={VIDEO_POSTER}
          muted
          playsInline
          preload="auto"
          onLoadedData={handleVideoReady}
          aria-label="Mango ice-cream sequence"
        />
        {!isReady && <div className="ice-orbit__loading" role="status" aria-label="Preparing the image sequence" />}
      </div>
    </section>
  );
}
