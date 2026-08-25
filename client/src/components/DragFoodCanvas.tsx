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
const DRAG_COMMIT_DISTANCE = 120;
const VELOCITY_COMMIT_THRESHOLD = 0.72;
const PROJECTION_TIME = 68;
const ZERO_VECTOR: DragVector = { x: 0, y: 0 };

function DogMascot() {
  return (
    <svg className="drag-it-mascot" viewBox="0 0 220 178" fill="none" aria-hidden="true" style={{ color: "#fffaf1" }}>
      <g className="dog-illustration" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.1">
        <path className="dog-steam dog-steam--one" d="M162 73c-8-8 5-13-1-22" />
        <path className="dog-steam dog-steam--two" d="M174 73c8-8-4-14 2-22" />
        <ellipse cx="169" cy="107" rx="36" ry="10" />
        <path d="M169 117v38M148 155h43" />
        <path d="M154 85c0 10 4 16 13 16s13-6 13-16Z" />
        <path d="M180 89h8c8 0 8 12 0 12h-6" />
        <path d="M153 101h30" />

        <path className="chair-back" d="M40 138C29 116 33 96 47 85c10-8 19-4 26 6" />
        <path d="M28 146c24-10 68-10 101 1" />
        <path d="M32 146v26M105 146v26M23 172h94" />

        <g className="dog-pose">
          <path className="dog-tail" d="M94 132c-14-2-23-12-22-25 1-10 7-16 13-15 8 2 9 12 6 22-3 8-8 14-13 18-3 4-1 8 5 10" />
          <path className="dog-body" d="M92 76c-5 22-1 47 7 60 7 12 18 14 27 7 7-6 7-18 1-28-5-8-12-15-15-27-4-10-3-22 1-33" />
          <path className="dog-front-leg" d="M100 112c-1 14 0 23 6 30M118 120c-1 10 0 16 6 22" />
          <path className="dog-paw" d="M102 142c5 2 9 2 13-1M123 142c4 2 8 2 11-1" />
          <g className="dog-head-group">
            <path className="dog-head" d="M84 48c8-9 23-10 35-4 8 5 14 10 22 11 10 1 17 4 21 9-6 6-16 9-28 9-12 0-23-4-32-10" />
            <path className="dog-ear" d="M84 50c-11-4-18 4-15 16 3 10 9 16 17 19" />
            <path className="dog-eye" d="M108 52q5 4 10 0" />
            <path className="dog-smile" d="M149 62q4 3 8 0" />
            <path className="dog-beret" d="M67 40c6-13 28-21 46-9 5 4 8 8 9 12-18-5-37-3-53 5-3-2-4-5-2-8Z" fill="currentColor" stroke="currentColor" />
            <path className="dog-beret-stem" d="M86 26c-1-5 2-9 7-10" />
          </g>
        </g>
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
  const [dogReacting, setDogReacting] = useState(false);
  const [dogHappy, setDogHappy] = useState(false);
  const [exitDuration, setExitDuration] = useState(280);
  const [loadedSources, setLoadedSources] = useState<Set<string>>(() => new Set());
  const pointerStartRef = useRef<DragVector>(ZERO_VECTOR);
  const lastMoveRef = useRef({ x: 0, y: 0, time: 0 });
  const dragVectorRef = useRef<DragVector>(ZERO_VECTOR);
  const velocityRef = useRef<DragVector>(ZERO_VECTOR);
  const dragStartedRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);
  const arrivalTimerRef = useRef<number | null>(null);
  const dogTimerRef = useRef<number | null>(null);
  const happyDogTimerRef = useRef<number | null>(null);
  const renderFrameRef = useRef<number | null>(null);

  const visibleCards = Array.from({ length: Math.min(VISIBLE_CARDS, items.length) }, (_, index) => items[(activeIndex + index) % items.length]);
  const activeNumber = String(activeIndex + 1).padStart(2, "0");
  const totalNumber = String(items.length).padStart(2, "0");

  useEffect(() => () => {
    if (exitTimerRef.current !== null) window.clearTimeout(exitTimerRef.current);
    if (arrivalTimerRef.current !== null) window.clearTimeout(arrivalTimerRef.current);
    if (dogTimerRef.current !== null) window.clearTimeout(dogTimerRef.current);
    if (happyDogTimerRef.current !== null) window.clearTimeout(happyDogTimerRef.current);
    if (renderFrameRef.current !== null) window.cancelAnimationFrame(renderFrameRef.current);
  }, []);

  const greetDog = () => {
    setDogReacting(false);
    window.requestAnimationFrame(() => setDogReacting(true));
    if (dogTimerRef.current !== null) window.clearTimeout(dogTimerRef.current);
    dogTimerRef.current = window.setTimeout(() => {
      setDogReacting(false);
      dogTimerRef.current = null;
    }, 1420);
  };

  const celebrateSwipe = () => {
    if (happyDogTimerRef.current !== null) window.clearTimeout(happyDogTimerRef.current);
    setDogHappy(false);
    window.requestAnimationFrame(() => setDogHappy(true));
    happyDogTimerRef.current = window.setTimeout(() => {
      setDogHappy(false);
      happyDogTimerRef.current = null;
    }, 940);
  };

  useEffect(() => {
    let isCancelled = false;
    const sourceSet = new Set<string>();
    const preload = (src: string) => new Promise<void>((resolve) => {
      const image = new Image();
      const markReady = () => {
        sourceSet.add(src);
        resolve();
      };
      image.onload = markReady;
      image.onerror = markReady;
      image.src = src;
      if (image.complete) markReady();
    });

    Promise.all(items.map((item) => preload(item.src))).then(() => {
      if (!isCancelled) setLoadedSources(sourceSet);
    });

    return () => { isCancelled = true; };
  }, [items]);

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

  const swipeCard = (
    direction: number,
    velocity: DragVector = ZERO_VECTOR,
    currentVector: DragVector = dragVectorRef.current,
    shouldCelebrate = false,
  ) => {
    if (isAnimating || exitTimerRef.current !== null) return;
    const horizontalDominant = Math.abs(currentVector.x + velocity.x * PROJECTION_TIME) >= Math.abs(currentVector.y + velocity.y * PROJECTION_TIME);
    const speed = Math.hypot(velocity.x, velocity.y);
    const momentum = Math.min(speed * 18, 28);
    const duration = Math.round(Math.max(520, Math.min(700, 680 - speed * 52)));
    const exitDistance = Math.max(470, window.innerWidth * 0.7) + momentum;
    const exitY = horizontalDominant
      ? Math.max(-window.innerHeight * 0.25, Math.min(window.innerHeight * 0.25, currentVector.y + velocity.y * 68))
      : direction === 1 ? -exitDistance * 0.72 : exitDistance * 0.72;
    const exitX = horizontalDominant
      ? direction === 1 ? -exitDistance : exitDistance
      : Math.max(-exitDistance * 0.24, Math.min(exitDistance * 0.24, currentVector.x + velocity.x * 68));
    setIsDragging(false);
    setIsArriving(false);
    setExitDuration(duration);
    setIsAnimating(true);
    renderDragVector({ x: exitX, y: exitY }, true);
    if (shouldCelebrate) celebrateSwipe();
    finishExit(direction, duration);
  };

  const step = (direction: number) => swipeCard(direction);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isAnimating || (event.pointerType === "mouse" && event.button !== 0)) return;
    activePointerIdRef.current = event.pointerId;
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
    if (isAnimating || activePointerIdRef.current !== event.pointerId) return;
    if (event.pointerType === "mouse" && (event.buttons & 1) === 0) {
      activePointerIdRef.current = null;
      dragStartedRef.current = false;
      setIsDragging(false);
      renderDragVector(ZERO_VECTOR);
      return;
    }
    const horizontalTravel = event.clientX - pointerStartRef.current.x;
    const verticalTravel = event.clientY - pointerStartRef.current.y;
    if (!dragStartedRef.current) {
      if (Math.hypot(horizontalTravel, verticalTravel) < 5) return;
      dragStartedRef.current = true;
      setIsDragging(true);
    }
    event.preventDefault();
    const nextVector = {
      x: Math.max(-335, Math.min(335, horizontalTravel)),
      y: Math.max(-250, Math.min(250, verticalTravel)),
    };
    const elapsed = Math.max(1, event.timeStamp - lastMoveRef.current.time);
    const instantaneousVelocity = {
      x: (event.clientX - lastMoveRef.current.x) / elapsed,
      y: (event.clientY - lastMoveRef.current.y) / elapsed,
    };
    velocityRef.current = {
      x: velocityRef.current.x * 0.72 + instantaneousVelocity.x * 0.28,
      y: velocityRef.current.y * 0.72 + instantaneousVelocity.y * 0.28,
    };
    lastMoveRef.current = { x: event.clientX, y: event.clientY, time: event.timeStamp };
    renderDragVector(nextVector);
  };

  const endPointer = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    if (activePointerIdRef.current !== event.pointerId) return;
    activePointerIdRef.current = null;
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
      renderDragVector(ZERO_VECTOR);
      return;
    }
    const projectedDistance = Math.hypot(projectedVector.x, projectedVector.y);
    const speed = Math.hypot(velocity.x, velocity.y);
    if (Math.hypot(vector.x, vector.y) >= DRAG_COMMIT_DISTANCE || projectedDistance >= DRAG_COMMIT_DISTANCE || speed >= VELOCITY_COMMIT_THRESHOLD) {
      const horizontalDominant = Math.abs(projectedVector.x) >= Math.abs(projectedVector.y);
      const direction = horizontalDominant
        ? (projectedVector.x < 0 || (projectedVector.x === 0 && velocity.x < 0) ? 1 : -1)
        : (projectedVector.y < 0 || (projectedVector.y === 0 && velocity.y < 0) ? 1 : -1);
      swipeCard(direction, velocity, vector, true);
      return;
    }
    velocityRef.current = ZERO_VECTOR;
    renderDragVector(ZERO_VECTOR);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); step(1); }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); step(-1); }
  };

  return (
    <section id="food-canvas" className="drag-it-section" aria-labelledby="drag-it-title">
      <div className="drag-it-layout section-pad">
        <div className="drag-it-copy">
          <div className="drag-it-mascot-wrap">
            <button
              type="button"
              className={`drag-it-mascot-button ${dogReacting ? "drag-it-mascot-button--reacting" : ""} ${dogHappy ? "drag-it-mascot-button--happy" : ""}`}
              onClick={greetDog}
              aria-label="Greet the Naatures Scuup café dog"
            >
              <DogMascot />
            </button>
          </div>
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
              aria-busy={loadedSources.size < items.length}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endPointer}
              onPointerCancel={(event) => endPointer(event, true)}
              onLostPointerCapture={(event) => endPointer(event, true)}
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
                    <img src={item.src} alt={isFront ? item.alt : ""} draggable={false} loading="eager" decoding="sync" />
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
