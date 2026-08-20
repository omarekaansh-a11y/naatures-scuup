import { readFile, writeFile } from "node:fs/promises";

const sourcePath = "/home/ubuntu/page_texts/magicpin.in_Kanpur_Mall-Road_Restaurant_Naatures-Scuup_store_1a958b_delivery_mxStickyTabs_1.md";
const outputPath = "/home/ubuntu/naatures-scuup/price-data/magicpin-public-prices.json";
const source = await readFile(sourcePath, "utf8");
const lines = source.split("\n").map((line) => line.trim());
const prices = {};

for (let index = 1; index < lines.length; index += 1) {
  const match = lines[index].match(/^₹(\d+)$/);
  if (!match) continue;
  const itemName = lines[index - 1];
  if (!itemName || /items$|^\[|^₹|^\d+ items$/.test(itemName)) continue;
  prices[itemName] = Number(match[1]);
}

await writeFile(outputPath, `${JSON.stringify(prices, null, 2)}\n`);
console.log(`Extracted ${Object.keys(prices).length} public price pairs to ${outputPath}`);
