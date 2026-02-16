import ReportForm from '@/components/forms/ReportForm';
import Link from 'next/link';

export const metadata = {
  title: 'Engel Bildir',
  description: 'Karsilastiginiz teslimat engellerini bildirin ve haritada gorunur kilin.',
};

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 mb-6">
          <Link href="/" className="hover:text-zinc-400 transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-zinc-400">Engel Bildir</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Engel Bildir</h1>
            </div>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
            Teslimat sirasinda karsilastiginiz engelleri bildirin. Bildirimleriniz dogrulama
            surecinden sonra haritada gorunur hale gelecektir.
          </p>
        </div>

        {/* Info banner */}
        <div className="bg-amber-500/[0.06] border border-amber-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-amber-400 text-sm font-medium">Anonim Bildirim</p>
            <p className="text-zinc-500 text-xs mt-0.5">Kisisel bilgileriniz kaydedilmez. Tum bildirimler anonim olarak islenir.</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 md:p-8">
          <ReportForm />
        </div>
      </div>
    </div>
  );
}
