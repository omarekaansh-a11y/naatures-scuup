import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });

const stack = page.locator(".drag-it-stack");
await stack.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
const box = await stack.boundingBox();
if (!box) throw new Error("Drag It stack could not be measured.");

const exitVector = async (deltaX, deltaY) => {
  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;
  const pointerId = deltaY ? 12 : 11;
  await stack.dispatchEvent("pointerdown", { pointerId, pointerType: "mouse", isPrimary: true, button: 0, buttons: 1, clientX: startX, clientY: startY });
  await stack.dispatchEvent("pointermove", { pointerId, pointerType: "mouse", isPrimary: true, button: 0, buttons: 1, clientX: startX + deltaX, clientY: startY + deltaY });
  await stack.dispatchEvent("pointerup", { pointerId, pointerType: "mouse", isPrimary: true, button: 0, buttons: 0, clientX: startX + deltaX, clientY: startY + deltaY });
  await page.waitForTimeout(100);
  const style = await page.locator(".drag-it-card--front").getAttribute("style");
  const match = style?.match(/translate3d\((-?[\d.]+)px,\s*(-?[\d.]+)px/);
  if (!match) throw new Error(`Could not read active card exit transform: ${style}`);
  return { x: Number(match[1]), y: Number(match[2]) };
};

const right = await exitVector(180, 8);
if (right.x <= 0) throw new Error(`Right drag exited in the wrong direction: ${JSON.stringify(right)}`);
await page.waitForTimeout(760);

const down = await exitVector(8, 180);
if (down.y <= 0) throw new Error(`Down drag exited in the wrong direction: ${JSON.stringify(down)}`);

console.log(`Physical Drag It exits verified: right ${right.x}px; down ${down.y}px.`);
await browser.close();
