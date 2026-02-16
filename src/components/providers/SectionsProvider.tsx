'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface SectionData {
  visible: boolean;
  content: Record<string, unknown>;
}

interface SectionsContextType {
  sections: Record<string, SectionData>;
  loading: boolean;
  refresh: () => Promise<void>;
  updateSection: (key: string, data: { visible?: boolean; content?: Record<string, unknown> }) => Promise<boolean>;
}

const SectionsContext = createContext<SectionsContextType | null>(null);

export function SectionsProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<Record<string, SectionData>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/sections');
      const data = await res.json();
      if (data.sections) setSections(data.sections);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const updateSection = async (key: string, data: { visible?: boolean; content?: Record<string, unknown> }) => {
    try {
      const res = await fetch(`/api/admin/sections/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) return false;
      await refresh();
      return true;
    } catch {
      return false;
    }
  };

  return (
    <SectionsContext.Provider value={{ sections, loading, refresh, updateSection }}>
      {children}
    </SectionsContext.Provider>
  );
}

export function useSections() {
  const ctx = useContext(SectionsContext);
  if (!ctx) throw new Error('useSections must be used within SectionsProvider');
  return ctx;
}
