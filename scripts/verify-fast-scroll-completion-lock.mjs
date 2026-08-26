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
  return { top: Math.round(stage.getBoundingClientRect().top), time: video.currentTime, duration: video.duration, rate: video.playbackRate, scrollY: window.scrollY };
});

await page.evaluate(() => {
  const section = document.querySelector(".ice-orbit");
  if (!section) throw new Error("Sequence section is missing.");
  section.scrollIntoView();
  window.scrollBy(0, 4_000);
});
await page.waitForTimeout(600);
const held = await inspect();
if (Math.abs(held.top) > 2 || held.time >= held.duration - 0.1 || held.rate < 1) throw new Error(`Fast scroll was not held for sequential completion: ${JSON.stringify(held)}`);

await page.waitForTimeout(5_500);
const finished = await inspect();
if (finished.time < finished.duration - 0.12) throw new Error(`Sequence did not reach its final frame while held: ${JSON.stringify({ held, finished })}`);

console.log(`Fast-scroll completion lock verified: ${JSON.stringify({ held, finished })}`);
await browser.close();
