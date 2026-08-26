import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const documentHead = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
const notFound = readFileSync(resolve(process.cwd(), "client/src/pages/NotFound.tsx"), "utf8");
const routeMeta = readFileSync(resolve(process.cwd(), "client/src/components/RouteMeta.tsx"), "utf8");
const publicPageSources = [
  documentHead,
  readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8"),
  readFileSync(resolve(process.cwd(), "client/src/pages/MenuPage.tsx"), "utf8"),
  notFound,
].join("\n");

describe("site recovery and social metadata", () => {
  it("provides branded descriptions, canonical sharing data, and a custom favicon", () => {
    expect(documentHead).toContain('name="description"');
    expect(documentHead).toContain("mango ice cream");
    expect(documentHead).toContain("vegan options");
    expect(documentHead).toContain('name="google-site-verification"');
    expect(documentHead).toContain('rel="canonical"');
    expect(documentHead).toContain('property="og:image"');
    expect(documentHead).toContain('name="twitter:image"');
    expect(documentHead).toContain('href="/favicon.png?v=3"');
    expect(documentHead).toContain('href="/favicon.ico?v=3"');
    expect(documentHead).toContain('href="/apple-touch-icon.png?v=3"');
    expect(documentHead).toContain('"@type": "Restaurant"');
    expect(documentHead).toContain('"openingHoursSpecification"');
    expect(documentHead).toContain('"dayOfWeek": ["Monday", "Tuesday", "Thursday", "Friday", "Saturday", "Sunday"]');
    expect(documentHead).toContain('"opens": "11:00"');
    expect(documentHead).toContain('"dayOfWeek": ["Wednesday"]');
    expect(documentHead).toContain('"opens": "10:00"');
    expect(documentHead).toContain('"closes": "23:00"');
  });

  it("keeps the custom 404 route useful and out of search indexing", () => {
    expect(notFound).toContain("What happened");
    expect(notFound).toContain("Why it happened");
    expect(notFound).toContain("What you can do");
    expect(notFound).toContain("The page you tried to open is not available here.");
    expect(notFound).toContain("href=\"/\"");
    expect(notFound).toContain('href="/menu"');
    expect(notFound).toContain('href="/#location"');
    expect(notFound).toContain("noIndex");
    expect(routeMeta).toContain("noindex,follow");
  });

  it("does not expose third-party delivery platform names in public site content", () => {
    expect(publicPageSources).not.toMatch(/swiggy|zomato/i);
  });
});
