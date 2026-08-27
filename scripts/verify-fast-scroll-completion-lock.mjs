import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => {
  const video = document.querySelector(".ice-orbit__video");
  return video instanceof HTMLVideoElement && video.readyState >= 2 && video.duration > 0;
});
await page.waitForTimeout(900);

const inspect = () => page.evaluate(() => {
  const stage = document.querySelector(".ice-orbit__stage");
  const video = document.querySelector(".ice-orbit__video");
  if (!(stage instanceof HTMLElement) || !(video instanceof HTMLVideoElement)) throw new Error("Sequence video is missing.");
  return { top: Math.round(stage.getBoundingClientRect().top), time: video.currentTime, duration: video.duration, ended: video.ended, rate: video.playbackRate, scrollY: window.scrollY, heroActive: document.documentElement.dataset.iceHeroActive };
});

for (let step = 0; step < 4; step += 1) {
  await page.mouse.wheel(0, 2_400);
  await page.waitForTimeout(1_400);
}
const held = await inspect();
if (Math.abs(held.top) > 2 || held.time >= held.duration - 0.1 || held.rate < 1 || held.heroActive !== "true") throw new Error(`Fast scroll was not held for sequential completion: ${JSON.stringify(held)}`);

await page.waitForTimeout(8_000);
const finished = await inspect();
if (finished.time < finished.duration - 0.01 || !finished.ended || finished.heroActive !== "true") throw new Error(`Sequence did not complete playback while held: ${JSON.stringify({ held, finished })}`);

await page.mouse.wheel(0, 2_400);
await page.waitForTimeout(250);
const released = await inspect();
if (released.top > -40 || released.heroActive !== "false") throw new Error(`Scroll did not release only after playback completion: ${JSON.stringify({ held, finished, released })}`);

console.log(`Fast-scroll completion lock verified: ${JSON.stringify({ held, finished, released })}`);
await browser.close();
