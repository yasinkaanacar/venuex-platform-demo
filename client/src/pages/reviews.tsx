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
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Star, 
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Building2
} from 'lucide-react';

interface Review {
  id: number;
  customerName: string;
  storeName: string;
  rating: number;
  date: string;
  comment: string;
  isNew: boolean;
  status: 'answered' | 'unanswered';
  storeCode: string;
  location: string;
  reviewCount: number;
  storeRating: number;
}

export default function Reviews() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");

  // Reviews data matching the screenshot
  const reviews: Review[] = [
    {
      id: 1,
      customerName: "Boyner Eskişehir Kanatlı",
      storeName: "Boyner Eskişehir Kanatlı",
      rating: 3,
      date: "17 Sep 2025",
      comment: "İyi",
      isNew: false,
      status: 'answered',
      storeCode: "CB08",
      location: "Hoşnudiye Mh, İsmet İnönü Cd. No:57, Kanatlı AVM",
      reviewCount: 1017,
      storeRating: 3.95
    },
    {
      id: 2,
      customerName: "Boyner Ankara Ankamalı",
      storeName: "Boyner Ankara Ankamalı",
      rating: 5,
      date: "16 Sep 2025",
      comment: "Dior bölümünde çalışan ilgili hanımleniyle çok teşekkür ederim. Kendisi mesleğinde çok ama çok yetkın. Parfümleriyle ilgili her sorun...",
      isNew: true,
      status: 'unanswered',
      storeCode: "CB09",
      location: "Ankara",
      reviewCount: 892,
      storeRating: 4.2
    },
    {
      id: 3,
      customerName: "Boyner Dynamic Çevahir",
      storeName: "Boyner Dynamic Çevahir",
      rating: 1,
      date: "16 Sep 2025",
      comment: "Parfüm personelleril saat 09:45 çıkartıyorlar\n...",
      isNew: true,
      status: 'unanswered',
      storeCode: "CB12",
      location: "İstanbul Şişli",
      reviewCount: 654,
      storeRating: 2.8
    },
    {
      id: 4,
      customerName: "Boyner Aydın Forum",
      storeName: "Boyner Aydın Forum",
      rating: 5,
      date: "16 Sep 2025",
      comment: "Aydın'ın cazibe merkezi AVM'si\n...",
      isNew: true,
      status: 'unanswered',
      storeCode: "CB15",
      location: "Aydın",
      reviewCount: 445,
      storeRating: 4.1
    },
    {
      id: 5,
      customerName: "Boyner Alanya Akdeniz Park",
      storeName: "Boyner Alanya Akdeniz Park",
      rating: 1,
      date: "16 Sep 2025",
      comment: "15.09.2025 buluş u ütem mağazine. Krasne ne pokemuyğ. Prodavsh na kasse vsicheski momchinami. Snahala posrevali...",
      isNew: true,
      status: 'unanswered',
      storeCode: "CB17",
      location: "Antalya",
      reviewCount: 334,
      storeRating: 3.2
    },
    {
      id: 6,
      customerName: "Boyner Konya KuleSite",
      storeName: "Boyner Konya KuleSite",
      rating: 5,
      date: "16 Sep 2025",
      comment: "Şerife Gül Çokardos ve Dilara Erdem hanımlarla müşteriyle yaklaşımları güler yüzlülüğü müşteriye karşı ilgisi anlayışı ve ürünleri tanıtması...",
      isNew: true,
      status: 'unanswered',
      storeCode: "CB20",
      location: "Konya",
      reviewCount: 267,
      storeRating: 4.3
    },
    {
      id: 7,
      customerName: "Boyner Antalya Migros",
      storeName: "Boyner Antalya Migros",
      rating: 2,
      date: "16 Sep 2025",
      comment: "Приобретала подарки, но чуть ошиблась в выбором и решила вернуть что-то обратно, но ущерб что не вместе с дамочкой выбирать что...",
      isNew: true,
      status: 'unanswered',
      storeCode: "CB21",
      location: "Antalya",
      reviewCount: 189,
      storeRating: 3.7
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

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
    setReplyText("");
  };

  const handleSendReply = () => {
    if (replyText.trim() && selectedReview) {
      // Here you would typically send the reply to your backend
      console.log("Sending reply:", replyText, "to review:", selectedReview.id);
      setReplyText("");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="p-6">
        {/* Header */}
        <div className="mx-6 mb-6 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-none">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-gradient-to-b from-white to-stone-50">
            <h3 className="text-base font-semibold text-foreground">Reviews (71,880)</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox />
                <span className="text-sm text-gray-600">Select All</span>
              </div>
              <Button variant="outline" size="sm">Bulk Actions ↓</Button>
              <Button variant="outline" size="sm">Export Reviews ↓</Button>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Rows per page:</span>
                <Select defaultValue="10">
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Split Layout */}
        <div className="mx-6 mb-6 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-none">
          <div className="flex h-[800px]">
            {/* Left Side - Reviews List */}
            <div className="w-1/2 border-r border-slate-200">
              <div className="h-full overflow-y-auto">
                {reviews.map((review, index) => (
                  <div
                    key={review.id}
                    onClick={() => handleReviewClick(review)}
                    className={`p-6 border-b border-slate-200 cursor-pointer transition-colors hover:bg-slate-50 ${
                      selectedReview?.id === review.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    } ${index === reviews.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                          <div className="flex items-center gap-1">
                            {getRatingStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                          {review.isNew && (
                            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-600 px-2">2</span>
                  <span className="text-sm text-gray-600 px-2">3</span>
                  <span className="text-sm text-gray-600 px-2">4</span>
                  <span className="text-sm text-gray-600 px-2">5</span>
                  <span className="text-sm text-gray-600 px-2">...</span>
                  <span className="text-sm text-gray-600 px-2">7188</span>
                  <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Side - Reply Section */}
            <div className="w-1/2 flex flex-col">
              {selectedReview ? (
                <>
                  {/* Selected Review Details */}
                  <div className="p-6 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {selectedReview.storeName} ({selectedReview.storeCode})
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-bold">{selectedReview.storeRating}</span>
                            {getRatingStars(Math.round(selectedReview.storeRating))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {selectedReview.reviewCount} Reviews
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{selectedReview.location}</p>
                      </div>
                    </div>

                    {/* Customer Review */}
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {selectedReview.customerName.split(' ')[0]?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">İsmail hakkı yazgan</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {getRatingStars(selectedReview.rating)}
                            </div>
                            <span className="text-sm text-gray-500">{selectedReview.date}</span>
                            <Badge className="bg-green-100 text-green-800 text-xs">Answered</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-3">İyi</p>
                      <p className="text-xs text-gray-500">(Translated by Google)</p>
                      <p className="text-gray-600 text-sm mt-2">Good</p>
                    </div>
                  </div>

                  {/* Business Response */}
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{selectedReview.storeName}</h4>
                        <span className="text-xs text-gray-500">17 Sep 2025 8:52 AM</span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Sayın İsmail hakkı yazgan, değerli görüşleriniz için teşekkür ederiz. Boyner Eskişehir Kanatlı olarak size daha iyi bir alışveriş deneyimi sunmak için geri bildirimlerinizi önemsiyoruz. Tüm talepleriniz için bize online@boynergroup.com.tr adresinden veya 444 29 67 numaralı çağrı merkezi hattımızdan ulaşabilirsiniz. İyi günler dileriz.
                      </p>
                      <p className="text-xs text-gray-500 mt-2">(Translated by Google)</p>
                      <p className="text-gray-600 text-sm mt-1">
                        Dear Mr. İsmail Hakkı Yazgan, thank you for your valuable feedback. At Boyner Eskişehir Kanatlı, we value your feedback to provide you with a better shopping experience. For all your inquiries, please contact us at online@boynergroup.com.tr or our call center at 444 29 67. Have a great day.
                      </p>
                    </div>
                  </div>

                  {/* Reply Form */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Reply
                      </label>
                      <Textarea
                        placeholder="Write your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full h-32 resize-none"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-red-600 border-red-600">
                          Delete
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button 
                          size="sm"
                          onClick={handleSendReply}
                          disabled={!replyText.trim()}
                        >
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <p>Select a review to view details and reply</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}