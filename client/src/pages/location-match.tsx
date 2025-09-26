import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/overview/header';
import { 
  Search, 
  MapPin, 
  Target,
  AlertCircle,
  CheckCircle,
  Zap,
  Settings
} from 'lucide-react';

export default function LocationMatch() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for location matching results
  const mockResults = [
    {
      id: 1,
      inputLocation: "Boyner Akasya AVM",
      matchedLocation: "Boyner Akasya Acıbadem",
      confidence: 0.95,
      status: "matched",
      details: {
        address: "Acıbadem Mahallesi, Akasya Avm, Istanbul",
        storeCode: "BYN001",
        region: "Istanbul - Anadolu"
      }
    },
    {
      id: 2,
      inputLocation: "Boyner Istinye Park",
      matchedLocation: "Boyner İstinye Park AVM",
      confidence: 0.92,
      status: "matched",
      details: {
        address: "İstinye Park AVM, Sarıyer, Istanbul",
        storeCode: "BYN045",
        region: "Istanbul - Avrupa"
      }
    },
    {
      id: 3,
      inputLocation: "Boyner Zorlu Center",
      matchedLocation: null,
      confidence: 0,
      status: "unmatched",
      details: {
        address: "Unknown",
        storeCode: "N/A",
        region: "N/A"
      }
    },
    {
      id: 4,
      inputLocation: "Boyner Forum Istanbul",
      matchedLocation: "Boyner Forum İstanbul AVM",
      confidence: 0.88,
      status: "partial",
      details: {
        address: "Forum İstanbul AVM, Bayrampaşa, Istanbul",
        storeCode: "BYN023",
        region: "Istanbul - Avrupa"
      }
    }
  ];

  const filteredResults = mockResults.filter(result =>
    result.inputLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (result.matchedLocation && result.matchedLocation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "matched":
        return "bg-green-100 text-green-800 border-green-200";
      case "partial":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "unmatched":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "matched":
        return <CheckCircle className="w-4 h-4" />;
      case "partial":
        return <AlertCircle className="w-4 h-4" />;
      case "unmatched":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Location Match" />
      
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Target className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Location Matching Tool
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Debug and validate location matching algorithms for Boyner stores
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-location-search"
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Locations</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {mockResults.length}
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Matched</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {mockResults.filter(r => r.status === "matched").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Partial</p>
                  <p className="text-2xl font-semibold text-yellow-600">
                    {mockResults.filter(r => r.status === "partial").length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unmatched</p>
                  <p className="text-2xl font-semibold text-red-600">
                    {mockResults.filter(r => r.status === "unmatched").length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Location Matching Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredResults.map((result) => (
                <div
                  key={result.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  data-testid={`result-item-${result.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {result.inputLocation}
                        </h3>
                        <Badge className={`${getStatusColor(result.status)} flex items-center space-x-1`}>
                          {getStatusIcon(result.status)}
                          <span className="capitalize">{result.status}</span>
                        </Badge>
                      </div>
                      
                      {result.matchedLocation && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>Matched to: <strong>{result.matchedLocation}</strong></span>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Address:</span>
                          <p className="text-gray-600 dark:text-gray-400">{result.details.address}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Store Code:</span>
                          <p className="text-gray-600 dark:text-gray-400">{result.details.storeCode}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Region:</span>
                          <p className="text-gray-600 dark:text-gray-400">{result.details.region}</p>
                        </div>
                      </div>
                    </div>
                    
                    {result.confidence > 0 && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Confidence
                        </div>
                        <div className="text-lg font-semibold text-blue-600">
                          {(result.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" data-testid={`button-debug-${result.id}`}>
                      Debug Match
                    </Button>
                    {result.status === "unmatched" && (
                      <Button variant="outline" size="sm" data-testid={`button-manual-match-${result.id}`}>
                        Manual Match
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}