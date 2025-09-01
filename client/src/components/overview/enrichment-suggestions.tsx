import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Star, FileText, Lightbulb } from 'lucide-react';
import { EnrichmentSuggestion } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function EnrichmentSuggestions() {
  const [activeTab, setActiveTab] = useState('google');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: suggestions = [], isLoading } = useQuery<EnrichmentSuggestion[]>({
    queryKey: ['/api/enrichment-suggestions'],
  });

  const implementSuggestionMutation = useMutation({
    mutationFn: async (suggestionId: string) => {
      const response = await apiRequest('PATCH', `/api/enrichment-suggestions/${suggestionId}`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Suggestion implemented successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/enrichment-suggestions'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to implement suggestion",
        variant: "destructive",
      });
    }
  });

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-green-100 text-green-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'location_extension':
        return MapPin;
      case 'hours_update':
        return Star;
      case 'description_optimization':
        return FileText;
      default:
        return Lightbulb;
    }
  };

  const getTypeIconBg = (type: string) => {
    switch (type) {
      case 'location_extension':
        return 'bg-blue-600';
      case 'hours_update':
        return 'bg-green-600';
      case 'description_optimization':
        return 'bg-purple-600';
      default:
        return 'bg-orange-600';
    }
  };

  // Mock suggestions per platform for demonstration
  const suggestionsByPlatform = {
    google: [
      {
        id: '1',
        type: 'hours_update',
        title: 'Add missing business hours',
        description: '23 locations missing accurate operating hours. This can improve local search visibility by up to 15%.',
        impact: 'medium',
        estimatedImprovement: '+15%',
        itemsAffected: '23 items affected',
        timeToFix: '~2 hours to fix'
      },
      {
        id: '2',
        type: 'description_optimization',
        title: 'Optimize product descriptions',
        description: '89 products have incomplete or poorly optimized descriptions. Enhanced descriptions can improve conversion rates by 25%.',
        impact: 'high',
        estimatedImprovement: '+25%',
        itemsAffected: '89 items affected',
        timeToFix: '~6 hours to fix'
      },
      {
        id: '3',
        type: 'location_extension',
        title: 'Update location categories',
        description: '8 locations using outdated category classifications. Updated categories improve discovery and targeting accuracy.',
        impact: 'low',
        estimatedImprovement: '+8%',
        itemsAffected: '8 items affected',
        timeToFix: '~30 minutes to fix'
      }
    ],
    meta: [],
    tiktok: [],
    apple: [],
    yandex: []
  };

  const activeSuggestions = suggestionsByPlatform[activeTab as keyof typeof suggestionsByPlatform] || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Data Enrichment Suggestions
        </h3>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Lightbulb className="w-4 h-4 mr-2" />
          AI-Powered Recommendations
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-muted h-12" data-testid="tabs-enrichment-platforms">
          <TabsTrigger value="google" data-testid="tab-google" className="text-sm">
            Google
          </TabsTrigger>
          <TabsTrigger value="meta" data-testid="tab-meta" className="text-sm">
            Meta
          </TabsTrigger>
          <TabsTrigger value="tiktok" data-testid="tab-tiktok" className="text-sm">
            TikTok
          </TabsTrigger>
          <TabsTrigger value="apple" data-testid="tab-apple" className="text-sm">
            Apple Maps
          </TabsTrigger>
          <TabsTrigger value="yandex" data-testid="tab-yandex" className="text-sm">
            Yandex
          </TabsTrigger>
        </TabsList>
        
        {['google', 'meta', 'tiktok', 'apple', 'yandex'].map((platform) => (
          <TabsContent key={platform} value={platform} className="space-y-4 mt-6">
            {suggestionsByPlatform[platform as keyof typeof suggestionsByPlatform].map((suggestion) => {
              const IconComponent = getTypeIcon(suggestion.type);
              const iconBgClass = getTypeIconBg(suggestion.type);
              
              return (
                <div 
                  key={suggestion.id}
                  className="flex items-start space-x-4 p-4 bg-card border-2 border-border rounded-lg shadow-sm"
                  data-testid={`suggestion-${suggestion.id}`}
                >
                  <div className={`w-10 h-10 ${iconBgClass} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">{suggestion.title}</h4>
                          <span className="text-sm font-semibold text-green-600">{suggestion.estimatedImprovement}</span>
                          <Badge variant="outline" className={
                            suggestion.impact === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                            suggestion.impact === 'medium' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }>
                            {suggestion.impact.charAt(0).toUpperCase() + suggestion.impact.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {suggestion.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{suggestion.itemsAffected}</span>
                          <span>•</span>
                          <span>{suggestion.timeToFix}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-muted-foreground border-border hover:bg-muted/50"
                          data-testid={`button-dismiss-${suggestion.id}`}
                        >
                          Dismiss
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => implementSuggestionMutation.mutate(suggestion.id)}
                          disabled={implementSuggestionMutation.isPending}
                          data-testid={`button-implement-${suggestion.id}`}
                        >
                          {implementSuggestionMutation.isPending ? 'Applying...' : 'Apply Fix'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {suggestionsByPlatform[platform as keyof typeof suggestionsByPlatform].length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No suggestions available for this platform</p>
              </div>
            )}
            
            {/* Bottom Summary Section - only show for active Google tab with suggestions */}
            {platform === 'google' && suggestionsByPlatform[platform].length > 0 && (
              <div className="mt-6 pt-4 border-t-2 border-border flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  3 suggestions shown • Potential impact: <span className="font-medium">+48.0% overall performance</span>
                </div>
                <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">
                  View all suggestions
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
