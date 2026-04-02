import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Star,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function LocationSummary() {
  // Location table sorting
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Filtering and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedSentiment, setSelectedSentiment] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Location data for table
  const locationData = [
    { name: "Demo Eskişehir Kanatlı", rating: 4.2, reviews: 847, responseRate: 78, sentiment: "Positive" },
    { name: "Demo İstanbul AVM", rating: 3.8, reviews: 1243, responseRate: 45, sentiment: "Neutral" },
    { name: "Demo Ankara Kızılay", rating: 4.5, reviews: 692, responseRate: 92, sentiment: "Positive" },
    { name: "Demo Bursa Kent Meydanı", rating: 3.2, reviews: 528, responseRate: 38, sentiment: "Negative" },
    { name: "Demo İzmir Konak", rating: 4.1, reviews: 934, responseRate: 67, sentiment: "Positive" },
    { name: "Demo Adana Optimum", rating: 3.9, reviews: 421, responseRate: 58, sentiment: "Neutral" },
    { name: "Demo Antalya MarkAntalya", rating: 4.3, reviews: 756, responseRate: 82, sentiment: "Positive" },
    { name: "Demo Trabzon Forum", rating: 3.6, reviews: 389, responseRate: 55, sentiment: "Neutral" },
    { name: "Demo Samsun Piazza", rating: 4.0, reviews: 623, responseRate: 71, sentiment: "Positive" },
    { name: "Demo Gaziantep Forum", rating: 3.4, reviews: 445, responseRate: 42, sentiment: "Negative" },
    { name: "Demo Kayseri Forum", rating: 4.2, reviews: 567, responseRate: 76, sentiment: "Positive" },
    { name: "Demo Konya M1", rating: 3.7, reviews: 398, responseRate: 63, sentiment: "Neutral" },
    { name: "Demo Denizli Forum", rating: 4.4, reviews: 312, responseRate: 88, sentiment: "Positive" },
    { name: "Demo Mersin Marina", rating: 3.5, reviews: 478, responseRate: 47, sentiment: "Negative" },
    { name: "Demo Diyarbakır Kay", rating: 3.9, reviews: 234, responseRate: 69, sentiment: "Positive" },
    { name: "Demo Erzurum Palandöken", rating: 4.1, reviews: 189, responseRate: 74, sentiment: "Positive" },
    { name: "Demo Malatya Arasta Park", rating: 3.8, reviews: 267, responseRate: 52, sentiment: "Neutral" },
    { name: "Demo Van 100. Yıl", rating: 3.3, reviews: 156, responseRate: 39, sentiment: "Negative" },
    { name: "Demo Şanlıurfa Piazza", rating: 4.0, reviews: 298, responseRate: 65, sentiment: "Positive" },
    { name: "Demo Batman Park", rating: 3.6, reviews: 134, responseRate: 44, sentiment: "Negative" }
  ];

  // Sorting function
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Filtering logic
  const filteredData = locationData.filter((location) => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSentiment = selectedSentiment === "all" || location.sentiment.toLowerCase() === selectedSentiment.toLowerCase();
    return matchesSearch && matchesSentiment;
  });

  // Sort data
  const sortedLocationData = [...filteredData].sort((a: any, b: any) => {
    if (!sortColumn) return 0;
    
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];
    
    if (sortColumn === "name") {
      aVal = aVal.toString().toLowerCase();
      bVal = bVal.toString().toLowerCase();
    }
    
    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedLocationData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedLocationData.slice(startIndex, startIndex + rowsPerPage);

  // Get sort icon
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    return sortDirection === "asc" ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  // Generate star rating display
  const generateStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }, (_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
        )}
        {Array.from({ length: emptyStars }, (_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    );
  };

  // Get response rate color
  const getResponseRateColor = (rate: number) => {
    if (rate >= 70) return "text-green-600";
    if (rate >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  // Get sentiment badge
  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return <Badge className="bg-green-100 text-green-800">Positive</Badge>;
      case "Neutral":
        return <Badge className="bg-yellow-100 text-yellow-800">Neutral</Badge>;
      case "Negative":
        return <Badge className="bg-red-100 text-red-800">Negative</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{sentiment}</Badge>;
    }
  };

  return (
    <Card className="mx-6 mb-6">
      <div className="p-6 border-b border-gray-200 bg-[#f9fafb]">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Location Overview</h2>
        <p className="text-sm text-gray-600">Performance overview for all locations</p>
      </div>
      <CardContent className="bg-[#f9fafb]">
        {/* Filter Bar */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search locations..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-locations"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sentiment:</span>
            <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setSearchQuery("");
              setSelectedSentiment("all");
              setCurrentPage(1);
            }}
            data-testid="button-clear-filters"
          >
            Clear Filters
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <button 
                  className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded"
                  onClick={() => handleSort("name")}
                  data-testid="sort-location"
                >
                  Lokasyon
                  {getSortIcon("name")}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded"
                  onClick={() => handleSort("rating")}
                  data-testid="sort-rating"
                >
                  Ortalama Rating
                  {getSortIcon("rating")}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded"
                  onClick={() => handleSort("reviews")}
                  data-testid="sort-reviews"
                >
                  Toplam Yorum
                  {getSortIcon("reviews")}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded"
                  onClick={() => handleSort("responseRate")}
                  data-testid="sort-response-rate"
                >
                  Cevaplanma Oranı
                  {getSortIcon("responseRate")}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded"
                  onClick={() => handleSort("sentiment")}
                  data-testid="sort-sentiment"
                >
                  Sentiment
                  {getSortIcon("sentiment")}
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((location, index) => (
              <TableRow 
                key={location.name} 
                data-testid={`location-row-${index}`}
              >
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{location.rating.toFixed(1)}</span>
                    {generateStarRating(location.rating)}
                  </div>
                </TableCell>
                <TableCell data-testid={`total-reviews-${index}`}>
                  {location.reviews.toLocaleString()}
                </TableCell>
                <TableCell data-testid={`response-rate-${index}`}>
                  <span className={getResponseRateColor(location.responseRate)}>
                    {location.responseRate}%
                  </span>
                </TableCell>
                <TableCell data-testid={`sentiment-${index}`}>
                  {getSentimentBadge(location.sentiment)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <Select value={rowsPerPage.toString()} onValueChange={(value) => {
              setRowsPerPage(parseInt(value));
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {startIndex + 1}-{Math.min(startIndex + rowsPerPage, sortedLocationData.length)} of {sortedLocationData.length}
            </span>
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-8 h-8 p-0"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                data-testid="button-previous-page"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-8 h-8 p-0"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                data-testid="button-next-page"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}