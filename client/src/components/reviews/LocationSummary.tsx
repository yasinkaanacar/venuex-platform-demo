import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
  ArrowDown
} from 'lucide-react';

export default function LocationSummary() {
  // Location table sorting
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Location data for table
  const locationData = [
    { name: "Boyner Eskişehir Kanatlı", rating: 4.2, reviews: 847, responseRate: 78, sentiment: "Positive" },
    { name: "Boyner İstanbul AVM", rating: 3.8, reviews: 1243, responseRate: 45, sentiment: "Neutral" },
    { name: "Boyner Ankara Kızılay", rating: 4.5, reviews: 692, responseRate: 92, sentiment: "Positive" },
    { name: "Boyner Bursa Kent Meydanı", rating: 3.2, reviews: 528, responseRate: 38, sentiment: "Negative" },
    { name: "Boyner İzmir Konak", rating: 4.1, reviews: 934, responseRate: 67, sentiment: "Positive" },
    { name: "Boyner Adana Optimum", rating: 3.9, reviews: 421, responseRate: 58, sentiment: "Neutral" },
    { name: "Boyner Antalya MarkAntalya", rating: 4.3, reviews: 756, responseRate: 82, sentiment: "Positive" },
    { name: "Boyner Trabzon Forum", rating: 3.6, reviews: 389, responseRate: 55, sentiment: "Neutral" },
    { name: "Boyner Samsun Piazza", rating: 4.0, reviews: 623, responseRate: 71, sentiment: "Positive" },
    { name: "Boyner Gaziantep Forum", rating: 3.4, reviews: 445, responseRate: 42, sentiment: "Negative" },
    { name: "Boyner Kayseri Forum", rating: 4.2, reviews: 567, responseRate: 76, sentiment: "Positive" },
    { name: "Boyner Konya M1", rating: 3.7, reviews: 398, responseRate: 63, sentiment: "Neutral" },
    { name: "Boyner Denizli Forum", rating: 4.4, reviews: 312, responseRate: 88, sentiment: "Positive" },
    { name: "Boyner Mersin Marina", rating: 3.5, reviews: 478, responseRate: 47, sentiment: "Negative" },
    { name: "Boyner Diyarbakır Kay", rating: 3.9, reviews: 234, responseRate: 69, sentiment: "Positive" },
    { name: "Boyner Erzurum Palandöken", rating: 4.1, reviews: 189, responseRate: 74, sentiment: "Positive" },
    { name: "Boyner Malatya Arasta Park", rating: 3.8, reviews: 267, responseRate: 52, sentiment: "Neutral" },
    { name: "Boyner Van 100. Yıl", rating: 3.3, reviews: 156, responseRate: 39, sentiment: "Negative" },
    { name: "Boyner Şanlıurfa Piazza", rating: 4.0, reviews: 298, responseRate: 65, sentiment: "Positive" },
    { name: "Boyner Batman Park", rating: 3.6, reviews: 134, responseRate: 44, sentiment: "Negative" }
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

  // Sort data
  const sortedLocationData = [...locationData].sort((a: any, b: any) => {
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
      <CardHeader>
        <CardTitle>Lokasyon Özeti</CardTitle>
        <p className="text-sm text-gray-600">Tüm lokasyonların yorum performansı</p>
      </CardHeader>
      <CardContent>
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
            {sortedLocationData.map((location, index) => (
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
      </CardContent>
    </Card>
  );
}