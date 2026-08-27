import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const app = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
const context = readFileSync(resolve(process.cwd(), "client/src/contexts/LanguageContext.tsx"), "utf8");
const header = readFileSync(resolve(process.cwd(), "client/src/components/SiteHeader.tsx"), "utf8");
const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const menu = readFileSync(resolve(process.cwd(), "client/src/pages/MenuPage.tsx"), "utf8");
const styles = readFileSync(resolve(process.cwd(), "client/src/tactile-print.css"), "utf8");

describe("English/Hindi language switcher", () => {
  it("defaults to English and persists the selected document language", () => {
    expect(context).toContain('return storedLanguage === "hi" ? "hi" : "en"');
    expect(context).toContain('document.documentElement.lang = language === "hi" ? "hi" : "en"');
    expect(context).toContain('window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)');
    expect(app).toContain("<LanguageProvider>");
  });

  it("places an accessible EN/Hindi pill in the shared header used by both routes", () => {
    expect(header).toContain('className="site-language-switcher"');
    expect(header).toContain('aria-pressed={language === "en"}');
    expect(header).toContain('aria-pressed={language === "hi"}');
    expect(header).toContain('lang="hi">हि</button>');
    expect(styles).toContain(".site-language-switcher{display:inline-flex");
    expect(styles).toContain("body .site-header .site-language-switcher__option{min-width:31px;min-height:34px}");
  });

  it("connects the selected language to primary Home and Full Menu interface copy", () => {
    expect(home).toContain("const copy = homeCopy[language]");
    expect(home).toContain("<DragFoodCanvas items={localizedFoodCanvasItems} language={language} />");
    expect(menu).toContain("const copy = menuCopy[language]");
    expect(menu).toContain("localizeChapterTitle(slug, title, language)");
    expect(menu).toContain("placeholder={copy.searchPlaceholder}");
  });
});
