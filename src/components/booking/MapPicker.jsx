import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { Check, Loader2, LocateFixed, MapPin, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";

/** Default view: Tunis (studio base). */
const DEFAULT_CENTER = [36.8065, 10.1815];
const NOMINATIM = "https://nominatim.openstreetmap.org";

const pinIcon = L.divIcon({
  className: "",
  iconSize: [36, 44],
  iconAnchor: [18, 42],
  html: `<svg viewBox="0 0 36 44" width="36" height="44" aria-hidden="true">
    <path d="M18 43s15-14.2 15-25.5A15 15 0 0 0 3 17.5C3 28.8 18 43 18 43z" fill="#2F4728"/>
    <circle cx="18" cy="17.5" r="6.5" fill="#C1D9B6"/>
  </svg>`
});

/** Keep addresses short: "Venue, Street, City". */
function shortAddress(result) {
  if (!result?.display_name) return "";
  return result.display_name.split(",").map((part) => part.trim()).filter(Boolean).slice(0, 4).join(", ");
}

/**
 * Full-screen (mobile) / centered (desktop) map to choose a location.
 * Search a place, tap the map, or use the device location. Returns { address, lat, lng }.
 */
export default function MapPicker({ initial, onSelect, onClose }) {
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [picked, setPicked] = useState(initial?.lat ? initial : null);
  const [resolving, setResolving] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [message, setMessage] = useState("");
  const lang = typeof navigator !== "undefined" ? navigator.language : "en";

  const placePin = async (lat, lng, knownAddress) => {
    const map = mapRef.current;
    if (!map) return;
    if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
    else markerRef.current = L.marker([lat, lng], { icon: pinIcon, keyboard: false }).addTo(map);
    setMessage("");
    if (knownAddress) {
      setPicked({ lat, lng, address: knownAddress });
      return;
    }
    const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    setPicked({ lat, lng, address: fallback });
    setResolving(true);
    try {
      const res = await fetch(`${NOMINATIM}/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&accept-language=${encodeURIComponent(lang)}`);
      const data = await res.json();
      const address = shortAddress(data) || fallback;
      setPicked((current) => (current && current.lat === lat && current.lng === lng ? { ...current, address } : current));
    } catch {
      /* keep coordinates as the address */
    } finally {
      setResolving(false);
    }
  };

  // Create the map once
  useEffect(() => {
    const start = initial?.lat ? [initial.lat, initial.lng] : DEFAULT_CENTER;
    const map = L.map(mapNode.current, { zoomControl: true, attributionControl: true }).setView(start, initial?.lat ? 15 : 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    mapRef.current = map;
    if (initial?.lat) markerRef.current = L.marker(start, { icon: pinIcon, keyboard: false }).addTo(map);
    map.on("click", (event) => placePin(event.latlng.lat, event.latlng.lng));
    const resize = window.setTimeout(() => map.invalidateSize(), 250);
    return () => {
      window.clearTimeout(resize);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escape closes only this dialog (capture phase, so the booking panel stays open); lock page scroll
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const search = async (event) => {
    event.preventDefault();
    event.stopPropagation(); // don't submit the booking form this dialog is rendered from
    const q = query.trim();
    if (q.length < 2) return;
    setSearching(true);
    setResults(null);
    try {
      const res = await fetch(`${NOMINATIM}/search?format=jsonv2&limit=5&q=${encodeURIComponent(q)}&accept-language=${encodeURIComponent(lang)}`);
      setResults(await res.json());
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const chooseResult = (result) => {
    const lat = Number(result.lat);
    const lng = Number(result.lon);
    mapRef.current?.setView([lat, lng], 16);
    placePin(lat, lng, shortAddress(result));
    setResults(null);
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setMessage("Location isn't available on this device.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        mapRef.current?.setView([coords.latitude, coords.longitude], 16);
        placePin(coords.latitude, coords.longitude);
      },
      () => {
        setLocating(false);
        setMessage("We couldn't get your location. Search or tap the map instead.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Portal to <body>: escapes the booking panel's transform and the booking <form>
  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/40 sm:items-center sm:p-6" onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-title"
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="flex h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[1.75rem] bg-paper shadow-lift sm:h-[min(82dvh,44rem)] sm:rounded-[1.75rem]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <h2 id="map-title" className="font-display text-xl font-semibold">
            Choose the location
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close map">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative border-b border-line p-3">
          <form onSubmit={search} className="flex gap-2" role="search">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search a place or address"
                aria-label="Search a place or address"
                className="h-11 w-full rounded-full border border-line bg-white pl-10 pr-4 text-base outline-none focus:border-sage-600 focus:ring-4 focus:ring-sage-100"
              />
            </div>
            <Button type="submit" variant="dark" size="sm" className="h-11" disabled={searching}>
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </form>
          {results && (
            <ul className="absolute inset-x-3 top-full z-[1000] mt-1 max-h-64 overflow-y-auto rounded-2xl border border-line bg-white py-1 shadow-lift">
              {results.length === 0 ? (
                <li className="px-4 py-3 text-sm text-ink-500">No places found. Try another search or tap the map.</li>
              ) : (
                results.map((result) => (
                  <li key={result.place_id}>
                    <button type="button" onClick={() => chooseResult(result)} className="flex w-full items-start gap-2 px-4 py-2.5 text-left text-sm hover:bg-sage-50">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage-700" />
                      {shortAddress(result)}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <div className="relative min-h-0 flex-1">
          <div ref={mapNode} className="absolute inset-0 z-0" />
          <button
            type="button"
            onClick={locate}
            className="absolute bottom-4 right-3 z-[500] inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold shadow-lift hover:bg-sage-50"
          >
            {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4 text-sage-700" />}
            My location
          </button>
        </div>

        <div className="pb-safe border-t border-line bg-white px-4 pt-3">
          <p className="flex min-h-[2.75rem] items-start gap-2 text-sm" aria-live="polite">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage-700" />
            {message ? (
              <span className="text-danger-600">{message}</span>
            ) : picked ? (
              <span className="font-medium">
                {picked.address}
                {resolving && <Loader2 className="ml-2 inline h-3.5 w-3.5 animate-spin text-ink-500" />}
              </span>
            ) : (
              <span className="text-ink-500">Search above or tap the map to drop a pin.</span>
            )}
          </p>
          <Button variant="dark" size="lg" className="mt-2 w-full" disabled={!picked || resolving} onClick={() => onSelect(picked)}>
            <Check className="h-5 w-5" />
            Use this location
          </Button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
