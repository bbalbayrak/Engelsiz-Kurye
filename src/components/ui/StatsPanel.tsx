'use client';

import { useState, useEffect } from 'react';
import { OBSTACLE_CONFIG, type ObstacleType } from '@/types';

export default function StatsPanel() {
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, obstacleStats: {} as Record<string, number> });

  useEffect(() => {
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => {
        const reports: { obstacleType: string }[] = data.reports || [];
        const counts = data.counts ?? { total: reports.length, verified: reports.length, pending: 0 };
        const obstacleStats: Record<string, number> = {};
        for (const r of reports) {
          obstacleStats[r.obstacleType] = (obstacleStats[r.obstacleType] || 0) + 1;
        }
        setStats({ total: counts.total, verified: counts.verified, pending: counts.pending, obstacleStats });
      })
      .catch(() => {});
  }, []);

  const { total, verified, pending, obstacleStats } = stats;

  return (
    <div className="bg-zinc-950/85 backdrop-blur-xl rounded-2xl border border-zinc-800/60 shadow-2xl shadow-black/40 w-72 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-zinc-800/60">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.15em]">Canlı Kampanya</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-zinc-800/60 px-1 py-3">
        {[
          { value: String(total), label: 'Bildirim' },
          { value: String(verified), label: 'Doğrulanan' },
          { value: String(pending), label: 'Bekleyen' },
        ].map((stat, i) => (
          <div key={i} className="text-center px-2">
            <div className="text-lg font-bold text-white leading-none">{stat.value}</div>
            <div className="text-[10px] text-zinc-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Obstacle breakdown */}
      <div className="px-4 pb-3 pt-1">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(obstacleStats).slice(0, 5).map(([type, count]) => {
            const cfg = OBSTACLE_CONFIG[type as ObstacleType];
            if (!cfg) return null;
            return (
              <span
                key={type}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium"
                style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}
              >
                <span>{cfg.icon}</span>
                {count}
              </span>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 pb-4">
        <div className="flex justify-between text-[10px] text-zinc-500 mb-1.5">
          <span>{total} / 1.000 bildirim</span>
          <span>{Math.round((total / 1000) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min((total / 1000) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
