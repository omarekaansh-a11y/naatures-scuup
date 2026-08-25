import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => {
  const canvas = document.querySelector(".ice-orbit__canvas");
  return canvas instanceof HTMLCanvasElement && canvas.width > 0 && canvas.height > 0;
});
await page.waitForTimeout(750);

const inspect = async (scrollOffset) => {
  await page.evaluate((offset) => {
    const section = document.querySelector(".ice-orbit");
    if (!section) throw new Error("Canvas sequence section is missing.");
    window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY + offset);
  }, scrollOffset);
  await page.waitForTimeout(350);
  return page.evaluate(() => {
    const stage = document.querySelector(".ice-orbit__stage");
    const canvas = document.querySelector(".ice-orbit__canvas");
    if (!(stage instanceof HTMLElement) || !(canvas instanceof HTMLCanvasElement)) throw new Error("Canvas stage is missing.");
    const stageRect = stage.getBoundingClientRect();
    return { top: Math.round(stageRect.top), height: Math.round(stageRect.height), canvasWidth: canvas.width, canvasHeight: canvas.height, viewportHeight: window.innerHeight };
  });
};

const start = await inspect(100);
const middle = await inspect(1000);
await page.screenshot({ path: "/home/ubuntu/ai-still-sequence-mid.png" });
if (Math.abs(start.top) > 2 || Math.abs(middle.top) > 2) throw new Error(`Sequence was not pinned: start=${start.top}, middle=${middle.top}`);
if (start.height !== start.viewportHeight || start.canvasWidth < 1200 || start.canvasHeight < 850) throw new Error(`Canvas is not full viewport or sharp: ${JSON.stringify(start)}`);

console.log(`Pinned sequence verified: ${JSON.stringify({ start, middle })}`);
await browser.close();
