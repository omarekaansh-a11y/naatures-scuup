/**
 * Style reminder — Mall Road Monograph: original contemporary Indian editorial hospitality with a dark, immersive frontispiece hero, left-aligned display type, a factual Mall Road table card, an angled maroon foreground contour, and a quiet lower-edge scroll guide.
 * The only foreground food photography lives in the tactile table, where six distinct owner-supplied images appear once each.
 * Background-only generative visuals create atmosphere behind HTML copy; no generated food image is presented as a foreground menu item.
 * #FREEZETHEHAPPINESS is a restrained signature within an original restaurant experience.
 * Home-route visual updates use a document refresh in development to keep icon DOM reconciliation stable.
 */
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { DragFoodCanvas } from "@/components/DragFoodCanvas";
import { GoogleReviews } from "@/components/GoogleReviews";
import { IceCreamOrbit } from "@/components/IceCreamOrbit";
import { LocationAtlas } from "@/components/LocationAtlas";
import { MobileVisitDock } from "@/components/MobileVisitDock";
import { OrganicWaveDivider } from "@/components/OrganicWaveDivider";
import { RouteMeta } from "@/components/RouteMeta";
import { SiteFooter } from "@/components/SiteFooter";

const authenticImages = {
  pizza: "/manus-storage/NS1_10e3ab35.png",
  iceCreamCup: "/manus-storage/NS2_17e883c9.png",
  starterPlate: "/manus-storage/NS3_a099f388.png",
  kababs: "/manus-storage/Screenshot(107)_33b7f867.png",
  pastaRed: "/manus-storage/Screenshot(109)_b4ce8442.png",
  iceCreamCounter: "/manus-storage/Screenshot(106)_f7d47076.png",
} as const;

const foodCanvasItems = [
  { src: authenticImages.pizza, tag: "PIZZA", label: "Pizza", note: "The share plate", alt: "Restaurant pizza with a chilled drink" },
  { src: authenticImages.kababs, tag: "STARTERS", label: "Kababs", note: "The first pass", alt: "Restaurant-made kababs with onion rings and garnish" },
  { src: authenticImages.pastaRed, tag: "PASTA", label: "Pasta", note: "The comfort bowl", alt: "Restaurant pasta topped with herbs and cream sauce" },
  { src: authenticImages.starterPlate, tag: "SNACKS", label: "Starters", note: "Crisp at the centre", alt: "Crisp restaurant starter served with garnish" },
  { src: authenticImages.iceCreamCup, tag: "ICE CREAM", label: "Scoops", note: "Make room", alt: "Scoops of ice cream in Naatures Scuup cups" },
  { src: authenticImages.iceCreamCounter, tag: "DESSERTS", label: "Counter", note: "The last stop", alt: "Two bright scoops of ice cream served at the restaurant counter" },
] as const;

function FlowingSentenceDivider() {
  const reduceMotion = useReducedMotion();
  const phrase = "Every table begins a little hungry. The next craving is already on its way. ";
  return <div className="flowing-sentence-divider" aria-hidden="true"><svg viewBox="0 0 1440 116" preserveAspectRatio="none" className="flowing-sentence-divider__svg"><defs><path id="flowing-sentence-divider-path" d="M-180 58 C 112 6, 334 111, 610 58 S 1110 6, 1620 58" /></defs><text className="flowing-sentence-divider__text"><textPath href="#flowing-sentence-divider-path" startOffset="0%">{phrase.repeat(5)}{!reduceMotion && <animate attributeName="startOffset" from="0%" to="-40%" dur="10s" repeatCount="indefinite" />}</textPath></text></svg></div>;
}

function scrollToId(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="site-shell">
      <RouteMeta title="Naatures Scuup | Vegetarian Restaurant on Mall Road, Kanpur" description="Visit Naatures Scuup on Mall Road, Kanpur for vegetarian food, mango ice cream, desserts, shakes and vegan options. Explore our digital menu." />
      <main id="main-content" data-page-top="true">
        <IceCreamOrbit />

        <FlowingSentenceDivider />

        <DragFoodCanvas items={foodCanvasItems} />
        <section className="food-menu-bridge" aria-label="Explore the full menu"><Link className="button button--cream" href="/menu">Explore the full menu <ArrowRight size={17} /></Link></section>
        <OrganicWaveDivider tone="maroon-to-night" />

        <section id="ice-cream-destination" className="ice-cream-destination print-surface print-surface--dark print-halftone maximalist-surface maximalist-surface--night layered-image-depth layered-image-depth--scoop" aria-labelledby="ice-cream-destination-title">
          <div className="ice-cream-destination__image" role="img" aria-label="Editorial background showing a frozen dessert table" />
          <div className="ice-cream-destination__veil" />
          <div className="maximalist-surface__forms" aria-hidden="true" />
          <span className="maximalist-surface__figure" aria-hidden="true">02</span>
          <motion.div className="ice-cream-destination__inner section-pad" initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.48, ease: [0.23, 1, 0.32, 1] }}>
            <span className="maximalist-surface__label">Mall Road’s late table</span>
            <p className="eyebrow eyebrow--mango">02 / The Mall table · #FREEZETHEHAPPINESS</p>
            <h2 id="ice-cream-destination-title" className="editorial-title editorial-title--light print-ink film-print-text film-print-text--bright"><span className="title-outline">Save room.</span><br /><i>For the scoop.</i></h2>
            <p className="ice-cream-destination__copy">From South Indian favourites and shareable pizza to Chinese, comfort snacks, shakes and dessert—Naatures Scuup keeps every vegetarian craving at one Mall Road table.</p>
            <div className="ice-cream-destination__facts" aria-label="Naatures Scuup table guide"><span><b>100%</b><small>Vegetarian multi-cuisine</small></span><span><b>204 DISHES</b><small>17 craving chapters</small></span><span><b>MALL ROAD</b><small>Kanpur · 11 AM–11 PM</small></span></div>
            <div className="ice-cream-destination__actions"><Link className="ice-cream-destination__cta" href="/menu#ice-creams">Explore ice creams <ArrowRight size={17} /></Link><button className="ice-cream-destination__secondary-action" type="button" onClick={() => scrollToId("#location")}>Directions to Mall Road <ArrowRight size={16} /></button></div>
          </motion.div>
        </section>
        <OrganicWaveDivider tone="night-to-cream" />

        <GoogleReviews />

        <LocationAtlas />
        <section id="faq" className="faq-section section-pad print-paper print-halftone print-edge-boil layered-image-depth layered-image-depth--faq" aria-labelledby="faq-title"><div><p className="eyebrow eyebrow--maroon">04 / Before you visit</p><h2 id="faq-title" className="film-print-text film-print-text--slow">Good to<br /><i>know.</i></h2><p>Questions about a visit? Call <a href="tel:07860880088">+91 78608 80088</a>. We aim to respond within the current service window.</p></div><div className="faq-list"><motion.details open initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}><summary>Where is Naatures Scuup?</summary><p>Find us at 126, The Mall Road, Mirpur, Kanpur, Uttar Pradesh 208004. <span className="faq-answer-signature">#FREEZETHEHAPPINESS</span></p></motion.details><motion.details initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}><summary>Is the menu vegetarian?</summary><p>Yes. The restaurant presents a vegetarian multi-cuisine menu. <span className="faq-answer-signature">#FREEZETHEHAPPINESS</span></p></motion.details><motion.details initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}><summary>What can I browse online?</summary><p>The digital menu lists 204 dishes across 17 groups, with search and price sorting. <span className="faq-answer-signature">#FREEZETHEHAPPINESS</span></p></motion.details><motion.details initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}><summary>Can I order or reserve from this website?</summary><p>For reservations or order enquiries, please call the restaurant directly. <span className="faq-answer-signature">#FREEZETHEHAPPINESS</span></p></motion.details><motion.details initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}><summary>How do I get directions?</summary><p>Use the directions link above or the sticky mobile directions control to open Google Maps. <span className="faq-answer-signature">#FREEZETHEHAPPINESS</span></p></motion.details></div></section>
      </main>
      <SiteFooter />
      <MobileVisitDock />
    </div>
  );
}
