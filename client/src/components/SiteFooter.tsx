/**
 * Style reminder — Mall Road Monograph: a warm maroon close with a graphic text-mark, direct local links, and no duplicated image asset.
 * The footer extends the restaurant invitation through verified social and map links.
 */
import { Facebook, Instagram, MapPin } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { footerCopy } from "@/lib/language-copy";

export function SiteFooter() {
  const { language } = useLanguage();
  const copy = footerCopy[language];
  const brandName = language === "hi" ? "नेचर्स स्कूप" : "Naatures Scuup";
  const [signoffTop, signoffBottom] = copy.signoff.split("|");
  const [addressTop, addressBottom] = copy.addressTop.split("|");
  const [visitTop, visitBottom] = copy.addressVisit.split("|");
  const [hoursTop, hoursBottom] = copy.hours.split("|");
  return (
    <footer className="site-footer film-footer print-surface print-surface--dark print-halftone layered-image-depth layered-image-depth--footer">
      <span className="surface-crt-texture" aria-hidden="true" />
      <span className="surface-ripple-texture" aria-hidden="true" />
      <div className="footer-top">
        <div className="footer-voice">
          <p className="footer-signoff film-print-text film-print-text--slow">{signoffTop}<br />{signoffBottom}</p>
          <p className="footer-slogan">#FREEZETHEHAPPINESS</p>
        </div>
        <div className="footer-identity footer-identity--text">
          <div className="footer-logo-panel print-edge-boil print-edge-boil--light print-edge-boil--rough" aria-label={brandName}><span aria-hidden="true">NS</span><strong>{language === "hi" ? brandName : <>Naatures <i>Scuup</i></>}</strong></div>
          <p>{addressTop}<br />{addressBottom}</p>
          <p className="footer-hours">{hoursTop}{hoursBottom && <><br />{hoursBottom}</>}</p>
          <div className="footer-links"><Link href="/menu">{copy.menu}</Link><Link href="/#reviews">{copy.reviews}</Link><Link href="/#faq">{copy.faqs}</Link></div>
        </div>
      </div>
      <div className="footer-visit-card print-edge-boil print-edge-boil--light print-edge-boil--rough">
        <div><small>{copy.find}</small><strong>{visitTop}<br />{visitBottom}</strong></div>
        <div><small>{copy.open}</small><strong>{hoursTop}{hoursBottom && <><br />{hoursBottom}</>}</strong></div>
        <div><small>{copy.callFollow}</small><strong><a href="tel:+917860880088">+91 78608 80088</a></strong><span className="footer-social-actions"><a href="https://www.instagram.com/naatures_scuup/" target="_blank" rel="noreferrer" aria-label={copy.instagram}><Instagram size={17} /></a><a href="https://www.facebook.com/naaturesscuup/" target="_blank" rel="noreferrer" aria-label={copy.facebook}><Facebook size={17} /></a><a href="https://www.google.com/maps/search/?api=1&query=Naatures+Scuup+The+Mall+126+Mall+Road+Kanpur" target="_blank" rel="noreferrer" aria-label={copy.maps}><MapPin size={17} /></a></span></div>
      </div>
      <div className="footer-bottom">
        <p>{copy.descriptor}</p>
        <p>{brandName}</p>
      </div>
    </footer>
  );
}
