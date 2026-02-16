'use client';

import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OBSTACLE_CONFIG, type ObstacleReport, type ObstacleType } from '@/types';
import { formatRelativeDate } from '@/lib/utils';
import { useEffect } from 'react';

// ── Pin icon per obstacle type ──
function createPinIcon(type: ObstacleType) {
  const cfg = OBSTACLE_CONFIG[type] || OBSTACLE_CONFIG.other;
  return L.divIcon({
    html: `
      <div style="position:relative;width:36px;height:36px;">
        <div style="
          position:absolute;inset:0;
          background:${cfg.color};
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:2.5px solid rgba(255,255,255,0.9);
          box-shadow:0 3px 12px ${cfg.color}66, 0 1px 4px rgba(0,0,0,0.3);
        "></div>
        <div style="
          position:absolute;inset:0;
          display:flex;align-items:center;justify-content:center;
          font-size:15px;z-index:1;margin-top:-1px;
        ">${cfg.icon}</div>
      </div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -38],
  });
}

// ── Cluster icon ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createClusterIcon(cluster: any) {
  const count = cluster.getChildCount();
  const s = count >= 50 ? 56 : count >= 10 ? 48 : 40;
  const fs = count >= 50 ? 15 : count >= 10 ? 14 : 13;
  return L.divIcon({
    html: `
      <div style="
        width:${s}px;height:${s}px;
        background:linear-gradient(135deg,#f59e0b,#ea580c);
        border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        color:white;font-weight:700;font-size:${fs}px;
        border:3px solid rgba(255,255,255,0.25);
        box-shadow:0 4px 20px rgba(245,158,11,0.45),0 0 0 6px rgba(245,158,11,0.15);
        font-family:'Inter',system-ui,sans-serif;
      ">${count}</div>`,
    className: '',
    iconSize: [s, s],
    iconAnchor: [s / 2, s / 2],
  });
}

// ── Locate button ──
function LocateControl() {
  const map = useMap();
  useEffect(() => {
    const btn = L.Control.extend({
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
          map.locate({ setView: true, maxZoom: 14 });
        };
        return container;
      },
    });
    const control = new btn({ position: 'bottomleft' });
    control.addTo(map);
    return () => { control.remove(); };
  }, [map]);
  return null;
}

// ── Popup Content ──
function PopupContent({ report }: { report: ObstacleReport }) {
  const cfg = OBSTACLE_CONFIG[report.obstacleType];
  return (
    <div style={{ width: 'min(280px, calc(100vw - 60px))', padding: '14px', fontFamily: "'Inter',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#fafafa', marginBottom: 2 }}>{report.siteName}</div>
          <div style={{ fontSize: 12, color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/></svg>
            {report.district}, {report.city}
          </div>
        </div>
        {report.verified && (
          <span style={{
            fontSize: 10, fontWeight: 600, color: '#4ade80',
            background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)',
            borderRadius: 99, padding: '2px 8px', whiteSpace: 'nowrap',
          }}>Doğrulanmış</span>
        )}
      </div>

      {/* Obstacle type badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: `${cfg.color}18`, border: `1px solid ${cfg.color}40`,
        borderRadius: 10, padding: '8px 12px', marginBottom: 10,
      }}>
        <span style={{ fontSize: 18 }}>{cfg.icon}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
      </div>

      {/* Description */}
      {report.description && (
        <p style={{ fontSize: 12, color: '#a1a1aa', lineHeight: 1.6, marginBottom: 10 }}>
          {report.description}
        </p>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid #27272a', paddingTop: 10,
        fontSize: 11, color: '#71717a',
      }}>
        <span>{formatRelativeDate(report.reportedAt)}</span>
        <span style={{
          background: '#27272a', borderRadius: 99,
          padding: '2px 8px', fontSize: 11, color: '#d4d4d8',
        }}>{report.reportCount} bildirim</span>
      </div>
    </div>
  );
}

// ── Main Map ──
interface MapInnerProps {
  reports?: ObstacleReport[];
  onReportSelect?: (report: ObstacleReport) => void;
}

export default function MapInner({ reports = [] }: MapInnerProps) {
  const data = reports;

  return (
    <MapContainer
      center={[39.2, 35.2]}
      zoom={6}
      minZoom={5}
      maxZoom={18}
      zoomControl={false}
      className="w-full h-full"
      style={{ background: '#09090b' }}
    >
      <ZoomControl position="bottomleft" />
      <LocateControl />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        maxZoom={19}
      />
      <MarkerClusterGroup
        iconCreateFunction={createClusterIcon}
        maxClusterRadius={50}
        spiderfyOnMaxZoom
        showCoverageOnHover={false}
        disableClusteringAtZoom={17}
        animate
        animateAddingMarkers
      >
        {data.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={createPinIcon(report.obstacleType)}
          >
            <Popup maxWidth={300} minWidth={200} closeButton={true} autoPan autoPanPaddingTopLeft={[10, 60]} autoPanPaddingBottomRight={[10, 10]}>
              <PopupContent report={report} />
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
