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
await page.waitForTimeout(850);
const after = await card.evaluate((element) => {
  const plane = getComputedStyle(element, "::before");
  return { opacity: Number.parseFloat(plane.opacity), clipPath: plane.clipPath };
});

if (before.opacity > 0.05 || after.opacity < 0.95 || after.clipPath === before.clipPath) {
  throw new Error(`Liquid hover plane did not uncover correctly: ${JSON.stringify({ before, after })}`);
}

await page.screenshot({ path: "/home/ubuntu/liquid-story-hover-desktop.png" });
console.log(`Liquid story hover verified: ${JSON.stringify({ before, after })}`);
await browser.close();
