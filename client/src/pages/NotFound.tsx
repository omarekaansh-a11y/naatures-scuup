/** Style reminder — Mall Road Monograph: the 404 is a calm, useful detour back to appetite and place. */
import { ArrowDownRight, MapPin } from "lucide-react";
import { Link } from "wouter";
import { RouteMeta } from "@/components/RouteMeta";

export default function NotFound() {
  return (
    <main className="not-found-page"><RouteMeta title="Page Not Found | Naatures Scuup" description="This Naatures Scuup page could not be found. Browse the full vegetarian menu or get directions to the Mall Road restaurant." /><p className="eyebrow">404 / A small wrong turn</p><h1>This craving<br /><i>isn’t listed.</i></h1><p>Head back to the table, browse every dish, or find Naatures Scuup on Mall Road.</p><div><Link className="button button--cream" href="/menu">Browse the full menu <ArrowDownRight size={17} /></Link><Link className="text-action text-action--cream" href="/#location">Find Mall Road <MapPin size={16} /></Link></div></main>
  );
}
