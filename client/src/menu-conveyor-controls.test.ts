import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const menu = readFileSync(resolve(process.cwd(), "client/src/pages/MenuPage.tsx"), "utf8");
const chapterStyles = readFileSync(resolve(process.cwd(), "client/src/menu-chapter-visuals.css"), "utf8");

describe("menu chapter conveyor controls", () => {
  it("keeps chapter imagery static and adds keyboard-accessible arrow navigation plus pointer grab scrolling", () => {
    expect(chapterStyles).toContain("transition:none!important");
    expect(chapterStyles).toContain("transform:none!important");
    expect(menu).toContain('aria-label="Show previous menu chapters"');
    expect(menu).toContain('aria-label="Show next menu chapters"');
    expect(menu).toContain("onPointerDown={startConveyorDrag}");
    expect(menu).toContain("onPointerMove={moveConveyorDrag}");
    expect(menu).toContain("scrollBy({ left: direction");
  });
});
