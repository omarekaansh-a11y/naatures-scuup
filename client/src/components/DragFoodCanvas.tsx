/**
 * Style reminder — Mall Road Monograph: a distinct, editorial food-canvas interaction.
 * This is an original direct-manipulation experience for Naatures Scuup, not a carousel or a replica of another site.
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

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function DragFoodCanvas({ items }: DragFoodCanvasProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const velocityRef = useRef(0);
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 });
  const startPointerRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const momentumFrameRef = useRef<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);

  const getMinX = () => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return 0;
    return Math.min(0, viewport.clientWidth - track.scrollWidth);
  };

  const renderPosition = (nextPosition: number) => {
    positionRef.current = nextPosition;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${nextPosition}px, 0, 0)`;
    }
  };

  const setPosition = (nextPosition: number, withResistance = false) => {
    const minX = getMinX();
    let resolved = nextPosition;
    if (withResistance && nextPosition > 0) resolved = nextPosition * 0.28;
    if (withResistance && nextPosition < minX) resolved = minX + (nextPosition - minX) * 0.28;
    renderPosition(withResistance ? resolved : clamp(resolved, minX, 0));
  };

  const cancelMomentum = () => {
    if (momentumFrameRef.current !== null) {
      window.cancelAnimationFrame(momentumFrameRef.current);
      momentumFrameRef.current = null;
    }
  };

  const releaseMomentum = () => {
    cancelMomentum();
    const tick = () => {
      velocityRef.current *= 0.91;
      if (Math.abs(velocityRef.current) < 0.014) {
        const minX = getMinX();
        renderPosition(clamp(positionRef.current, minX, 0));
        momentumFrameRef.current = null;
        return;
      }
      const minX = getMinX();
      const nextPosition = positionRef.current + velocityRef.current * 16;
      if (nextPosition > 0 || nextPosition < minX) velocityRef.current *= 0.46;
      renderPosition(clamp(nextPosition, minX, 0));
      momentumFrameRef.current = window.requestAnimationFrame(tick);
    };
    momentumFrameRef.current = window.requestAnimationFrame(tick);
  };

  const positionIndicator = (event: PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    const indicator = indicatorRef.current;
    if (!viewport || !indicator || event.pointerType === "touch") return;
    const box = viewport.getBoundingClientRect();
    indicator.style.transform = `translate3d(${event.clientX - box.left}px, ${event.clientY - box.top}px, 0)`;
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    setHasDragged(true);
    releaseMomentum();
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    cancelMomentum();
    draggingRef.current = false;
    velocityRef.current = 0;
    const now = performance.now();
    startPointerRef.current = { x: event.clientX, y: event.clientY };
    lastPointerRef.current = { x: event.clientX, y: event.clientY, time: now };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    positionIndicator(event);
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
    lastPointerRef.current = { x: event.clientX, y: event.clientY, time: now };
    setPosition(positionRef.current + movement, true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const minX = getMinX();
    if (event.key === "ArrowRight") {
      event.preventDefault();
      cancelMomentum();
      setPosition(positionRef.current - 180);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      cancelMomentum();
      setPosition(positionRef.current + 180);
    }
    if (event.key === "Home") {
      event.preventDefault();
      cancelMomentum();
      renderPosition(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      cancelMomentum();
      renderPosition(minX);
    }
  };

  useEffect(() => {
    const onResize = () => renderPosition(clamp(positionRef.current, getMinX(), 0));
    window.addEventListener("resize", onResize, { passive: true });
    onResize();
    return () => {
      window.removeEventListener("resize", onResize);
      cancelMomentum();
    };
  }, []);

  return (
    <section id="food-canvas" className="drag-canvas-section" aria-labelledby="drag-canvas-title">
      <div className="drag-canvas-intro section-pad">
        <p className="eyebrow eyebrow--maroon">04 / From the counter</p>
        <div>
          <h2 id="drag-canvas-title">Pull the<br /><i>table closer.</i></h2>
          <p>Move through a few real moments from the Naatures Scuup kitchen and counter.</p>
        </div>
      </div>

      <div
        ref={viewportRef}
        className={`drag-canvas ${isDragging ? "drag-canvas--dragging" : ""}`}
        tabIndex={0}
        role="region"
        aria-label="A draggable canvas of Naatures Scuup food photographs. Drag left or right, or use the arrow keys to explore."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={() => setIsHovering(true)}
        onPointerLeave={() => !draggingRef.current && setIsHovering(false)}
        onKeyDown={handleKeyDown}
      >
        <div ref={indicatorRef} className={`drag-canvas__indicator ${isHovering ? "drag-canvas__indicator--visible" : ""}`} aria-hidden="true">
          <span>{isDragging ? "Moving" : "Pull the table"}</span>
        </div>
        <p className={`drag-canvas__touch-note ${hasDragged ? "drag-canvas__touch-note--quiet" : ""}`} aria-hidden="true">Swipe sideways to explore</p>
        <div ref={trackRef} className="drag-canvas__track">
          {items.map((item, index) => (
            <figure className={`drag-canvas__card drag-canvas__card--${index + 1}`} key={item.src}>
              <img src={item.src} alt={item.alt} draggable={false} loading="lazy" />
              <figcaption><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.label}</strong><em>{item.note}</em></figcaption>
            </figure>
          ))}
          <div className="drag-canvas__endnote" aria-hidden="true"><span>Made at Mall Road</span><i>See you at the table.</i></div>
        </div>
      </div>
      <p className="drag-canvas__keyboard-note section-pad">Drag to explore, or use the left and right arrow keys.</p>
    </section>
  );
}
