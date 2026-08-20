/**
 * Style reminder — Mall Road Monograph: typography, address, and the restaurant slogan carry the footer.
 * The owner logo is intentionally not repeated here, so each page avoids duplicate image use.
 */
import { AtSign } from "lucide-react";
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
          <p className="footer-title">Naatures Scuup</p>
          <p>126, The Mall Road<br />Kanpur, Uttar Pradesh</p>
          <div className="footer-links"><Link href="/menu">View full menu</Link><Link href="/#reviews">Google Maps reviews</Link><Link href="/#faq">Visit FAQs</Link></div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-contact"><span>078608 80088</span><a className="footer-social" href="https://www.facebook.com/naaturesscuup/" target="_blank" rel="noreferrer"><AtSign size={14} /> @naaturesscuup</a></div>
        <p>Multi-cuisine vegetarian dining &amp; desserts in Kanpur.</p>
        <p>© {new Date().getFullYear()} Naatures Scuup</p>
      </div>
    </footer>
  );
}
