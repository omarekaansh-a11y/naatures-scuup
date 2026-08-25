import { describe, expect, it } from "vitest";

describe("opening-hours source confirmation", () => {
  it("provides the user-confirmed regular-hours marker to the test runtime", async () => {
    const sourceMarker = process.env.NAATURES_HOURS_CONFIRMATION;
    const response = new Response(JSON.stringify({ sourceMarker }), {
      headers: { "content-type": "application/json" },
    });
    const payload = (await response.json()) as { sourceMarker?: string };

    expect(payload.sourceMarker).toContain("Regular weekly hours confirmed by user");
  });
});

export {};
