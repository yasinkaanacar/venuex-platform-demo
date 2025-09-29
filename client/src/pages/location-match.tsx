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
  }
];

const mockUnmatched: UnmatchedLocation[] = [
  { 
    id: 'meta3', 
    name: 'Demo Mall Store', 
    address: 'İstiklal Caddesi No:112, Beyoğlu', 
    phone: '+90 212 111 2233',
    category: 'Fashion Store',
    platformId: 'meta_003',
    platformUrl: 'https://facebook.com/demo.istiklal',
    city: 'Istanbul',
    postalCode: '34433',
    storeCode: 'META003',
    status: 'pending' 
  },
  { 
    id: 'meta4', 
    name: 'Demo City Branch', 
    address: 'Bağdat Caddesi No:342, Kadıköy', 
    phone: '+90 216 444 5566',
    category: 'Clothing Store',
    platformId: 'meta_004',
    platformUrl: 'https://facebook.com/demo.bagdat',
    city: 'Istanbul',
    postalCode: '34728',
    storeCode: 'META004',
    status: 'pending' 
  },
  { 
    id: 'meta5', 
    name: 'Demo Outlet', 
    address: 'Olivium Outlet Center, Zeytinburnu', 
    phone: '+90 212 777 8899',
    category: 'Outlet Store',
    platformId: 'meta_005',
    platformUrl: 'https://facebook.com/demo.outlet',
    city: 'Istanbul',
    postalCode: '34025',
    storeCode: 'META005',
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
  
  // Search state for autocomplete dropdowns
  const [linkSearchQuery, setLinkSearchQuery] = useState('');
  const [recreateSearchQuery, setRecreateSearchQuery] = useState('');
  const locationsPerPage = 20; // Increased page size for better workflow
  
  // Search state for Step 3 lists
  const [autoMatchedSearch, setAutoMatchedSearch] = useState('');
  const [linkedSearch, setLinkedSearch] = useState('');
  const [recreateSearch, setRecreateSearch] = useState('');

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
      'Platform ID': location.platformId,
      'Platform URL': location.platformUrl || '',
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

  const canProceedToStep3 = unmatchedLocations.every(loc => loc.status !== 'pending');
  const pendingCount = unmatchedLocations.filter(loc => loc.status === 'pending').length;
  const linkedCount = unmatchedLocations.filter(loc => loc.status === 'linked').length;
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
              <p className="text-gray-600 dark:text-gray-400 mb-2">Connecting to Meta...</p>
              <p className="text-gray-600 dark:text-gray-400">Comparing with VenueX locations...</p>
            </div>
          ) : (
            <div>
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-6">Matching Complete!</h3>
              
              {/* Visual Results Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{mockAutoMatched.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Matched</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">{unmatchedLocations.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Need Review</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg h-6 overflow-hidden">
                  <div className="h-full flex">
                    {/* Green segment for matched */}
                    <div 
                      className="bg-green-500 flex items-center justify-center text-white text-sm font-medium"
                      style={{ width: `${(mockAutoMatched.length / (mockAutoMatched.length + unmatchedLocations.length)) * 100}%` }}
                    >
                      {mockAutoMatched.length > 0 && `${mockAutoMatched.length} Matched`}
                    </div>
                    {/* Amber segment for unmatched */}
                    <div 
                      className="bg-amber-500 flex items-center justify-center text-white text-sm font-medium"
                      style={{ width: `${(unmatchedLocations.length / (mockAutoMatched.length + unmatchedLocations.length)) * 100}%` }}
                    >
                      {unmatchedLocations.length > 0 && `${unmatchedLocations.length} Need Review`}
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Total: {mockAutoMatched.length + unmatchedLocations.length} Meta Pages Found
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
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={exportMatchedLocations}
                      className="flex items-center space-x-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                      data-testid="button-export-matched"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export All Matched ({mockAutoMatched.length}) to CSV</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={exportUnmatchedLocations}
                      className="flex items-center space-x-2 border-amber-300 text-amber-700 hover:bg-amber-100"
                      data-testid="button-export-unmatched"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Unmatched ({unmatchedLocations.length}) to CSV</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Expectation Setting */}
              <div className="mb-8 text-center">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <p className="text-amber-800 dark:text-amber-200 font-medium">
                    Next: You will be guided through resolving the {unmatchedLocations.length} unmatched locations step by step.
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Each location can be linked to an existing VenueX location or recreated using your master data.
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => setCurrentStep(2)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg"
                data-testid="button-resolve-unmatched"
              >
                Resolve {unmatchedLocations.length} Unmatched Locations
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderStep2 = () => {
    const filteredLocations = getFilteredLocations();
    const totalPages = Math.ceil(filteredLocations.length / locationsPerPage);
    const startIndex = currentPage * locationsPerPage;
    const endIndex = startIndex + locationsPerPage;
    const currentLocations = filteredLocations.slice(startIndex, endIndex);
    const resolvedCount = unmatchedLocations.filter(loc => loc.status !== 'pending').length;
    
    const selectedLocation = selectedUnmatched ? unmatchedLocations.find(loc => loc.id === selectedUnmatched) : null;
    const suggestedMatch = selectedLocation ? getSuggestedMatch(selectedLocation) : null;

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
            Step 2 of 3: Resolve Unmatched Locations
          </h2>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Progress Tracker */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-800 dark:text-blue-200">
              Progress: {resolvedCount} of {unmatchedLocations.length} Locations Resolved
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${unmatchedLocations.length > 0 ? (resolvedCount / unmatchedLocations.length) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-300 mt-1">
              {pendingCount} remaining to resolve
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Panel - Unmatched Locations (2/3 width) */}
          <div className="xl:col-span-2 space-y-6">

            {/* Bulk Actions Bar */}
            {selectedLocations.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-blue-800 dark:text-blue-200 font-medium">
                      {selectedLocations.length} location{selectedLocations.length > 1 ? 's' : ''} selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLocations([])}
                      className="text-blue-700 border-blue-300"
                    >
                      Clear Selection
                    </Button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={bulkRecreateSelected}
                      variant="outline"
                      className="text-amber-700 border-amber-300 hover:bg-amber-50"
                      data-testid="button-bulk-recreate"
                    >
                      Delete and Re-create Selected
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Data Management Table */}
            <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Unmatched Locations ({filteredLocations.length} of {unmatchedLocations.length})</CardTitle>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage + 1} of {totalPages}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="p-4 text-left">
                      <Checkbox
                        checked={currentLocations.length > 0 && currentLocations.every(loc => selectedLocations.includes(loc.id))}
                        onChange={() => handleSelectAll(currentLocations)}
                        data-testid="checkbox-select-all"
                      />
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                      Location Details
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                      Status
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                      Resolution Method
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentLocations.map((location) => {
                    return (
                      <tr
                        key={location.id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
                          selectedLocations.includes(location.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        } ${selectedUnmatched === location.id ? 'ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/30' : ''}`}
                        onClick={() => location.status === 'pending' ? setSelectedUnmatched(location.id) : null}
                        data-testid={`row-location-${location.id}`}
                      >
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedLocations.includes(location.id)}
                            onChange={() => handleSelectLocation(location.id)}
                            data-testid={`checkbox-location-${location.id}`}
                          />
                        </td>
                        <td className="p-4">
                          <div className="space-y-2">
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {location.name}
                            </div>
                            <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md w-fit">
                              <Building className="w-4 h-4 mr-1" />
                              Code: {location.storeCode}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {location.address}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-500">
                              {location.city} • {location.phone}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={`${
                              location.status === 'pending' ? 'bg-amber-500 text-white' :
                              location.status === 'linked' ? 'bg-green-500 text-white' :
                              location.status === 'recreate' ? 'bg-blue-500 text-white' :
                              'bg-gray-500 text-white'
                            }`}
                          >
                            {location.status === 'pending' ? 'Needs Review' :
                             location.status === 'linked' ? 'Linked' :
                             location.status === 'recreate' ? 'Set to Re-create' :
                             location.status}
                          </Badge>
                          {location.linkedTo && (
                            <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                              → {location.linkedTo.name}
                            </div>
                          )}
                          {location.recreateWith && (
                            <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                              → Will use {location.recreateWith.name}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Click row to resolve manually
                          </div>
                        </td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant={selectedUnmatched === location.id ? "default" : "outline"}
                            onClick={() => setSelectedUnmatched(location.id)}
                            data-testid={`button-manual-resolve-${location.id}`}
                            className={selectedUnmatched === location.id ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                          >
                            {selectedUnmatched === location.id ? 'Selected' : 'Select'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Enhanced Pagination */}
            <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredLocations.length)} of {filteredLocations.length} filtered results
                  {filteredLocations.length !== unmatchedLocations.length && (
                    <span className="ml-2 text-blue-600 dark:text-blue-400">
                      ({unmatchedLocations.length} total)
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(0)}
                    disabled={currentPage === 0}
                    data-testid="button-first-page"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-400 px-3">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    data-testid="button-next-page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages - 1)}
                    disabled={currentPage >= totalPages - 1}
                    data-testid="button-last-page"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            </CardContent>
            </Card>
          </div>

          {/* Right Panel - Quick Resolution (1/3 width) */}
          <div className="xl:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Quick Resolution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedUnmatched ? (
                  <div className="space-y-6">
                    {/* Selected Location Info */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                      <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">Selected Location:</h4>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {unmatchedLocations.find(loc => loc.id === selectedUnmatched)?.name}
                      </p>
                      <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md w-fit mb-2">
                        <Building className="w-4 h-4 mr-1" />
                        Code: {unmatchedLocations.find(loc => loc.id === selectedUnmatched)?.storeCode}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {unmatchedLocations.find(loc => loc.id === selectedUnmatched)?.address}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                        Search pre-populated with relevant terms.
                      </p>
                    </div>

                    {/* Resolution Options */}
                    <div className="space-y-4">
                      {/* Link to Existing Location */}
                      <div className="p-4 border border-green-200 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <h4 className="font-medium mb-3 text-green-800 dark:text-green-200 flex items-center">
                          <Link className="w-4 h-4 mr-2" />
                          Link to Existing
                        </h4>
                        <div className="space-y-3">
                          <AutocompleteSelect
                            options={getFilteredLinkOptions(linkSearchQuery)}
                            onSearch={setLinkSearchQuery}
                            onValueChange={(value) => {
                              const selectedOption = getFilteredLinkOptions(linkSearchQuery).find(option => option.id === value);
                              if (selectedOption) {
                                handleLinkLocation(selectedUnmatched, selectedOption.id);
                              }
                            }}
                            placeholder="Search VenueX locations..."
                            className="w-full"
                            data-testid="autocomplete-link-location"
                          />
                          <Button
                            onClick={() => {
                              const selectedOption = getFilteredLinkOptions(linkSearchQuery).find(
                                option => option.label.toLowerCase() === linkSearchQuery.toLowerCase() ||
                                         option.badge?.toLowerCase() === linkSearchQuery.toLowerCase()
                              );
                              if (selectedOption) {
                                handleLinkLocation(selectedUnmatched, selectedOption.id);
                              }
                            }}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            disabled={!linkSearchQuery}
                            data-testid="button-confirm-link"
                          >
                            Link Location
                          </Button>
                        </div>
                      </div>

                      {/* Re-create Option */}
                      <div className="p-4 border border-blue-200 dark:border-blue-700 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <h4 className="font-medium mb-3 text-blue-800 dark:text-blue-200 flex items-center">
                          <Plus className="w-4 h-4 mr-2" />
                          Re-create as New
                        </h4>
                        <div className="space-y-3">
                          <AutocompleteSelect
                            options={getFilteredRecreateOptions(recreateSearchQuery)}
                            onSearch={setRecreateSearchQuery}
                            onValueChange={(value) => {
                              const selectedOption = getFilteredRecreateOptions(recreateSearchQuery).find(option => option.id === value);
                              if (selectedOption) {
                                handleRecreateLocation(selectedUnmatched, selectedOption.id);
                              }
                            }}
                            placeholder="Search template locations..."
                            className="w-full"
                            data-testid="autocomplete-recreate-template"
                          />
                          <Button
                            onClick={() => {
                              const selectedOption = getFilteredRecreateOptions(recreateSearchQuery).find(
                                option => option.label.toLowerCase() === recreateSearchQuery.toLowerCase() ||
                                         option.badge?.toLowerCase() === recreateSearchQuery.toLowerCase()
                              );
                              if (selectedOption) {
                                handleRecreateLocation(selectedUnmatched, selectedOption.id);
                              }
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={!recreateSearchQuery}
                            data-testid="button-confirm-recreate"
                          >
                            Set to Re-create
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Select a location from the table to begin manual resolution
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final Proceed Button */}
        <div className="flex justify-center mt-8">
          <Button 
            onClick={() => setCurrentStep(3)}
            disabled={!canProceedToStep3}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg font-medium"
            data-testid="button-proceed-step3"
          >
            Review and Confirm ({pendingCount > 0 ? `${pendingCount} remaining` : 'All resolved'})
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
        totalLocations: mockAutoMatched.length + linkedCount + recreateCount,
        summary: {
          automaticallyMatched: mockAutoMatched.length,
          manuallyLinked: linkedCount,
          toBeRecreated: recreateCount
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
          manuallyLinked: unmatchedLocations
            .filter(loc => loc.status === 'linked')
            .map(loc => ({
              platformName: loc.name,
              platformCode: loc.storeCode,
              venueXName: loc.linkedTo!.name,
              venueXCode: loc.linkedTo!.storeCode,
              action: 'Link Existing'
            })),
          toBeRecreated: unmatchedLocations
            .filter(loc => loc.status === 'recreate')
            .map(loc => ({
              platformName: loc.name,
              platformCode: loc.storeCode,
              willBeDeletedAndReplacedWith: loc.recreateWith!.name,
              replacementCode: loc.recreateWith!.storeCode,
              action: 'Delete and Recreate'
            }))
        }
      };

      const csvContent = [
        ['Action Type', 'Platform Name', 'Platform Code', 'VenueX Name', 'VenueX Code', 'Notes'],
        ...syncPlan.details.autoMatched.map(item => [
          'Auto Link', item.platformName, item.platformCode, item.venueXName, item.venueXCode, `Confidence: ${(item.confidence * 100).toFixed(1)}%`
        ]),
        ...syncPlan.details.manuallyLinked.map(item => [
          'Manual Link', item.platformName, item.platformCode, item.venueXName, item.venueXCode, 'Manually resolved'
        ]),
        ...syncPlan.details.toBeRecreated.map(item => [
          'Delete & Recreate', item.platformName, item.platformCode, item.willBeDeletedAndReplacedWith, item.replacementCode, 'Will delete existing and create new'
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
      ? unmatchedLocations
          .filter(loc => loc.status === 'linked')
          .filter(loc => 
            loc.name.toLowerCase().includes(linkedSearch.toLowerCase()) ||
            loc.linkedTo!.name.toLowerCase().includes(linkedSearch.toLowerCase()) ||
            loc.storeCode.toLowerCase().includes(linkedSearch.toLowerCase()) ||
            loc.linkedTo!.storeCode.toLowerCase().includes(linkedSearch.toLowerCase())
          )
      : unmatchedLocations.filter(loc => loc.status === 'linked');

    const filteredRecreate = recreateSearch
      ? unmatchedLocations
          .filter(loc => loc.status === 'recreate')
          .filter(loc => 
            loc.name.toLowerCase().includes(recreateSearch.toLowerCase()) ||
            loc.recreateWith!.name.toLowerCase().includes(recreateSearch.toLowerCase()) ||
            loc.storeCode.toLowerCase().includes(recreateSearch.toLowerCase()) ||
            loc.recreateWith!.storeCode.toLowerCase().includes(recreateSearch.toLowerCase())
          )
      : unmatchedLocations.filter(loc => loc.status === 'recreate');

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
                {mockAutoMatched.length + linkedCount + recreateCount}
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
                {mockAutoMatched.length > 0 ? `${((mockAutoMatched.length / (mockAutoMatched.length + linkedCount + recreateCount)) * 100).toFixed(1)}% Success` : '0% Success'}
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

          {/* Recreations KPI */}
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/30 border-amber-200 dark:border-amber-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                {recreateCount}
              </div>
              <div className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Recreations
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-300 mt-1">
                Will Delete & Create
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
                Includes all {mockAutoMatched.length + linkedCount + recreateCount} locations with action details
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                    {/* Platform Location */}
                    <div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Platform Location</div>
                      <RichLocationCard
                        location={{
                          name: match.platformLocation.name,
                          storeCode: match.platformLocation.storeCode,
                          address: `${match.platformLocation.address}, ${match.platformLocation.city}`,
                          platform: "Platform Location"
                        }}
                        data-testid={`platform-location-${index}`}
                      />
                    </div>
                    
                    {/* VenueX Location */}
                    <div>
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
                  </div>
                  
                  {/* Connection Indicator */}
                  <div className="flex justify-center mt-4">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <Link className="w-4 h-4 text-green-600 dark:text-green-400" />
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                      {/* Platform Location */}
                      <div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Platform Location</div>
                        <RichLocationCard
                          location={{
                            name: location.name,
                            storeCode: location.storeCode,
                            address: `${location.address}, ${location.city}`,
                            platform: "Platform Location"
                          }}
                          data-testid={`manual-platform-${location.id}`}
                        />
                      </div>
                      
                      {/* VenueX Location */}
                      <div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">VenueX Location</div>
                        <RichLocationCard
                          location={{
                            name: location.linkedTo!.name,
                            storeCode: location.linkedTo!.storeCode,
                            address: `${location.linkedTo!.address}, ${location.linkedTo!.city}`,
                            platform: "VenueX Location"
                          }}
                          data-testid={`manual-venuex-${location.id}`}
                        />
                      </div>
                    </div>
                    
                    {/* Connection Indicator */}
                    <div className="flex justify-center mt-4">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                        <Link className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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

          {/* Recreations Accordion */}
          {recreateCount > 0 && (
            <AuditAccordion
              id="recreations"
              title="Locations to be Deleted & Re-created"
              count={recreateCount}
              variant="warning"
              searchValue={recreateSearch}
              onSearchChange={setRecreateSearch}
              searchPlaceholder="Search recreations..."
              data-testid="accordion-recreations"
            >
              <div className="p-4 space-y-4">
                {filteredRecreate.map((location) => (
                  <div key={location.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    {/* New Location to Create */}
                    <RichLocationCard
                      location={{
                        name: location.recreateWith!.name,
                        storeCode: location.recreateWith!.storeCode,
                        address: `${location.recreateWith!.address}, ${location.recreateWith!.city}`,
                        platform: "VenueX Location"
                      }}
                      variant="create"
                      data-testid={`recreate-new-${location.id}`}
                    />
                    
                    {/* Delete & Create Icon */}
                    <div className="flex justify-center">
                      <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    
                    {/* Old Location to Delete */}
                    <RichLocationCard
                      location={{
                        name: location.name,
                        storeCode: location.storeCode,
                        address: `${location.address}, ${location.city}`,
                        platform: "Platform Location"
                      }}
                      variant="delete"
                      data-testid={`recreate-old-${location.id}`}
                    />
                    
                    {/* Action Tag */}
                    <div className="text-center">
                      <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Delete & Recreate
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {filteredRecreate.length === 0 && recreateSearch && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No matches found for "{recreateSearch}"
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
                Execute sync for <strong>{mockAutoMatched.length + linkedCount + recreateCount}</strong> locations
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
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{recreateCount}</div>
                <div className="text-sm text-red-700 dark:text-red-300">Recreations</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
              <Checkbox 
                id="confirmation"
                checked={confirmationChecked}
                onChange={(e) => setConfirmationChecked(e.target.checked)}
                data-testid="checkbox-confirmation"
                className="mt-1"
              />
              <label htmlFor="confirmation" className="text-sm text-red-800 dark:text-red-200 cursor-pointer font-medium">
                I understand this sync will execute {mockAutoMatched.length + linkedCount + recreateCount} location changes
                {recreateCount > 0 && `, including ${recreateCount} permanent deletions,`} and these changes cannot be undone. 
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
              {mockAutoMatched.length + linkedCount + recreateCount} locations ready to sync
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