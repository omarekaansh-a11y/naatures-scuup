import { menuChapters } from "../client/src/lib/menu-data.ts";
import { menuDishPrices } from "../client/src/lib/menu-prices.ts";

const dishes = menuChapters.flatMap((chapter) => chapter.dishes);
const missing = dishes.filter((dish) => menuDishPrices[dish] === undefined);
const orphanedPrices = Object.keys(menuDishPrices).filter((dish) => !dishes.includes(dish));

console.log(JSON.stringify({
  catalogueCount: dishes.length,
  pricedCount: dishes.length - missing.length,
  missingCount: missing.length,
  missing,
  orphanedPrices,
}, null, 2));

if (orphanedPrices.length > 0) {
  process.exitCode = 1;
}
