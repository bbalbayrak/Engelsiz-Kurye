'use client';

import Link from 'next/link';
import Accordion from '@/components/ui/Accordion';
import { faqs, downloadableResources, campaignMaterials } from '@/lib/data';
import EditableSection from '@/components/admin/EditableSection';
import { useSections } from '@/components/providers/SectionsProvider';

export default function ResourcesPage() {
  const { sections } = useSections();

  const faqData = sections.resources_faq?.content as { title?: string; subtitle?: string } | undefined;
  const mediaData = sections.resources_media?.content as { title?: string; videoTitle?: string; videoDuration?: string } | undefined;
  const ctaData = sections.resources_cta?.content as { title?: string; description?: string } | undefined;

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-zinc-600 mb-6">
          <Link href="/" className="hover:text-zinc-400 transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-zinc-400">Kaynaklar</span>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Hukuki Rehber & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Kampanya Materyalleri</span>
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
            Kurye haklariyla ilgili yasal bilgilere erisin, kisitlamalari raporlayin ve kampanyayi desteklemek icin materyalleri indirin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-12">
            <EditableSection sectionKey="resources_faq">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center"><span className="text-lg">⚖️</span></div>
                  <h2 className="text-lg font-bold text-white">{faqData?.title || 'Kurye Haklari SSS'}</h2>
                </div>
                <p className="text-zinc-500 text-sm mb-5 leading-relaxed">{faqData?.subtitle || ''}</p>
                <Accordion items={faqs.slice(0, 4)} />
              </section>
            </EditableSection>

            <EditableSection sectionKey="resources_downloads">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center"><span className="text-lg">📥</span></div>
                  <h2 className="text-lg font-bold text-white">Indirilebilir Kaynaklar</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="hidden md:grid grid-cols-3 gap-4 px-5 py-3 bg-zinc-800/30 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                    <span>Kaynak Adi</span><span>Tur / Boyut</span><span className="text-right">Islem</span>
                  </div>
                  {downloadableResources.map((res, i) => (
                    <div key={i} className={`flex flex-col md:grid md:grid-cols-3 gap-2 md:gap-4 px-5 py-4 md:items-center ${i < downloadableResources.length - 1 ? 'border-b border-zinc-800/60' : ''}`}>
                      <span className="text-white text-sm font-medium">{res.title}</span>
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

          <div className="lg:col-span-2 space-y-8">
            <EditableSection sectionKey="resources_media">
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center"><span className="text-lg">🎬</span></div>
                  <h2 className="text-lg font-bold text-white">{mediaData?.title || 'Kampanya Medya'}</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden group cursor-pointer hover:border-zinc-700 transition-colors">
                  <div className="aspect-video bg-gradient-to-br from-zinc-800/80 to-zinc-900 flex items-center justify-center relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-white font-medium text-sm">{mediaData?.videoTitle || ''}</p>
                    <p className="text-zinc-600 text-xs mt-0.5">{mediaData?.videoDuration || ''}</p>
                  </div>
                </div>
              </section>
            </EditableSection>

            <EditableSection sectionKey="resources_materials">
              <section>
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Poster & Grafikler</h3>
                <div className="grid grid-cols-2 gap-3">
                  {campaignMaterials.map((mat, i) => (
                    <div key={i} className="group bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all cursor-pointer">
                      <div className={`aspect-[3/4] bg-gradient-to-br ${mat.color} flex items-center justify-center relative`}>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <span className="text-3xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all relative z-10">
                          {['📱', '🖼️', '📋', '🎨', '🐦', '💬'][i] || '📁'}
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="text-white text-xs font-medium truncate">{mat.title}</p>
                        <p className="text-zinc-600 text-[10px] mt-0.5">{mat.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </EditableSection>

            <EditableSection sectionKey="resources_cta">
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/5 border border-amber-500/15 rounded-2xl p-6 text-center">
                <h3 className="text-base font-bold text-white mb-2">{ctaData?.title || 'Kampanyaya Katilin'}</h3>
                <p className="text-zinc-500 text-xs mb-5 leading-relaxed">{ctaData?.description || ''}</p>
                <Link href="/engel-bildir" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35">
                  Hemen Engel Bildir
                </Link>
              </div>
            </EditableSection>
          </div>
        </div>
      </div>
    </div>
  );
}
