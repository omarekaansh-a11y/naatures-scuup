import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const heroStyles = readFileSync(
  resolve(process.cwd(), "client/src/menu-chapter-visuals.css"),
  "utf8",
);
const menuPage = readFileSync(resolve(process.cwd(), "client/src/pages/MenuPage.tsx"), "utf8");

describe("Full Menu hero background", () => {
  it("uses the generated background with a desktop text-safe overlay", () => {
    expect(heroStyles).toContain(
      "/manus-storage/naatures-scuup-menu-hero-elevated_ccd4e633.png",
    );
    expect(heroStyles).toContain(
      ".menu-page .menu-page-hero{background:linear-gradient(90deg",
    );
  });

  it("retains a dedicated mobile treatment for readable hero copy", () => {
    expect(heroStyles).toContain(
      "@media(max-width:640px){.menu-page .menu-page-hero{background:linear-gradient(180deg",
    );
  });

  it("keeps the Full Menu hero free of the removed craving-atlas tagline", () => {
    expect(menuPage).not.toContain("Mall Road craving atlas");
  });
});
