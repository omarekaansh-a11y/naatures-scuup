/**
 * Style reminder — Mall Road Monograph: approved-reference drag cards in deep maroon, with a petite line-art café dog and physically responsive, display-only food exploration.
 * The stack uses real restaurant photographs and supports pointer, touch, keyboard, plus compact pagination controls.
 */
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

type FoodCanvasItem = {
  src: string;
  tag: string;
  label: string;
  note: string;
  alt: string;
};

type DragFoodCanvasProps = {
  items: readonly FoodCanvasItem[];
};

const VISIBLE_CARDS = 4;
const DRAG_COMMIT_DISTANCE = 86;
const VELOCITY_COMMIT_THRESHOLD = 0.34;
const PROJECTION_TIME = 210;

function DogMascot() {
  return (
    <svg className="drag-it-mascot" viewBox="0 0 220 178" fill="none" aria-hidden="true" style={{ color: "#fffaf1" }}>
      <g className="dog-illustration" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.35">
        <path className="dog-steam dog-steam--one" d="M172 42c-8-8 5-13-1-22" />
        <path className="dog-steam dog-steam--two" d="M185 42c8-8-4-14 2-22" />
        <ellipse cx="177" cy="92" rx="31" ry="9" />
        <path d="M177 101v47M157 149h41" />
        <path d="M167 71h20l2 18h-24l2-18Z" />
        <path d="M189 76h10c10 0 10 13 0 13h-7" />
        <path d="M165 89h27" />

        <path className="chair-back" d="M34 129C22 109 21 80 35 65c14-16 38-10 47 8" />
        <path className="chair-back" d="M41 128c-8-15-5-37 6-48 8-9 19-8 27 2" />
        <path d="M31 137c18-8 49-8 75 1" />
        <path d="M33 137v29M84 137v29M24 166h71" />
        <path d="M38 137c6 10 6 18 4 29M78 138c-4 10-4 18-1 28M100 137l6 27" />

        <path className="dog-body" d="M79 72c-2 14 0 35 8 48 7 12 18 18 30 16 11-2 17-12 14-24-3-12-10-19-19-23" />
        <path className="dog-head" d="M72 50c7-12 28-14 41-4 8 6 12 14 18 14 10 0 18 1 24 7-6 8-17 13-30 14-11 2-23-2-32-10-8-7-15-13-21-21Z" />
        <path className="dog-ear" d="M78 52c-13-8-23 1-18 16 3 10 10 17 18 20" />
        <path d="M105 59q5 7 11 0" />
        <path d="M152 66c2 0 3 1 4 3" />
        <path className="dog-beret" d="M65 48c6-13 28-21 45-9 5 4 8 8 9 12-18-5-36-3-52 5-3-2-4-5-2-8Z" fill="currentColor" stroke="currentColor" />
        <path className="dog-beret-stem" d="M85 34c-1-5 2-9 7-10" />
        <path className="dog-front-leg" d="M91 100c-1 13 1 24 8 33M114 105c-1 11 1 19 7 27" />
        <path className="dog-paw" d="M94 132c7 4 14 4 20-1M118 130c7 4 12 4 17 0" />
        <path d="M86 110c-8 2-11 10-7 16M106 112c5 4 7 10 4 15" />
        <path d="M82 129c-9 4-17 3-23-1M83 134c-7 7-15 10-24 8" />
      </g>
    </svg>
  );
}

export function DragFoodCanvas({ items }: DragFoodCanvasProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [exitDuration, setExitDuration] = useState(280);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const lastMoveRef = useRef({ x: 0, time: 0 });
  const dragOffsetRef = useRef(0);
  const velocityRef = useRef(0);
  const dragStartedRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);
  const renderFrameRef = useRef<number | null>(null);

  const visibleCards = Array.from({ length: Math.min(VISIBLE_CARDS, items.length) }, (_, index) => items[(activeIndex + index) % items.length]);
  const activeNumber = String(activeIndex + 1).padStart(2, "0");
  const totalNumber = String(items.length).padStart(2, "0");

  useEffect(() => () => {
    if (exitTimerRef.current !== null) window.clearTimeout(exitTimerRef.current);
    if (renderFrameRef.current !== null) window.cancelAnimationFrame(renderFrameRef.current);
  }, []);

  const renderDragOffset = (nextOffset: number, immediately = false) => {
    dragOffsetRef.current = nextOffset;
    if (immediately) {
      if (renderFrameRef.current !== null) window.cancelAnimationFrame(renderFrameRef.current);
      renderFrameRef.current = null;
      setDragOffset(nextOffset);
      return;
    }
    if (renderFrameRef.current !== null) return;
    renderFrameRef.current = window.requestAnimationFrame(() => {
      setDragOffset(dragOffsetRef.current);
      renderFrameRef.current = null;
    });
  };

  const finishExit = (direction: number, duration: number) => {
    exitTimerRef.current = window.setTimeout(() => {
      setActiveIndex((current) => (current + direction + items.length) % items.length);
      velocityRef.current = 0;
      renderDragOffset(0, true);
      setIsAnimating(false);
      exitTimerRef.current = null;
    }, duration);
  };

  const swipeCard = (direction: number, velocity = 0) => {
    if (isAnimating || exitTimerRef.current !== null) return;
    const momentum = Math.min(Math.abs(velocity) * 155, 116);
    const duration = Math.round(Math.max(210, Math.min(335, 315 - Math.abs(velocity) * 120)));
    const exitDistance = Math.max(560, window.innerWidth * 0.74) + momentum;
    setIsDragging(false);
    setExitDuration(duration);
    setIsAnimating(true);
    renderDragOffset(direction === 1 ? -exitDistance : exitDistance, true);
    finishExit(direction, duration);
  };

  const step = (direction: number) => swipeCard(direction);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isAnimating || (event.pointerType === "mouse" && event.button !== 0)) return;
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    lastMoveRef.current = { x: event.clientX, time: event.timeStamp };
    velocityRef.current = 0;
    dragStartedRef.current = false;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // The interaction still works in embedded browser contexts that do not expose pointer capture.
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (isAnimating) return;
    const horizontalTravel = event.clientX - pointerStartRef.current.x;
    const verticalTravel = event.clientY - pointerStartRef.current.y;
    if (!dragStartedRef.current) {
      if (Math.abs(horizontalTravel) < 4 || Math.abs(horizontalTravel) <= Math.abs(verticalTravel)) return;
      dragStartedRef.current = true;
      setIsDragging(true);
    }
    event.preventDefault();
    const nextOffset = Math.max(-320, Math.min(320, horizontalTravel));
    const elapsed = Math.max(1, event.timeStamp - lastMoveRef.current.time);
    const instantaneousVelocity = (event.clientX - lastMoveRef.current.x) / elapsed;
    velocityRef.current = velocityRef.current * 0.62 + instantaneousVelocity * 0.38;
    lastMoveRef.current = { x: event.clientX, time: event.timeStamp };
    renderDragOffset(nextOffset);
  };

  const endPointer = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!dragStartedRef.current) return;
    const offset = dragOffsetRef.current;
    const velocity = velocityRef.current;
    dragStartedRef.current = false;
    setIsDragging(false);
    if (cancelled) {
      velocityRef.current = 0;
      renderDragOffset(0, true);
      return;
    }
    const projectedOffset = offset + velocity * PROJECTION_TIME;
    if (Math.abs(offset) >= DRAG_COMMIT_DISTANCE || Math.abs(projectedOffset) >= DRAG_COMMIT_DISTANCE || Math.abs(velocity) >= VELOCITY_COMMIT_THRESHOLD) {
      swipeCard(offset < 0 || (offset === 0 && velocity < 0) ? 1 : -1, velocity);
      return;
    }
    velocityRef.current = 0;
    renderDragOffset(0, true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
  };

  return (
    <section id="food-canvas" className="drag-it-section" aria-labelledby="drag-it-title">
      <div className="drag-it-layout section-pad">
        <div className="drag-it-copy">
          <DogMascot />
          <p className="drag-it-eyebrow">04 / The food edit</p>
          <h2 id="drag-it-title">Drag into<br /><i>the good bits.</i></h2>
          <p className="drag-it-body">A small stack of real table moments from Naatures Scuup. Pull a card aside to find the next craving.</p>
          <p className="drag-it-signature">#FREEZETHEHAPPINESS</p>
        </div>

        <div className="drag-it-playground">
          <p className="drag-it-hint"><ArrowLeft size={14} /> Drag me <ArrowRight size={14} /></p>
          <div className="drag-it-stack-shell">
            <div
              className={`drag-it-stack ${isDragging ? "drag-it-stack--dragging" : ""} ${isAnimating ? "drag-it-stack--animating" : ""}`}
              tabIndex={0}
              role="region"
              aria-label="A stack of Naatures Scuup food photographs. Drag left or right, or use the left and right arrow keys to reveal another food moment."
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endPointer}
              onPointerCancel={(event) => endPointer(event, true)}
              onKeyDown={handleKeyDown}
            >
              {visibleCards.slice().reverse().map((item, reverseIndex) => {
                const stackIndex = visibleCards.length - reverseIndex - 1;
                const isFront = stackIndex === 0;
                const translateX = isFront ? dragOffset : stackIndex * 13;
                const translateY = isFront ? Math.abs(dragOffset) * 0.035 : stackIndex * 13;
                const rotation = isFront ? Math.max(-13, Math.min(13, dragOffset / 20)) : stackIndex * 1.3;
                return (
                  <figure
                    key={`${item.src}-${stackIndex}`}
                    className={`drag-it-card ${isFront ? "drag-it-card--front" : ""}`}
                    style={{
                      transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotation}deg) scale(${1 - stackIndex * 0.035})`,
                      zIndex: visibleCards.length - stackIndex,
                      transitionDuration: isFront && isAnimating ? `${exitDuration}ms` : undefined,
                    }}
                  >
                    <img src={item.src} alt={isFront ? item.alt : ""} draggable={false} loading={isFront ? "eager" : "lazy"} />
                    <figcaption>
                      <span>{item.tag}</span>
                      <strong>{item.label}</strong>
                      <em>{item.note}</em>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
          <div className="drag-it-pagination" aria-label={`Showing item ${activeIndex + 1} of ${items.length}`}>
            <span>{activeNumber} <i>/</i> {totalNumber}</span>
            <div>
              <button type="button" aria-label="Show previous food moment" onClick={() => step(-1)}><ArrowLeft size={14} /></button>
              <button type="button" aria-label="Show next food moment" onClick={() => step(1)}><ArrowRight size={14} /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
