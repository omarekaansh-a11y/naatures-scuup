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
  const postSequenceRibbon = document.querySelector(".craving-ribbon");
  if (!(postSequenceRibbon instanceof HTMLElement)) throw new Error("Post-sequence craving ribbon is missing.");
  const top = postSequenceRibbon.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, top + window.innerHeight * 0.2);
});
console.log(`Header transition probe: ${JSON.stringify(await page.evaluate(() => {
  const postSequenceRibbon = document.querySelector(".craving-ribbon");
  const header = document.querySelector(".site-header");
  return { scrollY: window.scrollY, postSequenceRibbonTop: postSequenceRibbon instanceof HTMLElement ? postSequenceRibbon.getBoundingClientRect().top : null, headerClass: header?.className, headerOpacity: header instanceof HTMLElement ? getComputedStyle(header).opacity : null };
}))}`);
await page.waitForFunction(() => {
  const header = document.querySelector(".site-header");
  return header instanceof HTMLElement && Number.parseFloat(getComputedStyle(header).opacity) > 0.95;
}, undefined, { timeout: 8_000 });

const afterSequence = await readHeader();
if (afterSequence.opacity < 0.95 || afterSequence.pointerEvents === "none" || afterSequence.heroActive !== "false") {
  throw new Error(`Header should return after the opening sequence: ${JSON.stringify(afterSequence)}`);
}

const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await mobilePage.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await mobilePage.waitForFunction(() => document.querySelector(".ice-orbit__video") instanceof HTMLVideoElement);
const mobileDuringSequence = await mobilePage.evaluate(() => {
  const header = document.querySelector(".site-header");
  if (!(header instanceof HTMLElement)) throw new Error("Mobile site header is missing.");
  return { opacity: Number.parseFloat(getComputedStyle(header).opacity), pointerEvents: getComputedStyle(header).pointerEvents, heroActive: document.documentElement.dataset.iceHeroActive ?? "" };
});
if (mobileDuringSequence.opacity < 0.95 || mobileDuringSequence.pointerEvents === "none" || mobileDuringSequence.heroActive !== "true") {
  throw new Error(`Header should remain accessible during the mobile opening sequence: ${JSON.stringify(mobileDuringSequence)}`);
}
await mobilePage.evaluate(() => window.scrollTo({ top: Math.round(window.innerHeight * 1.3), behavior: "auto" }));
await mobilePage.waitForTimeout(300);
const mobileAfterAdvance = await mobilePage.evaluate(() => {
  const header = document.querySelector(".site-header");
  if (!(header instanceof HTMLElement)) throw new Error("Mobile site header is missing after scroll.");
  return { opacity: Number.parseFloat(getComputedStyle(header).opacity), pointerEvents: getComputedStyle(header).pointerEvents, top: Math.round(header.getBoundingClientRect().top) };
});
if (mobileAfterAdvance.opacity < 0.95 || mobileAfterAdvance.pointerEvents === "none" || mobileAfterAdvance.top !== 0) {
  throw new Error(`Header should remain fixed and usable after mobile scroll: ${JSON.stringify(mobileAfterAdvance)}`);
}
await mobilePage.close();

console.log(`Opening header behavior verified: ${JSON.stringify({ duringSequence, afterSequence, mobileDuringSequence, mobileAfterAdvance })}`);
await browser.close();
