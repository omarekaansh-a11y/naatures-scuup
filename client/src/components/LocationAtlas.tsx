import { ArrowUpRight, Facebook, Instagram, MapPin, Phone } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { MapView } from "@/components/Map";

const naaturesScuup = { lat: 26.4623472, lng: 80.3597621 };
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Naatures+Scuup+The+Mall+126+Mall+Road+Kanpur";
const gestureMapStyles = `
  .visit-map__directions{position:absolute;z-index:4;right:14px;bottom:14px;display:inline-flex;align-items:center;gap:7px;min-height:42px;padding:0 13px;border:1px solid rgba(244,240,232,.45);border-radius:9px;background:rgba(67,5,23,.88);color:var(--cream);font:800 8px/1 Manrope,sans-serif;letter-spacing:.09em;text-transform:uppercase;backdrop-filter:blur(9px);transition:transform .16s var(--ease-out),background .16s var(--ease-out)}
  .visit-map__directions:hover{background:var(--mango);color:var(--maroon-deep);transform:translateY(-2px)}.visit-map__directions:active{transform:scale(.96)}.visit-map__directions:focus-visible{outline:2px solid var(--cream);outline-offset:3px}
  .visit-map__mall-landmark{position:absolute;z-index:3;top:16%;right:13%;display:grid;gap:3px;padding:7px 9px;border:1px solid rgba(244,240,232,.34);background:rgba(70,6,25,.76);color:var(--cream);font:800 8px/1 Manrope,sans-serif;letter-spacing:.11em;text-transform:uppercase;transform:rotate(-5deg);pointer-events:none}.visit-map__mall-landmark:before{content:"◼";color:var(--mango);font-size:7px}.visit-map__mall-landmark i{color:rgba(244,240,232,.62);font-size:6px;font-style:normal;letter-spacing:.1em}
  .visit-map__gesture-capture{display:none}.visit-map__gesture-hint{position:absolute;z-index:3;bottom:16px;left:16px;color:rgba(244,240,232,.64);font:800 7px/1 Manrope,sans-serif;letter-spacing:.12em;text-transform:uppercase;pointer-events:none}.visit-map__gesture-hint:after{content:"Scroll to explore"}@media(pointer:coarse){.visit-map__gesture-capture{position:absolute;z-index:3;inset:0;display:block;touch-action:pan-y}.visit-map__gesture-hint:after{content:"Use two fingers to explore"}}@media(max-width:760px){.visit-map__directions{right:10px;bottom:10px;padding-inline:10px;font-size:7px}.visit-map__mall-landmark{top:15%;right:8%;font-size:7px}.visit-map__gesture-hint{bottom:14px;left:14px;font-size:6px}}
  @media(prefers-reduced-motion:reduce){.visit-map__directions{transition:none}}
`;

export function LocationAtlas() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const touchPoints = useRef(new Map<number, { x: number; y: number }>());
  const touchOrigin = useRef<{ x: number; y: number; zoom: number; liveZoom: number; distance: number; midpointX: number; midpointY: number } | null>(null);
  const desktopDrag = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const [fallbackMap, setFallbackMap] = useState({ x: 0, y: 0, zoom: 0.8 });

  const onMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    map.setOptions({
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: false,
      gestureHandling: window.matchMedia("(pointer: fine)").matches ? "greedy" : "none",
      scrollwheel: window.matchMedia("(pointer: fine)").matches,
      backgroundColor: "#541222",
    });

    const marker = document.createElement("div");
    marker.className = "visit-map__marker";
    marker.innerHTML = "<span>NS</span>";
    new google.maps.marker.AdvancedMarkerElement({
      map,
      position: naaturesScuup,
      title: "Naatures Scuup, 126 The Mall Road, Kanpur",
      content: marker,
    });

    new google.maps.Geocoder().geocode({ address: "The Mall, Mall Road, Kanpur, Uttar Pradesh" }, (results, status) => {
      const mall = status === "OK" ? results?.[0]?.geometry.location : null;
      if (!mall) return;
      const landmark = document.createElement("div");
      landmark.className = "visit-map__mall-marker";
      landmark.textContent = "THE MALL";
      new google.maps.marker.AdvancedMarkerElement({ map, position: mall, title: "The Mall, Mall Road, Kanpur", content: landmark });
    });
  }, []);

  const touchSample = () => {
    const [first, second] = Array.from(touchPoints.current.values());
    if (!first || !second) return null;
    return { midpointX: (first.x + second.x) / 2, midpointY: (first.y + second.y) / 2, distance: Math.hypot(first.x - second.x, first.y - second.y) };
  };

  const startFallbackGesture = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType === "touch") {
      touchPoints.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      event.currentTarget.setPointerCapture(event.pointerId);
      const sample = touchSample();
      if (sample) touchOrigin.current = { ...fallbackMap, liveZoom: mapRef.current?.getZoom() ?? 14, ...sample };
      return;
    }
    desktopDrag.current = { x: event.clientX - fallbackMap.x, y: event.clientY - fallbackMap.y, pointerId: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveFallbackGesture = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType === "touch") {
      touchPoints.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const sample = touchSample();
      const origin = touchOrigin.current;
      if (!sample || !origin) return;
      const scale = sample.distance / origin.distance;
      mapRef.current?.setZoom(Math.max(11, Math.min(18, origin.liveZoom + Math.log2(scale))));
      setFallbackMap({ x: Math.max(-90, Math.min(90, origin.x + sample.midpointX - origin.midpointX)), y: Math.max(-70, Math.min(70, origin.y + sample.midpointY - origin.midpointY)), zoom: Math.max(0.68, Math.min(1.35, origin.zoom * scale)) });
      return;
    }
    const origin = desktopDrag.current;
    if (!origin || origin.pointerId !== event.pointerId) return;
    setFallbackMap((state) => ({ ...state, x: Math.max(-90, Math.min(90, event.clientX - origin.x)), y: Math.max(-70, Math.min(70, event.clientY - origin.y)) }));
  };

  const finishFallbackGesture = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType === "touch") {
      touchPoints.current.delete(event.pointerId);
      if (touchPoints.current.size < 2) touchOrigin.current = null;
      return;
    }
    if (desktopDrag.current?.pointerId === event.pointerId) desktopDrag.current = null;
  };

  const wheelFallback = (event: React.WheelEvent<HTMLSpanElement>) => {
    event.preventDefault();
    setFallbackMap((state) => ({ ...state, zoom: Math.max(0.68, Math.min(1.35, state.zoom + (event.deltaY < 0 ? 0.08 : -0.08))) }));
  };

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
          <span className="visit-map__fallback" role="presentation" style={{ transform: `translate(${fallbackMap.x}px, ${fallbackMap.y}px) scale(${fallbackMap.zoom})` }} onPointerDown={startFallbackGesture} onPointerMove={moveFallbackGesture} onPointerUp={finishFallbackGesture} onPointerCancel={finishFallbackGesture} onWheel={wheelFallback}><i className="visit-map__road visit-map__road--one" /><i className="visit-map__road visit-map__road--two" /><i className="visit-map__road visit-map__road--three" /><i className="visit-map__road visit-map__road--four" /></span>
          <MapView className="visit-map__canvas" initialCenter={naaturesScuup} initialZoom={14} onMapReady={onMapReady} />
          <span className="visit-map__gesture-capture" aria-hidden="true" onPointerDown={startFallbackGesture} onPointerMove={moveFallbackGesture} onPointerUp={finishFallbackGesture} onPointerCancel={finishFallbackGesture} />
          <span className="visit-map__tint" aria-hidden="true" />
          <div className="visit-map__place" aria-hidden="true"><span><MapPin size={17} fill="currentColor" /></span><strong>Naatures<br />Scuup</strong><small>Mall Road / Kanpur</small></div>
          <span className="visit-map__mall-landmark" aria-hidden="true">The Mall <i>nearby landmark</i></span>
          <span className="visit-map__gesture-hint" aria-hidden="true" />
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
