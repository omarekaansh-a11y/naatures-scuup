/**
 * Style reminder — Mall Road Monograph: the navigation is a quiet, logo-led display-only portal.
 * It exposes only Home and Full Menu, never ordering, reservations, or a copied navigation pattern.
 */
import { Menu as MenuIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

const ownerLogo = "/manus-storage/naatures-scuup-logo-repaired_2ae03ab9.png";

export function SiteHeader({ paper = false }: { paper?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 28);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  const closeMenu = () => setIsOpen(false);
  const navigation = [
    { index: "01", label: "Home", href: "/" },
    { index: "02", label: "Full Menu", href: "/menu" },
  ];

  return (
    <>
      <header className={`site-header site-header--hamburger ${(paper || isScrolled) ? "site-header--scrolled" : ""}`}>
        <Link className="brand-logo-link" href="/" aria-label="Naatures Scuup home" onClick={closeMenu}>
          <img className="brand-logo" src={ownerLogo} alt="Naatures Scuup — Freeze the happiness" />
        </Link>
        <button className="site-menu-toggle" type="button" aria-label={isOpen ? "Close site menu" : "Open site menu"} aria-expanded={isOpen} aria-controls="site-navigation" onClick={() => setIsOpen((open) => !open)}>
          <span>{isOpen ? "Close" : "Menu"}</span>
          {isOpen ? <X size={20} strokeWidth={1.8} /> : <MenuIcon size={21} strokeWidth={1.8} />}
        </button>
      </header>

      <div id="site-navigation" className={`site-drawer ${isOpen ? "site-drawer--open" : ""}`} aria-hidden={!isOpen}>
        <p className="drawer-label">Naatures Scuup / Kanpur</p>
        <nav aria-label="Site navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} tabIndex={isOpen ? 0 : -1} className={`drawer-link ${location === item.href ? "drawer-link--active" : ""}`} onClick={closeMenu}>
              <small>{item.index}</small><span>{item.label}</span><i>{item.href === "/" ? "Return" : "Browse"}</i>
            </Link>
          ))}
        </nav>
        <p className="drawer-slogan">#FREEZETHEHAPPINESS</p>
      </div>
    </>
  );
}
