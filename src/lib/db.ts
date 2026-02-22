import { createClient, type Client } from "@libsql/client";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

let _client: Client | null = null;
let _initialized = false;

export function getClient(): Client {
  if (!_client) {
    _client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }
  return _client;
}

export async function getDb(): Promise<Client> {
  const client = getClient();
  if (!_initialized) {
    _initialized = true;
    await initTables(client);
    await seedAdmin(client);
    await seedSections(client);
    await migrateData(client);
  }
  return client;
}

async function initTables(client: Client) {
  await client.batch(
    [
      `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
      `CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
      `CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      user_email TEXT,
      site_name TEXT NOT NULL,
      address TEXT DEFAULT '',
      city TEXT NOT NULL,
      district TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      obstacle_type TEXT NOT NULL,
      description TEXT DEFAULT '',
      reported_at TEXT NOT NULL DEFAULT (datetime('now')),
      verified INTEGER NOT NULL DEFAULT 0,
      report_count INTEGER NOT NULL DEFAULT 1
    )`,
      `CREATE TABLE IF NOT EXISTS site_sections (
      key TEXT PRIMARY KEY,
      page TEXT NOT NULL,
      label TEXT NOT NULL,
      visible INTEGER NOT NULL DEFAULT 1,
      content TEXT NOT NULL DEFAULT '{}',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
      `CREATE INDEX IF NOT EXISTS idx_reports_city ON reports(city)`,
      `CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(obstacle_type)`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_sections_page ON site_sections(page)`,
    ],
    "write",
  );
}

async function seedAdmin(client: Client) {
  const res = await client.execute({
    sql: "SELECT id FROM users WHERE email = ?",
    args: ["admin@admin.com"],
  });
  if (res.rows.length > 0) return;
  const id = uuid();
  const hash = bcrypt.hashSync("123456", 10);
  await client.execute({
    sql: "INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
    args: [id, "Admin", "admin@admin.com", hash, "admin"],
  });
}

async function seedSections(client: Client) {
  const res = await client.execute("SELECT COUNT(*) as c FROM site_sections");
  const count = Number(res.rows[0].c);
  if (count > 0) return;

  const sections: [string, string, string, number, string][] = [
    [
      "home_campaign",
      "home",
      "Kampanya Bilgi Bölümü",
      1,
      JSON.stringify({
        badge: "Kampanya",
        title: "Biz Şehri Taşıyoruz.",
        highlight: "Yolumuzu Kesmeyin.",
        description:
          "Her gün binlerce kurye, site ve binalardaki haksız kısıtlamalarla karşılaşıyor. Bu platform, engelleri görünür kılarak eşit erişim hakkı mücadelesini destekliyor.",
        pillars: [
          {
            icon: "🚪",
            title: "Engelsiz Erişim",
            desc: "Her sitenin kapısı, her binanın asansörü kuryelere de açık olmalıdır. Eşit erişim temel bir haktır.",
          },
          {
            icon: "⚖️",
            title: "Hukuki Koruma",
            desc: "Yasal haklarınızı bilin, gerektiğinde dilekçe ve şikayet mekanizmalarını kullanın.",
          },
          {
            icon: "📢",
            title: "Kamuoyu Farkındalığı",
            desc: "Engelleri bildirin, kampanya materyallerini paylaşın, sesinizi duyurun.",
          },
        ],
      }),
    ],

    [
      "about_hero",
      "hakkimizda",
      "Hero / Manifesto",
      1,
      JSON.stringify({
        badge: "Manifesto",
        title: "Biz Şehri Taşıyoruz.",
        highlight: "Yolumuzu Kesmeyin.",
        paragraphs: [
          "Her gün milyonlarca paketle şehirlerin can damarlarını oluşturuyoruz. Yağmurda, karda, sıcakta kapınıza kadar geliyoruz. Ama birçok site, AVM ve bina bize kapılarını kapatıyor.",
          "Bizi arka kapılara, yük asansörlerine yönlendiriyorlar; hatta kaskımızı çıkarmamızı dayatıyorlar. Bu kampanya, kuryelerin karşılaştığı engelleri görünür kılmak, yasal haklar hakkında bilgilendirmek ve kamuoyunda farkındalık yaratmak için başlatılmıştır.",
        ],
      }),
    ],

    [
      "about_pillars",
      "hakkimizda",
      "Temel İlkeler",
      1,
      JSON.stringify({
        title: "Temel İlkelerimiz",
        subtitle:
          "Kuryelerin haklarını savunmak için üç temel ilke üzerine çalışıyoruz.",
        items: [
          {
            icon: "🚪",
            title: "Engelsiz Erişim",
            desc: "Kuryelerin, tüm bina ve sitelere eşit ve engelsiz erişim hakkı olduğunu savunuyoruz. Teslimat hizmeti, toplumun temel ihtiyaçlarından biridir.",
            color: "from-amber-500/20 to-amber-600/5",
          },
          {
            icon: "⚖️",
            title: "Hukuki Koruma",
            desc: "Mevcut yasalar kuryeleri koruyor. Bu hakların bilinmesi ve gerektiğinde kullanılması için rehberlik sağlıyoruz.",
            color: "from-blue-500/20 to-blue-600/5",
          },
          {
            icon: "📢",
            title: "Kamuoyu Farkındalığı",
            desc: "Yaşanan sorunları görünür kılarak toplumsal farkındalık oluşturuyoruz. Her bildirilen engel, değişim için bir adımdır.",
            color: "from-emerald-500/20 to-emerald-600/5",
          },
        ],
      }),
    ],

    [
      "about_timeline",
      "hakkimizda",
      "Yol Haritası",
      1,
      JSON.stringify({
        title: "Yol Haritası",
        events: [
          {
            date: "2024 Q3",
            title: "Kampanya Başlangıcı",
            desc: "İlk araştırma ve veri toplama süreci.",
          },
          {
            date: "2024 Q4",
            title: "Platform Lansmanı",
            desc: "Engel haritası ve bildirim sistemi yayında.",
          },
          {
            date: "2025 Q1",
            title: "500+ Bildirim",
            desc: "Türkiye genelinde 500’den fazla engel bildirimi alındı.",
          },
          {
            date: "2025 Q2",
            title: "Hukuki Eylem",
            desc: "İlk toplu dilekçe ve yasal başvuru süreçleri.",
          },
        ],
      }),
    ],

    [
      "about_video",
      "hakkimizda",
      "Video Bölümü",
      1,
      JSON.stringify({
        title: "Hikayemizi İzleyin",
        subtitle:
          "Kuryelerin günlük yaşadığı engelleri kendi gözlerinden dinleyin.",
        videoTitle: "Bölüm 1: Teslimatın Engelleri",
        videoDuration: "Süre: 04:32",
      }),
    ],

    [
      "about_cta",
      "hakkimizda",
      "Kampanyaya Katılın CTA",
      1,
      JSON.stringify({
        title: "Kampanyaya Katılın",
        description:
          "Siz de karşılaştığınız engelleri bildirerek veya kampanya materyallerini paylaşarak bu harekete destek olabilirsiniz.",
      }),
    ],

    [
      "about_contact",
      "hakkimizda",
      "İletişim",
      1,
      JSON.stringify({
        title: "İletişim",
        email: "info@engelsizkurye.com",
        phone: "+90 212 000 00 00",
      }),
    ],

    [
      "legal_faq",
      "hukuki-rehber",
      "Sıkça Sorulan Sorular",
      1,
      JSON.stringify({ title: "Sıkça Sorulan Sorular", icon: "⚖️" }),
    ],

    [
      "legal_legislation",
      "hukuki-rehber",
      "Mevzuat Özeti",
      1,
      JSON.stringify({
        title: "Mevzuat Özeti",
        icon: "📜",
        cards: [
          {
            tag: "İş Kanunu",
            tagColor: "#f59e0b",
            title: "İş ve Çalışma Hürriyetinin İhlali",
            desc: "Kurye, yasal bir meslek icra eden bireydir. Herhangi bir kişi veya kuruluşun, bir kuryeyi işini yapmaktan alıkoyması, çalışma özgürlüğünün ihlali anlamına gelebilir.",
          },
          {
            tag: "Tüketici Kanunu",
            tagColor: "#3b82f6",
            title: "Çalışanların Korunması",
            desc: "İSG mevzuatı kapsamında, kuryelerin güvenli çalışma koşullarına sahip olma hakları vardır. Kask çıkarma dayatması gibi uygulamalar bu hakkın ihlalidir.",
          },
          {
            tag: "Kat Mülkiyeti",
            tagColor: "#a855f7",
            title: "Hizmetlere Erişim Hakkı",
            desc: "Kat Mülkiyeti Kanunu çerçevesinde, site yönetimleri meşru hizmet sunucularının erişimini kısıtlayamaz.",
          },
          {
            tag: "Anayasa",
            tagColor: "#10b981",
            title: "Kişilik Haklarının Korunması",
            desc: "Anayasa ve Medeni Kanun kapsamında, kuryelere yönelik ayrımcı uygulamalar kişilik haklarının ihlali niteliğinde olabilir.",
          },
        ],
      }),
    ],

    [
      "legal_petitions",
      "hukuki-rehber",
      "Dilekçe Örnekleri",
      1,
      JSON.stringify({ title: "Dilekçe Örnekleri", icon: "📝" }),
    ],

    [
      "legal_downloads",
      "hukuki-rehber",
      "İndirilebilir Kaynaklar",
      1,
      JSON.stringify({ title: "İndirilebilir Kaynaklar", icon: "📥" }),
    ],

    [
      "resources_faq",
      "kaynaklar",
      "SSS Bölümü",
      1,
      JSON.stringify({
        title: "Kurye Hakları SSS",
        icon: "⚖️",
        subtitle:
          "Kuryelerin site girişi, teslimat engelleri ve yasal hakları konusundaki en önemli soruların yanıtları.",
      }),
    ],

    [
      "resources_downloads",
      "kaynaklar",
      "İndirilebilir Kaynaklar",
      1,
      JSON.stringify({ title: "İndirilebilir Kaynaklar", icon: "📥" }),
    ],

    [
      "resources_media",
      "kaynaklar",
      "Kampanya Medya",
      1,
      JSON.stringify({
        title: "Kampanya Medya",
        icon: "🎬",
        videoTitle: "İzle: Neden Erişim Önemlidir",
        videoDuration: "Süre: 3:42",
      }),
    ],

    [
      "resources_materials",
      "kaynaklar",
      "Poster & Grafikler",
      1,
      JSON.stringify({
        title: "Poster & Grafikler",
      }),
    ],

    [
      "resources_cta",
      "kaynaklar",
      "Kampanyaya Katılın CTA",
      1,
      JSON.stringify({
        title: "Kampanyaya Katılın",
        description:
          "Sosyal medya materyallerini paylaşarak kampanyamıza destek olun.",
      }),
    ],
  ];

  await client.batch(
    sections.map(([key, page, label, visible, content]) => ({
      sql: "INSERT INTO site_sections (key, page, label, visible, content) VALUES (?, ?, ?, ?, ?)",
      args: [key, page, label, visible, content],
    })),
    "write",
  );
}

async function migrateData(client: Client) {
  // 1. Convert about_hero paragraph1/paragraph2/paragraph3 → paragraphs array
  const heroRes = await client.execute({
    sql: "SELECT content FROM site_sections WHERE key = 'about_hero'",
    args: [],
  });
  if (heroRes.rows.length > 0) {
    const content = JSON.parse(heroRes.rows[0].content as string) as Record<
      string,
      unknown
    >;
    if (
      !content.paragraphs &&
      (content.paragraph1 || content.paragraph2 || content.paragraph3)
    ) {
      const paragraphs = [
        content.paragraph1,
        content.paragraph2,
        content.paragraph3,
      ].filter(Boolean);
      const {
        paragraph1: _1,
        paragraph2: _2,
        paragraph3: _3,
        ...rest
      } = content;
      void _1;
      void _2;
      void _3;
      await client.execute({
        sql: "UPDATE site_sections SET content = ?, updated_at = datetime('now') WHERE key = 'about_hero'",
        args: [JSON.stringify({ ...rest, paragraphs })],
      });
    }
  }

  // 2. Restore missing array content in about sections
  const sectionsToCheck: Record<string, Record<string, unknown>> = {
    about_hero: {
      badge: "Manifesto",
      title: "Biz Şehri Taşıyoruz.",
      highlight: "Yolumuzu Kesmeyin.",
      paragraphs: [
        "Her gün milyonlarca paketle şehirlerin can damarlarını oluşturuyoruz. Yağmurda, karda, sıcakta kapınıza kadar geliyoruz. Ama birçok site, AVM ve bina bize kapılarını kapatıyor.",
        "Bizi arka kapılara, yük asansörlerine yönlendiriyorlar; hatta kaskımızı çıkarmamızı dayatıyorlar. Bu kampanya, kuryelerin karşılaştığı engelleri görünür kılmak, yasal haklar hakkında bilgilendirmek ve kamuoyunda farkındalık yaratmak için başlatılmıştır.",
      ],
    },
    about_pillars: {
      title: "Temel İlkelerimiz",
      subtitle: "Kuryelerin haklarını savunmak için üç temel ilke üzerine çalışıyoruz.",
      items: [
        { icon: "🚪", title: "Engelsiz Erişim", desc: "Kuryelerin, tüm bina ve sitelere eşit ve engelsiz erişim hakkı olduğunu savunuyoruz. Teslimat hizmeti, toplumun temel ihtiyaçlarından biridir.", color: "from-amber-500/20 to-amber-600/5" },
        { icon: "⚖️", title: "Hukuki Koruma", desc: "Mevcut yasalar kuryeleri koruyor. Bu hakların bilinmesi ve gerektiğinde kullanılması için rehberlik sağlıyoruz.", color: "from-blue-500/20 to-blue-600/5" },
        { icon: "📢", title: "Kamuoyu Farkındalığı", desc: "Yaşanan sorunları görünür kılarak toplumsal farkındalık oluşturuyoruz. Her bildirilen engel, değişim için bir adımdır.", color: "from-emerald-500/20 to-emerald-600/5" },
      ],
    },
    about_timeline: {
      title: "Yol Haritası",
      events: [
        { date: "2024 Q3", title: "Kampanya Başlangıcı", desc: "İlk araştırma ve veri toplama süreci." },
        { date: "2024 Q4", title: "Platform Lansmanı", desc: "Engel haritası ve bildirim sistemi yayında." },
        { date: "2025 Q1", title: "500+ Bildirim", desc: "Türkiye genelinde 500'den fazla engel bildirimi alındı." },
        { date: "2025 Q2", title: "Hukuki Eylem", desc: "İlk toplu dilekçe ve yasal başvuru süreçleri." },
      ],
    },
    about_video: {
      title: "Hikayemizi İzleyin",
      subtitle: "Kuryelerin günlük yaşadığı engelleri kendi gözlerinden dinleyin.",
      videoTitle: "Bölüm 1: Teslimatın Engelleri",
      videoDuration: "Süre: 04:32",
    },
    about_cta: {
      title: "Kampanyaya Katılın",
      description: "Siz de karşılaştığınız engelleri bildirerek veya kampanya materyallerini paylaşarak bu harekete destek olabilirsiniz.",
    },
  };

  for (const [key, defaultContent] of Object.entries(sectionsToCheck)) {
    const sectionRes = await client.execute({ sql: "SELECT content FROM site_sections WHERE key = ?", args: [key] });
    if (sectionRes.rows.length > 0) {
      const existing = JSON.parse(sectionRes.rows[0].content as string) as Record<string, unknown>;
      let needsUpdate = false;
      // Check if arrays are missing or empty
      if (key === 'about_hero' && (!Array.isArray(existing.paragraphs) || (existing.paragraphs as unknown[]).length === 0)) needsUpdate = true;
      if (key === 'about_pillars' && (!Array.isArray(existing.items) || (existing.items as unknown[]).length === 0)) needsUpdate = true;
      if (key === 'about_timeline' && (!Array.isArray(existing.events) || (existing.events as unknown[]).length === 0)) needsUpdate = true;
      // For non-array sections, check if core fields are missing
      if (key === 'about_video' && !existing.title) needsUpdate = true;
      if (key === 'about_cta' && !existing.title) needsUpdate = true;

      if (needsUpdate) {
        await client.execute({
          sql: "UPDATE site_sections SET content = ?, updated_at = datetime('now') WHERE key = ?",
          args: [JSON.stringify(defaultContent), key],
        });
      }
    }
  }

  // 3. Insert about_contact section if it doesn't exist
  const contactRes = await client.execute({
    sql: "SELECT key, content FROM site_sections WHERE key = 'about_contact'",
    args: [],
  });
  if (contactRes.rows.length === 0) {
    await client.execute({
      sql: "INSERT INTO site_sections (key, page, label, visible, content) VALUES (?, ?, ?, ?, ?)",
      args: [
        "about_contact",
        "hakkimizda",
        "İletişim",
        1,
        JSON.stringify({
          title: "İletişim",
          email: "info@engelsizkurye.com",
          phone: "+90 212 000 00 00",
        }),
      ],
    });
  } else {
    // 3. Migrate old email to new one
    const contactContent = JSON.parse(contactRes.rows[0].content as string) as Record<string, unknown>;
    if (contactContent.email === 'iletisim@engelsiz-teslimat.com') {
      contactContent.email = 'info@engelsizkurye.com';
      await client.execute({
        sql: "UPDATE site_sections SET content = ?, updated_at = datetime('now') WHERE key = 'about_contact'",
        args: [JSON.stringify(contactContent)],
      });
    }
  }
}
