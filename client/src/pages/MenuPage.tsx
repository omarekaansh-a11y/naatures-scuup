/**
 * Style reminder — Mall Road Monograph: the Full Menu remains a calm, display-only reading room.
 * Dish notes are concise adaptations of the public Zomato listing; the two editorial images are unique restaurant-specific public Swiggy listing images.
 */
import { ArrowDownRight, MapPin } from "lucide-react";
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
  "tandoor-starters": "Start savoury.", "soups-salads": "Freshen the table.", "north-indian": "Settle into slow comfort.", "rice-biryani": "Make room for fragrance.", "south-indian": "Crisp at noon.", "chinese": "Bring the wok energy.", "pizza-pasta": "Share the slice.", "burgers-snacks": "Keep the crunch close.", "ice-creams": "Freeze the happiness.", "shakes-mocktails": "Toast the table mood.",
};

const chapterStyles = `
  .menu-ribbon{overflow:hidden;white-space:nowrap;border-top:1px solid rgba(99,27,43,.16);border-bottom:1px solid rgba(99,27,43,.16);color:var(--maroon);font:800 8px/1 Manrope,sans-serif;letter-spacing:.16em;text-transform:uppercase;padding:12px 0;margin-top:34px}.menu-ribbon span{display:inline-block;padding-left:100%;animation:menuRibbon 28s linear infinite}@keyframes menuRibbon{to{transform:translateX(-100%)}}.menu-page-category{position:relative}.menu-page-category header{position:relative}.menu-chapter-mood{margin:19px 0 0;display:flex;align-items:center;gap:11px;color:var(--maroon);font:800 8px/1.1 Manrope,sans-serif;letter-spacing:.13em;text-transform:uppercase}.menu-chapter-mood:before{content:"";width:23px;height:23px;border-radius:999px;background:var(--mango);border:1px solid rgba(99,27,43,.22);box-shadow:inset 0 0 0 6px var(--cream)}.menu-page-category:nth-child(3n) .menu-chapter-mood:before{background:var(--fennel)}.menu-page-category:nth-child(even):after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:3px;background:linear-gradient(90deg,var(--maroon),var(--mango),transparent)}.menu-page-category:nth-child(4n) h2{color:var(--maroon);text-shadow:12px 10px 0 rgba(228,183,77,.12)}@media(prefers-reduced-motion:reduce){.menu-ribbon span{animation:none;padding-left:0}}@media(max-width:640px){.menu-ribbon{margin-top:25px;font-size:7px}.menu-chapter-mood{font-size:7px}.menu-chapter-mood:before{width:18px;height:18px;box-shadow:inset 0 0 0 5px var(--cream)}}
`;

export default function MenuPage() {
  return <div className="site-shell menu-page-shell">
    <SiteHeader paper />
    <main className="menu-page" id="top">
      <style>{chapterStyles}</style>
      <section className="menu-page-hero section-pad" aria-labelledby="full-menu-title">
        <p className="eyebrow eyebrow--maroon">Naatures Scuup / Display menu</p>
        <div className="menu-page-hero__grid"><h1 id="full-menu-title">The full<br /><i>craving list.</i></h1><div><p>Every category on one page, from the first share to the last scoop. The dish notes are aligned to the restaurant’s public Zomato listing; this remains a display-only menu.</p><span>{menuItemCount} listed dishes · Vegetarian multi-cuisine</span></div></div>
        <nav className="menu-page-index" aria-label="Menu category index">{menuChapters.map((chapter) => <a key={chapter.slug} href={`#${chapter.slug}`}><small>{chapter.index}</small>{chapter.title}</a>)}</nav>
      </section>
      <div className="menu-ribbon" aria-hidden="true"><span>Follow the craving · Mall Road menu · savoury to sweet · every table mood · follow the craving · Mall Road menu · savoury to sweet · every table mood · </span></div>
      <section className="menu-page-list section-pad" aria-label="Full Naatures Scuup menu">
        {menuChapters.map((chapter) => {
          const image = swiggyImages[chapter.slug];
          return <article id={chapter.slug} className="menu-page-category" key={chapter.slug}>
            <header><p className="eyebrow eyebrow--maroon">{chapter.index} / {chapter.note}</p><h2>{chapter.title}</h2><p>{chapter.detail}</p><div className="menu-chapter-mood">{chapterMoods[chapter.slug]}</div>{image && <figure style={{margin:"28px 0 0",background:"var(--maroon-deep)"}}><img src={image.src} alt={image.alt} style={{display:"block",width:"100%",aspectRatio:"1.35",objectFit:"cover"}} /><figcaption style={{padding:"9px 11px",color:"var(--cream)",fontSize:"7px",fontWeight:800,letterSpacing:".11em",textTransform:"uppercase"}}>{image.caption}</figcaption></figure>}</header>
            <ol>{chapter.dishes.map((dish, index) => <li key={dish} style={{alignItems:"start"}}><span>{String(index + 1).padStart(2,"0")}</span><div><strong>{dish}</strong><p style={{margin:"6px 0 0",color:"rgb(33 24 26 / 62%)",fontSize:"10px",lineHeight:1.45}}>{dishNotes[dish] ?? chapter.detail}</p></div></li>)}</ol>
          </article>;
        })}
      </section>
      <section className="menu-page-closing section-pad"><div><p className="eyebrow eyebrow--light">Freeze the happiness</p><h2>Find your<br /><i>table mood.</i></h2></div><div className="menu-page-closing__actions"><a className="button button--cream" href="https://www.google.com/maps/search/?api=1&query=Naatures+Scuup+The+Mall+126+Mall+Road+Kanpur" target="_blank" rel="noreferrer">Get directions <MapPin size={16} /></a><Link className="text-action text-action--cream" href="/">Back to home <ArrowDownRight size={16} /></Link></div></section>
    </main>
    <SiteFooter />
  </div>;
}
