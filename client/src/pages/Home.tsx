/**
 * Style reminder — Mall Road Monograph: original contemporary Indian editorial hospitality with a dark, immersive frontispiece hero, left-aligned display type, a factual Mall Road table card, an angled maroon foreground contour, and a quiet lower-edge scroll guide.
 * The only foreground food photography lives in the tactile table, where six distinct owner-supplied images appear once each.
 * Background-only generative visuals create atmosphere behind HTML copy; no generated food image is presented as a foreground menu item.
 * #FREEZETHEHAPPINESS is a restrained signature within an original restaurant experience.
 * Home-route visual updates use a document refresh in development to keep icon DOM reconciliation stable.
 */
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import { DragFoodCanvas } from "@/components/DragFoodCanvas";
import { GoogleReviews } from "@/components/GoogleReviews";
import { IceCreamOrbit } from "@/components/IceCreamOrbit";
import { LocationAtlas } from "@/components/LocationAtlas";
import { MobileVisitDock } from "@/components/MobileVisitDock";
import { OrganicWaveDivider } from "@/components/OrganicWaveDivider";
import { RouteMeta } from "@/components/RouteMeta";
import { SiteFooter } from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { homeCopy } from "@/lib/language-copy";

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
  { src: authenticImages.pastaRed, tag: "PASTA", label: "Pasta", note: "The comfort bowl", alt: "Restaurant red pasta topped with herbs and cream sauce" },
  { src: authenticImages.starterPlate, tag: "SNACKS", label: "Starters", note: "Crisp at the centre", alt: "Crisp restaurant starter served with garnish" },
  { src: authenticImages.iceCreamCup, tag: "ICE CREAM", label: "Scoops", note: "Make room", alt: "Scoops of ice cream in Naatures Scuup cups" },
  { src: authenticImages.iceCreamCounter, tag: "DESSERTS", label: "Counter", note: "The last stop", alt: "Two bright scoops of ice cream served at the restaurant counter" },
] as const;

function scrollToId(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function FaqItem({ id, question, answer, delay, reduceMotion }: { id: string; question: string; answer: string; delay: number; reduceMotion: boolean | null }) {
  const [isOpen, setIsOpen] = useState(false);
  return <motion.article className="faq-item" data-open={isOpen} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}><button className="faq-question" type="button" aria-expanded={isOpen} aria-controls={`${id}-answer`} onClick={() => setIsOpen((value) => !value)}><span>{question}</span><span className="faq-question__indicator" aria-hidden="true">+</span></button><motion.div id={`${id}-answer`} className="faq-answer-wrap" initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.23, 1, 0.32, 1] }}><p>{answer} <span className="faq-answer-signature">#FREEZETHEHAPPINESS</span></p></motion.div></motion.article>;
}

export default function Home() {
  const reduceMotion = useReducedMotion();
  const { language } = useLanguage();
  const copy = homeCopy[language];
  const localizedFoodCanvasItems = language === "hi" ? foodCanvasItems.map((item) => ({
    ...item,
    tag: ({ Starters: "स्टार्टर्स", Pizza: "पिज़्ज़ा", Pasta: "पास्ता", Desserts: "डेज़र्ट्स", Drinks: "ड्रिंक्स", Counter: "काउंटर" } as Record<string, string>)[item.tag] ?? item.tag,
    label: ({ Pizza: "पिज़्ज़ा", Kababs: "कबाब", Pasta: "पास्ता", Starters: "स्टार्टर्स", Scoops: "स्कूप्स", Counter: "काउंटर" } as Record<string, string>)[item.label] ?? item.label,
    note: ({ "The share plate": "शेयर प्लेट", "The first pass": "पहली प्लेट", "The comfort bowl": "कम्फर्ट बाउल", "Crisp at the centre": "बीच का क्रिस्प", "Make room": "जगह बनाइए", "The last stop": "आखिरी पड़ाव" } as Record<string, string>)[item.note] ?? item.note,
  })) : foodCanvasItems;
  return (
    <div className="site-shell">
      <RouteMeta title="Naatures Scuup | Vegetarian Restaurant on Mall Road, Kanpur" description="Visit Naatures Scuup on Mall Road, Kanpur for vegetarian food, mango ice cream, desserts, shakes and vegan options. Explore our digital menu." />
      <main id="main-content" data-page-top="true">
        <IceCreamOrbit />

        <div className="home-after-orbit" data-layered-handoff>
        <OrganicWaveDivider tone="cream-to-maroon" />

        <DragFoodCanvas items={localizedFoodCanvasItems} language={language} />
        <section className="food-menu-bridge" aria-label={copy.menuBridge}><Link className="button button--cream" href="/menu">{copy.menuBridge} <ArrowRight size={17} /></Link></section>
        <OrganicWaveDivider tone="maroon-to-night" />

        <section id="ice-cream-destination" className="ice-cream-destination print-surface print-surface--dark print-halftone maximalist-surface maximalist-surface--night layered-image-depth layered-image-depth--scoop" aria-labelledby="ice-cream-destination-title">
          <div className="ice-cream-destination__image" role="img" aria-label="Editorial background showing a frozen dessert table" />
          <div className="ice-cream-destination__veil" />
          <div className="maximalist-surface__forms" aria-hidden="true" />
          <span className="maximalist-surface__figure" aria-hidden="true">02</span>
          <motion.div className="ice-cream-destination__inner section-pad" initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.48, ease: [0.23, 1, 0.32, 1] }}>
            <span className="maximalist-surface__label">{copy.lateTable}</span>
            <p className="eyebrow eyebrow--mango">{copy.tableEyebrow}</p>
            <h2 id="ice-cream-destination-title" className="editorial-title editorial-title--light print-ink film-print-text film-print-text--bright"><span className="title-outline">{copy.saveRoom}</span><br /><i>{copy.forScoop}</i></h2>
            <p className="ice-cream-destination__copy">{copy.scoopCopy}</p>
            <div className="ice-cream-destination__facts" aria-label={language === "hi" ? "नेचर्स स्कूप टेबल गाइड" : "Naatures Scuup table guide"}><span><b>100%</b><small>{copy.vegetarianDining}</small></span><span><b>231 DISHES</b><small>{copy.cravingChapters}</small></span><span><b>MALL ROAD</b><small>Mon-Sun, 11 AM to 11 PM</small></span></div>
            <div className="ice-cream-destination__actions"><Link className="ice-cream-destination__cta" href="/menu#ice-creams">{copy.exploreIceCreams} <ArrowRight size={17} /></Link><button className="ice-cream-destination__secondary-action" type="button" onClick={() => scrollToId("#location")}>{copy.directions} <ArrowRight size={16} /></button></div>
          </motion.div>
        </section>
        <OrganicWaveDivider tone="night-to-cream" />

        <GoogleReviews />

        <LocationAtlas />
        <section id="faq" className="faq-section section-pad print-paper print-halftone print-edge-boil layered-image-depth layered-image-depth--faq" aria-labelledby="faq-title"><span className="surface-crt-texture" aria-hidden="true" /><span className="surface-ripple-texture" aria-hidden="true" /><div><p className="eyebrow eyebrow--maroon">{copy.beforeVisit}</p><h2 id="faq-title" className="film-print-text film-print-text--slow">{copy.goodToKnow}<br /><i>{copy.know}</i></h2><p>{copy.faqIntro}<a href="tel:07860880088">+91 78608 80088</a>{copy.faqEnding}</p></div><div className="faq-list"><FaqItem id="faq-location" question={copy.where} answer={copy.whereAnswer} delay={0} reduceMotion={reduceMotion} /><FaqItem id="faq-vegetarian" question={copy.vegetarian} answer={copy.vegetarianAnswer} delay={0.05} reduceMotion={reduceMotion} /><FaqItem id="faq-contact" question={copy.order} answer={copy.orderAnswer} delay={0.1} reduceMotion={reduceMotion} /><FaqItem id="faq-directions" question={copy.directionsQuestion} answer={copy.directionsAnswer} delay={0.15} reduceMotion={reduceMotion} /></div></section>
        </div>
      </main>
      <SiteFooter />
      <MobileVisitDock />
    </div>
  );
}
