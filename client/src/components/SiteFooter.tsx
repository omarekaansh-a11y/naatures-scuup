/**
 * Style reminder — Mall Road Monograph: a warm maroon close with a graphic text-mark, direct local links, and no duplicated image asset.
 * The footer extends the restaurant invitation through verified social and map links while retaining the display-only intent.
 */
import { AtSign, Instagram, MapPin } from "lucide-react";
import { Link } from "wouter";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-voice">
          <p className="footer-signoff">A little more appetite<br />is always a good idea.</p>
          <p className="footer-slogan">#FREEZETHEHAPPINESS</p>
        </div>
        <div className="footer-identity footer-identity--text">
          <div className="footer-logo-panel" aria-label="Naatures Scuup"><span aria-hidden="true">NS</span><strong>Naatures <i>Scuup</i></strong></div>
          <p>126, The Mall Road<br />Kanpur, Uttar Pradesh</p>
          <p className="footer-hours">Mon, Tue, Thu–Sun · 11 AM–11 PM<br />Wed · 10 AM–11 PM</p>
          <div className="footer-links"><Link href="/menu">View full menu</Link><Link href="/#reviews">Google Maps reviews</Link><Link href="/#faq">Visit FAQs</Link></div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-contact"><span>+91 78608 80088</span><a className="footer-social" href="https://www.instagram.com/naatures_scuup/" target="_blank" rel="noreferrer" aria-label="Follow Naatures Scuup on Instagram"><Instagram size={14} /> @naatures_scuup</a><a className="footer-social" href="https://www.facebook.com/naaturesscuup/" target="_blank" rel="noreferrer" aria-label="Follow Naatures Scuup on Facebook"><AtSign size={14} /> @naaturesscuup</a><a className="footer-social" href="https://www.google.com/maps/search/?api=1&query=Naatures+Scuup+The+Mall+126+Mall+Road+Kanpur" target="_blank" rel="noreferrer" aria-label="Open Naatures Scuup in Google Maps"><MapPin size={14} /> Google Maps</a></div>
        <p>Multi-cuisine vegetarian dining &amp; desserts in Kanpur.</p>
        <p>Naatures Scuup</p>
      </div>
    </footer>
  );
}
