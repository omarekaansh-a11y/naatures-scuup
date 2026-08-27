/**
 * Style reminder — Mall Road Monograph: the Full Menu remains a calm reading room where every category opens as a unique, image-backed editorial chapter.
 * Dish notes are concise menu descriptions and the editorial images are restaurant-specific food visuals.
 */
import { ArrowDownRight, ChevronDown, ChevronLeft, ChevronRight, Leaf, MapPin, Search } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Fragment, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "wouter";
import { SiteFooter } from "@/components/SiteFooter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MobileVisitDock } from "@/components/MobileVisitDock";
import { OrganicWaveDivider } from "@/components/OrganicWaveDivider";
import { RouteMeta } from "@/components/RouteMeta";
import { menuChapters, menuItemCount } from "@/lib/menu-data";
import { menuDishPrices } from "@/lib/menu-prices";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeChapterTitle, menuCopy } from "@/lib/language-copy";

const dishNotes: Record<string, string> = {
  "Dahi Kabab":"Classic, creamy Indian appetizer.","Paneer Tikka":"Soft paneer marinated in aromatic spices.","Hara Bhara Kabab":"Tender vegetarian kabab with mint notes.","Paneer Afghani Tikka":"Fragrant spiced paneer, grilled.","Crispy Corn":"Crunchy corn fritters for snacking.","Chinese Bhel":"Crisp, crunchy Chinese-style bhel.","Dahi Kabab Roll":"Crispy, juicy kababs for a quick bite.","Paneer 65":"Crispy paneer with peppers in spicy sauce.",
  "Onion Salad":"Crunchy onion side for the main course.","Cucumber Salad":"Light cucumber salad with a tangy finish.","Green Salad":"Lettuce, tomato, carrot and cucumber.","Mix Fruit Salad":"Seasonal fruit salad.","Cream of Tomato Soup":"Rich, creamy tomato soup.","Hot and Sour Soup":"A warming, flavourful hot-and-sour soup.","Manchow Soup":"Comforting vegetables and spices in a bowl.","Veg Corn Soup":"Hearty corn and vegetable soup.",
  "Paneer Lababdar":"Creamy paneer curry in tomato gravy.","Paneer Butter Masala":"Paneer in buttery tomato gravy.","Shahi Paneer":"Creamy-and-spicy paneer preparation.","Kadai Paneer":"Spiced paneer and vegetables in rich curry.","Malai Kofta":"Soft koftas in a rich creamy gravy.","Dal Makhani":"Creamy black lentils with tomato and spices.","Mushroom Masala":"Tender mushrooms in aromatic masala.","Pindi Chana":"Punjabi chickpeas with aromatic herbs and spice.",
  "Veg Biryani":"Fragrant vegetable rice with spices.","Hyderabadi Dum Biryani":"Flavourful rice in Hyderabad tradition.","Jeera Rice":"Fragrant rice with cumin and spice.","Kashmiri Pulao":"Traditional aromatic rice preparation.","Lemon Rice":"Light rice with a subtle lemon note.","Curd Rice":"Creamy rice made with fresh curd.","Veg Pulao":"Vegetable-and-spice one-pot rice.","Cheese Pulao":"Basmati rice with cheese and spices.",
  "Paneer Dosa":"Crisp paneer dosa with sambar and chutney.","Plain Dosa":"Thin, crisp South Indian pancake.","Uttapam":"Classic South Indian griddled savoury favourite.",
  "Veg Manchurian":"Vegetable balls in tangy sauce.","Chilli Paneer":"Lively Indo-Chinese paneer favourite.","Paneer Manchurian":"Paneer in flavourful Indo-Chinese sauce.","Fried Rice":"Chinese-style rice with vegetables.","Schezwan Rice":"Rice in spicy-tangy Schezwan sauce.","Veg Chowmein":"Vegetables and noodles, wok-tossed.","Hakka Noodles with Gravy":"Fried Hakka noodles with savoury gravy.","American Chopsuey":"Mixed vegetables in a spicy sauce.",
  "Pizza Indiana":"10-inch pizza for a little more of everything.","Cheese Burst Pizza":"Cheesy goodness in every bite.","Chilli Paneer Pizza":"Paneer pizza with a chilli-spiced profile.","Paneer Pizza":"Paneer with tangy tomato sauce.","Cheese Mushroom Pizza":"Rich blend of cheese and mushroom.","Alfredo White Sauce":"White-sauce pasta.","Arrabiata Red Sauce":"Red-sauce pasta.","Rosato Pink Sauce Pasta":"Pasta in light rosato pink sauce.",
  "Cheese Burger":"Soft bun with a generous cheese filling.","Veg Burger":"Crisp vegetarian burger with juicy centre.","Paneer Sandwich":"Paneer and vegetables in a soft sandwich.","Honey Chilli Potato":"Sweet honey meets spicy potato crunch.","Cheese Garlic Bread":"Garlic bread with a cheesy finish.","Masala Fries":"Crispy fries with spicy masala.","Chole Bhature":"Chickpeas in rich sauce with crisp bhature.","Paneer Kathi Roll":"Classic street-food roll with paneer.",
  "Sitafal Ice Cream":"Creamy ice cream with Indian custard apple.","Royal Rose Ice Cream":"Rich, creamy rose-flavoured ice cream.","Tender Coconut":"Creamy ice cream with coconut milk.","Kesar Pista":"Creamy ice cream with kesar and pista.","Belgian Chocolate":"Silky, rich Belgian chocolate ice cream.","Alphonso":"Sweet creamy Alphonso mango ice cream.","Jamun":"Creamy ice cream with Indian berries.","Pan Ice Cream":"Refreshing ice cream with paan notes.",
  "Spicy Lemonade":"Refreshing lemonade with a tangy twist.","Virgin Mojito":"Bright and refreshing mojito.","Kiwi Blast":"Cool kiwi-forward mocktail.","Blue Lagoon":"Bright, refreshing fruit-style drink.","Oreo Mud Shake":"Oreo, milk and chocolate blended creamy.","Kit Kat Break Shake":"Crunchy chocolate shake.","Ferro Rocher Shake":"Decadent shake with Ferrero Rocher.","Cold Coffee with Vanilla Ice Cream":"Cool creamy coffee with vanilla ice cream."
};

const chapterArtwork: Record<string, { src: string; alt: string; position: string }> = {
  "starters": { src: "/manus-storage/starters_52361bda.jpg", alt: "Crisp vegetarian samosas and chutney for the Starters chapter", position: "center 54%" },
  "soups-salads": { src: "/manus-storage/soups-salads_54760609.jpg", alt: "Fresh salad and soup ingredients in a textured restaurant setting", position: "center" },
  "main-course": { src: "/manus-storage/main-course_a81f2fd4.jpg", alt: "Paneer curry and naan for the Main Course chapter", position: "center 56%" },
  "breads": { src: "/manus-storage/breads_6f562564.jpg", alt: "Paneer curry with naan for the Breads chapter", position: "center 54%" },
  "rice-biryani": { src: "/manus-storage/rice-biryani_7c85671b.jpg", alt: "Vegetable biryani for the Rice & Biryani chapter", position: "center 56%" },
  "south-indian": { src: "/manus-storage/south-indian_12355c34.jpg", alt: "Crisp dosa with chutneys for the South Indian chapter", position: "center 52%" },
  "chinese": { src: "/manus-storage/chinese-noodles-manchurian-chapter_630f21ae.jpg", alt: "Vegetable Hakka noodles lifted by chopsticks with Manchurian for the Chinese chapter", position: "center 52%" },
  "fried-rice-noodles": { src: "/manus-storage/fried-rice-noodles_6033e44e.webp", alt: "Wok-tossed vegetable noodles for the Fried Rice & Noodles chapter", position: "center 52%" },
  "pizza-pasta": { src: "/manus-storage/pizza-and-pasta-chapter-hd_5aadedcb.png", alt: "High-resolution pizza from Naatures Scuup for the Pizza & Pasta chapter", position: "center 55%" },
  "burgers-sandwiches": { src: "/manus-storage/vegetarian-burger-chapter_b21738a3.jpg", alt: "A stacked vegetarian burger for the Burgers & Sandwiches chapter", position: "center 54%" },
  "snacks": { src: "/manus-storage/snacks_d06704c0.jpg", alt: "A vibrant Indian street-snack spread for the Snacks chapter", position: "center 54%" },
  "rolls": { src: "/manus-storage/rolls_b8c7cd33.jpg", alt: "Paneer kathi rolls for the Rolls chapter", position: "center 54%" },
  "maggi": { src: "/manus-storage/maggi_05f531cb.webp", alt: "Street-style Maggi noodles for the Maggi chapter", position: "center 52%" },
  "accompaniments": { src: "/manus-storage/accompaniments_6b92232c.jpg", alt: "Raita and papad for the Accompaniments chapter", position: "center 54%" },
  "ice-creams": { src: "/manus-storage/desserts-ice-creams-chapter-hd_8d76f08d.png", alt: "High-resolution ice cream from Naatures Scuup for the Desserts & Ice Creams chapter", position: "center 55%" },
  "drinks": { src: "/manus-storage/drinks_ecf68021.jpg", alt: "Colourful chilled mocktails for the Drinks & Shakes chapter", position: "center 52%" },
  "bakery-specials": { src: "/manus-storage/bakery-specials_6008eb2e.webp", alt: "Flaky paneer puff pastries for the Bakery Specials chapter", position: "center 52%" },
};

function noteForDish(dish: string, chapterDetail: string) {
  const withoutSize = dish.replace(/ \[[^\]]+\]/, "");
  const withoutIceCream = dish.replace(/ Ice Cream$/, "");
  const normalisedSauce = dish.replace("( Red Sauce)", "Red Sauce").replace("( Red Sauce )", "Red Sauce");
  return dishNotes[dish] ?? dishNotes[withoutSize] ?? dishNotes[withoutIceCream] ?? dishNotes[normalisedSauce] ?? chapterDetail;
}

function sortDishes(dishes: readonly string[], sort: string) {
  const alphabetical = (a: string, b: string) => a.localeCompare(b);
  if (sort === "az") return [...dishes].sort(alphabetical);
  if (sort === "price-low") return [...dishes].sort((a, b) => {
    const aPrice = menuDishPrices[a];
    const bPrice = menuDishPrices[b];
    if (aPrice === undefined) return bPrice === undefined ? alphabetical(a, b) : 1;
    if (bPrice === undefined) return -1;
    return aPrice - bPrice || alphabetical(a, b);
  });
  if (sort === "price-high") return [...dishes].sort((a, b) => {
    const aPrice = menuDishPrices[a];
    const bPrice = menuDishPrices[b];
    if (aPrice === undefined) return bPrice === undefined ? alphabetical(a, b) : 1;
    if (bPrice === undefined) return -1;
    return bPrice - aPrice || alphabetical(a, b);
  });
  return dishes;
}

const chapterStyles = `
  .menu-ribbon{overflow:hidden;white-space:nowrap;border-top:1px solid rgba(99,27,43,.16);border-bottom:1px solid rgba(99,27,43,.16);color:var(--maroon);font:800 8px/1 Manrope,sans-serif;letter-spacing:.16em;text-transform:uppercase;padding:12px 0;margin-top:0}.menu-ribbon span{display:inline-block;padding-left:100%;animation:menuRibbon 28s linear infinite}@keyframes menuRibbon{to{transform:translateX(-100%)}}.menu-page-category{position:relative}.menu-page-category header{position:relative}.menu-chapter-mood{margin:19px 0 0;display:flex;align-items:center;gap:11px;color:var(--maroon);font:800 8px/1.1 Manrope,sans-serif;letter-spacing:.13em;text-transform:uppercase}.menu-chapter-mood:before{content:"";width:23px;height:23px;border-radius:999px;background:var(--mango);border:1px solid rgba(99,27,43,.22);box-shadow:inset 0 0 0 6px var(--cream)}.menu-page-category:nth-child(3n) .menu-chapter-mood:before{background:var(--fennel)}.menu-page-category:nth-child(even):after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:3px;background:linear-gradient(90deg,var(--maroon),var(--mango),transparent)}.menu-page-category:nth-child(4n) h2{color:var(--maroon);text-shadow:12px 10px 0 rgba(228,183,77,.12)}@media(prefers-reduced-motion:reduce){.menu-ribbon span{animation:none;padding-left:0}}@media(max-width:640px){.menu-ribbon{margin-top:0;font-size:7px}.menu-chapter-mood{font-size:7px}.menu-chapter-mood:before{width:18px;height:18px;box-shadow:inset 0 0 0 5px var(--cream)}}
`;

const browserStyles = `
  .menu-browser{border-top:1px solid rgba(99,27,43,.18);padding-top:28px;margin-top:28px}.menu-conveyor-shell{display:grid;grid-template-columns:42px minmax(0,1fr) 42px;gap:8px;align-items:center;margin:4px -8.5vw 0}.menu-conveyor{position:relative;overflow-x:auto;margin:0;padding:0 0 12px;cursor:grab;scrollbar-width:none;touch-action:pan-y;mask-image:linear-gradient(90deg,transparent 0,#000 3%,#000 97%,transparent 100%)}.menu-conveyor::-webkit-scrollbar{display:none}.menu-conveyor[data-dragging="true"]{cursor:grabbing;user-select:none}.menu-conveyor[data-dragging="true"] .menu-conveyor__track{animation-play-state:paused}.menu-conveyor__track{display:flex;width:max-content;will-change:transform;animation:menuConveyor 44s linear infinite}.menu-conveyor__set{display:flex;flex:none;gap:9px;padding-right:9px}.menu-conveyor-nav{display:grid;place-items:center;width:38px;height:38px;padding:0;border:1px solid rgba(101,27,43,.36);border-radius:50%;background:var(--cream);color:var(--maroon);box-shadow:3px 3px 0 rgba(101,27,43,.18);cursor:pointer;transition:transform .16s var(--ease-out),background .16s var(--ease-out),color .16s var(--ease-out)}.menu-conveyor-nav:hover{background:var(--print-lime);color:var(--print-ink);transform:translateY(-2px)}.menu-conveyor-nav:active{transform:scale(.94)}.menu-conveyor-nav:focus-visible{outline:2px solid var(--maroon);outline-offset:3px}.menu-filter{border:1px solid rgba(99,27,43,.13);border-radius:999px;background:#f0eddf;color:var(--maroon-deep);padding:12px 17px;white-space:nowrap;font:800 10px/1 Manrope,sans-serif;letter-spacing:.03em;cursor:pointer;transition:transform .18s ease,background .18s ease,color .18s ease}.menu-filter:hover{transform:translateY(-1px)}.menu-filter:active{transform:scale(.97)}.menu-filter:focus-visible{outline:2px solid var(--mango);outline-offset:3px}.menu-filter[data-active="true"]{background:var(--maroon);color:var(--cream);box-shadow:0 8px 18px rgba(99,27,43,.16)}@keyframes menuConveyor{to{transform:translateX(-50%)}}.menu-browser__tools{display:grid;grid-template-columns:1fr auto;gap:12px;margin-top:9px;align-items:center}.menu-search{display:flex;align-items:center;gap:11px;border:1px solid rgba(99,27,43,.28);background:rgba(255,255,255,.25);padding:0 15px;min-height:50px}.menu-search input{width:100%;border:0;outline:0;background:transparent;color:var(--maroon-deep);font:500 13px/1.3 Manrope,sans-serif}.menu-search input::placeholder{color:rgba(45,31,34,.55)}.menu-sort{position:relative;display:flex;align-items:center;gap:8px;color:var(--maroon-deep);font:800 9px/1 Manrope,sans-serif;letter-spacing:.07em;text-transform:uppercase}.menu-sort select{appearance:none;border:1px solid rgba(99,27,43,.28);background:transparent;border-radius:0;padding:16px 34px 16px 14px;color:var(--maroon-deep);font:800 10px/1 Manrope,sans-serif;letter-spacing:.04em;text-transform:uppercase;cursor:pointer}.menu-sort svg{position:absolute;right:11px;pointer-events:none}.menu-browser__result{display:flex;justify-content:space-between;gap:20px;border-bottom:1px solid rgba(99,27,43,.16);padding:21px 0 16px;color:var(--maroon);font:800 9px/1 Manrope,sans-serif;letter-spacing:.12em;text-transform:uppercase}.menu-empty{padding:58px 0 72px;border-bottom:1px solid rgba(99,27,43,.16);color:var(--maroon-deep)}.menu-empty h2{font:500 clamp(34px,5vw,72px)/.88 'Cormorant Garamond',serif;margin:0}.menu-empty p{font:500 13px/1.6 Manrope,sans-serif;max-width:380px;margin:14px 0 0}.menu-page-category--browser{scroll-margin-top:110px}.menu-page-category--browser[hidden]{display:none}@media(prefers-reduced-motion:reduce){.menu-conveyor{mask-image:none}.menu-conveyor__track{animation:none}.menu-conveyor__set[aria-hidden="true"]{display:none}}@media(max-width:640px){.menu-browser{padding-top:20px}.menu-conveyor-shell{grid-template-columns:34px minmax(0,1fr) 34px;gap:4px;margin-left:-25px;margin-right:-25px}.menu-conveyor{padding-left:0;padding-right:0;mask-image:none}.menu-conveyor-nav{width:31px;height:31px}.menu-filter{font-size:8px;padding:11px 14px}.menu-browser__tools{grid-template-columns:1fr}.menu-sort{justify-content:space-between}.menu-sort select{width:100%;min-height:48px}.menu-search{min-height:54px}.menu-browser__result{font-size:8px}.menu-page-category--browser ol{margin-top:18px}.menu-page-category--browser li p{font-size:9px!important}}
`;

const priceBrowserStyles = `
  .menu-dish-title{display:flex;align-items:baseline;justify-content:space-between;gap:12px}.menu-dish-price{flex:0 0 auto;color:var(--maroon);font:800 10px/1 Manrope,sans-serif;letter-spacing:.04em}@media(max-width:640px){.menu-dish-price{font-size:9px}}
`;

const calmMenuTextStyles = `
  .menu-page .menu-brand-signature{color:var(--maroon)}.menu-page .menu-brand-signature span{color:rgba(101,27,43,.5)}.menu-page .menu-page-closing__eyebrow{color:var(--cream)}.menu-page .menu-chapter-break{background:linear-gradient(90deg,rgba(101,27,43,.08),transparent 62%)}.menu-page .menu-chapter-mood:before,.menu-page .menu-dish-card:nth-child(3n+2) .menu-dish-card__meta:before{background:var(--fennel);box-shadow:0 0 0 4px rgba(139,172,127,.12)}.menu-page .menu-page-category:nth-child(even):after{background:linear-gradient(90deg,var(--maroon),rgba(101,27,43,.28),transparent)}.menu-page .menu-page-category:nth-child(4n) h2{text-shadow:12px 10px 0 rgba(101,27,43,.08)}.menu-page .menu-filter:focus-visible{outline-color:var(--fennel)}
`;

const cardMenuStyles = `
  .menu-card-list{max-width:1440px;margin:auto;padding-top:clamp(22px,3vw,38px);padding-bottom:clamp(90px,11vw,150px)}.menu-card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.menu-chapter-break{grid-column:1/-1;display:grid;grid-template-columns:minmax(270px,.78fr) 1.22fr;gap:clamp(26px,6vw,88px);align-items:end;margin-top:clamp(46px,7vw,90px);padding:clamp(34px,5vw,64px) 0 25px;border-top:1px solid rgba(101,27,43,.23);background:linear-gradient(90deg,rgba(237,189,104,.13),transparent 62%)}.menu-chapter-break:first-child{margin-top:0}.menu-chapter-break__index{display:flex;align-items:center;gap:12px;color:var(--maroon);font-size:8px;font-weight:900;letter-spacing:.15em;text-transform:uppercase}.menu-chapter-break__index:after{content:"";height:1px;flex:1;background:rgba(101,27,43,.25)}.menu-chapter-break h2{max-width:670px;margin:13px 0 0;color:var(--maroon-deep);font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(58px,7.2vw,106px);font-weight:500;letter-spacing:-.07em;line-height:.76}.menu-chapter-break h2 i{font-weight:400}.menu-chapter-break__aside{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;padding-bottom:5px}.menu-chapter-break__aside p{max-width:315px;margin:0;color:rgba(45,31,34,.7);font-size:12px;font-weight:700;letter-spacing:.04em;line-height:1.6}.menu-chapter-break__stamp{display:grid;flex:0 0 auto;place-items:center;width:55px;height:55px;border:1px solid rgba(101,27,43,.42);border-radius:50%;color:var(--maroon);font-size:8px;font-weight:900;letter-spacing:.06em;line-height:1.1;text-align:center;transform:rotate(-8deg)}.menu-dish-card{display:grid;grid-template-rows:auto 1fr auto;min-height:274px;padding:24px;border:1px solid rgba(101,27,43,.19);border-radius:15px;background:rgba(255,255,255,.22);transition:transform .2s var(--ease-out),border-color .2s var(--ease-out),box-shadow .2s var(--ease-out)}.menu-dish-card:hover{transform:translateY(-3px);border-color:rgba(101,27,43,.42);box-shadow:0 13px 28px rgba(53,16,26,.07)}.menu-dish-card--lead{grid-column:span 2;min-height:310px;background:linear-gradient(135deg,rgba(169,189,106,.18),rgba(255,255,255,.29) 52%)}.menu-dish-card__meta{display:flex;align-items:center;gap:7px;margin:0;color:var(--maroon);font-size:8px;font-weight:800;letter-spacing:.09em;text-transform:uppercase}.menu-dish-card__meta:before{content:"";width:9px;height:9px;border-radius:50%;background:var(--fennel);box-shadow:0 0 0 4px rgba(139,172,127,.12)}.menu-dish-card:nth-child(3n+2) .menu-dish-card__meta:before{background:var(--mango);box-shadow:0 0 0 4px rgba(228,183,77,.12)}.menu-dish-card h2{max-width:310px;margin:28px 0 11px;color:var(--maroon-deep);font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(31px,2.8vw,43px);font-weight:500;letter-spacing:-.055em;line-height:.87}.menu-dish-card--lead h2{max-width:480px;font-size:clamp(42px,4vw,62px)}.menu-dish-card__note{max-width:315px;margin:0;color:rgba(45,31,34,.67);font-size:11px;line-height:1.58}.menu-dish-card footer{display:flex;align-items:end;justify-content:space-between;gap:16px;padding-top:21px;border-top:1px solid rgba(101,27,43,.15)}.menu-dish-card footer div{display:grid;gap:4px}.menu-dish-card footer span{color:rgba(53,16,26,.58);font-size:7px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.menu-dish-card footer strong{color:var(--maroon);font-family:"Cormorant Garamond",Georgia,serif;font-size:28px;font-weight:600;letter-spacing:-.04em;line-height:.8}.menu-dish-card__display{display:inline-flex;align-items:center;justify-content:center;min-height:31px;padding:0 10px;border-radius:999px;background:var(--maroon);color:var(--cream)!important;font-size:7px!important;letter-spacing:.09em!important;white-space:nowrap}.menu-dish-card__display--muted{background:var(--cream-deep);color:var(--maroon)!important;border:1px solid rgba(101,27,43,.2)}@media(max-width:1000px){.menu-card-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.menu-dish-card--lead{grid-column:span 2}}@media(max-width:640px){.menu-card-list{padding-top:20px;padding-bottom:94px}.menu-card-grid{grid-template-columns:1fr;gap:10px}.menu-chapter-break{display:block;margin-top:54px;padding:33px 0 19px}.menu-chapter-break h2{font-size:64px}.menu-chapter-break__aside{margin-top:22px}.menu-chapter-break__aside p{font-size:10px}.menu-chapter-break__stamp{width:47px;height:47px;font-size:7px}.menu-dish-card,.menu-dish-card--lead{grid-column:auto;min-height:235px;padding:20px}.menu-dish-card h2,.menu-dish-card--lead h2{margin:22px 0 9px;font-size:36px}.menu-dish-card__note{font-size:10px}.menu-dish-card footer{padding-top:17px}}
`;

export default function MenuPage() {
  const { language } = useLanguage();
  const copy = menuCopy[language];
  const [activeGroup, setActiveGroup] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const reduceMotion = useReducedMotion();
  const conveyorRef = useRef<HTMLDivElement>(null);
  const conveyorDrag = useRef({ active: false, startX: 0, startScrollLeft: 0 });
  const focusResultsAfterGroupChange = useRef(false);
  const focusMenuResults = () => {
    const results = document.getElementById("menu-results");
    results?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    results?.focus({ preventScroll: true });
  };
  const selectMobileGroup = (slug: string) => {
    focusResultsAfterGroupChange.current = window.matchMedia("(max-width: 640px)").matches;
    setActiveGroup(slug);
    if (focusResultsAfterGroupChange.current) window.setTimeout(focusMenuResults, 80);
  };
  useEffect(() => {
    if (!focusResultsAfterGroupChange.current) return;
    focusResultsAfterGroupChange.current = false;
    window.requestAnimationFrame(focusMenuResults);
  }, [activeGroup, reduceMotion]);
  useEffect(() => {
    if (window.location.hash !== "#ice-creams") return;
    const destinationTimer = window.setTimeout(() => {
      setActiveGroup("ice-creams");
      setQuery("");
      setSort("recommended");
      window.requestAnimationFrame(() => document.getElementById("ice-creams")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }));
    }, 440);
    return () => window.clearTimeout(destinationTimer);
  }, [reduceMotion]);
  const localizedChapterTitle = (slug: string, title: string) => localizeChapterTitle(slug, title, language);
  const menuGroups = [{ slug: "all", title: `${localizedChapterTitle("all", "All items")} (${menuItemCount})` }, ...menuChapters.map((chapter) => ({ slug: chapter.slug, title: localizedChapterTitle(chapter.slug, chapter.title) }))];
  const normalizedQuery = query.trim().toLowerCase();
  const visibleItems = useMemo(() => {
    const chapters = menuChapters
      .filter((chapter) => activeGroup === "all" || chapter.slug === activeGroup)
      .map((chapter) => ({ ...chapter, dishes: chapter.dishes.filter((dish) => `${dish} ${noteForDish(dish, chapter.detail)}`.toLowerCase().includes(normalizedQuery)) }))
      .filter((chapter) => chapter.dishes.length > 0);
    const flatItems = chapters.flatMap((chapter) => chapter.dishes.map((dish) => ({ dish, chapter })));
    const orderedNames = sortDishes(flatItems.map((item) => item.dish), sort);
    const order = new Map(orderedNames.map((dish, index) => [dish, index]));
    return [...flatItems].sort((a, b) => (order.get(a.dish) ?? 0) - (order.get(b.dish) ?? 0));
  }, [activeGroup, normalizedQuery, sort]);
  const visibleItemCount = visibleItems.length;
  const nudgeConveyor = (direction: number) => conveyorRef.current?.scrollBy({ left: direction * Math.max(280, conveyorRef.current.clientWidth * 0.72), behavior: reduceMotion ? "auto" : "smooth" });
  const startConveyorDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button")) return;
    const conveyor = event.currentTarget;
    conveyorDrag.current = { active: true, startX: event.clientX, startScrollLeft: conveyor.scrollLeft };
    conveyor.dataset.dragging = "true";
    conveyor.setPointerCapture(event.pointerId);
  };
  const moveConveyorDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!conveyorDrag.current.active) return;
    event.currentTarget.scrollLeft = conveyorDrag.current.startScrollLeft - (event.clientX - conveyorDrag.current.startX);
  };
  const endConveyorDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    conveyorDrag.current.active = false;
    delete event.currentTarget.dataset.dragging;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return <div className="site-shell menu-page-shell">
    <RouteMeta title="Full Digital Menu | Naatures Scuup, Kanpur" description="Browse 204 vegetarian dishes, mango ice cream, desserts, shakes and vegan options at Naatures Scuup on Mall Road, Kanpur." />
    <main className="menu-page print-paper" id="main-content" data-page-top="true">
      <style>{chapterStyles}</style>
      <style>{browserStyles}</style>
      <style>{priceBrowserStyles}</style>
      <style>{cardMenuStyles}</style>
      <style>{calmMenuTextStyles}</style>
      <section className="menu-page-hero section-pad print-surface maximalist-surface" aria-labelledby="full-menu-title">
        <div className="maximalist-surface__forms" aria-hidden="true" />
        <span className="maximalist-surface__figure" aria-hidden="true">17</span>
        <Breadcrumbs current={copy.current} />
        <span className="maximalist-surface__label">{copy.atlas}</span>
        <p className="eyebrow eyebrow--maroon"><Leaf size={13} style={{display:"inline",marginRight:7,verticalAlign:"-2px"}} />{copy.vegetarianMenu}</p>
        <div className="menu-page-hero__grid"><h1 id="full-menu-title" className="editorial-title print-ink"><span className="title-outline">{copy.headlineStart}</span><br /><i>{copy.headlineEnd}</i></h1><div><p>{copy.heroCopy}</p><span className="menu-page-hours">{copy.chapterHours}</span></div></div>
      </section>
      <OrganicWaveDivider tone="cream-to-sage" />
      <section className="menu-browser-block section-pad maximalist-surface maximalist-surface--sage layered-image-depth layered-image-depth--menu" aria-label={copy.browseChapters}>
        <div className="maximalist-surface__forms" aria-hidden="true" />
        <div className="menu-browser" aria-label={copy.browseMenu}>
          <div className="menu-conveyor-shell" role="group" aria-label={copy.chapterNavigation}>
            <button className="menu-conveyor-nav" type="button" onClick={() => nudgeConveyor(-1)} aria-label={copy.previousChapters}><ChevronLeft size={17} /></button>
            <div ref={conveyorRef} className="menu-conveyor" role="group" aria-label={copy.dragChapters} onPointerDown={startConveyorDrag} onPointerMove={moveConveyorDrag} onPointerUp={endConveyorDrag} onPointerCancel={endConveyorDrag}>
              <div className="menu-conveyor__track">
                {[false, true].map((isDuplicate) => <div className="menu-conveyor__set" key={isDuplicate ? "duplicate" : "primary"} aria-hidden={isDuplicate ? "true" : undefined}>{menuGroups.map((group, groupIndex) => <button key={`${isDuplicate ? "duplicate" : "primary"}-${group.slug}`} className="menu-filter menu-filter--indexed" data-active={activeGroup === group.slug} onClick={() => selectMobileGroup(group.slug)} aria-pressed={activeGroup === group.slug} tabIndex={isDuplicate ? -1 : undefined}><span>{String(groupIndex).padStart(2, "0")}</span><b>{group.title}</b></button>)}</div>)}
              </div>
            </div>
            <button className="menu-conveyor-nav" type="button" onClick={() => nudgeConveyor(1)} aria-label={copy.nextChapters}><ChevronRight size={17} /></button>
          </div>
          <div className="menu-browser__tools"><label className="menu-search"><Search size={19} strokeWidth={1.6} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.searchPlaceholder} aria-label={copy.searchDishes} inputMode="search" enterKeyHint="search" autoComplete="off" spellCheck={false} /></label><label className="menu-sort">{copy.sortBy}<select value={sort} onChange={(event) => setSort(event.target.value)} aria-label={copy.sortItems}><option value="recommended">{copy.recommended}</option><option value="az">{copy.alphabetical}</option><option value="price-low">{copy.lowToHigh}</option><option value="price-high">{copy.highToLow}</option></select><ChevronDown size={14} /></label></div>
          <div id="menu-results" className="menu-browser__result" aria-live="polite" aria-atomic="true" tabIndex={-1}><span>{visibleItemCount} {copy.dishesToExplore}</span><span>{activeGroup === "all" ? copy.allCravings : localizedChapterTitle(activeGroup, menuChapters.find((chapter) => chapter.slug === activeGroup)?.title ?? "")}</span></div>
        </div>
      </section>
      <OrganicWaveDivider tone="sage-to-cream" />
      <section id={activeGroup === "ice-creams" ? "ice-creams" : undefined} className="menu-card-list section-pad" aria-label="Full Naatures Scuup menu">
        {visibleItems.length === 0 && <div className="menu-empty"><p className="eyebrow eyebrow--maroon">{copy.noCraving}</p><h2>{copy.emptyStart}<br /><i>{copy.emptyEnd}</i></h2><p>{copy.emptyCopy}</p></div>}
        <div className="menu-card-grid">{visibleItems.map(({ dish, chapter }, index) => { const price = menuDishPrices[dish]; const previousItem = visibleItems[index - 1]; const showChapterBreak = sort === "recommended" && (!previousItem || previousItem.chapter.slug !== chapter.slug); const chapterNumber = `${menuChapters.findIndex((menuChapter) => menuChapter.slug === chapter.slug) + 1}`.padStart(2, "0"); const artwork = chapterArtwork[chapter.slug]; return <Fragment key={`${chapter.slug}-${dish}`}>
          {showChapterBreak && <div className="menu-chapter-break print-surface print-halftone maximalist-chapter" data-chapter={chapter.slug}><img className="menu-chapter-break__image" src={artwork.src} alt="" style={{ objectPosition: artwork.position }} /><span className="menu-chapter-break__veil" aria-hidden="true" /><div className="menu-chapter-break__body"><span className="maximalist-index">{chapterNumber} / {copy.chapter}</span><p className="menu-chapter-break__index">{chapterNumber} / {copy.cravingChapter}</p><h2 className="print-ink">{localizedChapterTitle(chapter.slug, chapter.title)}</h2><small className="menu-chapter-break__art-note">Naatures Scuup / {chapter.note}</small></div><div className="menu-chapter-break__aside"><p>{chapter.detail}</p><span className="menu-chapter-break__stamp">NS<br />SCOOP</span></div></div>}
          <motion.article className={`menu-dish-card print-edge-boil maximalist-card${showChapterBreak ? " menu-dish-card--lead" : ""}`} initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.14 }} transition={{ duration: 0.46, delay: (index % 3) * 0.055, ease: [0.23, 1, 0.32, 1] }}>{showChapterBreak && <p className="menu-dish-card__lead-label"><span>{chapterNumber}</span> {copy.firstPlate}</p>}<p className="menu-dish-card__meta">{copy.pureVeg} · {localizedChapterTitle(chapter.slug, chapter.title)}</p><div><h2 className="print-ink">{dish}</h2><p className="menu-dish-card__note">{noteForDish(dish, chapter.detail)}</p></div><footer><div><span>{copy.menuPrice}</span><strong>{price === undefined ? "—" : `₹${price}`}</strong></div><span className={`menu-dish-card__display${price === undefined ? " menu-dish-card__display--muted" : ""}`}>{price === undefined ? copy.priceNotListed : copy.menuListing}</span></footer></motion.article>
        </Fragment>; })}</div>
      </section>
      <section className="menu-page-closing section-pad"><div><p className="eyebrow menu-page-closing__eyebrow">{copy.closingEyebrow}</p><h2>{copy.closingStart}<br /><i>{copy.closingEnd}</i></h2></div><div className="menu-page-closing__actions"><a className="button button--cream" href="https://www.google.com/maps/search/?api=1&query=Naatures+Scuup+The+Mall+126+Mall+Road+Kanpur" target="_blank" rel="noreferrer">{copy.getDirections} <MapPin size={16} /></a><Link className="text-action text-action--cream" href="/">{copy.backHome} <ArrowDownRight size={16} /></Link></div></section>
    </main>
    <SiteFooter />
    <MobileVisitDock />
  </div>;
}
