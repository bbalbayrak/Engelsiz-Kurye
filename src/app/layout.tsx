import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { SectionsProvider } from '@/components/providers/SectionsProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#09090b',
};

export const metadata: Metadata = {
  title: {
    default: 'Engelsiz Teslimat - Kurye Hakları Kampanyası',
    template: '%s | Engelsiz Teslimat',
  },
  description:
    'Kuryelerin karşılaştığı site ve konum kısıtlamalarını haritada raporlayın, hukuki rehberlere erişin ve farkındalık kampanyasına katılın.',
  keywords: ['kurye hakları', 'engelsiz teslimat', 'site girişi', 'teslimat engeli'],
  icons: {
    icon: '/EngelsizKuryeLogoNew.png',
  },
  openGraph: {
    title: 'Engelsiz Teslimat',
    description: 'Biz Şehri Taşıyoruz. Yolumuzu Kesmeyin.',
    type: 'website',
    locale: 'tr_TR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-theme="dark">
      <body className="antialiased bg-zinc-950 text-zinc-100">
        <ThemeProvider>
          <AuthProvider>
            <SectionsProvider>
              <Header />
              <main className="pt-16 min-h-screen">{children}</main>
              <Footer />
            </SectionsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
