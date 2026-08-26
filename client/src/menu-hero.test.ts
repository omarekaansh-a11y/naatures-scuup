import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const heroStyles = readFileSync(
  resolve(process.cwd(), "client/src/menu-chapter-visuals.css"),
  "utf8",
);
const menuPage = readFileSync(resolve(process.cwd(), "client/src/pages/MenuPage.tsx"), "utf8");

describe("Full Menu hero background", () => {
  it("uses the generated background without a gradient and keeps the heading in a high-contrast green label", () => {
    expect(heroStyles).toContain(
      "/manus-storage/naatures-scuup-menu-hero-custom_6f7d6358.png",
    );
    expect(heroStyles).toContain(
      ".menu-page .menu-page-hero{background:url('/manus-storage/naatures-scuup-menu-hero-custom_6f7d6358.png')",
    );
  });

  it("retains an unfiltered dedicated mobile image treatment for readable hero labels", () => {
    expect(heroStyles).toContain(
      "@media(max-width:640px){.menu-page .menu-page-hero{background:url('/manus-storage/naatures-scuup-menu-hero-custom_6f7d6358.png')",
    );
  });

  it("keeps the Full Menu hero free of the removed craving-atlas tagline", () => {
    expect(menuPage).not.toContain("Mall Road craving atlas");
  });
});
