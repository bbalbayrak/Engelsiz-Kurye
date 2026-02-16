'use client';

import Link from 'next/link';
import Accordion from '@/components/ui/Accordion';
import { faqs, downloadableResources, petitionExamples } from '@/lib/data';
import EditableSection from '@/components/admin/EditableSection';
import { useSections } from '@/components/providers/SectionsProvider';

export default function LegalGuidePage() {
  const { sections } = useSections();

  const legData = sections.legal_legislation?.content as { title?: string; icon?: string; cards?: { tag: string; tagColor: string; title: string; desc: string }[] } | undefined;

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-zinc-600 mb-6">
          <Link href="/" className="hover:text-zinc-400 transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-zinc-400">Hukuki Rehber</span>
        </div>

        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Hukuki Rehber & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Kampanya Materyalleri</span>
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
            Kurye haklariyla ilgili yasal bilgilere erisin, kisitlamalari nasil raporlayacaginizi ogrenin ve kampanyayi desteklemek icin kaynaklari indirin.
          </p>
        </div>

        <EditableSection sectionKey="legal_faq">
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center"><span className="text-lg">⚖️</span></div>
              <h2 className="text-xl font-bold text-white">Sikca Sorulan Sorular</h2>
            </div>
            <Accordion items={faqs} />
          </section>
        </EditableSection>

        <EditableSection sectionKey="legal_legislation">
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center"><span className="text-lg">{legData?.icon || '📜'}</span></div>
              <h2 className="text-xl font-bold text-white">{legData?.title || 'Mevzuat Ozeti'}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(legData?.cards || []).map((card, i) => (
                <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md mb-3"
                    style={{ background: `${card.tagColor}15`, color: card.tagColor, border: `1px solid ${card.tagColor}30` }}>
                    {card.tag}
                  </span>
                  <h3 className="font-semibold text-white text-sm mb-2">{card.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </EditableSection>

        <EditableSection sectionKey="legal_petitions">
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center"><span className="text-lg">📝</span></div>
                <h2 className="text-xl font-bold text-white">Dilekce Ornekleri</h2>
              </div>
              <span className="text-xs text-zinc-600">{petitionExamples.length} sablon</span>
            </div>
            <div className="space-y-3">
              {petitionExamples.map((petition, i) => (
                <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 hover:border-zinc-700 transition-colors">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0"><span className="text-lg">📄</span></div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-sm">{petition.title}</h3>
                      <p className="text-zinc-500 text-xs mt-0.5 truncate">{petition.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-13 md:pl-0 shrink-0">
                    {petition.formats.map(fmt => (
                      <button key={fmt} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${fmt === 'PDF' ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/20' : 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/20'}`}>{fmt}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </EditableSection>

        <EditableSection sectionKey="legal_downloads">
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center"><span className="text-lg">📥</span></div>
              <h2 className="text-xl font-bold text-white">Indirilebilir Kaynaklar</h2>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="hidden md:grid grid-cols-4 gap-4 px-5 py-3 bg-zinc-800/30 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                <span className="col-span-2">Kaynak</span><span>Tur / Boyut</span><span className="text-right">Islem</span>
              </div>
              {downloadableResources.map((res, i) => (
                <div key={i} className={`flex flex-col md:grid md:grid-cols-4 gap-2 md:gap-4 px-5 py-4 md:items-center ${i < downloadableResources.length - 1 ? 'border-b border-zinc-800/60' : ''}`}>
                  <span className="text-white text-sm font-medium col-span-2">{res.title}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${res.type === 'PDF' ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'}`}>{res.type}</span>
                    <span className="text-zinc-600 text-xs">{res.size}</span>
                  </div>
                  <div className="md:text-right"><button className="text-amber-500 hover:text-amber-400 text-sm font-medium transition-colors">Indir →</button></div>
                </div>
              ))}
            </div>
          </section>
        </EditableSection>
      </div>
    </div>
  );
}
