import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const cases = [
  { path: "/", viewport: { width: 320, height: 640 } },
  { path: "/", viewport: { width: 390, height: 844 } },
  { path: "/menu", viewport: { width: 320, height: 640 } },
  { path: "/menu", viewport: { width: 1280, height: 900 } },
  { path: "/missing-page", viewport: { width: 390, height: 844 } },
];

const results = [];
for (const testCase of cases) {
  const page = await browser.newPage({ viewport: testCase.viewport, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:3000${testCase.path}`, { waitUntil: "networkidle" });
  const metrics = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    bodyWidth: document.body.scrollWidth,
  }));
  if (metrics.documentWidth > metrics.viewportWidth + 1 || metrics.bodyWidth > metrics.viewportWidth + 1) {
    throw new Error(`Horizontal overflow on ${testCase.path} at ${testCase.viewport.width}×${testCase.viewport.height}: ${JSON.stringify(metrics)}`);
  }
  if (testCase.path === "/missing-page") {
    const guide = await page.locator(".not-found-page__guide").innerText();
    console.log(`Rendered 404 guide: ${guide}`);
    for (const heading of ["What happened", "Why it happened", "What you can do"]) {
      if (!guide.toLowerCase().includes(heading.toLowerCase())) throw new Error(`404 guide is missing ${heading}.`);
    }
    await page.screenshot({ path: "/home/ubuntu/not-found-plain-language-mobile.png", fullPage: true });
  }
  results.push({ path: testCase.path, viewport: testCase.viewport, ...metrics });
  await page.close();
}

console.log(`Page-width and 404 guide verified: ${JSON.stringify(results)}`);
await browser.close();
