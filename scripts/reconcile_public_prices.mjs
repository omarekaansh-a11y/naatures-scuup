import { readFile, writeFile } from "node:fs/promises";

const menuSourcePath = "/home/ubuntu/naatures-scuup/client/src/lib/menu-data.ts";
const priceSourcePath = "/home/ubuntu/naatures-scuup/price-data/magicpin-public-prices.json";
const outputPath = "/home/ubuntu/naatures-scuup/client/src/lib/menu-prices.ts";
const reportPath = "/home/ubuntu/naatures-scuup/price-data/public-price-reconciliation.md";
const normalise = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const menuSource = await readFile(menuSourcePath, "utf8");
const sourcePrices = JSON.parse(await readFile(priceSourcePath, "utf8"));
const dishes = [...menuSource.matchAll(/dishes: \[(.*?)\] },/gs)]
  .flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((dish) => dish[1]));
const pricesByNormalisedName = new Map(Object.entries(sourcePrices).map(([dish, price]) => [normalise(dish), price]));
const matched = Object.fromEntries(dishes.flatMap((dish) => {
  const price = pricesByNormalisedName.get(normalise(dish));
  return price === undefined ? [] : [[dish, price]];
}));
const unmatched = dishes.filter((dish) => !(dish in matched));

const output = `/** Publicly visible Magicpin prices, matched by normalized dish name on 20 August 2026. */\nexport const publicDishPrices: Record<string, number> = ${JSON.stringify(matched, null, 2)};\n`;
const report = `# Public Price Reconciliation\n\n| Measure | Value |\n|---|---:|\n| Displayed dishes | ${dishes.length} |\n| Verified public price matches | ${Object.keys(matched).length} |\n| Items without a verified public match | ${unmatched.length} |\n\n## Items without a verified public price\n\n${unmatched.map((dish) => `- ${dish}`).join("\n")}\n`;

await writeFile(outputPath, output);
await writeFile(reportPath, report);
console.log(`Matched ${Object.keys(matched).length} of ${dishes.length} dishes; ${unmatched.length} remain unpriced.`);
