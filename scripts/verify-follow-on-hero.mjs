import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

const followOn = await page.locator(".home-after-orbit").evaluate((element) => ({
  handoff: element.hasAttribute("data-layered-handoff"),
  dragIt: Boolean(element.querySelector(".drag-it-section")),
  scoopTitle: element.querySelector("#ice-cream-destination-title")?.textContent?.replace(/\s+/g, " ").trim() ?? "",
}));

if (!followOn.handoff || !followOn.dragIt || !followOn.scoopTitle.toLowerCase().includes("save room") || !followOn.scoopTitle.toLowerCase().includes("scoop")) {
  throw new Error(`Post-cinematic Home experience does not match the current continuation: ${JSON.stringify(followOn)}`);
}

console.log(`Post-cinematic Home experience verified: ${JSON.stringify(followOn)}`);
await browser.close();
