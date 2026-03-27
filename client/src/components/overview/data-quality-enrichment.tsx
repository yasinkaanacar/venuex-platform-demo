import { ShieldCheck, Info } from 'lucide-react';
import { useLocation } from 'wouter';
import { useTranslation } from '@/contexts/LanguageContext';
import EnrichmentSuggestions from './enrichment-suggestions';
import type { OverviewFilterState } from '@/pages/overview';
import { PATHS } from '@/routes/paths';

type DataQualityContext = 'dashboard' | 'locations';

interface DataQualityEnrichmentProps {
  context?: DataQualityContext;
  filters?: OverviewFilterState;
}

interface QualityField {
  label: string;
  value: number;
}

interface QualityCategory {
  title: string;
  fields: QualityField[];
}

const getBarColor = (v: number) => {
  if (v >= 90) return 'bg-emerald-500';
  if (v >= 70) return 'bg-amber-500';
  return 'bg-red-500';
};

const getScoreColor = (v: number) => {
  if (v >= 90) return 'text-emerald-600';
  if (v >= 70) return 'text-amber-600';
  return 'text-red-600';
};

function QualityBar({ label, value }: QualityField) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="text-gray-500 w-28 flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${getBarColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`w-8 text-right font-medium ${getScoreColor(value)}`}>{value}%</span>
    </div>
  );
}

export default function DataQualityEnrichment({ context = 'dashboard', filters }: DataQualityEnrichmentProps) {
  const { t, language } = useTranslation();
  const en = language === 'en';
  const [, navigate] = useLocation();

  const dashboardCategories: QualityCategory[] = [
    {
      title: en ? 'Location Data' : 'Lokasyon Verisi',
      fields: [
        { label: en ? 'Store Name' : 'Mağaza Adı', value: 100 },
        { label: en ? 'Full Address' : 'Tam Adres', value: 98 },
        { label: en ? 'Coordinates' : 'Koordinatlar', value: 96 },
        { label: en ? 'Primary Category' : 'Birincil Kategori', value: 94 },
        { label: en ? 'Business Hours' : 'Çalışma Saatleri', value: 87 },
      ],
    },
    {
      title: en ? 'Inventory Data' : 'Envanter Verisi',
      fields: [
        { label: 'SKU ID', value: 99 },
        { label: en ? 'Store ID' : 'Mağaza ID', value: 100 },
        { label: en ? 'Availability' : 'Stok Durumu', value: 95 },
        { label: en ? 'Current Price' : 'Güncel Fiyat', value: 97 },
        { label: en ? 'Last Updated' : 'Son Güncelleme', value: 92 },
      ],
    },
    {
      title: en ? 'In-Store Sales Data' : 'Mağaza Satış Verisi',
      fields: [
        { label: en ? 'Store ID' : 'Mağaza ID', value: 100 },
        { label: en ? 'Transaction ID' : 'İşlem ID', value: 98 },
        { label: en ? 'Transaction Value' : 'İşlem Tutarı', value: 96 },
        { label: en ? 'Timestamp' : 'Zaman Damgası', value: 94 },
        { label: en ? 'Phone (Hashed)' : 'Telefon (Hash)', value: 78 },
      ],
    },
  ];

  const locationCategories: QualityCategory[] = [
    {
      title: en ? 'Location Data' : 'Lokasyon Verisi',
      fields: [
        { label: en ? 'Address' : 'Adres', value: 95 },
        { label: en ? 'Locality' : 'İlçe', value: 89 },
        { label: en ? 'Coordinates' : 'Koordinatlar', value: 92 },
        { label: en ? 'Country' : 'Ülke', value: 98 },
        { label: en ? 'Province' : 'İl', value: 96 },
        { label: en ? 'Postal Code' : 'Posta Kodu', value: 84 },
      ],
    },
    {
      title: en ? 'Business Data' : 'İşletme Verisi',
      fields: [
        { label: en ? 'Store Name' : 'Mağaza Adı', value: 100 },
        { label: en ? 'Store Code' : 'Mağaza Kodu', value: 97 },
        { label: en ? 'Working Hours' : 'Çalışma Saatleri', value: 78 },
        { label: en ? 'Description' : 'Açıklama', value: 68 },
        { label: en ? 'Category' : 'Kategori', value: 94 },
        { label: en ? 'Photos' : 'Fotoğraflar', value: 45 },
      ],
    },
    {
      title: en ? 'Contact Data' : 'İletişim Verisi',
      fields: [
        { label: en ? 'Phone' : 'Telefon', value: 82 },
        { label: en ? 'E-mail' : 'E-posta', value: 63 },
        { label: en ? 'Website' : 'Web Sitesi', value: 89 },
        { label: en ? 'Social Media' : 'Sosyal Medya', value: 34 },
      ],
    },
  ];

  const categories = context === 'locations' ? locationCategories : dashboardCategories;

  // Calculate overall score
  const allFields = categories.flatMap(c => c.fields);
  const overallScore = Math.round(allFields.reduce((sum, f) => sum + f.value, 0) / allFields.length);

  return (
    <div className="vx-card">
      {/* Header */}
      <div className="vx-card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900">
              {en ? 'Data Quality Assessment' : 'Veri Kalitesi Değerlendirmesi'}
            </h3>
            <div className="relative group">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
                {en
                  ? 'Shows data completeness across all modules. Higher scores mean better ad platform performance and attribution accuracy.'
                  : 'Tüm modüllerdeki veri tamlığını gösterir. Yüksek skorlar daha iyi reklam platformu performansı ve atribüsyon doğruluğu anlamına gelir.'}
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-semibold ${getScoreColor(overallScore)}`}>
              {en ? 'Overall' : 'Genel'}: {overallScore}%
            </span>
            <button onClick={() => navigate(context === 'locations' ? PATHS.LOCATIONS : PATHS.CATALOG)} className="text-xs text-gray-500 hover:text-gray-700 font-medium">
              {en ? 'View All' : 'Tümünü Gör'} →
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="vx-card-body vx-surface-muted space-y-4">
        {/* Quality categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const catAvg = Math.round(cat.fields.reduce((s, f) => s + f.value, 0) / cat.fields.length);
            return (
              <div key={cat.title} className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">{cat.title}</h4>
                  <span className={`text-xs font-bold ${getScoreColor(catAvg)}`}>{catAvg}%</span>
                </div>
                <div className="space-y-2.5">
                  {cat.fields.map((field) => (
                    <QualityBar key={field.label} {...field} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enrichment suggestions */}
        <EnrichmentSuggestions context={context} />
      </div>
    </div>
  );
}
