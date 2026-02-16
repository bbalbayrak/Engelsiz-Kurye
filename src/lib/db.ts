import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const DB_PATH = path.join(process.cwd(), 'data', 'engelsiz.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    initTables(_db);
    seedAdmin(_db);
    seedSections(_db);
  }
  return _db;
}

function initTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reports (
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
    );

    CREATE TABLE IF NOT EXISTS site_sections (
      key TEXT PRIMARY KEY,
      page TEXT NOT NULL,
      label TEXT NOT NULL,
      visible INTEGER NOT NULL DEFAULT 1,
      content TEXT NOT NULL DEFAULT '{}',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_reports_city ON reports(city);
    CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(obstacle_type);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sections_page ON site_sections(page);
  `);
}

function seedAdmin(db: Database.Database) {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@admin.com');
  if (existing) return;
  const id = uuid();
  const hash = bcrypt.hashSync('123456', 10);
  db.prepare('INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)')
    .run(id, 'Admin', 'admin@admin.com', hash, 'admin');
}

function seedSections(db: Database.Database) {
  const count = db.prepare('SELECT COUNT(*) as c FROM site_sections').get() as { c: number };
  if (count.c > 0) return;

  const insert = db.prepare('INSERT INTO site_sections (key, page, label, visible, content) VALUES (?, ?, ?, ?, ?)');

  const seed = db.transaction(() => {
    // ── Homepage ──
    insert.run('home_campaign', 'home', 'Kampanya Bilgi Bolumu', 1, JSON.stringify({
      badge: 'Kampanya',
      title: 'Biz Sehri Tasiyoruz.',
      highlight: 'Yolumuzu Kesmeyin.',
      description: 'Her gun binlerce kurye, site ve binalardaki haksiz kisitlamalarla karsilasiyor. Bu platform, engelleri gorunur kilarak esit erisim hakki mucadelesini destekliyor.',
      pillars: [
        { icon: '🚪', title: 'Engelsiz Erisim', desc: 'Her sitenin kapisi, her binanin asansoru kuryelere de acik olmalidir. Esit erisim temel bir haktir.' },
        { icon: '⚖️', title: 'Hukuki Koruma', desc: 'Yasal haklarinizi bilin, gerektiginde dilekce ve sikayet mekanizmalarini kullanin.' },
        { icon: '📢', title: 'Kamuoyu Farkindal.', desc: 'Engelleri bildirin, kampanya materyallerini paylasin, sesinizi duyurun.' },
      ],
    }));

    // ── About page ──
    insert.run('about_hero', 'hakkimizda', 'Hero / Manifesto', 1, JSON.stringify({
      badge: 'Manifesto',
      title: 'Biz Sehri Tasiyoruz.',
      highlight: 'Yolumuzu Kesmeyin.',
      paragraph1: 'Her gun milyonlarca paketle sehirlerin can damarlarini olusturuyoruz. Yagmurda, karda, sicakta kapiniza kadar geliyoruz. Ama bircok site, AVM ve bina bize kapilarini kapatiyor.',
      paragraph2: 'Bizi arka kapilara, yuk asansorlerine yonlendiriyorlar; hatta kaskimizi cikarmamizi dayatiyorlar. Bu kampanya, kuryelerin karsilastigi engelleri gorunur kilmak, yasal haklar hakkinda bilgilendirmek ve kamuoyunda farkindalik yaratmak icin baslatilmistir.',
    }));

    insert.run('about_pillars', 'hakkimizda', 'Temel Ilkeler', 1, JSON.stringify({
      title: 'Temel Ilkelerimiz',
      subtitle: 'Kuryelerin haklarini savunmak icin uc temel ilke uzerine calisiyoruz.',
      items: [
        { icon: '🚪', title: 'Engelsiz Erisim', desc: 'Kuryelerin, tum bina ve sitelere esit ve engelsiz erisim hakki oldugunu savunuyoruz. Teslimat hizmeti, toplumun temel ihtiyaclarindan biridir.', color: 'from-amber-500/20 to-amber-600/5' },
        { icon: '⚖️', title: 'Hukuki Koruma', desc: 'Mevcut yasalar kuryeleri koruyor. Bu haklarin bilinmesi ve gerektiginde kullanilmasi icin rehberlik sagliyoruz.', color: 'from-blue-500/20 to-blue-600/5' },
        { icon: '📢', title: 'Kamuoyu Farkindal.', desc: 'Yasanan sorunlari gorunur kilarak toplumsal farkindalik olusturuyoruz. Her bildirilen engel, degisim icin bir adimdir.', color: 'from-emerald-500/20 to-emerald-600/5' },
      ],
    }));

    insert.run('about_timeline', 'hakkimizda', 'Yol Haritasi', 1, JSON.stringify({
      title: 'Yol Haritasi',
      events: [
        { date: '2024 Q3', title: 'Kampanya Baslangici', desc: 'Ilk arastirma ve veri toplama sureci.' },
        { date: '2024 Q4', title: 'Platform Lansmani', desc: 'Engel haritasi ve bildirim sistemi yayinda.' },
        { date: '2025 Q1', title: '500+ Bildirim', desc: 'Turkiye genelinde 500den fazla engel bildirimi alindi.' },
        { date: '2025 Q2', title: 'Hukuki Eylem', desc: 'Ilk toplu dilekce ve yasal basvuru surecleri.' },
      ],
    }));

    insert.run('about_video', 'hakkimizda', 'Video Bolumu', 1, JSON.stringify({
      title: 'Hikayemizi Izleyin',
      subtitle: 'Kuryelerin gunluk yasadigi engelleri kendi gozlerinden dinleyin.',
      videoTitle: 'Bolum 1: Teslimatin Engelleri',
      videoDuration: 'Sure: 04:32',
    }));

    insert.run('about_cta', 'hakkimizda', 'Kampanyaya Katilin CTA', 1, JSON.stringify({
      title: 'Kampanyaya Katilin',
      description: 'Siz de karsilastiginiz engelleri bildirerek veya kampanya materyallerini paylasarak bu harekete destek olabilirsiniz.',
    }));

    // ── Legal guide ──
    insert.run('legal_faq', 'hukuki-rehber', 'Sikca Sorulan Sorular', 1, JSON.stringify({ title: 'Sikca Sorulan Sorular', icon: '⚖️' }));

    insert.run('legal_legislation', 'hukuki-rehber', 'Mevzuat Ozeti', 1, JSON.stringify({
      title: 'Mevzuat Ozeti', icon: '📜',
      cards: [
        { tag: 'Is Kanunu', tagColor: '#f59e0b', title: 'Is ve Calisma Hurriyetinin Ihlali', desc: 'Kurye, yasal bir meslek icra eden bireydir. Herhangi bir kisi veya kurulusun, bir kuryeyi isini yapmaktan alikoymasi, calisma ozgurlugunun ihlali anlamina gelebilir.' },
        { tag: 'Tuketici Kanunu', tagColor: '#3b82f6', title: 'Calisanlarin Korunmasi', desc: 'ISG mevzuati kapsaminda, kuryelerin guvenli calisma kosullarina sahip olma haklari vardir. Kask cikarma dayatmasi gibi uygulamalar bu hakkin ihlalidir.' },
        { tag: 'Kat Mulkiyeti', tagColor: '#a855f7', title: 'Hizmetlere Erisim Hakki', desc: 'Kat Mulkiyeti Kanunu cercevesinde, site yonetimleri mesru hizmet sunucularinin erisimini kisitlayamaz.' },
        { tag: 'Anayasa', tagColor: '#10b981', title: 'Kisilik Haklarinin Korunmasi', desc: 'Anayasa ve Medeni Kanun kapsaminda, kuryelere yonelik ayrimci uygulamalar kisilik haklarinin ihlali niteliginde olabilir.' },
      ],
    }));

    insert.run('legal_petitions', 'hukuki-rehber', 'Dilekce Ornekleri', 1, JSON.stringify({ title: 'Dilekce Ornekleri', icon: '📝' }));
    insert.run('legal_downloads', 'hukuki-rehber', 'Indirilebilir Kaynaklar', 1, JSON.stringify({ title: 'Indirilebilir Kaynaklar', icon: '📥' }));

    // ── Resources page ──
    insert.run('resources_faq', 'kaynaklar', 'SSS Bolumu', 1, JSON.stringify({ title: 'Kurye Haklari SSS', icon: '⚖️', subtitle: 'Kuryelerin site girisi, teslimat engelleri ve yasal haklari konusundaki en onemli sorularin yanitlari.' }));
    insert.run('resources_downloads', 'kaynaklar', 'Indirilebilir Kaynaklar', 1, JSON.stringify({ title: 'Indirilebilir Kaynaklar', icon: '📥' }));
    insert.run('resources_media', 'kaynaklar', 'Kampanya Medya', 1, JSON.stringify({ title: 'Kampanya Medya', icon: '🎬', videoTitle: 'Izle: Neden Erisim Onemlidir', videoDuration: 'Sure: 3:42' }));
    insert.run('resources_materials', 'kaynaklar', 'Poster & Grafikler', 1, JSON.stringify({ title: 'Poster & Grafikler' }));
    insert.run('resources_cta', 'kaynaklar', 'Kampanyaya Katilin CTA', 1, JSON.stringify({ title: 'Kampanyaya Katilin', description: 'Sosyal medya materyallerini paylasarak kampanyamiza destek olun.' }));
  });

  seed();
}
