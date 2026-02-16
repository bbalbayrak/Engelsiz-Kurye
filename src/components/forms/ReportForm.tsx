'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { cities, districts } from '@/lib/data';
import { OBSTACLE_CONFIG, type ObstacleType } from '@/types';
import { generateCaptcha } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';

const inputClass = 'w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm';

export default function ReportForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    siteName: '', address: '', city: '', district: '',
    obstacleType: '' as ObstacleType | '', description: '', captchaAnswer: '',
  });
  const [captcha, setCaptcha] = useState({ question: '', answer: 0 });
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const refreshCaptcha = useCallback(() => setCaptcha(generateCaptcha()), []);
  useEffect(() => { refreshCaptcha(); }, [refreshCaptcha]);

  const availableDistricts = form.city ? districts[form.city] || [] : [];
  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (parseInt(form.captchaAnswer) !== captcha.answer) {
      setErrorMsg('Guvenlik sorusu yanlis. Lutfen tekrar deneyin.');
      refreshCaptcha();
      update('captchaAnswer', '');
      return;
    }

    setState('loading');

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          captchaAnswer: parseInt(form.captchaAnswer),
          captchaExpected: captcha.answer,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Bir hata olustu.');
      setState('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Bir hata olustu.');
      setState('error');
      refreshCaptcha();
      update('captchaAnswer', '');
    }
  };

  if (state === 'success') {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-20 h-20 bg-emerald-500/15 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Bildiriminiz Alindi!</h3>
        <p className="text-zinc-400 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
          Engel bildiriminiz basariyla kaydedildi. Dogrulama surecinden sonra haritada gorunecektir.
        </p>
        <button
          onClick={() => {
            setState('idle');
            setForm({ siteName: '', address: '', city: '', district: '', obstacleType: '', description: '', captchaAnswer: '' });
            refreshCaptcha();
          }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25"
        >
          Yeni Bildirim Yap
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Auth status */}
      {user ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-emerald-400">{user.name} olarak bildirilecek</div>
            <div className="text-xs text-zinc-500">{user.email}</div>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-800/40 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-sm text-zinc-400">Anonim olarak bildirilecek</span>
          </div>
          <Link href="/giris" className="text-xs text-amber-500 hover:text-amber-400 font-medium transition-colors whitespace-nowrap">
            Giris Yap
          </Link>
        </div>
      )}

      {/* Site Name + Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Mekan / Site Adi *</label>
          <input type="text" required value={form.siteName} onChange={e => update('siteName', e.target.value)}
            placeholder="Or: Greenwood Apartments" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Adres</label>
          <input type="text" value={form.address} onChange={e => update('address', e.target.value)}
            placeholder="Cadde, Sokak, No..." className={inputClass} />
        </div>
      </div>

      {/* City & District */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Il *</label>
          <select required value={form.city} onChange={e => { update('city', e.target.value); update('district', ''); }}
            className={`${inputClass} appearance-none`}>
            <option value="">Il Seciniz</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Ilce *</label>
          <select required value={form.district} onChange={e => update('district', e.target.value)}
            className={`${inputClass} appearance-none`} disabled={!form.city}>
            <option value="">Ilce Seciniz</option>
            {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Obstacle Type */}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Engel Turu *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {(Object.entries(OBSTACLE_CONFIG) as [ObstacleType, typeof OBSTACLE_CONFIG[ObstacleType]][]).map(([type, cfg]) => {
            const selected = form.obstacleType === type;
            return (
              <label
                key={type}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selected
                    ? 'bg-amber-500/[0.06] border-amber-500/40'
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
                }`}
              >
                <input type="radio" name="obstacleType" value={type} checked={selected}
                  onChange={() => update('obstacleType', type)} className="sr-only" required />
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 transition-all ${
                  selected ? 'bg-amber-500/20' : 'bg-zinc-800'
                }`}>
                  {cfg.icon}
                </div>
                <div className="min-w-0">
                  <div className={`text-sm font-medium truncate ${selected ? 'text-amber-400' : 'text-zinc-200'}`}>{cfg.label}</div>
                  <div className="text-[11px] text-zinc-500 truncate">{cfg.description}</div>
                </div>
                {selected && (
                  <div className="ml-auto shrink-0">
                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-zinc-950" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Ek Aciklama</label>
        <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3}
          placeholder="Yasadiginiz engeli kisaca anlatin..." className={`${inputClass} resize-none`} />
      </div>

      {/* Captcha */}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Guvenlik Sorusu *</label>
        <div className="flex items-center gap-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 font-mono text-lg text-amber-400 select-none tracking-wider">
            {captcha.question}
          </div>
          <input type="number" required value={form.captchaAnswer} onChange={e => update('captchaAnswer', e.target.value)}
            placeholder="?" className={`w-20 text-center ${inputClass}`} />
          <button type="button" onClick={refreshCaptcha}
            className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-amber-500 transition-all shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 animate-slide-in-up">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <span className="text-red-400 text-sm">{errorMsg}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={state === 'loading'}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-zinc-700 disabled:to-zinc-700 text-zinc-950 disabled:text-zinc-400 font-bold py-4 rounded-2xl text-base transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 disabled:shadow-none flex items-center justify-center gap-2"
      >
        {state === 'loading' ? (
          <>
            <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
            Gonderiliyor...
          </>
        ) : (
          <>
            Bildirimi Gonder
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>

      <p className="text-[11px] text-zinc-600 text-center">
        {user
          ? `${user.email} adresiyle bildirilecek. Dogrulama surecinden sonra haritada gorunecektir.`
          : 'Bildirimleriniz anonim olarak kaydedilir ve dogrulama surecinden gecer.'
        }
      </p>
    </form>
  );
}
