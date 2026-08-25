import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => {
  const video = document.querySelector(".ice-orbit__video");
  return video instanceof HTMLVideoElement && video.readyState >= 2 && Number.isFinite(video.duration) && video.duration > 0;
});
await page.waitForTimeout(750);

const readTime = async (offset) => {
  await page.evaluate((nextOffset) => {
    const section = document.querySelector(".ice-orbit");
    if (!section) throw new Error("Video sequence section is missing.");
    window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY + nextOffset);
  }, offset);
  await page.waitForTimeout(700);
  return page.evaluate(() => {
    const video = document.querySelector(".ice-orbit__video");
    if (!(video instanceof HTMLVideoElement)) throw new Error("Video is missing.");
    return video.currentTime;
  });
};

const times = [];
for (const offset of [120, 850, 1600, 2450]) times.push(await readTime(offset));
if (new Set(times.map((time) => time.toFixed(2))).size < 3) throw new Error(`Video did not advance continuously: ${JSON.stringify(times)}`);
if (times.some((time, index) => index > 0 && time <= times[index - 1])) throw new Error(`Video time is not increasing with scroll: ${JSON.stringify(times)}`);

console.log(`Continuous video progress verified: ${JSON.stringify(times)}`);
await browser.close();
