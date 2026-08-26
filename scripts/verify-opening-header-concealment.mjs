import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForFunction(() => document.querySelector(".ice-orbit__video") instanceof HTMLVideoElement);

const readHeader = () => page.evaluate(() => {
  const header = document.querySelector(".site-header");
  if (!(header instanceof HTMLElement)) throw new Error("Site header is missing.");
  return { opacity: Number.parseFloat(getComputedStyle(header).opacity), pointerEvents: getComputedStyle(header).pointerEvents, heroActive: document.documentElement.dataset.iceHeroActive ?? "" };
});

const duringSequence = await readHeader();
if (duringSequence.opacity > 0.05 || duringSequence.pointerEvents !== "none" || duringSequence.heroActive !== "true") {
  throw new Error(`Header should be hidden during the opening sequence: ${JSON.stringify(duringSequence)}`);
}

await page.evaluate(() => {
  const section = document.querySelector(".ice-orbit");
  if (!(section instanceof HTMLElement)) throw new Error("Sequence section is missing.");
  const top = section.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, top + section.offsetHeight + 24);
});
await page.waitForTimeout(5_600);
await page.evaluate(() => {
  const followOnHero = document.querySelector(".hero--after-story");
  if (!(followOnHero instanceof HTMLElement)) throw new Error("Follow-on hero is missing.");
  const top = followOnHero.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, top + window.innerHeight * 0.2);
});
console.log(`Header transition probe: ${JSON.stringify(await page.evaluate(() => {
  const followOnHero = document.querySelector(".hero--after-story");
  const header = document.querySelector(".site-header");
  return { scrollY: window.scrollY, followOnHeroTop: followOnHero instanceof HTMLElement ? followOnHero.getBoundingClientRect().top : null, headerClass: header?.className, headerOpacity: header instanceof HTMLElement ? getComputedStyle(header).opacity : null };
}))}`);
await page.waitForFunction(() => {
  const header = document.querySelector(".site-header");
  return header instanceof HTMLElement && Number.parseFloat(getComputedStyle(header).opacity) > 0.95;
}, undefined, { timeout: 8_000 });

const afterSequence = await readHeader();
if (afterSequence.opacity < 0.95 || afterSequence.pointerEvents === "none" || afterSequence.heroActive !== "false") {
  throw new Error(`Header should return after the opening sequence: ${JSON.stringify(afterSequence)}`);
}

console.log(`Opening header concealment verified: ${JSON.stringify({ duringSequence, afterSequence })}`);
await browser.close();
