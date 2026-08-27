/**
 * Style reminder — Mall Road Monograph: a warm maroon close with a graphic text-mark, direct local links, and no duplicated image asset.
 * The footer extends the restaurant invitation through verified social and map links.
 */
import { AtSign, Instagram, MapPin } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { footerCopy } from "@/lib/language-copy";

export function SiteFooter() {
  const { language } = useLanguage();
  const copy = footerCopy[language];
  const [signoffTop, signoffBottom] = copy.signoff.split("|");
  const [addressTop, addressBottom] = copy.addressTop.split("|");
  const [visitTop, visitBottom] = copy.addressVisit.split("|");
  const [hoursTop, hoursBottom] = copy.hours.split("|");
  return (
    <footer className="site-footer film-footer print-surface print-surface--dark print-halftone layered-image-depth layered-image-depth--footer">
      <div className="footer-top">
        <div className="footer-voice">
          <p className="footer-signoff film-print-text film-print-text--slow">{signoffTop}<br />{signoffBottom}</p>
          <p className="footer-slogan">#FREEZETHEHAPPINESS</p>
        </div>
        <div className="footer-identity footer-identity--text">
          <div className="footer-logo-panel print-edge-boil print-edge-boil--light print-edge-boil--rough" aria-label="Naatures Scuup"><span aria-hidden="true">NS</span><strong>Naatures <i>Scuup</i></strong></div>
          <p>{addressTop}<br />{addressBottom}</p>
          <p className="footer-hours">{hoursTop}{hoursBottom && <><br />{hoursBottom}</>}</p>
          <div className="footer-links"><Link href="/menu">{copy.menu}</Link><Link href="/#reviews">{copy.reviews}</Link><Link href="/#faq">{copy.faqs}</Link></div>
        </div>
      </div>
      <div className="footer-visit-card print-edge-boil print-edge-boil--light print-edge-boil--rough">
        <div><small>{copy.find}</small><strong>{visitTop}<br />{visitBottom}</strong></div>
        <div><small>{copy.open}</small><strong>{hoursTop}{hoursBottom && <><br />{hoursBottom}</>}</strong></div>
        <div><small>{copy.callFollow}</small><strong><a href="tel:+917860880088">+91 78608 80088</a><br /><a href="https://www.instagram.com/naatures_scuup/" target="_blank" rel="noreferrer">Instagram</a> · <a href="https://www.facebook.com/naaturesscuup/" target="_blank" rel="noreferrer">Facebook</a> · <a href="https://www.google.com/maps/search/?api=1&query=Naatures+Scuup+The+Mall+126+Mall+Road+Kanpur" target="_blank" rel="noreferrer">{copy.directions}</a></strong></div>
      </div>
      <div className="footer-bottom">
        <div className="footer-contact"><span>+91 78608 80088</span><a className="footer-social" href="https://www.instagram.com/naatures_scuup/" target="_blank" rel="noreferrer" aria-label={copy.instagram}><Instagram size={14} /> @naatures_scuup</a><a className="footer-social" href="https://www.facebook.com/naaturesscuup/" target="_blank" rel="noreferrer" aria-label={copy.facebook}><AtSign size={14} /> @naaturesscuup</a><a className="footer-social" href="https://www.google.com/maps/search/?api=1&query=Naatures+Scuup+The+Mall+126+Mall+Road+Kanpur" target="_blank" rel="noreferrer" aria-label={copy.maps}><MapPin size={14} /> Google Maps</a></div>
        <p>{copy.descriptor}</p>
        <p>Naatures Scuup</p>
      </div>
    </footer>
  );
}
