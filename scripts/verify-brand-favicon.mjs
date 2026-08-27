import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

const iconHref = await page.locator('link[rel="icon"]').getAttribute("href");
const iconLoad = await page.evaluate(async (href) => {
  const response = await fetch(href);
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);
  return { ok: response.ok, contentType: response.headers.get("content-type"), width: bitmap.width, height: bitmap.height };
}, iconHref);

if (iconHref !== "/favicon.png?v=3") throw new Error(`Unexpected favicon reference: ${iconHref}`);
if (!iconLoad.ok || iconLoad.width !== 512 || iconLoad.height !== 512 || !iconLoad.contentType?.includes("image/png")) {
  throw new Error(`Favicon failed browser verification: ${JSON.stringify(iconLoad)}`);
}

console.log(`Brand favicon verified: ${iconHref} (${iconLoad.width}×${iconLoad.height}, ${iconLoad.contentType})`);
await browser.close();
