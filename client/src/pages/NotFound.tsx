/** Style reminder — Mall Road Monograph: the 404 is a calm, useful detour back to appetite and place. */
import { ArrowDownRight, Compass, Home, MapPin } from "lucide-react";
import { Link } from "wouter";
import { RouteMeta } from "@/components/RouteMeta";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found-page">
      <RouteMeta title="Page Not Found | Naatures Scuup" description="This Naatures Scuup page could not be found. Browse the vegetarian menu or get directions to the Mall Road restaurant." noIndex />
      <span className="not-found-page__number" aria-hidden="true">404</span>
      <section className="not-found-page__content">
        <p className="eyebrow"><Compass size={13} /> 404 / Page not found</p>
        <h1>We can’t find<br /><i>this page.</i></h1>
        <div className="not-found-page__guide">
          <section><strong>What happened</strong><p>The page you tried to open is not available here.</p></section>
          <section><strong>Why it happened</strong><p>The link may be old, the address may have been typed incorrectly, or the page may have moved.</p></section>
          <section><strong>What you can do</strong><p>Go back to the home page, browse the menu, or use the directions link to find us.</p></section>
        </div>
        <div className="not-found-page__actions"><Link className="button button--cream" href="/"><Home size={17} /> Go to home</Link><Link className="button button--cream" href="/menu">Browse the full menu <ArrowDownRight size={17} /></Link><Link className="text-action text-action--cream" href="/#location">Find Mall Road <MapPin size={16} /></Link></div>
      </section>
      <aside className="not-found-page__route" aria-label="Naatures Scuup location reminder"><span>Naatures Scuup / Kanpur</span><strong>The Mall, 126<br />Mall Road</strong><small>#FREEZETHEHAPPINESS</small></aside>
    </main>
  );
}
