import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const atlas = readFileSync(resolve(process.cwd(), "client/src/components/LocationAtlas.tsx"), "utf8");
const map = readFileSync(resolve(process.cwd(), "client/src/components/Map.tsx"), "utf8");
const styles = readFileSync(resolve(process.cwd(), "client/src/components/StructuralStyles.tsx"), "utf8");
const printStyles = readFileSync(resolve(process.cwd(), "client/src/tactile-print.css"), "utf8");

describe("interactive visit map", () => {
  it("keeps the location discoverable through a real interactive Google Map and directions link", () => {
    expect(atlas).toContain("MapView");
    expect(atlas).toContain("window.google.maps.Marker");
    expect(atlas).toContain("google.com/maps/search/?api=1");
    expect(atlas).toContain("Directions");
  });

  it("uses a wider real-world map view with native gestures and nearby landmark context", () => {
    expect(atlas).toContain("The Mall");
    expect(atlas).toContain('initialZoom={17}');
    expect(atlas).toContain("map.setZoom(17)");
    expect(atlas).toContain("Use two fingers to explore");
    expect(atlas).not.toContain('aria-label="Zoom in"');
    expect(atlas).not.toContain("visit-map__fallback");
    expect(map).toContain("__naaturesMapsReady");
  });

  it("keeps maximalist decoration behind the interactive map and directions controls", () => {
    expect(atlas).toContain("maximalist-map print-surface print-surface--dark");
    expect(atlas).toContain("layered-image-depth layered-image-depth--map");
    expect(atlas).toContain("visit-map__material-image");
    expect(atlas).toContain("print-edge-boil--rough");
    expect(atlas).not.toContain("visit-card");
    expect(printStyles).toContain("pointer-events:none");
    expect(printStyles).toContain("visit-map .visit-map__directions");
  });
});
