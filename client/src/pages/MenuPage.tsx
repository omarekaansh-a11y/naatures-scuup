/**
 * Style reminder — Mall Road Monograph: the Full Menu is a calm, typographic reading room.
 * It presents verified category descriptions and dish names without photography, prices, ordering, or reservation facilities.
 */
import { ArrowDownRight, MapPin } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { menuChapters, menuItemCount } from "@/lib/menu-data";

export default function MenuPage() {
  return (
    <div className="site-shell menu-page-shell">
      <SiteHeader paper />
      <main className="menu-page" id="top">
        <section className="menu-page-hero section-pad" aria-labelledby="full-menu-title">
          <p className="eyebrow eyebrow--maroon">Naatures Scuup / Display menu</p>
          <div className="menu-page-hero__grid">
            <h1 id="full-menu-title">The full<br /><i>craving list.</i></h1>
            <div>
              <p>Every category on one page, from the first share to the last scoop. This is a display-only menu—visit us on Mall Road to enjoy the full experience.</p>
              <span>{menuItemCount} listed dishes · Vegetarian multi-cuisine</span>
            </div>
          </div>
          <nav className="menu-page-index" aria-label="Menu category index">
            {menuChapters.map((chapter) => <a key={chapter.slug} href={`#${chapter.slug}`}><small>{chapter.index}</small>{chapter.title}</a>)}
          </nav>
        </section>

        <section className="menu-page-list section-pad" aria-label="Full Naatures Scuup menu">
          {menuChapters.map((chapter) => (
            <article id={chapter.slug} className="menu-page-category" key={chapter.slug}>
              <header>
                <p className="eyebrow eyebrow--maroon">{chapter.index} / {chapter.note}</p>
                <h2>{chapter.title}</h2>
                <p>{chapter.detail}</p>
              </header>
              <ol>
                {chapter.dishes.map((dish, index) => <li key={dish}><span>{String(index + 1).padStart(2, "0")}</span><strong>{dish}</strong></li>)}
              </ol>
            </article>
          ))}
        </section>

        <section className="menu-page-closing section-pad">
          <div>
            <p className="eyebrow eyebrow--light">Freeze the happiness</p>
            <h2>Find your<br /><i>table mood.</i></h2>
          </div>
          <div className="menu-page-closing__actions">
            <a className="button button--cream" href="https://www.google.com/maps/search/?api=1&query=Naatures+Scuup+The+Mall+126+Mall+Road+Kanpur" target="_blank" rel="noreferrer">Get directions <MapPin size={16} /></a>
            <Link className="text-action text-action--cream" href="/">Back to home <ArrowDownRight size={16} /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
