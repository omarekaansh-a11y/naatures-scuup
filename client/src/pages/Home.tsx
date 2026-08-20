/**
 * Style reminder — Mall Road Monograph: original contemporary Indian editorial hospitality.
 * Food leads; maroon, cream, fennel green; asymmetric vertical tasting journey; quiet motion.
 * Display-only service: discovery, menu browsing, location, and brand story — never ordering or reservations.
 */
import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ChevronRight,
  Instagram,
  MapPin,
  Menu as MenuIcon,
  Sparkles,
  Star,
  X,
} from "lucide-react";

const ownerLogo = "/manus-storage/naatures-scuup-owner-logo_ffd775f3.jpg";

const menuChapters = [
  {
    index: "01",
    title: "Tandoor & Starters",
    note: "The first share",
    detail: "Crisp, smoky, tangy and made to arrive at the centre of the table.",
    dishes: ["Dahi Kabab", "Paneer Tikka", "Hara Bhara Kabab", "Paneer Afghani Tikka", "Crispy Corn", "Chinese Bhel", "Dahi Kabab Roll", "Paneer 65"],
  },
  {
    index: "02",
    title: "Soups & Salads",
    note: "Bright beginnings",
    detail: "Fresh sides and comforting bowls for a gentler start to the meal.",
    dishes: ["Onion Salad", "Cucumber Salad", "Green Salad", "Mix Fruit Salad", "Cream of Tomato Soup", "Hot and Sour Soup", "Manchow Soup", "Veg Corn Soup"],
  },
  {
    index: "03",
    title: "North Indian",
    note: "Rich, familiar, generous",
    detail: "Paneer, dal and seasonal vegetable favourites with breads made for every spoonful.",
    dishes: ["Paneer Lababdar", "Paneer Butter Masala", "Shahi Paneer", "Kadai Paneer", "Malai Kofta", "Dal Makhani", "Mushroom Masala", "Pindi Chana"],
  },
  {
    index: "04",
    title: "Rice & Biryani",
    note: "A fragrant chapter",
    detail: "Everyday comforts and fragrant rice plates, from a simple bowl to a celebratory biryani.",
    dishes: ["Veg Biryani", "Hyderabadi Dum Biryani", "Jeera Rice", "Kashmiri Pulao", "Lemon Rice", "Curd Rice", "Veg Pulao", "Cheese Pulao"],
  },
  {
    index: "05",
    title: "South Indian",
    note: "Crisp comfort",
    detail: "The familiar pull of a well-made dosa, chutney on the side and a table that lingers.",
    dishes: ["Paneer Dosa", "Plain Dosa", "Uttapam"],
  },
  {
    index: "06",
    title: "Chinese",
    note: "Wok-tossed energy",
    detail: "A lively Indo-Chinese chapter with crunch, spice, noodles and satisfying sauces.",
    dishes: ["Veg Manchurian", "Chilli Paneer", "Paneer Manchurian", "Fried Rice", "Schezwan Rice", "Veg Chowmein", "Hakka Noodles with Gravy", "American Chopsuey"],
  },
  {
    index: "07",
    title: "Pizza & Pasta",
    note: "Cheese pulls & twirls",
    detail: "A crowd-pleasing page of pizzas and pasta for every table mood.",
    dishes: ["Pizza Indiana", "Cheese Burst Pizza", "Chilli Paneer Pizza", "Paneer Pizza", "Cheese Mushroom Pizza", "Alfredo White Sauce", "Arrabiata Red Sauce", "Rosato Pink Sauce Pasta"],
  },
  {
    index: "08",
    title: "Burgers & Snacks",
    note: "Quick-table favourites",
    detail: "Toasted, stacked, crisp and easy to share—the in-between favourites.",
    dishes: ["Cheese Burger", "Veg Burger", "Paneer Sandwich", "Honey Chilli Potato", "Cheese Garlic Bread", "Masala Fries", "Chole Bhature", "Paneer Kathi Roll"],
  },
  {
    index: "09",
    title: "Ice Creams",
    note: "The sweet finish",
    detail: "Seasonal fruit, familiar classics and a reason to make room for another scoop.",
    dishes: ["Sitafal Ice Cream", "Royal Rose Ice Cream", "Tender Coconut", "Kesar Pista", "Belgian Chocolate", "Alphonso", "Jamun", "Pan Ice Cream"],
  },
  {
    index: "10",
    title: "Shakes & Mocktails",
    note: "Sip slowly",
    detail: "Cool, bright and made to stretch the conversation a little longer.",
    dishes: ["Spicy Lemonade", "Virgin Mojito", "Kiwi Blast", "Blue Lagoon", "Oreo Mud Shake", "Kit Kat Break Shake", "Ferro Rocher Shake", "Cold Coffee with Vanilla Ice Cream"],
  },
] as const;

const navItems = [
  ["Menu", "#menu-index"],
  ["Story", "#story"],
  ["Experience", "#experience"],
  ["Find us", "#location"],
] as const;

function scrollToId(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const selected = menuChapters[activeCategory];
  const goTo = (target: string) => {
    setIsMenuOpen(false);
    scrollToId(target);
  };

  return (
    <div className="site-shell">
      <header className={`site-header ${isScrolled ? "site-header--scrolled" : ""}`}>
        <a className="brand-logo-link" href="#top" aria-label="Naatures Scuup home" onClick={() => goTo("#top")}>
          <img className="brand-logo" src={ownerLogo} alt="Naatures Scuup — Freeze the happiness" />
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, target]) => (
            <a key={label} href={target} onClick={() => goTo(target)}>{label}</a>
          ))}
        </nav>

        <button className="header-explore" type="button" onClick={() => goTo("#menu-index")}>
          <span>View menu</span><ArrowRight size={15} />
        </button>

        <button className="mobile-menu-toggle" type="button" aria-label={isMenuOpen ? "Close navigation" : "Open navigation"} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((value) => !value)}>
          {isMenuOpen ? <X size={21} strokeWidth={1.8} /> : <MenuIcon size={22} strokeWidth={1.8} />}
        </button>
      </header>

      <div className={`mobile-drawer ${isMenuOpen ? "mobile-drawer--open" : ""}`} aria-hidden={!isMenuOpen}>
        <div className="drawer-label">Explore</div>
        {navItems.map(([label, target], index) => (
          <button key={label} type="button" onClick={() => goTo(target)}>
            <small>{String(index + 1).padStart(2, "0")}</small>{label}<ArrowRight size={22} />
          </button>
        ))}
        <button className="drawer-location" type="button" onClick={() => goTo("#location")}><MapPin size={16} /> Mall Road, Kanpur</button>
      </div>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-image" role="img" aria-label="An original multi-cuisine vegetarian food spread" />
          <div className="hero-tint" />
          <div className="hero-content">
            <div className="hero-meta reveal-up"><span className="verified-dot" /><span>Vegetarian multi-cuisine restaurant</span><span className="meta-divider" /><span>Mall Road, Kanpur</span></div>
            <p className="eyebrow reveal-up delay-1">The all-day craving table</p>
            <h1 id="hero-title" className="reveal-up delay-2">One place.<br /><i>Every craving.</i></h1>
            <p className="hero-copy reveal-up delay-3">South Indian favourites, pizza, Chinese, comfort snacks, shakes, desserts and ice cream—right in the heart of Kanpur.</p>
            <div className="hero-actions reveal-up delay-4">
              <button className="button button--cream" type="button" onClick={() => goTo("#menu-index")}>Discover the menu <ArrowDownRight size={17} /></button>
              <button className="text-action" type="button" onClick={() => goTo("#location")}>Find us on Mall Road <ArrowRight size={17} /></button>
            </div>
          </div>
          <div className="hero-trust reveal-up delay-4" aria-label="Restaurant information"><span><Star size={14} fill="currentColor" /> 4.0</span><span>819 Google reviews</span><span>₹200–₹400 per person</span></div>
          <button className="scroll-cue" type="button" onClick={() => goTo("#story")} aria-label="Scroll to the restaurant story"><span>Scroll for flavour</span><ArrowDownRight size={17} /></button>
        </section>

        <div className="craving-ribbon" aria-hidden="true"><div><span>Dosa</span><b>•</b><span>Paneer</span><b>•</b><span>Pizza</span><b>•</b><span>Chinese</span><b>•</b><span>Shakes</span><b>•</b><span>Ice cream</span><b>•</b><span>Dosa</span><b>•</b><span>Paneer</span><b>•</b><span>Pizza</span><b>•</b><span>Chinese</span><b>•</b><span>Shakes</span><b>•</b><span>Ice cream</span><b>•</b></div></div>

        <section id="story" className="story-section section-pad">
          <div className="section-grid story-grid">
            <div className="story-intro">
              <p className="eyebrow eyebrow--maroon">01 / The Scuup story</p>
              <h2>Come for the craving.<br /><i>Stay for the scoop.</i></h2>
              <p className="body-large">The table can move from a crisp dosa to a hot pizza, from a cool shake to something sweet. Naatures Scuup brings together familiar favourites for every kind of gathering.</p>
              <button className="inline-link" type="button" onClick={() => goTo("#location")}>Discover Mall Road <ChevronRight size={17} /></button>
            </div>
            <figure className="story-image image-frame image-frame--tall"><img src="/manus-storage/naatures-scuup-dosa_99a20908.jpg" alt="Crisp masala dosa with chutneys" /><figcaption>Made for the long lunch and the quick catch-up.</figcaption></figure>
            <div className="story-stamp" aria-label="One place every craving"><span>One place</span><Sparkles size={18} /><span>Every craving</span></div>
          </div>
        </section>

        <section id="experience" className="experience-section">
          <div className="experience-header section-pad"><p className="eyebrow eyebrow--light">02 / Choose your chapter</p><div><h2>However the table<br />feels <i>today.</i></h2><p>Start savoury. Finish sweet. Follow the appetite wherever it goes.</p></div></div>
          <div className="experience-composition">
            <figure className="experience-image experience-image--primary"><img src="/manus-storage/naatures-scuup-live-ice-cream_e00c391b.jpg" alt="Live ice cream rolls with chocolate and colourful toppings" loading="lazy" /></figure>
            <article className="experience-words"><p className="eyebrow eyebrow--cream">The sweet finish</p><h3>Made live.<br /><i>Made memorable.</i></h3><p>Fruit-forward flavours, favourite classics and a little theatre from the ice cream counter.</p><button className="text-action text-action--cream" type="button" onClick={() => { setActiveCategory(8); goTo("#menu-index"); }}>See ice cream flavours <ArrowRight size={17} /></button></article>
            <div className="experience-aside"><span>Save room</span><span>09 / 10</span></div>
          </div>
        </section>

        <section id="menu-index" className="menu-section section-pad" aria-labelledby="menu-title">
          <div className="menu-heading"><div><p className="eyebrow eyebrow--maroon">03 / The menu index</p><h2 id="menu-title">Pick the<br /><i>mood.</i></h2></div><p>Browse the owner-supplied menu by chapter. Select a category to see a curated selection from the display menu.</p></div>
          <div className="menu-layout">
            <div className="menu-list" role="tablist" aria-label="Food categories">
              {menuChapters.map((category, index) => <button key={category.title} type="button" className={`menu-row ${activeCategory === index ? "menu-row--active" : ""}`} onClick={() => setActiveCategory(index)} role="tab" aria-selected={activeCategory === index}><span>{category.index}</span><strong>{category.title}</strong><em>{category.note}</em><ArrowRight size={19} /></button>)}
            </div>
            <aside className="menu-feature" aria-live="polite">
              <span className="feature-index">{selected.index} / 10</span>
              <div className={`feature-wash feature-wash--${activeCategory % 4}`}><span className="feature-word">{selected.title.split(" ")[0]}</span><span className="feature-orb feature-orb--one" /><span className="feature-orb feature-orb--two" /></div>
              <div className="menu-feature-copy"><p className="eyebrow eyebrow--maroon">{selected.note}</p><p>{selected.detail}</p><div className="dish-grid" aria-label={`${selected.title} selected dishes`}>{selected.dishes.map((dish) => <span key={dish}>{dish}</span>)}</div><span className="menu-display-note">Display menu · selections may vary</span></div>
            </aside>
          </div>
        </section>

        <section className="pasta-section"><div className="pasta-copy"><p className="eyebrow eyebrow--light">A table for every appetite</p><h2>From hot plates<br />to <i>cold scoops.</i></h2><p>Explore pizza, pasta, warm snacks and the favourites that keep a long table happy.</p><button className="button button--cream" type="button" onClick={() => { setActiveCategory(6); goTo("#menu-index"); }}>Explore pizza &amp; pasta <ArrowDownRight size={17} /></button></div><figure className="pasta-image"><img src="/manus-storage/naatures-scuup-pizza-pasta_b0a49e06.jpg" alt="Vegetarian pizza, pasta and a refreshing mojito" loading="lazy" /></figure></section>

        <section id="location" className="location-section section-pad" aria-labelledby="location-title">
          <div className="location-map-art" aria-hidden="true"><span className="map-road map-road--one" /><span className="map-road map-road--two" /><span className="map-road map-road--three" /><span className="map-marker"><MapPin size={22} fill="currentColor" /> <b>Naatures Scuup</b></span><span className="map-label map-label--one">Mall Road</span><span className="map-label map-label--two">Kanpur</span><span className="map-label map-label--three">The Mall</span></div>
          <div className="location-content"><p className="eyebrow eyebrow--maroon">04 / Make your way over</p><h2 id="location-title">Meet us on<br /><i>Mall Road.</i></h2><p className="location-address">The Mall, 126, The Mall Rd,<br />Mirpur, Kanpur, Uttar Pradesh 208004</p><div className="location-actions"><a className="button button--maroon" href="https://www.google.com/maps/search/?api=1&query=Naatures+Scuup+The+Mall+126+Mall+Road+Kanpur" target="_blank" rel="noreferrer">Get directions <MapPin size={16} /></a><p className="location-phone">078608 80088</p></div><div className="location-facts"><span><Star size={14} fill="currentColor" /> 4.0 on Google</span><span>Vegetarian</span><span>₹200–₹400</span></div></div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-top"><p className="footer-signoff">A little more appetite<br />is always a good idea.</p><div className="footer-identity"><img src={ownerLogo} alt="Naatures Scuup — Freeze the happiness" /><p>126, The Mall Road<br />Kanpur, Uttar Pradesh</p></div></div>
        <div className="footer-bottom"><div className="footer-contact"><span>078608 80088</span><a className="footer-social" href="https://www.facebook.com/naaturesscuup/" target="_blank" rel="noreferrer"><Instagram size={14} /> @naaturesscuup</a></div><p>Multi-cuisine vegetarian dining &amp; desserts in Kanpur.</p><p>© {new Date().getFullYear()} Naatures Scuup</p></div>
      </footer>
    </div>
  );
}
