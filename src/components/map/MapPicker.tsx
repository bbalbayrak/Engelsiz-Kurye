'use client';

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useCallback } from 'react';

const pinIcon = L.divIcon({
  html: `
    <div style="position:relative;width:40px;height:40px;">
      <div style="
        position:absolute;inset:0;
        background:linear-gradient(135deg,#f59e0b,#ea580c);
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:3px solid rgba(255,255,255,0.9);
        box-shadow:0 4px 16px rgba(245,158,11,0.5), 0 2px 6px rgba(0,0,0,0.3);
      "></div>
      <div style="
        position:absolute;inset:0;
        display:flex;align-items:center;justify-content:center;
        font-size:18px;z-index:1;margin-top:-2px;
      ">📍</div>
    </div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Shadow/pulse under the pin
const shadowIcon = L.divIcon({
  html: `<div style="
    width:16px;height:6px;
    background:rgba(245,158,11,0.3);
    border-radius:50%;
    filter:blur(3px);
    margin-top:-3px;
  "></div>`,
  className: '',
  iconSize: [16, 6],
  iconAnchor: [8, 3],
});

interface DraggableMarkerProps {
  position: [number, number];
  onDragEnd: (lat: number, lng: number) => void;
}

function DraggableMarker({ position, onDragEnd }: DraggableMarkerProps) {
  const markerRef = useRef<L.Marker>(null);

  const handleDragEnd = useCallback(() => {
    const marker = markerRef.current;
    if (marker) {
      const pos = marker.getLatLng();
      onDragEnd(pos.lat, pos.lng);
    }
  }, [onDragEnd]);

  return (
    <>
      <Marker position={position} icon={shadowIcon} />
      <Marker
        position={position}
        icon={pinIcon}
        draggable
        ref={markerRef}
        eventHandlers={{ dragend: handleDragEnd }}
      />
    </>
  );
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyToPosition({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 16, { duration: 1.2 });
  }, [map, position]);
  return null;
}

function LocateButton() {
  const map = useMap();
  useEffect(() => {
    const Btn = L.Control.extend({
      onAdd: function () {
        const container = L.DomUtil.create('div', '');
        container.innerHTML = `
          <button style="
            width:36px;height:36px;
            background:#18181b;border:1px solid #3f3f46;
            border-radius:10px;cursor:pointer;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 4px 12px rgba(0,0,0,0.4);
          " title="Konumumu bul">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fafafa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4m10-10h-4M6 12H2"/>
            </svg>
          </button>`;
        L.DomEvent.disableClickPropagation(container);
        container.onclick = () => {
          map.locate({ setView: true, maxZoom: 16 });
        };
        return container;
      },
    });
    const control = new Btn({ position: 'bottomleft' });
    control.addTo(map);
    return () => { control.remove(); };
  }, [map]);
  return null;
}

interface MapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

export default function MapPicker({ latitude, longitude, onChange }: MapPickerProps) {
  const hasPin = latitude !== null && longitude !== null;
  const center: [number, number] = hasPin ? [latitude, longitude] : [39.2, 35.2];
  const zoom = hasPin ? 16 : 6;

  return (
    <div className="space-y-2">
      <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900" style={{ height: 350 }}>
        <MapContainer
          center={center}
          zoom={zoom}
          minZoom={5}
          maxZoom={18}
          zoomControl={false}
          className="w-full h-full"
          style={{ background: '#09090b' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />
          <LocateButton />
          <MapClickHandler onClick={onChange} />
          {hasPin && (
            <>
              <FlyToPosition position={[latitude, longitude]} />
              <DraggableMarker position={[latitude, longitude]} onDragEnd={onChange} />
            </>
          )}
        </MapContainer>

        {/* Overlay instruction when no pin */}
        {!hasPin && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
            <div className="bg-zinc-950/80 backdrop-blur-sm border border-zinc-700 rounded-xl px-5 py-3 text-center">
              <p className="text-zinc-300 text-sm font-medium">Haritaya tıklayarak konum seçin</p>
              <p className="text-zinc-500 text-xs mt-1">veya adres bilgilerini girip otomatik buldur</p>
            </div>
          </div>
        )}
      </div>

      {hasPin && (
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/>
            <circle cx="12" cy="11" r="3"/>
          </svg>
          <span>Pin konumu: {latitude.toFixed(5)}, {longitude.toFixed(5)}</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">Pini sürükleyerek konumu düzeltebilirsiniz</span>
        </div>
      )}
    </div>
  );
}
