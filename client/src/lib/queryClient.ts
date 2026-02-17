import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { mockDataService } from './mockData';

// Mock API request function that simulates backend responses  
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Simulate the response structure but use mock data
  const response = await handleMockRequest(method, url, data);
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Handle mock requests based on URL patterns
async function handleMockRequest(method: string, url: string, data?: unknown) {
  if (url.includes('/api/overview')) {
    return await mockDataService.getOverviewData();
  }
  
  if (url.includes('/api/enrichment-suggestions')) {
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    const platformId = urlParams.get('platformId') || undefined;
    return await mockDataService.getEnrichmentSuggestions(platformId);
  }
  
  if (url.includes('/api/enrichment-suggestions/') && method.toUpperCase() === 'PATCH') {
    const id = url.split('/').pop();
    if (id && data) {
      return await mockDataService.updateEnrichmentSuggestion(id, data as any);
    }
  }
  
  if (url.includes('/api/alerts/') && method.toUpperCase() === 'DELETE') {
    const id = url.split('/').pop();
    if (id) {
      return await mockDataService.dismissAlert(id);
    }
  }
  
  // Segment endpoints (order matters — more specific first)
  if (url.includes('/api/segments/summary')) {
    return await mockDataService.getSegmentSummary();
  }
  if (url.includes('/api/segments/feed-labels')) {
    return await mockDataService.getFeedLabels();
  }
  if (url.includes('/api/segments/exports/scheduled')) {
    return await mockDataService.getScheduledExports();
  }
  if (url.includes('/api/segments/exports')) {
    return await mockDataService.getExports();
  }
  if (url.includes('/api/segments/push-log')) {
    return await mockDataService.getPushLog();
  }
  if (url.includes('/api/segments')) {
    return await mockDataService.getSegments();
  }

  // Default response for unhandled endpoints
  return { success: true };
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn = <T>(options: {
  on401: UnauthorizedBehavior;
}): QueryFunction<T> =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    
    // Use mock data instead of fetch
    const response = await handleMockRequest('GET', url);
    return response as T;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
