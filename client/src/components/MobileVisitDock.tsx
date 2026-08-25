/** Style reminder — Mall Road Monograph: compact two-route mobile navigation with a quiet mango current-page cue. */
import { ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "wouter";

export function MobileVisitDock() {
  const [location] = useLocation();
  const isHome = location === "/";
  const isMenu = location.startsWith("/menu");

  return <nav className="mobile-visit-dock" aria-label="Naatures Scuup navigation">
    <Link className={`mobile-visit-dock__home${isHome ? " mobile-visit-dock__home--active mobile-visit-dock__link--active" : ""}`} href="/" aria-current={isHome ? "page" : undefined}>Home</Link>
    <Link className={`mobile-visit-dock__menu${isMenu ? " mobile-visit-dock__link--active" : ""}`} href="/menu" aria-current={isMenu ? "page" : undefined}>Full Menu <ArrowUpRight size={14} /></Link>
  </nav>;
}
