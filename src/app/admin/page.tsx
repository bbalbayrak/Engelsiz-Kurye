'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';

interface Section {
  key: string;
  page: string;
  label: string;
  visible: boolean;
  content: Record<string, unknown>;
  updatedAt: string;
}

const pageLabels: Record<string, string> = {
  home: 'Ana Sayfa',
  hakkimizda: 'Hakkimizda',
  'hukuki-rehber': 'Hukuki Rehber',
  kaynaklar: 'Kaynaklar',
};

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState<string | null>(null);

  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/sections');
      const data = await res.json();
      if (data.sections) setSections(data.sections);
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/giris');
      return;
    }
    if (user?.role === 'admin') fetchSections();
  }, [user, authLoading, router, fetchSections]);

  const toggleVisibility = async (key: string, currentVisible: boolean) => {
    setSaving(key);
    await fetch(`/api/admin/sections/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: !currentVisible }),
    });
    await fetchSections();
    setSaving(null);
  };

  const startEdit = (section: Section) => {
    setEditingKey(section.key);
    setEditContent(JSON.stringify(section.content, null, 2));
  };

  const saveContent = async () => {
    if (!editingKey) return;
    try {
      const parsed = JSON.parse(editContent);
      setSaving(editingKey);
      await fetch(`/api/admin/sections/${editingKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: parsed }),
      });
      await fetchSections();
      setEditingKey(null);
    } catch {
      alert('JSON formati hatali. Lutfen kontrol edin.');
    }
    setSaving(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const groupedByPage = sections.reduce<Record<string, Section[]>>((acc, s) => {
    (acc[s.page] = acc[s.page] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-600 mb-2">
              <Link href="/" className="hover:text-zinc-400 transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <span className="text-zinc-400">Admin Panel</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Site Yonetimi
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Bolumleri gizle/goster ve iceriklerini duzenle.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
              Admin
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Toplam Bolum', value: sections.length },
            { label: 'Gorunen', value: sections.filter(s => s.visible).length },
            { label: 'Gizli', value: sections.filter(s => !s.visible).length },
            { label: 'Sayfa', value: Object.keys(groupedByPage).length },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Sections by page */}
        {Object.entries(groupedByPage).map(([page, pageSections]) => (
          <div key={page} className="mb-8">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {pageLabels[page] || page}
            </h2>

            <div className="space-y-2">
              {pageSections.map((section) => (
                <div
                  key={section.key}
                  className={`bg-zinc-900/50 border rounded-xl p-4 transition-all ${
                    section.visible ? 'border-zinc-800' : 'border-red-500/20 bg-red-500/[0.02]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${section.visible ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-white truncate">{section.label}</div>
                        <div className="text-[11px] text-zinc-600 font-mono">{section.key}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 pl-5 sm:pl-0">
                      <button
                        onClick={() => startEdit(section)}
                        className="px-3 py-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg transition-all"
                      >
                        Duzenle
                      </button>
                      <button
                        onClick={() => toggleVisibility(section.key, section.visible)}
                        disabled={saving === section.key}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${
                          section.visible
                            ? 'text-zinc-400 bg-zinc-800 hover:bg-zinc-700 border-zinc-700'
                            : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20'
                        }`}
                      >
                        {saving === section.key ? (
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : section.visible ? 'Gizle' : 'Goster'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Edit Modal */}
        {editingKey && (
          <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center sm:p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditingKey(null)} />
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[80vh] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-zinc-800">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white">Icerik Duzenle</h3>
                  <p className="text-[10px] sm:text-xs text-zinc-500 font-mono mt-0.5 truncate">{editingKey}</p>
                </div>
                <button onClick={() => setEditingKey(null)} className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-all shrink-0 ml-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="p-4 sm:p-6 flex-1 overflow-auto">
                <p className="text-[11px] sm:text-xs text-zinc-500 mb-3">
                  JSON formatinda icerik. Alanlari degistirin, kaydedin.
                </p>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={10}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 sm:px-4 py-3 text-zinc-200 font-mono text-[11px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-y leading-relaxed"
                  spellCheck={false}
                />
              </div>

              <div className="flex items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-zinc-800 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                <button onClick={() => setEditingKey(null)} className="px-3 sm:px-4 py-2 text-sm font-medium text-zinc-400 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all">
                  Iptal
                </button>
                <button
                  onClick={saveContent}
                  disabled={saving !== null}
                  className="px-4 sm:px-5 py-2 text-sm font-bold text-zinc-950 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-lg transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-zinc-700 border-t-transparent rounded-full animate-spin" />
                  ) : null}
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
