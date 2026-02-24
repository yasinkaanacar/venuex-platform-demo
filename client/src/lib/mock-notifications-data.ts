import type { Notification, NotificationCategory, NotificationSeverity } from './types/notifications';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - Math.floor(Math.random() * 6));
  return d.toISOString();
}

function hoursAgo(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

function makeNotif(
  id: string,
  category: NotificationCategory,
  severity: NotificationSeverity,
  title: string,
  message: string,
  createdAt: string,
  isRead: boolean,
  actionUrl?: string
): Notification {
  return { id, category, severity, title, message, isRead, createdAt, actionUrl, userId: 'user-001' };
}

export const mockNotifications: Notification[] = [
  // --- TODAY (unread) ---
  makeNotif(
    'notif-001',
    'reviews',
    'error',
    'Olumsuz yorum alındı (1★)',
    "Kadıköy Boyner lokasyonuna 1 yıldızlı bir yorum bırakıldı: \"Müşteri hizmetleri çok kötü, 20 dk beklettiler.\" Hemen yanıtlayın.",
    hoursAgo(1),
    false,
    '/reviews'
  ),
  makeNotif(
    'notif-002',
    'offline_conversions',
    'error',
    'Veri pipeline\'ı 24 saattir çalışmıyor',
    "Google Ads offline conversion yüklemesi son 24 saattir başarısız. SFTP bağlantısı zaman aşımına uğruyor.",
    hoursAgo(2),
    false,
    '/offline-conversions'
  ),
  makeNotif(
    'notif-003',
    'catalog',
    'warning',
    '847 ürün Google tarafından reddedildi',
    "Google Merchant Center'da 847 ürün 'Eksik GTIN' nedeniyle reddedildi. Onay oranı %72'ye düştü.",
    hoursAgo(3),
    false,
    '/catalog'
  ),
  makeNotif(
    'notif-004',
    'locations',
    'error',
    'Lokasyon askıya alındı',
    "Levent Koçtaş lokasyonu Google Business Profile tarafından askıya alındı. Doğrulama gerekiyor.",
    hoursAgo(4),
    false,
    '/locations'
  ),
  makeNotif(
    'notif-005',
    'reviews',
    'info',
    'Günlük yorum özeti',
    "Bugün 23 lokasyondan toplam 89 yeni yorum alındı. Ortalama puan: 4.2 (dün: 4.3). 14 yorum yanıt bekliyor.",
    hoursAgo(5),
    false,
    '/reviews'
  ),

  // --- TODAY (read) ---
  makeNotif(
    'notif-006',
    'locations',
    'success',
    'Toplu çalışma saati güncellemesi',
    "145 mağazanın çalışma saatleri 'Bayram Dönemi' takvimi ile toplu olarak güncellendi.",
    hoursAgo(6),
    true,
    '/locations'
  ),
  makeNotif(
    'notif-007',
    'platform',
    'warning',
    'GBP API token süresi doluyor',
    "Google Business Profile API token'ınızın süresi 5 gün içinde doluyor. Bağlantıyı yenilemezseniz senkronizasyon duracak.",
    hoursAgo(8),
    true
  ),

  // --- YESTERDAY (unread) ---
  makeNotif(
    'notif-008',
    'reviews',
    'warning',
    'SLA aşıldı: 18 yanıtsız yorum',
    "18 yorum 48 saattir yanıt bekliyor. 24 saat SLA hedefiniz aşıldı. En eski yorum: Ankara Forum Karaca.",
    daysAgo(1),
    false,
    '/reviews'
  ),
  makeNotif(
    'notif-009',
    'offline_conversions',
    'warning',
    'Conversion verisinde anomali',
    "Dünkü Meta CAPI yüklemesinde ortalama sipariş değeri ₺4.250 — son 30 günlük ortalamadan %340 yüksek. Kontrol edin.",
    daysAgo(1),
    false,
    '/offline-conversions'
  ),
  makeNotif(
    'notif-010',
    'reviews',
    'warning',
    'Lokasyon puanı eşik altına düştü',
    "Bakırköy Capacity Boyner lokasyonunun Google puanı 3.9'a düştü (eşik: 4.0). Son 30 günde 8 olumsuz yorum.",
    daysAgo(1),
    false,
    '/reviews'
  ),

  // --- YESTERDAY (read) ---
  makeNotif(
    'notif-011',
    'catalog',
    'success',
    'Feed senkronizasyonu tamamlandı',
    "Google Merchant Center feed senkronizasyonu tamamlandı. 24.391 ürün işlendi, 23.544 onaylandı (%96.5).",
    daysAgo(1),
    true,
    '/catalog'
  ),
  makeNotif(
    'notif-012',
    'platform',
    'success',
    'Apple Business Connect senkronize edildi',
    "Apple Business Connect'e 45 lokasyon başarıyla senkronize edildi. Tüm profiller güncel.",
    daysAgo(1),
    true
  ),

  // --- THIS WEEK ---
  makeNotif(
    'notif-013',
    'offline_conversions',
    'success',
    'Meta CAPI yüklemesi başarılı',
    "Meta Conversions API'ye 12.847 satış kaydı başarıyla yüklendi. Match rate: %78.3.",
    daysAgo(2),
    true,
    '/offline-conversions'
  ),
  makeNotif(
    'notif-014',
    'locations',
    'warning',
    'Platform verisi uyuşmazlığı',
    "12 lokasyonun Google ve Apple profilleri arasında telefon numarası uyuşmazlığı tespit edildi.",
    daysAgo(2),
    true,
    '/locations'
  ),
  makeNotif(
    'notif-015',
    'platform',
    'error',
    'TikTok Events API bağlantısı kesildi',
    "TikTok Events API bağlantısı son 36 saattir kesik. Offline conversion verisi gönderilemiyor.",
    daysAgo(3),
    true,
    '/offline-conversions'
  ),
  makeNotif(
    'notif-016',
    'reviews',
    'success',
    'Otomatik yanıtlar gönderildi',
    "4-5 yıldızlı 34 yorum için 'Teşekkür' şablonu kullanılarak otomatik yanıt gönderildi.",
    daysAgo(3),
    true,
    '/reviews'
  ),
  makeNotif(
    'notif-017',
    'catalog',
    'error',
    'Supplemental Feed yüklenemedi',
    "Supplemental Feed yüklenirken hata oluştu: dosya formatı hatalı. Son başarılı yükleme: 3 gün önce.",
    daysAgo(4),
    true,
    '/catalog'
  ),
  makeNotif(
    'notif-018',
    'locations',
    'warning',
    'Duplicate lokasyon tespit edildi',
    "BCK-042 mağaza kodlu lokasyon Google tarafından duplicate olarak işaretlendi. Profilleri birleştirin veya birini kaldırın.",
    daysAgo(4),
    true,
    '/locations'
  ),
  makeNotif(
    'notif-019',
    'offline_conversions',
    'warning',
    'Düşük match rate uyarısı',
    "Google Ads son yüklemedeki match rate %41.2 — hedef eşik (%60) altında. Veri kalitesini kontrol edin.",
    daysAgo(5),
    true,
    '/offline-conversions'
  ),

  // --- EARLIER ---
  makeNotif(
    'notif-020',
    'reviews',
    'info',
    'Google politika ihlali — yorum kaldırıldı',
    "Bir yorum Google politikalarını ihlal ettiği gerekçesiyle Bakırköy Boyner profilinden kaldırıldı.",
    daysAgo(10),
    true,
    '/reviews'
  ),
  makeNotif(
    'notif-021',
    'locations',
    'warning',
    'Doğrulama gerekiyor',
    "Beşiktaş Karaca lokasyonu Google tarafından doğrulanmadı. 14 gün içinde doğrulama yapılmazsa profil yayından kaldırılacak.",
    daysAgo(12),
    true,
    '/locations'
  ),
  makeNotif(
    'notif-022',
    'catalog',
    'warning',
    'Onay oranı eşik altına düştü',
    "Google Merchant Center onay oranı %68'e düştü (eşik: %80). En çok reddedilen neden: 'Eksik fiyat bilgisi'.",
    daysAgo(15),
    true,
    '/catalog'
  ),
  makeNotif(
    'notif-023',
    'platform',
    'success',
    'Meta Business entegrasyonu bağlandı',
    "Meta Business Suite entegrasyonu başarıyla kuruldu. 145 lokasyon Meta ile senkronize ediliyor.",
    daysAgo(20),
    true
  ),
  makeNotif(
    'notif-024',
    'offline_conversions',
    'info',
    'Aylık conversion raporu hazır',
    "Şubat 2026 offline conversion özet raporu hazır. Toplam: 48.329 satış, ₺12.4M gelir, ortalama match rate: %74.1.",
    daysAgo(25),
    true,
    '/offline-conversions'
  ),
];

// Filter to last 90 days
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

export function formatRelativeTime(isoDate: string): string {
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 60) {
    return `${diffMinutes} dk önce`;
  }
  if (diffHours < 24) {
    return `${diffHours} saat önce`;
  }
  if (diffDays === 1) {
    return 'Dün';
  }
  if (diffDays < 7) {
    return `${diffDays} gün önce`;
  }
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export type NotificationTimeGroup = 'today' | 'yesterday' | 'thisWeek' | 'earlier';

export function getTimeGroup(isoDate: string): NotificationTimeGroup {
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return 'thisWeek';
  return 'earlier';
}

export const notificationDataService = {
  async getNotifications(): Promise<Notification[]> {
    await delay(150);
    const cutoff = new Date(Date.now() - NINETY_DAYS_MS);
    return mockNotifications
      .filter((n) => new Date(n.createdAt) >= cutoff)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async markAsRead(id: string): Promise<Notification> {
    await delay(80);
    const notif = mockNotifications.find((n) => n.id === id);
    if (!notif) throw new Error('Notification not found');
    notif.isRead = true;
    return notif;
  },

  async markAllAsRead(): Promise<{ count: number }> {
    await delay(100);
    let count = 0;
    mockNotifications.forEach((n) => {
      if (!n.isRead) {
        n.isRead = true;
        count++;
      }
    });
    return { count };
  },

  async getUnreadCount(): Promise<{ count: number }> {
    await delay(50);
    const cutoff = new Date(Date.now() - NINETY_DAYS_MS);
    const count = mockNotifications.filter(
      (n) => !n.isRead && new Date(n.createdAt) >= cutoff
    ).length;
    return { count };
  },
};
