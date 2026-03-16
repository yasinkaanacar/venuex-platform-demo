import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Star, FileText, Lightbulb, Info, Sparkles } from 'lucide-react';
import { EnrichmentSuggestion } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { QUERY_KEYS } from '@/hooks/query-keys';
import { showToast } from '@/lib/toast';
import { useTranslation } from '@/contexts/LanguageContext';

type DataQualityContext = 'dashboard' | 'locations';

interface EnrichmentSuggestionsProps {
  context?: DataQualityContext;
}

interface Suggestion {
  id: string;
  type: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  improvement: string;
  affected: string;
  actionable: boolean;
}

const typeConfig: Record<string, { icon: typeof MapPin; bg: string }> = {
  description_optimization: { icon: FileText, bg: 'bg-purple-500' },
  hours_update: { icon: Star, bg: 'bg-emerald-500' },
  location_extension: { icon: MapPin, bg: 'bg-blue-500' },
  default: { icon: Lightbulb, bg: 'bg-orange-500' },
};

const impactConfig: Record<string, { bg: string; text: string; label: string }> = {
  high:   { bg: 'bg-red-50', text: 'text-red-700', label: 'High' },
  medium: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Medium' },
  low:    { bg: 'bg-gray-50', text: 'text-gray-600', label: 'Low' },
};

export default function EnrichmentSuggestions({ context = 'dashboard' }: EnrichmentSuggestionsProps) {
  const { language } = useTranslation();
  const en = language === 'en';
  const queryClient = useQueryClient();

  const { isLoading } = useQuery<EnrichmentSuggestion[]>({
    queryKey: [QUERY_KEYS.ENRICHMENT_SUGGESTIONS],
  });

  const implementMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('PATCH', `/api/enrichment-suggestions/${id}`, {});
      return res.json();
    },
    onSuccess: () => {
      showToast({ type: 'success', title: en ? 'Fix applied' : 'Düzeltme uygulandı' });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENRICHMENT_SUGGESTIONS] });
    },
    onError: () => {
      showToast({ type: 'error', title: en ? 'Failed to apply fix' : 'Düzeltme uygulanamadı' });
    },
  });

  const dashboardSuggestions: Suggestion[] = [
    {
      id: '1', type: 'description_optimization',
      title: en ? 'Complete customer email hashing' : 'Müşteri e-posta hash\'lemesini tamamla',
      description: en ? '22% of customer emails are not properly hashed. Improves privacy compliance and ad platform performance.' : 'Müşteri e-postalarının %22\'si düzgün hash\'lenmemiş.',
      impact: 'high', improvement: '+18%', affected: en ? '1,847 records' : '1.847 kayıt', actionable: true,
    },
    {
      id: '2', type: 'hours_update',
      title: en ? 'Standardize content brand data' : 'İçerik marka verisini standartlaştır',
      description: en ? '33% of content entries missing brand info. Improves audience targeting and conversion attribution.' : 'İçerik girişlerinin %33\'ünde marka bilgisi eksik.',
      impact: 'high', improvement: '+22%', affected: en ? '2,134 items' : '2.134 öğe', actionable: false,
    },
    {
      id: '3', type: 'location_extension',
      title: en ? 'Enhance conversion time tracking' : 'Dönüşüm zaman takibini iyileştir',
      description: en ? 'Conversion timestamps missing timezone data. Accurate timing improves attribution accuracy.' : 'Dönüşüm zaman damgalarında saat dilimi verisi eksik.',
      impact: 'medium', improvement: '+12%', affected: en ? '634 conversions' : '634 dönüşüm', actionable: true,
    },
  ];

  const locationSuggestions: Suggestion[] = [
    {
      id: '4', type: 'location_extension',
      title: en ? 'Complete customer gender data' : 'Müşteri cinsiyet verisini tamamla',
      description: en ? '57% of customer profiles missing gender info. Improves targeting precision for location campaigns.' : 'Müşteri profillerinin %57\'sinde cinsiyet bilgisi eksik.',
      impact: 'high', improvement: '+19%', affected: en ? '3,247 records' : '3.247 kayıt', actionable: true,
    },
    {
      id: '5', type: 'hours_update',
      title: en ? 'Validate store code mapping' : 'Mağaza kodu eşlemesini doğrula',
      description: en ? 'Content data missing store code associations. Improves conversion attribution accuracy.' : 'İçerik verisinde mağaza kodu ilişkilendirmesi eksik.',
      impact: 'medium', improvement: '+14%', affected: en ? '1,756 items' : '1.756 öğe', actionable: true,
    },
    {
      id: '6', type: 'description_optimization',
      title: en ? 'Standardize quantity tracking' : 'Miktar takibini standartlaştır',
      description: en ? '13% of purchase contents missing quantity data. Enhances conversion value calculations.' : 'Satın alma içeriklerinin %13\'ünde miktar verisi eksik.',
      impact: 'medium', improvement: '+16%', affected: en ? '892 items' : '892 öğe', actionable: false,
    },
  ];

  const suggestions = context === 'locations' ? locationSuggestions : dashboardSuggestions;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-48 mb-4" />
        <div className="space-y-3">
          <div className="h-16 bg-gray-100 rounded" />
          <div className="h-16 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            {en ? 'Enrichment Suggestions' : 'İyileştirme Önerileri'}
          </h4>
          <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-medium">
            AI
          </span>
        </div>
        <span className="text-[11px] text-gray-400">
          {suggestions.length} {en ? 'suggestions' : 'öneri'}
        </span>
      </div>

      {/* Suggestion rows */}
      <div className="space-y-2.5">
        {suggestions.map((s) => {
          const cfg = typeConfig[s.type] || typeConfig.default;
          const Icon = cfg.icon;
          const imp = impactConfig[s.impact] || impactConfig.low;

          return (
            <div key={s.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              {/* Icon */}
              <div className={`w-7 h-7 ${cfg.bg} rounded-md flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon className="w-3.5 h-3.5 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-gray-900 truncate">{s.title}</span>
                  <span className="text-xs font-semibold text-emerald-600 flex-shrink-0">{s.improvement}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${imp.bg} ${imp.text} flex-shrink-0`}>
                    {imp.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">{s.description}</p>
                <span className="text-[11px] text-gray-400 mt-0.5 block">{s.affected}</span>
              </div>

              {/* Action */}
              <div className="flex-shrink-0">
                {s.actionable ? (
                  <button
                    onClick={() => implementMutation.mutate(s.id)}
                    disabled={implementMutation.isPending}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 px-2.5 py-1 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    {en ? 'Apply' : 'Uygula'}
                  </button>
                ) : (
                  <button className="text-xs font-medium text-gray-500 hover:text-gray-700 px-2.5 py-1 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {en ? 'Details' : 'Detay'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
