/**
 * Style reminder — Mall Road Monograph: original contemporary Indian editorial hospitality.
 * Food leads; maroon, cream, fennel green; asymmetric vertical tasting journey; quiet motion.
 */
import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ChevronRight,
  MapPin,
  Menu as MenuIcon,
  Phone,
  Sparkles,
  Star,
  X,
} from "lucide-react";

const categories = [
  {
    index: "01",
    title: "South Indian",
    note: "Dosa, idli & warm comfort",
    detail:
      "A comforting first stop: crisp dosas, chutneys with a little brightness, and easy plates made for lingering conversations.",
  },
  {
    index: "02",
    title: "Pizza & Pasta",
    note: "Cheese pulls & twirled forks",
    detail:
      "For the table that wants familiar comfort with a generous side of choice—hot pizzas, saucy pasta, and one more shared bite.",
  },
  {
    index: "03",
    title: "Chinese",
    note: "Wok-tossed & full of flavour",
    detail:
      "A lively Indo-Chinese chapter of noodles, sauces, and satisfying, straight-from-the-wok energy.",
  },
  {
    index: "04",
    title: "Burgers & Sandwiches",
    note: "Stacked, toasted, satisfying",
    detail:
      "Quick, cheerful, and built for a proper appetite—ideal when the craving is simple and the table is hungry.",
  },
  {
    index: "05",
    title: "Fast Food",
    note: "The in-between favourites",
    detail:
      "The classics that keep an easy meal moving: snacks, sides, and quick plates for every kind of catch-up.",
  },
  {
    index: "06",
    title: "Ice Cream",
    note: "Live-made, cold, unmistakable",
    detail:
      "Watch a craving become a scoop. The live ice cream counter gives every visit a sweet little finale.",
  },
  {
    index: "07",
    title: "Desserts",
    note: "A reason to stay longer",
    detail:
      "Pastries, sweet plates, and dessert-first decisions. No judgment when this is your starting point.",
  },
  {
    index: "08",
    title: "Shakes & Beverages",
    note: "Sip slowly or take it with you",
    detail:
      "Cool shakes, bright mojitos, and familiar favourites that make the meal last a little longer.",
  },
];

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

  const selected = categories[activeCategory];

  const goTo = (target: string) => {
    setIsMenuOpen(false);
    scrollToId(target);
  };

  return (
    <div className="site-shell">
      <header className={`site-header ${isScrolled ? "site-header--scrolled" : ""}`}>
        <a className="brand-text" href="#top" aria-label="Naatures Scuup home" onClick={() => goTo("#top")}>
          <span>Naatures</span>
          <strong>Scuup</strong>
          <em>Kanpur</em>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, target]) => (
            <a key={label} href={target} onClick={() => goTo(target)}>
              {label}
            </a>
          ))}
        </nav>

        <a className="header-order" href="tel:+917860880088">
          <span>Call to order</span>
          <ArrowUpRightIcon />
        </a>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((value) => !value)}
        >
          {isMenuOpen ? <X size={21} strokeWidth={1.8} /> : <MenuIcon size={22} strokeWidth={1.8} />}
        </button>
      </header>

      <div className={`mobile-drawer ${isMenuOpen ? "mobile-drawer--open" : ""}`} aria-hidden={!isMenuOpen}>
        <div className="drawer-label">Navigate</div>
        {navItems.map(([label, target], index) => (
          <button key={label} type="button" onClick={() => goTo(target)}>
            <small>0{index + 1}</small>
            {label}
            <ArrowRight size={22} />
          </button>
        ))}
        <a href="tel:+917860880088" onClick={() => setIsMenuOpen(false)} className="drawer-call">
          <Phone size={16} /> Call Naatures Scuup
        </a>
      </div>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-image" role="img" aria-label="An original multi-cuisine vegetarian food spread" />
          <div className="hero-tint" />
          <div className="hero-content">
            <div className="hero-meta reveal-up">
              <span className="verified-dot" />
              <span>Vegetarian multi-cuisine restaurant</span>
              <span className="meta-divider" />
              <span>Mall Road, Kanpur</span>
            </div>
            <p className="eyebrow reveal-up delay-1">The all-day craving table</p>
            <h1 id="hero-title" className="reveal-up delay-2">
              One place.<br />
              <i>Every craving.</i>
            </h1>
            <p className="hero-copy reveal-up delay-3">
              South Indian favourites, pizza, Chinese, fast food, shakes, desserts and live ice cream—right in the heart of Kanpur.
            </p>
            <div className="hero-actions reveal-up delay-4">
              <a className="button button--cream" href="tel:+917860880088">
                Call to order <ArrowDownRight size={17} />
              </a>
              <button className="text-action" type="button" onClick={() => goTo("#menu-index")}>
                Explore the menu <ArrowRight size={17} />
              </button>
            </div>
          </div>
          <div className="hero-trust reveal-up delay-4" aria-label="Restaurant trust information">
            <span><Star size={14} fill="currentColor" /> 4.0</span>
            <span>819 Google reviews</span>
            <span>₹200–₹400 per person</span>
          </div>
          <button className="scroll-cue" type="button" onClick={() => goTo("#story")} aria-label="Scroll to the restaurant story">
            <span>Scroll for flavour</span>
            <ArrowDownRight size={17} />
          </button>
        </section>

        <div className="craving-ribbon" aria-hidden="true">
          <div>
            <span>Dosa</span><b>•</b><span>Pizza</span><b>•</b><span>Chinese</span><b>•</b><span>Shakes</span><b>•</b><span>Live ice cream</span><b>•</b><span>Dosa</span><b>•</b><span>Pizza</span><b>•</b><span>Chinese</span><b>•</b><span>Shakes</span><b>•</b><span>Live ice cream</span><b>•</b>
          </div>
        </div>

        <section id="story" className="story-section section-pad">
          <div className="section-grid story-grid">
            <div className="story-intro">
              <p className="eyebrow eyebrow--maroon">01 / The Scuup story</p>
              <h2>Come for the craving.<br /><i>Stay for the scoop.</i></h2>
              <p className="body-large">
                No two orders at the same table need to be alike. At Naatures Scuup, the meal moves easily from a crisp dosa to a hot pizza, from a cool shake to something made fresh at the live ice cream counter.
              </p>
              <a className="inline-link" href="#location" onClick={() => goTo("#location")}>
                Discover Mall Road <ChevronRight size={17} />
              </a>
            </div>
            <figure className="story-image image-frame image-frame--tall">
              <img src="/manus-storage/naatures-scuup-dosa_99a20908.jpg" alt="Crisp masala dosa with chutneys" />
              <figcaption>Made for the long lunch and the quick catch-up.</figcaption>
            </figure>
            <div className="story-stamp" aria-label="One place every craving">
              <span>One place</span>
              <Sparkles size={18} />
              <span>Every craving</span>
            </div>
          </div>
        </section>

        <section id="experience" className="experience-section">
          <div className="experience-header section-pad">
            <p className="eyebrow eyebrow--light">02 / Choose your chapter</p>
            <div>
              <h2>However the table<br />feels <i>today.</i></h2>
              <p>Start savoury. End sweet. Or do it the other way around.</p>
            </div>
          </div>
          <div className="experience-composition">
            <figure className="experience-image experience-image--primary">
              <img src="/manus-storage/naatures-scuup-live-ice-cream_e00c391b.jpg" alt="Live ice cream rolls with chocolate and colourful toppings" loading="lazy" />
            </figure>
            <article className="experience-words">
              <p className="eyebrow eyebrow--cream">The sweet finish</p>
              <h3>Made live.<br /><i>Gone quickly.</i></h3>
              <p>
                The ice cream counter brings a little theatre to the table. Watch the roll, pick the topping, keep room for one more spoon.
              </p>
              <button className="text-action text-action--cream" type="button" onClick={() => { setActiveCategory(5); goTo("#menu-index"); }}>
                Find ice cream <ArrowRight size={17} />
              </button>
            </article>
            <div className="experience-aside">
              <span>Save room</span>
              <span>06 / 08</span>
            </div>
          </div>
        </section>

        <section id="menu-index" className="menu-section section-pad" aria-labelledby="menu-title">
          <div className="menu-heading">
            <div>
              <p className="eyebrow eyebrow--maroon">03 / The menu index</p>
              <h2 id="menu-title">Pick the<br /><i>mood.</i></h2>
            </div>
            <p>
              A quick way to browse what feels right. Choose a food chapter, then call us to order your favourites for pickup or dine-in.
            </p>
          </div>
          <div className="menu-layout">
            <div className="menu-list" role="tablist" aria-label="Food categories">
              {categories.map((category, index) => (
                <button
                  key={category.title}
                  type="button"
                  className={`menu-row ${activeCategory === index ? "menu-row--active" : ""}`}
                  onClick={() => setActiveCategory(index)}
                  role="tab"
                  aria-selected={activeCategory === index}
                >
                  <span>{category.index}</span>
                  <strong>{category.title}</strong>
                  <em>{category.note}</em>
                  <ArrowRight size={19} />
                </button>
              ))}
            </div>
            <aside className="menu-feature" aria-live="polite">
              <span className="feature-index">{selected.index} / 08</span>
              <div className={`feature-wash feature-wash--${activeCategory % 4}`}>
                <span className="feature-word">{selected.title.split(" ")[0]}</span>
                <span className="feature-orb feature-orb--one" />
                <span className="feature-orb feature-orb--two" />
              </div>
              <div className="menu-feature-copy">
                <p className="eyebrow eyebrow--maroon">{selected.note}</p>
                <p>{selected.detail}</p>
                <a href="tel:+917860880088" className="inline-link">Call to order <Phone size={15} /></a>
              </div>
            </aside>
          </div>
        </section>

        <section className="pasta-section">
          <div className="pasta-copy">
            <p className="eyebrow eyebrow--light">A table for every appetite</p>
            <h2>From hot plates<br />to <i>cold scoops.</i></h2>
            <p>Bring the family, bring the debate, bring the appetite. We have a place for every part of the order.</p>
            <a className="button button--cream" href="tel:+917860880088">Plan your order <ArrowDownRight size={17} /></a>
          </div>
          <figure className="pasta-image">
            <img src="/manus-storage/naatures-scuup-pizza-pasta_b0a49e06.jpg" alt="Vegetarian pizza, pasta and a refreshing mojito" loading="lazy" />
          </figure>
        </section>

        <section id="location" className="location-section section-pad" aria-labelledby="location-title">
          <div className="location-map-art" aria-hidden="true">
            <span className="map-road map-road--one" />
            <span className="map-road map-road--two" />
            <span className="map-road map-road--three" />
            <span className="map-marker"><MapPin size={22} fill="currentColor" /> <b>Naatures Scuup</b></span>
            <span className="map-label map-label--one">Mall Road</span>
            <span className="map-label map-label--two">Kanpur</span>
            <span className="map-label map-label--three">The Mall</span>
          </div>
          <div className="location-content">
            <p className="eyebrow eyebrow--maroon">04 / Make your way over</p>
            <h2 id="location-title">Meet us on<br /><i>Mall Road.</i></h2>
            <p className="location-address">
              The Mall, 126, The Mall Rd,<br />Mirpur, Kanpur, Uttar Pradesh 208004
            </p>
            <div className="location-actions">
              <a className="button button--maroon" href="https://www.google.com/maps/search/?api=1&query=Naatures+Scuup+The+Mall+126+Mall+Road+Kanpur" target="_blank" rel="noreferrer">
                Get directions <MapPin size={16} />
              </a>
              <a className="text-action text-action--dark" href="tel:+917860880088">078608 80088 <ArrowRight size={16} /></a>
            </div>
            <div className="location-facts">
              <span><Star size={14} fill="currentColor" /> 4.0 on Google</span>
              <span>Vegetarian</span>
              <span>₹200–₹400</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-top">
          <p className="footer-signoff">A little more appetite<br />is always a good idea.</p>
          <a className="footer-call" href="tel:+917860880088">Call to order <ArrowUpRightIcon /></a>
        </div>
        <div className="footer-bottom">
          <div className="footer-brand"><span>Naatures</span><strong>Scuup</strong></div>
          <p>Multi-cuisine vegetarian dining &amp; desserts in Kanpur.</p>
          <p>© {new Date().getFullYear()} Naatures Scuup</p>
        </div>
      </footer>
    </div>
  );
}

function ArrowUpRightIcon() {
  return <span aria-hidden="true" className="arrow-up-right">↗</span>;
}
