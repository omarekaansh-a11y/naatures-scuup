import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MANGO_SCROLL_FRAMES, MANGO_SCROLL_FRAME_COUNT } from "@/lib/mango-scroll-frames";

gsap.registerPlugin(ScrollTrigger);

const orbitStyles = `
  .ice-orbit{position:relative;background:var(--maroon-deep,#35101a);color:var(--cream,#f4f0e8)}
  .ice-orbit__stage{position:relative;display:grid;min-height:100svh;overflow:hidden;isolation:isolate;background:radial-gradient(circle at 70% 45%,rgba(228,183,77,.18),transparent 29%),linear-gradient(125deg,#260b15 0%,#531028 58%,#250912 100%)}
  .ice-orbit__stage:before{content:"";position:absolute;inset:0;z-index:-2;background-image:linear-gradient(rgba(244,240,232,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(244,240,232,.045) 1px,transparent 1px);background-size:62px 62px;mask-image:linear-gradient(90deg,#000,transparent 74%);opacity:.38}
  .ice-orbit__stage:after{content:"";position:absolute;right:-19%;bottom:-28%;z-index:-1;width:72vw;height:72vw;border:1px solid rgba(237,189,104,.2);border-radius:50%;box-shadow:0 0 0 70px rgba(237,189,104,.035),0 0 0 145px rgba(237,189,104,.025);pointer-events:none}
  .ice-orbit__canvas-wrap{position:absolute;top:50%;right:clamp(4vw,9vw,14vw);width:min(51vw,720px);aspect-ratio:1/1.08;overflow:hidden;border:1px solid rgba(244,240,232,.35);border-radius:2px;background:#e9e4dc;box-shadow:0 34px 95px rgba(18,2,8,.54),inset 0 0 0 1px rgba(237,189,104,.2);transform:translate3d(0,-50%,0) rotateY(-7deg) rotateZ(-1deg);transform-origin:center;perspective:1600px;will-change:transform}
  .ice-orbit__canvas-wrap:after{content:"";position:absolute;inset:0;background:linear-gradient(130deg,rgba(77,7,34,.2),transparent 38%,rgba(237,189,104,.12));mix-blend-mode:multiply;pointer-events:none}
  .ice-orbit__canvas{display:block;width:100%;height:100%;image-rendering:auto}
  .ice-orbit__frame-note{position:absolute;right:17px;bottom:16px;z-index:1;margin:0;color:#571028;font:900 7px/1.35 Manrope,sans-serif;letter-spacing:.14em;text-align:right;text-transform:uppercase;pointer-events:none}
  .ice-orbit__copy{display:grid;align-content:center;width:min(49vw,650px);padding:clamp(104px,13vw,182px) 0 clamp(80px,10vw,132px) clamp(8.5vw,12vw,15vw)}
  .ice-orbit__eyebrow{margin:0 0 20px;color:var(--mango,#edbd68);font:900 8px/1 Manrope,sans-serif;letter-spacing:.18em;text-transform:uppercase}
  .ice-orbit__title{max-width:620px;margin:0;color:var(--cream,#f4f0e8);font:500 clamp(54px,6.1vw,104px)/.79 "Cormorant Garamond",Georgia,serif;letter-spacing:-.075em}
  .ice-orbit__title span,.ice-orbit__title i{display:inline-block}.ice-orbit__title i{color:var(--mango,#edbd68);font-weight:500}
  .ice-orbit__body{max-width:345px;margin:28px 0 0;color:rgba(244,240,232,.76);font:500 13px/1.7 Manrope,sans-serif}
  .ice-orbit__moods{display:flex;align-items:center;gap:12px;margin:31px 0 0;color:var(--cream,#f4f0e8);font:900 8px/1 Manrope,sans-serif;letter-spacing:.15em;text-transform:uppercase}.ice-orbit__moods:before{content:"";width:38px;height:1px;background:var(--mango,#edbd68)}
  .ice-orbit__scroll{position:absolute;bottom:31px;left:clamp(8.5vw,12vw,15vw);display:flex;align-items:center;gap:10px;margin:0;color:rgba(244,240,232,.67);font:800 7px/1 Manrope,sans-serif;letter-spacing:.16em;text-transform:uppercase}.ice-orbit__scroll i{display:block;width:27px;height:1px;background:var(--mango,#edbd68)}
  .ice-orbit__handoff{position:absolute;right:0;bottom:0;left:0;height:18vh;background:linear-gradient(transparent,var(--maroon-deep,#35101a));pointer-events:none}
  .ice-orbit__loading{position:absolute;inset:0;z-index:3;display:grid;place-content:center;gap:14px;background:linear-gradient(125deg,#260b15,#521027);text-align:center}.ice-orbit__loading b{color:var(--mango,#edbd68);font:900 8px/1 Manrope,sans-serif;letter-spacing:.18em;text-transform:uppercase}.ice-orbit__loading span{color:rgba(244,240,232,.78);font:500 12px/1.45 Manrope,sans-serif}.ice-orbit__loading i{display:block;width:110px;height:1px;background:rgba(244,240,232,.2);overflow:hidden}.ice-orbit__loading i:after{content:"";display:block;width:var(--frame-progress);height:100%;background:var(--mango,#edbd68);transition:width .18s var(--ease-out)}
  .ice-orbit__fallback{position:absolute;inset:0;z-index:3;display:grid;place-content:center;padding:35px;background:linear-gradient(125deg,#260b15,#521027);text-align:center}.ice-orbit__fallback strong{color:var(--mango,#edbd68);font:900 9px/1 Manrope,sans-serif;letter-spacing:.14em;text-transform:uppercase}.ice-orbit__fallback p{max-width:245px;margin:11px 0 0;color:rgba(244,240,232,.75);font:500 12px/1.55 Manrope,sans-serif}
  @media(max-width:760px){.ice-orbit__stage{grid-template-rows:auto 1fr;min-height:100svh;background:radial-gradient(circle at 57% 56%,rgba(228,183,77,.19),transparent 31%),linear-gradient(150deg,#250a15,#501027)}.ice-orbit__stage:before{background-size:42px 42px;mask-image:linear-gradient(180deg,#000,transparent 88%)}.ice-orbit__stage:after{right:-44%;bottom:-7%;width:105vw;height:105vw}.ice-orbit__copy{align-content:start;width:auto;padding:114px 25px 0}.ice-orbit__eyebrow{margin-bottom:17px}.ice-orbit__title{font-size:clamp(49px,14vw,67px)}.ice-orbit__body{max-width:285px;margin-top:18px;font-size:11px}.ice-orbit__moods{margin-top:21px;font-size:7px}.ice-orbit__canvas-wrap{top:auto;right:25px;bottom:clamp(72px,10vh,100px);width:calc(100% - 50px);aspect-ratio:1.08/1;transform:rotateY(-3deg) rotateZ(-1deg)}.ice-orbit__scroll{bottom:26px;left:25px}.ice-orbit__frame-note{right:13px;bottom:12px;font-size:6px}}
  @media(prefers-reduced-motion:reduce){.ice-orbit__scroll{display:none}.ice-orbit__canvas-wrap{transform:none!important}.ice-orbit__stage{min-height:760px}}
`;

const clamp = (value: number) => Math.max(0, Math.min(1, value));

type LoadedFrame = HTMLImageElement | null;

function drawContainedFrame(canvas: HTMLCanvasElement, image: HTMLImageElement) {
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
  const offsetX = (targetWidth - drawWidth) / 2;
  const offsetY = (targetHeight - drawHeight) / 2;
  context.clearRect(0, 0, targetWidth, targetHeight);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

export function IceCreamOrbit() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<LoadedFrame[]>([]);
  const currentFrameRef = useRef(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasFrameError, setHasFrameError] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const renderFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const safeIndex = Math.round(clamp(frameIndex / (MANGO_SCROLL_FRAME_COUNT - 1)) * (MANGO_SCROLL_FRAME_COUNT - 1));
    const image = framesRef.current[safeIndex] ?? framesRef.current.find((frame) => frame !== null);
    if (!image) return;
    currentFrameRef.current = safeIndex;
    drawContainedFrame(canvas, image);
  };

  useEffect(() => {
    let cancelled = false;
    const frames: LoadedFrame[] = Array.from({ length: MANGO_SCROLL_FRAME_COUNT }, () => null);
    framesRef.current = frames;

    const preloadFrame = (source: string, index: number) => new Promise<void>((resolve) => {
      const image = new Image();
      image.decoding = "async";
      const finish = (didLoad: boolean) => {
        if (didLoad) frames[index] = image;
        if (!cancelled) setLoadedCount((count) => count + 1);
        resolve();
      };
      image.onload = () => finish(true);
      image.onerror = () => finish(false);
      image.src = source;
    });

    Promise.all(MANGO_SCROLL_FRAMES.map(preloadFrame)).then(() => {
      if (cancelled) return;
      setHasFrameError(frames.some((frame) => frame === null));
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
          end: () => `+=${Math.max(window.innerHeight * 2.8, 2100)}`,
          scrub: 0.35,
          pin: ".ice-orbit__stage",
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

  const loadingProgress = `${Math.round((loadedCount / MANGO_SCROLL_FRAME_COUNT) * 100)}%`;
  const stageStyle = { "--frame-progress": loadingProgress } as CSSProperties;

  return (
    <section ref={sectionRef} id="story" className="ice-orbit" aria-labelledby="ice-orbit-title">
      <style>{orbitStyles}</style>
      <div className="ice-orbit__stage" style={stageStyle}>
        <div className="ice-orbit__copy">
          <p className="ice-orbit__eyebrow">01 / The scooped moment</p>
          <h2 id="ice-orbit-title" className="ice-orbit__title"><span>Come for the craving.</span><br /><i>Stay for the scoop.</i></h2>
          <p className="ice-orbit__body">Three hundred frames. One slow mango moment. Scroll to take the camera around the scoop, then follow it into the food edit.</p>
          <p className="ice-orbit__moods">One table. Many moods.</p>
        </div>
        <div className="ice-orbit__canvas-wrap" aria-label="Scroll-driven image sequence around a mango ice-cream glass">
          <canvas ref={canvasRef} className="ice-orbit__canvas" aria-label="Mango ice-cream image sequence" />
          <p className="ice-orbit__frame-note">300-frame sequence<br />Scroll controlled</p>
          {!isReady && <div className="ice-orbit__loading" role="status" aria-live="polite"><b>Preparing the scoop</b><span>Loading {loadedCount} of {MANGO_SCROLL_FRAME_COUNT} frames</span><i /></div>}
          {isReady && hasFrameError && <div className="ice-orbit__fallback"><strong>Sequence partially ready</strong><p>A few frames could not be prepared. The available sequence is still ready to explore.</p></div>}
        </div>
        <p className="ice-orbit__scroll" aria-hidden="true"><i />Scroll to orbit</p>
        <div className="ice-orbit__handoff" aria-hidden="true" />
      </div>
    </section>
  );
}
