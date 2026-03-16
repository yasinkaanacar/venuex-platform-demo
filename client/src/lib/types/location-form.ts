import { z } from 'zod';
import { DaysEnum } from './common';

// Working hours per day — extends RegularHoursDto with UI-specific fields
// Production shape: { openDay, closeDay, openTime, closeTime, active }
// UI extensions: dayLabel (derived), is24Hours (helper), breaks (multi-period)
export const workingHoursDaySchema = z.object({
  openDay: z.nativeEnum(DaysEnum),
  closeDay: z.nativeEnum(DaysEnum),
  active: z.boolean(),
  openTime: z.string(),  // 'HH:MM'
  closeTime: z.string(), // 'HH:MM'
  is24Hours: z.boolean(),
  breaks: z.array(z.object({ start: z.string(), end: z.string() })),
});

export type WorkingHoursDay = z.infer<typeof workingHoursDaySchema>;

// Amenity category for grouped display
export interface AmenityCategory {
  id: string;
  label: string;
  labelTr: string;
  items: Array<{ id: string; label: string; labelTr: string }>;
}

// Main location form schema (flat — one RHF form instance)
// Address fields align with production AddressDto:
//   lat, lng (numbers), countryCode, administrativeArea, locality, sublocality, fullAddress, postalCode
// Working hours align with production RegularHoursDto:
//   openDay/closeDay (DaysEnum), openTime, closeTime, active
export const locationFormSchema = z.object({
  // Section 1: Basic Info (Temel Bilgiler)
  name: z.string().min(1, 'Konum adı zorunludur'),
  storeCode: z.string(),
  description: z.string(),
  googleCategory: z.string(),
  metaCategory: z.string(),
  appleCategory: z.string(),
  yandexCategory: z.string(),
  authority: z.string(),
  phone: z.string(),
  phoneCountryCode: z.string().default('+90'),
  website: z.string().url('Geçerli bir URL girin').or(z.literal('')),
  additionalPhones: z.array(z.string()),

  // Section 2: Social Media (Sosyal Medya)
  facebook: z.string(),
  instagram: z.string(),
  twitter: z.string(),
  tiktok: z.string(),
  youtube: z.string(),
  pinterest: z.string(),
  linkedin: z.string(),

  // Section 3: Address + Map (Lokasyon) — mirrors AddressDto
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  countryCode: z.string().default('TR'),
  administrativeArea: z.string(), // province/city (e.g. Istanbul)
  fullAddress: z.string(),        // street address line
  locality: z.string(),           // district (e.g. Şişli)
  sublocality: z.string(),        // neighborhood (e.g. Nişantaşı)
  postalCode: z.string(),
  addressLines: z.array(z.string()).default([]),

  // Section 4: Working Hours (Çalışma Saatleri)
  locationStatus: z.enum(['open', 'closed_temporarily', 'closed_permanently']).default('open'),
  workingHours: z.array(workingHoursDaySchema),

  // Section 5: Amenities (Olanaklar)
  amenities: z.array(z.string()),
});

export type LocationFormData = z.infer<typeof locationFormSchema>;

// Full record includes ID + timestamps (what the mock service returns)
export interface LocationFormRecord extends LocationFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
  // Edit-only fields (photos)
  photos: Array<{ id: string; url: string; platform: string; uploadedAt: string }>;
  coverPhotos: Record<string, string | null>; // platform -> url
}

// Day label lookup for UI display (Turkish)
export const DAY_LABELS: Record<DaysEnum, { en: string; tr: string }> = {
  [DaysEnum.MONDAY]: { en: 'Monday', tr: 'Pazartesi' },
  [DaysEnum.TUESDAY]: { en: 'Tuesday', tr: 'Salı' },
  [DaysEnum.WEDNESDAY]: { en: 'Wednesday', tr: 'Çarşamba' },
  [DaysEnum.THURSDAY]: { en: 'Thursday', tr: 'Perşembe' },
  [DaysEnum.FRIDAY]: { en: 'Friday', tr: 'Cuma' },
  [DaysEnum.SATURDAY]: { en: 'Saturday', tr: 'Cumartesi' },
  [DaysEnum.SUNDAY]: { en: 'Sunday', tr: 'Pazar' },
};

// Short day labels for pill buttons
export const DAY_SHORT_LABELS: Record<DaysEnum, { en: string; tr: string }> = {
  [DaysEnum.MONDAY]: { en: 'Mon', tr: 'Pzt' },
  [DaysEnum.TUESDAY]: { en: 'Tue', tr: 'Sal' },
  [DaysEnum.WEDNESDAY]: { en: 'Wed', tr: 'Çar' },
  [DaysEnum.THURSDAY]: { en: 'Thu', tr: 'Per' },
  [DaysEnum.FRIDAY]: { en: 'Fri', tr: 'Cum' },
  [DaysEnum.SATURDAY]: { en: 'Sat', tr: 'Cmt' },
  [DaysEnum.SUNDAY]: { en: 'Sun', tr: 'Paz' },
};

// Ordered days for iteration
export const ORDERED_DAYS: DaysEnum[] = [
  DaysEnum.MONDAY,
  DaysEnum.TUESDAY,
  DaysEnum.WEDNESDAY,
  DaysEnum.THURSDAY,
  DaysEnum.FRIDAY,
  DaysEnum.SATURDAY,
  DaysEnum.SUNDAY,
];

// Helper to create a default working hours entry
function defaultDay(day: DaysEnum, active: boolean, openTime = '09:00', closeTime = '18:00'): WorkingHoursDay {
  return { openDay: day, closeDay: day, active, openTime, closeTime, is24Hours: false, breaks: [] };
}

// Empty form defaults for Add mode
export const emptyLocationFormData: LocationFormData = {
  name: '',
  storeCode: '',
  description: '',
  googleCategory: '',
  metaCategory: '',
  appleCategory: '',
  yandexCategory: '',
  authority: '',
  phone: '',
  phoneCountryCode: '+90',
  website: '',
  additionalPhones: [],
  facebook: '',
  instagram: '',
  twitter: '',
  tiktok: '',
  youtube: '',
  pinterest: '',
  linkedin: '',
  lat: 0,
  lng: 0,
  countryCode: 'TR',
  administrativeArea: '',
  fullAddress: '',
  locality: '',
  sublocality: '',
  postalCode: '',
  addressLines: [],
  locationStatus: 'open',
  workingHours: [
    defaultDay(DaysEnum.MONDAY, true),
    defaultDay(DaysEnum.TUESDAY, true),
    defaultDay(DaysEnum.WEDNESDAY, true),
    defaultDay(DaysEnum.THURSDAY, true),
    defaultDay(DaysEnum.FRIDAY, true),
    defaultDay(DaysEnum.SATURDAY, true, '10:00', '17:00'),
    defaultDay(DaysEnum.SUNDAY, false),
  ],
  amenities: [],
};

// Amenity categories with realistic Turkish market data
export const AMENITY_CATEGORIES: AmenityCategory[] = [
  {
    id: 'payments', label: 'Payments', labelTr: 'Ödemeler',
    items: [
      { id: 'visa', label: 'Visa', labelTr: 'Visa' },
      { id: 'mastercard', label: 'MasterCard', labelTr: 'MasterCard' },
      { id: 'amex', label: 'American Express', labelTr: 'American Express' },
      { id: 'discover', label: 'Discover', labelTr: 'Discover' },
      { id: 'nfc', label: 'NFC Payments', labelTr: 'NFC Ödeme' },
      { id: 'apple-pay', label: 'Apple Pay', labelTr: 'Apple Pay' },
      { id: 'google-pay', label: 'Google Pay', labelTr: 'Google Pay' },
      { id: 'samsung-pay', label: 'Samsung Pay', labelTr: 'Samsung Pay' },
      { id: 'cash', label: 'Cash', labelTr: 'Nakit' },
      { id: 'debit', label: 'Debit Cards', labelTr: 'Banka Kartı' },
      { id: 'troy', label: 'Troy', labelTr: 'Troy' },
      { id: 'installment', label: 'Installment', labelTr: 'Taksit' },
    ],
  },
  {
    id: 'recycling', label: 'Recycling', labelTr: 'Geri Dönüşüm',
    items: [
      { id: 'paper', label: 'Paper', labelTr: 'Kağıt' },
      { id: 'plastic', label: 'Plastic', labelTr: 'Plastik' },
      { id: 'glass', label: 'Glass', labelTr: 'Cam' },
      { id: 'electronics', label: 'Electronics', labelTr: 'Elektronik' },
      { id: 'batteries', label: 'Batteries', labelTr: 'Piller' },
      { id: 'textiles', label: 'Textiles', labelTr: 'Tekstil' },
    ],
  },
  {
    id: 'toilets', label: 'Toilets', labelTr: 'Tuvaletler',
    items: [
      { id: 'public-toilets', label: 'Public Toilets', labelTr: 'Genel Tuvalet' },
      { id: 'baby-changing', label: 'Baby Changing', labelTr: 'Bebek Bakım' },
    ],
  },
  {
    id: 'products', label: 'Products', labelTr: 'Ürünler',
    items: [
      { id: 'clothing', label: 'Clothing', labelTr: 'Giyim' },
      { id: 'electronics-p', label: 'Electronics', labelTr: 'Elektronik' },
      { id: 'home-goods', label: 'Home Goods', labelTr: 'Ev Ürünleri' },
      { id: 'food-drink', label: 'Food & Drink', labelTr: 'Yiyecek & İçecek' },
      { id: 'cosmetics', label: 'Cosmetics', labelTr: 'Kozmetik' },
      { id: 'accessories', label: 'Accessories', labelTr: 'Aksesuar' },
      { id: 'shoes', label: 'Shoes', labelTr: 'Ayakkabı' },
      { id: 'sports', label: 'Sports', labelTr: 'Spor' },
      { id: 'toys', label: 'Toys', labelTr: 'Oyuncak' },
      { id: 'books', label: 'Books', labelTr: 'Kitap' },
    ],
  },
  {
    id: 'accessibility', label: 'Accessibility', labelTr: 'Erişilebilirlik',
    items: [
      { id: 'wheelchair', label: 'Wheelchair Access', labelTr: 'Tekerlekli Sandalye Erişimi' },
      { id: 'elevator', label: 'Elevator', labelTr: 'Asansör' },
      { id: 'braille', label: 'Braille Signs', labelTr: 'Braille İşaretleri' },
      { id: 'hearing-loop', label: 'Hearing Loop', labelTr: 'İşitme Döngüsü' },
      { id: 'accessible-parking', label: 'Accessible Parking', labelTr: 'Engelli Parkı' },
      { id: 'guide-dogs', label: 'Guide Dogs Allowed', labelTr: 'Rehber Köpek Kabul' },
    ],
  },
  {
    id: 'parking', label: 'Parking', labelTr: 'Park Etme',
    items: [
      { id: 'free-parking', label: 'Free Parking', labelTr: 'Ücretsiz Park' },
      { id: 'paid-parking', label: 'Paid Parking', labelTr: 'Ücretli Park' },
      { id: 'street-parking', label: 'Street Parking', labelTr: 'Sokak Parkı' },
      { id: 'garage', label: 'Parking Garage', labelTr: 'Otopark' },
      { id: 'valet', label: 'Valet Parking', labelTr: 'Vale Hizmeti' },
      { id: 'ev-charging', label: 'EV Charging', labelTr: 'Elektrikli Araç Şarjı' },
    ],
  },
  {
    id: 'services', label: 'Services', labelTr: 'Hizmetler',
    items: [
      { id: 'gift-wrapping', label: 'Gift Wrapping', labelTr: 'Hediye Paketleme' },
      { id: 'delivery', label: 'Delivery', labelTr: 'Teslimat' },
      { id: 'alterations', label: 'Alterations', labelTr: 'Tadilat' },
      { id: 'personal-shopping', label: 'Personal Shopping', labelTr: 'Kişisel Alışveriş' },
      { id: 'returns', label: 'Returns', labelTr: 'İade' },
      { id: 'layaway', label: 'Layaway', labelTr: 'Avans' },
      { id: 'curbside', label: 'Curbside Pickup', labelTr: 'Araçtan Teslim' },
      { id: 'in-store-pickup', label: 'In-Store Pickup', labelTr: 'Mağazadan Teslim' },
    ],
  },
  {
    id: 'technology', label: 'Technology', labelTr: 'Teknoloji',
    items: [
      { id: 'wifi', label: 'Free WiFi', labelTr: 'Ücretsiz WiFi' },
      { id: 'ac', label: 'Air Conditioning', labelTr: 'Klima' },
    ],
  },
  {
    id: 'security', label: 'Security', labelTr: 'Güvenlik',
    items: [
      { id: 'cctv', label: 'CCTV', labelTr: 'Güvenlik Kamerası' },
      { id: 'security-guard', label: 'Security Guard', labelTr: 'Güvenlik Görevlisi' },
    ],
  },
  {
    id: 'pets', label: 'Pets', labelTr: 'Evcil Hayvanlar',
    items: [
      { id: 'pets-allowed', label: 'Pets Allowed', labelTr: 'Evcil Hayvan Kabul' },
      { id: 'pets-not-allowed', label: 'No Pets', labelTr: 'Evcil Hayvan Yok' },
    ],
  },
];

// Platform category options for dropdowns
export const PLATFORM_CATEGORIES = {
  google: ['Department Store', 'Clothing Store', 'Shopping Mall', 'Electronics Store', 'Home Goods Store', 'Sports Store', 'Jewelry Store', 'Cosmetics Store', 'Furniture Store', 'Shoe Store'],
  meta: ['Department Store', 'Clothing Store', 'Shopping Mall', 'Electronics Store', 'Home Goods Store', 'Sports Store', 'Jewelry Store', 'Cosmetics Store'],
  apple: ['Department Store', 'Clothing Store', 'Shopping Center', 'Electronics Store', 'Homeware Store', 'Sporting Goods', 'Jewelry Store', 'Beauty Store'],
  yandex: ['Büyük mağazalar', 'Giyim mağazası', 'Alışveriş merkezi', 'Elektronik mağazası', 'Ev eşyaları', 'Spor mağazası', 'Mücevherat', 'Kozmetik'],
};

// Turkish city/province list for dropdown
export const TURKISH_CITIES = [
  'Istanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep',
  'Mersin', 'Diyarbakır', 'Kayseri', 'Eskişehir', 'Trabzon', 'Samsun', 'Denizli',
  'Malatya', 'Sakarya', 'Manisa', 'Muğla', 'Balıkesir',
];
