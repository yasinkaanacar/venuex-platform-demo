# Lokal Envanter Sayfası - PRD

## Amaç

Kullanıcının yerel envanter verisinin platformlara (Google, Meta) sağlıklı bir şekilde aktığını görmesi, engel varsa çözebilmesi veya çözecek aksiyonu öğrenmesi.

**Kritik bağlam:** 
- Ana ürün feed'i Google Merchant Center'dan çekiliyor (GMC = Source of Truth)
- VenueX sadece lokal envanter verisini (mağaza kodu, stok, fiyat) yönetiyor
- Ürün bilgisi kalitesi (GTIN, fotoğraf, açıklama) VenueX'in kontrolünde değil

---

## Sayfa Yapısı

| Tab | Amacı |
|-----|-------|
| **Özet** | "Şu an her şey yolunda mı?" — Snapshot, health status |
| **Aktivite** | "Ne oldu, ne zaman oldu?" — Operasyonel log |

---

## Tab 1: Özet

### Bölüm 1: Veri Akışı Durumu

```
[ERP/GMC] ──→ [VenueX] ──→ [Google LIA]
                      ──→ [Meta]
```

Her bağlantı için: Son sync zamanı, Durum, İşlenen ürün sayısı

### Bölüm 2: Platform Kabul Durumu

```
┌─────────────────┐  ┌─────────────────┐
│ Google          │  │ Meta            │
│ ✓ 124,880       │  │ ✓ 124,620       │
│ ✗ 120 sorunlu   │  │ ✗ 380 sorunlu   │
│ [Sorunları Gör] │  │ [Sorunları Gör] │
└─────────────────┘  └─────────────────┘
```

### Bölüm 3: Aktif Sorunlar

```
🔴 Store Code Mismatch    45 ürün   Google  [Çöz]
🟡 Price Mismatch         32 ürün   Meta    [Çöz]
🟡 Missing GTIN           28 ürün   Google  [Çöz]
```

---

## Tab 2: Aktivite

Timeline formatında activity log. Entry tipleri:
- 🔵 Devam ediyor
- 🟢 Başarılı  
- 🟡 Uyarılı başarılı
- 🔴 Başarısız

### Batch Report Sheet

Entry tıklandığında sağdan açılır:
- Batch ID ve status badge
- Total / Success / Issues sayıları
- Hata listesi (grouped)
- [Download Error Report (.CSV)] butonu

---

## Veri Yapısı

```typescript
interface SyncStatus {
  source: 'erp' | 'google' | 'meta';
  status: 'syncing' | 'success' | 'warning' | 'error';
  lastSyncAt: Date;
  itemsProcessed: number;
  itemsFailed: number;
  progress?: number;
}

interface PlatformHealth {
  platform: 'google' | 'meta';
  acceptedCount: number;
  rejectedCount: number;
  totalCount: number;
  issues: PlatformIssue[];
}

interface PlatformIssue {
  errorCode: string;
  errorTitle: string;
  affectedCount: number;
  severity: 'critical' | 'warning' | 'info';
  platform: 'google' | 'meta';
}

interface ActivityLogEntry {
  id: string;
  batchId: string;
  timestamp: Date;
  source: 'erp' | 'google' | 'meta';
  eventType: 'ingest' | 'sync' | 'connection';
  status: 'syncing' | 'success' | 'warning' | 'error';
  title: string;
  detail: string;
  itemsTotal?: number;
  itemsSuccess?: number;
  itemsFailed?: number;
  progress?: number;
  issues?: BatchIssue[];
}
```

---

## Kapsam Dışı (V1'de yok)

- Mağaza bazlı filtreleme
- Zaman serisi / trend grafikleri
- Veri kalitesi önerileri (GTIN, fotoğraf eksik vb.)
- Performans tab'ı
- Yandex/Apple Maps
