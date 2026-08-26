/**
 * Style reminder — Mall Road Monograph: the navigation is a quiet, logo-led portal with a compact name-and-slogan signature.
 * It exposes only Home and Full Menu, never ordering, reservations, or a copied navigation pattern.
 */
import { ArrowUp, Menu as MenuIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

const ownerLogo = "/manus-storage/naatures-scuup-logo-transparent_7cd2ca72.png";

export function SiteHeader({ paper = false }: { paper?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedMenu, setHasOpenedMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 28);
    const frame = window.requestAnimationFrame(updateHeader);
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateHeader);
    };
  }, []);

  const closeMenu = () => setIsOpen(false);
  const openMenu = () => {
    setHasOpenedMenu(true);
    setIsOpen(true);
  };
  const navigateFromOverlay = (href: string) => {
    if (href !== location) setLocation(href);
    window.requestAnimationFrame(closeMenu);
  };
  const returnToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const navigation = [
    { index: "01", label: "Home", href: "/" },
    { index: "02", label: "Full Menu", href: "/menu" },
  ];

	  return (
	    <>
		  <header className={`site-header site-header--hamburger ${(paper || isScrolled) ? "site-header--scrolled" : ""} ${isOpen ? "site-header--menu-open" : ""}`}>
	        <Link className="brand-logo-link" href="/" aria-label="Naatures Scuup home" onClick={closeMenu}>
	          <span className="brand-logo-crop" aria-hidden="true">
	            <svg className="brand-logo" viewBox="0 0 1920 1920" preserveAspectRatio="xMidYMid meet">
	              <defs>
	              <filter id="owner-logo-foreground-alpha" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1920">
	                <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -1.6 -1.6 -1.6 0 4.6" result="whiteKnockout" />
	                <feColorMatrix in="whiteKnockout" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 1 -0.5 -0.5 0 -0.1" result="redKey" />
	                <feColorMatrix in="whiteKnockout" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -0.5 1 -0.5 0 -0.1" result="greenKey" />
	                <feColorMatrix in="whiteKnockout" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0.5 0.5 -1 0 -0.1" result="yellowKey" />
	                <feBlend in="redKey" in2="greenKey" mode="screen" result="redGreenKey" />
	                <feBlend in="redGreenKey" in2="yellowKey" mode="screen" result="chromaKey" />
	                <feComponentTransfer in="chromaKey" result="hardForeground"><feFuncA type="discrete" tableValues="0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1" /></feComponentTransfer>
	                <feComposite in="hardForeground" in2="whiteKnockout" operator="in" />
	              </filter>
	              <mask id="owner-logo-foreground-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1920" {...({ "mask-type": "alpha" } as Record<string, string>)}>
	                <image href={ownerLogo} width="1920" height="1920" preserveAspectRatio="xMidYMid meet" filter="url(#owner-logo-foreground-alpha)" />
	              </mask>
	            </defs>
	              <image href={ownerLogo} width="1920" height="1920" preserveAspectRatio="xMidYMid meet" mask="url(#owner-logo-foreground-mask)" />
	            </svg>
	          </span>
	          <span className="brand-text"><strong>Naatures Scuup</strong><small>#FREEZETHEHAPPINESS</small></span>
	        </Link>
        <div className="site-header-actions">
          <button className={`site-top-control ${isScrolled ? "site-top-control--active" : ""}`} type="button" onClick={returnToTop} disabled={!isScrolled} aria-label="Return to the top of this page"><span>Top</span><ArrowUp size={15} strokeWidth={1.9} /></button>
          <button className="site-menu-toggle" type="button" aria-label={isOpen ? "Close site menu" : "Open site menu"} aria-expanded={isOpen} aria-controls="site-navigation" onClick={() => (isOpen ? closeMenu() : openMenu())}>
            <span>{isOpen ? "Close" : "Menu"}</span>
            {isOpen ? <X size={20} strokeWidth={1.8} /> : <MenuIcon size={21} strokeWidth={1.8} />}
          </button>
        </div>
      </header>

      <div id="site-navigation" className={`site-drawer ${hasOpenedMenu ? "site-drawer--transitioned" : ""} ${isOpen ? "site-drawer--open" : ""}`} aria-hidden={!isOpen}>
        <div className="site-drawer__content">
          <p className="drawer-label">Naatures Scuup / Kanpur</p>
          <nav aria-label="Site navigation">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} tabIndex={isOpen ? 0 : -1} className={`drawer-link ${location === item.href ? "drawer-link--active" : ""}`} onClick={(event) => { event.preventDefault(); navigateFromOverlay(item.href); }}>
                <small>{item.index}</small><span>{item.label}</span><i>{item.href === "/" ? "Return" : "Browse"}</i>
              </Link>
            ))}
          </nav>
          <p className="drawer-slogan">#FREEZETHEHAPPINESS</p>
        </div>
      </div>
    </>
  );
}
