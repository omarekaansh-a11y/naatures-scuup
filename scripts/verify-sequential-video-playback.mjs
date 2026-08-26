import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});

async function inspect(label, viewport, deviceScaleFactor, expectedWidth) {
  const page = await browser.newPage({ viewport, deviceScaleFactor });
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => {
    const video = document.querySelector(".ice-orbit__video");
    return video instanceof HTMLVideoElement && video.readyState >= 2 && video.duration > 0;
  });

  const snapshot = () => page.evaluate(() => {
    const stage = document.querySelector(".ice-orbit__stage");
    const video = document.querySelector(".ice-orbit__video");
    if (!(stage instanceof HTMLElement) || !(video instanceof HTMLVideoElement)) throw new Error("Sequence video is missing.");
    const rect = stage.getBoundingClientRect();
    return { top: Math.round(rect.top), stageHeight: Math.round(rect.height), viewportHeight: window.innerHeight, width: video.videoWidth, height: video.videoHeight, time: video.currentTime, rate: video.playbackRate };
  });

  await page.evaluate(() => {
    const section = document.querySelector(".ice-orbit");
    if (!section) throw new Error("Sequence section is missing.");
    window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY + 150);
  });
  await page.waitForTimeout(350);
  const beforeJump = await snapshot();

  await page.evaluate(() => window.scrollBy(0, 2200));
  await page.waitForTimeout(160);
  const immediatelyAfterJump = await snapshot();
  await page.waitForTimeout(1200);
  const afterCatchUp = await snapshot();

  if (beforeJump.width !== expectedWidth || beforeJump.height !== (expectedWidth === 1280 ? 720 : 1440)) throw new Error(`${label} selected the wrong adaptive video source: ${JSON.stringify(beforeJump)}`);
  if (Math.abs(afterCatchUp.top) > 2 || afterCatchUp.stageHeight !== afterCatchUp.viewportHeight) throw new Error(`${label} is not pinned after fast scroll: ${JSON.stringify(afterCatchUp)}`);
  if (immediatelyAfterJump.time < beforeJump.time || immediatelyAfterJump.rate < 1) throw new Error(`${label} did not enter forward catch-up playback after fast scroll: ${JSON.stringify({ beforeJump, immediatelyAfterJump })}`);
  if (afterCatchUp.time <= immediatelyAfterJump.time + 0.2) throw new Error(`${label} did not advance sequentially after fast scroll: ${JSON.stringify({ immediatelyAfterJump, afterCatchUp })}`);

  await page.close();
  return { label, beforeJump, immediatelyAfterJump, afterCatchUp };
}

const results = [
  await inspect("desktop", { width: 1280, height: 900 }, 1, 2560),
  await inspect("mobile", { width: 375, height: 812 }, 2, 1280),
];

console.log(`Sequential adaptive video verified: ${JSON.stringify(results)}`);
await browser.close();
