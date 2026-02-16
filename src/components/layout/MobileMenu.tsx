'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  user: { id: string; name: string; email: string; role: string } | null;
  onLogout: () => void;
}

export default function MobileMenu({ isOpen, onClose, links, user, onLogout }: MobileMenuProps) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] border-l border-zinc-800 flex flex-col animate-slide-in-right shadow-2xl shadow-black/60" style={{ backgroundColor: '#09090b' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-zinc-800/60">
          <span className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Menu</span>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all"
            aria-label="Menüyü kapat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="px-4 py-3 border-b border-zinc-800/60">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-white truncate">{user.name}</div>
                <div className="text-xs text-zinc-500 truncate">{user.email}</div>
              </div>
            </div>
          </div>
        )}

        {/* Links */}
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                  isActive
                    ? 'text-amber-500 bg-amber-500/10'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth + CTA */}
        <div className="p-4 border-t border-zinc-800/60 space-y-3" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          {user ? (
            <div className="space-y-2">
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => { onLogout(); onClose(); }}
                className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-all"
              >
                Cikis Yap
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/giris"
                onClick={onClose}
                className="flex items-center justify-center py-3 rounded-xl text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-all"
              >
                Giris Yap
              </Link>
              <Link
                href="/kayit"
                onClick={onClose}
                className="flex items-center justify-center py-3 rounded-xl text-sm font-medium text-zinc-950 bg-zinc-100 hover:bg-white transition-all"
              >
                Kayit Ol
              </Link>
            </div>
          )}
          <Link
            href="/engel-bildir"
            onClick={onClose}
            className="flex items-center justify-center gap-2.5 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold py-4 rounded-2xl text-base transition-all active:scale-[0.98]"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            Hemen Engel Bildir
          </Link>
        </div>
      </div>
    </div>
  );
}
