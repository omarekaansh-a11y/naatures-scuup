import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
const page = await context.newPage();

await page.goto("http://localhost:3000/menu", { waitUntil: "domcontentloaded" });
await page.waitForSelector(".site-language-switcher");

const initial = await page.evaluate(() => ({
  lang: document.documentElement.lang,
  englishPressed: document.querySelector('.site-language-switcher__option[lang="en"]')?.getAttribute("aria-pressed"),
  hindiPressed: document.querySelector('.site-language-switcher__option[lang="hi"]')?.getAttribute("aria-pressed"),
  stored: window.localStorage.getItem("naatures-scuup-language"),
}));

await page.locator('.site-language-switcher__option[lang="hi"]').click();
await page.waitForFunction(() => document.documentElement.lang === "hi");
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForSelector("#drag-it-title");
const hindiHome = await page.locator("#drag-it-title").textContent();

await page.goto("http://localhost:3000/menu", { waitUntil: "domcontentloaded" });
await page.waitForSelector("#full-menu-title");
const hindiMenu = await page.evaluate(() => ({
  lang: document.documentElement.lang,
  stored: window.localStorage.getItem("naatures-scuup-language"),
  title: document.querySelector("#full-menu-title")?.textContent?.replace(/\s+/g, " ").trim(),
  hindiPressed: document.querySelector('.site-language-switcher__option[lang="hi"]')?.getAttribute("aria-pressed"),
}));

await page.locator('.site-language-switcher__option[lang="en"]').click();
await page.waitForFunction(() => document.documentElement.lang === "en");
const englishMenu = await page.locator("#full-menu-title").textContent();

const mobile = await context.newPage();
await mobile.setViewportSize({ width: 390, height: 844 });
await mobile.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await mobile.waitForSelector(".site-language-switcher");
const mobileLayout = await mobile.evaluate(() => {
  const switcher = document.querySelector(".site-language-switcher")?.getBoundingClientRect();
  const menu = document.querySelector(".site-menu-toggle")?.getBoundingClientRect();
  const header = document.querySelector(".site-header")?.getBoundingClientRect();
  const options = [...document.querySelectorAll(".site-language-switcher__option")].map((option) => option.getBoundingClientRect());
  if (!switcher || !menu || !header) throw new Error("Language header controls are missing.");
  return {
    switcherWidth: Math.round(switcher.width),
    switcherInsideHeader: switcher.left >= header.left && switcher.right <= header.right,
    menuInsideHeader: menu.left >= header.left && menu.right <= header.right,
    separated: switcher.right <= menu.left || menu.right <= switcher.left,
    optionWidths: options.map((option) => Math.round(option.width)),
  };
});

if (initial.lang !== "en" || initial.englishPressed !== "true" || initial.hindiPressed !== "false" || hindiHome?.includes("Drag into") || hindiMenu.lang !== "hi" || hindiMenu.stored !== "hi" || hindiMenu.hindiPressed !== "true" || !hindiMenu.title?.includes("बहुत-सी") || !englishMenu?.includes("Many cravings") || !mobileLayout.switcherInsideHeader || !mobileLayout.menuInsideHeader || !mobileLayout.separated || mobileLayout.optionWidths.some((width) => width < 29)) {
  throw new Error(`Language switcher verification failed: ${JSON.stringify({ initial, hindiHome, hindiMenu, englishMenu, mobileLayout })}`);
}

console.log(`Language switcher verified: ${JSON.stringify({ initial, hindiHome, hindiMenu, englishMenu, mobileLayout })}`);
await browser.close();
