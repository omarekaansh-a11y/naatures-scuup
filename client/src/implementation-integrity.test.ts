import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");
const home = read("client/src/pages/Home.tsx");
const menu = read("client/src/pages/MenuPage.tsx");
const drag = read("client/src/components/DragFoodCanvas.tsx");
const header = read("client/src/components/SiteHeader.tsx");
const app = read("client/src/App.tsx");
const styles = read("client/src/seamless-conveyor.css");
const structuralStyles = read("client/src/components/StructuralStyles.tsx");

describe("implementation integrity", () => {
  it("keeps the Home food stack on distinct owner-supplied image references", () => {
    const references = [...home.matchAll(/src: authenticImages\.([A-Za-z0-9_]+)/g)].map((match) => match[1]);
    expect(references).toHaveLength(7);
    expect(new Set(references).size).toBe(references.length);
  });

  it("supports the Home ice-cream destination and Full Menu hash anchor", () => {
    expect(home).toContain('href="/menu#ice-creams"');
    expect(menu).toContain('window.location.hash !== "#ice-creams"');
    expect(menu).toContain('id={activeGroup === "ice-creams" ? "ice-creams" : undefined}');
  });

  it("preserves direct drag, keyboard, touch, and accessible image behavior", () => {
    expect(drag).toContain("onPointerDown={handlePointerDown}");
    expect(drag).toContain("onPointerMove={handlePointerMove}");
    expect(drag).toContain("onKeyDown={handleKeyDown}");
    expect(drag).toContain('tabIndex={0}');
    expect(drag).toContain('draggable={false}');
    expect(drag).toContain('aria-label="A stack of Naatures Scuup food photographs');
    expect(styles).toContain(".drag-it-card");
  });

  it("keeps the slogan stacked beneath the shared wordmark and the italic title contrasted", () => {
    expect(header).toContain('<span className="brand-text"><strong>Naatures Scuup</strong><small>#FREEZETHEHAPPINESS</small></span>');
    expect(styles).toContain(".brand-text small");
    expect(styles).toContain(".drag-it-copy h2 i { color: var(--mango); font-weight: 500; }");
  });

  it("keeps route scroll reset and animated drawer transitions wired", () => {
    expect(app).toContain("window.scrollTo({ top: 0, behavior: \"auto\" });");
    expect(app).toContain("<SiteHeader");
    expect(structuralStyles).toContain("siteDrawerReveal");
    expect(structuralStyles).toContain("siteDrawerRetract");
  });
});

export {};
