import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.locator(".drag-it-stack").scrollIntoViewIfNeeded();
await page.waitForTimeout(500);

const frontCard = page.locator(".drag-it-card--front");
const stack = page.locator(".drag-it-stack");

const initialTransform = await frontCard.getAttribute("style");
await stack.evaluate((element) => {
  element.dispatchEvent(new PointerEvent("pointermove", {
    bubbles: true,
    pointerId: 41,
    pointerType: "mouse",
    buttons: 0,
    clientX: 170,
    clientY: 120,
  }));
});
await page.waitForTimeout(120);
const hoverTransform = await frontCard.getAttribute("style");
if (hoverTransform !== initialTransform) throw new Error(`Hover movement incorrectly altered the card: ${initialTransform} -> ${hoverTransform}`);

await stack.evaluate((element) => {
  element.dispatchEvent(new PointerEvent("pointerdown", {
    bubbles: true,
    pointerId: 42,
    pointerType: "mouse",
    button: 0,
    buttons: 1,
    clientX: 100,
    clientY: 100,
  }));
  element.dispatchEvent(new PointerEvent("pointermove", {
    bubbles: true,
    pointerId: 42,
    pointerType: "mouse",
    buttons: 1,
    clientX: 170,
    clientY: 120,
  }));
});
await page.waitForTimeout(120);
const draggedTransform = await frontCard.getAttribute("style");
if (draggedTransform === initialTransform) throw new Error("A pressed drag did not move the front card.");

console.log("Drag intent verified: hover-only movement leaves the card stationary; pressed dragging moves it.");
await browser.close();
