import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { Chip } from '@mui/material';
import { MapPin, Star, FileText, Lightbulb, Info } from 'lucide-react';
import { EnrichmentSuggestion } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type DataQualityContext = 'dashboard' | 'locations';

interface EnrichmentSuggestionsProps {
  context?: DataQualityContext;
}

export default function EnrichmentSuggestions({ context = 'dashboard' }: EnrichmentSuggestionsProps) {
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

  // Dashboard-specific suggestions
  const dashboardSuggestions = [
    {
      id: '1',
      type: 'hours_update',
      title: 'Add missing business hours',
      description: '23 locations missing accurate operating hours. This can improve local search visibility by up to 15%.',
      impact: 'medium',
      estimatedImprovement: '+15%',
      itemsAffected: '23 items affected',
      timeToFix: '~2 hours to fix',
      buttonType: 'apply'
    },
    {
      id: '2',
      type: 'description_optimization',
      title: 'Optimize product descriptions',
      description: '89 products have incomplete or poorly optimized descriptions. Enhanced descriptions can improve conversion rates by 25%.',
      impact: 'high',
      estimatedImprovement: '+25%',
      itemsAffected: '89 items affected',
      timeToFix: '~6 hours to fix',
      buttonType: 'info'
    },
    {
      id: '3',
      type: 'location_extension',
      title: 'Update location categories',
      description: '8 locations using outdated category classifications. Updated categories improve discovery and targeting accuracy.',
      impact: 'low',
      estimatedImprovement: '+8%',
      itemsAffected: '8 items affected',
      timeToFix: '~30 minutes to fix',
      buttonType: 'apply'
    }
  ];

  // Locations-specific suggestions
  const locationsSuggestions = [
    {
      id: '4',
      type: 'location_extension',
      title: 'Update store hours for 15 locations',
      description: '15 locations have outdated or missing business hours. This affects local search performance and customer experience.',
      impact: 'high',
      estimatedImprovement: '+22%',
      itemsAffected: '15 locations affected',
      timeToFix: '~1 hour to fix',
      buttonType: 'apply'
    },
    {
      id: '5',
      type: 'hours_update',
      title: 'Add missing phone numbers',
      description: '7 locations are missing phone numbers. This reduces customer contact opportunities and local SEO effectiveness.',
      impact: 'medium',
      estimatedImprovement: '+12%',
      itemsAffected: '7 locations affected',
      timeToFix: '~45 minutes to fix',
      buttonType: 'apply'
    },
    {
      id: '6',
      type: 'description_optimization',
      title: 'Optimize location descriptions',
      description: '32 locations have generic or incomplete descriptions. Enhanced descriptions improve discovery and customer engagement.',
      impact: 'medium',
      estimatedImprovement: '+18%',
      itemsAffected: '32 locations affected',
      timeToFix: '~3 hours to fix',
      buttonType: 'info'
    }
  ];

  // Select suggestions based on context
  const allSuggestions = context === 'locations' ? locationsSuggestions : dashboardSuggestions;

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
      
      <div className="space-y-4 mt-6">
        {allSuggestions.map((suggestion) => {
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
                      <Chip variant="outlined" size="small" label={suggestion.impact.charAt(0).toUpperCase() + suggestion.impact.slice(1)} sx={{
                        backgroundColor: suggestion.impact === 'high' ? '#fef2f2' : suggestion.impact === 'medium' ? '#fff7ed' : '#f9fafb',
                        color: suggestion.impact === 'high' ? '#b91c1c' : suggestion.impact === 'medium' ? '#c2410c' : '#374151',
                        border: `1px solid ${suggestion.impact === 'high' ? '#fecaca' : suggestion.impact === 'medium' ? '#fed7aa' : '#e5e7eb'}`
                      }} />
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
                  
                  <div className="flex flex-col items-end gap-2 ml-4">
                    {suggestion.buttonType === 'apply' ? (
                      <Button 
                        size="small"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => implementSuggestionMutation.mutate(suggestion.id)}
                        disabled={implementSuggestionMutation.isPending}
                        data-testid={`button-implement-${suggestion.id}`}
                      >
                        {implementSuggestionMutation.isPending ? 'Applying...' : 'Apply Fix'}
                      </Button>
                    ) : (
                      <Button 
                        variant="outlined"
                        size="small"
                        className="text-muted-foreground border-border hover:bg-muted/50"
                        data-testid={`button-info-${suggestion.id}`}
                      >
                        <Info className="w-3 h-3 mr-1" />
                        More Information
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Bottom Summary Section */}
        <div className="mt-6 pt-4 border-t-2 border-border flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {context === 'locations' ? (
              <>3 suggestions shown • Potential impact: <span className="font-medium">+52.0% overall performance</span></>
            ) : (
              <>3 suggestions shown • Potential impact: <span className="font-medium">+48.0% overall performance</span></>
            )}
          </div>
          <Button variant="outlined" size="small" className="text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">
            View all suggestions
          </Button>
        </div>
      </div>
    </div>
  );
}
