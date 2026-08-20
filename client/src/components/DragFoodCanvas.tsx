/**
 * Style reminder — Mall Road Monograph: an approved-reference drag-card menu set in deep maroon, with a quiet editorial copy column and a playful hand-drawn mascot.
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
const DRAG_COMMIT_DISTANCE = 96;

function DogMascot() {
  return (
    <svg className="drag-it-mascot" viewBox="0 0 180 156" fill="none" aria-hidden="true">
      <g className="dog-illustration" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2">
        <path className="dog-steam dog-steam--one" d="M125 33c-8-7 5-12-2-20" />
        <path className="dog-steam dog-steam--two" d="M139 36c8-8-4-13 3-21" />
        <path d="M109 69h42l6 46H103l6-46Z" />
        <path d="M103 115h54" />
        <path d="M112 115v17M148 115v17M105 132h53" />
        <path d="M112 83h36" />
        <path d="M116 76c3-12 26-12 30 0" />
        <path className="dog-head" d="M38 48c-13 10-13 40 2 52 7 6 21 8 33 5 13-4 21-18 18-33-3-14-13-25-27-27-10-2-19 0-26 3Z" />
        <path className="dog-ear" d="M45 53c-13-13-27-3-22 12 3 10 10 14 18 14" />
        <path className="dog-ear" d="M77 54c11-11 24-2 18 12-3 8-9 13-16 13" />
        <path d="M53 76h1M72 76h1" />
        <path d="M60 85c3 3 7 3 10 0" />
        <path d="M58 81c3-3 10-3 13 0" />
        <path className="dog-beret" d="M39 48c8-14 32-18 45-5-12-2-29 0-45 5ZM59 37c1-6 6-8 10-4" />
        <path d="M45 104c-5 8-9 16-11 28M77 104c5 8 10 16 11 28M33 132h58" />
        <path d="M50 107c10 4 19 4 28 0" />
        <path d="M91 81c9 4 13 9 17 17M40 91c-10 2-15 8-19 16" />
      </g>
    </svg>
  );
}

export function DragFoodCanvas({ items }: DragFoodCanvasProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef(0);
  const dragStartedRef = useRef(false);

  const visibleCards = Array.from({ length: Math.min(VISIBLE_CARDS, items.length) }, (_, index) => items[(activeIndex + index) % items.length]);
  const activeNumber = String(activeIndex + 1).padStart(2, "0");
  const totalNumber = String(items.length).padStart(2, "0");

  const step = (direction: number) => {
    dragOffsetRef.current = 0;
    setDragOffset(0);
    setActiveIndex((current) => (current + direction + items.length) % items.length);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    dragStartedRef.current = false;
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const horizontalTravel = event.clientX - pointerStartRef.current.x;
    const verticalTravel = event.clientY - pointerStartRef.current.y;
    if (!dragStartedRef.current) {
      if (Math.abs(horizontalTravel) < 7 || Math.abs(horizontalTravel) <= Math.abs(verticalTravel)) return;
      dragStartedRef.current = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    const nextOffset = Math.max(-220, Math.min(220, horizontalTravel));
    dragOffsetRef.current = nextOffset;
    setDragOffset(nextOffset);
  };

  const finishDrag = () => {
    if (!dragStartedRef.current) return;
    if (Math.abs(dragOffsetRef.current) >= DRAG_COMMIT_DISTANCE) step(dragOffsetRef.current < 0 ? 1 : -1);
    dragOffsetRef.current = 0;
    setDragOffset(0);
    setIsDragging(false);
    dragStartedRef.current = false;
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
              className={`drag-it-stack ${isDragging ? "drag-it-stack--dragging" : ""}`}
              tabIndex={0}
              role="region"
              aria-label="A stack of Naatures Scuup food photographs. Drag left or right, or use the left and right arrow keys to reveal another food moment."
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={finishDrag}
              onPointerCancel={finishDrag}
              onKeyDown={handleKeyDown}
            >
              {visibleCards.slice().reverse().map((item, reverseIndex) => {
                const stackIndex = visibleCards.length - reverseIndex - 1;
                const isFront = stackIndex === 0;
                const translateX = isFront ? dragOffset : stackIndex * 13;
                const translateY = isFront ? Math.abs(dragOffset) * 0.055 : stackIndex * 13;
                const rotation = isFront ? dragOffset / 18 : stackIndex * 1.3;
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
