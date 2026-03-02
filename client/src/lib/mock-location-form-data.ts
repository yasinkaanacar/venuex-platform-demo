import { LocationFormData, LocationFormRecord } from './types/location-form';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Internal mutable state — simulates server-side state within the session
let locationFormRecords: LocationFormRecord[] = [
  // Record 1: Downtown Fashion Store in Nişantaşı, Istanbul
  {
    id: '1',
    name: 'Karaca Nişantaşı',
    storeCode: 'KRC-IST-001',
    description: 'Nişantaşı\'nın kalbinde yer alan Karaca mağazamız, ev tekstili, mutfak eşyaları ve dekorasyon ürünleri konusunda geniş bir ürün yelpazesi sunmaktadır.',
    metaCategory: 'Department Store',
    appleCategory: 'Department Store',
    yandexCategory: 'Büyük mağazalar',
    authority: 'Türkiye',
    phone: '2122310045',
    phoneCountryCode: '+90',
    website: 'https://www.karaca.com',
    additionalPhones: ['2122310046'],
    facebook: 'https://facebook.com/karaca',
    instagram: 'https://instagram.com/karaca',
    twitter: 'https://twitter.com/karaca',
    tiktok: '',
    youtube: 'https://youtube.com/@karaca',
    pinterest: '',
    linkedin: '',
    latitude: '41.048782',
    longitude: '28.994584',
    country: 'Türkiye',
    city: 'Istanbul',
    address: 'Abdi İpekçi Caddesi No:23',
    district: 'Şişli',
    neighborhood: 'Nişantaşı',
    postalCode: '34367',
    locationStatus: 'open',
    workingHours: [
      { day: 'Mon', dayLabel: 'Pazartesi', isOpen: true, openTime: '10:00', closeTime: '20:00', is24Hours: false, breaks: [] },
      { day: 'Tue', dayLabel: 'Salı', isOpen: true, openTime: '10:00', closeTime: '20:00', is24Hours: false, breaks: [] },
      { day: 'Wed', dayLabel: 'Çarşamba', isOpen: true, openTime: '10:00', closeTime: '20:00', is24Hours: false, breaks: [] },
      { day: 'Thu', dayLabel: 'Perşembe', isOpen: true, openTime: '10:00', closeTime: '20:00', is24Hours: false, breaks: [] },
      { day: 'Fri', dayLabel: 'Cuma', isOpen: true, openTime: '10:00', closeTime: '21:00', is24Hours: false, breaks: [] },
      { day: 'Sat', dayLabel: 'Cumartesi', isOpen: true, openTime: '10:00', closeTime: '21:00', is24Hours: false, breaks: [] },
      { day: 'Sun', dayLabel: 'Pazar', isOpen: true, openTime: '11:00', closeTime: '20:00', is24Hours: false, breaks: [] },
    ],
    amenities: ['visa', 'mastercard', 'troy', 'installment', 'nfc', 'wifi', 'wheelchair', 'elevator', 'free-parking', 'gift-wrapping', 'returns', 'cctv'],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2025-11-20T14:30:00Z',
    photos: [
      { id: 'ph-1-1', url: 'https://picsum.photos/seed/karaca-nist-1/800/600', platform: 'gbp', uploadedAt: '2024-06-01T10:00:00Z' },
      { id: 'ph-1-2', url: 'https://picsum.photos/seed/karaca-nist-2/800/600', platform: 'gbp', uploadedAt: '2024-08-15T11:00:00Z' },
      { id: 'ph-1-3', url: 'https://picsum.photos/seed/karaca-nist-3/800/600', platform: 'meta', uploadedAt: '2024-09-10T09:30:00Z' },
    ],
    coverPhotos: {
      gbp: 'https://picsum.photos/seed/karaca-nist-cover/1200/400',
      meta: 'https://picsum.photos/seed/karaca-nist-meta-cover/1200/400',
      apple: null,
    },
  },

  // Record 2: Kadıköy Electronics Hub in Kadıköy, Istanbul
  {
    id: '2',
    name: 'Karaca Kadıköy',
    storeCode: 'KRC-IST-002',
    description: 'Kadıköy\'de konumlanan Karaca mağazamız; mutfak gereçleri, sofra takımları ve ev dekorasyonu kategorilerinde Anadolu yakasının en geniş koleksiyonunu sunmaktadır.',
    metaCategory: 'Home Goods Store',
    appleCategory: 'Homeware Store',
    yandexCategory: 'Ev eşyaları',
    authority: 'Türkiye',
    phone: '2163457890',
    phoneCountryCode: '+90',
    website: 'https://www.karaca.com',
    additionalPhones: [],
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: '',
    youtube: '',
    pinterest: '',
    linkedin: '',
    latitude: '40.990490',
    longitude: '29.029870',
    country: 'Türkiye',
    city: 'Istanbul',
    address: 'Bahariye Caddesi No:45',
    district: 'Kadıköy',
    neighborhood: 'Moda',
    postalCode: '34710',
    locationStatus: 'open',
    workingHours: [
      { day: 'Mon', dayLabel: 'Pazartesi', isOpen: true, openTime: '09:30', closeTime: '19:30', is24Hours: false, breaks: [] },
      { day: 'Tue', dayLabel: 'Salı', isOpen: true, openTime: '09:30', closeTime: '19:30', is24Hours: false, breaks: [] },
      { day: 'Wed', dayLabel: 'Çarşamba', isOpen: true, openTime: '09:30', closeTime: '19:30', is24Hours: false, breaks: [] },
      { day: 'Thu', dayLabel: 'Perşembe', isOpen: true, openTime: '09:30', closeTime: '19:30', is24Hours: false, breaks: [] },
      { day: 'Fri', dayLabel: 'Cuma', isOpen: true, openTime: '09:30', closeTime: '20:00', is24Hours: false, breaks: [] },
      { day: 'Sat', dayLabel: 'Cumartesi', isOpen: true, openTime: '10:00', closeTime: '20:00', is24Hours: false, breaks: [] },
      { day: 'Sun', dayLabel: 'Pazar', isOpen: false, openTime: '', closeTime: '', is24Hours: false, breaks: [] },
    ],
    amenities: ['visa', 'mastercard', 'troy', 'cash', 'wifi', 'returns', 'in-store-pickup'],
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2025-10-05T16:00:00Z',
    photos: [
      { id: 'ph-2-1', url: 'https://picsum.photos/seed/karaca-kdk-1/800/600', platform: 'gbp', uploadedAt: '2024-07-20T10:00:00Z' },
      { id: 'ph-2-2', url: 'https://picsum.photos/seed/karaca-kdk-2/800/600', platform: 'gbp', uploadedAt: '2024-10-01T09:00:00Z' },
    ],
    coverPhotos: {
      gbp: 'https://picsum.photos/seed/karaca-kdk-cover/1200/400',
      meta: null,
      apple: null,
    },
  },

  // Record 3: Ankara Central Market in Kızılay, Ankara — temporarily closed
  {
    id: '3',
    name: 'Karaca Kızılay',
    storeCode: 'KRC-ANK-001',
    description: 'Ankara\'nın merkezi Kızılay\'da bulunan Karaca mağazamız, ev tekstili ve mutfak eşyaları konusunda başkentteki müşterilerimize hizmet vermektedir. Yenileme çalışmaları nedeniyle geçici olarak kapalıdır.',
    metaCategory: 'Department Store',
    appleCategory: 'Department Store',
    yandexCategory: 'Büyük mağazalar',
    authority: 'Türkiye',
    phone: '3124178800',
    phoneCountryCode: '+90',
    website: 'https://www.karaca.com',
    additionalPhones: ['3124178801', '3124178802'],
    facebook: 'https://facebook.com/karaca',
    instagram: 'https://instagram.com/karaca',
    twitter: 'https://twitter.com/karaca',
    tiktok: 'https://tiktok.com/@karaca',
    youtube: 'https://youtube.com/@karaca',
    pinterest: 'https://pinterest.com/karaca',
    linkedin: 'https://linkedin.com/company/karaca',
    latitude: '39.920770',
    longitude: '32.853000',
    country: 'Türkiye',
    city: 'Ankara',
    address: 'Ziya Gökalp Caddesi No:12',
    district: 'Çankaya',
    neighborhood: 'Kızılay',
    postalCode: '06420',
    locationStatus: 'temporarily_closed',
    workingHours: [
      { day: 'Mon', dayLabel: 'Pazartesi', isOpen: true, openTime: '09:00', closeTime: '20:00', is24Hours: false, breaks: [] },
      { day: 'Tue', dayLabel: 'Salı', isOpen: true, openTime: '09:00', closeTime: '20:00', is24Hours: false, breaks: [] },
      { day: 'Wed', dayLabel: 'Çarşamba', isOpen: true, openTime: '09:00', closeTime: '20:00', is24Hours: false, breaks: [] },
      { day: 'Thu', dayLabel: 'Perşembe', isOpen: true, openTime: '09:00', closeTime: '20:00', is24Hours: false, breaks: [] },
      { day: 'Fri', dayLabel: 'Cuma', isOpen: true, openTime: '09:00', closeTime: '21:00', is24Hours: false, breaks: [] },
      { day: 'Sat', dayLabel: 'Cumartesi', isOpen: true, openTime: '10:00', closeTime: '21:00', is24Hours: false, breaks: [] },
      { day: 'Sun', dayLabel: 'Pazar', isOpen: true, openTime: '11:00', closeTime: '19:00', is24Hours: false, breaks: [] },
    ],
    amenities: ['visa', 'mastercard', 'amex', 'troy', 'installment', 'nfc', 'apple-pay', 'google-pay', 'cash', 'wifi', 'wheelchair', 'elevator', 'accessible-parking', 'free-parking', 'gift-wrapping', 'returns', 'delivery', 'cctv', 'security-guard'],
    createdAt: '2024-03-10T08:00:00Z',
    updatedAt: '2025-12-01T11:00:00Z',
    photos: [],
    coverPhotos: {
      gbp: null,
      meta: null,
      apple: null,
    },
  },
];

let nextId = 4;

export const locationFormDataService = {
  async getLocation(id: string): Promise<LocationFormRecord | null> {
    await delay(200);
    return locationFormRecords.find((r) => r.id === id) ?? null;
  },

  async createLocation(data: LocationFormData): Promise<LocationFormRecord> {
    await delay(300);
    const now = new Date().toISOString();
    const newRecord: LocationFormRecord = {
      ...data,
      id: String(nextId++),
      createdAt: now,
      updatedAt: now,
      photos: [],
      coverPhotos: { gbp: null, meta: null, apple: null },
    };
    locationFormRecords = [...locationFormRecords, newRecord];
    return newRecord;
  },

  async updateLocation(id: string, data: Partial<LocationFormData>): Promise<LocationFormRecord> {
    await delay(300);
    const idx = locationFormRecords.findIndex((r) => r.id === id);
    if (idx === -1) {
      throw new Error(`Location with id ${id} not found`);
    }
    const updated: LocationFormRecord = {
      ...locationFormRecords[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    locationFormRecords = [
      ...locationFormRecords.slice(0, idx),
      updated,
      ...locationFormRecords.slice(idx + 1),
    ];
    return updated;
  },
};
