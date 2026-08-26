import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});

const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });

const stack = page.locator(".drag-it-stack");
const next = page.getByRole("button", { name: "Show next food moment" });
await stack.scrollIntoViewIfNeeded();
await page.waitForTimeout(350);

const observed = [];
for (let step = 0; step < 6; step += 1) {
  observed.push(Number(await stack.getAttribute("data-card-index")));
  if (step === 5) break;
  await next.click();
  await page.waitForTimeout(780);
}

const expected = [1, 2, 3, 4, 5, 1];
if (observed.join(",") !== expected.join(",")) {
  throw new Error(`Drag It order is not a stable five-card loop: expected ${expected.join(" → ")}, received ${observed.join(" → ")}`);
}

console.log(`Drag It ordered loop verified: ${observed.join(" → ")}`);
await browser.close();
