import { Location, Channel, ChannelStatus, DataHealth, ChannelInfo } from '../types/locations';

// Helper to create channel info
const createChannelInfo = (
  status: ChannelStatus, 
  lastSync?: string, 
  errorNote?: string
): ChannelInfo => ({
  status,
  lastSync,
  errorNote
});

// Mock location data
export const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Downtown Fashion Store',
    code: 'DFS001',
    addressLine: '123 Main Street, Suite 100',
    city: 'Istanbul',
    district: 'Beyoğlu',
    hoursLabel: 'Mon-Sat 9AM-9PM, Sun 11AM-7PM',
    phone: '+90 212 123 4567',
    dataHealth: 'HEALTHY',
    channels: {
      GBP: createChannelInfo('CONNECTED', '2024-09-05T10:30:00Z'),
      APPLE: createChannelInfo('CONNECTED', '2024-09-05T09:15:00Z'),
      META: createChannelInfo('NEEDS_ATTENTION', '2024-09-04T14:22:00Z', 'Photo needs update'),
      GMC: createChannelInfo('CONNECTED', '2024-09-05T08:45:00Z')
    },
    lastSync: '2024-09-05T10:30:00Z'
  },
  {
    id: '2',
    name: 'Kadıköy Electronics Hub',
    code: 'KEH002',
    addressLine: '456 Bahariye Street, Floor 2',
    city: 'Istanbul',
    district: 'Kadıköy',
    hoursLabel: 'Mon-Sun 10AM-10PM',
    phone: '+90 216 987 6543',
    dataHealth: 'WARNING',
    channels: {
      GBP: createChannelInfo('CONNECTED', '2024-09-05T11:00:00Z'),
      APPLE: createChannelInfo('NOT_CONNECTED', undefined, 'Store not verified'),
      META: createChannelInfo('CONNECTED', '2024-09-05T09:30:00Z'),
      GMC: createChannelInfo('NEEDS_ATTENTION', '2024-09-04T16:15:00Z', 'Category mismatch')
    },
    lastSync: '2024-09-05T11:00:00Z'
  },
  {
    id: '3',
    name: 'Ankara Central Market',
    code: 'ACM003',
    addressLine: '789 Kızılay Square, Building A',
    city: 'Ankara',
    district: 'Çankaya',
    hoursLabel: 'Mon-Fri 8AM-8PM, Sat-Sun 10AM-6PM',
    phone: '+90 312 555 0123',
    dataHealth: 'HEALTHY',
    channels: {
      GBP: createChannelInfo('CONNECTED', '2024-09-05T12:15:00Z'),
      APPLE: createChannelInfo('CONNECTED', '2024-09-05T11:45:00Z'),
      META: createChannelInfo('CONNECTED', '2024-09-05T10:20:00Z'),
      GMC: createChannelInfo('CONNECTED', '2024-09-05T09:50:00Z')
    },
    lastSync: '2024-09-05T12:15:00Z'
  },
  {
    id: '4',
    name: 'İzmir Coastal Boutique',
    code: 'ICB004',
    addressLine: '321 Kordon Boulevard',
    city: 'İzmir',
    district: 'Konak',
    hoursLabel: 'Tue-Sun 11AM-8PM, Closed Mon',
    phone: '+90 232 444 7890',
    dataHealth: 'ERROR',
    channels: {
      GBP: createChannelInfo('NEEDS_ATTENTION', '2024-09-03T15:30:00Z', 'Hours incorrect'),
      APPLE: createChannelInfo('NOT_CONNECTED', undefined, 'Pending approval'),
      META: createChannelInfo('CONNECTED', '2024-09-05T08:00:00Z'),
      GMC: createChannelInfo('NEEDS_ATTENTION', '2024-09-04T12:00:00Z', 'Address mismatch')
    },
    lastSync: '2024-09-03T15:30:00Z'
  },
  {
    id: '5',
    name: 'Bursa Textile Center',
    code: 'BTC005',
    addressLine: '654 Atatürk Street, Commercial Complex',
    city: 'Bursa',
    district: 'Osmangazi',
    hoursLabel: 'Mon-Sat 9AM-7PM, Sun 12PM-6PM',
    phone: '+90 224 333 2211',
    dataHealth: 'HEALTHY',
    channels: {
      GBP: createChannelInfo('CONNECTED', '2024-09-05T13:00:00Z'),
      APPLE: createChannelInfo('CONNECTED', '2024-09-05T12:30:00Z'),
      META: createChannelInfo('NEEDS_ATTENTION', '2024-09-04T18:00:00Z', 'Low engagement'),
      GMC: createChannelInfo('CONNECTED', '2024-09-05T11:15:00Z')
    },
    lastSync: '2024-09-05T13:00:00Z'
  },
  {
    id: '6',
    name: 'Antalya Beach Store',
    code: 'ABS006',
    addressLine: '987 Lara Beach Avenue',
    city: 'Antalya',
    district: 'Muratpaşa',
    hoursLabel: 'Daily 9AM-11PM (Summer), 10AM-8PM (Winter)',
    phone: '+90 242 666 5544',
    dataHealth: 'WARNING',
    channels: {
      GBP: createChannelInfo('CONNECTED', '2024-09-05T14:20:00Z'),
      APPLE: createChannelInfo('NEEDS_ATTENTION', '2024-09-04T10:15:00Z', 'Seasonal hours update needed'),
      META: createChannelInfo('CONNECTED', '2024-09-05T13:45:00Z'),
      GMC: createChannelInfo('NOT_CONNECTED', undefined, 'Location not eligible')
    },
    lastSync: '2024-09-05T14:20:00Z'
  },
  {
    id: '7',
    name: 'Gaziantep Spice Market',
    code: 'GSM007',
    addressLine: '147 Baklava Street, Historic Quarter',
    city: 'Gaziantep',
    district: 'Şahinbey',
    hoursLabel: 'Mon-Sat 7AM-9PM, Sun 8AM-6PM',
    phone: '+90 342 777 8899',
    dataHealth: 'HEALTHY',
    channels: {
      GBP: createChannelInfo('CONNECTED', '2024-09-05T15:00:00Z'),
      APPLE: createChannelInfo('CONNECTED', '2024-09-05T14:30:00Z'),
      META: createChannelInfo('CONNECTED', '2024-09-05T13:20:00Z'),
      GMC: createChannelInfo('CONNECTED', '2024-09-05T12:40:00Z')
    },
    lastSync: '2024-09-05T15:00:00Z'
  },
  {
    id: '8',
    name: 'Trabzon Tea House',
    code: 'TTH008',
    addressLine: '258 Uzun Street, Old Town',
    city: 'Trabzon',
    district: 'Ortahisar',
    hoursLabel: 'Daily 6AM-12AM',
    phone: '+90 462 888 1122',
    dataHealth: 'WARNING',
    channels: {
      GBP: createChannelInfo('NEEDS_ATTENTION', '2024-09-04T20:00:00Z', 'Menu needs translation'),
      APPLE: createChannelInfo('NOT_CONNECTED', undefined, 'Category not available'),
      META: createChannelInfo('CONNECTED', '2024-09-05T16:00:00Z'),
      GMC: createChannelInfo('CONNECTED', '2024-09-05T15:30:00Z')
    },
    lastSync: '2024-09-04T20:00:00Z'
  },
  {
    id: '9',
    name: 'Konya Carpet Gallery',
    code: 'KCG009',
    addressLine: '369 Mevlana Avenue, Art District',
    city: 'Konya',
    district: 'Selçuklu',
    hoursLabel: 'Mon-Fri 9AM-6PM, Sat 10AM-5PM, Closed Sun',
    phone: '+90 332 999 3344',
    dataHealth: 'HEALTHY',
    channels: {
      GBP: createChannelInfo('CONNECTED', '2024-09-05T16:45:00Z'),
      APPLE: createChannelInfo('CONNECTED', '2024-09-05T16:15:00Z'),
      META: createChannelInfo('CONNECTED', '2024-09-05T15:50:00Z'),
      GMC: createChannelInfo('NEEDS_ATTENTION', '2024-09-04T11:30:00Z', 'Inventory sync issue')
    },
    lastSync: '2024-09-05T16:45:00Z'
  },
  {
    id: '10',
    name: 'Diyarbakır Heritage Shop',
    code: 'DHS010',
    addressLine: '741 Gazi Street, Cultural Center',
    city: 'Diyarbakır',
    district: 'Bağlar',
    hoursLabel: 'Tue-Sun 10AM-7PM, Closed Mon',
    phone: '+90 412 111 5566',
    dataHealth: 'ERROR',
    channels: {
      GBP: createChannelInfo('NOT_CONNECTED', undefined, 'Verification failed'),
      APPLE: createChannelInfo('NEEDS_ATTENTION', '2024-09-03T08:00:00Z', 'Photos rejected'),
      META: createChannelInfo('NEEDS_ATTENTION', '2024-09-04T09:15:00Z', 'Policy violation'),
      GMC: createChannelInfo('NOT_CONNECTED', undefined, 'Account suspended')
    },
    lastSync: '2024-09-03T08:00:00Z'
  },
  {
    id: '11',
    name: 'Eskişehir Student Corner',
    code: 'ESC011',
    addressLine: '852 University Street, Campus Area',
    city: 'Eskişehir',
    district: 'Odunpazarı',
    hoursLabel: 'Mon-Fri 8AM-10PM, Sat-Sun 10AM-9PM',
    phone: '+90 222 222 7788',
    dataHealth: 'HEALTHY',
    channels: {
      GBP: createChannelInfo('CONNECTED', '2024-09-05T17:20:00Z'),
      APPLE: createChannelInfo('CONNECTED', '2024-09-05T16:50:00Z'),
      META: createChannelInfo('CONNECTED', '2024-09-05T17:00:00Z'),
      GMC: createChannelInfo('CONNECTED', '2024-09-05T16:30:00Z')
    },
    lastSync: '2024-09-05T17:20:00Z'
  },
  {
    id: '12',
    name: 'Samsun Port Market',
    code: 'SPM012',
    addressLine: '963 Harbor Road, Marine District',
    city: 'Samsun',
    district: 'İlkadım',
    hoursLabel: 'Mon-Sat 6AM-8PM, Sun 8AM-6PM',
    phone: '+90 362 333 9900',
    dataHealth: 'WARNING',
    channels: {
      GBP: createChannelInfo('CONNECTED', '2024-09-05T18:00:00Z'),
      APPLE: createChannelInfo('NEEDS_ATTENTION', '2024-09-04T14:45:00Z', 'Accessibility info missing'),
      META: createChannelInfo('CONNECTED', '2024-09-05T17:30:00Z'),
      GMC: createChannelInfo('CONNECTED', '2024-09-05T17:15:00Z')
    },
    lastSync: '2024-09-05T18:00:00Z'
  }
];

// Helper functions for filtering and searching
export const getUniqueValues = {
  cities: () => Array.from(new Set(mockLocations.map(loc => loc.city))).sort(),
  districts: () => Array.from(new Set(mockLocations.map(loc => loc.district))).sort(),
  statuses: (): DataHealth[] => ['HEALTHY', 'WARNING', 'ERROR'],
  channels: (): Channel[] => ['GBP', 'APPLE', 'META', 'GMC']
};

export const filterLocations = (
  locations: Location[],
  searchQuery: string,
  filters: { cities: string[]; statuses: DataHealth[]; channels: Channel[] }
): Location[] => {
  return locations.filter(location => {
    // Search filter
    const searchMatch = !searchQuery || 
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.addressLine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.district.toLowerCase().includes(searchQuery.toLowerCase());

    // City filter
    const cityMatch = filters.cities.length === 0 || filters.cities.includes(location.city);

    // Status filter
    const statusMatch = filters.statuses.length === 0 || filters.statuses.includes(location.dataHealth);

    // Channel filter - location should have at least one of the filtered channels connected
    const channelMatch = filters.channels.length === 0 || 
      filters.channels.some(channel => 
        location.channels[channel]?.status === 'CONNECTED' || 
        location.channels[channel]?.status === 'NEEDS_ATTENTION'
      );

    return searchMatch && cityMatch && statusMatch && channelMatch;
  });
};

export const paginateLocations = (
  locations: Location[],
  page: number,
  pageSize: number
): { data: Location[]; totalCount: number; totalPages: number } => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    data: locations.slice(startIndex, endIndex),
    totalCount: locations.length,
    totalPages: Math.ceil(locations.length / pageSize)
  };
};