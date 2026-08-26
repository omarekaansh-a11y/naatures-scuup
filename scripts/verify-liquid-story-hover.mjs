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
    opacity: Number.parseFloat(plane.opacity),
    clipPath: plane.clipPath,
    glowOpacity: Number.parseFloat(glow.opacity),
    interacting: element.dataset.interacting,
    wakeX: element.style.getPropertyValue("--wake-x"),
    wakeY: element.style.getPropertyValue("--wake-y"),
    wakes: [...element.querySelectorAll(".ice-orbit__liquid-wake")].map((wake) => Number.parseFloat(getComputedStyle(wake).opacity)),
  };
});

if (before.opacity > 0.05 || after.opacity < 0.95 || after.clipPath === before.clipPath || after.glowOpacity < 0.95 || after.interacting !== "true" || after.wakeX === "" || after.wakeY === "" || after.wakes.length !== 2 || after.wakes[0] < 0.7 || after.wakes[1] < 0.4) {
  throw new Error(`Liquid hover plane did not uncover correctly: ${JSON.stringify({ before, after })}`);
}

await page.screenshot({ path: "/home/ubuntu/liquid-story-hover-desktop.png" });
console.log(`Liquid story hover verified: ${JSON.stringify({ before, after })}`);
await browser.close();
