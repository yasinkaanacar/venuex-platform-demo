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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Star, 
  TrendingUp, 
  TrendingDown,
  List,
  Map,
  Filter,
  BarChart3,
  Globe,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Send,
  Eye,
  Settings
} from 'lucide-react';
import Header from '@/components/overview/header';

export default function ReviewsX() {
  const [selectedPlatform, setSelectedPlatform] = useState("google");
  const [viewMode, setViewMode] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReviewId, setSelectedReviewId] = useState(1);
  const [replyText, setReplyText] = useState("");
  const [ratingDistributionTab, setRatingDistributionTab] = useState("overall");
  const [surface, setSurface] = useState("all");
  const [selectedView, setSelectedView] = useState("exec_default");

  // Saved Views Data
  const savedViews = [
    {
      id: "exec_default",
      name: "Yönetici Özeti",
      filters: {
        surface: "all",
        sentiment: "all",
        rating: "all",
        trend: "rising"
      },
      is_default: true
    },
    {
      id: "category_owner_shoes",
      name: "Ayakkabı (Ürün) – Negatif Artış",
      filters: {
        surface: "product",
        category: ["Ayakkabı"],
        sentiment: "negative",
        trend: "rising"
      }
    }
  ];

  // Insight Filters
  const insightFilters = {
    surface: "all",
    sources: ["gbp", "apple", "yandex", "web", "app"],
    regions: [],
    cities: [],
    categories: [],
    skus: [],
    themes: [],
    aspects: [],
    confidence: "any",
    trend: "any"
  };

  // Executive Insights Data
  const executiveInsights = [
    {
      id: 1,
      type: "trend_alert",
      title: "Ayakkabı kategorisinde negatif yorumlar artıyor",
      description: "Son 7 günde ayakkabı ürünleri için 1-2 yıldızlı yorumlar %23 artış gösterdi",
      confidence: "high",
      trend: "rising",
      impact: "medium",
      date: "2 saat önce"
    },
    {
      id: 2,
      type: "opportunity",
      title: "Müşteri hizmetleri memnuniyeti yükseliyor",
      description: "Personel davranışları ile ilgili pozitif yorumlar artmaya devam ediyor",
      confidence: "high",
      trend: "rising",
      impact: "high",
      date: "4 saat önce"
    },
    {
      id: 3,
      type: "issue",
      title: "Ödeme sistemi sorunları bildiriliyor",
      description: "Kredi kartı işlemlerinde yaşanan teknik sorunlar müşteri memnuniyetini etkiliyor",
      confidence: "medium",
      trend: "stable",
      impact: "high",
      date: "6 saat önce"
    }
  ];

  // Theme-Aspect Matrix Data
  const themeAspectMatrix = [
    { theme: "Ürün Kalitesi", positive: 78, neutral: 15, negative: 7, total: 450 },
    { theme: "Müşteri Hizmeti", positive: 82, neutral: 12, negative: 6, total: 380 },
    { theme: "Mağaza Atmosferi", positive: 71, neutral: 20, negative: 9, total: 325 },
    { theme: "Fiyat-Performans", positive: 65, neutral: 25, negative: 10, total: 290 },
    { theme: "Ürün Çeşitliliği", positive: 88, neutral: 8, negative: 4, total: 275 }
  ];

  // Geographic Distribution Data
  const geoData = [
    { region: "İstanbul", reviews: 1243, rating: 4.2, sentiment: "positive" },
    { region: "Ankara", reviews: 892, rating: 4.1, sentiment: "positive" },
    { region: "İzmir", reviews: 756, rating: 4.3, sentiment: "positive" },
    { region: "Bursa", reviews: 523, rating: 3.9, sentiment: "neutral" },
    { region: "Antalya", reviews: 445, rating: 4.4, sentiment: "positive" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="ReviewsX" />
      <div className="pb-6 bg-[#ffffff]">
        <div className="px-6 py-4">
          
          {/* Saved Views Section */}
          <div className="mx-6 mb-6 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-none">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-[#f9fafb]">
              <h3 className="text-base font-semibold text-foreground">Kaydedilmiş Görünümler</h3>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Yönet
              </Button>
            </div>
            <div className="p-6 bg-[#f9fafb]">
              <div className="flex gap-3">
                {savedViews.map((view) => (
                  <Button
                    key={view.id}
                    variant={selectedView === view.id ? "default" : "outline"}
                    onClick={() => setSelectedView(view.id)}
                    className="flex items-center gap-2"
                  >
                    {view.is_default && <Star className="w-4 h-4" />}
                    {view.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="mx-6 mb-6 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-none">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-[#f9fafb]">
              <h3 className="text-base font-semibold text-foreground">Özet</h3>
              <div className="text-sm text-gray-500">Son 30 gün</div>
            </div>
            <div className="p-6 bg-[#f9fafb]">
              <div className="grid grid-cols-4 gap-6">
                {/* E-reputation */}
                <div className="bg-white rounded-md border border-slate-200 p-6">
                  <div>
                    <div className="text-lg font-semibold text-gray-900 mb-1">E-reputation</div>
                    <div className="text-sm text-gray-500 mb-6">(Son 12 ay)</div>
                    
                    <div className="mb-4">
                      <div className="text-4xl font-bold text-gray-900 mb-1">4.78</div>
                      <div className="text-sm text-gray-500">5617 yorum</div>
                    </div>
                    
                    <div className="space-y-2">
                      {[
                        { star: 5, percentage: 92 },
                        { star: 4, percentage: 5 },
                        { star: 3, percentage: 1 },
                        { star: 2, percentage: 2 },
                        { star: 1, percentage: 2 }
                      ].map((item) => (
                        <div key={item.star} className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700 w-4">{item.star}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${item.percentage}%`}}></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Total Reviews */}
                <div className="bg-white rounded-md border border-slate-200 p-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-3">TOPLAM YORUM</div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">3,672</div>
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">+12% önceki dönem</span>
                    </div>
                  </div>
                </div>

                {/* Unanswered Reviews */}
                <div className="bg-white rounded-md border border-slate-200 p-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-3">CEVAPLANMAYAN</div>
                    <div className="text-2xl font-bold text-red-600 mb-2">4,708</div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <TrendingUp className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600">+8.5% önceki dönem</span>
                    </div>
                  </div>
                </div>

                {/* Sentiment Analysis */}
                <div className="bg-white rounded-md border border-slate-200 p-6">
                  <div className="text-sm font-medium text-gray-600 mb-3">DUYGU ANALİZİ</div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-600">Pozitif</span>
                        <span className="font-medium text-green-600">58.2%</span>
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600">+4.1% önceki</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Nötr</span>
                        <span className="font-medium text-gray-600">23.1%</span>
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <TrendingDown className="w-3 h-3 text-orange-600" />
                        <span className="text-xs text-orange-600">-1.8% önceki</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-600">Negatif</span>
                        <span className="font-medium text-red-600">18.7%</span>
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <TrendingDown className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600">-2.3% önceki</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Insight Overview */}
          <div className="mx-6 mb-6 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-none">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-[#f9fafb]">
              <h3 className="text-base font-semibold text-foreground">Yönetici İçgörüleri</h3>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Tümünü Göster
              </Button>
            </div>
            <div className="p-6 bg-[#f9fafb]">
              <div className="space-y-4">
                {executiveInsights.map((insight) => (
                  <div key={insight.id} className="bg-white rounded-md border border-slate-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {insight.type === "trend_alert" && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                          {insight.type === "opportunity" && <TrendingUp className="w-4 h-4 text-green-500" />}
                          {insight.type === "issue" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          <span className="font-medium text-gray-900">{insight.title}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Güven: {insight.confidence === "high" ? "Yüksek" : insight.confidence === "medium" ? "Orta" : "Düşük"}</span>
                          <span>Etki: {insight.impact === "high" ? "Yüksek" : insight.impact === "medium" ? "Orta" : "Düşük"}</span>
                          <span>{insight.date}</span>
                        </div>
                      </div>
                      <Badge variant={insight.trend === "rising" ? "destructive" : "secondary"}>
                        {insight.trend === "rising" ? "Artış" : "Sabit"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Theme-Aspect Matrix */}
          <div className="mx-6 mb-6 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-none">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-[#f9fafb]">
              <h3 className="text-base font-semibold text-foreground">Tema-Boyut Matrisi</h3>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrele
              </Button>
            </div>
            <div className="p-6 bg-[#f9fafb]">
              <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Tema</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Pozitif %</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Nötr %</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Negatif %</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Toplam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {themeAspectMatrix.map((item, index) => (
                      <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{item.theme}</td>
                        <td className="text-center py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {item.positive}%
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                            {item.neutral}%
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            {item.negative}%
                          </span>
                        </td>
                        <td className="text-center py-3 px-4 text-gray-700">{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="mx-6 mb-6 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-none">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-[#f9fafb]">
              <h3 className="text-base font-semibold text-foreground">Coğrafi Dağılım</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Map className="w-4 h-4 mr-2" />
                  Harita
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Grafik
                </Button>
              </div>
            </div>
            <div className="p-6 bg-[#f9fafb]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {geoData.map((region, index) => (
                  <div key={index} className="bg-white rounded-md border border-slate-200 p-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900 mb-1">{region.region}</div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">{region.reviews}</div>
                      <div className="text-sm text-gray-500 mb-2">yorum</div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{region.rating}</span>
                      </div>
                      <Badge 
                        variant={region.sentiment === "positive" ? "default" : "secondary"}
                        className={region.sentiment === "positive" ? "bg-green-100 text-green-800" : ""}
                      >
                        {region.sentiment === "positive" ? "Pozitif" : "Nötr"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Discovery Search */}
          <div className="mx-6 mb-6 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-none">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-[#f9fafb]">
              <h3 className="text-base font-semibold text-foreground">Keşif ve Arama</h3>
            </div>
            <div className="p-6 bg-[#f9fafb]">
              <div className="bg-white rounded-md border border-slate-200 p-6">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        placeholder="Yorumlarda ara..." 
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={surface} onValueChange={setSurface}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Yüzeyler</SelectItem>
                      <SelectItem value="product">Ürün</SelectItem>
                      <SelectItem value="service">Hizmet</SelectItem>
                      <SelectItem value="location">Lokasyon</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Search className="w-4 h-4 mr-2" />
                    Ara
                  </Button>
                </div>
                
                <div className="text-center py-8 text-gray-500">
                  <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Arama yapmak için yukarıdaki alanı kullanın</p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Banner */}
          <div className="mx-6 mb-6 bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900 mb-1">Gizlilik Bildirimi</h4>
                <p className="text-sm text-blue-700">
                  Bu sayfadaki veriler Boyner'in gizlilik politikası kapsamında işlenmektedir. 
                  Müşteri verilerinin korunması konusunda gerekli önlemler alınmıştır.
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-100">
                Detaylar
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}