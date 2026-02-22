'use client';

import Link from 'next/link';
import { useSections } from '@/components/providers/SectionsProvider';

export default function Footer() {
  const { sections } = useSections();
  const contact = sections.about_contact?.content as { email?: string; phone?: string } | undefined;
  const email = contact?.email || 'info@engelsizkurye.com';
  const phone = contact?.phone || '+90 212 000 00 00';

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-0 mb-4">
              <img src="/EngelsizKuryeLogoNew.png" alt="Engelsiz Kurye" className="h-[4.5rem] w-auto -mr-1" />
              <span className="font-bold text-white">Engelsiz Kurye</span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Kuryelerin karşılaştığı engelleri görünür kılarak eşit erişim hakkı için mücadele eden sivil toplum kampanyası.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Platform</h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: '/', label: 'Engel Haritası' },
                { href: '/engel-bildir', label: 'Engel Bildir' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="text-zinc-500 hover:text-amber-500 text-sm transition-colors">{l.label}</Link>
              ))}
            </nav>
          </div>

          {/* Kampanya */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Kampanya</h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: '/hakkimizda', label: 'Hakkımızda' },
                { href: '/kaynaklar', label: 'Materyaller' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="text-zinc-500 hover:text-amber-500 text-sm transition-colors">{l.label}</Link>
              ))}
            </nav>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">İletişim</h4>
            <div className="flex flex-col gap-2.5">
              <span className="text-zinc-500 text-sm">{email}</span>
              <span className="text-zinc-500 text-sm">{phone}</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800/60 py-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
          <p className="text-zinc-600 text-xs">
            &copy; 2025 Engelsiz Teslimat. Tüm hakları saklıdır.
          </p>
          <p className="text-zinc-700 text-xs">
            OpenStreetMap &middot; Leaflet.js ile yapılmıştır
          </p>
        </div>
      </div>
    </footer>
  );
}
