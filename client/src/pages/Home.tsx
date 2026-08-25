/**
 * Style reminder — Mall Road Monograph: original contemporary Indian editorial hospitality with a dark, immersive frontispiece hero, left-aligned display type, a factual Mall Road table card, an angled maroon foreground contour, and a quiet lower-edge scroll guide.
 * The only foreground food photography lives in the tactile table, where all seven owner-supplied images appear once each.
 * Background-only generative visuals create atmosphere behind HTML copy; no generated food image is presented as a foreground menu item.
 * #FREEZETHEHAPPINESS is a restrained signature; the experience is display-only and never a copy of another restaurant’s layout.
 * Home-route visual updates use a document refresh in development to keep icon DOM reconciliation stable.
 */
import { ArrowDown, ArrowDownRight, ArrowRight, ChevronRight, Clock3, Sparkles, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { DragFoodCanvas } from "@/components/DragFoodCanvas";
import { GoogleReviews } from "@/components/GoogleReviews";
import { LocationAtlas } from "@/components/LocationAtlas";
import { MobileVisitDock } from "@/components/MobileVisitDock";
import { RouteMeta } from "@/components/RouteMeta";
import { SiteFooter } from "@/components/SiteFooter";

const authenticImages = {
  pizza: "/manus-storage/NS1_10e3ab35.png",
  iceCreamCup: "/manus-storage/NS2_17e883c9.png",
  starterPlate: "/manus-storage/NS3_a099f388.png",
  kababs: "/manus-storage/Screenshot(107)_33b7f867.png",
  pastaRed: "/manus-storage/Screenshot(109)_b4ce8442.png",
  pastaGreen: "/manus-storage/Screenshot(108)_6acee474.png",
  iceCreamCounter: "/manus-storage/Screenshot(106)_f7d47076.png",
} as const;

const foodCanvasItems = [
  { src: authenticImages.pizza, tag: "PIZZA", label: "Pizza", note: "The share plate", alt: "Restaurant pizza with a chilled drink" },
  { src: authenticImages.kababs, tag: "STARTERS", label: "Kababs", note: "The first pass", alt: "Restaurant-made kababs with onion rings and garnish" },
  { src: authenticImages.pastaRed, tag: "PASTA", label: "Pasta", note: "The comfort bowl", alt: "Restaurant pasta topped with herbs and cream sauce" },
  { src: authenticImages.starterPlate, tag: "SNACKS", label: "Starters", note: "Crisp at the centre", alt: "Crisp restaurant starter served with garnish" },
  { src: authenticImages.pastaGreen, tag: "PASTA", label: "Pasta", note: "A bright plate", alt: "Creamy green pasta with olives and garlic bread" },
  { src: authenticImages.iceCreamCup, tag: "ICE CREAM", label: "Scoops", note: "Make room", alt: "Scoops of ice cream in Naatures Scuup cups" },
  { src: authenticImages.iceCreamCounter, tag: "DESSERTS", label: "Counter", note: "The last stop", alt: "Two bright scoops of ice cream served at the restaurant counter" },
] as const;

function scrollToId(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="site-shell">
      <RouteMeta title="Naatures Scuup | Vegetarian Restaurant on Mall Road, Kanpur" description="Explore the display-only digital menu for Naatures Scuup, a vegetarian multi-cuisine restaurant at 126, The Mall Road, Kanpur." />
      <main id="top">
        <section className="hero hero--frontispiece" aria-labelledby="hero-title">
          <div className="hero-image" role="img" aria-label="Original multi-cuisine vegetarian food background" />
          <div className="hero-tint" />
          <div className="hero-horizon" aria-hidden="true" />
          <svg className="hero-flavour-trail" viewBox="0 0 520 250" aria-hidden="true"><path d="M 0 72 C 76 67, 91 181, 184 176 S 228 88, 310 112 S 360 222, 520 183" /></svg>
          <div className="hero-frontispiece__stage">
          <div className="hero-content hero-content--frontispiece">
            <div className="hero-meta reveal-up"><span className="verified-dot" /><span>Vegetarian multi-cuisine restaurant</span><span className="meta-divider" /><span>Mall Road, Kanpur</span><span className="hero-slogan">#FREEZETHEHAPPINESS</span></div>
            <p className="eyebrow reveal-up delay-1">The all-day craving table</p>
              <h1 id="hero-title" className="editorial-title editorial-title--light reveal-up delay-2"><span className="title-outline">ONE PLACE.</span><br /><i>every craving.</i></h1>
            <p className="hero-copy reveal-up delay-3">South Indian favourites, pizza, Chinese, comfort snacks, shakes, desserts and ice cream—right in the heart of Kanpur.</p>
            <div className="hero-actions reveal-up delay-4">
              <Link className="button button--cream" href="/menu">FIND YOUR FAVOURITE <ArrowDownRight size={17} /></Link>
              <button className="text-action" type="button" onClick={() => scrollToId("#location")}>Directions to Mall Road <ArrowRight size={17} /></button>
            </div>
          </div>
            <aside className="hero-table-card reveal-up delay-3" aria-label="Naatures Scuup table guide">
              <div className="hero-table-card__topline"><span><i /> Mall Road table guide</span><small>Open daily · 12–10:30</small></div>
              <div className="hero-table-card__facts"><span><b>100%</b><small>vegetarian</small></span><span><b>204</b><small>dishes to explore</small></span><span><b>17</b><small>craving chapters</small></span></div>
              <div className="hero-table-card__route"><span>South Indian</span><span>Pizza &amp; Pasta</span><span>Chinese</span><span>Shakes &amp; Scoops</span></div>
              <div className="hero-table-card__footer"><span>One table / many moods</span><Link href="/menu">Browse the menu <ArrowRight size={15} /></Link></div>
            </aside>
          </div>
          <div className="hero-trust reveal-up delay-4" aria-label="Restaurant information"><span><Star size={14} fill="currentColor" /> 4.0</span><span>819 Google reviews</span><span>₹200–₹400 per person</span><span className="hero-hours"><Clock3 size={13} /> Open daily · 12:00 PM–10:30 PM</span></div>
          <button className="hero-scroll-cue reveal-up delay-4" type="button" onClick={() => scrollToId("#story")} aria-label="Scroll to the Naatures Scuup story"><span>Scroll to discover</span><i><ArrowDown size={16} strokeWidth={1.8} /></i></button>
        </section>

        <div className="craving-ribbon" aria-hidden="true"><div><span>Dosa</span><b>•</b><span>Paneer</span><b>•</b><span>Pizza</span><b>•</b><span>Chinese</span><b>•</b><span>Shakes</span><b>•</b><span>Ice cream</span><b>•</b><span>Dosa</span><b>•</b><span>Paneer</span><b>•</b><span>Pizza</span><b>•</b><span>Chinese</span><b>•</b><span>Shakes</span><b>•</b><span>Ice cream</span><b>•</b></div></div>

        <section id="story" className="story-section section-pad">
          <div className="story-grid story-grid--text">
            <motion.div className="story-intro" initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.22 }} transition={{ duration: 0.48, ease: [0.23, 1, 0.32, 1] }}>
              <p className="eyebrow eyebrow--maroon">01 / The Scuup story</p>
              <h2 className="editorial-title">Come for the craving.<br /><i>Stay for the scoop.</i></h2>
              <p className="body-large">Move from a crisp dosa to a hot pizza, from a cool shake to something sweet. Naatures Scuup brings together familiar favourites for every kind of gathering. #FREEZETHEHAPPINESS</p>
              <button className="inline-link" type="button" onClick={() => scrollToId("#location")}>Discover Mall Road <ChevronRight size={17} /></button>
            </motion.div>
            <motion.aside className="story-manifesto story-manifesto--mall-road" initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.22 }} transition={{ duration: 0.48, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}><span>Kanpur / Mall Road</span><p>“One table,<br />many <i>moods.</i>”</p><small>#FREEZETHEHAPPINESS</small></motion.aside>
            <div className="story-stamp" aria-label="One place every craving"><span>One place</span><Sparkles size={18} /><span>Every craving</span></div>
          </div>
        </section>

        <DragFoodCanvas items={foodCanvasItems} />
        <section className="food-menu-bridge" aria-label="Explore the full menu"><Link className="button button--cream" href="/menu">Explore the full menu <ArrowRight size={17} /></Link></section>

        <section id="ice-cream-destination" className="ice-cream-destination" aria-labelledby="ice-cream-destination-title">
          <div className="ice-cream-destination__image" role="img" aria-label="Editorial background showing a frozen dessert table" />
          <div className="ice-cream-destination__veil" />
          <motion.div className="ice-cream-destination__inner section-pad" initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.48, ease: [0.23, 1, 0.32, 1] }}>
            <p className="eyebrow eyebrow--mango">04 / The last course</p>
            <h2 id="ice-cream-destination-title" className="editorial-title editorial-title--light"><span className="title-outline">Save room.</span><br /><i>For the scoop.</i></h2>
            <p className="ice-cream-destination__copy">From classic ice creams to chilled dessert moments, the last stop on the table deserves its own chapter.</p>
            <div className="ice-cream-destination__facts" aria-label="Ice cream menu highlights"><span><b>ICE CREAMS</b><small>Dedicated menu chapter</small></span><span><b>CHILLED</b><small>Desserts &amp; shakes</small></span><span><b>NS / SCOOP</b><small>#FREEZETHEHAPPINESS</small></span></div>
            <Link className="ice-cream-destination__cta" href="/menu#ice-creams">Explore ice creams <ArrowRight size={17} /></Link>
          </motion.div>
        </section>

        <GoogleReviews />

        <LocationAtlas />
        <section id="faq" className="faq-section section-pad" aria-labelledby="faq-title"><div><p className="eyebrow eyebrow--maroon">05 / Before you visit</p><h2 id="faq-title">Good to<br /><i>know.</i></h2><p>Questions about a visit? Call <a href="tel:07860880088">+91 78608 80088</a>. We aim to respond within the current service window.</p></div><div className="faq-list"><motion.details open initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}><summary>Where is Naatures Scuup?</summary><p>Find us at 126, The Mall Road, Mirpur, Kanpur, Uttar Pradesh 208004. <span className="faq-answer-signature">#FREEZETHEHAPPINESS</span></p></motion.details><motion.details initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}><summary>Is the menu vegetarian?</summary><p>Yes. The restaurant presents a vegetarian multi-cuisine menu. <span className="faq-answer-signature">#FREEZETHEHAPPINESS</span></p></motion.details><motion.details initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}><summary>What can I browse online?</summary><p>The digital menu lists 204 dishes across 17 groups, with search and display-only sorting. <span className="faq-answer-signature">#FREEZETHEHAPPINESS</span></p></motion.details><motion.details initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}><summary>Can I order or reserve from this website?</summary><p>No. This website is a display guide only; it does not offer ordering or reservations. <span className="faq-answer-signature">#FREEZETHEHAPPINESS</span></p></motion.details><motion.details initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}><summary>How do I get directions?</summary><p>Use the directions link above or the sticky mobile directions control to open Google Maps. <span className="faq-answer-signature">#FREEZETHEHAPPINESS</span></p></motion.details></div></section>
      </main>
      <SiteFooter />
      <MobileVisitDock />
    </div>
  );
}
