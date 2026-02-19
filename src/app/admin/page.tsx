'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSections } from '@/components/providers/SectionsProvider';
import { OBSTACLE_CONFIG, type ObstacleType } from '@/types';

interface Section {
  key: string;
  page: string;
  label: string;
  visible: boolean;
  content: Record<string, unknown>;
  updatedAt: string;
}

interface Report {
  id: string;
  userEmail: string | null;
  siteName: string;
  city: string;
  district: string;
  obstacleType: string;
  description: string | null;
  reportedAt: string;
  verified: boolean;
  reportCount: number;
}

const pageLabels: Record<string, string> = {
  home: 'Ana Sayfa',
  hakkimizda: 'Hakkımızda',
  'hukuki-rehber': 'Hukuki Rehber',
  kaynaklar: 'Kaynaklar',
};

const FIELD_LABELS: Record<string, string> = {
  badge: 'Rozet Metni',
  title: 'Başlık',
  highlight: 'Vurgu Metni',
  description: 'Açıklama',
  subtitle: 'Alt Başlık',
  paragraphs: 'Paragraflar',
  paragraph1: '1. Paragraf',
  paragraph2: '2. Paragraf',
  paragraph3: '3. Paragraf',
  icon: 'İkon',
  videoTitle: 'Video Başlığı',
  videoDuration: 'Video Süresi',
  pillars: 'Sütunlar',
  items: 'Öğeler',
  events: 'Zaman Çizelgesi',
  cards: 'Kartlar',
  tag: 'Etiket',
  tagColor: 'Etiket Rengi',
  date: 'Tarih',
  desc: 'Açıklama',
  color: 'Renk (CSS)',
  email: 'E-posta',
  phone: 'Telefon',
};

function toLabel(key: string): string {
  return FIELD_LABELS[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
}

function isLongText(key: string, val: string): boolean {
  return val.length > 80 || ['description', 'desc', 'paragraph1', 'paragraph2', 'paragraph3', 'subtitle'].includes(key);
}

const baseInput = 'w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all';

function FieldEditor({ fieldKey, value, onChange }: {
  fieldKey: string;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (typeof value === 'string') {
    if (isLongText(fieldKey, value)) {
      return (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={3}
          className={`${baseInput} resize-none leading-relaxed`}
          style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}
        />
      );
    }
    return (
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className={baseInput}
        style={{ wordBreak: 'break-word' }}
      />
    );
  }

  if (typeof value === 'number') {
    return (
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className={`${baseInput} w-28`}
      />
    );
  }

  if (Array.isArray(value)) {
    const arr = value as unknown[];
    return (
      <div className="space-y-2">
        {arr.map((item, idx) => (
          <div key={idx} className="bg-zinc-950/60 border border-zinc-700/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">#{idx + 1}</span>
              <button
                type="button"
                onClick={() => { const a = [...arr]; a.splice(idx, 1); onChange(a); }}
                className="text-[10px] text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                Kaldır
              </button>
            </div>
            <FieldEditor
              fieldKey={fieldKey}
              value={item}
              onChange={newItem => {
                const a = [...arr];
                a[idx] = newItem;
                onChange(a);
              }}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const first = arr[0];
            const newItem = typeof first === 'object' && !Array.isArray(first) && first !== null
              ? Object.fromEntries(Object.entries(first as Record<string, unknown>).map(([k, v]) => [k, typeof v === 'string' ? '' : typeof v === 'number' ? 0 : v]))
              : '';
            onChange([...arr, newItem]);
          }}
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 pt-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Yeni Ekle
        </button>
      </div>
    );
  }

  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>;
    return (
      <div className="space-y-3">
        {Object.entries(obj).map(([k, v]) => (
          <div key={k}>
            <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
              {toLabel(k)}
            </label>
            <FieldEditor
              fieldKey={k}
              value={v}
              onChange={newV => onChange({ ...obj, [k]: newV })}
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function ReportRow({ report, onApprove, onRevoke, onDelete, actionLoading, deleteLoading, approved = false }: {
  report: Report;
  onApprove?: () => void;
  onRevoke?: () => void;
  onDelete?: () => void;
  actionLoading: boolean;
  deleteLoading: boolean;
  approved?: boolean;
}) {
  const types = report.obstacleType.split(',').map(t => OBSTACLE_CONFIG[t.trim() as ObstacleType]).filter(Boolean);

  return (
    <div className={`bg-zinc-900/50 border rounded-xl p-4 transition-all ${approved ? 'border-emerald-500/20' : 'border-amber-500/20 bg-amber-500/[0.02]'}`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-semibold text-white">{report.siteName}</span>
            <span className="text-xs text-zinc-500">{report.district}, {report.city}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {types.map((cfg, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md"
                style={{ background: `${cfg.color}18`, color: cfg.color, border: `1px solid ${cfg.color}35` }}>
                {cfg.icon} {cfg.label}
              </span>
            ))}
          </div>
          {report.description && (
            <p className="text-xs text-zinc-500 line-clamp-2 break-words">{report.description}</p>
          )}
          <p className="text-[10px] text-zinc-600 mt-1">
            {report.userEmail || 'Anonim'} · {new Date(report.reportedAt).toLocaleDateString('tr-TR')}
          </p>
        </div>
        <div className="shrink-0 self-center sm:self-start flex gap-2">
          {approved ? (
            <>
              <button
                onClick={onRevoke}
                disabled={actionLoading || deleteLoading}
                className="px-3 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {actionLoading && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                Onayı Kaldır
              </button>
              <button
                onClick={onDelete}
                disabled={actionLoading || deleteLoading}
                className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {deleteLoading && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                Sil
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onApprove}
                disabled={actionLoading || deleteLoading}
                className="px-3 py-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {actionLoading && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                Onayla
              </button>
              <button
                onClick={onDelete}
                disabled={actionLoading || deleteLoading}
                className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {deleteLoading && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                Reddet
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { refresh: refreshSections } = useSections();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'sections' | 'reports'>('sections');

  // Sections state
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editFields, setEditFields] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState<string | null>(null);

  // Reports state
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/sections');
      const data = await res.json();
      if (data.sections) setSections(data.sections);
    } catch { /**/ }
    setLoading(false);
  }, []);

  const fetchReports = useCallback(async () => {
    setReportsLoading(true);
    try {
      const res = await fetch('/api/admin/reports');
      const data = await res.json();
      if (data.reports) setReports(data.reports);
    } catch { /**/ }
    setReportsLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) { router.push('/giris'); return; }
    if (user?.role === 'admin') {
      fetchSections();
      fetchReports();
    }
  }, [user, authLoading, router, fetchSections, fetchReports]);

  const toggleVisibility = async (key: string, currentVisible: boolean) => {
    setSaving(key);
    await fetch(`/api/admin/sections/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: !currentVisible }),
    });
    await fetchSections();
    await refreshSections();
    setSaving(null);
  };

  const startEdit = (section: Section) => {
    setEditingSection(section);
    setEditFields({ ...section.content });
  };

  const saveContent = async () => {
    if (!editingSection) return;
    setSaving(editingSection.key);
    try {
      await fetch(`/api/admin/sections/${editingSection.key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editFields }),
      });
      await fetchSections();
      await refreshSections();
      setEditingSection(null);
    } catch {
      alert('Kaydetme sırasında hata oluştu.');
    }
    setSaving(null);
  };

  const approveReport = async (id: string, verified: boolean) => {
    setApprovingId(id);
    try {
      await fetch(`/api/admin/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified }),
      });
      await fetchReports();
    } catch { /**/ }
    setApprovingId(null);
  };

  const deleteReport = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch(`/api/admin/reports/${id}`, { method: 'DELETE' });
      await fetchReports();
    } catch { /**/ }
    setDeletingId(null);
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

  const pendingReports = reports.filter(r => !r.verified);
  const approvedReports = reports.filter(r => r.verified);

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
            <h1 className="text-2xl md:text-3xl font-bold text-white">Site Yönetimi</h1>
            <p className="text-zinc-500 text-sm mt-1">Bölümleri düzenle ve bildirimleri onayla.</p>
          </div>
          <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">Admin</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-zinc-900/50 border border-zinc-800 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab('sections')}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'sections' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Bölümler
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'reports' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Bildirimler
            {pendingReports.length > 0 && (
              <span className="text-[10px] font-bold bg-amber-500 text-zinc-950 rounded-full px-1.5 py-0.5 leading-none">
                {pendingReports.length}
              </span>
            )}
          </button>
        </div>

        {/* ── Sections Tab ── */}
        {activeTab === 'sections' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { label: 'Toplam Bölüm', value: sections.length },
                { label: 'Görünen', value: sections.filter(s => s.visible).length },
                { label: 'Gizli', value: sections.filter(s => !s.visible).length },
                { label: 'Sayfa', value: Object.keys(groupedByPage).length },
              ].map((stat, i) => (
                <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

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
                      className={`bg-zinc-900/50 border rounded-xl p-4 transition-all ${section.visible ? 'border-zinc-800' : 'border-red-500/20 bg-red-500/[0.02]'}`}
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
                            Düzenle
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
                            {saving === section.key
                              ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              : section.visible ? 'Gizle' : 'Göster'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── Reports Tab ── */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Toplam', value: reports.length },
                { label: 'Bekleyen', value: pendingReports.length },
                { label: 'Onaylanan', value: approvedReports.length },
              ].map((stat, i) => (
                <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {reportsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-zinc-700 border-t-amber-500 rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {pendingReports.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Onay Bekleyen ({pendingReports.length})
                    </h2>
                    <div className="space-y-2">
                      {pendingReports.map(report => (
                        <ReportRow
                          key={report.id}
                          report={report}
                          onApprove={() => approveReport(report.id, true)}
                          onDelete={() => deleteReport(report.id)}
                          actionLoading={approvingId === report.id}
                          deleteLoading={deletingId === report.id}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {approvedReports.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Onaylanan ({approvedReports.length})
                    </h2>
                    <div className="space-y-2">
                      {approvedReports.map(report => (
                        <ReportRow
                          key={report.id}
                          report={report}
                          onRevoke={() => approveReport(report.id, false)}
                          onDelete={() => deleteReport(report.id)}
                          actionLoading={approvingId === report.id}
                          deleteLoading={deletingId === report.id}
                          approved
                        />
                      ))}
                    </div>
                  </div>
                )}

                {reports.length === 0 && (
                  <div className="text-center py-16 text-zinc-600 text-sm">Henüz bildirim yok.</div>
                )}
              </>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {editingSection && (
          <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center sm:p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditingSection(null)} />
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-zinc-800 shrink-0">
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">{editingSection.label}</h3>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{editingSection.key}</p>
                </div>
                <button
                  onClick={() => setEditingSection(null)}
                  className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-all shrink-0 ml-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 space-y-4 min-h-0">
                {Object.entries(editFields).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      {toLabel(key)}
                    </label>
                    <FieldEditor
                      fieldKey={key}
                      value={value}
                      onChange={(newVal) => setEditFields(prev => ({ ...prev, [key]: newVal }))}
                    />
                  </div>
                ))}
              </div>

              <div
                className="flex items-center justify-end gap-2 sm:gap-3 px-4 sm:px-5 py-3 border-t border-zinc-800 shrink-0"
                style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
              >
                <button
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all"
                >
                  İptal
                </button>
                <button
                  onClick={saveContent}
                  disabled={saving !== null}
                  className="px-5 py-2 text-sm font-bold text-zinc-950 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-60 rounded-lg transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  {saving !== null && (
                    <div className="w-4 h-4 border-2 border-zinc-700 border-t-transparent rounded-full animate-spin" />
                  )}
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
