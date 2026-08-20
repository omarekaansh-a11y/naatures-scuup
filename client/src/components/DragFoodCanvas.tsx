/**
 * Style reminder — Mall Road Monograph: approved-reference food cards in deep maroon, with a hand-drawn café dog and tactile, display-only exploration.
 * The stack uses owner restaurant imagery and supports pointer, touch, keyboard, natural momentum, and compact pagination controls.
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

type DragVector = { x: number; y: number };

const VISIBLE_CARDS = 4;
const DRAG_COMMIT_DISTANCE = 88;
const VELOCITY_COMMIT_THRESHOLD = 0.34;
const PROJECTION_TIME = 210;
const ZERO_VECTOR: DragVector = { x: 0, y: 0 };

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
        <path className="dog-eye" d="M105 59q5 7 11 0" />
        <path className="dog-smile" d="M143 69q5 4 10 0" />
        <path className="dog-beret" d="M65 48c6-13 28-21 45-9 5 4 8 8 9 12-18-5-36-3-52 5-3-2-4-5-2-8Z" fill="currentColor" stroke="currentColor" />
        <path className="dog-beret-stem" d="M85 34c-1-5 2-9 7-10" />
        <path className="dog-front-leg" d="M91 100c-1 13 1 24 8 33M114 105c-1 11 1 19 7 27" />
        <path className="dog-paw" d="M94 132c7 4 14 4 20-1M118 130c7 4 12 4 17 0" />
        <path d="M86 110c-8 2-11 10-7 16M106 112c5 4 7 10 4 15" />
        <path className="dog-tail" d="M82 129c-9 4-17 3-23-1M83 134c-7 7-15 10-24 8" />
      </g>
    </svg>
  );
}

export function DragFoodCanvas({ items }: DragFoodCanvasProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragVector, setDragVector] = useState<DragVector>(ZERO_VECTOR);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isArriving, setIsArriving] = useState(false);
  const [exitDuration, setExitDuration] = useState(280);
  const pointerStartRef = useRef<DragVector>(ZERO_VECTOR);
  const lastMoveRef = useRef({ x: 0, y: 0, time: 0 });
  const dragVectorRef = useRef<DragVector>(ZERO_VECTOR);
  const velocityRef = useRef<DragVector>(ZERO_VECTOR);
  const dragStartedRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);
  const arrivalTimerRef = useRef<number | null>(null);
  const renderFrameRef = useRef<number | null>(null);

  const visibleCards = Array.from({ length: Math.min(VISIBLE_CARDS, items.length) }, (_, index) => items[(activeIndex + index) % items.length]);
  const activeNumber = String(activeIndex + 1).padStart(2, "0");
  const totalNumber = String(items.length).padStart(2, "0");

  useEffect(() => () => {
    if (exitTimerRef.current !== null) window.clearTimeout(exitTimerRef.current);
    if (arrivalTimerRef.current !== null) window.clearTimeout(arrivalTimerRef.current);
    if (renderFrameRef.current !== null) window.cancelAnimationFrame(renderFrameRef.current);
  }, []);

  const renderDragVector = (nextVector: DragVector, immediately = false) => {
    dragVectorRef.current = nextVector;
    if (immediately) {
      if (renderFrameRef.current !== null) window.cancelAnimationFrame(renderFrameRef.current);
      renderFrameRef.current = null;
      setDragVector(nextVector);
      return;
    }
    if (renderFrameRef.current !== null) return;
    renderFrameRef.current = window.requestAnimationFrame(() => {
      setDragVector(dragVectorRef.current);
      renderFrameRef.current = null;
    });
  };

  const completeArrival = () => {
    if (arrivalTimerRef.current !== null) window.clearTimeout(arrivalTimerRef.current);
    arrivalTimerRef.current = window.setTimeout(() => {
      setIsArriving(false);
      arrivalTimerRef.current = null;
    }, 660);
  };

  const finishExit = (direction: number, duration: number) => {
    exitTimerRef.current = window.setTimeout(() => {
      setActiveIndex((current) => (current + direction + items.length) % items.length);
      velocityRef.current = ZERO_VECTOR;
      renderDragVector(ZERO_VECTOR, true);
      setIsAnimating(false);
      setIsArriving(true);
      completeArrival();
      exitTimerRef.current = null;
    }, duration);
  };

  const swipeCard = (direction: number, velocity: DragVector = ZERO_VECTOR, currentVector: DragVector = dragVectorRef.current) => {
    if (isAnimating || exitTimerRef.current !== null) return;
    const horizontalDominant = Math.abs(currentVector.x + velocity.x * PROJECTION_TIME) >= Math.abs(currentVector.y + velocity.y * PROJECTION_TIME);
    const momentum = Math.min(Math.hypot(velocity.x, velocity.y) * 150, 136);
    const duration = Math.round(Math.max(270, Math.min(430, 390 - Math.hypot(velocity.x, velocity.y) * 135)));
    const exitDistance = Math.max(560, window.innerWidth * 0.78) + momentum;
    const exitY = horizontalDominant
      ? Math.max(-window.innerHeight * 0.36, Math.min(window.innerHeight * 0.36, currentVector.y + velocity.y * 150))
      : direction === 1 ? -exitDistance * 0.72 : exitDistance * 0.72;
    const exitX = horizontalDominant
      ? direction === 1 ? -exitDistance : exitDistance
      : Math.max(-exitDistance * 0.38, Math.min(exitDistance * 0.38, currentVector.x + velocity.x * 150));
    setIsDragging(false);
    setIsArriving(false);
    setExitDuration(duration);
    setIsAnimating(true);
    renderDragVector({ x: exitX, y: exitY }, true);
    finishExit(direction, duration);
  };

  const step = (direction: number) => swipeCard(direction);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isAnimating || (event.pointerType === "mouse" && event.button !== 0)) return;
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    lastMoveRef.current = { x: event.clientX, y: event.clientY, time: event.timeStamp };
    velocityRef.current = ZERO_VECTOR;
    dragStartedRef.current = false;
    setIsArriving(false);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Embedded browser contexts without pointer capture still receive pointer events on the target.
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (isAnimating) return;
    const horizontalTravel = event.clientX - pointerStartRef.current.x;
    const verticalTravel = event.clientY - pointerStartRef.current.y;
    if (!dragStartedRef.current) {
      if (Math.hypot(horizontalTravel, verticalTravel) < 4) return;
      dragStartedRef.current = true;
      setIsDragging(true);
    }
    event.preventDefault();
    const nextVector = {
      x: Math.max(-360, Math.min(360, horizontalTravel)),
      y: Math.max(-270, Math.min(270, verticalTravel)),
    };
    const elapsed = Math.max(1, event.timeStamp - lastMoveRef.current.time);
    const instantaneousVelocity = {
      x: (event.clientX - lastMoveRef.current.x) / elapsed,
      y: (event.clientY - lastMoveRef.current.y) / elapsed,
    };
    velocityRef.current = {
      x: velocityRef.current.x * 0.58 + instantaneousVelocity.x * 0.42,
      y: velocityRef.current.y * 0.58 + instantaneousVelocity.y * 0.42,
    };
    lastMoveRef.current = { x: event.clientX, y: event.clientY, time: event.timeStamp };
    renderDragVector(nextVector);
  };

  const endPointer = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Release may be unavailable when a browser did not grant capture.
    }
    if (!dragStartedRef.current) return;
    const vector = dragVectorRef.current;
    const velocity = velocityRef.current;
    const projectedVector = { x: vector.x + velocity.x * PROJECTION_TIME, y: vector.y + velocity.y * PROJECTION_TIME };
    dragStartedRef.current = false;
    setIsDragging(false);
    if (cancelled) {
      velocityRef.current = ZERO_VECTOR;
      renderDragVector(ZERO_VECTOR, true);
      return;
    }
    const projectedDistance = Math.hypot(projectedVector.x, projectedVector.y);
    const speed = Math.hypot(velocity.x, velocity.y);
    if (Math.hypot(vector.x, vector.y) >= DRAG_COMMIT_DISTANCE || projectedDistance >= DRAG_COMMIT_DISTANCE || speed >= VELOCITY_COMMIT_THRESHOLD) {
      const horizontalDominant = Math.abs(projectedVector.x) >= Math.abs(projectedVector.y);
      const direction = horizontalDominant
        ? (projectedVector.x < 0 || (projectedVector.x === 0 && velocity.x < 0) ? 1 : -1)
        : (projectedVector.y < 0 || (projectedVector.y === 0 && velocity.y < 0) ? 1 : -1);
      swipeCard(direction, velocity, vector);
      return;
    }
    velocityRef.current = ZERO_VECTOR;
    renderDragVector(ZERO_VECTOR, true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); step(1); }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); step(-1); }
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
              className={`drag-it-stack ${isDragging ? "drag-it-stack--dragging" : ""} ${isAnimating ? "drag-it-stack--animating" : ""} ${isArriving ? "drag-it-stack--arriving" : ""}`}
              tabIndex={0}
              role="region"
              aria-label="A stack of Naatures Scuup food photographs. Drag in any direction, or use the arrow keys to reveal another food moment."
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endPointer}
              onPointerCancel={(event) => endPointer(event, true)}
              onKeyDown={handleKeyDown}
            >
              {visibleCards.slice().reverse().map((item, reverseIndex) => {
                const stackIndex = visibleCards.length - reverseIndex - 1;
                const isFront = stackIndex === 0;
                const translateX = isFront ? dragVector.x : stackIndex * 13;
                const translateY = isFront ? dragVector.y : stackIndex * 13;
                const rotation = isFront
                  ? Math.max(-16, Math.min(16, dragVector.x / 18 + dragVector.y / 92))
                  : stackIndex * 1.3;
                return (
                  <figure
                    key={item.src}
                    className={`drag-it-card ${isFront ? "drag-it-card--front" : ""} ${isFront && isArriving ? "drag-it-card--arriving" : ""}`}
                    style={{
                      transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotation}deg) scale(${1 - stackIndex * 0.035})`,
                      zIndex: visibleCards.length - stackIndex,
                      opacity: isFront && isAnimating ? 0.88 : 1,
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
