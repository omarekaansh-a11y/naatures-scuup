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
  if (label === "mobile") await page.screenshot({ path: "/home/ubuntu/lightweight-video-mobile.png" });
  if (readyMs > 7000) throw new Error(`${label} video did not become ready within the mobile-safe threshold: ${readyMs}ms`);
  if (Math.abs(middle.top) > 2 || middle.stageHeight !== middle.viewportHeight) throw new Error(`${label} video sequence is not pinned: ${JSON.stringify({ start, middle })}`);
  const expectedSource = label === "mobile" ? { width: 720, height: 1280, label: "portrait mobile source" } : { width: 2560, height: 1440, label: "1440p desktop source" };
  if (start.width !== expectedSource.width || start.height !== expectedSource.height || middle.time <= start.time) throw new Error(`${label} video did not preserve the approved ${expectedSource.label} scroll progression: ${JSON.stringify({ start, middle })}`);

  await page.close();
  return { label, readyMs, start, middle };
}

const results = [
  await verifyViewport("desktop", { width: 1280, height: 900 }, 1),
  await verifyViewport("mobile", { width: 375, height: 812 }, 2),
];

console.log(`Lightweight video scroll verified: ${JSON.stringify(results)}`);
await browser.close();
