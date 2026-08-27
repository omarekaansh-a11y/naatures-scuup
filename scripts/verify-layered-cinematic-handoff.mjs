import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
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
  window.scrollBy(0, 4_000);
});
await page.waitForTimeout(320);
await page.evaluate(() => {
  const video = document.querySelector(".ice-orbit__video");
  if (!(video instanceof HTMLVideoElement)) throw new Error("Sequence video is missing.");
  video.pause();
  video.currentTime = video.duration;
  video.dispatchEvent(new Event("ended"));
});
await page.waitForTimeout(260);

const result = await page.evaluate(() => {
  const video = document.querySelector(".ice-orbit__video");
  const stage = document.querySelector(".ice-orbit__stage");
  const plane = document.querySelector(".home-after-orbit");
  if (!(video instanceof HTMLVideoElement) || !(stage instanceof HTMLElement) || !(plane instanceof HTMLElement)) throw new Error("Layered transition elements are missing.");
  window.scrollBy(0, 720);
  const stageZ = Number.parseInt(getComputedStyle(stage).zIndex || "0", 10) || 0;
  const planeZ = Number.parseInt(getComputedStyle(plane).zIndex || "0", 10) || 0;
  return { atEnd: video.currentTime >= video.duration - 0.01, scrollY: Math.round(window.scrollY), stageTop: Math.round(stage.getBoundingClientRect().top), planeTop: Math.round(plane.getBoundingClientRect().top), stageZ, planeZ };
});

if (!result.atEnd || result.planeZ <= result.stageZ || result.planeTop >= 720 || result.stageTop > -20) {
  throw new Error(`Layered cinematic handoff failed: ${JSON.stringify(result)}`);
}

await page.screenshot({ path: "/home/ubuntu/layered-cinematic-handoff-desktop.png" });
console.log(`Layered cinematic handoff verified: ${JSON.stringify(result)}`);
await browser.close();
