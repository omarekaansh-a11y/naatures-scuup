import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const viewportCases = [
  { width: 320, height: 640 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
];
const allResults = [];

for (const viewport of viewportCases) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => {
    const video = document.querySelector(".ice-orbit__video");
    return video instanceof HTMLVideoElement && video.readyState >= 2;
  });
  await page.waitForFunction(() => {
    const button = document.querySelector(".ice-orbit__scroll-button");
    return button instanceof HTMLButtonElement && !button.disabled;
  });

  const before = await page.evaluate(() => {
    const stage = document.querySelector(".ice-orbit__stage");
    const video = document.querySelector(".ice-orbit__video");
    const story = document.querySelector(".ice-orbit__story");
    const rail = document.querySelector(".ice-orbit__checkpoint-rail");
    const button = document.querySelector(".ice-orbit__scroll-button");
    const dock = document.querySelector(".mobile-dock");
    if (!(stage instanceof HTMLElement) || !(video instanceof HTMLVideoElement) || !(story instanceof HTMLElement) || !(rail instanceof HTMLElement) || !(button instanceof HTMLButtonElement)) throw new Error("Mobile hero controls are missing.");
    const stageRect = stage.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const dockRect = dock instanceof HTMLElement ? dock.getBoundingClientRect() : null;
    return {
      storyDisplay: getComputedStyle(story).display,
      railDisplay: getComputedStyle(rail).display,
      videoTransform: getComputedStyle(video).transform,
      buttonLabel: button.getAttribute("aria-label"),
      buttonVisible: buttonRect.width > 0 && buttonRect.height > 0 && buttonRect.bottom <= stageRect.bottom + 1,
      buttonAboveDock: !dockRect || buttonRect.bottom <= dockRect.top + 1,
      scrollY: window.scrollY,
    };
  });

  if (before.storyDisplay !== "none" || before.railDisplay !== "none" || !before.videoTransform.includes("3.1") || before.buttonLabel !== "Scroll down to continue" || !before.buttonVisible || !before.buttonAboveDock) {
    throw new Error(`Focused mobile opening state failed at ${viewport.width}x${viewport.height}: ${JSON.stringify(before)}`);
  }

  await page.locator(".ice-orbit__scroll-button").click();
  await page.waitForTimeout(700);
  const afterScrollY = await page.evaluate(() => window.scrollY);
  if (afterScrollY <= before.scrollY + viewport.height * 0.25) {
    throw new Error(`Mobile scroll arrow did not advance the opening sequence at ${viewport.width}x${viewport.height}: ${JSON.stringify({ beforeScrollY: before.scrollY, afterScrollY })}`);
  }

  await page.screenshot({ path: `/home/ubuntu/focused-ice-cream-mobile-${viewport.width}x${viewport.height}.png` });
  allResults.push({ viewport, ...before, afterScrollY });
  await page.close();
}

console.log(`Focused mobile ice-cream hero verified across devices: ${JSON.stringify(allResults)}`);
await browser.close();
