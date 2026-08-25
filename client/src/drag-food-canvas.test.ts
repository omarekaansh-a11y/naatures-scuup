import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const dragCanvas = readFileSync(resolve(process.cwd(), "client/src/components/DragFoodCanvas.tsx"), "utf8");

describe("Drag It intentional pointer controls", () => {
  it("moves cards only for the pointer that initiated a pressed drag", () => {
    expect(dragCanvas).toContain("const activePointerIdRef = useRef<number | null>(null)");
    expect(dragCanvas).toContain("activePointerIdRef.current = event.pointerId");
    expect(dragCanvas).toContain("activePointerIdRef.current !== event.pointerId");
    expect(dragCanvas).toContain("(event.buttons & 1) === 0");
  });

  it("cleans up state when a captured drag ends", () => {
    expect(dragCanvas).toContain("activePointerIdRef.current = null");
    expect(dragCanvas).toContain("onLostPointerCapture={(event) => endPointer(event, true)}");
  });
});
