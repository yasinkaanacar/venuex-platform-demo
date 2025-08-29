import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Location } from '@shared/schema';

interface LocationPerformanceProps {
  locations?: Location[];
}

export default function LocationPerformance({ locations = [] }: LocationPerformanceProps) {
  // Mock performance data for demonstration
  const locationPerformance = [
    {
      id: '1',
      name: 'Manhattan - 5th Ave',
      visits: '3,247 visits this week',
      conversion: '18.2%',
      trend: '+2.1%',
      isPositive: true
    },
    {
      id: '2',
      name: 'Beverly Hills - Rodeo Dr',
      visits: '2,891 visits this week',
      conversion: '16.8%',
      trend: '+1.4%',
      isPositive: true
    },
    {
      id: '3',
      name: 'Chicago - Magnificent Mile',
      visits: '2,654 visits this week',
      conversion: '15.3%',
      trend: '0.0%',
      isPositive: null
    },
    {
      id: '4',
      name: 'Miami - Brickell Ave',
      visits: '2,105 visits this week',
      conversion: '14.7%',
      trend: '-0.8%',
      isPositive: false
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Top Performing Locations
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Store visits and conversion rates by location
            </p>
          </div>
          
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" data-testid="button-view-all-locations">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {locationPerformance.map((location) => (
            <div 
              key={location.id}
              className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg transition-colors"
              data-testid={`location-performance-${location.id}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground" data-testid={`text-location-name-${location.id}`}>
                    {location.name}
                  </div>
                  <div className="text-xs text-muted-foreground" data-testid={`text-location-visits-${location.id}`}>
                    {location.visits}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-medium text-foreground" data-testid={`text-location-conversion-${location.id}`}>
                  {location.conversion}
                </div>
                <div className={`text-xs flex items-center ${
                  location.isPositive === true ? 'text-green-600' : 
                  location.isPositive === false ? 'text-red-600' : 'text-muted-foreground'
                }`}>
                  {location.isPositive === true && <TrendingUp className="w-3 h-3 mr-1" />}
                  {location.isPositive === false && <TrendingDown className="w-3 h-3 mr-1" />}
                  {location.trend}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
