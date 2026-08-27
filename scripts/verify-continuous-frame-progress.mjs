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
  return video instanceof HTMLVideoElement && video.readyState >= 2 && video.duration > 0;
});
await page.waitForTimeout(700);

const samples = [];
for (let checkpoint = 0; checkpoint < 5; checkpoint += 1) {
  if (checkpoint > 0) {
    await page.mouse.wheel(0, 2_400);
    await page.waitForTimeout(1_400);
  }
  samples.push(await page.evaluate(() => {
    const video = document.querySelector(".ice-orbit__video");
    const stage = document.querySelector(".ice-orbit__stage");
    const cards = [...document.querySelectorAll(".ice-orbit__story-card")];
    if (!(video instanceof HTMLVideoElement) || !(stage instanceof HTMLElement)) throw new Error("Native cinematic video is missing.");
    return {
      checkpoint: cards.findIndex((card) => card.getAttribute("data-active") === "true"),
      time: Number(video.currentTime.toFixed(3)),
      stageTop: Math.round(stage.getBoundingClientRect().top),
    };
  }));
}

if (samples.some((sample, index) => sample.checkpoint !== index || Math.abs(sample.stageTop) > 2)) {
  throw new Error(`Native cinematic checkpoints did not remain continuously pinned: ${JSON.stringify(samples)}`);
}
if (samples.some((sample, index) => index > 0 && sample.time <= samples[index - 1].time + 0.05)) {
  throw new Error(`Native cinematic video did not progress continuously between bounded stops: ${JSON.stringify(samples)}`);
}

console.log(`Continuous native video progress verified: ${JSON.stringify(samples)}`);
await browser.close();
