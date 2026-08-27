import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

await page.goto("https://scfo.de/", { waitUntil: "networkidle", timeout: 30_000 });
await page.screenshot({ path: "/home/ubuntu/scfo-mobile-reference.png", fullPage: false });

const mobileReference = await page.evaluate(() => ({
  viewport: { width: window.innerWidth, height: window.innerHeight },
  heading: document.querySelector("h1")?.textContent?.trim() ?? null,
  bodyScrollHeight: document.documentElement.scrollHeight,
  rootOverflowX: getComputedStyle(document.documentElement).overflowX,
}));

console.log(JSON.stringify(mobileReference));
await browser.close();
