'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MapContainer from '@/components/map/MapContainer';
import StatsPanel from '@/components/ui/StatsPanel';
import { OBSTACLE_CONFIG } from '@/types';
import EditableSection from '@/components/admin/EditableSection';
import { useSections } from '@/components/providers/SectionsProvider';

const legendItems = Object.entries(OBSTACLE_CONFIG)
  .filter(([key]) => key !== 'other')
  .map(([, cfg]) => ({ color: cfg.color, label: cfg.label, icon: cfg.icon }));

export default function HomePage() {
  const { sections } = useSections();
  const campaign = sections.home_campaign?.content as {
    badge?: string; title?: string; highlight?: string; description?: string;
    pillars?: { icon: string; title: string; desc: string }[];
  } | undefined;

  const [mobileStats, setMobileStats] = useState({ total: 0, verified: 0 });
  useEffect(() => {
    fetch('/api/reports').then(r => r.json()).then(d => {
      const reports = d.reports || [];
      setMobileStats({ total: reports.length, verified: reports.filter((r: { verified: boolean }) => r.verified).length });
    }).catch(() => {});
  }, []);

  return (
    <div>
      {/* ── Full-screen Map ── */}
      <div className="relative h-[calc(100dvh-4rem)]">
        <MapContainer />

        <div className="absolute top-4 left-4 z-[1000] hidden sm:block">
          <StatsPanel />
        </div>

        <div className="absolute top-3 left-3 right-3 z-[1000] sm:hidden">
          <div className="bg-zinc-950/85 backdrop-blur-xl rounded-xl border border-zinc-800/60 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Canli</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-white font-bold">{mobileStats.total} <span className="text-zinc-500 font-normal">bildirim</span></span>
              <span className="w-px h-3 bg-zinc-700" />
              <span className="text-emerald-400 font-bold">{mobileStats.verified} <span className="text-zinc-500 font-normal">dogrulanan</span></span>
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-[1000] hidden lg:block">
          <div className="bg-zinc-950/85 backdrop-blur-xl rounded-xl border border-zinc-800/60 p-4 shadow-2xl shadow-black/40">
            <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.15em] mb-3">Engel Turleri</h4>
            <div className="flex flex-col gap-2">
              {legendItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-xs text-zinc-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-4 right-4 md:left-auto md:right-5 z-[1000]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <Link href="/engel-bildir"
            className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold py-4 px-8 rounded-2xl text-base transition-all shadow-xl shadow-red-500/25 hover:shadow-red-500/40 md:py-3 md:px-6 md:text-sm md:rounded-full animate-pulse-glow">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>
            Hemen Engel Bildir
          </Link>
        </div>
      </div>

      {/* ── Info Section ── */}
      <EditableSection sectionKey="home_campaign">
        <section className="py-20 px-4 sm:px-6 bg-zinc-950">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-block text-[11px] font-semibold text-amber-500 uppercase tracking-[0.2em] mb-4 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
              {campaign?.badge || 'Kampanya'}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
              {campaign?.title || 'Biz Sehri Tasiyoruz.'}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                {campaign?.highlight || 'Yolumuzu Kesmeyin.'}
              </span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto mb-14 leading-relaxed text-base md:text-lg">
              {campaign?.description || ''}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(campaign?.pillars || []).map((item, i) => (
                <div key={i} className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl p-7 hover:border-amber-500/30 hover:bg-amber-500/[0.02] transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500/15 to-orange-500/10 rounded-2xl flex items-center justify-center text-2xl mb-5 mx-auto group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-white mb-2.5 text-lg">{item.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </EditableSection>

      {/* ── Quick Legend on mobile ── */}
      <section className="py-8 px-4 bg-zinc-950 border-t border-zinc-800/40 lg:hidden">
        <div className="max-w-lg mx-auto">
          <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.15em] mb-4 text-center">
            Haritadaki Engel Turleri
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(OBSTACLE_CONFIG).map(([key, cfg]) => (
              <span key={key} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ background: `${cfg.color}12`, color: cfg.color, border: `1px solid ${cfg.color}25` }}>
                {cfg.icon} {cfg.label}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
