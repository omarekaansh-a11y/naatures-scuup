import { chromium } from "playwright";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const browser = await chromium.launch({
  headless: true,
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => {
  const canvas = document.querySelector(".ice-orbit__canvas");
  return canvas instanceof HTMLCanvasElement && canvas.width > 0 && canvas.height > 0;
});
await page.waitForTimeout(750);

const readSignature = async (offset) => {
  await page.evaluate((nextOffset) => {
    const section = document.querySelector(".ice-orbit");
    if (!section) throw new Error("Canvas sequence section is missing.");
    window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY + nextOffset);
  }, offset);
  await page.waitForTimeout(1100);
  const screenshotPath = `/home/ubuntu/frame-progress-${offset}.png`;
  await page.screenshot({ path: screenshotPath });
  return createHash("sha256").update(readFileSync(screenshotPath)).digest("hex");
};

const signatures = [];
for (const offset of [120, 850, 1600, 2450]) signatures.push(await readSignature(offset));
if (new Set(signatures).size < 3) throw new Error(`Canvas did not advance through distinct frames: ${JSON.stringify(signatures)}`);

console.log(`Continuous frame progress verified: ${JSON.stringify(signatures)}`);
await browser.close();
