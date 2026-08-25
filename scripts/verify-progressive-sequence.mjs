import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});

async function verifyViewport(label, viewport, deviceScaleFactor) {
  const page = await browser.newPage({ viewport, deviceScaleFactor });
  const startedAt = Date.now();
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => {
    const video = document.querySelector(".ice-orbit__video");
    return video instanceof HTMLVideoElement && video.readyState >= 2 && Number.isFinite(video.duration) && video.duration > 0;
  });
  const firstFrameReadyMs = Date.now() - startedAt;
  await page.waitForTimeout(750);

  await page.evaluate(() => {
    const section = document.querySelector(".ice-orbit");
    if (!section) throw new Error("Video sequence section is missing.");
    window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY + 100);
  });
  await page.waitForTimeout(450);

  const state = await page.evaluate(() => {
    const stage = document.querySelector(".ice-orbit__stage");
    const video = document.querySelector(".ice-orbit__video");
    if (!(stage instanceof HTMLElement) || !(video instanceof HTMLVideoElement)) throw new Error("Video stage is missing.");
    const rect = stage.getBoundingClientRect();
    return {
      top: Math.round(rect.top),
      stageHeight: Math.round(rect.height),
      viewportHeight: window.innerHeight,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
    };
  });

  if (firstFrameReadyMs > 10_000) throw new Error(`${label} first frame was not ready promptly: ${firstFrameReadyMs}ms`);
  if (Math.abs(state.top) > 2 || state.stageHeight !== state.viewportHeight) throw new Error(`${label} video is not correctly pinned: ${JSON.stringify(state)}`);
  if (state.videoWidth !== 2560 || state.videoHeight !== 1440) throw new Error(`${label} video is not 1440p: ${JSON.stringify(state)}`);

  await page.close();
  return { label, firstFrameReadyMs, ...state };
}

const results = [
  await verifyViewport("desktop", { width: 1280, height: 900 }, 1),
  await verifyViewport("mobile", { width: 375, height: 812 }, 2),
];

console.log(`Progressive video sequence verified: ${JSON.stringify(results)}`);
await browser.close();
