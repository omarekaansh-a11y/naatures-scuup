/**
 * Style reminder — Mall Road Monograph: original contemporary Indian editorial hospitality.
 * The only foreground food photography lives in the tactile table, where all seven owner-supplied images appear once each.
 * #FREEZETHEHAPPINESS is a restrained signature; the experience is display-only and never a copy of another restaurant’s layout.
 */
import { ArrowDownRight, ArrowRight, ChevronRight, MapPin, Sparkles, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { DragFoodCanvas } from "@/components/DragFoodCanvas";
import { GoogleReviews } from "@/components/GoogleReviews";
import { MobileVisitDock } from "@/components/MobileVisitDock";
import { RouteMeta } from "@/components/RouteMeta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

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
  { src: authenticImages.pizza, label: "Pizza", note: "The share plate", alt: "Restaurant pizza with a chilled drink" },
  { src: authenticImages.kababs, label: "Kababs", note: "The first pass", alt: "Restaurant-made kababs with onion rings and garnish" },
  { src: authenticImages.pastaRed, label: "Pasta", note: "The comfort bowl", alt: "Restaurant pasta topped with herbs and cream sauce" },
  { src: authenticImages.starterPlate, label: "Starters", note: "Crisp at the centre", alt: "Crisp restaurant starter served with garnish" },
  { src: authenticImages.pastaGreen, label: "Pasta", note: "A bright plate", alt: "Creamy green pasta with olives and garlic bread" },
  { src: authenticImages.iceCreamCup, label: "Scoops", note: "Make room", alt: "Scoops of ice cream in Naatures Scuup cups" },
  { src: authenticImages.iceCreamCounter, label: "Counter", note: "The last stop", alt: "Two bright scoops of ice cream served at the restaurant counter" },
] as const;

function scrollToId(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="site-shell">
      <RouteMeta title="Naatures Scuup | Vegetarian Restaurant on Mall Road, Kanpur" description="Explore the display-only digital menu for Naatures Scuup, a vegetarian multi-cuisine restaurant at 126, The Mall Road, Kanpur." />
      <SiteHeader />
      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-image" role="img" aria-label="Original multi-cuisine vegetarian food background" />
          <div className="hero-tint" />
          <div className="hero-content">
            <div className="hero-meta reveal-up"><span className="verified-dot" /><span>Vegetarian multi-cuisine restaurant</span><span className="meta-divider" /><span>Mall Road, Kanpur</span><span className="hero-slogan">#FREEZETHEHAPPINESS</span></div>
            <p className="eyebrow reveal-up delay-1">The all-day craving table</p>
            <h1 id="hero-title" className="editorial-title editorial-title--light reveal-up delay-2"><span className="title-outline">One place.</span><br /><i>Every craving.</i></h1>
            <p className="hero-copy reveal-up delay-3">South Indian favourites, pizza, Chinese, comfort snacks, shakes, desserts and ice cream—right in the heart of Kanpur.</p>
            <div className="hero-actions reveal-up delay-4">
              <Link className="button button--cream" href="/menu">View the full menu <ArrowDownRight size={17} /></Link>
              <button className="text-action" type="button" onClick={() => scrollToId("#location")}>Directions to Mall Road <ArrowRight size={17} /></button>
            </div>
          </div>
          <div className="hero-trust reveal-up delay-4" aria-label="Restaurant information"><span><Star size={14} fill="currentColor" /> 4.0</span><span>819 Google reviews</span><span>₹200–₹400 per person</span></div>
          <button className="scroll-cue" type="button" onClick={() => scrollToId("#story")} aria-label="Scroll to the restaurant story"><span>Scroll for flavour</span><ArrowDownRight size={17} /></button>
        </section>

        <div className="craving-ribbon" aria-hidden="true"><div><span>Dosa</span><b>•</b><span>Paneer</span><b>•</b><span>Pizza</span><b>•</b><span>Chinese</span><b>•</b><span>Shakes</span><b>•</b><span>Ice cream</span><b>•</b><span>Dosa</span><b>•</b><span>Paneer</span><b>•</b><span>Pizza</span><b>•</b><span>Chinese</span><b>•</b><span>Shakes</span><b>•</b><span>Ice cream</span><b>•</b></div></div>

        <section id="story" className="story-section section-pad">
          <div className="story-grid story-grid--text">
            <motion.div className="story-intro" initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.22 }} transition={{ duration: 0.48, ease: [0.23, 1, 0.32, 1] }}>
              <p className="eyebrow eyebrow--maroon">01 / The Scuup story</p>
              <h2 className="editorial-title"><span className="title-outline">Come for the craving.</span><br /><i>Stay for the scoop.</i></h2>
              <p className="body-large">The table can move from a crisp dosa to a hot pizza, from a cool shake to something sweet. Naatures Scuup brings together familiar favourites for every kind of gathering.</p>
              <button className="inline-link" type="button" onClick={() => scrollToId("#location")}>Discover Mall Road <ChevronRight size={17} /></button>
            </motion.div>
            <motion.aside className="story-manifesto" initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.22 }} transition={{ duration: 0.48, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}><span>Kanpur / Mall Road</span><p>“One table,<br />many <i>moods.</i>”</p><small>#FREEZETHEHAPPINESS</small></motion.aside>
            <div className="story-stamp" aria-label="One place every craving"><span>One place</span><Sparkles size={18} /><span>Every craving</span></div>
          </div>
        </section>

        <section id="experience" className="experience-section experience-section--text">
          <div className="experience-header section-pad"><p className="eyebrow eyebrow--light">From first plate to last scoop</p><motion.div initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.22 }} transition={{ duration: 0.48, ease: [0.23, 1, 0.32, 1] }}><h2 className="editorial-title editorial-title--light"><span className="title-outline">However the table</span><br />feels <i>today.</i></h2><p>Follow the appetite wherever it goes.</p></motion.div></div>
          <div className="experience-typographic section-pad"><p className="experience-large-word">Savour</p><motion.div initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.22 }} transition={{ duration: 0.48, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}><p className="eyebrow eyebrow--cream">The long-table mood</p><h3 className="editorial-title editorial-title--light"><span className="title-outline">Made to linger.</span><br /><i>Made memorable.</i></h3><p>Familiar favourites, comforting plates and a sweet reason to leave room for a second scoop.</p><Link className="text-action text-action--cream" href="/menu#ice-creams">Explore the full menu <ArrowRight size={17} /></Link></motion.div><span>Kanpur<br />at the table</span></div>
        </section>

        <DragFoodCanvas items={foodCanvasItems} />

        <GoogleReviews />

        <section id="location" className="location-section section-pad" aria-labelledby="location-title">
          <a className="location-map-live location-map-art" href="https://www.google.com/maps/search/?api=1&query=Naatures+Scuup+The+Mall+126+Mall+Road+Kanpur" target="_blank" rel="noreferrer" aria-label="Open Naatures Scuup in Google Maps for directions"><span className="map-road map-road--one" /><span className="map-road map-road--two" /><span className="map-road map-road--three" /><span className="map-marker"><MapPin size={22} fill="currentColor" /> <b>Naatures Scuup</b></span><span className="map-label map-label--one">Mall Road</span><span className="map-label map-label--two">Kanpur</span><span className="map-label map-label--three">The Mall</span></a>
          <motion.div className="location-content" initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.48, ease: [0.23, 1, 0.32, 1] }}><p className="eyebrow eyebrow--maroon">03 / Make your way over</p><h2 id="location-title">Meet us on<br /><i>Mall Road.</i></h2><p className="location-address">The Mall, 126, The Mall Rd,<br />Mirpur, Kanpur, Uttar Pradesh 208004</p><div className="location-actions"><a className="button button--maroon" href="https://www.google.com/maps/search/?api=1&query=Naatures+Scuup+The+Mall+126+Mall+Road+Kanpur" target="_blank" rel="noreferrer">Get directions <MapPin size={16} /></a><p className="location-phone">078608 80088</p></div><div className="location-facts"><span><Star size={14} fill="currentColor" /> 4.0 on Google</span><span>Vegetarian</span><span>₹200–₹400</span></div></motion.div>
        </section>
        <section id="faq" className="faq-section section-pad" aria-labelledby="faq-title"><div><p className="eyebrow eyebrow--maroon">05 / Before you visit</p><h2 id="faq-title">Good to<br /><i>know.</i></h2><p>Questions about a visit? Call <a href="tel:07860880088">078608 80088</a>. We aim to respond within the current service window.</p></div><div className="faq-list"><motion.details open initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}><summary>Where is Naatures Scuup?</summary><p>Find us at 126, The Mall Road, Mirpur, Kanpur, Uttar Pradesh 208004. <span className="faq-answer-signature">#FREEZETHEHAPPINESS</span></p></motion.details><motion.details initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}><summary>Is the menu vegetarian?</summary><p>Yes. The restaurant presents a vegetarian multi-cuisine menu. <span className="faq-answer-signature">#FREEZETHEHAPPINESS</span></p></motion.details><motion.details initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}><summary>What can I browse online?</summary><p>The digital menu lists 204 dishes across 17 groups, with search and display-only sorting. <span className="faq-answer-signature">#FREEZETHEHAPPINESS</span></p></motion.details><motion.details initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}><summary>Can I order or reserve from this website?</summary><p>No. This website is a display guide only; it does not offer ordering or reservations. <span className="faq-answer-signature">#FREEZETHEHAPPINESS</span></p></motion.details><motion.details initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}><summary>How do I get directions?</summary><p>Use the directions link above or the sticky mobile directions control to open Google Maps. <span className="faq-answer-signature">#FREEZETHEHAPPINESS</span></p></motion.details></div></section>
      </main>
      <SiteFooter />
      <MobileVisitDock />
    </div>
  );
}
