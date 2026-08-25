import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MANGO_SCROLL_FRAMES, MANGO_SCROLL_FRAME_COUNT } from "@/lib/mango-scroll-frames";

gsap.registerPlugin(ScrollTrigger);

const sequenceStyles = `
  .ice-orbit{position:relative;width:100%;background:#090306}
  .ice-orbit__stage{position:relative;width:100%;height:100svh;overflow:hidden;background:#090306}
  .ice-orbit__canvas{display:block;width:100%;height:100%;background:#090306}
  .ice-orbit__loading{position:absolute;inset:0;background:#090306}
  @media(prefers-reduced-motion:reduce){.ice-orbit__stage{min-height:100svh}}
`;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
type LoadedFrame = HTMLImageElement | null;

function drawCoverFrame(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const context = canvas.getContext("2d");
  if (!context || !image.naturalWidth || !image.naturalHeight) return;

  const bounds = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const targetWidth = Math.max(1, Math.round(bounds.width * dpr));
  const targetHeight = Math.max(1, Math.round(bounds.height * dpr));
  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }

  const scale = Math.max(targetWidth / image.naturalWidth, targetHeight / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.clearRect(0, 0, targetWidth, targetHeight);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, (targetWidth - drawWidth) / 2, (targetHeight - drawHeight) / 2, drawWidth, drawHeight);
}

export function IceCreamOrbit() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<LoadedFrame[]>([]);
  const currentFrameRef = useRef(0);
  const [isReady, setIsReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const renderFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const safeIndex = Math.round(clamp(frameIndex / (MANGO_SCROLL_FRAME_COUNT - 1)) * (MANGO_SCROLL_FRAME_COUNT - 1));
    const image = framesRef.current[safeIndex] ?? framesRef.current.find((frame) => frame !== null);
    if (!image) return;
    currentFrameRef.current = safeIndex;
    drawCoverFrame(canvas, image);
  };

  useEffect(() => {
    let cancelled = false;
    const frames: LoadedFrame[] = Array.from({ length: MANGO_SCROLL_FRAME_COUNT }, () => null);
    framesRef.current = frames;

    const preloadFrame = (source: string, index: number) => new Promise<void>((resolve) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => { frames[index] = image; resolve(); };
      image.onerror = () => resolve();
      image.src = source;
    });

    Promise.all(MANGO_SCROLL_FRAMES.map(preloadFrame)).then(() => {
      if (cancelled) return;
      if (frames.some((frame) => frame !== null)) {
        setIsReady(true);
        window.requestAnimationFrame(() => renderFrame(0));
      }
    });

    return () => { cancelled = true; };
  }, []);

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
    if (!section) return;

    const resizeCanvas = () => renderFrame(currentFrameRef.current);
    window.addEventListener("resize", resizeCanvas);
    if (reduceMotion) {
      renderFrame(0);
      return () => window.removeEventListener("resize", resizeCanvas);
    }

    const playhead = { frame: 0 };
    const context = gsap.context(() => {
      gsap.to(playhead, {
        frame: MANGO_SCROLL_FRAME_COUNT - 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 3.4, 2600)}`,
          scrub: 0.35,
          pin: ".ice-orbit__stage",
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: () => renderFrame(playhead.frame),
        },
      });
    }, section);

    ScrollTrigger.refresh();
    return () => {
      context.revert();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isReady, reduceMotion]);

  return (
    <section ref={sectionRef} id="story" className="ice-orbit" aria-label="Full-screen mango ice-cream frame sequence">
      <style>{sequenceStyles}</style>
      <div className="ice-orbit__stage">
        <canvas ref={canvasRef} className="ice-orbit__canvas" aria-label="Mango ice-cream frame sequence" />
        {!isReady && <div className="ice-orbit__loading" role="status" aria-label="Preparing the image sequence" />}
      </div>
    </section>
  );
}
