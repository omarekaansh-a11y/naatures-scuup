import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => document.querySelector(".mobile-scroll-progress") instanceof HTMLElement);
await page.waitForFunction(() => {
  const prompt = document.querySelector(".ice-orbit__scroll-prompt");
  return prompt instanceof HTMLButtonElement && !prompt.disabled && !document.querySelector(".ice-orbit__scroll-button");
});

const initial = await page.evaluate(() => {
  const header = document.querySelector(".site-header");
  const quickTop = document.querySelector(".mobile-quick-top");
  const progress = document.querySelector(".mobile-scroll-progress span");
  const skip = document.querySelector(".mobile-skip-link");
  if (!(header instanceof HTMLElement) || !(quickTop instanceof HTMLButtonElement) || !(progress instanceof HTMLElement) || !(skip instanceof HTMLAnchorElement)) throw new Error("Mobile app enhancements are missing.");
  return { headerTop: Math.round(header.getBoundingClientRect().top), quickTopVisible: quickTop.classList.contains("mobile-quick-top--visible"), progressTransform: getComputedStyle(progress).transform, skipHref: skip.getAttribute("href"), headerReturnControl: document.querySelector(".site-top-control") !== null };
});
if (initial.headerTop !== 0 || initial.quickTopVisible || initial.skipHref !== "#main-content" || initial.headerReturnControl) {
  throw new Error(`Initial mobile enhancement state is incorrect: ${JSON.stringify(initial)}`);
}

await page.evaluate(() => window.scrollTo({ top: Math.round(window.innerHeight * 1.45), behavior: "auto" }));
await page.waitForTimeout(250);
const scrolled = await page.evaluate(() => {
  const header = document.querySelector(".site-header");
  const quickTop = document.querySelector(".mobile-quick-top");
  const progress = document.querySelector(".mobile-scroll-progress span");
  if (!(header instanceof HTMLElement) || !(quickTop instanceof HTMLButtonElement) || !(progress instanceof HTMLElement)) throw new Error("Mobile app enhancements are missing after scroll.");
  return { scrollY: window.scrollY, headerTop: Math.round(header.getBoundingClientRect().top), quickTopVisible: quickTop.classList.contains("mobile-quick-top--visible"), progressTransform: getComputedStyle(progress).transform };
});
if (scrolled.scrollY < 250 || scrolled.headerTop !== 0 || !scrolled.quickTopVisible || scrolled.progressTransform === initial.progressTransform) {
  throw new Error(`Scrolled mobile enhancement state is incorrect: ${JSON.stringify({ initial, scrolled })}`);
}

await page.locator(".mobile-quick-top").click();
await page.waitForTimeout(700);
const afterQuickTop = await page.evaluate(() => window.scrollY);
if (afterQuickTop > 5) throw new Error(`The mobile quick-top control did not return to the page start: ${afterQuickTop}`);

await page.goto("http://localhost:3000/menu", { waitUntil: "domcontentloaded" });
const menuState = await page.evaluate(() => {
  const search = document.querySelector(".menu-search input");
  const results = document.querySelector(".menu-browser__result");
  if (!(search instanceof HTMLInputElement) || !(results instanceof HTMLElement)) throw new Error("Mobile menu search enhancements are missing.");
  return { inputMode: search.inputMode, enterKeyHint: search.enterKeyHint, autocomplete: search.autocomplete, spellcheck: search.spellcheck, live: results.getAttribute("aria-live") };
});
if (menuState.inputMode !== "search" || menuState.enterKeyHint !== "search" || menuState.autocomplete !== "off" || menuState.spellcheck || menuState.live !== "polite") {
  throw new Error(`Mobile menu input ergonomics are incorrect: ${JSON.stringify(menuState)}`);
}

await page.locator('.menu-filter[aria-pressed="false"]').first().click();
await page.waitForTimeout(350);
const categoryNavigation = await page.evaluate(() => ({ focusedId: document.activeElement?.id ?? null, resultTop: Math.round(document.getElementById("menu-results")?.getBoundingClientRect().top ?? -1) }));
if (categoryNavigation.focusedId !== "menu-results") {
  throw new Error(`Mobile category selection should focus the refreshed results: ${JSON.stringify(categoryNavigation)}`);
}

console.log(`Mobile app enhancements verified: ${JSON.stringify({ initial, scrolled, afterQuickTop, menuState, categoryNavigation })}`);
await browser.close();
