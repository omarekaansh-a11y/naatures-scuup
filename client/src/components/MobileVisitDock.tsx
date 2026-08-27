/** Style reminder — Mall Road Monograph: compact two-route mobile navigation with a quiet mango current-page cue. */
import { ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export function MobileVisitDock() {
  const [location] = useLocation();
  const { language } = useLanguage();
  const isHome = location === "/";
  const isMenu = location.startsWith("/menu");
  const copy = language === "hi" ? { navigation: "नेचर्स स्कूप नेविगेशन", home: "होम", fullMenu: "पूरा मेनू" } : { navigation: "Naatures Scuup navigation", home: "Home", fullMenu: "Full Menu" };

  return <nav className="mobile-visit-dock" aria-label={copy.navigation}>
    <Link className={`mobile-visit-dock__home${isHome ? " mobile-visit-dock__home--active mobile-visit-dock__link--active" : ""}`} href="/" aria-current={isHome ? "page" : undefined}>{copy.home}</Link>
    <Link className={`mobile-visit-dock__menu${isMenu ? " mobile-visit-dock__link--active" : ""}`} href="/menu" aria-current={isMenu ? "page" : undefined}>{copy.fullMenu} <ArrowUpRight size={14} /></Link>
  </nav>;
}
