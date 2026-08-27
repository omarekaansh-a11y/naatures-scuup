import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => {
  const video = document.querySelector(".ice-orbit__video");
  return video instanceof HTMLVideoElement && video.readyState >= 2 && video.videoWidth > 0;
});
await page.waitForTimeout(700);

const inspect = () => page.evaluate(() => {
  const stage = document.querySelector(".ice-orbit__stage");
  const video = document.querySelector(".ice-orbit__video");
  if (!(stage instanceof HTMLElement) || !(video instanceof HTMLVideoElement)) throw new Error("Native cinematic stage is missing.");
  const stageRect = stage.getBoundingClientRect();
  return {
    top: Math.round(stageRect.top),
    height: Math.round(stageRect.height),
    viewportHeight: window.innerHeight,
    videoWidth: video.videoWidth,
    videoHeight: video.videoHeight,
    objectFit: getComputedStyle(video).objectFit,
  };
});

const start = await inspect();
await page.mouse.wheel(0, 2_400);
await page.waitForTimeout(1_400);
const middle = await inspect();
await page.screenshot({ path: "/home/ubuntu/ai-still-sequence-mid.png" });

if (Math.abs(start.top) > 2 || Math.abs(middle.top) > 2 || start.height !== start.viewportHeight || middle.height !== middle.viewportHeight) {
  throw new Error(`Native cinematic stage was not pinned fullscreen: ${JSON.stringify({ start, middle })}`);
}
if (start.videoWidth !== 2560 || start.videoHeight !== 1440 || start.objectFit !== "cover") {
  throw new Error(`Desktop cinematic does not retain the approved 1440p cover source: ${JSON.stringify(start)}`);
}

console.log(`Pinned native-video cinematic verified: ${JSON.stringify({ start, middle })}`);
await browser.close();
