# PRD: Campaign Performance Table

**Offline Attribution Dashboard — Core Component**

| | |
|---|---|
| **Yazar** | Kaan (Product Manager) |
| **Tarih** | 9 Şubat 2025 |
| **Versiyon** | v0.1 — Draft |
| **Durum** | Review bekliyor |
| **Paydaşlar** | Kürşad (CEO), Çağdaş (CTO) |

---

## 1. Problem Tanımı

VenueX, multi-location perakende müşterilerinin online reklam harcamalarının offline mağaza satışlarına etkisini ölçüyor. Platformlara (Google, Meta, TikTok) POS verisini gönderip, platformların döndürdüğü offline attribution verilerini tek bir dashboard'dan sunuyor.

Mevcut kampanya performans tablosu aşağıdaki sorunlara sahip:

- **Görsel hiyerarşi yok** — 10 kolon aynı ağırlıkta, aynı renkte. Kullanıcı tabloya baktığında 3 saniyede hangi kampanyanın çalışıp hangisinin çalışmadığını anlayamıyor.
- **Kolon sırası mantıksal değil** — Ne funnel sırası ne de karar sırası izliyor. Gösterimler ile Offline ROAS yan yana, aralarında hiçbir anlatı yok.
- **Üç ROAS yan yana** — Online, Offline ve Omni ROAS aynı ağırlıkta gösterilince kullanıcı hangisine odaklanacağını bilemiyor. O2O tool'unun hero metriği belirsiz.
- **Platform-specific metrikler karışık** — Mağaza Ziyaretleri (Store Visits) Google'a özel bir metrik ama cross-platform tabloda diğer platformların yanında gösteriliyor.
- **Granularity eksik** — Tablo sadece kampanya seviyesinde. Ad Set ve Ad seviyesine inilemiyor.

---

## 2. Hedef

Kampanya performans tablosunu, performans pazarlaması direktörlerinin offline attribution verilerini hızla okuyup bütçe ve optimizasyon kararları verebileceği bir araç haline getirmek.

### Temel Prensipler

- **Offline-first** — VenueX bir O2O tool'u. Hero metrikler her zaman offline tarafta. Online metrikler sadece bağlam için, platformların kendi dashboard'larıyla rekabet etmiyoruz.
- **Transparent methodology** — Her platformun attribution yöntemi, match rate'i ve sınırlamaları erişilebilir ama yüze vurulmaz. Kullanıcı istediğinde görür, istemediğinde temiz tablo kalır.
- **Karar odaklı** — Her seviye (Campaign, Ad Set, Ad) farklı bir karar tipine hizmet eder. Metrik seti buna göre değişir.
- **Layered complexity** — Ana view sade, detay bir tık arkada. Complexity'i gizlemiyoruz, katmanlıyoruz.

---

## 3. Kapsam

### In Scope

- Campaign seviyesi performans tablosu (mevcut, yeniden tasarım)
- Ad Set seviyesi performans tablosu (yeni)
- Ad seviyesi performans tablosu (yeni)
- Platform-specific metrik alanları (Google Store Visits vb.)
- Cross-platform karşılaştırma view'u

### Out of Scope

- Budget reallocation recommendation engine
- Incrementality / lift analizi
- Mağaza bazlı (store-level) breakdown
- Otomatik alert / anomaly detection

---

## 4. Metrik Framework'ü

Her seviyede üç metrik tipi var. Görsel hiyerarşi buna göre belirlenir:

| Metrik Tipi | Amaç | Örnek | Görünürlük |
|---|---|---|---|
| **Volume** | Ne kadar oldu? | Offline Conversions, Offline Revenue, Spend | Her zaman görünür |
| **Efficiency** | Ne kadar verimli? | Offline ROAS, Cost per Offline Conv. | Her zaman görünür |
| **Diagnostic** | Neden öyle oldu? | Match Rate, Avg. Basket Size, Frequency | Drill-down / detail panel |

**Kritik kural:** Volume + Efficiency ana tabloda, Diagnostic bir tık arkada. Hepsini aynı ağırlıkta göstermek dashboard'u gürültüye çevirir.

---

## 5. Seviye Detayları

### 5.1 Campaign Seviyesi

**Karar:** *"Bu kampanyaya bütçe vermeye devam edeyim mi?"*

#### Primary Metrics (her zaman görünür)

| Metrik | Tanım | Neden Primary |
|---|---|---|
| Spend | Toplam reklam harcaması | Bağlam — ne kadar harcadım |
| Offline Conversions | Platforma eşleşen mağaza satış adedi | Volume — kaç satış atfedildi |
| Offline Revenue | Platforma eşleşen mağaza satış tutarı | Volume — ne kadar ciro atfedildi |
| Offline ROAS | Offline Revenue ÷ Spend | Efficiency — ana karar metriği |
| Cost per Offline Conv. | Spend ÷ Offline Conversions | Efficiency — birim maliyet |

#### Secondary Metrics (expand / detail panel)

| Metrik | Tanım | Neden Secondary |
|---|---|---|
| Online Conversions | Platform-reported online satış adedi | Karşılaştırma — online vs offline oranı |
| Online Revenue | Platform-reported online satış tutarı | Karşılaştırma |
| Omnichannel ROAS | (Online + Offline Revenue) ÷ Spend | Bütünsel bakış |
| Online ROAS | Online Revenue ÷ Spend | Referans — zaten platform dashboard'unda var |
| Impressions | Toplam gösterim | Bağlam — kampanya seviyesinde karar verdirtmez |
| Clicks | Toplam tıklama | Bağlam |
| Match Rate | Eşleşen POS verisi / gönderilen POS verisi | Diagnostic — düşük ROAS'ın sebebi data mı performans mı? |

**Görsel hiyerarşi:** Offline ROAS kolonu renk kodlu (yeşil = hedef üstü, kırmızı = hedef altı). Dashboard açıldığında kullanıcının gözü ilk buraya gitmeli.

---

### 5.2 Ad Set Seviyesi

**Karar:** *"Hangi audience'a para harcayalım?"*

Bu seviyede karşılaştırma (comparison view) her şeyden önemli. Tek bir ad set'in metrikleri tek başına anlamsız — yan yana görülmeli.

#### Primary Metrics

| Metrik | Tanım | Neden Önemli |
|---|---|---|
| Spend | Toplam reklam harcaması | Bağlam |
| Offline ROAS | Offline Revenue ÷ Spend | Efficiency — ana karar metriği |
| Cost per Offline Conv. | Spend ÷ Offline Conversions | Birim maliyet karşılaştırması |
| Avg. Basket Size | Offline Revenue ÷ Offline Conversions | Audience kalitesi — aynı ROAS'lı iki audience'ı ayırır |

#### Secondary Metrics

| Metrik | Tanım |
|---|---|
| Offline Conversions | Satış adedi (volume) |
| Offline Revenue | Satış tutarı (volume) |
| Frequency | Aynı kişiye ortalama kaç gösterim — offline dönüşüm sweet spot'u var mı? |
| Offline Conversion Rate | Offline Conversions ÷ Clicks — hangi audience reklamdan satışa dönüşüyor |
| Omnichannel ROAS | Bütünsel bakış |

**Avg. Basket Size neden burada:** Audience A çok conversion yapıyor ama küçük sepet, Audience B az conversion ama büyük sepet. Aynı ROAS'a sahip olabilirler ama stratejik olarak farklı audience'lar. Bu metrik kampanya seviyesinde gereksiz, ad set seviyesinde kritik.

---

### 5.3 Ad Seviyesi

**Karar:** *"Hangi creative mağazada satış yaratıyor?"*

Bu seviyede radikal sadeleştirme şart. Bir kampanyada 10-20 creative olabilir. Soru binary: bu creative çalışıyor mu çalışmıyor mu?

#### Primary Metrics — Maksimum 3 Kolon

| Metrik | Tanım | Neden |
|---|---|---|
| Spend | Toplam reklam harcaması | Bağlam |
| Offline Conversions | Mağaza satış adedi | Bu creative çalışıyor mu? |
| Offline ROAS | Offline Revenue ÷ Spend | Ne kadar verimli çalışıyor? |

#### Secondary Metrics

| Metrik | Tanım |
|---|---|
| Cost per Offline Conv. | Birim maliyet |
| Offline Revenue | Satış tutarı |
| Offline Conversion Rate | Offline Conversions ÷ Clicks — hangi creative tıklamayı satışa çeviriyor |

**Neden 3 kolon:** Ad seviyesinde 20 satıra 8 kolon koyarsan tablo okunmaz. Kullanıcı burada hızlı tarama yapıyor, derinlemesine analiz değil. Detay isteyen expand eder.

---

## 6. Platform Transparency Yaklaşımı

VenueX, platformların metodoloji farklarını gizlemez ama kullanıcının yüzüne de vurmaz. Yaklaşım: layered transparency.

### 6.1 Ortak Tablo

Cross-platform ana tabloda sadece her platformda ortak olan metrikler gösterilir. Platform-specific metrikler (Google Store Visits vb.) ortak tabloyu kirletmez.

### 6.2 Platform-Specific Alanlar

Bir kampanya satırı expand edildiğinde veya platform detayına girildiğinde, o platforma özel metrikler görünür:

- **Google:** Store Visits, Cost per Store Visit (CPSV), Click-to-Visit Rate
- **Meta:** Şu an platform-specific ek metrik yok
- **TikTok:** Şu an platform-specific ek metrik yok

### 6.3 Match Rate Gösterimi

Her platform satırında match rate erişilebilir olmalı (info icon veya detail panel). Düşük match rate, düşük ROAS'ın sebebinin kampanya performansı değil data kalitesi olabileceğine işaret eder. Bu VenueX'in unique değer katmanıdır.

---

## 7. UI / UX Gereksinimleri

### 7.1 Kolon Sırası

Tablodaki kolonlar kullanıcının doğal düşünce akışını izlemeli:

**Kampanya Adı → Platform → Spend → Offline Conversions → Offline Revenue → Offline ROAS → Cost per Offline Conv.**

Bu sıra "ne kadar harcadım → ne döndü → ne kadar verimli" hikayesini anlatır.

### 7.2 Görsel Hiyerarşi

- **Hero kolon:** Offline ROAS — renk kodlu (yeşil/kırmızı), daha büyük font veya bold. Dashboard açıldığında gözün ilk gittiği yer burası olmalı.
- **Volume kolonları:** Normal ağırlık, okunabilir ama öne çıkmaz.
- **Secondary metrikler:** Expand/collapse veya detail panel'da. Ana tabloda görünmez.

### 7.3 Navigasyon

- **Campaign → Ad Set:** Kampanya satırına tıklayınca veya expand edince altındaki ad set'ler görünür.
- **Ad Set → Ad:** Ad set satırına tıklayınca altındaki ad'ler görünür.
- **Breadcrumb:** Her zaman hangi seviyede olduğun görünür: Campaign > Ad Set > Ad

### 7.4 Filtreleme ve Sıralama

- Platform filtresi (Google, Meta, TikTok — çoklu seçim)
- Tarih aralığı seçici
- Tüm metrik kolonlarında sıralama (ascending / descending)
- Kampanya arama (isimle)

### 7.5 Trend Gösterimi

Campaign seviyesinde Offline ROAS kolon hücresinde micro-sparkline veya trend ok işareti (↑ ↓). Bu kullanıcıya "bu kampanya iyiye mi gidiyor kötüye mi" sorusunu tek bakışta cevaplatır. Detaylı trend chart drill-down'da.

---

## 8. Data Gereksinimleri

### 8.1 Veri Kaynakları

| Platform | API | Dönen Offline Metrikler |
|---|---|---|
| Google Ads | Google Ads API | Offline Conversions, Offline Conv. Value, Store Visits (ek) |
| Meta | Marketing API | Offline Conversions, Offline Conv. Value |
| TikTok | TikTok Marketing API | Offline Conversions, Offline Conv. Value |

### 8.2 Match Rate Hesaplama

Match Rate = Platforma eşleşen POS kayıt sayısı ÷ Toplam gönderilen POS kayıt sayısı. Bu veri VenueX'in kendi pipeline'ından hesaplanabilir, platform API'sine bağımlı değil.

### 8.3 Data Freshness

Data güncelliği platformlara bağlıdır. Her platform satırında "Son güncelleme" bilgisi gösterilmeli (örneğin: "Google: 6 saat önce ✅" / "Meta: 2 gün önce ⚠️"). Bu beklenti yönetimi için kritik.

---

## 9. Başarı Metrikleri

| Metrik | Hedef | Ölçüm Yöntemi |
|---|---|---|
| Time to insight | Kullanıcı 3 saniyede en iyi/en kötü kampanyayı seçebilmeli | Kullanıcı testi |
| Feature adoption | Mevcut kullanıcıların %80'i ad set seviyesine iniyor | Analytics |
| Platform login azalması | Kullanıcılar offline metrikleri kontrol için platform dashboard'una daha az giriyor | Kullanıcı feedback |
| Export kullanımı | Aylık rapor export sayısı | Analytics |

---

## 10. Faz Planı

### Faz 1 — Tablo Yeniden Tasarımı

- Campaign seviyesi tablonun kolon sırası ve görsel hiyerarşi düzeltmesi
- Primary / Secondary metrik ayrımı (expand/collapse)
- Offline ROAS renk kodlaması
- Platform-specific metriklerin ayrı alana taşınması

### Faz 2 — Granularity

- Ad Set seviyesi tablosu
- Ad seviyesi tablosu
- Campaign → Ad Set → Ad navigasyonu

### Faz 3 — Diagnostic Katmanı

- Match Rate gösterimi
- Data freshness indicator'ları
- Trend sparkline'lar
- Rapor export (CSV, PDF)

---

## 11. Açık Sorular

| Soru | Kimden Bekleniyor | Etkilediği Alan |
|---|---|---|
| Platform API'larından ad set / ad seviyesinde offline conversion dönüyor mu? | Çağdaş | Faz 2 scope |
| Match Rate platform bazlı hesaplanabiliyor mu mevcut pipeline'da? | Çağdaş | Faz 3 scope |
| Müşteriler hangi export formatı istiyor? (CSV, PDF, Google Sheets) | Müşteri görüşmeleri | Faz 3 scope |
| Google Store Visits verisi API'dan campaign / ad set / ad seviyesinde çekilebiliyor mu? | Çağdaş | Platform-specific alan tasarımı |
| Omnichannel ROAS müşteri için gerçekten değerli mi yoksa Offline ROAS yeterli mi? | Müşteri feedback | Metrik seti sadeleştirme |
