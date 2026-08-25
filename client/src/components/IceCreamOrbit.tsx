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
const MAX_PRELOAD_CONCURRENCY = 3;
const PRELOAD_RADIUS = 6;
const MAX_FRAME_CACHE = 14;
const MAX_CANVAS_DPR = 2;

function drawCoverFrame(canvas: HTMLCanvasElement, image: HTMLImageElement, opacity = 1, clear = true) {
  const context = canvas.getContext("2d");
  if (!context || !image.naturalWidth || !image.naturalHeight) return;

  const bounds = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_CANVAS_DPR);
  const targetWidth = Math.max(1, Math.round(bounds.width * dpr));
  const targetHeight = Math.max(1, Math.round(bounds.height * dpr));
  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }

  const scale = Math.max(targetWidth / image.naturalWidth, targetHeight / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  if (clear) context.clearRect(0, 0, targetWidth, targetHeight);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.save();
  context.globalAlpha = opacity;
  context.drawImage(image, (targetWidth - drawWidth) / 2, (targetHeight - drawHeight) / 2, drawWidth, drawHeight);
  context.restore();
}

export function IceCreamOrbit() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<LoadedFrame[]>([]);
  const currentFrameRef = useRef(0);
  const queueFramesRef = useRef<(center: number) => void>(() => {});
  const renderAnimationRef = useRef<number | null>(null);
  const pendingFrameRef = useRef(0);
  const lastQueuedFrameRef = useRef(-1);
  const lastDrawnImageRef = useRef<HTMLImageElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const renderFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const safeFrame = Math.round(clamp(frameIndex / (MANGO_SCROLL_FRAME_COUNT - 1)) * (MANGO_SCROLL_FRAME_COUNT - 1));
    if (lastQueuedFrameRef.current < 0 || Math.abs(safeFrame - lastQueuedFrameRef.current) >= 3) {
      lastQueuedFrameRef.current = safeFrame;
      queueFramesRef.current(safeFrame);
    }
    const image = framesRef.current[safeFrame] ?? (() => {
      for (let distance = 1; distance < MANGO_SCROLL_FRAME_COUNT; distance += 1) {
        const previous = framesRef.current[safeFrame - distance];
        const next = framesRef.current[safeFrame + distance];
        if (previous) return previous;
        if (next) return next;
      }
      return null;
    })();
    if (!image) return;
    currentFrameRef.current = safeFrame;
    if (image === lastDrawnImageRef.current) return;
    lastDrawnImageRef.current = image;
    drawCoverFrame(canvas, image);
  };

  const scheduleRenderFrame = (frameIndex: number) => {
    pendingFrameRef.current = frameIndex;
    if (renderAnimationRef.current !== null) return;
    renderAnimationRef.current = window.requestAnimationFrame(() => {
      renderAnimationRef.current = null;
      renderFrame(pendingFrameRef.current);
    });
  };

  useEffect(() => {
    let cancelled = false;
    const frames: LoadedFrame[] = Array.from({ length: MANGO_SCROLL_FRAMES.length }, () => null);
    framesRef.current = frames;
    const queued = new Set<number>();
    const inFlight = new Set<number>();
    const queue: number[] = [];

    const pruneCache = (center: number) => {
      for (let index = 0; index < frames.length; index += 1) {
        if (frames[index] && Math.abs(index - center) > Math.floor(MAX_FRAME_CACHE / 2)) {
          frames[index] = null;
        }
      }
    };

    const preloadFrame = (source: string, index: number) => new Promise<void>((resolve) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        if (!cancelled) {
          frames[index] = image;
          if (index === 0) setIsReady(true);
          pruneCache(currentFrameRef.current);
          scheduleRenderFrame(currentFrameRef.current);
        }
        resolve();
      };
      image.onerror = () => resolve();
      image.src = source;
    });

    const drainQueue = () => {
      while (!cancelled && inFlight.size < MAX_PRELOAD_CONCURRENCY && queue.length > 0) {
        const index = queue.shift();
        if (index === undefined) return;
        queued.delete(index);
        if (frames[index] || inFlight.has(index)) continue;
        inFlight.add(index);
        void preloadFrame(MANGO_SCROLL_FRAMES[index], index).finally(() => {
          inFlight.delete(index);
          drainQueue();
        });
      }
    };

    const queueFramesAround = (center: number) => {
      currentFrameRef.current = center;
      if (lastQueuedFrameRef.current >= 0 && Math.abs(center - lastQueuedFrameRef.current) < 3) return;
      pruneCache(center);
      queue.length = 0;
      queued.clear();
      for (let distance = 0; distance <= PRELOAD_RADIUS; distance += 1) {
        const candidates = distance === 0 ? [center] : [center - distance, center + distance];
        candidates.forEach((index) => {
          if (index < 0 || index >= MANGO_SCROLL_FRAME_COUNT || frames[index] || inFlight.has(index) || queued.has(index)) return;
          queue.push(index);
          queued.add(index);
        });
      }
      drainQueue();
    };

    queueFramesRef.current = queueFramesAround;
    queueFramesAround(0);

    return () => {
      cancelled = true;
      queueFramesRef.current = () => {};
      if (renderAnimationRef.current !== null) window.cancelAnimationFrame(renderAnimationRef.current);
    };
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

    const resizeCanvas = () => {
      lastDrawnImageRef.current = null;
      scheduleRenderFrame(currentFrameRef.current);
    };
    window.addEventListener("resize", resizeCanvas);
    if (reduceMotion) {
      scheduleRenderFrame(0);
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
          end: () => `+=${Math.max(window.innerHeight * 3.75, 2800)}`,
          scrub: 0.35,
          pin: ".ice-orbit__stage",
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: () => scheduleRenderFrame(playhead.frame),
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
