import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const home = readFileSync(resolve(root, "client/src/pages/Home.tsx"), "utf8");
const printStyles = readFileSync(resolve(root, "client/src/tactile-print.css"), "utf8");

describe("layered cinematic handoff", () => {
  it("places all homepage content after the cinematic sequence on a dedicated upper plane", () => {
    expect(home).toContain('<div className="home-after-orbit" data-layered-handoff>');
    expect(home.indexOf('home-after-orbit')).toBeGreaterThan(home.indexOf("<IceCreamOrbit />"));
    expect(home).toContain("</div>\n      </main>");
  });

  it("keeps the incoming plane above the pinned sequence without applying effects to the video", () => {
    expect(printStyles).toContain("homepage content plane enters above the pinned dessert sequence");
    expect(printStyles).toContain(".ice-orbit{z-index:0}.home-after-orbit{position:relative;z-index:12");
    expect(printStyles).not.toContain(".ice-orbit__video{filter:");
  });
});
