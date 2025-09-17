import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Star, MessageSquare, TrendingUp, Clock } from 'lucide-react';

export default function Reviews() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");

  const summaryStats = [
    {
      title: "Toplam Yorum",
      value: "2,847",
      change: "+12.5%",
      icon: MessageSquare,
      color: "text-blue-600"
    },
    {
      title: "Ortalama Puan",
      value: "4.2",
      change: "+0.1",
      icon: Star,
      color: "text-yellow-500"
    },
    {
      title: "Yanıt Oranı",
      value: "89%",
      change: "+5.2%",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Ortalama Yanıt Süresi",
      value: "2.4h",
      change: "-0.3h",
      icon: Clock,
      color: "text-purple-600"
    }
  ];

  const reviews = [
    {
      id: 1,
      customer: "Ayşe K.",
      rating: 5,
      comment: "Harika bir alışveriş deneyimi yaşadım. Çok memnun kaldım.",
      platform: "Google Business Profile",
      location: "Boyner Zorlu Center",
      date: "2 gün önce",
      status: "Yanıtlandı"
    },
    {
      id: 2,
      customer: "Mehmet S.",
      rating: 4,
      comment: "Ürün kalitesi çok iyi, personel ilgili.",
      platform: "Yandex Maps",
      location: "Boyner Bağdat Caddesi",
      date: "3 gün önce",
      status: "Bekliyor"
    },
    {
      id: 3,
      customer: "Zeynep A.",
      rating: 3,
      comment: "Fiyatlar biraz yüksek ama kalite memnun edici.",
      platform: "Google Business Profile",
      location: "Boyner Kanyon AVM",
      date: "5 gün önce",
      status: "Yanıtlandı"
    }
  ];

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getStatusBadge = (status: string) => {
    return status === "Yanıtlandı" ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Yanıtlandı
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
        Bekliyor
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Yorumlar</h1>
          <p className="text-gray-600 mt-1">Müşteri yorumlarını yönetin ve analiz edin</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {summaryStats.map((stat, index) => (
            <Card key={index} className="rounded-md border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <div className="flex items-center mt-2">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <span className="ml-2 text-sm text-green-600">{stat.change}</span>
                    </div>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="rounded-md border border-gray-200 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Yorum ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-md"
                    data-testid="input-search"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-48 rounded-md" data-testid="select-platform">
                    <SelectValue placeholder="Platform seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Platformlar</SelectItem>
                    <SelectItem value="google">Google Business Profile</SelectItem>
                    <SelectItem value="yandex">Yandex Maps</SelectItem>
                    <SelectItem value="meta">Meta Business</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger className="w-48 rounded-md" data-testid="select-rating">
                    <SelectValue placeholder="Puan seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Puanlar</SelectItem>
                    <SelectItem value="5">5 Yıldız</SelectItem>
                    <SelectItem value="4">4 Yıldız</SelectItem>
                    <SelectItem value="3">3 Yıldız</SelectItem>
                    <SelectItem value="2">2 Yıldız</SelectItem>
                    <SelectItem value="1">1 Yıldız</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="rounded-md" data-testid="button-filter">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrele
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <Card className="rounded-md border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Son Yorumlar</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <div key={review.id} className="p-6" data-testid={`review-${review.id}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {review.customer.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{review.customer}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex space-x-1">
                            {getRatingStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(review.status)}
                  </div>
                  
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div>
                      <span className="font-medium">{review.platform}</span> • {review.location}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-md"
                      data-testid={`button-reply-${review.id}`}
                    >
                      Yanıtla
                    </Button>
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