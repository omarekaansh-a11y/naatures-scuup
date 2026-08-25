import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => {
  const video = document.querySelector(".ice-orbit__video");
  return video instanceof HTMLVideoElement && video.readyState >= 2 && Number.isFinite(video.duration) && video.duration > 0;
});
await page.waitForTimeout(750);

const inspect = async (scrollOffset) => {
  await page.evaluate((offset) => {
    const section = document.querySelector(".ice-orbit");
    if (!section) throw new Error("Video sequence section is missing.");
    window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY + offset);
  }, scrollOffset);
  await page.waitForTimeout(600);
  return page.evaluate(() => {
    const stage = document.querySelector(".ice-orbit__stage");
    const video = document.querySelector(".ice-orbit__video");
    if (!(stage instanceof HTMLElement) || !(video instanceof HTMLVideoElement)) throw new Error("Video stage is missing.");
    const stageRect = stage.getBoundingClientRect();
    return {
      top: Math.round(stageRect.top),
      height: Math.round(stageRect.height),
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      currentTime: video.currentTime,
      viewportHeight: window.innerHeight,
    };
  });
};

const start = await inspect(100);
const middle = await inspect(1400);
await page.screenshot({ path: "/home/ubuntu/ai-still-sequence-mid.png" });
if (Math.abs(start.top) > 2 || Math.abs(middle.top) > 2) throw new Error(`Sequence was not pinned: start=${start.top}, middle=${middle.top}`);
if (start.height !== start.viewportHeight || start.videoWidth !== 2560 || start.videoHeight !== 1440) throw new Error(`Video is not full viewport or 1440p: ${JSON.stringify(start)}`);
if (middle.currentTime <= start.currentTime) throw new Error(`Video did not advance with scroll: ${JSON.stringify({ start, middle })}`);

console.log(`Pinned video sequence verified: ${JSON.stringify({ start, middle })}`);
await browser.close();
