import { ArrowUpRight, Facebook, Instagram, Phone } from "lucide-react";
import { useCallback, useState } from "react";
import { MapView } from "@/components/Map";

const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Naatures+Scuup+The+Mall+126+Mall+Road+Kanpur";
const naaturesScuup = { lat: 26.4623472, lng: 80.3597621 };
const gestureMapStyles = `
  .visit-map__directions{position:absolute;z-index:4;right:14px;bottom:14px;display:inline-flex;align-items:center;gap:7px;min-height:42px;padding:0 13px;border:1px solid rgba(244,240,232,.45);border-radius:9px;background:rgba(67,5,23,.88);color:var(--cream);font:800 8px/1 Manrope,sans-serif;letter-spacing:.09em;text-transform:uppercase;backdrop-filter:blur(9px);transition:transform .16s var(--ease-out),background .16s var(--ease-out)}
  .visit-map__directions:hover{background:var(--mango);color:var(--maroon-deep);transform:translateY(-2px)}.visit-map__directions:active{transform:scale(.96)}.visit-map__directions:focus-visible{outline:2px solid var(--cream);outline-offset:3px}
  .visit-map__mall-landmark{position:absolute;z-index:3;top:16%;right:13%;display:grid;gap:3px;padding:7px 9px;border:1px solid rgba(244,240,232,.34);background:rgba(70,6,25,.76);color:var(--cream);font:800 8px/1 Manrope,sans-serif;letter-spacing:.11em;text-transform:uppercase;transform:rotate(-5deg);pointer-events:none}.visit-map__mall-landmark:before{content:"◼";color:var(--mango);font-size:7px}.visit-map__mall-landmark i{color:rgba(244,240,232,.62);font-size:6px;font-style:normal;letter-spacing:.1em}
  .visit-map__canvas{filter:sepia(.34) hue-rotate(286deg) saturate(.78) contrast(1.16)}.visit-map__tint{background:rgba(91,7,34,.22)!important;mix-blend-mode:multiply}.visit-map__gesture-hint{position:absolute;z-index:3;bottom:16px;left:16px;color:rgba(78,8,28,.7);font:800 7px/1 Manrope,sans-serif;letter-spacing:.12em;text-transform:uppercase;pointer-events:none}.visit-map__gesture-hint:after{content:"Scroll to explore"}@media(pointer:coarse){.visit-map__gesture-hint:after{content:"Use two fingers to explore"}}.visit-map__status{position:absolute;z-index:3;inset:0;display:grid;place-items:center;padding:32px;color:var(--cream);background:rgba(67,5,23,.92);font:700 12px/1.6 Manrope,sans-serif;text-align:center}.visit-map__status strong{display:block;margin-bottom:7px;color:var(--mango);font:800 8px/1 Manrope,sans-serif;letter-spacing:.14em;text-transform:uppercase}@media(max-width:760px){.visit-map__directions{right:10px;bottom:10px;padding-inline:10px;font-size:7px}.visit-map__gesture-hint{bottom:14px;left:14px;font-size:6px}}
  @media(prefers-reduced-motion:reduce){.visit-map__directions{transition:none}}
`;

export function LocationAtlas() {
  const [hasMapError, setHasMapError] = useState(false);
  const onMapReady = useCallback((map: google.maps.Map) => {
    setHasMapError(false);
    map.setOptions({
      gestureHandling: window.matchMedia("(pointer: fine)").matches ? "greedy" : "cooperative",
      scrollwheel: window.matchMedia("(pointer: fine)").matches,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#d98f96" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#5a1028" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#f8e7de" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#6e1735" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#f5d0ca" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#b24e68" }] },
        { featureType: "poi", elementType: "geometry", stylers: [{ color: "#c96f79" }] },
      ],
    });
    new window.google.maps.Marker({ map, position: naaturesScuup, title: "Naatures Scuup, 126 The Mall Road, Kanpur", label: { text: "NS", color: "#521122", fontWeight: "700" } });
    new window.google.maps.Geocoder().geocode({ address: "The Mall, Mall Road, Kanpur, Uttar Pradesh" }, (results, status) => {
      const mall = status === "OK" ? results?.[0]?.geometry.location : null;
      if (mall) new window.google.maps.Marker({ map, position: mall, title: "The Mall, Mall Road, Kanpur", label: { text: "THE MALL", color: "#521122", fontSize: "9px", fontWeight: "700" } });
    });
  }, []);

  return (
    <><style>{gestureMapStyles}</style><section id="location" className="location-atlas" aria-labelledby="location-title">
      <div className="location-atlas__inner section-pad">
        <header className="location-atlas__head">
          <p className="eyebrow eyebrow--mango">03 / Come on over</p>
          <h2 id="location-title" className="editorial-title editorial-title--light">
            <span className="title-outline">Find us on</span><br /><i>Mall Road.</i>
          </h2>
        </header>

        <div className="visit-map" aria-label="Interactive map centered on Naatures Scuup">
          <MapView className="visit-map__canvas" initialCenter={naaturesScuup} initialZoom={14} onMapReady={onMapReady} onMapError={() => setHasMapError(true)} />
          <span className="visit-map__tint" aria-hidden="true" />
          <span className="visit-map__gesture-hint" aria-hidden="true" />
          {hasMapError && <span className="visit-map__status"><span><strong>Live map unavailable</strong>Open directions to view Naatures Scuup on Google Maps.</span></span>}
          <a className="visit-map__directions" href={mapsUrl} target="_blank" rel="noreferrer">Directions <ArrowUpRight size={14} /></a>
        </div>

        <div className="visit-card">
          <div className="visit-card__column">
            <p>Address</p>
            <strong>The Mall, 126, The Mall Road<br />Mirpur, Kanpur, Uttar Pradesh 208004</strong>
          </div>
          <div className="visit-card__column">
            <p>Hours</p>
            <strong>Open daily<br />12:00 PM–10:30 PM</strong>
          </div>
          <div className="visit-card__column">
            <p>Phone</p>
            <a href="tel:+917860880088"><Phone size={14} /> +91 78608 80088</a>
          </div>
          <div className="visit-card__column visit-card__column--follow">
            <p>Follow</p>
            <span><a href="https://www.instagram.com/naatures_scuup/" target="_blank" rel="noreferrer" aria-label="Naatures Scuup on Instagram"><Instagram size={18} /></a><a href="https://www.facebook.com/naaturesscuup/" target="_blank" rel="noreferrer" aria-label="Naatures Scuup on Facebook"><Facebook size={18} /></a></span>
          </div>
        </div>
      </div>
    </section></>
  );
}
