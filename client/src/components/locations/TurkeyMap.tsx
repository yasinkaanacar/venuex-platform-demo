import { useState } from 'react';

interface CityData {
  name: string;
  count: number;
  percentage: number;
}

const cityData: CityData[] = [
  { name: 'İstanbul', count: 45, percentage: 32.1 },
  { name: 'Ankara', count: 18, percentage: 12.9 },
  { name: 'İzmir', count: 15, percentage: 10.7 },
  { name: 'Bursa', count: 12, percentage: 8.6 },
  { name: 'Antalya', count: 10, percentage: 7.1 },
  { name: 'Adana', count: 8, percentage: 5.7 },
  { name: 'Gaziantep', count: 6, percentage: 4.3 },
  { name: 'Konya', count: 5, percentage: 3.6 },
  { name: 'Kayseri', count: 4, percentage: 2.9 },
  { name: 'Mersin', count: 4, percentage: 2.9 },
  { name: 'Eskişehir', count: 3, percentage: 2.1 },
  { name: 'Diyarbakır', count: 3, percentage: 2.1 },
  { name: 'Samsun', count: 3, percentage: 2.1 },
  { name: 'Denizli', count: 2, percentage: 1.4 },
  { name: 'Şanlıurfa', count: 2, percentage: 1.4 }
];

export default function TurkeyMap() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const getIntensityColor = (percentage: number) => {
    if (percentage > 20) return '#0066cc';
    if (percentage > 10) return '#3399ff';
    if (percentage > 5) return '#66b3ff';
    if (percentage > 2) return '#99ccff';
    return '#e6f3ff';
  };

  const getCityInfo = (cityName: string) => {
    return cityData.find(city => city.name === cityName);
  };

  return (
    <div className="bg-[#fcfcfc] rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-[#f9fafb] p-6 flex justify-between items-center border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Store Distribution Map</h3>
          <p className="text-sm text-muted-foreground">Geographic distribution of store locations across Turkey</p>
        </div>
      </div>
      
      <div className="bg-[#f9fafb] p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map Section */}
          <div className="flex-1">
            <div className="relative bg-white rounded-lg border border-gray-200 p-4">
              <svg 
                viewBox="0 0 1000 600" 
                className="w-full h-auto max-h-96"
                data-testid="turkey-map-svg"
              >
                {/* Simplified Turkey outline */}
                <path
                  d="M 100 200 Q 150 180 200 190 L 300 185 Q 400 180 500 185 L 600 190 Q 700 185 800 190 L 900 200 Q 920 220 910 240 L 900 280 Q 890 320 880 340 L 850 380 Q 800 400 750 390 L 650 385 Q 550 390 450 385 L 350 380 Q 250 385 150 380 L 120 360 Q 90 320 95 280 L 100 240 Q 95 220 100 200 Z"
                  fill="#f0f9ff"
                  stroke="#e0e7ff"
                  strokeWidth="2"
                  className="transition-colors duration-200"
                />
                
                {/* City markers */}
                {cityData.map((city, index) => {
                  // Simplified positioning for major cities
                  const positions: { [key: string]: { x: number; y: number } } = {
                    'İstanbul': { x: 250, y: 220 },
                    'Ankara': { x: 350, y: 280 },
                    'İzmir': { x: 180, y: 320 },
                    'Bursa': { x: 220, y: 260 },
                    'Antalya': { x: 380, y: 380 },
                    'Adana': { x: 450, y: 350 },
                    'Gaziantep': { x: 480, y: 320 },
                    'Konya': { x: 380, y: 320 },
                    'Kayseri': { x: 420, y: 300 },
                    'Mersin': { x: 430, y: 370 },
                    'Eskişehir': { x: 320, y: 270 },
                    'Diyarbakır': { x: 550, y: 300 },
                    'Samsun': { x: 450, y: 220 },
                    'Denizli': { x: 280, y: 350 },
                    'Şanlıurfa': { x: 500, y: 330 }
                  };
                  
                  const pos = positions[city.name] || { x: 400, y: 300 };
                  const isHovered = hoveredCity === city.name;
                  const isSelected = selectedCity === city.name;
                  
                  return (
                    <g key={city.name}>
                      {/* City circle */}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={Math.max(4, Math.sqrt(city.count) * 2)}
                        fill={getIntensityColor(city.percentage)}
                        stroke={isHovered || isSelected ? '#1e40af' : '#ffffff'}
                        strokeWidth={isHovered || isSelected ? '3' : '2'}
                        className="cursor-pointer transition-all duration-200"
                        onMouseEnter={() => setHoveredCity(city.name)}
                        onMouseLeave={() => setHoveredCity(null)}
                        onClick={() => setSelectedCity(selectedCity === city.name ? null : city.name)}
                        data-testid={`city-marker-${city.name.toLowerCase().replace('ş', 's').replace('ç', 'c').replace('ğ', 'g').replace('ü', 'u').replace('ö', 'o').replace('ı', 'i')}`}
                      />
                      
                      {/* City label */}
                      {(isHovered || isSelected) && (
                        <>
                          {/* Background rectangle for label */}
                          <rect
                            x={pos.x - 25}
                            y={pos.y - 35}
                            width="50"
                            height="20"
                            fill="rgba(0, 0, 0, 0.8)"
                            rx="4"
                            className="transition-opacity duration-200"
                          />
                          <text
                            x={pos.x}
                            y={pos.y - 22}
                            textAnchor="middle"
                            fill="white"
                            fontSize="10"
                            fontWeight="bold"
                            className="pointer-events-none"
                          >
                            {city.name}
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
              
              {/* Tooltip */}
              {hoveredCity && (
                <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-lg p-3 shadow-lg z-10">
                  <div className="text-sm font-semibold text-gray-900">
                    {getCityInfo(hoveredCity)?.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {getCityInfo(hoveredCity)?.count} stores ({getCityInfo(hoveredCity)?.percentage}%)
                  </div>
                </div>
              )}
            </div>
            
            {/* Legend */}
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-[#0066cc]"></div>
                <span>&gt;20%</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-[#3399ff]"></div>
                <span>10-20%</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-[#66b3ff]"></div>
                <span>5-10%</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-[#99ccff]"></div>
                <span>2-5%</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-[#e6f3ff]"></div>
                <span>&lt;2%</span>
              </div>
            </div>
          </div>
          
          {/* City List */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Top Cities by Store Count</h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {cityData.map((city, index) => (
                  <div
                    key={city.name}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                      selectedCity === city.name 
                        ? 'bg-blue-50 border border-blue-200' 
                        : hoveredCity === city.name 
                        ? 'bg-gray-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onMouseEnter={() => setHoveredCity(city.name)}
                    onMouseLeave={() => setHoveredCity(null)}
                    onClick={() => setSelectedCity(selectedCity === city.name ? null : city.name)}
                    data-testid={`city-list-item-${city.name.toLowerCase().replace('ş', 's').replace('ç', 'c').replace('ğ', 'g').replace('ü', 'u').replace('ö', 'o').replace('ı', 'i')}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{city.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{city.count}</div>
                      <div className="text-xs text-gray-500">{city.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}