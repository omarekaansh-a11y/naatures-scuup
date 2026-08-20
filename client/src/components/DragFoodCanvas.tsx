/**
 * Style reminder — Mall Road Monograph: an original direct-drag food tableau.
 * It uses the owner's photographs and #FREEZETHEHAPPINESS without borrowing another site's composition or controls.
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
  const cursorRef = useRef<HTMLDivElement>(null);
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
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${nextPosition}px, 0, 0)`;
  };

  const setPosition = (nextPosition: number, withResistance = false) => {
    const minX = getMinX();
    let resolved = nextPosition;
    if (withResistance && nextPosition > 0) resolved = nextPosition * 0.24;
    if (withResistance && nextPosition < minX) resolved = minX + (nextPosition - minX) * 0.24;
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
      velocityRef.current *= 0.9;
      if (Math.abs(velocityRef.current) < 0.014) {
        renderPosition(clamp(positionRef.current, getMinX(), 0));
        momentumFrameRef.current = null;
        return;
      }
      const minX = getMinX();
      const nextPosition = positionRef.current + velocityRef.current * 16;
      if (nextPosition > 0 || nextPosition < minX) velocityRef.current *= 0.42;
      renderPosition(clamp(nextPosition, minX, 0));
      momentumFrameRef.current = window.requestAnimationFrame(tick);
    };
    momentumFrameRef.current = window.requestAnimationFrame(tick);
  };

  const positionCursor = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || !viewportRef.current || !cursorRef.current) return;
    const bounds = viewportRef.current.getBoundingClientRect();
    cursorRef.current.style.transform = `translate3d(${event.clientX - bounds.left}px, ${event.clientY - bounds.top}px, 0)`;
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
    startPointerRef.current = { x: event.clientX, y: event.clientY };
    lastPointerRef.current = { x: event.clientX, y: event.clientY, time: performance.now() };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    positionCursor(event);
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
    if (event.key === "ArrowRight") {
      event.preventDefault();
      cancelMomentum();
      setPosition(positionRef.current - 220);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      cancelMomentum();
      setPosition(positionRef.current + 220);
    }
    if (event.key === "Home") {
      event.preventDefault();
      cancelMomentum();
      renderPosition(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      cancelMomentum();
      renderPosition(getMinX());
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
    <section id="food-canvas" className="tactile-table-section" aria-labelledby="tactile-table-title">
      <div className="tactile-table-intro section-pad">
        <div className="tactile-table-index"><span>04 / Freeze frame</span><small>Seven moments<br />from Mall Road</small></div>
        <div>
          <p className="eyebrow eyebrow--light">A table you can move through</p>
          <h2 id="tactile-table-title">Hold the<br /><i>happy bits.</i></h2>
          <p>Pull sideways to move across real moments from the Naatures Scuup counter. Take your time—every plate is part of the table.</p>
        </div>
      </div>

      <div
        ref={viewportRef}
        className={`tactile-table ${isDragging ? "tactile-table--dragging" : ""}`}
        tabIndex={0}
        role="region"
        aria-label="A draggable tableau of Naatures Scuup food photographs. Drag left or right, or use the arrow keys to explore."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={() => setIsHovering(true)}
        onPointerLeave={() => !draggingRef.current && setIsHovering(false)}
        onKeyDown={handleKeyDown}
      >
        <div ref={cursorRef} className={`tactile-table__cursor ${isHovering ? "tactile-table__cursor--visible" : ""}`} aria-hidden="true"><span>{isDragging ? "Keep moving" : "Hold + pull"}</span></div>
        <div className={`tactile-table__touch-note ${hasDragged ? "tactile-table__touch-note--quiet" : ""}`} aria-hidden="true"><span>Hold and pull</span><b>#FREEZETHEHAPPINESS</b></div>
        <div ref={trackRef} className="tactile-table__track">
          <div className="tactile-table__opening" aria-hidden="true"><span>Real food<br />real table</span><i>Make a little room.</i></div>
          {items.map((item, index) => (
            <figure className={`tactile-table__card tactile-table__card--${index + 1}`} key={item.src}>
              <div className="tactile-table__frame"><img src={item.src} alt={item.alt} draggable={false} loading="lazy" /></div>
              <figcaption><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.label}</strong><em>{item.note}</em></figcaption>
            </figure>
          ))}
          <div className="tactile-table__endnote" aria-hidden="true"><span>#FREEZETHEHAPPINESS</span><i>See you<br />at the table.</i><small>Mall Road, Kanpur</small></div>
        </div>
      </div>
      <p className="tactile-table__keyboard-note section-pad">Hold and pull to explore. Or use the left and right arrow keys.</p>
    </section>
  );
}
