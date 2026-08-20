/**
 * Style reminder — Mall Road Monograph: the Full Menu remains a calm, display-only reading room.
 * Dish notes are concise adaptations of the public Zomato listing; the two editorial images are unique restaurant-specific public Swiggy listing images.
 */
import { ArrowDownRight, ChevronDown, Leaf, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { menuChapters, menuItemCount } from "@/lib/menu-data";

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

const swiggyImages: Record<string, { src: string; alt: string; caption: string }> = {
  "pizza-pasta": { src: "/manus-storage/naatures-scuup-swiggy-pizza_69c970f1.jpg", alt: "Naatures Scuup pizza and cold drink from its public Swiggy listing", caption: "Pizza & Pasta / image surfaced from the public Swiggy listing" },
  "ice-creams": { src: "/manus-storage/naatures-scuup-swiggy-ice-cream_ed5a9479.jpg", alt: "Naatures Scuup ice-cream dessert from its public Swiggy listing", caption: "Ice Creams / image surfaced from the public Swiggy listing" },
};

const chapterMoods: Record<string, string> = {
  "starters": "Start savoury.", "soups-salads": "Freshen the table.", "main-course": "Settle into slow comfort.", "breads": "Tear, dip, repeat.", "rice-biryani": "Make room for fragrance.", "south-indian": "Crisp at noon.", "chinese": "Bring the wok energy.", "fried-rice-noodles": "Wok-tossed and warm.", "pizza-pasta": "Share the slice.", "burgers-sandwiches": "Keep the crunch close.", "snacks": "Pass the plate.", "rolls": "Take it easy.", "maggi": "Comfort, curled up.", "accompaniments": "A little extra on the side.", "ice-creams": "Freeze the happiness.", "drinks": "Toast the table mood.", "bakery-specials": "One final bite.",
};

function noteForDish(dish: string, chapterDetail: string) {
  const withoutSize = dish.replace(/ \[[^\]]+\]/, "");
  const withoutIceCream = dish.replace(/ Ice Cream$/, "");
  const normalisedSauce = dish.replace("( Red Sauce)", "Red Sauce").replace("( Red Sauce )", "Red Sauce");
  return dishNotes[dish] ?? dishNotes[withoutSize] ?? dishNotes[withoutIceCream] ?? dishNotes[normalisedSauce] ?? chapterDetail;
}

const chapterStyles = `
  .menu-ribbon{overflow:hidden;white-space:nowrap;border-top:1px solid rgba(99,27,43,.16);border-bottom:1px solid rgba(99,27,43,.16);color:var(--maroon);font:800 8px/1 Manrope,sans-serif;letter-spacing:.16em;text-transform:uppercase;padding:12px 0;margin-top:34px}.menu-ribbon span{display:inline-block;padding-left:100%;animation:menuRibbon 28s linear infinite}@keyframes menuRibbon{to{transform:translateX(-100%)}}.menu-page-category{position:relative}.menu-page-category header{position:relative}.menu-chapter-mood{margin:19px 0 0;display:flex;align-items:center;gap:11px;color:var(--maroon);font:800 8px/1.1 Manrope,sans-serif;letter-spacing:.13em;text-transform:uppercase}.menu-chapter-mood:before{content:"";width:23px;height:23px;border-radius:999px;background:var(--mango);border:1px solid rgba(99,27,43,.22);box-shadow:inset 0 0 0 6px var(--cream)}.menu-page-category:nth-child(3n) .menu-chapter-mood:before{background:var(--fennel)}.menu-page-category:nth-child(even):after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:3px;background:linear-gradient(90deg,var(--maroon),var(--mango),transparent)}.menu-page-category:nth-child(4n) h2{color:var(--maroon);text-shadow:12px 10px 0 rgba(228,183,77,.12)}@media(prefers-reduced-motion:reduce){.menu-ribbon span{animation:none;padding-left:0}}@media(max-width:640px){.menu-ribbon{margin-top:25px;font-size:7px}.menu-chapter-mood{font-size:7px}.menu-chapter-mood:before{width:18px;height:18px;box-shadow:inset 0 0 0 5px var(--cream)}}
`;

const browserStyles = `
  .menu-browser{border-top:1px solid rgba(99,27,43,.18);padding-top:28px;margin-top:28px}.menu-browser__bar{display:flex;gap:9px;overflow-x:auto;scrollbar-width:none;padding:4px 0 12px}.menu-browser__bar::-webkit-scrollbar{display:none}.menu-filter{border:1px solid rgba(99,27,43,.13);border-radius:999px;background:#f0eddf;color:var(--maroon-deep);padding:12px 17px;white-space:nowrap;font:800 10px/1 Manrope,sans-serif;letter-spacing:.03em;cursor:pointer;transition:transform .18s ease,background .18s ease,color .18s ease}.menu-filter:hover{transform:translateY(-1px)}.menu-filter:active{transform:scale(.97)}.menu-filter[data-active="true"]{background:var(--maroon);color:var(--cream);box-shadow:0 8px 18px rgba(99,27,43,.16)}.menu-browser__tools{display:grid;grid-template-columns:1fr auto;gap:12px;margin-top:9px;align-items:center}.menu-search{display:flex;align-items:center;gap:11px;border:1px solid rgba(99,27,43,.28);background:rgba(255,255,255,.25);padding:0 15px;min-height:50px}.menu-search input{width:100%;border:0;outline:0;background:transparent;color:var(--maroon-deep);font:500 13px/1.3 Manrope,sans-serif}.menu-search input::placeholder{color:rgba(45,31,34,.55)}.menu-sort{position:relative;display:flex;align-items:center;gap:8px;color:var(--maroon-deep);font:800 9px/1 Manrope,sans-serif;letter-spacing:.07em;text-transform:uppercase}.menu-sort select{appearance:none;border:1px solid rgba(99,27,43,.28);background:transparent;border-radius:0;padding:16px 34px 16px 14px;color:var(--maroon-deep);font:800 10px/1 Manrope,sans-serif;letter-spacing:.04em;text-transform:uppercase;cursor:pointer}.menu-sort svg{position:absolute;right:11px;pointer-events:none}.menu-browser__result{display:flex;justify-content:space-between;gap:20px;border-bottom:1px solid rgba(99,27,43,.16);padding:21px 0 16px;color:var(--maroon);font:800 9px/1 Manrope,sans-serif;letter-spacing:.12em;text-transform:uppercase}.menu-empty{padding:58px 0 72px;border-bottom:1px solid rgba(99,27,43,.16);color:var(--maroon-deep)}.menu-empty h2{font:500 clamp(34px,5vw,72px)/.88 'Cormorant Garamond',serif;margin:0}.menu-empty p{font:500 13px/1.6 Manrope,sans-serif;max-width:380px;margin:14px 0 0}.menu-page-category--browser{scroll-margin-top:110px}.menu-page-category--browser[hidden]{display:none}@media(max-width:640px){.menu-browser{padding-top:20px}.menu-filter{font-size:8px;padding:11px 14px}.menu-browser__tools{grid-template-columns:1fr}.menu-sort{justify-content:space-between}.menu-sort select{width:100%;min-height:48px}.menu-search{min-height:54px}.menu-browser__result{font-size:8px}.menu-page-category--browser ol{margin-top:18px}.menu-page-category--browser li p{font-size:9px!important}}
`;

export default function MenuPage() {
  const [activeGroup, setActiveGroup] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const normalizedQuery = query.trim().toLowerCase();
  const visibleChapters = useMemo(() => menuChapters
    .filter((chapter) => activeGroup === "all" || chapter.slug === activeGroup)
    .map((chapter) => ({ ...chapter, dishes: chapter.dishes.filter((dish) => `${dish} ${noteForDish(dish, chapter.detail)}`.toLowerCase().includes(normalizedQuery)) }))
    .filter((chapter) => chapter.dishes.length > 0)
    .map((chapter) => ({ ...chapter, dishes: sort === "az" ? [...chapter.dishes].sort((a, b) => a.localeCompare(b)) : chapter.dishes })), [activeGroup, normalizedQuery, sort]);
  const visibleItemCount = visibleChapters.reduce((count, chapter) => count + chapter.dishes.length, 0);
  return <div className="site-shell menu-page-shell">
    <SiteHeader paper />
    <main className="menu-page" id="top">
      <style>{chapterStyles}</style>
      <style>{browserStyles}</style>
      <section className="menu-page-hero section-pad" aria-labelledby="full-menu-title">
        <p className="eyebrow eyebrow--maroon"><Leaf size={13} style={{display:"inline",marginRight:7,verticalAlign:"-2px"}} />100% vegetarian menu</p>
        <div className="menu-page-hero__grid"><h1 id="full-menu-title">Full digital<br /><i>menu.</i></h1><div><p>Browse every dish by craving, then find the table mood that fits. This guide is made for reading, sharing and planning your Mall Road visit—not for ordering online.</p><span>{menuItemCount} listed dishes · Vegetarian multi-cuisine</span></div></div>
        <div className="menu-browser" aria-label="Browse the Naatures Scuup menu">
          <div className="menu-browser__bar" role="tablist" aria-label="Menu groups">
            <button className="menu-filter" data-active={activeGroup === "all"} onClick={() => setActiveGroup("all")} role="tab" aria-selected={activeGroup === "all"}>All items ({menuItemCount})</button>
            {menuChapters.map((chapter) => <button key={chapter.slug} className="menu-filter" data-active={activeGroup === chapter.slug} onClick={() => setActiveGroup(chapter.slug)} role="tab" aria-selected={activeGroup === chapter.slug}>{chapter.title}</button>)}
          </div>
          <div className="menu-browser__tools"><label className="menu-search"><Search size={19} strokeWidth={1.6} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search dosa, pizza, ice cream, shakes…" aria-label="Search dishes" /></label><label className="menu-sort">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort menu items"><option value="recommended">Recommended</option><option value="az">A–Z</option></select><ChevronDown size={14} /></label></div>
          <div className="menu-browser__result"><span>{visibleItemCount} dishes to explore</span><span>{activeGroup === "all" ? "All cravings" : menuChapters.find((chapter) => chapter.slug === activeGroup)?.title}</span></div>
        </div>
      </section>
      <div className="menu-ribbon" aria-hidden="true"><span>Follow the craving · Mall Road menu · savoury to sweet · every table mood · follow the craving · Mall Road menu · savoury to sweet · every table mood · </span></div>
      <section className="menu-page-list section-pad" aria-label="Full Naatures Scuup menu">
        {visibleChapters.length === 0 && <div className="menu-empty"><p className="eyebrow eyebrow--maroon">No craving found</p><h2>Try another<br /><i>table mood.</i></h2><p>Search by a dish name, flavour or menu group. Your menu is still here—just waiting for a different word.</p></div>}
        {visibleChapters.map((chapter) => {
          const image = swiggyImages[chapter.slug];
          return <article id={chapter.slug} className="menu-page-category menu-page-category--browser" key={chapter.slug}>
            <header><p className="eyebrow eyebrow--maroon">{chapter.index} / {chapter.note}</p><h2>{chapter.title}</h2><p>{chapter.detail}</p><div className="menu-chapter-mood">{chapterMoods[chapter.slug]}</div>{image && <figure style={{margin:"28px 0 0",background:"var(--maroon-deep)"}}><img src={image.src} alt={image.alt} style={{display:"block",width:"100%",aspectRatio:"1.35",objectFit:"cover"}} /><figcaption style={{padding:"9px 11px",color:"var(--cream)",fontSize:"7px",fontWeight:800,letterSpacing:".11em",textTransform:"uppercase"}}>{image.caption}</figcaption></figure>}</header>
            <ol>{chapter.dishes.map((dish, index) => <li key={dish} style={{alignItems:"start"}}><span>{String(index + 1).padStart(2,"0")}</span><div><strong>{dish}</strong><p style={{margin:"6px 0 0",color:"rgb(33 24 26 / 62%)",fontSize:"10px",lineHeight:1.45}}>{noteForDish(dish, chapter.detail)}</p></div></li>)}</ol>
          </article>;
        })}
      </section>
      <section className="menu-page-closing section-pad"><div><p className="eyebrow eyebrow--light">Freeze the happiness</p><h2>Find your<br /><i>table mood.</i></h2></div><div className="menu-page-closing__actions"><a className="button button--cream" href="https://www.google.com/maps/search/?api=1&query=Naatures+Scuup+The+Mall+126+Mall+Road+Kanpur" target="_blank" rel="noreferrer">Get directions <MapPin size={16} /></a><Link className="text-action text-action--cream" href="/">Back to home <ArrowDownRight size={16} /></Link></div></section>
    </main>
    <SiteFooter />
  </div>;
}
