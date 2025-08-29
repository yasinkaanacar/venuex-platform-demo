import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Star, Image, Lightbulb } from 'lucide-react';
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
      case 'image_optimization':
        return Image;
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
      case 'image_optimization':
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
        type: 'location_extension',
        title: 'Add Missing Location Extensions',
        description: '12 locations missing address extensions. Adding these could increase local clicks by 15-25%.',
        impact: 'high',
        estimatedImprovement: '+18% local engagement'
      },
      {
        id: '2',
        type: 'hours_update',
        title: 'Optimize Store Hour Information',
        description: '5 locations have outdated holiday hours. Update to reduce customer confusion and missed visits.',
        impact: 'medium',
        estimatedImprovement: '+8% visit conversion'
      },
      {
        id: '3',
        type: 'image_optimization',
        title: 'Add Product Images to Shopping Ads',
        description: '47 products missing high-quality images. Visual ads typically see 23% higher CTR.',
        impact: 'high',
        estimatedImprovement: '+23% ad engagement'
      }
    ],
    meta: [
      {
        id: '4',
        type: 'location_extension',
        title: 'Update Business Categories',
        description: 'Optimize business categories for better local discovery on Facebook and Instagram.',
        impact: 'medium',
        estimatedImprovement: '+12% local reach'
      }
    ],
    tiktok: [
      {
        id: '5',
        type: 'image_optimization',
        title: 'Add Video Content for Ads',
        description: 'TikTok ads perform 40% better with native video content.',
        impact: 'high',
        estimatedImprovement: '+40% engagement rate'
      }
    ],
    apple: [
      {
        id: '6',
        type: 'hours_update',
        title: 'Verify Holiday Hours',
        description: 'Ensure Apple Maps has accurate holiday hours for all locations.',
        impact: 'low',
        estimatedImprovement: '+5% customer satisfaction'
      }
    ]
  };

  const activeSuggestions = suggestionsByPlatform[activeTab as keyof typeof suggestionsByPlatform] || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Data Enrichment Suggestions
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              AI-powered recommendations to improve performance
            </p>
          </div>
          
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <Lightbulb className="w-3 h-3 mr-1" />
            8 suggestions
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4" data-testid="tabs-enrichment-platforms">
            <TabsTrigger value="google" data-testid="tab-google">
              🟦 Google Ads
            </TabsTrigger>
            <TabsTrigger value="meta" data-testid="tab-meta">
              🔷 Meta Ads
            </TabsTrigger>
            <TabsTrigger value="tiktok" data-testid="tab-tiktok">
              ⚫ TikTok Ads
            </TabsTrigger>
            <TabsTrigger value="apple" data-testid="tab-apple">
              🔘 Apple Maps
            </TabsTrigger>
          </TabsList>
          
          {['google', 'meta', 'tiktok', 'apple'].map((platform) => (
            <TabsContent key={platform} value={platform} className="space-y-4 mt-6">
              {suggestionsByPlatform[platform as keyof typeof suggestionsByPlatform].map((suggestion) => {
                const IconComponent = getTypeIcon(suggestion.type);
                const iconBgClass = getTypeIconBg(suggestion.type);
                
                return (
                  <div 
                    key={suggestion.id}
                    className="flex items-start space-x-4 p-4 bg-muted/50 border border-border rounded-lg"
                    data-testid={`suggestion-${suggestion.id}`}
                  >
                    <div className={`w-8 h-8 ${iconBgClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{suggestion.title}</h4>
                        <Badge variant="outline" className={getImpactColor(suggestion.impact)}>
                          {suggestion.impact.charAt(0).toUpperCase() + suggestion.impact.slice(1)} Impact
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {suggestion.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Estimated improvement:</span> {suggestion.estimatedImprovement}
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => implementSuggestionMutation.mutate(suggestion.id)}
                          disabled={implementSuggestionMutation.isPending}
                          data-testid={`button-implement-${suggestion.id}`}
                        >
                          {implementSuggestionMutation.isPending ? 'Implementing...' : 'Implement'}
                        </Button>
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
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
