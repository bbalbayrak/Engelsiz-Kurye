'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { ObstacleReport } from '@/types';

const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

function MapSkeleton() {
  return (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-[3px] border-zinc-700 border-t-amber-500 rounded-full animate-spin" />
        </div>
        <span className="text-zinc-500 text-sm font-medium">Harita yükleniyor...</span>
      </div>
    </div>
  );
}

interface MapContainerProps {
  onReportSelect?: (report: ObstacleReport) => void;
}

export default function MapContainer({ onReportSelect }: MapContainerProps) {
  const [mounted, setMounted] = useState(false);
  const [reports, setReports] = useState<ObstacleReport[]>([]);

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (data.reports) setReports(data.reports);
    } catch {
      // silently fail — map will show empty
    }
  }, []);

  useEffect(() => { setMounted(true); fetchReports(); }, [fetchReports]);

  if (!mounted) return <MapSkeleton />;

  return <MapInner reports={reports} onReportSelect={onReportSelect} />;
}
