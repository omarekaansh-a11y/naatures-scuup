import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const viewportCases = [
  { width: 320, height: 640 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
];
const allResults = [];

for (const viewport of viewportCases) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => {
    const video = document.querySelector(".ice-orbit__video");
    return video instanceof HTMLVideoElement && video.readyState >= 2;
  });
  await page.waitForFunction(() => {
    const prompt = document.querySelector(".ice-orbit__scroll-prompt");
    return prompt instanceof HTMLButtonElement && !prompt.disabled && !document.querySelector(".ice-orbit__scroll-button");
  });

  const before = await page.evaluate(() => {
    const stage = document.querySelector(".ice-orbit__stage");
    const video = document.querySelector(".ice-orbit__video");
    const story = document.querySelector(".ice-orbit__story");
    const rail = document.querySelector(".ice-orbit__checkpoint-rail");
    const prompt = document.querySelector(".ice-orbit__scroll-prompt");
    const dock = document.querySelector(".mobile-dock");
    const activeStory = document.querySelector('.ice-orbit__story-card[data-active="true"]');
    if (!(stage instanceof HTMLElement) || !(video instanceof HTMLVideoElement) || !(story instanceof HTMLElement) || !(rail instanceof HTMLElement) || !(prompt instanceof HTMLButtonElement) || !(activeStory instanceof HTMLElement)) throw new Error("Mobile hero controls are missing.");
    const stageRect = stage.getBoundingClientRect();
    const promptRect = prompt.getBoundingClientRect();
    const storyRect = activeStory.getBoundingClientRect();
    return {
      storyDisplay: getComputedStyle(story).display,
      railDisplay: getComputedStyle(rail).display,
      activeStoryDisplay: getComputedStyle(activeStory).display,
      activeStoryText: activeStory.innerText.replace(/\s+/g, " ").trim(),
      activeStoryOnStem: storyRect.top >= stageRect.top + stageRect.height * 0.6 && storyRect.bottom <= stageRect.top + stageRect.height * 0.93 && Math.abs((storyRect.left + storyRect.width / 2) - (stageRect.left + stageRect.width / 2)) <= stageRect.width * 0.12,
      videoTransform: getComputedStyle(video).transform,
      circularButtonPresent: Boolean(document.querySelector(".ice-orbit__scroll-button")),
      promptText: prompt.innerText.trim(),
      promptLabel: prompt.getAttribute("aria-label"),
      promptUpperSafe: promptRect.top >= stageRect.top && promptRect.bottom <= stageRect.top + stageRect.height * 0.18,
      scrollY: window.scrollY,
    };
  });

  if (before.storyDisplay !== "block" || before.railDisplay !== "none" || before.activeStoryDisplay !== "block" || !before.activeStoryText.includes("KANPUR'S FIRST live scoop.") || !before.activeStoryOnStem || !before.videoTransform.includes("2.72") || before.circularButtonPresent || before.promptText !== "SCROLL!" || before.promptLabel !== "Scroll to the next part of the story" || !before.promptUpperSafe) {
    throw new Error(`Focused mobile opening state failed at ${viewport.width}x${viewport.height}: ${JSON.stringify(before)}`);
  }

  const chapters = [
    { expectedIndex: 0, expectedText: "live scoop.", expectedZone: "base" },
    { expectedIndex: 1, expectedText: "made live.", expectedZone: "base" },
    { expectedIndex: 2, expectedText: "every craving.", expectedZone: "base" },
    { expectedIndex: 3, expectedText: "find your craving.", expectedZone: "base" },
    { expectedIndex: 4, expectedText: "#freeze the happiness", expectedZone: "base" },
  ];
  const mobileChapters = [];
  for (const [chapterIndex, chapter] of chapters.entries()) {
    if (chapterIndex > 0) {
      await page.locator(".ice-orbit__scroll-prompt").click();
      await page.waitForTimeout(2_400);
    }
    const chapterResult = await page.evaluate(() => {
      const stage = document.querySelector(".ice-orbit__stage");
      const cards = [...document.querySelectorAll(".ice-orbit__story-card")];
      const active = document.querySelector('.ice-orbit__story-card[data-active="true"]');
      if (!(stage instanceof HTMLElement) || !(active instanceof HTMLElement)) throw new Error("Active mobile story card is missing.");
      const stageRect = stage.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      return {
        top: Math.round(stage.getBoundingClientRect().top),
        activeIndex: cards.indexOf(active),
        activeText: active.innerText.replace(/\s+/g, " ").trim().toLowerCase(),
        visibleCount: cards.filter((card) => getComputedStyle(card).display !== "none").length,
        topRatio: (activeRect.top - stageRect.top) / stageRect.height,
        bottomRatio: (activeRect.bottom - stageRect.top) / stageRect.height,
        centerRatio: (activeRect.left + activeRect.width / 2 - stageRect.left) / stageRect.width,
      };
    });
    const matchesZone = chapter.expectedZone === "stem"
      ? chapterResult.centerRatio >= 0.38 && chapterResult.centerRatio <= 0.62 && chapterResult.topRatio >= 0.42
      : chapter.expectedZone === "left"
        ? chapterResult.centerRatio < 0.44 && chapterResult.topRatio >= 0.38 && chapterResult.topRatio <= 0.64
        : chapter.expectedZone === "right"
          ? chapterResult.centerRatio > 0.56 && chapterResult.topRatio >= 0.36 && chapterResult.topRatio <= 0.62
          : chapterResult.centerRatio >= 0.38 && chapterResult.centerRatio <= 0.62 && (chapter.expectedIndex >= 3 ? chapterResult.topRatio >= 0.56 : chapterResult.topRatio >= 0.62);
    if (Math.abs(chapterResult.top) > 2 || chapterResult.activeIndex !== chapter.expectedIndex || chapterResult.visibleCount !== 1 || !chapterResult.activeText.includes(chapter.expectedText) || !matchesZone) {
      throw new Error(`Mobile story checkpoint is not resolved at ${viewport.width}x${viewport.height}: ${JSON.stringify({ chapter, chapterResult })}`);
    }
    mobileChapters.push(chapterResult);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(160);
  await page.locator(".ice-orbit__scroll-prompt").click();
  await page.waitForTimeout(1_400);
  const afterScrollY = await page.evaluate(() => window.scrollY);
  if (afterScrollY <= before.scrollY + viewport.height * 0.25) {
    throw new Error(`Mobile scroll prompt did not advance the opening sequence at ${viewport.width}x${viewport.height}: ${JSON.stringify({ beforeScrollY: before.scrollY, afterScrollY })}`);
  }

  await page.screenshot({ path: `/home/ubuntu/focused-ice-cream-mobile-${viewport.width}x${viewport.height}.png` });
  allResults.push({ viewport, ...before, mobileChapters, afterScrollY });
  await page.close();
}

console.log(`Focused mobile ice-cream hero verified across devices: ${JSON.stringify(allResults)}`);
await browser.close();
