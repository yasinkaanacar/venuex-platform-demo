# Kampanya Listesi PRD

## Özet

Kullanıcıların seçili platform bazında kampanya performanslarını offline dönüşüm perspektifinden analiz etmelerini ve kampanya detaylarına hızlıca erişmelerini sağlayan liste komponenti.

---

## Problem

Mevcut kampanya listesi:
- Sadece offline metrikleri gösteriyor, Online/Omni ROAS karşılaştırması yok
- Başlık ("En İyi Performans Gösteren") ile sıralama kriteri uyumsuz
- Kampanya detayına drill-down yok
- Kullanıcı kampanya bazında coğrafi veya reklam seti performansını görmek için manuel filtreleme yapmak zorunda

---

## Hedef

- Kullanıcı tek bakışta hangi kampanyanın online'da, hangisinin offline'da, hangisinin toplam Omni ROAS'ta iyi performans gösterdiğini anlayabilmeli
- Sayfadan ayrılmadan kampanya detayına (coğrafi dağılım, reklam seti/reklam breakdown) erişebilmeli

---

## Kapsam Dışı

- Cross-platform blended görünüm (platformlar attribution'ı kendileri yaptığı için aynı satış birden fazla platforma atfedilebilir)
- Zaman serisi trend görünümü
- Kampanya içi aksiyon (optimizasyon önerileri, budget reallocation)

---

## Tasarım

### 1. Liste Komponenti

**Başlık:** "Kampanya Performansı"

**Platform Seçici:** Sayfa seviyesinde, sticky header'da (mevcut yapı korunur)

**Tablo Kolonları:**

| Kolon | Açıklama | Sıralanabilir |
|-------|----------|---------------|
| Kampanya | Kampanya adı, tıklanabilir | Hayır |
| Gösterimler | Impression sayısı | Evet |
| Harcamalar | Toplam spend | Evet |
| Mağaza Ziyaretleri | Store visits | Evet |
| CTV | Tıklama-Ziyaret Oranı | Evet |
| Online ROAS | Online attributed revenue / spend | Evet |
| Offline ROAS | Offline attributed revenue / spend | Evet |
| **Omni ROAS** | Online + Offline toplam (vurgulu kolon) | Evet |
| Offline Satın Almalar | Conversion count | Evet |
| Offline Gelir | Attributed revenue | Evet |

**Varsayılan Sıralama:** Harcamalar (descending)

**Satır Davranışı:**
- Hover: Satır highlight, cursor pointer
- Tıklama: Kampanya Detay Drawer açılır

**Pagination:**
- Sayfa başına satır: 10 (dropdown ile 25, 50 seçilebilir)
- Mevcut pagination yapısı korunur

---

### 2. Kampanya Detay Drawer

**Açılış:** Kampanya satırına tıklandığında sağdan slider olarak açılır

**Drawer Özellikleri:**
- Genişlik: Sayfa width'inin %45'i
- Arka plan: Dimmed overlay (sayfa görünür kalır)
- Kapatma: X butonu veya overlay'e tıklama

**Drawer Header:**
- Kampanya adı (truncate with tooltip if long)
- Platform ikonu
- Kapatma butonu

**Özet Kartları (Header altında, yatay):**

| Harcama | Online ROAS | Offline ROAS | Omni ROAS |
|---------|-------------|--------------|-----------|
| ₺8.4M   | 4.2x        | 32.6x        | 36.8x     |

**Tab Yapısı:**

#### Tab 1: Coğrafi Dağılım

| Şehir | Offline Dönüşüm | Offline Gelir | Offline ROAS |
|-------|-----------------|---------------|--------------|
| İstanbul | 12,450 | ₺45.2M | 38.2x |
| Ankara | 3,280 | ₺12.1M | 29.4x |
| İzmir | 2,910 | ₺9.8M | 31.1x |

- Varsayılan sıralama: Offline Gelir (descending)
- Tüm kolonlar sıralanabilir

#### Tab 2: Reklam Setleri & Reklamlar

Hiyerarşik accordion yapısı:

```
▼ Ad Set: Retargeting-30D
  │ Offline Dönüşüm: 6,120 │ Offline Gelir: ₺22.3M │ Offline ROAS: 26.8x
  
    Ad: Carousel-Yeni Sezon     │ 4,230 │ ₺15.2M │ 28.4x
    Ad: Video-Brand Story       │ 1,890 │ ₺7.1M  │ 22.1x
    
▶ Ad Set: Lookalike-Purchase
  │ Offline Dönüşüm: 2,100 │ Offline Gelir: ₺8.9M │ Offline ROAS: 35.2x
```

- Ad Set satırı tıklanınca expand/collapse
- Ad Set seviyesinde aggregate metrikler
- Ad seviyesinde individual metrikler

---

## Teknik Notlar

**Data Source:**
- Online ROAS: Platform API (Google Ads / Meta Ads / TikTok Ads)
- Offline ROAS: Platform API (platformların offline conversion attribution'ı)
- Omni ROAS: Frontend'de hesaplanabilir → (Online Revenue + Offline Revenue) / Spend

**Veri Akışı:**
```
POS/Satış Verisi → VenueX → Platform'a Upload → Platform Attribution → VenueX'e Geri Çekim → Dashboard
```

**Drawer State:**
- URL'de reflect edilmesine gerek yok, session-based state yeterli

**Performance:**
- Ad Set/Ad verisi lazy load (drawer açılınca fetch)
- Coğrafi veri mevcut endpoint'ten filtrelenebilir

---

## Açık Sorular

1. **Ad Set/Ad breakdown:** Tüm platformlar için aynı hiyerarşi mevcut mu? (Google'da Campaign > Ad Group > Ad, Meta'da Campaign > Ad Set > Ad)

2. **Coğrafi veri granularity:** Şehir seviyesi yeterli mi, yoksa ilçe/bölge de gerekli mi?

---

## Başarı Kriterleri

- Kullanıcı Omni ROAS'ı görüntüleyebiliyor
- Drawer açılma süresi < 500ms
- Kullanıcı kampanya detayına sayfadan ayrılmadan erişebiliyor