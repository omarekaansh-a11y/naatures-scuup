import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForFunction(() => document.querySelector(".ice-orbit__story-card--origin") instanceof HTMLElement);

const card = page.locator(".ice-orbit__story-card--origin");
const before = await card.evaluate((element) => {
  const plane = getComputedStyle(element, "::before");
  return { opacity: Number.parseFloat(plane.opacity), clipPath: plane.clipPath };
});
await card.hover();
const bounds = await card.boundingBox();
if (!bounds) throw new Error("Active story card has no bounding box.");
await page.mouse.move(bounds.x + bounds.width * 0.28, bounds.y + bounds.height * 0.38);
await page.waitForTimeout(90);
await page.mouse.move(bounds.x + bounds.width * 0.7, bounds.y + bounds.height * 0.62);
await page.waitForTimeout(110);
const after = await card.evaluate((element) => {
  const plane = getComputedStyle(element, "::before");
  const glow = getComputedStyle(element, "::after");
  return {
    interacting: element.dataset.interacting,
    glyphs: [...element.querySelectorAll("[data-story-glyph]")].map((glyph) => ({
      x: glyph.style.getPropertyValue("--glyph-x"),
      y: glyph.style.getPropertyValue("--glyph-y"),
      z: glyph.style.getPropertyValue("--glyph-z"),
      transform: getComputedStyle(glyph).transform,
    })),
  };
});

if (after.interacting !== "true" || after.glyphs.length < 4 || !after.glyphs.some((glyph) => glyph.x !== "0.00px" && glyph.x !== "") || !after.glyphs.some((glyph) => glyph.z !== "0.00px" && glyph.z !== "")) {
  throw new Error(`Magnetic text warp did not activate correctly: ${JSON.stringify({ before, after })}`);
}

await page.screenshot({ path: "/home/ubuntu/liquid-story-hover-desktop.png" });
console.log(`Magnetic story hover verified: ${JSON.stringify({ before, after })}`);
await browser.close();
