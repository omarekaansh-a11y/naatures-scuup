/** Style reminder — Mall Road Monograph: the 404 is a calm, useful detour back to appetite and place. */
import { ArrowDownRight, Compass, MapPin } from "lucide-react";
import { Link } from "wouter";
import { RouteMeta } from "@/components/RouteMeta";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <RouteMeta title="Page Not Found | Naatures Scuup" description="This Naatures Scuup page could not be found. Browse the vegetarian menu or get directions to the Mall Road restaurant." noIndex />
      <span className="not-found-page__number" aria-hidden="true">404</span>
      <section className="not-found-page__content">
        <p className="eyebrow"><Compass size={13} /> 404 / A small wrong turn</p>
        <h1>This craving<br /><i>isn’t listed.</i></h1>
        <p>Head back to the table, browse every dish, or find Naatures Scuup on Mall Road.</p>
        <div className="not-found-page__actions"><Link className="button button--cream" href="/menu">Browse the full menu <ArrowDownRight size={17} /></Link><Link className="text-action text-action--cream" href="/#location">Find Mall Road <MapPin size={16} /></Link></div>
      </section>
      <aside className="not-found-page__route" aria-label="Naatures Scuup location reminder"><span>Naatures Scuup / Kanpur</span><strong>The Mall, 126<br />Mall Road</strong><small>#FREEZETHEHAPPINESS</small></aside>
    </main>
  );
}
