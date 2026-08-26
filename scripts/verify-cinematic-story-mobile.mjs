import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => {
  const video = document.querySelector(".ice-orbit__video");
  return video instanceof HTMLVideoElement && video.readyState >= 2;
});
await page.waitForTimeout(600);

async function inspect(label, progress, cardIndex) {
  await page.evaluate(() => {
    const stage = document.querySelector(".ice-orbit__stage");
    if (!(stage instanceof HTMLElement)) throw new Error("Sequence stage is missing.");
    stage.scrollIntoView();
  });
  await page.waitForTimeout(220);
  await page.mouse.wheel(0, 120);
  await page.waitForTimeout(260);
  await page.evaluate((storyProgress) => {
    window.scrollBy(0, Math.max(window.innerHeight * 3.75, 2800) * storyProgress);
  }, progress);
  await page.waitForTimeout(300);
  const metrics = await page.evaluate((index) => {
    const section = document.querySelector(".ice-orbit");
    const stage = document.querySelector(".ice-orbit__stage");
    const card = document.querySelectorAll(".ice-orbit__story-card")[index];
    if (!(section instanceof HTMLElement) || !(stage instanceof HTMLElement) || !(card instanceof HTMLElement)) throw new Error("Story card is missing.");
    const rect = card.getBoundingClientRect();
    return { top: Math.round(stage.getBoundingClientRect().top), opacity: Number.parseFloat(getComputedStyle(card).opacity), left: rect.left, right: rect.right, cardTop: rect.top, cardBottom: rect.bottom, viewportWidth: window.innerWidth, viewportHeight: window.innerHeight, scrollY: window.scrollY, sectionTop: section.getBoundingClientRect().top + window.scrollY, sectionHeight: section.offsetHeight };
  }, cardIndex);
  if (Math.abs(metrics.top) > 2 || metrics.opacity < 0.45 || metrics.left < -1 || metrics.right > metrics.viewportWidth + 1 || metrics.cardTop < -1 || metrics.cardBottom > metrics.viewportHeight + 1) throw new Error(`${label} mobile story chapter does not fit: ${JSON.stringify(metrics)}`);
  await page.screenshot({ path: `/home/ubuntu/cinematic-story-mobile-${label}.png` });
  return { label, ...metrics };
}

const results = [await inspect("parlour", 0.32, 1), await inspect("happiness", 0.92, 3)];
console.log(`Mobile cinematic story verified: ${JSON.stringify(results)}`);
await browser.close();
