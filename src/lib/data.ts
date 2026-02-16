import { ObstacleReport, FAQ, DownloadableResource, CampaignMaterial } from '@/types';

export const mockReports: ObstacleReport[] = [
  {
    id: '1', siteName: 'Greenwood Apartments', address: 'Bağdat Cad. No:120',
    city: 'İstanbul', district: 'Kadıköy', latitude: 40.9862, longitude: 29.0258,
    obstacleType: 'entry_denied', description: 'Güvenlik görevlisi tarafından site girişi engellendi. Kapıda beklettiriyorlar, müşteri aşağı inmek zorunda kalıyor.',
    reportedAt: '2024-12-15', verified: true, reportCount: 23,
  },
  {
    id: '2', siteName: 'Maslak 1453', address: 'Maslak Mah. Büyükdere Cad.',
    city: 'İstanbul', district: 'Sarıyer', latitude: 41.1086, longitude: 29.0202,
    obstacleType: 'freight_elevator_only', description: 'Sadece yük asansörü kullanmamıza izin veriliyor, bekleme süresi 15-20 dakika.',
    reportedAt: '2024-12-18', verified: true, reportCount: 45,
  },
  {
    id: '3', siteName: 'Batışehir Konutları', address: 'Başak Mah. 5. Etap',
    city: 'İstanbul', district: 'Başakşehir', latitude: 41.0942, longitude: 28.7997,
    obstacleType: 'helmet_removal', description: 'Güvenlik, kask çıkarmadan girişe izin vermiyor. İş güvenliği ihlali.',
    reportedAt: '2024-12-20', verified: true, reportCount: 12,
  },
  {
    id: '4', siteName: 'Ataşehir Residence', address: 'Atatürk Mah. Alemdağ Cad.',
    city: 'İstanbul', district: 'Ataşehir', latitude: 40.9923, longitude: 29.1244,
    obstacleType: 'service_door_only', description: 'Ana girişten geçmemize izin verilmiyor, arka kapıya yönlendiriliyoruz.',
    reportedAt: '2024-12-22', verified: true, reportCount: 18,
  },
  {
    id: '5', siteName: 'Nişantaşı City\'s', address: 'Teşvikiye Cad. No:88',
    city: 'İstanbul', district: 'Şişli', latitude: 41.0491, longitude: 28.9933,
    obstacleType: 'parking_restriction', description: 'AVM çevresinde motor park yasağı uygulanıyor. En yakın park 500m uzakta.',
    reportedAt: '2024-12-25', verified: true, reportCount: 31,
  },
  {
    id: '6', siteName: 'Koru Florya Rezidans', address: 'Florya Sahil Yolu',
    city: 'İstanbul', district: 'Bakırköy', latitude: 40.9769, longitude: 28.7868,
    obstacleType: 'entry_denied', description: 'Motorlu kuryelerin siteye girişi tamamen yasaklanmış.',
    reportedAt: '2024-12-28', verified: true, reportCount: 8,
  },
  {
    id: '7', siteName: 'Ankara Park Evleri', address: 'Çankaya Mah. Park Sok.',
    city: 'Ankara', district: 'Çankaya', latitude: 39.8683, longitude: 32.7487,
    obstacleType: 'freight_elevator_only', description: 'Yük asansörü çok yavaş, teslimat süreleri uzuyor.',
    reportedAt: '2025-01-02', verified: true, reportCount: 15,
  },
  {
    id: '8', siteName: 'İzmir Bayraklı Tower', address: 'Bayraklı İş Merkezi',
    city: 'İzmir', district: 'Bayraklı', latitude: 38.4574, longitude: 27.1576,
    obstacleType: 'entry_denied', description: 'Kuryelerin binaya girişi güvenlik tarafından engelleniyor.',
    reportedAt: '2025-01-05', verified: true, reportCount: 19,
  },
  {
    id: '9', siteName: 'Bostanlı Sitesi', address: 'Bostanlı Mah. Cemal Gürsel Cad.',
    city: 'İzmir', district: 'Karşıyaka', latitude: 38.4547, longitude: 27.0989,
    obstacleType: 'service_door_only', description: 'Site yönetimi servis kapısı kullanımını zorunlu tutuyor.',
    reportedAt: '2025-01-08', verified: true, reportCount: 7,
  },
  {
    id: '10', siteName: 'Bursa Nilüfer Park', address: 'Nilüfer Mah. Barış Sok.',
    city: 'Bursa', district: 'Nilüfer', latitude: 40.2213, longitude: 28.8716,
    obstacleType: 'parking_restriction', description: 'Kurye araçları için hiçbir park alanı yok.',
    reportedAt: '2025-01-10', verified: false, reportCount: 4,
  },
  {
    id: '11', siteName: 'Selenium Twins', address: 'Barbaros Mah.',
    city: 'İstanbul', district: 'Ataşehir', latitude: 40.9956, longitude: 29.1187,
    obstacleType: 'entry_denied', description: 'Lobby girişi yasaklanıyor, dışarıda beklettiriliyor.',
    reportedAt: '2025-01-12', verified: true, reportCount: 27,
  },
  {
    id: '12', siteName: 'Varyap Meridian', address: 'Küçükbakkalköy Mah.',
    city: 'İstanbul', district: 'Ataşehir', latitude: 40.9931, longitude: 29.1156,
    obstacleType: 'helmet_removal', description: 'Güvenlik kask çıkarmayı zorunlu tutuyor.',
    reportedAt: '2025-01-13', verified: true, reportCount: 9,
  },
  {
    id: '13', siteName: 'Palladium AVM', address: 'Atatürk Mah.',
    city: 'İstanbul', district: 'Ataşehir', latitude: 40.9918, longitude: 29.1201,
    obstacleType: 'parking_restriction', description: 'AVM otopark girişi kuryeler için yasak.',
    reportedAt: '2025-01-14', verified: true, reportCount: 38,
  },
  {
    id: '14', siteName: 'Dumankaya İkon', address: 'İçerenköy Mah.',
    city: 'İstanbul', district: 'Ataşehir', latitude: 40.9975, longitude: 29.1132,
    obstacleType: 'freight_elevator_only', description: 'Yük asansörü zorunlu, 3. kata yürümek zorunda kalıyoruz.',
    reportedAt: '2025-01-15', verified: true, reportCount: 14,
  },
  {
    id: '15', siteName: 'Ağaoğlu My World', address: 'Kayışdağı Mah.',
    city: 'İstanbul', district: 'Ataşehir', latitude: 40.9989, longitude: 29.1098,
    obstacleType: 'service_door_only', description: 'Servis kapısı uzakta, zaman kaybı yaşanıyor.',
    reportedAt: '2025-01-16', verified: true, reportCount: 11,
  },
  {
    id: '16', siteName: 'Levent Loft', address: 'Levent Mah. Cömert Sok.',
    city: 'İstanbul', district: 'Beşiktaş', latitude: 41.0815, longitude: 29.0107,
    obstacleType: 'entry_denied', description: 'Bina güvenliği hiçbir kuryeyi içeri almıyor.',
    reportedAt: '2025-01-18', verified: true, reportCount: 33,
  },
  {
    id: '17', siteName: 'Antalya Migros AVM', address: 'Fener Mah. Tekelioğlu Cad.',
    city: 'Antalya', district: 'Muratpaşa', latitude: 36.8583, longitude: 30.7133,
    obstacleType: 'parking_restriction', description: 'Motor park alanı kaldırılmış.',
    reportedAt: '2025-01-20', verified: true, reportCount: 16,
  },
  {
    id: '18', siteName: 'Konya Selçuklu Konutları', address: 'Selçuklu Mah.',
    city: 'Konya', district: 'Selçuklu', latitude: 37.8713, longitude: 32.4846,
    obstacleType: 'entry_denied', description: 'Kapıda kimlik bırakma zorunluluğu.',
    reportedAt: '2025-01-22', verified: false, reportCount: 5,
  },
];

export const faqs: FAQ[] = [
  {
    question: 'Site girişi konusunda yasal haklarım nelerdir?',
    answer: 'Türk Medeni Kanunu ve Kat Mülkiyeti Kanunu\'na göre, kuryelerin teslimat amacıyla sitelere girme hakları bulunmaktadır. Site yönetimleri, güvenlik gerekçesiyle makul düzenlemeler yapabilir ancak tamamen giriş yasağı koyamaz. Ayrıca Tüketici Koruma Kanunu kapsamında, alıcının sipariş ettiği ürünün teslimat adresine ulaştırılması yasal bir yükümlülüktür.',
  },
  {
    question: 'Engel bildirimi nasıl yapılır?',
    answer: 'Ana sayfadaki harita üzerindeki "Hemen Engel Bildir" butonuna tıklayarak veya menüden "Engel Bildir" sekmesine giderek bildirim yapabilirsiniz. Site adı, konum ve karşılaştığınız engel türünü seçmeniz yeterlidir. Bildirimleriniz anonim olarak kaydedilir.',
  },
  {
    question: 'Apartman yönetimi kuryelere nasıl kısıtlama koyabilir?',
    answer: 'Apartman yönetimleri yalnızca makul güvenlik önlemleri alabilir (kimlik kontrolü, ziyaretçi defteri gibi). Ancak kuryelerin binaya girişini tamamen yasaklamak veya ayrımcı uygulamalar (yük asansörü zorunluluğu gibi) yasal değildir.',
  },
  {
    question: 'Güvenli olmayan teslimatı reddettiğim için ceza alabilir miyim?',
    answer: 'Hayır, iş güvenliği mevzuatına göre güvenli olmayan koşullarda çalışmayı reddetme hakkınız vardır. Kask çıkarma dayatması gibi güvenliğinizi tehlikeye atan talepleri reddetmeniz yasal hakkınızdır.',
  },
  {
    question: 'Asansör kullanımı konusunda haklarım nelerdir?',
    answer: 'Tüm bina sakinleri ve meşru ziyaretçiler gibi, kuryeler de asansör kullanma hakkına sahiptir. Yalnızca yük asansörünü kullanmaya zorlanmanız ayrımcılık teşkil edebilir. Bu durumu bildirmenizi öneririz.',
  },
  {
    question: '"Dilekçe" şablonu ne için kullanılır?',
    answer: 'Dilekçe şablonları, karşılaştığınız engelleri resmi makamlara veya site yönetimlerine yazılı olarak bildirmeniz için hazırlanmıştır. Bu şablonları indirip kendi bilgilerinizle doldurarak ilgili makamlara iletebilirsiniz.',
  },
];

export const downloadableResources: DownloadableResource[] = [
  { title: 'Kurye Hakları El Kitabı', type: 'PDF', size: '2.4 MB', url: '#' },
  { title: 'Mevzuat Özeti', type: 'PDF', size: '1.1 MB', url: '#' },
  { title: 'Dilekçe Şablonu (3 Sayfa)', type: 'DOCX', size: '340 KB', url: '#' },
];

export const petitionExamples = [
  {
    title: 'Site Yönetimine İtiraz Dilekçesi',
    description: 'Kuryelerin site girişini kısıtlayan yönetim kararlarına itiraz için.',
    formats: ['PDF', 'DOCX'] as const,
  },
  {
    title: 'CİMER Şikayet Dilekçesi',
    description: 'Kamu kurumlarına yapılan şikayetler için standart dilekçe şablonu.',
    formats: ['PDF', 'DOCX'] as const,
  },
  {
    title: 'Apartman Genel Kurul İptal Davası Dilekçesi',
    description: 'Yasalara aykırı apartman kararlarının iptal edilmesi için dava dilekçesi.',
    formats: ['PDF', 'DOCX'] as const,
  },
];

export const campaignMaterials: CampaignMaterial[] = [
  { title: 'Farkındalık Posteri A3', category: 'Poster', color: 'from-amber-600 to-orange-700' },
  { title: 'Doküman Posteri A3', category: 'Poster', color: 'from-blue-600 to-indigo-700' },
  { title: 'Instagram Hikaye', category: 'Sosyal Medya', color: 'from-pink-600 to-rose-700' },
  { title: 'Haklar İnfografiği', category: 'İnfografik', color: 'from-emerald-600 to-teal-700' },
  { title: 'Twitter/X Paylaşım', category: 'Sosyal Medya', color: 'from-violet-600 to-purple-700' },
  { title: 'WhatsApp Sticker Pack', category: 'Sticker', color: 'from-green-600 to-emerald-700' },
];

export const cities = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya',
  'Gaziantep', 'Mersin', 'Kayseri', 'Eskişehir', 'Trabzon', 'Samsun',
  'Denizli', 'Sakarya', 'Diyarbakır', 'Malatya',
];

export const districts: Record<string, string[]> = {
  'İstanbul': ['Kadıköy', 'Ataşehir', 'Üsküdar', 'Beşiktaş', 'Şişli', 'Bakırköy', 'Sarıyer', 'Başakşehir', 'Maltepe', 'Kartal', 'Beylikdüzü', 'Esenyurt', 'Pendik', 'Fatih', 'Beyoğlu'],
  'Ankara': ['Çankaya', 'Keçiören', 'Mamak', 'Yenimahalle', 'Etimesgut', 'Sincan', 'Altındağ', 'Pursaklar'],
  'İzmir': ['Konak', 'Karşıyaka', 'Bornova', 'Bayraklı', 'Buca', 'Çiğli', 'Gaziemir', 'Balçova'],
  'Bursa': ['Osmangazi', 'Nilüfer', 'Yıldırım', 'Mudanya', 'Gürsu'],
  'Antalya': ['Muratpaşa', 'Konyaaltı', 'Kepez', 'Alanya', 'Manavgat'],
  'Adana': ['Seyhan', 'Çukurova', 'Yüreğir', 'Sarıçam'],
  'Konya': ['Selçuklu', 'Meram', 'Karatay'],
  'Gaziantep': ['Şahinbey', 'Şehitkamil'],
};
