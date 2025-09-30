import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AutocompleteSelect, AutocompleteOption } from "@/components/ui/autocomplete-select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AuditAccordion } from "@/components/ui/audit-accordion";
import { RichLocationCard } from "@/components/ui/rich-location-card";
import Header from '@/components/overview/header';
import { 
  Target,
  Loader2,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Link,
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  ExternalLink,
  Phone,
  MapPin,
  Tag,
  Building,
  Download,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { SiMeta } from 'react-icons/si';
import venuexLogo from '@assets/vx-logo-1000x1000_1756824361260.png';

interface VenueXLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  category: string;
  storeCode: string;
  region: string;
  city: string;
  postalCode: string;
}

interface PlatformLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  category: string;
  platformId: string;
  platformUrl?: string;
  city: string;
  postalCode: string;
  storeCode: string;
}

interface MatchedLocation {
  platformLocation: PlatformLocation;
  venueXLocation: VenueXLocation;
  confidence: number;
}

interface UnmatchedLocation extends PlatformLocation {
  status: 'pending' | 'linked' | 'recreate';
  linkedTo?: VenueXLocation;
  recreateWith?: VenueXLocation;
}

interface UnmatchedVenueXLocation extends VenueXLocation {
  status: 'pending' | 'linked' | 'will_create';
  linkedPlatformPage?: PlatformLocation;
  willBeCreated?: boolean;
}

const mockVenueXLocations: VenueXLocation[] = [
  { 
    id: 'vx1', 
    name: 'Demo Akasya AVM', 
    address: 'Acıbadem Mahallesi, Akasya AVM Kat:1 No:112', 
    phone: '+90 216 123 4567',
    category: 'Department Store',
    storeCode: 'BYN001', 
    region: 'Istanbul - Anadolu',
    city: 'Istanbul',
    postalCode: '34660'
  },
  { 
    id: 'vx2', 
    name: 'Demo İstinye Park', 
    address: 'İstinye Park AVM, Pınar Mahallesi, Katar Caddesi No:11', 
    phone: '+90 212 345 6789',
    category: 'Department Store',
    storeCode: 'BYN045', 
    region: 'Istanbul - Avrupa',
    city: 'Istanbul',
    postalCode: '34460'
  },
  { 
    id: 'vx3', 
    name: 'Demo Forum İstanbul', 
    address: 'Forum İstanbul AVM, Kocatepe Mahallesi, Paşa Caddesi No:5-5A', 
    phone: '+90 212 987 6543',
    category: 'Department Store',
    storeCode: 'BYN023', 
    region: 'Istanbul - Avrupa',
    city: 'Istanbul',
    postalCode: '34045'
  },
  { 
    id: 'vx4', 
    name: 'Demo Zorlu Center', 
    address: 'Zorlu Center, Levazım Mahallesi, Koru Sokak No:2', 
    phone: '+90 212 456 7890',
    category: 'Department Store',
    storeCode: 'BYN067', 
    region: 'Istanbul - Avrupa',
    city: 'Istanbul',
    postalCode: '34340'
  },
  { 
    id: 'vx5', 
    name: 'Demo Kanyon AVM', 
    address: 'Kanyon AVM, Büyükdere Caddesi No:185', 
    phone: '+90 212 567 8901',
    category: 'Department Store',
    storeCode: 'BYN089', 
    region: 'Istanbul - Avrupa',
    city: 'Istanbul',
    postalCode: '34394'
  },
  { 
    id: 'vx6', 
    name: 'Demo Optimum AVM', 
    address: 'Optimum AVM, Yeşilköy Mahallesi, Atatürk Caddesi No:12', 
    phone: '+90 212 234 5678',
    category: 'Department Store',
    storeCode: 'BYN012', 
    region: 'Istanbul - Avrupa',
    city: 'Istanbul',
    postalCode: '34149'
  },
  { 
    id: 'vx7', 
    name: 'Demo Marmara Forum', 
    address: 'Marmara Forum AVM, Tahılpazarı Mahallesi, Forum Caddesi No:4', 
    phone: '+90 212 345 1234',
    category: 'Department Store',
    storeCode: 'BYN034', 
    region: 'Istanbul - Avrupa',
    city: 'Istanbul',
    postalCode: '34840'
  },
  { 
    id: 'vx8', 
    name: 'Demo Capacity AVM', 
    address: 'Capacity AVM, Mahmutbey Mahallesi, Taşocağı Caddesi No:22', 
    phone: '+90 212 456 2345',
    category: 'Department Store',
    storeCode: 'BYN056', 
    region: 'Istanbul - Avrupa',
    city: 'Istanbul',
    postalCode: '34218'
  },
  { 
    id: 'vx9', 
    name: 'Demo Carousel AVM', 
    address: 'Carousel AVM, Atatürk Mahallesi, Çevre Yolu No:15', 
    phone: '+90 212 567 3456',
    category: 'Department Store',
    storeCode: 'BYN078', 
    region: 'Istanbul - Avrupa',
    city: 'Istanbul',
    postalCode: '34522'
  },
  { 
    id: 'vx10', 
    name: 'Demo Vadistanbul', 
    address: 'Vadistanbul AVM, Ayazağa Mahallesi, Cendere Caddesi No:109F', 
    phone: '+90 212 678 4567',
    category: 'Department Store',
    storeCode: 'BYN090', 
    region: 'Istanbul - Avrupa',
    city: 'Istanbul',
    postalCode: '34485'
  },
  { 
    id: 'vx11', 
    name: 'Demo Özdilek Park', 
    address: 'Özdilek Park AVM, Nilüfer Mahallesi, Uludağ Bulvarı No:68', 
    phone: '+90 224 123 4567',
    category: 'Department Store',
    storeCode: 'BYN103', 
    region: 'Marmara',
    city: 'Bursa',
    postalCode: '16110'
  },
  { 
    id: 'vx12', 
    name: 'Demo Westpark AVM', 
    address: 'Westpark AVM, İhsaniye Mahallesi, Akpınar Caddesi No:10', 
    phone: '+90 232 234 5678',
    category: 'Department Store',
    storeCode: 'BYN125', 
    region: 'Aegean',
    city: 'Izmir',
    postalCode: '35170'
  },
  { 
    id: 'vx13', 
    name: 'Demo Agora AVM', 
    address: 'Agora AVM, Balçova Mahallesi, Mithatpaşa Caddesi No:1348', 
    phone: '+90 232 345 6789',
    category: 'Department Store',
    storeCode: 'BYN147', 
    region: 'Aegean',
    city: 'Izmir',
    postalCode: '35330'
  },
  { 
    id: 'vx14', 
    name: 'Demo Ankamall AVM', 
    address: 'Ankamall AVM, Akköprü Mahallesi, Fatih Sultan Mehmet Bulvarı No:3', 
    phone: '+90 312 456 7890',
    category: 'Department Store',
    storeCode: 'BYN169', 
    region: 'Central Anatolia',
    city: 'Ankara',
    postalCode: '06490'
  },
  { 
    id: 'vx15', 
    name: 'Demo Terracity AVM', 
    address: 'Terracity AVM, Turan Güneş Bulvarı, Yaşamkent Mahallesi No:182', 
    phone: '+90 312 567 8901',
    category: 'Department Store',
    storeCode: 'BYN181', 
    region: 'Central Anatolia',
    city: 'Ankara',
    postalCode: '06810'
  },
  { 
    id: 'vx16', 
    name: 'Demo MarkAntalya AVM', 
    address: 'MarkAntalya AVM, Fener Mahallesi, Tekelioğlu Caddesi No:56', 
    phone: '+90 242 123 4567',
    category: 'Department Store',
    storeCode: 'BYN203', 
    region: 'Mediterranean',
    city: 'Antalya',
    postalCode: '07160'
  },
  { 
    id: 'vx17', 
    name: 'Demo Deepo Outlet Center', 
    address: 'Deepo Outlet Center, Şemsettin Günaltay Caddesi No:265', 
    phone: '+90 224 234 5678',
    category: 'Outlet Store',
    storeCode: 'BYN225', 
    region: 'Marmara',
    city: 'Bursa',
    postalCode: '16250'
  },
  { 
    id: 'vx18', 
    name: 'Demo Korupark AVM', 
    address: 'Korupark AVM, Galip Erdem Caddesi No:3', 
    phone: '+90 224 345 6789',
    category: 'Department Store',
    storeCode: 'BYN247', 
    region: 'Marmara',
    city: 'Bursa',
    postalCode: '16160'
  },
];

const mockAutoMatched: MatchedLocation[] = [
  { 
    platformLocation: { 
      id: 'meta1', 
      name: 'Demo Akasya', 
      address: 'Acıbadem, Akasya AVM Kat:1', 
      phone: '+90 216 123 4567',
      category: 'Clothing Store',
      platformId: 'meta_001',
      platformUrl: 'https://facebook.com/demo.akasya',
      city: 'Istanbul',
      postalCode: '34660',
      storeCode: 'META001'
    }, 
    venueXLocation: mockVenueXLocations[0], 
    confidence: 0.95 
  },
  { 
    platformLocation: { 
      id: 'meta2', 
      name: 'Demo İstinye Park', 
      address: 'İstinye Park AVM, Pınar Mahallesi', 
      phone: '+90 212 345 6789',
      category: 'Department Store',
      platformId: 'meta_002',
      platformUrl: 'https://facebook.com/demo.istinye',
      city: 'Istanbul',
      postalCode: '34460',
      storeCode: 'META002'
    }, 
    venueXLocation: mockVenueXLocations[1], 
    confidence: 0.92 
  },
  { 
    platformLocation: { 
      id: 'meta3', 
      name: 'Demo Forum İstanbul', 
      address: 'Forum İstanbul AVM, Kocatepe Mahallesi', 
      phone: '+90 212 987 6543',
      category: 'Department Store',
      platformId: 'meta_003',
      platformUrl: 'https://facebook.com/demo.forum',
      city: 'Istanbul',
      postalCode: '34045',
      storeCode: 'META003'
    }, 
    venueXLocation: mockVenueXLocations[2], 
    confidence: 0.94 
  },
  { 
    platformLocation: { 
      id: 'meta4', 
      name: 'Demo Zorlu Center', 
      address: 'Zorlu Center, Levazım Mahallesi', 
      phone: '+90 212 456 7890',
      category: 'Department Store',
      platformId: 'meta_004',
      platformUrl: 'https://facebook.com/demo.zorlu',
      city: 'Istanbul',
      postalCode: '34340',
      storeCode: 'META004'
    }, 
    venueXLocation: mockVenueXLocations[3], 
    confidence: 0.93 
  },
  { 
    platformLocation: { 
      id: 'meta5', 
      name: 'Demo Kanyon', 
      address: 'Kanyon AVM, Büyükdere Caddesi', 
      phone: '+90 212 567 8901',
      category: 'Department Store',
      platformId: 'meta_005',
      platformUrl: 'https://facebook.com/demo.kanyon',
      city: 'Istanbul',
      postalCode: '34394',
      storeCode: 'META005'
    }, 
    venueXLocation: mockVenueXLocations[4], 
    confidence: 0.91 
  },
  { 
    platformLocation: { 
      id: 'meta6', 
      name: 'Demo Optimum', 
      address: 'Optimum AVM, Yeşilköy Mahallesi', 
      phone: '+90 212 234 5678',
      category: 'Department Store',
      platformId: 'meta_006',
      platformUrl: 'https://facebook.com/demo.optimum',
      city: 'Istanbul',
      postalCode: '34149',
      storeCode: 'META006'
    }, 
    venueXLocation: mockVenueXLocations[5], 
    confidence: 0.96 
  },
  { 
    platformLocation: { 
      id: 'meta7', 
      name: 'Demo Marmara Forum', 
      address: 'Marmara Forum AVM, Tahılpazarı Mahallesi', 
      phone: '+90 212 345 1234',
      category: 'Department Store',
      platformId: 'meta_007',
      platformUrl: 'https://facebook.com/demo.marmaraforum',
      city: 'Istanbul',
      postalCode: '34840',
      storeCode: 'META007'
    }, 
    venueXLocation: mockVenueXLocations[6], 
    confidence: 0.89 
  },
  { 
    platformLocation: { 
      id: 'meta8', 
      name: 'Demo Capacity', 
      address: 'Capacity AVM, Mahmutbey Mahallesi', 
      phone: '+90 212 456 2345',
      category: 'Department Store',
      platformId: 'meta_008',
      platformUrl: 'https://facebook.com/demo.capacity',
      city: 'Istanbul',
      postalCode: '34218',
      storeCode: 'META008'
    }, 
    venueXLocation: mockVenueXLocations[7], 
    confidence: 0.90 
  },
  { 
    platformLocation: { 
      id: 'meta9', 
      name: 'Demo Carousel', 
      address: 'Carousel AVM, Atatürk Mahallesi', 
      phone: '+90 212 567 3456',
      category: 'Department Store',
      platformId: 'meta_009',
      platformUrl: 'https://facebook.com/demo.carousel',
      city: 'Istanbul',
      postalCode: '34522',
      storeCode: 'META009'
    }, 
    venueXLocation: mockVenueXLocations[8], 
    confidence: 0.88 
  },
  { 
    platformLocation: { 
      id: 'meta10', 
      name: 'Demo Vadistanbul', 
      address: 'Vadistanbul AVM, Ayazağa Mahallesi', 
      phone: '+90 212 678 4567',
      category: 'Department Store',
      platformId: 'meta_010',
      platformUrl: 'https://facebook.com/demo.vadistanbul',
      city: 'Istanbul',
      postalCode: '34485',
      storeCode: 'META010'
    }, 
    venueXLocation: mockVenueXLocations[9], 
    confidence: 0.97 
  },
  { 
    platformLocation: { 
      id: 'meta11', 
      name: 'Demo Özdilek Park', 
      address: 'Özdilek Park AVM, Nilüfer Mahallesi', 
      phone: '+90 224 123 4567',
      category: 'Department Store',
      platformId: 'meta_011',
      platformUrl: 'https://facebook.com/demo.ozdilek',
      city: 'Bursa',
      postalCode: '16110',
      storeCode: 'META011'
    }, 
    venueXLocation: mockVenueXLocations[10], 
    confidence: 0.92 
  },
  { 
    platformLocation: { 
      id: 'meta12', 
      name: 'Demo Westpark', 
      address: 'Westpark AVM, İhsaniye Mahallesi', 
      phone: '+90 232 234 5678',
      category: 'Department Store',
      platformId: 'meta_012',
      platformUrl: 'https://facebook.com/demo.westpark',
      city: 'Izmir',
      postalCode: '35170',
      storeCode: 'META012'
    }, 
    venueXLocation: mockVenueXLocations[11], 
    confidence: 0.91 
  }
];

const mockUnmatched: UnmatchedLocation[] = [];

// Available platform pages that aren't matched yet (15 total platform pages - 12 matched = 3 unmatched)
const mockAvailablePlatformPages: PlatformLocation[] = [
  { 
    id: 'meta13', 
    name: 'Demo Agora', 
    address: 'Agora AVM, Balçova Mahallesi', 
    phone: '+90 232 345 6789',
    category: 'Department Store',
    platformId: 'meta_013',
    platformUrl: 'https://facebook.com/demo.agora',
    city: 'Izmir',
    postalCode: '35330',
    storeCode: 'META013'
  },
  { 
    id: 'meta14', 
    name: 'Demo Ankamall', 
    address: 'Ankamall AVM, Akköprü Mahallesi', 
    phone: '+90 312 456 7890',
    category: 'Department Store',
    platformId: 'meta_014',
    platformUrl: 'https://facebook.com/demo.ankamall',
    city: 'Ankara',
    postalCode: '06490',
    storeCode: 'META014'
  },
  { 
    id: 'meta15', 
    name: 'Demo Terracity', 
    address: 'Terracity AVM, Turan Güneş Bulvarı', 
    phone: '+90 312 567 8901',
    category: 'Department Store',
    platformId: 'meta_015',
    platformUrl: 'https://facebook.com/demo.terracity',
    city: 'Ankara',
    postalCode: '06810',
    storeCode: 'META015'
  },
];

// Platform locations without VenueX counterparts (unmatched platform locations)
const mockUnmatchedPlatformLocations: PlatformLocation[] = [
  { 
    id: 'meta16', 
    name: 'Demo Test Location A', 
    address: 'Test Street 123, Kadıköy', 
    phone: '+90 216 111 2222',
    category: 'Department Store',
    platformId: 'meta_016',
    platformUrl: 'https://facebook.com/demo.test.a',
    city: 'Istanbul',
    postalCode: '34710',
    storeCode: 'META016'
  },
  { 
    id: 'meta17', 
    name: 'Demo Test Location B', 
    address: 'Test Avenue 456, Çankaya', 
    phone: '+90 312 222 3333',
    category: 'Department Store',
    platformId: 'meta_017',
    platformUrl: 'https://facebook.com/demo.test.b',
    city: 'Ankara',
    postalCode: '06680',
    storeCode: 'META017'
  },
  { 
    id: 'meta18', 
    name: 'Demo Test Location C', 
    address: 'Test Boulevard 789, Bornova', 
    phone: '+90 232 333 4444',
    category: 'Department Store',
    platformId: 'meta_018',
    platformUrl: 'https://facebook.com/demo.test.c',
    city: 'Izmir',
    postalCode: '35040',
    storeCode: 'META018'
  },
];

// Unmatched VenueX locations that need platform pages (18 total - 12 matched = 6 unmatched)
const mockUnmatchedVenueX: UnmatchedVenueXLocation[] = [
  {
    ...mockVenueXLocations[12], // Demo Agora AVM
    status: 'pending'
  },
  {
    ...mockVenueXLocations[13], // Demo Ankamall AVM
    status: 'pending'
  },
  {
    ...mockVenueXLocations[14], // Demo Terracity AVM
    status: 'pending'
  },
  {
    ...mockVenueXLocations[15], // Demo MarkAntalya AVM
    status: 'pending'
  },
  {
    ...mockVenueXLocations[16], // Demo Deepo Outlet Center
    status: 'pending'
  },
  {
    ...mockVenueXLocations[17], // Demo Korupark AVM
    status: 'pending'
  },
];

// Location Detail Card Component
const LocationDetailCard = ({ location, type, className = "" }: { 
  location: VenueXLocation | PlatformLocation, 
  type: 'venuex' | 'platform',
  className?: string 
}) => (
  <div className={`p-4 border rounded-lg bg-white dark:bg-gray-800 ${className}`}>
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{location.name}</h4>
        
        {/* Store Code - Positioned directly below name as primary identifier */}
        {'storeCode' in location && (
          <div className={`flex items-center text-sm font-medium mb-2 px-2 py-1 rounded-md w-fit ${
            type === 'venuex' 
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
              : 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
          }`}>
            <Building className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>Code: {location.storeCode}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>{location.address}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
          <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>{location.phone}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
          <Tag className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>{location.category}</span>
        </div>
        
        {/* Additional VenueX info */}
        {type === 'venuex' && 'region' in location && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>{location.region} • {location.city}</span>
          </div>
        )}
        {type === 'platform' && 'platformUrl' in location && location.platformUrl && (
          <a 
            href={location.platformUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mt-2"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View on Meta
          </a>
        )}
      </div>
    </div>
  </div>
);

// Two-sided comparison card
const ComparisonCard = ({ 
  leftLocation, 
  rightLocation, 
  leftType, 
  rightType, 
  leftLabel = "", 
  rightLabel = "",
  icon = <Link className="w-6 h-6 text-blue-600" />,
  className = ""
}: {
  leftLocation: VenueXLocation | PlatformLocation;
  rightLocation: VenueXLocation | PlatformLocation;
  leftType: 'venuex' | 'platform';
  rightType: 'venuex' | 'platform';
  leftLabel?: string;
  rightLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}) => (
  <div className={`border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 ${className}`}>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
      <div className="space-y-2">
        {leftLabel && <div className="text-xs font-medium text-gray-500 uppercase">{leftLabel}</div>}
        <LocationDetailCard location={leftLocation} type={leftType} className="border-none bg-transparent p-0" />
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          {icon && <div>{icon}</div>}
        </div>
      </div>
      <div className="space-y-2">
        {rightLabel && <div className="text-xs font-medium text-gray-500 uppercase">{rightLabel}</div>}
        <LocationDetailCard location={rightLocation} type={rightType} className="border-none bg-transparent p-0" />
      </div>
    </div>
  </div>
);

export default function LocationMatch() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [unmatchedLocations, setUnmatchedLocations] = useState<UnmatchedLocation[]>(mockUnmatched);
  const [unmatchedVenueXLocations, setUnmatchedVenueXLocations] = useState<UnmatchedVenueXLocation[]>(mockUnmatchedVenueX);
  const [unmatchedPlatformLocations, setUnmatchedPlatformLocations] = useState<PlatformLocation[]>(mockUnmatchedPlatformLocations);
  const [selectedUnmatched, setSelectedUnmatched] = useState<string | null>(null);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [autoMatchedOpen, setAutoMatchedOpen] = useState(false);
  const [manualLinkedOpen, setManualLinkedOpen] = useState(true);
  const [recreateOpen, setRecreateOpen] = useState(true);
  const [showAllMatchesModal, setShowAllMatchesModal] = useState(false);
  
  // Step 2 state
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformPageSelections, setPlatformPageSelections] = useState<Record<string, string>>({});
  
  // Search state for autocomplete dropdowns
  const [linkSearchQuery, setLinkSearchQuery] = useState('');
  const [recreateSearchQuery, setRecreateSearchQuery] = useState('');
  const locationsPerPage = 20; // Increased page size for better workflow
  
  // Search state for Step 3 lists
  const [autoMatchedSearch, setAutoMatchedSearch] = useState('');
  const [linkedSearch, setLinkedSearch] = useState('');
  const [recreateSearch, setRecreateSearch] = useState('');
  const [createSearch, setCreateSearch] = useState('');
  const [unmatchedPlatformSearch, setUnmatchedPlatformSearch] = useState('');

  // Auto-populate search when a location is selected
  useEffect(() => {
    if (selectedUnmatched) {
      const location = unmatchedLocations.find(loc => loc.id === selectedUnmatched);
      if (location) {
        const searchTerm = generateSearchTerms(location);
        setLinkSearchQuery(searchTerm);
      }
    } else {
      setLinkSearchQuery('');
    }
  }, [selectedUnmatched, unmatchedLocations]);
  
  // CSV Export functions
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };
  
  const exportMatchedLocations = () => {
    const matchedData = mockAutoMatched.map(match => ({
      'VenueX Name': match.venueXLocation.name,
      'VenueX Store Code': match.venueXLocation.storeCode,
      'VenueX Address': match.venueXLocation.address,
      'VenueX Phone': match.venueXLocation.phone,
      'VenueX Region': match.venueXLocation.region,
      'VenueX City': match.venueXLocation.city,
      'Meta Name': match.platformLocation.name,
      'Meta Store Code': match.platformLocation.storeCode,
      'Meta Address': match.platformLocation.address,
      'Meta Phone': match.platformLocation.phone,
      'Meta URL': match.platformLocation.platformUrl || '',
      'Confidence Score': match.confidence,
      'Match Status': 'Automatically Matched'
    }));
    exportToCSV(matchedData, 'matched-locations.csv');
  };
  
  const exportUnmatchedLocations = () => {
    const unmatchedData = unmatchedLocations.map(location => ({
      'Name': location.name,
      'Store Code': location.storeCode,
      'Address': location.address,
      'Phone': location.phone,
      'City': location.city,
      'Category': location.category,
      'Meta ID': location.platformId,
      'Meta URL': location.platformUrl || '',
      'Status': location.status,
      'Linked To': location.linkedTo?.name || '',
      'Recreate With': location.recreateWith?.name || ''
    }));
    exportToCSV(unmatchedData, 'unmatched-locations.csv');
  };
  
  // Bulk action functions
  const handleSelectLocation = (locationId: string) => {
    setSelectedLocations(prev => 
      prev.includes(locationId) 
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };
  
  const handleSelectAll = (pageLocations: UnmatchedLocation[]) => {
    const pageLocationIds = pageLocations.map(loc => loc.id);
    const allSelected = pageLocationIds.every(id => selectedLocations.includes(id));
    
    if (allSelected) {
      setSelectedLocations(prev => prev.filter(id => !pageLocationIds.includes(id)));
    } else {
      setSelectedLocations(prev => Array.from(new Set([...prev, ...pageLocationIds])));
    }
  };
  
  // Generate pre-populated search terms from location name
  const generateSearchTerms = (location: PlatformLocation): string => {
    const name = location.name.toLowerCase();
    
    // Extract meaningful terms, focusing on store names and locations
    let searchTerm = '';
    
    // If it contains "demo", use the part after demo
    if (name.includes('demo')) {
      const afterDemo = name.split('demo')[1]?.trim();
      if (afterDemo) {
        // Remove common words like "store", "branch", "outlet"
        searchTerm = afterDemo
          .replace(/\b(store|branch|outlet|shop|mall)\b/g, '')
          .trim();
      }
    }
    
    // If no meaningful term found, try to extract location indicators
    if (!searchTerm) {
      // Look for city or district names in the address
      const address = location.address.toLowerCase();
      const addressParts = address.split(',')[0]; // Take first part before comma
      searchTerm = addressParts.trim();
    }
    
    // Clean up and return the most relevant term
    return searchTerm || location.name.split(' ').slice(-1)[0]; // Last word as fallback
  };
  
  const bulkRecreateSelected = () => {
    selectedLocations.forEach(locationId => {
      const location = unmatchedLocations.find(loc => loc.id === locationId);
      if (location && mockVenueXLocations.length > 0) {
        // For bulk recreate, use the first available VenueX location as default
        handleRecreateLocation(locationId, mockVenueXLocations[0].id);
      }
    });
    setSelectedLocations([]);
  };
  
  // Filtering and search functions
  const getFilteredLocations = () => {
    return unmatchedLocations.filter(location => {
      // Status filter
      if (filterStatus !== 'all' && location.status !== filterStatus) {
        return false;
      }
      
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          location.name.toLowerCase().includes(query) ||
          location.storeCode.toLowerCase().includes(query) ||
          location.address.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  };
  
  const getSuggestedMatch = (platformLocation: PlatformLocation): VenueXLocation | null => {
    if (!platformLocation) return null;
    
    const suggestions = availableVenueXLocations.map(venueX => {
      let score = 0;
      
      // Name similarity (basic implementation)
      const platformName = platformLocation.name.toLowerCase();
      const venueName = venueX.name.toLowerCase();
      if (platformName.includes('demo') && venueName.includes('demo')) score += 5;
      if (platformName.includes(venueX.city.toLowerCase()) || venueName.includes(platformLocation.city.toLowerCase())) score += 3;
      
      // Address similarity (basic check for district/area names)
      const platformAddr = platformLocation.address.toLowerCase();
      const venueAddr = venueX.address.toLowerCase();
      if (platformAddr.includes(venueAddr.split(',')[0].toLowerCase()) || 
          venueAddr.includes(platformAddr.split(',')[0].toLowerCase())) score += 2;
      
      return { location: venueX, score };
    });
    
    suggestions.sort((a, b) => b.score - a.score);
    return suggestions.length > 0 && suggestions[0].score > 0 ? suggestions[0].location : null;
  };

  // Convert VenueX locations to AutocompleteOption format
  const convertToAutocompleteOptions = (
    locations: VenueXLocation[], 
    suggestedMatch?: VenueXLocation | null,
    searchQuery?: string
  ): AutocompleteOption[] => {
    const filteredLocations = searchQuery 
      ? locations.filter(location => 
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.storeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.address.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : locations;

    // Sort locations by relevance to search query
    const sortedLocations = searchQuery 
      ? filteredLocations.sort((a, b) => {
          const aRelevance = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0;
          const bRelevance = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0;
          return bRelevance - aRelevance;
        })
      : filteredLocations;

    return sortedLocations.map(location => ({
      id: location.id,
      label: location.name,
      value: location.id,
      subtitle: location.address,
      badge: location.storeCode,
      suggested: false // No more automatic suggestions
    }));
  };

  // Filter available VenueX locations for linking based on search
  const getFilteredLinkOptions = (searchQuery: string): AutocompleteOption[] => {
    return convertToAutocompleteOptions(availableVenueXLocations, null, searchQuery);
  };

  // Filter VenueX locations for recreation based on search
  const getFilteredRecreateOptions = (searchQuery: string): AutocompleteOption[] => {
    return convertToAutocompleteOptions(mockVenueXLocations, null, searchQuery);
  };

  // Simulate loading on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const availableVenueXLocations = mockVenueXLocations.filter(loc => {
    // Exclude already matched locations
    const isAutoMatched = mockAutoMatched.some(match => match.venueXLocation.id === loc.id);
    const isManuallyLinked = unmatchedLocations.some(unmatched => unmatched.linkedTo?.id === loc.id);
    return !isAutoMatched && !isManuallyLinked;
  });

  const handleLinkLocation = (unmatchedId: string, venueXLocationId: string) => {
    const venueXLocation = mockVenueXLocations.find(loc => loc.id === venueXLocationId);
    if (!venueXLocation) return;

    setUnmatchedLocations(prev => 
      prev.map(loc => 
        loc.id === unmatchedId 
          ? { ...loc, status: 'linked', linkedTo: venueXLocation }
          : loc
      )
    );
    setSelectedUnmatched(null);
  };

  const handleRecreateLocation = (unmatchedId: string, venueXLocationId: string) => {
    const venueXLocation = mockVenueXLocations.find(loc => loc.id === venueXLocationId);
    if (!venueXLocation) return;

    setUnmatchedLocations(prev => 
      prev.map(loc => 
        loc.id === unmatchedId 
          ? { ...loc, status: 'recreate', recreateWith: venueXLocation }
          : loc
      )
    );
    setSelectedUnmatched(null);
  };

  const handleLinkPlatformPage = (venueXLocationId: string, platformPageId: string) => {
    // Search in both available platform pages and unmatched platform locations
    const platformPage = [...mockAvailablePlatformPages, ...unmatchedPlatformLocations].find(
      page => page.id === platformPageId
    );
    if (!platformPage) return;

    setUnmatchedVenueXLocations(prev => 
      prev.map(loc => 
        loc.id === venueXLocationId 
          ? { ...loc, status: 'linked' as const, linkedPlatformPage: platformPage }
          : loc
      )
    );

    // If linking to an unmatched platform location, remove it from the unmatched list
    if (unmatchedPlatformLocations.some(loc => loc.id === platformPageId)) {
      setUnmatchedPlatformLocations(prev => prev.filter(loc => loc.id !== platformPageId));
    }
  };

  const handleCreatePlatformPage = (venueXLocationId: string) => {
    setUnmatchedVenueXLocations(prev => 
      prev.map(loc => 
        loc.id === venueXLocationId 
          ? { ...loc, status: 'will_create' as const, willBeCreated: true }
          : loc
      )
    );
  };

  const canProceedToStep3 = unmatchedVenueXLocations.every(loc => loc.status !== 'pending');
  const pendingCount = unmatchedVenueXLocations.filter(loc => loc.status === 'pending').length;
  const linkedCount = unmatchedVenueXLocations.filter(loc => loc.status === 'linked').length;
  const createCount = unmatchedVenueXLocations.filter(loc => loc.status === 'will_create').length;
  const recreateCount = unmatchedLocations.filter(loc => loc.status === 'recreate').length;

  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Step 1 of 3: Automatic Matching
        </h2>
      </div>

      <Card className="text-center">
        <CardContent className="p-8">
          {isLoading ? (
            <div>
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Analyzing your Meta Pages...</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {mockVenueXLocations.length} locations in VenueX
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {mockAutoMatched.length + mockAvailablePlatformPages.length} locations imported from Meta
              </p>
              <p className="text-gray-600 dark:text-gray-400">Comparing locations...</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center gap-8 mb-4">
                <img src={venuexLogo} alt="VenueX" className="w-12 h-12" />
                <CheckCircle className="w-12 h-12 text-green-600" />
                <SiMeta className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-6">Matching Complete!</h3>
              
              {/* Visual Results Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{mockAutoMatched.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Matched</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">{unmatchedVenueXLocations.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Need Review</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg h-6 overflow-hidden">
                  <div className="h-full flex">
                    {/* Green segment for matched */}
                    <div 
                      className="bg-green-500 flex items-center justify-center text-white text-sm font-medium"
                      style={{ width: `${(mockAutoMatched.length / (mockAutoMatched.length + unmatchedVenueXLocations.length)) * 100}%` }}
                    >
                      {mockAutoMatched.length > 0 && `${mockAutoMatched.length} Matched`}
                    </div>
                    {/* Amber segment for unmatched */}
                    <div 
                      className="bg-amber-500 flex items-center justify-center text-white text-sm font-medium"
                      style={{ width: `${(unmatchedVenueXLocations.length / (mockAutoMatched.length + unmatchedVenueXLocations.length)) * 100}%` }}
                    >
                      {unmatchedVenueXLocations.length > 0 && `${unmatchedVenueXLocations.length} Need Review`}
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {mockVenueXLocations.length} locations in VenueX • {mockAutoMatched.length + mockAvailablePlatformPages.length} locations imported from Meta
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We've automatically matched most of your locations based on name and address similarity. 
                The remaining locations need your input to ensure everything is synced correctly.
              </p>

              {/* Export Functionality */}
              <div className="mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Export for Review</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                    For transparency, you can export all matching results for offline audit before proceeding.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={exportMatchedLocations}
                      className="flex items-center space-x-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                      data-testid="button-export-matched"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export All Matched ({mockAutoMatched.length}) to CSV</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Expectation Setting */}
              <div className="mb-8 text-center">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <p className="text-amber-800 dark:text-amber-200 font-medium">
                    Next: You will link {unmatchedVenueXLocations.length} VenueX locations to their Meta Pages.
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Each VenueX location needs a corresponding Meta page to enable tracking.
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => setCurrentStep(2)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg"
                data-testid="button-resolve-unmatched"
              >
                Link {unmatchedVenueXLocations.length} VenueX Locations
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderStep2 = () => {
    const resolvedCount = unmatchedVenueXLocations.filter(loc => loc.status !== 'pending').length;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(1)}
            data-testid="button-back-step1"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Step 2 of 3: Link VenueX Locations to Meta Pages
          </h2>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Progress Tracker */}
        <div className="sticky top-20 z-20 bg-blue-50 dark:bg-gray-900 border border-blue-200 dark:border-blue-800 rounded-lg p-4 shadow-md">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-800 dark:text-blue-200">
              Progress: {resolvedCount} of {unmatchedVenueXLocations.length} Locations Linked
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${unmatchedVenueXLocations.length > 0 ? (resolvedCount / unmatchedVenueXLocations.length) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-300 mt-1">
              {pendingCount} remaining to link
            </div>
          </div>
        </div>

        {/* VenueX Locations Table */}
        <Card>
          <CardHeader>
            <CardTitle>VenueX Locations to be Reviewed ({unmatchedVenueXLocations.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                      VenueX Location
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                      Region & Details
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100 min-w-[300px]">
                      Select Meta Page
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                      Create
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {unmatchedVenueXLocations.map((location) => (
                    <tr
                      key={location.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      data-testid={`row-venuex-${location.id}`}
                    >
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {location.name}
                          </div>
                          <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md w-fit">
                            <Building className="w-4 h-4 mr-1" />
                            Code: {location.storeCode}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1 text-sm">
                          <div className="text-gray-900 dark:text-gray-100">{location.region}</div>
                          <div className="text-gray-600 dark:text-gray-400">{location.city}</div>
                          <div className="text-gray-500 dark:text-gray-500">{location.phone}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Select
                          value={platformPageSelections[location.id] || ""}
                          onValueChange={(value) => {
                            setPlatformPageSelections(prev => ({ ...prev, [location.id]: value }));
                            if (value) {
                              handleLinkPlatformPage(location.id, value);
                            }
                          }}
                          data-testid={`select-platform-${location.id}`}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Meta page..." />
                          </SelectTrigger>
                          <SelectContent>
                            {[...mockAvailablePlatformPages, ...unmatchedPlatformLocations].map((page) => {
                              const isLinkedToOther = unmatchedVenueXLocations.some(
                                loc => loc.id !== location.id && loc.linkedPlatformPage?.id === page.id
                              );
                              return (
                                <SelectItem 
                                  key={page.id} 
                                  value={isLinkedToOther ? `disabled-${page.id}` : page.id}
                                  className={isLinkedToOther ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
                                >
                                  <div className="flex flex-col">
                                    <span className={`font-medium ${isLinkedToOther ? 'text-gray-400 dark:text-gray-600' : ''}`}>
                                      {page.name} {isLinkedToOther && '(Already linked)'}
                                    </span>
                                    <span className="text-xs text-gray-500">{page.storeCode} • {page.city}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        {location.linkedPlatformPage && (
                          <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Linked to: {location.linkedPlatformPage.name}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        {location.willBeCreated ? (
                          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Will be created on Meta
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-700 border-blue-300 hover:bg-blue-50"
                            onClick={() => handleCreatePlatformPage(location.id)}
                            disabled={location.status === 'linked'}
                            data-testid={`button-create-${location.id}`}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Create New
                          </Button>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge
                          className={`${
                            location.status === 'pending' ? 'bg-amber-500 text-white' :
                            location.status === 'linked' ? 'bg-green-500 text-white' :
                            location.status === 'will_create' ? 'bg-blue-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}
                        >
                          {location.status === 'pending' ? 'Pending' : 
                           location.status === 'linked' ? 'Linked' :
                           location.status === 'will_create' ? 'Will Create' :
                           location.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Proceed Button */}
        <div className="flex justify-center mt-8">
          <Button 
            onClick={() => setCurrentStep(3)}
            disabled={!canProceedToStep3}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg font-medium"
            data-testid="button-proceed-step3"
          >
            Review and Confirm ({pendingCount > 0 ? `${pendingCount} remaining` : 'All linked'})
          </Button>
        </div>

    </div>
  );
  };

  const renderStep3 = () => {

    // Export Sync Plan functionality
    const exportSyncPlan = () => {
      const syncPlan = {
        timestamp: new Date().toISOString(),
        totalLocations: mockAutoMatched.length + linkedCount + createCount,
        summary: {
          automaticallyMatched: mockAutoMatched.length,
          manuallyLinked: linkedCount,
          toBeCreated: createCount
        },
        details: {
          autoMatched: mockAutoMatched.map(match => ({
            platformName: match.platformLocation.name,
            platformCode: match.platformLocation.storeCode,
            venueXName: match.venueXLocation.name,
            venueXCode: match.venueXLocation.storeCode,
            confidence: match.confidence,
            action: 'Link Existing'
          })),
          manuallyLinked: unmatchedVenueXLocations
            .filter(loc => loc.status === 'linked' && loc.linkedPlatformPage)
            .map(loc => ({
              platformName: loc.linkedPlatformPage!.name,
              platformCode: loc.linkedPlatformPage!.storeCode,
              venueXName: loc.name,
              venueXCode: loc.storeCode,
              action: 'Link Existing'
            })),
          toBeCreated: unmatchedVenueXLocations
            .filter(loc => loc.status === 'will_create')
            .map(loc => ({
              venueXName: loc.name,
              venueXCode: loc.storeCode,
              action: 'Create New'
            }))
        }
      };

      const csvContent = [
        ['Action Type', 'Meta Name', 'Meta Code', 'VenueX Name', 'VenueX Code', 'Notes'],
        ...syncPlan.details.autoMatched.map(item => [
          'Auto Link', item.platformName, item.platformCode, item.venueXName, item.venueXCode, `Confidence: ${(item.confidence * 100).toFixed(1)}%`
        ]),
        ...syncPlan.details.manuallyLinked.map(item => [
          'Manual Link', item.platformName, item.platformCode, item.venueXName, item.venueXCode, 'Manually resolved'
        ]),
        ...syncPlan.details.toBeCreated.map(item => [
          'Create New', '', '', item.venueXName, item.venueXCode, 'Will create new Meta page'
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sync-plan-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    };

    // Filter functions for searchable lists
    const filteredAutoMatched = autoMatchedSearch 
      ? mockAutoMatched.filter(match => 
          match.platformLocation.name.toLowerCase().includes(autoMatchedSearch.toLowerCase()) ||
          match.venueXLocation.name.toLowerCase().includes(autoMatchedSearch.toLowerCase()) ||
          match.platformLocation.storeCode.toLowerCase().includes(autoMatchedSearch.toLowerCase()) ||
          match.venueXLocation.storeCode.toLowerCase().includes(autoMatchedSearch.toLowerCase())
        )
      : mockAutoMatched;

    const filteredLinked = linkedSearch
      ? unmatchedVenueXLocations
          .filter(loc => loc.status === 'linked' && loc.linkedPlatformPage)
          .filter(loc => 
            loc.name.toLowerCase().includes(linkedSearch.toLowerCase()) ||
            loc.linkedPlatformPage!.name.toLowerCase().includes(linkedSearch.toLowerCase()) ||
            loc.storeCode.toLowerCase().includes(linkedSearch.toLowerCase()) ||
            loc.linkedPlatformPage!.storeCode.toLowerCase().includes(linkedSearch.toLowerCase())
          )
      : unmatchedVenueXLocations.filter(loc => loc.status === 'linked' && loc.linkedPlatformPage);

    const filteredCreated = createSearch
      ? unmatchedVenueXLocations
          .filter(loc => loc.status === 'will_create')
          .filter(loc => 
            loc.name.toLowerCase().includes(createSearch.toLowerCase()) ||
            loc.storeCode.toLowerCase().includes(createSearch.toLowerCase())
          )
      : unmatchedVenueXLocations.filter(loc => loc.status === 'will_create');

    const filteredUnmatchedPlatform = unmatchedPlatformSearch
      ? unmatchedPlatformLocations.filter(loc => 
          loc.name.toLowerCase().includes(unmatchedPlatformSearch.toLowerCase()) ||
          loc.storeCode.toLowerCase().includes(unmatchedPlatformSearch.toLowerCase()) ||
          loc.address.toLowerCase().includes(unmatchedPlatformSearch.toLowerCase())
        )
      : unmatchedPlatformLocations;

    // Delete handler for unmatched platform locations
    const handleDeleteUnmatchedPlatform = (locationId: string) => {
      setUnmatchedPlatformLocations(prev => prev.filter(loc => loc.id !== locationId));
    };

    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Step 3 of 3: Review and Confirm Sync
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sync plan ready for execution
          </p>
        </div>

        {/* High-Level Summary Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Locations KPI */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border-blue-200 dark:border-blue-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {mockAutoMatched.length + linkedCount + createCount}
              </div>
              <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Total Locations
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                Ready to Sync
              </div>
            </CardContent>
          </Card>

          {/* Auto Matched KPI */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 border-green-200 dark:border-green-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {mockAutoMatched.length}
              </div>
              <div className="text-sm font-medium text-green-800 dark:text-green-200">
                Auto Matched
              </div>
              <div className="text-xs text-green-600 dark:text-green-300 mt-1">
                {mockAutoMatched.length > 0 ? `${((mockAutoMatched.length / (mockAutoMatched.length + linkedCount + createCount)) * 100).toFixed(1)}% Success` : '0% Success'}
              </div>
            </CardContent>
          </Card>

          {/* Manual Linked KPI */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border-blue-200 dark:border-blue-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {linkedCount}
              </div>
              <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Manual Links
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                Resolved Manually
              </div>
            </CardContent>
          </Card>

          {/* Created KPI */}
          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/30 border-cyan-200 dark:border-cyan-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                {createCount}
              </div>
              <div className="text-sm font-medium text-cyan-800 dark:text-cyan-200">
                Created
              </div>
              <div className="text-xs text-cyan-600 dark:text-cyan-300 mt-1">
                New Meta Pages
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Plan Section */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border-purple-200 dark:border-purple-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-800 dark:text-purple-200">
              <Download className="w-5 h-5" />
              <span>Export Sync Plan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-purple-700 dark:text-purple-300 text-sm">
              Download a comprehensive sync plan for audit, approval workflows, and documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={exportSyncPlan}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2"
                data-testid="button-export-sync-plan"
              >
                <Download className="w-4 h-4" />
                <span>Export Complete Sync Plan (CSV)</span>
              </Button>
              <div className="text-xs text-purple-600 dark:text-purple-400 py-2">
                Includes all {mockAutoMatched.length + linkedCount + createCount} locations with action details
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Audit Sections */}
        <div className="space-y-6">
          {/* Auto Matched Locations Accordion */}
          <AuditAccordion
            id="auto-matched"
            title="Automatically Matched Locations"
            count={mockAutoMatched.length}
            searchValue={autoMatchedSearch}
            onSearchChange={setAutoMatchedSearch}
            searchPlaceholder="Search auto matched locations..."
            data-testid="accordion-auto-matched"
          >
            <div className="p-4 space-y-6">
              {filteredAutoMatched.map((match, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  {/* Match Header */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Auto Match #{index + 1}
                    </h4>
                  </div>
                  
                  {/* Side by Side Locations */}
                  <div className="flex flex-col lg:flex-row gap-4 items-center">
                    {/* VenueX Location */}
                    <div className="flex-1 w-full">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">VenueX Location</div>
                      <RichLocationCard
                        location={{
                          name: match.venueXLocation.name,
                          storeCode: match.venueXLocation.storeCode,
                          address: `${match.venueXLocation.address}, ${match.venueXLocation.city}`,
                          platform: "VenueX Location"
                        }}
                        data-testid={`venuex-location-${index}`}
                      />
                    </div>
                    
                    {/* Connection Indicator */}
                    <div className="flex-shrink-0">
                      <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                        <Link className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    
                    {/* Meta Location */}
                    <div className="flex-1 w-full">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Meta Location</div>
                      <RichLocationCard
                        location={{
                          name: match.platformLocation.name,
                          storeCode: match.platformLocation.storeCode,
                          address: `${match.platformLocation.address}, ${match.platformLocation.city}`,
                          platform: "Meta Location"
                        }}
                        data-testid={`platform-location-${index}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredAutoMatched.length === 0 && autoMatchedSearch && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No matches found for "{autoMatchedSearch}"
                </div>
              )}
            </div>
          </AuditAccordion>

          {/* Manual Links Accordion */}
          {linkedCount > 0 && (
            <AuditAccordion
              id="manual-links"
              title="Manually Linked Locations"
              count={linkedCount}
              searchValue={linkedSearch}
              onSearchChange={setLinkedSearch}
              searchPlaceholder="Search manual links..."
              data-testid="accordion-manual-links"
            >
              <div className="p-4 space-y-6">
                {filteredLinked.map((location, index) => (
                  <div key={location.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    {/* Match Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        Manual Link #{index + 1}
                      </h4>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Manually Resolved
                      </Badge>
                    </div>
                    
                    {/* Side by Side Locations */}
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                      {/* VenueX Location */}
                      <div className="flex-1 w-full">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">VenueX Location</div>
                        <RichLocationCard
                          location={{
                            name: location.name,
                            storeCode: location.storeCode,
                            address: `${location.address}, ${location.city}`,
                            platform: "VenueX Location"
                          }}
                          data-testid={`manual-venuex-${location.id}`}
                        />
                      </div>
                      
                      {/* Connection Indicator */}
                      <div className="flex-shrink-0">
                        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                          <Link className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      
                      {/* Meta Location */}
                      <div className="flex-1 w-full">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Meta Location</div>
                        {location.linkedPlatformPage && (
                          <RichLocationCard
                            location={{
                              name: location.linkedPlatformPage.name,
                              storeCode: location.linkedPlatformPage.storeCode,
                              address: `${location.linkedPlatformPage.address}, ${location.linkedPlatformPage.city}`,
                              platform: "Meta Location"
                            }}
                            data-testid={`manual-platform-${location.id}`}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredLinked.length === 0 && linkedSearch && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No matches found for "{linkedSearch}"
                  </div>
                )}
              </div>
            </AuditAccordion>
          )}

          {/* Created Locations Accordion */}
          {createCount > 0 && (
            <AuditAccordion
              id="created-locations"
              title="Locations to be Created on Meta"
              count={createCount}
              searchValue={createSearch}
              onSearchChange={setCreateSearch}
              searchPlaceholder="Search created locations..."
              data-testid="accordion-created-locations"
            >
              <div className="p-4 space-y-6">
                {filteredCreated.map((location, index) => (
                  <div key={location.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        Created Location #{index + 1}
                      </h4>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Will Create on Meta
                      </Badge>
                    </div>
                    
                    {/* VenueX Location to be Created */}
                    <div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">VenueX Location</div>
                      <RichLocationCard
                        location={{
                          name: location.name,
                          storeCode: location.storeCode,
                          address: `${location.address}, ${location.city}`,
                          platform: "VenueX Location"
                        }}
                        variant="create"
                        data-testid={`created-location-${location.id}`}
                      />
                    </div>
                  </div>
                ))}
                
                {filteredCreated.length === 0 && createSearch && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No matches found for "{createSearch}"
                  </div>
                )}
              </div>
            </AuditAccordion>
          )}

          {/* Unmatched Meta Locations Accordion */}
          {unmatchedPlatformLocations.length > 0 && (
            <AuditAccordion
              id="unmatched-platform"
              title="Unmatched Meta Locations"
              count={unmatchedPlatformLocations.length}
              searchValue={unmatchedPlatformSearch}
              onSearchChange={setUnmatchedPlatformSearch}
              searchPlaceholder="Search unmatched Meta locations..."
              data-testid="accordion-unmatched-platform"
            >
              <div className="p-4 space-y-4">
                {filteredUnmatchedPlatform.map((location, index) => (
                  <div key={location.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        Unmatched Meta Location #{index + 1}
                      </h4>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                        No VenueX Match
                      </Badge>
                    </div>
                    
                    {/* Meta Location Details */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Meta Location</div>
                      <RichLocationCard
                        location={{
                          name: location.name,
                          storeCode: location.storeCode,
                          address: `${location.address}, ${location.city}`,
                          platform: "Meta Location"
                        }}
                        data-testid={`unmatched-platform-${location.id}`}
                      />
                    </div>
                    
                    </div>
                ))}
                
                {filteredUnmatchedPlatform.length === 0 && unmatchedPlatformSearch && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No matches found for "{unmatchedPlatformSearch}"
                  </div>
                )}
              </div>
            </AuditAccordion>
          )}

        </div>

        {/* Final Confirmation */}
        <Card className="border-2 border-amber-500 dark:border-amber-600 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
          <CardContent className="p-8 space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-2">
                ⚠️ Final Confirmation Required
              </h3>
              <p className="text-amber-700 dark:text-amber-300">
                Execute sync for <strong>{mockAutoMatched.length + linkedCount + createCount}</strong> locations
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{mockAutoMatched.length}</div>
                <div className="text-sm text-green-700 dark:text-green-300">Auto Links</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{linkedCount}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Manual Links</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{createCount}</div>
                <div className="text-sm text-cyan-700 dark:text-cyan-300">Created</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
              <Checkbox 
                id="confirmation"
                checked={confirmationChecked}
                onChange={(e) => setConfirmationChecked(e.target.checked)}
                data-testid="checkbox-confirmation"
                className="mt-1"
              />
              <label htmlFor="confirmation" className="text-sm text-amber-800 dark:text-amber-200 cursor-pointer font-medium">
                I understand this sync will execute {mockAutoMatched.length + linkedCount + createCount} location changes and these changes cannot be undone. 
                I have reviewed the sync plan and authorize execution.
              </label>
            </div>

            <div className="flex justify-center">
              <Button 
                disabled={!confirmationChecked}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-12 py-4 text-lg font-bold shadow-lg"
                data-testid="button-confirm-sync"
              >
                🚀 Execute Sync
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline"
            size="lg"
            onClick={() => setCurrentStep(2)}
            data-testid="button-back-step2"
            className="flex items-center space-x-2 px-6 py-3 border-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Manual Resolution</span>
          </Button>
          
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Step 3 of 3 - Ready
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {mockAutoMatched.length + linkedCount + createCount} locations ready to sync
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Location Sync" />
      
      <div className="p-6">
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep 
                    ? 'bg-blue-600 text-white' 
                    : step < currentStep 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {/* View All Matches Modal */}
      {showAllMatchesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAllMatchesModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                All {mockAutoMatched.length} High-Confidence Matches
              </h3>
              <Button
                variant="outline"
                onClick={() => setShowAllMatchesModal(false)}
                className="text-gray-500 hover:text-gray-700"
                data-testid="button-close-modal"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockAutoMatched.map((match, index) => (
                <ComparisonCard
                  key={index}
                  leftLocation={match.venueXLocation}
                  rightLocation={match.platformLocation}
                  leftType="venuex"
                  rightType="platform"
                  leftLabel="VenueX Location"
                  rightLabel="Meta Page"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}