/** Style reminder — Mall Road Monograph: a purposeful mobile-only visit dock, never an ordering control. */
import { MapPin } from "lucide-react";
import { Link } from "wouter";

const mapUrl = "https://www.google.com/maps/search/?api=1&query=Naatures+Scuup+The+Mall+126+Mall+Road+Kanpur";

export function MobileVisitDock() {
  return <nav className="mobile-visit-dock" aria-label="Visit Naatures Scuup"><Link href="/">Home</Link><a href={mapUrl} target="_blank" rel="noreferrer">Directions <MapPin size={14} /></a></nav>;
}
