import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const atlas = readFileSync(resolve(process.cwd(), "client/src/components/LocationAtlas.tsx"), "utf8");
const map = readFileSync(resolve(process.cwd(), "client/src/components/Map.tsx"), "utf8");
const styles = readFileSync(resolve(process.cwd(), "client/src/components/StructuralStyles.tsx"), "utf8");

describe("interactive visit map", () => {
  it("keeps the location discoverable through a real interactive Google Map and directions link", () => {
    expect(atlas).toContain("MapView");
    expect(atlas).toContain("window.google.maps.Marker");
    expect(atlas).toContain("google.com/maps/search/?api=1");
    expect(atlas).toContain("+91 78608 80088");
  });

  it("uses a wider real-world map view with native gestures and nearby landmark context", () => {
    expect(atlas).toContain("The Mall");
    expect(atlas).toContain('initialZoom={14}');
    expect(atlas).toContain("Use two fingers to explore");
    expect(atlas).not.toContain('aria-label="Zoom in"');
    expect(atlas).not.toContain("visit-map__fallback");
    expect(map).toContain("__naaturesMapsReady");
  });
});
