import { useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Cell, ReferenceLine, LabelList,
} from 'recharts';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import type { ThemeAnalysisItem, ThemeView, ChartType, ThemeSortBy, SortDirection } from '@/lib/types/reviews';

interface ThemeAnalysisProps {
  data: ThemeAnalysisItem[];
}

const getQuadrantColor = (entry: ThemeAnalysisItem) => {
  if (entry.venueXScore >= 80 && entry.reviews >= 90) return '#10b981';
  if (entry.venueXScore >= 80 && entry.reviews < 90) return '#3b82f6';
  if (entry.venueXScore < 80 && entry.reviews >= 90) return '#f59e0b';
  return '#ef4444';
};

const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
      <p className="font-semibold text-sm text-gray-900">{d.name}</p>
      <p className="text-xs text-gray-600">Değerlendirme: {d.reviews}</p>
      <p className="text-xs text-gray-600">Ort. Puan: {d.avgRating}★</p>
      <p className="text-xs text-gray-600">VenueX Skoru: {d.venueXScore}</p>
    </div>
  );
};

export default function ThemeAnalysis({ data }: ThemeAnalysisProps) {
  const { t } = useTranslation();
  const [themeView, setThemeView] = useState<ThemeView>('list');
  const [chartType, setChartType] = useState<ChartType>('scatter');
  const [themeSortBy, setThemeSortBy] = useState<ThemeSortBy>('reviews');
  const [themeSortOrder, setThemeSortOrder] = useState<SortDirection>('desc');

  const handleSortToggle = (field: ThemeSortBy) => {
    if (themeSortBy === field) {
      setThemeSortOrder(themeSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setThemeSortBy(field);
      setThemeSortOrder('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const order = themeSortOrder === 'asc' ? 1 : -1;
    return (a[themeSortBy] - b[themeSortBy]) * order;
  });

  return (
    <div className="vx-card">
      <div className="vx-card-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t.reviews.tabs.themes}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{t.reviews.themes.subtitle}</p>
          </div>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                themeView === 'list' ? 'bg-slate-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setThemeView('list')}
            >
              {t.common.list}
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                themeView === 'chart' ? 'bg-slate-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setThemeView('chart')}
            >
              {t.common.chart}
            </button>
          </div>
        </div>
      </div>

      <div className="vx-card-body">
        {themeView === 'list' ? (
          <div className="space-y-6">
            {/* Sortable Theme Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-xs font-semibold text-gray-600 uppercase">{t.reviews.filters.theme}</span>
                <div className="flex items-center gap-12">
                  <button
                    className="text-xs font-semibold text-gray-600 uppercase w-16 text-right flex items-center justify-end gap-1 hover:text-gray-900 transition-colors"
                    onClick={() => handleSortToggle('reviews')}
                  >
                    {t.reviews.table.reviews}
                    {themeSortBy === 'reviews' && (
                      themeSortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    className="text-xs font-semibold text-gray-600 uppercase w-16 text-right flex items-center justify-end gap-1 hover:text-gray-900 transition-colors whitespace-nowrap"
                    onClick={() => handleSortToggle('venueXScore')}
                  >
                    {t.reviews.themes.venueXScore}
                    {themeSortBy === 'venueXScore' && (
                      themeSortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {sortedData.map((theme, index) => (
                <div key={index} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white transition-colors cursor-pointer">
                  <span className="text-sm font-medium text-gray-900">{theme.name}</span>
                  <div className="flex items-center gap-12">
                    <span className="text-sm text-gray-700 w-16 text-right">{theme.reviews}</span>
                    <span className={`text-sm font-semibold w-16 text-right ${
                      theme.venueXScore >= 80 ? 'text-green-600' :
                      theme.venueXScore >= 60 ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {theme.venueXScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          <div className="space-y-4">
            {/* Chart Type Selector */}
            <div className="flex justify-center">
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  className={`px-6 py-2 text-sm font-medium transition-colors ${
                    chartType === 'scatter' ? 'bg-slate-800 text-white' : 'bg-gray-50 text-gray-700 hover:bg-white'
                  }`}
                  onClick={() => setChartType('scatter')}
                >
                  {t.reviews.themes.scatterPlot}
                </button>
                <button
                  className={`px-6 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                    chartType === 'bubble' ? 'bg-slate-800 text-white' : 'bg-gray-50 text-gray-700 hover:bg-white'
                  }`}
                  onClick={() => setChartType('bubble')}
                >
                  {t.reviews.themes.bubbleChart}
                </button>
              </div>
            </div>

            <div className="h-[600px] relative">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'scatter' ? (
                  <ScatterChart margin={{ top: 20, right: 100, bottom: 60, left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number" dataKey="venueXScore" name="VenueX Skoru"
                      domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }}
                      label={{ value: 'VenueX Skoru', position: 'bottom', offset: 40, style: { fontSize: '12px', fill: '#475569' } }}
                    />
                    <YAxis
                      type="number" dataKey="reviews" name="Değerlendirme Sayısı"
                      domain={[0, 180]} tick={{ fontSize: 11, fill: '#64748b' }}
                      label={{ value: 'Değerlendirme Sayısı', angle: -90, position: 'left', offset: 40, style: { fontSize: '12px', fill: '#475569' } }}
                    />
                    <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltip />} />
                    <ReferenceLine x={50} stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} />
                    <ReferenceLine y={90} stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} />
                    <Scatter data={data}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getQuadrantColor(entry)} />
                      ))}
                      <LabelList dataKey="name" position="right" style={{ fontSize: '11px', fill: '#475569', fontWeight: '500' }} offset={8} />
                    </Scatter>
                  </ScatterChart>
                ) : (
                  <ScatterChart margin={{ top: 20, right: 100, bottom: 60, left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number" dataKey="avgRating" name="Ortalama Puan"
                      domain={[0, 5]} tick={{ fontSize: 11, fill: '#64748b' }}
                      label={{ value: 'Ortalama Puan', position: 'bottom', offset: 40, style: { fontSize: '12px', fill: '#475569' } }}
                    />
                    <YAxis
                      type="number" dataKey="reviews" name="Değerlendirme Sayısı"
                      domain={[0, 180]} tick={{ fontSize: 11, fill: '#64748b' }}
                      label={{ value: 'Değerlendirme Sayısı', angle: -90, position: 'left', offset: 40, style: { fontSize: '12px', fill: '#475569' } }}
                    />
                    <ZAxis type="number" dataKey="venueXScore" range={[100, 1000]} name="VenueX Skoru" />
                    <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltip />} />
                    <Scatter data={data}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getQuadrantColor(entry)} fillOpacity={0.7} />
                      ))}
                      <LabelList dataKey="name" position="top" style={{ fontSize: '10px', fill: '#1e293b', fontWeight: '600' }} offset={0} />
                    </Scatter>
                  </ScatterChart>
                )}
              </ResponsiveContainer>

              {/* Quadrant Labels */}
              <div className="group absolute top-0 right-0">
                <div className="text-xs font-semibold text-green-600 cursor-help">Yüksek Değerlendirme / Yüksek Puan</div>
                <div className="hidden group-hover:block absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs z-10">
                  <p className="font-semibold mb-1">Temel Güçlü Yönler</p>
                  <p className="text-xs text-gray-600 mb-2">Bunlar temel güçlü yönlerinizdir. Pek çok kişi bunları fark eder ve sever.</p>
                  <p className="text-xs font-medium">Eylem: Koruyun ve kullanın. Bunları pazarlamanızda öne çıkarın.</p>
                </div>
              </div>
              <div className="group absolute top-0 left-0">
                <div className="text-xs font-semibold text-orange-600 cursor-help">Yüksek Değerlendirme / Düşük Puan</div>
                <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs z-10">
                  <p className="font-semibold mb-1">Acil Sorunlar</p>
                  <p className="text-xs text-gray-600 mb-2">Müşteri deneyimini olumsuz etkileyen sık dile getirilen sorunlar.</p>
                  <p className="text-xs font-medium">Eylem: Öncelikli dikkat gereklidir. Bu sorunları hemen ele alın.</p>
                </div>
              </div>
              <div className="group absolute bottom-0 right-0">
                <div className="text-xs font-semibold text-blue-600 cursor-help">Düşük Değerlendirme / Yüksek Puan</div>
                <div className="hidden group-hover:block absolute bottom-full right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs z-10">
                  <p className="font-semibold mb-1">Gizli Değerler</p>
                  <p className="text-xs text-gray-600 mb-2">Az müşterinin bahsettiği yüksek kaliteli yönler. Görünürlük kazanırsa güçlü yönlere dönüşebilir.</p>
                  <p className="text-xs font-medium">Eylem: Farkındalığı artırın. Bu özellikleri müşterilere öne çıkarın.</p>
                </div>
              </div>
              <div className="group absolute bottom-0 left-0">
                <div className="text-xs font-semibold text-red-600 cursor-help">Düşük Değerlendirme / Düşük Puan</div>
                <div className="hidden group-hover:block absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs z-10">
                  <p className="font-semibold mb-1">Küçük Endişeler</p>
                  <p className="text-xs text-gray-600 mb-2">Nadiren dile getirilen ve düşük memnuniyet puanlarına sahip sorunlar.</p>
                  <p className="text-xs font-medium">Eylem: İzleyin ve kaynaklar elverdiğinde iyileştirin.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
