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
  return video instanceof HTMLVideoElement && video.readyState >= 2;
});
await page.waitForTimeout(750);

const readStory = () => page.evaluate(() => {
  const section = document.querySelector(".ice-orbit");
  const stage = document.querySelector(".ice-orbit__stage");
  const cards = [...document.querySelectorAll(".ice-orbit__story-card")];
  if (!(section instanceof HTMLElement) || !(stage instanceof HTMLElement) || cards.length !== 4) throw new Error("Cinematic story elements are missing.");
  return {
    top: Math.round(stage.getBoundingClientRect().top),
    cards: cards.map((card) => Math.round(Number.parseFloat(getComputedStyle(card).opacity) * 100) / 100),
    activeCheckpoint: [...document.querySelectorAll(".ice-orbit__checkpoint")].findIndex((checkpoint) => checkpoint.getAttribute("data-active") === "true"),
  };
});

async function inspectChapter(label, progress, expectedVisible) {
  await page.evaluate((chapterProgress) => {
    const section = document.querySelector(".ice-orbit");
    if (!(section instanceof HTMLElement)) throw new Error("Sequence section is missing.");
    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
    window.scrollTo(0, top + travel * chapterProgress);
  }, progress);
  await page.waitForTimeout(700);
  const result = await readStory();
  if (Math.abs(result.top) > 2) throw new Error(`${label} chapter is not pinned: ${JSON.stringify(result)}`);
  if (result.cards[expectedVisible] < 0.55) throw new Error(`${label} chapter does not reveal the intended overlay: ${JSON.stringify(result)}`);
  if (result.cards.filter((opacity) => opacity > 0.15).length !== 1) throw new Error(`${label} checkpoint shows overlapping story cards: ${JSON.stringify(result)}`);
  if (result.activeCheckpoint !== expectedVisible) throw new Error(`${label} checkpoint rail does not match the visible story card: ${JSON.stringify(result)}`);
  await page.screenshot({ path: `/home/ubuntu/cinematic-story-${label}.png` });
  return { label, ...result };
}

const results = [
  await inspectChapter("origin", 0.08, 0),
  await inspectChapter("parlour", 0.32, 1),
  await inspectChapter("craving", 0.63, 2),
  await inspectChapter("happiness", 0.92, 3),
];

console.log(`Cinematic story chapters verified: ${JSON.stringify(results)}`);
await browser.close();
