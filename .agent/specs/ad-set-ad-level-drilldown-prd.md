# PRD: Ad Set & Ad Seviyesi Drill-Down

**Campaign Performance Table — Granularity Extension**

| | |
|---|---|
| **Yazar** | Kaan (Product Manager) |
| **Tarih** | 9 Şubat 2025 |
| **Versiyon** | v0.1 — Draft |
| **Durum** | Review bekliyor |
| **Paydaşlar** | Kürşad (CEO), Çağdaş (CTO) |
| **Bağımlılık** | Campaign Performance Table PRD (Faz 1) |

---

## 1. Problem Tanımı

Mevcut dashboard sadece kampanya seviyesinde veri gösteriyor. Bir performans pazarlaması direktörü kampanyanın offline ROAS'ının düştüğünü gördüğünde, şu soruları soruyor:

- "Hangi audience'da sorun var?" → Ad Set seviyesi lazım
- "Hangi creative artık çalışmıyor?" → Ad seviyesi lazım

Bu soruları cevaplamak için şu an platform dashboard'larına (Google Ads, Meta Business Manager, TikTok Ads Manager) tek tek girmek gerekiyor. Ama platformlar offline metrikleri kendi online metrikleriyle aynı derinlikte göstermiyor. Kullanıcı platform'a girdiğinde offline attribution verisini kampanya seviyesinin altında kolay bulamıyor.

VenueX'in değer önerisi tam burada: **offline metrikleri, kampanyanın altına — ad set ve ad seviyesine — indirebilen tek yer olmak.**

---

## 2. Hedef

Campaign Performance Table'ı ad set ve ad seviyesine genişleterek, kullanıcının audience ve creative kararlarını offline attribution verileriyle verebilmesini sağlamak.

### Başarı Tanımı

Kullanıcı, VenueX dashboard'unda kampanyadan ad'e kadar inip "bu audience + bu creative = mağazada satış" bağlantısını tek bir akışta görebilmeli.

---

## 3. Navigasyon Modeli: Drill-Down

### Neden Drill-Down?

Üç alternatif değerlendirildi:

| Pattern | Avantaj | Dezavantaj | Karar |
|---|---|---|---|
| **Nested Accordion** | Context kaybı yok | Her seviyenin kolon seti farklı, aynı tabloda göstermek kaotik. 3 seviye indent tabloyu bozar. | ❌ |
| **Split View (master-detail)** | Kampanyalar hep görünür | Ekranı ikiye böler, tablolar dar kalır. 5 kolonluk tablo yarım ekrana sığmaz. | ❌ |
| **Drill-Down** | Her seviye kendi layout'una sahip. Tam ekran kullanılır. Kolon seti seviyeye göre değişebilir. | Context kaybı riski | ✅ |

Context kaybı, **parent summary strip** ve **breadcrumb** ile çözülür.

### Akış

```
Campaign View (default)
  │
  │  satıra tıkla
  ▼
Ad Set View
  │  üstte: parent campaign summary strip
  │
  │  satıra tıkla
  ▼
Ad View
     üstte: parent campaign + ad set summary strip
```

### Breadcrumb

Her zaman görünür, tıklanabilir:

`Campaigns > [Campaign Name] > [Ad Set Name]`

Her seviyeye tek tıkla geri dönülebilir.

### Parent Summary Strip

Drill-down'a girildiğinde tablonun üstünde tek satırlık özet:

**Ad Set View'da:**
```
Product Launch - Denim  |  google-ads  |  Spend: ₺220K  |  Offline ROAS: 34.6x  |  Offline Conv: 1,320
```

**Ad View'da:**
```
Product Launch - Denim > Lookalike 25-34  |  Spend: ₺85K  |  Offline ROAS: 28.2x  |  Avg. Basket: ₺5,750
```

Parent summary strip'te gösterilen metrikler, o seviyenin primary metriklerinden seçilir. Tıklanınca parent seviyeye döner.

---

## 4. Ad Set Seviyesi

### Karar Tipi

*"Hangi audience'a para harcayalım?"*

Bu seviyede kullanıcı iki ad set'i yan yana karşılaştırarak bütçe dağılımı kararı veriyor. Tek bir ad set'in metrikleri tek başına anlamsız — karşılaştırmalı okunması gerekiyor.

### Primary Metrics (her zaman görünür — 5 kolon)

| # | Kolon | Tanım | Metrik Tipi | Neden Primary |
|---|---|---|---|---|
| 1 | Ad Set Name | Ad set adı + platform badge | — | Identifier |
| 2 | Spend | Toplam reklam harcaması | Volume | Bağlam — ne kadar harcadım |
| 3 | Offline ROAS | Offline Revenue ÷ Spend | Efficiency | **Hero metrik** — ana karar metriği. Renk kodlu. |
| 4 | Cost per Offline Conv. | Spend ÷ Offline Conversions | Efficiency | Birim maliyet karşılaştırması |
| 5 | Avg. Basket Size | Offline Revenue ÷ Offline Conversions | Efficiency | Audience kalitesi sinyali |

**Avg. Basket Size neden primary:**

İki ad set aynı Offline ROAS'a sahip olabilir ama:
- Ad Set A: çok conversion, küçük sepet (₺200 ortalama)
- Ad Set B: az conversion, büyük sepet (₺2,000 ortalama)

Bu ikisi stratejik olarak farklı audience'lar. Bütçe kararı sadece ROAS'a bakarak verilemez. Basket size bu ayrımı görünür kılar.

### Secondary Metrics (expand / detail panel)

| Metrik | Tanım | Neden Secondary |
|---|---|---|
| Offline Conversions | Platforma eşleşen mağaza satış adedi | Volume — primary'deki efficiency metriklere girdi, tek başına karar verdirtmez |
| Offline Revenue | Platforma eşleşen mağaza satış tutarı | Volume — aynı sebep |
| Frequency | Aynı kişiye ortalama gösterim sayısı | Diagnostic — offline dönüşüm için frequency sweet spot'u var mı? |
| Offline Conversion Rate | Offline Conversions ÷ Clicks | Diagnostic — hangi audience reklamdan mağaza satışına dönüşüyor |
| Online Conversions | Platform-reported online satış adedi | Karşılaştırma — online vs offline oranı |
| Omnichannel ROAS | (Online + Offline Revenue) ÷ Spend | Bütünsel bakış |

### Platform-Specific (sadece ilgili platformda görünür)

| Platform | Metrik | Tanım |
|---|---|---|
| Google | Store Visits | Google Signals tabanlı mağaza ziyareti tahmini |
| Google | Cost per Store Visit | Spend ÷ Store Visits |

Bu metrikler ortak tabloda değil, Google kampanyalarının detail panel'ında gösterilir.

### Sıralama ve Filtreleme

- Default sıralama: Spend (descending) — en çok harcanan ad set üstte
- Tüm primary kolonlarda sıralama toggle'ı
- Platform filtresi (parent kampanya tek platformsa gereksiz, multi-platform kampanyalarda aktif)

---

## 5. Ad Seviyesi

### Karar Tipi

*"Hangi creative mağazada satış yaratıyor?"*

Bu seviyede kullanıcı hızlı tarama yapıyor. 10-20 creative satırına bakıp "çalışan / çalışmayan" ayrımını saniyeler içinde görmesi lazım. Derinlemesine analiz değil, binary karar.

### Primary Metrics (her zaman görünür — 4 kolon)

| # | Kolon | Tanım | Metrik Tipi | Neden Primary |
|---|---|---|---|---|
| 1 | Ad Creative | Thumbnail + ad adı (detay aşağıda) | — | Identifier — creative'i tanımak için |
| 2 | Spend | Toplam reklam harcaması | Volume | Bağlam |
| 3 | Offline Conversions | Platforma eşleşen mağaza satış adedi | Volume | Bu creative çalışıyor mu? |
| 4 | Offline ROAS | Offline Revenue ÷ Spend | Efficiency | **Hero metrik** — ne kadar verimli? Renk kodlu. |

### Creative Thumbnail

Ad seviyesinde karar "hangi creative çalışıyor" ama sadece ad ismi okumak creative hakkında bir şey söylemiyor. Kullanıcının görsel olarak creative'i tanıması şart.

**Thumbnail spesifikasyonu:**

- Boyut: 48x48px (tablo satırı içinde)
- Kaynak: Platform API'sından ad creative asset (image/video thumbnail)
- Video ad'ler için: ilk frame veya platform'un döndürdüğü thumbnail
- Text-only ad'ler için: platform ikonu + ad type badge (Search, Display, vb.)
- Tıklanınca: büyük preview modal (creative'in full hali)
- Fallback: creative yüklenemezse platform ikonu göster

**Thumbnail + Ad Name layout:**

```
┌──────┬──────────────────────────┐
│      │ Summer Denim - Lifestyle │
│ 📷   │ Image Ad · 1080x1080     │
│      │                          │
└──────┴──────────────────────────┘
```

Sol tarafta thumbnail, sağ tarafta ad adı + ad tipi (Image Ad, Video Ad, Carousel, vb.) ve boyut bilgisi. Bu bilgi kullanıcının "hangi format çalışıyor" sorusunu da cevaplar.

### Secondary Metrics (expand / detail panel)

| Metrik | Tanım | Neden Secondary |
|---|---|---|
| Cost per Offline Conv. | Spend ÷ Offline Conversions | Birim maliyet — primary'de ROAS zaten verimliliği gösteriyor |
| Offline Revenue | Platforma eşleşen satış tutarı | Volume detayı |
| Offline Conversion Rate | Offline Conversions ÷ Clicks | Diagnostic — hangi creative tıklamayı mağaza satışına çeviriyor |
| Online Conversions | Platform-reported online satış | Karşılaştırma |
| CTR | Clicks ÷ Impressions | Diagnostic — creative dikkat çekiyor mu? (online metric, bağlam için) |

### Neden 4 Kolon (3 metrik + creative)

Ad seviyesinde 20 satır olabilir. Her satıra 8 kolon koyarsan:
- Tablo yatay scroll ister
- Kullanıcı pattern scanning yapamaz
- Hızlı "çalışan/çalışmayan" ayrımı kaybolur

3 metrik + creative thumbnail ile kullanıcı tabloya bakıp 5 saniyede "şu 3 creative iyi, şu 5'i kötü" diyebilmeli. Geri kalan her şey expand'de.

---

## 6. Görsel Hiyerarşi Kuralları (Her Seviyede Geçerli)

### Offline ROAS Renk Kodlaması

| Durum | Renk | Koşul |
|---|---|---|
| İyi performans | Yeşil (background tint veya text color) | ROAS > kampanya ortalaması |
| Orta performans | Nötr (default) | ROAS ≈ kampanya ortalaması |
| Kötü performans | Kırmızı (background tint veya text color) | ROAS < kampanya ortalaması |

Eşik değerler kampanya ortalamasına göre dinamik hesaplanır. Sabit eşik koyarsak farklı sektörlerde (moda vs. elektronik) anlamsızlaşır.

### Font Hiyerarşisi

- **Hero kolon (Offline ROAS):** Semi-bold, normal veya bir kademe büyük font
- **Volume kolonları (Spend, Conversions, Revenue):** Regular weight
- **Secondary metrikler:** Muted color (gray tone), detail panel'da

### Expand/Collapse Davranışı

- Secondary metrikler default'ta gizli
- Satır sonunda expand ikonu (chevron veya "+" ikonu)
- Expand edildiğinde satırın altında detail row açılır
- Aynı anda birden fazla satır expand edilebilir (tek tek karşılaştırma için)

---

## 7. Edge Case'ler

### Veri Yoksa

| Durum | Gösterim |
|---|---|
| Ad set/ad'de henüz offline conversion yoksa | "—" göster, satırı muted tonla |
| Spend var ama offline conversion 0 | Offline ROAS: "0x", kırmızı renk kodu |
| Platform API'sı veri dönmüyorsa | "Data unavailable" badge, gri satır |
| Match rate çok düşükse (<10%) | Warning icon, "Low match rate" tooltip |

### Çok Sayıda Satır

| Durum | Çözüm |
|---|---|
| 50+ ad set | Pagination (20 satır/sayfa) veya virtual scroll |
| 100+ ad | Pagination + default sıralama Spend desc (en çok harcanan üstte) |
| Çok uzun ad/ad set isimleri | Truncate + tooltip on hover |

### Platform Farkları

| Durum | Çözüm |
|---|---|
| Google'da Store Visits var, Meta'da yok | Platform-specific metrikler sadece ilgili platform satırlarında |
| Attribution window farklılıkları | Kullanıcı bunu kendi ayarlıyor, biz göstermiyoruz |
| Bir platform'da ad set yapısı yoksa | O seviyeyi skip et, direkt ad'e in |

---

## 8. Teknik Gereksinimler

### API Data İhtiyaçları

| İhtiyaç | Soru | Sorulacak Kişi |
|---|---|---|
| Google Ads API'dan ad set (ad group) seviyesinde offline conversion dönüyor mu? | Evet/Hayır — Faz 2 scope'unu belirler | Çağdaş |
| Google Ads API'dan ad seviyesinde offline conversion dönüyor mu? | Evet/Hayır | Çağdaş |
| Meta Marketing API'dan ad set seviyesinde offline conversion dönüyor mu? | Evet/Hayır | Çağdaş |
| Meta Marketing API'dan ad seviyesinde offline conversion dönüyor mu? | Evet/Hayır | Çağdaş |
| TikTok Marketing API'dan ad group/ad seviyesinde offline conversion dönüyor mu? | Evet/Hayır | Çağdaş |
| Creative thumbnail/asset platform API'larından çekilebiliyor mu? | Evet/Hayır — Ad seviyesi thumbnail'ı belirler | Çağdaş |

**Bu soruların cevapları bu PRD'nin scope'unu doğrudan belirler.** Eğer bir platform ad set seviyesinde offline conversion dönmüyorsa, o platform için ad set view'ı ya farklı tasarlanır ya da scope dışı kalır.

### Performance

- Ad set listesi: 100ms altında render (20 satır)
- Ad listesi: 100ms altında render (50 satır, thumbnail lazy load)
- Drill-down transition: 200ms altında (data cached ise), 500ms altında (API call gerekiyorsa)
- Thumbnail lazy loading: viewport'a girince yükle, placeholder ile başla

---

## 9. Başarı Metrikleri

| Metrik | Hedef | Ölçüm |
|---|---|---|
| Drill-down kullanım oranı | Kampanya görüntülemelerinin %60'ında ad set'e iniliyor | Analytics |
| Ad seviyesine inme oranı | Ad set görüntülemelerinin %40'ında ad'e iniliyor | Analytics |
| Seviyeler arası ortalama süre | Campaign → Ad Set < 2 saniye | Analytics |
| Platform dashboard ziyaret azalması | Offline metrik kontrolü için platform login'i düşüyor | Kullanıcı feedback |
| Creative thumbnail etkileşimi | Ad view'da thumbnail tıklama (preview) oranı | Analytics |

---

## 10. Faz Planı

### Faz 2a — Ad Set Seviyesi

- Drill-down navigasyon altyapısı
- Breadcrumb component
- Parent summary strip
- Ad set tablosu (5 primary kolon)
- Secondary metrik expand/collapse
- Offline ROAS renk kodlaması (ad set seviyesinde)

### Faz 2b — Ad Seviyesi

- Ad set → Ad drill-down
- Ad tablosu (4 primary kolon — thumbnail dahil)
- Creative thumbnail component (lazy load, fallback, preview modal)
- Secondary metrik expand/collapse

### Faz 2c — Polish

- Edge case handling (veri yok, çok satır, platform farkları)
- Pagination / virtual scroll
- Performance optimizasyonu
- Platform-specific metrik alanları (Google Store Visits ad set/ad seviyesinde)

---

## 11. Açık Sorular

| # | Soru | Kimden | Etkisi |
|---|---|---|---|
| 1 | Platform API'larından ad set/ad seviyesinde offline conversion dönüyor mu? | Çağdaş | Tüm PRD'nin scope'u. Dönmüyorsa bu özellik yapılamaz. |
| 2 | Creative asset/thumbnail platform API'larından çekilebiliyor mu? | Çağdaş | Ad seviyesi thumbnail özelliği |
| 3 | Google Store Visits ad set/ad seviyesinde dönüyor mu? | Çağdaş | Platform-specific alan derinliği |
| 4 | Mevcut kampanya tablosunun yeniden tasarımı (Faz 1) ne zaman tamamlanır? | Çağdaş | Bu PRD'nin başlama tarihi |
| 5 | Müşterilerden ad set/ad seviyesi talep geldi mi? Hangi müşterilerden? | Kürşad | Önceliklendirme |
