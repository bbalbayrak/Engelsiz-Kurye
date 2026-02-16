import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-white">Engelsiz Teslimat</span>
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
                { href: '/hukuki-rehber', label: 'Hukuki Rehber' },
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

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Yasal</h4>
            <nav className="flex flex-col gap-2.5">
              <span className="text-zinc-500 text-sm">Kullanım Şartları</span>
              <span className="text-zinc-500 text-sm">Gizlilik Politikası</span>
              <span className="text-zinc-500 text-sm">Yönetim</span>
            </nav>
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
