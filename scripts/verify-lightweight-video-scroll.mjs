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
  const readyMs = Date.now() - startedAt;

  const scrollAndInspect = async (offset) => {
    await page.evaluate((nextOffset) => {
      const section = document.querySelector(".ice-orbit");
      if (!section) throw new Error("Sequence section is missing.");
      window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY + nextOffset);
    }, offset);
    await page.waitForTimeout(850);
    return page.evaluate(() => {
      const stage = document.querySelector(".ice-orbit__stage");
      const video = document.querySelector(".ice-orbit__video");
      if (!(stage instanceof HTMLElement) || !(video instanceof HTMLVideoElement)) throw new Error("Sequence video is missing.");
      const rect = stage.getBoundingClientRect();
      return {
        top: Math.round(rect.top),
        stageHeight: Math.round(rect.height),
        viewportHeight: window.innerHeight,
        width: video.videoWidth,
        height: video.videoHeight,
        time: video.currentTime,
      };
    });
  };

  const start = await scrollAndInspect(120);
  const middle = await scrollAndInspect(1500);
  if (readyMs > 5000) throw new Error(`${label} video did not become ready promptly: ${readyMs}ms`);
  if (Math.abs(middle.top) > 2 || middle.stageHeight !== middle.viewportHeight) throw new Error(`${label} video sequence is not pinned: ${JSON.stringify({ start, middle })}`);
  if (start.width !== 2560 || start.height !== 1440 || middle.time <= start.time) throw new Error(`${label} video did not preserve 1440p scroll progression: ${JSON.stringify({ start, middle })}`);

  await page.close();
  return { label, readyMs, start, middle };
}

const results = [
  await verifyViewport("desktop", { width: 1280, height: 900 }, 1),
  await verifyViewport("mobile", { width: 375, height: 812 }, 2),
];

console.log(`Lightweight video scroll verified: ${JSON.stringify(results)}`);
await browser.close();
