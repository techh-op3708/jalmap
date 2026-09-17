import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { useLocation, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RISK_COLORS, RISK_BG } from '../data/types';
import { useWaterData } from '../data/liveWaterData';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

(L.Icon.Default as any).mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface IndiaMapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
}

function SetMapInstance({ mapRef }: { mapRef: React.RefObject<L.Map | null> }) {
  const map = useMap();
  useEffect(() => {
    (mapRef as any).current = map;
  }, [map, mapRef]);
  return null;
}

export default function IndiaMap({
  initialCenter = [22.5, 79.5],
  initialZoom = 5,
}: IndiaMapProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef<L.Map | null>(null);
  const { states } = useWaterData();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeStateId, setActiveStateId] = useState<string | null>(
    location.pathname.startsWith('/map/') ? location.pathname.split('/map/')[1] : null
  );

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 220);
    return () => clearTimeout(t);
  }, []);

  const cityList = useMemo(() => {
    return states.flatMap((s) => s.cities.map((c) => ({ ...c, stateId: s.id, stateName: s.name })));
  }, [states]);
  const activeState = useMemo(() => states.find((s) => s.id === activeStateId) ?? null, [states, activeStateId]);

  const focusState = (id: string | null) => {
    setActiveStateId(id);
    if (!mapRef.current) return;
    if (!id) {
      mapRef.current.flyTo(initialCenter, initialZoom, { duration: 1.2 });
      navigate('/');
      return;
    }
    const state = states.find((s) => s.id === id);
    if (!state) return;
    const latlngs = state.cities.map((c) => [c.lat, c.lng] as [number, number]);
    const bounds = L.latLngBounds(latlngs as any);
    mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
    navigate(`/map/${state.id}`);
  };

  useEffect(() => {
    function handleFocus(e: any) {
      focusState(e?.detail?.id ?? null);
    }
    window.addEventListener('jalmap:focusState', handleFocus as EventListener);
    return () => window.removeEventListener('jalmap:focusState', handleFocus as EventListener);
  }, []);

  useEffect(() => {
    if (!location.pathname.startsWith('/map/')) {
      setActiveStateId(null);
      return;
    }
    const stateId = location.pathname.split('/map/')[1];
    if (stateId && states.some((s) => s.id === stateId)) {
      setActiveStateId(stateId);
    }
  }, [location.pathname]);

  const handleSearch = (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (!query.trim() || !mapRef.current) return;
    const q = query.toLowerCase();
    const city = cityList.find((c) => c.name.toLowerCase() === q || `${c.name}, ${c.stateName}`.toLowerCase() === q);
    if (city) {
      setActiveStateId(city.stateId);
      mapRef.current.flyTo([city.lat, city.lng], 11, { duration: 1 });
      navigate(`/map/${city.stateId}`);
      return;
    }
    const state = states.find((s) => s.name.toLowerCase() === q);
    if (state) {
      focusState(state.id);
    }
  };

  const visibleCities = activeState ? activeState.cities.map((c) => ({ ...c, stateId: activeState.id, stateName: activeState.name })) : cityList;

  return (
    <div className="mb-8">
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <form onSubmit={handleSearch} className="flex w-full gap-2">
          <input
            aria-label="Search city or state"
            placeholder="Search city or state (e.g. Pune, Maharashtra)"
            className="w-full rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm shadow-sm backdrop-blur"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm">Go</button>
        </form>
        <div className="flex items-center gap-2">
          <button
            onClick={() => focusState(null)}
            className="rounded-xl border border-white/50 bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur"
          >
            ← Back to India
          </button>
        </div>
      </div>

      {activeState && (
        <div className="mb-3 rounded-2xl border border-white/40 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
            <span className="font-semibold text-slate-900">{activeState.name}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1">{activeState.cities.length} cities</span>
            <span className={`rounded-full px-2.5 py-1 text-sm font-semibold ${RISK_BG[activeState.overallRisk]}`}>{activeState.overallRisk}</span>
          </div>
        </div>
      )}

      <div className="relative">
        {isLoading ? (
          <div className="h-[60vh] w-full animate-pulse rounded-[24px] bg-slate-100/80" />
        ) : (
          <MapContainer
            center={initialCenter}
            zoom={initialZoom}
            scrollWheelZoom={true}
            className="h-[70vh] w-full rounded-[24px] border border-white/40 shadow-[0_20px_45px_-20px_rgba(5,40,64,0.35)]"
          >
            <SetMapInstance mapRef={mapRef} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {visibleCities.map((city) => {
              const color = RISK_COLORS[city.risk as keyof typeof RISK_COLORS] ?? '#333';
              return (
                <CircleMarker
                  key={`${city.stateId}-${city.name}`}
                  center={[city.lat, city.lng]}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.9 }}
                  radius={8}
                >
                  <Popup>
                    <div className="max-w-xs">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{city.name}</div>
                          <div className="mt-1 text-xs text-slate-500">{city.stateName}</div>
                        </div>
                        <div className={`rounded-full px-3 py-1 text-sm font-semibold ${RISK_BG[city.risk as keyof typeof RISK_BG]}`}>
                          {city.risk}
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-slate-700">
                        <div>Source: {city.source}</div>
                        <div>TDS: {city.tds} mg/L</div>
                        <div>pH: {city.ph}</div>
                        <div>Turbidity: {city.turbidity} NTU</div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        )}

        <div className="absolute bottom-3 left-3 z-[1000] rounded-xl border border-white/50 bg-white/80 px-3 py-2 shadow-sm backdrop-blur">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">Risk legend</div>
          <div className="flex flex-col gap-2 text-xs">
            {(['Safe', 'Moderate', 'Contaminated', 'Critical'] as const).map((r) => (
              <div key={r} className="flex items-center gap-2">
                <span style={{ background: RISK_COLORS[r] }} className="h-3 w-3 rounded-full" />
                <span className="text-slate-700">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
