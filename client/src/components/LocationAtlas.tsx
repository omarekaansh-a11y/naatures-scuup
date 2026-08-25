import { ArrowUpRight, Crosshair, Facebook, Instagram, MapPin, Minus, Phone, Plus } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { MapView } from "@/components/Map";

const naaturesScuup = { lat: 26.4623472, lng: 80.3597621 };
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Naatures+Scuup+The+Mall+126+Mall+Road+Kanpur";

export function LocationAtlas() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const dragOrigin = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const [fallbackMap, setFallbackMap] = useState({ x: 0, y: 0, zoom: 1 });

  const onMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    map.setOptions({
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: true,
      gestureHandling: "cooperative",
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
  }, []);

  const recenter = () => {
    mapRef.current?.panTo(naaturesScuup);
    mapRef.current?.setZoom(16);
    setFallbackMap({ x: 0, y: 0, zoom: 1 });
  };

  const changeZoom = (delta: number) => {
    const liveMap = mapRef.current;
    if (liveMap) liveMap.setZoom(Math.max(13, Math.min(19, (liveMap.getZoom() ?? 16) + delta)));
    setFallbackMap((state) => ({ ...state, zoom: Math.max(0.86, Math.min(1.48, state.zoom + delta * 0.12)) }));
  };

  const startFallbackPan = (event: React.PointerEvent<HTMLSpanElement>) => {
    dragOrigin.current = { x: event.clientX - fallbackMap.x, y: event.clientY - fallbackMap.y, pointerId: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const panFallback = (event: React.PointerEvent<HTMLSpanElement>) => {
    const origin = dragOrigin.current;
    if (!origin || origin.pointerId !== event.pointerId) return;
    setFallbackMap((state) => ({ ...state, x: Math.max(-70, Math.min(70, event.clientX - origin.x)), y: Math.max(-55, Math.min(55, event.clientY - origin.y)) }));
  };

  const finishFallbackPan = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (dragOrigin.current?.pointerId === event.pointerId) dragOrigin.current = null;
  };

  return (
    <section id="location" className="location-atlas" aria-labelledby="location-title">
      <div className="location-atlas__inner section-pad">
        <header className="location-atlas__head">
          <p className="eyebrow eyebrow--mango">03 / Come on over</p>
          <h2 id="location-title" className="editorial-title editorial-title--light">
            <span className="title-outline">Find us on</span><br /><i>Mall Road.</i>
          </h2>
        </header>

        <div className="visit-map" aria-label="Interactive map centered on Naatures Scuup">
          <span className="visit-map__fallback" role="presentation" style={{ transform: `translate(${fallbackMap.x}px, ${fallbackMap.y}px) scale(${fallbackMap.zoom})` }} onPointerDown={startFallbackPan} onPointerMove={panFallback} onPointerUp={finishFallbackPan} onPointerCancel={finishFallbackPan}><i className="visit-map__road visit-map__road--one" /><i className="visit-map__road visit-map__road--two" /><i className="visit-map__road visit-map__road--three" /><i className="visit-map__road visit-map__road--four" /></span>
          <MapView className="visit-map__canvas" initialCenter={naaturesScuup} initialZoom={16} onMapReady={onMapReady} />
          <span className="visit-map__tint" aria-hidden="true" />
          <div className="visit-map__place" aria-hidden="true"><span><MapPin size={17} fill="currentColor" /></span><strong>Naatures<br />Scuup</strong><small>Mall Road / Kanpur</small></div>
          <div className="visit-map__controls">
            <div className="visit-map__zoom" aria-label="Map zoom controls"><button type="button" onClick={() => changeZoom(1)} aria-label="Zoom in"><Plus size={15} /></button><button type="button" onClick={() => changeZoom(-1)} aria-label="Zoom out"><Minus size={15} /></button></div>
            <button type="button" onClick={recenter} aria-label="Recenter map on Naatures Scuup" title="Recenter map"><Crosshair size={16} /></button>
            <a href={mapsUrl} target="_blank" rel="noreferrer">Directions <ArrowUpRight size={14} /></a>
          </div>
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
    </section>
  );
}
