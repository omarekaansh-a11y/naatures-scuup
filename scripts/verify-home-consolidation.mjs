import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => {
  const video = document.querySelector(".ice-orbit__video");
  return video instanceof HTMLVideoElement && video.readyState >= 2;
});

const initial = await page.evaluate(() => {
  const handoff = document.querySelector(".ice-orbit + .home-after-orbit");
  return {
    redundantHero: document.querySelector(".hero--after-story") !== null,
    nextSectionClass: handoff?.className,
    firstSeamClass: handoff?.querySelector(":scope > .organic-wave")?.className,
  };
});

if (initial.redundantHero || !String(initial.nextSectionClass).includes("home-after-orbit") || !String(initial.firstSeamClass).includes("organic-wave--cream-to-maroon")) {
  throw new Error(`Homepage hero consolidation failed: ${JSON.stringify(initial)}`);
}

await page.evaluate(() => {
  const opening = document.querySelector(".ice-orbit");
  if (opening instanceof HTMLElement) opening.style.display = "none";
  document.querySelector("#ice-cream-destination")?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(300);

const destination = await page.evaluate(() => {
  const section = document.querySelector("#ice-cream-destination");
  const actions = document.querySelector(".ice-cream-destination__actions");
  const facts = [...document.querySelectorAll(".ice-cream-destination__facts span")].map((item) => item.textContent?.replace(/\s+/g, " ").trim());
  const title = document.querySelector("#ice-cream-destination-title");
  if (!(section instanceof HTMLElement) || !(actions instanceof HTMLElement) || !(title instanceof HTMLElement)) throw new Error("Consolidated scoop destination is missing.");
  return {
    title: title.textContent?.replace(/\s+/g, " ").trim(),
    copy: section.textContent?.replace(/\s+/g, " ").trim(),
    factCount: facts.length,
    facts,
    actionCount: actions.querySelectorAll("a, button").length,
  };
});

if (!destination.title?.includes("Save room.") || !destination.copy?.includes("South Indian favourites") || destination.factCount !== 3 || !destination.facts.some((fact) => fact?.includes("100%")) || !destination.facts.some((fact) => fact?.includes("231 DISHES")) || !destination.facts.some((fact) => fact?.includes("MALL ROAD")) || destination.actionCount !== 2) {
  throw new Error(`Consolidated scoop destination failed: ${JSON.stringify(destination)}`);
}

await page.screenshot({ path: "/home/ubuntu/consolidated-scoop-mobile.png" });
console.log(`Homepage consolidation verified: ${JSON.stringify({ initial, destination })}`);
await browser.close();
