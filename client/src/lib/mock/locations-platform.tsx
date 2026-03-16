import { Phone, Mail, MapPin, Image, ExternalLink, Clock, Layers } from 'lucide-react';

// Re-export canonical types from types/locations.ts
export type {
    WarningType,
    SyncErrorCode,
    PlatformKey,
    LocationWarning,
    PlatformStatusType,
    PlatformSyncData,
} from '@/lib/types/locations';

import type {
    PlatformSyncData,
    PlatformKey,
} from '@/lib/types/locations';

// Backward compat alias — PlatformData is the old name for PlatformSyncData
export type PlatformData = PlatformSyncData;

export type BusinessStatus = 'open' | 'closed_permanently' | 'closed_temporarily';

/**
 * LocationData — UI view model for the locations status table.
 * Maps to LocationDto production fields with camelCase for UI convenience.
 * Field mapping: storeCode → store_code, name → location_name, etc.
 */
export interface LocationData {
    id: number;
    storeCode: string;
    brand: string;
    city: string;
    district: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    imageUrl: string;
    website: string;
    workingHours: string;
    description: string;
    storeSet: string;
    businessStatus: BusinessStatus;
    google: PlatformSyncData;
    meta: PlatformSyncData;
    apple: PlatformSyncData;
    yandex: PlatformSyncData;
}

export type MissingFieldKey = 'phone' | 'email' | 'address' | 'imageUrl' | 'website' | 'workingHours' | 'description';

export interface MissingFieldInfo {
    key: MissingFieldKey;
    label: string;
    placeholder: string;
    type: 'text' | 'tel' | 'email' | 'url' | 'textarea';
    icon: JSX.Element;
}

export const allFieldsInfo: MissingFieldInfo[] = [
    { key: 'phone', label: 'Phone Number', placeholder: '+90 5XX XXX XX XX', type: 'tel', icon: <Phone className="w-4 h-4" /> },
    { key: 'email', label: 'Email Address', placeholder: 'store@example.com', type: 'email', icon: <Mail className="w-4 h-4" /> },
    { key: 'address', label: 'Address', placeholder: 'District, Street, No', type: 'text', icon: <MapPin className="w-4 h-4" /> },
    { key: 'imageUrl', label: 'Logo / Image', placeholder: 'https://example.com/logo.png', type: 'url', icon: <Image className="w-4 h-4" /> },
    { key: 'website', label: 'Website', placeholder: 'https://example.com', type: 'url', icon: <ExternalLink className="w-4 h-4" /> },
    { key: 'workingHours', label: 'Working Hours', placeholder: '09:00 - 22:00', type: 'text', icon: <Clock className="w-4 h-4" /> },
    { key: 'description', label: 'Description', placeholder: 'Short description about your store...', type: 'textarea', icon: <Layers className="w-4 h-4" /> }
];

export const mockLocations: LocationData[] = [
    // 1. HAPPY PATH (Sorunsuz Mağaza)
    {
        id: 1,
        storeCode: 'DY_001',
        brand: 'Doyuyo',
        city: 'İstanbul',
        district: 'Kadıköy',
        name: 'Doyuyo - İstanbul - Kadıköy',
        address: 'Caferağa Mah. Moda Cad. No:12',
        phone: '+90 216 555 0001',
        email: 'kadikoy@doyuyo.com',
        imageUrl: 'https://example.com/img1.jpg',
        website: 'https://doyuyo.com',
        workingHours: '09:00 - 22:00',
        description: 'Moda coast branch',
        storeSet: 'Street',
        businessStatus: 'open',
        google: { status: 'live', lastSync: '2 min ago', warnings: [] },
        meta: { status: 'live', lastSync: '5 min ago', warnings: [] },
        apple: { status: 'live', lastSync: '10 min ago', warnings: [] },
        yandex: { status: 'live', lastSync: '15 min ago', warnings: [] }
    },

    // 2. AUTH ERROR (Token Patlaması - Meta)
    {
        id: 4,
        storeCode: 'DY_004',
        brand: 'Doyuyo',
        city: 'İzmir',
        district: 'Alsancak',
        name: 'Doyuyo - İzmir - Alsancak',
        address: 'Alsancak Mah. Kıbrıs Şehitleri Cad. No:22',
        phone: '+90 232 555 0004',
        email: 'alsancak@doyuyo.com',
        imageUrl: 'https://example.com/img2.jpg',
        website: 'https://doyuyo.com',
        workingHours: '08:00 - 23:00',
        description: 'Kordon branch',
        storeSet: 'Express',
        businessStatus: 'open',
        google: { status: 'live', lastSync: '15 min ago', warnings: [] },
        meta: {
            status: 'action_required',
            lastSync: '1 day ago',
            warnings: [
                {
                    type: 'sync_error',
                    label: 'Connection Lost',
                    errorCode: 'auth_expired',
                    platform: 'meta',
                    errorLog: 'Error 190: Invalid OAuth Access Token. The user has changed the password or revoked access.'
                }
            ]
        },
        apple: { status: 'live', lastSync: '2 hours ago', warnings: [] },
        yandex: {
            status: 'action_required',
            lastSync: '30 min ago',
            warnings: [
                { type: 'sync_error', label: 'Phone Missing', errorCode: 'validation_error', platform: 'yandex', errorLog: 'Missing required field: phone' },
                { type: 'sync_error', label: 'Coordinates Missing', errorCode: 'missing_coordinates', platform: 'yandex', errorLog: 'Missing required field: coordinates' }
            ]
        }
    },

    // 3. GEO ERROR (Koordinat Eksik - Google)
    {
        id: 3,
        storeCode: 'DY_076',
        brand: 'Doyuyo',
        city: 'Ankara',
        district: 'Çankaya',
        name: 'Doyuyo - Ankara - Çankaya',
        address: 'Kızılay Mah. Atatürk Blv. No:45',
        phone: '+90 312 555 0076',
        email: '',
        imageUrl: '',
        website: '',
        workingHours: '',
        description: '',
        storeSet: 'Street',
        businessStatus: 'open',
        google: {
            status: 'action_required',
            lastSync: 'Failed',
            warnings: [
                {
                    type: 'sync_error',
                    label: 'Coordinates Missing',
                    errorCode: 'missing_coordinates',
                    platform: 'google',
                    errorLog: '400 Bad Request: Missing Lat/Long. Geocoding failed for the provided address.'
                },
                { type: 'email_missing', label: 'Email Missing' },
                { type: 'image_missing', label: 'Image Missing' }
            ]
        },
        meta: { status: 'not_connected', lastSync: null, warnings: [] },
        apple: { status: 'pending', lastSync: '1 day ago', warnings: [] },
        yandex: { status: 'live', lastSync: null, warnings: [] }
    },

    // 4. VALIDATION ERROR (Format Hatası - Meta)
    {
        id: 6,
        storeCode: 'DY_006',
        brand: 'Doyuyo',
        city: 'Antalya',
        district: 'Muratpaşa',
        name: 'Doyuyo - Antalya - Muratpaşa',
        address: 'Konyaaltı Cad. No:55',
        phone: '',
        email: '',
        imageUrl: '',
        website: '',
        workingHours: '9 AM - 10 PM',
        description: '',
        storeSet: 'Express',
        businessStatus: 'closed_temporarily',
        google: { status: 'live', lastSync: '30 min ago', warnings: [] },
        meta: {
            status: 'pending',
            lastSync: 'Failed',
            warnings: [
                {
                    type: 'sync_error',
                    label: 'Time Format Error',
                    errorCode: 'validation_error',
                    platform: 'meta',
                    errorLog: 'Param validation failed: working_hours must be in HH:MM - HH:MM format.'
                },
                { type: 'phone_missing', label: 'Phone Missing' }
            ]
        },
        apple: { status: 'live', lastSync: '1 hour ago', warnings: [] },
        yandex: {
            status: 'action_required',
            lastSync: '2 hours ago',
            warnings: [
                { type: 'sync_error', label: 'Website Missing', errorCode: 'validation_error', platform: 'yandex', errorLog: 'Missing required field: website' },
                { type: 'sync_error', label: 'Working Hours Missing', errorCode: 'validation_error', platform: 'yandex', errorLog: 'Missing required field: working_hours' },
                { type: 'sync_error', label: 'Category Missing', errorCode: 'validation_error', platform: 'yandex', errorLog: 'Missing required field: category' }
            ]
        }
    },

    // 5. RATE LIMIT (Trafik - Apple)
    {
        id: 7,
        storeCode: 'DY_007',
        brand: 'Doyuyo',
        city: 'Muğla',
        district: 'Bodrum',
        name: 'Doyuyo - Muğla - Bodrum',
        address: 'Neyzen Tevfik Cad.',
        phone: '+90 252 000 0000',
        email: 'bodrum@doyuyo.com',
        imageUrl: 'https://example.com/img3.jpg',
        website: '',
        workingHours: '10:00 - 02:00',
        description: '',
        storeSet: 'Seasonal',
        businessStatus: 'open',
        google: { status: 'live', lastSync: '1 min ago', warnings: [] },
        meta: { status: 'live', lastSync: '1 min ago', warnings: [] },
        apple: {
            status: 'action_required',
            lastSync: 'Pending',
            warnings: [
                {
                    type: 'sync_error',
                    label: 'Queued',
                    errorCode: 'rate_limit',
                    platform: 'apple',
                    errorLog: '429 Too Many Requests. Retry-After: 60s'
                }
            ]
        },
        yandex: { status: 'live', lastSync: '1 min ago', warnings: [] }
    },

    // 6. GOOGLE SUSPENDED (Askıya Alındı)
    {
        id: 8,
        storeCode: 'DY_008',
        brand: 'Doyuyo',
        city: 'Bursa',
        district: 'Osmangazi',
        name: 'Doyuyo - Bursa - Osmangazi',
        address: 'Heykel Mah. Atatürk Cad. No:10',
        phone: '+90 224 555 0008',
        email: 'osmangazi@doyuyo.com',
        imageUrl: 'https://example.com/img4.jpg',
        website: 'https://doyuyo.com',
        workingHours: '09:00 - 21:00',
        description: 'Bursa main branch',
        storeSet: 'Street',
        businessStatus: 'closed_permanently',
        google: {
            status: 'suspended',
            lastSync: 'Suspended',
            warnings: [
                {
                    type: 'sync_error',
                    label: 'Suspended',
                    errorCode: 'unknown',
                    platform: 'google',
                    errorLog: 'Location suspended due to quality policy violation. Contact Google Support.'
                }
            ]
        },
        meta: { status: 'live', lastSync: '10 min ago', warnings: [] },
        apple: { status: 'live', lastSync: '15 min ago', warnings: [] },
        yandex: { status: 'live', lastSync: '20 min ago', warnings: [] }
    },

    // 7. GOOGLE DISCONNECTED (Bağlantı Koptu)
    {
        id: 9,
        storeCode: 'DY_009',
        brand: 'Doyuyo',
        city: 'Konya',
        district: 'Selçuklu',
        name: 'Doyuyo - Konya - Selçuklu',
        address: 'Selçuklu Mah. Mevlana Cad. No:33',
        phone: '+90 332 555 0009',
        email: 'selcuklu@doyuyo.com',
        imageUrl: 'https://example.com/img5.jpg',
        website: 'https://doyuyo.com',
        workingHours: '08:00 - 22:00',
        description: 'Konya branch',
        storeSet: 'Street',
        businessStatus: 'open',
        google: {
            status: 'action_required',
            lastSync: 'No Connection',
            warnings: [
                {
                    type: 'sync_error',
                    label: 'Connection Lost',
                    errorCode: 'auth_expired',
                    platform: 'google',
                    errorLog: '403 Permission Denied: Location ownership has been transferred. Please reconnect.'
                }
            ]
        },
        meta: { status: 'live', lastSync: '5 min ago', warnings: [] },
        apple: { status: 'live', lastSync: '8 min ago', warnings: [] },
        yandex: { status: 'live', lastSync: '12 min ago', warnings: [] }
    },

    // 8. APPLE REJECTED (Reddedildi)
    {
        id: 10,
        storeCode: 'DY_010',
        brand: 'Doyuyo',
        city: 'Eskişehir',
        district: 'Tepebaşı',
        name: 'Doyuyo - Eskişehir - Tepebaşı',
        address: 'Tepebaşı Mah. İsmet İnönü Cad. No:55',
        phone: '+90 222 555 0010',
        email: 'tepebasi@doyuyo.com',
        imageUrl: 'https://example.com/img6.jpg',
        website: 'https://doyuyo.com',
        workingHours: '09:00 - 20:00',
        description: 'Eskisehir branch',
        storeSet: 'Express',
        businessStatus: 'open',
        google: { status: 'live', lastSync: '3 min ago', warnings: [] },
        meta: { status: 'live', lastSync: '7 min ago', warnings: [] },
        apple: {
            status: 'rejected',
            lastSync: 'Rejected',
            warnings: [
                {
                    type: 'sync_error',
                    label: 'Invalid Address Format',
                    errorCode: 'validation_error',
                    platform: 'apple',
                    errorLog: 'REJECTED: Address format does not match Apple Maps database. Please verify postal code and street name.'
                }
            ]
        },
        yandex: { status: 'live', lastSync: '15 min ago', warnings: [] }
    },

    // 9. APPLE PENDING REVIEW (İnceleme Bekliyor)
    {
        id: 11,
        storeCode: 'DY_011',
        brand: 'Doyuyo',
        city: 'Gaziantep',
        district: 'Şahinbey',
        name: 'Doyuyo - Gaziantep - Şahinbey',
        address: 'Şahinbey Mah. Gaziler Cad. No:88',
        phone: '+90 342 555 0011',
        email: 'sahinbey@doyuyo.com',
        imageUrl: 'https://example.com/img7.jpg',
        website: 'https://doyuyo.com',
        workingHours: '08:00 - 23:00',
        description: 'Gaziantep branch',
        storeSet: 'AVM',
        businessStatus: 'open',
        google: { status: 'live', lastSync: '2 min ago', warnings: [] },
        meta: { status: 'live', lastSync: '4 min ago', warnings: [] },
        apple: { status: 'pending', lastSync: 'Under Review', warnings: [] },
        yandex: { status: 'live', lastSync: '6 min ago', warnings: [] }
    },

    // 10. META DISCONNECTED (Yetki Yok)
    {
        id: 12,
        storeCode: 'DY_012',
        brand: 'Doyuyo',
        city: 'Trabzon',
        district: 'Ortahisar',
        name: 'Doyuyo - Trabzon - Ortahisar',
        address: 'Ortahisar Mah. Maraş Cad. No:22',
        phone: '+90 462 555 0012',
        email: 'ortahisar@doyuyo.com',
        imageUrl: 'https://example.com/img8.jpg',
        website: 'https://doyuyo.com',
        workingHours: '09:00 - 21:00',
        description: 'Trabzon branch',
        storeSet: 'Street',
        businessStatus: 'closed_temporarily',
        google: { status: 'live', lastSync: '5 min ago', warnings: [] },
        meta: {
            status: 'action_required',
            lastSync: 'No Permission',
            warnings: [
                {
                    type: 'sync_error',
                    label: 'Access Permission Revoked',
                    errorCode: 'auth_expired',
                    platform: 'meta',
                    errorLog: 'Error 10: Application does not have permission for this action. VenueX app access has been revoked.'
                }
            ]
        },
        apple: { status: 'live', lastSync: '10 min ago', warnings: [] },
        yandex: { status: 'live', lastSync: '15 min ago', warnings: [] }
    },

    // 11. META SUSPENDED (Sayfa Kapalı)
    {
        id: 13,
        storeCode: 'DY_013',
        brand: 'Doyuyo',
        city: 'Samsun',
        district: 'Atakum',
        name: 'Doyuyo - Samsun - Atakum',
        address: 'Atakum Mah. Sahil Yolu No:100',
        phone: '+90 362 555 0013',
        email: 'atakum@doyuyo.com',
        imageUrl: 'https://example.com/img9.jpg',
        website: 'https://doyuyo.com',
        workingHours: '10:00 - 22:00',
        description: 'Samsun coastal branch',
        storeSet: 'Seasonal',
        businessStatus: 'closed_permanently',
        google: { status: 'live', lastSync: '3 min ago', warnings: [] },
        meta: {
            status: 'suspended',
            lastSync: 'Closed',
            warnings: [
                {
                    type: 'sync_error',
                    label: 'Page Unpublished',
                    errorCode: 'unknown',
                    platform: 'meta',
                    errorLog: 'Page unpublished by administrator or disabled by Meta for policy violations.'
                }
            ]
        },
        apple: { status: 'live', lastSync: '8 min ago', warnings: [] },
        yandex: { status: 'not_connected', lastSync: null, warnings: [] }
    },

    // 12. APPLE DELETED (Silindi)
    {
        id: 14,
        storeCode: 'DY_014',
        brand: 'Doyuyo',
        city: 'Mersin',
        district: 'Mezitli',
        name: 'Doyuyo - Mersin - Mezitli',
        address: 'Mezitli Mah. Sahil Cad. No:45',
        phone: '+90 324 555 0014',
        email: 'mezitli@doyuyo.com',
        imageUrl: '',
        website: '',
        workingHours: '',
        description: '',
        storeSet: 'Seasonal',
        businessStatus: 'open',
        google: { status: 'live', lastSync: '5 min ago', warnings: [] },
        meta: { status: 'live', lastSync: '10 min ago', warnings: [] },
        apple: {
            status: 'closed',
            lastSync: 'Deleted',
            warnings: [
                {
                    type: 'sync_error',
                    label: 'Location Deleted',
                    errorCode: 'unknown',
                    platform: 'apple',
                    errorLog: 'DELETED: Location has been permanently removed from Apple Business Connect.'
                }
            ]
        },
        yandex: { status: 'live', lastSync: '15 min ago', warnings: [] }
    },

    // 13. KURULUM GEREKİYOR (Yeni eklenen lokasyon - platformlar henüz kurulmamış)
    {
        id: 15,
        storeCode: 'DY_015',
        brand: 'Doyuyo',
        city: 'Kayseri',
        district: 'Melikgazi',
        name: 'Doyuyo - Kayseri - Melikgazi',
        address: 'Melikgazi Mah. Cumhuriyet Cad. No:88',
        phone: '+90 352 555 0015',
        email: 'melikgazi@doyuyo.com',
        imageUrl: 'https://example.com/img15.jpg',
        website: 'https://doyuyo.com',
        workingHours: '09:00 - 21:00',
        description: 'Kayseri main branch - newly opened',
        storeSet: 'Street',
        businessStatus: 'open',
        google: { status: 'not_connected', lastSync: null, warnings: [] },
        meta: { status: 'not_connected', lastSync: null, warnings: [] },
        apple: { status: 'not_connected', lastSync: null, warnings: [] },
        yandex: { status: 'not_connected', lastSync: null, warnings: [] }
    },

    // 14. META STORE CODE ERROR (Store Code Özel Karakter - Meta)
    {
        id: 16,
        storeCode: 'DY 016-A#',
        brand: 'Doyuyo',
        city: 'Adana',
        district: 'Seyhan',
        name: 'Doyuyo - Adana - Seyhan',
        address: 'Seyhan Mah. Özgürlük Cad. No:77',
        phone: '+90 322 555 0016',
        email: 'seyhan@doyuyo.com',
        imageUrl: 'https://example.com/img16.jpg',
        website: 'https://doyuyo.com',
        workingHours: '09:00 - 22:00',
        description: 'Adana main branch',
        storeSet: 'Street',
        businessStatus: 'open',
        google: { status: 'live', lastSync: '5 min ago', warnings: [] },
        meta: {
            status: 'action_required',
            lastSync: 'Error',
            warnings: [
                {
                    type: 'sync_error',
                    label: 'Invalid Store Code',
                    errorCode: 'invalid_store_code',
                    platform: 'meta',
                    errorLog: 'Invalid store_id format: Store code cannot contain spaces or special characters (# - ç ş etc.). Use only alphanumeric and underscore.'
                }
            ]
        },
        apple: { status: 'live', lastSync: '10 min ago', warnings: [] },
        yandex: { status: 'live', lastSync: '15 min ago', warnings: [] }
    }
];

export const calculateDataHealth = (location: LocationData): number => {
    const fields = [
        location.phone,
        location.email,
        location.address,
        location.imageUrl,
        location.website,
        location.workingHours,
        location.description
    ];
    const filledFields = fields.filter(f => f && f.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
};

// ------------------------------------------------------------------
// Location Conflict Types
// ------------------------------------------------------------------

export type ConflictType = 'only_in_vx' | 'only_in_google' | 'data_mismatch';
export type ConflictAction = 'delete_vx' | 'add_to_google' | 'delete_google' | 'add_to_vx' | 'use_vx' | 'use_google' | 'skip';

export interface GoogleLocationSnapshot {
    placeId: string;
    name: string;
    address: string;
    phone?: string;
    website?: string;
}

export interface ConflictMismatchField {
    field: string;
    vxValue: string;
    googleValue: string;
}

export interface LocationConflict {
    id: string;
    conflictType: ConflictType;
    vxLocation?: Pick<LocationData, 'id' | 'storeCode' | 'name' | 'address' | 'phone' | 'website'>;
    googleLocation?: GoogleLocationSnapshot;
    mismatchFields?: ConflictMismatchField[];
}

// ------------------------------------------------------------------
// Mock Conflicts (6 items — 2 per type)
// ------------------------------------------------------------------

export const mockLocationConflicts: LocationConflict[] = [
    // 1. Only in VenueX — no matching Google listing
    {
        id: 'lc-001',
        conflictType: 'only_in_vx',
        vxLocation: {
            id: 7,
            storeCode: 'DY_007',
            name: 'Doyuyo - Bursa - Nilüfer',
            address: 'Nilüfer Mah. Atatürk Cad. No:8, Nilüfer / Bursa',
            phone: '+90 224 555 0007',
            website: 'https://doyuyo.com',
        },
    },
    {
        id: 'lc-002',
        conflictType: 'only_in_vx',
        vxLocation: {
            id: 8,
            storeCode: 'DY_008',
            name: 'Doyuyo - Antalya - Kepez',
            address: 'Kepez Mah. Dumlupınar Blv. No:54, Kepez / Antalya',
            phone: '+90 242 555 0008',
            website: 'https://doyuyo.com',
        },
    },

    // 2. Only in Google — unmatched listing not in VenueX
    {
        id: 'lc-003',
        conflictType: 'only_in_google',
        googleLocation: {
            placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
            name: 'Doyuyo - İstanbul - Bağcılar',
            address: 'Kirazlı Mah. Abdi İpekçi Cad. No:4, Bağcılar / İstanbul',
            phone: '+90 212 555 0091',
            website: 'https://doyuyo.com',
        },
    },
    {
        id: 'lc-004',
        conflictType: 'only_in_google',
        googleLocation: {
            placeId: 'ChIJabc123xyz456defGHIJKLMNOP',
            name: 'Doyuyo - Konya - Selçuklu',
            address: 'Selçuklu Mah. Ankara Cad. No:17, Selçuklu / Konya',
            phone: '+90 332 555 0042',
        },
    },

    // 3. Data mismatch — both exist but data differs
    {
        id: 'lc-005',
        conflictType: 'data_mismatch',
        vxLocation: {
            id: 1,
            storeCode: 'DY_001',
            name: 'Doyuyo - İstanbul - Kadıköy',
            address: 'Caferağa Mah. Moda Cad. No:12, Kadıköy / İstanbul',
            phone: '+90 216 555 0001',
            website: 'https://doyuyo.com',
        },
        googleLocation: {
            placeId: 'ChIJKadikoy_DY001',
            name: 'Doyuyo - İstanbul - Kadıköy',
            address: 'Caferağa Mah. Moda Cad. No:12, Kadıköy / İstanbul',
            phone: '+90 216 555 9999',
            website: 'https://doyuyo.com.tr',
        },
        mismatchFields: [
            { field: 'phone', vxValue: '+90 216 555 0001', googleValue: '+90 216 555 9999' },
            { field: 'website', vxValue: 'https://doyuyo.com', googleValue: 'https://doyuyo.com.tr' },
        ],
    },
    {
        id: 'lc-006',
        conflictType: 'data_mismatch',
        vxLocation: {
            id: 3,
            storeCode: 'DY_076',
            name: 'Doyuyo - Ankara - Çankaya',
            address: 'Kızılay Mah. Atatürk Blv. No:45, Çankaya / Ankara',
            phone: '+90 312 555 0076',
            website: 'https://doyuyo.com',
        },
        googleLocation: {
            placeId: 'ChIJCankaya_DY076',
            name: 'Doyuyo - Ankara - Kızılay',
            address: 'Kızılay Mah. Atatürk Blv. No:45/B, Çankaya / Ankara',
            phone: '+90 312 555 0076',
        },
        mismatchFields: [
            { field: 'name', vxValue: 'Doyuyo - Ankara - Çankaya', googleValue: 'Doyuyo - Ankara - Kızılay' },
            { field: 'address', vxValue: 'Kızılay Mah. Atatürk Blv. No:45', googleValue: 'Kızılay Mah. Atatürk Blv. No:45/B' },
        ],
    },
];
