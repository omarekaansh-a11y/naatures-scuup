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
    const canvas = document.querySelector(".ice-orbit__canvas");
    return canvas instanceof HTMLCanvasElement && canvas.width > 0 && canvas.height > 0;
  });
  const firstFrameReadyMs = Date.now() - startedAt;
  await page.waitForTimeout(750);

  await page.evaluate(() => {
    const section = document.querySelector(".ice-orbit");
    if (!section) throw new Error("Canvas sequence section is missing.");
    window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY + 100);
  });
  await page.waitForTimeout(450);

  const state = await page.evaluate(() => {
    const stage = document.querySelector(".ice-orbit__stage");
    const canvas = document.querySelector(".ice-orbit__canvas");
    if (!(stage instanceof HTMLElement) || !(canvas instanceof HTMLCanvasElement)) throw new Error("Canvas stage is missing.");
    const rect = stage.getBoundingClientRect();
    const requestedFrames = performance.getEntriesByType("resource")
      .filter((entry) => entry.name.includes("/manus-storage/ezgif-frame-"))
      .length;
    return {
      top: Math.round(rect.top),
      stageHeight: Math.round(rect.height),
      viewportHeight: window.innerHeight,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      requestedFrames,
    };
  });

  if (firstFrameReadyMs > 10_000) throw new Error(`${label} first frame was not ready promptly: ${firstFrameReadyMs}ms`);
  if (Math.abs(state.top) > 2 || state.stageHeight !== state.viewportHeight) throw new Error(`${label} canvas is not correctly pinned: ${JSON.stringify(state)}`);
  if (state.requestedFrames >= 80) throw new Error(`${label} requested too many frames during initial playback: ${state.requestedFrames}`);

  await page.close();
  return { label, firstFrameReadyMs, ...state };
}

const results = [
  await verifyViewport("desktop", { width: 1280, height: 900 }, 1),
  await verifyViewport("mobile", { width: 375, height: 812 }, 2),
];

console.log(`Progressive sequence verified: ${JSON.stringify(results)}`);
await browser.close();
