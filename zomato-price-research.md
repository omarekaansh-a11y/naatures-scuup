# Zomato Price Research — Naatures Scuup, Birhana Road

## 20 August 2026

The official Zomato ordering page for the Mall Road/Birhana Road listing exposes dish names and descriptions, but not item-level prices in its public web markup. It states that online ordering is supported only in the mobile app. The official menu tab reports seven food-menu image pages and one beverages-menu page; the first food-menu image is publicly served from Zomato’s CDN.

Because no exact Zomato item-price pairs are visible in the public ordering markup, no price values should be inferred or substituted under a Zomato label. The implementation will retain only price values that can be directly read from a public Zomato menu sheet, or hide unverified prices pending owner confirmation.

The Food thumbnail opens a public seven-sheet gallery. Sheet **1 of 7** visibly includes printed per-item prices for Starters, Soups, Maggi, and South Indian entries. Item-level pricing is therefore available from the official Zomato menu sheets, though it requires page-by-page transcription that preserves the printed dish wording and leaves unmapped items unpriced.

Sources reviewed:

- https://www.zomato.com/kanpur/naatures-scuup-birhana-road/order
- https://www.zomato.com/kanpur/naatures-scuup-birhana-road/menu

## Official printed menu-sheet extraction

The public Zomato listing serves the restaurant’s printed menu through the following official CDN gallery files:

- https://b.zmtcdn.com/data/menus/008/18531008/ce3fbb03583e82719cf759c32bc162ee.jpg
- https://b.zmtcdn.com/data/menus/008/18531008/2f8f02c5a60778a4d08e7413dc8a8d14.jpg
- https://b.zmtcdn.com/data/menus/008/18531008/4b996fc72e82e3695993735262b28340.jpg
- https://b.zmtcdn.com/data/menus/008/18531008/54c91c25ab694d478e3d4ebcdbe8368d.jpg
- https://b.zmtcdn.com/data/menus/008/18531008/6243bba9f6c3d6b4058a66d9d18c7752.jpg
- https://b.zmtcdn.com/data/menus/008/18531008/927a7e387198569dca04b579d812b589.jpg
- https://b.zmtcdn.com/data/menus/008/18531008/fe46467ee46fa3d4d74bbda3015c28f1.jpg
- https://b.zmtcdn.com/data/menus/008/18531008/0faff00ce6026fa8eb2fcbfce3be2bd6.jpg

The sheets were downloaded from the public URLs, split into high-contrast columns, and transcribed locally. The source OCR is stored in `price-data/zomato-ocr-columns.txt`. Only clear pairs from the printed sheets will be mapped to website dishes; ambiguous values will remain hidden rather than inferred.

| Clear public pair | Zomato printed price |
|---|---:|
| Paneer Lababdar | ₹290 |
| Paneer Butter Masala | ₹280 |
| Dahi Kabab | ₹200 |
| Paneer Tikka | ₹250 |
| Pizza Indiana | ₹200 |
| Cheese Burst Pizza | ₹220 |
| Veg Burger | ₹110 |
| Oreo Mud Shake | ₹210 |
| Cold Coffee with Vanilla Ice Cream | ₹140 |
| Belgian Chocolate Ice Cream | ₹70 |
