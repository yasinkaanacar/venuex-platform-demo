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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Header from '@/components/overview/header';
import { 
  Target,
  Loader2,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Link,
  ChevronDown,
  ChevronRight,
  Trash2,
  ExternalLink,
  Phone,
  MapPin,
  Tag,
  Building
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
    name: 'Boyner Akasya AVM', 
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
    name: 'Boyner İstinye Park', 
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
    name: 'Boyner Forum İstanbul', 
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
    name: 'Boyner Zorlu Center', 
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
    name: 'Boyner Kanyon AVM', 
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
      name: 'Boyner Akasya', 
      address: 'Acıbadem, Akasya AVM Kat:1', 
      phone: '+90 216 123 4567',
      category: 'Clothing Store',
      platformId: 'meta_001',
      platformUrl: 'https://facebook.com/boyner.akasya',
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
      name: 'Boyner İstinye Park', 
      address: 'İstinye Park AVM, Pınar Mahallesi', 
      phone: '+90 212 345 6789',
      category: 'Department Store',
      platformId: 'meta_002',
      platformUrl: 'https://facebook.com/boyner.istinye',
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
    name: 'Boyner Mall Store', 
    address: 'İstiklal Caddesi No:112, Beyoğlu', 
    phone: '+90 212 111 2233',
    category: 'Fashion Store',
    platformId: 'meta_003',
    platformUrl: 'https://facebook.com/boyner.istiklal',
    city: 'Istanbul',
    postalCode: '34433',
    storeCode: 'META003',
    status: 'pending' 
  },
  { 
    id: 'meta4', 
    name: 'Boyner City Branch', 
    address: 'Bağdat Caddesi No:342, Kadıköy', 
    phone: '+90 216 444 5566',
    category: 'Clothing Store',
    platformId: 'meta_004',
    platformUrl: 'https://facebook.com/boyner.bagdat',
    city: 'Istanbul',
    postalCode: '34728',
    storeCode: 'META004',
    status: 'pending' 
  },
  { 
    id: 'meta5', 
    name: 'Boyner Outlet', 
    address: 'Olivium Outlet Center, Zeytinburnu', 
    phone: '+90 212 777 8899',
    category: 'Outlet Store',
    platformId: 'meta_005',
    platformUrl: 'https://facebook.com/boyner.outlet',
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
        {icon}
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
                We've automatically matched most of your locations based on name and address. 
                The remaining locations need your input to ensure everything is synced correctly.
              </p>

              {/* High-Confidence Matches */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4 text-left">High-Confidence Matches</h4>
                <div className="space-y-4">
                  {mockAutoMatched.slice(0, 2).map((match, index) => (
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
                {mockAutoMatched.length > 2 && (
                  <div className="text-center mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllMatchesModal(true)}
                      className="text-blue-600 hover:text-blue-800"
                      data-testid="button-view-all-matches"
                    >
                      View All {mockAutoMatched.length} Matched Locations
                    </Button>
                  </div>
                )}
              </div>

              {/* Locations Requiring Your Attention */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4 text-left">Locations Requiring Your Attention</h4>
                <div className="space-y-3">
                  {unmatchedLocations.map((location, index) => (
                    <LocationDetailCard
                      key={index}
                      location={location}
                      type="platform"
                      className="border-amber-200 dark:border-amber-800"
                    />
                  ))}
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
    const locationsPerPage = 5;
    const totalPages = Math.ceil(unmatchedLocations.length / locationsPerPage);
    const startIndex = currentPage * locationsPerPage;
    const endIndex = startIndex + locationsPerPage;
    const currentLocations = unmatchedLocations.slice(startIndex, endIndex);
    const resolvedCount = unmatchedLocations.filter(loc => loc.status !== 'pending').length;

    // Smart suggestion algorithm - finds best match based on name similarity and location
    const getSuggestedMatch = (platformLocation: PlatformLocation): VenueXLocation | null => {
      if (!platformLocation) return null;
      
      const suggestions = availableVenueXLocations.map(venueX => {
        let score = 0;
        
        // Name similarity (basic implementation)
        const platformName = platformLocation.name.toLowerCase();
        const venueName = venueX.name.toLowerCase();
        if (platformName.includes('boyner') && venueName.includes('boyner')) score += 5;
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

    const selectedLocation = selectedUnmatched ? unmatchedLocations.find(loc => loc.id === selectedUnmatched) : null;
    const suggestedMatch = selectedLocation ? getSuggestedMatch(selectedLocation) : null;

    return (
      <div>
        <div className="flex items-center justify-between mb-8">
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
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-300px)]">
        {/* Left Column: Unmatched Locations */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Unmatched Meta Pages ({pendingCount})</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 space-y-3 mb-4">
              {currentLocations.map((location) => (
                <div
                  key={location.id}
                  onClick={() => location.status === 'pending' ? setSelectedUnmatched(location.id) : null}
                  className={`transition-all duration-200 cursor-pointer relative ${
                    selectedUnmatched === location.id 
                      ? 'ring-2 ring-blue-500 scale-[1.02]' 
                      : ''
                  } ${location.status !== 'pending' ? 'opacity-50 cursor-default transform' : 'hover:shadow-md'}`}
                  data-testid={`card-unmatched-${location.id}`}
                >
                  <div className="relative">
                    <Badge 
                      className={`absolute top-2 right-2 z-10 font-medium ${
                        location.status === 'pending' ? 'bg-amber-500 text-white' :
                        location.status === 'linked' ? 'bg-blue-500 text-white' :
                        'bg-amber-500 text-white'
                      }`}
                    >
                      {location.status === 'pending' ? 'Pending Action' :
                       location.status === 'linked' ? 'Linked' :
                       'Set to Re-create'}
                    </Badge>
                    
                    <LocationDetailCard 
                      location={location} 
                      type="platform" 
                      className={`${
                        selectedUnmatched === location.id 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg' 
                          : location.status !== 'pending'
                            ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      } pt-12 transition-all duration-200`}
                    />
                    
                    {location.linkedTo && (
                      <div className="p-3 mt-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                          ✓ Linked to: {location.linkedTo.name}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-300">
                          {location.linkedTo.address}
                        </p>
                      </div>
                    )}
                    
                    {location.recreateWith && (
                      <div className="p-3 mt-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                          🔄 Will recreate with: {location.recreateWith.name}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-300">
                          {location.recreateWith.address}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1}-{Math.min(endIndex, unmatchedLocations.length)} of {unmatchedLocations.length}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  data-testid="button-prev-page"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  data-testid="button-next-page"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Resolution Panel */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Resolution Panel</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {selectedUnmatched ? (
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium mb-2">Selected Location:</h4>
                  <p className="font-semibold">
                    {unmatchedLocations.find(loc => loc.id === selectedUnmatched)?.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {unmatchedLocations.find(loc => loc.id === selectedUnmatched)?.address}
                  </p>
                </div>

                {/* Choice 1: Link to Existing Location */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">1. Link to an existing VenueX location</h3>
                  <Select onValueChange={(value) => handleLinkLocation(selectedUnmatched, value)}>
                    <SelectTrigger data-testid="select-link-location">
                      <SelectValue placeholder="Select a VenueX location to link" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Suggested Match First */}
                      {suggestedMatch && (
                        <SelectItem key={`suggested-${suggestedMatch.id}`} value={suggestedMatch.id} className="h-auto p-0">
                          <div className="w-full p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium bg-blue-600 text-white px-2 py-1 rounded">
                                ✨ SUGGESTED MATCH
                              </span>
                            </div>
                            <LocationDetailCard 
                              location={suggestedMatch} 
                              type="venuex" 
                              className="border-none bg-transparent p-0 m-0"
                            />
                          </div>
                        </SelectItem>
                      )}
                      
                      {/* Separator if there's a suggestion */}
                      {suggestedMatch && availableVenueXLocations.filter(loc => loc.id !== suggestedMatch.id).length > 0 && (
                        <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">
                          Other Available Locations
                        </div>
                      )}
                      
                      {/* Other Available Locations */}
                      {availableVenueXLocations.filter(loc => !suggestedMatch || loc.id !== suggestedMatch.id).map((location) => (
                        <SelectItem key={location.id} value={location.id} className="h-auto p-0">
                          <div className="w-full p-3">
                            <LocationDetailCard 
                              location={location} 
                              type="venuex" 
                              className="border-none bg-transparent p-0 m-0"
                            />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Choice 2: Create from Source of Truth */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">2. Re-create this location from VenueX data</h3>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-800 dark:text-red-200">
                        <strong>Warning:</strong> This will delete the existing, unmatched Meta Page and create 
                        a new, synced one using the official data from VenueX.
                      </p>
                    </div>
                  </div>
                  <Select onValueChange={(value) => handleRecreateLocation(selectedUnmatched, value)}>
                    <SelectTrigger data-testid="select-recreate-location">
                      <SelectValue placeholder="Select VenueX location data to use" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockVenueXLocations.map((location) => (
                        <SelectItem key={location.id} value={location.id} className="h-auto p-0">
                          <div className="w-full p-3">
                            <LocationDetailCard 
                              location={location} 
                              type="venuex" 
                              className="border-none bg-transparent p-0 m-0"
                            />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <p>Select an unmatched location from the left to resolve it</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-6">
        <Button 
          onClick={() => setCurrentStep(3)}
          disabled={!canProceedToStep3}
          className="bg-amber-600 hover:bg-amber-700 text-white"
          data-testid="button-proceed-step3"
        >
          Review and Confirm
        </Button>
      </div>
    </div>
  );
  };

  const renderStep3 = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Step 3 of 3: Review and Confirm Sync
        </h2>
      </div>

      <div className="space-y-6">
        {/* Automatically Matched Locations - Enhanced with Color Coding */}
        <div className="border-2 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/10 rounded-lg p-1">
          <Collapsible open={autoMatchedOpen} onOpenChange={setAutoMatchedOpen}>
            <CollapsibleTrigger className="w-full">
              <Button variant="ghost" className="w-full justify-between p-4 h-auto hover:bg-green-100 dark:hover:bg-green-900/20">
                <div className="flex items-center space-x-3">
                  {autoMatchedOpen ? <ChevronDown className="w-5 h-5 text-green-700 dark:text-green-300" /> : <ChevronRight className="w-5 h-5 text-green-700 dark:text-green-300" />}
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">✅ Automatically Matched ({mockAutoMatched.length} locations)</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-600 text-white">Ready to Sync</Badge>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </Button>
            </CollapsibleTrigger>
          <CollapsibleContent>
            <Card>
              <CardContent className="p-4">
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
                      icon={<Link className="w-6 h-6 text-green-600" />}
                      className="border-green-200 dark:border-green-800"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Manually Resolved Locations - Enhanced with Color Coding */}
        <div className="border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2 text-blue-800 dark:text-blue-200">
            <span>🔧 Manually Resolved ({linkedCount + recreateCount} locations)</span>
          </h3>

          {/* Manually Linked */}
          {linkedCount > 0 && (
            <Collapsible open={manualLinkedOpen} onOpenChange={setManualLinkedOpen}>
              <CollapsibleTrigger className="w-full">
                <Button variant="ghost" className="w-full justify-between p-3 h-auto bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 border border-blue-300 dark:border-blue-600 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {manualLinkedOpen ? <ChevronDown className="w-4 h-4 text-blue-700 dark:text-blue-300" /> : <ChevronRight className="w-4 h-4 text-blue-700 dark:text-blue-300" />}
                    <span className="font-semibold text-blue-800 dark:text-blue-200">🔗 Manually Linked ({linkedCount})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-600 text-white">Linked</Badge>
                    <Link className="w-4 h-4 text-blue-600" />
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {unmatchedLocations
                        .filter(loc => loc.status === 'linked')
                        .map((location) => (
                          <ComparisonCard
                            key={location.id}
                            leftLocation={location.linkedTo!}
                            rightLocation={location}
                            leftType="venuex"
                            rightType="platform"
                            leftLabel="VenueX Location"
                            rightLabel="Meta Page"
                            icon={<Link className="w-6 h-6 text-blue-600" />}
                            className="border-blue-200 dark:border-blue-800"
                          />
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* To Be Re-created */}
          {recreateCount > 0 && (
            <Collapsible open={recreateOpen} onOpenChange={setRecreateOpen}>
              <CollapsibleTrigger className="w-full">
                <Button variant="ghost" className="w-full justify-between p-3 h-auto bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 border border-amber-300 dark:border-amber-600 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {recreateOpen ? <ChevronDown className="w-4 h-4 text-amber-700 dark:text-amber-300" /> : <ChevronRight className="w-4 h-4 text-amber-700 dark:text-amber-300" />}
                    <span className="font-semibold text-amber-800 dark:text-amber-200">🔄 To Be Re-created ({recreateCount})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-amber-600 text-white">Will Delete & Recreate</Badge>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="border-red-200 dark:border-red-800">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {unmatchedLocations
                        .filter(loc => loc.status === 'recreate')
                        .map((location) => (
                          <ComparisonCard
                            key={location.id}
                            leftLocation={location.recreateWith!}
                            rightLocation={location}
                            leftType="venuex"
                            rightType="platform"
                            leftLabel="TO BE CREATED"
                            rightLabel="TO BE DELETED"
                            icon={<Trash2 className="w-6 h-6 text-red-600" />}
                            className="border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20"
                          />
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        {/* Final Confirmation - Enhanced with Dynamic Counts */}
        <Card className="border-2 border-amber-500 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/10">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-200 mb-2">
                  ⚠️ Final Confirmation Required
                </h3>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  You are about to sync <strong>{mockAutoMatched.length + linkedCount + recreateCount}</strong> locations
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-700 dark:text-green-300">• Automatically matched locations:</span>
                    <span className="font-semibold text-green-800 dark:text-green-200">{mockAutoMatched.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">• Manually linked locations:</span>
                    <span className="font-semibold text-blue-800 dark:text-blue-200">{linkedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700 dark:text-amber-300">• Locations to be deleted & recreated:</span>
                    <span className="font-semibold text-amber-800 dark:text-amber-200">{recreateCount}</span>
                  </div>
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
                  I understand that {recreateCount > 0 ? `${recreateCount} locations will be permanently deleted and recreated, and` : ''} these changes cannot be undone. I am ready to proceed with the sync.
                </label>
              </div>

              <Button 
                disabled={!confirmationChecked}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg"
                data-testid="button-confirm-sync"
              >
                Confirm and Sync Locations
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button 
            variant="outline"
            size="lg"
            onClick={() => setCurrentStep(2)}
            data-testid="button-back-step2"
            className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-400 dark:border-gray-500 hover:border-gray-600 dark:hover:border-gray-400"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Edit</span>
          </Button>
          
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Step 3 of 3
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ready to sync {mockAutoMatched.length + linkedCount + recreateCount} locations
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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