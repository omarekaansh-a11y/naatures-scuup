import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { menuChapters } from "@/lib/menu-data";
import { cinematicCopy, footerCopy, localizeMenuChapterDetail, localizeMenuDishDescription, localizeMenuDishName, mapCopy, reviewCopy } from "@/lib/language-copy";

const devanagari = /[\u0900-\u097F]/;
const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const orbit = readFileSync(resolve(process.cwd(), "client/src/components/IceCreamOrbit.tsx"), "utf8");
const reviews = readFileSync(resolve(process.cwd(), "client/src/components/GoogleReviews.tsx"), "utf8");
const footer = readFileSync(resolve(process.cwd(), "client/src/components/SiteFooter.tsx"), "utf8");
const atlas = readFileSync(resolve(process.cwd(), "client/src/components/LocationAtlas.tsx"), "utf8");

describe("complete Hindi localization", () => {
  it("translates every verified menu dish title into Hindi-script text while English retains source titles", () => {
    const dishes = menuChapters.flatMap((chapter) => chapter.dishes);
    expect(dishes).toHaveLength(231);
    const translations = dishes.map((dish) => localizeMenuDishName(dish, "hi"));
    expect(translations).toHaveLength(231);
    expect(translations.every((translation, index) => translation !== dishes[index] && devanagari.test(translation) && !/[A-Za-z]/.test(translation))).toBe(true);
    expect(dishes.every((dish) => localizeMenuDishName(dish, "en") === dish)).toBe(true);
  });

  it("uses Hindi descriptions for every menu chapter rather than displaying English fallback copy", () => {
    expect(menuChapters.every((chapter) => {
      const description = localizeMenuDishDescription(chapter.slug, chapter.detail, "hi");
      return description !== chapter.detail && devanagari.test(description) && !/[A-Za-z]/.test(description) && localizeMenuChapterDetail(chapter.slug, chapter.detail, "hi") === description;
    })).toBe(true);
  });

  it("wires the reported Home sections to shared Hindi copy without changing source-review provenance", () => {
    expect(orbit).toContain("const copy = cinematicCopy[language]");
    expect(reviews).toContain("const copy = reviewCopy[language]");
    expect(reviews).toContain('language === "hi" ? review.translation : review.text');
    expect(footer).toContain("const copy = footerCopy[language]");
    expect(atlas).toContain("const copy = mapCopy[language]");
    expect(home).toContain("copy.beforeVisit");
    expect(cinematicCopy.hi.cravingCopy).toMatch(devanagari);
    expect(reviewCopy.hi.titleStart).toMatch(devanagari);
    expect(footerCopy.hi.descriptor).toMatch(devanagari);
    expect(mapCopy.hi.directions).toMatch(devanagari);
  });
});
