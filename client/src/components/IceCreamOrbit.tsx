import { useEffect, useRef, useState } from "react";

const ORBIT_VIDEO_SRC = "/manus-storage/mango-ice-cream-orbit_67d8ab47.mp4";

const orbitStyles = `
  .ice-orbit{position:relative;height:220vh;background:var(--maroon-deep,#35101a)}
  .ice-orbit__sticky{position:sticky;top:0;display:grid;min-height:100svh;overflow:hidden;isolation:isolate;background:radial-gradient(circle at 72% 45%,rgba(228,183,77,.18),transparent 28%),linear-gradient(125deg,#260b15 0%,#531028 58%,#250912 100%)}
  .ice-orbit__halo{position:absolute;inset:-20%;z-index:-2;background:conic-gradient(from calc(var(--orbit-progress) * 120deg) at 67% 50%,rgba(237,189,104,.2),rgba(80,8,35,0) 20%,rgba(244,240,232,.09) 48%,rgba(80,8,35,0) 67%,rgba(237,189,104,.15));filter:blur(46px);opacity:.85;transform:scale(calc(1 + var(--orbit-progress) * .12));transition:transform .08s linear}
  .ice-orbit__grid{position:absolute;inset:0;z-index:-1;background-image:linear-gradient(rgba(244,240,232,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(244,240,232,.045) 1px,transparent 1px);background-size:62px 62px;mask-image:linear-gradient(90deg,#000,transparent 74%);opacity:.38}
  .ice-orbit__frame{position:absolute;top:50%;right:clamp(4vw,9vw,14vw);width:min(51vw,720px);aspect-ratio:1/1.08;overflow:hidden;border:1px solid rgba(244,240,232,.35);border-radius:2px;box-shadow:0 34px 95px rgba(18,2,8,.54),inset 0 0 0 1px rgba(237,189,104,.2);transform:translate3d(calc(var(--orbit-progress) * -5vw),calc(-50% + (var(--orbit-progress) * -1.4vh)),0) rotateY(calc(-7deg + var(--orbit-progress) * 12deg)) rotateZ(calc(-1deg + var(--orbit-progress) * 2deg)) scale(calc(.92 + var(--orbit-progress) * .08));transform-origin:center;perspective:1600px;will-change:transform}
  .ice-orbit__frame:after{content:"";position:absolute;inset:0;background:linear-gradient(130deg,rgba(77,7,34,.2),transparent 38%,rgba(237,189,104,.12));mix-blend-mode:multiply;pointer-events:none}
  .ice-orbit__video{display:block;width:100%;height:100%;object-fit:cover;background:#e7e2d9;transform:scale(calc(1.04 + var(--orbit-progress) * .08));will-change:transform}
  .ice-orbit__frame-note{position:absolute;right:17px;bottom:16px;z-index:1;margin:0;color:#571028;font:900 7px/1.35 Manrope,sans-serif;letter-spacing:.14em;text-align:right;text-transform:uppercase}
  .ice-orbit__copy{display:grid;align-content:center;width:min(49vw,650px);padding:clamp(104px,13vw,182px) 0 clamp(80px,10vw,132px) clamp(8.5vw,12vw,15vw);color:var(--cream,#f4f0e8)}
  .ice-orbit__eyebrow{margin:0 0 20px;color:var(--mango,#edbd68);font:900 8px/1 Manrope,sans-serif;letter-spacing:.18em;text-transform:uppercase;transform:translateY(calc((1 - var(--orbit-progress)) * 18px));opacity:clamp(.35,calc(.72 + var(--orbit-progress)),1)}
  .ice-orbit__title{max-width:620px;margin:0;color:var(--cream,#f4f0e8);font:500 clamp(54px,6.1vw,104px)/.79 "Cormorant Garamond",Georgia,serif;letter-spacing:-.075em}
  .ice-orbit__title span{display:inline-block;transform:translate3d(calc(var(--orbit-progress) * -1.8vw),calc((1 - var(--orbit-progress)) * 18px),0);opacity:clamp(.35,calc(.72 + var(--orbit-progress)),1)}
  .ice-orbit__title i{display:inline-block;color:var(--mango,#edbd68);font-weight:500;transform:translate3d(calc(var(--orbit-progress) * 1.1vw),calc((1 - var(--orbit-progress)) * 31px),0);opacity:clamp(.35,calc(.68 + var(--orbit-progress)),1)}
  .ice-orbit__body{max-width:345px;margin:28px 0 0;color:rgba(244,240,232,.76);font:500 13px/1.7 Manrope,sans-serif;opacity:clamp(.25,calc(.55 + var(--orbit-progress)),1)}
  .ice-orbit__moods{display:flex;align-items:center;gap:12px;margin:31px 0 0;color:var(--cream,#f4f0e8);font:900 8px/1 Manrope,sans-serif;letter-spacing:.15em;text-transform:uppercase;transform:translateY(calc((1 - var(--orbit-progress)) * 12px));opacity:clamp(.4,calc(.58 + var(--orbit-progress)),1)}
  .ice-orbit__moods:before{content:"";width:38px;height:1px;background:var(--mango,#edbd68)}
  .ice-orbit__scroll{position:absolute;bottom:31px;left:clamp(8.5vw,12vw,15vw);display:flex;align-items:center;gap:10px;margin:0;color:rgba(244,240,232,.67);font:800 7px/1 Manrope,sans-serif;letter-spacing:.16em;text-transform:uppercase}.ice-orbit__scroll i{display:block;width:27px;height:1px;background:var(--mango,#edbd68);transform:scaleX(calc(.45 + var(--orbit-progress) * .55));transform-origin:left}
  .ice-orbit__handoff{position:absolute;right:0;bottom:0;left:0;height:18vh;background:linear-gradient(transparent,var(--maroon-deep,#35101a));pointer-events:none}
  .ice-orbit--ready .ice-orbit__frame{transition:box-shadow .35s var(--ease-out),border-color .35s var(--ease-out)}
  @media(max-width:760px){.ice-orbit{height:165vh}.ice-orbit__sticky{grid-template-rows:auto 1fr;background:radial-gradient(circle at 57% 56%,rgba(228,183,77,.19),transparent 31%),linear-gradient(150deg,#250a15,#501027)}.ice-orbit__copy{align-content:start;width:auto;padding:114px 25px 0}.ice-orbit__eyebrow{margin-bottom:17px}.ice-orbit__title{font-size:clamp(49px,14vw,67px)}.ice-orbit__body{max-width:285px;margin-top:18px;font-size:11px}.ice-orbit__moods{margin-top:21px;font-size:7px}.ice-orbit__frame{top:auto;right:25px;bottom:clamp(72px,10vh,100px);width:calc(100% - 50px);aspect-ratio:1.08/1;transform:translate3d(0,calc(var(--orbit-progress) * -2vh),0) rotateY(calc(-3deg + var(--orbit-progress) * 6deg)) rotateZ(calc(-1deg + var(--orbit-progress) * 2deg)) scale(calc(.95 + var(--orbit-progress) * .05))}.ice-orbit__scroll{bottom:26px;left:25px}.ice-orbit__grid{background-size:42px 42px;mask-image:linear-gradient(180deg,#000,transparent 88%)}}
  @media(prefers-reduced-motion:reduce){.ice-orbit{height:auto;min-height:760px}.ice-orbit__sticky{position:relative;min-height:760px}.ice-orbit__halo,.ice-orbit__frame,.ice-orbit__video,.ice-orbit__eyebrow,.ice-orbit__title span,.ice-orbit__title i,.ice-orbit__moods{transform:none!important;transition:none!important}.ice-orbit__scroll{display:none}}
`;

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function IceCreamOrbit() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(-1);
  const [isReady, setIsReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(query.matches);
    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const syncOrbit = () => {
      frameRef.current = null;
      const rect = section.getBoundingClientRect();
      const scrollDistance = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / scrollDistance);
      section.style.setProperty("--orbit-progress", progress.toFixed(4));

      if (reduceMotion || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const targetTime = Math.max(0, Math.min(video.duration - 0.04, video.duration * (0.035 + progress * 0.91)));
      if (Math.abs(targetTime - lastTimeRef.current) < 0.025) return;
      lastTimeRef.current = targetTime;
      video.currentTime = targetTime;
    };

    const requestSync = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(syncOrbit);
    };

    syncOrbit();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
    video.addEventListener("loadedmetadata", requestSync);
    return () => {
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      video.removeEventListener("loadedmetadata", requestSync);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [reduceMotion]);

  return (
    <section ref={sectionRef} id="story" className={`ice-orbit ${isReady ? "ice-orbit--ready" : ""}`} aria-labelledby="ice-orbit-title" style={{ "--orbit-progress": 0 } as React.CSSProperties}>
      <style>{orbitStyles}</style>
      <div className="ice-orbit__sticky">
        <div className="ice-orbit__halo" aria-hidden="true" />
        <div className="ice-orbit__grid" aria-hidden="true" />
        <div className="ice-orbit__copy">
          <p className="ice-orbit__eyebrow">01 / The scooped moment</p>
          <h2 id="ice-orbit-title" className="ice-orbit__title"><span>Come for the craving.</span><br /><i>Stay for the scoop.</i></h2>
          <p className="ice-orbit__body">A slow orbit around a mango moment. Let the scroll set the pace, then follow it into the food edit.</p>
          <p className="ice-orbit__moods">One table. Many moods.</p>
        </div>
        <div className="ice-orbit__frame" aria-label="Scroll-driven orbit around a mango ice-cream glass">
          <video ref={videoRef} className="ice-orbit__video" src={ORBIT_VIDEO_SRC} preload="metadata" muted playsInline onLoadedData={() => setIsReady(true)} aria-label="Mango ice cream in a glass viewed from a slow camera orbit" />
          <p className="ice-orbit__frame-note">Mango moment<br />Scroll controlled</p>
        </div>
        <p className="ice-orbit__scroll" aria-hidden="true"><i />Scroll to orbit</p>
        <div className="ice-orbit__handoff" aria-hidden="true" />
      </div>
    </section>
  );
}
