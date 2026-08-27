import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => {
  const video = document.querySelector(".ice-orbit__video");
  return video instanceof HTMLVideoElement && video.readyState >= 2;
});
await page.waitForTimeout(700);

const state = async () => page.evaluate(() => {
  const cards = [...document.querySelectorAll(".ice-orbit__story-card")];
  const active = document.querySelector('.ice-orbit__story-card[data-active="true"]');
  const stage = document.querySelector(".ice-orbit__stage");
  if (!(active instanceof HTMLElement) || !(stage instanceof HTMLElement)) throw new Error("Cinematic stage is unavailable.");
  return {
    scrollY: Math.round(window.scrollY),
    activeIndex: cards.indexOf(active),
    visibleCount: cards.filter((card) => Number.parseFloat(getComputedStyle(card).opacity) > 0.5).length,
    stageTop: Math.round(stage.getBoundingClientRect().top),
    dots: document.querySelectorAll(".ice-orbit__checkpoint").length,
    cameraTransform: (() => {
      const video = document.querySelector(".ice-orbit__video");
      return video instanceof HTMLVideoElement ? getComputedStyle(video).transform : "";
    })(),
  };
});

const initialState = await state();
await page.waitForTimeout(650);
const settledInitialState = await state();
if (initialState.scrollY !== 0 || settledInitialState.scrollY !== 0 || initialState.stageTop !== 0 || settledInitialState.stageTop !== 0 || initialState.cameraTransform !== settledInitialState.cameraTransform) {
  throw new Error(`Initial cinematic camera state shifted the viewport or animated before input: ${JSON.stringify({ initialState, settledInitialState })}`);
}

await page.mouse.wheel(0, 1800);
await page.waitForTimeout(180);
const firstGlide = await state();
await page.waitForTimeout(1_360);
const firstHold = await state();

await page.mouse.wheel(0, -1_800);
await page.waitForTimeout(1_400);
const reverseHold = await state();

await page.mouse.wheel(0, 1_800);
await page.waitForTimeout(1_400);
const restoredHold = await state();

await page.mouse.wheel(0, 1800);
await page.mouse.wheel(0, 1800);
await page.mouse.wheel(0, 1800);
await page.waitForTimeout(1_040);
const rapidHold = await state();

if (firstGlide.scrollY <= 0 || firstGlide.scrollY >= firstHold.scrollY || firstHold.activeIndex !== 1 || reverseHold.activeIndex !== 0 || restoredHold.activeIndex !== 1 || rapidHold.activeIndex !== 2 || firstHold.visibleCount !== 1 || reverseHold.visibleCount !== 1 || restoredHold.visibleCount !== 1 || rapidHold.visibleCount !== 1 || firstHold.dots !== 5 || rapidHold.dots !== 5 || firstHold.scrollY <= 0 || reverseHold.scrollY >= firstHold.scrollY || restoredHold.scrollY !== firstHold.scrollY || rapidHold.scrollY <= restoredHold.scrollY || Math.abs(rapidHold.stageTop) > 3) {
  throw new Error(`Initial checkpoint momentum, reverse input, or bounded progression failed: ${JSON.stringify({ firstGlide, firstHold, reverseHold, restoredHold, rapidHold })}`);
}

const expectedCards = [3, 4];
const remainingStops = [];
for (const expectedCard of expectedCards) {
  await page.mouse.wheel(0, 1800);
  await page.waitForTimeout(1_400);
  const stop = await state();
  if (stop.activeIndex !== expectedCard || stop.visibleCount !== 1 || Math.abs(stop.stageTop) > 3) {
    throw new Error(`Paired checkpoint did not retain one resolved story card: ${JSON.stringify({ expectedCard, stop })}`);
  }
  remainingStops.push(stop);
}

const finalHold = remainingStops.at(-1);
const checkpointPositions = [restoredHold.scrollY, rapidHold.scrollY, ...remainingStops.map((stop) => stop.scrollY)];
const intervals = checkpointPositions.slice(1).map((position, index) => position - checkpointPositions[index]);
const expectedInterval = intervals[0];
if (intervals.some((interval) => Math.abs(interval - expectedInterval) > 4)) {
  throw new Error(`Cinematic checkpoint distances are not equal: ${JSON.stringify({ checkpointPositions, intervals })}`);
}

if (!finalHold || finalHold.scrollY <= rapidHold.scrollY || finalHold.activeIndex !== 4) {
  throw new Error(`Final slogan checkpoint did not hold as the lasting final message: ${JSON.stringify({ rapidHold, finalHold })}`);
}

console.log(`Cinematic five-stop checkpoints verified: ${JSON.stringify({ initialState, settledInitialState, firstGlide, firstHold, reverseHold, restoredHold, rapidHold, remainingStops, intervals })}`);
await browser.close();
