'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSections } from '@/components/providers/SectionsProvider';

interface EditableSectionProps {
  sectionKey: string;
  children: React.ReactNode;
}

export default function EditableSection({ sectionKey, children }: EditableSectionProps) {
  const { user } = useAuth();
  const { sections, updateSection } = useSections();
  const [toggling, setToggling] = useState(false);

  const isAdmin = user?.role === 'admin';
  const section = sections[sectionKey];

  // Not admin — just respect visibility
  if (!isAdmin) {
    if (section && !section.visible) return null;
    return <>{children}</>;
  }

  // Admin view
  const isHidden = section && !section.visible;

  const toggleVisibility = async () => {
    setToggling(true);
    await updateSection(sectionKey, { visible: !section?.visible });
    setToggling(false);
  };

  return (
    <div className={`relative group/admin ${isHidden ? 'opacity-30' : ''}`}>
      {/* Admin toolbar — always visible on mobile, hover on desktop */}
      <div className="absolute top-2 right-2 z-50 flex items-center gap-1.5 opacity-70 sm:opacity-0 group-hover/admin:opacity-100 transition-opacity duration-200">
        <button
          onClick={toggleVisibility}
          disabled={toggling}
          className={`flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-semibold shadow-lg transition-all ${
            isHidden
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200'
          }`}
        >
          {toggling ? (
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isHidden ? (
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          ) : (
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
          )}
          {isHidden ? 'Göster' : 'Gizle'}
        </button>
      </div>

      {/* Dashed border on hover for admin */}
      <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover/admin:border-amber-500/30 rounded-lg pointer-events-none transition-colors z-40" />

      {children}
    </div>
  );
}
