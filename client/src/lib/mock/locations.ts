import { LocationStatusEnum, DaysEnum, RegularHoursDto } from '../types/common';
import { LocationDto, PlatformKey, PlatformSyncData, DataHealth, Channel, ChannelInfo, ChannelStatus } from '../types/locations';

// Helper to create platform sync data
const createPlatformSync = (
  status: PlatformSyncData['status'],
  lastSync: string | null,
  warnings: PlatformSyncData['warnings'] = []
): PlatformSyncData => ({ status, lastSync, warnings });

// Mock location data using production-aligned LocationDto
export const mockLocations: LocationDto[] = [
  {
    _id: '1',
    location_name: 'Downtown Fashion Store',
    brand: 'demo-brand-123',
    store_code: 'DFS001',
    address: {
      lat: 41.0332,
      lng: 28.9770,
      countryCode: 'TR',
      administrativeArea: 'İstanbul',
      locality: 'Istanbul',
      sublocality: 'Beyoğlu',
      fullAddress: '123 Main Street, Suite 100, Beyoğlu, Istanbul',
      addressLines: ['123 Main Street', 'Suite 100'],
    },
    primary_phone: '+90 212 123 4567',
    website: 'https://example.com/beyoglu',
    email: 'beyoglu@demo.com',
    location_status: LocationStatusEnum.OPEN,
    regular_hours: [
      { openDay: DaysEnum.MONDAY, closeDay: DaysEnum.MONDAY, openTime: '09:00', closeTime: '21:00', active: true },
      { openDay: DaysEnum.TUESDAY, closeDay: DaysEnum.TUESDAY, openTime: '09:00', closeTime: '21:00', active: true },
      { openDay: DaysEnum.WEDNESDAY, closeDay: DaysEnum.WEDNESDAY, openTime: '09:00', closeTime: '21:00', active: true },
      { openDay: DaysEnum.THURSDAY, closeDay: DaysEnum.THURSDAY, openTime: '09:00', closeTime: '21:00', active: true },
      { openDay: DaysEnum.FRIDAY, closeDay: DaysEnum.FRIDAY, openTime: '09:00', closeTime: '21:00', active: true },
      { openDay: DaysEnum.SATURDAY, closeDay: DaysEnum.SATURDAY, openTime: '09:00', closeTime: '21:00', active: true },
      { openDay: DaysEnum.SUNDAY, closeDay: DaysEnum.SUNDAY, openTime: '11:00', closeTime: '19:00', active: true },
    ],
    store_verification_status: { google: 'VERIFIED', apple: 'VERIFIED', meta: 'VERIFIED' },
    store_listing_status: { google: 'LISTED', apple: 'LISTED', meta: 'LISTED' },
    platforms: {
      google: createPlatformSync('live', '2024-09-05T10:30:00Z'),
      apple: createPlatformSync('live', '2024-09-05T09:15:00Z'),
      meta: createPlatformSync('action_required', '2024-09-04T14:22:00Z', [
        { type: 'image_missing', label: 'Photo needs update', platform: 'meta' },
      ]),
      yandex: createPlatformSync('not_connected', null),
    },
  },
  {
    _id: '2',
    location_name: 'Kadıköy Electronics Hub',
    brand: 'demo-brand-123',
    store_code: 'KEH002',
    address: {
      lat: 40.9903,
      lng: 29.0290,
      countryCode: 'TR',
      administrativeArea: 'İstanbul',
      locality: 'Istanbul',
      sublocality: 'Kadıköy',
      fullAddress: '456 Bahariye Street, Floor 2, Kadıköy, Istanbul',
      addressLines: ['456 Bahariye Street', 'Floor 2'],
    },
    primary_phone: '+90 216 987 6543',
    website: 'https://example.com/kadikoy',
    email: 'kadikoy@demo.com',
    location_status: LocationStatusEnum.OPEN,
    regular_hours: [
      { openDay: DaysEnum.MONDAY, closeDay: DaysEnum.MONDAY, openTime: '10:00', closeTime: '22:00', active: true },
      { openDay: DaysEnum.TUESDAY, closeDay: DaysEnum.TUESDAY, openTime: '10:00', closeTime: '22:00', active: true },
      { openDay: DaysEnum.WEDNESDAY, closeDay: DaysEnum.WEDNESDAY, openTime: '10:00', closeTime: '22:00', active: true },
      { openDay: DaysEnum.THURSDAY, closeDay: DaysEnum.THURSDAY, openTime: '10:00', closeTime: '22:00', active: true },
      { openDay: DaysEnum.FRIDAY, closeDay: DaysEnum.FRIDAY, openTime: '10:00', closeTime: '22:00', active: true },
      { openDay: DaysEnum.SATURDAY, closeDay: DaysEnum.SATURDAY, openTime: '10:00', closeTime: '22:00', active: true },
      { openDay: DaysEnum.SUNDAY, closeDay: DaysEnum.SUNDAY, openTime: '10:00', closeTime: '22:00', active: true },
    ],
    store_verification_status: { google: 'VERIFIED', meta: 'VERIFIED' },
    store_listing_status: { google: 'LISTED', meta: 'LISTED' },
    platforms: {
      google: createPlatformSync('live', '2024-09-05T11:00:00Z'),
      apple: createPlatformSync('not_connected', null),
      meta: createPlatformSync('live', '2024-09-05T09:30:00Z'),
      yandex: createPlatformSync('action_required', '2024-09-04T16:15:00Z', [
        { type: 'sync_error', label: 'Category mismatch', errorCode: 'validation_error', platform: 'yandex' },
      ]),
    },
  },
  {
    _id: '3',
    location_name: 'Ankara Central Market',
    brand: 'demo-brand-123',
    store_code: 'ACM003',
    address: {
      lat: 39.9208,
      lng: 32.8541,
      countryCode: 'TR',
      administrativeArea: 'Ankara',
      locality: 'Ankara',
      sublocality: 'Çankaya',
      fullAddress: '789 Kızılay Square, Building A, Çankaya, Ankara',
      addressLines: ['789 Kızılay Square', 'Building A'],
    },
    primary_phone: '+90 312 555 0123',
    website: 'https://example.com/ankara',
    email: 'ankara@demo.com',
    location_status: LocationStatusEnum.OPEN,
    regular_hours: [
      { openDay: DaysEnum.MONDAY, closeDay: DaysEnum.MONDAY, openTime: '08:00', closeTime: '20:00', active: true },
      { openDay: DaysEnum.TUESDAY, closeDay: DaysEnum.TUESDAY, openTime: '08:00', closeTime: '20:00', active: true },
      { openDay: DaysEnum.WEDNESDAY, closeDay: DaysEnum.WEDNESDAY, openTime: '08:00', closeTime: '20:00', active: true },
      { openDay: DaysEnum.THURSDAY, closeDay: DaysEnum.THURSDAY, openTime: '08:00', closeTime: '20:00', active: true },
      { openDay: DaysEnum.FRIDAY, closeDay: DaysEnum.FRIDAY, openTime: '08:00', closeTime: '20:00', active: true },
      { openDay: DaysEnum.SATURDAY, closeDay: DaysEnum.SATURDAY, openTime: '10:00', closeTime: '18:00', active: true },
      { openDay: DaysEnum.SUNDAY, closeDay: DaysEnum.SUNDAY, openTime: '10:00', closeTime: '18:00', active: true },
    ],
    store_verification_status: { google: 'VERIFIED', apple: 'VERIFIED', meta: 'VERIFIED' },
    store_listing_status: { google: 'LISTED', apple: 'LISTED', meta: 'LISTED' },
    platforms: {
      google: createPlatformSync('live', '2024-09-05T12:15:00Z'),
      apple: createPlatformSync('live', '2024-09-05T11:45:00Z'),
      meta: createPlatformSync('live', '2024-09-05T10:20:00Z'),
      yandex: createPlatformSync('live', '2024-09-05T09:50:00Z'),
    },
  },
  {
    _id: '4',
    location_name: 'İzmir Coastal Boutique',
    brand: 'demo-brand-123',
    store_code: 'ICB004',
    address: {
      lat: 38.4192,
      lng: 27.1287,
      countryCode: 'TR',
      administrativeArea: 'İzmir',
      locality: 'İzmir',
      sublocality: 'Konak',
      fullAddress: '321 Kordon Boulevard, Konak, İzmir',
      addressLines: ['321 Kordon Boulevard'],
    },
    primary_phone: '+90 232 444 7890',
    website: 'https://example.com/izmir',
    email: 'izmir@demo.com',
    location_status: LocationStatusEnum.OPEN,
    regular_hours: [
      { openDay: DaysEnum.MONDAY, closeDay: DaysEnum.MONDAY, openTime: '00:00', closeTime: '00:00', active: false },
      { openDay: DaysEnum.TUESDAY, closeDay: DaysEnum.TUESDAY, openTime: '11:00', closeTime: '20:00', active: true },
      { openDay: DaysEnum.WEDNESDAY, closeDay: DaysEnum.WEDNESDAY, openTime: '11:00', closeTime: '20:00', active: true },
      { openDay: DaysEnum.THURSDAY, closeDay: DaysEnum.THURSDAY, openTime: '11:00', closeTime: '20:00', active: true },
      { openDay: DaysEnum.FRIDAY, closeDay: DaysEnum.FRIDAY, openTime: '11:00', closeTime: '20:00', active: true },
      { openDay: DaysEnum.SATURDAY, closeDay: DaysEnum.SATURDAY, openTime: '11:00', closeTime: '20:00', active: true },
      { openDay: DaysEnum.SUNDAY, closeDay: DaysEnum.SUNDAY, openTime: '11:00', closeTime: '20:00', active: true },
    ],
    store_verification_status: { google: 'UNVERIFIED', meta: 'VERIFIED' },
    store_listing_status: { google: 'LISTED', meta: 'LISTED' },
    platforms: {
      google: createPlatformSync('action_required', '2024-09-03T15:30:00Z', [
        { type: 'sync_error', label: 'Hours incorrect', errorCode: 'validation_error', platform: 'google' },
      ]),
      apple: createPlatformSync('not_connected', null),
      meta: createPlatformSync('live', '2024-09-05T08:00:00Z'),
      yandex: createPlatformSync('action_required', '2024-09-04T12:00:00Z', [
        { type: 'address_error', label: 'Address mismatch', platform: 'yandex' },
      ]),
    },
  },
  {
    _id: '5',
    location_name: 'Bursa Textile Center',
    brand: 'demo-brand-123',
    store_code: 'BTC005',
    address: {
      lat: 40.1885,
      lng: 29.0610,
      countryCode: 'TR',
      administrativeArea: 'Bursa',
      locality: 'Bursa',
      sublocality: 'Osmangazi',
      fullAddress: '654 Atatürk Street, Commercial Complex, Osmangazi, Bursa',
      addressLines: ['654 Atatürk Street', 'Commercial Complex'],
    },
    primary_phone: '+90 224 333 2211',
    website: 'https://example.com/bursa',
    email: 'bursa@demo.com',
    location_status: LocationStatusEnum.OPEN,
    regular_hours: [
      { openDay: DaysEnum.MONDAY, closeDay: DaysEnum.MONDAY, openTime: '09:00', closeTime: '19:00', active: true },
      { openDay: DaysEnum.TUESDAY, closeDay: DaysEnum.TUESDAY, openTime: '09:00', closeTime: '19:00', active: true },
      { openDay: DaysEnum.WEDNESDAY, closeDay: DaysEnum.WEDNESDAY, openTime: '09:00', closeTime: '19:00', active: true },
      { openDay: DaysEnum.THURSDAY, closeDay: DaysEnum.THURSDAY, openTime: '09:00', closeTime: '19:00', active: true },
      { openDay: DaysEnum.FRIDAY, closeDay: DaysEnum.FRIDAY, openTime: '09:00', closeTime: '19:00', active: true },
      { openDay: DaysEnum.SATURDAY, closeDay: DaysEnum.SATURDAY, openTime: '09:00', closeTime: '19:00', active: true },
      { openDay: DaysEnum.SUNDAY, closeDay: DaysEnum.SUNDAY, openTime: '12:00', closeTime: '18:00', active: true },
    ],
    store_verification_status: { google: 'VERIFIED', apple: 'VERIFIED', meta: 'VERIFIED' },
    store_listing_status: { google: 'LISTED', apple: 'LISTED', meta: 'LISTED' },
    platforms: {
      google: createPlatformSync('live', '2024-09-05T13:00:00Z'),
      apple: createPlatformSync('live', '2024-09-05T12:30:00Z'),
      meta: createPlatformSync('action_required', '2024-09-04T18:00:00Z', [
        { type: 'sync_error', label: 'Low engagement', platform: 'meta' },
      ]),
      yandex: createPlatformSync('live', '2024-09-05T11:15:00Z'),
    },
  },
  {
    _id: '6',
    location_name: 'Antalya Beach Store',
    brand: 'demo-brand-123',
    store_code: 'ABS006',
    address: {
      lat: 36.8969,
      lng: 30.7133,
      countryCode: 'TR',
      administrativeArea: 'Antalya',
      locality: 'Antalya',
      sublocality: 'Muratpaşa',
      fullAddress: '987 Lara Beach Avenue, Muratpaşa, Antalya',
      addressLines: ['987 Lara Beach Avenue'],
    },
    primary_phone: '+90 242 666 5544',
    website: 'https://example.com/antalya',
    email: 'antalya@demo.com',
    location_status: LocationStatusEnum.OPEN,
    regular_hours: [
      { openDay: DaysEnum.MONDAY, closeDay: DaysEnum.MONDAY, openTime: '09:00', closeTime: '23:00', active: true },
      { openDay: DaysEnum.TUESDAY, closeDay: DaysEnum.TUESDAY, openTime: '09:00', closeTime: '23:00', active: true },
      { openDay: DaysEnum.WEDNESDAY, closeDay: DaysEnum.WEDNESDAY, openTime: '09:00', closeTime: '23:00', active: true },
      { openDay: DaysEnum.THURSDAY, closeDay: DaysEnum.THURSDAY, openTime: '09:00', closeTime: '23:00', active: true },
      { openDay: DaysEnum.FRIDAY, closeDay: DaysEnum.FRIDAY, openTime: '09:00', closeTime: '23:00', active: true },
      { openDay: DaysEnum.SATURDAY, closeDay: DaysEnum.SATURDAY, openTime: '09:00', closeTime: '23:00', active: true },
      { openDay: DaysEnum.SUNDAY, closeDay: DaysEnum.SUNDAY, openTime: '09:00', closeTime: '23:00', active: true },
    ],
    store_verification_status: { google: 'VERIFIED', apple: 'PENDING' },
    store_listing_status: { google: 'LISTED', meta: 'LISTED' },
    platforms: {
      google: createPlatformSync('live', '2024-09-05T14:20:00Z'),
      apple: createPlatformSync('action_required', '2024-09-04T10:15:00Z', [
        { type: 'sync_error', label: 'Seasonal hours update needed', platform: 'apple' },
      ]),
      meta: createPlatformSync('live', '2024-09-05T13:45:00Z'),
      yandex: createPlatformSync('not_connected', null),
    },
  },
  {
    _id: '7',
    location_name: 'Gaziantep Spice Market',
    brand: 'demo-brand-123',
    store_code: 'GSM007',
    address: {
      lat: 37.0662,
      lng: 37.3833,
      countryCode: 'TR',
      administrativeArea: 'Gaziantep',
      locality: 'Gaziantep',
      sublocality: 'Şahinbey',
      fullAddress: '147 Baklava Street, Historic Quarter, Şahinbey, Gaziantep',
      addressLines: ['147 Baklava Street', 'Historic Quarter'],
    },
    primary_phone: '+90 342 777 8899',
    website: 'https://example.com/gaziantep',
    email: 'gaziantep@demo.com',
    location_status: LocationStatusEnum.OPEN,
    regular_hours: [
      { openDay: DaysEnum.MONDAY, closeDay: DaysEnum.MONDAY, openTime: '07:00', closeTime: '21:00', active: true },
      { openDay: DaysEnum.TUESDAY, closeDay: DaysEnum.TUESDAY, openTime: '07:00', closeTime: '21:00', active: true },
      { openDay: DaysEnum.WEDNESDAY, closeDay: DaysEnum.WEDNESDAY, openTime: '07:00', closeTime: '21:00', active: true },
      { openDay: DaysEnum.THURSDAY, closeDay: DaysEnum.THURSDAY, openTime: '07:00', closeTime: '21:00', active: true },
      { openDay: DaysEnum.FRIDAY, closeDay: DaysEnum.FRIDAY, openTime: '07:00', closeTime: '21:00', active: true },
      { openDay: DaysEnum.SATURDAY, closeDay: DaysEnum.SATURDAY, openTime: '07:00', closeTime: '21:00', active: true },
      { openDay: DaysEnum.SUNDAY, closeDay: DaysEnum.SUNDAY, openTime: '08:00', closeTime: '18:00', active: true },
    ],
    store_verification_status: { google: 'VERIFIED', apple: 'VERIFIED', meta: 'VERIFIED' },
    store_listing_status: { google: 'LISTED', apple: 'LISTED', meta: 'LISTED', yandex: 'LISTED' },
    platforms: {
      google: createPlatformSync('live', '2024-09-05T15:00:00Z'),
      apple: createPlatformSync('live', '2024-09-05T14:30:00Z'),
      meta: createPlatformSync('live', '2024-09-05T13:20:00Z'),
      yandex: createPlatformSync('live', '2024-09-05T12:40:00Z'),
    },
  },
  {
    _id: '8',
    location_name: 'Trabzon Tea House',
    brand: 'demo-brand-123',
    store_code: 'TTH008',
    address: {
      lat: 41.0027,
      lng: 39.7168,
      countryCode: 'TR',
      administrativeArea: 'Trabzon',
      locality: 'Trabzon',
      sublocality: 'Ortahisar',
      fullAddress: '258 Uzun Street, Old Town, Ortahisar, Trabzon',
      addressLines: ['258 Uzun Street', 'Old Town'],
    },
    primary_phone: '+90 462 888 1122',
    website: 'https://example.com/trabzon',
    email: 'trabzon@demo.com',
    location_status: LocationStatusEnum.OPEN,
    regular_hours: [
      { openDay: DaysEnum.MONDAY, closeDay: DaysEnum.MONDAY, openTime: '06:00', closeTime: '00:00', active: true },
      { openDay: DaysEnum.TUESDAY, closeDay: DaysEnum.TUESDAY, openTime: '06:00', closeTime: '00:00', active: true },
      { openDay: DaysEnum.WEDNESDAY, closeDay: DaysEnum.WEDNESDAY, openTime: '06:00', closeTime: '00:00', active: true },
      { openDay: DaysEnum.THURSDAY, closeDay: DaysEnum.THURSDAY, openTime: '06:00', closeTime: '00:00', active: true },
      { openDay: DaysEnum.FRIDAY, closeDay: DaysEnum.FRIDAY, openTime: '06:00', closeTime: '00:00', active: true },
      { openDay: DaysEnum.SATURDAY, closeDay: DaysEnum.SATURDAY, openTime: '06:00', closeTime: '00:00', active: true },
      { openDay: DaysEnum.SUNDAY, closeDay: DaysEnum.SUNDAY, openTime: '06:00', closeTime: '00:00', active: true },
    ],
    store_verification_status: { google: 'UNVERIFIED', meta: 'VERIFIED' },
    store_listing_status: { google: 'LISTED', meta: 'LISTED', yandex: 'LISTED' },
    platforms: {
      google: createPlatformSync('action_required', '2024-09-04T20:00:00Z', [
        { type: 'sync_error', label: 'Menu needs translation', errorCode: 'validation_error', platform: 'google' },
      ]),
      apple: createPlatformSync('not_connected', null),
      meta: createPlatformSync('live', '2024-09-05T16:00:00Z'),
      yandex: createPlatformSync('live', '2024-09-05T15:30:00Z'),
    },
  },
  {
    _id: '9',
    location_name: 'Konya Carpet Gallery',
    brand: 'demo-brand-123',
    store_code: 'KCG009',
    address: {
      lat: 37.8746,
      lng: 32.4932,
      countryCode: 'TR',
      administrativeArea: 'Konya',
      locality: 'Konya',
      sublocality: 'Selçuklu',
      fullAddress: '369 Mevlana Avenue, Art District, Selçuklu, Konya',
      addressLines: ['369 Mevlana Avenue', 'Art District'],
    },
    primary_phone: '+90 332 999 3344',
    website: 'https://example.com/konya',
    email: 'konya@demo.com',
    location_status: LocationStatusEnum.OPEN,
    regular_hours: [
      { openDay: DaysEnum.MONDAY, closeDay: DaysEnum.MONDAY, openTime: '09:00', closeTime: '18:00', active: true },
      { openDay: DaysEnum.TUESDAY, closeDay: DaysEnum.TUESDAY, openTime: '09:00', closeTime: '18:00', active: true },
      { openDay: DaysEnum.WEDNESDAY, closeDay: DaysEnum.WEDNESDAY, openTime: '09:00', closeTime: '18:00', active: true },
      { openDay: DaysEnum.THURSDAY, closeDay: DaysEnum.THURSDAY, openTime: '09:00', closeTime: '18:00', active: true },
      { openDay: DaysEnum.FRIDAY, closeDay: DaysEnum.FRIDAY, openTime: '09:00', closeTime: '18:00', active: true },
      { openDay: DaysEnum.SATURDAY, closeDay: DaysEnum.SATURDAY, openTime: '10:00', closeTime: '17:00', active: true },
      { openDay: DaysEnum.SUNDAY, closeDay: DaysEnum.SUNDAY, openTime: '00:00', closeTime: '00:00', active: false },
    ],
    store_verification_status: { google: 'VERIFIED', apple: 'VERIFIED', meta: 'VERIFIED' },
    store_listing_status: { google: 'LISTED', apple: 'LISTED', meta: 'LISTED', yandex: 'PENDING' },
    platforms: {
      google: createPlatformSync('live', '2024-09-05T16:45:00Z'),
      apple: createPlatformSync('live', '2024-09-05T16:15:00Z'),
      meta: createPlatformSync('live', '2024-09-05T15:50:00Z'),
      yandex: createPlatformSync('action_required', '2024-09-04T11:30:00Z', [
        { type: 'sync_error', label: 'Inventory sync issue', errorCode: 'validation_error', platform: 'yandex' },
      ]),
    },
  },
  {
    _id: '10',
    location_name: 'Diyarbakır Heritage Shop',
    brand: 'demo-brand-123',
    store_code: 'DHS010',
    address: {
      lat: 37.9250,
      lng: 40.2110,
      countryCode: 'TR',
      administrativeArea: 'Diyarbakır',
      locality: 'Diyarbakır',
      sublocality: 'Bağlar',
      fullAddress: '741 Gazi Street, Cultural Center, Bağlar, Diyarbakır',
      addressLines: ['741 Gazi Street', 'Cultural Center'],
    },
    primary_phone: '+90 412 111 5566',
    website: 'https://example.com/diyarbakir',
    email: 'diyarbakir@demo.com',
    location_status: LocationStatusEnum.OPEN,
    regular_hours: [
      { openDay: DaysEnum.MONDAY, closeDay: DaysEnum.MONDAY, openTime: '00:00', closeTime: '00:00', active: false },
      { openDay: DaysEnum.TUESDAY, closeDay: DaysEnum.TUESDAY, openTime: '10:00', closeTime: '19:00', active: true },
      { openDay: DaysEnum.WEDNESDAY, closeDay: DaysEnum.WEDNESDAY, openTime: '10:00', closeTime: '19:00', active: true },
      { openDay: DaysEnum.THURSDAY, closeDay: DaysEnum.THURSDAY, openTime: '10:00', closeTime: '19:00', active: true },
      { openDay: DaysEnum.FRIDAY, closeDay: DaysEnum.FRIDAY, openTime: '10:00', closeTime: '19:00', active: true },
      { openDay: DaysEnum.SATURDAY, closeDay: DaysEnum.SATURDAY, openTime: '10:00', closeTime: '19:00', active: true },
      { openDay: DaysEnum.SUNDAY, closeDay: DaysEnum.SUNDAY, openTime: '10:00', closeTime: '19:00', active: true },
    ],
    store_verification_status: {},
    store_listing_status: {},
    platforms: {
      google: createPlatformSync('not_connected', null),
      apple: createPlatformSync('action_required', '2024-09-03T08:00:00Z', [
        { type: 'image_missing', label: 'Photos rejected', platform: 'apple' },
      ]),
      meta: createPlatformSync('action_required', '2024-09-04T09:15:00Z', [
        { type: 'sync_error', label: 'Policy violation', errorCode: 'validation_error', platform: 'meta' },
      ]),
      yandex: createPlatformSync('not_connected', null),
    },
  },
  {
    _id: '11',
    location_name: 'Eskişehir Student Corner',
    brand: 'demo-brand-123',
    store_code: 'ESC011',
    address: {
      lat: 39.7767,
      lng: 30.5206,
      countryCode: 'TR',
      administrativeArea: 'Eskişehir',
      locality: 'Eskişehir',
      sublocality: 'Odunpazarı',
      fullAddress: '852 University Street, Campus Area, Odunpazarı, Eskişehir',
      addressLines: ['852 University Street', 'Campus Area'],
    },
    primary_phone: '+90 222 222 7788',
    website: 'https://example.com/eskisehir',
    email: 'eskisehir@demo.com',
    location_status: LocationStatusEnum.OPEN,
    regular_hours: [
      { openDay: DaysEnum.MONDAY, closeDay: DaysEnum.MONDAY, openTime: '08:00', closeTime: '22:00', active: true },
      { openDay: DaysEnum.TUESDAY, closeDay: DaysEnum.TUESDAY, openTime: '08:00', closeTime: '22:00', active: true },
      { openDay: DaysEnum.WEDNESDAY, closeDay: DaysEnum.WEDNESDAY, openTime: '08:00', closeTime: '22:00', active: true },
      { openDay: DaysEnum.THURSDAY, closeDay: DaysEnum.THURSDAY, openTime: '08:00', closeTime: '22:00', active: true },
      { openDay: DaysEnum.FRIDAY, closeDay: DaysEnum.FRIDAY, openTime: '08:00', closeTime: '22:00', active: true },
      { openDay: DaysEnum.SATURDAY, closeDay: DaysEnum.SATURDAY, openTime: '10:00', closeTime: '21:00', active: true },
      { openDay: DaysEnum.SUNDAY, closeDay: DaysEnum.SUNDAY, openTime: '10:00', closeTime: '21:00', active: true },
    ],
    store_verification_status: { google: 'VERIFIED', apple: 'VERIFIED', meta: 'VERIFIED' },
    store_listing_status: { google: 'LISTED', apple: 'LISTED', meta: 'LISTED', yandex: 'LISTED' },
    platforms: {
      google: createPlatformSync('live', '2024-09-05T17:20:00Z'),
      apple: createPlatformSync('live', '2024-09-05T16:50:00Z'),
      meta: createPlatformSync('live', '2024-09-05T17:00:00Z'),
      yandex: createPlatformSync('live', '2024-09-05T16:30:00Z'),
    },
  },
  {
    _id: '12',
    location_name: 'Samsun Port Market',
    brand: 'demo-brand-123',
    store_code: 'SPM012',
    address: {
      lat: 41.2867,
      lng: 36.3300,
      countryCode: 'TR',
      administrativeArea: 'Samsun',
      locality: 'Samsun',
      sublocality: 'İlkadım',
      fullAddress: '963 Harbor Road, Marine District, İlkadım, Samsun',
      addressLines: ['963 Harbor Road', 'Marine District'],
    },
    primary_phone: '+90 362 333 9900',
    website: 'https://example.com/samsun',
    email: 'samsun@demo.com',
    location_status: LocationStatusEnum.OPEN,
    regular_hours: [
      { openDay: DaysEnum.MONDAY, closeDay: DaysEnum.MONDAY, openTime: '06:00', closeTime: '20:00', active: true },
      { openDay: DaysEnum.TUESDAY, closeDay: DaysEnum.TUESDAY, openTime: '06:00', closeTime: '20:00', active: true },
      { openDay: DaysEnum.WEDNESDAY, closeDay: DaysEnum.WEDNESDAY, openTime: '06:00', closeTime: '20:00', active: true },
      { openDay: DaysEnum.THURSDAY, closeDay: DaysEnum.THURSDAY, openTime: '06:00', closeTime: '20:00', active: true },
      { openDay: DaysEnum.FRIDAY, closeDay: DaysEnum.FRIDAY, openTime: '06:00', closeTime: '20:00', active: true },
      { openDay: DaysEnum.SATURDAY, closeDay: DaysEnum.SATURDAY, openTime: '06:00', closeTime: '20:00', active: true },
      { openDay: DaysEnum.SUNDAY, closeDay: DaysEnum.SUNDAY, openTime: '08:00', closeTime: '18:00', active: true },
    ],
    store_verification_status: { google: 'VERIFIED', apple: 'PENDING', meta: 'VERIFIED' },
    store_listing_status: { google: 'LISTED', meta: 'LISTED', yandex: 'LISTED' },
    platforms: {
      google: createPlatformSync('live', '2024-09-05T18:00:00Z'),
      apple: createPlatformSync('action_required', '2024-09-04T14:45:00Z', [
        { type: 'sync_error', label: 'Accessibility info missing', platform: 'apple' },
      ]),
      meta: createPlatformSync('live', '2024-09-05T17:30:00Z'),
      yandex: createPlatformSync('live', '2024-09-05T17:15:00Z'),
    },
  },
];

// ---------------------------------------------------------------------------
// Helper utilities for LocationDto
// ---------------------------------------------------------------------------

/** Compute UI data health from platform sync statuses */
export function computeDataHealth(location: LocationDto): DataHealth {
  if (!location.platforms) return 'WARNING';
  const statuses = Object.values(location.platforms);
  const hasError = statuses.some(p => p.status === 'rejected' || p.status === 'suspended' || p.warnings.length > 1);
  const hasWarning = statuses.some(p => p.status === 'action_required' || p.status === 'not_connected' || p.warnings.length > 0);
  if (hasError) return 'ERROR';
  if (hasWarning) return 'WARNING';
  return 'HEALTHY';
}

/** Format regular hours into a human-readable label */
export function formatHoursLabel(hours?: RegularHoursDto[]): string {
  if (!hours || hours.length === 0) return 'Hours not set';
  const activeDays = hours.filter(h => h.active);
  if (activeDays.length === 0) return 'Closed';
  if (activeDays.length === 7) {
    const allSame = activeDays.every(h => h.openTime === activeDays[0].openTime && h.closeTime === activeDays[0].closeTime);
    if (allSame) return `Daily ${activeDays[0].openTime}-${activeDays[0].closeTime}`;
  }
  // Weekdays vs weekend summary
  const weekdays = hours.filter(h => [DaysEnum.MONDAY, DaysEnum.TUESDAY, DaysEnum.WEDNESDAY, DaysEnum.THURSDAY, DaysEnum.FRIDAY].includes(h.openDay));
  const weekend = hours.filter(h => [DaysEnum.SATURDAY, DaysEnum.SUNDAY].includes(h.openDay));
  const activeWeekdays = weekdays.filter(h => h.active);
  const activeWeekend = weekend.filter(h => h.active);

  const parts: string[] = [];
  if (activeWeekdays.length > 0) {
    const wdSame = activeWeekdays.every(h => h.openTime === activeWeekdays[0].openTime && h.closeTime === activeWeekdays[0].closeTime);
    if (wdSame) {
      parts.push(`Mon-Fri ${activeWeekdays[0].openTime}-${activeWeekdays[0].closeTime}`);
    } else {
      parts.push(`Mon-Fri (varies)`);
    }
  }
  if (activeWeekend.length > 0) {
    const weSame = activeWeekend.every(h => h.openTime === activeWeekend[0].openTime && h.closeTime === activeWeekend[0].closeTime);
    if (weSame) {
      parts.push(`Sat-Sun ${activeWeekend[0].openTime}-${activeWeekend[0].closeTime}`);
    } else {
      parts.push(`Sat-Sun (varies)`);
    }
  }
  const closedDays = hours.filter(h => !h.active);
  if (closedDays.length > 0 && closedDays.length <= 2) {
    const dayNames: Record<string, string> = {
      [DaysEnum.MONDAY]: 'Mon', [DaysEnum.TUESDAY]: 'Tue', [DaysEnum.WEDNESDAY]: 'Wed',
      [DaysEnum.THURSDAY]: 'Thu', [DaysEnum.FRIDAY]: 'Fri', [DaysEnum.SATURDAY]: 'Sat', [DaysEnum.SUNDAY]: 'Sun',
    };
    parts.push(`Closed ${closedDays.map(d => dayNames[d.openDay]).join(', ')}`);
  }
  return parts.join(', ') || 'Hours not set';
}

/** Get the latest sync timestamp across all platforms */
export function getLatestSync(location: LocationDto): string | null {
  if (!location.platforms) return null;
  const syncs = Object.values(location.platforms)
    .map(p => p.lastSync)
    .filter((s): s is string => !!s)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  return syncs[0] ?? null;
}

/** Convert platform sync data to legacy ChannelInfo for backward-compatible badge components */
export function platformToChannelInfo(platform: PlatformSyncData): ChannelInfo {
  let status: ChannelStatus;
  if (platform.status === 'live') status = 'CONNECTED';
  else if (platform.status === 'not_connected') status = 'NOT_CONNECTED';
  else status = 'NEEDS_ATTENTION';
  return {
    status,
    lastSync: platform.lastSync ?? undefined,
    errorNote: platform.warnings.length > 0 ? platform.warnings[0].label : undefined,
  };
}

// Helper functions for filtering and searching
export const getUniqueValues = {
  cities: () => Array.from(new Set(mockLocations.map(loc => loc.address.locality ?? loc.address.administrativeArea ?? ''))).filter(Boolean).sort(),
  districts: () => Array.from(new Set(mockLocations.map(loc => loc.address.sublocality ?? ''))).filter(Boolean).sort(),
  statuses: (): DataHealth[] => ['HEALTHY', 'WARNING', 'ERROR'],
  channels: (): Channel[] => ['google', 'apple', 'meta', 'gmc'],
};

export const filterLocations = (
  locations: LocationDto[],
  searchQuery: string,
  filters: { cities: string[]; statuses: DataHealth[]; channels: Channel[] }
): LocationDto[] => {
  return locations.filter(location => {
    const searchMatch = !searchQuery ||
      location.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.store_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.fullAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (location.address.locality ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (location.address.sublocality ?? '').toLowerCase().includes(searchQuery.toLowerCase());

    const cityMatch = filters.cities.length === 0 || filters.cities.includes(location.address.locality ?? '');

    const health = computeDataHealth(location);
    const statusMatch = filters.statuses.length === 0 || filters.statuses.includes(health);

    const channelMatch = filters.channels.length === 0 ||
      filters.channels.some(channel => {
        const key = channel as string;
        if (!location.platforms) return false;
        const plat = location.platforms[key as PlatformKey];
        return plat && plat.status !== 'not_connected';
      });

    return searchMatch && cityMatch && statusMatch && channelMatch;
  });
};

export const paginateLocations = (
  locations: LocationDto[],
  page: number,
  pageSize: number
): { data: LocationDto[]; totalCount: number; totalPages: number } => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return {
    data: locations.slice(startIndex, endIndex),
    totalCount: locations.length,
    totalPages: Math.ceil(locations.length / pageSize),
  };
};
