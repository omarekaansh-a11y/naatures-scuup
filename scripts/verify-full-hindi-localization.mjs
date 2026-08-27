import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
const page = await context.newPage();

await page.goto("http://localhost:3000/menu", { waitUntil: "domcontentloaded" });
await page.waitForSelector(".site-language-switcher");
const englishDish = await page.locator(".menu-dish-card h2").first().textContent();
await page.locator('.site-language-switcher__option[lang="hi"]').click();
await page.waitForFunction(() => document.documentElement.lang === "hi");

const hindiMenu = await page.evaluate(() => {
  const titles = [...document.querySelectorAll(".menu-dish-card h2")].map((element) => element.textContent?.trim() ?? "");
  const descriptions = [...document.querySelectorAll(".menu-dish-card__note")].map((element) => element.textContent?.trim() ?? "");
  const cards = document.querySelectorAll(".menu-dish-card");
  return {
    titleCount: titles.length,
    latinTitles: titles.filter((title) => /[A-Za-z]/.test(title)),
    latinDescriptions: descriptions.filter((description) => /[A-Za-z]/.test(description)),
    firstTitle: titles[0],
    menuHeading: document.querySelector("#full-menu-title")?.textContent?.replace(/\s+/g, " ").trim(),
    cards: cards.length,
  };
});
await page.screenshot({ path: "/home/ubuntu/hindi-menu-localization.png", fullPage: false });
await page.locator(".menu-dish-card").first().scrollIntoViewIfNeeded();
await page.screenshot({ path: "/home/ubuntu/hindi-menu-card-localization.png", fullPage: false });

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForSelector("#reviews");
await page.evaluate(() => {
  const video = document.querySelector(".ice-orbit__video");
  if (!video) return;
  Object.defineProperty(video, "ended", { configurable: true, get: () => true });
  video.dispatchEvent(new Event("ended"));
});
await page.waitForTimeout(80);
const hindiHome = await page.evaluate(() => ({
  lang: document.documentElement.lang,
  cinematic: document.querySelector(".ice-orbit__story-copy")?.textContent?.trim(),
  reviews: document.querySelector("#reviews")?.textContent?.replace(/\s+/g, " ").trim(),
  faq: document.querySelector("#faq")?.textContent?.replace(/\s+/g, " ").trim(),
  footer: document.querySelector(".site-footer")?.textContent?.replace(/\s+/g, " ").trim(),
  mapButton: document.querySelector(".visit-map__directions")?.textContent?.trim(),
}));
await page.locator("#reviews").scrollIntoViewIfNeeded();
await page.screenshot({ path: "/home/ubuntu/hindi-home-reviews-localization.png", fullPage: false });

await page.goto("http://localhost:3000/menu", { waitUntil: "domcontentloaded" });
await page.locator('.site-language-switcher__option[lang="en"]').click();
await page.waitForFunction(() => document.documentElement.lang === "en");
const restoredEnglishDish = await page.locator(".menu-dish-card h2").first().textContent();

const completeHindiMenu = hindiMenu.titleCount === 204 && hindiMenu.cards === 204 && hindiMenu.latinTitles.length === 0 && hindiMenu.latinDescriptions.length === 0 && /[\u0900-\u097F]/.test(hindiMenu.firstTitle ?? "") && /बहुत-सी/.test(hindiMenu.menuHeading ?? "");
const completeHindiHome = hindiHome.lang === "hi" && /कानपुर/.test(hindiHome.cinematic ?? "") && /डाइनर रिव्यू/.test(hindiHome.reviews ?? "") && /जानना/.test(hindiHome.faq ?? "") && /हमें खोजें/.test(hindiHome.footer ?? "") && /दिशा-निर्देश/.test(hindiHome.mapButton ?? "");

if (!completeHindiMenu || !completeHindiHome || !englishDish?.includes("Hara Bhara Kabab") || !restoredEnglishDish?.includes("Hara Bhara Kabab")) {
  throw new Error(`Complete Hindi localization verification failed: ${JSON.stringify({ englishDish, hindiMenu, hindiHome, restoredEnglishDish })}`);
}

console.log(`Complete Hindi localization verified: ${JSON.stringify({ englishDish, hindiMenu, hindiHome, restoredEnglishDish })}`);
await browser.close();
