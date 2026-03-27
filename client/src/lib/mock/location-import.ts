import type {
  ImportFileRecord,
  FileLocationForMatchDto,
  VenueXLocationForMatchDto,
  FileLocationStatusDto,
  DuplicateFileLocationDto,
  GetFileLocationSummaryDto,
  ErrorDetailDto,
  MappingFieldDto,
  ColumnMappingDto,
  MatchingCriteria,
} from '@/lib/types/location-import';

// ========== VENUEX MAPPING FIELDS ==========

export const VENUEX_MAPPING_FIELDS: MappingFieldDto[] = [
  { key: 'store_code', label: 'Store Code', required: true },
  { key: 'store_name', label: 'Store Name', required: true },
  { key: 'full_address', label: 'Full Address', required: true },
  { key: 'city', label: 'City', required: true },
  { key: 'locality', label: 'District / Locality', required: false },
  { key: 'postal_code', label: 'Postal Code', required: false },
  { key: 'country_code', label: 'Country Code', required: false },
  { key: 'latitude', label: 'Latitude', required: true },
  { key: 'longitude', label: 'Longitude', required: true },
  { key: 'primary_phone', label: 'Phone', required: false },
  { key: 'email', label: 'Email', required: false },
  { key: 'website_uri', label: 'Website', required: false },
  { key: 'primary_category', label: 'Primary Category', required: false },
  { key: 'regular_hours', label: 'Working Hours', required: false },
  { key: 'description', label: 'Description', required: false },
  { key: 'opening_date', label: 'Opening Date', required: false },
];

// ========== AUTO-MAP HINTS ==========

const AUTO_MAP: Record<string, string> = {
  'store code': 'store_code', storecode: 'store_code', store_code: 'store_code', 'mağaza kodu': 'store_code', code: 'store_code',
  'store name': 'store_name', store_name: 'store_name', name: 'store_name', 'mağaza adı': 'store_name', 'şube adı': 'store_name', title: 'store_name',
  address: 'full_address', full_address: 'full_address', adres: 'full_address', 'full address': 'full_address',
  city: 'city', şehir: 'city', il: 'city',
  district: 'locality', locality: 'locality', ilçe: 'locality', semt: 'locality',
  'postal code': 'postal_code', postal_code: 'postal_code', zip: 'postal_code', 'posta kodu': 'postal_code',
  country: 'country_code', country_code: 'country_code', 'ülke kodu': 'country_code',
  latitude: 'latitude', lat: 'latitude', enlem: 'latitude',
  longitude: 'longitude', lng: 'longitude', lon: 'longitude', boylam: 'longitude',
  phone: 'primary_phone', primary_phone: 'primary_phone', telefon: 'primary_phone', tel: 'primary_phone',
  email: 'email', 'e-posta': 'email', eposta: 'email',
  website: 'website_uri', web: 'website_uri', url: 'website_uri', website_uri: 'website_uri',
  category: 'primary_category', primary_category: 'primary_category', kategori: 'primary_category',
  hours: 'regular_hours', regular_hours: 'regular_hours', 'working hours': 'regular_hours', 'çalışma saatleri': 'regular_hours',
  description: 'description', açıklama: 'description',
  'opening date': 'opening_date', opening_date: 'opening_date', 'açılış tarihi': 'opening_date',
};

export function autoMapColumns(columns: string[]): ColumnMappingDto[] {
  const used = new Set<string>();
  return columns.map((col) => {
    const normalized = col.toLowerCase().trim();
    const target = AUTO_MAP[normalized];
    if (target && !used.has(target)) {
      used.add(target);
      return { sourceColumn: col, targetField: target };
    }
    return { sourceColumn: col, targetField: '' };
  });
}

// ========== MOCK: UPLOADED FILE COLUMNS (OWN FORMAT) ==========

export const MOCK_OWN_FORMAT_COLUMNS = [
  'Mağaza Kodu',
  'Şube Adı',
  'İl',
  'İlçe',
  'Adres',
  'Telefon',
  'E-Posta',
  'Web Sitesi',
  'Enlem',
  'Boylam',
  'Çalışma Saatleri',
  'Kategori',
];

// Sample rows for preview during mapping
export const MOCK_OWN_FORMAT_SAMPLE_ROWS: Record<string, string>[] = [
  { 'Mağaza Kodu': 'IST-KDK-001', 'Şube Adı': 'Kadıköy Flagship', 'İl': 'İstanbul', 'İlçe': 'Kadıköy', 'Adres': 'Bağdat Cad. No:123', 'Telefon': '+90 216 345 6789', 'E-Posta': 'kadikoy@store.com', 'Web Sitesi': 'https://store.com/kadikoy', 'Enlem': '40.9862', 'Boylam': '29.0270', 'Çalışma Saatleri': '10:00-22:00', 'Kategori': 'Mağaza' },
  { 'Mağaza Kodu': 'IST-BSK-002', 'Şube Adı': 'Beşiktaş AVM', 'İl': 'İstanbul', 'İlçe': 'Beşiktaş', 'Adres': 'Zorlu Center Kat 2 No:45', 'Telefon': '+90 212 555 4321', 'E-Posta': 'besiktas@store.com', 'Web Sitesi': 'https://store.com/besiktas', 'Enlem': '41.0640', 'Boylam': '29.0168', 'Çalışma Saatleri': '10:00-22:00', 'Kategori': 'AVM Mağaza' },
  { 'Mağaza Kodu': 'ANK-CNK-001', 'Şube Adı': 'Kızılay Merkez', 'İl': 'Ankara', 'İlçe': 'Çankaya', 'Adres': 'Atatürk Bulvarı No:78', 'Telefon': '+90 312 444 5566', 'E-Posta': 'kizilay@store.com', 'Web Sitesi': 'https://store.com/kizilay', 'Enlem': '39.9208', 'Boylam': '32.8541', 'Çalışma Saatleri': '09:30-21:30', 'Kategori': 'Mağaza' },
];

// ========== MOCK: FILE LOCATIONS (parsed from uploaded file) ==========

export const MOCK_FILE_LOCATIONS: FileLocationForMatchDto[] = [
  { _id: 'fl-1', store_code: 'IST-KDK-001', store_name: 'Kadıköy Flagship', full_address: 'Bağdat Cad. No:123, Kadıköy', city: 'İstanbul', locality: 'Kadıköy', latitude: 40.9862, longitude: 29.0270 },
  { _id: 'fl-2', store_code: 'IST-BSK-002', store_name: 'Beşiktaş AVM', full_address: 'Zorlu Center Kat 2 No:45, Beşiktaş', city: 'İstanbul', locality: 'Beşiktaş', latitude: 41.0640, longitude: 29.0168 },
  { _id: 'fl-3', store_code: 'ANK-CNK-001', store_name: 'Kızılay Merkez', full_address: 'Atatürk Bulvarı No:78, Çankaya', city: 'Ankara', locality: 'Çankaya', latitude: 39.9208, longitude: 32.8541 },
  { _id: 'fl-4', store_code: 'IZM-KNK-001', store_name: 'Alsancak Kordon', full_address: 'Kıbrıs Şehitleri Cad. No:56, Konak', city: 'İzmir', locality: 'Konak', latitude: 38.4350, longitude: 27.1428 },
  { _id: 'fl-5', store_code: 'IST-ATK-003', store_name: 'Ataköy Marina', full_address: 'Ataköy Marina No:8, Bakırköy', city: 'İstanbul', locality: 'Bakırköy', latitude: 40.9780, longitude: 28.8450 },
  { _id: 'fl-6', store_code: 'BRS-NLF-001', store_name: 'Nilüfer Park', full_address: 'Özlüce Mah. Park Cad. No:34', city: 'Bursa', locality: 'Nilüfer', latitude: 40.2200, longitude: 28.8700 },
  { _id: 'fl-7', store_code: 'ANT-KNY-001', store_name: 'Konyaaltı Sahil', full_address: 'Liman Mah. 20. Sok. No:8', city: 'Antalya', locality: 'Konyaaltı', latitude: 36.8800, longitude: 30.6400 },
  { _id: 'fl-8', store_code: 'IST-MLP-004', store_name: 'Maltepe Piazza', full_address: 'Piazza AVM Kat 3 No:15', city: 'İstanbul', locality: 'Maltepe', latitude: 40.9330, longitude: 29.1370 },
  { _id: 'fl-9', store_code: 'GZT-SHN-001', store_name: 'Şahinbey Merkez', full_address: 'Suburcu Mah. İnönü Cad. No:67', city: 'Gaziantep', locality: 'Şahinbey', latitude: 37.0600, longitude: 37.3800 },
  { _id: 'fl-10', store_code: 'IST-BGC-005', store_name: 'Bağcılar Meydan', full_address: 'Meydan AVM Kat 1 No:22', city: 'İstanbul', locality: 'Bağcılar', latitude: 41.0350, longitude: 28.8550 },
  { _id: 'fl-11', store_code: 'IST-UMR-006', store_name: 'Ümraniye Meydan', full_address: 'Meydan AVM Kat 2 No:11', city: 'İstanbul', locality: 'Ümraniye', latitude: 41.0160, longitude: 29.1190 },
  { _id: 'fl-12', store_code: 'ADN-SYH-001', store_name: 'Seyhan Merkez', full_address: 'Turhan Cemal Beriker Blv. No:45', city: 'Adana', locality: 'Seyhan', latitude: 36.9917, longitude: 35.3289 },
];

// ========== MOCK: EXISTING VENUEX LOCATIONS ==========

export const MOCK_VENUEX_LOCATIONS: VenueXLocationForMatchDto[] = [
  { _id: 'vx-1', store_code: 'IST-KDK-001', store_name: 'Kadıköy Flagship Store', full_address: 'Bağdat Caddesi No:123, Kadıköy, İstanbul', city: 'İstanbul', latitude: 40.9862, longitude: 29.0270 },
  { _id: 'vx-2', store_code: 'IST-BSK-002', store_name: 'Beşiktaş Zorlu', full_address: 'Zorlu Center Kat 2 No:45', city: 'İstanbul', latitude: 41.0641, longitude: 29.0169 },
  { _id: 'vx-3', store_code: 'ANK-CNK-001', store_name: 'Kızılay Şube', full_address: 'Atatürk Blv. No:78, Çankaya', city: 'Ankara', latitude: 39.9209, longitude: 32.8542 },
  { _id: 'vx-4', store_code: 'IZM-KNK-001', store_name: 'Alsancak Mağaza', full_address: 'Kıbrıs Şehitleri Cad. No:56', city: 'İzmir', latitude: 38.4351, longitude: 27.1429 },
  // vx-5: exists in VenueX but NOT in the file → user must decide (keep/close/delete)
  { _id: 'vx-5', store_code: 'IST-KRT-007', store_name: 'Kartal Sahil', full_address: 'Sahil Yolu No:12, Kartal', city: 'İstanbul', latitude: 40.8850, longitude: 29.1950 },
  { _id: 'vx-6', store_code: 'IST-SRC-008', store_name: 'Sarıyer Maslak', full_address: 'Maslak Mah. Eski Büyükdere No:5', city: 'İstanbul', latitude: 41.1090, longitude: 29.0180 },
];

// ========== MOCK: MATCHING RESULTS ==========

export const MOCK_MATCHING_STATUSES: (FileLocationStatusDto & { matchingCriteria: MatchingCriteria })[] = [
  // Matched by store_code (4 pairs)
  { file: MOCK_FILE_LOCATIONS[0], venuex: MOCK_VENUEX_LOCATIONS[0], matchingCriteria: 'STORE_CODE' as MatchingCriteria },
  { file: MOCK_FILE_LOCATIONS[1], venuex: MOCK_VENUEX_LOCATIONS[1], matchingCriteria: 'STORE_CODE' as MatchingCriteria },
  { file: MOCK_FILE_LOCATIONS[2], venuex: MOCK_VENUEX_LOCATIONS[2], matchingCriteria: 'STORE_CODE' as MatchingCriteria },
  { file: MOCK_FILE_LOCATIONS[3], venuex: MOCK_VENUEX_LOCATIONS[3], matchingCriteria: 'STORE_CODE' as MatchingCriteria },
  // File-only (new locations to create)
  { file: MOCK_FILE_LOCATIONS[4], matchingCriteria: 'NONE' as MatchingCriteria },
  { file: MOCK_FILE_LOCATIONS[5], matchingCriteria: 'NONE' as MatchingCriteria },
  { file: MOCK_FILE_LOCATIONS[6], matchingCriteria: 'NONE' as MatchingCriteria },
  { file: MOCK_FILE_LOCATIONS[7], matchingCriteria: 'NONE' as MatchingCriteria },
  { file: MOCK_FILE_LOCATIONS[8], matchingCriteria: 'NONE' as MatchingCriteria },
  { file: MOCK_FILE_LOCATIONS[9], matchingCriteria: 'NONE' as MatchingCriteria },
  { file: MOCK_FILE_LOCATIONS[10], matchingCriteria: 'NONE' as MatchingCriteria },
  { file: MOCK_FILE_LOCATIONS[11], matchingCriteria: 'NONE' as MatchingCriteria },
  // VenueX-only (not in file — user must decide)
  { venuex: MOCK_VENUEX_LOCATIONS[4], matchingCriteria: 'NONE' as MatchingCriteria },
  { venuex: MOCK_VENUEX_LOCATIONS[5], matchingCriteria: 'NONE' as MatchingCriteria },
];

// ========== MOCK: IN-FILE DUPLICATES ==========

export const MOCK_FILE_DUPLICATES: DuplicateFileLocationDto[] = [
  {
    first: { _id: 'fl-dup-1a', store_code: 'IST-BGC-005', store_name: 'Bağcılar Meydan', full_address: 'Meydan AVM Kat 1 No:22', city: 'İstanbul', locality: 'Bağcılar', latitude: 41.0350, longitude: 28.8550 },
    second: { _id: 'fl-dup-1b', store_code: 'IST-BGC-005B', store_name: 'Bağcılar Meydan AVM', full_address: 'Meydan AVM Kat 1 No:22, Bağcılar', city: 'İstanbul', locality: 'Bağcılar', latitude: 41.0351, longitude: 28.8551 },
  },
];

// ========== MOCK: VALIDATION ERRORS ==========

export const MOCK_VALIDATION_ERRORS: ErrorDetailDto[] = [
  { index: 3, errors: ['Missing required field: latitude'] },
  { index: 7, errors: ['Invalid phone format: 0555-abc-1234'] },
  { index: 11, errors: ['Missing required field: store_code', 'Missing required field: full_address'] },
];

// ========== MOCK: FILE HISTORY ==========

export const MOCK_IMPORT_FILE_HISTORY: ImportFileRecord[] = [
  {
    id: 'fh-1',
    fileName: 'magaza-listesi-2025-mart.xlsx',
    fileUploadDate: '2025-03-25T14:30:00Z',
    rowCount: 156,
    fileSize: 48200,
    fileExtension: 'xlsx',
    useCustomMapping: true,
    importResult: { processedLocationCount: 156, newLocationCount: 12, updatedLocationCount: 144 },
    analysisComplete: true,
  },
  {
    id: 'fh-2',
    fileName: 'istanbul-subeleri.csv',
    fileUploadDate: '2025-03-18T09:15:00Z',
    rowCount: 43,
    fileSize: 12800,
    fileExtension: 'csv',
    useCustomMapping: false,
    importResult: { processedLocationCount: 43, newLocationCount: 5, updatedLocationCount: 38 },
    analysisComplete: true,
  },
  {
    id: 'fh-3',
    fileName: 'yeni-sube-acilaslari-q2.xlsx',
    fileUploadDate: '2025-03-10T16:45:00Z',
    rowCount: 8,
    fileSize: 5400,
    fileExtension: 'xlsx',
    useCustomMapping: true,
    analysisComplete: false,
  },
  {
    id: 'fh-4',
    fileName: 'tum-subeler-guncelleme.csv',
    fileUploadDate: '2025-02-28T11:00:00Z',
    rowCount: 234,
    fileSize: 67500,
    fileExtension: 'csv',
    useCustomMapping: false,
    importResult: { processedLocationCount: 234, newLocationCount: 0, updatedLocationCount: 234 },
    analysisComplete: true,
  },
];

// ========== MOCK: DECISION SUMMARY ==========

export const MOCK_DECISION_SUMMARY: GetFileLocationSummaryDto = {
  willBeCreatedCount: 8,
  willBeDeletedCount: 0,
  willBeClosedCount: 1,
  willBeKeptCount: 1,
  willBeOverwrittenCount: 4,
  isDecisionProcessFinished: true,
  isDecisionsUpToDate: true,
};
