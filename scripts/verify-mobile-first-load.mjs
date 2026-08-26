import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });

const immediate = await page.evaluate(() => {
  const guide = document.querySelector(".drag-it-mobile-guide");
  const playground = document.querySelector(".drag-it-playground");
  const loading = document.querySelector(".ice-orbit__loading");
  const video = document.querySelector(".ice-orbit__video");
  if (!(guide instanceof HTMLElement) || !(playground instanceof HTMLElement) || !(video instanceof HTMLVideoElement)) throw new Error("Expected first-load elements are missing.");
  const guideRect = guide.getBoundingClientRect();
  const playgroundRect = playground.getBoundingClientRect();
  const loadingStyle = loading instanceof HTMLElement ? getComputedStyle(loading).backgroundImage : "";
  return {
    guideInViewport: guideRect.bottom > 0 && guideRect.top < window.innerHeight,
    guideInsidePlayground: guideRect.top >= playgroundRect.top - 1 && guideRect.bottom <= playgroundRect.bottom + 1,
    loadingUsesPoster: loadingStyle.includes("ezgif-frame-001_c0bf1371.png"),
    videoReadyState: video.readyState,
  };
});

if (immediate.guideInViewport || !immediate.guideInsidePlayground || (!immediate.loadingUsesPoster && immediate.videoReadyState < 2)) {
  throw new Error(`Mobile first-load state is incorrect: ${JSON.stringify(immediate)}`);
}

await page.waitForFunction(() => {
  const video = document.querySelector(".ice-orbit__video");
  return video instanceof HTMLVideoElement && video.readyState >= 2;
});
await page.waitForTimeout(120);

const ready = await page.evaluate(() => ({
  loadingPresent: document.querySelector(".ice-orbit__loading") !== null,
  guideInViewport: (() => {
    const guide = document.querySelector(".drag-it-mobile-guide");
    if (!(guide instanceof HTMLElement)) return false;
    const rect = guide.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  })(),
}));

if (ready.loadingPresent || ready.guideInViewport) {
  throw new Error(`Mobile ready-state is incorrect: ${JSON.stringify(ready)}`);
}

console.log(`Mobile first-load verified: ${JSON.stringify({ immediate, ready })}`);
await browser.close();
