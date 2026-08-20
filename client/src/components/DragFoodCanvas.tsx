/**
 * Style reminder — Mall Road Monograph: an approved-reference drag-card menu set in deep maroon, with a quiet editorial copy column and a poised café dog mascot.
 * The stack is display-only; every card uses an owner-supplied food photograph and advances through direct drag, touch, keyboard, and small pagination controls.
 */
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

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
const DRAG_COMMIT_DISTANCE = 84;
const VELOCITY_COMMIT_THRESHOLD = 0.48;
const EXIT_DURATION = 280;

function DogMascot() {
  return (
    <svg className="drag-it-mascot" viewBox="0 0 196 184" fill="none" aria-hidden="true">
      <g className="dog-illustration" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path className="dog-steam dog-steam--one" d="M158 47c-6-6 5-10 0-17" />
        <path className="dog-steam dog-steam--two" d="M170 47c5-6-4-11 1-18" />
        <ellipse cx="162" cy="63" rx="22" ry="5" />
        <path d="M162 68v58M143 128h38" />
        <path d="M154 74h15l2 15h-19l2-15Z" />
        <path d="M169 78h6c4 0 4 8 0 8h-4" />
        <path d="M150 91h25" />

        <path className="dog-body" d="M48 164c-3-23 2-39 15-49 10-8 18-15 19-31 1-16-2-36 12-46 10-8 27-7 36 1 8 7 10 18 5 27-4 7-11 9-17 9-9 0-17-4-22-10" />
        <path className="dog-head" d="M94 40c7-9 25-11 35-3 8 6 9 18 4 25-6 8-17 11-28 7-9-3-14-11-11-29Z" />
        <path className="dog-ear" d="M102 42c-9-7-17 1-13 12 2 7 7 11 14 12" />
        <path d="M134 57c7 0 10 3 12 6l-10 4" />
        <circle cx="128" cy="53" r="1.8" fill="currentColor" stroke="none" />
        <circle cx="146" cy="64" r="1.8" fill="currentColor" stroke="none" />
        <path className="dog-beret" d="M97 38c7-12 25-16 38-7 2 2 4 5 5 8-14-3-29-2-43 4-1-2-1-3 0-5Z" fill="#16070d" stroke="#16070d" />
        <path className="dog-beret-stem" d="M116 29c-1-4 1-7 4-8" stroke="#16070d" />

        <path d="M78 110c12 7 27 10 40 6" />
        <path d="M86 108c2 16 5 28 10 37" />
        <path d="M113 112c-3 15-2 26 4 36" />
        <path className="dog-paw" d="M96 144c7 5 15 5 23 0M85 128c8 5 15 6 22 4" />
        <path d="M84 127c-4 3-5 8-1 10M108 130c3 3 3 8-1 10" />
        <path d="M46 164h78" />
        <path d="M51 164c-6 2-9 5-10 8M116 164c7 1 11 4 13 8" />
      </g>
    </svg>
  );
}

export function DragFoodCanvas({ items }: DragFoodCanvasProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const lastMoveRef = useRef({ x: 0, time: 0 });
  const dragOffsetRef = useRef(0);
  const velocityRef = useRef(0);
  const dragStartedRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);

  const visibleCards = Array.from({ length: Math.min(VISIBLE_CARDS, items.length) }, (_, index) => items[(activeIndex + index) % items.length]);
  const activeNumber = String(activeIndex + 1).padStart(2, "0");
  const totalNumber = String(items.length).padStart(2, "0");

  const finishAnimation = (direction: number) => {
    exitTimerRef.current = window.setTimeout(() => {
      setActiveIndex((current) => (current + direction + items.length) % items.length);
      dragOffsetRef.current = 0;
      velocityRef.current = 0;
      setDragOffset(0);
      setIsAnimating(false);
      exitTimerRef.current = null;
    }, EXIT_DURATION);
  };

  const swipeCard = (direction: number) => {
    if (isAnimating || exitTimerRef.current !== null) return;
    setIsDragging(false);
    setIsAnimating(true);
    const exitDistance = Math.max(520, window.innerWidth * 0.72);
    const exitOffset = direction === 1 ? -exitDistance : exitDistance;
    dragOffsetRef.current = exitOffset;
    setDragOffset(exitOffset);
    finishAnimation(direction);
  };

  const step = (direction: number) => {
    if (isAnimating || exitTimerRef.current !== null) return;
    swipeCard(direction);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isAnimating || (event.pointerType === "mouse" && event.button !== 0)) return;
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    lastMoveRef.current = { x: event.clientX, time: event.timeStamp };
    velocityRef.current = 0;
    dragStartedRef.current = false;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Some embedded touch contexts do not expose pointer capture; pointer movement remains handled by the stack itself.
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
    const nextOffset = Math.max(-300, Math.min(300, horizontalTravel));
    const elapsed = Math.max(1, event.timeStamp - lastMoveRef.current.time);
    velocityRef.current = (event.clientX - lastMoveRef.current.x) / elapsed;
    lastMoveRef.current = { x: event.clientX, time: event.timeStamp };
    dragOffsetRef.current = nextOffset;
    setDragOffset(nextOffset);
  };

  const endPointer = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!dragStartedRef.current) return;
    const offset = dragOffsetRef.current;
    const velocity = velocityRef.current;
    dragStartedRef.current = false;
    setIsDragging(false);
    if (cancelled) {
      dragOffsetRef.current = 0;
      setDragOffset(0);
      return;
    }
    if (Math.abs(offset) >= DRAG_COMMIT_DISTANCE || Math.abs(velocity) >= VELOCITY_COMMIT_THRESHOLD) {
      swipeCard(offset < 0 || (offset === 0 && velocity < 0) ? 1 : -1);
      return;
    }
    dragOffsetRef.current = 0;
    velocityRef.current = 0;
    setDragOffset(0);
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
                const translateY = isFront ? Math.abs(dragOffset) * 0.04 : stackIndex * 13;
                const rotation = isFront ? Math.max(-11, Math.min(11, dragOffset / 22)) : stackIndex * 1.3;
                return (
                  <figure
                    key={`${item.src}-${stackIndex}`}
                    className={`drag-it-card ${isFront ? "drag-it-card--front" : ""}`}
                    style={{ transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotation}deg) scale(${1 - stackIndex * 0.035})`, zIndex: visibleCards.length - stackIndex }}
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
