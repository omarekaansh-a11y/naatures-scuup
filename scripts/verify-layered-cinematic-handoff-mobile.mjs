import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => {
  const video = document.querySelector(".ice-orbit__video");
  return video instanceof HTMLVideoElement && video.readyState >= 2 && video.duration > 0;
});
await page.waitForTimeout(700);

await page.evaluate(() => {
  const section = document.querySelector(".ice-orbit");
  if (!section) throw new Error("Cinematic section is missing.");
  section.scrollIntoView();
});
await page.waitForTimeout(260);

for (let step = 0; step < 4; step += 1) {
  await page.mouse.wheel(0, 2_400);
  await page.waitForTimeout(1_400);
}

const pinnedBeforeCompletion = await page.evaluate(() => {
  const stage = document.querySelector(".ice-orbit__stage");
  if (!(stage instanceof HTMLElement)) throw new Error("Cinematic stage is missing.");
  return Math.round(stage.getBoundingClientRect().top);
});

if (Math.abs(pinnedBeforeCompletion) > 2) {
  throw new Error(`Mobile cinematic stage was not pinned at the final checkpoint: ${pinnedBeforeCompletion}`);
}

await page.waitForFunction(() => {
  const video = document.querySelector(".ice-orbit__video");
  return video instanceof HTMLVideoElement && video.ended;
}, undefined, { timeout: 4_000 });

const completed = await page.evaluate(() => {
  const video = document.querySelector(".ice-orbit__video");
  if (!(video instanceof HTMLVideoElement)) throw new Error("Sequence video is missing.");
  return { ended: video.ended, time: Number(video.currentTime.toFixed(3)), duration: Number(video.duration.toFixed(3)) };
});

await page.waitForTimeout(300);
await page.mouse.wheel(0, 2_400);
await page.waitForTimeout(260);

const result = await page.evaluate(() => {
  const video = document.querySelector(".ice-orbit__video");
  const stage = document.querySelector(".ice-orbit__stage");
  const plane = document.querySelector(".home-after-orbit");
  if (!(video instanceof HTMLVideoElement) || !(stage instanceof HTMLElement) || !(plane instanceof HTMLElement)) throw new Error("Layered transition elements are missing.");
  return {
    activeCheckpoint: document.querySelectorAll(".ice-orbit__story-card[data-active='true']").length,
    scrollY: Math.round(window.scrollY),
    stageTop: Math.round(stage.getBoundingClientRect().top),
    planeTop: Math.round(plane.getBoundingClientRect().top),
    planeZ: Number.parseInt(getComputedStyle(plane).zIndex || "0", 10) || 0,
  };
});

if (!completed.ended || completed.time < completed.duration - 0.02 || result.planeZ < 1 || result.planeTop >= 844 || result.stageTop > -20) {
  throw new Error(`Mobile layered cinematic handoff failed: ${JSON.stringify({ completed, result })}`);
}

await page.screenshot({ path: "/home/ubuntu/layered-cinematic-handoff-mobile.png" });
console.log(`Mobile layered cinematic handoff verified: ${JSON.stringify({ completed, result })}`);
await browser.close();
