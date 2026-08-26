import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

const story = await page.locator(".hero--after-story").evaluate((element) => ({
  title: element.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim(),
  eyebrow: element.querySelector(".eyebrow")?.textContent?.trim(),
}));
if (story.title !== "THE SCOOP IS JUSTthe beginning." || story.eyebrow !== "The story continues at the table") {
  throw new Error(`Follow-on hero story does not match the intended continuation: ${JSON.stringify(story)}`);
}

console.log(`Follow-on hero story verified: ${JSON.stringify(story)}`);
await browser.close();
