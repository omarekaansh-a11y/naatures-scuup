/**
 * Style reminder — Mall Road Monograph: a slow, straight, seamless food promenade that feels like an editorial table edge.
 * Owner photographs remain unique foreground assets; low-key motion, direct dragging, and keyboard controls preserve accessibility.
 */
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

type FoodCanvasItem = {
  src: string;
  label: string;
  note: string;
  alt: string;
};

type DragFoodCanvasProps = {
  items: readonly FoodCanvasItem[];
};

export function DragFoodCanvas({ items }: DragFoodCanvasProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const velocityRef = useRef(0);
  const lastPointerRef = useRef({ x: 0, time: 0 });
  const startPointerRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const pauseAutoRef = useRef(false);
  const momentumRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const momentumFrameRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getLoopDistance = () => trackRef.current?.querySelector<HTMLElement>(".tactile-table__set")?.offsetWidth ?? 0;

  const wrapPosition = (nextPosition: number) => {
    const loopDistance = getLoopDistance();
    if (!loopDistance) return nextPosition;
    let resolved = nextPosition;
    while (resolved <= -loopDistance) resolved += loopDistance;
    while (resolved > 0) resolved -= loopDistance;
    return resolved;
  };

  const renderPosition = (nextPosition: number) => {
    positionRef.current = nextPosition;
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${nextPosition}px, 0, 0)`;
  };

  const moveBy = (distance: number) => renderPosition(wrapPosition(positionRef.current + distance));

  const cancelMomentum = () => {
    if (momentumFrameRef.current !== null) {
      window.cancelAnimationFrame(momentumFrameRef.current);
      momentumFrameRef.current = null;
    }
    momentumRef.current = false;
  };

  const releaseMomentum = () => {
    cancelMomentum();
    momentumRef.current = true;
    const tick = () => {
      velocityRef.current *= 0.91;
      if (Math.abs(velocityRef.current) < 0.012) {
        momentumRef.current = false;
        momentumFrameRef.current = null;
        return;
      }
      moveBy(velocityRef.current * 16);
      momentumFrameRef.current = window.requestAnimationFrame(tick);
    };
    momentumFrameRef.current = window.requestAnimationFrame(tick);
  };

  const endDrag = () => {
    if (!draggingRef.current) {
      pauseAutoRef.current = false;
      return;
    }
    draggingRef.current = false;
    setIsDragging(false);
    releaseMomentum();
    pauseAutoRef.current = false;
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    cancelMomentum();
    pauseAutoRef.current = true;
    draggingRef.current = false;
    velocityRef.current = 0;
    startPointerRef.current = { x: event.clientX, y: event.clientY };
    lastPointerRef.current = { x: event.clientX, time: performance.now() };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const horizontalTravel = event.clientX - startPointerRef.current.x;
    const verticalTravel = event.clientY - startPointerRef.current.y;
    if (!draggingRef.current) {
      if (Math.abs(horizontalTravel) < 7 || Math.abs(horizontalTravel) <= Math.abs(verticalTravel)) return;
      draggingRef.current = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    const now = performance.now();
    const elapsed = Math.max(1, now - lastPointerRef.current.time);
    const movement = event.clientX - lastPointerRef.current.x;
    velocityRef.current = movement / elapsed;
    lastPointerRef.current = { x: event.clientX, time: now };
    moveBy(movement);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      cancelMomentum();
      moveBy(-240);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      cancelMomentum();
      moveBy(240);
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => { reducedMotionRef.current = mediaQuery.matches; };
    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    let animationFrame = 0;
    let lastTime = performance.now();
    const drift = (time: number) => {
      const elapsed = Math.min(40, time - lastTime);
      lastTime = time;
      if (!reducedMotionRef.current && !pauseAutoRef.current && !draggingRef.current && !momentumRef.current) moveBy(-elapsed * 0.009);
      animationFrame = window.requestAnimationFrame(drift);
    };
    animationFrame = window.requestAnimationFrame(drift);

    const onResize = () => renderPosition(wrapPosition(positionRef.current));
    window.addEventListener("resize", onResize, { passive: true });
    onResize();
    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(animationFrame);
      cancelMomentum();
    };
  }, []);

  const renderSet = (duplicate = false) => (
    <div className="tactile-table__set" aria-hidden={duplicate || undefined}>
      {items.map((item, index) => (
        <figure className="tactile-table__card" key={`${duplicate ? "duplicate" : "primary"}-${item.src}`}>
          <div className="tactile-table__frame"><img src={item.src} alt={duplicate ? "" : item.alt} draggable={false} loading="eager" /></div>
          <figcaption><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.label}</strong><em>{item.note}</em></figcaption>
        </figure>
      ))}
    </div>
  );

  return (
    <section id="food-canvas" className="tactile-table-section" aria-labelledby="tactile-table-title">
      <div className="tactile-table-intro section-pad">
        <div className="tactile-table-index"><span>04 / Freeze frame</span><small>Seven moments<br />from Mall Road</small></div>
        <div>
          <h2 id="tactile-table-title">Hold the<br /><i>happy bits.</i></h2>
          <p>Drift across real moments from the Naatures Scuup counter—each one a small reason to linger longer at the table.</p>
        </div>
      </div>
      <div
        ref={viewportRef}
        className={`tactile-table ${isDragging ? "tactile-table--dragging" : ""}`}
        tabIndex={0}
        role="region"
        aria-label="An automatically moving, draggable row of Naatures Scuup food photographs. Drag left or right, or use the left and right arrow keys to explore. Motion pauses while you interact."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={() => { pauseAutoRef.current = true; }}
        onPointerLeave={() => { if (!draggingRef.current) pauseAutoRef.current = false; }}
        onFocus={() => { pauseAutoRef.current = true; }}
        onBlur={() => { if (!draggingRef.current) pauseAutoRef.current = false; }}
        onKeyDown={handleKeyDown}
      >
        <div ref={trackRef} className="tactile-table__track">
          {renderSet()}
          {renderSet(true)}
        </div>
      </div>
    </section>
  );
}
