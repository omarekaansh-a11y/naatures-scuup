import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("http://localhost:3000/menu", { waitUntil: "domcontentloaded" });

const conveyor = page.locator(".menu-conveyor");
await conveyor.scrollIntoViewIfNeeded();
await page.waitForTimeout(250);
const initial = await conveyor.evaluate((element) => element.scrollLeft);
await page.getByRole("button", { name: "Show next menu chapters" }).click();
await page.waitForTimeout(260);
const afterArrow = await conveyor.evaluate((element) => element.scrollLeft);
if (afterArrow <= initial) throw new Error(`Menu chapter right arrow did not scroll the conveyor: ${initial} → ${afterArrow}`);

const box = await conveyor.boundingBox();
if (!box) throw new Error("Menu chapter conveyor could not be measured.");
await page.mouse.move(box.x + box.width * 0.72, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.28, box.y + box.height / 2, { steps: 5 });
await page.mouse.up();
const afterGrab = await conveyor.evaluate((element) => element.scrollLeft);
if (afterGrab <= afterArrow) throw new Error(`Grab scrolling did not move the chapter conveyor: ${afterArrow} → ${afterGrab}`);

console.log(`Menu chapter controls verified: arrow ${initial} → ${afterArrow}; grab → ${afterGrab}.`);
await browser.close();
