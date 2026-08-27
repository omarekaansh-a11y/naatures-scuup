import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });

async function verifyViewport(label, viewport, deviceScaleFactor, expectedSource) {
  const page = await browser.newPage({ viewport, deviceScaleFactor });
  const startedAt = Date.now();
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => {
    const video = document.querySelector(".ice-orbit__video");
    return video instanceof HTMLVideoElement && video.readyState >= 2 && video.videoWidth > 0;
  });
  const readyMs = Date.now() - startedAt;
  await page.waitForTimeout(250);

  const state = await page.evaluate(() => {
    const stage = document.querySelector(".ice-orbit__stage");
    const video = document.querySelector(".ice-orbit__video");
    if (!(stage instanceof HTMLElement) || !(video instanceof HTMLVideoElement)) throw new Error("Native cinematic elements are missing.");
    const rect = stage.getBoundingClientRect();
    const sourceRequests = performance.getEntriesByType("resource")
      .filter((entry) => entry.name.includes("mango-ice-cream-"))
      .map((entry) => entry.name);
    return {
      top: Math.round(rect.top),
      stageHeight: Math.round(rect.height),
      viewportHeight: window.innerHeight,
      width: video.videoWidth,
      height: video.videoHeight,
      sourceRequests,
    };
  });

  if (readyMs > 10_000) throw new Error(`${label} cinematic source did not become ready promptly: ${readyMs}ms`);
  if (Math.abs(state.top) > 2 || state.stageHeight !== state.viewportHeight) throw new Error(`${label} native cinematic is not correctly pinned: ${JSON.stringify(state)}`);
  if (state.width !== expectedSource.width || state.height !== expectedSource.height || !state.sourceRequests.some((request) => request.includes(expectedSource.fragment))) {
    throw new Error(`${label} did not use the approved cinematic source: ${JSON.stringify(state)}`);
  }

  await page.close();
  return { label, readyMs, ...state };
}

const results = [
  await verifyViewport("desktop", { width: 1280, height: 900 }, 1, { width: 2560, height: 1440, fragment: "1440p-clean-scrub" }),
  await verifyViewport("mobile", { width: 375, height: 812 }, 2, { width: 720, height: 1280, fragment: "portrait-mobile" }),
];

console.log(`Progressive native cinematic verified: ${JSON.stringify(results)}`);
await browser.close();
