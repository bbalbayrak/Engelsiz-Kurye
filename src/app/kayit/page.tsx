'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'courier' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, user } = useAuth();
  const router = useRouter();

  // If already logged in, redirect
  if (user) {
    router.push('/');
    return null;
  }

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    if (form.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);

    const result = await register(form.name, form.email, form.password, form.role);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-0">
            <img src="/EngelsizKuryeLogoNew.png" alt="Engelsiz Kurye" className="h-24 w-auto -mr-1" />
            <span className="font-bold text-xl text-white">Engelsiz Kurye</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8">
          <h1 className="text-2xl font-bold text-white mb-1">Kayıt Ol</h1>
          <p className="text-zinc-500 text-sm mb-6">Hesap oluşturun ve engelleri bildirmeye başlayın.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Ad Soyad</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => update('name', e.target.value)}
                placeholder="Adınız Soyadınız"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">E-posta</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder="örnek@email.com"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Hesap Türü</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'courier', label: 'Kurye', icon: '🏍️', desc: 'Engelleri bildirin' },
                  { value: 'supporter', label: 'Destekçi', icon: '🤝', desc: 'Kampanyaya destek' },
                ].map(opt => (
                  <label
                    key={opt.value}
                    className={`flex flex-col items-center gap-1.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      form.role === opt.value
                        ? 'border-amber-500/40 bg-amber-500/[0.06]'
                        : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
                    }`}
                  >
                    <input type="radio" name="role" value={opt.value} checked={form.role === opt.value}
                      onChange={() => update('role', opt.value)} className="sr-only" />
                    <span className="text-xl">{opt.icon}</span>
                    <span className={`text-sm font-medium ${form.role === opt.value ? 'text-amber-400' : 'text-zinc-300'}`}>{opt.label}</span>
                    <span className="text-[10px] text-zinc-600">{opt.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Şifre</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => update('password', e.target.value)}
                placeholder="En az 6 karakter"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Şifre Tekrar</label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={e => update('confirmPassword', e.target.value)}
                placeholder="Şifrenizi tekrar girin"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-zinc-700 disabled:to-zinc-700 text-zinc-950 disabled:text-zinc-400 font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                  Kayıt yapılıyor...
                </>
              ) : (
                'Kayıt Ol'
              )}
            </button>
          </form>

          <p className="text-[11px] text-zinc-600 text-center mt-4 leading-relaxed">
            Kayıt olarak{' '}
            <span className="text-zinc-500">Kullanım Şartlarını</span> ve{' '}
            <span className="text-zinc-500">Gizlilik Politikasını</span> kabul etmiş olursunuz.
          </p>
        </div>

        {/* Login link */}
        <p className="text-center text-zinc-500 text-sm mt-6">
          Zaten hesabınız var mı?{' '}
          <Link href="/giris" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
