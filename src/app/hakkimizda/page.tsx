'use client';

import Link from 'next/link';
import EditableSection from '@/components/admin/EditableSection';
import { useSections } from '@/components/providers/SectionsProvider';

export default function AboutPage() {
  const { sections } = useSections();

  const hero = sections.about_hero?.content as {
    badge?: string; title?: string; highlight?: string;
    paragraphs?: string[]; paragraph1?: string; paragraph2?: string; paragraph3?: string;
  } | undefined;
  const pillarsData = sections.about_pillars?.content as { title?: string; subtitle?: string; items?: { icon: string; title: string; desc: string; color: string }[] } | undefined;
  const timelineData = sections.about_timeline?.content as { title?: string; events?: { date: string; title: string; desc: string }[] } | undefined;
  const videoData = sections.about_video?.content as { title?: string; subtitle?: string; videoTitle?: string; videoDuration?: string } | undefined;
  const ctaData = sections.about_cta?.content as { title?: string; description?: string } | undefined;
  const contactData = sections.about_contact?.content as { title?: string; email?: string; phone?: string } | undefined;

  // Support both new `paragraphs` array and legacy paragraph1/paragraph2/paragraph3 fields
  const heroParagraphs: string[] = hero?.paragraphs?.length
    ? hero.paragraphs
    : [hero?.paragraph1, hero?.paragraph2, hero?.paragraph3].filter((p): p is string => Boolean(p));

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* ── Hero / Manifesto ── */}
      <EditableSection sectionKey="about_hero">
        <section className="relative py-20 md:py-28 px-4 sm:px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.07] via-transparent to-orange-600/[0.04]" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="relative max-w-4xl mx-auto">
            <span className="inline-block text-[11px] font-semibold text-amber-500 uppercase tracking-[0.2em] mb-5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
              {hero?.badge || 'Manifesto'}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1]">
              {hero?.title || 'Biz Şehri Taşıyoruz.'}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                {hero?.highlight || 'Yolumuzu Kesmeyin.'}
              </span>
            </h1>
            <div className="max-w-2xl space-y-5 mb-10 overflow-hidden">
              {heroParagraphs.map((p, i) => (
                <p
                  key={i}
                  className={`leading-relaxed break-words ${i === 0 ? 'text-lg text-zinc-300' : 'text-base text-zinc-400'}`}
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      </EditableSection>

      {/* ── Core Pillars ── */}
      <EditableSection sectionKey="about_pillars">
        <section className="py-20 px-4 sm:px-6 bg-zinc-900/30 border-y border-zinc-800/40">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{pillarsData?.title || 'Temel İlkelerimiz'}</h2>
            <p className="text-zinc-500 mb-10 text-sm">{pillarsData?.subtitle || ''}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(pillarsData?.items || []).map((p, i) => (
                <div key={i} className={`bg-gradient-to-br ${p.color} border border-zinc-800 rounded-2xl p-6`}>
                  <div className="text-3xl mb-4">{p.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </EditableSection>

      {/* ── Timeline ── */}
      <EditableSection sectionKey="about_timeline">
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">{timelineData?.title || 'Yol Haritası'}</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-800" />
              <div className="space-y-10">
                {(timelineData?.events || []).map((event, i) => (
                  <div key={i} className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 rounded-full bg-zinc-900 border-2 border-amber-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                    </div>
                    <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider">{event.date}</span>
                    <h3 className="font-bold text-white mt-1">{event.title}</h3>
                    <p className="text-zinc-500 text-sm mt-1">{event.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </EditableSection>

      {/* ── Video Section ── */}
      <EditableSection sectionKey="about_video">
        <section className="py-20 px-4 sm:px-6 bg-zinc-900/30 border-y border-zinc-800/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{videoData?.title || 'Hikayemizi İzleyin'}</h2>
            <p className="text-zinc-500 mb-8 text-sm">{videoData?.subtitle || ''}</p>
            <div className="relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/80 to-zinc-900 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-zinc-400 text-sm font-medium">{videoData?.videoTitle || ''}</p>
                <p className="text-zinc-600 text-xs mt-0.5">{videoData?.videoDuration || ''}</p>
              </div>
            </div>
          </div>
        </section>
      </EditableSection>

      {/* ── Contact ── */}
      <EditableSection sectionKey="about_contact">
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">{contactData?.title || 'İletişim'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">E-posta</p>
                <p className="text-zinc-300 text-sm break-all">{contactData?.email || 'info@engelsizkurye.com'}</p>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Telefon</p>
                <p className="text-zinc-300 text-sm">{contactData?.phone || '+90 212 000 00 00'}</p>
              </div>
            </div>
          </div>
        </section>
      </EditableSection>

      {/* ── CTA ── */}
      <EditableSection sectionKey="about_cta">
        <section className="py-20 px-4 sm:px-6 bg-zinc-900/30 border-t border-zinc-800/40">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{ctaData?.title || 'Kampanyaya Katılın'}</h2>
            <p className="text-zinc-400 mb-8 text-sm leading-relaxed">{ctaData?.description || ''}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/engel-bildir" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold px-8 py-3.5 rounded-full text-sm transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" /></span>
                Engel Bildir
              </Link>
              <Link href="/kaynaklar" className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-8 py-3.5 rounded-full text-sm transition-all border border-zinc-700">Materyalleri Gör</Link>
            </div>
          </div>
        </section>
      </EditableSection>
    </div>
  );
}
