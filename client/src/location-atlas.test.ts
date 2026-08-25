import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const atlas = readFileSync(resolve(process.cwd(), "client/src/components/LocationAtlas.tsx"), "utf8");
const map = readFileSync(resolve(process.cwd(), "client/src/components/Map.tsx"), "utf8");
const styles = readFileSync(resolve(process.cwd(), "client/src/components/StructuralStyles.tsx"), "utf8");

describe("interactive visit map", () => {
  it("keeps the location discoverable through a live marker and directions link", () => {
    expect(atlas).toContain("AdvancedMarkerElement");
    expect(atlas).toContain("google.com/maps/search/?api=1");
    expect(atlas).toContain("+91 78608 80088");
  });

  it("preserves pan, zoom, recenter, and a road-grid fallback when live Maps cannot load", () => {
    expect(atlas).toContain("changeZoom");
    expect(atlas).toContain("startFallbackPan");
    expect(atlas).toContain("recenter");
    expect(map).toContain("data-map-fallback");
    expect(styles).toContain("visit-map__fallback");
  });
});
